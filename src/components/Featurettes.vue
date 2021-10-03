<template>
  <div class="featurettes">
    <div v-for="(item, index) in content" :key="item.heading">
      <hr class="featurette-divider">
      <div class="row featurette">
        <div :class="'col-md-7 align-self-start order-md-' + calcColumnOrder(index)">
          <h2 class="featurette-heading">{{item.heading}} <span class="text-muted">{{item.subheading}}</span></h2>
          <p class="lead">{{item.lead}}</p>
        </div>
        <div :class="'col-md-5 d-flex justify-content-center order-md-' + calcColumnOrder(index + 1)">
          <StaticImage :path="'featurettes/'" :image="item.image" />
        </div>
      </div>
    </div>
    <hr class="featurette-divider">
  </div>
</template>

<style lang="scss" scoped>

@import "../assets/theme.scss";

.featurette-divider {
  margin: 5rem 0; /* Space out the Bootstrap <hr> more */
}

/* Thin out the marketing headings */
.featurette-heading {
  font-weight: 300;
  line-height: 1;
  letter-spacing: -.05rem;
  font-size: 3.5rem;
}

.text-muted {
  color: $primary !important;
}

@media (max-width: 40em) {
  .featurette-heading {
    font-size: 2.5rem;
  }
}

@media (min-width: 62em) {
  .featurette-heading {
    margin-top: 3rem;
  }
}

</style>

<script lang="ts">

import { PropType } from '@vue/runtime-core'
import { Options, Vue } from 'vue-class-component'

import StaticImage from '../components/StaticImage.vue'

export interface FeaturetteContent {
  heading: string,
  subheading: string,
  image: string,
  lead: string,
}

@Options({
  props: {
    content: Array as PropType<FeaturetteContent[]>
  },
  components: { StaticImage }
})
export default class extends Vue {
  content!: FeaturetteContent[]

  calcColumnOrder (index: number): number {
    return (index % 2) + 1
  }
}

</script>
