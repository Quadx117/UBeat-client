// TODO(Eric): Refactor token code to use a Cookie instead
export default {
  methods: {
    loggedIn() {
      const token = localStorage.getItem('uBeatToken');
      return (token !== null && token !== '');
    }
  }
};
