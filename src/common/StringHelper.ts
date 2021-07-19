export default {
  methods: {
    capitalize: function (str: string): string {
      const tokens = str.split(' ')
      tokens.forEach((token, index) => {
        tokens[index] = token.charAt(0).toUpperCase() + token.slice(1)
      })
      return tokens.join(' ')
    },
    stringCompare: function (a: string, b: string): number {
      if (a < b) {
        return -1
      }
      if (a > b) {
        return 1
      }
      return 0
    },
    stringCompareCaseInsensitive: function (a: string, b: string): number {
      return this.stringCompare(a.toLowerCase(), b.toLowerCase())
    }
  }
}
