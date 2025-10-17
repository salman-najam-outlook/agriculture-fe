<template>
<div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
        <v-card class="mb-5">
            <v-card-text class="py-1">
                <v-tabs v-model="tab">
                    <v-tab> {{ $t('app_users') }} ({{appUserCount}})</v-tab>
                    <v-tab>{{ $t('admin_users') }} ({{adminUserCount}})</v-tab>
                </v-tabs>
            </v-card-text>
        </v-card>
        <div class="d-flex mb-4">
            <h2>{{ $t('activity_log') }}</h2>
            <v-spacer></v-spacer>
        </div>
        <v-card elevation="0" class="px-5">
            <v-card-text>
                <v-tabs-items v-model="tab">
                    <v-tab-item :value="0">
                        <AppLogs :selectedUserType="selectedUserType"/>
                    </v-tab-item>
                    <v-tab-item :value="1" >
                        <AdminLogs :selectedUserType="selectedUserType"/>
                    </v-tab-item>
                </v-tabs-items>
            </v-card-text>
        </v-card>
    </v-container>

</div>
</template>
<script>

import PermissionsMixin from "@/mixins/PermissionsMixin"
import loadingMixin from "@/mixins/LoadingMixin"
import UserService from "@/_services/UserService"
import AppLogs from "./AppLogs.vue"
import AdminLogs from "./AdminLogs.vue"

export default {
    components: {
        AdminLogs,
        AppLogs
    },
    async created() {
        document.title = this.$t('activity_log');
        const fetchData = async () => {
            this.getUserData()
        }
        fetchData();
    },
    watch: {
        tab: {
            handler(v){
                this.selectedUserType = v === 1 ? 'admin' : 'app_user'
            }
        }

    },
    methods: {
         async getUserData() {
            this.appUserCount = await UserService.getUsersConunt('end_user')
            this.adminUserCount = await UserService.getUsersConunt('admin')
        },
    },
    data() {
        return {
            selectedUserType: 'app_user',
            tab: 0,
            adminUserCount: 0,
            appUserCount: 0,
            breadcrumbs: [
                {
                    text: this.$t('dashboard'),
                    disabled: true,
                    to: '/',
                },
                {
                    text: this.$t('activity_log'),
                    disabled: true,
                    to: 'breadcrumbs_link_1',
                },
            ],
        }
    },
    mixins: [PermissionsMixin, loadingMixin]
}
</script>
<style lang="scss" scoped>
::v-deep .wdt.v-text-field {
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

::v-deep .v-data-footer__select {
    display: none;
}

::v-deep .v-data-footer__pagination {
    display: none;
}

::v-deep .v-data-footer__icons-before {
    display: none;
}

::v-deep .v-data-footer__icons-after {
    display: none;
}
</style>