const { ipcRenderer } = require('electron');
const $ = require('jquery');


$(()=>{
    console.log(navigator.onLine);
    if (!isWindows()){
        $('body').css('cursor', 'none');
    } else {

        // addWindowButtons();
        // windowBindings();
    }
});

function isWindows() {
    // Internet Explorer 11+
    if (navigator.userAgent.match(/Trident\/7\./)) return true;
    
    // Microsoft Edge
    if (navigator.userAgent.match(/Edge\/(\d+)/)) return true;
    
    // Other browsers
    if (/Windows.*?NT/.test(navigator.userAgent)) return true;
    
    // Fallback: Check for Windows-specific features
    try {
        return window.navigator.msMaxTouchPoints > 0;
    } catch (e) {
        return false;
    }
}

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