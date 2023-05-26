const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

const isMac = process.platform === 'darwin';


function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: 'ImageScalePro',
        width: 710,
        height: 710,
        webPreferences: {
            contextIsolation: true ,
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });
    //Show dev tools in in development
    if (process.env.NODE_ENV !== 'production') {
        mainWindow.webContents.openDevTools();
    }
    mainWindow.loadFile(path.join(__dirname, './app/index.html'));
}


app.whenReady().then(() => {
    createMainWindow();

    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow()
        }
    })
});


app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit()
    }
})



const menu = [
    {
        role: 'fileMenu'
    }
]