// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import AudioVisual from 'vue-audio-visual';
import Vue from 'vue';
import App from './App';
import router from './router';

Vue.config.productionTip = false;
Vue.use(AudioVisual);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});

let artists = [];
let albums = [];
let tracks = [];
let users = [];

export function getartists() {
  return artists;
}
export function setartists(partists) {
  artists = partists;
}
export function getalbums() {
  return albums;
}
export function setalbums(palbums) {
  albums = palbums;
}
export function gettracks() {
  return tracks;
}
export function settracks(ptracks) {
  tracks = ptracks;
}
export function getusers() {
  return users;
}
export function setusers(pusers) {
  users = pusers;
}
