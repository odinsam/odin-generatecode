// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = acquireVsCodeApi();

    const oldState =
        /** @type {{ connectName: string},{ host: string},{ port: number},{ username: string},{ pwd: string},{ database: string}} */ (
            vscode.getState()
        );
    const labelInfo = /** @type {HTMLElement} */ (
        document.getElementById('label-info')
    );
    const txtHost = /** @type {HTMLElement} */ (
        document.getElementById('txt-host')
    );
    const txtPort = /** @type {HTMLElement} */ (
        document.getElementById('txt-port')
    );
    const txtUserName = /** @type {HTMLElement} */ (
        document.getElementById('txt-username')
    );
    const txtPwd = /** @type {HTMLElement} */ (
        document.getElementById('txt-pwd')
    );
    const txtDatabase = /** @type {HTMLElement} */ (
        document.getElementById('txt-database')
    );
    const txtConnectionName = /** @type {HTMLElement} */ (
        document.getElementById('txt-connectionname')
    );
    document
        .querySelector('.connection-button')
        .addEventListener('click', (e) => {
            connectionDataBase(e);
        });

    function connectionDataBase() {
        if (!txtConnectionName.value) {
            labelInfo.innerText = '连接名称 不能为空';
            return;
        }
        vscode.setState({ connectName: txtConnectionName.value });
        if (!txtHost.value) {
            labelInfo.innerText = 'Host 不能为空';
            return;
        }
        vscode.setState({ host: txtHost.value });
        if (!txtPort.value) {
            labelInfo.innerText = 'Port 不能为空';
            return;
        }
        vscode.setState({ port: parseInt(txtPort.value) });
        if (!txtUserName.value) {
            labelInfo.innerText = 'UserName 不能为空';
            return;
        }
        vscode.setState({ username: txtUserName.value });
        if (!txtPwd.value) {
            labelInfo.innerText = 'Pwd 不能为空';
            return;
        }
        vscode.setState({ pwd: txtPwd.value });
        vscode.setState({ database: txtDatabase.value });
        labelInfo.innerText = '';
        vscode.postMessage({
            command: 'alert',
            text: '🐛  on line ' + oldState.connectName
        });
    }

    // Handle messages sent from the extension to the webview
    window.addEventListener('message', (event) => {
        const message = event.data; // The json data that the extension sent
    });
})();
