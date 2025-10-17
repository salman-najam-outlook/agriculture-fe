<template>
  <div>
    <v-row class="mb-2">
      <v-col cols="10 mt-3">
        <h2>
          {{ $t('dueDiligence.manualFillOutAssessment') }}
          <span style="color: green">
            <v-icon color="primary">info</v-icon>
          </span>
        </h2>
      </v-col>
      <v-col cols="2">
        <div class="pagination d-flex justify-space-between align-center mt-8">
          <v-btn :disabled="currentPage === 1" @click="prevPage" color="primary" fab small>
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>

          <div class="pagination-step px-2">
            <span>{{$t('step')}}
              <v-btn class="white--text primary" x-small fab>{{
                currentPage
              }}</v-btn>
              {{$t('of')}} {{ totalPages }}</span>
          </div>

          <v-btn :disabled="currentPage === totalPages" @click="nextPage" color="primary" fab small>
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row class="my-5">
      <v-col cols="6" v-for="(question, key) in paginatedQuestions" :key="key">
        <div class="q-box mb-4">
          <v-row class="rd-result-box d-flex">
            <v-col cols="7" class="flex-grow-8">
              {{ question.title }}
            </v-col>
            <v-col cols="3" class="flex-grow-1" v-if="question.assessmentQuestionType !== 'FILE_ATTACHMENT'">
              <span> {{ getAnsByComponentType(question) }} </span>
            </v-col>
            <v-col cols="2" class="d-flex flex-grow-2" v-if="question.options.length > 0">
              <span class="mr-5 cursor-pointer" :class="getColorClass(question)" @click="highMitigate(question)">
                {{ getLabel(question) }}
              </span>
              <div>
                <v-btn x-small fab color="yellowIcon" v-if="isClickable(question) && getLabel(question) !== ''">
                  <v-icon rounded class="white--text">mdi-hammer-wrench</v-icon>
                </v-btn>

                <!-- <v-btn
                  x-small
                  fab
                  class="primary"
                  v-else-if="getLabel(question) === 'Low'"
                >
                  <v-icon rounded class="white--text">mdi-history</v-icon>
                </v-btn> -->
              </div>
            </v-col>
            <v-col cols="12" v-if="question.assessmentQuestionType === 'DIGITAL_SIGNATURE'">
              <v-col cols="12">
                <div class="docs-box mr-4">
                  <div class="docs-preview">
                    <div class="img-item">
                      <img width="150" v-if="getDigitalSignature(question.id)" :src="getDigitalSignature(question.id)" />
                    </div>
                  </div>
                </div>
              </v-col>
            </v-col>
            <v-col cols="12" v-if="question.assessmentQuestionType === 'FILE_ATTACHMENT'">
              <v-row class="pdf-docs d-flex align-start mb-4" v-for="(doc, key) in getAnsByComponentType(question)" :key="key">
                <v-col cols="4" class="d-flex justify-center align-center">
                  <div class="docs-box">
                    <div class="docs-preview">
                      <v-sheet elevation="2"
                        class="pdf-box d-flex align-center justify-center flex-column text-center mx-auto" style="
                      border: 1px solid #e0e0e0;
                      border-radius: 8px;
                      padding: 16px;
                      position: relative;
                      width: 120px;
                      height: 120px;
                    ">
                        <v-icon @click="removeFile(key)" class="delete-icon" style="
                        position: absolute;
                        top: 4px;
                        right: 4px;
                        color: #f44336;
                        cursor: pointer;
                      " title="Remove file">
                          mdi-trash-can-outline
                        </v-icon>
  
                        <div class="justify-center" style="display:ruby">
                          <v-icon dark @click="openFile(doc?.attachmentLink)" style="color: green;cursor: pointer;"
                            title="View file">
                            mdi-eye
                          </v-icon>
                          <br />
  
                          <h2 class="file-extension mt-2" style="font-size: 14px; color: #607d8b;">
                            {{ doc.extension }}
                          </h2>
                        </div>
                      </v-sheet>
                      <span class="file-name mt-2"
                        style="display: block; font-size: 14px; text-align: center; color: #424242;">
                        {{ doc.name }}
                      </span>
                    </div>
                  </div>
                </v-col>
                <v-col cols="8" class="pl-0">
                  <div class="text-box mr-4" v-if="question.fileTypeAdditionalSettings &&
                    question.fileTypeAdditionalSettings.allowComments
                    ">
                    <v-textarea
                      disabled
                      v-model="doc.comment"
                      placeholder="Comments"
                      outlined
                      class="comment-box"
                    ></v-textarea>
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-divider class="mb-4 mt-4"></v-divider>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import DeforestationService from "@/_services/DeforestationService";
import loadingMixin from "@/mixins/LoadingMixin";

