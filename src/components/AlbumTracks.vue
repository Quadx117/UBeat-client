<template>
  <div>

    <!-- List header -->
    <div class="track-list track-list-header">
      <div class="track-number center-text">
        N°
      </div>
      <div class="track-title">
        Title
      </div>
      <div class="track-time center-text">
        Time
      </div>
      <div class="track-play-button center-text">
        Listen
      </div>
      <div v-if="loggedIn()"
           class="track-add-playlist center-text">
        Add
      </div>
    </div>

    <!-- List items -->
    <div v-if="tracks && tracks.length">
      <div v-for="track of tracks"
           v-bind:key="track.trackId">
        <div class="track-list">
          <div class="track-number center-text">
            {{track.trackNumber}}
          </div>
          <div class="track-title">
            {{track.trackName}}
          </div>
          <div class="track-time center-text">
            {{getTimeFromMillis(track.trackTimeMillis)}}
          </div>
          <div class="track-play-button audio-container">
            <button v-on:click="play(track.previewUrl, track.artworkUrl60, track.trackName, track.artistName)">
              Play
            </button>
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
      </div>
    </div>

  </div>
</template>

<script>
  import getTimeFromMillis from '@/mixins/getTimeFromMillis';
  import loggedIn from '@/mixins/loggedIn';

  export default {
    name: 'AlbumTracks',

    mixins: [getTimeFromMillis, loggedIn],

    props: {
      playlists: Array,
      tracks: Array
    },

    data: () => ({
      selectedPlaylist: 'Select playlist'
    }),

    methods: {
      play(musicSrc, albumArt60, albumTitle, albumArtist) {
        this.$root.$emit('playSong', musicSrc, albumArt60, albumTitle, albumArtist);
      }
    }

  };
</script>

<style scoped>
  .track-list {
    border-bottom: 1px solid white;
  }

  .audio-container {
    overflow: auto;
  }

  .center-text {
    text-align: center;
  }

  audio {
    display:   block;
    width:     100%;
    min-width: 300px;
    margin:    4px 0;
  }

  @media screen and (min-width: 770px) {
    .track-list {
      display:         flex;
      flex-direction:  row;
      flex-wrap:       nowrap;
      justify-content: space-between;
      align-items:     center;
    }

    .track-list-header {
      font-weight: bold;
      font-size:   1.25em;
    }

    .track-number {
      flex-grow:    0;
      flex-shrink:  0;
      flex-basis:   50px;
      margin-right: 5px;
    }

    .track-title {
      flex-grow:    1;
      flex-shrink:  0;
      flex-basis:   100px;
      margin-right: 5px;
    }

    .track-time {
      flex-grow:    0;
      flex-shrink:  0;
      flex-basis:   50px;
      margin-right: 10px;
    }

    .track-play-button {
      flex-grow:    2;
      flex-shrink:  1;
      flex-basis:   300px;
      margin-right: 10px;
    }

    .track-add-playlist {
      flex-grow:   1;
      flex-shrink: 0;
      flex-basis:  110px;
    }
  }

  @media screen and (max-width: 769px) {
    .track-list {
      display:         flex;
      flex-direction:  column;
      flex-wrap:       nowrap;
      justify-content: space-between;
      align-items:     center;
      padding-bottom:  10px;
      margin-bottom:   10px;
    }

    .track-list-header {
      display: none;
    }

    .track-title, .track-number, .track-time {
      text-align: center;
    }

    .track-play-button {
      flex-grow:   1;
      flex-shrink: 1;
      width:       100%;
    }

    audio {
      min-width:      300px;
      padding-bottom: 4px;
      margin:         auto;
    }
  }
</style>
