<template>
  <div class="project">
    <Spinner :isLoading="contentLoading">
      <div class="container">
        <div v-if="content">
          <div class="row">
            <div class="col col-md-6">
              <h1 class="title">{{content.title}}</h1>
              <p class="lead">{{content.description}}</p>
              <div class="button-links">
                <a v-for="link in content.buttonLinks" :key="link.url" class="btn btn-lg btn-primary" :href="link.url" target="_blank">
                  {{link.text}}
                </a>
              </div>
            </div>
            <div class="col col-md-6">
              <FirebaseImage class="thumbnail" width="650" :path="'portfolio/thumbnails/' + content.thumbnail" />
            </div>
          </div>
          <hr />
          <div class="info-grid">
            <div class="row d-flex justify-content-center header">
              <div class="col-md-2">
                Category<p><span class="badge rounded-pill">{{capitalize(content.category)}}</span></p>
              </div>
              <div class="col-md-2">
                Status<p><span class="badge rounded-pill">{{capitalize(content.status)}}</span></p>
              </div>
              <div class="col-md-2">
                Initial Release Date<p><span class="badge rounded-pill">{{formatDateMonthYear(content.date)}}</span></p>
              </div>
              <div class="col-md-2">
                Current Version<p><span class="badge rounded-pill">{{content.version}}</span></p>
              </div>
            </div>
          </div>
          <hr />
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
}

.title {
  padding-top: 3rem;
  font-size: 3.5rem;
}

.button-links .btn {
  margin-right: 1rem;
}

.info-grid {
  text-align: center;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
}

.info-grid .header {
  margin-bottom: 0.5rem;
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

</style>

<script lang="ts">

import { Options, Vue } from 'vue-class-component'
import firebase from 'firebase/app'
import 'firebase/firestore'

import { ProjectContent } from './Portfolio.vue'
import Spinner from '../components/Spinner.vue'
import FirebaseImage from '../components/FirebaseImage.vue'

import StringHelper from '../common/StringHelper'
import DateHelper from '../common/DateHelper'

@Options({
  components: { Spinner, FirebaseImage },
  mixins: [StringHelper, DateHelper]
})
export default class Project extends Vue {
  content: ProjectContent | null = null
  contentLoading: boolean = true

  created () {
    const id = this.$route.params.id as string

    // load content from firebase
    firebase.firestore().doc(`projects/${id}`).onSnapshot(doc => {
      if (!doc.exists) {
        this.contentLoading = false
        return
      }

      this.content = doc.data() as ProjectContent
      this.contentLoading = false
    })
  }
}

</script>
