<template>
  <div class="main-container">

    <section id="artist-container">
      <div>
        <h1 class="artist-name">
          {{name}}
        </h1>
        <h3 class="artist-genre">
          {{genre}}
        </h3>
      </div>

      <apple-badge v-bind:i-tune-link="iTuneLink"/>
    </section>

    <section class="has-top-border">
      <h3>Albums</h3>
      <div id="album-container">
        <album v-for="album of albums"
               v-bind:key="album.collectionId"
               v-bind:albumTitle="album.collectionName"
               v-bind:albumYear="album.releaseDate.split('-')[0]"
               v-bind:albumArtSrcSet="album.artworkUrl60 + ' 60w, ' + album.artworkUrl100 + ' 100w'"
               v-bind:albumArt60="album.artworkUrl60"
               v-bind:albumArt100="album.artworkUrl100"/>
      </div> <!-- End div album-container -->
    </section> <!-- End section albums -->
  </div> <!-- End div main-container -->
</template>

<script>
  import * as api from '@/api/api';
  import * as resultsSharing from '@/mixins/resultsSharing';

  import Album from './ArtistAlbum';
  import AppleBadge from './AppleBadge';

  export default {
    name: 'Artist',

    components: {
      AppleBadge,
      Album
    },

    // TODO(Eric): Probably add a props: ['artistId'] to use in the created() function.
    data: () => ({
      name: '',
      genre: '',
      iTuneLink: '',
      albums: []
    }),

    async created() {
      // TODO(Eric): Remove the hardcoded artist id once the search is working
      // TODO(Eric): Look at Object deconstruction here.
      // const result = await api.getArtist('47123955');
      // if (result) {
      //   this.name = result.artistName;
      //   this.genre = result.primaryGenreName;
      //   this.iTuneLink = result.artistLinkUrl;
      //   // TODO(Eric): Sort the albums by year?
      //   this.albums = await api.getAlbums('47123955');
      // }
      const artist = resultsSharing.getArtist();
      this.name = artist.artistName;
      this.genre = artist.primaryGenreName;
      this.iTuneLink = artist.artistLinkUrl;
      this.albums = await api.getAlbums(artist.artistId);
    }

  };
</script>

<style scoped>
  .artist-name {
    margin-top:    0;
    margin-bottom: 0;
  }

  .artist-genre {
    color:         #888888;
    margin-top:    0;
    margin-bottom: 0;
  }

  .has-top-border {
    border-top: 1px solid #e5e5e5;
    margin-top: 20px;
  }

  #artist-container {
    display:         flex;
    flex-direction:  row;
    flex-wrap:       wrap;
    justify-content: space-between;
    align-items:     center;
    overflow:        auto;
  }

  #album-container {
    display:         flex;
    flex-direction:  row;
    flex-wrap:       wrap;
    justify-content: space-evenly;
    /* NOTE(Eric): This value needs to be the same as the right margin in albumItem so that the rightmost
       item does not have double padding, that way it is well align on the right edge */
    margin-right:    -20px;
    overflow:        auto;
  }
</style>
