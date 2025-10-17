<template>
  <v-card v-if="questions?.length" outlined class="pa-4 mb-4">
    <h4 class="mb-3">{{ $t('esgPlatform.surveyResponse.getDataQuestions') }}</h4>
    <div v-for="question in questions" :key="question._id" class="mb-3">
      <div class="d-flex align-center">
        <p class="text-subtitle-2">{{ question.title }} ({{ question.dataType }})</p>
        <v-tooltip v-if="question.helpText && question.helpEnabled" right color="00BD73" max-width="500">
          <template v-slot:activator="{ on, attrs }">
            <v-icon class="icon-with-background pl-2 mb-4" style="color:#0EBF67" v-bind="attrs" v-on="on">
              mdi-alert-circle
            </v-icon>
          </template>
          <p class="text-caption mb-2">
            {{ question.helpText }}
          </p>
        </v-tooltip>
      </div>
      <data-type-field
        :type="question.dataType"
        :value="getQuestionValue(question._id)"
        :mandatory="question.isMandatory"
        :options="question.options || question.optionValues"
        :unit-type-list="unitTypeList"
        :unit-meta="unitMeta"
        :unit-list="getUnitList(question)"
        :allow-unit-change="question.additionalSettings?.allowUnitChange"
        :uploaded-files="question.uploadedFiles"
        @input="value => updateResponse(question._id, value, question.dataType)"
        @file-change="files => $emit('file-change', files, question)"
        @remove-file="index => $emit('remove-file', index, question)"
        @open-signature="() => $emit('open-signature', question)"
        @remove-signature="() => $emit('remove-signature', question)"
        @checkbox-change="opt => $emit('checkbox-change', opt, question)"
      />
    </div>
  </v-card>
</template>

<script>
import DataTypeField from './DataTypeField.vue';

export default {
  name: 'GetDataQuestions',
  
  components: {
    DataTypeField
  },

  props: {
    questions: {
      type: Array,
      default: () => []
    },
    responses: {
      type: [Object, Array],
      default: () => ({})
    },
    unitTypeList: {
      type: Object,
      default: () => ({})
    },
    unitMeta: {
      type: Object,
      default: () => ({})
    }
  },

  methods: {
   
    getQuestionValue(questionId) {
      // If responses is an array (checkbox case)
      if (Array.isArray(this.responses)) {
        const response = this.responses.find(r => r.id === questionId);
        return response ? response.value : null;
      }
      // If responses is an object (radio case)
      return this.responses[questionId];
    },


    getUnitList(question) {
      const type = question.additionalSettings?.measurementUnitType;
      return this.unitTypeList[type] || [];
    },

    updateResponse(questionId, value, dataType) {
      this.$emit('update-response', { questionId, value, dataType });
    }
  }
};
</script> 