<template>
    <div>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <v-form ref="addReportForm" v-model="addReportFormValid" lazy-validation @submit.prevent="submitForm">
                <div class="d-flex mb-8">
                    <h2>{{ id ? $t('blends.exemptProducts.updateEUDRExemptProduct') :
                        $t('blends.exemptProducts.addEUDRExemptProduct') }}</h2>
                    <v-spacer></v-spacer>
                    <div class="d-flex mt-1">
                        <v-btn color="primary" outlined dark class="mr-2" @click="resetForm">
                            {{ $t("cancel") }}
                        </v-btn>
                        <v-btn color="primary" dark class="mr-2" type="submit">
                            {{ id ? $t("blends.exemptProducts.updateProduct") : $t("blends.exemptProducts.addProduct")
                            }}
                        </v-btn>
                    </div>
                </div>

                <div elevation="0" class="px-5 mt-4">
                    <v-card elevation="0" class="px-5">
                        <v-card-text>
                            <v-row class="mt-5">
                                <v-col cols="4">
                                    <h3 class="mb-5">
                                        {{ $t("blends.exemptProducts.supplierInformation") }}
                                        <v-tooltip bottom color="00BD73" max-width="500">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon class="icon-with-background primary--text" style="color:#0EBF67"
                                                    v-bind="attrs" v-on="on">
                                                    mdi-alert-circle
                                                </v-icon>
                                            </template>
                                            <p>
                                                {{ $t("dueDiligence.supplierInformationTT") }}
                                            </p>
                                        </v-tooltip>
                                    </h3>

                                    <label for="text">
                                        {{ $t("blends.exemptProducts.supplier") }}
                                    </label>
                                    <v-tooltip bottom color="00BD73" max-width="500">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon class="icon-with-background primary--text" small style="color:#0EBF67"
                                                v-bind="attrs" v-on="on">
                                                mdi-alert-circle
                                            </v-icon>
                                        </template>
                                        <span>{{ $t("dueDiligence.supplierTooltip") }}</span>
                                    </v-tooltip>
                                    <v-autocomplete :rules="[requiredRule]" outlined v-model="supplier"
                                        item-text="fullName" item-value="id" :items="formattedSupplier"
                                        variant="outlined" dense return-object :placeholder="$t('select')" clearable>
                                        <!-- Add a footer slot -->
                                        <template v-slot:append-item>
                                            <div class="add-supplier">
                                                <v-divider></v-divider>
                                                <v-list-item @click="addNewSupplierDialog = true">
                                                    <v-list-item-content style="color:#0EBF67">
                                                        <v-list-item-title>
                                                            <v-icon class="icon-with-background primary--text" style="color:#0EBF67">
                                                                mdi-plus-circle
                                                            </v-icon>
                                                            <span class="ml-5">{{
                                                                $t('blends.exemptProducts.addNewSupplier')
                                                                }}</span>
                                                        </v-list-item-title>
                                                    </v-list-item-content>
                                                </v-list-item>
                                            </div>
                                        </template>
                                    </v-autocomplete>
                                </v-col>
                                <v-col cols="8"> </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="2">
                                    {{ $t("blends.exemptProducts.name") }}
                                    <h3 style="color:black">{{ supplier?.fullName }}</h3>
                                </v-col>
                                <v-col cols="2">
                                    {{ $t("blends.exemptProducts.email") }}
                                    <h3 style="color:black">{{ supplier?.email }}</h3>
                                </v-col>
                                <v-col cols="2">
                                    {{ $t("blends.exemptProducts.phoneNumber") }}
                                    <h3 style="color:black">{{ supplier?.mobile }}</h3>
                                </v-col>
                                <v-col cols="2">
                                    {{ $t("blends.exemptProducts.country") }}
                                    <h3 style="color:black">{{ supplier?.countryId }}</h3>
                                </v-col>
                                <v-col cols="2">
                                    {{ $t("blends.exemptProducts.status") }}
                                    <h3 style="color:black" v-if="
                                        supplier &&
                                        typeof supplier.verified !== 'undefined'
                                    ">
                                        {{
                                        supplier.verified == 0
                                        ? "Unregistered"
                                        : "Registered"
                                        }}
                                    </h3>
                                    <h3 style="color:black" v-else></h3>
                                </v-col>
                            </v-row>

                            <v-divider class="mt-5 mb-5"></v-divider>
                        </v-card-text>
                    </v-card>

                    <v-card elevation="0" class="px-5 py-5 mt-7">
                        <v-card-text>
                            <template>
                                <v-row>
                                    <v-col cols="12" sm="6" md="4">
                                        <h3 style="color:black">
                                            {{ $t("blends.exemptProducts.internalRefNo") }}
                                            <v-tooltip top color="00BD73" max-width="350">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-icon class="icon-with-background primary--text" style="color:#0EBF67"
                                                        v-bind="attrs" v-on="on">
                                                        mdi-alert-circle
                                                    </v-icon>
                                                </template>
                                                <span>{{ $t("dueDiligence.internalRefNoTooltip") }}</span>
                                            </v-tooltip>
                                        </h3>
                                        <v-text-field :rules="[requiredRule]"
                                            :placeholder="$t('blends.exemptProducts.internalRefNo')"
                                            v-model="productPayload.internalReferenceNumber" outlined
                                            dense></v-text-field>
                                    </v-col>
                                </v-row>

                                <v-divider class="mt-5 mb-5"></v-divider>
                                <v-row class="">
                                    <v-col cols="12">
                                        <h3 style="color:black">{{ $t("blends.exemptProducts.activity") }}</h3>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-radio-group :rules="[requiredRule]" v-model="productPayload.activity" row>
                                            <v-radio :label="$t('dueDiligence.domestic')" value="Domestic"></v-radio>
                                            <v-radio :label="$t('dueDiligence.import')" value="Import"></v-radio>
                                            <v-radio :label="$t('dueDiligence.export')" value="Export"></v-radio>
                                        </v-radio-group>
                                    </v-col>
                                </v-row>

                                <v-divider class="mt-5 mb-5"></v-divider>
                                <v-row class="">
                                    <v-col cols="12">
                                        <h3 style="color:black">
                                            {{ $t("blends.createBlends.placeOfActivity") }}
                                            <v-tooltip top color="00BD73" max-width="350">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-icon class="icon-with-background primary--text" style="color:#0EBF67"
                                                        v-bind="attrs" v-on="on">
                                                        mdi-alert-circle
                                                    </v-icon>
                                                </template>
                                                <span>{{ $t("dueDiligence.placeOfActivityTooltip") }}</span>
                                            </v-tooltip>
                                        </h3>
                                    </v-col>

                                    <v-col cols="4">
                                        <label for="text">
                                            {{ $t("blends.createBlends.countryOfActivity") }}
                                        </label>
                                        <v-autocomplete :rules="[requiredRule]"
                                            :label="$t('profileSetting.selectCountry')"
                                            :placeholder="$t('profileSetting.selectCountry')" clearable outlined
                                            v-model="productPayload.countryOfActivity" :items="europeanCountriesOnly"
                                            item-text="name" item-value="name" cache-items :search-input.sync="search"
                                            dense chips small-chips solo flat multiple>
                                        </v-autocomplete>
                                    </v-col>
                                    <v-col cols="4">
                                        <label for="text">
                                            {{ $t("blends.exemptProducts.countryOfEntry") }}
                                        </label>
                                        <v-autocomplete :rules="[requiredRule]"
                                            :label="$t('profileSetting.selectCountry')"
                                            :placeholder="$t('profileSetting.selectCountry')" outlined
                                            v-model="productPayload.countryOfEntry" :items="europeanCountriesOnly"
                                            item-text="name" item-value="name" dense solo flat clearable>
                                        </v-autocomplete>
                                    </v-col>
                                </v-row>

                                <v-divider class="mt-5 mb-5"></v-divider>
                                <v-row class="">
                                    <v-col cols="12">
                                        <h3 style="color:black">
                                            {{ $t("blends.exemptProducts.productDetail") }}
                                            <v-tooltip top color="00BD73" max-width="350">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-icon class="icon-with-background primary--text" style="color:#0EBF67"
                                                        v-bind="attrs" v-on="on">
                                                        mdi-alert-circle
                                                    </v-icon>
                                                </template>
                                                <span>{{ $t("dueDiligence.productDetailToolTip") }}</span>
                                            </v-tooltip>
                                        </h3>
                                    </v-col>

                                    <v-col cols="3">
                                        <label for="text">
                                            {{ $t("blends.exemptProducts.product") }}
                                        </label>
                                        <v-tooltip top color="00BD73" max-width="350">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon small class="icon-with-background primary--text" style="color:#0EBF67"
                                                    v-bind="attrs" v-on="on">
                                                    mdi-alert-circle
                                                </v-icon>
                                            </template>
                                            <span>{{ $t("dueDiligence.productToolTip") }}</span>
                                        </v-tooltip>
                                        <v-autocomplete @change="getSubProductLists" :rules="[requiredRule]"
                                            :placeholder="$t('dueDiligence.selectProduct')" outlined
                                            v-model="productPayload.product" :items="productList" item-text="name"
                                            item-value="id" dense solo flat return-object clearable>
                                        </v-autocomplete>
                                    </v-col>
                                    <v-col cols="3">
                                        <label for="text">
                                            {{ $t("blends.exemptProducts.subProduct") }}
                                        </label>
                                        <v-tooltip top color="00BD73" max-width="350">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon small class="icon-with-background primary--text" style="color:#0EBF67"
                                                    v-bind="attrs" v-on="on">
                                                    mdi-alert-circle
                                                </v-icon>
                                            </template>
                                            <span>{{ $t("dueDiligence.subProductToolTip") }}</span>
                                        </v-tooltip>
                                        <v-autocomplete :placeholder="$t('dueDiligence.selectSubProduct')" outlined
                                            v-model="productPayload.subProduct" :items="subProductList" item-text="name"
                                            item-value="id" dense solo flat return-object :rules="[requiredRule]"
                                            :loading="loading" clearable>
                                        </v-autocomplete>
                                    </v-col>
                                    <v-col cols="3">
                                        <div class="d-flex justify-space-between">
                                            <div>

                                                <label for="text">
                                                    {{ $t("blends.exemptProducts.netMass") }}
                                                </label>
                                                <v-tooltip top color="00BD73" max-width="350">
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-icon small class="icon-with-background primary--text" style="color:#0EBF67"
                                                            v-bind="attrs" v-on="on">
                                                            mdi-alert-circle
                                                        </v-icon>
                                                    </template>
                                                    <span>{{ $t("dueDiligence.netMassTooltTip") }}</span>
                                                </v-tooltip>
                                            </div>
                                            <span class="text-subtitle-2 font-weight-light">{{
                                                eudrSettings.product_mass_unit }}</span>
                                        </div>
                                        <v-text-field :placeholder="$t('blends.createBlends.enterHere')"
                                            v-model="productPayload.productNetMass" outlined dense
                                            :rules="[netMassVolumeRule()]" type="number" step="0.01" hide-details="auto"
                                            class="input-field"></v-text-field>
                                    </v-col>
                                    <v-col cols="3">
                                        <div class="d-flex justify-space-between">
                                            <div>
                                                <label for="text">
                                                    {{ $t("blends.exemptProducts.volume") }}
                                                </label>

                                                <v-tooltip top color="00BD73" max-width="350">
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-icon small class="icon-with-background primary--text" style="color:#0EBF67"
                                                            v-bind="attrs" v-on="on">
                                                            mdi-alert-circle
                                                        </v-icon>
                                                    </template>
                                                    <span>{{ $t("dueDiligence.volumeToolTip") }}</span>
                                                </v-tooltip>
                                            </div>
                                            <span class="text-subtitle-2 font-weight-light">{{ eudrSettings.volume_unit
                                                }}</span>
                                        </div>
                                        <v-text-field :rules="[netMassVolumeRule()]"
                                            :placeholder="$t('blends.createBlends.enterHere')"
                                            v-model="productPayload.productVolume" outlined dense></v-text-field>
                                    </v-col>
                                    <v-col cols="3">
                                        <label for="text">
                                            {{ $t("blends.exemptProducts.selectDate") }}
                                        </label>
                                        <v-tooltip top color="00BD73" max-width="350">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon small class="icon-with-background primary--text" style="color:#0EBF67"
                                                    v-bind="attrs" v-on="on">
                                                    mdi-alert-circle
                                                </v-icon>
                                            </template>
                                            <span>{{ $t("blends.exemptProducts.selectDate") }}</span>
                                        </v-tooltip>
                                        <v-menu v-model="productDateMenu" :close-on-content-click="false"
                                            :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field :rules="[requiredRule]" append-icon="mdi-calendar"
                                                    outlined dense readonly v-bind="attrs" v-on="on"
                                                    v-on:click:append="productDateMenu = true"
                                                    v-model="formattedProductDate"
                                                    placeholder="Select Date"></v-text-field>
                                            </template>
                                            <v-date-picker v-model="productPayload.productDate" no-title
                                                @input="productDateMenu = false">
                                            </v-date-picker>
                                        </v-menu>
                                    </v-col>
                                </v-row>
                                <v-row align="center" class="mb-4">
                                    <v-col cols="12">
                                        <h3 style="color:black">
                                            {{ $t('blends.exemptProducts.containerInformation') }}
                                            <v-tooltip top color="00BD73" max-width="350">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-icon class="icon-with-background primary--text" style="color:#0EBF67"
                                                        v-bind="attrs" v-on="on">
                                                        mdi-alert-circle
                                                    </v-icon>
                                                </template>
                                                <span>{{ $t("blends.exemptProducts.containerIDTT") }}</span>
                                            </v-tooltip>
                                        </h3>
                                    </v-col>
                                </v-row>

                                <v-row v-for="(container, index) in containers" :key="index">
                                    <v-col cols="3">
                                        <label for="text">
                                            {{ $t("blends.exemptProducts.containerID") }}
                                        </label>
                                        <v-text-field v-model="container.id"
                                            :placeholder="$t('blends.exemptProducts.containerID')" outlined dense
                                            :rules="[optionalContainerIdRule]" />
                                    </v-col>
                                    <v-col cols="3" v-if="index !== 0">
                                        <v-icon color="red" class="mt-8"
                                            @click="removeContainer(index)">mdi-close-circle</v-icon>
                                    </v-col>
                                </v-row>

                                <v-btn color="primary" text @click="addContainer">
                                    <v-icon left>mdi-plus-circle</v-icon>
                                    {{ $t("blends.exemptProducts.addContainer") }}
                                </v-btn>
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
                                    {{ id ? $t("blends.exemptProducts.updateProduct") :
                                    $t("blends.exemptProducts.addProduct") }}
                                </v-btn>
                            </div>
                        </v-card-text>
                    </v-card>
                </div>
            </v-form>
        </v-container>
        <!-- ADD SUPPLIER DIALOG -->
        <AddNewSupplier v-if="addNewSupplierDialog" :dialogI="addNewSupplierDialog"
            @supplierAdded="handleSupplierCreate" @closeModal="addNewSupplierDialog = false" />
    </div>
