const marked = require('marked')

export default {
  methods: {
    renderMarkdown: function (src: string): string {
      return marked(src)
    }
  }
}
