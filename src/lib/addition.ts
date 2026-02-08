interface Elements {
    addition: SVGSVGElement | null;
    number1: HTMLInputElement | null;
    number2: HTMLInputElement | null;
    exchange: HTMLButtonElement | null;
}

export function initializeAddition(): void {
    const elements: Elements = {
        addition: document.getElementById('addition') as SVGSVGElement,
        number1: document.getElementById('number1') as HTMLInputElement,
        number2: document.getElementById('number2') as HTMLInputElement,
        exchange: document.getElementById('exchange') as HTMLButtonElement
    };
    
    function updateVisualization() {
        if (!elements.number1 || !elements.number2) return;
        const num1 = parseInt(elements.number1.value) || 0;
        const num2 = parseInt(elements.number2.value) || 0;
        drawAddition(num1, num2);
    }
    
    elements.number1?.addEventListener('input', updateVisualization);
    elements.number2?.addEventListener('input', updateVisualization);
    
    elements.exchange?.addEventListener('click', () => {
        if (!elements.number1 || !elements.number2) return;
        const temp = elements.number1.value;
        elements.number1.value = elements.number2.value;
        elements.number2.value = temp;
        elements.number1.dispatchEvent(new Event('input'));
    });
    
    updateVisualization();
}

function drawAddition(num1: number, num2: number): void {
    const svg = document.getElementById('addition') as SVGSVGElement;
    if (!svg) return;
    
    svg.innerHTML = '';
    
    const squareSize = 20;
    const squaresPerRow = 10;
    
    const totalSquares = num1 + num2;
    const rows = Math.ceil(totalSquares / squaresPerRow);
    const width = squaresPerRow * squareSize;
    const height = rows * squareSize;
    
    svg.setAttribute('width', width.toString());
    svg.setAttribute('height', height.toString());
    svg.style.marginTop = '0';
    svg.style.marginBottom = '0';
    
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("transform", "translate(0, 0)");

    for (let i = 0; i < totalSquares; i++) {
        const row = Math.floor(i / squaresPerRow);
        const col = i % squaresPerRow;
        
        const square = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        square.setAttribute("x", (col * squareSize + 0.5).toString());
        square.setAttribute("y", (row * squareSize + 0.5).toString());
        square.setAttribute("width", squareSize);
        square.setAttribute("height", squareSize);
        square.classList.add(i < num1 ? "first-number" : "second-number");
        
        g.appendChild(square);
    }

    const border = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    border.setAttribute("x", "0.5");
    border.setAttribute("y", "0.5");
    border.setAttribute("width", width);
    border.setAttribute("height", height);
    border.setAttribute("fill", "none");
    border.setAttribute("stroke", "#333");
    border.setAttribute("stroke-width", "1");
    g.appendChild(border);

    svg.appendChild(g);
}
