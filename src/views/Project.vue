<template>
  <div class="project">
    <Spinner :isLoading="contentLoading">
      <div class="container">
        <div v-if="projectID">
          <div class="row">
            <div class="col col-md-6 header-text">
              <h1 v-if="!isEditMode" class="title">{{card.title}}</h1>
              <div v-else class="row title-edit">
                <div class="col-10">
                  <input type="text" class="form-control form-control-lg" v-model="editCard.title">
                </div>
                <div class="col-2">
                  <input type="text" class="form-control form-control-lg" v-model="editCard.relevance">
                </div>
              </div>

              <p v-if="!isEditMode" class="lead">{{content.description}}</p>
              <textarea v-else class="description-edit form-control" rows="3" v-model="editContent.description"></textarea>

              <div class="button-links">
                <div v-if="!isEditMode">
                  <a v-for="link in content.buttonLinks" :key="link.url" class="btn btn-lg btn-primary" :href="link.url" target="_blank">
                    {{link.text}}
                  </a>
                </div>
                <LinkListEdit v-else :models="editContent.buttonLinks" :limit="3" />
              </div>
            </div>
            <div class="col col-md-6">
              <FirebaseImage v-if="!isEditMode" class="thumbnail" :path="'portfolio/thumbnails'" :image="card.thumbnail" />
              <div v-else class="image-edit">
                <input class="form-control" type="file" accept="image/*" :disabled="uploadingImage" @change="fileInputChanged" />
              </div>
            </div>
          </div>
          <hr />
          <div class="info-grid">
            <div class="row d-flex justify-content-center header">
              <div class="col-md-2">
                Category
                <p>
                  <span v-if="!isEditMode" class="badge rounded-pill">{{capitalize(card.category)}}</span>
                  <input v-else type="text" class="info-badge-edit form-control" v-model="editCard.category">
                </p>
              </div>
              <div class="col-md-2">
                Status
                <p>
                  <span v-if="!isEditMode" class="badge rounded-pill">{{capitalize(content.status)}}</span>
                  <input v-else type="text" class="info-badge-edit form-control" v-model="editContent.status">
                </p>
              </div>
              <div class="col-md-2">
                Initial Release Date
                <p>
                  <span v-if="!isEditMode" class="badge rounded-pill">{{formatDateMonthYear(card.date)}}</span>
                  <input v-else type="text" class="info-badge-edit form-control" v-model="editCard.date">
                </p>
              </div>
              <div class="col-md-2">
                Current Version
                <p>
                  <span v-if="!isEditMode" class="badge rounded-pill">{{content.version}}</span>
                  <input v-else type="text" class="info-badge-edit form-control" v-model="editContent.version">
                </p>
              </div>
            </div>
          </div>
          <hr />
          <div v-if="content.additionalThoughts || isEditMode" class="section">
            <h4>Additional Thoughts</h4>
            <p v-if="!isEditMode">{{content.additionalThoughts}}</p>
            <textarea v-else class="form-control" rows="3" v-model="editContent.additionalThoughts"></textarea>
          </div>
          <div v-if="content.relatedBlogPosts?.length > 0 || isEditMode" class="section">
            <h4>Related Blog Posts</h4>
            <ul v-if="!isEditMode">
              <li v-for="link in content.relatedBlogPosts" :key="link.url">
                <router-link :to="'/blog/' + link.url">{{link.text}}</router-link>
              </li>
            </ul>
            <div v-else class="row">
              <div class="col-6">
                <LinkListEdit :models="editContent.relatedBlogPosts" />
              </div>
            </div>
          </div>
          <Spinner v-if="isEditMode" :isLoading="savingContent || uploadingImage" :centered="false" class="section">
            <div class="btn-group" role="group">
              <button type="button" class="btn btn-secondary" @click="isEditMode = false">Cancel</button>
              <button type="button" class="btn btn-primary" @click="saveEdits()">Save</button>
            </div>
          </Spinner>
          <div v-else>
            <a href="#" @click.prevent="$router.back()">Back</a>
            <a v-if="userLoggedIn" id="edit-link" href="#" @click.prevent="enterEditMode()">Edit</a>
          </div>
        </div>
        <h1 v-else>Project Not Found.</h1>
      </div>
    </Spinner>
  </div>
