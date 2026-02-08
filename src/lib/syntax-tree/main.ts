import { lexer } from './lexer';
import { parser } from './parser';
import { renderTree } from './renderTree';

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('expression') as HTMLInputElement;
    const svg = document.getElementById('tree');
    if (!(svg instanceof SVGSVGElement)) {
        throw new Error('Tree element not found or not an SVG element');
    }
    const examples = document.getElementById('examples');
    
    function replaceOperators(text: string): string {
        return text
            .replace(/\*/g, '×')
            .replace(/-/g, '−')
            .replace(/\//g, '÷');
    }

    function updateTree() {
        try {
            // Replace the input value with Unicode operators
            const cleanedInput = replaceOperators(input.value);
            if (cleanedInput !== input.value) {
                const start = input.selectionStart;
                const end = input.selectionEnd;
                input.value = cleanedInput;
                // Restore cursor position
                input.setSelectionRange(start, end);
            }
            
            const tokens = lexer(input.value);
            const ast = parser(tokens);
            renderTree(ast, svg);
        } catch (error) {
            console.error('Error parsing expression:', error);
            svg.innerHTML = ''; // Clear any partial rendering
        }
    }

    input.addEventListener('input', updateTree);

    examples?.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.target as HTMLAnchorElement;
        if (target.tagName === 'A') {
            input.value = target.dataset.expr || target.textContent || '';
            updateTree();
        }
    });

    // Set initial example and render
    input.value = '(1 + 2) × (3 + 4)';
    updateTree();
});
