import * as vscode from "vscode";
import * as fs from "fs";
import { snippetFolder, writeSnippet } from "./util";
import { SnippetFileObject } from "./types";

/**
 * Remove an existing snippet
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

      // remove the snippet from the object
      delete parsedSnippets[key];

      // rewrite the file
      writeSnippet(language, JSON.stringify(parsedSnippets));

      // notify the user
      vscode.window.showInformationMessage(
        `Successfully removed ${targetSnippet.title} with prefix ${targetSnippet.prefix} from ${language} snippets file`
      );

      snippetPick.dispose();
    });

    snippetPick.show();

    quickPick.dispose();
  });

  quickPick.show();
}
