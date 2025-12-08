<script lang="ts">
  import './layout.css';
  import { setupConvex } from 'convex-svelte';
  import { PUBLIC_CONVEX_URL } from '$env/static/public';

  setupConvex(PUBLIC_CONVEX_URL);

  let { children } = $props();
</script>

<svelte:head>
  <title>Convex Realtime Demo</title>
  <meta name="description" content="Realtime sync demo with Convex" />
</svelte:head>

{@render children()}
