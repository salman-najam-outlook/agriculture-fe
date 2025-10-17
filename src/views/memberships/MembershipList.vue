<template>
    <div>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <div class="d-flex mb-4">
                <h2>{{ $t('membershipPlans') }}</h2>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    dark
                    small
                    @click="showAddMembership = true"
                    v-if="getModulePermittedActions.post"
                >
                    {{ $t('membershipplanSection.addMembershipPlan') }}
                </v-btn>
            </div>
            
            <v-card
                elevation="0"
                class="px-5"
            >
                <v-card-text>
                    <div  v-if="!memberships" class="text-center" style="padding-top:5%" >
                       <v-row align="center"
                            justify="center">
                            <v-col>
                                <v-img
                                    max-height="190"
                                    max-width="190"
                                    src="/icons/nodata.svg"
                                    class="img-center"
                                ></v-img>
                            <h5 class="mt-4 red--text">
                                {{ $t('membershipplanSection.noAdminMembershipsFound') }}
                                <!-- No Admin memberships Found -->
                            </h5> 
                                <p class="text-caption black--text">
                                    <!-- Please add membership using the <br/> button "Add Membership” above -->
                                {{ $t('membershipplanSection.pleaseAddMembership') }}
                                </p>

                            </v-col>
                        </v-row>
                    </div>
                    
                    <div v-if="memberships">
                        <v-data-table
                            :headers="headers"
                            :items="memberships"
                            :items-per-page="10"
                            hide-default-footer
                            :loading="loading"
                            :options.sync="options"
                            :server-items-length="totalMemberships"
                            loading-text="Loading Data..."
                        >
                        <template v-slot:top="{}">
                            <div class="d-flex mt-5">
                            <v-text-field
                                prepend-inner-icon="mdi-magnify"
                                outlined
                                height="5px"
                                :placeholder="$t('userslist.search')"
                                dense
                                v-model="search"
                                @input="resetSearchOnEmpty"
                                class="shrink"
                            ></v-text-field>
                            <v-spacer></v-spacer>
                            <div class="py-1 title">{{ from }} - {{ to }} {{ $t('of') }} {{ totalMemberships }}</div>
                            <v-btn
                                class="mx-2"
                                fab
                                small
                                outlined
                                color="primary"
                                :disabled="options.page<=1"
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
                                :disabled="options.page>=totalPages"
                                @click="pageChange(true)"
                            >
                                <v-icon dark>
                                    mdi-chevron-right
                                </v-icon>
                            </v-btn>
                        </div>
                        </template>
                        <template v-if="memberships" v-slot:body="{ items }">
                            <tbody>
                                    <tr
                                        v-for="item in items"
                                        :key="item.id"
                                        style="position: relative; width: 0; height: 0"
                                        @mouseover="selectItem(item)"
                                        @mouseleave="selectItem(false)"
                                    >
                                        <!-- <td class="text-center">
                                            <v-radio-group v-model="defaultMembership">
                                                <v-radio
                                                    :value="item.id"
                                                    @change="showDefaultMembershipDialog(item)"
                                                ></v-radio>
                                            </v-radio-group>
                                        </td> -->
                                        <td> {{ item.membership_type}} </td>
                                        <td class="text-capitalize"> {{ item.plan_type}} </td>
                                        <td>{{ (item.userRoleMembershipMap.map(item => item.user_role.name)).join(', ')}}</td>
                                        <td> {{ `${item.membership_duration} ${item.membership_duration_unit}` }} </td>
                                        <td> ${{ item.membership_fee}} </td>
                                        <td> {{ item.satellite_report}} </td>
                                        <td> {{ item.advanced_report}} </td>
                                        <!-- <td class="text-center">
                                            <v-btn 

                                                x-small 
                                                plain
                                                min-width="120"
                                                color="primary"
                                                :to="{ name: 'AdminPermissions', params: { type: 'app_user', id: item.id } }"
                                            >
                                                {{ $t('adminRoles.viewPermissions') }}
                                            </v-btn>
                                        </td> -->
                                        <div style="position: absolute; right: 10px; top:5px;" v-if="item === selectedItem">  
                                            <v-tooltip bottom v-if="getModulePermittedActions.put">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn 
                                                        x-small 
                                                        fab
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        @click="editMembership(item)"                                                        
                                                    >
                                                        <v-icon>mdi-pencil</v-icon> 
                                                    </v-btn>
                                                </template>
                                                <span>{{$t('edit')}}</span>
                                            </v-tooltip>
                                            <v-tooltip bottom v-if="getModulePermittedActions.delete">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn 
                                                        x-small 
                                                        fab
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        class="ml-2"
                                                        @click="deleteMembership(item)"
                                                    >
                                                        <v-icon>mdi-trash-can-outline</v-icon> 
                                                    </v-btn>
                                                </template>
                                                <span>{{$t('delete')}}</span>
                                            </v-tooltip>
                                        </div>
                                    </tr>
                                    <v-dialog
                                        v-model="defaultMembershipDialog"
                                        persistent
                                        max-width="500"
                                        >
                                        <v-card>
                                            <v-toolbar
                                                color="primary"
                                                elevation="0"
                                            >
                                                <v-toolbar-title class="white--text">{{$t('membershipplanSection.defaultMembership')}}</v-toolbar-title>
                                                
                                            </v-toolbar>

                                            <v-card-text class="pt-5 black--text">
                                            <!-- Are you sure you want to make this membership type default? -->
                                            {{$t('membershipplanSection.areYouSureDefault')}}
                                            </v-card-text>

                                            <v-divider></v-divider>

                                            <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn
                                            color="green darken-1"
                                            text
                                            @click="() => {
                                                defaultMembershipDialog = false
                                                getMemberships()
                                            }"
                                            >
                                            <!-- Cancel -->
                                            {{$t('cancel')}}
                                            </v-btn>
                                            <v-btn
                                            depressed
                                            color="primary"
                                            @click="changeDefaultMembership"
                                            >
                                            <!-- Change Default Plan -->
                                            {{ $t('membershipplanSection.changeDefaultPlan') }}
                                            </v-btn>
                                            
                                            </v-card-actions>
                                        </v-card>
                                        </v-dialog>
                                </tbody>
                            </template>
                            <template v-slot:footer></template>
                        </v-data-table>
                    </div>
                    
                </v-card-text>
            </v-card>
        </v-container>
        <add-membership v-on:membership:added="membershipAdded" v-if="showAddMembership" :dialogI="showAddMembership" @closeAddMembership="showAddMembership = false"></add-membership>
        <edit-membership v-on:membership:updated="membershipUpdated" :membership="editedMembership" v-if="showEditMembership" :dialogI="showEditMembership" @closeEditMembership="showEditMembership = false"></edit-membership>
         <confirm-box
            :title="confirmElements.title"
            :message="confirmElements.message"
            :cancelBtnText="confirmElements.cancelBtnText"
            :confirmBtnText="confirmElements.confirmBtnText"
            :confirmData="confirmElements.confirmData"
            :dialog="confirm"
            @continue:action="confirmDeleteMembership"
            @cancel:action="confirmDeleteMembership"
        ></confirm-box>
    </div>
