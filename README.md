# OpenAI C# XML Documentation Generator for VS Code

This VS Code extension uses the OpenAI Davinci Model to generate C# XML documentation. Simply select a code snippet and generate documentation using the context menu. 

**Key Features**
* Generate C# XML documentation with ease
* User-friendly context menu
* Integration with OpenAI API



![Demo][def]





**Usage**

To use this extension, set the `chatgpt-vscode-csharp.openaiApiKey` configuration to your OpenAI API Key.

If the API call returns a 401 error, regenerate a new API Key on the OpenAI website. Any errors from the OpenAI API calls will be logged in the console.


**Disclaimer**

This extension is a work in progress and was created as a weekend side project by the author. The author is a newbie to AI and this is his first VS Code extension, so there is room for improvement. The author hopes to find more free time in the future to add new features and improvements to the extension.


**Credits**

This extension was inspired by the following repo: https://github.com/mpociot/chatgpt-vscode. 

Information on using web views in VS Code extension development can be found here: https://github.com/microsoft/vscode-extension-samples/tree/main/webview-view-sample.


[def]: resources/animation.gif?raw=true "Demo"