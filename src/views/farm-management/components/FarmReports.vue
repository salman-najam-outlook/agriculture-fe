<template>
  <div>



    
      <!-- <v-container fluid> -->

        <template>
          <!-- <v-card class="px-5" flat> -->
            <v-tabs
              left
              v-model="tab"
              background-color="transparent"
              color="primary"
            >
              <v-tab class="text-capitalize" v-for="item in items" :key="item">
                {{ item }}
              </v-tab>
            </v-tabs>
            <v-divider></v-divider>
            <v-tabs-items v-model="tab" class="mt-5">
              <v-tab-item>
                <ComplianceListing :farm="farm"></ComplianceListing>
              </v-tab-item>
            </v-tabs-items>
          <!-- </v-card> -->
        </template>
      <!-- </v-container> -->
  </div>
</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin";
import download from "@/mixins/DownloadMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import DateMixin from '@/mixins/DateMixin';
import DeforestationService from "@/_services/DeforestationService";
import moment from "moment";
import ComplianceListing from "./ComplianceListing.vue";
import _ from 'lodash';
export default {
  components: {
    ComplianceListing
  },
 
  computed: {
      // totalPages() {

      //     return this.totalComplianceCertifications < this.itemsPerPageOptions[this.itemsPerPageSlider] ? 1 : Math.ceil(this.totalComplianceCertifications / this.itemsPerPageOptions[this.itemsPerPageSlider])
        
      // },
      getCurrentUser(){
          return this.$store.getters.getUser
      },
      filterData(){

          if((this.countryModel && this.countryModel !== '') || (this.regionModel && this.regionModel !== '')){
              return this.complianceCertifications.filter((item) => {
                  return (!this.countryModel || item.country === this.countryModel) &&
                      (!this.regionModel || item.state === this.regionModel);
              });
          }
          else {
              return this.complianceCertifications;
          }
      },
  },
  mounted(){
      this.itemsPerPageSlider = this.itemsPerPageOptions.indexOf(parseInt(localStorage.getItem('ITEMS_PER_PAGE'))) > 0 ? this.itemsPerPageOptions.indexOf(parseInt(localStorage.getItem('ITEMS_PER_PAGE'))) : 1
      this.tableHeaders = this.headers;
      this.selectedHeaders = this.allSelectedHeaders;
      this.getOverallProbability();
  },
  watch: {
      options: {
          handler(opt) {
              this.getComplianceCertification(opt);
          },
          deep: true,
      },
      itemsPerPageSlider: {
          handler(nV) {
              localStorage.setItem("ITEMS_PER_PAGE", this.itemsPerPageOptions[nV])
              console.log(nV, "new v")
              this.getComplianceCertification();
          },
          deep: true,
      }
  },
  data() {
      return {
        items: [
          this.$t('farm.deforestationReports')
        ],
          avgProbab : {},
          complianceCertifications: [
          ],
          countryModel: '',
          statusModel: 'All Statuses',
          regionModel: '',
          farmModel: 'All Farms',
          countries: [
              { text: this.$t('deforestation.allCountries'), val: '' },
          ],
          allStatus: [
              { text: this.$t('deforestation.allStatus'), val: 'All Statuses' },
              { text: this.$t('pending'), val: 'pending' },
              { text: this.$t('memberDataSection.approved'), val: 'approved' },
              { text: this.$t('memberDataSection.rejected'), val: 'rejected' },
          ],
          allRegions: [
              { text: this.$t('deforestation.allRegions'), val: '' },
          ],
          allFarms: [
              { text: this.$t('deforestation.allFarms'), val: 'All Farms' },
              { text: 'avocadoo farm', val: 'Avocado farms' }
          ],
          colorCode: {
              veryhighprobability: '#8B0000',
              highprobability: '#F02020',
              mediumprobability: '#FFA520',
              lowprobability: '#60DBDB',
              verylowprobability: '#208080',
              zeroprobability: '#f1f4f7',
          },
          loading: false,
          totalComplianceCertifications: 1,
          tab: 0,
          selectedItem: false,
          options: {
              itemsPerPage: 10,
              page: 1
          },
          search: "",
          from: 1,
          to: 0,
          headers: [
              {
                  text: this.$t("deforestation.farmName"),
                  align: "start",
                  value: "farmName",
                  class: "black--text",
              },
              {
                  text: this.$t("deforestation.farmLocation"),
                  align: "start",
                  value: "farmLocation",
                  class: "black--text",
                  sortable: true,
              },
              {
                  text: this.$t("deforestation.dateOfRequest"),
                  align: "start",
                  value: "dateOfRequest",
                  class: "black--text",
                  sortable: true,
              },
               {
                  text: this.$t('deforestation.eudrComplianceStatus'),
                  align: "start",
                  value: "overallProb",
                  class: "black--text",
                  sortable: true,
              },
              {
                  text: '',
                  align: "center",
                  value: "status",
                  class: "black--text",
                  sortable: false,
              },
          ],
          customizeMenu:false,
          itemsPerPageSlider: 1,
          itemsPerPageOptions: [5, 10, 25, 50],
    customizeMenuAll: '',
          selectedHeaders: [
          ],
          tableHeaders:[

          ],
          allSelectedHeaders:[
              this.$t("deforestation.farmName"),
              this.$t("deforestation.farmLocation"),
              this.$t("deforestation.dateOfRequest")
          ]
      };
  },
  methods: {
    getColor(risk) {
      let removeDeforestation = risk.replace('Deforestation', '');
      let simplifiedRisk = removeDeforestation.toLowerCase().replaceAll(' ', '');
      simplifiedRisk = simplifiedRisk.replace('/negligible', '');
      return this.colorCode[simplifiedRisk];
    },
    getTranslatedStatus(status) {
      const capitalizedTranslationKey = status.replace('Deforestation', '').replace('/', 'Or').replaceAll(' ', '');
      return this.$t(`deforestation.${_.camelCase(capitalizedTranslationKey)}`);
    },
    async getOverallProbability() {
      const requestParams = {
          page: this.options.page,
          limit: this.itemsPerPageOptions[this.itemsPerPageSlider]  || this.options.itemsPerPage,
          searcPhrase: this.search,
          organization:this.getCurrentUser.user_organization.id
      }
          DeforestationService.getOverallProbability(requestParams).then(res => {
          const data = res.data.overAllProb;
          this.avgProbab = data;
      }).catch(err => {
          console.log(err)
      })
    },
      async getComplianceCertification(opt) {
          this.loading = true;
          let itemsPerPageVal = localStorage.getItem('ITEMS_PER_PAGE') || this.itemsPerPageOptions[this.itemsPerPageSlider]  || this.options.itemsPerPage || 10
          const requestParams = {
              page: this.options.page,
              limit: parseInt(itemsPerPageVal),
              searcPhrase: this.search,
              organization:this.getCurrentUser.user_organization.id
          }
          if (opt?.sortBy?.length) {
              requestParams.orderField = opt.sortBy[0]
              requestParams.order = opt.sortDesc[0] ? 'DESC' : 'ASC'
          }
          DeforestationService.getComplianceCertifications(requestParams).then(res => {

              const { rows, totalCount } = res.data.deforestationAdmin;
              const countryLists = rows.filter(item=>item.country).map((item)=>{
                  return {
                      text:item.country,
                      val:item.country
                  }
              })
              const stateLists = rows.filter(item=>item.state).map((item)=>{
                  return {
                      text:item.state,
                      val:item.state
                  }
              })
              this.countries = [...this.countries,...countryLists];
              this.allRegions = [... this.allRegions, ...stateLists];

              this.complianceCertifications = rows
              this.totalComplianceCertifications = totalCount

              this.totalPages = Math.ceil(this.totalComplianceCertifications/this.itemsPerPageOptions[this.itemsPerPageSlider])

              this.from = (this.options.page-1)*this.itemsPerPageOptions[this.itemsPerPageSlider]+1
              
              this.to = (this.options.page * this.itemsPerPageOptions[this.itemsPerPageSlider])-(this.itemsPerPageOptions[this.itemsPerPageSlider]-this.complianceCertifications.length)
              this.loading = false
          }).catch(err => {
              this.loading = false
              console.log(err)
          })
      },
      selectItem(item) {
          this.selectedItem = item;
      },
      searchQuery() {
          this.options = {
              itemsPerPage: 10,
              page: 1,
          },
          this.getComplianceCertification();
      },
      resetSearchOnEmpty() {
          this.search = ''
          this.options = {
              itemsPerPage: 10,
              page: 1,
          },
              this.getComplianceCertification();
      },
      pageChange(t) {
          if (t) this.options.page = this.options.page + 1;
          else this.options.page = this.options.page - 1;
          this.getComplianceCertification();
      },

      getDateFormat(date) {
          return moment(date).format("YYYY/MM/DD");
      },

      resetTableStructure() {
          this.startLoading();
          this.tableHeaders = this.headers.filter((header) =>
              this.selectedHeaders.includes(header.text.toString())
          );
          this.customizeMenu = false;
          this.stopLoading();
      },

      resetDefault() {
          this.tableHeaders = this.headers;
          this.selectedHeaders = this.allSelectedHeaders;
          this.menu = false;
      },
  },
  mixins: [loadingMixin, download, getPermittedActions, DateMixin],
};
</script>
<style lang="scss" scoped>
.text-truncate {
max-width: 350px;
}
::v-deep .wdt.v-text-field {
  width: 250px;
}

::v-deep .v-tab:hover {
  background-color: #caf1e2;
  color: $primary_color !important;
}

::v-deep .v-data-table-header span {
  color: black;
}

::v-deep .v-expansion-panel-header__icon .v-icon {
color: rgb(255 255 255) !important;
}
.color-box{
width: 20px;
height: 20px;
flex-shrink: 0;
border-radius: 5px;
margin-left: 10px;
border: 1px soild;
}

::v-deep .center-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

::v-deep .img-center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 40%;
}
</style>
