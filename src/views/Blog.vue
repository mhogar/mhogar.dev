<template>
  <div class="blog">
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

.link-secondary.selected {
  font-weight: bold;
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
import StringHelper from '../common/StringHelper'
import DateHelper from '../common/DateHelper'

// @ts-ignore
import posts from '@/assets/blog/posts.json'

export interface BlogPost {
  id: string
  title: string
  category: string
  date: Date
  lead: string
}

interface CategoryData {
  posts: BlogPost[]
  count: number
}

@Options({
  mixins: [StringHelper, DateHelper]
})
export default class Portfolio extends Vue {
  categoryMap: Map<string, CategoryData> = new Map<string, CategoryData>()
  selectedCategory: string = ''

  created () {
    this.loadSelectedCategory()

    // @ts-ignore
    Object.entries(posts).forEach(kv => {
      const json = kv[1]
      const post : BlogPost = {
        id: json.id,
        title: json.title,
        category: json.category,
        // @ts-ignore
        date: this.parseDate(json.date),
        lead: json.lead
      }

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

    this.categoryMap.forEach(value => {
      // @ts-ignore
      value.posts.sort((a, b) => this.dateCompare(b.date, a.date))
    })

    if (!this.categoryMap.has(this.selectedCategory)) {
      this.updateSelectedCategory(this.categoryMap.keys().next().value)
    }
  }

  loadSelectedCategory () {
    this.selectedCategory = this.$route.query.category?.toString() ?? ''
  }

  updateSelectedCategory (category: string) {
    this.selectedCategory = category
    this.$router.push({ path: 'blog', query: { category: category } })
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
}

</script>
