<template>
    <div>
        <v-container>
            <template>
                <div>
                    <v-dialog v-model="dialog" width="800px" persistent :retain-focus="false">
                        <v-card class="custom-card" rounded="0">
                            <v-toolbar color="primary" class="white--text">
                                <v-toolbar-title class="font-weight-bold">
                                    {{
                                        isEdit
                                            ? "Edit Data Field"
                                            : "Add Data Field"
                                    }}
                                </v-toolbar-title>
                                <v-spacer></v-spacer>
                                <v-btn icon class="white--text" @click="closeModal">
                                    <v-icon>mdi-close</v-icon>
                                </v-btn>
                            </v-toolbar>
                            <v-form class="datafield" lazy-validation autocomplete="off">
                                <v-card-text class="black--text">
                                    <v-row>
                                        <v-col cols="3">
                                            <h3 class="mb-4">Mandatory</h3>
                                        </v-col>
                                        <v-col cols="1">{{ datafield.isMandatory ? "Yes" : "No" }}</v-col>
                                        <v-col cols="1">
                                            <v-switch inset class="bottomless pt-0 mt-0"
                                                v-model="datafield.isMandatory"></v-switch>
                                        </v-col>
                                        <v-col cols="7"></v-col>
                                    </v-row>
                                    <v-row class="pb-4">
                                        <v-col cols="6">
                                            <label for="datatype">Data Type</label>
                                            <v-select 
                                                :items="dataTypes" 
                                                v-model="datafield.datatype" 
                                                item-text="title"
                                                item-value="field"
                                                dense
                                                outlined 
                                                clearable
                                            >
                                            </v-select>
                                        </v-col>
                                        <v-col cols="6">
                                            <label for="fieldTitle">Field Title</label>
                                            <v-text-field v-model="datafield.title" placeholder="Enter here" outlined
                                                dense>
                                            </v-text-field>
                                        </v-col>
                                    </v-row>

                                    <section v-if="['radio-button', 'check-boxes'].includes(datafield.datatype)" class="mb-4">
                                        <label class="font-weight-bold">Add Option</label>
                                        <v-tooltip top>
                                            <template v-slot:activator="{ on, attrs }">
                                            <v-icon color="success" v-bind="attrs" v-on="on" class="ml-2">mdi-information</v-icon>
                                            </template>
                                            <span>Type the option label and click 'Add' to insert it</span>
                                        </v-tooltip>

                                        <v-row>
                                            <v-col cols="9">
                                            <v-text-field
                                                v-model="newOption"
                                                outlined
                                                dense
                                                placeholder="Enter option label"
                                            ></v-text-field>
                                            </v-col>
                                            <v-col cols="3">
                                            <v-btn color="success" block @click="addOption" :disabled="!newOption">
                                                ADD
                                            </v-btn>
                                            </v-col>
                                        </v-row>

                                        <v-list
                                        dense
                                        class="option-list"
                                        v-if="datafield.optionValues?.length"
                                        >
                                        <v-list-item
                                            v-for="(opt, index) in datafield.optionValues"
                                            :key="index"
                                        >
                                            <v-list-item-action>
                                            <v-icon small color="primary">
                                                {{ datafield.datatype === 'radio-button' ? 'mdi-radiobox-marked' : 'mdi-checkbox-marked' }}
                                            </v-icon>
                                            </v-list-item-action>

                                            <v-list-item-content>
                                            <v-list-item-title class="text-body-2 font-weight-medium">
                                                {{ opt }}
                                            </v-list-item-title>
                                            </v-list-item-content>

                                            <v-list-item-action>
                                            <v-btn icon small color="green" @click="removeOption(index)">
                                                <v-icon small>mdi-delete</v-icon>
                                            </v-btn>
                                            </v-list-item-action>
                                        </v-list-item>
                                        </v-list>
                                    </section>

                                    <section v-if="datafield.datatype === 'attach-file'">
                                        <label for="allowedTypes">Allowed File Types</label>
                                        <v-row>
                                            <v-col class="py-0" :cols="ft.cols" v-for="(ft, i) in fileTypes" :key="i">
                                                <v-checkbox
                                                    v-model="datafield.allowedFileTypes[ft.field]"
                                                    :label="ft.title"
                                                ></v-checkbox>
                                            </v-col>
                                        </v-row>
                                    </section>

                                    <section v-if="datafield.datatype === 'measurement-unit'">
                                        <v-row class="pb-2 pt-2">
                                            <v-col class="pt-0 pb-0 mt-0"  cols="6">
                                                <label for="measurementUnitType">Select Measurement Unit List</label>
                                                <v-select :items="allUnitTypes" v-model="datafield.measurementUnitType"
                                                    dense outlined clearable>
                                                </v-select>
                                            </v-col>
                                            <v-col class="pt-0 pb-0 mt-0"  cols="6">
                                                <label for="measurementUnit">Type</label>
                                                <v-select :items="allUnits" v-model="datafield.measurementUnit" dense
                                                    outlined clearable>
                                                </v-select>
                                            </v-col>
                                            <v-col class="pt-0 pb-0 mt-0" cols="12">
                                                <v-checkbox class="mt-0" v-model="datafield.allowUnitChange" label="Allow User to Change Unit Type"></v-checkbox>
                                            </v-col>
                                        </v-row>
                                    </section>
                                    <v-row>
                                        <v-col cols="3">
                                            <span class="h3 mr-1">Help</span>
                                            <v-tooltip top color="00BD73" max-width="350">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-icon size="medium" class="icon-with-background"
                                                        style="color:#0EBF67" v-bind="attrs" v-on="on">
                                                        mdi-alert-circle
                                                    </v-icon>
                                                </template>
                                                <span>Write a help text for the users.</span>
                                            </v-tooltip>
                                        </v-col>
                                        <v-col cols="1">{{ datafield.helpEnabled ? "Yes" : "No" }}</v-col>
                                        <v-col cols="1">
                                            <v-switch inset class="bottomless pt-0 mt-0"
                                                v-model="datafield.helpEnabled"></v-switch>
                                        </v-col>
                                        <v-col cols="7"></v-col>
                                    </v-row>

                                    <div v-if="datafield.helpEnabled">
                                        <v-text-field v-model="datafield.helpText"
                                            placeholder="Add help text for data field" outlined dense>
                                        </v-text-field>
                                    </div>

                                    <section class="question-footer mt-4">
                                        <v-btn right outlined color="primary" @click="closeModal">
                                            Cancel
                                        </v-btn>
                                        <v-btn right color="primary" @click.prevent="saveDataField">
                                            Add
                                        </v-btn>
                                    </section>
                                </v-card-text>
                            </v-form>
                        </v-card>
                    </v-dialog>
                </div>
            </template>
        </v-container>
    </div>
