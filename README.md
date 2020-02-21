# Custom Snippets

Easily create, edit and delete custom snippets.

## Installation

This extension is not yet ready to be published to VSCode's extension marketplace. To install it, you must download the VSIX file at the root of this directory and run the following command:

```
code --install-extension <path-to-vsix-file>
```

## Usage

### Working with Stubs
A "stub" is a description of a snippet that looks like this:

```
Title: Some Snippet
Prefix: somsnip
-------------------------------------------
function someSnippet() {
    $1
}
-------------------------------------------
```

Once a stub is created, it can be written as a snippet for a given language.

There are two ways to create a stub:

#### Option 1
```
1. CMD + SHIFT + P -> Stub File
```

#### Option 2
```
1. Select the text you want to turn into a snippet
2. CMD + SHIFT + P -> Stub Selection
```

### Create a New Snippet
With a stub open, press `CMD + SHIFT + P -> Write Snippet`

### Open an Existing Snippet for Editing
`CMD + SHIFT + P -> Open Snippet`

### Remove an Existing Snippet
`CMD + SHIFT + P -> Remove Snippet`

## Release Notes

### 0.1.0

Beta release. If you encounter a bug please submit an issue on github.