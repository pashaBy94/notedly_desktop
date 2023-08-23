const { app, BrowserWindow } = require('electron');
const { is, setContentSecurityPolicy } = require('electron-util');
const config = require('./config');
let window;

function windowApp(){
    window = new BrowserWindow({
    backgroundColor: 'gray',
    width: 600,
    height: 500,
    
    webPreferences:{
        nodeIntegration: true,
        // contextIsolation: false,
        // nodeIntegration: true,
        // nodeIntegrationInWorker: true
    },
});
if(is.development){
    window.loadURL(config.LOCAL_WEB_URL);
} else{
    window.loadURL(config.PRODUCTION_WEB_URL);
}
window.on('closed', ()=>{window = null})
if(is.development){
    window.webContents.openDevTools();
}
if(!is.development){
setContentSecurityPolicy(`
default-src 'none';
script-src 'self';
img-src 'self' https://www.gravatar.com;
style-src 'self' 'unsafe-inline';
font-src 'self'
connect-src 'self' ${config.PRODUCTION_API_URL};
base-uri 'none';
form-action 'none';
frame-ancestors 'none'
`)
}
}

app.on('ready', windowApp);

app.on('window-all-closed', ()=>{
    if(process.platform !== 'darwin'){
        app.quit();
    }
});

app.on('activate', ()=>{
    if(window === null){
        windowApp();
    }
});