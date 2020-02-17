import * as vscode from "vscode";
import * as fs from "fs";
import { parseSnippetStub, snippetFolder, writeSnippet } from "./util";

/**
 * Save stub as snippet
 */
export default async function stubToSnippet() {
  // parse snippet stub
  const doc = vscode.window.activeTextEditor?.document;
  const text = doc?.getText();
  const stub = parseSnippetStub(text);

  // ask the user which language to save to
  const quickPick = vscode.window.createQuickPick();
  const languages = await vscode.languages.getLanguages();
  quickPick.items = languages.map(label => ({ label }));
  quickPick.onDidHide(() => quickPick.dispose());

  quickPick.onDidAccept(() => {
    const language = quickPick.value;
    const pathToSnippets = `${snippetFolder()}${language}.json`;

    // open language snippet file
    const targetSnippetsText = fs.readFileSync(pathToSnippets, {
      encoding: "utf8"
    });

    // parse snippet file as json object
    const parsedSnippets = JSON.parse(targetSnippetsText);

    // add new snippet to existing snippet object
    parsedSnippets[stub.title] = stub;

    // write to file
    writeSnippet(language, JSON.stringify(parsedSnippets));

    vscode.window.showInformationMessage("Snippet written");

    quickPick.dispose();
  });

  quickPick.show();
}