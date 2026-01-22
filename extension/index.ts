import type { ExtensionContext, TreeDataProvider } from 'vscode';
import { commands, window, TreeItem, EventEmitter } from 'vscode';
import { MainPanel } from './views/panel';

class HelloWorldProvider implements TreeDataProvider<HelloWorldItem> {
  private _onDidChangeTreeData = new EventEmitter<HelloWorldItem | undefined>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  getTreeItem(element: HelloWorldItem): TreeItem {
    return element;
  }

  getChildren(element?: HelloWorldItem): Thenable<HelloWorldItem[]> {
    if (!element) {
      return Promise.resolve([
        new HelloWorldItem('Open Panel', 'Click to open the Hello World panel')
      ]);
    }
    return Promise.resolve([]);
  }
}

class HelloWorldItem extends TreeItem {
  constructor(label: string, tooltip: string) {
    super(label);
    this.tooltip = tooltip;
    this.command = {
      command: 'hello-world.showHelloWorld',
      title: label,
      arguments: []
    };
  }
}

export function activate(context: ExtensionContext) {
  // Register the tree data provider
  // const helloWorldProvider = new HelloWorldProvider();
  // window.registerTreeDataProvider('helloWorldView', helloWorldProvider);
  MainPanel.render(context);
  // Add command to the extension context
  // context.subscriptions.push(
  //   commands.registerCommand('hello-world.showHelloWorld', async () => {
  //     MainPanel.render(context);
  //   }),
  // );
}

export function deactivate() { }
