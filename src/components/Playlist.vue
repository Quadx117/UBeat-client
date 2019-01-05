<template>
  <div>
    <h1 class="centered-text">
      Playlists
    </h1>

    <!-- New Playlist Section -->
    <section class="centered-text">
      <label for="new-playlist-name">
        New playlist:
      </label>
      <input id="new-playlist-name"
             type="text"
             placeholder="Playlist name..."
             v-model="newPlaylistName"/>
      <button id="create-playlist-button"
              v-on:click="createPlaylist">
        Create playlist
      </button>
    </section>

    <!-- Add Track Section -->
    <section id="section-add-track"
             class="centered-text"
             v-if="playlists && playlists.length">
      <div id="search">
        <label for="search-track-name">
          Add track to playlist:
        </label>
        <div id="search-wrapper">
          <input id="search-track-name"
                 type="search"
                 placeholder="Search tracks..."
                 v-model="trackSearch"
                 v-on:focus="flag_on_focus = true"
                 v-on:blur="flag_on_focus = false"
                 v-on:keyup="searchTracks()">
          <div v-if="flag_on_focus && trackSearch !== ''"
               id="search-result"
               v-for="track of searchedTracks"
               v-bind:key="track.collectionId"
               v-on:mousedown="selectTrack(track)">
            {{track.trackName}}, {{track.artistName}}
          </div>
        </div>
      </div>
      <select id="select-playlist"
              v-model="selectedPlaylist">
        <option value="Select playlist">
          Select playlist
        </option>
        <option v-for="playlist in playlists"
                v-bind:key="playlist.id"
                v-bind:value="playlist">
          {{ playlist.name }}
        </option>
      </select>
      <button id="track-add-button"
              v-on:click="addTrack(selectedPlaylist.id, selectedTrack)">
        Add to playlist
      </button>
    </section>

    <!-- Playlists -->
    <ul class="list"
        v-if="playlists && playlists.length">
      <li v-for="playlist of playlists"
          v-bind:key="playlist.id">

        <div class="main-container">
          <button class="delete-playlist-button"
                  v-on:click="deletePlaylist(playlist.id)">
            Delete playlist
          </button>

          <div class="playlist-header">
            <h2 class="playlist-name">
              {{playlist.name}}
            </h2>
            <button class="edit-playlist-button"
                    v-on:click="editPlaylist(playlist.id)">
              Edit
            </button>

            <div class="playlist-header-edit"
                 v-if="flag_on_edit === playlist.id">
              <input type="text"
                     placeholder="Playlist name"
                     v-model="editPlaylistName"/>
              <button class="validate-edit-playlist-button"
                      v-on:click="validateEditPlaylist(playlist.id, editPlaylistName)">
                Validate
              </button>
              <button class="cancel-edit-playlist-button"
                      v-on:click="cancelEditPlaylist()">
                Cancel
              </button>
            </div>
          </div>

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
              <div class="track-remove-button caption"></div>
            </div>

            <ul class="list"
                v-if="playlist.tracks && playlist.tracks.length">
              <li v-for="track of playlist.tracks"
                  v-bind:key="track.trackId">
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
                    <button v-on:click="play(track.previewUrl, track.artworkUrl60, track.trackName, track.artistName)">
                      Play
                    </button>
                  </div>
                  <div class="track-remove-button">
                    <button v-on:click="removeTrack(playlist.id, track.trackId)">
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import * as api from '@/api/api';
  import getUserPlaylists from '@/mixins/getUserPlaylists';
  import getTimeFromMillis from '@/mixins/getTimeFromMillis';

  export default {
    name: 'Playlist',

    mixins: [getUserPlaylists, getTimeFromMillis],

    data: () => ({
      newPlaylistName: '',
      editPlaylistName: '',
      playlists: [],
      flag_on_focus: false,
      flag_on_edit: '',
      trackSearch: '',
      searchedTracks: [],
      selectedPlaylist: 'Select playlist',
      selectedTrack: null,
    }),

    created() {
      this.getPlaylist();
    },

    methods: {
      async getPlaylist() {
        this.playlists = await this.getUserPlaylists('5bf76146cee1510004a66c0f');
      },

      async createPlaylist() {
        await api.createPlaylist(this.newPlaylistName)
          .then(this.getPlaylist);
      },

      async deletePlaylist(idPlaylist) {
        await api.deletePlaylist(idPlaylist)
          .then(this.getPlaylist);
      },

      editPlaylist(playlistId) {
        this.flag_on_edit = playlistId;
        this.editPlaylistName = '';
      },

      cancelEditPlaylist() {
        this.flag_on_edit = '';
        this.editPlaylistName = '';
      },

      async validateEditPlaylist(idPlaylist, namePlaylist) {
        await api.editPlaylist(idPlaylist, namePlaylist)
          .then(this.getPlaylist);
        this.flag_on_edit = '';
        this.editPlaylistName = '';
      },

      async removeTrack(idPlaylist, idTrack) {
        await api.removeTrackFromPlaylist(idPlaylist, idTrack)
          .then(this.getPlaylist);
      },

      async searchTracks() {
        const search = this.trackSearch.split(' ')
          .join('%20');
        const results = await api.globalSearch(`/tracks/?q=${search}%20&limit=5`);
        this.searchedTracks = results;
      },

      selectTrack(track) {
        this.trackSearch = `${track.trackName}, ${track.artistName}`;
        this.selectedTrack = track;
        this.flag_on_focus = false;
      },

      async addTrack(idPlaylist, track) {
        await api.addTrackToPlaylist(idPlaylist, track)
          .then(this.getPlaylist);
      },

      play(musicSrc, albumArt60, albumTitle, albumArtist) {
        this.$root.$emit('playSong', musicSrc, albumArt60, albumTitle, albumArtist);
      }
    }
  };
