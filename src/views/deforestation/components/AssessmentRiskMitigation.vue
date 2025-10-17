<template>
    <div class="px-4">
        <breadcrumb :items="breadcrumbs"></breadcrumb>

        <div class="wrapper">
            <v-row style="justify-content: space-between;">
                <v-col cols="11">
                    <h1>{{ $t("deforestation.assessmentRiskMitigation") }}</h1>
                </v-col>
                <v-col cols="1">
                    <v-btn block color="primary" @click="navigateBack">
                        {{ $t("back") }}
                    </v-btn>
                </v-col>
            </v-row>

            <v-card class="px-5 py-5 mt-4" rounded outlined>
                <h2>{{ mitigation.assessmentQuestion.title || "" }}</h2>

                <section class="details">
                    <h3 class="my-4">{{ $t("deforestation.assessmentDetails") }}</h3>

                    <p><span class="font-weight-bold">{{ $t("traceability.title") }}</span>: {{ mitigation.assessment.title || "" }}
                    </p>
                    <p>
                        <span class="font-weight-bold">{{ $t("memberDataSection.farm") }}</span>: {{ farmname }}
                        <span class="ml-4 font-weight-bold">{{ $t("memberDataSection.farmer") }}</span>: {{ farmOwner }}
                    </p>
                    <p><span class="font-weight-bold">{{ $t("deforestation.dateSubmitted") }}</span>: {{
            beautifyDate(mitigation.createdAt) }}</p>
                    <br>
                </section>

                <section>
                    <h3 class="my-5">{{ mitigation.assessmentQuestionOption.label }}</h3>

                    <v-checkbox v-for="(item, i) in mitigation.assessmentQuestionOption.checklists" :key="i"
                        v-model="checklistResponse[i]" @change="updateChecklist" :label="item"></v-checkbox>
                </section>
            </v-card>

            <v-row class="mb-5">
                <v-col cols="12" sm="9">
                    <v-card class="px-5 py-5 mt-4" rounded outlined>
                        <div class="tabs">
                            <v-btn v-for="(tab, i) in tabs" :key="i"
                                :class="selectedTab === i ? 'primary' : 'grey darken-1'" @click="switchTab(i)"
                                outlined>{{ tab }}</v-btn>
                        </div>
                        <section class="tabs">
                            <div class="fluid" v-if="selectedTab === 0">
                                <section class="comment-box">
                                    <v-row>
                                        <v-col cols="1">
                                            <v-avatar color="grey">
                                                <span class="black--text text-h5">{{ getInitials(currentUser) }}</span>
                                            </v-avatar>
                                        </v-col>
                                        <v-col cols="10">
                                            <v-textarea id="comment" :label="$t('deforestation.addAComment')" v-model="comment"
                                                auto-grow outlined rows="1" row-height="15" append-icon="mdi-attachment"
                                                @click:append="triggerFileUpload"></v-textarea>
                                            <v-file-input id="attachment" v-model="attachment" style="display: none;"
                                                accept="image/*,.pdf"></v-file-input>
                                            <article v-if="attachment" class="file-chip ma-0">
                                                <v-row>
                                                    <v-col cols="1">
                                                        <v-icon large>
                                                            {{ attachment.type.includes('image') ?
            'mdi-file-image-outline' : 'mdi-file-document-outline' }}
                                                        </v-icon>
                                                    </v-col>
                                                    <v-col cols="11">
                                                        <h4>{{ attachment.name }}</h4>
                                                        <span>{{ (attachment.size / 1024).toFixed(0) }} KB</span>
                                                    </v-col>
                                                </v-row>
                                            </article>
                                        </v-col>
                                        <v-col cols="1">
                                            <v-btn color="primary" fab @click="submitComment">
                                                <v-icon>mdi-send</v-icon>
                                            </v-btn>
                                        </v-col>
                                    </v-row>

                                    <div class="seperator"></div>

                                    <v-row class="mb-5" v-for="discussion in mitigation.assessmentMitigationDiscussions"
                                        :key="discussion.id">
                                        <v-col cols="1">
                                            <v-avatar color="grey">
                                                <span class="black--text text-h5">{{ getInitials(discussion.user)
                                                    }}</span>
                                            </v-avatar>
                                        </v-col>
                                        <v-col cols="10">
                                            <p>{{ discussion.comment }}</p>

                                            <article v-for="(attachment, i) in discussion.attachments" :key="i"
                                                class="file-chip">
                                                <v-row>
                                                    <v-col cols="1">
                                                        <v-icon large>
                                                            {{ attachment.fileMetadata.mimeType.includes('image') ?
            'mdi-file-image-outline' : 'mdi-file-document-outline' }}
                                                        </v-icon>
                                                    </v-col>
                                                    <v-col cols="10">
                                                        <h4>{{ fileNameFromS3Path(attachment.filePath) }}</h4>
                                                        <span>{{ (parseInt(attachment.fileMetadata.size) /
            1024).toFixed(0) }} KB</span>
                                                    </v-col>
                                                    <v-col cols="1">
                                                        <v-btn
                                                            @click="downloadFile(attachment.filePath, attachment.fileMetadata.mimeType)"
                                                            icon>
                                                            <v-icon>mdi-download</v-icon>
                                                        </v-btn>
                                                    </v-col>
                                                </v-row>
                                            </article>

                                            <a @click:prevent="hightlightComment" class="reply">{{ $t("deforestation.reply") }}</a>
                                        </v-col>
                                    </v-row>
                                </section>
                            </div>
                            <div class="fluid" v-else>
                                <v-data-table :headers="attachmentHeaders" :items="attachments" class="elevation-0">
                                    <template v-slot:item.filePath="{ item }">
                                        <v-row>
                                            <v-col cols="1">
                                                <v-icon>
                                                    {{ item.fileMetadata.mimeType.includes('image') ?
            'mdi-file-image-outline' : 'mdi-file-document-outline' }}
                                                </v-icon>
                                            </v-col>
                                            <v-col cols="11">
                                                <span>{{ fileNameFromS3Path(item.filePath) }}</span>
                                            </v-col>
                                        </v-row>
                                    </template>

                                    <template v-slot:item.fileMetadata.size="{ item }">
                                        {{ (parseInt(item.fileMetadata.size) / 1024).toFixed(0) }}
                                    </template>

                                    <template v-slot:item.createdAt="{ item }">
                                        {{ beautifyDate(item.createdAt) }}
                                    </template>

                                    <template v-slot:item.fileMetadata.filePath="{ item }">
                                        <v-btn class="ma-2" outlined fab @click="openInNewTab(item.filePath)"
                                            color="primary">
                                            <v-icon>mdi-eye-outline</v-icon>
                                        </v-btn>
                                        <v-btn class="ma-2" outlined fab
                                            @click="downloadFile(item.filePath, item.fileMetadata.mimeType)"
                                            color="primary">
                                            <v-icon>mdi-download</v-icon>
                                        </v-btn>
                                    </template>
                                </v-data-table>
                            </div>
                        </section>
                    </v-card>
                </v-col>
                <v-col cols="12" sm="3">
                    <v-card class="pa-2 mt-4 mb-1 bg-yellow" rounded outlined>
                        <p class="text-center mb-0 bg-yellow">{{ $t("deforestation.assignedUser") }}</p>
                    </v-card>
                    <v-card class="px-5 py-5" rounded outlined>
                        <v-card-text class="pt-4">
                            <p class="mb-2">
                                {{ $t("deforestation.changeAssignee") }}
                            </p>
                            <v-select  :items="users" :placeholder="$t('deforestation.selectAssignee')" v-model="selectedUser" item-text="name" item-value="id" @change="updateMitigation" outlined dense></v-select>
                        </v-card-text>
                    </v-card>
                  <v-card class="pa-2 mt-4 mb-1 bg-yellow" rounded outlined>
                    <p class="text-center mb-0 bg-yellow">{{ $t("status") }}</p>
                  </v-card>
                  <v-card class="px-5 py-5" rounded outlined>
                    <v-card-text class="pt-4">
                      <p class="text-center">
                        <v-chip :class="statusColor(selectedStatus)" outlined>
                          {{ selectedStatusLabel  }}
                        </v-chip>
                      </p>
                      <div class="seperator"></div>
                      <div class="status-update">
                        <p class="mb-2">
                          {{ $t("deforestation.changeStatus") }}
                        </p>
                        <v-select name="status-select" :items="statuses" item-text="label" item-value="value" :placeholder="$t('dueDiligence.selectStatus')"
                                  v-model="selectedStatus" @change="updateMitigation" outlined dense></v-select>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin";
