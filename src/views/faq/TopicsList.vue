<template>
    <div>
    <v-card color="bg" flat>
       <v-card-text class="black--text">
            <div class="d-flex mb-4">
                <h2>{{ $t('topics')}}</h2>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    small
                    depressed
                    @click="createTopicDialog=!createTopicDialog"
                    v-if="getModulePermittedActions.post"
                >{{ $t('faqSection.createTopic') }}</v-btn>
                <CreateTopic v-if="createTopicDialog" @close-modal="closeTopicModal" :dialog="createTopicDialog"/>
            </div>

       </v-card-text>
    </v-card>
    <v-card flat class="rounded-xl">
        <v-card-text class="pa-10">
            <v-row v-if="topicList.length <= 0" justify="center" align="center">
          <v-col>
            <v-row justify="center"
              ><v-img max-width="200" src="/img/no_faq_content.png"></v-img
            ></v-row>
            <v-row justify="center" class="mt-10">
              <div class="red--text ml-3 text-h5">{{$t('noData')}}</div>
            </v-row>
            <v-row justify="center" class="mt-5">
              <div class="black--text ml-3 text-h6">
                {{$t('faqSection.createTopicFirst')}}
              </div>
            </v-row>
          </v-col>
        </v-row>
            <v-row v-else justify="center" color="primary">
                <v-expansion-panels :readonly="section.childTopics.length<1" class="mb-5"  v-for="(section) in topicList" :key="section.id" flat focusable >
                    <v-expansion-panel class="green2">
                        <div style="position: relative;" @mouseover="selectItem(section)"
                            @mouseleave="unSelectItem()">
                            <div style="position: absolute; right: 50px; top:15px; z-index: 99999;" v-if="section === selectedItem" >  
                                        <v-tooltip bottom v-if="getModulePermittedActions.put">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn 
                                                    v-show="!section.isDefault"
                                                    x-small 
                                                    fab
                                                    v-bind="attrs"
                                                    v-on="on"
                                                    @click.native.stop="editTopic(section, { id: 0})"
                                                >
                                                    <v-icon>mdi-pencil</v-icon> 
                                                </v-btn>
                                            </template>
                                            <span>{{ $t('edit')}}</span>
                                        </v-tooltip>
                                        <v-tooltip bottom v-if="getModulePermittedActions.delete">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn 
                                                v-show="!section.isDefault"
                                                    x-small 
                                                    fab
                                                    v-bind="attrs"
                                                    v-on="on"
                                                    class="ml-2"
                                                    @click.native.stop="confirmDelteTopic(section)"
                                                >
                                                    <v-icon>mdi-trash-can</v-icon> 
                                                </v-btn>
                                            </template>
                                            <span>{{ $t('delete')}}</span>
                                        </v-tooltip>
                                    </div>
                        <v-expansion-panel-header 
                            class="primary--text font-weight-bold"                         
                            v-html="section.displayName"
                        >
                            <!-- {{ section.displayName }} -->                            
                        </v-expansion-panel-header>
                        </div>
                        
                        <v-expansion-panel-content class="pt-5 green2">
                            <v-expansion-panels focusable flat>
                                <v-expansion-panel
                                    v-for="(item) in section.childTopics"
                                    :key="item.id"
                                    class="mb-1"
                                   
                                >   
                                <div 
                                    style="position: relative;"
                                    @mouseover="selectItem(item)"
                                    @mouseleave="unSelectItem()">
                                    <!-- {{item.displayName}} -->
                                    <div style="position: absolute; right: 20px; top:15px; z-index: 99999;" v-if="item === selectedItem" >  
                                        <v-tooltip bottom v-if="getModulePermittedActions.put">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn 
                                                 v-show="!section.isDefault"
                                                    x-small 
                                                    fab
                                                    v-bind="attrs"
                                                    v-on="on"
                                                    @click.native.stop="editTopic(item, section)"
                                                >
                                                    <v-icon>mdi-pencil</v-icon> 
                                                </v-btn>
                                            </template>
                                            <span>{{ $t('edit')}}</span>
                                        </v-tooltip>
                                        <v-tooltip bottom v-if="getModulePermittedActions.delete">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn 
                                                 v-show="!section.isDefault"
                                                    x-small 
                                                    fab
                                                    v-bind="attrs"
                                                    v-on="on"
                                                    class="ml-2"
                                                    @click.native.stop="confirmDelteTopic(item, section)"
                                                >
                                                    <v-icon>mdi-trash-can</v-icon> 
                                                </v-btn>
                                            </template>
                                            <span>{{ $t('delete')}}</span>
                                        </v-tooltip>
                                    </div>
                                    <v-expansion-panel-header 
                                    class="sub-topics black--text"
                                    v-html="item.displayName"
                                >                                    
                                </v-expansion-panel-header>
                                </div>
                                
                                </v-expansion-panel>
                            </v-expansion-panels>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            
            </v-row>
        </v-card-text>
    </v-card>
    <confirm-box
            :title="confirmElements.title"
            :message="confirmElements.message"
            :cancelBtnText="confirmElements.cancelBtnText"
            :confirmBtnText="confirmElements.confirmBtnText"
            :confirmData="confirmElements.confirmData"
            :dialog="confirm"
            @confirm:action="deleteTopic"
        ></confirm-box>
    <EditTopic @close-modal="closeEditTopic" :dialog="showEditTopic" :parentTopic="editedParentTopic" :topic="editedTopic" v-if="showEditTopic"/>
   </div>
