<template>
    <div>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <div class="d-flex mb-4">
                <h2>{{ $t('dueDiligence.createShipment') }}</h2>
                <v-spacer></v-spacer>
                <div class="d-flex mt-1">
                    <v-btn color="primary" outlined class="mr-2" @click="redirectListPage">
                        {{ $t('cancel') }}
                    </v-btn>
                    <v-btn color="primary" dark class="mr-2" @click="triggerShipmentCreate">
                        {{ $t('dueDiligence.createShipment') }}
                    </v-btn>
                </div>
            </div>
            <v-form ref="createShipment" @submit.prevent="createShipment" autocomplete="off">
                <v-card elevation="0">
                    <v-card class="mb-5" flat>
                        <v-card-text>
                            <v-row class="pl-2 mb-2">
                                <v-col sm="12">

                                    <v-toolbar-title class="font-weight-bold">
                                        {{ $t('deforestation.generalData') }}
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon class="icon-with-background primary--text mx-2" style="color:#0EBF67"
                                                    v-bind="attrs" v-on="on">
                                                    mdi-alert-circle
                                                </v-icon>
                                            </template>
                                            <span>{{ $t('deforestation.generalData') }}</span>
                                        </v-tooltip>
                                    </v-toolbar-title>
                                </v-col>
                            </v-row>


                            <v-row class="pl-3">
                                <v-col sm="3">
                                    <div class="item-box">
                                        <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">
                                            {{ $t('deforestation.exporter') }}
                                        </label>
                                        <v-tooltip top color="00BD73" max-width="350">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                                mdi-alert-circle
                                                </v-icon>
                                            </template>
                                            <span>{{ $t("deforestation.exporterInfo") }}</span>
                                        </v-tooltip>
                                        <v-text-field dense v-model="shipment.exporter" :rules="shipmentRules.exporter"
                                            required :placeholder="$t('deforestation.exporter')"
                                            outlined readonly></v-text-field>
                                    </div>
                                </v-col>
                                <v-col sm="3">
                                    <div class="item-box">
                                        <label for="autoLogOff" class="text-subtitle-1 font-weight-bold"> {{
                                            $t('deforestation.importer') }}
                                        </label>
                                        <v-tooltip top color="00BD73" max-width="350">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                                mdi-alert-circle
                                                </v-icon>
                                            </template>
                                            <span>{{ $t("deforestation.importerInfo") }}</span>
                                        </v-tooltip>
                                        <v-text-field dense v-model="shipment.importer" :rules="shipmentRules.importer"
                                            required :placeholder="$t('deforestation.importer')"
                                            outlined></v-text-field>
                                    </div>
                                </v-col>
                                <v-col sm="3">
                                    <div class="item-box">
                                        <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">
                                            {{ $t('deforestation.shipmentReferenceNo') }}
                                        </label>
                                        <v-tooltip top color="00BD73" max-width="350">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                                mdi-alert-circle
                                                </v-icon>
                                            </template>
                                            <span>{{ $t("deforestation.shipmentReferenceNoInfo") }}</span>
                                        </v-tooltip>
                                        <v-text-field dense v-model="shipment.shipmentRefrenceNumber"
                                            :rules="shipmentRules.shipmentRefrenceNumber" required
                                            :placeholder="$t('deforestation.shipmentReferenceNo')"
                                            outlined></v-text-field>
                                    </div>
                                </v-col>
                                <v-col sm="3">
                                    <div class="item-box">
                                        <label for="autoLogOff" class="text-subtitle-1 font-weight-bold"> {{
                                            $t('deforestation.ownerShipType') }}
                                            <v-tooltip top color="00BD73" max-width="350">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                                    mdi-alert-circle
                                                    </v-icon>
                                                </template>
                                                <span>{{ $t("deforestation.ownerShipTypeInfo") }}</span>
                                            </v-tooltip>
                                        </label>
                                        <v-autocomplete item-text="name" item-value="value" :items="ownershipTypes"
                                            dense v-model="shipment.ownershipType" :rules="shipmentRules.ownershipType"
                                            required :placeholder="$t('deforestation.ownerShipType')"
                                            outlined></v-autocomplete>
                                    </div>
                                </v-col>
                                <v-col sm="3">
                                    <div class="item-box">
                                        <label for="autoLogOff" class="text-subtitle-1 font-weight-bold"> {{
                                            $t('deforestation.buyerName') }}
                                        </label>
                                        <v-text-field dense v-model="shipment.buyer" :rules="shipmentRules.buyer"
                                            required :placeholder="$t('deforestation.buyerName')"
                                            outlined></v-text-field>
                                    </div>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-card>

                <v-card elevation="0">
                    <v-card class="mb-5" flat>
                        <v-card-text>
                            <v-row class="pl-2 mb-2">
                                <v-col sm="12">
                                    <v-toolbar-title class="font-weight-bold">
                                        {{ $t('dueDiligence.dueDiligenceReports') }}
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon class="icon-with-background primary--text mx-2" style="color:#0EBF67"
                                                    v-bind="attrs" v-on="on">
                                                    mdi-alert-circle
                                                </v-icon>
                                            </template>
                                            <span>{{ $t('dueDiligence.dueDiligenceReports') }}</span>
                                        </v-tooltip>
                                    </v-toolbar-title>
                                </v-col>
                            </v-row>
                            <DueDiligenceReportTable @handleCheckboxChange="handleCheckboxChange">
                            </DueDiligenceReportTable>
                        </v-card-text>
                    </v-card>
                </v-card>

                <v-card class="mb-5" flat>
                    <v-card-text>
                        <v-row class="pl-2 mb-2">
                            <v-col sm="12">
                                <v-toolbar-title class="font-weight-bold">
                                    {{ $t('dueDiligence.logistics') }}
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon class="icon-with-background primary--text mx-2" style="color:#0EBF67"
                                                v-bind="attrs" v-on="on">
                                                mdi-alert-circle
                                            </v-icon>
                                        </template>
                                        <span>{{ $t('dueDiligence.logistics') }}</span>
                                    </v-tooltip>
                                </v-toolbar-title>
                            </v-col>
                        </v-row>
                        <v-row class="pl-3">
                            <v-col sm="3">
                                <div class="item-box">
                                    <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">{{
                                        $t('deforestation.port_of_origin')
                                    }}
                                    </label>
                                    <v-tooltip top color="00BD73" max-width="350">
                                        <template v-slot:activator="{ on, attrs }">
                                          <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                            mdi-alert-circle
                                          </v-icon>
                                        </template>
                                        <span>{{ $t("deforestation.port_of_origin_info") }}</span>
                                      </v-tooltip>
                                    <v-text-field dense v-model="shipment.partOfOrigin"
                                        :rules="shipmentRules.partOfOrigin" required
                                        :placeholder="$t('deforestation.port_of_origin')" outlined></v-text-field>
                                </div>
                            </v-col>
                            <v-col sm="3">
                                <div class="item-box">
                                    <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">
                                        {{ $t('deforestation.port_of_destination') }}
                                    </label>
                                    <v-tooltip top color="00BD73" max-width="350">
                                        <template v-slot:activator="{ on, attrs }">
                                          <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                            mdi-alert-circle
                                          </v-icon>
                                        </template>
                                        <span>{{ $t("deforestation.port_of_destination_info") }}</span>
                                      </v-tooltip>
                                    <v-text-field dense v-model="shipment.partOfDestination"
                                        :rules="shipmentRules.partOfDestination" required
                                        :placeholder="$t('deforestation.port_of_destination')" outlined></v-text-field>
                                </div>
                            </v-col>
                        </v-row>

                        <v-row class="pl-2 mb-2">
                            <p class="text--primary" @click="handleStopAdd">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn class="mx-2" fab x-small dark v-bind="attrs" v-on="on" color="primary">
                                            <v-icon style="color:white !important">mdi-plus</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>{{ $t('dueDiligence.addStop') }}</span>
                                </v-tooltip>
                                {{ $t('dueDiligence.addStop') }}
                            </p>
                        </v-row>

                        <v-row class="pl-2 gray-color mb-2">
                            <v-col sm="3" v-for="(stop, key) in shipment.stops" :key="key">
                                <div class="item-box">
                                    <label for="autoLogOff"
                                        class="text-subtitle-1 font-weight-bold d-flex justify-space-between mb-2">
                                        {{ $t('dueDiligence.stop') }} {{ key + 1 }}
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn class="mx-2" @click="handleClose(key)" dark fab x-small
                                                    v-bind="attrs" v-on="on" color="red">
                                                    <v-icon style="color:white !important">mdi-close</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>{{ $t('delete') }}</span>
                                        </v-tooltip>
                                    </label>
                                    <v-text-field dense v-model="stop.title" required
                                        :placeholder="$t('dueDiligence.enterStop')" outlined></v-text-field>
                                </div>
                            </v-col>
                        </v-row>


                        <v-row class="pl-2">
                            <v-col sm="3">
                                <div class="item-box">
                                    <label for="autoLogOff" class="text-subtitle-1 font-weight-bold"> {{
                                        $t('deforestation.shipping_line') }}
                                    </label>
                                    <v-tooltip top color="00BD73" max-width="350">
                                        <template v-slot:activator="{ on, attrs }">
                                          <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                            mdi-alert-circle
                                          </v-icon>
                                        </template>
                                        <span>{{ $t("deforestation.port_of_destination_info") }}</span>
                                      </v-tooltip>
                                    <v-text-field dense v-model="shipment.shippingLine"
                                        :rules="shipmentRules.shippingLine" required
                                        :placeholder="$t('deforestation.shipping_line')" outlined></v-text-field>
                                </div>
                            </v-col>
                            <v-col sm="3">
                                <label class="expiration text-subtitle-1 font-weight-bold" for="name">{{
                                    $t('deforestation.expected_arrival_date') }}</label>
                                <v-tooltip top color="00BD73" max-width="350">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                        mdi-alert-circle
                                        </v-icon>
                                    </template>
                                    <span>{{ $t("deforestation.expected_arrival_date_info") }}</span>
                                </v-tooltip>
                                <v-menu v-model="expectedArrivalDate" :close-on-content-click="false" :nudge-right="40"
                                    transition="scale-transition" offset-y min-width="auto">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field append-icon="mdi-calendar" v-model="shipment.expectedArrivalDate"
                                            outlined dense readonly v-bind="attrs" v-on="on"
                                            v-on:click:append="expectedArrivalDate = true"
                                            :placeholder="$t('deforestation.expected_arrival_date')"></v-text-field>
                                    </template>
                                    <v-date-picker v-model="shipment.expectedArrivalDate"
                                        :placeholder="$t('deforestation.expected_arrival_date')"
                                        @input="expectedArrivalDate = false"></v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col sm="3">
                                <div class="item-box">
                                    <label for="autoLogOff" class="text-subtitle-1 font-weight-bold"> {{
                                        $t('deforestation.container_id') }}
                                    </label>
                                    <v-tooltip top color="00BD73" max-width="350">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                            mdi-alert-circle
                                            </v-icon>
                                        </template>
                                        <span>{{ $t("deforestation.container_id_info") }}</span>
                                    </v-tooltip>
                                    <v-text-field dense v-model="shipment.containerId"
                                        :rules="shipmentRules.containerId" required
                                        :placeholder="$t('deforestation.container_id')" outlined></v-text-field>
                                </div>
                            </v-col>
                        </v-row>

                        <v-row class="pl-2">
                            <v-col sm="3">
                                <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">{{
                                    $t('deforestation.container_type')
                                }}
                                </label>
                                <v-tooltip top color="00BD73" max-width="350">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                        mdi-alert-circle
                                        </v-icon>
                                    </template>
                                    <span>{{ $t("deforestation.container_type_info") }}</span>
                                </v-tooltip>
                                <v-autocomplete :items="containerTypes" v-model="shipment.containerType"
                                    :rules="shipmentRules.containerType"
                                    :placeholder="$t('deforestation.container_type')" item-text="name"
                                    item-value="value" dense outlined style="margin-left: -1px"
                                    class="select-duration"></v-autocomplete>
                            </v-col>

                            <v-col sm="3">
                                <div class="szi d-flex justify-space-between">
                                    <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">
                                        {{ $t('deforestation.container_size') }}
                                        <v-tooltip top color="00BD73" max-width="350">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                                mdi-alert-circle
                                                </v-icon>
                                            </template>
                                            <span>{{ $t("deforestation.container_size_info") }}</span>
                                        </v-tooltip>
                                    </label>
                                    
                                    <label> ft </label>
                                </div>
                                <v-text-field dense v-model="shipment.containerSize"
                                    :rules="shipmentRules.containerSize" required
                                    :placeholder="$t('deforestation.container_size')" outlined></v-text-field>
                            </v-col>

                            <v-col sm="3">
                                <div class="szi d-flex justify-space-between">
                                    <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">
                                        {{ $t('deforestation.container_capacity') }}
                                        <v-tooltip top color="00BD73" max-width="350">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                                mdi-alert-circle
                                                </v-icon>
                                            </template>
                                            <span>{{ $t("deforestation.container_capacity_info") }}</span>
                                        </v-tooltip>
                                    </label>
                                    <label>
                                        {{ $t('deforestation.tons') }}
                                    </label>
                                </div>
                                <v-text-field dense v-model="shipment.containerCapacity"
                                    :rules="shipmentRules.containerCapacity" required
                                    :placeholder="$t('deforestation.container_capacity')" outlined></v-text-field>
                            </v-col>
                        </v-row>

                    </v-card-text>
                </v-card>

                <v-card-actions class="mt-10">
                    <v-spacer></v-spacer>
                    <div class="d-flex mt-1">
                        <v-btn color="primary" outlined class="mr-2" @click="redirectListPage">
                            {{ $t('deforestation.cancel') }}
                        </v-btn>
                        <v-btn color="primary" dark class="mr-2" @click="triggerShipmentCreate">
                            {{ $t('deforestation.createShipment') }}
                        </v-btn>
                    </div>
                </v-card-actions>

            </v-form>
        </v-container>
        <ShipmentCreateConfirmModal @closeShipmentModal="handleConfirmationDialog" :dialog="openConfirmationDialog"
            @closeSignatureModel="openConfirmationDialog = false"> </ShipmentCreateConfirmModal>
    </div>
