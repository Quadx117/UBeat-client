<template>
  <nav>
    <div id="burger-button"
         v-on:click="responsiveBurger"
         v-on:mouseenter="menuImage = '/static/menuHover.png'"
         v-on:mouseleave="menuImage = '/static/menu.png'">
      <img alt="burger menu"
           v-bind:src="menuImage"/>
    </div>

    <ul id="nav-bar"
        class="top-nav">

      <li id="app-name">
        <router-link to="/">UBeat</router-link>
      </li>

      <!-- Search component -->
      <li v-if="loggedIn">
        <div class="dropdown"
             ref="searchDropdown">
          <input type="search"
                 id="main-search"
                 name="main_q"
                 placeholder="Search..."
                 autocomplete="off"
                 v-model="searchInput"
                 v-on:keyup.enter="search_flag_on_focus = false; routeToResults()"
                 v-on:focus="search_flag_on_focus = true"
                 v-on:blur="search_flag_on_focus = false"
                 v-on:keyup="autocomplete()">

          <div class="dropdown-search_result"
               v-if="search_flag_on_focus && searchInput !== ''">
            <div class="search-result"
                 id="search-result"
                 v-for="result of autocompleteresults"
                 v-bind:key="result.collectionId"
                 v-on:mousedown="searchInput = result">
              {{result}}
            </div>
          </div>
        </div>

        <img id="search-button"
             src="../assets/search.png"
             alt="Search button"
             v-on:click="routeToResults">
        <div class="dropdown"
             ref="searchDropdown">
          <a class="dropdown-button"
             v-on:click="isSearchDropdownVisible = !isSearchDropdownVisible">
            ...
          </a>
          <div class="dropdown-content"
               v-if="isSearchDropdownVisible">
            <div>
              <input type="radio"
                     id="global-radio"
                     value=""
                     checked
                     v-model="searchType">
              <label for="global-radio">Global</label>
            </div>
            <div>
              <input type="radio"
                     id="artist-radio"
                     value="/artists"
                     v-model="searchType">
              <label for="artist-radio">Artist</label>
            </div>
            <div>
              <input type="radio"
                     id="album-radio"
                     value="/albums"
                     v-model="searchType">
              <label for="album-radio">Album</label>
            </div>
            <div>
              <input type="radio"
                     id="track-radio"
                     value="/tracks"
                     v-model="searchType">
              <label for="track-radio">Track</label>
            </div>
            <div>
              <input type="radio"
                     id="user-radio"
                     value="/users"
                     v-model="searchType">
              <label for="user-radio">User</label>
            </div>
          </div>
        </div>
      </li>

      <li v-if="loggedIn">
        <router-link to="/">Home</router-link>
      </li>

      <li>
        <router-link v-if="loggedIn"
                     to="/playlist">
          Playlist
        </router-link>
      </li>

      <!-- User dropdown with profile and logout -->
      <li v-if="loggedIn">
        <div class="dropdown"
             ref="userDropdown"
             v-on:click="isUserDropdownVisible = !isUserDropdownVisible">
          <a class="dropdown-button">
            <router-link to="#">{{username}}</router-link>
            <img src="../assets/arrow_down.png"
                 alt="Scroll Arrow"/>
          </a>
          <div class="dropdown-content"
               v-if="isUserDropdownVisible">
            <router-link to="/user">
              <img src="../assets/settings.png"
                   alt="Settings Icon"/>
              Profile
            </router-link>
            <router-link to="#">
              <div v-on:click="logout">
                <img src="../assets/sign-out-option.png"
                     alt="Sign Out Icon"/>
                Sign out
              </div>
            </router-link>
          </div>
        </div>
      </li>

      <li>
        <router-link v-if="!loggedIn"
                     to="/login">
          Sign in
        </router-link>
      </li>

      <li>
        <router-link v-if="!loggedIn"
                     to="/signup">
          Sign up
        </router-link>
      </li>

    </ul>

  </nav>
</template>

