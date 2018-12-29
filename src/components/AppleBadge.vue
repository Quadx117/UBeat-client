<template>
  <div>
    <a class="listen-apple-badge"
       v-bind:href="iTuneLink">
    </a>
  </div>
</template>

<script>
  export default {
    name: 'AppleBadge',

    props: {
      iTuneLink: String
    }
  };
</script>

<style scoped>
  .listen-apple-badge {
    display:    inline-block;
    overflow:   hidden;
    background: url(https://tools.applemusic.com/assets/shared/badges/en-us/music-lrg.svg) no-repeat;
    width:      158px;
    height:     45px;
  }
</style>