import DownloadMixin from "@/mixins/DownloadMixin";
import DeforestationService from "@/_services/DeforestationService";
import S3UploadService from "@/_services/S3UploadService";

export default {
    data() {
        return {
            farmname: '',
            mitigation: {
                assessment: {
                    title: this.$t("deforestation.loading"),
                },
                productionPlace: {
                    farm: {
                        farmName: this.$t("deforestation.loading"),
                        farmOwner: null
                    }
                },
                assessmentQuestion: {
                    title: this.$t("deforestation.loading"),
                },
                assessmentQuestionOption: {
                    checklists: []
                }
            },
            tabs: [
                this.$t("deforestation.discussion"),
                this.$t("deforestation.attachment"),
            ],
            selectedTab: 0,
            selectedStatus: '',
            comment: '',
            attachment: null,
            checklistResponse: [],
            breadcrumbs: [
                {
                    text: this.$t("deforestation.dueDeligence"),
                    disabled: true,
                    to: "/",
                },
                {
                    text: this.$t("deforestation.deforestationComplianceReport"),
                    disabled: true,
                    to: "breadcrumbs_link_1",
                },
                {
                    text: this.$t("deforestation.riskAssessment"),
                    disabled: true,
                    to: "breadcrumbs_link_1",
                },
                {
                    text: this.$t("deforestation.riskMitigation"),
                    disabled: true,
                    to: "breadcrumbs_link_1",
                },
            ],
            statuses: [
           
            {
            label: this.$t('deforestation.veryHigh'),
            value: "very_high",
            },
            {
            label: this.$t('deforestation.high'),
            value: "high",
            },
            {
            label: this.$t('deforestation.medium'),
            value: "medium",
            },
            {
            label: this.$t('deforestation.low'),
            value: "low",
            },
            {
            label: this.$t('deforestation.zeroOrNegligible'),
            value: "zero",
            },
            ],
            users: [],
            currentUser: {},
            assignedUser: {},
            selectedUser: '',
            updating: false,
            updatingChecklist: false,
            attachments: [],
            attachmentHeaders: [
                {
                    text: this.$t('oma.fileName'),
                    align: 'start',
                    value: 'filePath',
                    sortable: true
                },
                {
                    text: this.$t('deforestation.sizeKb'),
                    value: 'fileMetadata.size',
                    align: 'center',
                    sortable: true
                },
                {
                    text: this.$t('deforestation.dateAdded'),
                    value: 'createdAt',
                    sortable: true
                },
                {
                    text: '',
                    value: 'fileMetadata.filePath',
                    sortable: false
                }
            ]
        }
    },
    async created() {
      this.getCurrentUser();
    },
    async mounted(){
        await Promise.all([
            this.fetchRiskMitigation(),
            this.getOrganizationUsers(),
        ]);
    },

  watch: {
    assignedUser(newVal) {
      this.selectedUser = newVal?.id;
    }
  },

    computed: {
        getOrganizationId() {
            return this.currentUser.user_organization?.id;
        },
        getAttachmentInput() {
            return document.getElementById('attachment');
        },
        getCommentInput() {
            return document.getElementById("comment");
        },
        getAssessmentMitigationId() {
            return this.$route.params.id;
        },
        farmName() {
            return this.mitigation.productionPlace?.farm?.farmName || "";
        },
        farmOwner() {
            return this.mitigation.productionPlace?.farm?.farmOwner || 'N/A';
        },
        selectedStatusLabel() {
        const foundStatus = this.statuses.find(status => status.value === this.selectedStatus);
        return foundStatus ? foundStatus.label : ''; // Return label or an empty string if not found
    }
    },
    methods: {
        switchTab(index) {
            this.selectedTab = index;
        },
        statusColor(status) {
            switch (status) {
        case 'very_high':
          return 'very-high';
        case 'high':
            return 'high';
        case 'medium':
            return 'medium';
         case 'low':
          return 'low';
          case 'zero':
          return 'zero';  
        default:
          return '';
        }
        },
        navigateBack() {
            history.back();
        },
        fileNameFromS3Path(path) {
            return path.split('/').slice(-1)[0];
        },
        beautifyDate(date) {
            return date?.split('T')[0];
        },
        hightlightComment() {
            this.getCommentInput.click();
        },
        async downloadFile(filePath, type) {
            await this.downloadSourceFile(filePath, type, this.fileNameFromS3Path(filePath));
        },
        openInNewTab(link) {
            window.open(link, '_blank').focus()
        },
        setAssignedUser() {
          this.assignedUser = this.users.find((user) => parseInt(user.id) === parseInt(this.mitigation.assignedUserId));
        },
        updateChecklistUI(newChecklist) {
            newChecklist.forEach((item) => {
                this.mitigation.assessmentQuestionOption.checklists.forEach((opt, i) => {
                    if (item.checklistTitle === opt) {
                        this.checklistResponse[i] = true;
                    }
                })
            });
        },
        async fetchRiskMitigation() {
            const result = await DeforestationService.getAssessmentMitigationDetail(this.getAssessmentMitigationId);

            if (result.errors) {
                console.log(result.errors);
            }

            this.mitigation = result.data.assessmentMitigation;
            this.setAssignedUser();
            this.selectedStatus = this.mitigation.mitigationStatus;
            this.selectedUser = this.mitigation.assignedUserId;

            if (this.mitigation.checkLists.length > 0) {
                this.updateChecklistUI(this.mitigation.checkLists);
            }

            if (this.mitigation.assessmentMitigationDiscussions.length > 0) {
                this.mitigation.assessmentMitigationDiscussions.forEach((discussion) => {
                    if (discussion.attachments && discussion.attachments.length > 0) {
                        this.attachments.push(...discussion.attachments);
                    }
                });
            }
        },
        triggerFileUpload() {
            this.getAttachmentInput.click();
        },
        async submitComment() {
            if (this.comment.length === 0) {
                this.$notify({
                    text: 'Cannot post empty comment',
                    type: 'error'
                });
                return;
            }

            const assessmentMitigationId = parseInt(this.getAssessmentMitigationId);

            const assessmentMitigationCommentInput = {
                assessmentMitigationId,
                userId: this.currentUser.id,
                comment: this.comment,
                attachments: []
            };

            if (this.attachment) {
                // Attempting file upload
                const result = await S3UploadService.singleUpload(this.attachment, 'assessment_mitigation_discussion_attachments');

                assessmentMitigationCommentInput.attachments.push({
                    filePath: result.fullPath,
                    fileMetadata: {
                        key: result.key,
                        s3Location: result.fullPath,
                        mimeType: this.attachment.type,
                        size: `${this.attachment.size}`
                    }
                });
            }

            this.startLoading();

            const response = await DeforestationService.createAssessmentMitigationDiscussion(assessmentMitigationCommentInput);

            this.stopLoading();

            const discussion = response.data.addMitigationDiscussion;

            this.mitigation.assessmentMitigationDiscussions.unshift(discussion);
            this.comment = ''; // Resetting comment

            // Seperating attachments
            this.attachments.push(this.attachment);
            this.attachment = null;
        },
        async updateMitigation() {
            if (!this.selectedUser) {
                this.$notify({
                    text: 'Please select assignee!',
                    type: 'error'
                });
                return;
            }
            this.assignedUser = this.users.find((user) => parseInt(user.id) === parseInt(this.selectedUser));
            // Changing status of risk mitigation
            this.updating = true;
            this.startLoading();
             DeforestationService.updateMitigation(
                this.mitigation.id,
                this.selectedStatus,
                 this.selectedUser
            ).then(() => {
                this.$notify({
                    text: this.$t('deforestation.assessmentUpdatedSuccessfully'),
                    type: 'success'
                });
                this.stopLoading()
            }).catch(() => {
                this.stopLoading()
            });
            this.updating = false;
        },
        async updateChecklist() {
            if (this.updatingChecklist) {
                this.$notify({
                    text: this.$t('deforestation.pleaseWaitCurrentlyUpdatingChecklist'),
                    type: 'error'
                });
                return;
            }

            // Changing status of risk mitigation
            this.updatingChecklist = true;
            this.startLoading();

            const checklistPayload = this.checklistResponse.map((response, i) => {
                if (response) {
                    return {
                        isChecked: true,
                        checklistTitle: this.mitigation.assessmentQuestionOption.checklists[i]
                    }
                }
            }).filter((item) => item && item.isChecked);

            const result = await DeforestationService.updateChecklist(
                this.mitigation.id,
                checklistPayload
            );

            if (result.errors) {
                this.$notify({
                    text: 'Failed to update checklist',
                    type: 'error'
                });
            } else {
                const { checkLists } = result.data.updateAssessmentMitigation;
                this.updateChecklistUI(checkLists);
            }

            this.updatingChecklist = false;
            this.stopLoading();
        },
        getInitials(user) {
            return (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
        },
        getCurrentUser() {
            this.currentUser = this.$store.getters.getUser;
        },
        async getOrganizationUsers() {
            const currentOrganizationId = this.getOrganizationId; 
            await DeforestationService.getAllUsersByOrganization(currentOrganizationId).then((res) => {
                this.users = res.data.findAllUsersByOrganization.reduce((acc, user) => {
                    if (user.organization === currentOrganizationId) {
                        acc.push({
                            id: user.id,
                            name: `${user.firstName} ${user.lastName}`
                        });
                    }
                    return acc;
                }, []);
            });
        }
    },
    mixins: [loadingMixin, DownloadMixin]
}
</script>

<style lang="scss" scoped>
.wrapper {
    padding: 0px 12px !important;
}

.fluid {
    width: 100%;
}

.file-chip {
    max-width: 640px;
    margin: 12px 0;
    padding: 24px;
    border-radius: 12px;
    background-color: rgba(14, 191, 103, 0.2);

    ::v-deep .mdi::before {
        color: green !important;
    }
}

h1 {
    font-weight: 900 !important;
}

p {
    margin-bottom: 8px;
}

section {
    margin-top: 24px;
}

.tabs {
    display: flex;
    flex-direction: row;
    gap: 8px;
}

.bg-yellow {
    background-color: #F9A825;
}

.seperator {
    height: 32px !important;
}

::v-deep .v-data-table-header {
    background-color: #F9A825 !important;
}

::v-deep .v-data-table-header span {
    color: black !important;
}

::v-deep .col-1 {
    flex: 0 0 1% !important;
}

::v-deep .v-input,
::v-deep .v-input__slot {
    margin-top: 0 !important;
}

::v-deep .v-messages {
    display: none !important;
}

::v-deep button {
    color: white !important;
    border-radius: 4px !important;
}

::v-deep .v-chip__content {
    text-transform: capitalize !important;
}

::v-deep .v-chip.v-chip--outlined.v-chip.v-chip {
    padding: 18px 48px !important;

    &.very-high {
  background-color: #FF8F8F !important;
  color: #2B0001 !important;

}

&.high {
  background-color: #FFB6B6;
  color: #850003 !important;

}

&.medium {
  background-color: #FFCEB3 !important;
  color : #A13C03 !important;
;
}

&.low {
  background-color: #FFE8C5 !important;
  color: #9C521B !important; ;

}

&.very-low {
  background-color: #FFFCEC !important;
  color: #A15E05 !important;
}

&.zero {
  background-color: #E2FFF4 !important;
  color: #58651B !important;
}
}

::v-deep .mdi::before {
    color: black !important;
}

::v-deep td .v-btn {
    border-radius: 50% !important;

    &>.v-btn__content .mdi::before {
        color: green !important;
    }
}
</style>