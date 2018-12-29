<template>
  <div>

    <div class="main-container">

      <!-- Album info -->
      <section id="album-container">
        <img v-bind:srcset="`${albumArt60} 60w, ${albumArt100} 100w`"
             sizes="(max-width: 370px) 100px,
                  (max-width: 667px) 150px,
                  200px"
             v-bind:src="albumArt100"
             v-bind:alt="albumTitle">
        <div class="album-info">
          <h1 id="album-info-name">
            {{albumTitle}}
          </h1>
          <div id="album-info-artist">
            {{albumArtist}}
          </div>
          <div id="album-info-other">
            {{albumDate}} • {{albumTrackCount}} tracks • {{albumGenre}}
          </div>
          <apple-badge v-bind:i-tune-link="iTuneLink"/>
        </div>
      </section>

      <!-- Add all tracks -->
      <section v-if="loggedIn()"
               id="add-all-tracks">
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
                v-on:click="addAllTracksToPlaylist(selectedPlaylist.id, tracks)">
          Add all tracks to playlist
        </button>
      </section>

      <!-- Album Tracks -->
      <section>
        <album-tracks v-bind:playlists="playlists"
                      v-bind:tracks="tracks"/>
      </section>
    </div>

  </div>
</template>

<script>
  import * as api from '@/api/api';
  import getUserPlaylists from '@/mixins/getUserPlaylists';
  import loggedIn from '@/mixins/loggedIn';
  import * as resultsSharing from '@/mixins/resultsSharing';

  import AppleBadge from './AppleBadge';
  import AlbumTracks from './AlbumTracks';

  export default {
    name: 'Album',

    components: {
      AppleBadge,
      AlbumTracks
    },

    mixins: [getUserPlaylists, loggedIn],

    data: () => ({
      selectedPlaylist: 'Select playlist',
      albumId: '1272939712',
      albumArt60: '',
      albumArt100: '',
      albumTitle: '',
      albumArtist: '',
      albumDate: new Date(),
      albumTrackCount: 0,
      albumGenre: '',
      iTuneLink: '',
      tracks: [],
      playlists: [],
    }),

    created() {
      // TODO(Eric): Remove this or see if we should modify the unused method below.
      // this.getAlbum();
      const album = resultsSharing.getAlbum();
      this.albumId = album.collectionId;
      this.albumArt60 = album.artworkUrl60;
      this.albumArt100 = album.artworkUrl100;
      this.albumTitle = album.collectionName;
      this.albumArtist = album.artistName;
      this.albumDate = new Date(album.releaseDate).getFullYear();
      this.albumTrackCount = album.trackCount;
      this.albumGenre = album.primaryGenreName;
      this.iTuneLink = album.collectionViewUrl;
      this.getTracks();
      this.setUserPlaylists();
    },

    methods: {
      async getAlbum() {
        const album = await api.getAlbum(this.albumId);
        this.albumArt60 = album.artworkUrl60;
        this.albumArt100 = album.artworkUrl100;
        this.albumTitle = album.collectionName;
        this.albumArtist = album.artistName;
        this.albumDate = new Date(album.releaseDate).getFullYear();
        this.albumTrackCount = album.trackCount;
        this.albumGenre = album.primaryGenreName;
        this.iTuneLink = album.collectionViewUrl;
      },

      async getTracks() {
        this.tracks = await api.getTracks(this.albumId);
      },

      async setUserPlaylists() {
        if (this.loggedIn()) {
          // TODO(Eric): Remove hardcoded user here
          this.playlists = await this.getUserPlaylists('5bf76146cee1510004a66c0f');
        }
      },

      async addTrackToPlaylist(idPlaylist, track) {
        await api.addTrackToPlaylist(idPlaylist, track);
      },

      async addAllTracksToPlaylist(idPlaylist, tracks) {
        tracks.forEach(async (track) => {
          await api.addTrackToPlaylist(idPlaylist, track);
        });
      },
    }

  };
</script>

<style scoped>
  #album-container {
    display:         flex;
    flex-direction:  row;
    flex-wrap:       nowrap;
    justify-content: center;
    align-items:     center;
    overflow:        auto;
  }

  .album-info {
    padding-left: 40px;
  }

  #album-info-name {
    margin-top:    0;
    margin-bottom: 10px;
  }

  #album-info-artist {
    margin-bottom: 10px;
  }

  #album-info-other {
    color:         #8e8e93;
    margin-bottom: 10px;
  }

  #add-all-tracks {
    margin:     30px auto;
    text-align: center;
  }

  .add-all-tracks-button {
    background-color: dodgerblue;
    border:           dodgerblue;
    border-radius:    8px;
    color:            white;
    font-weight:      bold;
    font-size:        16px;
    padding:          10px 10px;
    cursor:           pointer;
  }

  @media screen and (max-width: 769px) {
    #album-container {
      display:         flex;
      flex-direction:  column;
      flex-wrap:       nowrap;
      justify-content: center;
      align-items:     center;
      overflow:        auto;
    }

    .album-info {
      padding-left: 0;
      text-align:   center;
    }

    #album-info-name {
      margin: 10px 0;
    }
  }
</style>
