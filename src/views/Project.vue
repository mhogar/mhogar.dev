<template>
  <div class="project">
    <Spinner :isLoading="contentLoading">
      <div class="container">
        <div v-if="card">
          <div class="row">
            <div class="col col-md-6 header-text">
              <h1 class="title">{{card.title}}</h1>
              <p class="lead">{{content.description}}</p>
              <div class="button-links">
                <a v-for="link in content.buttonLinks" :key="link.url" class="btn btn-lg btn-primary" :href="link.url" target="_blank">
                  {{link.text}}
                </a>
              </div>
            </div>
            <div class="col col-md-6">
              <FirebaseImage class="thumbnail" :path="'portfolio/thumbnails/' + card.thumbnail" />
            </div>
          </div>
          <hr />
          <div class="info-grid">
            <div class="row d-flex justify-content-center header">
              <div class="col-md-2">
                Category<p><span class="badge rounded-pill">{{capitalize(card.category)}}</span></p>
              </div>
              <div class="col-md-2">
                Status<p><span class="badge rounded-pill">{{capitalize(content.status)}}</span></p>
              </div>
              <div class="col-md-2">
                Initial Release Date<p><span class="badge rounded-pill">{{formatDateMonthYear(card.date)}}</span></p>
              </div>
              <div class="col-md-2">
                Current Version<p><span class="badge rounded-pill">{{content.version}}</span></p>
              </div>
            </div>
          </div>
          <hr />
          <div v-if="content.additionalThoughts" class="section">
            <h4>Additional Thoughts</h4>
            <p>{{content.additionalThoughts}}</p>
          </div>
          <div v-if="content.relatedBlogPosts" class="section">
            <h4>Related Blog Posts</h4>
            <ul>
              <li v-for="link in content.relatedBlogPosts" :key="link.url">
                <router-link :to="'/blog/' + link.url">{{link.text}}</router-link>
              </li>
            </ul>
          </div>
          <a href="#" @click.prevent="$router.back()">Back</a>
        </div>
        <h1 v-else>Project Not Found.</h1>
      </div>
    </Spinner>
  </div>
</template>

<style lang="scss" scoped>

@import "../assets/theme.scss";

.project {
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.thumbnail {
  border-radius: .3em;
  min-width: 300px;
  max-width: 100%;
  margin-top: 1rem;
}

.title {
  padding-top: 3rem;
  font-size: 3.5rem;
}

.button-links .btn {
  margin-right: 0.5rem;
}

.info-grid {
  text-align: center;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
}

.info-grid .header {
  margin-bottom: 0.5rem;
}

.header-text {
  padding-right: 2rem;
}

.section {
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.mode-light {
  .badge {
    background-color: $light;
  }

  .thumbnail {
    box-shadow: 0 1rem 3rem $drop-shadow-light !important;
  }
}

.mode-dark {
  .badge {
    background-color: $dark;
  }

  .thumbnail {
    box-shadow: 0 1rem 3rem $drop-shadow-dark !important;
  }
}

@media (max-width: 40em) {
  .title {
    font-size: 2.5rem;
  }
}

</style>

<script lang="ts">

import { Options, Vue } from 'vue-class-component'
import firebase from 'firebase/app'
import 'firebase/firestore'

import Spinner from '../components/Spinner.vue'
import FirebaseImage from '../components/FirebaseImage.vue'
import PortfolioCard from './Portfolio.vue'

import StringHelper from '../common/StringHelper'
import DateHelper from '../common/DateHelper'
import Link from '../common/Link'

interface ProjectContent {
  description: string,
  status: string,
  version: string,
  buttonLinks: Link[],
  additionalThoughts?: string,
  relatedBlogPosts?: Link[]
}

@Options({
  components: { Spinner, FirebaseImage },
  mixins: [StringHelper, DateHelper]
})
export default class Project extends Vue {
  card: PortfolioCard | null = null
  content: ProjectContent = {} as ProjectContent
  contentLoading: boolean = true

  created () {
    const id = this.$route.params.id as string
    const firestore = firebase.firestore()

    // load card and content from firebase
    firestore.doc(`projects/${id}`).onSnapshot(cardDoc => {
      if (!cardDoc.exists) {
        this.contentLoading = false
        return
      }
      this.card = cardDoc.data() as PortfolioCard

      firestore.doc(`projects/${id}/content/data`).onSnapshot(contentDoc => {
        this.content = contentDoc.data() as ProjectContent
        this.contentLoading = false
      })
    })
  }
}

</script>
