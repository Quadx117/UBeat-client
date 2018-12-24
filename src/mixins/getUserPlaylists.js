import { getAllPlaylists } from '../api/api';

export default {
  // TODO(Eric): We could also put the data element playlists: [] in here since it is present
  // everywhere, but the name of the mixin would need to reflect that.
  methods: {
    async getUserPlaylists(userId) {
      const playlists = await getAllPlaylists();
      const userPlaylists = [];
      playlists.forEach((playlist) => {
        if (playlist.owner !== undefined) {
          if (playlist.owner.id === userId) {
            userPlaylists.push(playlist);
          }
        }
      });
      return userPlaylists;
    }
  }
};
