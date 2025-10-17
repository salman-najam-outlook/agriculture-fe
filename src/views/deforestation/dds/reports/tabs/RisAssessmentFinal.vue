<template>
    <div>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <div class="d-flex mb-4">
                <h2>Due Diligence Report Creation </h2>
                <v-spacer></v-spacer>
            </div>
            <v-card class="mb-5">
                <v-card-text>
                    <div class="d-flex mb-4">
                        <h2>Risk Assessment & Mitigation </h2>
                        <v-spacer></v-spacer>
                        <v-btn type="submit" color="thiGray" class="mr-2"> Upload File </v-btn>
                        <v-btn type="submit" color="thiGray"> Take Assessment </v-btn>
                    </div>
                </v-card-text>
            </v-card>
            <v-card elevation="0" class="px-5">
                <v-card-text>
                    <v-form ref="riskAssessmentForm" @submit.prevent="addSurvey" autocomplete="off">
                        <v-row class="mb-4 pl-3">
                            <v-col cols="4">
                                <div class="approve-box">
                                    <label for="name" class="mb-4">Risk Assessment Status</label>
                                    <v-autocomplete :items="[]" placeholder="Risk Assessment status" item-text="name"
                                        item-value="id" dense outlined style="margin-left: -1px"
                                        class="rounded select-duration"></v-autocomplete>
                                </div>
                            </v-col>
                        </v-row>
                        <v-row class="pl-3">
                            <v-col cols="6">
                                <div class="risk-assement">
                                    <h2 class="mb-7">
                                        Upload Risk Assessment
                                        <span style="color: green">
                                            <v-icon color="primary">info</v-icon>
                                        </span>
                                    </h2>

                                    <div class="pdf-docs mt-10 d-flex">
                                        <div class="docs-box mr-4">
                                            <div class="docs-preview">
                                                <div class="img-item">
                                                    <div class="pdf-box">
                                                        <v-icon @click="removePDFFile()"> mdi-trash-can-outline
                                                        </v-icon>
                                                        <h1> PDF </h1>
                                                    </div>
                                                    <span> Attachment 2 </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="text-box mr-4">
                                            <v-textarea placeholder="Comments" outlined></v-textarea>
                                        </div>

                                        <div class="expiry-box">
                                            <label class="expiration" for="name">Expiry Date </label>
                                            <v-menu v-model="productExpirationMenu" :close-on-content-click="false"
                                                :nudge-right="40" transition="scale-transition" offset-y
                                                min-width="auto">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-text-field append-icon="mdi-calendar" outlined dense readonly
                                                        v-bind="attrs" v-on="on"
                                                        v-on:click:append="productExpirationMenu = true"
                                                        placeholder="Select Date"></v-text-field>
                                                </template>
                                                <v-date-picker placeholder="Select Date"
                                                    @input="productExpirationMenu = false"></v-date-picker>
                                            </v-menu>
                                        </div>
                                    </div>
                                    <div class="pdf-docs mt-10 d-flex">
                                        <div class="docs-box mr-4">
                                            <div class="docs-preview">
                                                <div class="img-item">
                                                    <div class="pdf-box">
                                                        <v-icon @click="removePDFFile()"> mdi-trash-can-outline
                                                        </v-icon>
                                                        <h1> PDF </h1>
                                                    </div>
                                                    <span> Attachment 2 </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="text-box mr-4">
                                            <v-textarea placeholder="Comments" outlined></v-textarea>
                                        </div>

                                        <div class="expiry-box">
                                            <label class="expiration" for="name">Expiry Date </label>
                                            <v-menu v-model="productExpirationMenu" :close-on-content-click="false"
                                                :nudge-right="40" transition="scale-transition" offset-y
                                                min-width="auto">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-text-field append-icon="mdi-calendar" outlined dense readonly
                                                        v-bind="attrs" v-on="on"
                                                        v-on:click:append="productExpirationMenu = true"
                                                        placeholder="Select Date"></v-text-field>
                                                </template>
                                                <v-date-picker placeholder="Select Date"
                                                    @input="productExpirationMenu = false"></v-date-picker>
                                            </v-menu>
                                        </div>
                                    </div>
                                </div>
                            </v-col>
                            <v-col cols="6" class="d-flex flex-row-reverse">
                                <v-btn type="button" color="primary" width="112"> Edit </v-btn>
                            </v-col>
                        </v-row>
                        <v-divider class="mb-4"></v-divider>

                        <v-row>
                            <v-col cols="12" class="mb-4">
                                <h2>Manually Fill Out Assessment
                                    <span style="color: green">
                                        <v-icon color="primary">info</v-icon>
                                    </span>
                                </h2>
                            </v-col>

                            <v-col cols="6">
                                <div class="q-box mb-4">
                                    <div class="rd-result-box d-flex">
                                        <div class="flex-grow-8"> The farmer declares that all information provided to
                                            the continuation is true
                                            and assumes all responsibility for it. </div>
                                        <div class="flex-grow-1"> <span> Yes </span> </div>
                                        <div class="flex-grow-1"> <span class="lw-color"> Low </span> </div>
                                    </div>
                                    <v-divider class="mb-4 mt-4"></v-divider>
                                </div>

                                <div class="q-box mb-4">
                                    <div class="rd-result-box d-flex">
                                        <div class="flex-grow-8"> The farmer declares that all information provided to
                                            the continuation is true
                                            and assumes all responsibility for it. </div>
                                        <div class="flex-grow-1"> <span> Yes </span> </div>
                                        <div class="flex-grow-2">
                                            <span class="very-high-color"> Very High </span>
                                            <v-btn x-small fab color="yellowIcon">
                                                <v-icon rounded>mdi-hammer-wrench</v-icon>
                                            </v-btn>
                                        </div>
                                    </div>
                                    <v-divider class="mb-4 mt-4"></v-divider>
                                </div>

                                <div class="q-box mb-4">
                                    <div class="rd-result-box d-flex">
                                        <div class="flex-grow-8"> The farmer declares that all information provided to
                                            the continuation is true
                                            and assumes all responsibility for it. </div>
                                        <div class="flex-grow-1"> <span> Yes </span> </div>
                                        <div class="flex-grow-1"> <span class="vlw-color"> Very Low </span> </div>
                                    </div>
                                    <v-divider class="mb-4 mt-4"></v-divider>
                                </div>

                                <div class="q-box mb-4">
                                    <div class="rd-result-box d-flex">
                                        <div class="flex-grow-8"> The farmer declares that all information provided to
                                            the continuation is true
                                            and assumes all responsibility for it. </div>
                                        <div class="flex-grow-1"> <span> Yes </span> </div>
                                        <div class="flex-grow-1"> <span color="zero-color"> Zero/Negligible </span>
                                        </div>
                                    </div>
                                    <v-divider class="mb-4 mt-4"></v-divider>
                                </div>

                                <div class="q-box mb-4">
                                    <div class="txt-f mb-3">
                                        <label class="mb-2"> (if yes) Please attach file. </label>
                                        <v-textarea outlined placeholder="Comments"> </v-textarea>
                                    </div>
                                    <div class="rd-result-box d-flex">
                                        <div class="flex-grow-8"> The farmer declares that all information provided to
                                            the continuation is true
                                            and assumes all </div>
                                        <div class="flex-grow-1"> <span> Yes </span> </div>
                                        <div class="flex-grow-1"> <span color="zero-color"> Zero/Negligible </span>
                                        </div>
                                    </div>
                                    <v-divider class="mb-4 mt-4"></v-divider>
                                </div>
                            </v-col>

                            <v-col cols="6">
                                <div class="q-box mb-4">
                                    <div class="rd-result-box d-flex">
                                        <div class="flex-grow-8"> The farmer declares that all information provided to
                                            the continuation is true
                                            and assumes all responsibility for it. </div>
                                        <div class="flex-grow-1"> <span> Yes </span> </div>
                                        <div class="flex-grow-2">
                                            <span class="high-color"> High </span>
                                            <v-btn x-small fab color="yellowIcon">
                                                <v-icon rounded>mdi-hammer-wrench</v-icon>
                                            </v-btn>
                                        </div>
                                    </div>
                                    <v-divider class="mb-4 mt-4"></v-divider>
                                </div>

                                <div class="q-box mb-4">
                                    <div class="rd-result-box d-flex">
                                        <div class="flex-grow-8"> The farmer declares that all information provided to
                                            the continuation is true
                                            and assumes all responsibility for it. </div>
                                        <div class="flex-grow-1"> <span> Yes </span> </div>
                                        <div class="flex-grow-2">
                                            <span class="very-high-color"> Low </span>
                                            <v-btn x-small fab color="primary">
                                                <v-icon rounded>mdi-history</v-icon>
                                            </v-btn>
                                        </div>
                                    </div>
                                    <v-divider class="mb-4 mt-4"></v-divider>
                                </div>

                                <div class="q-box mb-4">
                                    <div class="rd-result-box d-flex">
                                        <div class="flex-grow-8"> The farmer declares that all information provided to
                                            the continuation is true
                                            and assumes all responsibility for it. </div>
                                        <div class="flex-grow-1"> <span> Yes </span> </div>
                                        <div class="flex-grow-2"> <span class="vlw-color"> Very Low </span> </div>
                                    </div>
                                    <v-divider class="mb-4 mt-4"></v-divider>
                                </div>

                                <div class="q-box mb-4">
                                    <div class="rd-result-box d-flex">
                                        <div class="flex-grow-8"> The farmer declares that all information provided to
                                            the continuation is true
                                            and assumes all responsibility for it. </div>
                                        <div class="flex-grow-1"> <span> Yes </span> </div>
                                        <div class="flex-grow-2"> <span color="medium-color"> Medium </span>
                                            <v-btn x-small fab color="yellowIcon">
                                                <v-icon rounded>mdi-hammer-wrench</v-icon>
                                            </v-btn>
                                        </div>
                                    </div>
                                    <v-divider class="mb-4 mt-4"></v-divider>
                                </div>

                                <div class="q-box mb-4">
                                    <div class="rd-result-box d-flex">
                                        <div class="flex-grow-8"> The farmer declares that all information provided to
                                            the continuation is true
                                            and assumes all </div>
                                        <div class="flex-grow-1"> <span> Yes </span> </div>
                                        <div class="flex-grow-2"> <span color="zero-color"> Zero/Negligible </span>
                                        </div>
                                    </div>
                                    <v-divider class="mb-4 mt-4"></v-divider>
                                </div>

                            </v-col>

                            <v-col cols="12" class="mb-5">
                                <div class="sign-box">
                                    <p> Would you kindly sign digitally to confirm your participation in this surveysssssssssssssss?
                                    </p>
                                    <div class="signature-img-box d-flex">
                                        <img width="150"
                                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Todd_Strasser_signature.png/790px-Todd_Strasser_signature.png?20120809231836" />
                                        <div class="p-info">
                                            <p> Digitally Signed By....: <br>
                                                John Doe <br>
                                                Date: 12/05/2024
                                                14:44:06 </p>
                                        </div>
                                    </div>
                                </div>
                            </v-col>
                            <v-col cols="12">
                                <div class="rsk-sign d-flex flex-row-reverse">
                                    <p>
                                        <v-btn x-small fab color="yellowIcon">
                                            <v-icon rounded>mdi-hammer-wrench</v-icon>
                                        </v-btn>
                                        Risk Mitigation
                                    </p>
                                    &nbsp;
                                    <p class="mr-2">
                                        <v-btn x-small fab color="primary">
                                            <v-icon rounded>mdi-history</v-icon>
                                        </v-btn>
                                        Risk Mitigation History
                                    </p>
                                    
                                </div>
                            </v-col>
                        </v-row>




                        <div class="btn-div d-flex flex-row-reverse">
                            <v-btn type="submit" color="primary" width="112"> Submit </v-btn>
                            <v-btn outlined class="mr-2" color="primary" width="112">
                                {{ $t('cancel') }}
                            </v-btn> &nbsp; &nbsp;
                        </div>

                    </v-form>
                </v-card-text>
            </v-card>


        </v-container>
    </div>
