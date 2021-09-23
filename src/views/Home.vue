<template>
  <div class="home">
    <Carousel :id="'categoryCarousel'" :imagePath="'home/carousel/'" :slides="carouselSlides" />
    <div class="container">
      <Featurettes :content="featurettesContent" :imagePath="'home/featurettes/'" />
    </div>
  </div>
</template>

<style lang="scss" scoped>

@import "../assets/theme.scss";

.mode-light.home {
    background-color: $background-light;
    color: $bodytext-light;
}

.mode-dark.home {
    background-color: $background-dark;
    color: $bodytext-dark;
}

.carousel {
  margin-bottom: 4rem;
}

.featurettes {
  padding-bottom: 1rem;
}

</style>

<script lang="ts">

import { Options, Vue } from 'vue-class-component'

import Spinner from '../components/Spinner.vue'
import Carousel, { CarouselSlide } from '../components/Carousel.vue'
import Featurettes, { FeaturetteContent } from '../components/Featurettes.vue'

@Options({
  components: {
    Spinner, Carousel, Featurettes
  }
})
export default class Home extends Vue {
  carouselSlides: CarouselSlide[] = []
  featurettesContent: FeaturetteContent[] = []

  created () {
    this.carouselSlides = require('../assets/data/carousel.json')
    this.featurettesContent = require('../assets/data/featurettes.json')
  }
}

</script>
