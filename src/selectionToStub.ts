import * as vscode from "vscode";
import { stubString } from "./util";

/**
 * Create a stub from the currently selected text and load it in a new tab
 */
export default async function stubFromFile() {
  let doc, text;
  // retrieve selected text
  try {
    doc = vscode.window.activeTextEditor?.document;
    text = doc?.getText(vscode.window.activeTextEditor?.selection);
  } catch (error) {
    vscode.window.showErrorMessage(
      "Could not retrieve active text from active editor"
    );
    return;
  }

  // convert text to a snippet stub
  const stub = stubString("", "", text);

  // load snippet stub to a new tab
  const tempDoc = await vscode.workspace.openTextDocument({
    content: stub
  });
  vscode.window.showTextDocument(tempDoc);
}
