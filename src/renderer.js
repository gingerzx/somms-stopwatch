const { ipcRenderer } = require('electron');


const contextMenu = document.createElement('div');
contextMenu.id = 'custom-context-menu';
contextMenu.innerHTML = `<div class="menu-item">Secret</div>`;
document.body.appendChild(contextMenu);

contextMenu.style.display = 'none';
contextMenu.style.position = 'absolute';

ipcRenderer.on('show-custom-menu', (event, x, y) => {
    
    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;
    contextMenu.style.display = 'block';
});

window.addEventListener('click', () => {
    contextMenu.style.display = 'none'; 
});


document.querySelector('.menu-item').addEventListener('click', () => {
    window.location.href = 'secret.html';
});


const backButton = document.getElementById('backButton');
if (backButton) {
    backButton.addEventListener('click', () => {
        ipcRenderer.send('go-back');  
    });
};
