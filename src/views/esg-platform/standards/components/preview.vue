<template>
  <div class="preview-container">
    <!-- Show loading state -->
    <v-progress-circular v-if="isLoading" indeterminate color="primary" class="ma-4" />

    <!-- Show no content message only if not loading and no data -->
    <v-alert v-else-if="!isLoading && !hasContent" type="info" class="mb-4">
      {{ $t("esgPlatform.noContentToPreview") }}
    </v-alert>

    <!-- Show content when loading is done and there is data -->
    <template v-else>
      <!-- Environmental Section -->
      <v-card class="px-2 mb-4 pb-4" v-if="environmentalIssues.length > 0" style="background-color: #E4FFF2 !important;"
        elevation="0">
        <div class="item-box pt-4 pl-2 pb-1">
          <label class="font-weight-bold" style="font-size: 20px;">
            {{ $t("esgPlatform.environmental") }}
          </label>
        </div>

        <v-row class="ml-3 mr-2 align-center px-8" :style="{ 'background-color': '#117443', 'height': '50px' }">
          <label class="font-weight-bold" style="font-size: 16px; color: white;">
            {{ $t("esgPlatform.issues") }}
          </label>
        </v-row>

        <div class="px-1 mt-6 mb-4" v-for="(issue, issueIndex) in environmentalIssues" :key="`env-${issueIndex}`">
          <v-card class="mt-6 ml-3 mr-2" elevation="2">
            <div class="issue-item px-8 py-4 d-flex justify-space-between align-center"
              @click="toggleIssue('env', issueIndex)">
              <div class="text-subtitle-1">{{ issue.text }}</div>
              <v-icon>{{ expandedIssues['env-' + issueIndex] ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </div>

            <v-expand-transition>
              <div class="px-8 pb-2"
                v-if="expandedIssues['env-' + issueIndex] && issue.goals && issue.goals.length > 0">
                <v-card class="py-2" color="grey lighten-2" elevation="0">
                  <v-row class="d-flex align-center px-4">
                    <v-col xs="12" sm="8" class="font-weight-bold" style="color: black;">
                      {{ $t("esgPlatform.goals") }}
                    </v-col>
                    <v-col xs="12" sm="2" class="font-weight-bold text-center" style="color: black;">
                      {{ $t("esgPlatform.target") }}
                    </v-col>
                    <v-col xs="12" sm="2" class="font-weight-bold text-center" style="color: black;">
                      {{ $t("esgPlatform.questions") }}
                    </v-col>
                  </v-row>
                </v-card>

                <div v-for="(goal, goalIndex) in issue.goals" :key="`env-goal-${issueIndex}-${goalIndex}`" class="mt-2">
                  <v-row class="mt-2 align-center px-4">
                    <v-col xs="12" sm="8">
                      <span class="goal-title"
                        style="color: black; font-size: 14px; white-space: pre-wrap; text-align: justify;">
                        {{ goal.title }}
                      </span>
                    </v-col>
                    <v-col xs="12" sm="2" class="text-center">
                      <span>{{ goal.target }}</span>
                    </v-col>
                    <v-col xs="12" sm="2" class="d-flex align-center justify-center text-center">
                      <div class="d-flex align-center">
                        <span>{{ goal.noOfQuestions || 0 }}</span>
                        <img class="ml-2 cursor-pointer" src="/icons/icon-clipboard.svg"
                          style="width: 26px; height: 26px; border-radius: 50%;"
                          @click="navigateSurveyView(goal.surveyId, goal.title, goal.target)" />
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </div>
            </v-expand-transition>
          </v-card>
        </div>
      </v-card>

      <!-- Social Section -->
      <v-card class="px-2 mb-4 pb-4" v-if="socialIssues.length > 0" style="background-color: #E4FBFF !important"
        elevation="0">
        <div class="item-box pt-4 pl-2 pb-1">
          <label class="font-weight-bold" style="font-size: 20px;">
            {{ $t("esgPlatform.social") }}
          </label>
        </div>

        <v-row class="ml-3 mr-2 align-center px-8" :style="{ 'background-color': '#117443', 'height': '50px' }">
          <label class="font-weight-bold" style="font-size: 16px; color: white;">
            {{ $t("esgPlatform.issues") }}
          </label>
        </v-row>

        <div class="px-1 mt-6 mb-4" v-for="(issue, issueIndex) in socialIssues" :key="`soc-${issueIndex}`">
          <v-card class="mt-6 ml-3 mr-2" elevation="2">
            <div class="issue-item px-8 py-4 d-flex justify-space-between align-center"
              @click="toggleIssue('soc', issueIndex)">
              <div class="text-subtitle-1">{{ issue.text }}</div>
              <v-icon>{{ expandedIssues['soc-' + issueIndex] ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </div>

            <v-expand-transition>
              <div class="px-8 pb-2"
                v-if="expandedIssues['soc-' + issueIndex] && issue.goals && issue.goals.length > 0">
                <v-card class="py-2" color="grey lighten-2" elevation="0">
                  <v-row class="d-flex align-center px-4">
                    <v-col xs="12" sm="8" class="font-weight-bold" style="color: black;">
                      {{ $t("esgPlatform.goals") }}
                    </v-col>
                    <v-col xs="12" sm="2" class="font-weight-bold text-center" style="color: black;">
                      {{ $t("esgPlatform.target") }}
                    </v-col>
                    <v-col xs="12" sm="2" class="font-weight-bold text-center" style="color: black;">
                      {{ $t("esgPlatform.questions") }}
                    </v-col>
                  </v-row>
                </v-card>

                <div v-for="(goal, goalIndex) in issue.goals" :key="`soc-goal-${issueIndex}-${goalIndex}`" class="mt-2">
                  <v-row class="mt-2 align-center px-4">
                    <v-col xs="12" sm="8">
                      <span class="goal-title"
                        style="color: black; font-size: 14px; white-space: pre-wrap; text-align: justify;">
                        {{ goal.title }}
                      </span>
                    </v-col>
                    <v-col xs="12" sm="2" class="text-center">
                      <span>{{ goal.target }}</span>
                    </v-col>
                    <v-col xs="12" sm="2" class="d-flex align-center justify-center text-center">
                      <div class="d-flex align-center">
                        <span>{{ goal.noOfQuestions || 0 }}</span>
                        <img class="ml-2 cursor-pointer" src="/icons/icon-clipboard.svg"
                          style="width: 26px; height: 26px; border-radius: 50%;"
                          @click="navigateSurveyView(goal.surveyId, goal.title, goal.target)" />
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </div>
            </v-expand-transition>
          </v-card>
        </div>
      </v-card>

      <!-- Governance Section -->
      <v-card class="px-2 mb-4 pb-4" v-if="governanceIssues.length > 0" style="background-color: #FFF4E8 !important"
        elevation="0">
        <div class="item-box pt-4 pl-2 pb-1">
          <label class="font-weight-bold" style="font-size: 20px;">
            {{ $t("esgPlatform.governance") }}
          </label>
        </div>

        <v-row class="ml-3 mr-2 align-center px-8" :style="{ 'background-color': '#117443', 'height': '50px' }">
          <label class="font-weight-bold" style="font-size: 16px; color: white;">
            {{ $t("esgPlatform.issues") }}
          </label>
        </v-row>

        <div class="px-1 mt-6 mb-4" v-for="(issue, issueIndex) in governanceIssues" :key="`gov-${issueIndex}`">
          <v-card class="mt-6 ml-3 mr-2" elevation="2">
            <div class="issue-item px-8 py-4 d-flex justify-space-between align-center"
              @click="toggleIssue('gov', issueIndex)">
              <div class="text-subtitle-1">{{ issue.text }}</div>
              <v-icon>{{ expandedIssues['gov-' + issueIndex] ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </div>

            <v-expand-transition>
              <div class="px-8 pb-2"
                v-if="expandedIssues['gov-' + issueIndex] && issue.goals && issue.goals.length > 0">
                <v-card class="py-2" color="grey lighten-2" elevation="0">
                  <v-row class="d-flex align-center px-4">
                    <v-col xs="12" sm="8" class="font-weight-bold" style="color: black;">
                      {{ $t("esgPlatform.goals") }}
                    </v-col>
                    <v-col xs="12" sm="2" class="font-weight-bold text-center" style="color: black;">
                      {{ $t("esgPlatform.target") }}
                    </v-col>
                    <v-col xs="12" sm="2" class="font-weight-bold text-center" style="color: black;">
                      {{ $t("esgPlatform.questions") }}
                    </v-col>
                  </v-row>
                </v-card>

                <div v-for="(goal, goalIndex) in issue.goals" :key="`gov-goal-${issueIndex}-${goalIndex}`" class="mt-2">
                  <v-row class="mt-2 align-center px-4">
                    <v-col xs="12" sm="8">
                      <span class="goal-title"
                        style="color: black; font-size: 14px; white-space: pre-wrap; text-align: justify;">
                        {{ goal.title }}
                      </span>
                    </v-col>
                    <v-col xs="12" sm="2" class="text-center">
                      <span>{{ goal.target }}</span>
                    </v-col>
                    <v-col xs="12" sm="2" class="d-flex align-center justify-center text-center">
                      <div class="d-flex align-center">
                        <span>{{ goal.noOfQuestions || 0 }}</span>
                        <img class="ml-2 cursor-pointer" src="/icons/icon-clipboard.svg"
                          style="width: 26px; height: 26px; border-radius: 50%;"
                          @click="navigateSurveyView(goal.surveyId, goal.title, goal.target)" />
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </div>
            </v-expand-transition>
          </v-card>
        </div>
      </v-card>
    </template>
  </div>
</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin";
export default {
  name: 'PreviewStandard',
  props: {
    environmentalIssues: {
      type: Array,
      default: () => []
    },
    socialIssues: {
      type: Array,
      default: () => []
    },
    governanceIssues: {
      type: Array,
      default: () => []
    },
    isPreviewMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      expandedIssues: {},
      isLoading: true // Initial loading state
    };
  },
  async mounted() {
    this.startLoading();
    await this.checkData();
    this.stopLoading();
    this.expandedIssues = {
      'env-0': true,
    };
  },
  computed: {
    hasContent() {
      return (
        this.environmentalIssues.length > 0 ||
        this.socialIssues.length > 0 ||
        this.governanceIssues.length > 0
      );
    }
  },
  methods: {
    async checkData() {
      await new Promise(resolve => setTimeout(resolve, 2000));
      this.isLoading = false;
    },
    saveStandard() {
      if (this.isPreviewMode) {
        this.$emit("confirmActivateStandard");
      } else {
        this.$emit("nextStep");
      }
    },
    toggleIssue(section, index) {
      const key = `${section}-${index}`;
      this.$set(this.expandedIssues, key, !this.expandedIssues[key]);
    },
    navigateSurveyView(surveyId, goalTitle, targetYear) {
      if (!surveyId) {
        console.error('No survey ID available to navigate to');
        this.$notify({
          type: "error",
          text: this.$t('esgPlatform.noSurveyAvailable')
        });
        return;
      }
      this.$router.push({
        name: 'ESGSurveyDetails',
        params: { 
          id: surveyId,
          goalTitle: encodeURIComponent(goalTitle || ''),
          targetYear: targetYear || ''
        }
      });
    }
  },
  mixins: [loadingMixin],
};
</script>

<style scoped>
.item-box {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.issue-item {
  background-color: white;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}

.issue-item:last-child {
  border-bottom: none;
}

/* Responsive styling for goal titles */
@media (min-width: 960px) {
  .goal-title {
    overflow: hidden;
  }
}
</style>