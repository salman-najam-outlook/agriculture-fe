<template>
    <div>
        <v-card
                elevation="0"
                class=""
            >
            <v-card-text class="pb-7">
                 <!-- <div class="d-flex mb-4">
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    dark
                    class="mr-3"
                    height="40"
                    outlined
                    small
                >
                    Cancel
                </v-btn>
                <v-btn
                    color="primary"
                    dark
                    height="40"
                    class="mr-3"
                    @click="savePermissions"
                    small
                >
                    SAVE Permissions
                </v-btn>
            </div> -->
                <div class="d-flex mt-5">
                    <!-- <v-select
                        :items="departmentList"
                        item-text="name"
                        item-value="departmentNumber"
                        dense
                        outlined
                        class="shrink mr-2 wdt"
                        v-model="department"
                        placeholder="Select Department"
                        @change="getRoles"
                    ></v-select> -->
                    <v-select
                        :items="rolesList"
                        item-text="name"
                        item-value="id"
                        dense
                        outlined
                        class="shrink mr-2 wdt"
                        v-model="role_number"
                        :placeholder="$t('selectRole')"
                        :loading="roleLoading"
                    ></v-select>
                    <v-spacer></v-spacer>
                        <v-btn
                            color="primary"
                            dark
                            class="mr-3"
                            height="40"
                            outlined
                            small
                            v-if="(changedPerm.length >= 1 && getModulePermittedActions.put)"
                            @click="cancelPermissions"
                        >
                            {{ $t('cancel')}}
                        </v-btn>
                          <v-btn
                            color="primary"
                            dark
                            height="40"
                            class="mr-3"
                            @click="updatePermissions"
                            small
                            v-if="(changedPerm.length >= 1 && getModulePermittedActions.put)"
                        >
                            {{ $t('permissions.savePermissions')}}
                        </v-btn>
                </div>
                <div  v-if="role_number==''" class="text-center" style="padding-top:5%" >
                            <v-row align="center"
                                    justify="center">
                                    <v-col>
                                        <v-img
                                            max-height="190"
                                            max-width="190"
                                            src="/icons/nodata.svg"
                                            class="img-center"
                                        ></v-img>
                                    <h5 class="mt-4 red--text">{{ $t('noData') }}</h5> 
                                        <p class="text-caption black--text"> {{ $t('permissions.selectRoleMsg') }}</p>

                                    </v-col>
                                </v-row>
                            </div>
                <v-form v-else>
                <v-data-table
                    :headers="headers"
                    :items="permissions"
                    hide-default-footer
                    :loading="loading"
                    disable-pagination
                    loading-text="Loading Data..."
                >
                    <template
                        v-slot:no-data
                        v-if="permissions.length < 1"
                >
                    {{$t('noDataAvailable')}}
                </template>
                    <template v-if="permissions.length > 0" v-slot:body="{ items }">
                        <tbody>
                            <tr
                                v-for="(item, i) in items"
                                :key="item.moduleId"
                            >
                                <td>{{ i+1 }}.</td>
                                <td>
                                    {{ item.name }}
                                </td>
                                <td v-for="s in item.admin_users_roles_modules_permissions" :key="s.id">
                                    <v-checkbox
                                        v-model="s.permitted"
                                        color="primary"
                                        @change="valueChanged(s)"
                                        hide-details
                                        :false-value="false"
                                        :true-value="true"
                                        :disabled="!getModulePermittedActions.put"
                                    ></v-checkbox>
                                </td>
                            </tr>
                        </tbody>
                    </template>
                    <template v-slot:footer></template>
                </v-data-table>
                </v-form>
                <p class="mt-10">&nbsp;</p>
            <!-- <v-card-actions v-if="this.permissions.length">
                <v-spacer></v-spacer>
                <v-btn width="146" :to="{ name: 'Roles', params: { department: department }}" class="">Cancel</v-btn>
                <v-btn width="146" @click="updatePermissions" class="primary">Update</v-btn>
            </v-card-actions> -->
            </v-card-text>
        </v-card>
    </div>
</template>
<script>
import PermissionsMixin from "@/mixins/PermissionsMixin"
import loadingMixin from "@/mixins/LoadingMixin"
import PermissionsService from '@/_services/PermissionsService'
import getPermittedActions from "@/mixins/GetPermittedActions";
import _ from 'lodash'

