<template>
    <v-dialog v-model="dialog" width="800" @click:outside="closeModal" :retain-focus="false">
        <v-card class="custom-card" rounded="0">
            <v-toolbar flat color="primary" class="white--text">
                <v-toolbar-title class="font-weight-bold">{{
                    $t("esgPlatform.addNewStandard")
                    }}
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon class="white--text" @click="closeModal">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-form ref="form" @submit.prevent="submitForm">
                <v-card-text class="pa-4">
                    <div class="item-box">
                        <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">
                            {{ $t('esgPlatform.standardTitle') }}
                        </label>
                        <v-tooltip top color="00BD73" max-width="350">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon class="icon-with-background" size="medium"
                                    style="color:#0EBF67; margin-bottom: 5px;" v-bind="attrs" v-on="on">
                                    mdi-alert-circle
                                </v-icon>
                            </template>
                            <span>{{ $t("esgPlatform.standardTitleTT") }}</span>
                        </v-tooltip>
                        <v-text-field dense v-model="standardTitle" :rules="[rules.required]"
                            :error-messages="errors.standardTitle" required
                            :placeholder="$t('esgPlatform.standardTitle')" outlined>
                        </v-text-field>
                    </div>
                    <div class="item-box">
                        <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">
                            {{ $t('esgPlatform.shortCode') }}
                        </label>
                        <v-tooltip top color="00BD73" max-width="350">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon class="icon-with-background" size="medium"
                                    style="color:#0EBF67; margin-bottom: 5px;" v-bind="attrs" v-on="on">
                                    mdi-alert-circle
                                </v-icon>
                            </template>
                            <span>{{ $t("esgPlatform.shortCodeTT") }}</span>
                        </v-tooltip>
                        <v-text-field dense v-model="shortCode" :rules="[rules.required]"
                            :error-messages="errors.shortCode" required :placeholder="$t('esgPlatform.shortCode')"
                            outlined>
                        </v-text-field>
                    </div>
                    <div class="item-box">
                        <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">
                            {{ $t('esgPlatform.standardDescription') }}
                        </label>
                        <v-tooltip top color="00BD73" max-width="350">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon class="icon-with-background" size="medium"
                                    style="color:#0EBF67; margin-bottom: 5px;" v-bind="attrs" v-on="on">
                                    mdi-alert-circle
                                </v-icon>
                            </template>
                            <span>{{ $t("esgPlatform.standardDescriptionTT") }}</span>
                        </v-tooltip>
                        <!-- <v-textarea v-model="standardDescription" :rules="[rules.required]" outlined dense auto-grow
                            class="justify-start align-start" :error-messages="errors.standardDescription" /> -->
                        <v-card outlined class="mb-5">
                            <quill-editor
                                v-model="standardDescription"
                                ref="quillEditor"
                                :options="quillOptions('Describe standard')"
                            />
                        </v-card>
                    </div>
                    <div class="item-box">
                        <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">
                            {{ $t('esgPlatform.seal') }}
                        </label>
                        <v-tooltip top color="00BD73" max-width="350">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon class="icon-with-background" size="medium"
                                    style="color:#0EBF67; margin-bottom: 5px;" v-bind="attrs" v-on="on">
                                    mdi-alert-circle
                                </v-icon>
                            </template>
                            <span>{{ $t("esgPlatform.sealTT") }}</span>
                        </v-tooltip>
                        <v-col cols="4" style=" border: 1px solid #e0e0e0; padding: 10px; border-radius: 5px;">
                            <v-file-input class="custom-file-input" prepend-icon="mdi-upload" label="Upload"
                                prepend-icon-color="green" small-chips accept="image/*" @change="onFileChange"
                                @click:clear="removeSealImage" ref="fileInput" hide-details variant="outlined"
                                :error-messages="errors.sealFile" />
                            <v-row v-if="isUploading" align="center" justify="center">
                                <v-col cols="12" class="text-center">
                                    <p>{{ $t('activationKey.pleaseWait') }}</p>
                                    <v-progress-linear :value="uploadPercentage" height="7" color="primary" />
                                    <p>{{ uploadPercentage }}%</p>
                                </v-col>
                            </v-row>
                            <v-img v-if="sealImage" style="margin-top: 10px;" :src="sealImage" max-height="250"
                                max-width="250" contain />
                            <v-row v-if="sealImage">
                                <v-col cols="6" class="text-right">
                                </v-col>
                            </v-row>
                        </v-col>
                    </div>
                </v-card-text>
                <v-card-actions class="pa-4">
                    <v-spacer></v-spacer>
                    <v-btn color="primary" outlined class="mr-2" @click="closeModal">
                        {{ $t("cancel") }} </v-btn>
                    <v-btn color="primary" @click="submitForm">
                        {{ $t("submit") }}
                    </v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>
<script>
import ESGService from "@/_services/EsgService";
import FileService from '@/_services/FileService';
import axios from 'axios';

import { quillEditor } from 'vue-quill-editor';

