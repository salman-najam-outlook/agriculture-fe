<template>
     <v-dialog
        transition="dialog-top-transition"
        max-width="600"
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
              
              <v-toolbar-title class="font-weight-bold">{{ $t('faqSection.editTopic')}}</v-toolbar-title>

              <v-spacer></v-spacer>

              <v-btn icon class="white--text" @click="closeModal">
                  <v-icon>mdi-close</v-icon>
              </v-btn>
          </v-toolbar>
          <v-form
            @submit.prevent="updateTopic"
            ref="topicform"
            v-model="valid"
          >
            <v-card-text>
                <v-row class="mt-5">
                    <v-col cols="6">
                        <label for="topicName">{{ $t('faqSection.topicName')}}<span class="red--text">*</span></label>
                        <v-text-field
                            outlined
                            dense
                            :rules="nameRules"
                            v-model="editedTopic.displayName"
                        >

                        </v-text-field>
                    </v-col>
                    <!-- <v-col cols="6">
                        <label for="mobile">{{ $t('faqSection.parentTopic')}}<span class="red--text"></span></label>
                        <v-select
                          :items="topicList"
                          item-text="displayName"
                          item-value="id"
                          outlined
                          dense
                          v-model="editedTopic.parentId"
                        >
                        </v-select>
                    </v-col> -->
                    <v-col cols="12" class="pt-0 mt-n8 d-flex align-center">
                        <!-- <label for="mobile"><span class="red--text">&nbsp;</span>&nbsp;</label> -->
                        <v-checkbox
                            color="primary"
                            v-model="editedTopic.display"
                        ></v-checkbox>
                        <div class="ml-2">{{ $t('faqSection.disInFaq')}}</div>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="justify-end py-5">
                <v-btn
                    outlined
                    color="primary"
                    @click="closeModal"
                >{{ $t('cancel')}}</v-btn>
                <v-btn
                    color="primary"
                    type="submit"
                >{{ $t('submit')}}</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
</template>
<script>
import FaqService from '@/_services/FaqService.js'
import loading from "@/mixins/LoadingMixin";

export default {
  async mounted(){
      await this.getTopics();
      await this.createEditedTopic()
  },
  props: {
        dialog: {
            required: true,
            type: Boolean
        },
        topic: {
            required: true,
            type: Object
        },
        parentTopic: {
            required: true,
            type: Object,
        },
  },
  data(){
    return {
        valid: true,
        editedTopic: {
            id: null,
            parentId: 0,
            displayName: '',
            display: false
        },
        newTopicList:[],
        topicList: [],
        nameRules: [
            v => !!v || 'Select Topic is required',
            v => (v && v.length <= 20) || 'Role name must be less than 20 characters',
        ],
    }
  },
  methods: {
    async getTopics(){
        this.startLoading()
        FaqService.getAllTopics()
        .then((result) => {
          console.log("result is ---> ", result)
          this.topicList = result.data

          const indexOfObject = this.topicList.findIndex((object) => {
              return (object.displayName === this.editedTopic.displayName && object.id == this.editedTopic.id);
          });
          console.log(indexOfObject);
          if(indexOfObject != -1){
            this.topicList.splice(indexOfObject, 1);
          }
            this.stopLoading()
        }).catch((err) => {
            console.log(err)
            this.stopLoading()
        });
    },
    updateTopic(){
      if(!this.$refs.topicform.validate()) return;
      this.startLoading()
        const topicData = {
            displayName: this.editedTopic.displayName,
            display: this.editedTopic.display,
            parentId: this.editedTopic.parentId
        }
      FaqService.updateTopic(this.editedTopic.id, topicData)
      .then((result) => {
        console.log(result)
        this.$notify({
            title: 'Topic Updated successfully.',
            type: 'success'
        });
        this.closeModal(true)
        this.stopLoading()
      }).catch((err) => {
        var msg =  err.data.message?err.data.message:'Something went wrong.'
        this.$notify({
            title: msg,
            type: 'error'
        });
        this.stopLoading()
      });
    },

    closeModal(suc = false){
      this.$emit('close-modal', suc)
    },

    createEditedTopic() {
      this.editedTopic.id = this.topic.id
        this.editedTopic.parentId = this.parentTopic.id
        this.editedTopic.displayName = this.topic.displayName
        this.editedTopic.display = this.topic.display;
        console.log('edited topic', this.editedTopic)
    }
  },
  mixins: [loading]
}

</script>