</template>
<script>
import FaqService from '@/_services/FaqService.js'
import loading from "@/mixins/LoadingMixin";
import CreateTopic from "./CreateTopic.vue"
import EditTopic from "./EditTopic.vue"
import ConfirmBox from "@/components/ConfirmBox";
import GetPermittedActions from '../../mixins/GetPermittedActions';

    export default {
        mounted(){
            // this.getTopics();
        },
        components: {
            CreateTopic,
            EditTopic,
            ConfirmBox
        },
         watch:{
            '$route.params.section': {
                handler: function(section) {
                    if(section == 'topic')
                        this.getTopics()
                    },
                    deep: true,
                    immediate: true
                }
        },
        data(){
            return {
                panel: 0,
                topicList: [],
                selectedItem: null,
                createTopicDialog: false,
                showEditTopic: false,
                editedTopic: null,
                editedParentTopic: null,
                confirmElements: {
                    title: this.$t("deleteTopic"),
                    message: this.$t("deleteTechnicalIssuesTopic"),
                    confirmBtnText: this.$t('deleteTopic'),
                    cancelBtnText: this.$t('cancel'),
                    confirmData: {},
                },
                confirm: false
            }
        },
        methods: {
            getTopics(){
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
            selectItem (item) {
                this.selectedItem = item
            },
            unSelectItem () {
                this.selectedItem = null
            },

            closeTopicModal(suc) {
                if(suc === true) {
                    this.getTopics()
                }
                
                this.createTopicDialog = false
            },
            editTopic(topic, parent){
                this.editedTopic = topic
                this.editedParentTopic = parent;
                this.showEditTopic = true;
            },
            closeEditTopic() {
                this.getTopics()
                this.editedTopic = null
                this.editedParentTopic = null;
                this.showEditTopic = false;
            },

            deleteTopic(res, topic) {
                if(res){
                    this.startLoading()
                    const topicData = {
                        id: topic.id
                    }
                    FaqService.deleteTopic(topicData)
                    .then((result) => {
                        this.stopLoading()
                        this.$notify({
                            title: 'Topic deleted.',
                            type: 'success'
                        });
                        this.confirm = false;
                        this.getTopics()
                        console.log('re', result)
                    }).catch((err) => {
                        this.stopLoading()
                        console.log('e', err)
                    });
                }else{
                    this.confirm = false;
                }
            },

            confirmDelteTopic(topic) {
                this.confirmElements.confirmData = topic;
                this.confirm = true;
            }
        },
        mixins: [loading, GetPermittedActions]
    }
</script>

<style lang="scss" scoped>
::v-deep .tttt table {
    border-spacing: 0 0.5rem !important;
}


.sub-topics {
    ::v-deep .v-expansion-panel-header__icon{
        i {
            display: none;
        }
    }
}

</style>