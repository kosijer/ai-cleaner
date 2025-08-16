# AI Text Cleaner

A simple, browser-based tool for cleaning up AI-generated text by replacing special characters with standard ones.

## Features

- **Real-time text cleaning**: Paste AI-generated text and see it cleaned instantly
- **Customizable rules**: Edit replacement rules directly in the browser
- **Comprehensive character set**: Pre-configured with common AI text artifacts
- **Copy to clipboard**: Easy copying of cleaned text
- **Responsive design**: Works on desktop and mobile devices
- **Local storage**: Rules are saved in your browser for future use

## How to Use

1. **Input Text**: Paste your AI-generated text in the left text box
2. **View Results**: See the cleaned text appear automatically in the right text box
3. **Copy Text**: Use the "Copy to Clipboard" button to copy the cleaned text
4. **Customize Rules**: Edit the JSON rules below to add or modify character replacements

## Default Replacement Rules

The tool comes with pre-configured rules for common AI text artifacts:

- **Quotes**: Smart quotes (`"` `"` `'` `'`) → Straight quotes (`"` `'`)
- **Dashes**: Em dash (`—`) and en dash (`–`) → Regular dash (`-`)
- **Symbols**: Various mathematical and special symbols converted to text equivalents
- **Currency**: Currency symbols converted to text abbreviations
- **Greek letters**: Greek characters converted to English text

## Customizing Rules

You can edit the JSON rules directly in the browser:

1. **Edit the JSON**: Modify the rules in the text area below
2. **Auto-save**: Changes are automatically applied and saved to your browser
3. **Validation**: Use the "Validate JSON" button to check your syntax
4. **Reset**: Use "Reset to Default" to restore the original rules

### Rule Format

```json
{
  "character_to_replace": "replacement_text",
  "—": "-",
  "©": "(c)"
}
```

## Deployment

This project can be deployed to any static hosting service:

- **GitHub Pages**: Perfect for free hosting
- **Netlify**: Drag and drop deployment
- **Vercel**: Simple deployment from Git
- **Any web server**: Just upload the files

## File Structure

```
ai-cleaner/
├── index.html      # Main HTML file
├── styles.css      # CSS styling
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## Browser Compatibility

- Modern browsers with ES6 support
- Uses localStorage for rule persistence
- Fallback clipboard support for older browsers

## Local Development

1. Clone or download the project files
2. Open `index.html` in your web browser
3. No build process or dependencies required!

## Contributing

Feel free to:
- Add more character replacement rules
- Improve the UI/UX
- Add new features
- Report bugs or issues

## License

This project is open source and available under the MIT License. 