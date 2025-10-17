<template>
  <div>
    <v-card color="bg" flat>
      <v-card-text class="black--text">
        <div class="d-flex mb-4">
          <h2 class="mb-0">{{$t('tutorials.title')}}</h2>
        </div>
      </v-card-text>
    </v-card>
    <v-card flat class="rounded-xl">
      <v-card-text class="pa-10">
        <!-- Loading State -->
        <v-row v-if="loading" justify="center" align="center">
          <v-col>
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
            <div class="mt-4">{{ $t('tutorials.loading') }}</div>
          </v-col>
        </v-row>

        <!-- Error State -->
        <v-row v-else-if="error" justify="center" align="center">
          <v-col>
            <v-alert type="error" text>
              {{ error }}
            </v-alert>
          </v-col>
        </v-row>

        <!-- No Tutorials State -->
        <v-row v-else-if="tutorials.length <= 0" justify="center" align="center">
          <v-col>
            <v-row justify="center">
              <v-img max-width="200" src="/img/no_faq_content.png"></v-img>
            </v-row>
            <v-row justify="center" class="mt-10">
              <div class="red--text ml-3 text-h5">{{$t('tutorials.noTutorials')}}</div>
            </v-row>
            <v-row justify="center" class="mt-5">
              <div class="black--text ml-3 text-h6">
                {{$t('tutorials.addTutorialPrompt')}}
              </div>
            </v-row>
          </v-col>
        </v-row>

        <!-- Tutorials List -->
        <v-row v-else justify="center" color="primary">
          <v-expansion-panels class="mb-5" v-for="(tutorial, i) in tutorials" :key="i" flat focusable>
            <v-expansion-panel class="green2">
              <v-expansion-panel-header class="primary--text font-weight-bold">
                <div class="d-flex align-center">
                  <div>
                    <div>{{ tutorial.title }}</div>
                    <div v-if="tutorial.description" class="text-caption grey--text">
                      {{ tutorial.description.substring(0, 100) }}{{ tutorial.description.length > 100 ? '...' : '' }}
                    </div>
                  </div>
                </div>
              </v-expansion-panel-header>
              <v-expansion-panel-content class="pt-5 green2">
                <div>
                  <div style="margin-bottom: 0.5em;">
                    <a href="#" @click.prevent="handleGuideClick(tutorial.url)">
                      {{ $t('tutorials.viewTutorial') }}
                    </a>
                  </div>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import TutorialService from '../../_services/TutorialService'

export default {
  name: 'Tutorials',
  data() {
    return {
      loading: false,
      tutorials: [],
      error: null
    }
  },
  mounted() {
    this.loadTutorials()
  },
  methods: {
    async loadTutorials() {
      this.loading = true
      this.error = null
      try {
        const response = await TutorialService.getTutorials()
        const tutorials = response.data.tutorials || []
        
        // Sort tutorials by creation date (oldest first)
        this.tutorials = tutorials.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.created_at || 0)
          const dateB = new Date(b.createdAt || b.created_at || 0)
          return dateA - dateB 
        })
      } catch (error) {
        console.error('Error loading tutorials:', error)
        this.error = 'Failed to load tutorials'
      } finally {
        this.loading = false
      }
    },
    handleGuideClick(url) {
      window.open(url, '_blank');
    },
  }
}
</script>

<style lang="scss" scoped>
::v-deep .v-expansion-panel-header__icon {
  display: none;
}
.sub-topics {
  ::v-deep .v-expansion-panel-header__icon{
    i {
      display: none;
    }
  }
}
.disabled-link {
  color: #aaa !important;
  cursor: not-allowed !important;
  text-decoration: none !important;
  pointer-events: auto;
}
</style>
