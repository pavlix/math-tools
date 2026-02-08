import { tokenize } from "./lexer";
import { parse } from "./parser";
import { renderMath } from "./renderMath";
import { layout, draw } from "./renderTree";

const run = () => {
  const input = (document.getElementById("input") as HTMLInputElement).value;
  const tokens = tokenize(input);
  const ast = parse(tokens);

  renderMath(ast);

  const svg = document.getElementById("tree") as SVGSVGElement;
  svg.innerHTML = "";
  layout(ast, 300, 40, 120);
  draw(svg, ast);
};
document.getElementById("input")!.addEventListener("input", run);

document.querySelectorAll<HTMLAnchorElement>("#examples a").forEach(a => {
  a.onclick = e => {
    e.preventDefault();
    const expr = a.textContent!.trim();
    (document.getElementById("input") as HTMLInputElement).value = expr;
    run();
  };
});
