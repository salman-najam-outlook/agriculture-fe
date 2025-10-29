<template>
    	<v-select
            :items="languages"
            item-text="title"
            item-value="language"
            outlined
            v-model="language"
            dense
            width="11"
            class="shrink wdt"
            @change="reload"
        >
          <template v-slot:item="slotProps" >
              <i :class="['mr-2', 'em', `em-flag-${slotProps.item.flag.toLowerCase()}`]"></i>
              {{`${slotProps.item.title}` }}
          </template>
         <template slot="selection" slot-scope="data">
            <i :class="['mr-2', 'em', `em-flag-${data.item.flag.toLowerCase()}`]"></i>
            {{`${data.item.title }` }}
          </template>
        </v-select>
</template>
<script>
import i18n from '@/plugins/i18n';
import axios from 'axios'
import store from '../store/index'

export default {
    computed: {
      language: {
            get() {
                return this.$store.state.language;
            },
            set(val) {
              console.log('language changed', val)
                return this.$store.commit('SET_LANGUAGE', val);
            }
        },
    },
    data: () => ({
		  languages: [
			  { flag: 'us', language: 'en', title: 'English' },
			  { flag: 'in', language: 'hi', title: 'हिन्दी' },
        { flag: 'in', language: 'mr', title: 'मराठी' },
        { flag: 'es', language: 'es', title: 'Spanish' },
        { flag: 'np', language: 'ne', title: 'Nepali' },
        { flag: 'id', language: 'id', title: 'Indonesia' },
        { flag: 'pt', language: 'pt', title: 'Portuguese' },
        { flag: 'gr', language: 'el', title: 'Greek' },
        { flag: 'tr', language: 'tr', title: 'Turkish' },
        { flag: 'ke', language: 'sw', title: 'kiswahili'},
        { flag: 'sa', language: 'ar', title: 'Arabic'},
        { flag: 'vi', language: 'vi', title: 'Vietnamese'},
        { flag: 'am', language: 'am', title: 'Amharic' },
        { flag: 'nl', language: 'nl', title: 'Dutch' },
        { flag: 'it', language: 'it', title: 'Italian' },
        { flag: 'fr', language: 'fr', title: 'French' } 
      ]
    }),
    methods: {
      changeLocale(locale) {
        i18n.locale = locale;
      },
      async reload(){
        //if(localStorage.token){
            const res = await axios.get('/getSideBarData', {
            headers: {
              lang: this.language
            }
          })
          //let user = localStorage.getItem('user')
          //user = JSON.parse(user)
          const user = store.getters.getUser;
          user.sideBarMenu = res.data.data
          //localStorage.setItem('user', JSON.stringify(user))
          this.$router.go()
     // }else{
          // localStorage.removeItem("SIDEBAR_NOT_SYNC")
          // localStorage.setItem("SIDEBAR_NOT_SYNC", true)
        // }
      }
    },
    props: {
      pageReload: {
        type: Boolean,
        default: false,
        require: false
      }
    }
}
</script>
<style scoped lang="scss">
::v-deep .v-select__slot {
   font-size: 12px;
}
::v-deep .v-input__append-inner {
  display: none;
}

::v-deep.wdt {
    width: 123px !important;
}
</style>