<template>
    <div>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <div class="d-flex mb-4">
                <h2>Coffee Data</h2>
                <v-spacer></v-spacer>
            </div>
            
            <v-row>
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <survey-list></survey-list>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <add-survey></add-survey>
                </div>
            </v-row>
        </v-container>
        <confirm-box
            :title="confirmElements.title"
            :message="confirmElements.message"
            :cancelBtnText="confirmElements.cancelBtnText"
            :confirmBtnText="confirmElements.confirmBtnText"
            :confirmData="confirmElements.confirmData"
            :dialog="confirm"
        ></confirm-box>
    </div>
</template>
<script>

import loadingMixin from "@/mixins/LoadingMixin"
import ConfirmBox from "@/components/ConfirmBox";

import SurveyList from "./SurveyList.vue"
import AddSurvey from "./AddSurvey.vue"

export default {
    created() {
        // if(!this.$route.params.tree) 
        //     this.$router.push({ name: 'CoffeeData', params: { tree: this.trees[0].val } })
        // else
        //     this.tree = this.$route.params.tree

        const fetchData = async () => {

        }
        fetchData()
    },
    components:{
        AddSurvey,
        SurveyList,
        ConfirmBox,
    },
    watch: {

    },
    data() {
        return {
            trees: [
                { text: 'Wind Breaker Tree', val: 'windbreakertree'},
                { text: 'Horticulture Tree', val: 'horticulturetree'},
            ],
            tree: null,
            confirm: false,
            confirmElements: {
                title: this.$t('adminRoles.deleteRole'),
                message: "Are you sure you want to delete Supervisor role?",
                confirmBtnText: this.$t('adminRoles.deleteRole'),
                cancelBtnText: "Cancel",
                confirmData: {},
            },
            editedRole: {},
            showEditRole: false,
            tab: 0,
            options: {},
            loading: false,
            search: '',
            from: 0,
            to:0,
            totalPages: 1,
            roles: [],
            breadcrumbs: [
            {
                text: this.$t('dashboard'),
                disabled: false,
                to: { name: 'Users'},
                exact: true 
            },
            {
                text: this.$t('Coffee Data'),
                disabled: true,
                href: 'breadcrumbs_link_1',
            },
        ],
        }
    },
    methods: {

    },
    mixins: [loadingMixin]
}
</script>
