<template>
    <div>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <div class="d-flex mb-4">
                <h2>{{ $t('deforestation.complianceCertification') }}</h2>
                <v-spacer></v-spacer>
            </div>

            <v-card elevation="0" class="px-5">
                <v-card-text>
                    <v-data-table :headers="tableHeaders" :items="filterData" :items-per-page="10" :footer-props="{
                        'items-per-page-options': [10, 25, 50],
                    }" hide-default-footer :loading="loading" :options.sync="options"
                        :server-items-length="totalComplianceCertifications"
                        :loading-text="$t('deforestation.loadingDeforestationComplianceReport')">
                        <template v-slot:top="{ }">
                            <div class="d-flex mt-5">
                                <v-text-field prepend-inner-icon="mdi-magnify" @keyup.enter="searchQuery" outlined
                                    height="5px" :placeholder="$t('search')" dense v-model="search" class="shrink">
                                </v-text-field>

                                <v-btn class="mx-2 py-5 " @click="resetSearchOnEmpty">
                                    <v-icon dark>
                                        autorenew
                                    </v-icon>
                                </v-btn>
                                <!-- all countries -->
                                <v-select class="mx-2" v-model="countryModel" item-text="text" item-value="val" :items="countries" :label="$t('deforestation.allCountries')"  @change="filterData" outlined dense>
                                </v-select>

                                <!-- all regions -->
                                <v-select class="mx-2" v-model="regionModel" item-text="text" item-value="val" :items="allRegions" :label="$t('deforestation.allRegions')"  @change="filterData" outlined dense>
                                </v-select>

                                <!-- farms -->
                                <!-- <v-select class="mx-2" :items="allFarms" :label="$t('deforestation.allFarms')" outlined dense>
                                </v-select> -->

                                <!-- status -->
                                <!-- <v-select class="mx-2" :items="allStatus" :label="$t('deforestation.allStatus')" outlined dense>
                                </v-select> -->

                                <v-spacer></v-spacer>
                                <div class="py-1 title">
                                    {{ from }} - {{ to }} {{ $t('of') }} {{ totalComplianceCertifications }}
                                </div>
                                <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page <= 1"
                                    @click="pageChange(false)">
                                    <v-icon dark>
                                        mdi-chevron-left
                                    </v-icon>
                                </v-btn>
                                <v-btn class="mx-2" fab small outlined color="primary"
                                    :disabled="options.page >= totalPages" @click="pageChange(true)">
                                    <v-icon dark>
                                        mdi-chevron-right
                                    </v-icon>
                                </v-btn>

                                <v-menu v-model="customizeMenu" :close-on-content-click="false" :nudge-width="200"
                                    left :min-width="417">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn class="mx-2" fab small outlined color="primary" v-bind="attrs"
                                            v-on="on">
                                            <v-icon dark> mdi-cog-outline </v-icon>
                                        </v-btn>
                                    </template>

                                    <v-card width="417">
                                        <v-list>
                                            <v-list-item>
                                                <v-list-item-content>
                                                    <v-list-item-title>{{
                                                            $t("deforestation.customization")
                                                    }}</v-list-item-title>
                                                </v-list-item-content>
                                            </v-list-item>
                                            <v-divider></v-divider>
                                            <div class="pl-3 pt-2 font-weight-normal">
                                                {{ $t("deforestation.recordsPerpage") }}
                                            </div>
                                            <v-list-item>
                                                <v-list-item-content>
                                                    <v-slider v-model="itemsPerPageSlider"
                                                        :tick-labels="itemsPerPageOptions" :max="3" step="1"
                                                        ticks="always" tick-size="4"></v-slider>
                                                </v-list-item-content>
                                            </v-list-item>
                                            <v-divider class="mt-n3"></v-divider>
                                        </v-list>
                                        <v-card-text>
                                            <v-container fluid>
                                                <v-row>
                                                    <v-col class="mt-n9" cols="6" v-for="header in headers"
                                                        :key="header.value">
                                                        <v-checkbox v-if="header.text.length > 0" v-model="selectedHeaders" :label="header.text"
                                                            color="primary" :value="header.text" hide-details
                                                            :disabled="
                                                                header.text == 'ID' || header.text == 'Tag'
                                                            "></v-checkbox>
                                                    </v-col>
                                                </v-row>
                                            </v-container>
                                        </v-card-text>
                                        <v-layout justify-center>
                                            <v-card-actions class="mb-5">
                                                <v-spacer></v-spacer>

                                                <v-btn outlined color="primary" @click="resetDefault" width="190">
                                                    {{ $t("deforestation.restoreDefault") }}
                                                </v-btn>
                                                <v-btn color="primary" @click="resetTableStructure" width="190">
                                                    {{ $t("deforestation.apply") }}
                                                </v-btn>
                                            </v-card-actions>
                                        </v-layout>
                                    </v-card>
                                </v-menu>
                            </div>
                            <v-expansion-panels accordion class="mb-4">
                              <v-expansion-panel
                              >
                                <v-expansion-panel-header style="background-color: #117443; color: white; padding: 20px;">{{ $t('deforestation.deforestationProbability') }}</v-expansion-panel-header>
                                <v-expansion-panel-content>
                                  <v-row no-gutters class="mt-4">
                                    <v-col v-for="probab in avgProbab" :key="probab.label">
                                      <div class="d-flex">
                                        <div
                                          class="color-box"
                                          :style="{ background: probab.colorCode }"
                                        ></div>
                                        <span class="ml-2">{{ probab.label }}</span>
                                        <span class="ml-2">{{ parseFloat(probab.percent.toFixed(2)) }}%</span>
                                      </div>
                                    </v-col>
                                  </v-row>
                                </v-expansion-panel-content>
                              </v-expansion-panel>
                            </v-expansion-panels>
                        </template>
                        <template v-if="filterData.length" v-slot:body="{ items }">
                            <tbody>
                                <tr v-for="item in items" :key="item.id" style="position: relative; width: 0; height: 0"
                                    @mouseover="selectItem(item)" @mouseleave="selectItem(false)">
                                    <template v-for="h in tableHeaders">
                                        <td class="text-truncate" :key="h.value" v-if="h.value == 'farmName'">
                                            {{ item.farmName ? item.farmName : "N/A" }}
                                        </td>

                                        <td class="text-truncate" :key="h.value"
                                                v-else-if="h.value == 'farmLocation'">
                                            {{ item.locationName ? item.locationName : 'N/A' }}
                                        </td>

                                        
                                        <td class="text-truncate" :key="h.value"
                                                v-else-if="h.value == 'dateOfRequest'">
                                            {{ getDateFormat(item.createdAt) }}
                                        </td>

                                          <td class="text-truncate" :key="h.value"
                                            v-else-if="h.value == 'overallProb'">
                                              <v-chip :style="{ border: '1px solid #e2e2e2', backgroundColor: getColor(item), color: getColorByBgColor(item.overallProbColorCode) }">
                                                {{ getTranslatedStatus(item.originalOverallProb || item.overallProb) }}
                                              </v-chip>
                                        </td>

                                        <td v-else :key="h.value" >
                                            <div style="position: absolute; right: 10px; top:10px;">
                                                <v-menu>
                                                    <template v-slot:activator="{ on, attrs }">
                                                    <v-btn
                                                        icon
                                                        v-bind="attrs"
                                                        v-on="on"
                                                    >
                                                        <v-icon>mdi-dots-vertical</v-icon>
                                                    </v-btn>
                                                    </template>

                                                    <v-list>
                                                        <v-list-item :to="{ name: 'ComplianceCertificationEudrAssessment', params: { id: item.id } }">
                                                            <v-list-item-title>{{ $t('view') }}</v-list-item-title>
                                                        </v-list-item>
                                                        <v-list-item :href="item.etherScanLink" target="_blank">
                                                            <v-list-item-title>{{ $t('deforestation.openBlockchainPage') }}</v-list-item-title>
                                                        </v-list-item>
                                                    </v-list>
                                                </v-menu>
                                            </div>
                                        </td>
                                    </template>
                                </tr>
                            </tbody>
                        </template>
                        <template v-slot:footer></template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-container>
    </div>
</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin";
import download from "@/mixins/DownloadMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import DateMixin from '@/mixins/DateMixin';
import DeforestationService from "@/_services/DeforestationService";
import moment from "moment";
import _ from 'lodash';
import { getColorByBgColor } from '@/utils';
export default {
   
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
            avgProbab : [],
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
            loading: false,
            totalComplianceCertifications: 1,
            tab: 0,
            selectedItem: false,
            options: {
                itemsPerPage: 10,
                page: 1
            },
            totalPages: 0,
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
            breadcrumbs: [
                {
                    text: this.$t("dashboard"),
                    disabled: false,
                    to: { name: "Users" },
                    exact: true,
                },
                {
                    text: this.$t("deforestation.complianceCertification"),
                    disabled: true,
                    href: "breadcrumbs_link_1",
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
      getColorByBgColor,
      getColor(item) {
        const overallProbConfig = this.avgProbab.find(config => (item.originalOverallProb || item.overallProb).startsWith(config.type.split('/')[0]));
        return overallProbConfig?.colorCode || item.overallProbColorCode;
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
  