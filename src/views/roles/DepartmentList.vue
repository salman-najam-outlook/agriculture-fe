<template>
    <div>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <div class="d-flex mb-4">
                <h2>Departments</h2>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    dark
                    small
                    class="mr-3"
                    :to="{ name: 'Roles'}"
                >
                Roles
                <!-- <v-icon>mdi-chevron-down</v-icon> -->
                </v-btn>
                <v-btn
                    color="primary"
                    dark
                    small
                    @click="showAddDept = true"
                >
                Add Department
                <!-- <v-icon>mdi-chevron-down</v-icon> -->
                </v-btn>
            </div>
            <v-card
                elevation="1"
                class="p-5"
            >
                <v-card-text>
                    <v-data-table
                        :headers="headers"
                        :items="departments"
                        :items-per-page="10"
                        :footer-props="{
                            'items-per-page-options': [10,25,50]
                        }"
                        :loading="loading"
                        loading-text="Loading Data..."
                        :options.sync="options"
                        :server-items-length="totalDepartments"
                        hide-default-footer
                    >
                        <template v-slot:top="{}">
                            <div class="d-flex mt-5">
                                <v-text-field
                                    prepend-inner-icon="mdi-magnify"
                                    outlined
                                    height="5px"
                                    placeholder="Search"
                                    dense
                                    v-model="search"
                                    @input="resetSearchOnEmpty"
                                    class="shrink"
                                ></v-text-field>
                                <v-btn
                                    :disabled="search.length<1"
                                    color="primary"
                                    height="40"
                                    width="40"
                                    max-width="40"
                                    outlined
                                    class="ml-8"
                                    @click="getDepartments"
                                >
                                    <v-icon>mdi-filter-outline</v-icon>
                                </v-btn>
                                <v-spacer></v-spacer>
                                <div class="py-1 title">{{ from }} - {{ to }} {{ $t('of') }} {{ totalDepartments }}</div>
                                <v-btn
                                    :disabled="options.page<=1"
                                    class="mx-2"
                                    fab
                                    small
                                    outlined
                                    color="primary"
                                    @click="pageChange(false)"
                                >
                                    <v-icon dark>
                                        mdi-chevron-left
                                    </v-icon>
                                </v-btn>
                                <v-btn
                                    :disabled="options.page>=totalPages"
                                    class="mx-2"
                                    fab
                                    small
                                    outlined
                                    color="primary"
                                    @click="pageChange(true)"
                                >
                                    <v-icon dark>
                                        mdi-chevron-right
                                    </v-icon>
                                </v-btn>
                            </div>
                        </template>
                        <template v-if="departments.length > 0" v-slot:body="{ items }">
                            <tbody>
                                <tr
                                    v-for="item in items"
                                    :key="item.departmentNumber"
                                    style="position: relative; width: 0; height: 0"
                                    @mouseover="selectItem(item)"
                                    @mouseleave="selectItem(false)"
                                >
                                    <td> {{ item.departmentNumber}} </td>
                                    <td> {{ item.name}} </td>
                                    <td class="text-center">
                                        <v-btn 
                                            x-small 
                                            rounded
                                            min-width="120"
                                            :color="item.status == 1 ? 'green2' : 'red2'"
                                            depressed
                                            :class="item.status == 1 ? 'primary--text' : 'red--text'"
                                            height="34"
                                        >
                                            {{ item.status == 1 ? 'Active' : 'Inactive' }}
                                        </v-btn>
                                    </td>
                                    <div style="position: absolute; right: 10px; top:5px;" v-if="item === selectedItem">  
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn 
                                                    x-small 
                                                    fab
                                                    v-bind="attrs"
                                                    v-on="on"
                                                    @click="editDepartment(item)"
                                                >
                                                    <v-icon>mdi-pencil</v-icon> 
                                                </v-btn>
                                            </template>
                                            <span>Edit</span>
                                        </v-tooltip>
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn 
                                                    x-small 
                                                    fab
                                                    v-bind="attrs"
                                                    v-on="on"
                                                    class="ml-2"
                                                    :to="{ name: 'Roles', params: {department: item.departmentNumber} }"
                                                >
                                                    <v-icon>mdi-page-next-outline</v-icon> 
                                                </v-btn>
                                            </template>
                                            <span>Roles</span>
                                        </v-tooltip>
                                    </div>
                                </tr>
                            </tbody>
                        </template>
                        <!-- <template v-slot:footer></template> -->
                    </v-data-table>
                    </v-card-text>
                </v-card>
        </v-container>
        <add-dept v-on:department:added="departmentAdded" v-if="showAddDept" :dialogI="showAddDept" @closeAddDept="showAddDept = false"></add-dept>
        <edit-dept v-if="showEditDepartment" :department="editedDepartment" v-on:department:updated="deptUpdated" @closeUpdateDept="editDepartmentClosed" :dialogU="showEditDepartment"></edit-dept>

    </div>