</template>
<script>
import BlendService from "@/_services/BlendService";
import DeforestationService from "@/_services/DeforestationService";
import AddNewSupplier from './components/AddNewSupplier.vue';
// import { getCountries } from "country-state-picker";
import { mapGetters } from 'vuex';
import UnitService from "@/_services/UnitService";
import loadingMixin from "@/mixins/LoadingMixin";
import dateMixin from "@/mixins/DateMixin";
import moment from "moment";
import { getEuropeanCountries } from "@/constants/countries";

export default {
    props: ["id"],
    async mounted() {
        await this.getSupplierOrOperatorList(this.operatorId, "supplier");
        if (this.id) {
            await this.fetchExemptData();
        }
        await this.fetchCountries();
        await this.getProductList();

        // prefilled the values
        const previewData = this.$store.state?.blends?.exemptProductData;
        if (previewData) {
            this.supplier = previewData.supplier;
            this.containers = previewData.containerIds;
            this.productPayload = previewData;
        }
    },
    components: {
        AddNewSupplier
    },
    computed: {
        formattedProductDate: {
            get() {
                return this.productPayload.productDate
                    ? moment(this.productPayload.productDate).format("DD-MMM-YYYY")
                    : "";
            },
            set(value) {
                this.productPayload.productDate = value ? moment(value).toISOString() : null;
            },
        },
        formattedSupplier() {
            return this.supplierList.map((person) => ({
                ...person,
                fullName: person.lastName ? `${person.firstName} ${person.lastName}` : person.firstName,
            }));
        },
        requiredNumericRule() {
            return (v) => {
                if (v === null || v === undefined || v === '') {
                    return this.$t('blends.exemptProducts.thisFieldIsRequired');
                }
                const numberRegex = /^[+-]?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?$/;
                return numberRegex.test(v) || this.$t('blends.exemptProducts.invalidNumericValue');
            };
        },
        requiredRule() {
            return (v) => {
                if (!v || (typeof v === 'object' && Object.keys(v).length === 0)) {
                    return this.$t('blends.exemptProducts.thisFieldIsRequired');
                }
                if (Array.isArray(v)) {
                    return v.length > 0 || this.$t('blends.exemptProducts.thisFieldIsRequired');
                }
                if (typeof v === 'string') {
                    return v.trim() !== '' || this.$t('blends.exemptProducts.thisFieldIsRequired');
                }
                return v ? true : this.$t('blends.exemptProducts.thisFieldIsRequired');
            };
        },
        ...mapGetters("eudrSettings", ["get_EUDR_Settings"]),
        eudrSettings() {
            return this.get_EUDR_Settings;
        },
        netMassVolumeRule() {
            return () => {
                return (value) => {
                    const netMass = this.productPayload.productNetMass;
                    const volume = this.productPayload.productVolume;

                    if (!netMass && !volume) {
                        return this.$t("blends.validationMessage.requiredMessage");
                    }

                    if (value === netMass || value === volume) {
                        if (value < 0) {
                            return this.$t("blends.validationMessage.noNegativeNumbers");
                        }
                    }

                    return true;
                };
            };
        },
         optionalContainerIdRule() {
            return (v) => {
                if (!v) return true;
            };
        },
    },
    watch: {
        supplier(newValue) {
            this.productPayload.supplierId = newValue ? Number(newValue?.id) : null;
        },
        'productPayload.product': {
            handler() {
                this.getSubProductLists();
            },
            immediate: false,
        }
    },
    data() {
        return {
            loading: false,
            supplierOperatorLoading: false,
            search: '',
            productList: [],
            subProductList: [],
            europeanCountriesOnly: [],
            filterDateCustom: [],
            customFilterMenu: false,
            containers: [
                { id: '' },
            ],
            addNewSupplierDialog: false,
            addReportFormValid: false,
            supplier: {
            },
            productPayload: {
                supplierId: "",
                internalReferenceNumber: "",
                activity: "Domestic",
                countryOfEntry: "",
                countryOfActivity: [],
                product: "",
                subProduct: "",
                productNetMass: "",
                productVolume: "",
                productDate: "",
            },
            supplierList: [],
            breadcrumbs: [
                {
                    text: this.$t("blends.eudrDueDiligence"),
                    disabled: false,
                    exact: true,
                },
                {
                    text: this.$t("blends.exemptProducts.eudrExemptProducts"),
                    disabled: false,
                    to: { name: "EUDRExemptProducts" },
                    exact: true,
                },
                {
                    text: this.$t("blends.exemptProducts.addEUDRExemptProduct"),
                    disabled: true,
                    href: "breadcrumbs_link_1",
                },
            ],
            productDateMenu: false,
        }
    },
    methods: {
        async fetchExemptData() {
            this.startLoading();
            try {
                const { data } = await BlendService.getExemptProductById(this.id);
                if (data?.exemptProduct) {
                    const exemptProduct = data?.exemptProduct;

                    this.productPayload = {
                        supplierId: exemptProduct.supplier ? exemptProduct.supplier.id : "",
                        internalReferenceNumber: exemptProduct.internalReferenceNumber || "",
                        activity: exemptProduct.activity || "Domestic",
                        countryOfEntry: exemptProduct.countryOfEntry || "",
                        countryOfActivity: Array.isArray(exemptProduct.countryOfActivity)
                            ? exemptProduct.countryOfActivity
                            : [],
                        product: exemptProduct.productDetail || "",
                        subProduct: exemptProduct.subProductDetail || "",
                        productNetMass: UnitService.fromBase.weight(
                            this.eudrSettings.product_mass_unit,
                            exemptProduct.productNetMass
                        ),
                        productVolume: UnitService.fromBase.volume(
                            this.eudrSettings.volume_unit,
                            exemptProduct.productVolume
                        ),
                        productDate: exemptProduct.productDate || "",
                    };

                    this.containers = exemptProduct.containerIds?.map(item => {
                        return {
                            id: item.containerId
                        }
                    });

                    this.supplier = this.supplierList.find(item => item.id == exemptProduct.supplier.id);
                }
            }
            catch (error) {
                this.$notify({
                    title: this.$t("blends.exemptProducts.unExpectedErrorMsg"),
                    type: "error",
                });
            } finally {
                this.stopLoading();
            }
        },

        submitForm() {
            if (this.$refs.addReportForm.validate()) {
                this.saveFormData();
            }else {
                this.$notify({
                    title: this.$t("blends.blendSettings.pleaseFillRequiredFields"),
                    type: "error",
                });
            }
        },
        resetForm() {
            this.$refs.addReportForm.reset();
            this.$refs.addReportForm.resetValidation();
            this.$router.push({ name: "EUDRExemptProducts" });   
        },
        saveFormData() {
            let payload = {
                ...this.productPayload,
                countryOfActivity: this.productPayload.countryOfActivity?.filter(x => x) || [],
                containerIds: this.containers,
                supplier: this.supplier
            };

            if (this.id) {
                payload.id = Number(this.id);
            }

            // save data into vuex and navigate to view page;
            this.$store.dispatch('saveExemptProductData',payload);
            this.$router.push({ name: "ViewEUDRExemptProduct" });          

        },
        handleSupplierCreate({ success, data }) {
            this.addNewSupplierDialog = false;
            if (success) {
                this.getSupplierOrOperatorList(data.id, "supplier");
            }
        },
        async getProductList() {
            BlendService.getProducts({hasSubproducts: true})
                .then((res) => {
                    const productList = res.data.manageProduct.rows;
                    this.productList = productList;
                })
                .catch((err) => {
                    console.log("Error in product listing", err);
                });
        },

        async getSubProductLists() {
            this.loading = true;
            const payLoad = {
                productId: Number(this.productPayload?.product?.id)
            }
            await BlendService.getSubProduct(payLoad).then((res) => {
                this.loading = false;
                if (res?.data?.manageSubProduct) {
                    this.subProductList = res.data.manageSubProduct?.rows || []
                }
            })
                .catch((err) => {
                    this.loading = false;
                    console.error("Error", err);
                });
        },

        fetchCountries() {
            this.europeanCountriesOnly = [...getEuropeanCountries()];
        },
        async getSupplierOrOperatorList(id = null, role = "supplier") {
            this.supplierOperatorLoading = true;
            try {
                const res = await DeforestationService.getSupplierList(role);
                const dataList = res.data.findAllSuppliersOrOperators.map((ss) => ({
                    ...ss,
                    fullName: `${ss.firstName} ${ss.lastName}`,
                }));

                if (role === "supplier") {
                    this.supplierList = dataList;
                    if (id) {
                        this.supplier = dataList.find(
                            (supp) => supp.cf_userid === id
                        );
                    }
                }
            } catch (err) {
                console.error("Error", err);
            } finally {
                this.supplierOperatorLoading = false;
            }
        },
        customFilter() {

        },
        addContainer() {
            this.containers.push({ id: '' });
        },
        removeContainer(index) {
            this.containers.splice(index, 1);
        },
    },
    mixins: [loadingMixin, dateMixin]
}
</script>
<style lang="scss" scoped>
.add-supplier {
    position: sticky;
    bottom: 0;
    background: #FFF;
    padding: 6px;
}
</style>
