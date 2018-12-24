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
      name: 'Home',
      component: Home,
    }, {
      path: '/artist',
      name: 'Artist',
      component: Artist
    }, {
      path: '/album',
      name: 'Album',
      component: Album
    }, {
      path: '/playlist',
      name: 'Playlist',
      component: Playlist
    }, {
      path: '/search',
      name: 'Search',
      component: SearchResults,
    },
    {
      path: '/user',
      name: 'User',
      component: User,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUp,
    }
  ]
});
