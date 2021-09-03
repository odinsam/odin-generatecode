// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Dependency, DepNodeProvider } from './nodeDependencies';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const rootPath =
        vscode.workspace.workspaceFolders &&
        vscode.workspace.workspaceFolders.length > 0
            ? vscode.workspace.workspaceFolders[0].uri.fsPath
            : undefined;

    const nodeDependenciesProvider = new DepNodeProvider();
    vscode.window.registerTreeDataProvider(
        'nodeDependencies',
        nodeDependenciesProvider
    );

    // database-info 添加按钮
    vscode.commands.registerCommand('nodeDependencies.addEntry', () =>
        nodeDependenciesProvider.addPanel(context.extensionUri)
    );
    // database-info 刷新按钮
    vscode.commands.registerCommand('nodeDependencies.refreshEntry', () =>
        nodeDependenciesProvider.refresh()
    );
    // database-info 修改按钮
    vscode.commands.registerCommand(
        'nodeDependencies.editEntry',
        (node: Dependency) =>
            vscode.window.showInformationMessage(
                `Successfully called edit entry on ${node.label}.`
            )
    );
    // database-info 删除按钮
    vscode.commands.registerCommand(
        'nodeDependencies.deleteEntry',
        (node: Dependency) =>
            vscode.window.showInformationMessage(
                `Successfully called delete entry on ${node.label}.`
            )
    );
}

// this method is called when your extension is deactivated
export function deactivate() {}
