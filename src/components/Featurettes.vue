<template>
  <div class="featurettes">
    <div v-for="(item, index) in content" :key="item.heading">
      <hr class="featurette-divider">
      <div class="row featurette">
        <div :class="'col-md-7 order-md-' + calcColumnOrder(index)">
        <h2 class="featurette-heading">{{item.heading}} <span class="text-muted">{{item.subheading}}</span></h2>
        <p class="lead">{{item.lead}}</p>
        </div>
        <div :class="'col-md-5 order-md-' + calcColumnOrder(index + 1)">
          <svg class="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" width="500" height="500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 500x500" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#111"/><text x="50%" y="50%" fill="#aaa" dy=".3em">500x500</text></svg>
        </div>
      </div>
    </div>
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

@media (min-width: 40em) {
  .featurette-heading {
    font-size: 50px;
  }
}

@media (min-width: 62em) {
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
  lead: string,
}

@Options({
  props: {
    content: Array as PropType<FeaturetteContent[]>
  }
})
export default class Featurettes extends Vue {
  content!: FeaturetteContent[]

  calcColumnOrder (index: number): number {
    return (index % 2) + 1
  }
}

</script>
