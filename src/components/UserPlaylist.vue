<template>
  <div class="mainContainer">
    <h2 class="playlist-name">
      {{playlist.name}}
    </h2>
    <div>
      <div class="track-list track-list-header">
        <div class="track-title">
          Title
        </div>
        <div class="track-artist">
          Artist
        </div>
        <div class="track-time center-text">
          Time
        </div>
        <div class="track-play-button center-text">
          Listen
        </div>
      </div>

      <div v-if="playlist.tracks && playlist.tracks.length">
        <div v-for="track of playlist.tracks"
             v-bind:key="track.trackId">
          <div class="track-list">
            <div class="track-title">
              {{track.trackName}}
            </div>
            <div class="track-artist">
              {{track.artistName}}
            </div>
            <div class="track-time center-text">
              {{getTimeFromMillis(track.trackTimeMillis)}}
            </div>
            <div class="track-play-button audio-container">
              <button v-on:click="play(track.previewUrl, track.artworkUrl60, track.artistName)">
                Play
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import getTimeFromMillis from '@/mixins/getTimeFromMillis';

  export default {
    name: 'UserPlaylist',

    mixins: [getTimeFromMillis],

    props: {
      playlist: Object
    },

    methods: {
      play(musicSrc, albumArt60, albumTitle) {
        this.$root.$emit('playSong', musicSrc, albumArt60, albumTitle);
      }
    }

  };
</script>

<style scoped>
  .playlist-name {
    text-align: center;
  }

  .track-list {
    border-bottom: 1px solid white;
  }

  .audio-container {
    overflow: auto;
  }

  .center-text {
    text-align: center;
  }

  .mainContainer {
    padding-top: 0;
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

    .track-title {
      flex-grow:    2;
      flex-shrink:  0;
      flex-basis:   100px;
      margin-right: 5px;
    }

    .track-artist {
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
      flex-grow:   1;
      flex-shrink: 1;
      flex-basis:  300px;
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

    .track-title, .track-artist, .track-time {
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
