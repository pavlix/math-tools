export interface AST {
    type: "num" | "var" | "bin";
    value?: string;
    op?: string;
    left?: AST;
    right?: AST;
    parent?: AST;
    x?: number;
    y?: number;
}

export function Num(value: string): AST {
    return { type: "num", value };
}

export function Bin(op: string, left: AST, right: AST): AST {
    return { type: "bin", op, left, right };
}

export function Var(value: string): AST {
    return { type: "var", value };
}
