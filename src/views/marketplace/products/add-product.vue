<template>
    <div>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid class="px-6 py-0">
            <div class="d-flex">
                <h2>{{ $t('marketplace.products.addProduct') }}</h2>
                <v-spacer></v-spacer>
                <ActionButton />
            </div>

            <v-card elevation="0" class="px-5 mt-7">
                <v-card-text>

                    <CustomTab @changeStep="changeStep" :tabs="tabs" :activeTab="step" />

                    <v-divider class="mt-5"></v-divider>

                    <GeneralInformation @nextStep="nextStep" v-if="step == ProductSteps.GENERAL_INFORMATION.id" />

                    <Classification @nextStep="nextStep" v-if="step == ProductSteps.CLASSIFICATION.id" />

                    <Pricing @nextStep="nextStep" v-if="step == ProductSteps.PRICING.id" />

                    <Shipping @nextStep="nextStep" v-if="step == ProductSteps.SHIPPING.id" />

                </v-card-text>
            </v-card>
        </v-container>

    </div>
</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin";
import _ from 'lodash'
import ActionButton from "./components/ActionButton.vue";
import CustomTab from "./components/CustomTab.vue";
import GeneralInformation from "./tabs/general-information.vue";
import Classification from "./tabs/classification.vue";
import Pricing from "./tabs/pricing.vue";
import Shipping from "./tabs/shipping.vue";
import { ProductSteps } from "./constants/enums";

export default {
    computed: {

    },
    created() {

    },
    mounted() {
        this.step = Number(this.$route.params.step) || 1;
    },
    watch: {
        "$route.params.step": {
            immediate: true,
            handler(newStep) {
                this.step = Number(newStep) || 1;
            }
        }
    },
    components: {
        ActionButton,
        CustomTab,
        GeneralInformation,
        Classification,
        Pricing,
        Shipping,
    },

    data() {
        return {
            ProductSteps,
            tab: 0,
            items: [],
            breadcrumbs: [
                {
                    text: this.$t("dashboard"),
                    disabled: true,
                    to: "/",
                },
                {
                    text: this.$t("marketplace.common.products"),
                    disabled: true,
                    to: "breadcrumbs_link_1",
                },
            ],
            step: ProductSteps.GENERAL_INFORMATION.id,
            tabs: [
                {
                    title: this.$t("marketplace.products.generalInformation"),
                    key: ProductSteps.GENERAL_INFORMATION.name,
                    number: 1,
                },
                {
                    title: this.$t("marketplace.products.classification"),
                    key: ProductSteps.CLASSIFICATION.name,
                    number: 2,
                },
                {
                    title: this.$t("marketplace.products.pricing"),
                    key: ProductSteps.PRICING.name,
                    number: 3,
                },
                {
                    title: this.$t("marketplace.products.shipping"),
                    key: ProductSteps.SHIPPING.name,
                    number: 4,
                },
            ]
        };
    },

    methods: {
        nextStep() {
            this.step++;
        },
        changeStep(step) {
            this.step = step;
        },
    },

    mixins: [loadingMixin]
};
</script>

<style lang="scss" scoped>
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
    margin-right: 0;
    margin-top: 0;
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

.filterIcon {
    color: #0EBF67;
    height: 28px;
    width: 28px;
    margin-left: 5px;
    margin-right: 5px;
}

.img-wrapper {
    height: 100px;
    width: 100px;
    margin: 10px 0;
}

.img-wrapper img {
    height: 100%;
    width: 100%;
}

.product-title {
    font-size: 20px;
    padding-bottom: 6px;
    display: inline-block;
    width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>