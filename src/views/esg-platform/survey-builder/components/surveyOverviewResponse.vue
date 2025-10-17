<template>
    <div v-if="goalTitle">
        <breadcrumb :items="breadcrumbs" />
        <v-container fluid>
            <!-- Header Section -->
            <div class="d-flex mb-8 flex-column flex-sm-row">
                <div class="goal-title-container">
                    <h2 class="goal-title">{{ goalTitle || $t('esgPlatform.surveyResponse.loadingGoalTitle') }}</h2>
                </div>
                <v-spacer />
                <div class="d-flex mt-4 mt-sm-0">
                    <v-btn color="primary" outlined class="mr-2" @click="goToSurveyOverview">
                        {{ $t('cancel') }}
                    </v-btn>
                    <v-btn color="primary" dark class="mr-2"
                        @click="openConfirmBox = true; message = $t('esgPlatform.confirmSurveyResponse'); confirmAction = submitEntireSurvey">
                        {{ $t('esgPlatform.surveyResponse.submit') }}
                    </v-btn>
                </div>
            </div>

            <v-card elevation="0">
                <div class="survey-content" ref="surveyContent">
                    <!-- Question Header and Navigation -->
                    <div class="d-flex flex-column flex-sm-row align-center justify-space-between">
                        <v-col cols="12" sm="6">
                            <label class="font-weight-bold question-heading">
                                {{ currentQuestion?.questionHeading?.title || $t('esgPlatform.surveyResponse.question')
                                }}
                            </label>
                        </v-col>
                        <v-col cols="12" sm="6" class="d-flex justify-center justify-sm-end">
                            <div class="step-navigation">
                                <v-btn icon @click="goToPreviousStep" class="arrow-button"
                                    :disabled="currentStep === 1">
                                    <v-icon :color="currentStep === 1 ? 'grey' : '#FFFFFF'">mdi-chevron-left</v-icon>
                                </v-btn>
                                <label class="ml-1">{{ $t('esgPlatform.surveyResponse.step') }}</label>
                                <div class="step-badge">{{ currentStep }}</div>
                                <label class="mr-1">{{ $t('esgPlatform.surveyResponse.of') }} {{ totalSteps }}</label>
                                <v-btn icon @click="goToNextStep" class="arrow-button"
                                    :disabled="currentStep === totalSteps">
                                    <v-icon
                                        :color="currentStep === totalSteps ? 'grey' : '#FFFFFF'">mdi-chevron-right</v-icon>
                                </v-btn>
                            </div>
                        </v-col>
                    </div>

                    <!-- Progress Bar (current heading's questions) -->
                    <v-row class="mt-4">
                        <div class="progress-bar-container">
                            <div class="progress-bar">
                                <template v-for="(step, index) in progressSteps">
                                    <div v-if="index < progressSteps.length" :key="'line-' + index" :class="['step-line', {
                                        completed: step.completed,
                                        active: step.active
                                    }]" />
                                </template>
                            </div>
                        </div>
                    </v-row>

                    <!-- Survey Question -->
                    <v-row class="mt-6">
                        <v-form ref="surveyForm" v-model="formValid" class="survey-question">
                            <p class="font-weight-bold">
                                {{ $t('esgPlatform.surveyResponse.questionOf', {
                                    current: currentQuestionNumber,
                                    total: totalQuestionsInHeading
                                })
                                }}
                            </p>
                            <p class="question-text">{{ currentQuestion?.title }}</p>

                            <p v-if="currentQuestion?.additionalSetting?.description" class="question-description"
                                v-html="currentQuestion.additionalSetting.description">
                            </p>

                            <!-- Question Inputs -->
                            <!-- Text Field -->
                            <v-text-field v-if="currentQuestion?.questionType === 'text-field'"
                                v-model="currentQuestion.response" outlined dense
                                :rules="currentQuestion.isMandatory ? [v => !!v || $t('esgPlatform.surveyResponse.fieldRequired')] : []" />

                            <!-- Text Area -->
                            <v-textarea v-if="currentQuestion?.questionType === 'text-area'"
                                v-model="currentQuestion.response" outlined auto-grow rows="3"
                                :rules="currentQuestion.isMandatory ? [v => !!v || $t('esgPlatform.surveyResponse.fieldRequired')] : []" />

                            <!-- Numeric Field -->
                            <v-text-field v-if="currentQuestion?.questionType === 'numeric'"
                                v-model.number="currentQuestion.response" type="number" outlined dense
                                :rules="currentQuestion.isMandatory ? [v => !!v || $t('esgPlatform.surveyResponse.fieldRequired')] : []" />

                            <!-- Radio Button (Optimized) -->
                            <v-radio-group v-if="currentQuestion?.questionType === 'radio-button'" v-model="radioModel"
                                :rules="currentQuestion.isMandatory ? [v => !!v || $t('esgPlatform.surveyResponse.fieldRequired')] : []"
                                @change="onRadioChange">
                                <v-radio v-for="option in currentQuestion?.options || []" :key="option._id"
                                    :label="option.label" :value="option._id" />
                            </v-radio-group>
                            <template v-if="currentQuestion?.questionType === 'radio-button' && selectedRadioOption">
                                <!-- Get Data Questions -->
                                <get-data-questions v-if="selectedRadioOption.isGetDataEnabled"
                                    :questions="selectedRadioOption.getDataQuestions" :responses="getDataResponseValue"
                                    :unit-type-list="unitTypeList" :unit-meta="unitMeta"
                                    @update-response="updateGetDataResponse" @file-change="handleGetDataFileChange"
                                    @remove-file="removeGetDataFile" @open-signature="openSignatureDialog"
                                    @remove-signature="removeSignature" />

                                <!-- Action Plans -->
                                <action-plans v-if="selectedRadioOption.isActionPlanEnabled"
                                    :plans="currentQuestion?.options?.filter(option => option._id === selectedRadioOption._id)[0]?.actionPlans"
                                    @file-change="handleActionPlanFileChange"
                                    
                                    @remove-file="handleActionPlanFileRemove" />


                                <!-- Recommendations -->
                                <v-card
                                    v-if="selectedRadioOption.isRecommendationEnabled && selectedRadioOption.recommendation"
                                    outlined class="pa-4 mt-4">
                                    <h4 class="mb-3">{{ $t('esgPlatform.surveyResponse.recommendations') }}</h4>
                                    <v-card-text class="recommendation-text">
                                        {{ selectedRadioOption.recommendation }}
                                    </v-card-text>
                                </v-card>
                            </template>

                            <!-- Checkbox -->
                            <template v-if="currentQuestion?.questionType === 'check-boxes'">
                                <div v-for="option in currentQuestion?.options || []" :key="option._id"
                                    class="option-container">
                                    <v-checkbox v-model="option.selected" :label="option.label"
                                        @change="handleCheckboxChange(option)"
                                        :rules="currentQuestion.isMandatory ? [v => (currentQuestion.response?.length > 0) || $t('esgPlatform.surveyResponse.fieldRequired')] : []" />

                                    <!-- Get Data Questions for checkbox -->
                                    <get-data-questions v-if="isOptionSelected(option) && option.isGetDataEnabled"
                                        :questions="option.getDataQuestions"
                                        :responses="getCheckboxOptionGetDataResponses(option)"
                                        :unit-type-list="unitTypeList" :unit-meta="unitMeta"
                                        @update-response="updateGetDataResponse" @file-change="handleGetDataFileChange"
                                        @remove-file="removeGetDataFile" @open-signature="openSignatureDialog"
                                        @remove-signature="removeSignature"
                                        @checkbox-change="handleGetDataCheckboxChange"
                                        class="ml-4 mt-2 option-details" />

                                    <!-- Action Plans for checkbox -->
                                    <action-plans v-if="isOptionSelected(option) && option.isActionPlanEnabled"
                                        :plans="option.actionPlans" @file-change="handleActionPlanFileChange"
                                        @remove-file="handleActionPlanFileRemove" class="ml-4 mt-2 option-details" />
                                </div>
                            </template>

                            <!-- Date Field -->
                            <v-text-field v-if="currentQuestion?.questionType === 'date'"
                                v-model="currentQuestion.response" type="date"
                                :label="$t('esgPlatform.surveyResponse.enterYourAnswer')" outlined dense
                                :rules="currentQuestion.isMandatory ? [v => !!v || $t('esgPlatform.surveyResponse.fieldRequired')] : []" />

                            <!-- Digital Signature for Normal Questions -->
                            <template v-if="currentQuestion?.questionType === 'digital-signature'">
                                <div class="signature-section mt-4">
                                    <v-btn color="primary" @click="openSignatureDialog(currentQuestion)" class="ml-2">
                                        Add Signature
                                    </v-btn>
                                    <div v-if="currentQuestion.response?.value?.key || currentQuestion.response?.value?.s3key"
                                        class="mt-2">
                                        <img :src="currentQuestion.response?.value?.attachmentLink" alt="Signature"
                                            style="max-width: 200px;" />
                                        <v-btn icon @click="removeSignature(currentQuestion)" class="ml-2">
                                            <v-icon>mdi-trash-can-outline</v-icon>
                                        </v-btn>
                                    </div>
                                </div>
                            </template>

                            <!-- Attach Files -->
                            <template v-if="currentQuestion.questionType === 'attach-files'">
                                <div class="file-upload-section mt-4">
                                    <v-row>
                                        <v-col cols="12" sm="6">
                                            <div class="upload-document">
                                                <div :class="['dropZone', { 'dropZone-over': dragging }]"
                                                    @dragenter="dragging = true" @dragleave="dragging = false"
                                                    @drop="handleQuestionDrop($event, currentQuestion)">
                                                    <div class="dropZone-info d-flex justify-center align-center"
                                                        @dragover.prevent>
                                                        <v-icon size="50" color="#0057BD">mdi-tray-arrow-up</v-icon>
                                                        <div class="dropZone-upload-limit-info">
                                                            <h2 class="ml-4 blue-color underline">Select File</h2>
                                                            <p class="gray-color">Drag & Drop files here</p>
                                                        </div>
                                                    </div>
                                                    <input type="file" 
                                                        :multiple="currentQuestion.additionalSetting?.allowMultipleAttachments"
                                                        :accept="getFileAcceptTypes(currentQuestion.additionalSetting?.allowedFileTypes)"
                                                        @change="onQuestionFileChange($event, currentQuestion)" />
                                                </div>
                                            </div>
                                            <template v-if="currentQuestion?.uploadedFiles?.length">
                                                <div class="pdf-docs mt-10 d-flex flex-column flex-sm-row"
                                                    v-for="(doc, index) in currentQuestion?.uploadedFiles" :key="index">
                                                    <div class="docs-box mr-4 mb-4 mb-sm-0">
                                                        <div class="docs-preview">
                                                            <div class="img-item">
                                                                <div class="pdf-box">
                                                                    <h1 class="file-extension">
                                                                        {{ getFileExtension(doc) }}
                                                                    </h1>
                                                                </div>
                                                                <span class="file-name">
                                                                    {{ getFileName(doc) }}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="text-box mr-8"
                                                        v-if="currentQuestion.additionalSetting?.allowComments">
                                                        <v-textarea v-model="doc.comment" rows="3.5" auto-grow
                                                            placeholder="Comments" outlined
                                                            :disabled="doc.isUploading" />
                                                    </div>
                                                    <div class="remove-file-btn" v-if="currentQuestion.additionalSetting?.allowMultipleAttachments">
                                                        <v-btn icon small color="error" @click="removeAttachFile(index, currentQuestion)">
                                                            <v-icon>mdi-trash-can-outline</v-icon>
                                                        </v-btn>
                                                    </div>
                                                </div>
                                            </template>
                                            <template
                                                v-if="!currentQuestion?.uploadedFiles?.length && currentQuestion?.response?.value?.length">
                                                <div class="pdf-docs mt-10 d-flex flex-column flex-sm-row"
                                                    v-for="(doc, index) in currentQuestion?.response?.value"
                                                    :key="index">
                                                    <div class="docs-box mr-4 mb-4 mb-sm-0">
                                                        <div class="docs-preview">
                                                            <div class="img-item">
                                                                <div class="pdf-box">
                                                                    <h1 class="file-extension">
                                                                        {{ getFileExtension(doc) }}
                                                                    </h1>
                                                                </div>
                                                                <span class="file-name">
                                                                    {{ getFileName(doc) }}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="text-box mr-8"
                                                        v-if="currentQuestion.additionalSetting?.allowComments">
                                                        <v-textarea v-model="doc.comment" rows="3.5" auto-grow
                                                            placeholder="Comments" outlined
                                                            :disabled="doc.isUploading" />
                                                    </div>
                                                    <div class="remove-file-btn" v-if="currentQuestion.additionalSetting?.allowMultipleAttachments">
                                                        <v-btn icon small color="error" @click="removeAttachFile(index, currentQuestion, 'response')">
                                                            <v-icon>mdi-trash-can-outline</v-icon>
                                                        </v-btn>
                                                    </div>
                                                </div>
                                            </template>
                                        </v-col>
                                    </v-row>
                                </div>
                            </template>

                            <!-- Get-Data Questions -->
                            <template
                                v-if="currentQuestion.questionType === 'get-data' && currentQuestion?.getDataQuestions?.length > 0">
                                <div class="mt-4">
                                    <div v-for="getDataQuestion in currentQuestion.getDataQuestions"
                                        :key="getDataQuestion._id" class="mt-2">
                                        <div class="d-flex align-center">
                                            <p class="text-subtitle-2">{{ getDataQuestion.title }}</p>

                                            <v-tooltip v-if="getDataQuestion.helpText && getDataQuestion.helpEnabled"
                                                right color="00BD73" max-width="500">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-icon class="icon-with-background pl-2 mb-4" style="color:#0EBF67"
                                                        v-bind="attrs" v-on="on">
                                                        mdi-alert-circle
                                                    </v-icon>
                                                </template>
                                                <p class="text-caption mb-2">
                                                    {{ getDataQuestion.helpText }}
                                                </p>
                                            </v-tooltip>
                                        </div>

                                        <!-- File Upload for Get-Data -->
                                        <template v-if="getDataQuestion.dataType === 'attach-file'">
                                            <div class="file-upload-section">
                                                <v-row>
                                                    <v-col cols="12" sm="6" class="mb-10">
                                                        <div class="upload-document">
                                                            <div :class="['dropZone', { 'dropZone-over': dragging }]"
                                                                @dragenter="dragging = true"
                                                                @dragleave="dragging = false"
                                                                @drop="handleGetDataDrop($event, getDataQuestion)">
                                                                <div class="dropZone-info d-flex justify-center align-center"
                                                                    @dragover.prevent>
                                                                    <v-icon size="50"
                                                                        color="#0057BD">mdi-tray-arrow-up</v-icon>
                                                                    <div class="dropZone-upload-limit-info">
                                                                        <h2 class=" ml-4 blue-color underline">
                                                                            {{
                                                                                $t('esgPlatform.surveyResponse.selectFile')
                                                                            }}</h2>
                                                                        <p class="gray-color">
                                                                            {{ $t('esgPlatform.surveyResponse.dragDrop')
                                                                            }}</p>
                                                                    </div>
                                                                </div>
                                                                <input type="file" multiple
                                                                    :accept="getFileAcceptTypes(getDataQuestion.allowedTypes)"
                                                                    @change="onGetDataFileChange($event, getDataQuestion)" />
                                                            </div>
                                                        </div>
                                                        <div class="pdf-docs mt-10 d-flex flex-column flex-sm-row"
                                                            v-for="(doc, index) in currentQuestionResponse(getDataQuestion)"
                                                            :key="index">
                                                            <div class="docs-box mr-4 mb-4 mb-sm-0">
                                                                <div class="docs-preview">
                                                                    <div class="img-item">
                                                                        <div class="pdf-box">
                                                                            <v-icon class="delete-icon"
                                                                                @click="removeGetDataFile(index, getDataQuestion)">
                                                                                mdi-trash-can-outline
                                                                            </v-icon>
                                                                            <h1 class="file-extension">
                                                                                {{ getFileExtension(doc) }}
                                                                            </h1>
                                                                        </div>
                                                                        <span class="file-name">{{ getFileName(doc)}}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div v-if="getDataQuestion.isMandatory && fileErrors[getDataQuestion._id]"
                                                            class="red--text text-caption mt-2">
                                                            {{ fileErrors[getDataQuestion._id] }}
                                                        </div>
                                                    </v-col>
                                                </v-row>
                                            </div>
                                        </template>

                                        <!-- Digital Signature for Get-Data Questions -->
                                        <template v-if="getDataQuestion.dataType === 'digital-signature'">
                                            <div class="signature-section">
                                                <v-btn color="primary" @click="openSignatureDialog(getDataQuestion)"
                                                    class="ml-2">
                                                    Add Signature
                                                </v-btn>
                                                <div v-if="currentQuestionResponse(getDataQuestion) && currentQuestionResponse(getDataQuestion)?.key"
                                                    class="mt-2">
                                                    <img :src="currentQuestionResponse(getDataQuestion).attachmentLink"
                                                        alt="Signature" style="max-width: 200px;" />
                                                    <v-btn icon @click="removeSignature(getDataQuestion)" class="ml-2">
                                                        <v-icon>mdi-trash-can-outline</v-icon>
                                                    </v-btn>
                                                </div>

                                                <div v-if="getDataQuestion.isMandatory && signatureErrors[getDataQuestion._id]"
                                                    class="red--text text-caption mt-2">
                                                    {{ signatureErrors[getDataQuestion._id] }}
                                                </div>
                                            </div>
                                        </template>

                                        <!-- Measurement Unit -->
                                        <template v-if="getDataQuestion.dataType === 'measurement-unit'">
                                            <div class="d-flex align-center">
                                                <v-text-field :placeholder="$t('esgPlatform.dashboard.enterHere')"
                                                    :value="getMeasurementValue(getDataQuestion)"
                                                    @input="val => updateMeasurementResponse(getDataQuestion, val, getMeasurementUnit(getDataQuestion))"
                                                    type="number" outlined dense class="mr-2"
                                                    :rules="getDataQuestion.isMandatory ? [v => !!v || $t('esgPlatform.surveyResponse.fieldRequired')] : []"
                                                    style="max-width:300px" />

                                                <v-select
                                                    :disabled="!getDataQuestion.additionalSettings?.allowUnitChange"
                                                    :items="Object.keys(unitTypeList)"
                                                    :value="getMeasurementUnitType(getDataQuestion)"
                                                    @change="type => onUnitTypeChange(getDataQuestion, type)"
                                                    label="Unit Type" outlined dense class="mr-2"
                                                    style="max-width: 120px" />

                                                <v-select
                                                    :disabled="!getDataQuestion.additionalSettings?.allowUnitChange"
                                                    :items="unitTypeList[getMeasurementUnitType(getDataQuestion)] || []"
                                                    :value="getMeasurementUnit(getDataQuestion)"
                                                    @change="unit => onUnitChange(getDataQuestion, unit)" label="Unit"
                                                    outlined dense style="max-width: 100px" />
                                            </div>
                                        </template>

                                        <!-- Text Area -->
                                        <v-textarea v-if="getDataQuestion.dataType === 'text-area'"
                                            :placeholder="$t('esgPlatform.dashboard.enterHere')"
                                            :value="currentQuestionResponse(getDataQuestion)" @input="val => updateGetDataResponse({
                                                questionId: getDataQuestion._id,
                                                value: val,
                                                dataType: getDataQuestion.dataType
                                            })" outlined auto-grow rows="2"
                                            :rules="getDataQuestion.isMandatory ? [v => !!v || $t('esgPlatform.surveyResponse.fieldRequired')] : []" />

                                        <!-- Text Field -->
                                        <v-text-field :placeholder="$t('esgPlatform.dashboard.enterHere')"
                                            v-if="getDataQuestion.dataType === 'text-field'"
                                            :value="currentQuestionResponse(getDataQuestion)" @input="val => updateGetDataResponse({
                                                questionId: getDataQuestion._id,
                                                value: val,
                                                dataType: getDataQuestion.dataType
                                            })" outlined dense
                                            :rules="getDataQuestion.isMandatory ? [v => !!v || $t('esgPlatform.surveyResponse.fieldRequired')] : []" />

                                        <!-- Numeric Field -->
                                        <v-text-field v-if="getDataQuestion.dataType === 'numeric'" outlined dense
                                            :value="currentQuestionResponse(getDataQuestion)" @input="val => updateGetDataResponse({
                                                questionId: getDataQuestion._id,
                                                value: val,
                                                dataType: getDataQuestion.dataType
                                            })" type="number"
                                            :rules="getDataQuestion.isMandatory ? [v => !!v || $t('esgPlatform.surveyResponse.fieldRequired')] : []" />

                                        <!-- Date Field -->
                                        <v-text-field v-if="getDataQuestion.dataType === 'date'"
                                            :value="currentQuestionResponse(getDataQuestion)" @input="val => updateGetDataResponse({
                                                questionId: getDataQuestion._id,
                                                value: val,
                                                dataType: getDataQuestion.dataType
                                            })" type="date" outlined dense
                                            :rules="getDataQuestion.isMandatory ? [v => !!v || $t('esgPlatform.surveyResponse.fieldRequired')] : []" />

                                        <!-- Radio Field -->
                                        <v-radio-group v-if="getDataQuestion.dataType === 'radio-button'"
                                            :value="currentQuestionResponse(getDataQuestion)" @change="val => updateGetDataResponse({
                                                questionId: getDataQuestion._id,
                                                value: val,
                                                dataType: getDataQuestion.dataType
                                            })"
                                            :rules="getDataQuestion.isMandatory ? [v => !!v || $t('esgPlatform.surveyResponse.fieldRequired')] : []">
                                            <v-radio
                                                v-for="(option, index) in getDataQuestion.options || getDataQuestion.optionValues"
                                                :key="option.value || option._id || index"
                                                :label="option.label || option" :value="option.value || option" />
                                        </v-radio-group>

                                        <!-- checkbox field -->
                                        <div v-if="getDataQuestion.dataType === 'check-boxes'">
                                            <v-checkbox
                                                v-for="(option, index) in getDataQuestion.options || getDataQuestion.optionValues"
                                                :key="option.value || option._id || index"
                                                :label="option.label || option" :value="option.value || option"
                                                :input-value="currentQuestionResponse(getDataQuestion) || []" @change="val => {
                                                    let arr = currentQuestionResponse(getDataQuestion) ? [...currentQuestionResponse(getDataQuestion)] : [];
                                                    if (val) {
                                                        if (!arr.includes(option.value || option)) arr.push(option.value || option);
                                                    } else {
                                                        arr = arr.filter(v => v !== (option.value || option));
                                                    }
                                                    updateGetDataResponse({
                                                        questionId: getDataQuestion._id,
                                                        value: arr,
                                                        dataType: getDataQuestion.dataType
                                                    });
                                                }" />
                                        </div>

                                    </div>
                                </div>
                            </template>

                            <!-- Action Plans -->
                            <!-- <template
                                v-if="currentQuestion?.questionType === 'radio-button' && currentQuestion.response">
                                <div class="mt-4" v-if="showActionPlans">
                                    <p class="font-weight-bold">{{ $t('esgPlatform.surveyResponse.actionPlans') }}</p>
                                    <div v-for="actionPlan in selectedActionPlans" :key="actionPlan._id" class="mt-2">
                                        <p class="text-subtitle-2">{{ actionPlan.title }}</p>
                                        <template v-if="actionPlan.isFileRequired">
                                            <div class="file-upload-section">
                                                <v-row>
                                                    <v-col cols="12" sm="6" class="mb-10">
                                                        <h3 class="mb-7">{{
                                                            $t('esgPlatform.surveyResponse.uploadEvidence') }}</h3>
                                                        <div class="upload-document">
                                                            <div :class="['dropZone', { 'dropZone-over': dragging }]"
                                                                @dragenter="dragging = true"
                                                                @dragleave="dragging = false"
                                                                @drop="handleDrop($event, actionPlan)">
                                                                <div class="dropZone-info d-flex justify-center align-center"
                                                                    @dragover.prevent>
                                                                    <v-icon size="50"
                                                                        color="#0057BD">mdi-tray-arrow-up</v-icon>
                                                                    <div class="dropZone-upload-limit-info">
                                                                        <h2 class=" ml-4 blue-color underline">{{
                                                                            $t('esgPlatform.surveyResponse.selectFile')
                                                                            }}
                                                                        </h2>
                                                                        <p class="gray-color">{{
                                                                            $t('esgPlatform.surveyResponse.dragDrop') }}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <input type="file" multiple
                                                                    :accept="getFileAcceptTypes(actionPlan.allowedTypes)"
                                                                    @change="onFileChange($event, actionPlan)" />
                                                            </div>
                                                        </div>
                                                        <div class="pdf-docs mt-10 d-flex flex-column flex-sm-row"
                                                            v-for="(doc, index) in actionPlan.uploadedFiles"
                                                            :key="index">
                                                            <div class="docs-box mr-4 mb-4 mb-sm-0">
                                                                <div class="docs-preview">
                                                                    <div class="img-item">
                                                                        <div class="pdf-box">
                                                                            <v-icon class="delete-icon"
                                                                                @click="removeFile(index, actionPlan)">
                                                                                mdi-trash-can-outline
                                                                            </v-icon>
                                                                            <h1 class="file-extension">
                                                                                {{ getFileExtension(doc) }}
                                                                            </h1>
                                                                        </div>
                                                                        <span class="file-name">{{ getFileName(doc)
                                                                            }}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="text-box mr-8">
                                                                <v-textarea v-model="doc.comment" rows="3.5" auto-grow
                                                                    placeholder="Comments" outlined />
                                                            </div>
                                                        </div>
                                                    </v-col>
                                                </v-row>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                            </template> -->

                        </v-form>
                    </v-row>

                    <!-- Bottom Navigation -->
                    <v-row class="mt-6 justify-center flex-column flex-sm-row">
                        <v-btn :color="canGoToPreviousQuestion ? 'primary' : 'grey lighten-2'"
                            :dark="canGoToPreviousQuestion" class="ma-2 navigation-btn"
                            :disabled="!canGoToPreviousQuestion" @click="goToPreviousQuestion">
                            {{ $t('esgPlatform.surveyResponse.previous') }}
                        </v-btn>
                        <v-btn color="primary" dark class="ma-2 navigation-btn" @click="skipStep">
                            {{ $t('esgPlatform.surveyResponse.skip') }}
                        </v-btn>
                        <v-btn color="primary" dark class="ma-2 navigation-btn" @click="submitSurvey">
                            {{ $t('esgPlatform.surveyResponse.submit') }}
                        </v-btn>
                        <v-btn :color="canGoToNextQuestion ? 'primary' : 'grey lighten-2'" :dark="canGoToNextQuestion"
                            class="ma-2 navigation-btn" :disabled="!canGoToNextQuestion" @click="goToNextQuestion">
                            {{ $t('esgPlatform.surveyResponse.next') }}
                        </v-btn>
                    </v-row>
                </div>
            </v-card>
        </v-container>
        <ConfirmBox :dialog="openConfirmBox" @cancel:action="openConfirmBox = false" @continue:action="handleConfirm"
            :message="message" :confirmBtnText="$t('confirm')" :cancelBtnText="$t('cancel')" />
        <SignatureDialog v-if="showSignatureDialog" :value="showSignatureDialog" @input="showSignatureDialog = $event"
            :options="signatureOptions" @signature="handleSignature" />
    </div>
