export default {
  methods: {
    capitalize: function (str: string): string {
      return str.charAt(0).toUpperCase() + str.slice(1)
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
