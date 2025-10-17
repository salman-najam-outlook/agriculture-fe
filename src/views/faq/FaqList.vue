<template>
  <div>
    <v-card color="bg" flat>
      <v-card-text class="black--text">
        <div class="d-flex mb-4">
          <h2>{{ $t("faqs") }}</h2>
          <v-spacer></v-spacer>
          <v-btn color="primary" v-if="getModulePermittedActions.post" small depressed @click="openCreateFaq">{{ $t('faqSection.createFaq') }}</v-btn>
          <CreateFaq v-if="createFaqDialog" @close-modal="closeFaqModal" :dialog="createFaqDialog" />
        </div>
      </v-card-text>
    </v-card>
    <v-card flat class="rounded-xl">
      <v-card-text class="pa-10">
        <v-row v-if="faqList.length <= 0" justify="center" align="center">
          <v-col>
            <v-row justify="center">
              <v-img max-width="200" src="/img/no_faq_content.png"></v-img>
            </v-row>
            <v-row justify="center" class="mt-10">
              <div class="red--text ml-3 text-h5">{{$t('noData')}}</div>
            </v-row>
            <v-row justify="center" class="mt-5">
              <div class="black--text ml-3 text-h6">
                {{$t('faqSection.createSection')}}
              </div>
            </v-row>
          </v-col>
        </v-row>
        <v-row v-else justify="center" color="primary">
          <!--commented v-expanesion-panel :readonly="section.qas.length < 1" -->
          <v-expansion-panels class="mb-5" v-for="section in faqList" :key="section.id" flat focusable>
            <v-expansion-panel class="green2">
              <v-expansion-panel-header class="primary--text font-weight-bold" v-html="section.name">
              </v-expansion-panel-header>
              <v-expansion-panel-content class="pt-5 green2">
                <v-expansion-panels focusable flat>
                  <!-- Child FAQ Start -->
                  <!--commented v-expanesion-panel :readonly="childFaqs.qas.length < 1"" -->
                  <v-expansion-panels class="mb-5" v-for="childFaqs in section.childFaqs" :key="childFaqs.id" flat
                    focusable>
                    <v-expansion-panel class="">
                      <v-expansion-panel-header class="themeGrey collapse" v-html="childFaqs.name">
                      </v-expansion-panel-header>
                      <v-expansion-panel-content class="pt-5 green2">
                        <v-expansion-panels focusable flat>
                          <v-expansion-panel v-for="(item, i) in childFaqs.qas" :key="i" class="mb-1">
                          <div style="position: relative" @mouseover="selectItem(item)" @mouseleave="unSelectItem()">
                            <div style="
                                  position: absolute;
                                  right: 50px;
                                  top: 15px;
                                  z-index: 99999;
                                ">
                                <v-tooltip bottom v-if="getModulePermittedActions.put">
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-btn v-show="item.id" depressed x-small fab v-bind="attrs" v-on="on"
                                      @click.native.stop="editFaq(item, childFaqs)">
                                      <v-icon>mdi-pencil</v-icon>
                                    </v-btn>
                                  </template>
                                  <span>{{ $t("edit") }}</span>
                                </v-tooltip>
                                <v-tooltip bottom v-if="getModulePermittedActions.delete"> 
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-btn v-show="item.id" x-small fab v-bind="attrs" v-on="on" class="ml-2" @click.native.stop="
                                      confirmDelteFaq(item, childFaqs)
                                    ">
                                      <v-icon>mdi-trash-can</v-icon>
                                    </v-btn>
                                  </template>
                                  <span>{{ $t("delete") }}</span>
                                </v-tooltip>
                              </div>
                            <v-expansion-panel-header v-html="item.question">                              
                            </v-expansion-panel-header>
                          </div>
                            
                            <v-expansion-panel-content class="py-5" v-html="item.answer">
                            </v-expansion-panel-content>
                          </v-expansion-panel>
                        </v-expansion-panels>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>

                  <!-- Child Faq ends -->
                  <v-expansion-panel v-for="(item, i) in section.qas" :key="i" class="mb-1">
                  <div style="position: relative" @mouseover="selectItem(item)" @mouseleave="unSelectItem()">
                    <div style="position: absolute; right: 50px; top: 15px; z-index: 99999" v-if="item === selectedItem">
                        <v-tooltip bottom v-if="getModulePermittedActions.put">
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn v-show="item.id" style="z-index: 1111;" depressed x-small fab v-bind="attrs" v-on="on" @click.native.stop="editFaq(item, section)">
                              <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                          </template>
                          <span>{{ $t("edit") }}</span>
                        </v-tooltip>
                        <v-tooltip bottom v-if="getModulePermittedActions.delete">
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn v-show="item.id" x-small fab v-bind="attrs" v-on="on" class="ml-2"
                              @click.native.stop="confirmDelteFaq(item, section)">
                              <v-icon>mdi-trash-can</v-icon>
                            </v-btn>
                          </template>
                          <span>{{ $t("delete") }}</span>
                        </v-tooltip>
                      </div>
                      <v-expansion-panel-header
                      v-html="item.question">
                      
                    </v-expansion-panel-header>
                  </div>                    
                    <v-expansion-panel-content class="pa-5" v-html="item.answer">
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-row>
      </v-card-text>
    </v-card>
    <confirm-box :title="confirmElements.title" :message="confirmElements.message"
      :cancelBtnText="confirmElements.cancelBtnText" :confirmBtnText="confirmElements.confirmBtnText"
      :confirmData="confirmElements.confirmData" :dialog="confirm" @confirm:action="deleteFaq"></confirm-box>
    <EditFaq @close-modal="closeEditFaq" :dialog="showEditFaq" :faq="editedFaq" :section="editedSection"
      v-if="showEditFaq" />
  </div>
