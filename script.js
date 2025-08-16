// Default replacement rules
const defaultRules = {
    "—": "... ",           // Long dash to regular dash
    "–": "-",           // En dash to regular dash
    "\u201C": "\"",     // Left double quote to straight quote
    "\u201D": "\"",     // Right double quote to straight quote
    "\u2018": "'",      // Left single quote to straight quote
    "\u2019": "'",      // Right single quote to straight quote
    "…": "...",         // Ellipsis to three dots
    "•": "-",           // Bullet point to dash
    "→": "->",          // Arrow to dash-greater
    "←": "<-",          // Left arrow to less-dash
    "⇒": "=>",          // Double arrow to equals-greater
    "⇐": "<=",          // Left double arrow to less-equals
    "±": "+/-",         // Plus-minus to plus-slash-minus
    "×": "x",           // Multiplication sign to x
    "÷": "/",           // Division sign to slash
    "°": " degrees",    // Degree symbol to text
    "©": "(c)",         // Copyright to (c)
    "®": "(R)",         // Registered trademark to (R)
    "™": "(TM)",        // Trademark to (TM)
    "¥": "JPY",         // Yen to JPY
    "¢": "cents",       // Cent to text
    "∞": "infinity",    // Infinity to text
    "√": "sqrt",        // Square root to text
    "²": "^2",          // Squared to ^2
    "³": "^3",          // Cubed to ^3
    "¼": "1/4",         // Quarter to fraction
    "½": "1/2",         // Half to fraction
    "¾": "3/4",         // Three quarters to fraction
    "α": "alpha",       // Greek alpha to text
    "β": "beta",        // Greek beta to text
    "γ": "gamma",       // Greek gamma to text
    "π": "pi",          // Pi to text
    "μ": "mu",          // Mu to text
    "σ": "sigma",       // Sigma to text
    "≤": "<=",          // Less than or equal
    "≥": ">=",          // Greater than or equal
    "≠": "!=",          // Not equal to !=
    "≈": "~",           // Approximately equal to ~
    "≡": "==",          // Identical to ==
    "⊂": "subset",      // Subset to text
    "⊃": "superset",    // Superset to text
    "∪": "union",       // Union to text
    "∩": "intersection" // Intersection to text
};

class TextCleaner {
    constructor() {
        this.rules = { ...defaultRules };
        this.init();
    }

    init() {
        this.loadRules();
        this.setupEventListeners();
        this.updateOutput();
    }

    loadRules() {
        // Try to load rules from localStorage, fallback to default
        const savedRules = localStorage.getItem('aiCleanerRules');
        if (savedRules) {
            try {
                this.rules = JSON.parse(savedRules);
                this.updateRulesDisplay();
            } catch (e) {
                console.warn('Failed to parse saved rules, using defaults');
                this.rules = { ...defaultRules };
                this.updateRulesDisplay();
            }
        } else {
            this.updateRulesDisplay();
        }
    }

    setupEventListeners() {
        const inputText = document.getElementById('input-text');
        const rulesJson = document.getElementById('rules-json');
        const copyBtn = document.getElementById('copy-btn');
        const resetBtn = document.getElementById('reset-rules');
        const validateBtn = document.getElementById('validate-json');

        // Real-time text cleaning
        inputText.addEventListener('input', () => {
            this.updateOutput();
        });

        // Rules editing
        rulesJson.addEventListener('input', () => {
            this.debounce(() => {
                this.updateRulesFromInput();
            }, 500)();
        });

        // Copy button
        copyBtn.addEventListener('click', () => {
            this.copyToClipboard();
        });

        // Reset rules
        resetBtn.addEventListener('click', () => {
            this.resetRules();
        });

        // Validate JSON
        validateBtn.addEventListener('click', () => {
            this.validateJSON();
        });
    }

    updateOutput() {
        const inputText = document.getElementById('input-text');
        const outputText = document.getElementById('output-text');
        const input = inputText.value;
        
        if (input.trim() === '') {
            outputText.value = '';
            this.updateScoring(0, 0, 0);
            return;
        }

        const cleaned = this.cleanText(input);
        outputText.value = cleaned;
        
        // Update scoring
        this.updateScoring(input);
    }

