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
                <router-link to="/blog" class="nav-link disabled">Blog</router-link>
              </li>
            </ul>
          </div>
          <div class="nav-item">
            <a href="#" @click.prevent="darkMode = !darkMode">
              <img :src="loadDarkModeToggleIcon()" alt="Dark Mode Toggle" class="dark-mode-toggle">
            </a>
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

.mode-light {
  background-color: #eee;
}
.mode-dark {
  background-color: #111;
}

#app {
  padding-top: 3.5rem;
}

.wrapper {
  max-width: 1680px;
  margin-left: auto;
  margin-right: auto;
}
.mode-light .wrapper {
  box-shadow: 0 2px 4px 0 $drop-shadow-light, 0 2px 10px 0 $drop-shadow-light;
}
.mode-dark .wrapper {
  box-shadow: 0 2px 4px 0 $drop-shadow-dark, 0 2px 10px 0 $drop-shadow-dark;
}

.navbar {
  background-color: $navbar;
}

.mode-light #currentPage {
  background-color: $background-light;
  color: $bodytext-light;
}
.mode-dark #currentPage {
  background-color: $background-dark;
  color: $bodytext-dark;
}

.dark-mode-toggle {
  width: 32px;
  height: 32px;
}

footer {
  color: #fff;
  background-color: $footer;
  padding-top: 3rem;
  padding-bottom: 3rem;
}

</style>

<script lang="ts">

import '../node_modules/bootstrap/dist/js/bootstrap.min.js'
import { Vue } from 'vue-class-component'

export default class App extends Vue {
  darkMode: boolean = false

  loadDarkModeToggleIcon () {
    if (this.darkMode) {
      return require('./assets/icons/sun-fill.svg')
    }

    return require('./assets/icons/moon-fill.svg')
  }

  scrollToTop () {
    window.scrollTo(0, 0)
  }
}

</script>
