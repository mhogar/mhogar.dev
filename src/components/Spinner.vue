<template>
  <div v-if="isLoading" class="d-flex justify-content-center">
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
    isLoading: Boolean
  }
})
export default class Spinner extends Vue {
  isLoading!: boolean
}

</script>
