<template>
  <div :id="id" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-indicators">
      <button v-for="(slide, index) in slides" :key="slide.title" type="button" :data-bs-target="'#' + id" :data-bs-slide-to="index" :class="firstItemActive(index)" :aria-label="slide.title + ' Slide'"></button>
    </div>
    <div class="carousel-inner">
      <div v-for="(slide, index) in slides" :key="slide.title" :class="'carousel-item ' + firstItemActive(index)">
        <FirebaseImage class="background-img" :path="imagePath + slide.image" :useAsBackground="true" />

        <div class="container">
          <div class="carousel-caption">
            <h1>{{slide.title}}</h1>
            <p>{{slide.description}}</p>
            <p>
              <a class="btn btn-lg btn-primary" :href="slide.buttonLink.url" target="_blank">
                {{slide.buttonLink.text}}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
    <button class="carousel-control-prev" type="button" :data-bs-target="'#' + id" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" :data-bs-target="'#' + id" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>
</template>

<style lang="scss" scoped>

/* Since positioning the image, we need to help out the caption */
.carousel-caption {
  bottom: 8rem;
  z-index: 10;
}

/* Declare heights because of positioning of img element */
.carousel-item {
  height: 32rem;
}
.carousel-item > .background-img {
  background-position-x: center;
  background-position-y: top;
  min-width: 100%;
  min-height: 100%;
  background-repeat: no-repeat;
}

@media (max-width: 40em) {
  /* Bump up size of carousel content */
  .carousel-caption p {
    margin-bottom: 1.25rem;
    font-size: 1.25rem;
    line-height: 1.4;
  }
}

</style>

<script lang="ts">

import { PropType } from '@vue/runtime-core'
import { Options, Vue } from 'vue-class-component'

import FirebaseImage from './FirebaseImage.vue'

import Link from '../common/Link'

export interface CarouselSlide {
  title: string,
  description: string,
  image: string,
  buttonLink: Link
}

@Options({
  props: {
    id: String,
    imagePath: String,
    slides: Array as PropType<CarouselSlide[]>
  },
  components: { FirebaseImage }
})
export default class Carousel extends Vue {
  id!: string
  imagePath!: string
  slides!: CarouselSlide[]

  firstItemActive (index: number): string {
    return index === 0 ? 'active' : ''
  }
}

</script>
