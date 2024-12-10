const { ipcRenderer } = require('electron');

// Create custom context menu (hidden initially)
const contextMenu = document.createElement('div');
contextMenu.id = 'custom-context-menu';
contextMenu.innerHTML = `<div class="menu-item">Secret</div>`;
document.body.appendChild(contextMenu);

// Initially hide the context menu
contextMenu.style.display = 'none';
contextMenu.style.position = 'absolute';
// Listen for the 'show-custom-menu' event from the main process
ipcRenderer.on('show-custom-menu', (event, x, y) => {
    // Set the menu's position to where the user clicked
    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;

    // Show the menu at the calculated position
    contextMenu.style.display = 'block';
});

// Hide the custom context menu when clicking anywhere else on the page
window.addEventListener('click', () => {
    contextMenu.style.display = 'none'; // Hide the menu
});

// Handle the "Secret" menu item click
document.querySelector('.menu-item').addEventListener('click', () => {
    window.location.href = 'secret.html';  // Navigate to the secret page
});

// Go back to index.html from secret page (already handled by the back button)
const backButton = document.getElementById('backButton');
if (backButton) {
    backButton.addEventListener('click', () => {
        ipcRenderer.send('go-back');  // Send 'go-back' event to main process
    });
};