    updateScoring(input) {
        const aiScore = this.calculateAILikelihood(input);
        const totalCharCount = input.length;
        
        // Update the display
        document.getElementById('ai-char-count').textContent = aiScore.detectedFeatures;
        document.getElementById('total-char-count').textContent = totalCharCount;
        document.getElementById('ai-usage-score').textContent = aiScore.percentage + '%';
        
        // Add visual feedback based on score
        this.updateScoreVisual(aiScore.percentage);
        
        // Update the label to be more descriptive
        document.querySelector('.main-score .score-label').textContent = 'AI Likelihood Score:';
        
        // Log detailed scoring for debugging (remove this in production if desired)
        this.logScoringDetails(aiScore);
    }

    logScoringDetails(aiScore) {
        console.log('🔍 AI Likelihood Analysis:', {
            'Final Score': aiScore.percentage + '%',
            'Total Points': aiScore.detectedFeatures,
            'Details': aiScore.details
        });
    }

    calculateAILikelihood(text) {
        if (!text.trim()) {
            return { percentage: 0, detectedFeatures: 0, details: {} };
        }

        let totalScore = 0;
        const maxPossibleScore = 100;
        const details = {};

        // 1. Special Character Detection (20% weight)
        const specialCharScore = this.detectSpecialCharacters(text);
        totalScore += specialCharScore.score;
        details.specialCharacters = specialCharScore;

        // 2. Language Pattern Detection (30% weight)
        const languageScore = this.detectLanguagePatterns(text);
        totalScore += languageScore.score;
        details.languagePatterns = languageScore;

        // 3. Structural Pattern Detection (25% weight)
        const structuralScore = this.detectStructuralPatterns(text);
        totalScore += structuralScore.score;
        details.structuralPatterns = structuralScore;

        // 4. Vocabulary Analysis (15% weight)
        const vocabularyScore = this.analyzeVocabulary(text);
        totalScore += vocabularyScore.score;
        details.vocabulary = vocabularyScore;

        // 5. Repetition Detection (10% weight)
        const repetitionScore = this.detectRepetition(text);
        totalScore += repetitionScore.score;
        details.repetition = repetitionScore;

        // Calculate final percentage (capped at 95% to avoid 100% certainty)
        const percentage = Math.min(Math.round((totalScore / maxPossibleScore) * 95), 95);
        
        return {
            percentage,
            detectedFeatures: Math.round(totalScore),
            details
        };
    }

    detectSpecialCharacters(text) {
        let score = 0;
        let count = 0;
        
        // Check for special Unicode characters
        for (const char of text) {
            if (this.rules.hasOwnProperty(char)) {
                count++;
                score += 2; // Each special character adds 2 points
            }
        }
        
        // Check for other AI-typical characters
        const aiChars = /[•→←⇒⇐±×÷°©®™¥¢∞√²³¼½¾αβγπμσ≤≥≠≈≡⊂⊃∪∩]/g;
        const matches = text.match(aiChars);
        if (matches) {
            count += matches.length;
            score += matches.length * 1.5;
        }
        
        return { score: Math.min(score, 20), count, maxScore: 20 };
    }

    detectLanguagePatterns(text) {
        let score = 0;
        const patterns = [];
        
        // Formal language indicators
        const formalPhrases = [
            /in conclusion/i, /furthermore/i, /moreover/i, /additionally/i,
            /it is important to note/i, /it should be noted/i, /it is worth mentioning/i,
            /as previously mentioned/i, /as stated above/i, /in summary/i,
            /to summarize/i, /in essence/i, /fundamentally/i, /essentially/i,
            /it can be argued/i, /it is evident that/i, /clearly/i, /obviously/i,
            /therefore/i, /thus/i, /consequently/i, /as a result/i,
            /on the other hand/i, /conversely/i, /however/i, /nevertheless/i,
            /in contrast/i, /by contrast/i, /similarly/i, /likewise/i
        ];
        
        formalPhrases.forEach(pattern => {
            if (pattern.test(text)) {
                score += 3;
                patterns.push(pattern.source);
            }
        });
        
        // Academic/technical language
        const academicWords = [
            /methodology/i, /methodological/i, /theoretical/i, /framework/i,
            /paradigm/i, /heuristic/i, /algorithmic/i, /systematic/i,
            /comprehensive/i, /thorough/i, /rigorous/i, /empirical/i,
            /quantitative/i, /qualitative/i, /analytical/i, /analytical/i,
            /optimization/i, /efficiency/i, /effectiveness/i, /implementation/i
        ];
        
        academicWords.forEach(word => {
            if (word.test(text)) {
                score += 2;
                patterns.push(word.source);
            }
        });
        
        return { score: Math.min(score, 30), patterns, maxScore: 30 };
    }

