<template>
    <div>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <v-form ref="addReportForm" v-model="addReportFormValid" lazy-validation @submit.prevent="submitForm">
                <div class="d-flex mb-8">
                    <h2>{{ this.isUpdate ? $t('regionalRiskAssessment.updateCountryReport') : this.isDuplicate ?
                        $t('regionalRiskAssessment.duplicateCountryReport') :
                        $t('regionalRiskAssessment.createNewCountryReport')}}
                    </h2>
                    <v-spacer></v-spacer>
                    <div class="d-flex mt-1">
                        <v-btn color="primary" outlined dark class="mr-2" @click="resetForm">
                            {{ $t("cancel") }}
                        </v-btn>
                        <v-btn color="primary" dark class="mr-2" type="submit">
                            {{ this.isUpdate ? $t("regionalRiskAssessment.save") : this.isDuplicate ?
                            $t("regionalRiskAssessment.duplicate") : $t("regionalRiskAssessment.submit")
                            }}
                        </v-btn>
                    </div>
                </div>

                <div elevation="0" class="px-5 mt-4">
                    <v-card elevation="0" class="px-5 py-5 mt-7">
                        <v-card-text>
                            <template>
                                <v-row align="center">
                                    <v-col cols="12" sm="6" class="d-flex align-center ">
                                        <h3 style="color:black; margin-bottom:20px; margin-right:40px;">
                                            {{ $t("regionalRiskAssessment.selectCountry") }}
                                        </h3>
                                        <v-autocomplete item-text="name" :rules="riskAssessmentsRules.required" required
                                            item-value="value" :items="countries" style="max-width: 200px;"
                                            :placeholder="$t('regionalRiskAssessment.selectCountry')" outlined
                                            v-model="selectedCountry" dense :disabled="isUpdate" />
                                    </v-col>
                                </v-row>
                                <div>
                                    <v-data-table class="custom-data-table" :headers="headers" :items="riskAssessments"
                                        hide-default-footer :items-per-page="-1" :loading="loading"
                                        :loading-text="$t('loadingData')">
                                        <template v-slot:item.riskassessment="{ item }">
                                            <p color="primary" dark>{{ item.description }}</p>
                                        </template>
                                        <template v-slot:item.riskLevel="{ item }">
                                            <v-select item-text="text" item-value="val" :items=riskLevels
                                                v-model="item.riskLevel" :rules="riskAssessmentsRules.required"
                                                style="height:80%;  max-width: 220px;"
                                                :placeholder="$t('regionalRiskAssessment.select')" outlined
                                                dense></v-select>
                                        </template>
                                        <template v-slot:footer></template>
                                    </v-data-table>
                                </div>
                                <v-spacer></v-spacer>

                                <h2 style="color:black; margin-bottom:20px; margin-top: 40px;">
                                    {{ $t("regionalRiskAssessment.reportDetails") }}
                                </h2>
                                <template>
                                    <main id="sample">
                                        <Editor api-key="s53pebgzqrdjwvldy8noemxchq1kytxw1v4ys7cjvwz9cgye"
                                            v-model="content" :init="{
                                                toolbar_mode: 'sliding',
                                                menubar: false,
                                                plugins: [
                                                    'anchor', 'autolink', 'charmap', 'link', 'lists', 'searchreplace', 'table', 'wordcount',
                                                    'media', 'visualblocks', 'code', 'fullscreen', 'nonbreaking', 'image', 'imagetools'
                                                ],
                                                toolbar: 'undo redo | bold italic underline strikethrough | styleselect | fontselect | fontsizeselect | link table | forecolor backcolor | align | numlist bullist indent outdent | charmap | removeformat',
                                                font_formats: 'Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Oswald=oswald; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats',
                                                fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
                                                toolbar_sticky: true
                                            }" />
                                    </main>
                                </template>

                            </template>
                        </v-card-text>
                    </v-card>

                    <v-card class="my-4 " elevation="0">
                        <v-card-text>
                            <div class="d-flex mt-1 justify-end">
                                <v-btn color="primary" outlined dark class="mr-2" @click="resetForm">
                                    {{ $t("cancel") }}
                                </v-btn>
                                <v-btn color="primary" dark class="mr-2" type="submit">
                                    {{ this.isUpdate ? $t("regionalRiskAssessment.save") : this.isDuplicate ?
                                    $t("regionalRiskAssessment.duplicate") : $t("regionalRiskAssessment.submit")
                                    }}
                                </v-btn>
                            </div>
                        </v-card-text>
                    </v-card>
                </div>
            </v-form>
        </v-container>

    </div>
</template>
<script>

import { getCountries } from "country-state-picker";
import loadingMixin from "@/mixins/LoadingMixin";
import dateMixin from "@/mixins/DateMixin";
import Editor from '@tinymce/tinymce-vue'
import RegionalRiskAssessmentService from "../../../../_services/RegionalRiskAssessmentService";

