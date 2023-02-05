/* eslint-disable @typescript-eslint/naming-convention */
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { Configuration, OpenAIApi } from 'openai';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

	const provider = new OpenAIViewProvider(context.extensionUri);
	const config = vscode.workspace.getConfiguration('chatgpt-vscode-csharp');
	const openaiApiKey = config.get('openaiApiKey') as string | undefined;

	provider.setOpenAIClient(openaiApiKey);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(OpenAIViewProvider.viewType, provider));

	const commandShowSummary = vscode.commands.registerCommand('chatgpt-vscode-csharp.showSummary', async () => {
		var editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}

		var selection = editor.selection;
		var text = editor.document.getText(selection);
		await provider.showSummary(text);
	});

	context.subscriptions.push(commandShowSummary);

	vscode.workspace.onDidChangeConfiguration((event: vscode.ConfigurationChangeEvent) => {
		if (event.affectsConfiguration('chatgpt-vscode-csharp.openaiApiKey')) {
			const config = vscode.workspace.getConfiguration('chatgpt-vscode-csharp');

			const openaiApiKey = config.get('openaiApiKey') as string | undefined;

			provider.setOpenAIClient(openaiApiKey);
		}
	});
}

class OpenAIViewProvider implements vscode.WebviewViewProvider {

	public static readonly viewType = 'code.summary';

	private _view?: vscode.WebviewView;

	private openaiClient: OpenAIApi;
	private openaiApiKey: string;

	constructor(
		private readonly _extensionUri: vscode.Uri,
	) { }

	public setOpenAIClient(openaiApiKey: string) {
		if (!openaiApiKey) {
			console.warn("openaiApiKey is not set, please set your Open AI API Key in extension Settings.");
		}
		else {
			if (openaiApiKey !== this.openaiApiKey) {
				this.openaiApiKey = openaiApiKey;
				const configuration = new Configuration({
					apiKey: openaiApiKey,
				});

				this.openaiClient = new OpenAIApi(configuration);
			}
		}
	}

	public resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken,
	): void {
		this._view = webviewView;

		webviewView.webview.options = {
			enableScripts: true,

			localResourceRoots: [
				this._extensionUri
			]
		};

		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
	}

	private clearSummary() {
		if (this._view && this._view.visible) {
			this._view.webview.postMessage({ type: 'addSummary', text: "" });
		}
	}

	public async showSummary(text: string) {

		if (!this.openaiClient) {
			console.error("openaiClient is not set");
			return;
		}

		const promptPrefix = `Please provide C# XML summary documentation for the following code snippet. No need to show the code snippet in th result.`;

		const prompt = `${promptPrefix} ${text}`;

		await vscode.commands.executeCommand('workbench.view.extension.csharp-chatView');

		this.clearSummary();

		vscode.window.withProgress({ location: { viewId: "code.summary" } },
			async () => {
				try {
					if (!this._view) {
						await vscode.commands.executeCommand('code.summary.focus');
					}
					const completion = await this.openaiClient.createCompletion({
						model: "text-davinci-003",
						prompt: prompt,
						max_tokens: 200
					});

					if (this._view) {
						this._view.show?.(true);
						this._view.webview.postMessage({ type: 'addSummary', text: completion.data.choices[0].text });
					}
				}
				catch (ex) {
					console.error(ex);
				}
			});
	};

	private _getHtmlForWebview(webview: vscode.Webview) {

		// Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js'));

		// Do the same for the stylesheet.
		const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css'));
		const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css'));
		const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.css'));
		const nonce = getNonce();

		return `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<!--
				Use a content security policy to only allow loading styles from our extension directory,
				and only allow scripts that have a specific nonce.
				(See the 'webview-sample' extension sample for img-src content security policy examples)
			-->
			<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<link href="${styleResetUri}" rel="stylesheet">
			<link href="${styleVSCodeUri}" rel="stylesheet">
			<link href="${styleMainUri}" rel="stylesheet">
			<title>C# Helpers</title>
		</head>
		<body>
			<pre>
				<div id="summary" class="summary"/>
			</pre>
			<script nonce="${nonce}" src="${scriptUri}"></script>
		</body>
		</html>`;
	}
}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}