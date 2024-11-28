/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */
const { ipcRenderer } = require('electron');
const $ = require('jquery');


$(()=>{
    addWindowButtons();
    windowBindings();
});

function addWindowButtons(){
    $('body').prepend(`
        <div class="position-fixed top-0 end-0 bg-dark" style="z-index:999999;">
            <div class="float-end px-3 py-2 no-grow Win-btn" id="closeBtn"><i class="fa-solid fa-x"></i></div>
            <div class="float-end px-3 py-2 no-grow Win-btn" id="maximizeBtn"><i class="fa-regular fa-square"></i></div>
            <div class="float-end px-3 py-2 no-grow Win-btn" id="minimizeBtn"><i class="fa-solid fa-minus"></i></div>
        </div>    
    `);
}
function windowBindings(){
    $('#minimizeBtn').on('click', ()=> {
        ipcRenderer.send('minimize-window');
    });

    $('#maximizeBtn').on('click', ()=> {
        ipcRenderer.send('maximize-window');
    });

    $('#closeBtn').on('click', ()=> {
        ipcRenderer.send('close-window');
    });
}