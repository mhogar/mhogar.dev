import moment from 'moment'

export default {
  methods: {
    parseDate: function (date: string): Date {
      const tokens = date.split('-')
      return new Date(parseInt(tokens[0]), parseInt(tokens[1]) - 1, parseInt(tokens[2]))
    },
    formatDate: function (date: Date): string {
      return moment(date).format('MMMM DD, YYYY')
    }
  }
}