</template>
<script>
import PermissionsService from '@/_services/PermissionsService'
import AddDept from './AddDepartment.vue'
import EditDept from './EditDepartment.vue'

export default {
    components:{
        AddDept,
        EditDept
    },
    watch: {
      options: {
        handler () {
          this.getDepartments()
        },
        deep: true,
      },
      tab: {
        handler () {
          this.getDepartments()
        },
        deep: true,
      },
    },
    created() {
        // const fetchData = async () => {
            
        // }
        // fetchData()
    },
    data() {
        return {
            tab: 0,
            selectedItem: false,
            showEditDepartment: false,
            editedDepartment: {},
            from: 0,
            to:0,
            loading: true,
            showAddDept: false,
            search: '',
            totalPages: 1,
            totalDepartments: 0,
            options: {},
            tabs: [
                { name: 'Departments', disable: false },
                { name: 'Deactivated', disable: true }
            ],
            headers: [
                {
                    text: 'Dept No.',
                    align: 'start',
                    sortable: false,
                    value: 'departmentNumber',
                    class: "black--text"
                },
                { text: 'Dept. Name', value: 'name', class: "black--text" },
                // { text: 'Created', value: 'createdAt', class: " black--text" },
                { text: 'Status', align: 'center', value: 'status', class: " black--text" },
                // { text: '', align: 'center', value: 'actions', sortable: false, class: " black--text" },
            ],
            departments: [],
            breadcrumbs: [
            {
                text: 'Dashboard',
                disabled: false,
                to: '/',
            },
            {
                text: 'Departments',
                disabled: true,
                href: 'breadcrumbs_link_1',
            },
        ],
        }
    },
    methods: {
        selectItem (item) {
            this.selectedItem = item
        },
        getDepartments() {
            this.loading = true;
            PermissionsService.getDepartments(this.options, this.search)
            .then( response => {
                this.departments = response.data.departments.rows;
                this.totalDepartments = response.data.departments.total_rows
                this.totalPages = Math.ceil(this.totalDepartments/this.options.itemsPerPage)
                this.from = (((this.options.page-1)*this.options.itemsPerPage)+1)
                this.to = (this.options.page*this.options.itemsPerPage)-(this.options.itemsPerPage-response.data.departments.num_rows)
                this.loading = false
            })
            .catch( error => {
                console.log(error)
            })
        },
        departmentAdded(success){
            console.log(success)
            this.getDepartments()
            this.showAddDept = false;
        },
        pageChange(t){
            if(t)
                this.options.page = this.options.page+1
            else
                this.options.page = this.options.page-1

            this.getDepartments()
        },
        resetSearchOnEmpty() {
            if(this.search != '') return;
            this.options.page = 1;
            this.getDepartments()
        },
        editDepartment(dept) {
            this.editedDepartment = dept;
            this.showEditDepartment = true;
        },
        editDepartmentClosed() {
            this.editedDepartment = {};
            this.showEditDepartment = false; 
        },
        deptUpdated(suc) {
            if(suc)
                this.getDepartments()
        }
    }
}
</script>
<style lang="scss" scoped>
    ::v-deep .v-tab:hover {
    background-color: #caf1e2;
    color: $primary_color !important;
    }

    ::v-deep .v-data-table-header span {
        text-transform: uppercase !important;
        color: black; 
    }
</style>