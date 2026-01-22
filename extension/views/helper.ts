import type { Disposable, ExtensionContext, Webview } from 'vscode';
import { getWebviewHtml } from 'virtual:vscode';
import { window } from 'vscode';

export class WebviewHelper {
  public static setupHtml(webview: Webview, context: ExtensionContext) {
    return getWebviewHtml({
      serverUrl: process.env.VITE_DEV_SERVER_URL,
      webview,
      context,
    });
  }

  public static setupWebviewHooks(webview: Webview, disposables: Disposable[]) {
    webview.onDidReceiveMessage(
      (message: any) => {
        const type = message.type;
        const data = message.data;
        console.log(`type: ${type}`);
        switch (type) {
          case 'hello':
            window.showInformationMessage(data);
            break;
          case 'ai-query':
            // Process AI query and send response
            console.log(`AI Query: ${data}`);
            // Simulate AI response (in real implementation, you would call an AI service)
            const aiResponse = `This is a response from VS Code extension to: "${data}"`;
            webview.postMessage({
              type: 'ai-response',
              data: aiResponse
            });
            break;
        }
      },
      undefined,
      disposables,
    );
  }
}