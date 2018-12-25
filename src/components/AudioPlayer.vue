<template>
  <div id="audio-container">

    <div id="album-container">
      <img id="album-art"
           v-bind:src="albumArt60"
           v-bind:alt="albumTitle">
      <div id="album-info">
        <div id="album-title">
          {{albumTitle}}
        </div>
        <div id="album-artist">
          {{albumArtist}}
        </div>
      </div>
    </div>

    <audio id="audio-player"
           ref="audioPlayer"
           crossorigin="anonymous"
           autoplay
           controls>
    </audio>

    <div id="audio-visualizer-container">
      <av-bars v-if="musicSrc"
               id="audio-visualizer"
               ref-link="audioPlayer"
               caps-color="#ffffff"
               v-bind:bar-color="['#ff0000', '#ffff00', '#00ff00']"
               v-bind:caps-height="2"
               v-bind:bar-width="12"
               v-bind:canv-width="260"
               v-bind:canv-height="50"
               v-bind:cors-anonym="true"/>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'AudioPlayer',

    props: {
      musicSrc: String,
      albumArt60: String,
      albumTitle: String,
      albumArtist: String
    },

    watch: {
      // Whenever musicSrc changes, this function will run.
      musicSrc() {
        if (this.musicSrc) {
          this.$refs.audioPlayer.src = this.musicSrc;
        }
      }
    }

  };
</script>

<style scoped>
  #audio-container {
    display:     flex;
    align-items: center;
    width:       100%;
  }

  #album-container {
    width:          260px;
    display:        flex;
    flex-direction: row;
    flex-wrap:      nowrap;
    align-items:    center;
    overflow:       auto;
  }

  #album-art {
    margin: 0 5px;
  }

  #album-info {
    overflow:    hidden;
    white-space: nowrap;
  }

  #album-title {
    font-size:     14px;
    text-overflow: ellipsis;
    overflow:      hidden;
  }

  #album-artist {
    font-size: 12px;
  }

  #audio-player {
    display:      block;
    min-width:    250px;
    flex-grow:    2;
    flex-shrink:  1;
    margin-right: 5px;
  }

  #audio-visualizer-container {
    display: none;
    width:   260px;
  }

  @media screen and (min-width: 600px) {
    #audio-player {
      margin-right: 0;
    }

    #audio-visualizer-container {
      display: block;
      margin:  0 5px;
    }
  }
</style>
