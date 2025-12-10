<script lang="ts">
  import { onMount } from 'svelte';
  import type { Id } from '$convex/_generated/dataModel';

  type Point = { x: number; y: number };
  type Stroke = { points: Point[]; color: string; width: number };

  interface Props {
    strokes: Stroke[];
    onStrokeComplete: (stroke: Stroke) => void;
    onClear: () => void;
    onDelete: () => void;
    updatedAt: number;
  }

  let { strokes, onStrokeComplete, onClear, onDelete, updatedAt }: Props =
    $props();

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null = null;
  let isDrawing = $state(false);
  let currentStroke = $state<Point[]>([]);
  let selectedColor = $state('#ffffff');
  let strokeWidth = $state(3);

  const colors = [
    '#ffffff',
    '#ef4444',
    '#f97316',
    '#eab308',
    '#22c55e',
    '#3b82f6',
    '#8b5cf6',
    '#ec4899'
  ];

  onMount(() => {
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  });

  function resizeCanvas() {
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    redraw();
  }

  function redraw() {
    if (!ctx || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, rect.width, rect.height);

    for (const stroke of strokes) {
      drawStroke(stroke);
    }

    if (currentStroke.length > 0) {
      drawStroke({
        points: currentStroke,
        color: selectedColor,
        width: strokeWidth
      });
    }
  }

  function drawStroke(stroke: Stroke) {
    if (!ctx || stroke.points.length < 2) return;

    ctx.beginPath();
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
    for (let i = 1; i < stroke.points.length; i++) {
      ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
    }
    ctx.stroke();
  }

  function getPosition(e: MouseEvent | TouchEvent): Point {
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  function startDrawing(e: MouseEvent | TouchEvent) {
    e.preventDefault();
    isDrawing = true;
    currentStroke = [getPosition(e)];
  }

  function draw(e: MouseEvent | TouchEvent) {
    if (!isDrawing) return;
    e.preventDefault();
    currentStroke = [...currentStroke, getPosition(e)];
    redraw();
  }

  function stopDrawing() {
    if (!isDrawing) return;
    isDrawing = false;
    if (currentStroke.length > 1) {
      onStrokeComplete({
        points: currentStroke,
        color: selectedColor,
        width: strokeWidth
      });
    }
    currentStroke = [];
  }

  $effect(() => {
    strokes;
    updatedAt;
    redraw();
  });
</script>

<div class="flex flex-col gap-3">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      {#each colors as color}
        <button
          onclick={() => (selectedColor = color)}
          class="h-6 w-6 rounded-full border-2 transition-transform hover:scale-110"
          style="background-color: {color}; border-color: {selectedColor ===
          color
            ? '#fff'
            : 'transparent'}"
          aria-label="Select color {color}"
        ></button>
      {/each}
    </div>
    <div class="flex items-center gap-2">
      <input
        type="range"
        min="1"
        max="20"
        bind:value={strokeWidth}
        class="h-2 w-20 cursor-pointer appearance-none rounded-lg bg-slate-600"
      />
      <span class="w-6 text-xs text-slate-400">{strokeWidth}</span>
    </div>
  </div>

  <canvas
    bind:this={canvas}
    onmousedown={startDrawing}
    onmousemove={draw}
    onmouseup={stopDrawing}
    onmouseleave={stopDrawing}
    ontouchstart={startDrawing}
    ontouchmove={draw}
    ontouchend={stopDrawing}
    class="h-48 w-full cursor-crosshair rounded-lg touch-none"
  ></canvas>

  <div class="flex items-center justify-between border-t border-slate-700 pt-3">
    <span class="text-xs text-slate-500">
      Updated {new Date(updatedAt).toLocaleTimeString()}
    </span>
    <div class="flex gap-2">
      <button
        onclick={onClear}
        class="text-sm text-slate-500 transition-colors hover:text-slate-300"
      >
        Clear
      </button>
      <button
        onclick={onDelete}
        class="text-sm text-slate-500 transition-colors hover:text-red-400"
      >
        Delete
      </button>
    </div>
  </div>
</div>
