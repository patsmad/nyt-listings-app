<script>
    import bmtLogo from './assets/bmtlogo1.png'
    import FileList from './lib/file/FileList.svelte'
    import LinkList from './lib/link/LinkList.svelte'
    import TitleList from './lib/title/TitleList.svelte'
    import YearList from './lib/year/YearList.svelte'
    import { ClerkProvider, SignIn, UserButton, SignedIn, SignedOut} from './lib/clerk/index.js';

    let url = new URL(window.location);
    let page = url.pathname;
</script>

<main>
  <ClerkProvider />
  <span style="float: right;">
  <UserButton
    userProfileMode="modal"
  />
  </span>
  <span class="heading">
    <div style="width: 25%;">
      <a href="https://www.badmovietwins.com" target="_blank" rel="noreferrer">
        <img src={bmtLogo} class="logo bmt" alt="BMT Logo" />
      </a>
    </div>
    <h1 style="width: 75%;">BMT / New York Times</h1>
  </span>
  <SignedOut>
    <SignIn />
  </SignedOut>
  <SignedIn>
  <span class="mean">
  <a class="btn" href="/file"><button>File Search</button></a>
  <a class="btn" href="/link"><button>Link Search</button></a>
  <a class="btn" href="/title"><button>Title Search</button></a>
  <a class="btn" href="/year"><button>Year Search</button></a>
  </span>

  {#if page === '/file' || page === '/'}
  <div class="card">
    <FileList />
  </div>
  {/if}
  {#if page === '/link'}
  <div class="card">
    <LinkList />
  </div>
  {/if}
  {#if page === '/title'}
    <div class="card">
      <TitleList />
    </div>
  {/if}
  {#if page === '/year'}
      <div class="card">
        <YearList />
      </div>
  {/if}
  </SignedIn>
</main>

<style>
  .logo {
    height: 100px;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo.bmt:hover {
    filter: drop-shadow(0 0 2em #117bb7aa);
  }
  .heading {
    display: flex;
    justify-content: space-between;
    width: 825px;
    margin: 0 auto;
  }
</style>
