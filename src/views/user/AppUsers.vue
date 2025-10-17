<template>
    <div>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <v-card class="mb-5">
                <v-card-text class="py-1">
                    <v-tabs v-model="tab">
                        <v-tab value="end_user" @click="changeUserStatusType('end_user')">{{ $t('app_users')}} ({{ appUserCount }})</v-tab>
                        <v-tab value="admin" @click="changeUserStatusType('admin')">{{ $t('admin_users')}} ({{ adminUserCount }})</v-tab>
                    </v-tabs>
                </v-card-text>
            </v-card>
            <div class="d-flex mb-4">
                <h2>{{ $t('users')}}</h2>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    dark
                    small
                    class="mr-2"
                    @click="addUser"
                    v-if="showStatusType == 'admin'"
                >
                    {{ $t('userslist.addNewAdmin') }}
                </v-btn>
                <!-- <v-btn
                    color="primary"
                    dark
                    small
                    class="mr-2"
                    @click="addUser"
                    v-else
                >
                    {{ $t('Add app User') }}
                </v-btn> -->
            </div>
            <v-card
                elevation="0"
                class="px-5"
            >
                <v-card-text>

                    <v-data-table
                        v-if="(tab!=3)"
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
                        :server-items-length="totalUsers"
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
                                @click:append="searchUsers"
                                @input="searchUsers"
                                class="shrink"
                            ></v-text-field>
                            <v-spacer></v-spacer>
                            <template v-if="showStatusType=='end_user'">
                            <v-btn
                                color="primary"
                                height="45"
                                class="mr-4 px-4"
                                outlined
                                @click="downloadCsv"
                            >
                                <v-img width="25px" src="/icons/pngfile.png"></v-img> <span class="ml-2">Export as CSV</span>
                            </v-btn>
                            <v-spacer></v-spacer>
                            <div class="py-1 title">Filter By</div>
                            <v-btn
                                class="mx-2"
                                icon
                                color="primary"
                                @click="showFilters = true"
                            >
                                <v-icon dark large>
                                    mdi-filter
                                </v-icon>
                            </v-btn>
                            <v-btn
                                color="primary"
                                height="45"
                                width="175"
                                max-width="175"
                                outlined
                                class="mr-5"
                                @click="clearFilters"
                                v-if="dataFiltered"
                            >
                                <span class="">{{ $t('activationKey.clearAllFilters') }}</span>
                            </v-btn>
                            </template>
                            <div class="py-1 title">{{ from }} - {{ to }} {{ $t('of') }} {{ totalUsers }}</div>
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
                            <!-- <v-btn
                                class="mx-2"
                                fab
                                small
                                outlined
                                color="primary"
                                disabled
                            >
                                <v-icon dark>
                                    mdi-cog-outline
                                </v-icon>
                            </v-btn> -->
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
                    :key="item.userNumber"
                    @mouseover="selectItem(item)"
                    @mouseleave="unSelectItem()"
                    style="position: relative; width: 0; height: 0"
                  >
                    <td> {{ item.fullName!=null? item.fullName : 'N/A' }}</td>
                    <td class="capitlize"> {{ item.email!=null? item.email : 'N/A' }}</td>
                    <td class="capitlize"> {{ item.mobile!=null? item.mobile : 'N/A' }}</td>
                    <td class="capitlize"> {{ 'N/A' }}</td>
                    <td class="capitlize"> {{ 'N/A' }}</td>
                    <td class="capitlize"> {{ item.activation.length }}</td>
                    <td class="capitlize d-flex align-center"> 
                        <div v-if="item.activation.length" class="square" :style="[ (item.email==null) ? { 'background': 'red'} : { 'background': 'green' }]"></div><span class="ml-1">{{ item.activation != null ? item.activation.membershipValidity : 'N/A' }}</span>
                    </td>
                    <td class="capitlize text-center"> 
                        <v-btn
                            x-small 
                            rounded
                            min-width="120"
                            :color="item.active == '1' ? 'green2': 'red2'"
                            depressed
                            class="xxxx"
                            :class="item.active == '1' ? 'primary--text': 'red--text'"
                            height="34"
                        >
                            {{ item.active == 1 ? 'Active' : 'Deactivated' }}
                        </v-btn>
                    </td>
                    <template>
                        <div style="position: absolute; right: 10px; top:5px;" v-if="item === selectedItem">  
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn 
                                        x-small 
                                        fab
                                        v-bind="attrs"
                                        v-on="on"
                                        class="green-shadow"
                                        @click="editUser(item)"
                                    >
                                        <v-icon>mdi-pencil</v-icon> 
                                    </v-btn>
                                </template>
                                <span>{{ $t('edit')}}</span>
                            </v-tooltip>
                            <v-tooltip bottom v-if="item.active == 1">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn 
                                        x-small 
                                        fab
                                        v-bind="attrs"
                                        v-on="on"
                                        class="ml-1 green-shadow"
                                        @click="changeUserStatus('0', item)"
                                        > 
                                            <v-icon>mdi-trash-can</v-icon> 
                                    </v-btn>
                                </template>
                                <span>{{ $t('deactivate')}}</span>
                            </v-tooltip>
                            <v-tooltip bottom v-else>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn 
                                        x-small 
                                        fab
                                        v-bind="attrs"
                                        v-on="on"
                                        class="ml-1 green-shadow"
                                        @click="changeUserStatus('1', item)"
                                        > 
                                            <v-icon>mdi-play</v-icon> 
                                    </v-btn>
                                </template>
                                <span>{{ $t('activate')}}</span>
                            </v-tooltip>
                        </div>
                    </template>
                    </tr>
                  </tbody>
                </template>

                </v-data-table>
                
                </v-card-text>
        
            </v-card>
        </v-container>
        <v-dialog
            v-model="showFilters"
            width="356"
            @click:outside="closeFilter"
            content-class="my-custom-dialog"
            transition="dialog-bottom-transition"
        >
            <v-card min-height="100vh" class="" rounded="0">
                <v-toolbar
                    color="primary"
                    class="white--text"
                    flat
                    :elevation="0"
                >

                    <v-toolbar-title class="font-weight-bold">{{ this.$t('filterBy') }}</v-toolbar-title>
                    <v-spacer></v-spacer>

                    <v-btn icon class="white--text" @click="closeFilter">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-text class="pt-5">
                    <v-row no-gutters>
                        <v-col cols="12">
                            <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">{{ this.$t('membership.type') }}</label>
                            <v-select
                                :items="membershipList"
                                outlined
                                dense
                                :placeholder="$t('select')"
                                item-text="membership_type"
                                item-value="id"
                                v-model="filterParam.membership_type"
                            ></v-select>
                        </v-col>
                        <v-col cols="12">
                            <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">{{ this.$t('membershipValidity') }}</label>
                            <v-select
                                :items="membershipTypes"
                                item-text="text"
                                item-value="value"
                                outlined
                                dense
                                :placeholder="$t('select')"
                                v-model="filterParam.membership_validity"
                            ></v-select>
                        </v-col>

                        <v-col cols="12" v-if="filterParam.membership_validity == 'custom'">
                            <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">{{ this.$t('membership.remainingDays') }}</label>
                            <v-text-field
                                outlined
                                min="1"
                                dense
                                type="number"
                                value=""
                                v-model="filterParam.membershipRemainingDays"
                            >

                            </v-text-field>
                        </v-col>

                        <v-col cols="12">
                            <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">{{ this.$t('regionState') }}</label>
                            <v-select
                                :items="['Colorado', '2', '3']"
                                outlined
                                dense
                                placeholder="Coming Soon"
                                disabled
                            ></v-select>
                        </v-col>
                        
                        <v-col cols="12">
                            <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">{{ this.$t('cityTown') }}</label>
                            <v-select
                                :items="['A City', 'B City', 'C City']"
                                outlined
                                dense
                                placeholder="Coming Soon"
                                disabled
                            ></v-select>
                        </v-col>
                        <v-col></v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" class="d-flex justify-space-around">
                            <v-btn outlined @click="clearFilters" width="130" color="primary">
                                {{ this.$t('clearAll') }}
                            </v-btn>
                            <v-btn width="130" @click="searchWithFilter" color="primary">
                                {{ this.$t('search') }}
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>
        <add-user v-if="showAddUser" @userAdded="userAdded" @closeAddUser="showAddUser = false" :dialogI="showAddUser"></add-user>
        <edit-user v-if="showEditUser" :user="editedUser" @userUpdated="userUpdated" @closeUpdateUser="editUserClosed" :dialogU="showEditUser"></edit-user>
        <confirm-box :title="confirmElements.title" :message="confirmElements.message" :cancelBtnText="confirmElements.cancelBtnText" :confirmBtnText="confirmElements.confirmBtnText" :confirmData="confirmElements.confirmData" :dialog="confirm" @confirm:action="confirmDeactivate"></confirm-box>
        <edit-app-user v-if="showEditAppUser" :user="editedUser" @appUserUpdated="appUserUpdated" @closeUpdateUser="editUserClosed" :dialogU="showEditAppUser"></edit-app-user>

    </div>

