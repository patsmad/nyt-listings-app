<script>
    import bmtLogo from './assets/bmtlogo1.png'
    import FileList from './lib/FileList.svelte'
</script>

<main>
  <div class="heading">
    <div>
      <a href="https://www.badmovietwins.com" target="_blank" rel="noreferrer">
        <img src={bmtLogo} class="logo bmt" alt="BMT Logo" />
      </a>
    </div>
    <h1>BMT / New York Times</h1>
  </div>

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
  .heading {
    display: flex;
    justify-content: space-between;
  }
</style>
