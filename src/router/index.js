import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import Album from '@/components/Album';
import Artist from '@/components/Artist';
import Playlist from '@/components/Playlist';
import SearchResults from '@/components/SearchResults';
import User from '@/components/User';
import Login from '@/components/Login';
import SignUp from '@/components/SignUp';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    }, {
      path: '/artist',
      name: 'artist',
      component: Artist
    }, {
      path: '/album',
      name: 'album',
      component: Album
    }, {
      path: '/playlist',
      name: 'playlist',
      component: Playlist
    }, {
      path: '/search',
      name: 'search',
      component: SearchResults,
    },
    {
      path: '/user',
      name: 'user',
      component: User,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUp,
    }
  ]
});
