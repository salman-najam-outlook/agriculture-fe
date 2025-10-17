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
        <v-container fluid>
          <v-row align="center" class="mb-1">
            <!-- Label -->
            <v-col cols="12" md="4" class="d-flex align-center">
              <label class="font-weight-bold" style="font-size: 20px;">
                {{ $t("esgPlatform.environmental") }}
              </label>
            </v-col>
            <!-- Progress Bar & Percentage -->
            <v-col cols="12" md="8">
              <div class="d-flex align-center">
                <v-progress-linear :value="10" height="10" class="flex-grow-1 mr-4" rounded background-color="#EBEBEB"
                  :color="getProgressColor(10)" style="width: 80px;"></v-progress-linear>
                <p class="font-weight-bold mb-0">10%</p>
              </div>
            </v-col>
          </v-row>
        </v-container>

        <!-- Issues Header -->
        <v-row class="ml-3 mr-2 align-center px-8" :style="{ 'background-color': '#117443', 'height': '50px' }">
          <label class="font-weight-bold" style="font-size: 16px; color: white;">
            {{ $t("esgPlatform.issues") }}
          </label>
        </v-row>

        <!-- Loop through each environmental issue -->
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
                <!-- Goals Header Row -->
                <v-card class="py-2" color="grey lighten-2" elevation="0">
                  <v-row class="d-flex align-center px-4">
                    <v-col xs="12" sm="6" class="font-weight-bold" style="color: black;">{{ $t("esgPlatform.goals")
                      }}</v-col>
                    <v-col xs="12" sm="2" class="font-weight-bold text-center" style="color: black;">{{
                      $t("esgPlatform.target") }}</v-col>
                    <v-col xs="12" sm="2" class="font-weight-bold text-center" style="color: black;">{{
                      $t("esgPlatform.questions") }}</v-col>
                    <v-col xs="12" sm="2" class="font-weight-bold text-center" style="color: black;">{{
                      $t("esgPlatform.progress.progress") }}</v-col>
                  </v-row>
                </v-card>

                <!-- Loop through each goal -->
                <div v-for="(goal, goalIndex) in issue.goals" :key="`env-goal-${issueIndex}-${goalIndex}`" class="mt-2">
                  <v-row class="mt-2 align-center px-4">
                    <!-- Goal Title -->
                    <v-col xs="12" sm="6">
                      <span class="goal-title"
                        style="color: black; font-size: 14px; white-space: pre-wrap; text-align: justify;">
                        {{ goal.title }}
                      </span>
                    </v-col>
                    <!-- Target -->
                    <v-col xs="12" sm="2" class="text-center">
                      <span>{{ goal.target }}</span>
                    </v-col>
                    <!-- Questions -->
                    <v-col xs="12" sm="2" class="d-flex align-center justify-center text-center">
                      <div class="d-flex align-center">
                        <span>{{ goal.noOfQuestions || 0 }}</span>
                        <img class="ml-2 cursor-pointer" src="/icons/icon-clipboard.svg"
                          style="width: 26px; height: 26px; border-radius: 50%;"
                          @click="navigateSurveyView(goal.surveyId, goal.id)" />
                      </div>
                    </v-col>
                    <!-- Progress Bar for Goal -->
                    <v-col xs="12" sm="2" class="d-flex align-center justify-center text-center">
                      <v-progress-linear :value="goal.progress" height="6" rounded background-color="#EBEBEB"
                        :color="getProgressColor(goal.progress)" style="width: 80px;"></v-progress-linear>
                    </v-col>
                  </v-row>
                </div>
              </div>
            </v-expand-transition>
          </v-card>
        </div>
      </v-card>

      <!-- Social Section -->
      <v-card class="px-2 mb-4 pb-4" v-if="socialIssues.length > 0" style="background-color: #E4FFF2 !important;"
        elevation="0">
        <v-container fluid>
          <v-row align="center" class="mb-1">
            <!-- Label -->
            <v-col cols="12" md="4" class="d-flex align-center">
              <label class="font-weight-bold" style="font-size: 20px;">
                {{ $t("esgPlatform.social") }}
              </label>
            </v-col>
            <!-- Progress Bar & Percentage -->
            <v-col cols="12" md="8">
              <div class="d-flex align-center">
                <v-progress-linear :value="10" height="10" class="flex-grow-1 mr-4" rounded background-color="#EBEBEB"
                  :color="getProgressColor(10)" style="width: 80px;"></v-progress-linear>
                <p class="font-weight-bold mb-0">10%</p>
              </div>
            </v-col>
          </v-row>
        </v-container>

        <!-- Issues Header -->
        <v-row class="ml-3 mr-2 align-center px-8" :style="{ 'background-color': '#117443', 'height': '50px' }">
          <label class="font-weight-bold" style="font-size: 16px; color: white;">
            {{ $t("esgPlatform.issues") }}
          </label>
        </v-row>

        <!-- Loop through each social issue -->
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
                <!-- Goals Header Row -->
                <v-card class="py-2" color="grey lighten-2" elevation="0">
                  <v-row class="d-flex align-center px-4">
                    <v-col xs="12" sm="6" class="font-weight-bold" style="color: black;">{{ $t("esgPlatform.goals")
                      }}</v-col>
                    <v-col xs="12" sm="2" class="font-weight-bold text-center" style="color: black;">{{
                      $t("esgPlatform.target") }}</v-col>
                    <v-col xs="12" sm="2" class="font-weight-bold text-center" style="color: black;">{{
                      $t("esgPlatform.questions") }}</v-col>
                    <v-col xs="12" sm="2" class="font-weight-bold text-center" style="color: black;">{{
                      $t("esgPlatform.progress.progress") }}</v-col>
                  </v-row>
                </v-card>

                <!-- Loop through each goal -->
                <div v-for="(goal, goalIndex) in issue.goals" :key="`soc-goal-${issueIndex}-${goalIndex}`" class="mt-2">
                  <v-row class="mt-2 align-center px-4">
                    <!-- Goal Title -->
                    <v-col xs="12" sm="6">
                      <span class="goal-title"
                        style="color: black; font-size: 14px; white-space: pre-wrap; text-align: justify;">
                        {{ goal.title }}
                      </span>
                    </v-col>
                    <!-- Target -->
                    <v-col xs="12" sm="2" class="text-center">
                      <span>{{ goal.target }}</span>
                    </v-col>
                    <!-- Questions -->
                    <v-col xs="12" sm="2" class="d-flex align-center justify-center text-center">
                      <div class="d-flex align-center">
                        <span>{{ goal.noOfQuestions || 0 }}</span>
                        <img class="ml-2 cursor-pointer" src="/icons/icon-clipboard.svg"
                          style="width: 26px; height: 26px; border-radius: 50%;"
                          @click="navigateSurveyView(goal.surveyId, goal.id)" />
                      </div>
                    </v-col>
                    <!-- Progress Bar for Goal -->
                    <v-col xs="12" sm="2" class="d-flex align-center justify-center text-center">
                      <v-progress-linear :value="goal.progress" height="6" rounded background-color="#EBEBEB"
                        :color="getProgressColor(goal.progress)" style="width: 80px;"></v-progress-linear>
                    </v-col>
                  </v-row>
                </div>
              </div>
            </v-expand-transition>
          </v-card>
        </div>
      </v-card>

      <!-- Governance Section -->
      <v-card class="px-2 mb-4 pb-4" v-if="governanceIssues.length > 0" style="background-color: #E4FFF2 !important;"
        elevation="0">
        <v-container fluid>
          <v-row align="center" class="mb-1">
            <!-- Label -->
            <v-col cols="12" md="4" class="d-flex align-center">
              <label class="font-weight-bold" style="font-size: 20px;">
                {{ $t("esgPlatform.governance") }}
              </label>
            </v-col>
            <!-- Progress Bar & Percentage -->
            <v-col cols="12" md="8">
              <div class="d-flex align-center">
                <v-progress-linear :value="10" height="10" class="flex-grow-1 mr-4" rounded background-color="#EBEBEB"
                  :color="getProgressColor(10)" style="width: 80px;"></v-progress-linear>
                <p class="font-weight-bold mb-0">10%</p>
              </div>
            </v-col>
          </v-row>
        </v-container>

        <!-- Issues Header -->
        <v-row class="ml-3 mr-2 align-center px-8" :style="{ 'background-color': '#117443', 'height': '50px' }">
          <label class="font-weight-bold" style="font-size: 16px; color: white;">
            {{ $t("esgPlatform.issues") }}
          </label>
        </v-row>

        <!-- Loop through each governance issue -->
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
                <!-- Goals Header Row -->
                <v-card class="py-2" color="grey lighten-2" elevation="0">
                  <v-row class="d-flex align-center px-4">
                    <v-col xs="12" sm="6" class="font-weight-bold" style="color: black;">{{ $t("esgPlatform.goals")
                      }}</v-col>
                    <v-col xs="12" sm="2" class="font-weight-bold text-center" style="color: black;">{{
                      $t("esgPlatform.target") }}</v-col>
                    <v-col xs="12" sm="2" class="font-weight-bold text-center" style="color: black;">{{
                      $t("esgPlatform.questions") }}</v-col>
                    <v-col xs="12" sm="2" class="font-weight-bold text-center" style="color: black;">{{
                      $t("esgPlatform.progress.progress") }}</v-col>
                  </v-row>
                </v-card>

                <!-- Loop through each goal -->
                <div v-for="(goal, goalIndex) in issue.goals" :key="`gov-goal-${issueIndex}-${goalIndex}`" class="mt-2">
                  <v-row class="mt-2 align-center px-4">
                    <!-- Goal Title -->
                    <v-col xs="12" sm="6">
                      <span class="goal-title"
                        style="color: black; font-size: 14px; white-space: pre-wrap; text-align: justify;">
                        {{ goal.title }}
                      </span>
                    </v-col>
                    <!-- Target -->
                    <v-col xs="12" sm="2" class="text-center">
                      <span>{{ goal.target }}</span>
                    </v-col>
                    <!-- Questions -->
                    <v-col xs="12" sm="2" class="d-flex align-center justify-center text-center">
                      <div class="d-flex align-center">
                        <span>{{ goal.noOfQuestions || 0 }}</span>
                        <img class="ml-2 cursor-pointer" src="/icons/icon-clipboard.svg"
                          style="width: 26px; height: 26px; border-radius: 50%;"
                          @click="navigateSurveyView(goal.surveyId, goal.id)" />
                      </div>
                    </v-col>
                    <!-- Progress Bar for Goal -->
                    <v-col xs="12" sm="2" class="d-flex align-center justify-center text-center">
                      <v-progress-linear :value="goal.progress" height="6" rounded background-color="#EBEBEB"
                        :color="getProgressColor(goal.progress)" style="width: 80px;"></v-progress-linear>
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
      'soc-0': true,
      'gov-0': true,
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
    getProgressColor(progress) {
      if (progress >= 0 && progress <= 24) return "#F03737";  // Red
      if (progress >= 25 && progress <= 74) return "#FFB443"; // Yellow/Orange
      return "#00BD73";  // Green
    },
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
    navigateSurveyView(surveyId, goalId) {
      if (!surveyId || !goalId) {
        console.error('Missing survey ID or goal ID');
        this.$notify({
          type: "error",
          text: this.$t('esgPlatform.missingData')
        });
        return;
      }
      this.$emit('navigate-survey', surveyId, goalId);
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