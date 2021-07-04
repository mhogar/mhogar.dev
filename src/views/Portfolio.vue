<template>
  <div class="portfolio">
    <section class="py-5 text-center container">
      <div class="row py-lg-5">
        <div class="col-lg-6 col-md-8 mx-auto">
          <h1 class="fw-light">Project Portfolio</h1>
          <p class="lead text-muted">This is a collection of every project, game, and animation I think are worth sharing.</p>
        </div>
      </div>
      <div v-for="kv in categories" :key="kv[0]" class="form-check form-check-inline">
        <input class="form-check-input" type="checkbox" v-model="kv[1].include">
        <label class="form-check-label">{{capitalize(kv[0])}} ({{kv[1].count}})</label>
      </div>
      <div class="row order-dropdowns">
        <div class="input-group justify-content-center" role="group">
          <button :class="'btn dropdown-toggle ' + outlineButtonClass()" type="button" data-bs-toggle="dropdown" aria-expanded="false">Order by {{filters.order}}</button>
          <ul class="dropdown-menu">
            <li><button class="dropdown-item" @click="updateFiltersOrder('Relevance')">Relevance</button></li>
            <li><button class="dropdown-item" @click="updateFiltersOrder('Name')">Name</button></li>
            <li><button class="dropdown-item" @click="updateFiltersOrder('Date')">Date</button></li>
          </ul>
          <button :class="'btn dropdown-toggle ' + outlineButtonClass()" type="button" data-bs-toggle="dropdown" aria-expanded="false">{{orderDirectionDisplayText(filters.orderDirection)}}</button>
          <ul class="dropdown-menu">
            <li><button class="dropdown-item" @click="filters.orderDirection = 1">{{orderDirectionDisplayText(1)}}</button></li>
            <li><button class="dropdown-item" @click="filters.orderDirection = -1">{{orderDirectionDisplayText(-1)}}</button></li>
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
                    <a v-for="link in card.buttonLinks" :key="link.url" :class="'btn btn-sm ' + outlineButtonClass()" :href="link.url" target="_blank">
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

<style lang="scss" scoped>

@import "../assets/theme.scss";

.order-dropdowns {
  margin-top: 1rem;
}

.mode-light .text-muted {
  color: $bodytext-light !important;
}
.mode-dark .text-muted {
  color: $bodytext-dark !important;
}

.mode-light .album {
  background-color: $background2-light !important;
}
.mode-dark .album {
  background-color: $background2-dark !important;
}

.card > img {
  width: 100%;
  height: 225px;
}

.mode-light .card {
  background-color: $background-light;
}
.mode-dark .card {
  background-color: $background-dark;
}

.mode-light .card-title {
  color: $light;
}
.mode-dark .card-title {
  color: $dark;
}

.mode-light .shadow-sm {
  box-shadow: 0 0.125rem 0.25rem $drop-shadow-light !important;
}
.mode-dark .shadow-sm {
  box-shadow: 0 0.125rem 0.25rem $drop-shadow-dark !important;
}

</style>

<script lang="ts">

import { Options, Vue } from 'vue-class-component'
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

interface CategoryData {
  count: number,
  include: boolean
}

type OrderType = 'Relevance' | 'Name' | 'Date'
type OrderDirectionType = 1 | -1

interface Filters {
  order: OrderType,
  orderDirection: OrderDirectionType
}

@Options({
  props: {
    darkMode: Boolean
  },
  watch: {
    filters: {
      deep: true,
      handler: function (oldValue, newValue) {
        this.updateFiltersParams()
      }
    },
    categories: {
      deep: true,
      handler: function (oldValue, newValue) {
        if (this.categoriesInitialized) {
          this.updateFiltersParams()
        }
      }
    }
  }
})
export default class Portfolio extends Vue {
  darkMode!: boolean

  cards: PortfolioCard[] = cards

  categories: Map<string, CategoryData> = new Map<string, CategoryData>()
  categoriesInitialized: boolean = false

  filters: Filters = {
    order: 'Relevance',
    orderDirection: 1
  }

  created () {
    this.initCategories()
    this.categoriesInitialized = true

    this.loadFiltersFromParams()
    this.updateFiltersParams()
  }

  loadThumbnail (thumbnail: string): string {
    return require('@/assets/portfolio/thumbnails/' + thumbnail)
  }

  outlineButtonClass (): string {
    return 'btn-outline-' + (this.darkMode ? 'dark' : 'light')
  }

  updateFiltersOrder (order: OrderType) {
    this.filters.order = order
    this.filters.orderDirection = 1
  }

  capitalize (str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
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

  orderDirectionDisplayText (dir: OrderDirectionType): string {
    if (dir === 1) {
      if (this.filters.order === 'Relevance') {
        return 'Most'
      } else if (this.filters.order === 'Date') {
        return 'Newest'
      }
      return 'Ascending'
    }

    if (this.filters.order === 'Relevance') {
      return 'Least'
    } else if (this.filters.order === 'Date') {
      return 'Oldest'
    }
    return 'Descending'
  }

  filteredCards (): PortfolioCard[] {
    const filteredCards: PortfolioCard[] = []

    this.cards.forEach((card: PortfolioCard) => {
      if (this.categories.get(card.category)?.include) {
        filteredCards.push(card)
      }
    })

    if (this.filters.order === 'Name') {
      return filteredCards.sort((a, b) => this.filters.orderDirection * this.stringCompareCaseInsensitive(a.title, b.title))
    }
    if (this.filters.order === 'Date') {
      return filteredCards.sort((a, b) => -this.filters.orderDirection * this.stringCompare(a.date, b.date))
    }
    // relevance
    return filteredCards.sort((a, b) => this.filters.orderDirection * (a.relevance - b.relevance))
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

  initCategories () {
    this.categories.clear()

    this.cards.forEach((card: PortfolioCard) => {
      const data = this.categories.get(card.category)

      if (!data) {
        this.categories.set(card.category, {
          count: 1,
          include: true
        })
      } else {
        data.count += 1
      }
    })
  }

  loadFiltersFromParams () {
    const params = new URL(window.location.href).searchParams

    this.categories.forEach((value, key) => {
      const param = params.get(key)
      if (param) {
        value.include = param === 'true'
      }
    })

    const orderParam = params.get('order') as OrderType
    if (orderParam === 'Relevance' || orderParam === 'Name' || orderParam === 'Date') {
      this.filters.order = orderParam
    }

    const orderDirectionParam = parseInt(params.get('orderDirection') ?? '') as OrderDirectionType
    if (orderDirectionParam === 1 || orderDirectionParam === -1) {
      this.filters.orderDirection = orderDirectionParam
    }
  }

  updateFiltersParams () {
    const url = new URL(window.location.href)

    this.categories.forEach((value, key) => {
      url.searchParams.set(key, value.include.toString())
    })

    url.searchParams.set('order', this.filters.order)
    url.searchParams.set('orderDirection', this.filters.orderDirection.toString())

    window.history.replaceState(null, '', url.href)
  }
}

</script>
