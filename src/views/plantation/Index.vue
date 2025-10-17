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
                        @submit.prevent="updatePlantation"
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
                                        :rules="[v => !!v || $t('thisFieldIsRequired')]"
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
                            'items-per-page-text': 'Users per page'
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
                                :items="status"
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
                                class="mr-4 px-4"
                                outlined
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
                      <div>
                        {{ 
                          item.userFarms.length 
                          ? `${item.userFarms[0].farmerFirstName !== null ? item.userFarms[0].farmerFirstName : ''} ${item.userFarms[0].farmerMiddleName !== null ? item.userFarms[0].farmerMiddleName: ''} ${item.userFarms[0].farmerLastName !== null ? item.userFarms[0].farmerLastName : ''}`.trim().replace(/\s+/g,' ')
                          : '' 
                        }}
                      </div>
                      <div v-if="item.userFarms.length && item.userFarms[0].farmerId">
                        {{ item.userFarms[0].farmerId }}
                      </div>
                    </td>
                    <td>
                      <div>
                        {{ item.userFarms.length ? decodeHtmlEntities(item.userFarms[0].farmName) : '' }}
                      </div>
                      <div v-if="item.userFarms.length && item.userFarms[0].registrationNo">
                        {{ item.userFarms[0].registrationNo }}
                      </div>
                    </td>
                    <td class="capitlize">
                      <div>{{ decodeHtmlEntities(item.plantation_name) }}</div>
                      <div>{{ formatDate(item.createdAt) }}</div>
                    </td>
                    <td class="text-capitlized text-center"> 
                        <v-btn
                            x-small 
                            rounded
                            min-width="120"
                            depressed
                            class="gray-button"
                            height="34"
                            v-if="item.status === 'pending'"
                        >
                           {{ $t(`plantation.plantationStatus.${item.status}`) }}
                        </v-btn>
                        <v-btn
                            x-small 
                            rounded
                            min-width="120"
                            depressed
                            class="green-button"
                            height="34"
                            v-else-if="item.status === 'approved'"
                        >
                           {{ $t(`plantation.plantationStatus.${item.status}`) }}
                        </v-btn>
                        <v-btn
                            x-small 
                            rounded
                            min-width="120"
                            depressed
                            class="red-button"
                            height="34"
                            v-else-if="item.status === 'rejected'"
                        >
                           {{ $t(`plantation.plantationStatus.${item.status}`) }}
                        </v-btn>
                    </td>
                    <td class="text-right" style="position: relative; width: 80px;">
                        <div v-if="item.status === 'pending'" style="position: absolute; right: 10px; top:10px;">
                            <v-menu location="start">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn icon v-bind="attrs" v-on="on">
                                        <v-icon>mdi-dots-vertical</v-icon>
                                    </v-btn>
                                </template>
                                <v-list>
                                    <v-list-item @click="editPlantation(item)">
                                        <v-list-item-title>{{ $t('roleRequest.approve')}}/{{ $t('roleRequest.reject')}}</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </div>
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
import getPermittedActions from "../../mixins/GetPermittedActions"
import PlantationService from "@/_services/PlantationService.js"
import UserService from "@/_services/UserService.js"
import EditPlantation from "./EditPlantation.vue"
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
                const data = await PlantationService.getPlantationData(this.tableOptions, this.plantationType, this.search);
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
                    // console.log('dddd',data)
            }catch(e){
                this.loading = false;
                this.items = []
            }
        },

        // changeUserStatusType(type) {
        //     if(this.showStatusType == type) return;
        //     this.$router.push({ name: 'Users', params: { type } })
        // },

        searchPlantation() {
            this.tableOptions.page = 1;
            this.getPlantation()
        },

        // resetSearchOnEmpty() {
        //     if(this.search != '') return;
        //     this.tableOptions.page = 1;
        //     this.getPlantation()
        // },

        async getUserData() {
            this.appUserCount = await UserService.getUsersConunt('end_user')
            this.adminUserCount = await UserService.getUsersConunt('admin')
        },

        editPlantation(plantation) {
            this.editedPlantation = plantation;
            this.showEditPlantation = true;
        },


        // editUserClosed() {
        //     this.resetEditedUser();
        //     this.showEditPlantation = false; 
        //     this.showEditAppUser = false;
        // },

        //  editAppUserClosed() {
        //     // this.resetEditedUser();
        //     this.showEditAppUser = false; 
        // },

        // resetEditedUser() {
        //     this.editedPlantation = {};
        // },

        pageChange(t){
            if(t)
                this.tableOptions.page = this.tableOptions.page+1
            else
                this.tableOptions.page = this.tableOptions.page-1

        },

        async downloadCsv() {
            this.startLoading()
            try{
                const {data} = await this.$http.get(`/plantation/csvFile?status=${this.plantationType}`)
                // console.log('ddd', data)
                if(data.code == 200){
                    const anchor = document.createElement('a');
                    anchor.href = data.data;
                    anchor.target = '_blank';
                    anchor.download = 'plantation.csv';
                    anchor.click();
                }
                this.stopLoading()
            }catch(err){
                // console.log(err)
                this.stopLoading()
            }
        },

        closePlantationModel(suc){
            if(suc) this.getPlantation()
            this.showEditPlantation = false
        },
        async openSettings() {
            this.dialogVisible = true
            const result = await PlantationService.getPlantationSetting();
            this.plantationSetting = result.data;
        },
        closeSettings() {
            this.dialogVisible = false
        },
        async saveSettings() {
            if(!this.$refs.plantationSettingForm.validate()) return;
            await PlantationService.savePlantationSetting(this.plantationSetting);
            // Save the settings here
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
        status:[
            { text: this.$t("all"), val: 'all'},
            { text: this.$t("pending"), val: 'pending'},
            { text: this.$t("memberDataSection.approved"), val: 'approved'},
            { text: this.$t("memberDataSection.rejected"), val: 'rejected'},
        ],
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
                text: 'Farmer Name / ID',
                align: 'start',
                sortable: false,
                value: 'farmerNameId',
                class: "black--text" ,
            },
            {
                text: 'Farm Name / ID',
                align: 'start',
                sortable: false,
                value: 'farmNameId',
                class: "black--text" ,
            },
            
            { 
                text: `${this.$t('plantation.plantationName')} / ${this.$t('date')}`,
                value: 'plantationNameDate',
                sortable: false,
                class: "black--text",
            },
            { 
                text: this.$t('status'),
                value: 'status',
                align: 'center',
                sortable: true,
                class: "black--text",
            },
            {
                text: '',
                value: 'action',
                align: 'center',
                sortable: false,
                class: "black--text",
                width: 80,
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

.gray-button {
    background-color: #e8e8e8 !important;
    border: 2px solid #000000 !important;
    color: #000000 !important;
}

.green-button {
    background-color: #d0f3df !important;
    border: 2px solid #00a65a !important;
    color: #00a65a !important;
}

.red-button {
    background-color: #ffe4e4 !important;
    border: 2px solid #ff3b30 !important;
    color: #ff3b30 !important;
}
</style>