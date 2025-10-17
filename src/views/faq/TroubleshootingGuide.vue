<template>
  <v-card class="pa-6 text-center" outlined>
    <v-icon color="primary" size="48">mdi-file-document-outline</v-icon>
    <h2 class="mt-3 mb-2">{{ $t('faqSection.troubleshootingGuide') }}</h2>
    <p class="mb-4">
      {{ $t('faqSection.forDetailedTroubleshootingStepsAndSolutions') }}
    </p>
    <v-btn
      color="primary"
      large
      :href="guideUrl"
      target="_blank"
      rel="noopener"
      class="mb-2"
    >
      <v-icon left>mdi-open-in-new</v-icon>
      {{ $t('faqSection.openTroubleshootingGuide') }}
    </v-btn>
    <div>
      <a :href="guideUrl" target="_blank" rel="noopener" style="font-size: 14px;">
        {{ guideUrl }}
      </a>
    </div>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      guideUrl: "https://drive.google.com/file/d/11KmOjivYWthC9pVHvbYOklCFRRiV3tIm/view"
    }
  }
}
</script>