<script>
  import * as api from '@/api/api';

  export default {
    name: 'NavigationBar',

    data: () => ({
      username: '',
      searchInput: '',
      searchType: '',
      menuImage: '/static/menu.png',
      isUserDropdownVisible: false,
      isSearchDropdownVisible: false,
      autocompleteresults: [],
      search_flag_on_focus: false
    }),

    computed: {
      loggedIn() {
        return (this.username !== '');
      }
    },

    async created() {
      document.addEventListener('click', this.documentClick);

      // TODO(Eric): Test code
      // const user = await api.login('ericperron@videotron.ca', '123');
      // this.username = user.name;
      // console.log(user);

      // NOTE(Eric): signup test code
      // const newUser = await api.signup('testName', 'test.email4@example.com', 'password');
      // console.log(newUser);

      // NOTE(Eric): getTokenInfo test code
      // const tokenInfo = await api.getTokenInfo();
      // console.log(tokenInfo);

      // NOTE(Eric): getUsers test code
      // const users = await api.getUsers();
      // console.log(users);

      // NOTE(Eric): getUser test code
      // const user2 = await api.getUser('5aa98b47297d410004d815b8');
      // console.log(user2);

      // NOTE(Eric): followUser test code
      // const res1 = await api.followUser('5c0407feef04250004770d5f');
      // console.log(res1);

      // NOTE(Eric): unfollowUser test code
      // const res2 = await api.unfollowUser('5c0407feef04250004770d5f');
      // console.log(res2);

      // NOTE(Eric): getAlbum test code
      // const albums = await api.getAlbum('1125488753');
      // console.log(albums);

      // NOTE(Eric): getTracks test code
      // const tracks = await api.getTracks('1125488753');
      // console.log(tracks);

      // NOTE(Eric): getArtist test code
      // const artist = await api.getArtist('47123955');
      // console.log(artist);

      // NOTE(Eric): getAlbums test code
      // const albums = await api.getAlbums('47123955');
      // console.log(albums);

      // NOTE(Eric): getAllPlaylists test code
      // const playlists = await api.getAllPlaylists();
      // console.log(playlists);

      // NOTE(Eric): getPlaylist test code
      // const playlist = await api.getPlaylist('5be34f2b3efbda00044efd81');
      // console.log(playlist);

      // NOTE(Eric): playlist test code
      /* let playlist2 = await api.createPlaylist('Test Playlist');
      console.log('createPlaylist');
      console.log(playlist2);
      playlist2 = await api.editPlaylist(playlist2.id, 'Test Playlist modified');
      console.log('editPlaylist');
      console.log(playlist2);
      const tracks = await api.getTracks('1125488753');
      const track = tracks[0];
      playlist2 = await api.addTrackToPlaylist(playlist2.id, track);
      console.log('addTrackToPlaylist');
      console.log(playlist2);
      playlist2 = await api.removeTrackFromPlaylist(playlist2.id, track.trackId);
      console.log('removeTrackFromPlaylist');
      console.log(playlist2);
      const message = await api.deletePlaylist(playlist2.id);
      console.log('deletePlaylist');
      console.log(message); */
    },

    mounted() {
      this.$nextTick(() => {
        this.$root.$on('loginSuccessful', (username) => {
          this.username = username;
        });
      });
    },

    destroyed() {
      document.removeEventListener('click', this.documentClick);
    },

    methods: {
      logout() {
        const result = api.logout();
        if (result) {
          this.username = '';
          this.$router.push('/login');
        }
      },

      responsiveBurger() {
        const navbar = document.getElementById('nav-bar');
        if (navbar.className === 'top-nav') {
          navbar.className += '-responsive';
        } else {
          navbar.className = 'top-nav';
        }
      },

      async search() {
        this.$root.$emit('search', this.searchType);
        // NOTE(Eric): This could potentially be simplified (see comment in api.js)
        const queryString = `?q=${encodeURIComponent(this.searchInput)}`;
        if (this.searchType === '/users') {
          const user = await api.userSearch(queryString);
          this.$root.$emit('userSearch', user);
        } else {
          const result = await api.globalSearch(`${this.searchType}${queryString}`);
          this.$root.$emit('searchresult', result);
        }
      },
      async autocomplete() {
        const queryString = `?q=${encodeURIComponent(this.searchInput)}`;
        const results = await api.globalSearch(`${this.searchType}${queryString}`);
        this.autocompleteresults = [];
        results.forEach((result) => {
          if (result.wrapperType === 'track') {
            this.autocompleteresults.push(result.trackName);
          } else if (result.wrapperType === 'collection') {
            this.autocompleteresults.push(result.collectionName);
          } else if (result.wrapperType === 'artist') {
            this.autocompleteresults.push(result.artistName);
          }
        });
      },

      routeToResults() {
        if (this.searchInput !== '') {
          this.search();
          this.$router.push('/search');
        }
      },

      documentClick(e) {
        if (this.loggedIn) {
          const target = e.target;

          const userDropdown = this.$refs.userDropdown;
          if (userDropdown !== target && !userDropdown.contains(target)) {
            this.isUserDropdownVisible = false;
          }

          const searchDropdown = this.$refs.searchDropdown;
          if (searchDropdown !== target && !searchDropdown.contains(target)) {
            this.isSearchDropdownVisible = false;
          }
        }
      }
    }

  };
