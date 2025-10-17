<template>
  <div>
    <v-row>
      <v-col xs="8"></v-col>
      <v-col xs="">
        <v-row>
          <v-col>
            <v-select
              v-model="pagination.limit"
              :items="[10, 20, 50]"
              label="Items per page"
              @change="loadSurveyResponses"
            ></v-select>
          </v-col>
          <v-col xs="8">
            <v-pagination
              v-model="pagination.page"
              :length="pagination.pages"
              @input="loadSurveyResponses"
              total-visible="5"
              :disabled="loading"
            ></v-pagination>
          </v-col>
          <v-col>
            <v-select
              v-model="pagination.page"
              :items="pageOptions"
              label="Go to page"
              @change="loadSurveyResponses"
            ></v-select>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-progress-linear
      color="green"
      indeterminate
      v-if="loading"
    ></v-progress-linear>
    <v-expansion-panels multiple v-else>
      <v-expansion-panel v-for="(q, i) in surveyResponse" :key="i">
        <v-expansion-panel-header>
          <v-row no-gutters>
            <v-col>
              <span class="font-weight-bold">
                {{ q.question }}
              </span>
            </v-col>
            <v-col>
              <div class="text-center" style="line-height: 12px">
                <small> {{ q.surveyQuestionsResponse.length }} </small><br />
                <small class="primary--text caption font-weight-bold">
                  {{
                    q.surveyQuestionsResponse.length > 1
                      ? $t("surveyBuilder.responses")
                      : $t("surveyBuilder.response")
                  }}
                </small>
              </div>
            </v-col>
          </v-row>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div
            v-if="q.questionType === 'radio' || q.questionType === 'checkbox'"
          >
            <v-row>
              <v-col md="6">
                <apexcharts
                  type="bar"
                  width="500"
                  :options="q.chartOptions"
                  :series="q.series"
                ></apexcharts>
              </v-col>
              <v-col md="6">
                <div class="custom-legend">
                  <v-card
                    flat
                    v-for="(option, _i) in q.questionOptions"
                    :key="option.id"
                    class="legend-item"
                  >
                    <span
                      class="legend-color"
                      :style="{
                        backgroundColor: colorMap[_i],
                      }"
                    ></span>
                    <span class="legend-text">{{ option.text }}</span>
                  </v-card>
                </div>
              </v-col>
            </v-row>
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
                        n.nestedQuestions.questionType === 'dynamicCrop' &&
                        r.crop
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
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <!-- Items per page selector -->
  </div>
</template>

<script>
import SurveyBuilderService from "@/_services/SurveyBuilderService";
import VueApexCharts from "vue-apexcharts";
import loadingMixin from "@/mixins/LoadingMixin";
import { getColorHash } from "@/utils";
export default {
  components: {
    apexcharts: VueApexCharts,
  },
  data() {
    return {
      surveyResponseByQuestion: [],
      colorMap: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
      },
      loading: false,
    };
  },
  async created() {
    await this.loadSurveyResponses();
  },
  computed: {
    surveyResponse() {
      return this.surveyResponseByQuestion;
    },
    totalPages() {
      return this.pagination.pages;
    },
    pageOptions() {
      const options = [];
      for (let i = 1; i <= this.totalPages; i++) {
        options.push(i);
      }
      return options;
    },
  },
  methods: {
    async loadSurveyResponses() {
      this.loading = true;
      try {
        const params = {
          page: this.pagination.page,
          limit: this.pagination.limit,
          orderField: 0, // Replace with actual ordering logic
          order: "ASC", // Replace with actual ordering logic
        };
        const res = await SurveyBuilderService.getSurveyResponseSummary(
          this.$route.params.id,
          params
        );
        this.pagination.total = res.totalItems; // Update total count from server
        this.pagination.pages = res.totalPages; // Update total pages from server
        this.surveyResponseByQuestion = res.data.map((q) => {
          if (q.questionType === "radio" || q.questionType === "checkbox") {
            const data = q.questionOptions.map((qo, _i) => {
              const count = q.surveyQuestionsResponse.filter(
                (obj) => qo.id === obj.optionId
              )?.length;
              const fillColor = this.getColorHash(_i);
              return {
                x: "",
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
                offsetY: -20,
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
              yaxis: {
                max: (max) => {
                  return max + 2;
                },
              },
            };
            q.series = [{ name: q.question, data: data }];
            q.totalResponses = q.surveyQuestionsResponse.length;
          }
          return q;
        });
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    getColorHash(qoText) {
      if (!this.colorMap[qoText]) {
        const fillColor = getColorHash(this.colorMap);
        this.colorMap[qoText] = fillColor;
      }
      return this.colorMap[qoText];
    },
  },
  mixins: [loadingMixin],
};
</script>
// add styling
<style scoped>
.custom-legend {
  display: flex;
  flex-direction: column;
}
.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  flex-direction: row;
}
.legend-color {
  width: 24px;
  height: 24px;
  margin-right: 15px;
  border-radius: 2px;
  flex-shrink: 0; /* Prevent shrinking of the box */
}
.legend-text {
  font-size: 12px;
  white-space: normal; /* Allow normal wrapping of text */
  word-wrap: break-word;
}
.v-expansion-panel-content {
  max-height: 400px !important; /* Adjust this to your needs */
  overflow: auto !important;
}

.v-expansion-panel-content::-webkit-scrollbar {
  width: 6px; /* Adjust the width of the scrollbar */
}

.v-expansion-panel-content::-webkit-scrollbar-track {
  background: #f1f1f1; /* Background of the scrollbar track */
  border-radius: 10px; /* Rounded corners */
}

.v-expansion-panel-content::-webkit-scrollbar-thumb {
  background: #e0dcdc; /* Color of the scrollbar thumb */
  border-radius: 10px; /* Rounded corners */
}

.v-expansion-panel-content::-webkit-scrollbar-thumb:hover {
  background: #b9b7b7 !important; /* Color of the scrollbar thumb when hovered */
}
</style>
