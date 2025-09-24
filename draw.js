document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('drawCanvas');
    const ctx = canvas.getContext('2d');
    const colorPicker = document.querySelector('.color-picker');
    const sizeSlider = document.querySelector('.size-slider');
    const buttons = document.querySelectorAll('.draw-btn');
    const drawSection = document.querySelector('.draw-section');
    const drawButton = document.getElementById('drawButton');
    
    let isDrawing = false;
    let currentTool = 'brush';
    let lastX = 0;
    let lastY = 0;

    drawButton.addEventListener('click', () => {
        drawSection.classList.toggle('hidden');
        drawButton.classList.toggle('active');
        if (!drawSection.classList.contains('hidden')) {
            resizeCanvas();
        }
    });

    function resizeCanvas() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height - 80;
        
        ctx.fillStyle = 'rgba(10, 8, 16, 0.4)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    });

    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    });

    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mouseout', () => isDrawing = false);
    canvas.addEventListener('touchend', () => isDrawing = false);

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tool = btn.dataset.tool;
            
            if (tool === 'clear') {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                return;
            }

            currentTool = tool;
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    function draw(e) {
        if (!isDrawing) return;

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        
        if (currentTool === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.strokeStyle = 'rgba(0,0,0,1)';
            ctx.lineWidth = sizeSlider.value * 2;
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = colorPicker.value;
            ctx.lineWidth = sizeSlider.value;
        }
        
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    ctx.shadowBlur = 5;
    ctx.shadowColor = colorPicker.value;
    colorPicker.addEventListener('input', (e) => {
        ctx.shadowColor = e.target.value;
    });
});
