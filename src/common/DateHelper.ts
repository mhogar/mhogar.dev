import moment from 'moment'

export default {
  methods: {
    parseDate: function (date: string): Date {
      const tokens = date.split('-')
      return new Date(parseInt(tokens[0]), parseInt(tokens[1]) - 1, parseInt(tokens[2] ?? '1'))
    },
    formatDateDayMonthYear: function (date: Date): string {
      return moment(date).format('MMMM DD, YYYY')
    },
    formatDateMonthYear: function (date: Date): string {
      return moment(date).format('MMMM YYYY')
    },
    dateCompare: function (a: Date, b: Date): number {
      if (a < b) {
        return -1
      }
      if (a > b) {
        return 1
      }
      return 0
    }
  }
}
