import * as vscode from "vscode";
import { stubString } from "./util";

/**
 * Create a stub from the given file and load it in a new tab
 */
export default async function stubFromFile() {
  // retrieve text from active document
  const doc = vscode.window.activeTextEditor?.document;
  const text = doc?.getText();

  // convert text to a snippet stub
  const stub = stubString("", "", text);

  // load snippet stub to a new tab
  const tempDoc = await vscode.workspace.openTextDocument({
    content: stub
  });
  vscode.window.showTextDocument(tempDoc);
}
