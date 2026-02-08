interface Elements {
    multiplication: SVGSVGElement | null;
    number1: HTMLInputElement | null;
    number2: HTMLInputElement | null;
    exchange: HTMLButtonElement | null;
}

export function initializeMultiplication(): void {
    const elements: Elements = {
        multiplication: document.getElementById('multiplication') as SVGSVGElement,
        number1: document.getElementById('number1') as HTMLInputElement,
        number2: document.getElementById('number2') as HTMLInputElement,
        exchange: document.getElementById('exchange') as HTMLButtonElement
    };
    
    function updateVisualization() {
        if (!elements.number1 || !elements.number2) return;
        const num1 = parseInt(elements.number1.value) || 0;
        const num2 = parseInt(elements.number2.value) || 0;
        drawMultiplication(num1, num2);
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

function drawMultiplication(num1: number, num2: number): void {
    const svg = document.getElementById('multiplication') as SVGSVGElement;
    if (!svg) return;
    
    svg.innerHTML = '';
    
    const squareSize = 20;
    const width = num1 * squareSize;
    const height = num2 * squareSize;
    
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("transform", "translate(0, 0)");

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", "0");
    rect.setAttribute("y", "0");
    rect.setAttribute("width", width.toString());
    rect.setAttribute("height", height.toString());
    rect.setAttribute("fill", "rgba(64, 128, 255, 0.3)");
    rect.setAttribute("stroke", "#333");
    rect.setAttribute("stroke-width", "1");
    
    g.appendChild(rect);
    svg.appendChild(g);
}

