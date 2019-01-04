<template>
  <nav id="nav-header">

    <!-- Burger button -->
    <div v-if="showBurgerButton"
         id="burger-button"
         v-on:click="toggleBurgerMenu"
         v-on:mouseenter="menuImage = '/static/menuHover.png'"
         v-on:mouseleave="menuImage = '/static/menu.png'">
      <img style="display: block"
           alt="burger menu"
           v-bind:src="menuImage"/>
    </div>

    <ul id="nav-bar-ul">

      <!-- App name -->
      <router-link class="nav-bar-item"
                   tag="li"
                   to="/">
        <a class="nav-link">
          UBeat
        </a>
      </router-link>

      <!-- Search component -->
      <li v-if="showNavBarItem"
          class="nav-bar-item">
        <div style="display: inline-block"
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

          <div class="dropdown-search-result"
               v-if="search_flag_on_focus && searchInput !== ''">
            <div id="search-result"
                 v-for="result of autocompleteResults"
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
        <div style="display: inline-block"
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
              <label for="global-radio">
                Global
              </label>
            </div>
            <div>
              <input type="radio"
                     id="artist-radio"
                     value="/artists"
                     v-model="searchType">
              <label for="artist-radio">
                Artist
              </label>
            </div>
            <div>
              <input type="radio"
                     id="album-radio"
                     value="/albums"
                     v-model="searchType">
              <label for="album-radio">
                Album
              </label>
            </div>
            <div>
              <input type="radio"
                     id="track-radio"
                     value="/tracks"
                     v-model="searchType">
              <label for="track-radio">
                Track
              </label>
            </div>
            <div>
              <input type="radio"
                     id="user-radio"
                     value="/users"
                     v-model="searchType">
              <label for="user-radio">
                User
              </label>
            </div>
          </div>
        </div>
      </li>

      <router-link v-if="showNavBarItem"
                   class="nav-bar-item"
                   tag="li"
                   to="/">
        <a class="nav-link">
          Home
        </a>
      </router-link>

      <router-link v-if="loggedIn() && showNavBarItem"
                   class="nav-bar-item"
                   tag="li"
                   to="/playlist">
        <a class="nav-link">
          Playlists
        </a>
      </router-link>

      <!-- User dropdown with profile and logout -->
      <li v-if="loggedIn() && showNavBarItem"
          class="nav-bar-item">
        <div style="display: inline-block"
             ref="userDropdown"
             v-on:click="isUserDropdownVisible = !isUserDropdownVisible">
          <div class="dropdown-button">
            {{username}}
            <img class="centered-vertically"
                 src="../assets/arrow_down.png"
                 alt="Scroll Arrow"/>
          </div>
          <div class="dropdown-content"
               v-if="isUserDropdownVisible">
            <router-link class="nav-link"
                         to="/user">
              <img src="../assets/settings.png"
                   alt="Settings Icon"/>
              Profile
            </router-link>
            <router-link class="nav-link"
                         to="#">
              <div v-on:click="logout">
                <img src="../assets/sign-out-option.png"
                     alt="Sign Out Icon"/>
                Sign out
              </div>
            </router-link>
          </div>
        </div>
      </li>

      <router-link v-if="!loggedIn() && showNavBarItem"
                   class="nav-bar-item"
                   tag="li"
                   to="/login">
        <a class="nav-link">
          Sign in
        </a>
      </router-link>

      <router-link v-if="!loggedIn() && showNavBarItem"
                   class="nav-bar-item"
                   tag="li"
                   to="/signup">
        <a class="nav-link">
          Sign up
        </a>
      </router-link>

    </ul>

  </nav>
</template>