export default {
    props: ['adminRoleProp'],
    mounted() {
        const fetchData = async () => {
            await this.getRoles()
        }
        fetchData()
        this.role_number = this.adminRoleProp
    },
    watch:{
        role_number(){
            this.getPermissions()
        }
    },
    data() {
        return {
            changedPerm: [],
            roleLoading: false,
            department: 'Admin',
            role_number: '',
            permissions: [],
            orgPermissions: [],
            departmentList: ['Admin'],
            rolesList: [],
            search: '',
            loading: false,
            headers: [
                {
                    text: 'Sr.',
                    class: "black--text",
                    sortable: false,
                    width: "5%"
                },
                {
                    text: this.$t('permissions.moduleName'),
                    align: 'start',
                    value: 'name',
                    class: "black--text",
                    width: "20%",
                    sortable: false,
                },
                {   text: this.$t('permissions.view'),
                    value: 'canRead', 
                    class: "black--text",
                    width: "15%",
                    sortable: false,
                },
                {   text: this.$t('permissions.create'),
                    value: 'canRead', 
                    class: "black--text",
                    width: "15%",
                    sortable: false,
                },
                {   text: this.$t('permissions.update'), 
                    value: 'canUpdate', 
                    class: "black--text",
                    width: "15%",
                    sortable: false,
                },
                {   text: this. $t('permissions.delete'), 
                    value: 'canUpdate', 
                    class: "black--text",
                    width: "15%",
                    sortable: false,
                },
            ],
            breadcrumbs: [
                {
                    text: 'Users',
                    disabled: false,
                    to: { name: 'Users'},
                    exact: true 
                },
                {
                    text: 'Permissions',
                    disabled: true,
                    to: { name: 'Roles'},
                },
            ],
        }
    },
    methods: {
        valueChanged(s){
            const x = _.find(this.changedPerm, {id: s.id})
            if(x)
                this.changedPerm = this.changedPerm.filter(item => item.id !== s.id)
            else 
                this.changedPerm.push({id: s.id, permitted: s.permitted});

            // console.log(this.changedPerm)
        },
        async getRoles() {
            // this.startLoading()
            this.rolesList = []
            this.roleLoading = true
            this.rolesList = await this.getRolesList()
            // console.log('rrr', this.rolesList)
            // if(this.rolesList.length > 0){
            //     // console.log('role0', this.rolesList[0])
            //     this.role_number = this.rolesList[0].id
            // }
            this.roleLoading = false
            // this.stopLoading()
        },
        async getPermissions() {
            if(!this.role_number) return
            this.startLoading()
            this.orgPermissions = await this.allModulesPermissions(this.role_number)
            
            // Handle the new data structure where data is an array of parent modules
            if (Array.isArray(this.orgPermissions) && this.orgPermissions.length > 0) {
                // Find the parent module that contains the role
                const parentModule = this.orgPermissions.find(parent => 
                    parent.modules && parent.modules.some(module => 
                        module.admin_users_roles_modules_permissions && 
                        module.admin_users_roles_modules_permissions.some(perm => perm.role_id === this.role_number)
                    )
                )
                
                if (parentModule && parentModule.modules) {
                    this.permissions = parentModule.modules.filter(item => item.name !== 'Dashboard')
                } else {
                    this.permissions = []
                }
            } else {
                // Fallback to old structure
                const x = _.find(this.orgPermissions, {id: this.role_number})
                if (!x || !x.modules) {
                    this.permissions = []
                    this.stopLoading()
                    return
                }
                this.permissions = x.modules.filter(item => item.name !== 'Dashboard')
            }
            this.permissions.forEach( mdl => {
                // Ensure admin_users_roles_modules_permissions exists
                if (!mdl.admin_users_roles_modules_permissions) {
                    mdl.admin_users_roles_modules_permissions = []
                }
                // prm.modules.forEach( mdl => {
                    const v = _.find(mdl.admin_users_roles_modules_permissions, {permission_id: 'get'})
                    const c = _.find(mdl.admin_users_roles_modules_permissions, {permission_id: 'post'})
                    const u = _.find(mdl.admin_users_roles_modules_permissions, {permission_id: 'put'})
                    const d = _.find(mdl.admin_users_roles_modules_permissions, {permission_id: 'delete'})
                    if(v)
                      mdl.admin_users_roles_modules_permissions[0] = v
                    else   
                         mdl.admin_users_roles_modules_permissions[0] = {permission_id: false}

                    if(c)
                      mdl.admin_users_roles_modules_permissions[1] = c
                    else   
                         mdl.admin_users_roles_modules_permissions[1] = {permission_id: false}

                    if(u)
                      mdl.admin_users_roles_modules_permissions[2] = u
                    else   
                         mdl.admin_users_roles_modules_permissions[2] = {permission_id: false}

                    if(d)
                      mdl.admin_users_roles_modules_permissions[3] = d
                    else   
                         mdl.admin_users_roles_modules_permissions[3] = {permission_id: false}
                    // mdl.admin_users_roles_modules_permissions.sort( (a,b) => {
                    //     const order = ['get', 'post', 'put', 'delete']
                    //     const aIndex = order.indexOf(a.permission_id);
                    //     const bIndex = order.indexOf(b.permission_id);
                    //     if ( aIndex < bIndex ){
                    //         return -1;
                    //     }
                    //     if ( aIndex > bIndex ){
                    //         return 1;
                    //     }
                    //     return 0;
                    // })
                    // if(mdl.admin_users_roles_modules_permissions.length == 3)
                    //     mdl.admin_users_roles_modules_permissions.push({permission_id: false})
                // })
            })
            this.stopLoading()
        },

        async updatePermissions() {
            if(this.changedPerm.length < 1) return
            
            this.startLoading()
            const res = await PermissionsService.updateAdminPermissions({ modulePermissionUpdates: this.changedPerm})
            // console.log('prm',res)
            if(res.success){
                this.changedPerm = [];
                this.$notify({
                    title: 'Permissions Updated',
                    type: 'success'
                });
            }else{
                this.$notify({
                    title: 'Permissions not Updated',
                    text: 'server error',
                    type: 'error'
                });
            }
            this.stopLoading()
        },
        cancelPermissions(){
            this.changedPerm = [];
            this.getPermissions()
        }
    },
    mixins: [PermissionsMixin, loadingMixin, getPermittedActions]
}
</script>
<style scoped>
::v-deep .wdt{
      width: 250px;
}

::v-deep .img-center {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 40%;
}
</style>