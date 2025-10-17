<template>
    <v-dialog v-model="dialog" max-width="600px" persistent>
        <v-card>
            <v-card-title class="text-h6 font-weight-bold white--text" style="background-color: #117443;">
                {{ $t('View Question Answer') }}
                <v-spacer></v-spacer>
                <v-btn icon dark @click="closeDialog">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>

            <v-card-text class="pa-6">
                <div v-if="questionData">
                    <!-- Context Information Section -->
                    <div v-if="hasContextData" class="mb-6">
                        <v-expansion-panels v-model="contextPanel" multiple>
                            <v-expansion-panel>
                                <v-expansion-panel-header>
                                    <div class="text-subtitle-1 font-weight-bold">
                                        {{ $t('Context Information') }}
                                    </div>
                                </v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <div class="context-info">
                                        <!-- Issue Information -->
                                        <div v-if="questionData.issue" class="mb-3">
                                            <div class="text-subtitle-2 font-weight-bold text-primary mb-1">
                                                {{ $t('Issue') }}:
                                            </div>
                                            <div class="text-body-2">
                                                <strong>{{ questionData.issue.title }}</strong>
                                                <v-chip small class="ml-2"
                                                    :color="getIssueTypeColor(questionData.issue.type)">
                                                    {{ questionData.issue.type }}
                                                </v-chip>
                                            </div>
                                        </div>

                                        <!-- Goal Information -->
                                        <div v-if="questionData.goal" class="mb-3">
                                            <div class="text-subtitle-2 font-weight-bold text-primary mb-1">
                                                {{ $t('Goal') }}:
                                            </div>
                                            <div class="text-body-2">
                                                {{ questionData.goal.title }}
                                            </div>
                                        </div>

                                        <!-- Assessment Information -->
                                        <div v-if="questionData.assessment" class="mb-3">
                                            <div class="text-subtitle-2 font-weight-bold text-primary mb-1">
                                                {{ $t('Assessment') }}:
                                            </div>
                                            <div class="text-body-2">
                                                <strong>{{ questionData.assessment.title }}</strong>
                                                <div class="text-caption mt-1">
                                                    {{ questionData.assessment.description }}
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Heading Information -->
                                        <div v-if="questionData.heading" class="mb-3">
                                            <div class="text-subtitle-2 font-weight-bold text-primary mb-1">
                                                {{ $t('Section') }}:
                                            </div>
                                            <div class="text-body-2">
                                                <strong>{{ questionData.heading.title }}</strong>
                                                <div v-if="questionData.heading.targetYear" class="text-caption mt-1">
                                                    {{ $t('Target Year') }}: {{ questionData.heading.targetYear }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </div>

                    <!-- Question Section -->
                    <div class="mb-4">
                        <div class="text-h6 font-weight-bold mb-2">
                            {{ getQuestionIndex() }} {{ getQuestionTitle() }}
                        </div>
                        <div v-if="getQuestionDescription()" class="text-body-1">
                            {{ getQuestionDescription() }}
                        </div>
                        <div v-if="getQuestionScore()" class="text-caption text-grey mt-1">
                            {{ $t('Score') }}: {{ getQuestionScore() }}
                        </div>
                    </div>

                    <!-- Answer Section -->
                    <div>
                        <div class="text-h6 font-weight-bold mb-2">
                            {{ $t('Answer') }}
                        </div>
                        <div class="text-body-1">
                            <span v-html="formatAnswer"></span>
                        </div>
                    </div>
                </div>
            </v-card-text>

            <v-card-actions class="pa-6 justify-end">
                <v-btn color="primary" @click="closeDialog">
                    {{ $t('Close') }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'QuestionDialog',
    props: {
        dialog: {
            type: Boolean,
            default: false
        },
        questionData: {
            type: Object,
            default: null
        },
        answerData: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            contextPanel: [] // Default to closed/minimized context panel
        };
    },
    computed: {
        hasContextData() {
            return this.questionData && (
                this.questionData.issue ||
                this.questionData.goal ||
                this.questionData.assessment ||
                this.questionData.heading
            );
        },
        formatAnswer() {
            if (!this.answerData || !this.answerData.response) return this.$t('No Answer');

            const response = this.answerData.response || {};
            const type = this.getQuestionType();

            // Handle different item types like ValidationData.vue does
            if (this.answerData.type === 'actionPlan') {
                let result = `<span class="font-weight-bold">${response.title || 'No title'}</span>`;
                if (response.files?.length) {
                    const filesHtml = response.files.map(file => this.formatFile(file)).join('<br>');
                    result += `<div>${filesHtml}</div>`;
                }
                return result;
            } else if (this.answerData.type === 'getData') {
                const value = response?.value;
                if (!value && value !== 0) return 'No data';
                if (typeof value === 'string' || typeof value === 'number') {
                    return value.toString();
                } else if (Array.isArray(value)) {
                    return value.join(', ');
                } else if (typeof value === 'object' && value !== null) {
                    if (value.id && value.abbr && 'value' in value) {
                        return `${value.value} ${value.abbr}`;
                    } else if (value.key || value.fileUrl || value.attachmentLink) {
                        return this.formatFile({
                            fileUrl: value.fileUrl || value.attachmentLink,
                            fileName: value.fileName,
                            key: value.key
                        });
                    }
                    return JSON.stringify(value);
                }
                return 'No data';
            } else {
                // Main response - use the same logic as ValidationData.vue
                switch (type) {
                    case 'text-field':
                    case 'text-area':
                    case 'numeric':
                        return response.value ?? 'No response';
                    case 'radio-button':
                        return response.value?.label || 'No selection';
                    case 'check-boxes':
                        if (Array.isArray(response.value)) {
                            return response.value.map(sel => sel.label || 'Unknown').join(', ');
                        } else if (response.value?.label) {
                            return response.value.label;
                        }
                        return 'No selection';
                    case 'measurement-unit':
                        return response.value ? `${response.value.value || ''} ${response.value.abbr || ''}` : 'No measurement';
                    case 'attach-files':
                        if (Array.isArray(response.value)) {
                            return response.value.map(file => this.formatFile(file)).join('<br>');
                        }
                        return 'No file';
                    case 'digital-signature':
                        if (response.value?.attachmentLink) {
                            return this.isImage(response.value.attachmentLink)
                                ? `<img src="${response.value.attachmentLink}" alt="Signature" style="max-width: 200px;" />`
                                : `<a href="${response.value.attachmentLink}" target="_blank">View Signature</a>`;
                        }
                        return 'No signature';
                    case 'get-data':
                        return 'No data'; // Handled separately by getData items
                    default:
                        return 'Unknown type';
                }
            }
        }
    },
    methods: {
        closeDialog() {
            this.$emit('close');
        },
        getQuestionIndex() {
            // Handle both old and new data structures
            if (this.questionData.index) {
                return this.questionData.index;
            } else if (this.questionData.heading?.order && this.questionData.order) {
                return `${this.questionData.heading.order}.${this.questionData.order}`;
            } else if (this.questionData.question?.order) {
                return this.questionData.question.order;
            } else if (this.questionData.order) {
                return this.questionData.order;
            }
            return '';
        },
        getQuestionTitle() {
            // Handle both old and new data structures
            if (this.questionData.question?.title) {
                return this.questionData.question.title;
            } else if (this.questionData.title) {
                return this.questionData.title;
            }
            return '';
        },
        getQuestionDescription() {
            // Handle both old and new data structures
            if (this.questionData.question?.description) {
                return this.questionData.question.description;
            } else if (this.questionData.description) {
                return this.questionData.description;
            }
            return '';
        },
        getQuestionType() {
            // Handle both old and new data structures
            if (this.questionData.question?.questionType) {
                return this.questionData.question.questionType;
            } else if (this.questionData.questionType) {
                return this.questionData.questionType;
            }
            return '';
        },
        getQuestionScore() {
            // Handle both old and new data structures
            if (this.questionData.question?.score) {
                return this.questionData.question.score;
            } else if (this.questionData.score) {
                return this.questionData.score;
            }
            return null;
        },
        getIssueTypeColor(type) {
            const colorMap = {
                'Environmental': 'green',
                'Social': 'blue',
                'Governance': 'purple',
                'Economic': 'orange'
            };
            return colorMap[type] || 'grey';
        },
        formatFile(file) {
            // Handle different file object structures
            const url = file.fileUrl || file.url || `https://dimitra-pre-prod-public-images.s3.amazonaws.com/${file.key}`;
            const name = file.fileName || file.name || file.key || 'Unnamed file';
            return this.isImage(name)
                ? `<img src="${url}" alt="${name}" style="max-width: 200px;" />`
                : `<a href="${url}" target="_blank">${name}</a>`;
        },
        isImage(fileString) {
            const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg'];
            const path = (fileString || '').split('?')[0];
            const ext = path.slice(path.lastIndexOf('.')).toLowerCase();
            return imageExtensions.includes(ext);
        }
    }
}
</script>

<style scoped>
.v-card-title {
    padding: 16px 24px;
}

.context-info {
    padding: 8px 0;
}

.context-info .text-subtitle-2 {
    color: #117443;
}

.context-info .text-caption {
    color: #666;
    font-style: italic;
}

.v-expansion-panel-header {
    padding: 12px 16px;
}

.v-expansion-panel-content {
    padding: 0 16px 16px;
}
</style>
