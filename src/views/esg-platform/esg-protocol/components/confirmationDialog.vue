<template>
    <v-dialog v-model="dialog" persistent max-width="500">
        <v-card>
            <v-toolbar color="primary" elevation="0">
                <v-toolbar-title class="white--text">{{ $t('confirmation') }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn color="white" icon @click="closeWithAction(false)">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text class="pt-5 black--text text-center">
                {{ message ? message : this.$t('esgPlatform.deleteConfirmation') }}
                <v-divider class="mt-5"></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="closeWithAction(false)" :outlined="cancelBtnOutlined">
                        {{ cancelBtnText ? cancelBtnText : this.$t('cancel') }}
                    </v-btn>
                    <v-btn depressed color="primary" @click="continueWithAction(true)">
                        {{ confirmBtnText ? confirmBtnText : this.$t('confirm') }}
                    </v-btn>
                </v-card-actions>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
    props: {
        dialog: {
            type: Boolean,
            required: true
        },
        message: {
            type: String,
            required: false
        },
        confirmBtnText: {
            type: String,
            required: false
        },
        cancelBtnText: {
            type: String,
            required: false
        },
        confirmData: {
            type: Object,
            required: false
        },
        cancelBtnOutlined: {
            type: Boolean,
            required: false
        }
    },
    data() {
        return {
        }
    },
    methods: {
        closeWithAction(action) {
            this.$emit('cancel:action', action, this.confirmData)
        },
        continueWithAction(action) {
            this.$emit('continue:action', action, this.confirmData)
        }
    }
}
</script>