    detectStructuralPatterns(text) {
        let score = 0;
        const patterns = [];
        
        // Check for repetitive sentence structures
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
        if (sentences.length > 2) {
            const structures = sentences.map(s => {
                const words = s.trim().split(/\s+/);
                return words.length;
            });
            
            // Check for uniform sentence lengths (AI tends to be more consistent)
            const avgLength = structures.reduce((a, b) => a + b, 0) / structures.length;
            const variance = structures.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / structures.length;
            
            if (variance < 25) { // Low variance indicates consistent structure
                score += 8;
                patterns.push('consistent_sentence_length');
            }
        }
        
        // Check for paragraph structure
        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 50);
        if (paragraphs.length > 1) {
            const paragraphLengths = paragraphs.map(p => p.trim().length);
            const avgParaLength = paragraphLengths.reduce((a, b) => a + b, 0) / paragraphLengths.length;
            
            if (avgParaLength > 200 && avgParaLength < 500) { // Typical AI paragraph length
                score += 6;
                patterns.push('uniform_paragraph_length');
            }
        }
        
        // Check for bullet point or list patterns
        if (/\n\s*[•\-*]\s/.test(text)) {
            score += 5;
            patterns.push('bullet_points');
        }
        
        // Check for numbered lists
        if (/\n\s*\d+\.\s/.test(text)) {
            score += 4;
            patterns.push('numbered_lists');
        }
        
