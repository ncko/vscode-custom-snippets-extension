import * as vscode from "vscode";
import * as fs from "fs";
import { snippetFolder, stubString } from "./util";
import { SnippetFileObject } from "./types"

/**
 * Open an existing snippet as a stub
 */
export default async function snippetToStub() {
  // ask the user for language
  const quickPick = vscode.window.createQuickPick();
  const languages = await vscode.languages.getLanguages();
  quickPick.items = languages.map(label => ({ label }));
  quickPick.onDidHide(() => quickPick.dispose());

  quickPick.onDidAccept(() => {
    let targetSnippetsText, parsedSnippets: SnippetFileObject;
    const language = quickPick.value;
    const pathToSnippets = `${snippetFolder()}${language}.json`;

    // open language snippet file
    try {
      targetSnippetsText = fs.readFileSync(pathToSnippets, {
        encoding: "utf8"
      });

      // parse snippet file as json object
      parsedSnippets = JSON.parse(targetSnippetsText);
    } catch (error) {
      vscode.window.showErrorMessage(
        `There are no snippets available for ${language}`
      );
      return;
    }

    // provide the user with a list of snippets from the language snippet file
    const snippetPick = vscode.window.createQuickPick();
    snippetPick.items = Object.keys(parsedSnippets).map(title => ({
      label: `${parsedSnippets[title].prefix} : ${title}`
    }));

    snippetPick.onDidHide(() => snippetPick.dispose());

    // when the user selects a snippet
    snippetPick.onDidChangeSelection(async selection => {
      const key = selection[0].label.split(":")[1].trim();
      const targetSnippet = parsedSnippets[key];

      // convert that snippet to a snippet stub
      const stub = stubString(key, targetSnippet.prefix, targetSnippet.body);

      // load the snippet stub to a new tab
      const tempDoc = await vscode.workspace.openTextDocument({
        content: stub
      });
      vscode.window.showTextDocument(tempDoc);
      snippetPick.dispose();
    });

    snippetPick.show();

    quickPick.dispose();
  });

  quickPick.show();
}
