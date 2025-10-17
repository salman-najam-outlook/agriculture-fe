<template>
    <div>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <!-- Header Section -->
            <v-row>
                <v-col cols="12" class="d-flex justify-space-between align-center">
                    <div>
                        <h2 class="text-h5 font-weight-bold mb-4">
                            {{ surveyData.goal.title }}
                        </h2>
                    </div>
                    <v-btn color="success" class="text-capitalize" @click="goBack">
                        {{ $t('back')}}
                    </v-btn>
                </v-col>
            </v-row>

            <!-- Title and Response Score -->
            <v-row>
                <v-col cols="12">
                    <v-card outlined class="pa-6">
                        <v-row>
                            <v-col cols="8">
                                <ul style="list-style-type: none; padding-left: 0;">
                                    <li>
                                        <p><span class="font-weight-bold">{{ $t('esgPlatform.goal')}}:</span> {{ surveyData.goal.title }}</p>
                                    </li>
                                    <li>
                                        <p><span class="font-weight-bold">{{ $t('esgPlatform.subOrganization')}}:</span> {{ surveyData?.submittedUser?.subOrganization?.name }} </p>
                                    </li>
                                    <li>
                                        <p><span class="font-weight-bold">{{ $t('esgPlatform.submittedBy')}}:</span> {{ getSubmittedBy }}  </p>
                                    </li>
                                    <li>
                                        <p><span class="font-weight-bold">{{ $t('esgPlatform.dateSubmitted')}}:</span> 
                                        {{  getLatestSubmittedDate }}
                                        </p>
                                    </li>
                                </ul>
                            </v-col>

                            <v-col cols="4" class="text-right">
                                <div class="text-h6">{{ $t('esgPlatform.responses')}}</div>
                                <div class="text-h3">
                                    <span class="text-h2 font-weight-bold">{{ responseStats.completed }}</span>
                                    <span class="text-h2 font-weight-bold">/{{ responseStats.total }}</span>
                                </div>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>

            <!-- Water Scarcity Section -->
            <v-row>
                <v-col cols="12">
                    <div class="water-scarcity-section" v-for="(heading, index) in surveyData.responses" :key="index">
                        <!-- Question Header -->
                        <h3 class="text-h6 font-weight-bold mb-4">
                           {{ index + 1 }}. &nbsp; {{ heading?.title }}
                        </h3>

                        <!-- Dynamic Questions Section -->
                        <div v-for="(question, index2) in heading?.assessmentQuestions" :key="index2" class="question-block mb-8"
                            style="padding: 0 16px;">
                            <div class="subtitle-1 mb-4">
                                {{ index + 1 }}.{{ index2 + 1 }} &nbsp; {{ question.title }}
                            </div>

                            <div class="answer-section" v-if="question.response">
                                <!-- Text Field & Text Area Response -->
                                <div v-if="['text-field', 'text-area','numeric'].includes(question.questionType)" class="mb-6">
                                    {{ question.response?.value }}
                                </div>

                                <!-- Radio Button Response -->
                                <div v-if="question.questionType === 'radio-button'" class="mb-6">
                                    <v-radio-group :value="getSelectedRadioValue(question)" readonly>
                                        <v-radio 
                                            v-for="option in question.options" 
                                            :key="option._id"
                                            :label="option.label" 
                                            :value="option._id"
                                            :disabled="true"
                                        ></v-radio>
                                    </v-radio-group>
                                </div>

                                <!-- Checkbox Response -->
                                <div v-if="question.questionType === 'check-boxes'" class="mb-6">
                                    <v-checkbox
                                        v-for="option in question.options"
                                        :key="option._id"
                                        :label="option.label"
                                        :input-value="isOptionSelected(question.response, option)"
                                        readonly
                                        disabled
                                        hide-details
                                        class="mb-2"
                                    ></v-checkbox>
                                </div>

                                <div v-if="question.questionType === 'digital-signature'"
                                    class="upload-section d-flex align-center justify-space-between">
                                    <div class="d-flex flex-column">
                                        <div class="upload-label mb-2">{{ $t('esgPlatform.uploadedDocument')}}</div>
                                        <template v-if="Array.isArray(question.response) && question?.response?.length">
                                            <div v-for="(file, index) in question?.response" :key="index"
                                                class="pdf-container"
                                                style="background-color: #e8f5e9; width: fit-content; padding: 16px; border-radius: 4px;">
                                                <div class="d-flex align-center justify-end">
                                                    <v-icon color="green darken-1" small
                                                        @click="handleFilePreview(file)">
                                                        mdi-download
                                                    </v-icon>
                                                </div>
                                                <div class="green--text text--darken-1 mt-1">
                                                    {{ getFileType(file) }}
                                                </div>
                                                <div class="caption mt-1">{{ file?.fileName || getFileNameFromKey(file) || 'Signature' }}</div>
                                            </div>
                                        </template>
                                        <template v-else-if="question.response || Object.keys(question.response).length">
                                            <div class="pdf-container"
                                                style="background-color: #e8f5e9; width: fit-content; padding: 16px; border-radius: 4px;">
                                                <div class="d-flex align-center justify-end">
                                                    <v-icon color="green darken-1" small
                                                        @click="handleFilePreview(question?.response?.value)">
                                                        mdi-download
                                                    </v-icon>
                                                </div>
                                                <div class="green--text text--darken-1 mt-1">
                                                    {{ getFileType(question?.response?.value) }}
                                                </div>
                                                <div class="caption mt-1">{{ question?.response?.value?.fileName || getFileNameFromKey(question?.response?.value) || 'Signature' }}</div>
                                            </div>
                                        </template>
                                        <template v-else class="caption grey--text">
                                            {{ $t('esgPlatform.noFilesUploaded')}}
                                        </template>
                                    </div>
                                    <div class="caption grey--text text-right mt-2" v-if="question.response?.createdAt">
                                        {{ $t('esgPlatform.submittedOn')}}: <br /> {{ formatDate(question.response.createdAt) }}
                                    </div>
                                </div>

                                <!-- File Attachment Response -->
                                <div v-if="question.questionType === 'attach-files'"
                                    class="upload-section d-flex align-center justify-space-between">
                                    <div class="d-flex flex-column">
                                        <div class="upload-label mb-2">{{ $t('esgPlatform.uploadedDocument')}}</div>
                                        <template v-if="question.response?.value?.length">
                                            <div v-for="(file, index) in question?.response?.value" :key="index"
                                                class="pdf-container"
                                                style="background-color: #e8f5e9; width: fit-content; padding: 16px; border-radius: 4px;">
                                                <div class="d-flex align-center justify-end">
                                                    <v-icon color="green darken-1" small
                                                        @click="handleFilePreview(file)">
                                                        mdi-download
                                                    </v-icon>
                                                </div>
                                                <div class="green--text text--darken-1 mt-1">
                                                    {{ getFileType(file) }}
                                                </div>
                                                <div class="caption mt-1">{{ file?.fileName || getFileNameFromKey(file) || 'Signature' }}</div>
                                            </div>
                                        </template>
                                        <div v-else class="caption grey--text">
                                            {{ $t('esgPlatform.noFilesUploaded')}}
                                        </div>
                                    </div>
                                    <div class="caption grey--text text-right mt-2" v-if="question.response?.createdAt">
                                        {{ $t('esgPlatform.submittedOn')}}: <br /> {{ formatDate(question.response.createdAt) }}
                                    </div>
                                </div>

                                <!-- Get Data Response -->
                                <div v-if="question.questionType === 'get-data' && question?.getDataQuestions?.length"
                                    class="get-data-section mb-6">
                                    <div class="font-weight-medium mb-2">{{ $t('esgPlatform.getData')}}:</div>
                                    <v-row>
                                        <v-col v-for="dataQ in question.getDataQuestions" :key="dataQ._id" cols="6">
                                            <div class="caption grey--text">{{ dataQ.title }}:</div>
                                            <template v-if="dataQ.dataType === 'attach-file' || dataQ.dataType === 'digital-signature'">


                                                <div v-for="(file, index) in getDataResponseValue(dataQ, question.response)" :key="index" class="pdf-container" style="background-color: #e8f5e9; width: fit-content; padding: 16px; border-radius: 4px;">
                                                    <div class="d-flex align-center justify-end">
                                                        <v-icon color="green darken-1" small
                                                            @click="handleFilePreview(file)">
                                                            mdi-download
                                                        </v-icon>
                                                    </div>
                                                    <div class="green--text text--darken-1 mt-1">
                                                        {{ getFileType(file?.fileName) }}
                                                    </div>
                                                    <div class="caption mt-1">{{ file?.fileName || getFileNameFromKey(file) || 'Signature' }}</div>
                                                </div>
                                            </template>
                                            <template v-else-if="dataQ.dataType === 'check-boxes'"> 
                                                <v-checkbox
                                                    v-for="(option,index11) in getDataResponseValue(dataQ, question.response)"
                                                    :key="index11"
                                                    :label="option.label"
                                                    v-model="option.completed"
                                                    readonly
                                                    disabled
                                                    hide-details
                                                    class="mb-2"
                                                ></v-checkbox>
                                            </template>
                                            <template v-else-if="dataQ.dataType === 'radio-button'">
                                                <div>
                                                    <v-radio-group :value="getDataResponseValue(dataQ, question.response)?.value" readonly>
                                                        <v-radio 
                                                            v-for="(option, ke) in getDataResponseValue(dataQ, question.response)?.options" 
                                                            :key="ke"
                                                            :label="option" 
                                                            :value="option"
                                                            :disabled="true"
                                                        ></v-radio>
                                                    </v-radio-group>
                                                    
                                                </div>
                                            </template>
                                            <template v-else>
                                                <div>{{ getDataResponseValue(dataQ, question.response) }}</div>
                                            </template>
                                        </v-col>
                                    </v-row>
                                </div>

                                <!-- Recommendations -->

                                <!-- Action Plans -->
                                <div class="action-plan-section" v-if="hasActionPlans(question)">
                                    <div class="font-weight-medium mb-2">{{ $t('esgPlatform.actionPlan')}}:</div>
                                    <v-list dense class="pa-0">
                                        <v-list-item v-for="plan in getActionPlans(question)" :key="plan._id"
                                            class="px-0">
                                            <v-list-item-action class="mr-3">
                                                <v-checkbox 
                                                    v-model="plan.completed"
                                                    color="success" 
                                                    dense 
                                                    hide-details 
                                                    readonly
                                                    disabled
                                                ></v-checkbox>
                                            </v-list-item-action>
                                            <v-list-item-content>
                                                <v-list-item-title class="body-2">
                                                    {{ plan.text }}
                                                </v-list-item-title>
                                                <v-list-item-subtitle>
                                                    <template v-if="plan?.files?.length">
                                                        <div v-for="(file,index) in plan.files" :key="index">
                                                             {{ file?.fileName || getFileNameFromKey(file) || 'Signature' }}
                                                            <v-icon small color="green darken-1" @click="handleFilePreview(file)">
                                                                mdi-download
                                                            </v-icon>
                                                        </div>
                                                    </template>
                                                </v-list-item-subtitle>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-list>
                                </div>

                                <div v-if="hasGetDataOptions(question)" class="action-plan-section">
                                    <div class="font-weight-medium mb-2 mt-5">Get Data:</div>
                                    <v-list dense class="pa-0">
                                        <v-list-item v-for="getData in getGetDataValues(question)" :key="getData._id"
                                            class="px-0">
                                            <v-list-item-content>
                                                <v-list-item-title class="body-2">
                                                    {{ getData.title || "" }}
                                                </v-list-item-title>
                                                <v-list-item-subtitle>
                                                    <template v-if="getData.dataType === 'attach-file' || getData.dataType === 'digital-signature'">    
                                                        <div v-if="Array.isArray(getData.text) && getData?.text.length">
                                                            <div v-for="(file, index) in getData.text" :key="index">
                                                                <div class="caption grey--text">{{ file?.fileName || getFileNameFromKey(file) || 'Signature' }}</div>
                                                            </div>
                                                        </div>
                                                        <div v-else-if="getData?.text && Object.keys(getData?.text).length">
                                                            <div class="pdf-container" style="background-color: #e8f5e9; width: fit-content; padding: 16px; border-radius: 4px;">
                                                                <div class="d-flex align-center justify-end">
                                                                    <v-icon color="green darken-1" small
                                                                        @click="handleFilePreview(getData?.text)">
                                                                        mdi-download
                                                                    </v-icon>
                                                                </div>
                                                                <div class="green--text text--darken-1 mt-1">
                                                                    {{ getFileType(file) }}
                                                                </div>
                                                                <div class="caption mt-1">{{ getData.text?.fileName || getFileNameFromKey(file) || 'Signature' }}</div>
                                                            </div>
                                                        </div>
                                                    </template>
                                                    <template v-else-if="getData?.dataType === 'measurement-unit'">
                                                        {{ getData?.text?.value }} {{ getData?.text?.id }}
                                                    </template>
                                                    <template v-else-if="getData?.dataType === 'check-boxes'">
                                                        <v-checkbox v-for="option in getData.text" :key="option"
                                                            v-model="truefunc"
                                                            color="success" 
                                                            :label="option"
                                                            dense 
                                                            hide-details 
                                                            readonly
                                                            disabled
                                                        ></v-checkbox>
                                                    </template>

                                                    <!-- <template v-else-if="getData?.dataType === 'radio-button'">
                                                        <v-checkbox v-for="option in getData.text" :key="option"
                                                            :value="option"
                                                            :label="option"
                                                            color="success" 
                                                            dense 
                                                            hide-details 
                                                            readonly
                                                            disabled
                                                        ></v-checkbox>
                                                    </template> -->

                                                    <template v-else>
                                                        <p class="mt-1 pa-2">{{ (Array.isArray(getData.text) && getData?.text.length)  ? getData.text.map(x => x?.key).join(",") :  getData.text }}</p>
                                                    </template>
                                                </v-list-item-subtitle>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-list>
                                </div>

                                <div v-if="question.options?.some(opt => opt.recommendation)" class="recommendations-section mb-6 mt-5">
                                    <div class="font-weight-medium mb-2">{{ $t('esgPlatform.recommendations')}}:</div>
                                    <div class="body-2">
                                        {{ getSelectedOptionRecommendation(question) }}
                                    </div>
                                </div>

                            </div>
                            <div v-else>
                                <div class="caption grey--text">
                                    No Response
                                </div>
                            </div>
                        </div>
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import EsgService from "@/_services/EsgService";
import loadingMixin from "@/mixins/LoadingMixin";
import moment from "moment";
//import S3UploadService from "@/_services/S3UploadService";
export default {
    name: 'WaterConsumptionReport',
    mixins: [loadingMixin],

    data() {
        return {
            truefunc: true,
            goalId: this.$route.params.goalId,
            protocolId: this.$route.query.protocolId,
            organizationId: this.$route.query.organizationId,
            surveyData: {
                goal: {},
                responses: []
            },
            // Track current response being viewed
            currentResponseIndex: 0,
            // Track current month for month navigation
            currentMonth: new Date(),
            breadcrumbs: [
                {
                    text: this.$t("esgPlatform.esgPlatform"),
                    disabled: false,
                    to: { name: "esgAccountDashboard" },
                },
                {
                    text: this.$t("esgPlatform.surveyResponseText"),
                    link: true,
                    exact: true,
                    disabled: true,
                },
            ],
            actionItems: [
                {
                    text: 'Evaluate current farming or operational practices to understand areas of improvement.',
                    completed: true
                },
                {
                    text: 'Identify potential environmental impacts (soil health, water use, chemical input) and set baseline metrics.',
                    completed: true
                },
                {
                    text: 'Explore sustainable practices that align with your crops or products, such as crop rotation, organic fertilizers, water-efficient irrigation, or integrated pest management (IPM).',
                    completed: false
                },
                {
                    text: 'Monitor results and refine approaches before scaling up.',
                    completed: false
                },
                {
                    text: 'Track the impacts of any new practices on productivity, costs, and environmental impact.',
                    completed: false
                }
            ]
        }
    },
    computed: {
        getSubmittedBy(){
            return (this.surveyData?.submittedUser?.firstName || this.surveyData?.submittedUser?.lastName) ? `${this.surveyData?.submittedUser?.firstName} ${this.surveyData?.submittedUser?.lastName}` : this.surveyData?.submittedUser?.email;
        },
        formattedMonth() {
            return new Intl.DateTimeFormat('en-US', {
                month: 'long',
                year: 'numeric'
            }).format(this.currentMonth);
        },

        getFlatQuestions() {
            return this.surveyData?.responses?.flatMap(x => x?.assessmentQuestions || [])
        },

        getLatestSubmittedDate(){
            const d = [...this.getFlatQuestions].sort((a, b) => 
                        new Date(b?.submittedDate) - new Date(a?.submittedDate)
                    )[0]?.submittedDate || null;
            return d ? new Date(d).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }) : ''
        },
        // Calculate total responses and completed responses
        responseStats() {
            return {
                completed: this.getFlatQuestions?.filter(x => x.response)?.length,
                total: this.getFlatQuestions?.length
            }
        },
    },

    mounted() {
        this.getSurveyResponseByGoalId();
    },

    methods: {
        formatDate(dateString) {
            if (!dateString) return '';
            return moment(dateString).format("DD-MMM-YYYY h:mm a");
        },

        goBack() {
            this.$router.push({ name: 'ProgressByGoals', params: { id: this.protocolId } });
        },

        async getSurveyResponseByGoalId() {
            console.log("organizationId", this.organizationId)
            try {
                this.startLoading();
                const payload = {
                    goalId: this.goalId,
                    protocolId: this.protocolId,
                    subOrganizationId: this.organizationId
                };
                const response = await EsgService.getSurveyResponseByGoalId(payload);
                if (response.success) {
                    this.surveyData = response.data;
                    console.log('Survey Data:', this.surveyData);
                }
            } catch (error) {
                console.error('Error fetching survey response:', error);
            } finally {
                this.stopLoading();
            }
        },

        // Month navigation methods
        previousMonth() {
            this.currentMonth = new Date(this.currentMonth.setMonth(this.currentMonth.getMonth() - 1));
        },

        nextMonth() {
            this.currentMonth = new Date(this.currentMonth.setMonth(this.currentMonth.getMonth() + 1));
        },

        // Handle file download
        handleFileDownload(fileUrl) {
            // Implement file download logic
            window.open(fileUrl, '_blank');
        },

        // Handle file deletion
        async handleFileDelete(fileId) {
            // Implement file deletion logic
            try {
                // Add your file deletion API call here
                console.log('Deleting file:', fileId);
            } catch (error) {
                console.error('Error deleting file:', error);
            }
        },

        // Check if question has response
        hasResponse(question) {
            return question.response !== null && question.response !== undefined;
        },

        getDataResponseValue(question, responses) {
            if (!responses) return '';
            const vvl = responses.find(r => r?.id == question?._id) || ''
            switch (question.dataType) {
                case 'text-field':
                    return responses.find(r => r?.id == question._id)?.value || '';
                case 'text-area':
                    return responses.find(r => r?.id == question._id)?.value || '';
                case 'numeric':
                    return responses.find(r => r?.id == question._id)?.value || '';
                case 'measurement-unit':
                     return vvl?.value?.value + ' ' + vvl?.value?.id;
                case 'radio-button':
                    return {
                        options: question?.optionValues,
                        value: responses.find(r => r?.id == question?._id)?.value || ''
                    }
                case 'check-boxes':
                    return vvl?.value?.map(x => {
                        return {
                            label: x,
                            completed: true
                        }
                    })
                case 'attach-file':{
                    if(Array.isArray(vvl?.value) && vvl?.value?.length){
                        return vvl?.value?.map(x => {
                            return {
                                fileName: x?.fileName || this.getFileNameFromKey(x) || 'Unnamed file',
                                fileType: this.getFileType(x),
                                fileUrl: x?.fileUrl || x?.attachmentLink
                            }
                        })
                    }else if(vvl?.value && Object.keys(vvl?.value).length){
                        return [
                            {
                                fileName :vvl?.value?.fileName || this.getFileNameFromKey(vvl?.value) || 'Unnamed file',
                                fileType: this.getFileType(vvl?.value),
                                fileUrl: vvl?.value?.fileUrl || vvl?.value?.attachmentLink
                            }
                        ]
                    }
                    return [];
                }   
                case 'digital-signature':{
                    if(Array.isArray(vvl?.value) && vvl?.value?.length){
                        return vvl?.value?.map(x => {
                            return {
                                fileName: x?.fileName || this.getFileNameFromKey(x) || 'Signature',
                                fileType: this.getFileType(x),
                                fileUrl: x?.fileUrl || x?.attachmentLink
                            }
                        })
                    }else if(vvl?.value && Object.keys(vvl?.value).length){
                        return [
                            {
                                fileName :vvl?.value?.fileName || this.getFileNameFromKey(vvl?.value) || 'Signature',
                                fileType: this.getFileType(vvl?.value),
                                fileUrl: vvl?.value?.fileUrl || vvl?.value?.attachmentLink
                            }
                        ]
                    }
                    return [];
                }
                    
                default:
                    return '';
            }
        },

        // Get response value based on question type
        getResponseValue(question) {
            if (!question.response) return '';

            switch (question.questionType) {
                case 'text-field':
                case 'text-area':
                case 'numeric':
                    return question.response.value || '';
                case 'radio-button':
                    if (Array.isArray(question.response) && question.response[0]?.value) {
                        return question.response[0].value.label || '';
                    }
                    return '';
                case 'check-boxes':
                    if (Array.isArray(question.response)) {
                        return question.response
                            .map(r => r.value?.label)
                            .filter(Boolean)
                            .join(', ');
                    }
                    return '';
                default:
                    return '';
            }
        },

        // Implement the new methods
        isOptionSelected(response, option) {
            if (!response || !Array.isArray(response)) return false;
            
            return response.some(r => r.value?.id === option._id);
        },

        getSelectedOptionRecommendation(question) {
            if (!question.options || !question.response) return '';
            
            if(question.questionType === 'radio-button') {
                const selectedOptionId = question.response?.value?.id;
                if (!selectedOptionId) return '';
                
                const selectedOption = question.options.find(opt => opt._id === selectedOptionId);
                return selectedOption?.recommendation || '';
            }
            else if(question.questionType === 'check-boxes') {
                const selectedOptionIds = question.response?.map(r => r.value?.id);
                if (!selectedOptionIds) return '';

                const selectedOptions = question?.options?.filter(opt => selectedOptionIds.includes(opt._id));
                return selectedOptions.map(opt => opt.recommendation).join(', ');
            }
            return '';
        },

        hasGetDataOptions(question) {
            if(question.questionType === 'radio-button' && question?.response?.getDataResponses) {
                return true;
            }else if(question.questionType === 'check-boxes' && question?.response?.length) {
                return question?.response?.filter(x => x?.getDataResponses?.length).length > 0;
            }
            return false;
        },

        getGetDataValues(question) {
            if(question.questionType === 'radio-button' && question?.response?.getDataResponses) {
                return question?.response?.getDataResponses.map(r => ({
                    text: r.value,
                    title: r.title,
                    completed: true,
                    dataType: r?.dataType
                }));
            }else if(question.questionType === 'check-boxes' && question?.response?.length) {
                return question?.response?.flatMap(r => 
                    (r.getDataResponses || []).map(d => ({
                        text: d.value,
                        title: d.title,
                        completed: true,
                        dataType: d?.dataType
                    }))
                );
            }
            return [];
        },

        hasActionPlans(question) {
            if(question.questionType === 'radio-button' && question?.response?.actionPlanResponses?.length) {
                return true;
            }else if(question.questionType === 'check-boxes' && question?.response?.length) {
                return question?.response?.filter(x => x?.actionPlanResponses?.length).length > 0;
            }
            return false;
        },

        getActionPlans(question) {
            if(question.questionType === 'radio-button' && question?.response?.actionPlanResponses?.length) {
                return question?.response?.actionPlanResponses.map(r => ({
                    text: r.title,
                    completed: true,
                    files: r?.files
                }));
            }else if(question.questionType === 'check-boxes' && question?.response?.length) {
                return question?.response?.flatMap(r => 
                    (r.actionPlanResponses || []).map(d => ({
                        text: d.title,
                        completed: true,
                        files: d?.files
                    }))
                );
            }

            // if (!question?.options || !question?.getDataQuestions) return [];
            // return question.options.filter(opt => opt.recommendation).map(opt => ({
            //     text: opt.recommendation,
            //     completed: true
            // }));
        },

        getDataResponse(response, dataQId) {
            if (!response || !dataQId) return '';
            const dataQ = this.surveyData?.response?.getDataQuestions.find(q => q._id == dataQId);
            if (!dataQ) return '';
            return this.getResponseValue(response);
        },

        getFileNameFromKey(file){
            if (file?.key) {
                const nm = file.key.split('/').pop();
                return nm
            }
            if (file?.attachmentLink) {
                const nm = file.attachmentLink.split('/').pop();
                return nm
            }
            if (file?.fileUrl) {
                const nm = file.attachmentLink.split('/').pop();
                return nm
            }
            return 'Unnamed file';
        },

        // Add this new method
        getFileType(file) {
            if (!file) return 'FILE';
            if (file?.fileType) return file.fileType.toUpperCase();
            if (file?.fileName) {
                const extension = file.fileName.split('.').pop();
                return extension ? extension.toUpperCase() : 'FILE';
            }
            if (file?.key) {
                const extension = file.key.split('.').pop();
                return extension ? extension.toUpperCase() : 'FILE';
            }
            return 'FILE';
        },

        getSelectedRadioValue(question) {
            if (!question.response) return null;
            const selectedResponse = question.response;
            return selectedResponse?.value?.id || null;
        },

        getSelectedOptions(question) {
            if (!question.response || !Array.isArray(question.response)) return [];
            
            return question.response.map(r => ({
                id: r.value?.id,
                label: r.value?.label
            })).filter(opt => opt.id && opt.label);
        },

        // Add a debug method to help see what's being compared
        logCheckboxSelection(response, option) {
            console.log('Response:', response);
            console.log('Option:', option);
            console.log('Is Selected:', this.isOptionSelected(response, option));
        },

        handleFilePreview(file){
           window.open(file?.fileUrl || file?.attachmentLink || file?.s3Location, '_blank');
        }
    }
}
</script>


<style scoped>
.water-scarcity-section {
    background-color: rgb(245, 245, 245);
    padding: 16px;
}

.question-block {
    margin-bottom: 32px;
}

.farm-card {
    border: 1px solid #e0e0e0 !important;
    border-radius: 4px;
}

.pdf-container {
    display: inline-block;
}

.v-list-item {
    padding: 0;
}

.v-list-item__action {
    margin: 8px 8px 8px 0 !important;
}

.month-nav {
    border-radius: 4px;
}

.answer-section {
    background-color: #fff;
    padding: 16px;
    border-radius: 4px;
}
.v-list-item__title, .v-list-item__subtitle {
    white-space: inherit !important;
    line-height: 1.5rem !important;
}
</style>