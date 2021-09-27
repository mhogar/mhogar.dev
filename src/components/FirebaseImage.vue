<template>
    <div v-if="useAsBackground" :style="`background-image: url(${url});`" />
    <img v-else :src="url" />
</template>

<script lang="ts">

import { Options, Vue } from 'vue-class-component'
import firebase from 'firebase/app'
import 'firebase/storage'

const path = require('path')

@Options({
  props: {
    path: String,
    image: String,
    useAsBackground: Boolean
  }
})
export default class FirebaseImage extends Vue {
  path!: string
  image!: string
  useAsBackground: boolean = false
  url: string = ''
  loadingImage: boolean = true

  created () {
    if (!this.image) {
      // TODO: implement placeholder image
      this.url = ''
      return
    }

    firebase.storage().ref().child(path.join(this.path, this.image)).getDownloadURL()
      .then(url => {
        this.url = url
      })
  }
}

</script>
