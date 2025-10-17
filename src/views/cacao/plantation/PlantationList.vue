<template>
    <div>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <div class="d-flex mb-4">
                <h2>{{ $t('dashboardSection.plantations')}}</h2>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    dark
                    class="mr-2 mb-2"
                    @click="openSettings"
                >
                {{ $t('plantationSettings') }}
                </v-btn>
                <v-dialog v-model="dialogVisible" max-width="500">
                    <v-form
                        ref="plantationSettingForm"
                        v-model="valid"
                        >
                            <v-card class="fill-height">
                                <v-card-title class="primary" color="white" style="color: white;">{{ $t('plantationSettings') }}</v-card-title>
                                <v-spacer style="margin-top: 16px;"></v-spacer>
                                <v-card-text>
                                    <label>{{$t('PlantationsEachFarmerCanCreate')}}<span class="red--text">*</span></label>
                                    <v-text-field 
                                        type="number" 
                                        label="" 
                                        v-model="plantationSetting.autoApprovalLimit"
                                        required
                                        :rules="[v => !!v || $t('errors.required')]"
                                        style="max-width: 100px;" outlined></v-text-field>
                                    <label>{{$t('manageAdditionalPlantationRequests')}}<span class="red--text">*</span></label>
                                    <v-radio-group 
                                        v-model="plantationSetting.approvalOption">
                                        <v-radio :label="$t('autoApprove')" value="auto_approve"></v-radio>
                                        <v-radio :label="$t('adminApprovalRequired')" value="admin_approval"></v-radio>
                                    </v-radio-group>
                                </v-card-text>
                                <v-card-actions>
                                    <v-btn color="primary" @click="saveSettings">{{ $t('save') }}</v-btn>
                                    <v-btn color="danger" @click="closeSettings">{{ $t('cancel') }}</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-form>
                    </v-dialog>
            </div>
            <v-card
                elevation="0"
                class="px-5"
            >
                <v-card-text>
                    <v-data-table
                        :headers="headers"
                        :items="items"
                        :items-per-page="10"
                        v-model="selected"
                        :loading=loading
                        :loading-text="$t('userslist.userLoading')"
                        :footer-props="{
                            'items-per-page-options': [10, 25, 50],
                            'show-first-last-page': true,
                            'show-current-page': true,
                            'items-per-page-text': 'Item per page'
                        }"
                        :options.sync="tableOptions"
                        :server-items-length="totalPlantation"
                        hide-default-footer
                    >
                    <template v-slot:top>
                        <div class="d-flex mt-5">
                            <v-text-field
                                prepend-inner-icon="mdi-magnify"
                                outlined
                                height="5px"
                                :placeholder="$t('search')"
                                dense
                                v-model="search"
                                @click:append="searchPlantation"
                                @input="searchPlantation"
                                class="shrink"
                            ></v-text-field>
                           
                            <span class="mt-3 ml-5 font-weight-bold mr-1">{{ $t('status')}}</span>
                            <v-select
                                :items="[
                                    { text: $t('all'), val: 'all'},
                                    { text: $t('pending'), val: 'pending'},
                                    { text: $t('memberDataSection.approved'), val: 'approved'},
                                    { text: $t('memberDataSection.rejected'), val: 'rejected'},
                                ]"
                                item-text="text"
                                item-value="val"
                                dense
                                outlined
                                v-model="plantationType"
                                style="max-width:175px"
                                class="mr-5"
                                @change="getPlantation"
                            ></v-select>
                             <v-spacer></v-spacer>
                            <template>
                            <v-btn
                                color="primary"
                                height="40"
                                outlined
                                class="mr-4 px-4"
                                @click="downloadCsv"
                                small
                            >
                                <v-img width="20px" src="/icons/pngfile.png"></v-img> <span class="ml-2">{{ $t('exportAsCsv')}}</span>
                            </v-btn>
                            <!-- <v-spacer></v-spacer> -->
                            </template>
                            <div class="py-1 title">{{ from }} - {{ to }} {{$t('of')}} {{ totalPlantation }}</div>
                            <v-btn
                                class="mx-2"
                                fab
                                small
                                outlined
                                color="primary"
                                :disabled="tableOptions.page<=1"
                                @click="pageChange(false)"
                            >
                                <v-icon dark>
                                    mdi-chevron-left
                                </v-icon>
                            </v-btn>
                            <v-btn
                                class="mx-2"
                                fab
                                small
                                outlined
                                color="primary"
                                :disabled="tableOptions.page>=totalPages"
                                @click="pageChange(true)"
                            >
                                <v-icon dark>
                                    mdi-chevron-right
                                </v-icon>
                            </v-btn>
                        </div>
                    </template>
                    <template
                        v-slot:progress
                    >
                        <v-progress-linear
                        color="primary"
                        :height="6"
                        indeterminate
                        ></v-progress-linear>
                    </template>
                    <template
                         v-slot:no-data
                         v-if="items.length < 1"
                    >
                       {{ $t('userslist.noUser')}}
                    </template>
                <template v-if="items.length > 0" v-slot:body="{ items }">
                    <tbody>
                    <tr
                        v-for="item in items"
                        :key="item.id"
                        style="position: relative; width: 0; height: 0"
                    >
                    <td>
                        {{ 
                        item.userFarms.length 
                        ? `${item.userFarms[0].farmerFirstName !== null ? item.userFarms[0].farmerFirstName : ''} ${item.userFarms[0].farmerMiddleName !== null ? item.userFarms[0].farmerMiddleName: ''} ${item.userFarms[0].farmerLastName !== null ? item.userFarms[0].farmerLastName : ''}` 
                        : '' 
                      }}
                    </td>
                    <td> {{ item.userFarms.length > 0 && item.userFarms[0].user ? item.userFarms[0].user.email : '' }}</td>
                    <td> {{ item.userFarms.length > 0 && item.userFarms[0].user ? item.userFarms[0].user.mobile : '' }}</td>
                    <td class="capitlize"> {{ decodeHtmlEntities(item.plantation_name) }}</td>
                    <td class="capitlize"> {{ item.userFarms.length > 0 ? decodeHtmlEntities(item.userFarms[0].farmName) : "N/A" }}</td>
                    <td class="capitlize"> {{ formatDate(item.createdAt)}}</td>
                    <td class="text-capitlized text-center"> 
                        <v-btn
                            x-small 
                            rounded
                            min-width="120"
                            depressed
                            class="green2 black--text green-border"
                            height="34"
                            @click="editPlantation(item)"
                            v-if="item.status == 'pending'"
                        >
                        <!-- getModulePermittedActions.put -->

                           {{ $t('roleRequest.approve')}}/{{ $t('roleRequest.reject')}}
                        </v-btn>
                        <p v-else class="text-capitalize font-weight-bold" :class="getClass(item.status)">
                            {{ item.status  }}
                        </p>
                    </td>
                    </tr>
                  </tbody>
                </template>

                </v-data-table>
                
                </v-card-text>
        
            </v-card>
        </v-container>
        <EditPlantation :dialog="showEditPlantation" :editedData="editedPlantation" @close-modal="closePlantationModel"/>
    </div>

