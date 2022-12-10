import { TextEncoder } from 'util';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext)
{
	let disposable = vscode.commands.registerCommand('create-react-component.createComponent', (folder: vscode.Uri) =>
	{
		if (!folder)
		{
			vscode.window.showInformationMessage("Can't create here");
			return
		}

		vscode.window.showInputBox({
			title: "Name of component",
			prompt: "Enter a name of the new component",
			ignoreFocusOut: true,
			placeHolder: "NewComponent",
		}).then(name =>
		{
			try {
				name = name || "NewComponent";
				name = name.replace(/ /g, "_");

				const wsedit = new vscode.WorkspaceEdit();
				const config = vscode.workspace.getConfiguration('create-react-component');

				const jsxName = config.get("jsxFileName", "index.jsx").replace(/\%name\%/g, name);
				const cssName = config.get("cssFileName", "styles.module.css").replace(/\%name\%/g, name);
				const jsx = config.get("jsxComponentContent", "").replace(/\%name\%/g, name);
				const css = config.get("cssComponentContent", "").replace(/\%name\%/g, name);

				const filePathjs = vscode.Uri.file(folder.path + `/${name}/` + jsxName);
				const filePathcss = vscode.Uri.file(folder.path + `/${name}/` + cssName);

				var enc = new TextEncoder();
				wsedit.createFile(filePathjs, { ignoreIfExists: true, contents: enc.encode(jsx) });
				wsedit.createFile(filePathcss, { ignoreIfExists: true, contents: enc.encode(css) });

				vscode.workspace.applyEdit(wsedit);

			} catch (e)
			{
				console.log(e);
			}
		});
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