</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin"

import AddUser from "@/views/user/AddUser"
import EditUser from "@/views/user/EditUser"
import ConfirmBox from "@/components/ConfirmBox"
import EditAppUser from "@/views/user/EditAppUser"
import UserService from "@/_services/UserService"
import ActivationKeyService from "@/_services/ActivationService.js"

export default {
    mounted() {  
        if(!this.$route.params.type){
            this.$router.push({ name: 'Users', params: { type: 'end_user' } })
        }else{
            this.tab = this.$route.params.type == 'admin' ? 1 : 0
        }
        document.title = this.$t('users');  
         const fetchData = async () => {
             this.getUserData()
            const [mt] = await Promise.all([ActivationKeyService.getAllMemberships()])
            this.membershipList = mt.data.listRes;
        }
        fetchData()
    },
    watch: {
      tableOptions: {
        handler () {
          this.getUsers()
        },
        deep: true,
      },
      showStatusType:{
          handler () {
          this.getUsers()
        },
        deep: true,
      },
      '$route.params.type': {
        handler: function(type) {
           this.showStatusType = type
        },
        deep: true,
        immediate: true
      }

    },
    components: {
        'add-user': AddUser,
        'confirm-box': ConfirmBox,
        'edit-user': EditUser,
        EditAppUser,
    },
    methods: {
        addUser() {
            this.showAddUser = true;
        },
        uploadUsers() {
            this.showUploadUser = true;
        }, 
        userAdded(res) {
          if(res.success) {
            this.getUsers()
            this.$notify({
              title: this.$t('addEdituser.userAdded'),
              type: 'success'
            });
          }else{
            this.$notify({
              title: this.$t('addEdituser.userNotAdded'),
              type: 'error'
            });
          }
        },
        userUpdated(res) {
          if(res.success) {
            this.getUsers()
            this.$notify({
              title: this.$t('addEdituser.userUpdated'),
              type: 'success'
            });
          }else{
            this.$notify({
              title: this.$t('addEdituser.userNotUpdated'),
              type: 'error'
            });
          }
        },
        appUserUpdated(res) {
            if(res.success) {
            this.getUsers()
            this.$notify({
              title: this.$t('addEdituser.userUpdated'),
              type: 'success'
            });
          }else{
            this.$notify({
              title: this.$t('addEdituser.userNotUpdated'),
              type: 'error'
            });
          }
        },
        selectItem (item) {
            this.selectedItem = item
        },
        unSelectItem () {
            this.selectedItem = false
        },
        getUsers() {
            this.loading = true;
            UserService.getUsers(this.tableOptions, this.showStatusType, this.search, this.filterParam)
            .then( res => {
                if(res.success){
                    this.items = res.data.rows;
                    this.totalUsers = res.data.count;
                    this.showingRows = res.data.rows.length;
                    this.totalPages = Math.ceil(this.totalUsers/this.tableOptions.itemsPerPage)
                    this.from = (((this.tableOptions.page-1)*this.tableOptions.itemsPerPage)+1)
                    this.to = (this.tableOptions.page*this.tableOptions.itemsPerPage)-(this.tableOptions.itemsPerPage-res.data.rows.length)
                    this.loading = false;
                }
            })
            .catch(err => {
                this.loading = false;
                this.items = []
                console.log(err)
                // if(err.response.status == 403)
                    // this.$router.go(-1)
            })
        },

        changeUserStatusType(type) {
            if(this.showStatusType == type) return;
            this.$router.push({ name: 'Users', params: { type } })
            // this.showStatusType = type;
            // this.tableOptions.page = 1;
            // this.getUsers()
        },

        searchUsers() {
            // if(this.search == '') return 
            this.tableOptions.page = 1;
            this.getUsers()
        },

        resetSearchOnEmpty() {
            if(this.search != '') return;
            this.tableOptions.page = 1;
            this.getUsers()
        },

        async getUserData() {
            this.appUserCount = await UserService.getUsersConunt('end_user')
            this.adminUserCount = await UserService.getUsersConunt('admin')
            // this.getUsers();
            // console.log(sortBy, sortDesc) // shortBy = email, sortDesc true/false
        },

        editUser(user) {
            // console.log('eeee', user)
            this.editedUser = user;
            if(this.tab === 1)
                this.showEditUser = true;
            else
                this.showEditAppUser = true;
        },

        changeUserStatus(status, user) {
            this.confirmElements.title = status=='1' ? this.$t('addEdituser.activateAct') :this.$t('addEdituser.deactivateAct');
            this.confirmElements.confirmBtnText = status=='1' ? this.$t('addEdituser.activateAct') :this.$t('addEdituser.deactivateAct');
            this.confirmElements.confirmData = { user: user, status: status}
            this.confirm = true;
        },

        confirmDeactivate(action, confirmData) {
            if(action) {
                // console.log('cnfDate', confirmData)
                this.startLoading()
                UserService.toggleUserStatus(confirmData.user.id)
                .then( res => {
                    if(res.success) {
                        this.getUsers();
                        this.stopLoading();
                        this.confirm = false;
                        this.$notify({
                            title: confirmData.status=='1' ? this.$t('addEdituser.userActivated') :this.$t('addEdituser.userDeactivated'),
                            type: 'success'
                        });
                    }else{
                        this.stopLoading();
                        this.confirm = false;
                        this.$notify({
                            title:  this.$t('addEdituser.userNotUpdated'),
                            type: 'error'
                        });
                    }
                })
                .catch( () => {
                    // console.log(err)
                    this.stopLoading();
                    this.confirm = false;
                })
            }else{
                this.confirm = false;
            }
        },

        editUserClosed() {
            this.resetEditedUser();
            this.showEditUser = false; 
            this.showEditAppUser = false;
        },

         editAppUserClosed() {
            // this.resetEditedUser();
            this.showEditAppUser = false; 
        },

        resetEditedUser() {
            this.editedUser = {};
        },
        pageChange(t){
            if(t)
                this.tableOptions.page = this.tableOptions.page+1
            else
                this.tableOptions.page = this.tableOptions.page-1

            // this.getUsers()
        },
        closeUploadUsers(success) {
            this.showUploadUser = false
            if(success === true){
                this.tab = 3;
                this.importKey = this.importKey+1
            }
        },
        closeFilter() {
            this.showFilters = false
        },
        async downloadCsv() {
            this.startLoading()
            try{
                const {data} = await this.$http.get(`/userList/${this.showStatusType}`)
                this.csvData =  data.data.rows

                let csv = 'Name,Email,Mobile,\n';
                this.csvData.forEach((row) => {
                        csv += [row.fullName,row.email,row.mobile].join(',');
                        csv += "\n";
                });
            
                const anchor = document.createElement('a');
                anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
                anchor.target = '_blank';
                anchor.download = 'users.csv';
                anchor.click();
                this.stopLoading()
            }catch(err){
                console.log(err)
                this.stopLoading()
            }
        },

        searchWithFilter() {
            this.dataFiltered = true;
            this.closeFilter()
            this.getUsers()
        },
        clearFilters(){
            this.dataFiltered = false
            this.closeFilter()
            this.filterParam.membership_type = ''
            this.filterParam.membership_validity = ''
            this.filterParam.membershipRemainingDays= null
            this.getUsers()
        }
    },
    data () {
      return {
        dataFiltered: false,
        membershipList: [],
        filterParam: {
            membership_type: '',
            membership_validity: '',
            membershipRemainingDays: 0
        },
        membershipTypes: [
            {text: 'Less Then 1 Month', value: 'lessThen1Month'},
            {text: '1-8 Months', value: '1-8Months'},
            {text: '6-12 Months', value: '6-12Months'},
            {text: 'More Than 1 Year', value: 'moreThan1Year'},
            {text: 'Expired', value: 'expired'},
            {text: 'Custom', value: 'custom'}
        ],
        csvData: null,
        showFilters: false,
        appUserCount: 0,
        adminUserCount: 0,
        imported: 0,
        importKey: 1,
        tab: 0,
        from: 0,
        to:0,
        totalPages: 1,
        showingRows: 0,
        transition: true,
        activeUsers: 0,
        deactiveUsers: 0,
        totalUsers: 0,
        importedUsers: 0,
        confirm: false,
        confirmElements: {
            title: this.$t('addEdituser.deactivateUser'),
            message: this.$t('addEdituser.deactivateMsg'),
            confirmBtnText: this.$t('addEdituser.activateAct'),
            cancelBtnText: this.$t('cancel'),
            confirmData: {}
        },
        tableOptions: {},
        showStatusType: 'end_user',
        search: '',
        selected: [],
        items: [],
        selectedItem: false,
        loading: false,
        showAddUser: false,
        showEditUser: false,
        showEditAppUser: false,
        showUploadUser: false,
        editedUser: {
            name : '',
            email: '',
            mobile: '',
            password: '',
            department: 'administrator',
            role: 'manager'
        },
        breadcrumbs: [
            {
                text: this.$t('dashboard'),
                disabled: true,
                to: '/',
            },
            {
                text: this.$t('users'),
                disabled: true,
                to: 'breadcrumbs_link_1',
            },
        ],
        headers: [
            {
                text: this.$t('name'),
                align: 'start',
                sortable: true,
                value: 'firstName',
                class: "black--text" ,
                width: "13%"
            },
            { 
                text: this.$t('email'),
                value: 'email',
                sortable: true,
                class: "black--text",
                width: "9%"
            },
            { 
                text: this.$t('mobileNumber'),
                value: 'mobile' ,
                sortable: true,
                class: "black--text",
                width: "5%"
            },
            { 
                text: this.$t('Region/State'),
                value: 'mobile' ,
                sortable: false,
                class: "black--text",
                width: "15%"
            },
            { 
                text: this.$t('City/Town'),
                value: 'mobile' ,
                sortable: false,
                class: "black--text",
                width: "10%"
            },
            { 
                text: this.$t('Membership  Type'),
                value: 'role',
                sortable: false,
                class: "black--text",
                width: "15%"
            },
            { 
                text: this.$t('Membership Validity'),
                value: 'role',
                sortable: false,
                class: "black--text",
                width: "16%"
            },
            { 
                text: this.$t('status'),
                value: 'active',
                align: 'center',
                sortable: true,
                class: "black--text",
                width: "10%"
            },
        ],
      }
    },
    mixins: [loadingMixin]
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

::v-deep .xxxx {
    border: 2px solid black;
}

</style>