</template>

<script>
import DownloadMixin from "@/mixins/DownloadMixin";
import loadingMixin from "@/mixins/LoadingMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";

export default {
    mounted() {
        this.loading = false;
    },
    components: {

    },
    methods: {
        addSurvey() {
            if (!this.$refs.riskAssessmentForm.validate()) return
            console.log('valid forms')
        },
        removePDFFile() { },

        additionalOnChangeForFile(e) {
            console.log(e)
        },

    },
    data() {
        return {
            productExpirationMenu: false,
            openSignatureModel: false,
            breadcrumbs: [
                {
                    text: this.$t("dashboard"),
                    disabled: true,
                    to: "/",
                },
                {
                    text: 'Due Diligence > Create New Report',
                    disabled: true,
                    to: "breadcrumbs_link_1",
                },
            ],
            dragging: false,
            previewUrl: null,
            additionalFileOne: true,
            additionalPrevUrlOne: null,
            additionalPrevUrlTwo: null,
            openAddPricingSlab: false,
        };
    },
    mixins: [loadingMixin, getPermittedActions, DownloadMixin]
};
</script>

<style lang="scss" scoped>
.img-preview {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
}

.img-item img {
    max-height: inherit;
}

.img-item button {
    position: absolute;
    right: 0;
    color: red;
    cursor: pointer;
}

