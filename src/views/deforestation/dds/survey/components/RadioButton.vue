<template>
  <div class="text-f">
    <div class="item-box">
      <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">
        {{ question.title }}
      </label>
      <v-radio-group v-model="fieldValue" row :rules="getRules()">
        <div
          class="radio-with-checklist"
          v-for="(option, key) in question.options"
          :key="key"
        >
          <v-radio :label="option.label" :value="option"></v-radio>
          <div
            v-if="
              option.subQuestions &&
                option.subQuestions.length &&
                selectedOption.id === option.id
            "
            class="mt-2 ml-2"
          >
            <Survey
              :surveyee="option.subQuestions"
              @questionResponses="handleSubQuestionResponse"
            ></Survey>
          </div>
        </div>
      </v-radio-group>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  name: "RadioButton",
  components: {
    Survey: defineAsyncComponent(() => import("../Survey.vue")),
  },
  props: {
    question: {
      type: Object,
      required: true,
    },
    answer: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  mounted() {
    this.initializeFieldValue();
  },
  data() {
    return {
      subQuestions: [],
      parentQuestionResponse: null,
      selectedOption: {},
      fieldValue: this.answer.selectedOption
        ? this.answer.selectedOption[0]
        : null,
      subQuestionAnswerDetail: [],
    };
  },
  watch: {
    answer: {
      handler() {
        this.initializeFieldValue();
      },
      deep: true,
      immediate: true,
    },
    fieldValue(newOption) {
      this.subQuestions = newOption.subQuestions || [];
      this.selectedOption = newOption;
      const questionResponse = {
        questionId: this.question.id,
        questionDetail: this.question,
        response: {
          questionId: this.question.id,
          assessmentQuestionType: this.question.assessmentQuestionType,
          questionHasOptions: true,
          selectedOptions: [
            {
              selectedOptionId: newOption.id,
              optionValue: newOption.value,
            },
          ],
        },
      };
      this.parentQuestionResponse = questionResponse;
      this.$emit("handleTextValue", questionResponse);
    },
  },
  methods: {
    getRules() {
      const rules = [];
      if (this.question.isMandatory) {
        rules.push((v) => !!v || "This field is required");
      }
      return rules;
    },
    handleSubQuestionResponse(subQuestionPayload) {
      let nestedQuestionAnswer = subQuestionPayload;
      if (this.parentQuestionResponse) {
        const indexOfSelectedOption = this.parentQuestionResponse.response.selectedOptions.findIndex(
          (s) => s.selectedOptionId === this.selectedOption.id
        );
        if (indexOfSelectedOption !== -1) {
          const index = this.subQuestionAnswerDetail.findIndex(
            (s) => s.questionId === subQuestionPayload.questionId
          );
          if (index === -1)
            this.subQuestionAnswerDetail.push(subQuestionPayload.response);
          else
            this.subQuestionAnswerDetail[index] = subQuestionPayload.response;

          this.parentQuestionResponse.response.selectedOptions[
            indexOfSelectedOption
          ].subQuestionAnswerDetail = this.subQuestionAnswerDetail;
          nestedQuestionAnswer = this.parentQuestionResponse;
        }
      }
      this.$emit("handleTextValue", nestedQuestionAnswer);
    },
    initializeFieldValue() {
      if (this.answer && this.answer.selectedOptions) {
        this.fieldValue =
          this.question.options.find(
            (option) =>
              option.id === this.answer.selectedOptions[0]?.selectedOptionId
          ) || null;
      } else {
        this.fieldValue = null;
      }
    },
  },
};
</script>
