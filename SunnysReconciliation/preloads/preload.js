//ref: https://stackoverflow.com/questions/39880979/electron-how-to-load-a-html-file-into-the-current-window
const { remote } = require("electron");
const mainProcess = remote.require("./index");

window.switchPage = mainProcess.switchPage;
