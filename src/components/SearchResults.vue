<template>
  <div>

    <div id="AdvancedAlbums"
         class="advancedtitle"
         v-if="searchType === '/albums'">
      <img src="../assets/album.png"
           alt="Album icon"/>
      <h1>
        Albums
      </h1>
    </div>

    <div id="AdvancedArtists"
         class="advancedtitle"
         v-if="searchType === '/artists'">
      <img src="../assets/artist.png"
           alt="Artist icon"/>
      <h1>
        Artists
      </h1>
    </div>

    <div id="AdvancedTracks"
         class="advancedtitle"
         v-if="searchType === '/tracks'">
      <img src="../assets/track.png"
           alt="Track icon"/>
      <h1>
        Tracks
      </h1>
    </div>

    <div id="AdvancedUsers"
         class="advancedtitle"
         v-if="searchType === '/users'">
      <img src="../assets/user.png"
           alt="User icon"/>
      <h1>
        Users
      </h1>
    </div>

    <div id="artists"
         class="list"
         v-if="artists && artists.length">
      <h1 v-if="searchType === ''">
        List of artists
      </h1>
      <ul id="list-artists"
          class="home-ul">
        <li class="home-li"
            v-for="(artist, index) in artists"
            v-bind:key="artist.artistId"
            v-if="index <=7">
          {{artist.artistName}}
          <div class="genre-artist">
            {{artist.primaryGenreName}}
          </div>
          <div>
            <router-link to="/artist">
              <button v-on:click="routeArtist(artist)" class="button-albums">
                See albums
              </button>
            </router-link>
          </div>
          <apple-badge v-bind:i-tune-link="artist.artistLinkUrl"/>
        </li>
      </ul>
    </div>

    <div id="albums"
         class="list"
         v-if="albums && albums.length">
      <h1 v-if="searchType === 'global'">
        List of albums
      </h1>
      <ul id="list-albums"
          class="home-ul">
        <li class="home-li"
            v-for="(album, index) in albums"
            v-bind:key="album.collectionId"
            v-if="index <=7">
          <img class="image"
               alt="Album art"
               v-bind:src="album.artworkUrl100">
          <div class="album-title">
            {{album.collectionName}}
          </div>
          <div class="genre-album">
            {{album.primaryGenreName}} - {{album.trackCount}} Titles
            <br/>
            {{album.releaseDate | crop}}
          </div>
          <div>
            <router-link to="/album">
              <button v-on:click="routeAlbum(album)" class="button-tracks">
                See music tracks
              </button>
            </router-link>
            <div v-if="loggedIn()"
                 class="dropdown"
                 ref="playlistDropdown">
              <a class="dropdown-button"
                 v-on:click="isPlaylistDropdownVisible[index] = !isPlaylistDropdownVisible[index]">+</a>
              <div class="dropdown-content"
                   v-if="isPlaylistDropdownVisible[index]">
                <section id="add-all-tracks">
                  <select v-model="selectedPlaylist">
                    <option value="Select playlist">
                      Select playlist
                    </option>
                    <option v-for="playlist in playlists"
                            v-bind:key="playlist.id"
                            v-bind:value="playlist">
                      {{ playlist.name }}
                    </option>
                  </select>
                  <button class="add-all-tracks-button"
                          v-on:click="addAllTracksToPlaylist(selectedPlaylist.id, album)">
                    Add all tracks to playlist
                  </button>
                </section>
              </div>
            </div>

          </div>
          <apple-badge v-bind:i-tune-link="album.collectionViewUrl"/>
        </li>
      </ul>
    </div>

    <div id="tracks"
         class="list"
         v-if="tracks && tracks.length">
      <h1 v-if="searchType === ''">
        List of tracks
      </h1>

      <div class="mainContainer">
        <div>
          <div class="track-list caption">
            <div class="track-title caption">
              Title
            </div>
            <div class="track-artist caption">
              Artist
            </div>
            <div class="track-time caption">
              Time
            </div>
            <div class="track-play-button caption">
              Play
            </div>
            <div v-if="loggedIn()"
                 class="track-add-playlist caption">
              Add
            </div>
          </div>

          <ul v-if="tracks && tracks.length">
            <li v-for="(track, index) in tracks"
                v-bind:key="track.trackId"
                v-if="index <=7">
              <div class="track-list">
                <div class="track-title">
                  {{track.trackName}}
                </div>
                <div class="track-artist">
                  {{track.artistName}}
                </div>
                <div class="track-time">
                  {{getTimeFromMillis(track.trackTimeMillis)}}
                </div>
                <div class="track-play-button">
                  <audio controls>
                    <source type="audio/mpeg"
                            v-bind:src="track.previewUrl">
                  </audio>
                </div>
                <div v-if="loggedIn()"
                     class="track-add-playlist">
                  <select v-model="selectedPlaylist">
                    <option value="Select playlist">
                      Select playlist
                    </option>
                    <option v-for="playlist in playlists"
                            v-bind:key="playlist.id"
                            v-bind:value="playlist">
                      {{ playlist.name }}
                    </option>
                  </select>
                  <button v-on:click="addTrackToPlaylist(selectedPlaylist.id, track)">
                    Add to playlist
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>


    <div id="users"
         class="list"
         v-if="users && users.length">
      <h1 v-if="searchType === ''">
        List of Users
      </h1>

      <ul id="list-users"
          class="home-ul">
        <li class="home-li-user"
            v-for="(user, index) in users"
            v-bind:key="user.id"
            v-if="index <=7">
          <router-link to="/user">
            <img class="imageusers"
                 src="../assets/user.png"
                 alt="User icon"
                 v-on:click="routeUser(user)">
          </router-link>
          <div class="username">
            {{user.name}}
          </div>

          <div v-if="loggedIn()">
            <div id="follow">
              <button class="follow-button"
                      v-if="user.id !== '5bf76146cee1510004a66c0f' && !isFollowed(user.id)"
                      v-on:click="followUser(user.id)">
                Follow
              </button>
              <button class="follow-stop-button"
                      v-if="user.id !== '5bf76146cee1510004a66c0f' && isFollowed(user.id)"
                      v-on:click="stopFollowUser(user.id)">
                Unfollow
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
  import * as api from '@/api/api';
  // TODO(Eric): Remove this
  import * as main from '@/main';
  import getUserPlaylists from '@/mixins/getUserPlaylists';
  import getTimeFromMillis from '@/mixins/getTimeFromMillis';
  import loggedIn from '@/mixins/loggedIn';
  import * as resultsSharing from '@/mixins/resultsSharing';
  import AppleBadge from './AppleBadge';

  export default {
    name: 'SearchResults',

    components: {
      AppleBadge,
    },

    filters: {
      crop(value) {
        return value.slice(0, 10);
      }
    },

    mixins: [getUserPlaylists, getTimeFromMillis, loggedIn],

    data: () => ({
      searchType: '',
      results: [],
      artists: [],
      albums: [],
      tracks: [],
      users: [],
      playlists: [],
      selectedPlaylist: 'Select playlist',
      isPlaylistDropdownVisible: {
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false
      }
    }),
    methods: {
      routeArtist(artist) {
        resultsSharing.setArtist(artist);
      },
      routeAlbum(album) {
        resultsSharing.setAlbum(album);
      },
      routeUser(user) {
        resultsSharing.setUser(user);
      },
      async setUserPlaylists() {
        if (this.loggedIn()) {
          // TODO(Eric): Remove hardcoded user
          this.playlists = await this.getUserPlaylists('5bf76146cee1510004a66c0f');
        }
      },

      async addTrackToPlaylist(idPlaylist, track) {
        await api.addTrackToPlaylist(idPlaylist, track);
      },

      async addAllTracksToPlaylist(idPlaylist, album) {
        const tracks = await api.getTracks(album.collectionId);
        tracks.forEach(async (track) => {
          await api.addTrackToPlaylist(idPlaylist, track);
        });
      },
      isFollowed(id) {
        if (id === '') return false;
        let followed = false;
        if (this.user) {
          const myFriends = this.friends;
          myFriends.forEach((friend) => {
            if (friend.id === id) {
              followed = true;
            }
          });
        }
        return followed;
      },

      async followUser(userId) {
        await api.followUser(userId)
          .then(this.getUser(userId));
      },

      async stopFollowUser(userId) {
        await api.unfollowUser(userId)
          .then(this.getUser(userId));
      }
    },

    created() {
      this.artists = main.getartists();
      this.albums = main.getalbums();
      this.tracks = main.gettracks();
      this.users = main.getusers();
      this.setUserPlaylists();
    },

    mounted() {
      this.$nextTick(() => {
        const mContext = this;
        this.$root.$on('search', (searchtype) => {
          this.searchType = searchtype;
          main.setartists([]);
          main.setalbums([]);
          main.settracks([]);
          mContext.artists = [];
          mContext.albums = [];
          mContext.tracks = [];
          main.setusers([]);
          mContext.users = [];
        });

        this.$root.$on('searchresult', (results) => {
          results.forEach((result) => {
            if (result.wrapperType === 'track') {
              mContext.tracks.push(result);
            } else if (result.wrapperType === 'collection') {
              mContext.albums.push(result);
            } else if (result.wrapperType === 'artist') {
              mContext.artists.push(result);
            }
          });
          main.setartists(mContext.artists);
          main.setalbums(mContext.albums);
          main.settracks(mContext.tracks);
        });

        this.$root.$on('userSearch', (results) => {
          results.forEach((result) => {
            mContext.users.push(result);
          });
          main.setusers(mContext.users);
        });
      });
    }

  };
