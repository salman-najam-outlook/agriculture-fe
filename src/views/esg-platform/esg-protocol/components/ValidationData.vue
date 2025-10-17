<template>
  <div v-if="protocol">
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <div class="d-flex flex-column px-4 mb-4">
      <div>
        <div class="d-flex flex-wrap align-center justify-space-between">
          <h1 class="text-h5 font-weight-bold">{{ $t('esgPlatform.validation.validateData') }}</h1>
          <v-btn color="primary" @click="$router.go(-1)">{{ $t('back') }}</v-btn>
        </div>
        <ProtocolInformation :show-actions="showActions" :protocol="protocol" :sub-organization-id="1" />
      </div>
    </div>
    <v-container fluid>
      <div v-for="(category) in categories" :key="category.title" class="mb-8">
        <v-card elevation="0" :class="getCategoryClass(category.title)">
          <v-card-text>
            <div class="d-flex align-center mb-4">
              <div class="text-h6 font-weight-bold">{{ getCategory(category.title) }}</div>
              <v-spacer></v-spacer>
              <span class="text-h6 font-weight-bold">{{ category.totalValidations }} {{
                $t('esgPlatform.validation.dataValidations') }}</span>
            </div>
            <v-row class="d-flex align-center justify-space-between pa-3">
              <v-text-field v-model="category.searchTerm" prepend-inner-icon="mdi-magnify"
                :label="$t('esgPlatform.validation.search')" outlined dense hide-details class="mb-4"
                style="max-width: 200px; background-color: white;"></v-text-field>
              <div class="d-flex align-center">
                <span class="mr-2">{{ category.currentPage }} of {{ Math.ceil(category.totalValidations /
                  itemsPerPageOptions[category.itemsPerPageIndex]) }}</span>
                <v-btn class="mx-2" fab small outlined color="primary" @click="prevPage(category)"><v-icon
                    dark>mdi-chevron-left</v-icon></v-btn>
                <v-btn class="mx-2" fab small outlined color="primary" @click="nextPage(category)"><v-icon
                    dark>mdi-chevron-right</v-icon></v-btn>
                <v-menu v-model="category.menu" :close-on-content-click="false" :nudge-width="200" left
                  :min-width="417">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn class="mx-2" fab small outlined color="primary" v-bind="attrs" v-on="on"><v-icon
                        dark>mdi-cog-outline</v-icon></v-btn>
                  </template>
                  <v-card width="417">
                    <v-list>
                      <v-list-item><v-list-item-content><v-list-item-title>{{ $t("deforestation.customization")
                      }}</v-list-item-title></v-list-item-content></v-list-item>
                      <v-divider></v-divider>
                      <v-list-item><v-list-item-content>
                          <div class="pl-3 pt-2 font-weight-normal">{{ $t("deforestation.recordsPerpage") }}</div>
                          <v-slider v-model="category.itemsPerPageIndex" :tick-labels="itemsPerPageOptions" :max="3"
                            step="1" ticks="always" tick-size="4"></v-slider>
                        </v-list-item-content></v-list-item>
                      <v-divider></v-divider>
                      <v-list-item><v-list-item-content><v-list-item-title>{{ $t("deforestation.visibleColumns")
                      }}</v-list-item-title></v-list-item-content></v-list-item>
                      <v-list-item><v-row><v-col class="mt-n9" cols="6" v-for="header in headers"
                            :key="header.value"><v-checkbox v-if="header.text" v-model="category.selectedHeaders"
                              :label="header.text" color="primary" :value="header.value"
                              hide-details></v-checkbox></v-col></v-row></v-list-item>
                      <v-divider></v-divider>
                    </v-list>
                    <v-card-actions class="mb-5 justify-center">
                      <v-btn outlined color="primary" @click="resetDefaut(category)" width="190"><span
                          class="text-truncate" style="max-width:150px">{{ $t("deforestation.restoreDefault")
                          }}</span></v-btn>
                      <v-btn color="primary" @click="resetTableStructure(category)" width="190">{{
                        $t("deforestation.apply") }}</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-menu>
              </div>
            </v-row>
            <v-card class="mb-4">
              <v-row class="white--text py-2 px-4 ma-0" style="background: #117443;">
                <v-col cols="5" v-if="category.selectedHeaders.includes('inputData')">{{
                  $t('esgPlatform.validation.inputData')
                }}</v-col>
                <v-col cols="2" v-if="category.selectedHeaders.includes('question')">{{
                  $t('esgPlatform.validation.question')
                }}</v-col>
                <v-col cols="4" v-if="category.selectedHeaders.includes('issueGoal')">{{
                  $t('esgPlatform.validation.issueAndGoal')
                }}</v-col>
                <v-col cols="1"></v-col>
              </v-row>
            </v-card>
            <div v-for="(item, index) in category.items" :key="index">
              <v-card elevation="2" class="mb-4">
                <v-card-text class="pa-4">
                  <v-row align="center">
                    <v-col cols="5" v-if="category.selectedHeaders.includes('inputData')">
                      <div v-if="item.type === 'actionPlan'">
                        <span class="font-weight-bold">{{ item.response.title }}</span>
                        <div v-if="item.response.files?.length">
                          <div v-for="(file, idx) in item.response.files" :key="idx">
                            <template v-if="isImage(file.fileName || file.key)">
                              <img
                                :src="file.fileUrl || `https://dimitra-pre-prod-public-images.s3.amazonaws.com/${file.key}`"
                                :alt="file.fileName || file.key" style="max-width: 100px;" />
                            </template>
                            <template v-else>
                              <a :href="file.fileUrl || `https://dimitra-pre-prod-public-images.s3.amazonaws.com/${file.key}`"
                                target="_blank">{{ file.fileName || file.key }}</a>
                            </template>
                          </div>
                        </div>
                      </div>
                      <v-row v-else-if="item.type === 'getData'" class="flex-row">
                        <span class="font-weight-bold ml-2">{{ cleanTitle(item.response.title) }} :</span>
                        <div class="ml-2"></div>
                        <div v-html="formatResponse(item)"></div>
                      </v-row>
                      <div v-else>
                        <span v-html="formatResponse(item)"></span>
                      </div>
                    </v-col>
                    <v-col cols="2" class="d-flex justify-start align-center" onclick="OpenQuestionDialog"
                      v-if="category.selectedHeaders.includes('question')">
                      <span>{{ item.heading.order }}.{{ item.question.order }}</span>
                      <v-btn icon class="ml-2" @click="openQuestionDialog(item)">
                        <img src="/icons/icon-clipboard.svg" style="width: 26px; height: 26px; border-radius: 50%;" />
                      </v-btn>
                    </v-col>
                    <v-col cols="4" v-if="category.selectedHeaders.includes('issueGoal')">
                      <div class="font-weight-bold">{{ item.issue.title }}</div>
                      <div class="font-weight-medium">{{ item.goal.title }}</div>
                    </v-col>
                    <v-col cols="1" class="d-flex justify-space-between align-center">
                      <v-btn v-if="!isSubEnterprise" icon small color="red" @click="openRejectDialog(item.responseId)">
                        <img src="/img/esg/data-reject-icon.svg" alt="reject"
                          style="width: 26px; height: 26px; border-radius: 50%;" />
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </div>
          </v-card-text>
        </v-card>
      </div>
      <ValidationConfirm :dialog="showDialog" @cancel="showDialog = false" @confirm="handleConfirm" />
      <QuestionDialog :dialog="showQuestionDialog" :question-data="selectedQuestion" :answer-data="selectedAnswer"
        @close="showQuestionDialog = false" />
    </v-container>
  </div>
