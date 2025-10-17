<template>
  <div v-if="recommendationsByIssueType" class="mt-4">
    <v-card
      v-for="[type, recommendations] in Object.entries(recommendationsByIssueType)"
      :key="type"
      class="mb-4 pb-4"
      :style="{
        backgroundColor: type === 'Environmental' ? '#E4FFF2' : type === 'Social' ? '#E4FBFF99' : '#FFF4E8',
      }"
      elevation="0"
    >
      <v-card-title class="justify-space-between flex-column flex-sm-row font-weight-bold text-h6">
        {{ $t('esgPlatform.' + type.toLowerCase()) }}
        <span class="ml-2">{{ recommendations.length }} {{ $t('esgPlatform.recommendations') }}</span>
      </v-card-title>
      <v-card-text>
        <div style="background-color: #117443" class="white--text font-weight-bold px-4 py-2 rounded">
          <v-row>
            <v-col xs="12" sm="4" md="5">{{ $t('esgPlatform.recommendations') }}</v-col>
            <v-col xs="12" sm="3" md="2" class="text-center">{{ $t('esgPlatform.questions') }}</v-col>
            <v-col xs="12" sm="3" md="4">{{ $t('esgPlatform.issueAndGoal') }}</v-col>
            <v-col xs="12" sm="2" md="1">{{ $t('esgPlatform.dashboard.users') }}</v-col>
          </v-row>
        </div>

        <!-- Issue Start -->
        <div
          v-for="(recommendation, idx) in recommendations"
          :key="idx"
          class="white black--text text-body-2 rounded px-4 py-4 mt-2"
          style="border: 1px solid #b0b0b0 !important"
        >
          <v-row>
            <v-col xs="12" sm="4" md="5">
              <div class="pl-2">
                {{ recommendation.esgQuestionDetail.options.recommendation }}
              </div>
            </v-col>
            <v-col xs="12" sm="3" md="2">
              <div class="d-flex align-center justify-center flex-nowrap font-weight-bold">
                <span
                  >{{ recommendation.esgQuestionDetail.questionHeading.order }}
                  .
                  {{ recommendation.esgQuestionDetail.order }}
                </span>
                <v-btn icon class="ml-4" @click="onQuestionRecommendationDialogOpen(recommendation)">
                  <img src="/icons/icon-clipboard.svg" style="width: 26px; height: 26px" />
                </v-btn>
              </div>
            </v-col>
            <v-col xs="12" sm="3" md="4">
              <div class="font-weight-bold">{{ recommendation.esgIssue.title }}</div>
              <div>{{ recommendation.esgGoal.title }}</div>
            </v-col>
            <v-col xs="12" sm="2" md="1">
              <div class="d-flex align-center flex-nowrap font-weight-bold">
                <span>{{ recommendation.submittedBy.length }}</span>
                <v-btn icon class="ml-4" @click="onUsersDialogOpen(recommendation)">
                  <img src="/icons/icon-clipboard.svg" style="width: 26px; height: 26px" />
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>
    <UsersDialog
      :totalUsers="selectedRecommendation?.submittedBy.length"
      :optionId="selectedRecommendation?.esgQuestionDetail.options._id"
      :protocolId="$route.params.id"
      :subOrganizationId="$route.params.subOrganizationId"
      v-model="isUsersDialogOpen"
    />
    <QuestionRecommendationDialog v-model="isQuestionRecommendationDialogOpen" :question="selectedRecommendation?.esgQuestionDetail" />
  </div>
</template>

<script>
import EsgService from '../../../../../../_services/EsgService';
import QuestionRecommendationDialog from './QuestionRecommendationDialog.vue';
import UsersDialog from './UsersDialog.vue';
import LoadingMixin from '@/mixins/LoadingMixin';
export default {
  components: {
    UsersDialog,
    QuestionRecommendationDialog,
  },
  mixins: [LoadingMixin],
  data() {
    return {
      isUsersDialogOpen: false,
      isQuestionRecommendationDialogOpen: false,
      recommendationsByIssueType: null,
      selectedRecommendation: null,
    };
  },

  async created() {
    this.startLoading();
    await this.fetchRecommendationsByIssueType();
    this.stopLoading();
  },

  methods: {
    async fetchRecommendationsByIssueType() {
      const protocolId = this.$route.params.id;
      const subOrganizationId = this.$route.params.subOrganizationId;
      const response = await EsgService.getRecommendationsForRespondent(
        'sub-organization',
        subOrganizationId,
        protocolId
      );
      this.recommendationsByIssueType = response.data;
    },

    onQuestionRecommendationDialogOpen(recommendation) {
      this.selectedRecommendation = recommendation;
      this.isQuestionRecommendationDialogOpen = true;
    },

    onUsersDialogOpen(recommendation) {
      this.selectedRecommendation = recommendation;
      this.isUsersDialogOpen = true;
    },
  },
};
</script>