export default {
    async mounted() {
        this.getCountry();
        if (this.isUpdate || this.isDuplicate) {
            await this.getRegionalRiskAssessmentById();
        }
        await this.getRiskAssessmentCriteria();
    },

    computed: {
        id() {
            return this.$route.params.id;
        },
        isUpdate() {
            if (this.$route.name === "editRegionalRiskAssessment") {
                return true;
            }
            return false;
        },
        isDuplicate() {
            if (this.$route.name === "duplicateRegionalRiskAssessment") {
                return true;
            }
            return false;
        },
    },
    watch: {
    },
    components: {
        Editor
    },
    data() {
        return {
            loading: false,
            addReportFormValid: false,
            headers: [
                {
                    text: this.$t("regionalRiskAssessment.riskAssessmentCriteria"),
                    align: "start",
                    class: "black--text",
                    value: 'riskassessment',
                    sortable: false,
                    width: "100%",
                },
                {
                    text: this.$t("regionalRiskAssessment.riskLevel"),
                    align: "start",
                    value: 'riskLevel',
                    class: "black--text",
                    sortable: false,
                    width: "250px",
                },
            ],
            breadcrumbs: [
                {
                    text: this.$t("regionalRiskAssessment.eudrDueDiligence"),
                    disabled: false,
                    exact: true,
                },
                {
                    text: this.$t("regionalRiskAssessment.title"),
                    disabled: false,
                    to: { name: "regionalRiskAssessment" },
                    exact: true,
                },
                {
                    text: this.$t("regionalRiskAssessment.createNewCountryReport"),
                    disabled: true,
                    to: "breadcrumbs_link_1",
                },
            ],
            countries: [],
            selectedCountry: null,
            riskAssessments: [],
            riskLevels: [{ text: this.$t("regionalRiskAssessment.unassigned"), val: "Unassigned" },
            { text: this.$t("regionalRiskAssessment.standard"), val: "Standard" },
            { text: this.$t("regionalRiskAssessment.standardToHigh"), val: "Standard to High" },
            { text: this.$t("regionalRiskAssessment.high"), val: "High" }],
            content: '',
            riskAssessmentsRules: {
                required: [(v) => !!v || this.$t("regionalRiskAssessment.requiredFields")],
            }
        }
    },
    methods: {
        async saveFormData() {
            try {
                this.startLoading();
                const riskCriteriaIdWithLevels = this.riskAssessments.reduce((acc, item) => {
                    acc[item.id] = item.riskLevel;
                    return acc;
                }, {});
                const payload = {
                    country: this.selectedCountry,
                    riskCriteriaIdWithLevels,
                    reportDetails: this.content,
                };

                const response = await RegionalRiskAssessmentService.createRiskAssessmentCriteria(payload);

                if (response?.errors) {
                    this.$notify({
                        title: response?.errors[0]?.message,
                        type: "error",
                    });
                }
                else {
                    if (this.isDuplicate) {
                        this.$notify({
                            title: this.$t("regionalRiskAssessment.duplicateSuccess"),
                            type: "success",
                        })
                    }
                    else {
                        this.$notify({
                            title: this.$t("regionalRiskAssessment.createCuccess"),
                            type: "success",
                        })

                    }
                    this.$router.push({ name: "regionalRiskAssessment" });
                }

            } catch (error) {
                console.error("Error submitting form:", error);
                this.$notify({
                    title: this.$t("regionalRiskAssessment.createError"),
                    type: "error",
                });
            } finally {
               this.stopLoading();
            }
        },
        async updateFormData() {
            try {
                this.startLoading();
                const riskCriteriaIdWithLevels = this.riskAssessments.reduce((acc, item) => {
                    acc[item.id] = item.riskLevel; // Assuming each risk assessment has an `id` property
                    return acc;
                }, {});
                const payload = {
                    id: parseInt(this.id),
                    country: this.selectedCountry, // Selected country
                    riskCriteriaIdWithLevels,
                    reportDetails: this.content,
                };

                await RegionalRiskAssessmentService.updateRiskAssessmentCriteria(payload);

                this.$notify({
                    title: this.$t("regionalRiskAssessment.updateSuccess"),
                    type: "success",
                });
                this.$router.push({ name: "regionalRiskAssessment" });
            } catch (error) {
                console.error("Error submitting form:", error);
                this.$notify({
                    title: this.$t("regionalRiskAssessment.updateError"),
                    type: "error",
                });
            } finally {
                this.stopLoading();
            }
        },

        submitForm() {
            if (this.$refs.addReportForm.validate()) {
                if (this.isUpdate === true) {
                    this.updateFormData();
                    return;
                }
                else if (this.isDuplicate) {
                    this.saveFormData();
                    return;
                }
                else {
                    this.saveFormData();
                }

            } else {
                this.$notify({
                    title: this.$t("regionalRiskAssessment.pleaseFillRequiredFields"),
                    type: "error",
                });
            }
        },
        resetForm() {
            this.$refs.addReportForm.reset();
            this.$refs.addReportForm.resetValidation();
            this.$router.push({ name: "regionalRiskAssessment" });
        },

        async getRiskAssessmentCriteria() {
            this.loading = true;
            const response = await RegionalRiskAssessmentService.getRiskAssessmentCriteria();
            if (!this.isUpdate && !this.isDuplicate) {
            this.riskAssessments = response.data.fetchAllRiskAssessmentCriteria;
            }
            this.loading = false;
        },

        getCountry() {
            this.countries = [...getCountries()];
        },
        getRegionalRiskAssessmentById() {

            RegionalRiskAssessmentService.getRegionalRiskById(parseInt(this.id))
                .then((response) => {
                    const data = response.data.getRegionalRiskAssessmentById;
                    this.selectedCountry = this.isDuplicate ? null : data.country;
                    this.content = data.reportDetails;

                    this.riskAssessments = data.riskCriteriaIdWithLevels.map((item) => ({
                        id: item.id,
                        description: item.description,
                        riskLevel: item.level,
                    }));
                })
                .catch((error) => {
                    console.error("Error fetching regional risk assessment:", error);
                    this.$notify({
                        title: this.$t("regionalRiskAssessment.fetchError"),
                        type: "error",
                    });
                });
        },
    },
    mixins: [loadingMixin, dateMixin]
}
</script>
<style lang="scss">

</style>
