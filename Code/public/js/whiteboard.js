class Whiteboard {
    constructor() {
        this.canvas = document.getElementById('whiteboard');
        this.ctx = this.canvas.getContext('2d');
        this.isDrawing = false;
        this.currentTool = 'pen';
        this.init();
    }

    init() {
        this.resizeCanvas();
        this.setupEventListeners();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
        this.canvas.addEventListener('mousemove', this.draw.bind(this));
        this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
        this.canvas.addEventListener('mouseout', this.stopDrawing.bind(this));

        document.querySelectorAll('.tool').forEach(tool => {
            tool.addEventListener('click', (e) => {
                this.currentTool = e.currentTarget.dataset.tool;
                document.querySelectorAll('.tool').forEach(t => t.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });

        document.getElementById('clearBoard').addEventListener('click', () => this.clear());
        document.getElementById('saveBoard').addEventListener('click', () => this.save());
    }

    startDrawing(e) {
        this.isDrawing = true;
        this.ctx.beginPath();
        this.ctx.moveTo(e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);
    }

    draw(e) {
        if (!this.isDrawing) return;
        
        this.ctx.lineTo(e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);
        this.ctx.strokeStyle = this.currentTool === 'eraser' ? '#fff' : document.getElementById('colorPicker').value;
        this.ctx.lineWidth = document.getElementById('brushSize').value;
        this.ctx.lineCap = 'round';
        this.ctx.stroke();
    }

    stopDrawing() {
        this.isDrawing = false;
        this.ctx.closePath();
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    save() {
        const dataUrl = this.canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'whiteboard.png';
        link.href = dataUrl;
        link.click();
    }
}

new Whiteboard();