</template>
<script>
import ESGService from "@/_services/EsgService";

export default {
    props: {
        isEdit: {
            type: Boolean,
            required: true,
            default: false,
        },
        dialogI: {
            type: Boolean,
            required: true,
        },
        selectedDataField: {
            type: Object,
            required: false,
            default: () => ({}),
        },
        isAssessmentEditMode: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    data() {
        return {
            newOption: '',
            datafield: {
                isMandatory: false,
                datatype: '',
                title: '',
                helpEnabled: false,
                helpText: '',
                measurementUnitType: null,
                measurementUnit: null,
                allowUnitChange: false,
                allowedFileTypes: {},
                optionValues: [],
            },
            dataTypes: [
                {
                    field: "text-field",
                    title: "Text Field"
                },
                {
                    field: "text-area",
                    title: "Text Area"
                },
                {
                    field: "numeric",
                    title: "Text Field Numeric"
                },
                {
                    field: "radio-button",
                    title: "Radio Button"
                },
                {
                    field: "check-boxes",
                    title: "Check Boxes"
                },
                {
                    field: "measurement-unit",
                    title: "Measurement Unit"
                },
                {
                    field: "attach-file",
                    title: "Attach File"
                },
                {
                    field: "digital-signature",
                    title: "Digital Signature"
                },
            ],
            fileTypes: [
                { field: "image", title: "Image (JPEG, GIF, PNG)", cols: 4 },
                { field: "video", title: "Video (mp4)", cols: 3 },
                { field: "docx", title: "DOCX", cols: 2 },
                { field: "pdf", title: "PDF", cols: 2 }
            ],
            unitTypeList: {
                "length": [
                    "mm", "cm", "m", "km", "mi", "ft"
                ],
                "area": [
                    "sq. m", "sq. km", "sq. ft", "yard", "hectares"
                ],
                "volume": [
                    "cu. mm", "cu. m", "litres"
                ]
            }
        }
    },
    computed: {
        dialog() {
            return this.dialogI;
        },
        allUnitTypes() {
            return Object.keys(this.unitTypeList);
        },
        allUnits() {
            return this.datafield.measurementUnitType ? this.unitTypeList[this.datafield.measurementUnitType] : []
        },
        getOrganizationId() {
            return this.$store.getters.getUser?.user_organization?.id;
        },
        getUserId() {
            return this.$store.getters.getUser?.id;
        }
    },
    watch: {
        selectedDataField: {
            handler(newVal) {
                if (this.isEdit && newVal) {
                    const additionalSettings = newVal.additionalSettings || {};
                    this.datafield = {
                        ...newVal,
                        optionValues: newVal.optionValues || [],
                        measurementUnitType: newVal.measurementUnitType || additionalSettings.measurementUnitType || '',
                        measurementUnit: newVal.measurementUnit || additionalSettings.measurementUnit || '',
                        allowUnitChange: newVal.allowUnitChange || additionalSettings.allowUnitChange || false,
                        allowedFileTypes: newVal.allowedFileTypes || additionalSettings.allowedFileTypes || {}
                    };
                }
            },
            immediate: true,
        },
    },
    methods: {
        addOption() {
            if (this.newOption.trim()) {
            this.datafield.optionValues.push(this.newOption.trim());
            this.newOption = '';
            }
        },
        removeOption(index) {
            this.datafield.optionValues.splice(index, 1);
        },
        resetForm() {
            this.datafield = {
                isMandatory: false,
                datatype: '',
                title: '',
                optionValues: [],
                helpEnabled: false,
                helpText: '',
                measurementUnitType: null,
                measurementUnit: null,
                allowUnitChange: false,
                allowedFileTypes: {},
                additionalSettings: {}
            };
        },
        closeModal() {
            this.resetForm();
            this.$emit("closeDialog");
        },
        async saveDataField() {
            if (this.isAssessmentEditMode) {
                try {
                    // Ensure required IDs are available
                    if (!this.selectedDataField.ids || !this.selectedDataField.ids.surveyId || !this.selectedDataField.ids.questionId) {
                        console.error("Missing required IDs for creating GetData!");
                        return;
                    }

                    const payload = {
                        esgAssessmentId: this.selectedDataField.ids.surveyId,
                        esgAssessmentQuestionId: this.selectedDataField.ids.questionId,
                        esgAssessmentQuestionOptionId: this.selectedDataField.ids.questionOptionId || null,
                        dataType: this.datafield.datatype,
                        title: this.datafield.title,
                        isMandatory: this.datafield.isMandatory,
                        optionValues: this.datafield.optionValues,
                        helpText: this.datafield.helpText,
                        helpEnabled: this.datafield.helpEnabled,
                        additionalSettings: {
                            allowedFileTypes: { ...this.datafield.allowedFileTypes },
                            measurementUnitType: this.datafield.measurementUnitType || "",
                            measurementUnit: this.datafield.measurementUnit || "",
                            allowUnitChange: this.datafield.allowUnitChange || false,
                        },
                        orgId: this.getOrganizationId,
                        createdBy: this.getUserId,
                    };

                    let response;
                    if (this.isEdit && this.datafield._id) {
                        response = await ESGService.updateGetDataQuestion(this.datafield._id, payload);
                    } else {
                        response = await ESGService.createGetDataQuestion(payload);
                    }

                    if (response.success) {
                        console.log("GetData saved successfully:", response.data);
                        this.$notify({ title: "GetData", text: "GetData saved successfully!", type: "success" });
                        
                        // Emit back to parent
                        this.$emit("addDatafield", { ...this.datafield, _id: response.data._id, dataType: this.datafield.datatype });

                        // Reset form
                        this.closeModal
                    } else {
                        console.error("Error saving GetData:", response.message);
                    }
                } catch (error) {
                    console.error("Failed to save GetData:", error);
                }
            } else {
                const formattedDataField = {
                    dataType: this.datafield.datatype,
                    title: this.datafield.title,
                    isMandatory: this.datafield.isMandatory,
                    optionValues: this.datafield.optionValues,
                    helpText: this.datafield.helpText,
                    helpEnabled: this.datafield.helpEnabled,
                    additionalSettings: {
                        allowedFileTypes: { ...this.datafield.allowedFileTypes },
                        measurementUnitType: this.datafield.measurementUnitType || "",
                        measurementUnit: this.datafield.measurementUnit || "",
                        allowUnitChange: this.datafield.allowUnitChange || false,
                    },
                };

                // Emit formatted data
                this.$emit("addDatafield", formattedDataField);

                // Reset form
                this.resetForm();
            }
        },
    }
}
</script>
<style lang="scss" scoped>
.h3 {
    font-size: 1.2em;
    font-weight: bold;
}

.question-footer {
    display: flex;
    flex-direction: row;
    justify-content: end;
    gap: 20px;
}

.option-list .v-list-item {
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 2px;
  border-radius: 6px;
}

::v-deep .v-text-field__details {
    display: none;
}
</style>