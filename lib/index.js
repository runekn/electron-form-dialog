const electron = require('electron');

const BrowserWindow = electron.BrowserWindow || electron.remote.BrowserWindow;
const ipcMain = electron.ipcMain || electron.remote.ipcMain;
const url = require('url');
const path = require('path');

const DEFAULT_WIDTH = 370;
const DEFAULT_HEIGHT = 160;

function electronDialog(contentOptions, windowOptions) {
	if (typeof contentOptions.form !== "string") {
		return new Error('"container" must be html string');
	}

	return new Promise((resolve, reject) => {
		const id = `${new Date().getTime()}-${Math.random()}`;

		const contentOptions_ = Object.assign(
			{
				description: 'Please fill this form',
				form: null,
				buttonLabels: null,
				descriptionIsHtml: false,
				customStylesheet: null,
			},
			contentOptions || {}
		);

		const windowOptions_ = Object.assign(
			{
				width: DEFAULT_WIDTH,
				height: DEFAULT_HEIGHT,
				minWidth: DEFAULT_WIDTH,
				minHeight: DEFAULT_HEIGHT,
				resizable: true,
				useContentSize: true,
				title: 'Dialog',
				alwaysOnTop: false,
				icon: null,
				menuBarVisible: false,
				skipTaskbar: true,
				parentWindow: null
			},
			windowOptions || {}
		);

		let dialogWindow = new BrowserWindow({
			width: windowOptions_.width,
			height: windowOptions_.height,
			minWidth: windowOptions_.minWidth,
			minHeight: windowOptions_.minHeight,
			resizable: windowOptions_.resizable,
			minimizable: false,
			fullscreenable: false,
			maximizable: false,
			parent: windowOptions_.parentWindow,
			skipTaskbar: windowOptions_.skipTaskbar,
			alwaysOnTop: windowOptions_.alwaysOnTop,
			useContentSize: windowOptions_.useContentSize,
			modal: Boolean(windowOptions_.parentWindow),
			title: windowOptions_.title,
			icon: windowOptions_.icon || undefined,
			webPreferences: {
				nodeIntegration: true
			}
		});

		dialogWindow.setMenu(null);
		dialogWindow.setMenuBarVisibility(windowOptions_.menuBarVisible);

		const getOptionsListener = event => {
			event.returnValue = JSON.stringify(contentOptions_);
		};

		const cleanup = () => {
			if (dialogWindow) {
				dialogWindow.close();
				dialogWindow = null;
			}
		};

		const postDataListener = (event, value) => {
			value = JSON.parse(value);
			resolve(value);
			event.returnValue = null;
			cleanup();
		};

		const unresponsiveListener = () => {
			reject(new Error('Window was unresponsive'));
			cleanup();
		};

		const errorListener = (event, message) => {
			reject(new Error(message));
			event.returnValue = null;
			cleanup();
		};

		ipcMain.on('dialog-get-options:' + id, getOptionsListener);
		ipcMain.on('dialog-post-data:' + id, postDataListener);
		ipcMain.on('dialog-error:' + id, errorListener);
		dialogWindow.on('unresponsive', unresponsiveListener);

		dialogWindow.on('closed', () => {
			ipcMain.removeListener('dialog-get-options:' + id, getOptionsListener);
			ipcMain.removeListener('dialog-post-data:' + id, postDataListener);
			ipcMain.removeListener('dialog-error:' + id, postDataListener);
			resolve(null);
		});

		const dialogUrl = url.format({
			protocol: 'file',
			slashes: true,
			pathname: path.join(__dirname, 'page', 'dialog.html'),
			hash: id
		});

		dialogWindow.loadURL(dialogUrl);
	});
}

module.exports = electronDialog;
