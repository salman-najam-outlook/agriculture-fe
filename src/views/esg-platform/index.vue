<template>
  <div>
    <!-- ESG Guide Modal -->
    <ESGGuideModal 
      v-model="showGuideModal" 
      @continue="onModalContinue"
    />
    
    <router-view>
      
    </router-view>
  </div>
</template>

<script>
import ESGGuideModal from '@/components/modals/ESGGuideModal.vue';

export default {
  name: 'ESGPlatform',
  components: {
    ESGGuideModal
  },
  data() {
    return {
      showGuideModal: false
    }
  },
  created() {
    this.checkAndShowModal();
  },
  watch: {
    '$route'(to, from) {
      // Check if we're navigating within ESG platform or coming from outside
      const isComingFromOutside = !from.path.startsWith('/esg-platform');
      const isGoingToESG = to.path.startsWith('/esg-platform');
      
      if (isComingFromOutside && isGoingToESG) {
        this.checkAndShowModal();
      }
    }
  },
  methods: {
    checkAndShowModal() {
      // Check if user has dismissed the modal permanently
      const isDismissed = localStorage.getItem('esg-guide-dismissed');
      
      // Show modal only if not dismissed permanently
      if (!isDismissed) {
        this.showGuideModal = true;
      }
    },
    onModalContinue() {
      this.showGuideModal = false;
    }
  }
};
</script>

