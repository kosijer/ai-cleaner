# AI Text Cleaner

A sophisticated, browser-based tool for cleaning up AI-generated text by replacing special characters with standard ones, featuring an advanced AI detection scoring system.

## Features

- **Real-time text cleaning**: Paste AI-generated text and see it cleaned instantly
- **AI Likelihood Scoring**: Advanced multi-factor analysis to detect AI-generated content
- **Customizable rules**: Edit replacement rules directly in the browser
- **Comprehensive character set**: Pre-configured with common AI text artifacts
- **Copy to clipboard**: Easy copying of cleaned text
- **Responsive design**: Works on desktop and mobile devices
- **Local storage**: Rules are saved in your browser for future use
- **Detailed analysis**: See exactly what patterns indicate AI generation

## AI Likelihood Scoring System

The AI Text Cleaner now includes a sophisticated scoring system that analyzes multiple factors to determine how likely text is to be AI-generated. This goes far beyond simple character counting to provide meaningful insights.

### How the Scoring Works

The system analyzes text across **5 weighted categories** to calculate an overall AI likelihood percentage:

#### 1. Special Character Detection (20% weight)
- **Unicode symbols**: Mathematical operators, arrows, Greek letters
- **Special characters**: Bullet points, copyright symbols, currency signs
- **Score calculation**: Each special character adds 2 points, capped at 20 points

#### 2. Language Pattern Detection (30% weight)
- **Formal phrases**: "in conclusion", "furthermore", "moreover", "additionally"
- **Transition words**: "therefore", "thus", "consequently", "as a result"
- **Academic language**: "methodology", "theoretical", "framework", "paradigm"
- **Score calculation**: Each formal phrase adds 3 points, academic words add 2 points

#### 3. Structural Pattern Detection (25% weight)
- **Consistent sentence lengths**: AI tends to maintain uniform sentence structure
- **Uniform paragraph lengths**: Typical AI paragraphs are 200-500 characters
- **Organized lists**: Bullet points, numbered lists, structured content
- **Score calculation**: Based on structural consistency and organization patterns

#### 4. Vocabulary Analysis (15% weight)
- **Sophisticated words**: "ubiquitous", "comprehensive", "rigorous", "empirical"
- **Technical jargon**: "API", "SDK", "framework", "algorithm", "infrastructure"
- **Score calculation**: Sophisticated words add 2 points, technical terms add 1.5 points

#### 5. Repetition Detection (10% weight)
- **Overused words**: Words appearing more than 3 times
- **Repetitive sentence starters**: Consistent sentence beginnings
- **Score calculation**: Based on repetition patterns and word frequency

### Score Interpretation

- **0-30%**: Likely human-written text
- **31-70%**: Uncertain/mixed (could be either human or AI)
- **71-95%**: Likely AI-generated text
- **Maximum score**: Capped at 95% (never 100% certain)

### What This Means

The scoring system provides a **probability assessment** rather than absolute certainty. It's designed to identify patterns commonly associated with AI-generated content while acknowledging that human writers can also use formal language, technical terms, and structured writing.

## How to Use

1. **Input Text**: Paste your text in the left text box
2. **View Results**: See the cleaned text appear automatically in the right text box
3. **Analyze Score**: Check the AI Likelihood Score to understand detection results
4. **Review Details**: Click "How is the AI Likelihood Score calculated?" for breakdown
5. **Copy Text**: Use the "Copy to Clipboard" button to copy the cleaned text
6. **Customize Rules**: Edit the JSON rules below to add or modify character replacements

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

## Use Cases

### For Content Creators
- **Blog writers**: Clean up AI-generated drafts before publishing
- **Students**: Format AI-assisted essays and papers
- **Professionals**: Polish AI-generated reports and documentation

### For Developers
- **API responses**: Clean up AI-generated text from language models
- **Content management**: Process AI-generated content for web applications
- **Data processing**: Standardize text formats across different sources

### For Researchers
- **Text analysis**: Study patterns in AI vs. human writing
- **Content evaluation**: Assess the likelihood of AI generation
- **Quality control**: Ensure content meets publication standards

## Technical Details

### Browser Console Logging
The system provides detailed debugging information in the browser console:
- Final AI likelihood score
- Total points from all categories
- Detailed breakdown of detected patterns
- Specific phrases and words that contributed to the score

### Performance
- **Real-time analysis**: Scoring updates as you type
- **Efficient algorithms**: Optimized for text processing
- **Memory efficient**: No external dependencies or heavy computations

## Deployment

This project can be deployed to any static hosting service:

- **GitHub Pages**: Perfect for free hosting
- **Netlify**: Drag and drop deployment
- **Vercel**: Simple deployment from Git
- **Any web server**: Just upload the files

## File Structure

```
ai-cleaner/
├── index.html      # Main HTML file with scoring interface
├── styles.css      # CSS styling including scoring section
├── script.js       # JavaScript with AI detection algorithms
└── README.md       # This documentation file
```

## Browser Compatibility

- Modern browsers with ES6 support
- Uses localStorage for rule persistence
- Fallback clipboard support for older browsers
- Responsive design for all device sizes

## Local Development

1. Clone or download the project files
2. Open `index.html` in your web browser
3. No build process or dependencies required!
4. Open browser console to see detailed scoring analysis

## Contributing

Feel free to:
- **Improve AI detection algorithms**: Add new pattern recognition methods
- **Enhance scoring weights**: Refine the category weightings
- **Add new detection categories**: Identify additional AI indicators
- **Improve the UI/UX**: Better visualization of scoring results
- **Add more character replacement rules**: Expand the cleaning capabilities
- **Report bugs or issues**: Help improve the tool's accuracy

## Future Enhancements

Potential improvements for the AI detection system:
- **Machine learning integration**: Train on larger datasets for better accuracy
- **Language-specific detection**: Optimize for different languages
- **Context-aware analysis**: Consider document type and genre
- **Real-time learning**: Adapt to new AI writing patterns
- **Export capabilities**: Save detailed analysis reports

## License

This project is open source and available under the MIT License. 