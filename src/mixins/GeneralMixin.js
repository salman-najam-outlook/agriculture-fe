import moment from 'moment';

export default {
    methods: {
        validateEmail(email) {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        },
        isNumeric(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        },
        validMobileNumber(phone){
          if(!phone) return false;
          // if(phone.length < 6 || phone.length > 15){
          //   return false;
          // }
          return this.isNumeric(phone);
        },
        isNumber(evt) {
            evt = (evt) ? evt : window.event;
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
              evt.preventDefault();
            } else {
              return true;
            }
        },

        arraysEqual(a, b) {
            if (a === b) return true;
            if (a.length !== b.length) return false;
          
            for (var i = 0; i < a.length; ++i) {
              if (a[i] !== b[i]) return false;
            }
            return true;
        },

        onlyAlpha(str) {
          // const rx = !/^[a-zA-Z]*$/;
          if(str == '' || str == null) return false;
          if(str.trim() == '') return false;
          
          return /^[a-zA-Z\s]*$/.test(str);
        },

        formatDate(date, format = 'DD-MMM-YYYY') {
          return moment(date).format(format);
        },

        filterCountry(item, queryText){
              return item.name.toLocaleLowerCase().includes(queryText.toLocaleLowerCase())
                  ||  item.dial_code.toString().includes(queryText.toLocaleLowerCase())

      },

        filterState(item, queryText){
              return item.toLocaleLowerCase().includes(queryText.toLocaleLowerCase())

      },
     sortByNestedProperty(array, path, order = 'asc') {
        const orderMultiplier = order === 'desc' ? -1 : 1;
        return array.sort((a, b) => {
          const aValue = path.split('.').reduce((obj, key) => obj[key], a);
          const bValue = path.split('.').reduce((obj, key) => obj[key], b);
          
          if (aValue < bValue) return -1 * orderMultiplier;
          if (aValue > bValue) return 1 * orderMultiplier;
          return 0;
        });
      },
      getFileExtension(filename) {
        const lastDotIndex = filename.lastIndexOf('.');

        // If there is no dot in the filename or the filename starts with a dot, return empty string
        if (lastDotIndex === -1 || lastDotIndex === 0) {
          return '';
        }

        // Return the substring after the last dot
        return filename.slice(lastDotIndex + 1);
      }

    }
}