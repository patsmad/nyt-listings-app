<script>
  import bmtLogo from './assets/bmtlogo1.png'
  import FileList from './lib/FileList.svelte'
</script>

<main>
  <div>
    <a href="https://www.badmovietwins.com" target="_blank" rel="noreferrer">
      <img src={bmtLogo} class="logo bmt" alt="BMT Logo" />
    </a>
  </div>
  <h1>The BMT New York Times Project</h1>

  <div class="card">
    <FileList />
  </div>
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo.bmt:hover {
    filter: drop-shadow(0 0 2em #117bb7aa);
  }
</style>
