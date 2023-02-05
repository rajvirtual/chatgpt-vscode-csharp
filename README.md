# Open AI VS Code Extension to generate C# XML Documentation. 

This VS Code leverages Open AI Davinci Model to generate C# XML Documentation.  

**Features**

C# Developers can select code snippets and `Generate C# XML Documentation` by using the context menu.



![Demo][def]





**Note From Author**: I created this extension as a fun weekend side project and its work in progress. As this is my first VS Code extension and a newbie to AI, there is much room for improvement. Hoping to find more free time during weekends to add more features/improvements to this extension.
  

**Configuring the extension**

*  `chatgpt-vscode-csharp.openaiApiKey`: Set your API Key obtained from openai.com website.


**Note:**

If the call to Open AI throws a 401, then regenerate a new API Key in Open AI website. Any errors from the open ai calls
are logged in the console.


**Credits**

This extension is inspired by https://github.com/mpociot/chatgpt-vscode


How to use Web View in VS Code extension development : https://github.com/microsoft/vscode-extension-samples/tree/main/webview-view-sample


[def]: resources/animation.gif?raw=true "Demo"