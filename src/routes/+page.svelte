<script lang="ts">
  import { useQuery, useConvexClient } from 'convex-svelte';
  import { api } from '$convex/_generated/api';
  import type { Id } from '$convex/_generated/dataModel';
  import DrawingCanvas from '$lib/components/DrawingCanvas.svelte';

  const client = useConvexClient();
  const counters = useQuery(api.counters.list, () => ({}));
  const canvases = useQuery(api.canvases.list, () => ({}));

  let newCounterName = $state('');

  const colors = [
    'from-pink-500 to-rose-500',
    'from-violet-500 to-purple-500',
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500'
  ];

  function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  async function createCounter() {
    if (!newCounterName.trim()) return;
    await client.mutation(api.counters.create, {
      name: newCounterName.trim(),
      color: getRandomColor()
    });
    newCounterName = '';
  }

  async function createCanvas() {
    await client.mutation(api.canvases.create, {});
  }

  function increment(id: Id<'counters'>) {
    client.mutation(api.counters.increment, { id });
  }

  function decrement(id: Id<'counters'>) {
    client.mutation(api.counters.decrement, { id });
  }

  function reset(id: Id<'counters'>) {
    client.mutation(api.counters.reset, { id });
  }

  type Stroke = {
    points: { x: number; y: number }[];
    color: string;
    width: number;
  };

  function addStroke(id: Id<'canvases'>, stroke: Stroke) {
    client.mutation(api.canvases.addStroke, { id, stroke });
  }

  function clearCanvas(id: Id<'canvases'>) {
    client.mutation(api.canvases.clear, { id });
  }

  function removeCanvas(id: Id<'canvases'>) {
    client.mutation(api.canvases.remove, { id });
  }
</script>

<div
  class="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
>
  <div class="mx-auto max-w-6xl px-4 py-6 sm:py-12">
    <!-- Header -->
    <header class="mb-8 text-center sm:mb-16">
      <h1
        class="mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-3xl font-bold text-transparent sm:text-5xl"
      >
        Convex Realtime Demo
      </h1>
      <p class="mx-auto max-w-2xl text-sm text-slate-400 sm:text-lg">
        Open this page in multiple browser windows or devices to see changes
        sync instantly. Try clicking the counters or drawing on the canvases!
      </p>
      <div class="mt-4 flex items-center justify-center gap-2">
        <span class="relative flex h-3 w-3">
          <span
            class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"
          ></span>
          <span class="relative inline-flex h-3 w-3 rounded-full bg-green-500"
          ></span>
        </span>
        <span class="text-sm text-green-400"
          >Connected & syncing in realtime</span
        >
      </div>
    </header>

    <!-- Counters Section -->
    <section class="mb-8 sm:mb-16">
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-xl font-semibold text-white sm:text-2xl">Interactive Counters</h2>
        <form
          onsubmit={(e) => {
            e.preventDefault();
            createCounter();
          }}
          class="flex w-full gap-2 sm:w-auto"
        >
          <input
            type="text"
            bind:value={newCounterName}
            placeholder="Counter name..."
            class="min-w-0 flex-1 rounded-lg border-0 bg-slate-700/50 px-4 py-2 text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 sm:flex-none"
          />
          <button
            type="submit"
            class="shrink-0 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 font-medium text-white transition-transform hover:scale-105 active:scale-95"
          >
            Add
          </button>
        </form>
      </div>

      {#if counters.isLoading}
        <div class="flex items-center justify-center py-12">
          <div
            class="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent"
          ></div>
        </div>
      {:else if counters.data && counters.data.length > 0}
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {#each counters.data as counter (counter._id)}
            <div
              class="group relative overflow-hidden rounded-2xl bg-gradient-to-br {counter.color} p-1 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
            >
              <div class="rounded-xl bg-slate-800/90 p-6 backdrop-blur">
                <h3 class="mb-4 text-lg font-medium text-white">
                  {counter.name}
                </h3>
                <div
                  class="mb-6 text-center text-6xl font-bold text-white transition-transform duration-150"
                >
                  {counter.value}
                </div>
                <div class="flex items-center justify-center gap-3">
                  <button
                    onclick={() => decrement(counter._id)}
                    class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-700 text-2xl text-white transition-all hover:bg-slate-600 active:scale-90"
                  >
                    −
                  </button>
                  <button
                    onclick={() => reset(counter._id)}
                    class="rounded-lg bg-slate-700 px-4 py-2 text-sm text-slate-300 transition-all hover:bg-slate-600"
                  >
                    Reset
                  </button>
                  <button
                    onclick={() => increment(counter._id)}
                    class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-700 text-2xl text-white transition-all hover:bg-slate-600 active:scale-90"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <div
          class="rounded-2xl border-2 border-dashed border-slate-700 py-12 text-center"
        >
          <p class="text-slate-400">
            No counters yet. Create one to get started!
          </p>
        </div>
      {/if}
    </section>

    <!-- Canvases Section -->
    <section>
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-xl font-semibold text-white sm:text-2xl">
          Collaborative Canvases
        </h2>
        <button
          onclick={createCanvas}
          class="rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 font-medium text-white transition-transform hover:scale-105 active:scale-95"
        >
          Add Canvas
        </button>
      </div>

      {#if canvases.isLoading}
        <div class="flex items-center justify-center py-12">
          <div
            class="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"
          ></div>
        </div>
      {:else if canvases.data && canvases.data.length > 0}
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          {#each canvases.data as canvas (canvas._id)}
            <div
              class="group relative rounded-xl bg-slate-800/50 p-4 ring-1 ring-slate-700 transition-all hover:ring-blue-500/50"
            >
              <DrawingCanvas
                strokes={canvas.strokes}
                updatedAt={canvas.updatedAt}
                onStrokeComplete={(stroke) => addStroke(canvas._id, stroke)}
                onClear={() => clearCanvas(canvas._id)}
                onDelete={() => removeCanvas(canvas._id)}
              />
            </div>
          {/each}
        </div>
      {:else}
        <div
          class="rounded-2xl border-2 border-dashed border-slate-700 py-12 text-center"
        >
          <p class="text-slate-400">
            No canvases yet. Create one to get started!
          </p>
        </div>
      {/if}
    </section>

    <!-- Instructions -->
    <footer class="mt-8 text-center sm:mt-16">
      <div class="rounded-xl bg-slate-800/30 p-6">
        <h3 class="mb-3 font-medium text-white">How to test realtime sync</h3>
        <ol class="mx-auto max-w-md space-y-2 text-left text-sm text-slate-400">
          <li>1. Open this page in a second browser window</li>
          <li>2. Position both windows side by side</li>
          <li>3. Click a counter button in one window</li>
          <li>4. Watch the value update instantly in both windows!</li>
          <li>5. Try drawing on a canvas to see live scribble sync</li>
        </ol>
      </div>
    </footer>
  </div>
</div>
