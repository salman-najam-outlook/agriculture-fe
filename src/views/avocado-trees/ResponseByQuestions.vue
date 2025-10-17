<template>
  <div class="pa-4">
    <v-card id="responseDetailRows" flat class="mb-2 pa-4 main-card">
      <v-row
        v-if="surveyResponseByQuestion"
        align="start"
        justify="space-between"
      >
        <v-col>
          <v-select
            style="width: 100%"
            :items="surveyResponseByQuestion"
            placeholder="Select a question"
            v-model="selectedQuestion"
            item-text="question"
            item-value="id"
            return-object
            dense
            outlined
          ></v-select>
        </v-col>
        <v-col class="d-flex justify-end">
          <!-- <div class="py-1 title" style="whiteSpace: nowrap;">0 - 10 of 30</div>
          <v-btn class="mx-2" fab small outlined color="primary">
            <v-icon dark> mdi-chevron-left </v-icon>
          </v-btn>
          <v-btn class="mx-2" fab small outlined color="primary">
            <v-icon dark> mdi-chevron-right </v-icon>
          </v-btn> -->
        </v-col>
      </v-row>
      <v-container
        fluid
        class="d-flex align-center justify-space-between mb-5 pl-5"
        style="background: #edecec"
      >
        <div
          v-if="selectedQuestion && selectedQuestion.question"
          class="font-weight-bold"
        >
          {{ selectedQuestion && selectedQuestion.question }}
        </div>
        <div
          v-if="selectedQuestion && selectedQuestion.isQuestionScore"
          class="text-center font-weight-bold d-flex"
          style="line-height: 5px"
        >
          <div
            class="mr-4"
            v-if="
              selectedQuestion.questionType !== 'radio' &&
              selectedQuestion.questionType !== 'checkbox' &&
              selectedQuestion.scores !== null
            "
          >
            <small>QUESTION SCORE</small><br />
            <div class="text-h3 font-weight-black">
              {{ questionScore }}
            </div>
          </div>
          <div>
            <small>{{ $t("surveyBuilder.totalScore") }}</small
            ><br />
            <div class="text-h3 font-weight-black">
              {{ totalScore }}
            </div>
          </div>
        </div>
      </v-container>
      <div v-if="!!selectedQuestion">
        <div
          class="ml-5 font-italic"
          v-if="selectedQuestion.surveyQuestionsResponse.length < 1"
        >
          {{ $t("surveyBuilder.noResponse") }}
        </div>
        <div
          v-if="
            selectedQuestion.questionType === 'radio' ||
            selectedQuestion.questionType === 'checkbox'
          "
        >
          <div
            v-for="response in selectedQuestion.responseByUser"
            :key="response.user.id"
          >
            <v-container fluid class="mb-5 pa-5" style="background: #edecec">
              <div class="mb-1 d-flex align-center">
                <div class="font-weight-medium mr-3" style="font-size: 20px">
                  {{ response.option }}
                </div>
                <div
                  class="d-flex align-center"
                  v-if="selectedQuestion.isQuestionScore"
                >
                  <small>{{ $t("surveyBuilder.score") }}:</small>
                  <span class="font-weight-bold ml-1" style="font-size: 18px">{{
                    getOptionInputScore(response.option)
                  }}</span>
                </div>
              </div>
              <v-divider></v-divider>
              <div class="d-flex flex-wrap mt-1">
                <div v-for="u in response.user" :key="u.id">
                  <small class="lightBlack--text mr-4">{{ u.fullName }}</small>
                </div>
              </div>
            </v-container>
          </div>
        </div>
        <div v-else>
          <div
            v-for="response in selectedQuestion.surveyQuestionsResponse"
            :key="response.id"
          >
            <v-container fluid class="mb-5 pa-5" style="background: #edecec">
              <div
                v-if="selectedQuestion.questionType === 'dynamicFarmer'"
                class="mb-1 font-weight-medium"
                style="font-size: 20px"
              >
                {{ response.farm.fullName }}
              </div>
              <div
                v-if="selectedQuestion.questionType === 'dynamicGeoFence'"
                class="mb-1 font-weight-medium"
                style="font-size: 20px"
              >
                {{ response.geofence.geofenceName }}
              </div>
              <div
                v-if="selectedQuestion.questionType === 'dynamicCrop'"
                class="mb-1 font-weight-medium"
                style="font-size: 20px"
              >
                {{ response.crop.name }}
              </div>
              <div
                v-if="selectedQuestion.questionType === 'dynamicEquipment'"
                class="mb-1 font-weight-medium"
                style="font-size: 20px"
              >
                {{ response.equipment.name }}
              </div>
              <div class="mb-1 font-weight-medium" style="font-size: 20px">
                {{ response.text }}
              </div>
              <v-divider></v-divider>
              <small class="d-block lightBlack--text mt-1">{{
                response.user.fullName
              }}</small>
            </v-container>
          </div>
        </div>
      </div>
    </v-card>
  </div>
</template>
<script>
import SurveyBuilderService from "@/_services/SurveyBuilderService";
import _ from "lodash";
import loadingMixin from "@/mixins/LoadingMixin";

export default {
  data() {
    return {
      selectedQuestion: null,
      surveyResponseByQuestion: null,
    };
  },
  async mounted() {
    await this.getSurveyResponseQuestion();
  },

  computed: {
    totalScore() {
      if (this.selectedQuestion && this.selectedQuestion.isQuestionScore) {
        if (
          this.selectedQuestion.questionType === "radio" ||
          this.selectedQuestion.questionType === "checkbox"
        ) {
          let score = 0;
          this.selectedQuestion.questionOptions.forEach((option) => {
            score += this.getScoreForOption(option);
          });
          return score;
        }
        return (
          this.selectedQuestion.scores *
          this.selectedQuestion.surveyQuestionsResponse.length
        );
      }
      return 0;
    },
    questionScore() {
      if (
        this.selectedQuestion &&
        this.selectedQuestion.isQuestionScore &&
        this.selectedQuestion.scores !== null
      ) {
        return this.selectedQuestion.scores;
      }
      return 0;
    },
  },

  methods: {
    async getSurveyResponseQuestion() {
      this.startLoading();
      await SurveyBuilderService.getSurveyResponse(this.$route.params.id)
        .then(async (res) => {
          this.surveyResponseByQuestion = await res.data.surveyQuestions.map(
            (q) => {
              let radioResponse = null;
              if (q.questionType === "radio" || q.questionType === "checkbox") {
                let options = {};
                q.questionOptions.map((qo) => {
                  options[qo.id] = qo.text;
                });
                radioResponse = _.chain(q.surveyQuestionsResponse)
                  .groupBy("optionId")
                  .map((value, key) => ({
                    option: options[key],
                    user: value.map((u) => {
                      return u.user;
                    }),
                  }))
                  .value();
              }
              q.responseByUser = radioResponse;
              return q;
            }
          );
          this.selectedQuestion = await res.data.surveyQuestions[0];
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.stopLoading();
        });
    },

    getOptionInputScore(optionName) {
      if (this.selectedQuestion && this.selectedQuestion.isQuestionScore) {
        const option = this.selectedQuestion.questionOptions.find(
          (option) => option.text === optionName
        );
        return this.getScoreForOption(option);
      }
      return 0;
    },

    getScoreForOption(option) {
      if (
        option &&
        this.selectedQuestion &&
        this.selectedQuestion.isQuestionScore
      ) {
        const response = this.selectedQuestion.responseByUser.find(
          (res) => res.option === option.text
        );
        if (response) return response.user.length * option.scores;
      }
      return 0;
    },
  },
  mixins: [loadingMixin],
};
</script>
>>
