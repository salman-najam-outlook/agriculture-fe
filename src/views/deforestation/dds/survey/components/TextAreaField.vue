<template>
  <div class="text-f">
    <div class="item-box">
      <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">
        {{ question.title }}</label
      >
      <v-textarea v-model="fieldValue" required :rules="getRules()" outlined>
      </v-textarea>
    </div>
  </div>
</template>
<script>
import { debounce } from "lodash";

export default {
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
  methods: {
    getRules() {
      const rules = [];
      if (this.question.isMandatory) {
        rules.push((v) => !!v || "This field is required");
      }
      return rules;
    },
    emitHandleTextValue(newValue) {
      const questionResponse = {
        questionId: this.question.id,
        questionDetail: this.question,
        response: {
          questionId: this.question.id,
          assessmentQuestionType: this.question.assessmentQuestionType,
          questionHasOptions: false,
          textFieldAnswer: newValue,
        },
      };
      this.$emit("handleTextValue", questionResponse);
    },
    initializeFieldValue() {
      if (this.answer && this.answer.textFieldAnswer) {
        this.fieldValue = this.answer.textFieldAnswer;
      } else {
        this.fieldValue = "";
      }
    },
  },
  watch: {
    fieldValue: {
      handler: debounce(function(newValue, oldValue) {
        console.log(newValue, oldValue);
         this.emitHandleTextValue(newValue);
      }, 300), // Adjust the debounce delay as needed
      immediate: true,
    },
    answer: {
      handler() {
        this.initializeFieldValue();
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      fieldValue: this.answer.textFieldAnswer || "",
    };
  },
};
</script>
