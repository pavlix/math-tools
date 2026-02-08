import type { AST } from "./ast";

function toMathML(ast: AST): string {
  if (ast.type === "num") {
    return `<mn>${ast.value}</mn>`;
  }

  const op = ast.op === "*" ? "×" : ast.op;

  return `
    <mrow>
      <mo>(</mo>
      ${toMathML(ast.left)}
      <mo>${op}</mo>
      ${toMathML(ast.right)}
      <mo>)</mo>
    </mrow>
  `;
}

export function renderMath(ast: AST) {
  const el = document.getElementById("math")!;
  el.innerHTML = `
    <math xmlns="http://www.w3.org/1998/Math/MathML">
      ${toMathML(ast)}
    </math>
  `;
}
