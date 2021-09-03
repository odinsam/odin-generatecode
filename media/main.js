// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = acquireVsCodeApi();

    const oldState = /** @type {{ connectName: string}} */ (vscode.getState());
    const txtConnectionName = /** @type {HTMLElement} */ (
        document.getElementById('txt-connectionname')
    );
    document
        .querySelector('.connection-button')
        .addEventListener('click', (e) => {
            connectionDataBase(e);
        });

    function connectionDataBase() {
        vscode.postMessage({
            command: 'alert',
            text: '🐛  on line ' + txtConnectionName.value
        });
    }

    // Handle messages sent from the extension to the webview
    window.addEventListener('message', (event) => {
        const message = event.data; // The json data that the extension sent
    });
})();
