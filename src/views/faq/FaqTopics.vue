<template name="faq">
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <v-card class="mb-5" flat>
          <v-card-text class="py-1">
              <v-tabs v-model="tab" >
                  <v-tab @click="$router.push({name: 'Faq', params:{ section: 'faq'}})">{{ $t('faqs')}} </v-tab>
                  <v-tab  @click="$router.push({name: 'Faq', params:{ section: 'topic'}})">{{ $t('topics')}} </v-tab>
                  <v-tab @click="$router.push({name: 'Faq', params:{ section: 'tutorials'}})">{{ $t('tutorials.title') }}</v-tab>
                  <v-tab v-if="isIndonesianClient">{{ $t('faqSection.troubleshootingGuide')}} </v-tab>
              </v-tabs>
          </v-card-text>
      </v-card>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <faq-list/>
        </v-tab-item>
        <v-tab-item>
          <topics-list/>
        </v-tab-item>
        <v-tab-item>
          <tutorials/>
        </v-tab-item>
        <v-tab-item>
          <troubleshooting-guide v-if="isIndonesianClient"/>
        </v-tab-item>
      </v-tabs-items>
    </v-container>
  </div>
</template>

<script>
import FaqList from './FaqList.vue'
import TopicsList from './TopicsList.vue'
import TroubleshootingGuide from './TroubleshootingGuide.vue'
import Tutorials from './Tutorials.vue'
import { isIndonesianClient } from '../../utils'
export default {
  components: {
    FaqList,
    TopicsList,
    TroubleshootingGuide,
    Tutorials
  },
  watch:{
    '$route.params.section': {
        handler: function(section) {
          if(!section){
            this.$router.push({ name: 'Faq', params: {section: 'faq'}})
          }
           this.tab = section == 'faq' ? 0 : (section == 'topic') ? 1 : (section == 'tutorials') ? 2 : 3;
        },
        deep: true,
        immediate: true
      }
  },
  computed: {
    breadcrumbs() {
      return [
        {
          text: this.$t('dashboard'),
          to: '/',
        },
        {
          text: this.$t('helpDesk'),
          disabled: true
        },
      ];
    }
  },

  data() {
    return {
      tab: 1,
      isIndonesianClient: isIndonesianClient()
    }
  },
}
</script>
