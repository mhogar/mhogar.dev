<template>
  <div class="home">
    <Carousel :slides="carouselSlides" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import Carousel, { Slide } from '../components/Carousel.vue'

@Options({
  components: {
    Carousel
  }
})
export default class Home extends Vue {
  carouselSlides: Slide[] = [
    {
      title: 'Code Projects',
      description: 'Interesting, nerdy, and always open-source.',
      image: 'banner.png',
      buttonLink: {
        text: 'View them on GitHub',
        url: 'https://github.com/mhogar'
      }
    },
    {
      title: 'Games',
      description: 'Fun, creative, with little something for everyone.',
      image: '',
      buttonLink: {
        text: 'Play them on Itch.io',
        url: 'https://mhogar.itch.io/'
      }
    },
    {
      title: 'Animations',
      description: 'Short, funny, and worth a watch.',
      image: '',
      buttonLink: {
        text: 'Watch them on YouTube',
        url: 'https://www.youtube.com/channel/UC4TeW-oe79vNo5ewMXJvr4w'
      }
    }
  ]
}
</script>
