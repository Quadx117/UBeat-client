<template>
  <div class="album-item">
    <img class="album-art"
         v-bind:srcset="albumArtSrcSet"
         sizes="(max-width: 667px) 100px,
                (max-width: 1024px) 150px,
                200px"
         v-bind:src="albumArt100"
         v-bind:alt="albumTitle">
    <!-- NOTE(Eric): This is a bit hacky but it will make the title wrap at the image boundary. In other words,
         The width of the outer div will be the same as the image.  The year will never be too wide and putting
         it inside did not work properly. -->
    <div class="same-width-as-sibling">
      <div class="album-title">
        {{albumTitle}}
      </div>
    </div>
    <div class="album-year">
      {{albumYear}}
    </div>
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
  .album-item {
    /* top | right | bottom | left */
    margin:     0 20px 20px 0;
    padding:    0;
    text-align: center;
  }

  .album-art {
    border-radius: 8px;
  }

  .album-title {
    color: #cdcdcd;
  }

  .album-year {
    color: #8e8e93;
  }

  .same-width-as-sibling {
    display: flex;
  }

  .same-width-as-sibling > div {
    flex-grow: 1;
    width:     0;
  }

</style>
