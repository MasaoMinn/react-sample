import type { ExtensionContext, WebviewView } from 'vscode';
import { window, ViewColumn } from 'vscode';
import { MainPanel } from './views/panel';

export function activate(context: ExtensionContext) {
  // Register webview view provider
  context.subscriptions.push(
    window.registerWebviewViewProvider('hello-world.webview', {
      resolveWebviewView(webviewView: WebviewView) {
        // Set up the webview view
        webviewView.webview.options = {
          enableScripts: true,
        };

        // Create or update the MainPanel using the static render method
        MainPanel.render(context);
      }
    })
  );
}

export function deactivate() { }