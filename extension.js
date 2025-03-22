
const vscode = require('vscode');


/**
 * Activates the extension
 * @param {vscode.ExtensionContext} context
 */
const activate = (context) => {
  // Register the command
  const disposable = vscode.commands.registerCommand(
    'extension.wrapAtRuler',
    wrapSelectedTextAtRuler
  );

  context.subscriptions.push(disposable);
};


/**
 * Wraps selected text at the first ruler position
 */
const wrapSelectedTextAtRuler = () => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showInformationMessage('No editor is active');
    return;
  }

  const document = editor.document;
  let selection = editor.selection;
  let text;

  // If no text is selected, use the current line
  if (selection.isEmpty) {
    const currentLine = editor.selection.active.line;
    const lineRange = document.lineAt(currentLine).range;
    selection = new vscode.Selection(lineRange.start, lineRange.end);
    text = document.getText(lineRange);
  } else {
    // Get the selected text
    text = document.getText(selection);
  }

  // Get the first ruler position from settings
  const editorConfig = vscode.workspace.getConfiguration('editor');
  const rulers = editorConfig.get('rulers');

  // Default to 80 if no rulers are defined
  const rulerPosition = Array.isArray(rulers) && rulers.length > 0 ? rulers[0] : 80;

  // Get the character buffer from settings
  const extensionConfig = vscode.workspace.getConfiguration('wrapAtRuler');
  const characterBuffer = extensionConfig.get('characterBuffer');

  // Get the start line and its indentation
  const startLine = document.lineAt(selection.start.line);
  const indentMatch = startLine.text.match(/^\s*/);
  const indentation = indentMatch ? indentMatch[0] : '';

  // Calculate effective ruler position (accounting for indentation and buffer)
  const effectiveRulerPosition = rulerPosition - indentation.length - characterBuffer;

  // Wrap the text
  const wrappedText = wrapText(text, effectiveRulerPosition, indentation);

  // Replace the selected text with the wrapped text
  editor.edit(editBuilder => {
    editBuilder.replace(selection, wrappedText);
  });
};


/**
 * Wraps text at the specified position while maintaining indentation
 * @param {string} text - The text to wrap
 * @param {number} wrapPosition - The position to wrap at (not counting indentation)
 * @param {string} indentation - The indentation to use for each line
 * @returns {string} - The wrapped text
 */
const wrapText = (text, wrapPosition, indentation) => {
  // Split the text into words
  const words = text.trim().split(/\s+/);

  const lines = [];
  let currentLine = '';

  for (const word of words) {
    // Check if adding this word would exceed the wrap position
    if (currentLine.length + word.length + 1 > wrapPosition) {
      // If current line is not empty, add it to lines
      if (currentLine.length > 0) {
        lines.push(currentLine);
        currentLine = '';
      }

      // Handle words that are longer than the wrap position
      if (word.length > wrapPosition) {
        // Split the long word
        let remainingWord = word;
        while (remainingWord.length > wrapPosition) {
          lines.push(remainingWord.substring(0, wrapPosition));
          remainingWord = remainingWord.substring(wrapPosition);
        }

        if (remainingWord.length > 0) {
          currentLine = remainingWord;
        }
      } else {
        currentLine = word;
      }
    } else {
      // Add the word to the current line
      if (currentLine.length > 0) {
        currentLine += ' ' + word;
      } else {
        currentLine = word;
      }
    }
  }

  // Add the last line if it's not empty
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  // Join the lines with the proper indentation
  return lines.map(line => indentation + line).join('\n');
};


/**
 * Deactivates the extension
 */
const deactivate = () => {};


module.exports = {
  activate,
  deactivate
};

