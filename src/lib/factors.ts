export function drawRectangles(number: number): void {
    const factors: number[] = [];
    for (let i = 1; i <= number; i++) {
        if (number % i === 0) {
            factors.push(i);
        }
    }

    const svg = document.getElementById('rectangles') as SVGSVGElement;
    if (!svg) return;
    
    svg.innerHTML = '';
    
    const gridSize = 20;
    const margin = 0;
    let currentY = 0;
    const maxWidth = Math.floor((window.innerWidth - margin * 2) / gridSize) * gridSize;

    factors.forEach(factor => {
        const width = (number / factor) * gridSize;
        const height = factor * gridSize;

        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", margin.toString());
        rect.setAttribute("y", currentY.toString());
        rect.setAttribute("width", Math.min(width, maxWidth - margin * 2).toString());
        rect.setAttribute("height", height.toString());
        rect.setAttribute("class", "rectangle");
        rect.setAttribute("title", `${factor} x ${number/factor}`);
        svg.appendChild(rect);

        currentY += height + gridSize;
    });

    svg.setAttribute("height", (currentY + margin).toString());
}

function initializeFactors(): void {
    const elements: SVGElements = {
        rectangles: document.getElementById('rectangles') as SVGSVGElement,
        number: document.getElementById('number') as HTMLInputElement
    };
    
    if (elements.number) {
        elements.number.value = '12';
        drawRectangles(12);

        elements.number.addEventListener('input', () => {
            const number = parseInt(elements.number?.value || '1') || 1;
            drawRectangles(number);
        });
    }
}

document.addEventListener('DOMContentLoaded', initializeFactors);
