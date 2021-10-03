<template>
    <div class="blog-post">
      <Spinner :isLoading="postLoading">
        <div class="container blog-body">
            <div class="blog-post">
              <div v-if="postId">
                <div v-if="!isEditMode">
                  <h2 class="blog-post-title">{{post.title}}</h2>
                  <p class="blog-post-meta">{{formatDateDayMonthYear(post.date)}}</p>
                </div>
                <div v-else class="row">
                  <div class="col col-md-6">
                    <input type="text" class="form-control" v-model="editPost.title" />
                  </div>
                  <div class="col col-md-4">
                    <input type="text" class="form-control" v-model="editPost.category" />
                  </div>
                  <div class="col col-md-2">
                    <input type="text" class="form-control" v-model="editPost.date" />
                  </div>
                </div>
                <hr />
                <div v-if="!isEditMode">
                  <p>{{post.lead}}</p>
                  <p v-html="renderMarkdown(content.body)" />
                </div>
                <div v-else>
                  <textarea class="text-field-edit form-control" rows="5" v-model="editPost.lead"></textarea>
                  <textarea class="text-field-edit form-control" rows="20" v-model="editContent.body"></textarea>
                </div>
                <hr />
                <Spinner v-if="isEditMode" :isLoading="saving" :centered="false">
                  <div class="btn-group" role="group">
                    <button type="button" class="btn btn-secondary" @click="isEditMode = false">Cancel</button>
                    <button type="button" class="btn btn-primary" @click="saveContent()">Save</button>
                  </div>
                </Spinner>
                <div v-else-if="!isDeleteMode" class="footer-links">
                  <a class="link-secondary" href="#" @click.prevent="$router.back()">Back</a>
                  <a v-if="userLoggedIn" class="link-secondary" href="#" @click.prevent="enterEditMode()">Edit</a>
                  <a v-if="userLoggedIn" href="#" @click.prevent="enterDeleteMode()">Delete</a>
                </div>
                <Spinner v-else :isLoading="deletingImage || deletingContent" :centered="false" class="section">
                  <input type="text" class="text-field-edit form-control" v-model="deleteCheck" />
                  <div class="btn-group" role="group">
                    <button type="button" class="btn btn-secondary" @click="isDeleteMode = false">Cancel</button>
                    <button type="button" class="btn btn-danger" :disabled="deleteCheck != postId" @click="deleteBlogPost()">Delete</button>
                  </div>
                </Spinner>
              </div>
              <h2 v-else>Blog Post Not Found</h2>
          </div>
        </div>
      </Spinner>
    </div>
</template>

<style lang="scss" scoped>

@import "../assets/theme.scss";

.blog-post {
    padding-bottom: 1rem;
}

.blog-body {
  padding: 2rem;
}

.blog-post {
  padding: 2rem;
}

.blog-post-title {
  margin-bottom: .25rem;
  font-size: 2.5rem;
}

.blog-post-meta {
  margin-bottom: 1.25rem;
}

.footer-links > a {
  margin-right: 1rem;
}

.text-field-edit {
  margin-bottom: 1rem;
}

.mode-light {
  .link-secondary {
    color: $light;
  }

  .blog-body {
    background-color: $background2-light;
  }
}

.mode-dark {
  .link-secondary {
    color: $dark;
  }

  .blog-body {
    background-color: $background2-dark;
  }
}

@media (max-width: 40em) {
  .blog-body {
    padding: 1rem;
  }

  .blog-post {
    padding: 0rem;
  }
}

</style>

<script lang="ts">

import { Options, Vue } from 'vue-class-component'
import firebase from 'firebase/app'
import 'firebase/firestore'

import Spinner from '../components/Spinner.vue'

import { BlogPost } from './Blog.vue'
import DateHelper from '../common/DateHelper'

const marked = require('marked')

interface BlogPostContent {
  body: string
}

@Options({
  components: { Spinner },
  mixins: [DateHelper]
})
export default class extends Vue {
  postId: string = ''

  postLoading: boolean = true
  saving: boolean = false

  post: BlogPost = {} as BlogPost
  content: BlogPostContent = {} as BlogPostContent

  userLoggedIn: boolean = false
  isEditMode: boolean = false
  editPost: BlogPost = this.post
  editContent: BlogPostContent = this.content

  isDeleteMode: boolean = false
  deleting: boolean = false
  deleteCheck: string = ''

  created () {
    this.postId = this.$route.params.id as string
    const firestore = firebase.firestore()

    // listen for auth state changes
    firebase.auth().onAuthStateChanged(user => {
      this.userLoggedIn = user !== null
    })

    // load post from firebase
    firestore.doc(`blog-posts/${this.postId}`).get().then(postDoc => {
      if (!postDoc.exists) {
        this.postId = ''
        this.postLoading = false
        return
      }
      this.post = postDoc.data() as BlogPost

      // load the content
      firestore.doc(`blog-posts/${this.postId}/content/data`).get().then(contentDoc => {
        if (contentDoc.exists) {
          this.content = contentDoc.data() as BlogPostContent
        } else {
          this.content = {
            body: ''
          } as BlogPostContent
        }

        this.postLoading = false
      })
    })
  }

  renderMarkdown (src: string): string {
    return marked(src)
  }

  enterEditMode () {
    this.isEditMode = true

    // copy original values so the changes can be reverted
    this.editPost = Object.assign({}, this.post)
    this.editContent = Object.assign({}, this.content)
  }

  saveContent () {
    const firestore = firebase.firestore()
    const batch = firestore.batch()

    // update post
    const postDoc = firestore.doc(`blog-posts/${this.postId}`)
    batch.set(postDoc, this.editPost)

    // update content
    const contentDoc = firestore.doc(`blog-posts/${this.postId}/content/data`)
    batch.set(contentDoc, this.editContent)

    // commit batch
    this.saving = true
    batch.commit()
      .then(() => {
        // overwrite originals with edits
        this.post = this.editPost
        this.content = this.editContent

        this.isEditMode = false
      })
      .catch(error => {
        alert('Error saving content: ' + error)
      })
      .finally(() => {
        this.saving = false
      })
  }

  enterDeleteMode () {
    this.isDeleteMode = true
    this.deleteCheck = ''
  }

  deleteBlogPost () {
    const firestore = firebase.firestore()
    const batch = firestore.batch()

    // delete post
    const postDoc = firestore.doc(`blog-posts/${this.postId}`)
    batch.delete(postDoc)

    // delete content
    const contentDoc = firestore.doc(`blog-posts/${this.postId}/content/data`)
    batch.delete(contentDoc)

    // commit batch
    this.deleting = true
    batch.commit()
      .then(() => {
        this.$router.back()
      })
      .catch(error => {
        alert('Error deleting blog post: ' + error)
        this.deleting = false
      })
  }
}

</script>
