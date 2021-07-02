<template>
  <Carousel :id="'categoryCarousel'" :imageDir="'home/'" :slides="carouselSlides" />
  <div class="container">
    <Featurettes :content="featurettesContent" />
  </div>
</template>

<style scoped>

.carousel {
  margin-bottom: 4rem;
}

</style>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import Carousel, { CarouselSlide } from '../components/Carousel.vue'
import Featurettes, { FeaturetteContent } from '../components/Featurettes.vue'

@Options({
  components: {
    Carousel, Featurettes
  }
})
export default class Home extends Vue {
  carouselSlides: CarouselSlide[] = [
    {
      title: 'Code Projects',
      description: 'Interesting, nerdy, and always open-source.',
      image: 'banner1.png',
      buttonLink: {
        text: 'View them on GitHub',
        url: 'https://github.com/mhogar'
      }
    },
    {
      title: 'Games',
      description: 'Fun, creative, with little something for everyone.',
      image: 'banner1.png',
      buttonLink: {
        text: 'Play them on Itch.io',
        url: 'https://mhogar.itch.io/'
      }
    },
    {
      title: 'Animations',
      description: 'Short, funny, and worth a watch.',
      image: 'banner1.png',
      buttonLink: {
        text: 'Watch them on YouTube',
        url: 'https://www.youtube.com/channel/UC4TeW-oe79vNo5ewMXJvr4w'
      }
    }
  ]

  featurettesContent: FeaturetteContent[] = [
    {
      heading: 'Hello everyone,',
      subheading: 'mhogar here!',
      lead: "Armed with a Bachelor of Computing, and pursing a Masters in Cybersecurity, I have a passion for programming and expressing myself creatively. I'll hope you'll join me on my quest to make the world a better place, one line of code at a time."
    },
    {
      heading: 'Check out the',
      subheading: 'Portfolio.',
      lead: "Want to know I've made, but don't want to sift through the internet? Me neither. Check out the portfolio for easy access to every project, game, and animation, all in one place."
    },
    {
      heading: 'Read the',
      subheading: 'Blog.',
      lead: "Want to know what's on my mind? The blog is the best place for development updates, project retrospectives, and just general (and sometimes random) thoughts about life."
    }
  ]
}
</script>
