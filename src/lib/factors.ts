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
    const margin = gridSize;
    let currentX = margin;
    let currentY = margin;
    let rowHeight = 0;
    const maxWidth = Math.floor((window.innerWidth - margin * 2) / gridSize) * gridSize;

    factors.forEach(factor => {
        const width = factor * gridSize;
        const height = (number / factor) * gridSize;

        if (currentX + width + margin > maxWidth) {
            currentX = margin;
            currentY += rowHeight + gridSize;
            rowHeight = 0;
        }

        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", currentX.toString());
        rect.setAttribute("y", currentY.toString());
        rect.setAttribute("width", width.toString());
        rect.setAttribute("height", height.toString());
        rect.setAttribute("class", "rectangle");
        rect.setAttribute("title", `${factor} x ${number/factor}`);
        svg.appendChild(rect);

        currentX += width + gridSize;
        rowHeight = Math.max(rowHeight, height);
    });

    svg.setAttribute("height", (currentY + rowHeight + margin).toString());
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
