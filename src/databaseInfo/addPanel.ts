import * as vscode from 'vscode';
const cats = {
    'Coding Cat': 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif',
    'Compiling Cat': 'https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif',
    'Testing Cat': 'https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif'
};
export class AddPanel {
    /**
     * Track the currently panel. Only allow a single panel to exist at a time.
     */
    public static currentPanel: AddPanel | undefined;

    public static readonly viewType = 'AddPanel';

    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];

    public static createOrShow(extensionUri: vscode.Uri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        // If we already have a panel, show it.
        if (AddPanel.currentPanel) {
            AddPanel.currentPanel._panel.reveal(column);
            return;
        }

        // Otherwise, create a new panel.
        const panel = vscode.window.createWebviewPanel(
            AddPanel.viewType,
            'Connection Database',
            column || vscode.ViewColumn.One,
            getWebviewOptions(extensionUri)
        );
        AddPanel.currentPanel = new AddPanel(panel, extensionUri);
    }

    public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        AddPanel.currentPanel = new AddPanel(panel, extensionUri);
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this._panel = panel;
        this._extensionUri = extensionUri;

        // Set the webview's initial html content
        this._update();

        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programmatically
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        // Update the content based on view changes
        this._panel.onDidChangeViewState(
            (e) => {
                if (this._panel.visible) {
                    this._update();
                }
            },
            null,
            this._disposables
        );

        // Handle messages from the webview
        this._panel.webview.onDidReceiveMessage(
            (message) => {
                switch (message.command) {
                    case 'alert':
                        vscode.window.showErrorMessage(message.text);
                        return;
                }
            },
            null,
            this._disposables
        );
    }

    public doRefactor() {
        // Send a message to the webview webview.
        // You can send any JSON serializable data.
        this._panel.webview.postMessage({ command: 'refactor' });
    }

    public dispose() {
        AddPanel.currentPanel = undefined;

        // Clean up our resources
        this._panel.dispose();

        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    private _update() {
        const webview = this._panel.webview;

        // Vary the webview's content based on where it is located in the editor.
        switch (this._panel.viewColumn) {
            case vscode.ViewColumn.Two:
                this._updateForCat(webview);
                return;

            case vscode.ViewColumn.Three:
                this._updateForCat(webview);
                return;

            case vscode.ViewColumn.One:
            default:
                this._updateForCat(webview);
                return;
        }
    }

    private _updateForCat(webview: vscode.Webview) {
        this._panel.title = 'connection database';
        this._panel.webview.html = this._getHtmlForWebview(webview);
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        // Local path to main script run in the webview
        const scriptPathOnDisk = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js')
        );

        // Local path to css styles
        const styleResetUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css')
        );
        // const stylesVscodePath = webview.asWebviewUri(
        //     vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css')
        // );
        const styleMainUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'media', 'main.css')
        );

        // Use a nonce to only allow specific scripts to be run
        const nonce = getNonce();

        return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">

				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">

				<meta name="viewport" content="width=device-width, initial-scale=1.0">

				<link href="${styleResetUri}" rel="stylesheet">
				
				<link href="${styleMainUri}" rel="stylesheet">
				<title>Connection DataBase</title>
			</head>
			<body>
				<h1>Connect to Database Server</h1>
				<div class="panel-div">
					<label class="input-label">Connection Name: </label>
					<input id="txt-connectionname" class="input-text" type="text" placeholder="请输入连接名称" />
				</div>
				<div class="panel-div">
					<label class="input-label">Data Base Type: </label>
					<div>
						<input type="radio" ><label>mysql</label>
						<input type="radio" ><label>sql server</label>
					</div>
				</div>
				<div class="panel-div">
					<div class="panel-div-block"><label class="input-label"><span style="color:red;">*</span> Host: </label><input  class="input-text"/><div>
					<div class="panel-div-block"><label class="input-label"><span style="color:red;">*</span> Port: </label><input  class="input-text"/><div></div>
				</div>
				<div class="panel-div">
				<div class="panel-div-block"><label class="input-label"><span style="color:red;">*</span> Username: </label><input  class="input-text"/>
				<div class="panel-div-block"><label class="input-label"><span style="color:red;">*</span> Password: </label><input  class="input-text"/></div>
				</div>
				<div class="panel-div">
				<div class="panel-div-block"><label class="input-label"><span style="color:red;">*</span> Databases: </label><input  class="input-text"/></div>
				</div>
				<div class="panel-div">
					<button class="connection-button">Connect</button>
					<button>Close</button>
				</div>
				<script nonce="${nonce}" src="${scriptPathOnDisk}"></script>
			</body>
			</html>`;
    }
}
function getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
    return {
        // Enable javascript in the webview
        enableScripts: true,

        // And restrict the webview to only loading content from our extension's `media` directory.
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
    };
}
function getNonce() {
    let text = '';
    const possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
