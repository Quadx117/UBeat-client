<template>
  <div v-if="loggedIn()">

    <!-- My Artists section -->
    <section class="center-text">
      <h1>My Artists</h1>
      <ul class="home-ul"
          v-if="artists && artists.length">
        <li class="home-li"
            v-for="artist of artists"
            v-bind:key="artist.artistId">
          {{artist.artistName}}
          <div class="artist-genre">
            {{artist.primaryGenreName}}
          </div>
          <div>
            <router-link to="/artist">
              <button v-on:click="routeArtist(artist)"
                      class="button-albums">
                See albums
              </button>
            </router-link>
          </div>
          <apple-badge v-bind:i-tune-link="artist.artistLinkUrl"/>
        </li>
      </ul>
    </section>

    <!-- My Albums section -->
    <section class="center-text">
      <h1>My Albums</h1>
      <ul class="home-ul"
          v-if="albums && albums.length">
        <li class="home-li"
            v-for="album of albums"
            v-bind:key="album.collectionId">
          <img class="album-art"
               v-bind:src="album.artworkUrl100"/>
          <div class="album-title">
            {{album.collectionName}}
          </div>
          <div class="album-genre">
            {{album.primaryGenreName}} - {{album.trackCount}} Titles
            <br/>
            {{setFormatDate(album.releaseDate)}}
          </div>
          <div>
            <router-link to="/album">
              <button v-on:click="routeAlbum(album)"
                      class="button-tracks">
                See music tracks
              </button>
            </router-link>
          </div>
          <apple-badge v-bind:i-tune-link="album.collectionViewUrl"/>
        </li>
      </ul>
    </section>

  </div>
</template>

<script>
  import * as api from '@/api/api';
  import getUserPlaylists from '@/mixins/getUserPlaylists';
  import loggedIn from '@/mixins/loggedIn';
  import * as resultsSharing from '@/mixins/resultsSharing';
  import AppleBadge from './AppleBadge';

  export default {
    name: 'Home',

    components: {
      AppleBadge
    },

    mixins: [getUserPlaylists, loggedIn],

    data: () => ({
      artists: [],
      albums: [],
    }),

    created() {
      if (this.loggedIn()) {
        // TODO(Eric): Remove hardcoded playlist (fetch all and choose randomly)
        this.getArtistsFromPlaylists('5bf76146cee1510004a66c0f');
        this.getAlbumsFromPlaylists('5bf76146cee1510004a66c0f');
      }
    },

    methods: {
      setFormatDate(date) {
        let day = new Date(date).getDate();
        let month = new Date(date).getMonth() + 1;
        const year = new Date(date).getFullYear();
        if (day < 10) {
          day = `0${day}`;
        }
        if (month < 10) {
          month = `0${month}`;
        }
        const dateFormat = `${year}-${month}-${day}`;
        return dateFormat;
      },

      artistExist(artistId) {
        for (let i = 0; i < this.artists.length; i += 1) {
          if (this.artists[i].artistId === artistId) {
            return true;
          }
        }
        return false;
      },

      albumExist(albumId) {
        for (let i = 0; i < this.albums.length; i += 1) {
          if (this.albums[i].collectionId === albumId) {
            return true;
          }
        }
        return false;
      },

      async getArtistsFromPlaylists(userId) {
        const playlists = await this.getUserPlaylists(userId);
        playlists.forEach((playlist) => {
          playlist.tracks.forEach(async (track) => {
            if (track.artistId !== undefined) {
              const artist = await api.getArtist(track.artistId);
              if (!this.artistExist(artist.artistId)) {
                this.artists.push(artist);
              }
            }
          });
        });
      },

      async getAlbumsFromPlaylists(userId) {
        const playlists = await this.getUserPlaylists(userId);
        playlists.forEach((playlist) => {
          playlist.tracks.forEach(async (track) => {
            if (track.collectionId !== undefined) {
              const album = await api.getAlbum(track.collectionId);
              if (!this.albumExist(album.collectionId)) {
                this.albums.push(album);
              }
            }
          });
        });
      },

      routeArtist(artist) {
        resultsSharing.setArtist(artist);
      },

      routeAlbum(album) {
        resultsSharing.setAlbum(album);
      },
    }

  };
</script>

<style scoped>
  .center-text {
    text-align: center;
  }

  .home-ul {
    list-style-type: none;
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
    border:           solid #4f4f4f;
    border-radius:    10px;
    margin:           0 50px 50px 0;
    align-items:      stretch;
  }

  .artist-genre {
    margin-top: -30px;
    font-size:  16px;
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

  .album-art {
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

  .album-genre {
    margin-top: 30px;
    font-size:  16px;
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
</style>
