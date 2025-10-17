<template>
  <v-card v-if="protocol" elevation="0" class="mt-4">
    <v-card-title class="font-weight-bold">
      {{ $t('esgPlatform.keyIssuesAndGoals') }}
      <v-tooltip top color="00BD73" max-width="350">
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            class="icon-with-background ml-2"
            size="2xl"
            style="color: #0ebf67; margin-bottom: 5px"
            v-bind="attrs"
            v-on="on"
          >
            mdi-alert-circle
          </v-icon>
        </template>
        <span>{{ $t('esgPlatform.keyIssuesAndGoalsTT') }}</span>
      </v-tooltip>
    </v-card-title>

    <v-card-text>
      <!-- Issue Types -->
      <v-card
        v-for="(item, type) in issuesByType"
        :key="type"
        class="mb-4 pb-4"
        :style="{
          backgroundColor: type === 'environmental' ? '#E4FFF2' : type === 'social' ? '#E4FBFF99' : '#FFF4E8',
        }"
        elevation="0"
      >
        <v-card-title class="justify-space-between flex-column flex-sm-row font-weight-bold text-h6">
          {{ $t('esgPlatform.' + type) }}
          <div class="d-flex align-center flex" style="max-width: 75%">
            <v-progress-linear
              :color="getProgressColor(getTypeProgress(type))"
              height="10"
              style="width: 100%"
              :value="getTypeProgress(type)"
              rounded
            >
            </v-progress-linear>
            <span class="ml-2 flex-shrink-0 text-body-1">{{ getTypeProgress(type) }}%</span>
          </div>
        </v-card-title>
        <v-card-text>
          <div style="background-color: #117443" class="white--text font-weight-bold px-4 py-2 rounded">
            <v-row>
              <v-col xs="12" sm="9" md="10">{{ $t("esgPlatform.issues") }}</v-col>
              <v-col xs="12" sm="3" md="2">{{ $t('esgPlatform.progress.progress') }}</v-col>
            </v-row>
          </div>

          <!-- Issue Start -->
          <div
            v-for="(issue, idx) in item.esgIssues"
            :key="issue.id"
            class="white black--text text-body-2 rounded px-4 py-4 mt-2"
            style="border: 1px solid #b0b0b0 !important"
          >
            <v-row class="align-sm-center">
              <v-col xs="12" sm="9" md="10" class="font-weight-bold">{{ issue.title }}</v-col>
              <v-col xs="12" sm="3" md="2">
                <div class="d-flex align-center ml-auto">
                  <div class="d-flex align-center flex font-weight-bold">
                    <v-progress-linear
                      :color="getProgressColor(
                        getProgressByIssueId(issue._id)
                      )"
                      height="10"
                      style="width: 96px"
                      :value="getProgressByIssueId(issue._id)"
                      rounded
                    >
                    </v-progress-linear>
                    <span class="ml-2 flex-shrink-0">{{ getProgressByIssueId(issue._id) }}%</span>
                  </div>
                  <v-btn icon @click="toggleIssueExpansion(type, idx)">
                    <v-icon v-show="isIssueExpanded(type, idx)">mdi-chevron-up</v-icon>
                    <v-icon v-show="!isIssueExpanded(type, idx)">mdi-chevron-down</v-icon>
                  </v-btn>
                </div>
              </v-col>
            </v-row>

            <v-expand-transition>
              <div class="mt-2" v-show="isIssueExpanded(type, idx)">
                <div style="background-color: #d5d5d5" class="rounded font-weight-bold py-2">
                  <v-row>
                    <v-col xs="12" sm="3" md="6">
                      <div class="pl-2">
                        {{ $t('esgPlatform.goals') }}
                      </div>
                    </v-col>
                    <v-col xs="12" sm="3" md="2">
                      {{ $t('esgPlatform.target') }}
                    </v-col>
                    <v-col xs="12" sm="3" md="2">
                      {{ $t('esgPlatform.questions') }}
                    </v-col>
                    <v-col xs="12" sm="3" md="2">
                      <div class="pr-2">
                        {{ $t('esgPlatform.progress.progress') }}
                      </div>
                    </v-col>
                  </v-row>
                </div>

                <!-- Goals Start -->
                <div
                  v-for="goal in issue.esgGoals"
                  :key="goal.id"
                  class="py-4 rounded"
                  style="border-bottom: 1px solid #b0b0b0 !important"
                >
                  <v-row>
                    <v-col xs="12" sm="3" md="6">
                      <div class="pl-2">
                        {{ goal.title }}
                      </div>
                    </v-col>
                    <v-col xs="12" sm="3" md="2">{{ goal.targetYears }}</v-col>
                    <v-col xs="12" sm="3" md="2">
                      <div class="d-flex align-center flex-nowrap font-weight-bold">
                        <span>{{ goal.noOfQuestions }}</span>
                        <v-btn
                          icon
                          class="ml-4"
                          @click="navigateSurveyView(goal.esgAssessment, goal._id)"
                        >
                          <img src="/icons/icon-clipboard.svg" style="width: 26px; height: 26px" />
                        </v-btn>
                      </div>
                    </v-col>
                    <v-col xs="12" sm="3" md="2">
                      <div class="d-flex align-center flex font-weight-bold">
                        <v-progress-linear
                          :color="getProgressColor(
                            getGoalProgress(goal._id)
                          )"
                          height="10"
                          style="width: 96px"
                          :value="getGoalProgress(goal._id)"
                          rounded
                        >
                        </v-progress-linear>
                        <span class="mx-2 flex-shrink-0">{{ getGoalProgress(goal._id) }}%</span>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </div>
            </v-expand-transition>
          </div>
        </v-card-text>
      </v-card>
      <!-- Issue Types -->
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import EsgService from '@/_services/EsgService';
import LoadingMixin from "@/mixins/LoadingMixin";
export default {
  props: {
    protocol: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      expandedIssues: {},
      protocolId: this.$route.params.id,
      subOrganizationId: this.$route.params.subOrganizationId,
      goalProgress:[],
      progressData: {
        overallProgress: 0,
        environmentalProgress: 0,
        socialProgress: 0,
        governanceProgress: 0
      }
    };
  },
  mounted() {
    this.getProtocolProgress().then(() => {
      this.getIssueProgress()
    });
    const progress = this.$route.query.progress;
    const status = this.$route.query.status;
    console.log('Progress:', progress);
    console.log('Status:', status);
  },
  mixins: [LoadingMixin],
  computed: {
    ...mapGetters(['isSubEnterprise','getUser']),

    issuesByType() {
      const issuesByType = this.protocol?.esgIssues.reduce((issuesByType, issue) => {
        const type = issue.type.toLowerCase();
        if (!issuesByType[type]) issuesByType[type] = { progress: 0, esgIssues: [] };
        issuesByType[type].esgIssues.push(issue);
        return issuesByType;
      }, {});

      for (const type in issuesByType) {
        const totalIssues = issuesByType[type].esgIssues.length;
        const sumOfIssueProgress = issuesByType[type].esgIssues.reduce((acc, issue) => {
          return acc + (issue.progress || 0);
        }, 0);
        issuesByType[type].progress = sumOfIssueProgress / (totalIssues || 1);
      }

      return issuesByType;
    },
  },
  methods: {
    getProgressByIssueId(issueId) {
      const issueGoals = this.goalProgress?.filter(x => x.issueId === issueId);
      if (!issueGoals || issueGoals.length === 0) return 0;

      const totalResponseScore = issueGoals.reduce((sum, item) => sum + item.totalResponseScore, 0);
      const totalQuestionScore = issueGoals.reduce((sum, item) => sum + item.totalQuestionScore, 0);

      if (totalQuestionScore === 0) return 0;

      const progress = (totalResponseScore / totalQuestionScore) * 100;
      return Number(progress.toFixed(2));
    },
    getGoalProgress(goalId){
      const progress =  this.goalProgress?.filter(x => x.goalId == goalId)
      return progress.length ? progress[0].progress : 0
    },
    getIssueProgress(){
       const goalsId = []
       this.protocol?.esgIssues?.forEach(x => {
          let y = x?.esgGoals?.map(x => x._id)
          goalsId.push(...y)
       })
       EsgService.getGoalWiseProgressByGoalIds({goalIds:goalsId, subOrganizationId:this.subOrganizationId}).then(response => {
        this.goalProgress = response.data
       }).catch(err => {
        console.log(err)
       })
    },
    async getProtocolProgress(){
        this.startLoading();
        return new Promise((resolve, reject) => {
            EsgService.getProtocolProgress(this.protocol.id).then(response => {
              this.progressData = {
                overallProgress: response.data?.Overall || 0,
                environmentalProgress: response.data?.Environmental || 0,
                socialProgress: response.data?.Social || 0,
                governanceProgress: response.data?.Governance || 0
              }
              resolve(this.progressData)
          }).catch(error => {
              this.stopLoading()
              console.error("Error fetching protocol progress:", error);
              reject(error)
          }).finally(() => {
              this.stopLoading();
          });
        })
    },
    getProgressColor(value) {
      if (value < 30) return 'red';
      if (value < 70) return 'orange';
      return 'green';
    },
    getStatusColor(status) {
      if (status === 'Pending') return 'gray';
      if (status === 'Approved') return 'green';
      return 'red';
    },
    isIssueExpanded(issueType, idx) {
      const key = `${issueType}-${idx}`;
      const isExpanded = this.expandedIssues[key];
      return !!isExpanded;
    },
    toggleIssueExpansion(issueType, idx) {
      const key = `${issueType}-${idx}`;
      const isExpanded = this.isIssueExpanded(issueType, idx);
      this.expandedIssues = Object.assign({}, this.expandedIssues, { [key]: !isExpanded });
    },
    navigateSurveyView(surveyId, goalId) {
      const goalData = this.goalProgress.find(g => g.goalId === goalId);
      
      // Find the actual goal object to get title and targetYears
      let goalTitle = '';
      let targetYear = '';
      
      // Search through all issues and goals to find the matching goal
      for (const issue of this.protocol?.esgIssues || []) {
        const goal = issue.esgGoals?.find(g => g._id === goalId);
        if (goal) {
          goalTitle = goal.title;
          targetYear = goal.targetYears;
          break;
        }
      }

      const progress = goalData?.progress || 0;
      const status = goalData?.status || '';

      if (this.isSubEnterprise) {
        this.$router.push({
          name: 'surveyOverview',
          params: {
            id1: surveyId,
            id2: goalId,
          },
          query: {
            progress,
            status,
            subOrganizationId: this.$route.params.subOrganizationId,
          },
        });
      } else {
        this.$router.push({
          name: 'ESGSurveyDetails',
          params: {
            id: surveyId,
            goalTitle: encodeURIComponent(goalTitle || ''),
            targetYear: targetYear || '',
          },
          query: {
            progress,
            status,
          },
        });
      }
    },
    getTypeProgress(type) {
      const esgType = type.toLowerCase();
      const issues = this.protocol?.esgIssues?.filter(issue => issue.type.toLowerCase() === esgType);
      if (!issues?.length) return 0;

      const goalIds = issues.flatMap(issue => issue.esgGoals?.map(goal => goal._id) || []);
      const relevantGoals = this.goalProgress.filter(g => goalIds.includes(g.goalId));

      const totalResponse = relevantGoals.reduce((sum, g) => sum + (g.totalResponseScore || 0), 0);
      const totalQuestions = relevantGoals.reduce((sum, g) => sum + (g.totalQuestionScore || 0), 0);

      if (totalQuestions === 0) return 0;

      const progress = (totalResponse / totalQuestions) * 100;
      return Number(progress.toFixed(2));
    },
  },
};
</script>
