<template>
  <div class="blog">
    <div class="container">
      <div class="nav-scroller py-1 mb-2">
        <nav class="nav">
          <a class="p-2 link-secondary" href="#">Devlogs</a>
          <a class="p-2 link-secondary" href="#">Retrospectives</a>
          <a class="p-2 link-secondary" href="#">Life</a>
        </nav>
      </div>
    </div>
    <div class="container blog-body">
      <hr class="seperator" />
      <div v-for="kv in posts" :key="kv[0]">
        <div class="blog-post">
          <h2 class="blog-post-title">{{kv[1].title}}</h2>
          <p class="blog-post-meta">{{kv[1].date}}</p>
          <p>{{kv[1].lead}}</p>
          <router-link :to="'/blog/' + kv[0]" class="link-secondary">continue reading...</router-link>
        </div>
        <hr class="seperator" />
      </div>
    </div>
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

@media (max-width: 62em) {
  .blog-body {
    padding: 0.5rem;
  }

  .blog-post {
    padding: 0rem;
  }
}

</style>

<script lang="ts">

import { Vue } from 'vue-class-component'

// @ts-ignore
import posts from '@/assets/blog/posts.json'

export interface BlogPost {
  title: string
  date: string
  lead: string
}

export default class Portfolio extends Vue {
  posts: Map<string, BlogPost> = new Map<string, BlogPost>()

  created () {
    for (const key in posts) {
      // @ts-ignore
      this.posts.set(key, posts[key])
    }
  }
}

</script>
