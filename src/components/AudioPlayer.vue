<template>
  <div id="audio-wrapper" v-if="musicSrc !== ''">
    <img id="album-art"
         v-bind:src="albumArt60"
         v-bind:alt="albumTitle">
    <audio id="audio-controls"
           ref="audio-player"
           crossorigin="anonymous"
           v-bind:src="musicSrc" autoplay controls></audio>
    <av-bars id="audio-visualizer"
             ref-link="audio-player"
             caps-color="#ffffff"
             v-bind:bar-color="['#ff0000', '#ffff00', '#00ff00']"
             v-bind:caps-height="2"
             v-bind:bar-width="12"
             v-bind:canv-width="260"
             v-bind:canv-height="50"
             v-bind:cors-anonym="true"/>
  </div>
</template>

<script>
  export default {
    name: 'AudioPlayer',

    props: {
      musicSrc: String,
      albumArt60: String,
      albumTitle: String
    }

  };
</script>

<style scoped>
  #album-art {
    margin: 0 5px;
  }

  #audio-controls {
    display:      block;
    min-width:    250px;
    flex-grow:    2;
    flex-shrink:  1;
    margin-right: 5px;
  }

  #audio-wrapper {
    display:     flex;
    align-items: center;
    width:       100%;
  }

  #audio-visualizer {
    display: none;
  }

  @media screen and (min-width: 600px) {
    #audio-controls {
      margin-right: 0;
    }

    #audio-visualizer {
      display: block;
      margin:  0 5px;
    }
  }
</style>
