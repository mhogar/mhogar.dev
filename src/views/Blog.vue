<template>
  <div class="blog">
    <Spinner :isLoading="postsLoading">
      <div class="container">
        <div class="nav-scroller py-1 mb-2">
          <nav class="nav">
            <span v-for="kv in categoryMap" :key="kv[0]" :class="'p-2 link-secondary ' + linkSelected(kv[0])"
              @click.prevent="updateSelectedCategory(kv[0])">
              <a class="link-secondary" href="#">{{capitalize(kv[0])}}</a> ({{kv[1].count}})
            </span>
          </nav>
        </div>
      </div>
      <div class="container blog-body">
        <hr class="seperator" />
        <div v-for="post in filteredPosts()" :key="post.id">
          <div class="blog-post">
            <h2 class="blog-post-title">{{post.title}}</h2>
            <p class="blog-post-meta">{{formatDateDayMonthYear(post.date)}}</p>
            <p>{{post.lead}}</p>
            <router-link :to="'/blog/' + post.id" class="link-secondary">View Full Post</router-link>
          </div>
          <hr class="seperator" />
        </div>
        <Spinner v-if="userLoggedIn" :isLoading="saving" :centered="false">
          <a v-if="!isEditMode" class="link-secondary" href="#" @click.prevent="enterEditMode()">New Post</a>
          <div v-else>
            <input type="text" class="form-control post-id-input" v-model="newPostId">
            <div class="btn-group" role="group">
              <button type="button" class="btn btn-secondary" @click="isEditMode = false">Cancel</button>
              <button type="button" class="btn btn-primary" :disabled="!newPostId" @click="createBlogPost()">Create</button>
            </div>
          </div>
        </Spinner>
      </div>
    </Spinner>
  </div>
</template>

<style lang="scss" scoped>

@import "../assets/theme.scss";

.blog {
  padding-bottom: 1rem;
}

.blog-body {
  padding: 2rem;
  margin-bottom: 1.5rem;
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

.link-secondary.selected {
  font-weight: bold;
}

.post-id-input {
  margin-bottom: 0.5rem;
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

import StringHelper from '../common/StringHelper'
import DateHelper from '../common/DateHelper'

export interface BlogPost {
  id: string
  title: string
  category: string
  date: string
  lead: string
}

interface CategoryData {
  posts: BlogPost[]
  count: number
}

@Options({
  components: { Spinner },
  mixins: [StringHelper, DateHelper]
})
export default class extends Vue {
  postsLoading: boolean = true

  categoryMap: Map<string, CategoryData> = new Map<string, CategoryData>()
  selectedCategory: string = ''

  userLoggedIn: boolean = false
  isEditMode: boolean = false
  newPostId: string = ''
  saving: boolean = false

  created () {
    this.loadSelectedCategory()

    // listen for auth state changes
    firebase.auth().onAuthStateChanged(user => {
      this.userLoggedIn = user !== null
    })

    // load posts from firebase
    firebase.firestore().collection('blog-posts').get().then(collection => {
      this.categoryMap.clear()

      // create the posts and store in category map
      collection.docs.forEach(doc => {
        const post = doc.data() as BlogPost
        post.id = doc.id

        const data = this.categoryMap.get(post.category)
        if (!data) {
          this.categoryMap.set(post.category, {
            posts: [post],
            count: 1
          })
        } else {
          data.posts.push(post)
          data.count += 1
        }
      })

      // sort the posts by date
      this.categoryMap.forEach(value => {
        // @ts-ignore
        value.posts.sort((a, b) => this.stringCompare(b.date, a.date))
      })

      // if selected category is invalid, choose the first in the map
      if (!this.categoryMap.has(this.selectedCategory)) {
        this.updateSelectedCategory(this.categoryMap.keys().next().value)
      }

      this.postsLoading = false
    })
  }

  loadSelectedCategory () {
    this.selectedCategory = this.$route.query.category?.toString() ?? ''
  }

  updateSelectedCategory (category: string) {
    this.selectedCategory = category
    this.$router.replace({ name: 'Blog', query: { category: category } })
  }

  filteredPosts (): BlogPost[] {
    const data = this.categoryMap.get(this.selectedCategory)
    if (data) {
      return data.posts
    }
    return []
  }

  linkSelected (category: string): string {
    return this.selectedCategory === category ? 'selected' : ''
  }

  enterEditMode () {
    this.isEditMode = true
    this.newPostId = ''
  }

  createBlogPost () {
    const today = new Date()
    const post = {
      title: this.newPostId,
      category: 'unknown',
      date: today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate(),
      lead: ''
    } as BlogPost

    const docRef = firebase.firestore().doc(`blog-posts/${this.newPostId}`)

    // check blog post does not aleardy exist
    this.saving = true
    docRef.get()
      .then(doc => {
        if (doc.exists) {
          alert('Blog post ID already in use')
          this.saving = false
          return
        }

        // create blog post
        docRef.set(post)
          .then(() => {
            this.$router.push('/blog/' + this.newPostId)
          })
          .catch(error => {
            alert('Error creating blog post: ' + error)
            this.saving = false
          })
      })
      .catch(error => {
        alert('Error getting blog post: ' + error)
        this.saving = false
      })
  }
}

</script>
