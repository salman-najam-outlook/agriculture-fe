<template>
    <v-dialog v-model="dialog" width="800" @click:outside="closeModal" :retain-focus="false">
        <v-card class="custom-card" rounded="0">
            <v-toolbar flat color="primary" class="white--text">
                <v-toolbar-title class="font-weight-bold">{{
                    $t("esgPlatform.standardSettings")
                    }}
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon class="white--text" @click="closeModal">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-form ref="form" @submit.prevent="submitForm">
                <v-card-text class="pa-4">
                    <!-- Text Fields - Start -->
                    <div class="item-box">
                        <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">
                            {{ $t('esgPlatform.standardStatus') }}
                        </label>
                        <v-row>
                            <v-col cols="3" sm="6">
                                <v-autocomplete dense v-model="isActive" :items="standardStatusOptions" outlined
                                    :rules="[rules.required]" :error-messages="errors.isActive" required
                                    :placeholder="$t('esgPlatform.standardStatus')">
                                </v-autocomplete>
                            </v-col>
                        </v-row>

                    </div>

                    <div class="item-box">
                        <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">
                            {{ $t('esgPlatform.approvalMethod') }}
                        </label>
                        <v-radio-group v-model="approvalMethod" class="d-flex flex-wrap" row>
                            <v-radio :label="$t('esgPlatform.approvalMethod')" value="Auto"></v-radio>
                            <v-radio :label="$t('esgPlatform.approveManually')" value="Manual"></v-radio>
                        </v-radio-group>
                    </div>

                    <div class="item-box">

                        <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">
                            {{ $t('esgPlatform.scoreForApproval') }}
                        </label>

                        <div class="d-flex align-center">
                            <v-col cols="5" class="pa-0">
                                <div class="d-flex align-center">
                                    <span>{{ $t('esgPlatform.overallProtocolScore') }}</span>
                                    <v-tooltip top color="00BD73" max-width="350">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon class="icon-with-background ml-1" size="medium"
                                                style="color:#0EBF67;" v-bind="attrs" v-on="on">
                                                mdi-alert-circle
                                            </v-icon>
                                        </template>
                                        <span>{{ $t("esgPlatform.overallProtocolScoreTT") }}</span>
                                    </v-tooltip>
                                </div>
                            </v-col>
                            <span class="ml-6">%</span>
                        </div>

                        <v-row>
                            <v-col cols="3" sm="6">
                                <v-text-field v-model="overallProtocolScore" outlined dense
                                    :rules="[rules.required, rules.isNumber]"
                                    :error-messages="errors.overallProtocolScore" placeholder="70"></v-text-field>
                            </v-col>
                        </v-row>


                    </div>

                    <div class="item-box">
                        <div class="d-flex align-center">
                            <v-col cols="5" class="pa-0">
                                <div class="d-flex align-center">
                                    <span>{{ $t('esgPlatform.environmetalScore') }}</span>
                                    <v-tooltip top color="00BD73" max-width="350">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon class="icon-with-background ml-1" size="medium"
                                                style="color:#0EBF67;" v-bind="attrs" v-on="on">
                                                mdi-alert-circle
                                            </v-icon>
                                        </template>
                                        <span>{{ $t("esgPlatform.environmetalScoreTT") }}</span>
                                    </v-tooltip>
                                </div>
                            </v-col>
                            <span class="ml-6">%</span>
                        </div>

                        <v-row>
                            <v-col cols="3" sm="6">
                                <v-text-field v-model="environmentalScore" outlined dense
                                    :rules="[rules.required, rules.isNumber]"
                                    :error-messages="errors.environmentalScore" placeholder="70"></v-text-field>
                            </v-col>
                            <v-col cols="3" sm="6">
                                <v-row>
                                    <v-checkbox v-model="requiresMandatoryScoreForEnvironmentalScore"
                                        label="Mandatory Approval"></v-checkbox>
                                    <v-tooltip top color="00BD73" max-width="350">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon class="icon-with-background" size="medium" style="color:#0EBF67;"
                                                v-bind="attrs" v-on="on">
                                                mdi-alert-circle
                                            </v-icon>
                                        </template>
                                        <span>{{ $t("esgPlatform.environmetalScoreTT") }}</span>
                                    </v-tooltip>
                                </v-row>
                            </v-col>
                        </v-row>
                    </div>

                    <div class="item-box">
                        <div class="d-flex align-center">
                            <v-col cols="5" class="pa-0">
                                <div class="d-flex align-center">
                                    <span>{{ $t('esgPlatform.socialScore') }}</span>
                                    <v-tooltip top color="00BD73" max-width="350">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon class="icon-with-background ml-1" size="medium"
                                                style="color:#0EBF67;" v-bind="attrs" v-on="on">
                                                mdi-alert-circle
                                            </v-icon>
                                        </template>
                                        <span>{{ $t("esgPlatform.socialScoreTT") }}</span>
                                    </v-tooltip>
                                </div>
                            </v-col>
                            <span class="ml-6">%</span>
                        </div>
                        <v-row>
                            <v-col cols="3" sm="6">
                                <v-text-field v-model="socialScore" outlined dense
                                    :rules="[rules.required, rules.isNumber]" :error-messages="errors.socialScore"
                                    placeholder="70"></v-text-field>
                            </v-col>
                            <v-col cols="3" sm="6">
                                <v-row>
                                    <v-checkbox v-model="requiresMandatoryScoreForSocialScore"
                                        label="Mandatory Approval"></v-checkbox>
                                    <v-tooltip top color="00BD73" max-width="350">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon class="icon-with-background" size="medium" style="color:#0EBF67;"
                                                v-bind="attrs" v-on="on">
                                                mdi-alert-circle
                                            </v-icon>
                                        </template>
                                        <span>{{ $t("esgPlatform.socialScoreTT") }}</span>
                                    </v-tooltip>
                                </v-row>
                            </v-col>
                        </v-row>
                    </div>

                    <div class="item-box">
                        <div class="d-flex align-center">
                            <v-col cols="5" class="pa-0">
                                <div class="d-flex align-center">
                                    <span>{{ $t('esgPlatform.governanceScore') }}</span>
                                    <v-tooltip top color="00BD73" max-width="350">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon class="icon-with-background ml-1" size="medium"
                                                style="color:#0EBF67;" v-bind="attrs" v-on="on">
                                                mdi-alert-circle
                                            </v-icon>
                                        </template>
                                        <span>{{ $t("esgPlatform.governanceScoreTT") }}</span>
                                    </v-tooltip>
                                </div>
                            </v-col>
                            <span class="ml-6">%</span>
                        </div>
                        <v-row>
                            <v-col cols="3" sm="6">
                                <v-text-field v-model="governanceScore" outlined dense
                                    :rules="[rules.required, rules.isNumber]" :error-messages="errors.governanceScore"
                                    placeholder="70"></v-text-field>
                            </v-col>
                            <v-col cols="3" sm="6">
                                <v-row>
                                    <v-checkbox v-model="requiresMandatoryScoreForGovernanceScore"
                                        label="Mandatory Approval"></v-checkbox>
                                    <v-tooltip top color="00BD73" max-width="350">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon class="icon-with-background" size="medium" style="color:#0EBF67;"
                                                v-bind="attrs" v-on="on">
                                                mdi-alert-circle
                                            </v-icon>
                                        </template>
                                        <span>{{ $t("esgPlatform.governanceScoreTT") }}</span>
                                    </v-tooltip>
                                </v-row>
                            </v-col>
                        </v-row>
                    </div>
                </v-card-text>

                <v-card-actions class="pa-4">
                    <v-spacer></v-spacer>
                    <v-btn color="primary" outlined class="mr-2" @click="closeModal">
                        {{ $t("cancel") }} </v-btn>
                    <v-btn color="primary" @click="submitForm">
                        {{ $t("submit") }}
                    </v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>