.letterSpacing {
    letter-spacing: 0;
}

.my-awesome-table {
    table-layout: fixed;
}

::v-deep .v-tab:hover {
    background-color: #caf1e2;
    color: $primary_color !important;
}

::v-deep .green-shadow:hover {
    background-color: $primary_color;
    color: white;
}

::v-deep .my-custom-dialog {
    position: absolute;
    top: 0;
    min-height: 100%;
    right: 0;
    margin-right: 0px;
    margin-top: 0px;
}

::v-deep .square {
    width: 1vw;
    height: 1vw;
}

::v-deep .xxxx {
    border: 2px solid black;
}

::v-deep .product-name-cl {
    padding: 5px;
}

::v-deep .product-name-cl .product-img {
    display: flex;
    align-items: center;
}

::v-deep .product-img p {
    margin-left: 5px;
}


.dropZone {
    width: 100%;
    height: 200px;
    position: relative;
    border: 2px dashed #97A8B8;
}

.upload-document {
    width: 100%;
}

.dropZone:hover {
    border: 2px solid $primary-color;
}

.dropZone:hover .dropZone-title {
    color: $primary-color;
}

.dropZone-info {
    color: #A8A8A8;
    position: absolute;
    top: 50%;
    width: 100%;
    transform: translate(0, -50%);
    text-align: center;
}

