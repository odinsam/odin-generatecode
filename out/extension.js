"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const nodeDependencies_1 = require("./nodeDependencies");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    const rootPath = vscode.workspace.workspaceFolders &&
        vscode.workspace.workspaceFolders.length > 0
        ? vscode.workspace.workspaceFolders[0].uri.fsPath
        : undefined;
    const nodeDependenciesProvider = new nodeDependencies_1.DepNodeProvider();
    vscode.window.registerTreeDataProvider('nodeDependencies', nodeDependenciesProvider);
    // database-info 添加按钮
    vscode.commands.registerCommand('nodeDependencies.addEntry', () => nodeDependenciesProvider.addPanel(context.extensionUri));
    // database-info 刷新按钮
    vscode.commands.registerCommand('nodeDependencies.refreshEntry', () => nodeDependenciesProvider.refresh());
    // database-info 修改按钮
    vscode.commands.registerCommand('nodeDependencies.editEntry', (node) => vscode.window.showInformationMessage(`Successfully called edit entry on ${node.label}.`));
    // database-info 删除按钮
    vscode.commands.registerCommand('nodeDependencies.deleteEntry', (node) => vscode.window.showInformationMessage(`Successfully called delete entry on ${node.label}.`));
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map