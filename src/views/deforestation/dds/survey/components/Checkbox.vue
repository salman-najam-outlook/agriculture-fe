<template>
  <div class="text-f">
    <div class="item-box">
      <label class="text-subtitle-1 font-weight-bold">{{
        question.title
      }}
      </label>
      <div v-if="validationError" class="text-danger small mt-1">
        * {{ validationError }}
      </div>
      <v-checkbox
        v-for="(option, index) in question.options"
        :key="index"
        :label="option.label"
        :value="option"
        v-model="fieldValue"
        :rules="getRules()"
      ></v-checkbox>  
    </div>
  </div>
</template>

<script>
import { debounce } from "lodash";

export default {
  mounted() {
    this.initializeFieldValue()
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
  data() {
    return {
      fieldValue: [], // Ensure fieldValue is an array for multiple selections
      selectedOptions: [],
      validationError: "",
    };
  },
  methods: {
    getRules() {
      const rules = [];
      if (this.question.isMandatory) {
        rules.push((v) => !!v.length || "This field is required");
      }
      return rules;
    },
    emitHandleTextValue(newValues) {
      this.selectedOptions = newValues;
      const selectedOptionsData = newValues.map((option) => ({
        selectedOptionId: option.id,
        optionValue: option.value,
      }));
      const questionResponse = {
        questionId: this.question.id,
        questionDetail: this.question,
        response: {
          questionId: this.question.id,
          assessmentQuestionType: this.question.assessmentQuestionType,
          questionHasOptions: true,
          selectedOptions: selectedOptionsData,
        },
      };
      this.$emit("handleTextValue", questionResponse);
    },
    initializeFieldValue() {
      if (this.answer && this.answer.selectedOptions) {
      this.fieldValue = this.question.options.filter((option) =>
        this.answer.selectedOptions.some(
          (selected) => selected.selectedOptionId === option.id
        )
      );
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
      handler: debounce(function(newValues, oldValues) {
        if(this.question.isMandatory &&!newValues?.length && oldValues?.length){
          this.validationError = 'This field is required'
        }
        else{
          this.validationError = ''
        }
        if (
          (newValues?.length && oldValues?.length) ||
          (newValues?.length && !oldValues?.length) ||
          (oldValues?.length && !newValues?.length)
        )
          {         
            this.emitHandleTextValue(newValues);

          }
      }, 300),
      immediate: true,
    },
  },
};
</script>
<style scoped>
.text-danger.small {
  font-size: 0.875rem; /* Bootstrap's .small size */
  color: #dc3545; /* Bootstrap's .text-danger color */
}
</style>
