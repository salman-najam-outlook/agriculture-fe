import moment from 'moment';

export default {
  methods: {
    getLocalTimeFromUTC(utcTime) {
      return moment.utc(utcTime).local().format('DD-MM-YYYY HH:mm:ss');
    },
    formatDate(dateString) {
      return moment(dateString).format('DD-MMM-YYYY');
    },
    formatDateUTC(dateString) {
      return moment.utc(dateString).format('DD-MMM-YYYY');
    },
    getLocalTimeSlashFormat(utcTime) {
      return moment.utc(utcTime).local().format('DD/MM/YYYY');
    },
    getLocalTimeDashFormat(utcTime) {
      return moment.utc(utcTime).local().format('YYYY-MM-DD');
    }
  }
}