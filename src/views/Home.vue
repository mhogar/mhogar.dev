<template>
  <div class="home">
    <Spinner :isLoading="carouselLoading || featurettesLoading">
      <Carousel :id="'categoryCarousel'" :imageDir="'home/'" :slides="carouselSlides" />
      <div class="container">
        <Featurettes :content="featurettesContent" />
      </div>
    </Spinner>
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
import firebase from 'firebase/app'
import 'firebase/firestore'

import Spinner from '../components/Spinner.vue'
import Carousel, { CarouselSlide } from '../components/Carousel.vue'
import Featurettes, { FeaturetteContent } from '../components/Featurettes.vue'

@Options({
  components: {
    Spinner, Carousel, Featurettes
  }
})
export default class Home extends Vue {
  carouselLoading: boolean = true
  featurettesLoading: boolean = true

  carouselSlides: CarouselSlide[] = []
  featurettesContent: FeaturetteContent[] = []

  created () {
    // load slides from firebase
    firebase.firestore().collection('carousel').onSnapshot(snapshot => {
      this.carouselSlides = []

      snapshot.docs.forEach(doc => {
        this.carouselSlides.push(doc.data() as CarouselSlide)
      })

      this.carouselLoading = false
    })

    // load featurettes from firebase
    firebase.firestore().collection('featurettes').onSnapshot(snapshot => {
      this.featurettesContent = []

      snapshot.docs.forEach(doc => {
        this.featurettesContent.push(doc.data() as FeaturetteContent)
      })

      this.featurettesLoading = false
    })
  }
}

</script>
