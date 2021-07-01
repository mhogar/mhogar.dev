<template>
  <section class="py-5 text-center container">
    <div class="row py-lg-5">
      <div class="col-lg-6 col-md-8 mx-auto">
        <h1 class="fw-light">Project Portfolio</h1>
        <p class="lead text-muted">This is a collection of every project, game, and animation I think are worth sharing.</p>
      </div>
    </div>
  </section>
  <div class="album py-5 bg-light">
    <div class="container">
      <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
        <div v-for="card in cards" :key="card.title" class="col">
          <div class="card shadow-sm">
            <!-- <img src="../imgs/slime_farm_thumbnail.png" width="100%" height="225" /> -->
            <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"/><text x="50%" y="50%" fill="#eceeef" dy=".3em">Thumbnail</text></svg>

            <div class="card-body">
              <h5 class="card-title">{{card.title}}</h5>
              <p class="card-text">{{card.description}}</p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                  <a v-for="link in card.buttonLinks" :key="link.url" class="btn btn-sm btn-outline-secondary" :href="link.url" target="_blank">
                    {{link.text}}
                  </a>
                </div>
                <small class="text-muted">{{card.date}}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import { Vue } from 'vue-class-component'
import Link from '../common/Link'

export interface PortfolioCard {
  title: string,
  description: string,
  date: string,
  buttonLinks: Link[]
}

export default class Portfolio extends Vue {
  cards: PortfolioCard[] = [
    {
      title: 'Slime Farm',
      description: 'Slime Farm is an evolution simulator. Completed as a university individual course of study, this application is an intuitive and user-friendly approach to genetic algorithms.',
      date: 'Fall 2020',
      buttonLinks: [
        {
          text: 'View on GitHub',
          url: 'https://github.com/mhogar/SlimeFarm'
        }
      ]
    }
  ]
}

</script>
