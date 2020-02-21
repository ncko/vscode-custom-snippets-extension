import * as fs from "fs";
import * as os from "os";
import { SnippetObject } from "./types";

const isWin = process.platform === "win32";
const isMac = process.platform === "darwin";

export const snippetFolder = () => {
  if (isMac) {
    return `${os.homedir()}/Library/Application Support/Code/User/snippets/`;
  }

  if (isWin) {
    return `${os.homedir()}\Code\User\snippets`;
  }

  // assume we are on some kind of Unix system
  return `${os.homedir()}/.config/Code/User/snippets/`;
};

export const stubString = (
  title?: string,
  prefix?: string,
  body?: string | string[]
) => {
  const snippetBody = Array.isArray(body) ? body.join("\n") : body;
  return `Title: ${title}\nPrefix: ${prefix}\n-------------------------------------------\n${snippetBody}\n-------------------------------------------`;
};

export const writeSnippet = (language: string, snippetString: string) => {
  const targetFilePath = `${snippetFolder()}${language}.json`;

  try {
    fs.writeFileSync(targetFilePath, snippetString, { flag: "w+" });
  } catch (error) {
    console.error(`Error: failed to write snippet.`);
    return;
  }
};

export const parseSnippetStub = (snippetText?: string) => {
  if (!snippetText) {
    throw new Error("Cannot parse undefined");
  }

  let inSnippetTextRange = false;
  let snippetEnd = false;
  return snippetText.split("\n").reduce(
    (acc: SnippetObject, line) => {
      if (snippetEnd) {
        return acc;
      }

      if (!inSnippetTextRange) {
        if (/^\-\-\-*\-\-\-$/.test(line)) {
          inSnippetTextRange = true;
          return acc;
        }

        const splitAtColon = line.split(":");

        if (splitAtColon.length < 2) {
          throw new Error("Badly formatted snippet text");
        }

        const key = splitAtColon[0].toLowerCase();
        const value = splitAtColon[1].trim();

        switch (key) {
          case "title":
            acc.title = value;
            break;
          case "prefix":
            acc.prefix = value;
            break;
        }

        return acc;
      } else {
        if (/^---*---$/.test(line)) {
          snippetEnd = true;
          return acc;
        }

        // snippet text
        if (!acc.body) {
          acc.body = [];
        }

        acc.body.push(line);
      }
      return acc;
    },
    { title: "", prefix: "", body: [] }
  );
};
