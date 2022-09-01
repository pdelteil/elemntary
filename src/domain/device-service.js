const extract = require("extract-zip");
const process = require("process");
const fs = require("fs");
const AdbWrapper = require("./adb-wrapper.js");
const Feature = require("./feature.js");
const Features = require("./features.js");
const Device = require("./device.js");

class DeviceService {
  constructor(options) {
    this.adb = options.adbWrapper || new AdbWrapper();
  }

  listDevices() {
    return this.adb.run(["devices", "-l"]).then((stdout) => {
      let devices = stdout
        .toString()
        .split(/\r?\n/)
        .filter((v, i) => {
          return /authorized/.test(v) || (/device/.test(v) && /ELEMNT/.test(v));
        })
        .map((v) => {
          let id = "";

          v.replace(/(^[^\s]+)\s+/, function ($0, $1) {
            id = $1;
          });

          let model = "UNKNOWN";

          if (/unauthorized/.test(v)) {
            return new Device(id, model, false);
          }

          v.replace(/model:(ELEMNT.*?)\s+/, function ($0, $1) {
            model = $1.replace(/_/, " ");
          });

          // Old ELEMNT
          if (model == "ELEMNT" && /product:elemnt_v2/.test(v)) model += " V2";

          // Fix versioning
          model = model.replace(/BOLT2/, "BOLT V2");

          return new Device(id, model, true);
        });

      let authorized = devices.filter((d) => d.isAuthorized());
      let notAuthorized = devices.filter((d) => !d.isAuthorized());

      return [...authorized, ...notAuthorized];
    });
  }

  getFeatures(deviceId) {
    return this.adb
      .run(["-s", deviceId, "shell", "ls", "/sdcard/"])
      .then((stdout) => {
        let files = stdout
          .toString()
          .split(/\r?\n/)
          .filter((v, i) => {
            return /^cfg_/i.test(v);
          });

        let features = [];

        Object.keys(Features).forEach((key) => {
          let enabled = false;
          if (files.includes(Features[key])) {
            enabled = true;
          }

          features.push(new Feature(Features[key], key, enabled));
        });

        return features;
      });
  }

  enableFeature(deviceId, feature) {
    return this.adb.run([
      "-s",
      deviceId,
      "shell",
      "touch",
      `/sdcard/${feature}`,
    ]);
  }

  disableFeature(deviceId, feature) {
    return this.adb.run(["-s", deviceId, "shell", "rm", `/sdcard/${feature}`]);
  }

  copyMap(deviceId, mapFile) {
    return new Promise((resolve, reject) => {
      fs.stat(mapFile, function (err, stat) {
        if (err == null) {
          resolve({ path: mapFile, stat: stat });
        } else if (err.code === "ENOENT") {
          reject("Cannot read file");
        } else {
          reject("Cannot read file");
        }
      });
    })
      .then((fileData) => {
        let mapFile = fileData.path;
        let stat = fileData.stat;

        return new Promise((resolve, reject) => {
          if (stat.isFile()) {
            let basename = mapFile
              .split(/[\\/]/)
              .pop()
              .replace(/\.zip$/, "");
            let mapDir = process.cwd() + "/tmp";

            extract(mapFile, { dir: mapDir })
              .then(() => {
                resolve(mapDir + "/" + basename);
              })
              .catch((err) => {
                reject(`Can't unzip file: ${err}`);
              });
          } else if (stat.isDirectory()) {
            resolve(mapFile);
          } else {
            reject("Unknown file");
          }
        });
      })
      .then((mapDir) => {
        return this.adb.run([
          "-s",
          deviceId,
          "push",
          mapDir,
          `/sdcard/maps/tiles/8/`,
        ]);
      })
      .then(() => {
        this.clearCache(deviceId);
      });
  }

  clearCache(deviceId) {
    return Promise.all([
      this.adb.run([
        "-s",
        deviceId,
        "shell",
        "am",
        "broadcast",
        "-a",
        "com.wahoofitness.bolt.service.BMapManager.PURGE",
      ]),
      this.adb.run([
        "-s",
        deviceId,
        "shell",
        "am",
        "broadcast",
        "-a",
        "com.wahoofitness.bolt.service.BMapManager.RELOAD_MAP",
      ]),
    ]);
  }

  takeScreenshot(deviceId) {
    return this.adb
      .run(["-s", deviceId, "exec-out", "screencap", "-p"])
      .then((stdout) => {
        return stdout.toString("base64");
      });
  }
}

module.exports = DeviceService;
