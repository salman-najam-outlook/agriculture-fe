<template>
    <v-dialog transition="dialog-top-transition" max-width="800" v-model="dialog" @click:outside="closeModal">
        <v-card rounded="0">
            <v-toolbar color="warning" class="white--text" flat :elevation="0">
                <v-toolbar-title class="font-weight-bold">
                    {{ $t('dueDiligence.confirmation') }}
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon class="white--text" @click="closeModal">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text class="pt-5">
                <ul>
                    <li v-for="(warning, i) in warnings" :key="i">{{ warning }}</li>
                </ul>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn outlined class="mr-2 tall" depressed @click="closeModal" color="warning">
                    {{ $t("cancel") }}
                </v-btn>
                <v-btn v-if="!hideAdditionalActions" outlined class="mr-2 tall" depressed @click="download" color="warning">
                   {{ $t('dueDiligence.downloadAsPDF')}}
                </v-btn>
                <v-btn color="warning" elevation="0" dark medium class="mr-1 tall" v-if="diligenceId && !hideAdditionalActions" @click="requestAdditionalInformation">
                    {{ $t('deforestation.requestAdditionalInformationShort')}}
                </v-btn>
                <v-btn color="warning" elevation="0" class="tall" @click="edit">
                    {{ $t("edit") }}
                </v-btn>
            </v-card-actions>
        </v-card>

    </v-dialog>
</template>
<script>
import loading from "@/mixins/LoadingMixin";

export default {
    async mounted() { },
    props: {
        dialog: {
            required: false,
            type: Boolean,
        },
        warnings: {
            required: true,
            type: Array
        },
        hideAdditionalActions: {
            required: false,
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            diligenceId: this.$route.params.id || null,
        };
    },
    methods: {
        closeModal(suc = false) {
            this.$emit("close-modal", suc);
        },
        edit() {
            this.$emit("edit-report");
        },
        requestAdditionalInformation() {
            this.$emit("request-additional-info");
        },
        download() {
            this.$emit("download-report", "pdf");
        }
    },
    mixins: [loading],
};
</script>

<style lang="scss" scoped>
::v-deep .v-text-field.v-text-field--enclosed .v-text-field__details {
    display: none !important;
}
.tall {
    height: 40px !important;
    min-width: 150px;
}
.select {
    transform: translateY(2px);
    max-width: 200px;
}
::v-deep .v-text-field--outlined.v-input--dense .v-label {
    color: #fb8c00 !important;
}
::v-deep .v-text-field--outlined fieldset {
    border-color: #fb8c00 !important;
}
::v-deep .theme--light.v-icon {
    color: #fb8c00 !important;
}
</style>