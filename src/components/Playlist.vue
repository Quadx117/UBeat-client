<template>
  <div>
    <h1>Playlists:</h1>

    <section id="section-new-playlist">
      New playlist:
      <input id="new-task-name"
             type="text"
             placeholder="Playlist name"
             v-model="newPlaylistName"/>
      <button id="create-playlist"
              v-on:click="createPlaylist">
        Create playlist
      </button>
    </section>

    <section id="section-add-track"
             v-if="playlists && playlists.length">
      <div id="search">
        Add track to playlist:
        <input id="search-track-name"
               type="search"
               placeholder="Search tracks..."
               v-model="tracksearch"
               v-on:focus="flag_on_focus = true"
               v-on:blur="flag_on_focus = false"
               v-on:keyup="searchTracks()">
        <div id="search-result"
             v-for="track of searchedtracks"
             v-bind:key="track.collectionId"
             v-if="flag_on_focus && tracksearch !== ''"
             v-on:mousedown="selectTrack(track)">
          {{track.trackName}}, {{track.artistName}}
        </div>
      </div>
      <select id="select-playlist"
              v-model="selectedPlaylist">
        <option value="Select playlist">Select playlist</option>
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

    <ul id="list-playlists"
        v-if="playlists && playlists.length">
      <li v-for="playlist of playlists"
          v-bind:key="playlist.id">

        <div class="mainContainer">
          <button class="delete-playlist-button"
                  v-on:click="deletePlaylist(playlist.id)">
            Delete playlist
          </button>

          <div class="playlist-header">
            <h2 class="playlist-name">{{playlist.name}}</h2>
            <button class="edit-playlist-button"
                    v-on:click="editPlaylist(playlist.id)">
              Edit
            </button>

            <div class="playlist-header-edit"
                 v-if="flag_on_edit === playlist.id">
              <input class="edit-task-name"
                     type="text"
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
              <div class="track-title caption">Title</div>
              <div class="track-artist caption">Artist</div>
              <div class="track-time caption">Time</div>
              <div class="track-play-button caption">Play</div>
              <div class="track-remove-button caption"></div>
            </div>

            <ul id="list-tracks"
                v-if="playlist.tracks && playlist.tracks.length">
              <li v-for="track of playlist.tracks"
                  v-bind:key="track.trackId">
                <div class="track-list">
                  <div class="track-title">{{track.trackName}}</div>
                  <div class="track-artist">{{track.artistName}}</div>
                  <div class="track-time">{{getTimeFromMillis(track.trackTimeMillis)}}</div>
                  <div class="track-play-button">
                    <button v-on:click="play(track.previewUrl, track.artworkUrl60, track.trackName, track.artistName)">
                      Play
                    </button>
                  </div>
                  <div class="track-remove-button">
                    <button v-on:click="removeTrack(playlist.id, track.trackId)">Remove</button>
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
      tracksearch: '',
      searchedtracks: [],
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
        const search = this.tracksearch.split(' ')
          .join('%20');
        const results = await api.globalSearch(`/tracks/?q=${search}%20&limit=5`);
        this.searchedtracks = results;
      },

      selectTrack(track) {
        this.tracksearch = `${track.trackName}, ${track.artistName}`;
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
  h1 {
    margin-left: 5%;
  }

  ul {
    list-style-type: none;
    padding-left:    0;
  }

  #section-new-playlist {
    margin-left: 5%;
  }

  #create-playlist {
    display:          inline;
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
    margin-left: 5%;
    display:     inline;
  }

  #search {
    position: absolute;
    top:      220px;
    left:     5.5%;
  }

  #search-track-name {
    width: 200px;
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

  #select-playlist {
    position: absolute;
    top:      222px;
    left:     29%;
  }

  #track-add-button {
    position:         absolute;
    top:              215px;
    left:             42%;
    background-color: green;
    border:           green;
    border-radius:    10px;
    color:            white;
    font-weight:      bold;
    font-size:        12px;
    padding:          8px 8px;
    cursor:           pointer;
  }

  #list-playlists {
    margin-top: 5%;
  }

  .delete-playlist-button {
    position:         relative;
    top:              -20px;
    left:             1250px;
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
    margin-top: -40px
  }

  .playlist-header-edit {
    display: inline;
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
    flex-grow:     1;
    max-width:     8%;
    margin-top:    10px;
    margin-bottom: 10px;
  }

  .track-list > .track-artist, .track-list > .track-time, .track-list > .track-remove-button {
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
</style>
