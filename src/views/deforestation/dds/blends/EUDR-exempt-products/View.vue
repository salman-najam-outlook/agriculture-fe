<template>
    <div>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <div class="d-flex mb-8">
                <h2>{{ $t('blends.exemptProducts.eudrExemptProducts') }}</h2>
                <v-spacer></v-spacer>
                <div class="d-flex mt-1">
                    <v-btn color="primary" outlined dark class="mr-2"
                        @click="$router.push({ name: 'AddEUDRExemptProduct', params: { id: exemptProductId } })">
                        {{ $t("edit") }}
                    </v-btn>
                    <v-btn v-if="previewData" color="primary" dark class="mr-2" @click="handleSubmitData()">
                        {{ $t("confirm") }}
                    </v-btn>
                </div>
            </div>

            <v-card elevation="0" class="px-5 mt-4">
                <v-card elevation="0" class="px-5">
                    <v-card-text>
                        <v-row class="mt-5">
                            <v-col cols="4">
                                <h3 class="mb-5">
                                    {{ $t("blends.exemptProducts.supplierInformation") }}

                                    <v-tooltip bottom color="00BD73" max-width="500">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                                                v-on="on">
                                                mdi-alert-circle
                                            </v-icon>
                                        </template>
                                        <p>
                                            {{ $t("dueDiligence.supplierInformationTT") }}
                                        </p>
                                    </v-tooltip>
                                </h3>
                            </v-col>
                            <v-col cols="8"> </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="2">
                                {{ $t("blends.exemptProducts.name") }}
                                <h3 style="color:black">

                                    {{ `${exemptProduct?.supplier?.firstName || 'N/A'} ${exemptProduct?.supplier?.lastName || ''}` }}
                                </h3>
                            </v-col>
                            <v-col cols="2">
                                {{ $t("blends.exemptProducts.email") }}
                                <h3 style="color:black">{{ exemptProduct?.supplier?.email || 'N/A' }}</h3>
                            </v-col>
                            <v-col cols="2">
                                {{ $t("blends.exemptProducts.phoneNumber") }}
                                <h3 style="color:black">{{ exemptProduct?.supplier?.mobile || 'N/A' }}</h3>
                            </v-col>
                            <v-col cols="2">
                                {{ $t("blends.exemptProducts.country") }}
                                <h3 style="color:black">{{ exemptProduct?.supplier?.countryId || 'N/A' }}</h3>
                            </v-col>
                            <v-col cols="2">
                                {{ $t("blends.exemptProducts.status") }}
                                <h3 style="color:black" v-if="
                                    exemptProduct.supplier &&
                                    typeof exemptProduct.supplier.verified !== 'undefined'
                                ">
                                    {{
                                        exemptProduct.supplier.verified == 0
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
            </v-card>

            <v-card elevation="0" class="px-5 mt-4">
                <v-card elevation="0" class="px-5">
                    <v-card-text>
                        <v-row>
                            <v-col cols="2">
                                <div class="d-flex">
                                    {{ $t("blends.exemptProducts.internalRefNo") }}
                                    <v-tooltip top color="00BD73" max-width="350">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                                                v-on="on">
                                                mdi-alert-circle
                                            </v-icon>
                                        </template>
                                        <span>{{ $t("dueDiligence.internalRefNoTooltip") }}</span>
                                    </v-tooltip>
                                </div>

                                <h3 style="color:black">{{ exemptProduct?.internalReferenceNumber }}</h3>
                            </v-col>
                            <v-col cols="2">
                                {{ $t("blends.exemptProducts.activity") }}
                                <h3 style="color:black">{{ exemptProduct?.activity }}</h3>
                            </v-col>
                            <v-col cols="2">
                                {{ $t("blends.createBlends.countryOfActivity") }}
                                <h3 style="color:black">{{ exemptProduct.countryOfActivity?.join(', ') }}</h3>
                            </v-col>
                            <v-col cols="2">
                                {{ $t("blends.exemptProducts.countryOfEntry") }}
                                <h3 style="color:black">{{ exemptProduct?.countryOfEntry }}</h3>
                            </v-col>
                        </v-row>
                        <v-row class="mt-5">
                            <v-col cols="4">
                                <h3>
                                    {{ $t("blends.exemptProducts.productDetail") }}

                                    <v-tooltip bottom color="00BD73" max-width="500">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                                                v-on="on">
                                                mdi-alert-circle
                                            </v-icon>
                                        </template>
                                        <p>
                                            {{ $t("dueDiligence.productDetailToolTip") }}
                                        </p>
                                    </v-tooltip>
                                </h3>
                            </v-col>
                            <v-col cols="8"> </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="2">
                                {{ $t("blends.exemptProducts.product") }}
                                <v-tooltip top color="00BD73" max-width="350">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon small class="icon-with-background primary--text" style="color:#0EBF67"
                                                    v-bind="attrs" v-on="on">
                                                    mdi-alert-circle
                                                </v-icon>
                                            </template>
                                            <span>{{ $t("dueDiligence.productToolTip") }}</span>
                                        </v-tooltip>
                                <h3 style="color:black">{{ exemptProduct?.productDetail?.name }}</h3>
                            </v-col>
                            <v-col cols="2">
                                {{ $t("blends.exemptProducts.subProduct") }}
                                <v-tooltip top color="00BD73" max-width="350">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon small class="icon-with-background primary--text" style="color:#0EBF67"
                                                    v-bind="attrs" v-on="on">
                                                    mdi-alert-circle
                                                </v-icon>
                                            </template>
                                            <span>{{ $t("dueDiligence.subProductToolTip") }}</span>
                                        </v-tooltip>
                                <h3 style="color:black">{{ exemptProduct?.subProductDetail?.name }}</h3>
                            </v-col>
                            <v-col cols="2">
                                <div style="display: flex; align-items: center;">
                                    {{ $t("blends.exemptProducts.netMass") }}
                                    <span class="text-subtitle-2 font-weight-light" style="margin-left: 4px;">
                                        ({{ eudrSettings.product_mass_unit }})
                                    </span>
                                    <v-tooltip top color="00BD73" max-width="350">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon 
                                                small 
                                                class="icon-with-background primary--text" 
                                                style="color:#0EBF67; margin-left: 4px;" 
                                                v-bind="attrs" 
                                                v-on="on"
                                            >
                                                mdi-alert-circle
                                            </v-icon>
                                        </template>
                                        <span>{{ $t("dueDiligence.netMassTooltTip") }}</span>
                                    </v-tooltip>
                                </div>
                                <h3 style="color:black">
                                    {{ exemptProduct?.productNetMass }}
                                </h3>
                            </v-col>
                            <v-col cols="2">
                            <div style="display: flex; align-items: center;">
                                {{ $t("blends.exemptProducts.volume") }}
                                <span class="text-subtitle-2 font-weight-light" style="margin-left: 4px;">
                                    ({{ eudrSettings.volume_unit }})
                                </span>
                                <v-tooltip top color="00BD73" max-width="350">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon 
                                            small 
                                            class="icon-with-background primary--text" 
                                            style="color:#0EBF67; margin-left: 4px;" 
                                            v-bind="attrs" 
                                            v-on="on"
                                        >
                                            mdi-alert-circle
                                        </v-icon>
                                    </template>
                                    <span>{{ $t("dueDiligence.volumeToolTip") }}</span>
                                </v-tooltip>
                            </div>
                            <h3 style="color:black">
                                {{ exemptProduct?.productVolume }}
                            </h3>
                        </v-col>

                        </v-row>

                        <v-row>
                            <v-col cols="2">
                                {{ $t("blends.exemptProducts.containerID") }}

                                <div class="d-flex">
                                    <h3 style="color:black" class="mr-3"
                                        v-for="containerId in exemptProduct.containerIds"
                                        v-bind:key="containerId.containerId">{{ containerId?.containerId }}</h3>
                                </div>
                            </v-col>
                        </v-row>

                        <v-divider class="mt-5 mb-5"></v-divider>
                    </v-card-text>
                </v-card>
            </v-card>

        </v-container>
    </div>
</template>
<script>
import BlendService from "@/_services/BlendService";
import loadingMixin from "@/mixins/LoadingMixin";
import UnitService from "@/_services/UnitService";
import { mapGetters } from 'vuex';


export default {
    data() {
        return {
            previewData: null,
            exemptProductId: this.$route.params.id || null,
            exemptProduct: {
                internalReferenceNumber: null,
                productDetail: null,
                subProductDetail: null,
                productNetMass: null,
                productDate: null,
                supplier: {
                    fullName: null,
                    email: null,
                    mobile: null,
                    verified: 0
                },
                containerIds: []
            },
            breadcrumbs: [
                {
                    text: this.$t("dashboard"),
                    disabled: false,
                    exact: true,
                },
                {
                    text: this.$t("blends.exemptProducts.eudrExemptProducts"),
                    disabled: true,
                    href: "breadcrumbs_link_1",
                },
            ],

        }
    },
    async mounted() {
        if (!this.exemptProductId) {
            const previewData = this.$store.state?.blends?.exemptProductData;
            if (previewData) {
                const newContainerIds = previewData?.containerIds?.map((item) => {
                    return {
                        containerId: item.id
                    }
                })
                this.previewData = previewData;
                this.exemptProduct = { ...previewData, productDetail: previewData.product, subProductDetail: previewData.subProduct, containerIds: newContainerIds }
            }

        }
        else {
            await this.fetchData();
        }
        this.tableHeaders = this.headers;
        this.selectedHeaders = this.allSelectedHeaders;
    },
    computed: {
        ...mapGetters("eudrSettings", ["get_EUDR_Settings"]),
        eudrSettings() {
            return this.get_EUDR_Settings;
        },
    },
    methods: {
        async fetchData() {
            this.startLoading();
            try {
                const { data } = await BlendService.getExemptProductById(this.exemptProductId);
                if (data?.exemptProduct) {
                    console.log(data?.exemptProduct);
                     this.exemptProduct = {
                        ...data.exemptProduct,
                        productNetMass: UnitService.fromBase.weight(
                            this.eudrSettings.product_mass_unit,
                            data.exemptProduct.productNetMass
                        ),
                        productVolume: UnitService.fromBase.volume(
                            this.eudrSettings.volume_unit,
                            data.exemptProduct.productVolume
                        ),
                    };
                }
            }
            catch (error) {
                console.error(error);
                this.$notify({
                    title: this.$t("blends.exemptProducts.unExpectedErrorMsg"),
                    type: "error",
                });
            } finally {
                this.stopLoading();
            }
        },

        async handleSubmitData() {

            let payload = {
                ...this.previewData,
                countryOfActivity: this.previewData.countryOfActivity?.filter(x => x) || [],
                product: this.previewData.product?.id
                    ? parseInt(this.previewData.product?.id)
                    : null,
                subProduct: this.previewData.subProduct?.id
                    ? parseInt(this.previewData.subProduct?.id)
                    : null,
                productNetMass: UnitService.toBase.weight(
                    this.eudrSettings.product_mass_unit,
                    this.previewData.productNetMass
                ),
                productVolume: UnitService.toBase.volume(
                    this.eudrSettings.volume_unit,
                    this.previewData.productVolume
                ),
                containerIds: this.previewData.containerIds?.map((item) => item.id),
                supplier: this.supplier
            };

            this.startLoading();

            if (payload.id) {
                BlendService.updateExemptProduct(payload)
                    .then((res) => {
                        if (res.errors && res.errors.length > 0) {
                            const error = res.errors[0];
                            const errorMessage = error.message || this.$t("blends.exemptProducts.unExpectedErrorMsg");
                            this.$notify({
                                text: errorMessage,
                                type: "error",
                            });
                            return;
                        }

                        // clear the data;
                        this.$store.dispatch('clearExemptProductData');

                        this.$notify({
                            text: this.$t("blends.exemptProducts.exemptUpdatedSuccessfully"),
                            type: "success",
                        });
                        this.$router.replace({ name: "EUDRExemptProducts" });
                    })
                    .catch((err) => {
                        console.log("Error in exempt product listing", err);
                    })
                    .finally(() => {
                        this.stopLoading();
                    });
            }
            else {
                BlendService.addExemptProduct(payload)
                    .then((res) => {
                        if (res.errors && res.errors.length > 0) {
                            const error = res.errors[0];
                            const errorMessage = error.message || this.$t("blends.exemptProducts.unExpectedErrorMsg");
                            this.$notify({
                                text: errorMessage,
                                type: "error",
                            });
                            return;
                        }
                        // clear the data;
                        this.$store.dispatch('clearExemptProductData');
                        
                        this.$notify({
                            text: this.$t("blends.exemptProducts.exemptAddedSuccessfully"),
                            type: "success",
                        });
                        this.$router.replace({ name: "EUDRExemptProducts" });
                    })
                    .catch((err) => {
                        console.log("Error in exempt product listing", err);
                    })
                    .finally(() => {
                        this.stopLoading();
                    });
            }
        }

    },
    mixins: [loadingMixin]
}
</script>