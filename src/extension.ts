import * as vscode from "vscode";
import stubFromFile from "./stubFromFile";
import stubFromSelection from "./stubFromSelection";
import stubToSnippet from "./stubToSnippet";
import snippetToStub from "./snippetToStub";
import removeSnippet from "./removeSnippet";

export function activate(context: vscode.ExtensionContext) {
  const { subscriptions } = context;
  const { registerCommand } = vscode.commands;

  /**
   * Stub From File
   */
  const stubFromFileCommand = registerCommand(
    "extension.stubFromFile",
    stubFromFile
  );
  subscriptions.push(stubFromFileCommand);

  /**
   * Stub From Selection
   */
  const stubFromSelectionCommand = registerCommand(
    "extension.stubFromSelection",
    stubFromSelection
  );
  subscriptions.push(stubFromSelectionCommand);

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
