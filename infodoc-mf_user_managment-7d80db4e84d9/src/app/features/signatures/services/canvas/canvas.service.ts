// canvas.service.ts
import { Injectable, Signal, signal } from '@angular/core';
import { CanvasConfig } from '../../interfaces/canvas.model';

@Injectable({
  providedIn: 'root'
})
export class CanvasService {
  private ctx!: CanvasRenderingContext2D;
  private isDrawing = false;
  private lastX = 0;
  private lastY = 0;
  private readonly canvasPreview = signal<string>('');

  initializeCanvas(canvas: HTMLCanvasElement, config?: CanvasConfig): void {
    this.ctx = canvas.getContext('2d')!;
    this.configureCanvas(canvas, config);
    this.setupEventListeners(canvas);
  }

  private configureCanvas(canvas: HTMLCanvasElement, config?: CanvasConfig): void {
    const defaultConfig: CanvasConfig = {
      width: 800,
      height: 300,
      lineWidth: 2,
      strokeStyle: '#2c3e50',
      fillStyle: '#ffffff',
      ...config
    };

    canvas.width = defaultConfig.width ?? 800;
    canvas.height = defaultConfig.height ?? 300;

    this.ctx.lineWidth = defaultConfig.lineWidth ?? 2;
    this.ctx.strokeStyle = defaultConfig.strokeStyle ?? '#000000';
    this.ctx.fillStyle = defaultConfig.fillStyle ?? '#ffffff';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  private setupEventListeners(canvas: HTMLCanvasElement): void {
    const events = {
      mouse: ['mousedown', 'mousemove', 'mouseup', 'mouseout'],
      touch: ['touchstart', 'touchmove', 'touchend']
    };

    events.mouse.forEach(event =>
      canvas.addEventListener(event as keyof HTMLElementEventMap, this.handleMouseEvent.bind(this) as EventListener)
    );

    events.touch.forEach(event =>
      canvas.addEventListener(event as keyof HTMLElementEventMap, this.handleTouchEvent.bind(this) as EventListener, { passive: false })
    );
  }

  private handleMouseEvent(event: MouseEvent): void {
    const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();
    const pos = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };

    switch(event.type) {
      case 'mousedown':
        this.startDrawing(pos);
        break;
      case 'mousemove':
        this.draw(pos);
        break;
      case 'mouseup':
      case 'mouseout':
        this.endDrawing();
        break;
    }
  }

  private handleTouchEvent(event: TouchEvent): void {
    event.preventDefault();
    const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();
    const touch = event.touches[0];
    const pos = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };

    switch(event.type) {
      case 'touchstart':
        this.startDrawing(pos);
        break;
      case 'touchmove':
        this.draw(pos);
        break;
      case 'touchend':
        this.endDrawing();
        break;
    }
  }

  private startDrawing(pos: { x: number; y: number }): void {
    this.isDrawing = true;
    [this.lastX, this.lastY] = [pos.x, pos.y];
  }

  private draw(pos: { x: number; y: number }): void {
    if (!this.isDrawing) return;

    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(pos.x, pos.y);
    this.ctx.stroke();

    [this.lastX, this.lastY] = [pos.x, pos.y];
  }

  private endDrawing(): void {
    this.isDrawing = false;
    this.updatePreview();
  }

  clearCanvas(canvas: HTMLCanvasElement): void {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.canvasPreview.set('');
  }

  getCanvasPreview(): Signal<string> {
    return this.canvasPreview.asReadonly();
  }

  private updatePreview(): void {
    this.canvasPreview.set(this.ctx.canvas.toDataURL());
  }

  getCanvasData(): Blob {
    return this.dataURLtoBlob(this.canvasPreview());
  }

  private dataURLtoBlob(dataURL: string): Blob {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
  }
}
