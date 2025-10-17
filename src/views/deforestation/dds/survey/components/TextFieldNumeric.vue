<template>
    <div class="text-f">
        <div class="item-box">
            <label for="autoLogOff" class="text-subtitle-1 font-weight-bold"> {{ question.title }}</label>
            <v-text-field required type="number" v-model.number="fieldValue" :rules="getRules()"  outlined></v-text-field>
        </div>
    </div>
</template>

<script>
import { debounce } from 'lodash';

export default {
    props: {
        question: {
            type: Object,
            required: true
        },
        answer:{
            type: Object,
            required: false,
            default:()=>({})
        }
    },
    mounted() {
        this.initializeFieldValue();
    },
    methods:{
        getRules(){
            const rules = [];
            if (this.question.isMandatory) {
                rules.push(v => !!v || 'This field is required');
            }
            return rules;
        },
        emitHandleTextFieldNumericValue(newValue){
            const questionResponse = {
                questionId: this.question.id,
                questionDetail: this.question,
                response: {
                    questionId: this.question.id,
                    assessmentQuestionType: this.question.assessmentQuestionType,
                    questionHasOptions: false,
                    numberFieldAnswer: newValue || null,

                }
            }
            this.$emit('handleTextValue', questionResponse)
        }, 

        initializeFieldValue(){
            if (this.answer && this.answer.numberFieldAnswer) {
                this.fieldValue = this.answer.numberFieldAnswer || null;
            }
        }
    },
    watch:{
        fieldValue: {
            handler: debounce(function (newValue) {
                this.emitHandleTextFieldNumericValue(newValue);
            }, 300), // Adjust the debounce delay as needed
            immediate: true
        },
        answer:{
            handler(){
                this.initializeFieldValue();
            },
            deep:true,
            immediate: true,
        } 
    },
    data(){
        return {
            fieldValue: this.answer.numberFieldAnswer ||  null
        }
    }
}


</script>