</template>

<script>
import ConfirmBox from '../../standards/components/confirmationDialog.vue';
import loadingMixin from '@/mixins/LoadingMixin';
import EsgService from '@/_services/EsgService';
import S3UploadService from '@/_services/S3UploadService';
import SignatureDialog from '../components/SignatureModal.vue';
import GetDataQuestions from './GetDataQuestions.vue';
import ActionPlans from './ActionPlans.vue';

export default {
    name: 'SurveyOverview',
    components: { ConfirmBox, SignatureDialog, GetDataQuestions, ActionPlans },
    mixins: [loadingMixin],

    data() {
        return {
            isLoading: false,
            openConfirmBox: false,
            message: '',
            confirmAction: null,
            goalTitle: '',
            breadcrumbs: [
                { text: this.$t('esgPlatform.esgCompliance'), link: true, exact: true, disabled: true },
                { text: this.$t('dashboard'), disabled: false, to: { name: 'eudrDashboard' } },
            ],
            currentQuestionIndex: 0,
            rawQuestions: [],
            esgProtocolId: null,
            esgIssueId: null,
            currentGoalId: null,
            currentAssessmentId: null,
            dragging: false,
            goalId: this.$route.params.id2,
            surveyId: this.$route.params.id1,
            showSignatureDialog: false,
            currentSignatureQuestion: null,
            esgSubOrganization: null,
            signatureOptions: {},
            fileErrors: {},
            signatureErrors: {},
            formValid: true,
            unitTypeList: {
                length: ["mm", "cm", "m", "km", "mi", "ft"],
                area: ["sq. m", "sq. km", "sq. ft", "yard", "hectares"],
                volume: ["cu. mm", "cu. m", "litres"]
            },
            unitMeta: {
                mm: { id: 'mm', name: 'Millimeter', abbr: 'mm', factor: 1, category: 'length' },
                cm: { id: 'cm', name: 'Centimeter', abbr: 'cm', factor: 10, category: 'length' },
                m: { id: 'm', name: 'Meter', abbr: 'm', factor: 1000, category: 'length' },
                km: { id: 'km', name: 'Kilometer', abbr: 'km', factor: 1000000, category: 'length' },
                mi: { id: 'mi', name: 'Mile', abbr: 'mi', factor: 1609344, category: 'length' },
                ft: { id: 'ft', name: 'Foot', abbr: 'ft', factor: 304.8, category: 'length' },
                sqm: { id: 'sqm', name: 'Square Meter', abbr: 'sqm', factor: 1, category: 'area' },
                sqkm: { id: 'sqkm', name: 'Square Kilometer', abbr: 'sqkm', factor: 1000000, category: 'area' },
                sqft: { id: 'sqft', name: 'Square Foot', abbr: 'sqft', factor: 929.03, category: 'area' },
                yard: { id: 'yard', name: 'Yard', abbr: 'yard', factor: 0.836127, category: 'area' },
                hectares: { id: 'hectares', name: 'Hectare', abbr: 'ha', factor: 10000, category: 'area' },
                cu_mm: { id: 'cu_mm', name: 'Cubic Millimeter', abbr: 'cu_mm', factor: 1, category: 'volume' },
                cu_m: { id: 'cu_m', name: 'Cubic Meter', abbr: 'cu_m', factor: 1000000, category: 'volume' },
                litres: { id: 'litres', name: 'Litre', abbr: 'l', factor: 1000, category: 'volume' },
            },
        };
    },

    computed: {
        // Transform the API response into a flat questions array
        questions() {
            if (!this.rawQuestions) return [];

            return this.rawQuestions.reduce((allQuestions, heading) => {
                const validQuestions = (heading.assessmentQuestions || [])
                    .filter(q => !q.deletedAt)
                    .map(q => ({
                        ...q,
                        questionHeading: {
                            _id: heading._id,
                            title: heading.title,
                            order: heading.order
                        }
                    }));
                return [...allQuestions, ...validQuestions];
            }, []).sort((a, b) => {
                // First sort by heading order
                const headingOrderDiff = a.questionHeading.order - b.questionHeading.order;
                if (headingOrderDiff !== 0) return headingOrderDiff;
                // Then sort by question order within heading
                return a.order - b.order;
            });
        },

        // Group questions by heading
        headingGroups() {
            return this.rawQuestions.reduce((acc, heading) => {
                const validQuestions = (heading.assessmentQuestions || [])
                    .filter(q => !q.deletedAt);

                if (validQuestions.length > 0) {
                    acc[heading._id] = {
                        headingId: heading._id,
                        title: heading.title,
                        order: heading.order,
                        questions: validQuestions.sort((a, b) => a.order - b.order)
                    };
                }
                return acc;
            }, {});
        },

        // Array of steps based on headings
        steps() {
            if (!this.rawQuestions) return [];
            return this.rawQuestions
                .filter(heading => {
                    const validQuestions = (heading.assessmentQuestions || [])
                        .filter(q => !q.deletedAt);
                    return validQuestions.length > 0;
                })
                .sort((a, b) => a.order - b.order);
        },

        totalSteps() {
            return this.steps.length;
        },

        currentStep() {
            if (!this.currentQuestion || !this.steps.length) return 1;
            const currentHeadingId = this.currentQuestion.questionHeading?._id;
            const stepIndex = this.steps.findIndex(step => step._id === currentHeadingId);
            return stepIndex !== -1 ? stepIndex + 1 : 1;
        },

        // Current heading's questions
        currentHeadingQuestions() {
            if (!this.currentQuestion || !this.rawQuestions) return [];
            const currentHeading = this.rawQuestions.find(h => h._id === this.currentQuestion.questionHeading?._id);
            return (currentHeading?.assessmentQuestions || [])
                .filter(q => !q.deletedAt)
                .sort((a, b) => a.order - b.order);
        },

        // Progress bar steps (based on current heading's questions)
        progressSteps() {
            if (!this.currentHeadingQuestions) return [];
            return this.currentHeadingQuestions?.map((q) => ({
                completed: this.isQuestionCompleted(q),
                active: q._id === this.currentQuestion?._id
            }));
        },

        // Question position within current heading
        currentQuestionInHeading: {
            get() {
                return this.currentHeadingQuestions.findIndex(q => q._id === this.currentQuestion?._id) + 1;
            },
            set(value) {
                // Allow setting the value for reset purposes
                const index = value - 1;
                if (index >= 0 && index < this.currentHeadingQuestions.length) {
                    const question = this.currentHeadingQuestions[index];
                    this.currentQuestionIndex = this.questions.findIndex(q => q._id === question._id);
                }
            }
        },

        totalQuestionsInHeading() {
            return this.currentHeadingQuestions.length;
        },

        // Navigation state
        canGoToPreviousQuestion() {
            return this.currentQuestionInHeading > 1;
        },

        canGoToNextQuestion() {
            return this.currentQuestionInHeading < this.totalQuestionsInHeading;
        },

        currentQuestion() {
            return this.questions[this.currentQuestionIndex] || null;
        },

        currentQuestionResponse: {
            get() {
                return (getDataQuestion) => {
                    console.log(' get current question response', this.currentQuestion, getDataQuestion);
                    
                    // Handle different question types and response structures
                    if (this.currentQuestion?.questionType === 'radio-button') {
                        // For radio buttons, look in getDataResponses
                        const getDataResponses = this.currentQuestion?.response?.getDataResponses || [];
                        const response = getDataResponses.find(resp => resp?.id === getDataQuestion._id);
                        return response ? response.value : '';
                    } else if (this.currentQuestion?.questionType === 'check-boxes') {
                        // For checkboxes, look in each option's getDataResponses
                        if (Array.isArray(this.currentQuestion?.response)) {
                            for (const optionResponse of this.currentQuestion.response) {
                                if (optionResponse?.getDataResponses) {
                                    const response = optionResponse.getDataResponses.find(resp => resp?.id === getDataQuestion._id);
                                    if (response) {
                                        return response.value;
                                    }
                                }
                            }
                        }
                        return '';
                    } else {
                        // For direct getData questions, use the original logic
                        const responses = Array.isArray(this.currentQuestion?.response)
                            ? this.currentQuestion.response
                            : [];
                        const response = responses.find(
                            resp => resp?.id === getDataQuestion._id
                        );
                        return response ? response.value : '';
                    }
                };
            },
            set() {
                return (getDataQuestion, newValue) => {
                    // Ensure response is an array before using .findIndex
                    if (!Array.isArray(this.currentQuestion.response)) {
                        this.$set(this.currentQuestion, 'response', []);
                    }
                    const responseIndex = this.currentQuestion.response.findIndex(
                        resp => resp.id === getDataQuestion._id
                    );
                    if (responseIndex > -1) {
                        // Update existing response
                        this.$set(this.currentQuestion.response[responseIndex], 'value', newValue);
                    } else {
                        // Create new response
                        this.currentQuestion.response.push({
                            id: getDataQuestion._id,
                            title: getDataQuestion.title,
                            dataType: getDataQuestion.dataType,
                            value: newValue
                        });
                    }
                };
            }
        },

        selectedActionPlans() {
            if (!this.currentQuestion ||
                this.currentQuestion.questionType !== 'radio-button' ||
                !this.currentQuestion.response.value) {
                return [];
            }
            const selectedOption = this.currentQuestion.options.find(opt =>
                opt._id === this.currentQuestion?.response?.value
            );
            return selectedOption?.actionPlans || [];
        },
        showActionPlans() {
            return this.selectedActionPlans.length > 0;
        },

        // For progress bar and question navigation
        totalQuestions() {
            return this.questions.length;
        },

        currentQuestionNumber() {
            if (!this.currentQuestion || !this.currentHeadingQuestions) return 1;
            return this.currentHeadingQuestions.findIndex(q => q._id === this.currentQuestion._id) + 1;
        },
        selectedRadioOption() {
            if (!this.currentQuestion || this.currentQuestion.questionType !== 'radio-button') return null;
            return this.currentQuestion.options.find(opt => opt._id == this.currentQuestion.response?.value);
        },
        getDataResponseValue: {
            get() {
                const questionType = this.currentQuestion.questionType;

                if (questionType === 'check-boxes') {
                    // For checkboxes, we need to handle multiple selected options
                    if (!Array.isArray(this.currentQuestion.response)) {
                        return {};
                    }

                    // Find the currently selected option we're showing get-data-questions for
                    const selectedOption = this.currentQuestion.options.find(opt =>
                        this.isOptionSelected(opt) && opt.isGetDataEnabled
                    );

                    if (!selectedOption) return {};


                    // Find the matching response for this option
                    const optionResponse = this.currentQuestion.response?.find(resp =>
                        resp?.value?.id === selectedOption?._id
                    );

                    if (!optionResponse?.getDataResponses) return {};

                    // Convert the getDataResponses to the expected format
                    return optionResponse.getDataResponses.reduce((acc, gdq) => {
                        acc[gdq.id] = gdq.value;
                        return acc;
                    }, {});
                } else {
                    // Original logic for radio buttons
                    if (!this.currentQuestion.response?.getDataResponses) return {};

                    return this.currentQuestion.response.getDataResponses.reduce((acc, gdq) => {
                        acc[gdq.id] = gdq.value;
                        return acc;
                    }, {});
                }
            },
            set(newValue) {
                console.log('trigger newValue', newValue);
                const questionType = this.currentQuestion.questionType;

                if (questionType === 'check-boxes') {
                    // For checkboxes, update the specific option's getDataResponses
                    const selectedOption = this.currentQuestion.options.find(opt =>
                        this.isOptionSelected(opt) && opt.isGetDataEnabled
                    );

                    if (!selectedOption) return;

                    const responseIndex = this.currentQuestion.response.findIndex(resp =>
                        resp.value.id === selectedOption._id
                    );

                    if (responseIndex === -1) return;

                    const updatedResponses = this.currentQuestion.response[responseIndex].getDataResponses?.map(gdq => {
                        if (gdq.id in newValue) {
                            return { ...gdq, value: newValue[gdq.id] };
                        }
                        return gdq;
                    });

                    // Update the specific option's getDataResponses
                    this.$set(
                        this.currentQuestion.response[responseIndex],
                        'getDataResponses',
                        updatedResponses
                    );
                } else {
                    // Original logic for radio buttons
                    if (!this.currentQuestion.response?.getDataResponses) return;

                    const updatedResponses = this.currentQuestion.response.getDataResponses?.map(gdq => {
                        if (gdq.id in newValue) {
                            return { ...gdq, value: newValue[gdq.id] };
                        }
                        return gdq;
                    });
                    this.$set(this.currentQuestion.response, 'getDataResponses', updatedResponses);
                }
            }
        },
        radioModel: {
            get() {
                return this.currentQuestion?.response?.value ?? null;
            },
            set(val) {
                if (!this.currentQuestion) return;
                if (!this.currentQuestion.response) {
                    this.$set(this.currentQuestion, 'response', { value: null });
                }
                this.$set(this.currentQuestion.response, 'value', val);
            }
        },
        getMeasurementUnits() {
            // Returns a function that filters measurementUnits by the allowed/selected unit(s)
            return (getDataQuestion) => {
                console.log('get measurement units', getDataQuestion);
                const type = getDataQuestion.additionalSettings?.measurementUnitType;
                const allowedUnit = getDataQuestion.additionalSettings?.measurementUnit;

                // If allowedUnit is an array, filter for all; if string, filter for just that one
                if (Array.isArray(allowedUnit)) {
                    return this.measurementUnits.filter(
                        unit => unit.category === type && allowedUnit.includes(unit.abbr)
                    );
                } else if (typeof allowedUnit === 'string') {
                    return this.measurementUnits.filter(
                        unit => unit.category === type && unit.abbr === allowedUnit
                    );
                } else {
                    // fallback: show all units in the category
                    return this.measurementUnits.filter(unit => unit.category === type);
                }
            };
        },
    },
    watch: {
        currentQuestionIndex(newIndex) {
            window.scrollTo({
                top: this.$refs.surveyContent?.getBoundingClientRect().top + window.scrollY - 60,
                behavior: 'smooth'
            });
            const q = this.questions[newIndex];
            if (q && q.uploadedFiles === undefined) {
                this.$set(q, 'uploadedFiles', []);
            }
        }
    },

    mounted() {
        this.loadQuestions()
            .then(() => (this.isLoading = false))
            .catch(() => (this.isLoading = false));
    },
    methods: {
        isQuestionCompleted(question) {
            if (!question) return false;

            // Check localStorage first
            const key = `survey_responses_${this.surveyId}_${this.goalId}`;
            const savedResponses = JSON.parse(localStorage.getItem(key)) || {};
            const savedResponse = savedResponses[question._id];

            // If there's a saved response in localStorage, consider it completed
            if (savedResponse) {
                return true;
            }

            // If no saved response, check current question state
            switch (question.questionType) {
                case 'attach-files':
                    return question.response?.value?.length > 0 ||
                        question.uploadedFiles?.length > 0;

                case 'digital-signature':
                    return !!question.response?.value?.key ||
                        !!question.response?.value?.s3key;

                case 'radio-button':
                    // Check both array response and direct response
                    if (Array.isArray(question.response)) {
                        return question.response.length > 0 &&
                            question.response[0]?.value?.label;
                    }
                    return !!question.response;

                case 'check-boxes':
                    // Check both array response and direct response
                    if (Array.isArray(question.response)) {
                        return question.response.length > 0;
                    }
                    return !!question.response;

                case 'text-field':
                case 'text-area':
                case 'numeric':
                case 'date':
                    // Check both response object and direct response
                    if (typeof question.response === 'object') {
                        return question.response?.value !== undefined &&
                            question.response?.value !== null &&
                            question.response?.value !== '';
                    }
                    return question.response !== undefined &&
                        question.response !== null &&
                        question.response !== '';

                case 'get-data':
                    if (!question.getDataQuestions?.length) return false;
                    return question?.response?.every(gdq => {
                        if (gdq?.dataType === 'attach-file') {
                            return gdq?.value?.length > 0;
                        }
                        if (gdq?.dataType === 'digital-signature') {
                            return !!gdq?.value?.key;
                        }
                        return !!gdq?.value || !!gdq?.response;
                    });

                default:
                    return !!question.response;
            }
        },
        async loadQuestions() {
            try {
                this.startLoading();
                const goal = await EsgService.getEsgGoal(this.goalId);
                this.goalTitle = goal?.data?.title || '';
                this.currentAssessmentId = goal.data.esgAssessment;
                this.currentGoalId = goal.data._id;
                this.esgProtocolId = goal.data.esgProtocol;
                this.esgIssueId = goal.data.esgIssue;
                this.esgSubOrganization = this.$route.query?.subOrganizationId || goal.data.organization;

                const response = await EsgService.getSurveyResponsesByAssessmentAndGoal(
                    this.surveyId,
                    this.currentGoalId
                );

                // Store the raw response
                this.rawQuestions = response.data;

                this.totalSteps = this.rawQuestions.length;

                // Load any unsent responses from local storage
                this.loadFromLocalStorage();

                // Initialize each question in each heading
                this.rawQuestions.forEach(heading => {
                    if (heading.assessmentQuestions) {
                        heading.assessmentQuestions.forEach(question => {
                            if (!question.deletedAt) {
                                this.initializeQuestion(question);
                            }
                        });
                    }
                });

                // Set initial question index
                if (this.questions.length > 0) {
                    this.currentQuestionIndex = 0;
                }

                console.log('Loaded questions with responses:', this.questions);
            } catch (error) {
                console.error('Error loading questions:', error);
            } finally {
                this.stopLoading();
            }
        },

        initializeQuestion(q) {
            if (!q) return;

            // Initialize base response structure
            if (!q.response) {
                q.response = q.questionType === 'check-boxes' ? [] : null;
                q.uploadedFiles = [];
                q.signature = null;
            }

            // Handle pre-filling responses based on question type
            switch (q.questionType) {
                case 'text-field':
                case 'text-area':
                case 'numeric':
                case 'date':
                    if (q.response && typeof q.response === 'object' && 'value' in q.response) {
                        const value = q.response.value;
                        q._originalResponse = q.response;
                        q.response = value;
                    }
                    break;

                case 'radio-button':
                    if (
                        q.response &&
                        typeof q.response.value !== 'undefined' &&
                        q.response.value !== null
                    ) {
                        const response = {
                            value: q.response?.value?.id || q.response?.value,
                            getDataResponses: q.response?.getDataResponses?.map(gdq => ({
                                ...gdq,
                                response: gdq.value
                            })),
                            actionPlanResponses: q.response?.actionPlanResponses?.map(ap => ({
                                ...ap,
                                response: ap.value
                            }))
                        };
                        q.response = response;

                        // Initialize action plans' uploadedFiles
                        if (q.options && q.response.actionPlanResponses) {
                            q.options = q.options.map(option => {
                                if (option.actionPlans) {
                                    option.actionPlans = option.actionPlans.map(plan => {
                                        const actionPlanResponse = q.response.actionPlanResponses.find(
                                            ap => ap.id === plan._id
                                        );
                                        if (actionPlanResponse && actionPlanResponse.files) {
                                            return {
                                                ...plan,
                                                uploadedFiles: actionPlanResponse.files.map(file => ({
                                                    name: file.name,
                                                    s3Key: file.key,
                                                    fileUrl: file.fileUrl,
                                                    comment: file.comment || ''
                                                })),
                                                files: actionPlanResponse.files
                                            };
                                        }
                                        return { ...plan, uploadedFiles: [], files: [] };
                                    });
                                }
                                return option;
                            });
                        }
                    }
                    break;

                case 'check-boxes':
                    if (Array.isArray(q.response)) {
                        q._originalResponse = q.response;
                        q.response = q.response?.map(item => item);
                    }

                    if (Array.isArray(q.options)) {
                        q.options = q.options?.map(option => {
                            option.selected = q.response?.some(item => item?.value?.id === option._id);

                            // Initialize action plans' uploadedFiles for this option
                            if (option.actionPlans) {
                                const optionResponse = q.response.find(
                                    resp => resp?.value?.id === option._id
                                );
                                option.actionPlans = option.actionPlans.map(plan => {
                                    if (!plan._id) {
                                        console.warn('Action plan missing _id:', plan);
                                    }
                                    if (optionResponse && optionResponse.actionPlanResponses) {
                                        const actionPlanResponse = optionResponse.actionPlanResponses.find(
                                            ap => ap.id === plan._id
                                        );
                                        if (actionPlanResponse && actionPlanResponse.files) {
                                            return {
                                                ...plan,
                                                uploadedFiles: actionPlanResponse.files.map(file => ({
                                                    name: file.name,
                                                    s3Key: file.key,
                                                    fileUrl: file.fileUrl,
                                                    comment: file.comment || ''
                                                })),
                                                files: actionPlanResponse.files
                                            };
                                        }
                                    }
                                    return { ...plan, uploadedFiles: [], files: [] };
                                });
                            }

                            // Initialize getData questions if enabled
                            if (option.isGetDataEnabled && option.getDataQuestions) {
                                option.getDataQuestions = option.getDataQuestions.map(q => ({
                                    ...q,
                                    response: null,
                                    files: [],
                                    uploadedFiles: []
                                }));
                            }

                            return option;
                        });
                    }
                    break;

                case 'attach-files':
                    if (q.response?.value) {
                        q.uploadedFiles = q.response.value.filter(attachment => attachment.key)?.map(attachment => ({
                            name: attachment.key?.split('/').pop(),
                            s3Key: attachment.key,
                            comment: attachment.comment || ''
                        }));
                    } else {
                        q.uploadedFiles = [];
                    }
                    break;

                case 'digital-signature':
                    if (q.response?.attachmentLink) {
                        q.signature = {
                            attachmentLink: q.response.attachmentLink,
                            s3key: q.response.s3key
                        };
                    }
                    break;
            }
        },

        // --- Navigation Methods ---
        goToSurveyOverview() {
            this.$router.push({ name: 'ProtocolDetailsOfSubOrganization', params: { id: this.esgProtocolId, subOrganizationId: this.esgSubOrganization } });
            //this.$router.go(-1);
        },

        // Step navigation (top-right)
        goToPreviousStep() {
            if (this.currentStep > 1) {
                const previousHeading = this.steps[this.currentStep - 2];
                if (!previousHeading || !previousHeading.assessmentQuestions) return;

                const firstValidQuestion = previousHeading.assessmentQuestions
                    .filter(q => !q.deletedAt)[0];

                if (firstValidQuestion) {
                    const questionIndex = this.questions.findIndex(q => q._id === firstValidQuestion._id);
                    if (questionIndex !== -1) {
                        this.currentQuestionIndex = questionIndex;
                    }
                }
            }
        },

        goToNextStep() {
            if (this.currentStep < this.totalSteps) {
                const nextHeading = this.steps[this.currentStep];
                if (!nextHeading || !nextHeading.assessmentQuestions) return;

                const firstValidQuestion = nextHeading.assessmentQuestions
                    .filter(q => !q.deletedAt)[0];

                if (firstValidQuestion) {
                    const questionIndex = this.questions.findIndex(q => q._id === firstValidQuestion._id);
                    if (questionIndex !== -1) {
                        this.currentQuestionIndex = questionIndex;
                    }
                }
            }
        },

        loadFromLocalStorage() {
            const key = `survey_responses_${this.surveyId}_${this.goalId}`;
            const savedResponses = JSON.parse(localStorage.getItem(key)) || {};
            this.rawQuestions.forEach(heading => {
                if (heading.assessmentQuestions) {
                    heading.assessmentQuestions.forEach(question => {
                        if (savedResponses[question._id] !== undefined) {
                            question.response = savedResponses[question._id];
                        }
                    });
                }
            });
        },

        saveToLocalStorage(question) {
            if (!question) return;
            const key = `survey_responses_${this.surveyId}_${this.goalId}`;
            let responses = JSON.parse(localStorage.getItem(key)) || {};
            
            // For attach-files questions, convert uploadedFiles to response.value format
            if (question.questionType === 'attach-files' && question.uploadedFiles && question.uploadedFiles.length > 0) {
                const responseValue = question.uploadedFiles.map(file => ({
                    key: file.s3Key,
                    comment: file.comment || '',
                    name: file.name,
                    attachmentLink: file.attachmentLink || ''
                }));
                
                responses[question._id] = {
                    value: responseValue
                };
            } else {
                responses[question._id] = question.response;
            }
            
            localStorage.setItem(key, JSON.stringify(responses));
        },

        // Question navigation within current heading
        goToPreviousQuestion() {
            if (this.canGoToPreviousQuestion) {
                const prevQuestionIndex = this.currentHeadingQuestions.findIndex(q => q._id === this.currentQuestion._id) - 1;
                const prevQuestion = this.currentHeadingQuestions[prevQuestionIndex];
                this.currentQuestionIndex = this.questions.findIndex(q => q._id === prevQuestion._id);
            }
        },

        goToNextQuestion() {
            // Validate standard fields
            const isValid = this.$refs.surveyForm?.validate();
            // Validate custom fields
            const filesValid = this.validateFiles();
            const signaturesValid = this.validateSignatures();

            if (!isValid || !filesValid || !signaturesValid) {
                this.scrollToFirstError();
                return;
            }
            console.log('this.currentQuestion-->', this.currentQuestion);
            this.saveToLocalStorage(this.currentQuestion);

            if (this.canGoToNextQuestion) {
                const nextQuestionIndex = this.currentHeadingQuestions.findIndex(q => q._id === this.currentQuestion._id) + 1;
                const nextQuestion = this.currentHeadingQuestions[nextQuestionIndex];
                this.currentQuestionIndex = this.questions.findIndex(q => q._id === nextQuestion._id);
            } else if (this.currentStep < this.totalSteps) {
                this.goToNextStep();
            }
        },

        skipStep() {
            // Skip to next question
            if (this.canGoToNextQuestion) {
                const nextQuestionIndex = this.currentHeadingQuestions.findIndex(q => q._id === this.currentQuestion._id) + 1;
                const nextQuestion = this.currentHeadingQuestions[nextQuestionIndex];
                this.currentQuestionIndex = this.questions.findIndex(q => q._id === nextQuestion._id);
            } else if (this.currentStep < this.totalSteps) {
                this.goToNextStep();
            }
        },

        // --- File Handling Methods ---
        onQuestionFileChange(event, question) {
            const files = Array.from(event.target.files);
            this.handleQuestionFileChange(files, question);
        },
        handleQuestionDrop(event, question) {
            event.preventDefault();
            this.dragging = false;
            const files = Array.from(event.dataTransfer.files);
            this.handleQuestionFileChange(files, question);
        },
        async handleQuestionFileChange(files, question) {
            await this.handleFileUpload(files, question, 'uploadedFiles');
        },
        getFileAcceptTypes(allowedTypes) {
            if (!allowedTypes) return undefined;
            const typeMap = { image: 'image/*', video: 'video/*', docx: '.doc,.docx', pdf: '.pdf' };
            return Object.entries(allowedTypes)
                .filter(([allowed]) => allowed)
                .map(([type]) => typeMap[type])
                .join(',');
        },

        async handleFileUpload(files, target, keyProperty) {
            if (!files || files.length === 0) {
                return;
            }
            this.startLoading();
            try {
                target.isUploading = true;
                target.uploadProgress = 0;

                const uploadedFiles = [];
                for (const file of files) {
                    if (!file) continue;

                    try {
                        // Create a temporary entry while uploading
                        const tempFile = {
                            name: file.name,
                            isUploading: true,
                            comment: ''
                        };

                        // Add to uploadedFiles array immediately to show progress
                        target[keyProperty] = [...(target[keyProperty] || []), tempFile];

                        const result = await S3UploadService.singleUpload(file, 'survey-uploads');

                        // Create the uploaded file object with the correct structure
                        const uploadedFile = {
                            name: file.name,
                            s3Key: result.key,
                            s3Location: result.fullPath,
                            fileUrl: result.fullPath, // Add this for consistency
                            comment: '',
                            isUploading: false
                        };

                        uploadedFiles.push(uploadedFile);

                        // Update progress
                        target.uploadProgress = Math.min(100, Math.round((uploadedFiles.length / files.length) * 100));

                    } catch (error) {
                        console.error('Error uploading file:', file.name, error);
                        this.$notify({
                            type: 'error',
                            text: `Failed to upload ${file.name}`
                        });
                    }
                }

                // Check if multiple attachments are allowed to preserve existing files
                if (target.additionalSetting?.allowMultipleAttachments) {
                    // Remove temporary files and append new files to existing ones
                    const existingFiles = (target.uploadedFiles || []).filter(file => !file.isUploading);
                    target.uploadedFiles = [...existingFiles, ...uploadedFiles];
                    this.$set(this.questions[this.currentQuestionIndex], 'uploadedFiles', target.uploadedFiles);
                } else {
                    // Replace existing files (single attachment mode)
                    target.uploadedFiles = uploadedFiles;
                    this.$set(this.questions[this.currentQuestionIndex], 'uploadedFiles', [...uploadedFiles]);
                }

                // Update the response structure for API submission
                if (target.questionType === 'attach-files') {
                    const newFiles = uploadedFiles?.map(file => ({
                        fileName: file.name,
                        fileUrl: file.s3Location,
                        key: file.s3Key,
                        comment: file.comment || ''
                    }));
                    
                    if (target.additionalSetting?.allowMultipleAttachments) {
                        // Append new files to existing response value
                        const existingFiles = target.response?.value || [];
                        target.response = {
                            id: target._id,
                            value: [...existingFiles, ...newFiles]
                        };
                    } else {
                        // Replace existing response value (single attachment mode)
                        target.response = {
                            id: target._id,
                            value: newFiles
                        };
                    }
                }

                this.$forceUpdate();

                if (uploadedFiles.length > 0) {
                    this.$notify({
                        type: 'success',
                        text: this.$t('esgPlatform.surveyResponse.fileUploadSuccess')
                    });
                }

            } catch (error) {
                console.error('Error in file upload:', error);
                this.$notify({
                    type: 'error',
                    text: this.$t('esgPlatform.surveyResponse.fileUploadError')
                });
            } finally {
                this.stopLoading();
                target.isUploading = false;
                target.uploadProgress = 0;
            }
        },
        removeQuestionFile(index, question) {
            question.uploadedFiles.splice(index, 1);
        },
        removeUploadedFile(index, target, keyProperty) {
            target.uploadedFiles.splice(index, 1);
            target[keyProperty] = target.uploadedFiles?.map(file => file.s3Key);
        },

        onFileChange(event, actionPlan) {
            const files = Array.from(event.target.files);
            this.handleActionPlanFileChange(files, actionPlan);
        },

        handleDrop(event, actionPlan) {
            event.preventDefault();
            this.dragging = false;
            const files = Array.from(event.dataTransfer.files);
            this.handleActionPlanFileChange(files, actionPlan);
        },

        onGetDataFileChange(event, getDataQuestion) {
            const files = Array.from(event.target.files);
            this.handleGetDataFileChange(files, getDataQuestion);
        },

        async handleGetDataDrop(event, getDataQuestion) {
            event.preventDefault();
            this.dragging = false;
            const files = Array.from(event.dataTransfer.files);
            await this.handleGetDataFileChange(files, getDataQuestion);
        },

        async handleActionPlanFileChange(files, plan) {
            console.log('Received file-change:', { files, plan });

            if (!files || !files.length) return;

            if (!plan._id) {
                console.error('Action plan missing _id:', plan);
                this.$notify({
                    type: 'error',
                    text: 'Action plan ID is missing'
                });
                return;
            }

            this.startLoading();
            try {
                plan.isUploading = true;
                const uploadedFiles = [];

                // Upload files to S3
                for (const file of files) {
                    const result = await S3UploadService.singleUpload(file, 'survey-uploads');
                    const fileData = {
                        name: file.name,
                        key: result.key,
                        fileUrl: result.fullPath
                    };
                    uploadedFiles.push(fileData);
                }

                console.log('action plan uploadedFiles', uploadedFiles, plan);

                // Append new files to existing files instead of replacing them
                const existingFiles = plan.files || [];
                const existingUploadedFiles = plan.uploadedFiles || [];

                const newUploadedFiles = uploadedFiles.map(file => ({
                    name: file.name,
                    s3Key: file.key,
                    fileUrl: file.fileUrl,
                    comment: ''
                }));

                // Update plan.files and plan.uploadedFiles reactively by appending
                this.$set(plan, 'files', [...existingFiles, ...uploadedFiles]);
                this.$set(plan, 'uploadedFiles', [...existingUploadedFiles, ...newUploadedFiles]);

                // Find the question
                const questionIndex = this.questions.findIndex(q => q._id === this.currentQuestion._id);
                if (questionIndex === -1) {
                    console.error('Question not found');
                    return;
                }

                let question = this.questions[questionIndex];
                console.log('Question:', question);

                // Create the response object with the required structure
                const response = {
                    id: plan._id,
                    title: plan.title,
                    files: [...existingFiles, ...uploadedFiles], // Include all files (existing + new)
                    isFileRequired: plan.isFileRequired
                };
                console.log('response action plan', response);

                if (question.questionType === 'check-boxes') {
                    // Find the option containing this action plan
                    const selectedOption = question.options.find(opt =>
                        opt.actionPlans.some(ap => ap._id === plan._id)
                    );
                    console.log('Selected option (checkbox):', selectedOption);

                    if (!selectedOption) {
                        console.error('No option found for action plan:', plan._id);
                        return;
                    }

                    // Initialize question.response as an array if it's not
                    if (!Array.isArray(question.response)) {
                        console.warn('question.response is not an array, initializing as []');
                        this.$set(question, 'response', []);
                    }

                    // Log current responses
                    console.log('Current question.response:', question.response);

                    // Find or create the response for this option
                    let responseIndex = question.response.findIndex(resp =>
                        resp.value && resp.value.id === selectedOption._id
                    );
                    console.log('Response index:', responseIndex);

                    if (responseIndex === -1) {
                        // No response exists for this option, create one
                        const newResponse = {
                            value: { id: selectedOption._id, title: selectedOption.title },
                            actionPlanResponses: []
                        };
                        question.response.push(newResponse);
                        responseIndex = question.response.length - 1;
                        console.log('Created new response for option:', newResponse);
                    }

                    // Initialize actionPlanResponses if it doesn't exist
                    if (!question.response[responseIndex].actionPlanResponses) {
                        this.$set(question.response[responseIndex], 'actionPlanResponses', []);
                    }

                    // Update or add the action plan response
                    const existingIndex = question.response[responseIndex].actionPlanResponses.findIndex(
                        resp => resp.id === plan._id
                    );
                    console.log('existingIndex action plan (checkbox):', existingIndex);

                    if (existingIndex !== -1) {
                        this.$set(
                            question.response[responseIndex].actionPlanResponses,
                            existingIndex,
                            response
                        );
                    } else {
                        question.response[responseIndex].actionPlanResponses.push(response);
                    }

                    // Ensure reactivity
                    this.$set(
                        question.response[responseIndex],
                        'actionPlanResponses',
                        [...question.response[responseIndex].actionPlanResponses]
                    );

                    // Log updated response
                    console.log('Updated question.response:', question.response);
                } else if (question.questionType === 'radio-button') {
                    // Initialize response if it doesn't exist
                    if (!question.response) {
                        this.$set(question, 'response', {});
                    }
                    if (!question.response.actionPlanResponses) {
                        this.$set(question.response, 'actionPlanResponses', []);
                    }

                    // Find the option to ensure it's valid
                    const selectedOption = question.options.find(opt =>
                        opt.actionPlans.some(ap => ap._id === plan._id)
                    );
                    console.log('Selected option (radio):', selectedOption);

                    if (!selectedOption) {
                        console.error('No option found for action plan:', plan._id);
                        return;
                    }

                    // Update or add the action plan response
                    const existingIndex = question.response.actionPlanResponses.findIndex(
                        resp => resp.id === plan._id
                    );
                    console.log('existingIndex action plan (radio):', existingIndex);

                    if (existingIndex !== -1) {
                        this.$set(question.response.actionPlanResponses, existingIndex, response);
                    } else {
                        question.response.actionPlanResponses.push(response);
                    }

                    // Ensure reactivity
                    this.$set(question.response, 'actionPlanResponses', [...question.response.actionPlanResponses]);

                    // Log updated response
                    console.log('Updated question.response:', question.response);
                } else {
                    console.error('Unsupported question type:', question.questionType);
                    return;
                }

                // Save to local storage to persist changes
                this.saveToLocalStorage(question);

                this.$notify({
                    type: 'success',
                    text: 'Files uploaded successfully'
                });
            } catch (error) {
                console.error('Error uploading files:', error);
                this.$notify({
                    type: 'error',
                    text: 'Failed to upload files'
                });
            } finally {
                plan.isUploading = false;
                this.stopLoading();
            }
        },

        handleActionPlanFileRemove({ plan, fileIndex }) {
            console.log('handleActionPlanFileRemove called with:', { plan, fileIndex });

            if (!plan || !plan.files || fileIndex < 0 || fileIndex >= plan.files.length) {
                console.error('Invalid parameters for file removal');
                return;
            }

            // Remove the file from the plan's files array
            plan.files.splice(fileIndex, 1);

            // Also remove from uploadedFiles if it exists
            if (plan.uploadedFiles && plan.uploadedFiles.length > fileIndex) {
                plan.uploadedFiles.splice(fileIndex, 1);
            }

            // Find the question and update the response
            const questionIndex = this.questions.findIndex(q => q._id === this.currentQuestion._id);
            if (questionIndex === -1) {
                console.error('Question not found');
                return;
            }

            const question = this.questions[questionIndex];

            if (question.questionType === 'check-boxes') {
                // Find the option containing this action plan
                const selectedOption = question.options.find(opt =>
                    opt.actionPlans.some(ap => ap._id === plan._id)
                );

                if (selectedOption && question.response) {
                    const responseIndex = question.response.findIndex(resp =>
                        resp.value && resp.value.id === selectedOption._id
                    );

                    if (responseIndex !== -1 && question.response[responseIndex].actionPlanResponses) {
                        const actionPlanResponseIndex = question.response[responseIndex].actionPlanResponses.findIndex(
                            resp => resp.id === plan._id
                        );

                        if (actionPlanResponseIndex !== -1) {
                            // Update the files array in the response
                            question.response[responseIndex].actionPlanResponses[actionPlanResponseIndex].files = [...plan.files];

                            // If no files left, remove the entire action plan response
                            if (plan.files.length === 0) {
                                question.response[responseIndex].actionPlanResponses.splice(actionPlanResponseIndex, 1);
                            }
                        }
                    }
                }
            } else if (question.questionType === 'radio-button') {
                if (question.response && question.response.actionPlanResponses) {
                    const actionPlanResponseIndex = question.response.actionPlanResponses.findIndex(
                        resp => resp.id === plan._id
                    );

                    if (actionPlanResponseIndex !== -1) {
                        // Update the files array in the response
                        question.response.actionPlanResponses[actionPlanResponseIndex].files = [...plan.files];

                        // If no files left, remove the entire action plan response
                        if (plan.files.length === 0) {
                            question.response.actionPlanResponses.splice(actionPlanResponseIndex, 1);
                        }
                    }
                }
            }

            // Save to local storage to persist changes
            this.saveToLocalStorage(question);

            // Force update to ensure reactivity
            this.$forceUpdate();

            this.$notify({
                type: 'success',
                text: 'File removed successfully'
            });
        },

        async handleGetDataFileChange(files, getDataQuestion) {
            console.log('handleGetDataFileChange', files, getDataQuestion);
            if (!files || files.length === 0) return;
            this.startLoading();
            try {
                const newResponse = [];
                for (const file of files) {
                    try {
                        const result = await S3UploadService.singleUpload(file, 'survey-uploads');
                        newResponse.push({
                            key: result.key,
                            fileName: file.name,
                            fileUrl: result.fullPath
                        });
                    } catch (error) {
                        console.error('Error uploading file:', file.name, error);
                        this.$notify({
                            type: 'error',
                            text: `Failed to upload ${file.name}`
                        });
                    }
                }

                // Get existing files to append new ones
                let existingFiles = [];
                const currentResponse = this.currentQuestionResponse(getDataQuestion);
                
                if (currentResponse) {
                    if (Array.isArray(currentResponse)) {
                        existingFiles = currentResponse;
                    } else {
                        // If it's a single file object, convert to array
                        existingFiles = [currentResponse];
                    }
                }
                
                console.log('existingFiles-->', existingFiles);
                console.log('newResponse-->', newResponse);
                
                // Combine existing files with new files
                const combinedFiles = [...existingFiles, ...newResponse];
                
                // Update the response with combined files
                this.updateGetDataResponse({
                    questionId: getDataQuestion._id,
                    value: combinedFiles,
                    dataType: getDataQuestion.dataType
                });

                // Save to local storage to persist changes
                this.saveToLocalStorage(this.currentQuestion);

                this.$notify({
                    type: 'success',
                    text: this.$t('esgPlatform.surveyResponse.fileUploadSuccess')
                });

            } catch (error) {
                console.error('Error in file upload:', error);
                this.$notify({
                    type: 'error',
                    text: this.$t('esgPlatform.surveyResponse.fileUploadError')
                });
            } finally {
                this.stopLoading();
            }
        },

        getRadioResponse(_id) {
            console.log("hi", this.currentQuestion.response.getDataResponses, _id)
            const value = this.currentQuestion.response.getDataResponses.find(gdq => gdq.id == _id)?.value;
            console.log("value", value)
            return value;
        },

        removeGetDataFile(index, getDataQuestion) {
            const questionId = getDataQuestion._id;
            
            // Find the response using the same logic as currentQuestionResponse
            const responses = Array.isArray(this.currentQuestion?.response)
                ? this.currentQuestion.response
                : [];
            const response = responses.find(
                resp => resp?.id === questionId
            );
            
            
            if (response && response.value) {
                if (Array.isArray(response.value)) {
                    response.value.splice(index, 1);
                    if (response.value.length === 0) {
                        response.value = null;
                    }
                } else {
                    response.value = null;
                }
            }

            this.$forceUpdate();
        },

        removeAttachFile(index, question, source = 'uploadedFiles') {
            console.log('removeAttachFile', { index, question, source });
            
            if (source === 'uploadedFiles') {
                if (question.uploadedFiles && question.uploadedFiles.length > index) {
                    question.uploadedFiles.splice(index, 1);
                }
            } else if (source === 'response') {
                if (question.response && question.response.value && question.response.value.length > index) {
                    question.response.value.splice(index, 1);
                }
            }
            
            this.$forceUpdate();
        },

        async openFile(s3Location) {
            try {
                const fileKey = s3Location.split('.com/')[1];
                const viewUrl = await S3UploadService.getFileUrl(fileKey);
                window.open(viewUrl, '_blank');
            } catch (error) {
                console.error('Error opening file:', error);
                this.$notify({ type: 'error', text: 'Failed to open file' });
            }
        },
        openSignatureDialog(question) {
            console.log('Opening signature dialog for question:', question);
            this.currentSignatureQuestion = question;
            if (question.questionType) {
                this.signatureOptions = question.additionalSetting || {};
            } else if (question.dataType) {
                this.signatureOptions = question.additionalSettings || {};
            }
            this.showSignatureDialog = true;
            console.log('showSignatureDialog set to:', this.showSignatureDialog);
        },
        handleSignature(signatureData) {
            if (!signatureData) return;

            const question = this.currentSignatureQuestion;
            const signatureInfo = {
                attachmentLink: signatureData.attachmentLink,
                key: signatureData.s3key
            };

            if (question.questionType === 'digital-signature') {
                // For normal signature questions
                this.$set(question, 'response', {
                    value: signatureInfo
                });
            } else if (question.dataType === 'digital-signature') {
                // For get-data signature questions
                this.updateGetDataResponse({
                    questionId: question._id,
                    value: signatureInfo,
                    dataType: question.dataType
                });
            }

            this.showSignatureDialog = false;
        },
        removeSignature(question) {
            console.log('removeSignature', question);

            if (question.questionType === 'digital-signature') {
                // For normal signature questions
                this.$set(question, 'response', { value: null });
            } else if (question.dataType === 'digital-signature') {
                // For get-data signature questions
                const questionId = question._id;
                const response = this.questions[this.currentQuestionIndex]?.response?.find(q => q.id === questionId);
                if (response) {
                    this.$set(response, 'value', null);
                }
            }

            this.$forceUpdate(); // Ensure UI updates
        },

        // --- Response Creation Methods ---
        createTextResponse(questionId, assessmentId, goalId, value, protocolId, issueId) {
            return {
                esgQuestionId: questionId,
                esgAssessmentId: assessmentId,
                esgGoalId: goalId,
                esgProtocolId: protocolId,
                esgIssueId: issueId,
                submittedByType: 'sub-organization',
                submittedById: null,
                response: {
                    value: value
                }
            };
        },

        createNumericResponse(questionId, assessmentId, goalId, value, protocolId, issueId) {
            return {
                esgQuestionId: questionId,
                esgAssessmentId: assessmentId,
                esgGoalId: goalId,
                esgProtocolId: protocolId,
                esgIssueId: issueId,
                submittedByType: 'sub-organization',
                submittedById: null,
                response: {
                    value: Number(value)
                }
            };
        },

        createDateResponse(questionId, assessmentId, goalId, dateValue, protocolId, issueId) {
            return {
                esgQuestionId: questionId,
                esgAssessmentId: assessmentId,
                esgGoalId: goalId,
                esgProtocolId: protocolId,
                esgIssueId: issueId,
                submittedByType: 'sub-organization',
                submittedById: null,
                response: {
                    value: dateValue
                }
            };
        },

        createSignatureResponse(questionId, assessmentId, goalId, signature, protocolId, issueId) {
            return {
                esgQuestionId: questionId,
                esgAssessmentId: assessmentId,
                esgGoalId: goalId,
                esgProtocolId: protocolId,
                esgIssueId: issueId,
                submittedByType: 'sub-organization',
                submittedById: null,
                response: {
                    value: {
                        key: signature?.s3key || signature?.value?.key,
                        attachmentLink: signature?.attachmentLink || signature?.value?.attachmentLink
                    }
                }
            };
        },

        createAttachmentResponse(questionId, assessmentId, goalId, uploadedFiles, protocolId, issueId) {
            return {
                esgQuestionId: questionId,
                esgAssessmentId: assessmentId,
                esgGoalId: goalId,
                esgProtocolId: protocolId,
                esgIssueId: issueId,
                submittedByType: 'sub-organization',
                submittedById: null,
                response: {
                    value: uploadedFiles?.map(file => ({
                        key: file.s3Key,
                        fileUrl: file.s3Location,
                        fileName: file.name,
                        comment: file.comment || ''
                    }))
                }
            };
        },

        // Helper function to format measurement unit response
        formatMeasurementUnitResponse(gdq) {
            console.log('formatMeasurementUnitResponse', gdq);
            const response = {
                id: gdq._id || gdq.id,
                title: gdq.title,
                dataType: gdq.dataType,
                value: gdq.value || null
            };
            console.log('response>>>>>', response);
            return response;
        },

        createRadioResponse(questionId, assessmentId, goalId, option, actionPlanResponses = [], getDataResponses = [], protocolId, issueId) {
            return {
                esgQuestionId: questionId,
                esgAssessmentId: assessmentId,
                esgGoalId: goalId,
                esgProtocolId: protocolId,
                esgIssueId: issueId,
                submittedByType: 'sub-organization',
                submittedById: null,
                response: {
                    value: {
                        id: option._id,
                        label: option.label,
                        isActionPlanEnabled: option.isActionPlanEnabled,
                        isGetDataEnabled: option.isGetDataEnabled,
                        isRecommendatationEnabled: option.isRecommendatationEnabled,
                        isDimitraModulesEnabled: option.isDimitraModulesEnabled
                    },
                    actionPlanResponses: (actionPlanResponses || []).map(plan => ({
                        id: plan.id,
                        title: plan.title,
                        isFileRequired: plan.isFileRequired,
                        files: plan.files
                    })),
                    getDataResponses: (getDataResponses || []).map(gdq => {
                        let response;
                        console.log('radio gdq>>>>>', gdq);
                        switch (gdq.dataType) {
                            case 'text-field':
                            case 'text-area':
                                response = {
                                    id: gdq.id,
                                    title: gdq.title,
                                    dataType: gdq.dataType,
                                    value: gdq.value || null
                                };
                                break;
                            case 'numeric':
                                response = {
                                    id: gdq.id,
                                    title: gdq.title,
                                    dataType: gdq.dataType,
                                    value: gdq.value ? Number(gdq.value) : null
                                };
                                break;
                            case 'attach-file':
                                response = {
                                    id: gdq.id,
                                    title: gdq.title,
                                    dataType: gdq.dataType,
                                    value: gdq?.value && gdq?.value[0] || gdq?.response && gdq?.response[0] ? {
                                        key: gdq?.value[0]?.key || gdq?.response[0]?.key,
                                        fileName: gdq?.value[0]?.fileName || gdq?.response[0]?.fileName,
                                        fileUrl: gdq?.value[0]?.fileUrl || gdq?.response[0]?.fileUrl
                                    } : null
                                };
                                break;
                            case 'digital-signature':
                                response = {
                                    id: gdq.id,
                                    title: gdq.title,
                                    dataType: gdq.dataType,
                                    value: gdq.signature || gdq.value ? {
                                        key: gdq.signature?.s3key || gdq.value?.s3key,
                                        attachmentLink: gdq.signature?.attachmentLink || gdq.value?.attachmentLink
                                    } : null
                                };
                                break;
                            case 'radio-button':
                                response = {
                                    id: gdq.id,
                                    title: gdq.title,
                                    dataType: gdq.dataType,
                                    value: gdq.value || null
                                };
                                break;
                            case 'check-boxes':
                                response = {
                                    id: gdq.id,
                                    title: gdq.title,
                                    dataType: gdq.dataType,
                                    value: Array.isArray(gdq.response || gdq.value) ? gdq.response || gdq.value : []
                                };
                                break;
                            case 'measurement-unit':
                                response = this.formatMeasurementUnitResponse(gdq);
                                break;
                            default:
                                response = {
                                    id: gdq.id,
                                    title: gdq.title,
                                    dataType: gdq.dataType,
                                    value: gdq.value || null
                                };
                        }
                        return response;
                    })
                }
            };
        },

        createCheckboxResponse(questionId, assessmentId, goalId, options, protocolId, issueId) {
            return {
                esgQuestionId: questionId,
                esgAssessmentId: assessmentId,
                esgGoalId: goalId,
                esgProtocolId: protocolId,
                esgIssueId: issueId,
                submittedByType: 'sub-organization',
                submittedById: null,
                response: options?.map(option => ({
                    value: {
                        id: option.value.id,
                        label: option.value.label,
                        isActionPlanEnabled: option.value.isActionPlanEnabled,
                        isGetDataEnabled: option.value.isGetDataEnabled,
                        isRecommendatationEnabled: option.value.isRecommendatationEnabled,
                        isDimitraModulesEnabled: option.value.isDimitraModulesEnabled
                    },
                    actionPlanResponses: (option.actionPlanResponses || []).map(plan => ({
                        id: plan.id || plan._id, // Ensure id is included
                        title: plan.title,
                        files: (plan.files || []).map(file => ({
                            key: file.key,
                            name: file.name,
                            fileUrl: file.fileUrl
                        })),
                        isFileRequired: plan.isFileRequired
                    })),
                    getDataResponses: (option.getDataResponses || []).map(gdq => {
                        console.log('checkboxes gdq>>>>>', gdq);
                        let response;
                        switch (gdq.dataType) {
                            case 'text-field':
                            case 'text-area':
                                response = {
                                    id: gdq.id,
                                    title: gdq.title,
                                    dataType: gdq.dataType,
                                    value: gdq.value
                                };
                                break;
                            case 'numeric':
                                response = {
                                    id: gdq.id,
                                    title: gdq.title,
                                    dataType: gdq.dataType,
                                    value: Number(gdq.value)
                                };
                                break;
                            case 'attach-file':
                                response = {
                                    id: gdq.id,
                                    title: gdq.title,
                                    dataType: gdq.dataType,
                                    value: gdq?.value && gdq?.value[0] || gdq?.response && gdq?.response[0] ? {
                                        key: gdq?.value[0]?.key || gdq?.response[0]?.key,
                                        name: gdq?.value[0]?.fileName || gdq?.response[0]?.fileName,
                                        fileUrl: gdq?.value[0]?.fileUrl || gdq?.response[0]?.fileUrl
                                    } : null
                                };
                                break;
                            case 'digital-signature':
                                response = {
                                    id: gdq.id,
                                    title: gdq.title,
                                    dataType: gdq.dataType,
                                    value: gdq.signature || gdq.value ? {
                                        key: gdq.signature?.s3key || gdq.value?.s3key,
                                        attachmentLink: gdq.signature?.attachmentLink || gdq.value?.attachmentLink
                                    } : null
                                };
                                break;
                            case 'radio-button':
                                response = {
                                    id: gdq.id,
                                    title: gdq.title,
                                    dataType: gdq.dataType,
                                    value: gdq.value || null
                                };
                                break;
                            case 'check-boxes':
                                response = {
                                    id: gdq.id,
                                    title: gdq.title,
                                    dataType: gdq.dataType,
                                    value: Array.isArray(gdq.response || gdq.value) ? gdq.response || gdq.value : []
                                };
                                break;
                            case 'measurement-unit':
                                response = this.formatMeasurementUnitResponse(gdq);
                                break;
                            default:
                                response = {
                                    id: gdq.id,
                                    title: gdq.title,
                                    dataType: gdq.dataType,
                                    value: gdq.value
                                };
                        }
                        return response;
                    })
                }))
            };
        },

        createGetDataResponse(questionId, assessmentId, goalId, responses, protocolId, issueId, nextStep) {
            return {
                submittedByType: 'sub-organization',
                submittedById: null,
                esgQuestionId: questionId,
                esgAssessmentId: assessmentId,
                esgGoalId: goalId,
                esgProtocolId: protocolId,
                esgIssueId: issueId,
                nextStep,
                response: responses?.length ? responses?.map(response => {
                    if (response && response.dataType === 'attach-file') {
                        return {
                            id: response.id,
                            title: response.title,
                            dataType: response.dataType,
                            value: response.value?.map(file => ({ key: file.key, fileName: file.fileName, fileUrl: file.fileUrl })),
                        };
                    } if (response && response.dataType === 'measurement-unit') {
                        return response;
                    }
                    if (response && response.dataType === 'digital-signature') {
                        return {
                            id: response.id,
                            title: response.title,
                            dataType: response.dataType,
                            value: response.value ? { attachmentLink: response.value.attachmentLink, key: response.value.key } : null,
                        };
                    }

                    if (response && response.dataType === 'check-boxes') {
                        return { id: response.id, title: response.title, dataType: response.dataType, value: response.value };
                    }

                    if (response && response.dataType === 'radio-button') {
                        return { id: response.id, title: response.title, dataType: response.dataType, value: response.value };
                    }

                    if (response && (response.dataType === 'text-field' || response.dataType === 'text-area' || response.dataType === 'numeric' || response.dataType === 'date')) {
                        return { id: response.id, title: response.title, dataType: response.dataType, value: response.value };
                    }

                }) : null,
            };
        },

        scrollToFirstError() {
            this.$nextTick(() => {
                const errorField = document.querySelector('.v-input--has-state .v-messages__message, .red--text.text-caption');
                if (errorField) {
                    errorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        },

        // --- Submission Methods ---
        async submitSurvey() {
            // Validate standard fields
            const isValid = this.$refs.surveyForm?.validate();
            // Validate custom fields
            const filesValid = this.validateFiles();
            const signaturesValid = this.validateSignatures();

            if (!isValid || !filesValid || !signaturesValid) {
                this.scrollToFirstError();
                return;
            }

            try {
                this.startLoading();
                const currentQuestion = this.questions[this.currentQuestionIndex];
                if (!currentQuestion) throw new Error('No question found');

                // if (currentQuestion.isMandatory && !currentQuestion.response) {
                //     this.$notify({ type: 'error', text: this.$t('esgPlatform.surveyResponse.fieldRequired') });
                //     return;
                // }

                const nextStep = this.currentStep < this.totalSteps ? this.currentStep + 1 : null;

                // Validate file uploads
                if (currentQuestion.getDataQuestions?.length > 0) {
                    for (const gdq of currentQuestion.getDataQuestions) {
                        if (gdq.dataType === 'attach-file' && gdq.isMandatory && gdq.uploadedFiles?.length === 0 && gdq.isUploading) {
                            this.$notify({ type: 'warning', text: this.$t('esgPlatform.surveyResponse.waitForFileUpload') });
                            return;
                        }
                    }
                }
                if (currentQuestion.questionType === 'radio-button' && this.selectedActionPlans?.length > 0) {
                    for (const actionPlan of this.selectedActionPlans) {
                        if (actionPlan.isFileRequired && actionPlan.uploadedFiles?.length === 0 && actionPlan.isUploading) {
                            this.$notify({ type: 'warning', text: this.$t('esgPlatform.surveyResponse.waitForFileUpload') });
                            return;
                        }
                    }
                }


                // Create response based on question type
                let response;
                let selectedOption;
                let selectedOptions;

                console.log(currentQuestion.questionType);
                switch (currentQuestion.questionType) {
                    case 'text-field':
                    case 'text-area':
                        response = this.createTextResponse(
                            currentQuestion._id,
                            this.currentAssessmentId,
                            this.currentGoalId,
                            currentQuestion.response,
                            this.esgProtocolId,
                            this.esgIssueId,
                            nextStep
                        );
                        break;

                    case 'numeric':
                        response = this.createNumericResponse(
                            currentQuestion._id,
                            this.currentAssessmentId,
                            this.currentGoalId,
                            currentQuestion.response,
                            this.esgProtocolId,
                            this.esgIssueId,
                            nextStep
                        );
                        break;

                    case 'date':
                        response = this.createDateResponse(
                            currentQuestion._id,
                            this.currentAssessmentId,
                            this.currentGoalId,
                            currentQuestion.response,
                            this.esgProtocolId,
                            this.esgIssueId,
                            nextStep
                        );
                        break;

                    case 'digital-signature':
                        response = this.createSignatureResponse(
                            currentQuestion._id,
                            this.currentAssessmentId,
                            this.currentGoalId,
                            currentQuestion.response,
                            this.esgProtocolId,
                            this.esgIssueId,
                            nextStep
                        );
                        break;

                    case 'radio-button': {
                        const currentQuestion = this.questions.find(q => q._id === this.currentQuestion._id);
                        selectedOption = currentQuestion.options.find(opt =>
                            opt._id === currentQuestion?.response?.value
                        );
                        if (!selectedOption) {
                            if (currentQuestion.isMandatory) {
                                this.$notify({ type: 'error', text: 'Selected option not found' });
                                return;
                            }
                            break;
                        }
                        response = this.createRadioResponse(
                            currentQuestion._id,
                            this.currentAssessmentId,
                            this.currentGoalId,
                            selectedOption,
                            currentQuestion.response.actionPlanResponses || [],
                            currentQuestion.response.getDataResponses || [],
                            this.esgProtocolId,
                            this.esgIssueId
                        );
                        break;
                    }

                    case 'check-boxes': {
                        if (!Array.isArray(currentQuestion.response)) {
                            currentQuestion.response = [currentQuestion.response];
                        }
                        selectedOptions = currentQuestion?.response;
                        response = this.createCheckboxResponse(
                            currentQuestion._id,
                            this.currentAssessmentId,
                            this.currentGoalId,
                            selectedOptions,
                            this.esgProtocolId,
                            this.esgIssueId,
                            nextStep
                        );
                        break;
                    }

                    case 'attach-files': {
                        if (!currentQuestion.uploadedFiles?.length) {
                            if (currentQuestion.isMandatory) {
                                this.$notify({
                                    type: 'error',
                                    text: this.$t('esgPlatform.surveyResponse.fileRequired')
                                });
                                return;
                            }
                            currentQuestion.uploadedFiles = [];
                        }
                        response = this.createAttachmentResponse(
                            currentQuestion._id,
                            this.currentAssessmentId,
                            this.currentGoalId,
                            currentQuestion.uploadedFiles,
                            this.esgProtocolId,
                            this.esgIssueId,
                            nextStep
                        );
                        break;
                    }

                    default: {
                        if (currentQuestion.getDataQuestions?.length > 0) {
                            response = this.createGetDataResponse(
                                currentQuestion._id,
                                this.currentAssessmentId,
                                this.currentGoalId,
                                currentQuestion.response,
                                this.esgProtocolId,
                                this.esgIssueId,
                                nextStep
                            );
                        } else {
                            this.$notify({
                                type: 'error',
                                text: `Unsupported question type: ${currentQuestion.questionType}`
                            });
                            return;
                        }
                    }
                }


                if (!response) {
                    this.$notify({ type: 'error', text: 'Failed to create response data' });
                    return;
                }

                const result = await EsgService.submitSurveyResponse(response);
                if (result?.response) {
                    currentQuestion.response = result.response.value;
                }

                this.$notify({
                    type: 'success',
                    text: this.$t('esgPlatform.surveyResponse.surveySubmittedSuccess')
                });


                // Check if this is the last question in the entire survey
                const isLastQuestion = this.currentQuestionIndex === this.questions.length - 1;
                const isLastQuestionInCurrentHeading = !this.canGoToNextQuestion;
                const isLastStep = this.currentStep === this.totalSteps;

                if (isLastQuestion || (isLastQuestionInCurrentHeading && isLastStep)) {
                    // If we're at the very last question, go back to survey overview
                    this.goToSurveyOverview();
                } else if (this.canGoToNextQuestion) {
                    // If there's a next question in current heading, go to it
                    this.goToNextQuestion();
                } else {
                    // Otherwise, go to the next step's first question
                    this.goToNextStep();
                }

            } catch (error) {
                console.error('Error submitting survey:', error);
                this.$notify({
                    type: 'error',
                    text: this.$t('esgPlatform.surveyResponse.errorSubmittingSurvey')
                });
            } finally {
                this.stopLoading();
            }
        },


        async submitEntireSurvey() {
            try {
                this.startLoading();

                // First save the current question to local storage
                if (this.currentQuestion) {
                    this.saveToLocalStorage(this.currentQuestion);
                }

                // Wait for localStorage to be updated
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Load responses from local storage
                const key = `survey_responses_${this.surveyId}_${this.goalId}`;
                const savedResponses = JSON.parse(localStorage.getItem(key)) || {};

                // Verify localStorage data
                if (Object.keys(savedResponses).length === 0) {
                    this.$notify({
                        type: 'warning',
                        text: this.$t('esgPlatform.surveyResponse.noResponsesToSubmit')
                    });
                    return;
                }

                const responses = [];

                // Process only the questions that have responses in localStorage
                for (const [questionId, savedResponse] of Object.entries(savedResponses)) {
                    const question = this.questions.find(q => q._id === questionId);
                    if (!question) continue;

                    let selectedOption;

                    switch (question.questionType) {
                        case 'text-field':
                        case 'text-area':
                            responses.push({
                                esgQuestionId: question._id,
                                esgAssessmentId: this.currentAssessmentId,
                                esgGoalId: this.currentGoalId,
                                esgProtocolId: this.esgProtocolId,
                                esgIssueId: this.esgIssueId,
                                submittedByType: 'sub-organization',
                                submittedById: null,
                                response: {
                                    value: savedResponse
                                }
                            });
                            break;

                        case 'numeric':
                            responses.push({
                                esgQuestionId: question._id,
                                esgAssessmentId: this.currentAssessmentId,
                                esgGoalId: this.currentGoalId,
                                esgProtocolId: this.esgProtocolId,
                                esgIssueId: this.esgIssueId,
                                submittedByType: 'sub-organization',
                                submittedById: null,
                                response: {
                                    value: Number(savedResponse)
                                }
                            });
                            break;

                        case 'date':
                            responses.push({
                                esgQuestionId: question._id,
                                esgAssessmentId: this.currentAssessmentId,
                                esgGoalId: this.currentGoalId,
                                esgProtocolId: this.esgProtocolId,
                                esgIssueId: this.esgIssueId,
                                submittedByType: 'sub-organization',
                                submittedById: null,
                                response: {
                                    value: savedResponse
                                }
                            });
                            break;

                        case 'digital-signature':
                            if (savedResponse?.value?.key) {
                                responses.push({
                                    esgQuestionId: question._id,
                                    esgAssessmentId: this.currentAssessmentId,
                                    esgGoalId: this.currentGoalId,
                                    esgProtocolId: this.esgProtocolId,
                                    esgIssueId: this.esgIssueId,
                                    submittedByType: 'sub-organization',
                                    submittedById: null,
                                    response: {
                                        value: {
                                            fileUrl: savedResponse.value?.fileUrl || savedResponse.value?.attachmentLink || savedResponse.value?.s3Location,
                                            name: savedResponse.value?.fileName,
                                            key: savedResponse.value.key
                                        }
                                    }
                                });
                            }
                            break;

                        case 'attach-files':
                            if (savedResponse?.value?.length > 0) {
                                responses.push({
                                    esgQuestionId: question._id,
                                    esgAssessmentId: this.currentAssessmentId,
                                    esgGoalId: this.currentGoalId,
                                    esgProtocolId: this.esgProtocolId,
                                    esgIssueId: this.esgIssueId,
                                    submittedByType: 'sub-organization',
                                    submittedById: null,
                                    response: {
                                        value: question.uploadedFiles.map(file => ({
                                            key: file?.s3Key,
                                            comment: file?.comment || '',
                                            fileName: file?.fileName,
                                            fileUrl: file?.fileUrl || file?.s3Location || null
                                        }))
                                    }
                                });
                            }
                            break;

                        case 'radio-button': {
                            selectedOption = question.options.find(opt =>
                                opt._id === savedResponse?.value
                            );
                            if (selectedOption) {
                                responses.push(this.createRadioResponse(
                                    question._id,
                                    this.currentAssessmentId,
                                    this.currentGoalId,
                                    selectedOption,
                                    savedResponse?.actionPlanResponses || [],
                                    savedResponse?.getDataResponses || [],
                                    this.esgProtocolId,
                                    this.esgIssueId
                                ));
                            }
                            break;
                        }

                        case 'check-boxes': {
                            if (Array.isArray(savedResponse)) {
                                responses.push(this.createCheckboxResponse(
                                    question._id,
                                    this.currentAssessmentId,
                                    this.currentGoalId,
                                    savedResponse,
                                    this.esgProtocolId,
                                    this.esgIssueId
                                ));
                            }
                            break;
                        }

                        case 'get-data': {
                            if (question.getDataQuestions?.length > 0) {
                                responses.push(this.createGetDataResponse(
                                    question._id,
                                    this.currentAssessmentId,
                                    this.currentGoalId,
                                    savedResponse,
                                    this.esgProtocolId,
                                    this.esgIssueId
                                ));
                            }
                            break;
                        }
                    }
                }

                // Submit all responses at once
                if (responses.length > 0) {
                    await EsgService.submitSurveyResponse(responses);
                    this.$notify({
                        type: 'success',
                        text: this.$t('esgPlatform.surveyResponse.surveyCompletedSuccess')
                    });
                    // Clear local storage after successful submission
                    localStorage.removeItem(key);
                    this.goToSurveyOverview();
                } else {
                    this.$notify({
                        type: 'warning',
                        text: this.$t('esgPlatform.surveyResponse.noResponsesToSubmit')
                    });
                }
            } catch (error) {
                console.error('Error submitting entire survey:', error);
                this.$notify({
                    type: 'error',
                    text: this.$t('esgPlatform.surveyResponse.errorSubmittingSurvey')
                });
            } finally {
                this.stopLoading();
            }
        },
        // Helper method for formatting getData responses
        formatGetDataResponse(gdq) {
            if (gdq.dataType === 'attach-file') {
                return {
                    id: gdq._id,
                    title: gdq.title,
                    dataType: gdq.dataType,
                    value: gdq.uploadedFiles?.map(file => ({
                        key: file.s3key,
                        fileName: file.name
                    })) || []
                };
            }
            if (gdq.dataType === 'measurement-unit') {
                const selectedUnit = this.measurementUnits.find(unit => unit.id === gdq.response);
                return {
                    id: gdq._id,
                    title: gdq.title,
                    dataType: gdq.dataType,
                    value: selectedUnit ? {
                        id: selectedUnit.id,
                        name: selectedUnit.name,
                        abbr: selectedUnit.abbr,
                        factor: selectedUnit.factor,
                        category: selectedUnit.category
                    } : null
                };
            }
            if (gdq.dataType === 'signature') {
                return {
                    id: gdq._id,
                    title: gdq.title,
                    dataType: gdq.dataType,
                    value: gdq.signature ? {
                        attachmentLink: gdq.signature.attachmentLink,
                        s3key: gdq.signature.s3key
                    } : null
                };
            }
            return {
                id: gdq._id,
                title: gdq.title,
                dataType: gdq.dataType,
                value: gdq.response
            };
        },

        // --- Utility Methods ---
        getProgressColor(progress) {
            if (progress <= 24) return '#F03737'; // Red
            if (progress <= 74) return '#FFB443'; // Yellow/Orange
            return '#00BD73'; // Green
        },

        handleConfirm() {
            if (this.confirmAction) this.confirmAction();
            this.openConfirmBox = false;
            this.confirmAction = null;
        },

        getFileExtension(doc) {
            console.log('doc11>>>>', doc);
            const parts = doc.name?.split('.') || doc.fileName?.split('.');
            return parts.length > 1 ? parts.pop().toUpperCase() : '';
        },

        getFileName(doc) {
            return doc?.name || doc?.fileName || 'Unnamed file';
        },

        isOptionSelected(option) {
            if (!this.currentQuestion?.response || !Array.isArray(this.currentQuestion.response)) {
                return false;
            }
            return this.currentQuestion.response.some(resp => resp.value?.label === option.label);
        },

        handleCheckboxChange(option) {
            if (!option || !option._id) return;

            if (!Array.isArray(this.currentQuestion.response)) {
                this.$set(this.currentQuestion, 'response', []);
            }

            const isSelected = option.selected;
            const existingResponseIndex = this.currentQuestion.response.findIndex(
                resp => resp?.value?.id === option._id
            );

            // Toggle visibility of details
            this.$set(option, 'showDetails', isSelected);

            if (isSelected) {
                if (existingResponseIndex === -1) {
                    // Create new response object
                    const newResponse = {
                        value: {
                            id: option._id,
                            label: option.label,
                            isActionPlanEnabled: option.isActionPlanEnabled,
                            isGetDataEnabled: option.isGetDataEnabled,
                            isDimitraModulesEnabled: option.isDimitraModulesEnabled
                        },
                        actionPlanResponses: [],
                        getDataResponses: [],
                    };

                    // Initialize action plans if enabled
                    if (option.isActionPlanEnabled && option.actionPlans) {
                        option.actionPlans = option.actionPlans.map(plan => ({
                            ...plan,
                            files: [],
                            uploadedFiles: [],
                            isUploading: false
                        }));
                    }

                    this.currentQuestion.response.push(newResponse);
                }
            } else {
                if (existingResponseIndex !== -1) {
                    this.currentQuestion.response.splice(existingResponseIndex, 1);
                }
            }

            this.$forceUpdate();
        },

        handleNestedCheckboxChange(option, getDataQuestion) {
            if (!getDataQuestion.response) {
                this.$set(getDataQuestion, 'response', []);
            }

            if (option.selected) {
                if (!getDataQuestion.response.includes(option.label)) {
                    getDataQuestion.response.push(option.label);
                }
            } else {
                getDataQuestion.response = getDataQuestion.response.filter(label => label !== option.label);
            }
        },
        handleGetDataCheckboxChange(opt, getDataQuestion) {
            if (!getDataQuestion.response) {
                this.$set(getDataQuestion, 'response', []);
            }

            if (opt.selected) {
                if (!getDataQuestion.response.includes(opt.label)) {
                    getDataQuestion.response.push(opt.label);
                }
            } else {
                getDataQuestion.response = getDataQuestion.response.filter(label => label !== opt.label);
            }
        },
        onRadioChange(selectedValue) {
            const optionIndex = this.currentQuestion.options.findIndex(opt => opt._id == selectedValue);
            if (optionIndex !== -1) {
                const selected = { ...this.currentQuestion.options[optionIndex] };
                if (selected.isGetDataEnabled && selected.getDataQuestions) {
                    selected.getDataQuestions = selected.getDataQuestions.map(q => ({
                        ...q,
                        response: null,
                        files: [],
                        uploadedFiles: []
                    }));
                }
                if (selected.isActionPlanEnabled && selected.actionPlans) {


                    selected.actionPlans = selected.actionPlans.map(plan => ({
                        ...plan,
                        files: [],
                        uploadedFiles: [],
                        isUploading: false
                    }));

                    console.log('selected.actionPlans', selected.actionPlans);
                }

                this.$set(this.currentQuestion.options, optionIndex, selected);
                this.currentQuestion.response = {
                    value: selected?._id
                };
            }
            this.$forceUpdate();
        },
        updateGetDataResponse({ questionId, value, dataType }) {
            console.log('updateGetDataResponse', questionId, value, dataType);
            // Find the current question's index in the main questions array
            const questionIndex = this.questions.findIndex(q => q._id === this.currentQuestion._id);
            if (questionIndex === -1) return;

            // Get the current question from the main array
            let question = this.questions[questionIndex];

            if (question.questionType === 'check-boxes') {
                // Handle checkbox case
                // Find the selected option's response
                const selectedOption = question.options.find(opt =>
                    opt.getDataQuestions.some(gdq => gdq._id === questionId)
                );
                if (!selectedOption) return;

                const responseIndex = question.response.findIndex(resp =>
                    resp.value.id === selectedOption._id
                );
                if (responseIndex === -1) return;

                // Initialize getDataResponses if it doesn't exist
                if (!question.response[responseIndex].getDataResponses) {
                    this.$set(question.response[responseIndex], 'getDataResponses', []);
                }

                // Find existing response for this checkbox option
                const existingIndex = question.response[responseIndex].getDataResponses
                    .findIndex(response => response.id === questionId);

                // Create the response object
                const response = {
                    id: questionId,
                    title: selectedOption.getDataQuestions.find(q => q._id === questionId)?.title || '',
                    dataType: dataType,
                    value: value
                };

                // Update the response
                if (existingIndex !== -1) {
                    this.$set(
                        question.response[responseIndex].getDataResponses,
                        existingIndex,
                        response
                    );
                } else {
                    question.response[responseIndex].getDataResponses.push(response);
                }

                // Ensure the array is reactive
                this.$set(
                    question.response[responseIndex],
                    'getDataResponses',
                    [...question.response[responseIndex].getDataResponses]
                );

            } else if (question.questionType === 'radio-button') {
                // Handle radio button case
                // Initialize getDataResponses if it doesn't exist
                if (!question.response.getDataResponses) {
                    this.$set(question.response, 'getDataResponses', []);
                }

                console.log('question.response.getDataResponses', question.response.getDataResponses, questionId);

                // Find existing response
                const existingIndex = question.response.getDataResponses
                    .findIndex(response => response.id === questionId);

                // Create the response object
                const response = {
                    id: questionId,
                    title: this.selectedRadioOption.getDataQuestions.find(q => q._id === questionId)?.title || '',
                    dataType: dataType,
                    value: value
                };

                console.log('response updateGetDataResponse', response, questionId, dataType, value, existingIndex);

                // Update the response
                if (existingIndex !== -1) {
                    this.$set(question.response.getDataResponses, existingIndex, response);
                } else {
                    question.response.getDataResponses.push(response);
                }

                // Ensure the array is reactive
                this.$set(
                    question.response,
                    'getDataResponses',
                    [...question.response.getDataResponses]
                );
            }
            else if (question.questionType === 'get-data') {
                console.log('this.currentQuestion.response step 3', question, this.questions[this.currentQuestionIndex].response, this.currentQuestion.response, this.currentQuestion.response && this.currentQuestion.response.length > 0);
                if (!Array.isArray(question.response)) {
                    console.log('this.currentQuestion.response', this.currentQuestion.response && this.currentQuestion.response.length > 0);
                    if (this.currentQuestion.response && this.currentQuestion.response.length > 0) {
                        this.$set(question, 'response', this.currentQuestion.response);
                    }
                    else {
                        this.$set(question, 'response', []);
                    }
                }
                // Find existing response for this getDataQuestion
                const existingIndex = question.response.findIndex(resp => resp && resp.id === questionId);

                console.log('existingIndex', existingIndex, question.response, questionId);
                const response = {
                    id: questionId,
                    title: question.getDataQuestions.find(q => q._id === questionId)?.title || '',
                    dataType: dataType,
                    value: value
                };

                console.log('response updateGetDataResponse', response, questionId, dataType, value);


                if (existingIndex !== -1) {
                    this.$set(question.response, existingIndex, response);
                } else {
                    question.response.push(response);
                }

                console.log('question>>>>>', question);

                // Ensure reactivity
                this.$set(this.questions, existingIndex, question);

                this.currentQuestion = JSON.parse(JSON.stringify(question));
            }

            else {
                // Update both the questions array and currentQuestion
                this.$set(this.questions, questionIndex, question);
                this.currentQuestion = JSON.parse(JSON.stringify(question)); // Deep clone to ensure reactivity
            }

            this.$forceUpdate();

            console.log('Updated question:', {
                questionType: question.questionType,
                response: question.response,
                getDataResponses: question.questionType === 'check-boxes'
                    ? question.response.map(r => r.getDataResponses)
                    : question.response.getDataResponses
            });


        },
        validateFiles() {
            this.fileErrors = {};
            let isValid = true;

            if (this.currentQuestion.questionType === 'attach-files' && this.currentQuestion.isMandatory) {
                if (!this.currentQuestion.uploadedFiles?.length && !this.currentQuestion.response?.value?.length) {
                    this.$set(this.fileErrors, this.currentQuestion._id, this.$t('esgPlatform.surveyResponse.fileRequired'));
                    isValid = false;
                }
            }

            if (this.currentQuestion.getDataQuestions) {
                for (const gdq of this.currentQuestion.getDataQuestions) {
                    if (gdq.dataType === 'attach-file' && gdq.isMandatory) {
                        const response = this.currentQuestionResponse(gdq);
                        if (!response || !response.length) {
                            this.$set(this.fileErrors, gdq._id, this.$t('esgPlatform.surveyResponse.fileRequired'));
                            isValid = false;
                        }
                    }
                }
            }

            return isValid;
        },
        validateSignatures() {
            this.signatureErrors = {};
            let isValid = true;

            // Check get-data questions
            if (this.currentQuestion.getDataQuestions) {
                for (const gdq of this.currentQuestion.getDataQuestions) {
                    if (gdq.dataType === 'digital-signature' && gdq.isMandatory) {
                        const response = this.currentQuestionResponse(gdq);
                        if (!response || !response.key) {
                            this.$set(this.signatureErrors, gdq._id, this.$t('esgPlatform.surveyResponse.signatureRequired'));
                            isValid = false;
                        }
                    }
                }
            }

            // Check main question if it's a signature type
            if (this.currentQuestion.questionType === 'digital-signature' && this.currentQuestion.isMandatory) {
                if (!this.currentQuestion.response?.value?.key) {
                    this.$set(this.signatureErrors, this.currentQuestion._id, this.$t('esgPlatform.surveyResponse.signatureRequired'));
                    isValid = false;
                }
            }

            return isValid;
        },
        getMeasurementValue(getDataQuestion) {
            const resp = this.currentQuestionResponse(getDataQuestion);
            return resp && typeof resp === 'object' ? resp.value : resp || '';
        },
        getSelectedUnit(getDataQuestion) {
            const resp = this.currentQuestionResponse(getDataQuestion);
            if (resp && typeof resp === 'object' && resp.unit && resp.unit.id) return resp.unit.id;
            return getDataQuestion.additionalSettings?.measurementUnit || '';
        },
        updateMeasurementResponse(getDataQuestion, value, unitId) {
            const unitType = this.getMeasurementUnitType(getDataQuestion);
            const unitObj = this.unitMeta[unitId] || {
                id: unitId,
                name: unitId,
                abbr: unitId,
                factor: 1,
                category: unitType
            };
            this.updateGetDataResponse({
                questionId: getDataQuestion._id,
                value: {
                    ...unitObj,
                    value
                },
                dataType: getDataQuestion.dataType
            });
        },
        onUnitTypeChange(getDataQuestion, type) {
            // Set the new type
            this.$set(getDataQuestion.additionalSettings, 'measurementUnitType', type);

            // Set the first unit of the new type
            const firstUnit = this.unitTypeList[type]?.[0] || '';

            // Set the new unit in additionalSettings
            this.$set(getDataQuestion.additionalSettings, 'measurementUnit', firstUnit);

            // Update the response with the new type and unit, and clear the value
            this.updateMeasurementResponse(getDataQuestion, '', firstUnit);

            // Also, clear any previous value in the response array (if present)
            const respIdx = this.currentQuestion.response?.findIndex?.(r => r.id === getDataQuestion._id);
            if (respIdx !== undefined && respIdx !== -1) {
                this.$set(this.currentQuestion.response, respIdx, {
                    id: getDataQuestion._id,
                    title: getDataQuestion.title,
                    dataType: getDataQuestion.dataType,
                    value: {
                        ...this.unitMeta[firstUnit],
                        value: ''
                    }
                });
            }

            this.$forceUpdate();
        },
        onUnitChange(getDataQuestion, unitId) {
            this.$set(getDataQuestion.additionalSettings, 'measurementUnit', unitId);
            this.updateMeasurementResponse(getDataQuestion, this.getMeasurementValue(getDataQuestion), unitId);
        },
        getMeasurementUnitType(getDataQuestion) {
            const resp = this.currentQuestionResponse(getDataQuestion);
            if (resp && typeof resp === 'object' && resp.category) {
                return resp.category;
            }
            return getDataQuestion.additionalSettings?.measurementUnitType || '';
        },
        getMeasurementUnit(getDataQuestion) {
            const resp = this.currentQuestionResponse(getDataQuestion);
            if (resp && typeof resp === 'object' && resp.id) return resp.id;
            if (typeof resp === 'string') return resp;
            return getDataQuestion.additionalSettings?.measurementUnit || '';
        },
        getCheckboxOptionGetDataResponses(option) {
            const response = (this.currentQuestion.response || []).find(
                resp => resp?.value?.id === option._id
            );
            return response?.getDataResponses || [];
        },
        getCheckboxOptionActionPlanResponses(option) {
            const response = (this.currentQuestion.response || []).find(
                resp => resp?.value?.id === option._id
            );
            return response?.actionPlanResponses || [];
        },
    },
};
</script>

<style lang="scss" scoped>
.survey-content {
    padding: 30px 20px;
}

.goal-title-container {
    width: 100%;
    max-width: 60%;
}

.goal-title {
    font-size: 24px;
    line-height: 1.4;
    margin: 0;
    word-wrap: break-word;
}

.question-heading {
    font-size: 18px;
    line-height: 1.4;
}

.question-text {
    font-size: 16px;
    line-height: 1.6;
    margin-bottom: 8px;
}

.progress-bar-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px 0;
}

.progress-bar {
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 96%;
}

.step-line {
    height: 8px;
    background-color: #d3d3d3;
    flex-grow: 1;
    margin: 0 5px;
    transition: background-color 0.3s ease;

    &.completed {
        background-color: #00bd73;
    }

    &.active {
        background-color: #00bd73;
        opacity: 0.7;
    }
}

.step-navigation {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
}

.step-badge {
    background-color: #00bd73;
    color: white;
    padding: 1px;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    margin: 0 10px;
}

.arrow-button {
    background: #00bd73;
    border: 1px solid #00bd73;
    border-radius: 50%;
    width: 24px;
    height: 24px;
}

.survey-question {
    width: 100%;
    max-width: 96%;
    margin: 0 auto;
}

.navigation-btn {
    min-width: 120px;
}

.upload-document {
    width: 100%;
}

.dropZone {
    width: 90%;
    height: 175px;
    position: relative;
    border: 2px dashed #97a8b8;
}

.dropZone:hover {
    border: 2px solid $primary-color;
}

.dropZone:hover .dropZone-title {
    color: $primary-color;
}

.dropZone-info {
    color: #a8a8a8;
    position: absolute;
    top: 50%;
    width: 100%;
    transform: translate(0, -50%);
    text-align: center;
    font-size: 12px;

    .underline {
        text-decoration: underline;
        color: #0057BD;
    }

    .blue-color {
        color: #0057BD;
    }
}

.dropZone-title {
    color: #787878;
}

.dropZone input {
    position: absolute;
    cursor: pointer;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
}

.dropZone-over {
    background: #5c5c5c;
    opacity: 0.8;
}

.pdf-docs {
    display: flex;
    justify-content: start;
}

.pdf-box {
    height: 90px;
    width: 90px;
    background-color: #e5f8f1;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    border-radius: 4px;
}

.delete-icon {
    position: absolute;
    top: 5px;
    right: 5px;
    color: #135b00;
    cursor: pointer;
}

.file-extension {
    font-size: 18px;
    color: #135b00;
    margin: 0;
    line-height: 1;
}

.file-name {
    display: block;
    font-size: 12px;
    color: #333;
    margin-top: 5px;
    text-align: center;
    word-break: break-all;
}

.docs-box {
    display: flex;
    justify-content: center;
}

.docs-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.img-item {
    display: flex;
    flex-direction: column;
    align-items: left;
}

.text-box {
    display: flex;
    align-items: center;
    width: 60%;
}

.signature-section {
    margin-top: 10px;
}

.signature-section img {
    border: 1px solid #e0e0e0;
    padding: 5px;
    background-color: #f5f5f5;
}

.question-description {
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 16px;
}

@media (max-width: 600px) {
    .survey-content {
        padding: 20px 10px;
    }

    .goal-title-container {
        max-width: 100%;
    }

    .goal-title {
        font-size: 20px;
    }

    .question-heading {
        font-size: 16px;
    }

    .question-text {
        font-size: 14px;
    }

    .progress-bar {
        width: 100%;
    }

    .step-line {
        margin: 0 3px;
        height: 4px;
    }

    .step-badge {
        font-size: 12px;
        width: 20px;
        height: 20px;
    }

    .arrow-button {
        width: 20px;
        height: 20px;
    }

    .navigation-btn {
        width: 100%;
        margin: 4px 0 !important;
    }

    .v-btn {
        width: 100%;
    }

    .pdf-box {
        height: 60px;
        width: 60px;
    }

    .file-extension {
        font-size: 14px;
    }

    .file-name {
        font-size: 10px;
    }

    .dropZone {
        height: 150px;
    }
}

.recommendation-text {
    color: #666;
    font-size: 14px;
    line-height: 1.6;
    border: 1px solid #FFB443;
    background-color: #FFFAEA;
    border-radius: 4px;
}
</style>