<template>
    <v-dialog
        v-model="dialog"
        persistent
        max-width="500"
    >
        <v-card>
            <v-toolbar
                color="primary"
                elevation="0"
            >
                <!-- <v-app-bar-nav-icon> </v-app-bar-nav-icon> -->

                <v-toolbar-title class="white--text">{{ title }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn
                    color="white"
                    icon
                    @click="closeWithAction(false)"
                >
                     <v-icon style="color:white !important">mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <!-- <v-card-title class="text-h5">
                {{ title }}
            </v-card-title> -->
            <v-card-text class="pt-5 black--text text-center">
                {{ message ? message : $t('areYouSureText') }}
            
            <v-divider class="mt-5"></v-divider>
            <v-card-actions >
                <v-spacer></v-spacer>
                <v-btn
                    color="primary darken-1"
                    text
                    @click="closeWithAction(false)"
                    :outlined="cancelBtnOutlined"
                >
                    {{ cancelBtnText? cancelBtnText : 'Disagree' }}
                </v-btn>
                <v-btn
                    depressed
                    color="primary"
                    @click="continueWithAction(true)"
                >
                    {{ confirmBtnText? confirmBtnText : 'Agree' }}
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
        title: {
            type: String,
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