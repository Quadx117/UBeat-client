<template>
  <div id="app">
    <nav-menu></nav-menu>

    <router-view></router-view>

    <div id="audio-footer">
      <audio-player v-bind:music-src="musicSrc"
                    v-bind:album-art60="albumArt60"
                    v-bind:album-title="albumTitle"
                    v-bind:album-artist="albumArtist"/>
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
      albumTitle: '',
      albumArtist: ''
    }),

    mounted() {
      this.$nextTick(() => {
        this.$root.$on('playSong', (musicSrc, albumArt60, albumTitle, albumArtist) => {
          this.musicSrc = musicSrc;
          this.albumArt60 = albumArt60;
          this.albumTitle = albumTitle;
          this.albumArtist = albumArtist;
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

  .main-container {
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
    bottom:           0;
    left:             0;
  }

  @media screen and (max-width: 768px) {
    .main-container {
      padding: 10px;
    }
  }
</style>
