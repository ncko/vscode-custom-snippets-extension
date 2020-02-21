export type SnippetObject = {
  body: string[];
  prefix: string;
  title: string;
};

export type SnippetFileObject = {
  [key: string]: SnippetObject;
};
