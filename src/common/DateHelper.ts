import moment from 'moment'

export default {
  methods: {
    parseDate: function (date: string): Date {
      const tokens = date.split('-')
      return new Date(parseInt(tokens[0]), parseInt(tokens[1]) - 1, parseInt(tokens[2] ?? '1'))
    },
    formatDateDayMonthYear: function (date: string): string {
      return moment(this.parseDate(date)).format('MMMM DD, YYYY')
    },
    formatDateMonthYear: function (date: string): string {
      return moment(this.parseDate(date)).format('MMMM YYYY')
    }
  }
}