        return { score: Math.min(score, 25), patterns, maxScore: 25 };
    }

    analyzeVocabulary(text) {
        let score = 0;
        const indicators = [];
        
        // Check for sophisticated vocabulary
        const sophisticatedWords = [
            /ubiquitous/i, /ubiquitous/i, /ubiquitous/i, /ubiquitous/i,
            /comprehensive/i, /thorough/i, /rigorous/i, /empirical/i,
            /methodological/i, /theoretical/i, /paradigm/i, /heuristic/i,
            /algorithmic/i, /systematic/i, /optimization/i, /efficiency/i,
            /effectiveness/i, /implementation/i, /methodology/i, /framework/i
        ];
        
        sophisticatedWords.forEach(word => {
            if (word.test(text)) {
                score += 2;
                indicators.push(word.source);
            }
        });
        
        // Check for technical jargon
        const technicalTerms = [
            /api/i, /sdk/i, /framework/i, /library/i, /dependency/i,
            /repository/i, /deployment/i, /infrastructure/i, /scalability/i,
            /performance/i, /optimization/i, /algorithm/i, /data structure/i,
            /machine learning/i, /artificial intelligence/i, /neural network/i,
            /blockchain/i, /cryptocurrency/i, /distributed system/i
        ];
        
        technicalTerms.forEach(term => {
            if (term.test(text)) {
                score += 1.5;
                indicators.push(term.source);
            }
        });
        
        return { score: Math.min(score, 15), indicators, maxScore: 15 };
    }

    detectRepetition(text) {
        let score = 0;
        const patterns = [];
        
        // Check for repeated phrases
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        const wordCounts = {};
        
        words.forEach(word => {
            if (word.length > 3) { // Only count meaningful words
                wordCounts[word] = (wordCounts[word] || 0) + 1;
            }
        });
        
        // Check for overused words
        Object.entries(wordCounts).forEach(([word, count]) => {
            if (count > 3 && word.length > 4) {
                score += 1;
                patterns.push(`${word}(${count}x)`);
            }
        });
        
        // Check for repetitive sentence starters
        const sentenceStarters = text.match(/^[A-Z][^.!?]*[.!?]/gm) || [];
        const starterWords = sentenceStarters.map(s => s.split(/\s+/)[0].toLowerCase());
        const starterCounts = {};
        
        starterWords.forEach(word => {
            starterCounts[word] = (starterCounts[word] || 0) + 1;
        });
        
        Object.entries(starterCounts).forEach(([word, count]) => {
            if (count > 2) {
                score += 1.5;
                patterns.push(`starts_with_${word}(${count}x)`);
            }
        });
        
        return { score: Math.min(score, 10), patterns, maxScore: 10 };
    }



    updateScoreVisual(percentage) {
        const scoreElement = document.getElementById('ai-usage-score');
        const scoreItem = scoreElement.closest('.score-item');
        
        // Remove existing color classes
        scoreItem.classList.remove('low-score', 'medium-score', 'high-score');
        
        // Add appropriate color class based on percentage
        if (percentage <= 30) {
            scoreItem.classList.add('low-score');      // Likely human-written
        } else if (percentage <= 70) {
            scoreItem.classList.add('medium-score');   // Uncertain/mixed
        } else {
            scoreItem.classList.add('high-score');     // Likely AI-generated
        }
    }

    cleanText(text) {
        let cleaned = text;
        
        // Apply all replacement rules
        for (const [from, to] of Object.entries(this.rules)) {
            cleaned = cleaned.replace(new RegExp(this.escapeRegExp(from), 'g'), to);
        }
        
        return cleaned;
    }

    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    updateRulesFromInput() {
        const rulesJson = document.getElementById('rules-json');
        const input = rulesJson.value.trim();
        
        if (input === '') return;
        
        try {
            const newRules = JSON.parse(input);
            if (typeof newRules === 'object' && newRules !== null) {
                this.rules = newRules;
                this.saveRules();
                this.updateOutput();
                this.showSuccess(rulesJson);
            } else {
                throw new Error('Rules must be an object');
            }
        } catch (e) {
            this.showError(rulesJson, e.message);
        }
    }

    updateRulesDisplay() {
        const rulesJson = document.getElementById('rules-json');
        rulesJson.value = JSON.stringify(this.rules, null, 2);
    }

    saveRules() {
        try {
            localStorage.setItem('aiCleanerRules', JSON.stringify(this.rules));
        } catch (e) {
            console.warn('Failed to save rules to localStorage');
        }
    }

    resetRules() {
        this.rules = { ...defaultRules };
        this.updateRulesDisplay();
        this.saveRules();
        this.updateOutput();
        
        const rulesJson = document.getElementById('rules-json');
        this.showSuccess(rulesJson, 'Rules reset to default');
    }

    validateJSON() {
        const rulesJson = document.getElementById('rules-json');
        const input = rulesJson.value.trim();
        
        if (input === '') {
            this.showError(rulesJson, 'Please enter some JSON');
            return;
        }
        
        try {
            const parsed = JSON.parse(input);
            if (typeof parsed === 'object' && parsed !== null) {
                this.showSuccess(rulesJson, 'Valid JSON!');
            } else {
                throw new Error('JSON must be an object');
            }
        } catch (e) {
            this.showError(rulesJson, `Invalid JSON: ${e.message}`);
        }
    }

    showSuccess(element, message = 'Success!') {
        element.classList.remove('error');
        element.classList.add('success');
        
        // Remove success class after 2 seconds
        setTimeout(() => {
            element.classList.remove('success');
        }, 2000);
    }

    showError(element, message) {
        element.classList.remove('success');
        element.classList.add('error');
        
        // Remove error class after 3 seconds
        setTimeout(() => {
            element.classList.remove('error');
        }, 3000);
    }

    async copyToClipboard() {
        const outputText = document.getElementById('output-text');
        const copyBtn = document.getElementById('copy-btn');
        
        if (outputText.value.trim() === '') {
            alert('No text to copy!');
            return;
        }
        
        try {
            await navigator.clipboard.writeText(outputText.value);
            
            // Visual feedback
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            copyBtn.style.background = '#218838';
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.background = '';
            }, 2000);
        } catch (err) {
            // Fallback for older browsers
            outputText.select();
            document.execCommand('copy');
            
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            copyBtn.style.background = '#218838';
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.background = '';
            }, 2000);
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TextCleaner();
}); 