</template>
<script>
import FaqService from "@/_services/FaqService.js";
import loading from "@/mixins/LoadingMixin";
import CreateFaq from "./CreateFaq.vue";
import EditFaq from "./EditFaq.vue";
import ConfirmBox from "@/components/ConfirmBox";
import GetPermittedActions from "../../mixins/GetPermittedActions";

export default {
  mounted() {
    // this.getFaq();
  },
  components: {
    CreateFaq,
    EditFaq,
    ConfirmBox,
  },
  watch: {
    "$route.params.section": {
      handler: function (section) {
        if (section == "faq") this.getFaq();
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      panel: null,
      faqList: [],
      selectedItem: null,
      createFaqDialog: false,
      showEditFaq: false,
      editedFaq: null,
      editedSection: null,
      confirmElements: {
        title: "Delete FAQ",
        message: "Are you sure you want to delete this FAQ?",
        confirmBtnText: "DELETE FAQ",
        cancelBtnText: "CANCEL",
        confirmData: {},
      },
      confirm: false,
    };
  },
  methods: {
    getFaq() {
      this.startLoading();
      FaqService.getAllFaq()
        .then((result) => {
          this.faqList = result.data;
          this.stopLoading();
        })
        .catch((err) => {
          console.log(err);
          this.stopLoading();
        });
    },

    selectItem(item) {
      this.selectedItem = item;
    },
    unSelectItem() {
      this.selectedItem = null;
    },
    openCreateFaq() {
      this.createFaqDialog = !this.createFaqDialog;
    },

    closeFaqModal(suc) {
      if (suc === true) {
        this.getFaq();
      }

      this.createFaqDialog = false;
    },

    deleteFaq(res, data) {
      if (res) {
        var { faq, section } = data;
        if (faq.id === undefined || faq.id === null) {
          this.$notify({
            title: "Unable to delete.",
            type: "error",
          });
          this.confirm = false;
          return;
        }
        this.startLoading();
        const faqData = {
          id: faq.id,
          name: section.id,
        };
        FaqService.deleteFaq(faqData)
          .then((result) => {
            this.stopLoading();
            this.$notify({
              title: "Faq deleted.",
              type: "success",
            });
            this.confirm = false;
            this.getFaq();
            console.log("re", result);
          })
          .catch((err) => {
            this.confirm = false;
            this.stopLoading();
            console.log("e", err);
          });
      } else {
        this.confirm = false;
      }
    },

    editFaq(faq, section) {
      if (faq.id === undefined || faq.id === null) {
        this.$notify({
          title: "Can not edit or update.",
          type: "error",
        });
        return;
      }
      this.editedFaq = faq;
      this.editedSection = section;
      this.showEditFaq = true;
    },

    closeEditFaq() {
      this.getFaq();
      this.editedFaq = null;
      this.editedSection = null;
      this.showEditFaq = false;
    },

    confirmDelteFaq(faq, section) {
      this.confirmElements.confirmData = { faq, section };
      this.confirm = true;
    },
  },
  mixins: [loading, GetPermittedActions],
};
</script>

<style lang="scss" scoped>
::v-deep .tttt table {
  border-spacing: 0 0.5rem !important;
}

::v-deep .v-expansion-panel-header__icon {
  display: none;
}
</style>