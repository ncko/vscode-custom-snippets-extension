import * as fs from "fs";
import * as os from "os";

// TODO - make sure this path is correct for Mac, Linux and Windows
export const snippetFolder = () =>
  `${os.homedir()}/Library/Application Support/Code/User/snippets/`;

export const stubString = (
  title?: string,
  prefix?: string,
  body?: string
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

interface SnippetObject {
  body: string[];
  prefix: string;
  title: string;
}
