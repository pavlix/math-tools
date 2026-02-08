import type { AST } from "./ast";

let rootNode: AST | null = null;
let selectedNode: AST | null = null;

export function renderTree(ast: AST, svgElement: SVGElement): void {
    // Clear existing content
    svgElement.innerHTML = '';
    
    // Calculate required width based on tree depth and branching
    const treeWidth = calculateTreeWidth(ast) * 80;  // 80px per leaf node
    const treeHeight = calculateTreeHeight(ast) * 80; // 80px per level
    
    svgElement.setAttribute('width', `${treeWidth}px`);
    svgElement.setAttribute('height', `${treeHeight}px`);

    // First pass: layout
    layout(ast, treeWidth/2, 40, treeWidth/6);

    // Always set root as selected initially
    rootNode = ast;
    selectedNode = ast;

    // Second pass: draw
    draw(svgElement as SVGSVGElement, ast);

    // Show initial expression
    updateExpressionDisplay();
}

function isInSubtree(node: AST, root: AST): boolean {
    if (!root) return false;
    if (node === root) return true;
    if (root.type === "num" || root.type === "var") return false;
    if (root.type === "bin") {
        return isInSubtree(node, root.left!) || isInSubtree(node, root.right!);
    }
    return false;
}

function layout(ast: AST, x: number, y: number, dx: number) {
    ast.x = x;
    ast.y = y;

    if (ast.type === "bin") {
        layout(ast.left!, x - dx, y + 60, dx / 2);
        layout(ast.right!, x + dx, y + 60, dx / 2);
    }
}

function draw(svg: SVGSVGElement, ast: AST) {
    if (ast.type === "bin") {
        connect(svg, ast, ast.left!);
        connect(svg, ast, ast.right!);
        draw(svg, ast.left!);
        draw(svg, ast.right!);
    }

    node(svg, ast);
}

function node(svg: SVGSVGElement, ast: AST) {
    const g = document.createElementNS(svg.namespaceURI, "g");
    g.classList.add("node");
    
    if (ast === selectedNode) {
        g.classList.add("selected");
    } else if (isInSubtree(ast, selectedNode!)) {
        g.classList.add("in-subtree");
    } else {
        g.classList.add("greyed-out");
    }

    // Use circle for operators, square for numbers
    if (ast.type === "bin") {
        const circle = document.createElementNS(svg.namespaceURI, "circle");
        circle.setAttribute("cx", String(ast.x || 0));
        circle.setAttribute("cy", String(ast.y || 0));
        circle.setAttribute("r", "16");
        g.appendChild(circle);
    } else {
        const square = document.createElementNS(svg.namespaceURI, "rect");
        square.setAttribute("x", String((ast.x || 0) - 14));
        square.setAttribute("y", String((ast.y || 0) - 14));
        square.setAttribute("width", "28");
        square.setAttribute("height", "28");
        g.appendChild(square);
    }

    const t = document.createElementNS(svg.namespaceURI, "text");
    t.setAttribute("x", String(ast.x || 0));
    t.setAttribute("y", String(ast.y || 0));
    t.textContent = ast.type === "bin" ? ast.op || '' : ast.value || '';
    t.setAttribute("fill", "#000");
    t.setAttribute("font-weight", "bold");
    if (ast.type === "bin") {
        t.setAttribute("font-size", "32px");
    }

    g.appendChild(t);
    
    // Add click handler
    g.addEventListener('click', (e) => {
        e.stopPropagation();
        selectedNode = ast;
        
        // Redraw all nodes with new selection
        const nodes = svg.querySelectorAll('.node');
        nodes.forEach(node => {
            node.classList.remove('selected', 'in-subtree', 'greyed-out');
            const nodeAst = (node as any)._ast;
            if (nodeAst === selectedNode) {
                node.classList.add('selected');
            } else if (isInSubtree(nodeAst, selectedNode!)) {
                node.classList.add('in-subtree');
            } else {
                node.classList.add('greyed-out');
            }
        });

        // Update expression display with root node
        updateExpressionDisplay();
    });

    // Store AST reference for click handler
    (g as any)._ast = ast;

    svg.appendChild(g);
}

function getExpression(ast: AST, highlight: boolean = false): string {
    if (ast.type === "num" || ast.type === "var") {
        const value = ast.value!;
        const isHighlighted = isInSubtree(ast, selectedNode!);
        return `<span class="${isHighlighted ? 'highlighted' : 'greyed-out'}">${value}</span>`;
    }
    const isHighlighted = isInSubtree(ast, selectedNode!);
    const left = getExpression(ast.left!, isHighlighted);
    const right = getExpression(ast.right!, isHighlighted);
    const op = isHighlighted ? 
        `<span class="highlighted">${ast.op}</span>` : 
        `<span class="greyed-out">${ast.op}</span>`;

    // Add parentheses for subexpressions that need them
    const needsParens = ast.type === "bin" && (
        // When current node is + and parent is ×
        (ast.op === '+' && ast.parent?.type === 'bin' && ast.parent.op === '×')
    );

    if (needsParens) {
        const paren = isHighlighted ? 
            `<span class="highlighted">(</span>` : 
            `<span class="greyed-out">(</span>`;
        const closeParen = isHighlighted ? 
            `<span class="highlighted">)</span>` : 
            `<span class="greyed-out">)</span>`;
        return `${paren}${left} ${op} ${right}${closeParen}`;
    }
    
    return `${left} ${op} ${right}`;
}

function updateExpressionDisplay() {
    const expressionDiv = document.getElementById('expression-result');
    if (!expressionDiv || !rootNode) return;
    
    const expr = getExpression(rootNode).replace(/^\((.*)\)$/, '$1');  // Remove outer parentheses
    expressionDiv.innerHTML = expr;
}

function calculateTreeWidth(ast: AST): number {
    if (ast.type === "num" || ast.type === "var") return 1;
    if (ast.type === "bin" && ast.left && ast.right) {
        return calculateTreeWidth(ast.left) + calculateTreeWidth(ast.right);
    }
    return 1;
}

function calculateTreeHeight(ast: AST): number {
    if (ast.type === "num" || ast.type === "var") return 1;
    if (ast.type === "bin" && ast.left && ast.right) {
        return 1 + Math.max(calculateTreeHeight(ast.left), calculateTreeHeight(ast.right));
    }
    return 1;
}

function connect(svg: SVGSVGElement, a: AST, b: AST) {
    const l = document.createElementNS(svg.namespaceURI, "line");
    l.setAttribute("x1", String(a.x));
    l.setAttribute("y1", String(a.y));
    l.setAttribute("x2", String(b.x));
    l.setAttribute("y2", String(b.y));
    
    if (isInSubtree(a, selectedNode!) && isInSubtree(b, selectedNode!)) {
        l.classList.add("active");
    } else {
        l.classList.add("inactive");
    }
    
    svg.appendChild(l);
}
