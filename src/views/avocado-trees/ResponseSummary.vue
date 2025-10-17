<template>
  <div>
    <div class="pa-4" v-for="q in surveyResponseByQuestion" :key="q.id">
      <v-card id="responseDetailRows" flat class="mb-2 pa-4">
        <div class="d-flex">
          <div class="font-weight-bold mb-2">
            {{ q.question }}
          </div>
          <div class="text-center ml-16" style="line-height: 12px">
            <small> {{ q.surveyQuestionsResponse.length }} </small><br />
            <small class="primary--text caption font-weight-bold">
              {{
                q.surveyQuestionsResponse.length > 1
                  ? $t("surveyBuilder.responses")
                  : $t("surveyBuilder.response")
              }}
            </small>
          </div>
        </div>
        <div v-if="q.questionType === 'radio' || q.questionType === 'checkbox'">
          <apexcharts
            type="bar"
            width="500"
            :options="q.chartOptions"
            :series="q.series"
          ></apexcharts>
          <div v-for="n in q.questionOptions" :key="n.id">
            <div v-if="n.nestedQuestionId" class="mb-8">
              <div class="primary--text font-weight-bold mb-2">
                {{ $t("surveyBuilder.if") }} {{ n.text }},
                {{ $t("surveyBuilder.then") }}
              </div>
              <div class="d-flex">
                <div class="font-weight-bold mb-2">
                  {{ n.nestedQuestions.question }}
                </div>
                <div class="text-center ml-16" style="line-height: 12px">
                  <small>
                    {{
                      n.nestedQuestions.surveyQuestionsResponse.length
                    }} </small
                  ><br />
                  <small class="primary--text caption font-weight-bold">
                    {{
                      n.nestedQuestions.surveyQuestionsResponse.length > 1
                        ? $t("surveyBuilder.responses")
                        : $t("surveyBuilder.response")
                    }}
                  </small>
                </div>
              </div>
              <div
                v-for="(r, i) in n.nestedQuestions.surveyQuestionsResponse"
                :key="r.id"
              >
                <div
                  class="d-flex justify-space-between py-3"
                  style="width: 80%"
                >
                  <div
                    v-if="
                      n.nestedQuestions.questionType === 'dynamicFarmer' &&
                      r.farm
                    "
                  >
                    {{ r.farm.fullName }}
                  </div>
                  <div
                    v-if="
                      n.nestedQuestions.questionType === 'dynamicGeoFence' &&
                      r.geofence
                    "
                  >
                    {{ r.geofence.geofenceName }}
                  </div>
                  <div
                    v-if="
                      n.nestedQuestions.questionType === 'dynamicCrop' && r.crop
                    "
                  >
                    {{ r.crop.name }}
                  </div>
                  <div
                    v-if="
                      n.nestedQuestions.questionType === 'dynamicEquipment' &&
                      r.equipment
                    "
                  >
                    {{ r.equipment.name }}
                  </div>
                  <div v-else>{{ r.text }}</div>
                  <div>{{ r.user.fullName }}</div>
                </div>
                <v-divider
                  v-if="i < q.surveyQuestionsResponse.length - 1"
                ></v-divider>
              </div>
            </div>
          </div>
        </div>
        <div v-else v-for="(r, i) in q.surveyQuestionsResponse" :key="r.id">
          <div class="d-flex justify-space-between py-3" style="width: 80%">
            <div v-if="q.questionType === 'dynamicFarmer' && r.farm">
              {{ r.farm.fullName }}
            </div>
            <div v-if="q.questionType === 'dynamicGeoFence' && r.geofence">
              {{ r.geofence.geofenceName }}
            </div>
            <div v-if="q.questionType === 'dynamicCrop' && r.crop">
              {{ r.crop.name }}
            </div>
            <div v-if="q.questionType === 'dynamicEquipment' && r.equipment">
              {{ r.equipment.name }}
            </div>
            <div v-else>{{ r.text }}</div>
            <div>{{ r.user.fullName }}</div>
          </div>
          <v-divider
            v-if="i < q.surveyQuestionsResponse.length - 1"
          ></v-divider>
        </div>
      </v-card>
    </div>
  </div>
</template>
<script>
import SurveyBuilderService from "@/_services/SurveyBuilderService";
import VueApexCharts from "vue-apexcharts";
import loadingMixin from "@/mixins/LoadingMixin";

export default {
  components: {
    apexcharts: VueApexCharts,
  },
  data() {
    return {
      surveyResponseByQuestion: null,
    };
  },
  async mounted() {
    await this.getSurveyResponseQuestion();
  },
  methods: {
    getFillColor(count) {
      return count >= 60 ? "#0EBF67" : count > 20 ? "#DA3D3D" : "#F5C84C";
    },
    async getSurveyResponseQuestion() {
      this.startLoading();
      await SurveyBuilderService.getSurveyResponse(this.$route.params.id)
        .then(async (res) => {
          this.surveyResponseByQuestion = await res.data.surveyQuestions.map(
            (q) => {
              if (q.questionType === "radio" || q.questionType === "checkbox") {
                const data = q.questionOptions.map((qo) => {
                  const count = q.surveyQuestionsResponse.filter(
                    (obj) => qo.id === obj.optionId
                  ).length;
                  const fillColor = this.getFillColor(count);
                  return {
                    x: qo.text,
                    y: count,
                    fillColor: fillColor,
                  };
                });
                q.chartOptions = {
                  chart: {
                    toolbar: {
                      show: false,
                    },
                  },
                  tooltip: {
                    enabled: false,
                  },
                  dataLabels: {
                    offsetY: -25,
                    style: {
                      colors: ["#000"],
                    },
                  },
                  plotOptions: {
                    bar: {
                      dataLabels: {
                        position: "top",
                      },
                    },
                  },
                  forceNiceScale: true,
                  xaxis: { type: "categories" },
                  yaxis: {
                    max: (max) => {
                      return max + 2;
                    },
                  },
                };
                q.series = [{ name: q.question, data: data }];
              }
              return q;
            }
          );
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.stopLoading();
        });
    },
  },
  mixins: [loadingMixin],
};
</script>
