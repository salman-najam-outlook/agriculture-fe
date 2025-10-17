<template>
    <div class="px-4">
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <div class="wrapper">
            <v-row style="justify-content: space-between;">
                <v-col cols="11">
                    <h2>{{ $t("Messages") }}</h2>
                </v-col>
                <v-col cols="1">
                    <v-btn block color="primary" @click="navigateBack">
                        {{ $t("back") }}
                    </v-btn>
                </v-col>
            </v-row>

            <v-card class="px-5 py-5 mt-4" rounded outlined>
                <v-col cols="12" v-if="protocol">
                    <!-- Title -->
                    <h3 class="font-weight-bold"> {{ protocol?.title  }} </h3>

                    <v-row class="mt-2">
                        <!-- Image Section -->
                        <v-col cols="4">
                            <v-img :src="protocol?.sealUrl" cover class="rounded-lg">
                            </v-img>
                        </v-col>

                        <!-- Content Section -->
                        <v-col cols="8">

                            <!-- Description -->
                            <p class="text-body-4 black--text text--darken-2 justify-start align-start"
                                style="text-align: justify !important; vertical-align: top !important; "
                                v-html="protocol?.description">
                            </p>

                            <div class="d-flex flex-row align-start gap-4 align-center py-4">
                                <h4 class="mb-2">Standard:</h4>
                                <div class="d-flex align-center">
                                    <v-img :src="protocol?.esgStandard?.sealUrl" contain height="30px" width="60px"
                                        class="rounded-lg mr-2"></v-img>
                                    <div class="subtitle-1">
                                        {{ protocol?.esgStandard?.title }}
                                    </div>
                                </div>
                            </div>


                            <div class="d-flex align-center">
                                <span class="font-weight-bold mr-2"> {{ $t('esgPlatform.status') }}:</span>
                                <v-btn rounded min-width="150" depressed class="green-button">
                                    {{ $t("active") }}
                                </v-btn>
                            </div>
                        </v-col>

                    </v-row>
                    <v-divider class="mt-4"></v-divider>
                </v-col>
            </v-card>

            <v-row class="mb-5 discussion-section">
                <v-col cols="12" sm="9">
                    <v-card class="px-5 py-5 mt-4" rounded outlined>
                        <div class="tabs">
                            <v-btn v-for="(tab, i) in tabs" :key="i" class="tab-button"
                                :class="selectedTab === i ? 'primary' : 'grey darken-1'" @click="switchTab(i)"
                                outlined>{{ tab }}</v-btn>
                        </div>
                        <section class="tabs">
                            <div class="fluid" v-if="selectedTab === 0">
                                <section class="comment-box">
                                    <v-row>
                                        <v-col offset="1" cols="11" v-if="replyMode && discussionReply">
                                            <p> <i> Replying For .. </i></p>
                                            <p> 
                                                {{ discussionReply?.content }} 
                                            </p>
                                            <template v-if="discussionReply.hasAttachments">
                                                <article v-for="(attachment, i) in discussionReply.attachments" :key="i"
                                                    class="file-chip">
                                                    <v-row>
                                                        <v-col cols="1">
                                                            <v-icon large>
                                                                mdi-file-document-outline
                                                            </v-icon>
                                                        </v-col>
                                                        <v-col cols="10">
                                                            <h4>{{ fileNameFromS3Path(attachment.fileUrl) }}
                                                            </h4>
                                                        </v-col>
                                                        <v-col cols="1">
                                                            <v-btn
                                                                @click="downloadFile(attachment.fileUrl)"
                                                                icon>
                                                                <v-icon>mdi-download</v-icon>
                                                            </v-btn>
                                                        </v-col>
                                                    </v-row>
                                                </article>
                                            </template>
                                            <v-icon color="red" @click="replyMode = false; discussionReply=null" small>
                                                mdi-close
                                            </v-icon>
                                        </v-col>
                                        <v-col cols="1">
                                            <v-avatar color="grey">
                                                <span class="black--text text-h5">{{ getInitials(getUser) }}</span>
                                            </v-avatar>
                                        </v-col>
                                        <v-col cols="10">
                                            <v-textarea dense id="comment" :label="$t('deforestation.addAComment')"
                                                v-model="comment" auto-grow outlined rows="1" row-height="15"
                                                append-icon="mdi-attachment"
                                                @click:append="triggerFileUpload"></v-textarea>
                                            <v-file-input id="attachment" v-model="formAttachments" style="display: none;"
                                                accept="image/*,.pdf" multiple></v-file-input>
                                            <div v-if="formAttachments.length > 0">
                                                <article v-for="(attachment, i) in formAttachments" :key="i" class="file-chip">
                                                    <v-row>
                                                        <v-col cols="1">
                                                            <v-icon large>
                                                                {{ attachment && attachment.type.includes('image') ?
                                                                    'mdi-file-image-outline' : 'mdi-file-document-outline' }}
                                                            </v-icon>
                                                        </v-col>
                                                        <v-col cols="11">
                                                            <h4>{{ attachment && attachment.name }}</h4>
                                                            <span>{{ attachment && (attachment.size / 1024).toFixed(0) }}
                                                                KB</span>
                                                        </v-col>
                                                    </v-row>
                                                </article>
                                            </div>
                                        </v-col>
                                        <v-col cols="1">
                                            <v-btn small color="primary" fab @click="submitComment">
                                                <v-icon small>mdi-send</v-icon>
                                            </v-btn>
                                        </v-col>
                                    </v-row>

                                    <div class="seperator"></div>

                                    <div v-for="discussion in discussions?.discussions" :key="discussion.id">
                                        <v-row class="mb-5">
                                            <v-col cols="1">
                                                <v-avatar color="grey">
                                                    <span class="black--text text-h5">{{ getInitials(discussion.createdByUser)
                                                        }}</span>
                                                </v-avatar>
                                            </v-col>
                                            <v-col cols="10">
                                                <p>{{ discussion.content }}</p>
                                                <template v-if="discussion.hasAttachments">
                                                    <article v-for="(attachment, i) in discussion.attachments" :key="i"
                                                        class="file-chip">
                                                        <v-row>
                                                            <v-col cols="1">
                                                                <v-icon large>
                                                                    mdi-file-document-outline
                                                                </v-icon>
                                                            </v-col>
                                                            <v-col cols="10">
                                                                <h4>{{ fileNameFromS3Path(attachment.fileUrl) }}
                                                                </h4>
                                                            </v-col>
                                                            <v-col cols="1">
                                                                <v-btn
                                                                    @click="downloadFile(attachment.fileUrl)"
                                                                    icon>
                                                                    <v-icon>mdi-download</v-icon>
                                                                </v-btn>
                                                            </v-col>
                                                        </v-row>
                                                    </article>
                                                </template>
                                                <a class="reply" @click="handleReply(discussion)">
                                                    {{ $t("deforestation.reply") }}
                                                </a>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col offset="1" cols="11">
                                                <div class="reply" v-for="reply in discussion.replies" :key="reply.id">
                                                    <v-row class="mb-5">
                                                        <v-col cols="1">
                                                            <v-avatar color="grey">
                                                                <span class="black--text text-h5">{{ getInitials(reply.createdByUser)
                                                                    }}</span>
                                                            </v-avatar>
                                                        </v-col>
                                                        <v-col cols="10">
                                                            <p>{{ reply.content }}</p>
                                                            <template v-if="reply.hasAttachments">
                                                                <article v-for="(attachment, i) in reply.attachments" :key="i"
                                                                    class="file-chip">
                                                                    <v-row>
                                                                        <v-col cols="1">
                                                                            <v-icon large>
                                                                                mdi-file-document-outline
                                                                            </v-icon>
                                                                        </v-col>
                                                                        <v-col cols="10">
                                                                            <h4>{{ fileNameFromS3Path(attachment.fileUrl) }}
                                                                            </h4>
                                                                        </v-col>
                                                                        <v-col cols="1">
                                                                            <v-btn
                                                                                @click="downloadFile(attachment.fileUrl)"
                                                                                icon>
                                                                                <v-icon>mdi-download</v-icon>
                                                                            </v-btn>
                                                                        </v-col>
                                                                    </v-row>
                                                                </article>
                                                            </template>
                                                        </v-col>
                                                    </v-row>
                                                </div>
                                            </v-col>
                                        </v-row>
                                    </div>
                                    

                                    <!-- Add pagination -->
                                     <template v-if="discussions?.pagination?.page">
                                        <v-pagination
                                            v-if="discussions?.pagination?.totalPages > 1"
                                            :circle="true"
                                            color="primary"
                                            v-model="pagination.page"
                                            :length="pagination.totalPages"
                                            @input="handlePageChange"
                                            :navigation-text-color="'white'"
                                            total-visible="7"
                                        ></v-pagination>
                                    </template>
                                </section>
                            </div>
                            <div class="fluid" v-else>
                                <v-data-table
                                    :headers="attachmentHeaders"
                                    :items="attachments"
                                    :loading="loadingAttachment"
                                    :loading-text="$t('loading')"
                                    :page.sync="pagination.page"
                                    :items-per-page="10"
                                    :server-items-length="pagination.total"
                                    
                                    @pagination="handlePageChange"
                                    class="elevation-0"
                                >
                                    <template v-slot:item.filePath="{ item }">
                                        <v-row>
                                            <v-col cols="1">
                                                <v-icon>
                                                     mdi-file-document-outline
                                                </v-icon>
                                            </v-col>
                                            <v-col cols="11">
                                                <span>{{ fileNameFromS3Path(item.fileUrl) }}</span>
                                            </v-col>
                                        </v-row>
                                    </template>

                                    <template v-slot:item.createdAt="{ item }">
                                        {{ beautifyDate(item && item.createdAt) }}
                                    </template>

                                    <template v-slot:item.protocolId="{ item }">
                                        <v-btn class="ma-2" dark color="primary" small fab @click="openInNewTab(item.fileUrl)">
                                            <v-icon small color="default">mdi-eye-outline</v-icon>
                                        </v-btn>
                                    </template>
                                </v-data-table>
                            </div>
                        </section>
                    </v-card>
                </v-col>
                <!-- <v-col cols="12" sm="3">
                    <v-card class="pa-2 mt-4 mb-1 bg-primary " rounded outlined>
                        <p class="text-center mb-0 bg-primary">{{ $t("deforestation.assignedUser") }}</p>
                    </v-card>
                    <v-card class="px-5 py-5" rounded outlined>
                        <v-card-text class="pt-4">
                            <p class="mb-2">
                                {{ $t("deforestation.changeAssignee") }}
                            </p>
                            <v-select :items="users" :placeholder="$t('deforestation.selectAssignee')"
                                v-model="selectedUser" item-text="name" item-value="id" 
                                outlined dense></v-select>
                        </v-card-text>
                    </v-card>
                </v-col> -->
            </v-row>
        </div>
    </div>
