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
              
              <v-toolbar-title class="font-weight-bold">{{ $t('faqSection.createTopic')}}</v-toolbar-title>

              <v-spacer></v-spacer>

              <v-btn icon class="white--text" @click="closeModal">
                  <v-icon>mdi-close</v-icon>
              </v-btn>
          </v-toolbar>
          <v-form
            @submit.prevent="createTopic"
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
                            v-model="topic.displayName"
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
                          v-model="topic.parentId"
                        >
                        </v-select>
                    </v-col> -->
                    <v-col cols="12" class="pt-0 mt-n8 d-flex align-center">
                        <!-- <label for="mobile"><span class="red--text">&nbsp;</span>&nbsp;</label> -->
                        <v-checkbox
                            color="primary"
                            v-model="topic.display"
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
  mounted(){
      this.getTopics();
  },
  props: {
        dialog: {
            required: false,
            type: Boolean
        }
  },
  data(){
    return {
      valid: true,
      topic: {
        parentId: 0,
        displayName: "",
        display: false,
        // name:''
      },
      topicList: [],
      nameRules: [
          v => !!v || this.$t("selectTopicIsRequired"),
          v => (v && v.length <= 15) || this.$t("roleNameLessThan15Character"),
      ],
    }
  },
  methods: {
    getTopics(){
        FaqService.getAllTopics()
        .then((result) => {
            this.topicList = result.data
        }).catch((err) => {
            console.log(err)
        });
    },
    createTopic(){
      if(!this.$refs.topicform.validate()) return;
      this.startLoading()
      let formData = {};

      formData.displayName = this.topic.displayName;
      formData.parentId = this.topic.parentId;
      formData.display = this.topic.display;
      
      FaqService.createTopic(formData)
      .then((result) => {
        console.log("result is ----> ", result)
        this.$notify({
            title: 'Topic added successfully.',
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
    }
  },
  mixins: [loading]
}

</script>
