<template>
  <div class="portfolio">
    <section class="py-5 text-center container">
      <div class="row py-lg-5">
        <div class="col-lg-8 col-md-8 mx-auto">
          <h1>Project Portfolio</h1>
          <p class="lead text-muted">This is a collection of note-worthy projects, games, and animations I have worked on over the years. Use this page to quickly filter and sort through the list to find the projects you are interested in.</p>
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
    <div class="album py-5">
      <div class="container">
        <Spinner :isLoading="cardsLoading">
          <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            <div v-for="card in filteredCards()" :key="card.title" class="col">
              <div class="card shadow-sm">
                <FirebaseImage :path="'portfolio/thumbnails/' + card.thumbnail" />
                <div class="card-body">
                  <h5 class="card-title">{{card.title}}</h5>
                  <p class="card-text">{{card.description}}</p>
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                      <a v-for="link in card.buttonLinks" :key="link.url" :class="'btn btn-sm ' + outlineButtonClass()" :href="link.url" target="_blank">
                        {{link.text}}
                      </a>
                    </div>
                    <small class="text-muted">{{formatDateMonthYear(card.date)}}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Spinner>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

@import "../assets/theme.scss";

h1 {
  color: $primary;
  font-weight: 300;
  line-height: 1;
}

.order-dropdowns {
  margin-top: 1rem;
}

.card > img {
  width: 100%;
  height: 225px;
}

.mode-light {
  .text-muted {
    color: $bodytext-light !important;
  }

  .album {
    background-color: $background2-light !important;
  }

  .card {
    background-color: $background-light;
  }

  .card-title {
    color: $light;
  }

  .shadow-sm {
    box-shadow: 0 0.125rem 0.25rem $drop-shadow-light !important;
  }
}

.mode-dark {
  .text-muted {
    color: $bodytext-dark !important;
  }

  .album {
    background-color: $background2-dark !important;
  }

  .card {
    background-color: $background-dark;
  }

  .card-title {
    color: $dark;
  }

  .shadow-sm {
    box-shadow: 0 0.125rem 0.25rem $drop-shadow-dark !important;
  }
}

</style>

<script lang="ts">

import { Options, Vue } from 'vue-class-component'
import firebase from 'firebase/app'
import 'firebase/firestore'

import Spinner from '../components/Spinner.vue'
import FirebaseImage from '../components/FirebaseImage.vue'

import Link from '../common/Link'
import StringHelper from '../common/StringHelper'
import DateHelper from '../common/DateHelper'

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

interface FiltersParams {
  order: OrderType
  orderDirection: OrderDirectionType
  [key: string]: any
}

@Options({
  props: {
    darkMode: Boolean
  },
  components: {
    Spinner, FirebaseImage
  },
  mixins: [StringHelper, DateHelper],
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
  cards: PortfolioCard[] = []
  categories: Map<string, CategoryData> = new Map<string, CategoryData>()
  categoriesInitialized: boolean = false
  cardsLoading: boolean = true

  filters: Filters = {
    order: 'Relevance',
    orderDirection: 1
  }

  created () {
    // load cards from firebase
    firebase.firestore().collection('projects').onSnapshot(snapshot => {
      this.cards = []

      snapshot.docs.forEach(doc => {
        this.cards.push(doc.data() as PortfolioCard)
      })
      this.cardsLoading = false

      this.initCategories()
      this.categoriesInitialized = true

      this.loadFiltersFromParams()
      this.updateFiltersParams()
    })
  }

  outlineButtonClass (): string {
    return 'btn-outline-' + (this.darkMode ? 'dark' : 'light')
  }

  updateFiltersOrder (order: OrderType) {
    this.filters.order = order
    this.filters.orderDirection = 1
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
      // @ts-ignore
      return filteredCards.sort((a, b) => this.filters.orderDirection * this.stringCompareCaseInsensitive(a.title, b.title))
    }
    if (this.filters.order === 'Date') {
      // @ts-ignore
      return filteredCards.sort((a, b) => -this.filters.orderDirection * this.stringCompare(a.date, b.date))
    }
    // relevance
    return filteredCards.sort((a, b) => this.filters.orderDirection * (a.relevance - b.relevance))
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
    const params = this.$route.query

    this.categories.forEach((value, key) => {
      const param = params[key]
      if (param) {
        value.include = param === 'true'
      }
    })

    const orderParam = params.order as OrderType
    if (orderParam === 'Relevance' || orderParam === 'Name' || orderParam === 'Date') {
      this.filters.order = orderParam
    }

    const orderDirectionParam = parseInt(params.orderDirection?.toString() ?? '') as OrderDirectionType
    if (orderDirectionParam === 1 || orderDirectionParam === -1) {
      this.filters.orderDirection = orderDirectionParam
    }
  }

  updateFiltersParams () {
    const params = {
      order: this.filters.order,
      orderDirection: this.filters.orderDirection
    } as FiltersParams

    this.categories.forEach((value, key) => {
      params[key] = value.include.toString()
    })

    this.$router.replace({ name: 'Portfolio', query: params })
  }
}

</script>
