<template>
    <div class="text-f">
        <div class="item-box">
            <label for="autoLogOff" class="text-subtitle-1 font-weight-bold"> {{ question.title }} </label>
            <v-select v-model="fieldValue" :items="question.options" item-text="label" item-value="value"
                :rules="getRules()" outlined dense style="max-width:175px" class="mr-5" placeholder="Choose options"></v-select>
            <div v-if="selectedOption.checklists" class="mt-2 ml-2">
                <p class="mb-2" v-for="(checklistItem, index) in selectedOption.checklists" :key="index">
                    <v-icon color="primary">mdi-checkbox-marked-circle</v-icon>
                    {{ checklistItem }}
                </p>
            </div>
            <div v-if="selectedOption.subQuestions && selectedOption.subQuestions.length" class="mt-2 ml-2">
                <Survey :surveyee="selectedOption.subQuestions" @questionResponses="handleSubQuestionResponse"> </Survey>
            </div>
        </div>
    </div>
</template>

<script>
import { debounce } from 'lodash';
import { defineAsyncComponent } from 'vue';

export default {
    name:'Dropdown',
    components: {
        'Survey': defineAsyncComponent(() => import('../Survey.vue'))
    },
    props: {
        question: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            fieldValue: null, // Ensure fieldValue is properly initialized
            selectedOption: {},
            parentQuestionResponse: null,
            subQuestionAnswerDetail:[]

        }
    },
    methods: {
        getRules() {
            const rules = [];
            if (this.question.isMandatory) {
                rules.push(v => !!v || 'This field is required');
            }
            return rules;
        },
        handleSubQuestionResponse(subQuestionPayload) {
            let nestedQuestionAnswer = subQuestionPayload;
            if (this.parentQuestionResponse) {
                const indexOfSelectedOption = this.parentQuestionResponse.response.selectedOptions.findIndex(s => s.selectedOptionId === this.selectedOption.id);
                if (indexOfSelectedOption !== -1) {
                    const index = this.subQuestionAnswerDetail.findIndex(s => s.questionId === subQuestionPayload.questionId)
                    if (index === -1)
                    this.subQuestionAnswerDetail.push(subQuestionPayload.response);
                    else this.subQuestionAnswerDetail[index] = subQuestionPayload.response
                    this.parentQuestionResponse.response.selectedOptions[indexOfSelectedOption].subQuestionAnswerDetail = this.subQuestionAnswerDetail;
                    nestedQuestionAnswer = this.parentQuestionResponse
                }
            }
            this.$emit('handleTextValue', nestedQuestionAnswer);

        },
        emitHandleTextValue(newValue) {
            if (newValue) {
                const selectedOption = this.question.options.find(option => option.value === newValue);
                if (selectedOption) {
                    this.selectedOption = selectedOption;
                    const questionResponse = {
                        questionId: this.question.id,
                        questionDetail: this.question,
                        response: {
                            questionId: this.question.id,
                            assessmentQuestionType: this.question.assessmentQuestionType,
                            questionHasOptions: true,
                            selectedOptions: [{
                                selectedOptionId: selectedOption.id,
                                optionValue: selectedOption.value
                            }]
                        }
                    };
                    this.parentQuestionResponse = questionResponse

                    this.$emit('handleTextValue', questionResponse);
                }
            }
        }
    },
    watch: {
        fieldValue: {
            handler: debounce(function (newValue) {
                this.emitHandleTextValue(newValue);
            }, 300),
            immediate: true
        }
    }
}
</script>
