<template>
    <img :src="url" />
</template>

<script lang="ts">

import { Options, Vue } from 'vue-class-component'
import firebase from 'firebase/app'
import 'firebase/storage'

@Options({
  props: {
    path: String
  }
})
export default class FirebaseImage extends Vue {
  path!: string
  url: string = ''
  loadingImage: boolean = true

  created () {
    firebase.storage().ref().child(this.path).getDownloadURL().then(url => {
      this.url = url
    })
  }
}

</script>