</template>

<style lang="scss" scoped>

@import "../assets/theme.scss";

#edit-link {
  margin-left: 1rem;
}

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

.title-edit {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.description-edit {
  margin-bottom: 1rem;
}

.image-edit {
  padding: 3rem;
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

.info-badge-edit {
  text-align: center;
  margin-top: 5px;
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
import LinkListEdit from '../components/LinkListEdit.vue'
import { ProjectCard } from './Portfolio.vue'

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
  components: { Spinner, FirebaseImage, LinkListEdit },
  mixins: [StringHelper, DateHelper]
})
export default class extends Vue {
  projectID: string = ''

  contentLoading: boolean = true
  savingContent: boolean = false
  uploadingImage: boolean = false

  card: ProjectCard = {} as ProjectCard
  content: ProjectContent = {} as ProjectContent

  userLoggedIn: boolean = false
  isEditMode: boolean = false
  editCard: ProjectCard = this.card
  editContent: ProjectContent = this.content
  imageData: File | null = null

  created () {
    this.projectID = this.$route.params.id as string
    const firestore = firebase.firestore()

    // listen for auth state changes
    firebase.auth().onAuthStateChanged(user => {
      this.userLoggedIn = user !== null
    })

    // load card and content from firebase
    firestore.doc(`projects/${this.projectID}`).get().then(cardDoc => {
      if (!cardDoc.exists) {
        this.projectID = ''
        this.contentLoading = false
        return
      }
      this.card = cardDoc.data() as ProjectCard

      firestore.doc(`projects/${this.projectID}/content/data`).get().then(contentDoc => {
        if (contentDoc.exists) {
          this.content = contentDoc.data() as ProjectContent
        } else {
          this.content = {
            description: 'Add description...',
            status: 'unknown',
            version: 'unknown',
            buttonLinks: []
          } as ProjectContent
        }

        this.contentLoading = false
      })
    })
  }

  enterEditMode () {
    this.isEditMode = true
    this.imageData = null

    // copy original values so the changes can be reverted
    this.editCard = Object.assign({}, this.card)
    this.editContent = Object.assign({}, this.content)
    this.editContent.buttonLinks = this.editContent.buttonLinks.map(link => Object.assign({}, link))
    this.editContent.relatedBlogPosts = this.editContent.relatedBlogPosts?.map(link => Object.assign({}, link)) ?? []
  }

  fileInputChanged (event: any) {
    this.imageData = event.target.files[0]
  }

  saveEdits () {
    if (this.imageData == null) {
      this.updateCardAndContent()
      return
    }
    const imageData = this.imageData

    // upload image
    this.uploadingImage = true
    firebase.storage().ref('portfolio/thumbnails/' + imageData.name).put(imageData)
      .then(() => {
        this.editCard.thumbnail = imageData.name
        this.updateCardAndContent()
      })
      .catch(error => {
        alert('Error uploading image: ' + error)
      })
      .finally(() => {
        this.uploadingImage = false
      })
  }

  updateCardAndContent () {
    const firestore = firebase.firestore()
    const batch = firestore.batch()

    // update card
    const cardDoc = firestore.doc(`projects/${this.projectID}`)
    batch.set(cardDoc, this.editCard)

    // update content
    const contentDoc = firestore.doc(`projects/${this.projectID}/content/data`)
    batch.set(contentDoc, this.editContent)

    // save batch
    this.savingContent = true
    batch.commit()
      .then(() => {
        // overwrite originals with edits
        this.card = this.editCard
        this.content = this.editContent

        this.isEditMode = false
      })
      .catch(error => {
        alert('Error saving content: ' + error)
      })
      .finally(() => {
        this.savingContent = false
      })
  }
}

</script>
