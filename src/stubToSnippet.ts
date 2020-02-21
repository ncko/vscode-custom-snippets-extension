import * as vscode from "vscode";
import * as fs from "fs";
import { parseSnippetStub, snippetFolder, writeSnippet } from "./util";
import { SnippetObject } from "./types";

/**
 * Save stub as snippet
 */
export default async function stubToSnippet() {
  let doc, text, stub: SnippetObject;

  // parse snippet stub
  try {
    doc = vscode.window.activeTextEditor?.document;
    text = doc?.getText();
  } catch (error) {
    vscode.window.showErrorMessage("Unable to retrieve snippet stub");
    return;
  }

  try {
    stub = parseSnippetStub(text);
  } catch (error) {
    vscode.window.showErrorMessage("This stub is not correctly formatted");
    return;
  }

  // ask the user which language to save to
  const quickPick = vscode.window.createQuickPick();
  const languages = await vscode.languages.getLanguages();
  quickPick.items = languages.map(label => ({ label }));
  quickPick.onDidHide(() => quickPick.dispose());

  quickPick.onDidAccept(() => {
    let targetSnippetsText, parsedSnippets;
    const language = quickPick.value;
    const pathToSnippets = `${snippetFolder()}${language}.json`;

    // open language snippet file
    // parse snippet file as json object
    try {
      targetSnippetsText = fs.readFileSync(pathToSnippets, {
        encoding: "utf8"
      });

      parsedSnippets = JSON.parse(targetSnippetsText);

      // if the file exists but is empty, notify the user and return
      if (!Object.keys(parsedSnippets).length) {
        vscode.window.showInformationMessage(
          `There are no snippets available in the ${language} snippets file`
        );
        return;
      }
    } catch (error) {
      parsedSnippets = {};
    }

    // add new snippet to existing snippet object
    parsedSnippets[stub.title] = stub;

    // write to file
    writeSnippet(language, JSON.stringify(parsedSnippets));

    vscode.window.showInformationMessage(
      `Snippet "${stub.title}" with prefix "${stub.prefix}" written to ${language} snippets file`
    );

    quickPick.dispose();
  });

  quickPick.show();
}
