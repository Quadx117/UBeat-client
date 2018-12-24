<template>
  <div class="albumItem">
    <img class="albumArt"
         v-bind:srcset="albumArtSrcSet"
         sizes="(max-width: 667px) 100px,
                (max-width: 1024px) 150px,
                200px"
         v-bind:src="albumArt100"
         v-bind:alt="albumTitle">
    <!-- NOTE(Eric): This is a bit hacky but it will make the title wrap at the image boundary. In other words,
         The width of the outer div will be the same as the image.  The year will never be too wide and putting
         it inside did not work properly. -->
    <div class="sameWidthAsSibling">
      <div class="albumTitle">{{albumTitle}}</div>
    </div>
    <div class="albumYear">{{albumYear}}</div>
  </div>
</template>

<script>
  export default {
    name: 'ArtistAlbum',

    props: {
      albumTitle: String,
      albumYear: String,
      albumArtSrcSet: String,
      albumArt60: String,
      albumArt100: String
    }
    // TODO(Eric): Add apple links to the album itself on the album art?
    // (collectionViewUrl in the api) or add the apple badge ?
    // TODO(Eric): The api only returns 2 images which are 60x60 and 100x100.  This is quite
    // small and makes the images blurry at the sizes we currently want.  See if we can make
    // this better.
  };
</script>

<style scoped>
  .albumItem {
    /* top | right | bottom | left */
    margin:     0px 20px 20px 0px;
    padding:    0px;
    text-align: center;
  }

  .albumArt {
    border-radius: 8px;
  }

  .albumTitle {
    color: #cdcdcd;
  }

  .albumYear {
    color: #8e8e93;
  }

  .sameWidthAsSibling {
    display: flex;
  }

  .sameWidthAsSibling > div {
    flex-grow: 1;
    width:     0;
  }

</style>
