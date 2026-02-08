import type { Token } from './lexer.ts';
import type { AST } from './ast.ts';
import { Num, Bin, Var } from './ast';

export function parser(tokens: Token[]): AST {
    let pos = 0;

    const peek = () => tokens[pos];
    const next = () => tokens[pos++];

    function precedence(token?: Token): number {
        if (!token || token.type !== 'operator') return -1;
        if (token.value === "+" || token.value === "−") return 10;
        if (token.value === "×" || token.value === "÷") return 20;
        return -1;
    }

    function parseExpr(minBP = 0): AST {
        let lhs: AST;
        const tok = next();

        if (tok.type === 'paren' && tok.value === '(') {
            lhs = parseExpr();
            next(); // consume ")"
        } else if (tok.type === 'number' || tok.type === 'variable') {
            lhs = tok.type === 'number' ? Num(tok.value) : Var(tok.value);
        } else {
            throw new Error(`Unexpected token: ${JSON.stringify(tok)}`);
        }

        while (true) {
            const op = peek();
            const bp = precedence(op);
            if (bp < minBP) break;

            next();
            const rhs = parseExpr(bp + 1);
            lhs = Bin(op.value, lhs, rhs);
        }

        return lhs;
    }

    return parseExpr();
}
