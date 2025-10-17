<template>
     <v-dialog
        transition="dialog-top-transition"
        max-width="800"
        v-model="dialog"
        @click:outside="closeModal"

      >
          <v-card class="">
            <v-toolbar
              color="primary"
              dark
              flat
              dense
            >
                
                <v-toolbar-title class="font-weight-bold">{{ $t('faqSection.editFaq')}}</v-toolbar-title>

                <v-spacer></v-spacer>

                <v-btn icon class="white--text" @click="closeModal">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-form
              @submit.prevent="updateFaq"
              ref="faqForm"
              v-model="valid"
            >
            <v-card-text>
                <v-row class="mt-5" no-gutters>
                    <v-col cols="6">
                        <label for="mobile">{{ $t('faqSection.selectTopic') }}<span class="red--text">*</span></label>
                        <v-select
                            :items="topicList"
                            item-text="displayName"
                            item-value="name"
                            outlined
                            dense
                            v-model="editedFaq.name"
                            :rules="rules.name"
                          >
                          </v-select>
                    </v-col>
                    <v-col cols="6"></v-col>
                    <v-col cols="12">
                        <label for="mobile">{{ $t('faqSection.faqQuestion') }}<span class="red--text">*</span></label>
                        <v-text-field
                            outlined
                            dense
                            class=""
                            v-model="editedFaq.question"
                            :rules="rules.question"
                        >

                        </v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <label for="mobile">{{ $t('faqSection.faqAnswer') }}<span class="red--text">*</span></label>
                        <v-textarea
                            outlined
                            name="input-7-4"
                            v-model="editedFaq.answer"
                            :rules="rules.answer"
                        ></v-textarea>
                    </v-col>
                    <v-col cols="12">
                        <v-btn
                            color="primary"
                            class="text-none"
                            depressed
                            :loading="isSelecting"
                            @click="onButtonClick"
                            v-if="editedFaq.file == null"
                            x-large
                        >
                           {{ $t('faqSection.uploadImgVid') }}
                        </v-btn>
                        <v-btn
                            depressed
                            v-else
                            outlined
                            width="200"
                            x-large
                            class="pa-0"
                        >
                            xxx.jpeg/mp4
                            <v-btn
                                class="ml-8"
                                fab
                                dark
                                x-small
                                color="red"
                                depressed
                                right
                                @click.stop="removeImage"
                            >
                                <v-icon dark x-small>
                                    mdi-close
                                </v-icon>
                            </v-btn>
                        </v-btn>
                        <input
                            ref="uploader"
                            class="d-none"
                            type="file"
                            accept="image/*,video/mp4"
                            @change="onFileChanged"
                        >
                    </v-col>
                    <v-col cols="12" v-if="thumbnail">
                        <div v-if="isImage === true">
                            <img :src="thumbnail" alt="File Thumbnail" style="height: 300px; padding: 10px; 0"/>
                        </div>
                        <div v-if="isImage === false">
                            <video v-if="thumbnail" controls style="height: 300px; width: auto;padding: 10px; 0">
                            <source :src="thumbnail" type="video/mp4"/>
                            Your browser does not support the video tag.
                            </video>
                        </div>
                        
                    </v-col>
                    <v-col cols="12">
                        <img
                        v-if="editedFaq.file != null && !editedFaq.file.fileUrl.includes('mp4')"
                            :src="editedFaq.file.fileUrl"
                            style="height: 300px; padding: 10px; 0"
                        >
                        <video style="height: 300px; width: auto;padding: 10px; 0" controls v-else-if="editedFaq.file != null" :src="editedFaq.file.fileUrl"></video>
                        {{ selectedFile ? selectedFile.name : ''}}
                    </v-col>
                    <v-col cols="12" class="pt-0  d-flex align-center">
                        <v-checkbox
                            color="primary"
                            v-model="editedFaq.display"
                        ></v-checkbox>
                        <div class="ml-2">{{ $t('faqSection.disInFaq') }}</div>
                    </v-col>
                </v-row>
            </v-card-text>

            <v-divider></v-divider>
            <v-card-actions class="justify-end py-5">
                <v-btn
                    outlined
                    color="primary"
                    @click="closeModal"
                >{{ $t('cancel') }}</v-btn>
                <v-btn
                    color="primary"
                    type="submit"
                >{{ $t('submit') }}</v-btn>
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

    async mounted(){
        await this.getTopics();
        await this.createEditedFaq()
    },
    props: {
        dialog: {
            required: false,
            type: Boolean
        },
        faq: {
            required: true,
            type: Object
        },
        section: {
            required: true,
            type: Object
        },
    },
    data(){
        return {
            valid: true,
            thumbnail: null,
            isImage: false,
            selectedFile: null,
            isSelecting: false,
            topicList: [],
            editedFaq: {
                id: null,
                name: '',
                question: '',
                answer: '',
                display: false,
                file: null
            },
            image: null,
            rules: {
                name: [
                    v => !!v || 'Select Topic is required',
                ],
                question: [
                    v => !!v || 'FAQ Question is required',
                ],
                answer: [
                    v => !!v || 'FAQ Answer is required',
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

        async getTopics(){
            this.startLoading()
            FaqService.getAllTopics()
            .then((result) => {
                this.topicList = result.data
                this.stopLoading()
            }).catch((err) => {
                console.log(err)
                this.stopLoading()
            });
        },

        updateFaq(){
            if(!this.$refs.faqForm.validate()) return;

            this.startLoading()
            var formData = new FormData();
            formData.append("id", this.editedFaq.id);
            formData.append("name", this.editedFaq.name);
            formData.append("question", this.editedFaq.question);
            formData.append("answer", this.editedFaq.answer);
            formData.append("display", this.editedFaq.display);
            if(this.selectedFile)
                formData.append("file", this.selectedFile);

            FaqService.updateFaq(this.section.id,formData)
            .then((result) => {
                console.log(result)
                this.$notify({
                    title: 'FAQ updated successfully.',
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

        closeModal(suc = false){
            this.$emit('close-modal', suc)
        },

        async createEditedFaq() {
            // console.log('edited',this.section, this.faq)
            this.editedFaq.id = this.faq.id
            this.editedFaq.name = this.section.id
            this.editedFaq.question = this.faq.question
            this.editedFaq.answer = this.faq.answer
            this.editedFaq.file = this.faq.media?this.faq.media[0]:null
            this.editedFaq.display = JSON.parse(this.faq.display)
        },

        removeImage() {
            const deleteDelete= {
                id: this.faq.id,
                name: this.section.id,
                mediaId: this.faq.media[0].id
            }
            this.startLoading()
            FaqService.deleteFaqImage(deleteDelete)
            .then((result) => {
                console.log(result)
                this.$notify({
                    title: 'File deleted successfully.',
                    type: 'success'
                });
                this.editedFaq.file = null;
                this.selectedfile = null
                this.stopLoading()
            })
            .catch((err) => {
                console.log(err)
                this.$notify({
                    title: 'Something went wrong.',
                    type: 'error'
                });
                this.stopLoading()
            });
            
        }
    },
    mixins: [loading]
}
</script>
