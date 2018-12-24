<template>
  <div id="app">
    <nav-menu></nav-menu>

    <router-view></router-view>

    <div id="audio-footer" v-if="musicSrc !== ''">
      <audio-player v-bind:music-src="musicSrc"
                    v-bind:album-art60="albumArt60"
                    v-bind:album-title="albumTitle"/>
    </div>
  </div>
</template>

<script>
  import Navigation from '@/components/Navigation';
  import AudioPlayer from '@/components/AudioPlayer';

  export default {
    name: 'app',

    components: {
      'nav-menu': Navigation,
      AudioPlayer
    },

    data: () => ({
      musicSrc: '',
      albumArt60: '',
      albumTitle: ''
    }),

    mounted() {
      this.$nextTick(() => {
        this.$root.$on('playSong', (musicSrc, albumArt60, albumTitle) => {
          this.musicSrc = musicSrc;
          this.albumArt60 = albumArt60;
          this.albumTitle = albumTitle;
        });
      });
    }

  };
</script>

<style>
  body {
    font-family:      Roboto, serif;
    background-color: #202020;
    color:            white;
    padding-top:      75px;
    margin-bottom:    90px;
  }

  .mainContainer {
    background-image: linear-gradient(#404040, #202020);
    border:           5px solid #4f4f4f;
    border-radius:    8px;
    margin:           30px 30px 30px 30px;
    padding:          40px;
  }

  #audio-footer {
    display:          flex;
    align-items:      center;
    background-color: rgba(0, 0, 0, 0.5);
    position:         fixed;
    height:           70px;
    width:            100%;
    bottom:           0px;
    left:             0;
  }

  @media screen and (max-width: 768px) {
    .mainContainer {
      padding: 10px;
    }
  }
</style>
