<template>
  <div class="page justify-content-center">
    <div class="container">
      <Spinner :isLoading="loading">
        <div v-if="errMessage !== ''" class="alert alert-danger">{{ error }}</div>
        <!--https://api.auth.mhogar.dev/token?client_id=553d9fa7-3cbb-4a46-b672-d0beaf9df004-->
        <a v-if="!currentUser" class="btn btn-lg btn-primary" href="http://localhost:3000/token?client_id=5d45accb-9adb-4dc9-9d74-2c534ffc4f31">
          Login as Admin
        </a>
        <div v-else>
          <h3>Logged in as "{{ currentUser.uid }}".</h3>
          <button class="btn btn-lg btn-primary" @click="logout()">Logout</button>
        </div>
      </Spinner>
    </div>
  </div>
</template>

<style lang="scss" scoped>

@import "../assets/theme.scss";

.page {
  text-align: center;
  padding-top: 6rem;
  padding-bottom: 6rem;
}

</style>

<script lang="ts">

import { Options, Vue } from 'vue-class-component'
import Spinner from '../components/Spinner.vue'

import firebase from 'firebase/app'
import 'firebase/auth'

@Options({
  components: {
    Spinner
  }
})
export default class extends Vue {
  loading: boolean = false

  currentUser: firebase.User | null = null
  errMessage: string = ''

  created () {
    // load token from url
    const token = this.$route.query.token as string

    if (token) {
      // sign into firebase
      this.loading = true
      firebase.auth().signInWithCustomToken(token)
        .then(() => {
          this.$router.replace({ name: 'Home' })
        })
        .catch(error => {
          this.errMessage = error.message
        })
        .finally(() => {
          this.loading = false
        })
    }

    // listen for auth state changes
    firebase.auth().onAuthStateChanged(user => {
      this.currentUser = user
    })
  }

  logout () {
    this.loading = true
    firebase.auth().signOut().finally(() => {
      this.loading = false
    })
  }
}

</script>
