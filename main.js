const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron');
const resizeImg = require('resize-img');
const path = require('path');
const os = require('os');
const fs = require('fs');

const isMac = process.platform === 'darwin';

let mainWindow;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: 'ImageScalePro',
        width: 710,
        height: 710,
        webPreferences: {
            contextIsolation: true,
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

    // Remove mainWindow from memory when closing
    mainWindow.on('close', ()=> (mainWindow = null));

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

ipcMain.on('image:resize', (e, options) => {
    options.dest = path.join(os.homedir()+'\\ImageScalePro');
    resizeImage(options);
})

async function resizeImage({imgPath, width, height, dest }) {
    try {
        const image = await resizeImg(fs.readFileSync(imgPath), {
            width: +width,
            height: +height
        });
        
        const filename = 'ImageScalePro_' + path.basename(imgPath);

        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest);
        }

        fs.writeFileSync(path.join(dest, filename), image);

        mainWindow.send("image:done");

        shell.openPath(dest);
        


    } catch (error) {
        console.log(error);
    }

}

const menu = [
    {
        role: 'fileMenu'
    }
]