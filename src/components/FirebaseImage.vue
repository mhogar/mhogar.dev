<template>
    <div v-if="useAsBackground" :style="`background-image: url(${url});`" />
    <img v-else :src="url" />
</template>

<script lang="ts">

import { Options, Vue } from 'vue-class-component'
import firebase from 'firebase/app'
import 'firebase/storage'

@Options({
  props: {
    path: String,
    useAsBackground: Boolean
  }
})
export default class FirebaseImage extends Vue {
  path!: string
  useAsBackground: boolean = false
  url: string = ''
  loadingImage: boolean = true

  created () {
    firebase.storage().ref().child(this.path).getDownloadURL().then(url => {
      this.url = url
    })
  }
}

</script>
