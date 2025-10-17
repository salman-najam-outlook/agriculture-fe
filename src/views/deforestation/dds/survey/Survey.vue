<template>
  <div>
    <v-row>
      <v-col cols="8" class="heading">
        {{paginatedHeading}}
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="3" class="float-right align-center">
        <div class="pagination d-flex justify-space-between align-center mt-8">
          <v-btn
            :disabled="currentPage === 1"
            @click="prevPage"
            color="primary"
            fab
            small
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>

          <div class="pagination-step px-3">
            <span
              >{{ $t('step') }}
              <v-btn class="white--text primary mx-2" x-small fab>{{
                currentPage
              }}</v-btn>
              of  <span class="mx-2">{{ totalPages }}</span></span
            >
          </div>

          <v-btn
            :disabled="currentPage === totalPages"
            @click="nextPage"
            color="primary"
            fab
            small
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-row class="mb-5">
      <template class="q-r" v-for="(question, key) in paginatedQuestions">
        <v-col cols="6" v-if="question.isEnabled" :key="key">
          <component
            :is="getComponentType(question.assessmentQuestionType)"
            :question="question"
            :answer="findAnswer(question.id)"
            @handleTextValue="handleInputValues"
             :rules="getValidationRules(question)"
          />
          <v-divider></v-divider>
        </v-col>
      </template>
    </v-row>
    <div v-show="currentPage === totalPages" class="signature mb-5">
      <v-btn color="primary" @click="handleOpenSignatureModel">
        {{ $t("dueDiligence.addSignature") }}
      </v-btn>
      <div v-if="signatureDetails?.signatureS3Location">
        <img :src="signatureDetails.signatureS3Location" class="mt-2" style="width: 200px; height: 160px; object-fit: contain;" />
      </div>
    </div>
  </div>
</template>

<script>
import TextAreaField from "./components/TextAreaField.vue";
import TextField from "./components/TextField.vue";
import DateField from "./components/DateField.vue";
import RadioButton from "./components/RadioButton.vue";
import TextFieldNumeric from "./components/TextFieldNumeric.vue";
import Dropdown from "./components/Dropdown.vue";
import Checkbox from "./components/Checkbox.vue";
import FileAttachment from "./components/FileAttachment.vue";
import DigitalSignature from "./components/DigitalSignature.vue";

export default {
  name: "Survey",
  props: {
    surveyee: {
      type: [Object, Array],
      required: true,
    },
    surveyResponses: {
      type: Array,
      required: false,
      default: () => [],
    },
    signatureDetails: {
      type: Object,
      required: false,
    },
  },
  computed: {
    paginatedQuestions() {
      return this.surveyee[this.currentPage - 1]?.assessmentQuestions;
    },
    paginatedHeading() {
      return this.surveyee[this.currentPage - 1]?.title;
    },
    totalPages(){
        return this.surveyee.length ?? 0;
    }
  },
  components: {
    TextAreaField,
    TextField,
    DateField,
    RadioButton,
    TextFieldNumeric,
    Dropdown,
    Checkbox,
    FileAttachment,
    DigitalSignature,
  },
  methods: {
    getValidationRules(question) {
      const rules = [];
      
      if (question.isMandatory) {
        rules.push(v => !!v || 'This field is required');
      }
      
      return rules;
    },
    getComponentType(type) {
      switch (type) {
        case "RADIO_BUTTON":
          return "RadioButton";
        case "TEXT_FIELD":
          return "TextField";
        case "TEXT_FIELD_NUMERIC":
          return "TextFieldNumeric";
        case "DATE_FIELD":
          return "DateField";
        case "TEXT_AREA":
          return "TextAreaField";
        case "DROPDOWN_OPTIONS":
          return "Dropdown";
        case "CHECK_BOXES":
          return "Checkbox";
        case "FILE_ATTACHMENT":
          return "FileAttachment";
        case "DIGITAL_SIGNATURE":
          return "DigitalSignature";
        default:
          return null;
      }
    },
    handleInputValues(payload) {
      console.log(payload);
      this.$emit("questionResponses", payload);
    },
    findAnswer(questionId) {
      const response = this.surveyResponses.find(
        (response) => response.questionId === questionId
      );
      return response ? response.response : {};
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
    handleOpenSignatureModel() {
      this.$emit('handleOpenSignatureModel');
    }
  },
  data() {
    return {
      currentPage: 1,
      steps: [],
      values: [],
    };
  },
};
</script>

<style scoped>
.pagination-step {
  font-weight: bold;
  font-size: 16px;
}
.heading{
  font-size: 22px;
  font-weight: 700;
  line-height: 20px;
  text-align: left;
  color: #00BD73;
  align-content: center;
}
</style>