<script>
import ESGService from "@/_services/EsgService";

export default {
    computed: {
        dialog() {
            return this.dialogI;
        },
    },
    mounted() {
        this.clearErrors();
        this.getStandard();
    },
    watch: {

        watch: {
            isActive(value) {
                if (value) this.errors.isActive = [];
            },
            approvalMethod(value) {
                if (value) this.errors.approvalMethod = [];
            },
            overallProtocolScore(value) {
                if (value) this.errors.overallProtocolScore = [];
            },
            environmentalScore(value) {
                if (value) this.errors.environmentalScore = [];
            },
            socialScore(value) {
                if (value) this.errors.socialScore = [];
            },
            governanceScore(value) {
                if (value) this.errors.governanceScore = [];
            }
        },


    },
    data() {
        return {
            standardStatusOptions: [
                { text: this.$t('esgPlatform.active'), value: true },
                { text: this.$t('esgPlatform.inactive'), value: false },
            ],
            isActive: null,
            approvalMethod: '',
            overallProtocolScore: '',
            environmentalScore: '',
            socialScore: '',
            governanceScore: '',
            requiresMandatoryScoreForEnvironmentalScore: false,
            requiresMandatoryScoreForSocialScore: false,
            requiresMandatoryScoreForGovernanceScore: false,
            validationError: false,
            errors: {
                isActive: [],
                approvalMethod: [],
                overallProtocolScore: [],
                environmentalScore: [],
                socialScore: [],
                governanceScore: [],
                requiresMandatoryScoreForEnvironmentalScore: [],
                requiresMandatoryScoreForSocialScore: [],
                requiresMandatoryScoreForGovernanceScore: [],
            },
            rules: {
                required: v => (v !== null && v !== undefined) || this.$t("esgPlatform.thisfieldIsRequired"),
                isNumber: v => {
                    if (v === null || v === undefined) return true;
                    return (v >= 0 && v <= 100) || this.$t("esgPlatform.pleaseEnterWholeNumberBetween0and100");
                },
            },
        }
    },
    methods: {
        isValid() {
            let valid = true;

            // Reset errors without setting messages yet
            this.clearErrors();

            if (!this.isActive) {
                valid = false;
            }
            if (!this.approvalMethod) {
                valid = false;
            }
            if (!this.overallProtocolScore) {
                valid = false;
            }
            if (!this.environmentalScore) {
                valid = false;
            }
            if (!this.socialScore) {
                valid = false;
            }
            if (!this.governanceScore) {
                valid = false;
            }

            return valid;
        }
        ,
        closeModal() {
            this.$emit('closeModal');
        },
        clearErrors() {
            this.errors = {
                isActive: [],
                approvalMethod: [],
                overallProtocolScore: [],
                environmentalScore: [],
                socialScore: [],
                governanceScore: [],
            };
        },
        async submitForm() {
            this.validationError = false;
            // Ensure the form validation runs correctly
            const formValid = this.$refs.form.validate();

            if (!formValid) {
                this.$notify({
                    title: this.$t("esgPlatform.pleaseFillRequiredFields"),
                    type: "error",
                });
                return;
            }

            // Prepare FormData
            let formData = {
                isActive: this.isActive,
                approvalMethod: this.approvalMethod,
                overallScore: this.overallProtocolScore,
                environmentalScore: this.environmentalScore,
                socialScore: this.socialScore,
                governanceScore: this.governanceScore,
                requiresMandatoryScoreForEnvironmentalScore: this.requiresMandatoryScoreForEnvironmentalScore,
                requiresMandatoryScoreForSocialScore: this.requiresMandatoryScoreForSocialScore,
                requiresMandatoryScoreForGovernanceScore: this.requiresMandatoryScoreForGovernanceScore,
            };
            try {
                await ESGService.updateEsgStandardSettings(this.$route.params.id, formData);
                this.closeModal();
                this.$notify({
                    title: this.$t("esgPlatform.standardAddedSuccessfully"),
                    type: "success",
                });
            } catch (error) {
                this.$notify({
                    title: this.$t("esgPlatform.errorSubmittingForm"),
                    type: "error",
                });
                console.error("Submit error:", error);
            }
        },
        async getStandard() {

            try {
                const response = await ESGService.getEsgStandardDetails(this.$route.params.id);
                this.isActive = response.data.isActive;
                this.approvalMethod = response.data.approvalMethod;
                this.overallProtocolScore = response.data.overallScore;
                this.environmentalScore = response.data.environmentalScore;
                this.socialScore = response.data.socialScore;
                this.governanceScore = response.data.governanceScore;
                this.requiresMandatoryScoreForEnvironmentalScore = response.data.requiresMandatoryScoreForEnvironmentalScore;
                this.requiresMandatoryScoreForSocialScore = response.data.requiresMandatoryScoreForSocialScore;
                this.requiresMandatoryScoreForGovernanceScore = response.data.requiresMandatoryScoreForGovernanceScore;


            } catch (error) {
                this.$notify({
                    type: "error",
                    text: this.$t("esgPlatform.errorLoadingStandard"),
                });
            }
        },
    },
    props: {
        'dialogI': {
            type: Boolean,
            required: true
        },
    },
}
</script>

<style scoped>
.spaced {
    justify-content: space-between;
}
</style>