export default {
    computed: {
        dialog() {
            return this.dialogI;
        },
    },
    mounted() {
    },
    components: {
        'quill-editor': quillEditor
    },
    watch: {
        sealImage() {
            this.sealImage
        },
        formData: {
            immediate: true,
            handler(newVal) {
                if (newVal) {
                    this.uploadedFileUrl = newVal.s3Key || '';
                }
            }
        },
        standardTitle(value) {
            if (value) this.errors.standardTitle = [];
        },
        shortCode(value) {
            if (value) this.errors.shortCode = [];
        },
        standardDescription(value) {
            if (value) this.errors.standardDescription = [];
        },
        uploadedFileUrl(value) {
            if (value) this.errors.sealFile = [];
        },
    },
    data() {
        return {
            standardTitle: '',
            shortCode: '',
            standardDescription: '',
            sealFile: null,
            sealImage: null,
            isUploading: false,
            uploadPercentage: 0,
            uploadedFileUrl: null,
            validationError: false,
            errors: {
                standardTitle: [],
                shortCode: [],
                standardDescription: [],
                sealFile: []
            },
            rules: {
                required: v => !!v || this.$t("esgPlatform.thisfieldIsRequired"),
            },
        }
    },
    methods: {
        quillOptions(placeholder) {
            return {
                theme: 'snow',
                placeholder,
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ header: [1, 2, 3, false] }],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        [{ color: [] }, { background: [] }],
                        ['clean']
                    ]
                }
            }
        },
        isValid() {
            let valid = true;
            this.clearErrors();
            if (!this.standardTitle) {
                this.errors.standardTitle.push(this.$t("esgPlatform.thisfieldIsRequired"));
                valid = false;
            }
            if (!this.shortCode) {
                this.errors.shortCode.push(this.$t("esgPlatform.thisfieldIsRequired"));
                valid = false;
            }
            if (!this.standardDescription) {
                this.errors.standardDescription.push(this.$t("esgPlatform.thisfieldIsRequired"));
                valid = false;
            }
            if (!this.uploadedFileUrl) {
                this.errors.sealFile.push(this.$t("esgPlatform.thisfieldIsRequired"));
                valid = false;
            }
            return valid;
        },
        clearErrors() {
            this.errors = {
                standardTitle: [],
                shortCode: [],
                standardDescription: [],
                sealFile: []
            };
        }
        ,
        async onFileChange(file) {
            if (!file) return;
            
            this.sealFile = file;
            this.isUploading = true;
            this.uploadPercentage = 0;
            
            // Show image preview
            const reader = new FileReader();
            reader.onload = () => {
                this.sealImage = reader.result;
            };
            reader.readAsDataURL(file);
            
            try {
                // Step 1: Get the pre-signed URL
                const token = localStorage.getItem('token');
                const { data } = await FileService.uploadFile(token, file, true, 'esg');
                const { url, key } = data;

                // Step 2: Upload the file using the pre-signed URL
                const uploadResponse = await axios.put(url, file, {
                headers: {
                    'Content-Type': file.type,
                },
                onUploadProgress: progressEvent => {
                    this.uploadPercentage = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                    );
                }
                });

                if (uploadResponse.status === 200) {
                const publicUrl = await FileService.getObjectURL(key, true);
                this.sealKey =  key;
                this.uploadedFileUrl = publicUrl;
                } else {
                throw new Error(this.$t('esgPlatform.failedToUploadFileToS3'));
                }
            } catch (error) {
                console.error("Upload error:", error);
                this.$notify({
                type: 'error',
                text: this.$t('esgPlatform.failedToUploadFile'),
                });
            } finally {
                // Remove the stopLoading call if it's not defined
                // this.stopLoading();
                this.isUploading = false;
            }
        },
        removeSealImage() {
            this.sealFile = null;
            this.sealImage = null;
            this.uploadedFileUrl = null;
            this.$refs.fileInput.reset();
        },
        closeModal() {
            this.$emit('closeModal');
        },
        async submitForm() {
            this.validationError = false;
            if (!this.isValid()) {
                this.$notify({
                    title: this.$t("esgPlatform.pleaseFillRequiredFields"),
                    type: "error",
                });
                return;
            }
            let formData = {
                type: "Standard",
                title: this.standardTitle,
                shortCode: this.shortCode,
                description: this.standardDescription,
                sealKey: this.sealKey,
            }
            try {
                const resopnse = await ESGService.createEsgStandard(formData);
                if (!resopnse.data) {
                    const error = resopnse || "Error submitting form";
                    for (const key in error.message.errors) {
                        this.$notify({
                            title: error.message.errors[key].msg,
                            type: "error",
                        });
                    }
                    return;
                } else {
                    const id = resopnse.data.id;
                    this.closeModal();
                    this.$notify({
                        title: this.$t("esgPlatform.standardAddedSuccessfully"),
                        type: "success",
                    });
                    this.$router.push({ name: "editEsgStandard", params: { id: id } });
                }
            } catch (error) {
                this.$notify({
                    title: this.$t("esgPlatform.errorSubmittingForm"),
                    type: "error",
                });
                console.error("Submit error:", error);
            }
        },
    },
    props: {
        'dialogI': {
            type: Boolean,
            required: true
        },
    },
}
</script>
<style scoped>
.spaced {
    justify-content: space-between;
}
</style>