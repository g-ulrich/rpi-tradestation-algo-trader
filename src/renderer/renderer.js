const { ipcRenderer } = require('electron');
const $ = require('jquery');


$(()=>{
    // $('body').css('cursor', 'none');
    // addWindowButtons();
    // windowBindings();
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