</template>
<script>
import AddMembership from './AddMembership.vue'
import EditMembership from './EditMembership.vue'
// import PermissionsService from '@/_services/PermissionsService'
import PermissionsMixin from "@/mixins/PermissionsMixin"
import loadingMixin from "@/mixins/LoadingMixin"
import ConfirmBox from "@/components/ConfirmBox";
import GetPermittedActions from '../../mixins/GetPermittedActions';

export default {
    created() {
        const fetchData = async () => {
        }
        fetchData()
    },
    components:{
        AddMembership,
        EditMembership,
        ConfirmBox,
    },
    watch: {
      options: {
        handler () {
          this.getMemberships()
        },
        deep: true,
      },
    //   defaultMembership: {
    //       handler(val) {
    //           alert(val)
    //       },
    //       deep: true
    //   }
    },
    data() {
        return {
            defaultMembership: '',
            confirm: false,
            confirmElements: {
                title: this.$t('deleteMemberShipPlan'),
                message: this.$t('memberShipPlanMessage'),
                confirmBtnText: this.$t('deleteMemberShipPlan'),
                cancelBtnText: this.$t('memberDataSection.cancel'),
                confirmData: {},
            },
            editedMembership: {},
            showEditMembership: false,
            tab: 0,
            tabs: [
                'Active',
                'Deactive'
            ],
            selectedItem: false,
            options: {},
            loading: false,
            showAddMembership: false,
            department:'',
            departmentList: [],
            search: '',
            from: 0,
            to:0,
            totalPages: 1,
            memberships: [],
            defaultMembershipDialog: false,
            selectedMembershipType: [],
            totalMemberships: 0,
            headers: [
                // {
                //     text: this.$t('membershipplanSection.defaultPlan'),
                //     align: 'start',
                //     value: 'name',
                //     class: "black--text text-no-wrap"
                // },
                {   
                    text: this.$t('membershipPlans'),
                    value: 'name', 
                    class: "black--text text-no-wrap",
                    sortable: false,
                },
                {
                    text: this.$t('membershipplanSection.planType'),
                    align: 'start',
                    value: 'name',
                    class: "black--text text-no-wrap"
                },
                {
                    text: this.$t('userRole'),
                    align: 'start',
                    value: 'name',
                    class: "black--text text-no-wrap",
                    width: '300px' 
                },
                {   
                    text: this.$t('membershipplanSection.planDuration'),
                    value: 'name', 
                    class: "black--text text-no-wrap",
                    sortable: false,
                },
                {
                    text: this.$t('membershipplanSection.planFee'),
                    align: 'start',
                    value: 'name',
                    class: "black--text text-no-wrap"
                },
                {   
                    text: this.$t('membershipplanSection.satelliteReport'),
                    value: 'name', 
                    class: "black--text text-no-wrap",
                    sortable: false,
                },
                {   
                    text: this.$t('membershipplanSection.advanceReport'),
                    value: 'name', 
                    class: "black--text text-no-wrap",
                    sortable: false,
                },
                {   text: "",
                    align: 'center',
                    value: 'status', 
                    class: "black--text text-no-wrap",
                    sortable: false, 
                },
            ],
            breadcrumbs: [
                {
                    text: this.$t('dashboard'),
                    disabled: false,
                    to: { name: 'Users'},
                    exact: true 
                },
                {
                    text: this.$t('membershipPlans'),
                    disabled: true,
                    href: 'breadcrumbs_link_1',
                },
            ],
        }
    },
    methods: {
        async confirmDeleteMembership(res, memberhip) {
        console.log(res, memberhip)
            if(res){
                this.startLoading()
                try{
                    const response = await this.$http.delete(`user/membership/${memberhip.id}`)
                    if(response.data.code == 200){
                        this.$notify({
                            title: response.data.message,
                            type: 'error'
                        })
                        this.confirm = false;
                        this.getMemberships();
                        this.stopLoading()
                    }else{
                        this.$notify({
                            title: response.data.message,
                            type: 'error'
                        })
                        this.stopLoading()
                    }
                }catch(err) {
                    console.log('err', err)
                    this.$notify({
                        title: 'Server error.',
                        type: 'error'
                    })
                    this.stopLoading()
                }
            }else{
                this.confirm = false;
            }
        },
        deleteMembership(membership){
            this.confirmElements.confirmData = membership;
            this.confirm = true;
        },
        async getMemberships() {
            this.loading = true
            try{
                const res = await this.$http.get(`user/membership?page=${this.options.page}&limit=${this.options.itemsPerPage}&searchPhrase=${this.search}`)
                const data = res.data;
                if(data.code === 200){
                    this.memberships = data.data.listRes.rows;
                    let defaultMembership = this.memberships.filter(item => item.default_status)
                    this.defaultMembership = defaultMembership.length > 0 && defaultMembership[0].id
                    this.totalMemberships = data.data.listRes.count;
                    this.totalPages = Math.ceil(this.totalMemberships/this.options.itemsPerPage)
                    this.from = (((this.options.page-1)*this.options.itemsPerPage)+1)
                    this.to = (this.options.page*this.options.itemsPerPage)-(this.options.itemsPerPage-this.memberships.length)
                    this.loading = false;
                }else{
                    console.log(data.message)
                    this.loading = false;
                }
            }catch(err) {
                console.log('err', err)
                this.loading = false;
            }
        },
        selectItem (item) {
            this.selectedItem = item
        },
        resetSearchOnEmpty() {
            this.options.page = 1;
            this.getMemberships()
        },
        pageChange(t){
            if(t){
                this.options.page = this.options.page+1; return;
            }
            else{
                this.options.page = this.options.page-1; return;
            }
        },
        editMembership(membership) {
            this.editedMembership = membership;
            this.showEditMembership = true;
        },
        membershipAdded(success){
            if(success)
                this.getMemberships()
            this.showAddMembership = false;
        },
        membershipUpdated(suc) {
            if(suc)
                this.getMemberships()
            
            this.showEditMembership = false;
        },
        async changeDefaultMembership () {
            const res = await this.changeDefaultMembershipType(this.selectedMembershipType.id)
            if (res) {
                this.defaultMembershipDialog = false
                this.getMemberships()
            }
        },
        showDefaultMembershipDialog (item) {
            this.defaultMembershipDialog = true
            this.selectedMembershipType = item
        }
    },
    mixins: [PermissionsMixin, loadingMixin, GetPermittedActions]
}
</script>
<style lang="scss" scoped>
::v-deep .wdt.v-text-field{
      width: 250px;
}
::v-deep .v-tab:hover {
  background-color: #caf1e2;
  color: $primary_color !important;
}
::v-deep .v-data-table-header span {
    text-transform: uppercase !important;
	color: black; 
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