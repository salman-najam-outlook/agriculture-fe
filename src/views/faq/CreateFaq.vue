<template>
    <v-dialog transition="dialog-top-transition" max-width="800" v-model="dialog" @click:outside="closeModal">
        <v-card class="">
            <v-toolbar color="primary" class="sticky" dark flat dense>

                <v-toolbar-title class="font-weight-bold">{{ $t('faqSection.createFaq') }}</v-toolbar-title>

                <v-spacer></v-spacer>

                <v-btn icon class="white--text" @click="closeModal">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-form @submit.prevent="createFaq" ref="faqForm" v-model="valid">
                <v-card-text>
                    <v-row class="mt-5" no-gutters>
                        <v-col cols="12">
                            <label for="mobile">{{ $t('faqSection.selectTopic') }}<span class="red--text">*</span></label>
                            <v-select :items="topicList" item-text="displayName" item-value="name" outlined dense
                                v-model="faq.name" :rules="rules.name">
                            </v-select>
                        </v-col>
                        <v-col cols="6"></v-col>
                        <v-col cols="12">
                            <label for="mobile">{{ $t('faqSection.faqQuestion') }}<span class="red--text">*</span></label>
                            <v-text-field outlined dense class="" v-model="faq.question" :rules="rules.question">

                            </v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <label for="mobile">{{ $t('faqSection.faqAnswer') }}<span class="red--text">*</span></label>
                            <v-textarea outlined name="input-7-4" v-model="faq.answer" :rules="rules.answer">
                            </v-textarea>
                        </v-col>
                        <v-col cols="12">
                            <v-btn color="primary" class="text-none" depressed :loading="isSelecting"
                                @click="onButtonClick">
                                <!-- <v-icon left>
                            cloud_upload
                            </v-icon> -->
                                {{ $t('faqSection.uploadImgVid') }}
                            </v-btn>
                            {{ selectedFile ? selectedFile.name : '' }}
                            <input ref="uploader" class="d-none" type="file" accept="image/*,video/mp4" @change="onFileChanged">
                        </v-col>
                        <v-col cols="12" v-if="thumbnail">
                            <div v-if="isImage === true">
                                <img :src="thumbnail" alt="File Thumbnail" style="height: 300px; padding: 10px;"/>
                            </div>
                            <div v-if="isImage === false">
                                <video v-if="thumbnail" controls style="height: 300px; width: auto;padding: 10px;">
                                <source :src="thumbnail" type="video/mp4"/>
                                Your browser does not support the video tag.
                                </video>
                            </div>
                            
                        </v-col>
                        <v-col cols="12"><span>{{$t("note")}}</span></v-col>
                        <v-col cols="12" class="pt-0  d-flex align-center">
                            <v-checkbox color="primary" v-model="faq.display"></v-checkbox>
                            <div class="ml-2">{{ $t('faqSection.disInFaq') }}</div>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-divider></v-divider>
                <v-card-actions class="justify-end py-5">
                    <v-btn outlined color="primary" @click="closeModal">{{ $t('cancel') }}</v-btn>
                    <v-btn color="primary" type="submit">{{ $t('submit') }}</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
        <!-- </template> -->
    </v-dialog>
</template>
<script>
import FaqService from '@/_services/FaqService.js'
import loading from "@/mixins/LoadingMixin";

export default {

    mounted() {
        this.getTopics();
    },
    props: {
        dialog: {
            required: false,
            type: Boolean
        }
    },
    data() {
        return {
            valid: true,
            thumbnail: null,
            isImage: false,
            selectedFile: null,
            isSelecting: false,
            topicList: [],
            faq: {
                name: "",
                question: "",
                answer: "",
                display: false
            },
            rules: {
                name: [
                    v => !!v || this.$t('coffeeData.topicRequired'),
                ],
                question: [
                    v => !!v || this.$t('faqSection.questionReq'),
                ],
                answer: [
                    v => !!v || this.$t('faqSection.answerReq'),
                ],
            }
        }
    },
    methods: {
        onButtonClick() {
            this.isSelecting = true
            window.addEventListener('focus', () => {
                this.isSelecting = false
            }, { once: true })

            this.$refs.uploader.click()
        },
        onFileChanged(e) {
            this.selectedFile = e.target.files[0]

            let fileInput = this.$refs.uploader;
            let file = fileInput.files[0];
            let reader = new FileReader();
        
            reader.onload = (e) => {
                this.thumbnail = e.target.result;
                this.isImage = file.type.startsWith('image/');
            }
  
            reader.readAsDataURL(file);
        },

        getTopics() {
            FaqService.getAllTopics()
                .then((result) => {
                    this.topicList = result.data
                }).catch((err) => {
                    console.log(err)
                });
        },

        createFaq() {
            if (!this.$refs.faqForm.validate()) return;

            this.startLoading()
            var formData = new FormData();
            formData.append("name", this.faq.name);
            formData.append("question", this.faq.question);
            formData.append("answer", this.faq.answer);
            formData.append("display", this.faq.display);
            if (this.selectedFile)
                formData.append("file", this.selectedFile);
            FaqService.createFaq(formData)
                .then((result) => {
                    console.log(result)
                    this.$notify({
                        title: 'FAQ added successfully.',
                        type: 'success'
                    });
                    this.closeModal(true)
                    this.stopLoading()
                }).catch((err) => {
                    console.log(err)
                    this.$notify({
                        title: 'Something went wrong.',
                        type: 'error'
                    });
                    this.closeModal()
                    this.stopLoading()
                });
        },

        closeModal(suc = false) {
            this.$emit('close-modal', suc)
        }
    },
    mixins: [loading]
}
</script>

<style lang="scss" scoped>
::v-deep .sticky {
    position: sticky;
    top: 0;
    z-index: 10000 !important;
    opacity: 1 !important;
}
</style>