<template>
  <div :class="'mode-' + (darkMode ? 'dark' : 'light')">
    <div class="wrapper">
      <nav class="navbar navbar-expand-md navbar-dark fixed-top">
        <div class="container-fluid">
          <router-link to="/" class="navbar-brand">mhogar.dev</router-link>
          <button class="navbar-toggler" type="button"
                  data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarCollapse">
            <ul class="navbar-nav me-auto mb-2 mb-md-0">
              <li class="nav-item">
                <router-link to="/portfolio" class="nav-link">Portfolio</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/blog" class="nav-link">Blog</router-link>
              </li>
            </ul>
          </div>
          <div class="nav-item">
            <a href="#" @click.prevent="darkMode = !darkMode">
              <img :src="loadDarkModeToggleIcon()" alt="Dark Mode Toggle" width="32" height="32">
            </a>
          </div>
          <div v-if="userLoggedIn" class="nav-item">
            <router-link to="/admin" class="nav-link">Admin</router-link>
          </div>
        </div>
      </nav>
      <router-view v-slot="{ Component }">
        <transition enter-active-class="animate__animated animate__faster animate__fadeIn"
                    leave-active-class="animate__animated animate__faster animate__fadeOut"
                    mode="out-in">
          <component id="currentPage" :is="Component" :darkMode="darkMode" />
        </transition>
      </router-view>
      <footer>
        <div class="container">
          <p class="float-end"><a href="#" @click.prevent="scrollToTop()">Back to top</a></p>
          <h6>Contact Sources</h6>
          <ul>
            <li>
              <a href="https://www.linkedin.com/in/ryan-stamp-a91020152/">Linked In</a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  </div>
</template>

<style lang="scss">

@import "./assets/theme.scss";
@import "../node_modules/bootstrap/scss/bootstrap";

#app {
  padding-top: 3.5rem;
}

.wrapper {
  max-width: 1680px;
  margin-left: auto;
  margin-right: auto;
}

.navbar {
  background-color: $navbar;
}

footer {
  color: #fff;
  background-color: $footer;
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.mode-light {
  background-color: #eee;

  .wrapper {
    box-shadow: 0 2px 4px 0 $drop-shadow-light, 0 2px 10px 0 $drop-shadow-light;
  }

  #currentPage {
    background-color: $background-light;
    color: $bodytext-light;
  }
}

.mode-dark {
  background-color: #141514;

  .wrapper {
    box-shadow: 0 2px 4px 0 $drop-shadow-dark, 0 2px 10px 0 $drop-shadow-dark;
  }

  #currentPage {
    background-color: $background-dark;
    color: $bodytext-dark;
  }
}

</style>

<script lang="ts">

import '../node_modules/bootstrap/dist/js/bootstrap.min.js'

import { Vue } from 'vue-class-component'
import firebase from 'firebase/app'
import 'firebase/auth'

export default class extends Vue {
  darkMode: boolean = true
  userLoggedIn: boolean = false

  created () {
    // initialize Firebase
    firebase.initializeApp({
      apiKey: 'AIzaSyCy7-2qn2WZfFP8F_HX8mI4fPsqZtxEu-I',
      authDomain: 'mhogar-dev.firebaseapp.com',
      projectId: 'mhogar-dev',
      storageBucket: 'mhogar-dev.appspot.com',
      messagingSenderId: '1054564120082',
      appId: '1:1054564120082:web:7c86d82c13ba5e01768acb'
    })

    // enable debug token if debug build, then include app-check module
    if (process.env.NODE_ENV === 'development') {
      // @ts-ignore
      self.FIREBASE_APPCHECK_DEBUG_TOKEN = true
      console.log('FIREBASE_APPCHECK_DEBUG_TOKEN -> true')
    }
    require('firebase/app-check')

    // activate app check
    firebase.appCheck().activate('6LcCxaQbAAAAANVgoMY6IOyxOnV848ZWBGKupVVH')

    // listen for auth state changes
    firebase.auth().onAuthStateChanged(user => {
      this.userLoggedIn = user !== null
    })
  }

  loadDarkModeToggleIcon () {
    if (this.darkMode) {
      return require('./assets/imgs/icons/sun-fill.svg')
    }

    return require('./assets/imgs/icons/moon-fill.svg')
  }

  scrollToTop () {
    window.scrollTo(0, 0)
  }
}

</script>