<script>
  import * as api from '@/api/api';
  import loggedIn from '@/mixins/loggedIn';

  export default {
    name: 'NavigationBar',

    mixins: [loggedIn],

    data: () => ({
      username: '',
      searchInput: '',
      searchType: '',
      menuImage: '/static/menu.png',
      isUserDropdownVisible: false,
      isSearchDropdownVisible: false,
      autocompleteResults: [],
      search_flag_on_focus: false,
      showBurgerButton: false,
      showBurgerMenu: false
    }),

    computed: {
      navMinHeight: function () {
        const height = this.showBurgerMenu ? '200px' : '50px';
        return { 'min-height': height };
      },

      showNavBarItem: function () {
        let result = true;
        if (this.showBurgerButton && !this.showBurgerMenu) {
          result = false;
        }
        return result;
      }
    },

    watch: {
      // Whenever username changes, this function will run.
      username() {
        this.$forceUpdate();
      }
    },

    async created() {
      document.addEventListener('click', this.documentClick);

      window.addEventListener('resize', this.isBurgerButtonVisible);

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
      window.removeEventListener('resize', this.isBurgerButtonVisible);
    },

    methods: {
      async logout() {
        const result = await api.logout();
        if (result) {
          this.username = '';
          this.$router.push('/login');
        }
      },

      toggleBurgerMenu() {
        this.showBurgerMenu = !this.showBurgerMenu;
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
        this.autocompleteResults = [];
        results.forEach((result) => {
          if (result.wrapperType === 'track') {
            this.autocompleteResults.push(result.trackName);
          } else if (result.wrapperType === 'collection') {
            this.autocompleteResults.push(result.collectionName);
          } else if (result.wrapperType === 'artist') {
            this.autocompleteResults.push(result.artistName);
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
        const target = e.target;

        const userDropdown = this.$refs.userDropdown;
        if (userDropdown && userDropdown !== target && !userDropdown.contains(target)) {
          this.isUserDropdownVisible = false;
        }

        const searchDropdown = this.$refs.searchDropdown;
        if (searchDropdown && searchDropdown !== target && !searchDropdown.contains(target)) {
          this.isSearchDropdownVisible = false;
        }
      },

      isBurgerButtonVisible() {
        this.showBurgerButton = window.matchMedia('(max-width: 800px)').matches;
      }
    }

  };
</script>

<style scoped>
  #nav-header {
    background-color: #303030;
    font-size:        large;
    padding:          10px 0;
    position:         fixed;
    top:              0;
    left:             0;
    width:            100%;
    z-index:          10;
  }

  #burger-button {
    cursor:   pointer;
    position: fixed;
    margin:   0 10px;
    z-index:  999;
  }

  .router-link-exact-active {
    color: white;
  }

  #nav-bar-ul {
    list-style-type: none;
    margin:          0;
    padding:         0;
    text-align:      center;
  }

  .nav-bar-item {
    display: inline-block;
    padding: 0 10px;
  }

  .nav-link {
    display:         inline-block;
    text-decoration: none;
  }

  .nav-link:link,
  .nav-link:visited {
    color: #9e9e9e;
  }

  .nav-link:hover,
  .nav-link:active,
  .nav-link:focus {
    color: white;
  }

  #main-search {
    background-color: #e1e1e1;
    border-radius:    4px;
    width:            175px;
  }

  .dropdown-search-result {
    position:                   absolute;
    background-color:           #4f4f4f;
    /* Same value as the search input */
    width:                      175px;
    box-shadow:                 0 8px 16px 0 rgba(0, 0, 0, 0.2);
    z-index:                    1;
    border-bottom-left-radius:  4px;
    border-bottom-right-radius: 4px;
  }

  #search-result {
    padding:         10px 5px;
    text-decoration: none;
    display:         block;
    font-size:       medium;
  }

  #search-result:hover {
    background-color: #888888
  }

  #search-button {
    width:          20px;
    height:         20px;
    vertical-align: middle;
    cursor:         pointer;
  }

  .dropdown-button {
    background-color: #4f4f4f;
    color:            #b7b7b7;
    display:          inline-block;
    padding:          5px 10px;
    border-radius:    4px;
    border:           none;
    cursor:           pointer;
  }

  .centered-vertically {
    vertical-align: middle;
  }

  .dropdown-content {
    position:         absolute;
    background-color: #4f4f4f;
    min-width:        100px;
    box-shadow:       0 8px 16px 0 rgba(0, 0, 0, 0.2);
    z-index:          1;
    border-radius:    4px;
  }

  .dropdown-content a {
    padding:         12px 16px;
    text-decoration: none;
    display:         block;
    font-size:       large;
    text-align:      left;
  }

  .dropdown-content a:hover {
    background-color: #888888
  }

  @media screen and (max-width: 800px) {
    .nav-bar-item {
      display: block;
    }

    .dropdown-button {
      background-color: transparent;
      padding:          0;
    }
  }
</style>
