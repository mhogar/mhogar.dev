<template>
    <div class="blog-post">
      <Spinner :isLoading="postLoading">
        <div class="container blog-body">
            <div class="blog-post">
              <div v-if="post">
                <h2 class="blog-post-title">{{post.title}}</h2>
                <p class="blog-post-meta">{{formatDateDayMonthYear(post.date)}}</p>
                <hr />
                <p v-for="paragraph in paragraphs" :key="paragraph">{{paragraph}}</p>
              </div>
              <h2 v-else>Blog Post Not Found</h2>
              <a class="link-secondary" href="#" @click.prevent="$router.back()">Back</a>
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

interface BlogPostContent {
  paragraphs: string[]
}

@Options({
  components: { Spinner },
  mixins: [DateHelper]
})
export default class BlogPostComponent extends Vue {
  postLoading: boolean = true

  post: BlogPost | null = null
  paragraphs: string[] = []

  created () {
    const id = this.$route.params.id as string
    const firestore = firebase.firestore()

    // load post from firebase
    firestore.collection('blog-posts').doc(id).onSnapshot(postDoc => {
      if (!postDoc.exists) {
        return
      }
      this.post = postDoc.data() as BlogPost

      // load the paragraphs
      firestore.doc(`blog-posts/${id}/content/data`).onSnapshot(dataDoc => {
        if (!this.post) {
          return
        }

        const content = dataDoc.data() as BlogPostContent

        this.paragraphs = [this.post.lead]
        this.paragraphs.push(...content.paragraphs)

        this.postLoading = false
      })
    })
  }
}

</script>