export default {
  name: "Survey",
  props: {
    productionPlaceId: {
      type: Number,
      required: true,
    },
    eudrSettings: {
      type: Object,
      required: false,
    },
    diligenceId: {
      type: Number,
    },
    assessmentId: {
      type: Number,
    },
    surveyee: {
      type: [Object, Array],
      required: true,
    },
    surveyResponses: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  components: {},
  computed: {
    paginatedQuestions() {
      return this.surveyee[this.currentPage - 1].assessmentQuestions;
    },
  },
  methods: {
    async openFile(url) {
        window.open(url, "_blank");
    },

    isClickable(question) {

      const label = this.getLabel(question);
      if (label == 'Very High' && !this.eudrSettings.riskLevel.very_high) {
        return false;
      }

      if (label == 'High' && !this.eudrSettings.riskLevel.high) {
        return false;
      }

      if (label == 'Medium' && !this.eudrSettings.riskLevel.medium) {
        return false;
      }

      if (label == 'Low' && !this.eudrSettings.riskLevel.low) {
        return false;
      }
      
      if (label == 'Zero' && !this.eudrSettings.riskLevel.zero) {
        return false;
      }
      return true;
    },
    async highMitigate(question) {
      try {

        const label = this.getLabel(question);

        if (label == 'Very High' && !this.eudrSettings.riskLevel.very_high) {
          return false;
        }

        if (label == 'High' && !this.eudrSettings.riskLevel.high) {
          return false;
        }

        if (label == 'Medium' && !this.eudrSettings.riskLevel.medium) {
          return false;
        }

        if (label == 'Low' && !this.eudrSettings.riskLevel.low) {
          return false;
        }

        if (label == 'Zero' && !this.eudrSettings.riskLevel.zero) {
          return false;
        }

        const answer = this.findAnswer(question.id);
        const assessmentQuestionId = answer.questionId;
        const assessmentQuestionOptionId =
          answer?.selectedOptions[0].selectedOptionId;

        this.startLoading();

        const surveyResponse = this.findResponse(question.id);
        const payloadFormat = {
          dueDiligenceId: this.diligenceId,
          assessmentId: this.assessmentId,
          productionPlaceId: this.productionPlaceId,
          assessmentQuestionId,
          assessmentQuestionOptionId,
          checkLists: [],
          assessmentResponseId: surveyResponse?.id,
        };

        const res = await DeforestationService.createAssessmentMitigation(
          payloadFormat
        );

        if (res && res.data && res.data.createAssessmentMitigation) {
          this.$router.push({
            name: "complianceRiskMitigation",
            params: { id: res.data.createAssessmentMitigation.id },
          });
        }
      } catch (error) {
        console.error("Error creating assessment mitigation:", error);
      } finally {
        this.stopLoading();
      }
    },

    getAnsByComponentType(question) {
      const response = this.findAnswer(question.id);

      switch (question.assessmentQuestionType) {
        case "RADIO_BUTTON":
          return response.selectedOptions
            ? question.options.find(
              (opt) =>
                opt.id === response.selectedOptions[0]?.selectedOptionId
            )?.label || ""
            : "";
        case "TEXT_FIELD":
          return response.textFieldAnswer || "";
        case "TEXT_FIELD_NUMERIC":
          return response.numberFieldAnswer || "";
        case "DATE_FIELD":
          return response.dateFieldAnswer || "";
        case "TEXT_AREA":
          return response.textFieldAnswer || "";
        case "DROPDOWN_OPTIONS":
          return response.dropdownAnswer || "";
        case "CHECK_BOXES":
          return response.selectedOptions
            ? response.selectedOptions
              .map(
                (opt) =>
                  question.options.find(
                    (option) => option.id === opt.selectedOptionId
                  )?.label
              )
              .join(", ")
            : "";
        case "FILE_ATTACHMENT":
          return response.fileAndDigitalSignatureFieldAnswer?.map((item) => ({
            ...item,
            extension: item?.s3Result?.s3key ? item.s3Result.s3key.split(".").pop() : item?.s3key ? item.s3key.split(".").pop() : "",
            name: item?.s3Result?.s3key ? item.s3Result.s3key.split("risk-assessment-docs/").pop() : item?.s3key ? item.s3key.split("risk-assessment-docs/").pop() : ""
          })) || [];
        case "DIGITAL_SIGNATURE":
          return response.digitalSignatureAnswer || "";
        default:
          return "";
      }
    },
    findResponse(questionId) {
      const response = this.surveyResponses.find(
        (response) => response.questionId === questionId
      );
      return response;

    },
    findAnswer(questionId) {
      const response = this.findResponse(questionId);
      return response ? response.response : {};
    },

    getDigitalSignature(questionId) {
      const answer = this.findAnswer(questionId);
      return answer.fileAndDigitalSignatureFieldAnswer
        ? answer.fileAndDigitalSignatureFieldAnswer[0].attachmentLink
        : null;
    },

    getLabel(question) {
      if (question.options.length > 0) {
        const response = this.findAnswer(question.id);
        const answer = response.selectedOptions
          ? question.options
            .find(
              (opt) =>
                opt.id === response.selectedOptions[0]?.selectedOptionId
            )
            ?.value?.toLowerCase() || ""
          : "";

          
        if (answer.includes("very_high")) return "Very High";
        if (answer.includes("high")) return "High";
        if (answer.includes("medium")) return "Medium";
        if (answer.includes("low")) return "Low";
        if (answer.includes("zero")) return "Zero";
      }
      return "";
    },
    getColorClass(question) {
      if (question.options.length > 0) {
        const response = this.findAnswer(question.id);
        const answer = response.selectedOptions
          ? question.options
            .find(
              (opt) =>
                opt.id === response.selectedOptions[0]?.selectedOptionId
            )
            ?.value?.toLowerCase() || ""
          : "";

        if (answer.includes("very_high")) return "very-high-color";
        if (answer.includes("high")) return "high-color";
        if (answer.includes("medium")) return "medium-color";
        if (answer.includes("low")) return "low-color";
        if (answer.includes("zero")) return "zero-color";
      }
      return "";
    },

    removeFile(key) {
      this.documents.splice(key, 1);
      this.s3FileUploadResult = this.s3FileUploadResult.filter(
        (s) => s.s3key !== key
      );
      const questionResponse = {
        questionId: this.question.id,
        questionDetail: this.question,
        response: {
          questionId: this.question.id,
          assessmentQuestionType: this.question.assessmentQuestionType,
          questionHasOptions: false,
          fileAndDigitalSignatureFieldAnswer: this.s3FileUploadResult,
        },
      };
      this.$emit("handleTextValue", questionResponse);
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
  },
  data() {
    return {
      currentPage: 1,
      totalPages: this.surveyee.length ?? 0,
      steps: [],
      values: [],
    };
  },

  mixins: [loadingMixin],
};
</script>
<style lang="scss" scoped>
::v-deep .pdf-box {
  height: 100px;
  width: 100px;
  background-color: #e5f8f1;
  position: relative;
  line-height: 75px;
  text-align: center;
}

::v-deep .pdf-box h1 {
  position: absolute;
  top: 18%;
  left: 25%;
  color: #135b00;
}

::v-deep .pdf-box .icon-class {
  position: absolute;
  top: 8%;
  left: 67%;
}

.flex-grow-8 {
  flex: 8;
}

.flex-grow-1 {
  flex: 1;
}

.flex-grow-2 {
  flex: 2;
}

.lw-color {
  color: #60dbdb;
}

.vlw-color {
  color: #208080;
}

.zero-color {
  color: #979797;
}

.very-high-color {
  color: #8b0000;
}

.high-color {
  color: #f02020;
}

.medium-color {
  color: #ffa520;
}

.primary-color {
  color: #00bd73;
}

.pagination-step {
  font-weight: bold;
  font-size: 16px;
}
.docs-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.icon-class {
  position: absolute;
  top: -10px;
  right: -10px;
  font-size: 18px;
  color: #da3d3d;
}
.preview-icon-class {
  position: absolute;
  top: 0px;
  left: 0px;
}

.doc-name {
  font-size: 14px;
  word-wrap: break-word;
  max-width: 100px;
}

.comment-box {
  width: 80%;
  margin-left: 12px;
}

</style>