<template>
  <form v-for="(model, index) in models" :key="index" class="row g-3">
    <div class="col-5">
      <input type="text" class="form-control form-control-sm" placeholder="text" v-model="model.text">
    </div>
    <div class="col-5">
      <input type="text" class="form-control form-control-sm" placeholder="url" v-model="model.url">
    </div>
    <div class="col-auto">
      <button class="btn btn-danger btn-sm" @click.prevent="removeLink(index)"><b>X</b></button>
    </div>
  </form>
  <button class="btn btn-success btn-sm" @click.prevent="addLink()"><b>+</b></button>
</template>

<style lang="scss" scoped>

.row {
  margin-bottom: 0.5rem;
}

</style>

<script lang="ts">

import { PropType } from '@vue/runtime-core'
import { Options, Vue } from 'vue-class-component'

import Link from '../common/Link'

@Options({
  props: {
    models: Object as PropType<Link[]>
  }
})
export default class extends Vue {
  models!: Link[]

  addLink () {
    this.models.push({} as Link)
  }

  removeLink (index: number) {
    this.models.splice(index, 1)
  }
}

</script>
