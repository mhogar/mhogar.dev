<template>
  <div>
    <section class="py-5 text-center container">
      <div class="row py-lg-5">
        <div class="col-lg-6 col-md-8 mx-auto">
          <h1 class="fw-light">Project Portfolio</h1>
          <p class="lead text-muted">This is a collection of every project, game, and animation I think are worth sharing.</p>
        </div>
      </div>
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="checkbox" v-model="filters.includeProjects">
        <label class="form-check-label">Code Projects</label>
      </div>
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="checkbox" v-model="filters.includeGames">
        <label class="form-check-label">Games</label>
      </div>
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="checkbox" v-model="filters.includeAnimations">
        <label class="form-check-label">Animations</label>
      </div>
      <div class="row order-dropdowns">
        <div class="input-group justify-content-center" role="group">
          <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Order by {{filters.order}}</button>
          <ul class="dropdown-menu">
            <li><button class="dropdown-item" v-on:click="filters.order = 'Relevance'">Relevance</button></li>
            <li><button class="dropdown-item" v-on:click="filters.order = 'Name'">Name</button></li>
            <li><button class="dropdown-item" v-on:click="filters.order = 'Date'">Date</button></li>
          </ul>
          <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">{{filters.orderDirection === 1 ? 'Ascending' : 'Descending'}}</button>
          <ul class="dropdown-menu">
            <li><button class="dropdown-item" v-on:click="filters.orderDirection = 1">Ascending</button></li>
            <li><button class="dropdown-item" v-on:click="filters.orderDirection = -1">Descending</button></li>
          </ul>
        </div>
      </div>
    </section>
    <div class="album py-5 bg-light">
      <div class="container">
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
          <div v-for="card in filteredCards()" :key="card.title" class="col">
            <div class="card shadow-sm">
              <img :src="loadThumbnail(card.thumbnail)" />
              <div class="card-body">
                <h5 class="card-title">{{card.title}}</h5>
                <p class="card-text">{{card.description}}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="btn-group">
                    <a v-for="link in card.buttonLinks" :key="link.url" class="btn btn-sm btn-outline-secondary" :href="link.url" target="_blank">
                      {{link.text}}
                    </a>
                  </div>
                  <small class="text-muted">{{dateDisplayText(card.date)}}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.order-dropdowns {
  margin-top: 1rem;
}

.album {
  margin-bottom: 3rem;
}

.card > img {
  width: 100%;
  height: 225px;
}

</style>

<script lang="ts">

import { Vue } from 'vue-class-component'
import Link from '../common/Link'

// @ts-ignore
import cards from '@/assets/portfolio/cards.json'

export interface PortfolioCard {
  title: string,
  description: string,
  category: string,
  date: string,
  relevance: number,
  thumbnail: string,
  buttonLinks: Link[]
}

interface Filters {
  includeProjects: boolean,
  includeGames: boolean,
  includeAnimations: boolean
  order: 'Relevance' | 'Name' | 'Date',
  orderDirection: 1 | -1
}

export default class Portfolio extends Vue {
  cards: PortfolioCard[] = cards
  filters: Filters = {
    includeProjects: true,
    includeGames: true,
    includeAnimations: true,
    order: 'Relevance',
    orderDirection: 1
  }

  loadThumbnail (thumbnail: string): string {
    return require('@/assets/portfolio/thumbnails/' + thumbnail)
  }

  dateDisplayText (date: string): string {
    const tokens = date.split('-')
    const year = tokens[0]
    const month = parseInt(tokens[1])

    if (month < 4) {
      return 'Winter ' + year
    }
    if (month < 7) {
      return 'Spring ' + year
    }
    if (month < 10) {
      return 'Summer ' + year
    }
    return 'Fall ' + year
  }

  filteredCards (): PortfolioCard[] {
    const filteredCards: PortfolioCard[] = []

    this.cards.forEach((card: PortfolioCard) => {
      if (this.shouldShowCard(card)) {
        filteredCards.push(card)
      }
    })

    if (this.filters.order === 'Name') {
      return filteredCards.sort((a, b) => this.filters.orderDirection * this.stringCompareCaseInsensitive(a.title, b.title))
    }
    if (this.filters.order === 'Date') {
      return filteredCards.sort((a, b) => this.filters.orderDirection * this.stringCompare(a.date, b.date))
    }
    // relevance
    return filteredCards.sort((a, b) => this.filters.orderDirection * (a.relevance - b.relevance))
  }

  shouldShowCard (card: PortfolioCard): boolean {
    if (card.category === 'projects' && !this.filters.includeProjects) {
      return false
    }
    if (card.category === 'games' && !this.filters.includeGames) {
      return false
    }
    if (card.category === 'animations' && !this.filters.includeAnimations) {
      return false
    }

    return true
  }

  stringCompare (a: string, b: string): number {
    if (a < b) {
      return -1
    }
    if (a > b) {
      return 1
    }
    return 0
  }

  stringCompareCaseInsensitive (a: string, b: string): number {
    return this.stringCompare(a.toLowerCase(), b.toLowerCase())
  }
}

</script>
