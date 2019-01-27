const { app, BrowserWindow } = require('electron')
const isOnline = require('is-online')
const path = require('path')
const request = require('request')

app.setAppUserModelId('com.ASM.EczemaDetector')

var mainWindow

var URL = 'http://eczemadetector.duckdns.org'

var icon = path.join(__dirname, 'icons/Icon.png')
if (process.platform === 'darwin') {
    icon = path.join(__dirname, 'icons/Icon_osxTemplate.png')
}

app.on('ready', () => {

    mainWindow = new BrowserWindow(MainMenu)

    mainWindow.loadFile('./web/loading.html')
    mainWindow.maximize()
    mainWindow.show()
    
    isOnline().then(online => {
        if (online) { // Device is connected to the Internet
            request.get(URL, (err, res, body) => { 
                if (!err && (res.statusCode == 200 || res.statusCode == 301)) {

                    mainWindow.loadURL(URL)

                } else mainWindow.loadFile('./web/error.html')
            }).on('error', () => mainWindow.loadFile('./web/error.html'))

        } else mainWindow.loadFile('./web/noInternet.html')
    }).catch(err => mainWindow.loadFile('./web/noInternet.html'))

})

app.on('activate', () => {
    if (mainWindow === null) createWindow()
})

app.on('before-quit', () => reallyQuit = true)

/*
 __  __ _____ _   _ _   _ ____  
|  \/  | ____| \ | | | | / ___| 
| |\/| |  _| |  \| | | | \___ \ 
| |  | | |___| |\  | |_| |___) |
|_|  |_|_____|_| \_|\___/|____/ 

*/

const MainMenu = {
    width: 1280, height: 720,
    minWidth: 800, minHeight: 600,
    icon: icon,

    title: 'Eczema Detector',
    show: false,

    'Content-Security-Policy': 'script-src self ' + URL,
    webPreferences: {
        nodeIntegration: false,
        preload: path.join(__dirname, 'preload.js')
    }
}
