<template>
    <div class="text-f">
        <div class="item-box">
            <label for="autoLogOff" class="text-subtitle-1 font-weight-bold"> {{ question.title }}</label>
            <div class="signature">
                <v-btn color="primary" @click="handleOpenSignatureModel">{{ $t("dueDiligence.addSignature") }}
                </v-btn>
            </div>
            <img
                width="150"
                v-if="fieldValue.attachmentLink"
                :src="fieldValue.attachmentLink"
            />
        </div>
        <signature @handleSignature="handleSignature" :dialog="openSignatureModel"
            @closeSignatureModel="openSignatureModel = false"> </signature>
    </div>
</template>
<script>
import SignatureModal from "../../reports/components/risk-assessment/SignatureModal.vue";
export default {
    props: {
        question: {
            type: Object,
            required: true
        },
        answer: {
            type: Object,
            required: false,
            default: () => ({}),
        },
    },
    components: {
        'signature': SignatureModal
    },
    mounted() {
        this.initializeFieldValue();
    },
    methods: {
        getRules() {
            const rules = [];
            if (this.question.isMandatory) {
                rules.push(v => !!v || 'This field is required');
            }
            return rules;
        },
        handleOpenSignatureModel() {
            this.openSignatureModel = true
        },
        handleSignature(payload) {
            this.fieldValue = payload || {
                attachmentLink:'',
                s3key:''
            };
            const questionResponse = {
                questionId: this.question.id,
                questionDetail: this.question,
                response: {
                    questionId: this.question.id,
                    assessmentQuestionType: this.question.assessmentQuestionType,
                    questionHasOptions: false,
                    fileAndDigitalSignatureFieldAnswer: [
                        payload
                    ]

                }
            }
            this.$emit('handleTextValue', questionResponse)

        },
        initializeFieldValue() {
            if (this.answer && this.answer.fileAndDigitalSignatureFieldAnswer) {
                this.fieldValue = this.answer.fileAndDigitalSignatureFieldAnswer[0] || {
                    attachmentLink:'',
                    s3key:''
                };
            }
        },
    },
    watch: {
        answer: {
            handler() {
                this.initializeFieldValue();
            },
            deep: true,
            immediate: true,
        },
        // fieldValue(old, newv) {
        //     this.$emit('handleTextValue', newv)
        // }
    },
    data() {
        return {
            fieldValue: {
                attachmentLink:'',
                s3key:''
            },
            openSignatureModel: false,
        }
    }
}


</script>