.dropZone-title {
    color: #787878;
}

.dropZone input {
    position: absolute;
    cursor: pointer;
    top: 0px;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
}

.dropZone-upload-limit-info {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    overflow: clip;
}

.dropZone-over {
    background: #5C5C5C;
    opacity: 0.8;
    overflow: clip;
}

.dropZone-uploaded {
    width: 100%;
    height: 450px;
    position: relative;
    border: 2px solid $primary-color;
    overflow: clip;
}

.dropZone-uploaded-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #A8A8A8;
    position: absolute;
    top: 50%;
    width: 100%;
    transform: translate(0, -50%);
    text-align: center;
    overflow: clip;
}

.blue-color {
    color: #0057BD;
}

.underline {
    text-decoration: underline;
}

.gray-color {
    color: #979797;
}

.pdf-box {
    height: 75px;
    width: 75px;
    background-color: #e5f8f1;
    position: relative;
    line-height: 75px;
    text-align: center;
}

.pdf-box h1 {
    color: #135B00;
}

.flex-grow-8 {
    flex: 8
}

.flex-grow-1 {
    flex: 1
}

.flex-grow-2 {
    flex: 2
}

.lw-color {
    color: #60DBDB;
}

.vlw-color {
    color: #208080;
}

.zero-color {
    color: #979797;
}

.very-high-color {
    color: #8B0000;
}

.high-color {
    color: #F02020;
}

.medium-color {
    color: #FFA520;
}

.primary-color {
    color: #00BD73;
}
</style>