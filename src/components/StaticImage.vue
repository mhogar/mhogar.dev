<template>
    <div v-if="useAsBackground" :style="`background-image: url(${url});`" />
    <img v-else :src="url" />
</template>

<script lang="ts">

import { Options, Vue } from 'vue-class-component'

@Options({
  props: {
    path: String,
    image: String,
    useAsBackground: Boolean
  }
})
export default class extends Vue {
  path!: string
  image!: string
  useAsBackground: boolean = false
  url: string = ''

  created () {
    this.url = 'imgs/' + this.path + this.image
  }
}

</script>
