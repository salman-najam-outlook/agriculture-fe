<template>
  <div class="text-f">
    <div class="item-box">
      <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">
        {{ question.title }}
      </label>
      <v-text-field
        required
        v-model="fieldValue"
        :rules="getRules()"
        outlined
      ></v-text-field>
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
    emitHandleTextFieldValue(newValue) {
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
    answer: {
      handler(nV, oV) {
        if(JSON.stringify(nV) != JSON.stringify(oV)) // this is super important, if you remove this, it will cause infinite loop
          this.initializeFieldValue();
      },
      deep: true,
      immediate: true,
    },
    fieldValue: {
      handler: debounce(function(newValue, oldValue) {
        console.log(newValue, oldValue);
       this.emitHandleTextFieldValue(newValue);
      }, 300), 
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