</template>
<script>
import ValidationConfirm from './ValidationConfirm.vue';
import QuestionDialog from './QuestionDialog.vue';
import EsgService from "@/_services/EsgService";
import ProtocolInformation from '../../dashboard/components/protocol/sub-organization/ProtocolInformation.vue';
import LoadingMixin from "@/mixins/LoadingMixin";
import { mapGetters } from 'vuex';

export default {
  components: { ValidationConfirm, QuestionDialog, ProtocolInformation },
  mixins: [LoadingMixin],
  data() {
    return {
      breadcrumbs: [
        { text: this.$t('esgPlatform.common.esgCompliance'), disabled: false, to: { name: 'eudrDashboard' } },
        { text: this.$t('dashboard'), link: true, exact: true, disabled: true },
      ],
      showDialog: false,
      protocol: null,
      subOrganizationId: this.$route.params.subOrganizationId,
      categories: [
        { title: 'Environmental', items: [], searchTerm: '', currentPage: 1, totalValidations: 0, itemsPerPageIndex: 1, menu: false, selectedHeaders: ['question', 'inputData', 'issueGoal'] },
        { title: 'Social', items: [], searchTerm: '', currentPage: 1, totalValidations: 0, itemsPerPageIndex: 1, menu: false, selectedHeaders: ['question', 'inputData', 'issueGoal'] },
        { title: 'Governance', items: [], searchTerm: '', currentPage: 1, totalValidations: 0, itemsPerPageIndex: 1, menu: false, selectedHeaders: ['question', 'inputData', 'issueGoal'] },
      ],
      itemsPerPageOptions: [5, 10, 25, 50],
      headers: [
        { text: 'Question', value: 'question' },
        { text: 'Input Data', value: 'inputData' },
        { text: 'Issue & Goal', value: 'issueGoal' },
      ],
      debounceTimeouts: {
        Environmental: null,
        Social: null,
        Governance: null,
      },
      selectedResponseId: null,
      showActions: false,
      showQuestionDialog: false,
      selectedQuestion: null,
      selectedAnswer: null,
    };
  },
  computed: {
    ...mapGetters(['isSubEnterprise']),
  },
  mounted() {
    this.fetchProtocolDetail();
    this.fetchAllData();
  },
  watch: {
    'categories.0.searchTerm'(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.debounceFetchCategoryData(this.categories[0]);
      }
    },
    'categories.1.searchTerm'(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.debounceFetchCategoryData(this.categories[1]);
      }
    },
    'categories.2.searchTerm'(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.debounceFetchCategoryData(this.categories[2]);
      }
    }
  },
  methods: {
    debounceFetchCategoryData(category) {
      if (this.debounceTimeouts[category.title]) {
        clearTimeout(this.debounceTimeouts[category.title]);
      }
      this.debounceTimeouts[category.title] = setTimeout(() => {
        category.currentPage = 1;
        this.fetchCategoryData(category);
      }, 300);
    },
    async fetchProtocolDetail() {
      this.startLoading();
      const response = await EsgService.getEsgStandardDetails(this.$route.params.id);
      this.protocol = response.data;
      this.stopLoading();
    },
    async fetchAllData() {
      this.startLoading();
      const protocolId = this.$route.params.id;
      const promises = this.categories.map(category =>
        EsgService.getValidationData(protocolId, {
          type: category.title,
          page: category.currentPage,
          limit: this.itemsPerPageOptions[category.itemsPerPageIndex],
          searchTerm: category.searchTerm
        })
      );
      try {
        const responses = await Promise.all(promises);
        responses.forEach((response, index) => {
          const category = this.categories[index];
          if (response.success) {
            const allItems = response.data.info.info || [];
            category.items = allItems.filter(item => item.rejectionReason == null);
            category.totalValidations = response.data.info.total || 0;
          } else {
            console.error(`Error fetching data for ${category.title}:`, response.message);
            category.items = [];
          }
        });
      } catch (error) {
        console.error('API error:', error);
        this.categories.forEach(category => { category.items = []; });
      } finally {
        this.stopLoading();
      }
    },
    formatResponse(item) {
      if (item.type === 'actionPlan') {
        let result = `<span class="font-weight-bold">${item.response.title || 'No title'}</span>`;
        if (item.response.files?.length) {
          const filesHtml = item.response.files.map(file => this.formatFile(file)).join('<br>');
          result += `<div>${filesHtml}</div>`;
        }
        return result;
      } else if (item.type === 'getData') {
        const value = item.response?.value;
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
        // Main response
        const type = item.question.questionType;
        const response = item.response || {};
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
                ? `<img src="${response.value.attachmentLink}" alt="Signature" style="max-width: 100px;" />`
                : `<a href="${response.value.attachmentLink}" target="_blank">View Signature</a>`;
            }
            return 'No signature';
          case 'get-data':
            return 'No data'; // Handled separately by getData items
          default:
            return 'Unknown type';
        }
      }
    },
    formatFile(file) {
      const url = file.fileUrl || `https://dimitra-pre-prod-public-images.s3.amazonaws.com/${file.key}`;
      const name = file.fileName || file.key || 'Unnamed file';
      return this.isImage(name)
        ? `<img src="${url}" alt="${name}" style="max-width: 100px;" />`
        : `<a href="${url}" target="_blank">${name}</a>`;
    },
    isImage(fileString) {
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg'];
      const path = (fileString || '').split('?')[0];
      const ext = path.slice(path.lastIndexOf('.')).toLowerCase();
      return imageExtensions.includes(ext);
    },
    cleanTitle(title) {
      return title.replace(/\s*\[.*\]\s*$/, '').trim();
    },
    nextPage(category) {
      const totalPages = Math.ceil(category.totalValidations / this.itemsPerPageOptions[category.itemsPerPageIndex]);
      if (category.currentPage < totalPages) {
        category.currentPage++;
        this.fetchCategoryData(category);
      }
    },
    prevPage(category) {
      if (category.currentPage > 1) {
        category.currentPage--;
        this.fetchCategoryData(category);
      }
    },
    async fetchCategoryData(category) {
      const protocolId = this.$route.params.id;
      try {
        const response = await EsgService.getValidationData(protocolId, {
          type: category.title,
          page: category.currentPage,
          limit: this.itemsPerPageOptions[category.itemsPerPageIndex],
          searchTerm: category.searchTerm
        });
        if (response.success) {
          const allItems = response.data.info.info || [];
          category.items = allItems.filter(item => item.rejectionReason == null);
          category.totalValidations = response.data.info.total || 0;
        } else {
          console.error(`Error fetching data for ${category.title}:`, response.message);
          category.items = [];
        }
      } catch (error) {
        console.error('API error:', error);
        category.items = [];
      }
    },
    async resetDefaut(category) {
      category.itemsPerPageIndex = 1;
      category.selectedHeaders = ['question', 'inputData', 'issueGoal'];
      await this.fetchCategoryData(category);
      category.menu = false;
    },
    async resetTableStructure(category) {
      await this.fetchCategoryData(category);
      category.menu = false;
    },
    getCategoryClass(title) {
      const classes = { 'Environmental': 'environmental-card', 'Social': 'social-card', 'Governance': 'governance-card' };
      return classes[title] || '';
    },
    getCategory(title) {
      if (title === 'Environmental') return this.$t('esgPlatform.validation.environmental');
      if (title === 'Social') return this.$t('esgPlatform.validation.social');
      if (title === 'Governance') return this.$t('esgPlatform.validation.governance');
    },
    openRejectDialog(responseId) {
      this.selectedResponseId = responseId;
      this.showDialog = true;
    },
    openQuestionDialog(item) {
      // Use the specific item that was clicked instead of searching for it
      console.log("item", item);
      console.log("item.response", item.response);

      // Map the data structure to match what QuestionDialog expects
      this.selectedQuestion = {
        ...item.question,
        heading: item.heading,
        issue: item.issue,
        goal: item.goal,
        assessment: item.assessment,
        order: item.question.order,
        questionType: item.question.questionType,
        title: item.question.title,
        description: item.question.description || '',
        score: item.question.score,
        index: item.index
      };
      this.selectedAnswer = item;
      this.showQuestionDialog = true;
    },
    handleConfirm(rejectionReason) {
      if (this.selectedResponseId) {
        this.confirmRejection(this.selectedResponseId, rejectionReason);
      }
    },
    async confirmRejection(responseId, rejectionReason) {
      try {
        if (!rejectionReason) {
          this.$toast.error(this.$t('esgPlatform.validation.reasonRequired'));
          return;
        }
        const payload = { esgAssessmentResponseId: responseId, rejectionReason };
        this.startLoading();
        await EsgService.validateResponse(payload);
        this.$notify({
          title: this.$t("esgPlatform.validation.rejectionSuccess"),
          type: "success",
        });
        await this.fetchAllData();
      } catch (error) {
        console.error('Error confirming rejection:', error);
        this.$notify({
          title: this.$t('esgPlatform.validation.rejectionFailed'),
          type: 'error',
        });
      } finally {
        this.showDialog = false;
        this.selectedResponseId = null;
        this.stopLoading();
      }
    },
  }
}
</script>

<style scoped>
.environmental-card {
  background: #E4FFF2;
}

.social-card {
  background: #EFFDFF;
}

.governance-card {
  background: #FFF4E8;
}
</style>