</template>

<script>
import DownloadMixin from "@/mixins/DownloadMixin";
import loadingMixin from "@/mixins/LoadingMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import DeforestationService from '@/_services/DeforestationService'
import ShipmentCreateConfirmModal from './ShipmentCreateConfirmModal.vue'
import DueDiligenceReportTable from './components/DueDiligenceReportTable.vue'

export default {
    computed: {
        getCurrentUser() {
            return this.$store.getters.getUser
        },
    },
    mounted() {
        this.loading = false;
        // const exporter = JSON.parse(localStorage.getItem('user'))
        const exporter = this.$store.getters.getUser
        if(exporter){
            this.shipment.exporter = exporter.firstName + ' ' + exporter.middleName  + ' ' + exporter.lastName
        }
    },
    created() {

    },
    watch: {
        tableOptions: {
            async handler() {

            },
            deep: true,
        },
    },
    components: {
        ShipmentCreateConfirmModal,
        DueDiligenceReportTable
    },
    methods: {
        redirectListPage() {
            this.$router.push({
                name: "Shipment",
            })
        },
        handleConfirmationDialog(payload) {
            console.log(payload)
            this.openConfirmationDialog = false
        },
        formatDateIntoIso(dt) {
            if (!dt) return ''
            return `${dt}T00:00:00.000Z`
        },
        createShipment() {
            if (!this.$refs.createShipment.validate()) return
            if (!this.shipment.due_deligence_report_ids.length) {
                this.$notify({

                    title: this.$t("pleaseSelectAtLeastOneDueDeligenceReport"),
                    type: "error",
                });
                return
            }
            const payload = {
                "exporter": this.shipment.exporter || null,
                "importer": this.shipment.importer || null,
                "shipment_refrence_number": this.shipment.shipmentRefrenceNumber || null,
                "ownership_type": this.shipment.ownershipType || null,
                "buyer": this.shipment.buyer || null,
                "part_of_origin": this.shipment.partOfOrigin || null,
                "part_of_destination": this.shipment.partOfDestination || null,
                "shipping_line": this.shipment.shippingLine || null,
                "expected_arrival_date": this.shipment.expectedArrivalDate || null,
                "container_id": this.shipment.containerId || null,
                "container_type": this.shipment.containerType || null,
                "container_size": this.shipment.containerSize ? parseFloat(this.shipment.containerSize) : null,
                "container_capacity": this.shipment.containerCapacity ? parseFloat(this.shipment.containerCapacity) : null,
                shipment_stops: this.shipment.stops.length ? this.shipment.stops : [],
                due_deligence_report_ids: this.shipment.due_deligence_report_ids,
                "organization_id": this.getCurrentUser.user_organization.id
            }
            this.startLoading()
            DeforestationService.createShipment(payload).then(res => {
                this.openConfirmationDialog = true
                this.$refs.createShipment.reset()
                console.log(res)
                this.stopLoading()
            }).catch(err => {
                this.stopLoading()
                console.log(err)
            })
        },

        triggerShipmentCreate() {
            this.createShipment()
        },

        handleCheckboxChange(payload) {
            this.shipment.due_deligence_report_ids = payload
        },

        handleStopAdd() {
            this.shipment.stops.push({
                title: ''
            })
        },

        handleClose(key) {
            this.shipment.stops.splice(key, 1)
        },

        selectItem(item) {
            this.selectedItem = item;
        },
        searchQuery() {

        },
        resetSearchOnEmpty() {
            this.search = ''
            this.options = {
                page: 1,
                limit: 10
            }
        },
        pageChange(t) {
            if (t) this.options.page = this.options.page + 1;
            else this.options.page = this.options.page - 1;
        },

    },
    data() {
        return {
            ownershipTypes: [
                { name: this.$t("ownershipTypes.EXW"), value: "EXW (Ex Works)" },
                { name: this.$t("ownershipTypes.FCA"), value: "FCA (Free Carrier)" },
                { name: this.$t("ownershipTypes.CPT"), value: "CPT (Carriage Paid To)" },
                { name: this.$t("ownershipTypes.CIP"), value: "CIP (Carriage and Insurance Paid To)" },
                { name: this.$t("ownershipTypes.DAP"), value: "DAP (Delivered at Place)" },
                { name: this.$t("ownershipTypes.DPU"), value: "DPU (Delivered at Place Unloaded)" },
                { name: this.$t("ownershipTypes.DDP"), value: "DDP (Delivered Duty Paid)" },
                { name: this.$t("ownershipTypes.FAS"), value: "FAS (Free Alongside Ship)" },
                { name: this.$t("ownershipTypes.FOB"), value: "FOB (Free on Board)" },
                { name: this.$t("ownershipTypes.CFR"), value: "CFR (Cost and Freight)" },
                { name: this.$t("ownershipTypes.CIF"), value: "CIF (Cost, Insurance and Freight)" }
            ],
            containerTypes: [
                { name: this.$t("containerTypes.standardDry"), value: "Standard Dry Container (20ft, 40ft)" },
                { name: this.$t("containerTypes.highCube"), value: "High Cube Container" },
                { name: this.$t("containerTypes.openTop"), value: "Open Top Container" },
                { name: this.$t("containerTypes.flatRack"), value: "Flat Rack Container" },
                { name: this.$t("containerTypes.refrigerated"), value: "Refrigerated Container (Reefer)" },
                { name: this.$t("containerTypes.tank"), value: "Tank Container" },
                { name: this.$t("containerTypes.ventilated"), value: "Ventilated Container" },
                { name: this.$t("containerTypes.insulated"), value: "Insulated Container" },
                { name: this.$t("containerTypes.platform"), value: "Platform Container" },
                { name: this.$t("containerTypes.halfHeight"), value: "Half-Height Container" },
                { name: this.$t("containerTypes.bulk"), value: "Bulk Container" }
            ],
            openConfirmationDialog: false,
            expectedArrivalDate: false,
            loading: false,
            tab: 0,
            selectedItem: false,
            options: {
                itemsPerPage: 10,
                page: 1
            },
            search: "",
            from: 0,
            to: 0,
            breadcrumbs: [
                {
                    text: this.$t("dashboard"),
                    disabled: true,
                    to: "/",
                },
                {
                    text: this.$t("dueDiligence.shipments"),
                    disabled: true,
                    to: "breadcrumbs_link_1",
                },
                {
                    text: this.$t("dueDiligence.createShipment"),
                    disabled: true,
                    to: "breadcrumbs_link_1",
                },
            ],
            shipment: {
                exporter: '',
                importer: '',
                shipmentRefrenceNumber: '',
                ownershipType: '',
                buyer: '',

                partOfOrigin: '',
                partOfDestination: '',
                stops: [{
                    title: ''
                }],

                shippingLine: '',

                expectedArrivalDate: '',
                containerId: '',
                containerType: '',
                containerCapacity: '',
                containerSize: '',
                due_deligence_report_ids: []
            },
            shipmentRules: {
                exporter: [
                    (v) => !!v || this.$t('validation.exporterRequired'),
                ],
                importer: [
                    (v) => !!v || this.$t('validation.importerRequired'),
                ],
                shipmentRefrenceNumber: [],
                ownershipType: [],
                partOfOrigin: [
                    (v) => !!v || this.$t('validation.portOfOriginRequired'),
                ],
                buyer: [],
                partOfDestination: [],
                shippingLine: [],
                expectedArrivalDate: [],
                containerId: [],
                containerType: [],
                containerSize: [
                    (v) => v === null || v === '' || !!(!isNaN(parseFloat(v)) && isFinite(v)) || this.$t('validation.containerSizeNumber'),
                ],
                containerCapacity: [
                    (v) => v === null || v === '' || !!(!isNaN(parseFloat(v)) && isFinite(v)) || this.$t('validation.containerCapacityNumber'),
                ]
            },
            headers: [
                {
                    text: 'EUDR Reference No.',
                    align: "start",
                    value: "farmerName",
                    class: "black--text",
                    sortable: false,
                },
                {
                    text: 'Internal Reference No.',
                    align: "start",
                    value: "farmName",
                    class: "black--text",
                },

                {
                    text: 'Activity',
                    align: "start",
                    value: "farmLocation",
                    class: "black--text",
                    sortable: false
                },
                {
                    text: 'Product',
                    align: "start",
                    value: "area",
                    class: "black--text",
                    sortable: false,
                },
                {
                    text: 'No. of Farms',
                    align: "start",
                    value: "dateOfRequest",
                    class: "black--text",
                    sortable: false,
                },
                {
                    text: 'Quantity',
                    align: "start",
                    value: "dateOfRequest",
                    class: "black--text",
                    sortable: false,
                },
                {
                    text: 'Submission Date',
                    align: "start",
                    value: "dateOfRequest",
                    class: "black--text",
                    sortable: false,
                },
                {
                    text: 'Status',
                    align: "start",
                    value: "dateOfRequest",
                    class: "black--text",
                    sortable: false,
                },
                {
                    text: '',
                    align: "center",
                    value: "status",
                    class: "black--text",
                    sortable: false,
                },
            ],
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

.img-item {
    margin-left: 1px;
    max-height: 150px;
    border: 1px solid #ddd;
    position: relative;
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
    height: 150px;
    position: relative;
    border: 2px dashed #97A8B8;
}

.additional-logos-form {
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
    // border-radius: 10px;
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

.primary-color {
    color: #00BD73;
}

.gray-color {
    background: #DCDCDC80;
}

// ::v-deep .v-data-table-header {
//     background-color: #FFB443 !important;
//     color: #1E1E1E;
// }

// ::v-deep .v-data-table-header span {
//     color: #1E1E1E !important;
// }
</style>