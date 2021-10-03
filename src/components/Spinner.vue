<template>
  <div v-if="isLoading" :class="centered ? 'd-flex justify-content-center' : ''">
    <div class="spinner-border" role="status" />
  </div>
  <slot v-else />
</template>

<style lang="scss" scoped>

  .spinner-border {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

</style>

<script lang="ts">

import { Options, Vue } from 'vue-class-component'

@Options({
  props: {
    isLoading: Boolean,
    centered: {
      type: Boolean,
      default: true
    }
  }
})
export default class extends Vue {
  isLoading!: boolean
  centered!: boolean
}

</script>
