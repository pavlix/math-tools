export type Token = {
    type: 'number' | 'variable' | 'operator' | 'paren';
    value: string;
};

export function lexer(input: string): Token[] {
    const tokens: Token[] = [];
    let current = 0;

    while (current < input.length) {
        let char = input[current];

        // Skip whitespace
        if (/\s/.test(char)) {
            current++;
            continue;
        }

        // Numbers or Variables
        if (/[0-9a-zA-Z]/.test(char)) {
            let value = '';
            while (current < input.length && /[0-9a-zA-Z]/.test(char)) {
                value += char;
                char = input[++current];
            }
            const type = /^[0-9]+$/.test(value) ? 'number' : 'variable';
            tokens.push({ type, value });
            continue;
        }

        // Operators
        if (/[+−×÷]/.test(char)) {
            tokens.push({ type: 'operator', value: char });
            current++;
            continue;
        }

        // Parentheses
        if (char === '(' || char === ')') {
            tokens.push({ type: 'paren', value: char });
            current++;
            continue;
        }

        throw new Error(`Unknown character: ${char}`);
    }

    return tokens;
}