</script>

<style scoped>
  .list {
    text-align: center;
  }

  .home-ul {
    list-style-type: none;
    text-align:      center;
  }

  @media screen and (max-width: 370px) {
    .home-ul {
      padding-left: 20px;
    }
  }

  .home-li {
    width:            280px;
    height:           280px;
    font-size:        1.5em;
    background-image: linear-gradient(#404040, #202020);
    display:          inline-flex;
    flex-direction:   column;
    justify-content:  space-around;
    text-align:       center;
    border:           solid #4f4f4f;
    border-radius:    10px;
    margin:           0 50px 50px 0;
    align-items:      stretch;
  }

  .genre-artist {
    margin-top: -30px;
    font-size:  16px;
  }

  .genre-album {
    margin-top: 30px;
    font-size:  16px;
  }

  .image {
    width:       100px;
    height:      100px;
    margin-left: 18px;
    margin-top:  10px;
  }

  .album-title {
    margin-left: 110px;
    margin-top:  -80px;
    padding:     0 10px;
    min-height:  50px;
  }

  .button-albums {
    background-color: dodgerblue;
    border:           dodgerblue;
    border-radius:    8px;
    color:            white;
    font-weight:      bold;
    font-size:        16px;
    padding:          10px 10px;
    cursor:           pointer;
  }


  .button-albums:hover {
    background-color: #1053aa
  }

  .button-tracks {
    background-color: darkorange;
    border:           darkorange;
    border-radius:    10px;
    color:            white;
    font-weight:      bold;
    font-size:        16px;
    padding:          10px 10px;
    cursor:           pointer;
  }

  .button-tracks:hover {
    background-color: #c37e00;
  }

  h1 {
    margin-left: 5%;
  }

  h2 {
    text-align: center;
    margin-top: -40px
  }

  ul {
    list-style-type: none;
    padding-left:    0;
  }

  .track-list {
    display:         flex;
    flex-wrap:       nowrap;
    justify-content: space-between;
    align-items:     center;
    text-align:      center;
    border-bottom:   1px solid white;
    padding:         6px 0 0 0;
  }

  .track-list > .track-title {
    flex-grow: 2;
    max-width: 20%;
  }

  .track-list > .track-play-button {
    flex-grow: 4;
    max-width: 35%
  }

  .track-list > .track-artist, .track-list > .track-time, .track-list > {
    flex-grow: 1;
    max-width: 8%;
  }

  .track-list > .caption {
    font-weight: bold;
    font-size:   1.25em;
  }

  .track-play-button > img {
    width:  30px;
    cursor: pointer;
  }

  .advancedtitle {
    padding-top:    20px;
    padding-left:   30px;
    display:        flex;
    flex-direction: row;
  }

  .advancedtitle > img {
    width:  96px;
    height: 96px;
  }

  .advancedtitle > h1 {
    margin-left: 20px;
    margin-top:  50px;
  }

  .home-li-user {
    width:            280px;
    height:           280px;
    font-size:        1.5em;
    background-image: linear-gradient(#404040, #202020);
    display:          inline-flex;
    flex-direction:   column;
    justify-content:  space-around;
    text-align:       center;
    border:           solid #4f4f4f;
    border-radius:    10px;
    margin:           0 50px 50px 0;
    /*align-items: stretch;*/
  }

  .username {

  }

  .button-follow {
    background-color: dodgerblue;
    border:           dodgerblue;
    border-radius:    8px;
    color:            white;
    font-weight:      bold;
    font-size:        16px;
    padding:          10px 10px;
    cursor:           pointer;
  }

  .imageusers {
    align-self:  center;
    padding-top: 20px;
    width:       100px;
    height:      100px;
  }

  .dropdown-button {
    background-color: #4f4f4f;
    color:            #b7b7b7;
    padding:          8px;
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

  .follow-button {
    background-color: green;
    border:           green;
    border-radius:    10px;
    font-size:        20px;
    padding:          8px 8px;
    color:            white;
    font-weight:      bold;
    cursor:           pointer;
  }

  .follow-stop-button {
    background-color: red;
    border:           red;
    border-radius:    10px;
    font-size:        20px;
    padding:          8px 8px;
    color:            white;
    font-weight:      bold;
    cursor:           pointer;
  }
</style>
