<template>
  <div class="mainContainer login-container">

    <label class="login-label"
           for="email">
      Email
    </label>
    <input id="email"
           class="login-text-input"
           type="email"
           placeholder="Email"
           autofocus
           autocomplete="off"
           v-model="email">

    <label class="login-label"
           for="password">
      Password
    </label>
    <input id="password"
           class="login-text-input"
           type="password"
           placeholder="Password"
           autocomplete="off"
           v-model="password"
           v-on:keyup.enter="login">

    <button class="login-button"
            v-on:click="login">
      Login
    </button>
  </div>
</template>

<script>
  import * as api from '@/api/api';

  export default {
    name: 'Login',

    data: () => ({
      password: '',
      email: '',
    }),

    methods: {
      async login() {
        if (this.password && this.email) {
          const user = await api.login(this.email, this.password);
          if (user) {
            this.$root.$emit('loginSuccessful', user.name);
            this.$router.push('Home');
          }
        }
      }
    }

  };
</script>

<style scoped>
  .login-container {
    width:        300px;
    margin-left:  auto;
    margin-right: auto;
  }

  .login-label {
    display:       block;
    margin-bottom: 7px;
    font-weight:   600;
  }

  .login-text-input {
    font-size:     14px;
    width:         100%;
    min-height:    34px;
    margin-bottom: 15px;
  }

  .login-button {
    color:                 white;
    background-color:      darkorange;
    border:                1px solid rgba(27, 31, 35, 0.2);
    -webkit-border-radius: 0.25em;
    -moz-border-radius:    0.25em;
    border-radius:         0.25em;
    cursor:                pointer;
    font-size:             14px;
    font-weight:           600;
    text-align:            center;
    width:                 100%;
    min-height:            34px;
    padding:               6px 12px;
    margin-top:            20px;
  }
</style>
