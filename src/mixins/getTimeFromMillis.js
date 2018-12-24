export default {
  methods: {
    getTimeFromMillis(milliseconds) {
      const MILLIS_PER_SECOND = 1000;
      const MILLIS_PER_MINUTE = MILLIS_PER_SECOND * 60;

      const minutes = Math.floor(milliseconds / MILLIS_PER_MINUTE) % 60;
      const seconds = Math.floor(milliseconds / MILLIS_PER_SECOND) % 60;

      let result = (minutes < 10) ? `0${minutes.toString()}` : minutes.toString();
      result += ':';
      result += (seconds < 10) ? `0${seconds.toString()}` : seconds.toString();

      return result;
    }
  }
};
