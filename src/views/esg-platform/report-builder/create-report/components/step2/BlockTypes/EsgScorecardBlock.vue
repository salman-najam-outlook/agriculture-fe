<template>
  <div>
    <!-- Edit Mode -->
    <div v-if="!preview" class="scorecard-block">
      <div class="d-flex justify-space-between align-center mb-4 w-100">
        <span class="scorecard-label">ESG Scorecard</span>
        <div class="d-flex align-center">
          <v-btn icon color="primary" class="mr-2" @click="showSettings = true">
            <v-icon>mdi-cog</v-icon>
          </v-btn>
          <v-btn icon color="error" @click="$emit('delete')">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </div>
      </div>
      <div class="mb-2">
        <img src="/img/esgscorecard.png" alt="Scorecard Image" style="max-width: 100%; max-height:100%;" />
      </div>
      <ComponentSettingsDialog v-model="showSettings" :settings="settings" @save="handleSaveSettings" />
    </div>
    <!-- Preview Mode -->
    <div v-else>
      <div class="mb-2">
        <!-- <img src="/img/esgscorecard.png" alt="Scorecard Image" style="max-width: 100%; max-height:100%;" /> -->
        <IssueGoals :environmental-issues="environmentalIssues" :social-issues="socialIssues"
          :governance-issues="governanceIssues" @confirmActivateStandard="confirmActivateStandard" />
      </div>
    </div>
  </div>
</template>

<script>
import ComponentSettingsDialog from '../ComponentSettingDialog.vue'
import IssueGoals from '../../../../../../esg-platform/esg-protocol/components/IssueGoals.vue';

export default {
  props: {
    block: {
      type: Object,
      required: true,
    },
    preview: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ComponentSettingsDialog,
    IssueGoals,
  },
  created() {
    if (this.preview) {
      this.loadDummyData(); // Load dummy data if preview is true
    }
  },
  data() {
    return {
      showSettings: false,
      settings: {
        bgColor: '#ffffff',
        fontColor: '#101010',
        font: 'Poppins'
      },
         environmentalIssues: [
            ],
            socialIssues: [
            ],
            governanceIssues: [
            ],
    }
  },
  methods: {
    handleSaveSettings(newSettings) {
      this.settings = newSettings
      // Apply settings to your block as needed
    },
    loadDummyData() {
      // Dummy data for ESG issues
      this.environmentalIssues = [
        {
          id: 'env-1',
          text: 'Reduce Carbon Emissions',
          goals: [
            {
              id: 'goal-1',
              title: 'Achieve 50% reduction by 2030',
              target: '2030',
              completed: false,
              surveyId: null,
              noOfQuestions: 10,
              isEditing: false,
              order: 1,
            },
          ],
          type: 'environmental',
          order: 1,
        },
      ];
      this.socialIssues = [
        {
          id: 'soc-1',
          text: 'Improve Employee Well-being',
          goals: [
            {
              id: 'goal-2',
              title: 'Conduct annual surveys',
              target: '2025',
              completed: true,
              surveyId: null,
              noOfQuestions: 5,
              isEditing: false,
              order: 1,
            },
          ],
          type: 'social',
          order: 1,
        },
      ];
      this.governanceIssues = [
        {
          id: 'gov-1',
          text: 'Enhance Transparency',
          goals: [
            {
              id: 'goal-3',
              title: 'Publish quarterly reports',
              target: '2024',
              completed: false,
              surveyId: null,
              noOfQuestions: 8,
              isEditing: false,
              order: 1,
            },
          ],
          type: 'governance',
          order: 1,
        },
      ];
    },
  }
};
</script>

<style scoped>
.scorecard-block {
  background: #f8f8f8;
  border-radius: 4px;
  padding: 24px 24px 16px 24px;
  margin-bottom: 16px;
  position: relative;
}

.scorecard-label {
  font-size: 18px;
  font-weight: 500;
  color: #222;
}
</style>