</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin";
import DownloadMixin from "@/mixins/DownloadMixin";
import EsgService from "@/_services/EsgService";
import S3UploadService from "@/_services/S3UploadService";
import { mapGetters } from "vuex";

export default {
    data() {
        return {
            protocolId: this.$route.params?.protocolId || null,
            protocol: null,
            discussions: null,
            tabs: [
                this.$t("deforestation.discussion"),
                this.$t("deforestation.attachment"),
            ],
            replyMode:false,
            discussionReply:null,
            selectedTab: 0,
            comment: '',
            loadingAttachment: false,
            formAttachments: [],
            breadcrumbs: [
                {
                    text: this.$t("esgPlatform.esgCompliance"),
                    disabled: true,
                    to: "/",
                },
                {
                    text: this.$t("dashboard"),
                    disabled: true,
                    to: "breadcrumbs_link_1",
                }

            ],
            users: [
                { id: 1, name: 'John Doe' },
                { id: 2, name: 'Jane Smith' },
                { id: 3, name: 'Peter Jones' }
            ],
            assignedUser: { id: 1, name: 'John Doe' },
            selectedUser: 1,
            attachments: [],
            attachmentHeaders: [
                {
                    text: this.$t('oma.fileName'),
                    align: 'start',
                    value: 'filePath',
                    sortable: true
                },
                {
                    text: this.$t('deforestation.dateAdded'),
                    value: 'createdAt',
                    sortable: true
                },
                {
                    text: this.$t('deforestation.action'),
                    value: 'protocolId',
                    sortable: false
                }
            ],
            pagination: {
                total: 0,
                page: 1,
                totalPages: 0
            }
        }
    },
    async created() {
        await this.fetchDiscussions();
    },
    async mounted() {
        await Promise.all([
            this.fetchProtocolDetail()
        ]);
    },

    watch: {
        assignedUser(newVal) {
            this.selectedUser = newVal?.id;
        }
    },

    computed: {
        getAttachmentInput() {
            return document.getElementById('attachment');
        },
        getCommentInput() {
            return document.getElementById("comment");
        },
        getAssessmentMitigationId() {
            return this.$route.params.id;
        },
        ...mapGetters({
            getUser: 'getUser',
        })
    },
    methods: {
        getAttachmentName(filePath) {
            return filePath ? filePath.split('/').slice(-1)[0] : '';
        },
        getFileType(filePath) {
            return filePath ? filePath.split('.').slice(-1)[0] : '';
        },
        async fetchProtocolDetail() {
            const response = await EsgService.getEsgStandardDetails(this.protocolId);
            this.protocol = response.data;
        },
        handleReply(discussion) {
            this.replyMode = true;
            console.log(discussion);
            this.discussionReply = discussion;
            window.scrollTo({
                top: 150,
                left: 0,
                behavior: 'smooth'
            });
        },
        async submitComment() {
            this.startLoading();
            if (this.comment.length === 0) {
                this.$notify({
                    text: 'Cannot post empty comment',
                    type: 'error'
                });
                this.stopLoading();
                return;
            }
            const payload = {
                content: this.comment
            };
            try {
                if (this.formAttachments.length > 0) {
                    const results = await Promise.all(this.formAttachments.map(attachment => S3UploadService.singleUpload(attachment, "discussion")));
                    payload.files = results.map(res => ({
                        fileUrl: res.fullPath,
                        s3Key: res.key
                    }));
                    payload.hasAttachments = true;
                    this.formAttachments = [];
                }

                if (this.replyMode && this.discussionReply) {
                    payload.parentId = this.discussionReply._id;
                }
                const response = await EsgService.createDiscussion(this.protocolId, payload);

                if (response.success) {
                    if (this.replyMode) {
                        const parentDiscussion = this.discussions?.discussions.find(d => d._id === this.discussionReply._id);
                        if (parentDiscussion) {
                            if (!Array.isArray(parentDiscussion.replies)) {
                                parentDiscussion.replies = [];
                            }
                            parentDiscussion.replies.unshift(response.data);
                        } else {
                            this.$notify({
                                text: 'Parent discussion not found for reply',
                                type: 'error'
                            });
                        }
                    } else {
                        if (this.discussions?.discussions) {
                            this.discussions.discussions.unshift(response.data);
                        } else {
                            this.discussions = { discussions: [response.data] };
                        }
                    }
                    this.comment = '';
                    this.replyMode = false;
                    this.discussionReply = null;
                    this.$notify({
                        text: 'Comment added successfully',
                        type: 'success'
                    });
                }
                this.stopLoading();
            } catch (error) {
                this.stopLoading();
                this.$notify({
                    text: error.data?.message || 'Error adding comment',
                    type: 'error'
                });
            }
        },

        async fetchDiscussions(page = 1) {
            this.startLoading();
            try {
                const response = await EsgService.getDiscussions(this.protocolId, { page });
                if (response.success) {
                    this.discussions = response.data;
                    this.pagination = response.data.pagination;
                }
                this.stopLoading();
            } catch (error) {
                this.$notify({
                    text: error.data?.message || 'Error fetching discussions',
                    type: 'error'
                });
                this.stopLoading();
            }
        },

        async fetchAttachments(page = 1) {
            try {
                this.loadingAttachment = true;
                const response = await EsgService.getAttachments(this.protocolId, { page });
                if (response.success) {
                    this.attachments = response.data.attachments;
                    this.pagination = response.data.pagination;
                }
                this.loadingAttachment = false;
            } catch (error) {
                this.$notify({
                    text: error.data?.message || 'Error fetching attachments',
                    type: 'error'
                });
            }
        },

        async switchTab(index) {
            this.selectedTab = index;
            if (index === 0) {
                await this.fetchDiscussions();
            } else {
                await this.fetchAttachments();
            }
        },
        navigateBack() {
            history.back();
        },
        fileNameFromS3Path(path) {
            return path ? path.split('/').slice(-1)[0] : '';
        },
        beautifyDate(date) {
            return date ? date.split('T')[0] : '';
        },
        hightlightComment() {
            this.getCommentInput.click();
        },
        async downloadFile(filePath) {
            window.open(filePath, '_blank').focus();
        },
        openInNewTab(link) {
            window.open(link, '_blank').focus()
        },
        setAssignedUser() {
            this.assignedUser = this.users.find((user) => parseInt(user.id) === parseInt(this.mitigation.assignedUserId));
        },
        triggerFileUpload() {
            this.getAttachmentInput.click();
        },
        getInitials(user) {
            if(user.firstName || user.lastName) {
                return (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
            }
            return  user?.email?.charAt(0).toUpperCase() || '';
        },
        handlePageChange(newPage) {
            if (this.selectedTab === 0) {
                this.fetchDiscussions(newPage);
            } else {
                this.fetchAttachments(newPage);
            }
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

.bg-primary {
    background-color: #03BD72;
    color: white;
}

.seperator {
    height: 32px !important;
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

::v-deep .tab-button {
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
        color: #A13C03 !important;
        ;
    }

    &.low {
        background-color: #FFE8C5 !important;
        color: #9C521B !important;
        ;

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