</script>

<style scoped>
  .centered-text {
    text-align: center;
  }

  #create-playlist-button {
    background-color: green;
    border:           green;
    border-radius:    10px;
    color:            white;
    font-weight:      bold;
    font-size:        12px;
    padding:          8px 8px;
    cursor:           pointer;
  }

  #section-add-track {
    margin: 10px 0;
  }

  #search {
    display: inline-block;
  }

  #search-wrapper {
    display:  inline-block;
    position: relative
  }

  #search-track-name {
    width: 200px;
  }

  #search-result {
    position:         absolute;
    background-color: white;
    color:            black
  }

  #search-result:hover {
    background-color: darkgray;
  }

  #track-add-button {
    background-color: green;
    border:           green;
    border-radius:    10px;
    color:            white;
    font-weight:      bold;
    font-size:        12px;
    padding:          8px 8px;
    cursor:           pointer;
  }

  .list {
    list-style-type: none;
    padding-left:    0;
  }

  .delete-playlist-button {
    position:         absolute;
    background-color: red;
    border:           red;
    border-radius:    10px;
    color:            white;
    font-weight:      bold;
    font-size:        16px;
    padding:          10px 10px;
    cursor:           pointer;
  }

  .playlist-header {
    text-align: center;
    width:      100%;
  }

  .playlist-name {
    display: inline;
  }

  .edit-playlist-button {
    background-color: blue;
    border:           blue;
    border-radius:    10px;
    color:            white;
    font-weight:      bold;
    font-size:        16px;
    padding:          10px 10px;
    cursor:           pointer;
  }

  .playlist-header-edit {
    display: inline;
  }

  .validate-edit-playlist-button {
    background-color: green;
    border:           green;
    border-radius:    10px;
    color:            white;
    font-weight:      bold;
    font-size:        12px;
    padding:          10px 10px;
    cursor:           pointer;
  }

  .cancel-edit-playlist-button {
    background-color: red;
    border:           red;
    border-radius:    10px;
    color:            white;
    font-weight:      bold;
    font-size:        12px;
    padding:          10px 10px;
    cursor:           pointer;
  }

  .caption {
    font-weight: bold;
    font-size:   1.25em;
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

  .track-title {
    flex-grow: 2;
    max-width: 20%;
  }

  .track-play-button {
    flex-grow:     1;
    max-width:     8%;
    margin-top:    10px;
    margin-bottom: 10px;
  }

  .track-artist,
  .track-time,
  .track-remove-button {
    flex-grow: 1;
    max-width: 8%;
  }

  .track-play-button > button {
    background-color: blue;
    border:           blue;
    border-radius:    10px;
    color:            white;
    font-weight:      bold;
    font-size:        12px;
    padding:          8px 8px;
    cursor:           pointer;
  }

  .track-remove-button > button {
    background-color: red;
    border:           red;
    border-radius:    10px;
    color:            white;
    font-weight:      bold;
    font-size:        12px;
    padding:          8px 8px;
    cursor:           pointer;
  }
</style>