</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin"
import GeneralMixin from "@/mixins/GeneralMixin"
import getPermittedActions from "@/mixins/GetPermittedActions"
import PlantationService from "@/_services/PlantationService.js"
import UserService from "@/_services/UserService.js"
import EditPlantation from "./EditPlantation.vue"
import _ from 'lodash'
import { decodeHtmlEntities } from "@/utils.js"

export default {
    mounted() {  
        document.title = this.$t('dashboardSection.plantations');  
         const fetchData = async () => {
             this.getUserData()
        }
        fetchData()
    },
    watch: {
      tableOptions: {
        handler () {
          this.getPlantation()
        },
        deep: true,
      },
    },
    components: {
        EditPlantation
    },
    methods: {
        decodeHtmlEntities,
        getClass(s){
            return s == "rejected" ? 'red--text': 'primary--text';
        },
        async getPlantation() {
            this.loading = true;
            try{
                const data = await PlantationService.getCacaoPlantationData(this.tableOptions, this.plantationType, this.search);
                if(data.code == 200){
                    this.items = data.data.response;
                    this.totalPlantation = data.data.count;
                    this.totalPages = Math.ceil(this.totalPlantation/this.tableOptions.itemsPerPage)
                    this.from = (((this.tableOptions.page-1)*this.tableOptions.itemsPerPage)+1)
                    this.to = (this.tableOptions.page*this.tableOptions.itemsPerPage)-(this.tableOptions.itemsPerPage-data.data.response.length)
                    this.loading = false;
                }else{
                    this.loading = false;
                    this.items = []
                }
            }catch(e){
                this.loading = false;
                this.items = []
            }
        },

        searchPlantation: _.debounce(function() {
            this.tableOptions.page = 1;
            this.getPlantation()
        }, 1000),

        async getUserData() {
            this.appUserCount = await UserService.getUsersConunt('end_user')
            this.adminUserCount = await UserService.getUsersConunt('admin')
        },

        editPlantation(plantation) {
            this.editedPlantation = plantation;
            this.showEditPlantation = true;
        },

        pageChange(t){
            if(t)
                this.tableOptions.page = this.tableOptions.page+1
            else
                this.tableOptions.page = this.tableOptions.page-1

        },

        async downloadCsv() {
            this.startLoading()
            try{
                const {data} = await this.$http.get(`/cacao/plantation/cacao-plantation-csvFile?status=${this.plantationType}`)
                if(data.code == 200){
                    const anchor = document.createElement('a');
                    anchor.href = data.data;
                    anchor.target = '_blank';
                    anchor.download = 'cacao-plantation.csv';
                    anchor.click();
                }
                this.stopLoading()
            }catch(err){
                this.stopLoading()
            }
        },

        closePlantationModel(suc){
            if(suc) this.getPlantation()
            this.showEditPlantation = false
        },
        async openSettings() {
            this.dialogVisible = true
            this.startLoading()
            const result = await PlantationService.getCacaoPlantationSetting();
            this.plantationSetting = result.data;
            this.stopLoading()
        },
        closeSettings() {
            this.dialogVisible = false
        },
        async saveSettings() {
            if(!this.$refs.plantationSettingForm.validate()) return;
            const res = await PlantationService.saveCacaoPlantationSetting(this.plantationSetting);
            if(res.code === 200){
                this.$notify({
                    title: 'Cacao plantation settings updated successfully.',
                    type: 'success'
                })
            }
            this.closeSettings()
        }
    },
    data () {
      return {
        plantationType: 'all',
        csvData: null,
        appUserCount: 0,
        adminUserCount: 0,
        tab: 0,
        from: 0,
        to:0,
        totalPages: 1,
        totalPlantation: 0,
        tableOptions: {},
        showStatusType: 'end_user',
        search: '',
        selected: [],
        items: [],
        selectedItem: false,
        loading: false,
        showAddUser: false,
        showEditPlantation: false,
        showEditAppUser: false,
        showUploadUser: false,
        editedPlantation: {},
        breadcrumbs: [
            {
                text: this.$t('dashboard'),
                disabled: true,
                to: '/',
            },
            {
                text: this.$t('dashboardSection.plantations'),
                disabled: true,
                to: 'breadcrumbs_link_1',
            },
        ],
        headers: [
            {
                text: this.$t('plantation.farmerName'),
                align: 'start',
                sortable: true,
                value: 'user',
                class: "black--text" ,
            },
            {
                text: this.$t('email'),
                align: 'start',
                sortable: true,
                value: 'user',
                class: "black--text" ,
            },
            {
                text: this.$t('plantation.phoneNumber'),
                align: 'start',
                sortable: true,
                value: 'user',
                class: "black--text" ,
            },
            { 
                text: this.$t('plantation.plantationName'),
                value: 'plantation_name',
                sortable: true,
                class: "black--text",
            },
            { 
                text: `${this.$t('plantation.farm')}/${this.$t('plantation.location')}`,
                value: 'farm' ,
                sortable: true,
                class: "black--text",
            },
            { 
                text: this.$t('date'),
                value: 'createdAt',
                sortable: true,
                class: "black--text",
            },
            { 
                text: this.$t('status'),
                value: 'status',
                align: 'center',
                sortable: true,
                class: "black--text",
            },
        ],
        dialogVisible: false,
        plantationSetting: {
            autoApprovalLimit: '',
            approvalOption: ''
        }
      }
    },
    mixins: [loadingMixin, GeneralMixin, getPermittedActions]
}
</script>

<style lang="scss" scoped>
::v-deep .v-tab:hover {
  background-color: #caf1e2;
  color: $primary_color !important;
}

::v-deep .green-shadow:hover {
    background-color: $primary_color;
    color: white;
}

::v-deep .my-custom-dialog {
    position: absolute;
    top: 0;
    min-height: 100%;
    right: 0;
    margin-right: 0px;
    margin-top: 0px;
}

::v-deep .square {
    width: 1vw;
    height: 1vw;
}

::v-deep .green-border {
    border: 2px solid black !important;
    text-transform: capitalize !important;
}
::v-deep .red-border {
    border: 2px solid red !important;
    text-transform: capitalize !important;
}
</style>