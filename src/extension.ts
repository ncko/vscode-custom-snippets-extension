import * as vscode from "vscode";
import fileToStub from "./fileToStub";
import selectionToStub from "./selectionToStub";
import stubToSnippet from "./stubToSnippet";
import snippetToStub from "./snippetToStub";
import removeSnippet from "./removeSnippet";

export function activate(context: vscode.ExtensionContext) {
  const { subscriptions } = context;
  const { registerCommand } = vscode.commands;

  /**
   * Stub From File
   */
  const fileToStubCommand = registerCommand(
    "extension.fileToStub",
    fileToStub
  );
  subscriptions.push(fileToStubCommand);

  /**
   * Stub From Selection
   */
  const selectionToStubCommand = registerCommand(
    "extension.selectionToStub",
    selectionToStub
  );
  subscriptions.push(selectionToStubCommand);

  /**
   * Stub To Snippet
   */
  const stubToSnippetCommand = registerCommand(
    "extension.stubToSnippet",
    stubToSnippet
  );
  subscriptions.push(stubToSnippetCommand);

  /**
   * Snippet To Stub
   */
  const snippetToStubCommand = registerCommand(
    "extension.snippetToStub",
    snippetToStub
  );
  subscriptions.push(snippetToStubCommand);

  /**
   *  Remove Snippet
   */
  const removeSnippetCommand = registerCommand(
    "extension.removeSnippet",
    removeSnippet
  );
  subscriptions.push(removeSnippetCommand);
}

export function deactivate() {}
