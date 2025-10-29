<template>
    <div>
        <!-- Header -->
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <div class="d-flex mb-4">
                <h2>{{ $t("ESG Report Templates") }}</h2>
                <v-spacer></v-spacer>
                <v-btn color="primary" class="mr-2 mb-2" @click="$router.push({ name: 'esgReportsBuilder' })">
                    {{ $t("Back") }}
                </v-btn>
                <v-btn color="primary" dark class="mr-2 mb-2" @click="$router.push({ name: 'createNewEsgTemplate' })">
                    {{ $t('Create New Template') }}
                </v-btn>
            </div>

            <v-card elevation="0" class="px-5">
                <TemplateGrid />
            </v-card>
        </v-container>

        <!-- Snackbar for notifications -->
        <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="snackbar.timeout" bottom>
            {{ snackbar.message }}
            <template v-slot:action="{ attrs }">
                <v-btn text v-bind="attrs" @click="snackbar.show = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script>
import TemplateGrid from './components/template-grid.vue';

export default {
    name: 'ESGTemplateManager',
    components: {
        TemplateGrid
    },
    data() {
        return {
            snackbar: {
                show: false,
                message: '',
                color: 'success',
                timeout: 3000
            },
            breadcrumbs: [
                {
                    text: 'ESG Platform',
                    disabled: false,
                    href: '/esg-platform/esg-dashboard'
                },
                {
                    text: this.$t("ESG Report Builder"),
                    disabled: false,
                    to: '/esg-platform/esg-reports-builder',
                    exact: true,
                },
                {
                    text: this.$t("Manage Templates"),
                    disabled: true,
                    href: "breadcrumbs_link_1",
                }
            ],
        }
    },
    mounted() {
        this.showSnackbar('ESG Template Manager loaded successfully', 'success')
    },
    methods: {
        createNewTemplate() {
            this.showSnackbar('Opening template creation...', 'info')
            // Implement create template logic
            this.$router.push('/templates/create')
        },
        showSnackbar(message, color = 'success') {
            this.snackbar.message = message
            this.snackbar.color = color
            this.snackbar.show = true
        }
    }
}
</script>

<style scoped>
.fill-height {
    height: 100%;
}

.min-height-auto {
    min-height: auto !important;
}

.flex-grow-1 {
    flex-grow: 1;
}

/* Custom responsive adjustments */
@media (max-width: 600px) {
    .text-right {
        text-align: left !important;
    }
}
</style>