<template>
  <div>

    <!-- User info -->
    <section>
      <h1>
        User profile
      </h1>
      <img id="img-avatar"
           alt="Avatar image"
           src="../assets/user.png"/>
      <h2 id="user-name">
        Name: {{name}}
      </h2>
      <h2 id="user-email">
        Email: {{email}}
      </h2>

      <div id="follow">
        <button class="follow-button"
                v-if="id !== '5bf76146cee1510004a66c0f' && !isFollowed(id)"
                v-on:click="followUser(id)">
          Follow
        </button>
        <button class="follow-stop-button"
                v-if="id !== '5bf76146cee1510004a66c0f' && isFollowed(id)"
                v-on:click="stopFollowUser(id)">
          Unfollow
        </button>
      </div>
    </section>

    <!-- Friends -->
    <section>
      <h2 id="friends-title">
        Friends:
      </h2>
      <div id="container-list">
        <ul id="list-friends"
            v-if="friends && friends.length">
          <li class="friend"
              v-for="friend of friends"
              v-bind:key="friend.id">
            <img class="friend-avatar"
                 alt="Avatar image"
                 src="../assets/user.png"/>
            <div class="friend-name">
              {{friend.name}}
            </div>
            <div class="friend-email">
              {{friend.email}}
            </div>
          </li>
        </ul>
      </div>
    </section>

    <!-- Playlists -->
    <section>
      <h2 id="playlists-title">
        Playlists:
      </h2>
      <div v-if="playlists && playlists.length">
        <playlist v-for="playlist of playlists"
                  v-bind:key="playlist.id"
                  v-bind:playlist="playlist"/>
      </div>
    </section>

  </div>
</template>

<script>
  import * as api from '@/api/api';
  import getUserPlaylists from '@/mixins/getUserPlaylists';
  import getTimeFromMillis from '@/mixins/getTimeFromMillis';
  import * as resultsSharing from '@/mixins/resultsSharing';

  import Playlist from './UserPlaylist';


  export default {
    name: 'User',

    components: {
      Playlist,
    },

    mixins: [getUserPlaylists, getTimeFromMillis],

    data: () => ({
      user: null,
      playlists: [],
    }),

    computed: {
      email() {
        if (this.user) {
          return this.user.email;
        }
        return '';
      },

      name() {
        if (this.user) {
          return this.user.name;
        }
        return '';
      },

      id() {
        if (this.user) {
          return this.user.id;
        }
        return '';
      },

      friends() {
        if (this.user) {
          return this.user.following;
        }
        return [];
      }
    },

    watch: {
      // Whenever user changes, this function will run.
      async user() {
        // TODO(Eric): Maybe check if user is null before
        this.playlists = await this.getUserPlaylists(this.user.id);
      }
    },

    async created() {
      // TODO(Eric): Need to be able to pass token or userId since this page should be used for
      // the current user and user search.
      // this.user = await api.getTokenInfo();
      this.user = resultsSharing.getUser();
    },

    methods: {
      isFollowed(id) {
        if (id === '') return false;
        let followed = false;
        if (this.user) {
          const myFriends = this.friends;
          myFriends.forEach((friend) => {
            if (friend.id === id) {
              followed = true;
            }
          });
        }
        return followed;
      },

      async followUser(userId) {
        await api.followUser(userId)
          .then(this.getUser(userId));
      },

      async stopFollowUser(userId) {
        await api.unfollowUser(userId)
          .then(this.getUser(userId));
      },
    }

  };
</script>

<style scoped>
  h1 {
    text-align: center;
  }

  ul {
    list-style-type: none;
    padding-left:    0;
  }

  #img-avatar {
    width:       15%;
    height:      15%;
    margin-top:  2%;
    margin-left: 2%;
  }

  #user-name {
    position: absolute;
    top:      300px;
    left:     25%;
  }

  #user-email {
    position: absolute;
    top:      350px;
    left:     25%;
  }

  .follow-button {
    position:         absolute;
    top:              325px;
    left:             55%;
    background-color: green;
    border:           green;
    border-radius:    10px;
    color:            white;
    font-weight:      bold;
    font-size:        20px;
    padding:          8px 8px;
    cursor:           pointer;
  }

  .follow-stop-button {
    position:         absolute;
    top:              325px;
    left:             55%;
    background-color: red;
    border:           red;
    border-radius:    10px;
    color:            white;
    font-weight:      bold;
    font-size:        20px;
    padding:          8px 8px;
    cursor:           pointer;
  }

  #container-list {
    background-image: linear-gradient(#404040, #202020);
    border:           5px solid #4f4f4f;
    border-radius:    8px;
    margin:           30px 30px 30px 30px;
  }

  #friends-title, #playlists-title {
    margin-left: 15px;
  }

  #list-friends {
    text-align: center;
  }

  .friend {
    text-align:       center;
    width:            280px;
    height:           150px;
    font-size:        12px;
    background-image: linear-gradient(#404040, #202020);
    display:          inline-flex;
    flex-direction:   column;
    align-items:      stretch;
    border:           solid #4f4f4f;
    border-radius:    10px;
    margin:           0 50px 20px 0;
  }

  .friend-avatar {
    width:       100px;
    height:      100px;
    margin-left: 10px;
    margin-top:  20px;
  }

  .friend-name {
    margin-left: 110px;
    margin-top:  -60px;
    padding:     0 10px;
    min-height:  50px;
  }

  .friend-email {
    margin-left: 110px;
    margin-top:  -30px;
    padding:     0 10px;
    min-height:  50px;
  }
</style>
