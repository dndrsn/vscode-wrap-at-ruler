# Text Ruler Wrap

A simple VS Code extension that wraps text at the editor ruler.

## Features

- Wraps selected text at the position of the first editor ruler
- Maintains indentation for all wrapped lines
- Provides a configurable buffer to wrap text before reaching the ruler
- Wraps the current line if no text is selected

## Usage

1. Select text to wrap (or place cursor on a line to wrap just that line)
2. Use the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and search for "Wrap Text at Ruler"
3. Alternatively, use the keyboard shortcut: `Shift+Ctrl+W`


## Extension Settings

This extension contributes the following settings:

* `wrapAtRuler.characterBuffer`: Number of characters to wrap before reaching the ruler position (default: 5)

## Requirements

- VS Code version 1.60.0 or higher
- At least one editor ruler defined in your settings (defaults to 80 if none defined)

To set rulers in VS Code:
1. Open Settings (`Ctrl+,` or `Cmd+,`)
2. Search for "editor.rulers"
3. Add ruler values as needed (e.g., `[80, 100]`)

## Release Notes

### 0.1.0

Initial release of Text Ruler Wrap:
- Wrap text at editor ruler position
- Keyboard shortcut support
- Configurable character buffer

---

**Enjoy!**
