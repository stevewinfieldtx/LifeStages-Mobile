var ExtensionPreprocessingJS = {
  run: function(arguments) {
    arguments.completionFunction({selectedText: String(window.getSelection() || '')});
  }
};
