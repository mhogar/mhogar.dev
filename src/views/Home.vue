<template>
  <div class="home">
    <Carousel :id="'categoryCarousel'" :imageDir="'home/'" :slides="carouselSlides" />
    <div class="container">
      <Featurettes :content="featurettesContent" />
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
  padding-bottom: 5rem;
}

</style>

<script lang="ts">

import { Options, Vue } from 'vue-class-component'
import Carousel, { CarouselSlide } from '../components/Carousel.vue'
import Featurettes, { FeaturetteContent } from '../components/Featurettes.vue'

// @ts-ignore
import carouselSlides from '@/assets/home/carousel.json'
// @ts-ignore
import featurettesContent from '@/assets/home/featurettes.json'

@Options({
  components: {
    Carousel, Featurettes
  }
})
export default class Home extends Vue {
  carouselSlides: CarouselSlide[] = carouselSlides
  featurettesContent: FeaturetteContent[] = featurettesContent
}

</script>
