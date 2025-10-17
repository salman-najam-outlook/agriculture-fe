<template>
    <div class="text-f">
        <div class="item-box">
            <div class="expiry-box">
                <label for="name" class="text-subtitle-1 font-weight-bold"> {{ question.title }} </label>
                <v-menu v-model="dateFieldOpener" :close-on-content-click="false" :nudge-right="40"
                    transition="scale-transition" offset-y min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field append-icon="mdi-calendar" v-model="fieldValue" :rules="getRules()" outlined dense readonly v-bind="attrs" v-on="on"
                            v-on:click:append="dateFieldOpener = true" placeholder="Select Date"></v-text-field>
                    </template>
                    <v-date-picker v-model="selectedDate" @input="onDateSelected" placeholder="Select Date"></v-date-picker>
                </v-menu>
            </div>
        </div>
    </div>
</template>

<script>
import moment from "moment";

export default {
    props: {
        question: {
            type: Object,
            required: true
        }
    },
    data(){
       return {
        dateFieldOpener:false,
        fieldValue:'',
        selectedDate: null
       }
    },
    methods:{
        getRules(){
            const rules = [];
            if (this.question.isMandatory) {
                rules.push(v => !!v || 'This field is required');
            }
            return rules;
        },
        formatDate(date) {
            return moment(date).format("DD-MMM-YYYY");
        },
        onDateSelected(date) {
            this.dateFieldOpener = false;
            this.fieldValue = this.formatDate(date);
        }
    },
    watch: {
        fieldValue(newValue, oldValue) {

            const questionResponse = {
                questionId: this.question.id,
                questionDetail: this.question,
                response: {
                    questionId: this.question.id,
                    assessmentQuestionType: this.question.assessmentQuestionType,
                    questionHasOptions: false,
                    textFieldAnswer: newValue

                }
            }
            console.log(newValue, oldValue);
            this.$emit('handleTextValue', questionResponse)
        },
        selectedDate(newValue) {
            if (newValue) {
                this.fieldValue = this.formatDate(newValue);
            }
        }
    }
}


</script>