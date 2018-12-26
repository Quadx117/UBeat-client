const formUrlEncoder = require('form-urlencoded').default;

const baseUrl = 'https://ubeat.herokuapp.com';

// NOTE(Eric): Used to locate the token in the browser's local storage
const tokenName = 'uBeatToken';

//
// Login
//
export const login = (email, password) =>
  fetch(`${baseUrl}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formUrlEncoder({ email, password })
  })
    .then(response => response.json())
    .then((userInfo) => {
      localStorage.setItem(tokenName, userInfo.token);
      return userInfo;
    })
    .catch(() => {
      localStorage.removeItem(tokenName);
      console.error('unable to fetch login info');
    });

export const logout = () =>
  fetch(`${baseUrl}/logout`)
    .then(() => {
      localStorage.removeItem(tokenName);
      return true;
    });

//
// New user
//
export const signup = (name, email, password) =>
  fetch(`${baseUrl}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formUrlEncoder({ name, email, password })
  })
    .then((response) => {
      if (response.status === 401) {
        // TODO(Eric): We ge this if the email already exists. Should we do something here?
        console.log('email address is already registered');
      }
      return response.json();
    })
    .catch(() => {
      console.error('unable to create user');
    });

//
// Token info
//
export const getTokenInfo = () =>
  fetch(`${baseUrl}/tokeninfo`, {
    headers: {
      Authorization: localStorage.getItem(tokenName)
    }
  })
    .then(response => response.json())
    .catch(() => {
      console.error('unable to fetch user from token');
    });

//
// Search
//
// NOTE(Eric): All 4 searches are combined into this one since the only difference
// is that we need to either add /albums, /artists or /tracks for the other types.
// This is done in the search page itself.
export const globalSearch = searchQuery =>
  fetch(`${baseUrl}/search${searchQuery}`, {
    headers: {
      Authorization: localStorage.getItem(tokenName)
    }
  })
    .then(response => response.json())
    .then(json => json.results)
    .catch(() => {
      console.error('unable to fetch results');
    });


//
// User
//
export const getUsers = () =>
  fetch(`${baseUrl}/users`, {
    headers: {
      Authorization: localStorage.getItem(tokenName)
    }
  })
    .then(response => response.json())
    .catch(() => {
      console.error('unable to fetch users');
    });

export const getUser = userId =>
  fetch(`${baseUrl}/users/${userId}`, {
    headers: {
      Authorization: localStorage.getItem(tokenName)
    }
  })
    .then(response => response.json())
    .catch(() => {
      console.error('unable to fetch user');
    });

// NOTE(Eric): This search could potentially be regrouped with the others above and this function
// could be deleted. The only thing is this one does not seem to support the optional parameter
// to limit the number of results.
export const userSearch = searchQuery =>
  fetch(`${baseUrl}/search/users${searchQuery}`, {
    headers: {
      Authorization: localStorage.getItem(tokenName)
    }
  })
    .then(response => response.json())
    .catch(() => {
      console.error('unable to fetch results');
    });

export const followUser = userId =>
  fetch(`${baseUrl}/follow`, {
    method: 'POST',
    headers: {
      Authorization: localStorage.getItem(tokenName),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id: userId })
  })
    .then(response => response.json())
    .catch(() => {
      console.error('unable to follow user');
    });

export const unfollowUser = userId =>
  fetch(`${baseUrl}/follow/${userId}`, {
    method: 'DELETE',
    headers: {
      Authorization: localStorage.getItem(tokenName),
    }
  })
    .then(response => response.json())
    .catch(() => {
      console.error('unable to unfollow user');
    });

//
// Album
//
export const getAlbum = albumId =>
  fetch(`${baseUrl}/albums/${albumId}`, {
    headers: {
      Authorization: localStorage.getItem(tokenName)
    }
  })
    .then(response => response.json())
    .then(json => json.results[0])
    .catch(() => {
      console.error('unable to fetch album');
    });

export const getTracks = albumId =>
  fetch(`${baseUrl}/albums/${albumId}/tracks`, {
    headers: {
      Authorization: localStorage.getItem(tokenName)
    }
  })
    .then(response => response.json())
    .then(json => json.results)
    .catch(() => {
      console.error('unable to fetch tracks');
    });

//
// Artist
//
export const getArtist = artistId =>
  fetch(`${baseUrl}/artists/${artistId}`, {
    headers: {
      Authorization: localStorage.getItem(tokenName)
    }
  })
    .then(response => response.json())
    // TODO(Eric): Is there any time where we can have more than one result?
    // We should probably assert that we only have one result or let the caller handle this.
    .then(json => json.results[0])
    .catch(() => {
      console.error('unable to fetch artist');
    });

export const getAlbums = artistId =>
  fetch(`${baseUrl}/artists/${artistId}/albums`, {
    headers: {
      Authorization: localStorage.getItem(tokenName)
    }
  })
    .then(response => response.json())
    .then(json => json.results)
    .catch(() => {
      console.error('unable to fetch artist');
    });

//
// Playlist
//
export const getAllPlaylists = () =>
  fetch(`${baseUrl}/playlists`, {
    headers: {
      Authorization: localStorage.getItem(tokenName)
    }
  })
    .then(response => response.json())
    .catch(() => {
      console.error('unable to fetch playlists');
    });

export const getPlaylist = playlistId =>
  fetch(`${baseUrl}/playlists/${playlistId}`, {
    headers: {
      Authorization: localStorage.getItem(tokenName)
    }
  })
    .then(response => response.json())
    .catch(() => {
      console.error('unable to fetch playlists');
    });

export const createPlaylist = playlistName =>
  fetch(`${baseUrl}/playlists`, {
    method: 'POST',
    headers: {
      Authorization: localStorage.getItem(tokenName),
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body: JSON.stringify({ name: playlistName })
  })
    .then(response => response.json())
    .catch(() => {
      console.error('unable to create playlist');
    });

export const editPlaylist = (playlistId, playlistName) =>
  fetch(`${baseUrl}/playlists/${playlistId}`, {
    method: 'PUT',
    headers: {
      Authorization: localStorage.getItem(tokenName),
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body: JSON.stringify({ name: playlistName })
  })
    .then(response => response.json())
    .catch(() => {
      console.error('unable to modify playlist');
    });

export const deletePlaylist = playlistId =>
  fetch(`${baseUrl}/playlists/${playlistId}`, {
    method: 'DELETE',
    headers: {
      Authorization: localStorage.getItem(tokenName)
    }
  })
    .then(response => response.json())
    .catch(() => {
      console.error('unable to delete playlist');
    });

export const addTrackToPlaylist = (playlistId, track) =>
  fetch(`${baseUrl}/playlists/${playlistId}/tracks`, {
    method: 'POST',
    headers: {
      Authorization: localStorage.getItem(tokenName),
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body: JSON.stringify(track)
  })
    .then(response => response.json())
    .then(json => json)
    .catch(() => {
      console.error('unable to fetch album');
    });

export const removeTrackFromPlaylist = (playlistId, trackId) =>
  fetch(`${baseUrl}/playlists/${playlistId}/tracks/${trackId}`, {
    method: 'DELETE',
    headers: {
      Authorization: localStorage.getItem(tokenName)
    }
  })
    .then(response => response.json())
    .catch(() => {
      console.error('unable to delete track');
    });

// TODO(Eric): Maybe we should divide this in multiple files like on the server side
