<style scoped>
.user-details-row {
    margin: 32px 0;
}

.user-details-label {
    font-weight: 600;
    color: #333;
    min-width: 110px;
    display: inline-block;
}

.user-details-value {
    color: #444;
    margin-left: 4px;
}

.v-card-text {
    padding-top: 24px !important;
    padding-bottom: 24px !important;
}
</style>

<template>
    <v-dialog v-model="dialog" max-width="800" @click:outside="close">
        <v-card>
            <v-toolbar color="primary" class="white--text" flat>

                <v-toolbar-title class="font-weight-bold">{{ $t('tickets.userDetails') }}</v-toolbar-title>

                <v-spacer></v-spacer>

                <v-btn icon class="white--text" @click="close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>

            <v-card-text v-if="user">
                <v-row>
                    <v-col cols="6">
                        <div class="user-details-row"><span class="user-details-label">{{ $t('firstName') }}:</span><span
                                class="user-details-value">{{ user.firstName }}</span></div>
                        <div class="user-details-row"><span class="user-details-label">{{ $t('email') }}:</span><span
                                class="user-details-value">{{ user.email }}</span></div>
                        <div class="user-details-row"><span class="user-details-label">{{ $t('country') }}:</span><span
                                class="user-details-value">{{ user.countryId || user.countryCode }}</span></div>
                        <div class="user-details-row"><span class="user-details-label">{{ $t('state') }}:</span><span
                                class="user-details-value">{{ user.stateId }}</span></div>
                        <div class="user-details-row"><span class="user-details-label">{{ $t('status') }}:</span><span
                                class="user-details-value">{{ user.active ? $t('active') : $t('deactivated') }}</span></div>
                    </v-col>
                    <v-col cols="6">
                        <div class="user-details-row"><span class="user-details-label">{{ $t('lastName') }}:</span><span
                                class="user-details-value">{{ user.lastName }}</span></div>
                        <div class="user-details-row"><span class="user-details-label">{{ $t('mobile') }}:</span><span
                                class="user-details-value">{{ user.mobile }}</span></div>
                        <div class="user-details-row"><span class="user-details-label">{{ $t('city') }}:</span><span
                                class="user-details-value">{{ user.city }}</span></div>
                        <div class="user-details-row"><span class="user-details-label">{{ $t('address') }}:</span><span
                                class="user-details-value">{{ user.address }}</span></div>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-text v-else>
                <div class="text-center py-16">{{ $t('tickets.noUserDetails') }}</div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        dialog: Boolean,
        user: Object
    },
    methods: {
        close() {
            this.$emit('close');
        }
    }
};
</script>