</script>

<style scoped>
  nav {
    background-color: #303030;
    font-size:        large;
    padding:          10px;
    position:         fixed;
    top:              0;
    left:             0;
    width:            100%;
    min-height:       50px;
    z-index:          10;
  }

  nav ul {
    list-style-type:      none;
    margin:               0;
    padding-inline-start: 0;
    text-align:           center;
  }

  nav li {
    display:       inline;
    padding-left:  10px;
    padding-right: 10px;
  }

  nav a {
    display:         inline-block;
    margin:          2px;
    text-decoration: none;
  }

  nav a:link, nav a:visited {
    color: #9e9e9e;
  }

  nav a:hover, nav a:active, nav a:focus {
    color: white;
  }

  #burger-button {
    display: none;
    cursor:  pointer;
  }

  #main-search {
    background-color: #e1e1e1;
    color:            #202020;
    border-radius:    6px;
  }

  #search-button {
    width:          20px;
    height:         20px;
    padding-left:   0;
    vertical-align: middle;
    horiz-align:    left;
    cursor:         pointer;
  }

  .dropdown-button {
    background-color: #4f4f4f;
    color:            #b7b7b7;
    padding:          16px;
    border-radius:    6px;
    font-size:        large;
    border:           none;
    cursor:           pointer;
  }

  .dropdown {
    display: inline-block;
  }

  .dropdown-content {
    position:                   absolute;
    background-color:           #4f4f4f;
    min-width:                  160px;
    box-shadow:                 0 8px 16px 0 rgba(0, 0, 0, 0.2);
    z-index:                    1;
    border-bottom-left-radius:  6px;
    border-bottom-right-radius: 6px;
  }

  .dropdown-content a {
    padding:         12px 16px;
    text-decoration: none;
    display:         block;
    font-size:       large;
  }

  .dropdown-content a:hover {
    background-color: #dddddd
  }

  .dropdown-search_result {
    position:                   absolute;
    background-color:           #4f4f4f;
    min-width:                  160px;
    max-width:                  300px;
    box-shadow:                 0 8px 16px 0 rgba(0, 0, 0, 0.2);
    z-index:                    1;
    border-bottom-left-radius:  6px;
    border-bottom-right-radius: 6px;
  }

  .search-result {
    padding:         10px 5px;
    text-decoration: none;
    display:         block;
    font-size:       medium;
  }

  .search-result:hover {
    background-color: #dddddd
  }

  @media screen and (max-width: 800px) {
    nav li {
      display: block;
      width:   100%;
    }

    #main-search {
      width: 70%;
    }

    #burger-button {
      display:  block;
      position: fixed;
      left:     10px;
      top:      15px;
      z-index:  999;
    }

    .dropdown-button {
      background-color: transparent;
      padding:          0;
    }

    .dropdown-content {
      background-color: transparent;
      box-shadow:       none;
    }

    .dropdown-content a {
      padding:    0 0 0 20px;
      text-align: left;
    }

    .dropdown-content a:hover {
      background-color: transparent
    }

    .top-nav li:not(#app-name) {
      display: none;
    }

    .top-nav-responsive {
      min-height: 200px;
    }

    #search-result {
      margin-left:      140px;
      width:            200px;
      background-color: white;
      color:            black
    }

    #search-result:hover {
      background-color: darkgray;
    }
  }
</style>
