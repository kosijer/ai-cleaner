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
            return;
        }

        const cleaned = this.cleanText(input);
        outputText.value = cleaned;
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