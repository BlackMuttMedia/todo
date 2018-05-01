var shell = require("shelljs");

shell.exec("cd packages/api && yarn start", { async: true });
shell.exec("cd packages/app && yarn start", { async: true });

console.log("starting apps");
