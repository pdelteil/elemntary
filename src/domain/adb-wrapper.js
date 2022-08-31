const { spawn } = require("child_process");

class AdbWrapper {
  constructor(options) {}

  run(args) {
    return new Promise((resolve, reject) => {
      const command = `./contrib/adb/${process.platform}/adb`;

      if (process.platform == "win32") {
        command += ".exe";
      }

      console.log(
        "$ " + command + " " + args.map((v) => "'" + v + "'").join(" ")
      );

      const adb = spawn(command, args);

      let stdout = "";
      adb.stdout.on("data", (data) => {
        stdout += data;
      });

      let stderr = "";
      adb.stderr.on("data", (data) => {
        stderr += data;
      });

      adb.on("error", (err) => {
        console.log(err);
        reject(err);
      });

      adb.on("close", (code) => {
        if (code == 0) {
          console.log(stdout);
          resolve(stdout);
        } else {
          console.log(stderr);
          reject(stderr);
        }
      });
    });
  }
}

module.exports = AdbWrapper;
