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
          <img :src="loadImage(item.image)" width="250" height="250" />
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
}

.text-muted {
  color: $primary !important;
}

@media (max-width: 40em) {
  .featurette-heading {
    font-size: 50px;
  }
}

@media (max-width: 62em) {
  .featurette-heading {
    margin-top: 7rem;
  }
}

</style>

<script lang="ts">

import { PropType } from '@vue/runtime-core'
import { Options, Vue } from 'vue-class-component'

export interface FeaturetteContent {
  heading: string,
  subheading: string,
  image: string,
  lead: string,
}

@Options({
  props: {
    content: Array as PropType<FeaturetteContent[]>
  }
})
export default class Featurettes extends Vue {
  content!: FeaturetteContent[]

  loadImage (image: string) {
    return require('../assets/icons/' + image)
  }

  calcColumnOrder (index: number): number {
    return (index % 2) + 1
  }
}

</script>
