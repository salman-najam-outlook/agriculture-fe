<template>
    <v-container>
        <template>
            <div>
                <v-dialog v-model="dialog" width="550px" persistent :retain-focus="false">
                    <v-card rounded="0">
                        <v-toolbar color="primary" class="white--text">
                            <v-toolbar-title class="font-weight-bold">
                                Preview
                            </v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-btn icon class="white--text" @click="closeModal">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </v-toolbar>
                        <v-form class="pa-4" lazy-validation autocomplete="off">
                            <h3 v-if="isGetData" class="mb-3">Provide Additional Data</h3>
                            <article v-for="(question, i) in questions" v-bind:key="i">
                                <h4 v-if="typeFormatter(question.type) === 'radio_button' || typeFormatter(question.type) === 'check_boxes'" class="mb-2">{{ question.title }}</h4>
                                <v-row class="mb-0" v-else>
                                    <v-col :cols="question.unit !== null ? '8': '12'">
                                        <p class="mb-1">{{ question.title }}</p>
                                    </v-col>
                                    <v-col cols="4" v-if="question.unit !== null">{{ question.unit }}</v-col>
                                </v-row>
                                <v-text-field
                                    outlined
                                    dense
                                    v-if="
                                        typeFormatter(question.type) === 'text_field' || 
                                        typeFormatter(question.type) === 'numeric' || 
                                        typeFormatter(question.type) === 'text_field_numeric' ||
                                        typeFormatter(question.type) === 'measurement_unit'
                                    "
                                >
                                </v-text-field>
                                <v-textarea
                                    outlined
                                    dense
                                    v-if="typeFormatter(question.type) === 'text_area'"
                                >
                                </v-textarea>
                                <v-radio-group
                                    column
                                    v-if="typeFormatter(question.type) === 'radio_button'"
                                >
                                    <v-radio
                                        v-for="(option, oi) in question.options"
                                        v-bind:key="oi"
                                        :label="option"
                                    ></v-radio>
                                </v-radio-group>
                                <div v-if="typeFormatter(question.type) === 'check_boxes'">
                                    <v-checkbox
                                        class="mt-0 bottomless"
                                        color="primary"
                                        v-for="(option, oi) in question.options"
                                        v-bind:key="oi"
                                        :label="option"
                                    ></v-checkbox>
                                </div>
                                <div v-if="typeFormatter(question.type) === 'attach_files'">
                                    <div class="file-field px-4 py-4">
                                        <v-row>
                                            <v-col class="content-col" cols="2">
                                                <v-icon
                                                    large
                                                    color="blue darken-2"
                                                >
                                                    mdi-tray-arrow-up
                                                </v-icon>
                                            </v-col>
                                            <v-col cols="10">
                                                <p class="file-link mb-0">Select file to Upload</p>
                                                <small class="file-drag">Or drag and drop here</small>
                                            </v-col>
                                        </v-row>
                                    </div>
                                </div>
                                <div v-if="typeFormatter(question.type) === 'digital_signature'">
                                    <p class="text-center">Sign Here</p>
                                    <div class="signature-field">Signature</div>
                                </div>
                            </article>
                        </v-form>
                        <v-card-actions>
                            <v-btn
                                right
                                height="44"
                                width="120"
                                class="px-4"
                                color="primary"
                                @click="closeModal"
                            >
                                {{ $t("close") }}
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </div>
        </template>
    </v-container>
</template>

<script>
export default {
    props: {
        dialogI: {
            type: Boolean,
            required: true,
        },
        questions: {
            type: Array,
            required: true
        },
        isGetData: {
            type: Boolean,
            required: false
        }
    },
    computed: {
        dialog() {
            return this.dialogI;
        },
    },
    methods: {
        typeFormatter(type) {
            return type.toLowerCase().replace(" ", "_").replace("-", "_");
        },
        closeModal() {
            this.$emit("closeModal");
        },
    }
}
</script>

<style lang="scss" scoped>
::v-deep .bottomless .v-input__slot {
  margin-bottom: 0 !important;
}

::v-deep .bottomless .v-messages {
  display: none !important;
}

.file-field {
    border-radius: 12px;
    border: 1px dashed gray;
}

.file-link {
    font-weight: bold;
    color: blue;
    text-decoration: underline;
    display: block;
}

.file-drag {
    color: gray;
}

.content-col {
  display: flex;
  align-items: center;
}

.signature-field {
    width: 100%;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-style: italic;
    border-radius: 12px;
    border: 1px solid black;
}
</style>