<template>
    <div>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <div class="d-flex mb-4">
                <h2>Products</h2>
                <v-spacer></v-spacer>
                <div class="d-flex mt-1">
                    <v-btn color="primary" :to="{ name: 'marketplaceProducts' }" dark class="mr-2">
                        Member Products
                    </v-btn>
                </div>
            </div>
            <v-form ref="productAdd" @submit.prevent="addProduct" autocomplete="off">
                <v-card elevation="0">
                    <v-card class="mb-5" flat>
                        <v-toolbar color="secondary" dark>
                            <v-toolbar-title>General </v-toolbar-title>
                        </v-toolbar>
                        <v-card-text>
                            <v-row class="pl-3">
                                <v-col cols="3">
                                    <div class="additional-logos-form">
                                        <div style="overflow: clip"
                                            :class="['dropZone', dragging ? 'dropZone-over' : '']"
                                            @dragenter="dragging = true" @dragleave="dragging = false">
                                            <div class="dropZone-info" @drag="additionalOnChange">
                                                <span class="fa fa-cloud-upload dropZone-title"></span>
                                                <span class="dropZone-title">
                                                    <v-icon size="50" color="gray">mdi-camera-outline</v-icon>
                                                </span>
                                                <div class="dropZone-upload-limit-info">
                                                    <div>
                                                        <v-btn color="primary">Upload Image</v-btn>
                                                    </div>
                                                </div>
                                            </div>
                                            <input type="file" accept="image/png, image/gif, image/jpeg"
                                                @change="additionalOnChange">
                                        </div>
                                        <div class="text-center">Upload Image </div>
                                        <span class="red--text" v-if="false">File error</span>

                                    </div>
                                    <div class="img-preview">
                                        <div class="img-item" v-for="(img, key) in holderImage" :key="key">
                                            <img :src="img" width="100%" />
                                            <v-icon @click="removeProductImage(key)"> mdi-trash-can-outline </v-icon>
                                        </div>
                                    </div>
                                </v-col>
                                <v-col sm="2">
                                </v-col>
                                <v-col sm="4">
                                    <div class="item-box">
                                        <label for="autoLogOff" class="text-subtitle-1 font-weight-bold"> Product Name
                                            <span style="color: red">*</span> </label>
                                        <v-text-field v-model="product.productName" :rules="productRules.productName"
                                            required placeholder="Product Name" outlined></v-text-field>
                                    </div>
                                    <div class="item-box">
                                        <label for="autoLogOff" class="text-subtitle-1 font-weight-bold"> Description
                                            <span style="color: red">*</span> </label>
                                        <v-textarea v-model="product.description" :rules="productRules.description"
                                            required placeholder="Product Name" outlined></v-textarea>
                                    </div>
                                    <div class="additional-logos-form">
                                        <label for="autoLogOff" class="text-subtitle-1 font-weight-bold"> Attach Files
                                            <span style="color: red"></span> </label>
                                        <div style="overflow: clip"
                                            :class="['dropZone', dragging ? 'dropZone-over' : '']"
                                            @dragenter="dragging = true" @dragleave="dragging = false">
                                            <div class="dropZone-info" @drag="additionalOnChangeForFile">
                                                <span class="fa fa-cloud-upload dropZone-title"></span>
                                                <span class="dropZone-title">
                                                    <v-icon size="50" color="gray">mdi mdi-progress-upload</v-icon>
                                                </span>
                                                <div class="dropZone-upload-limit-info">
                                                    <div>
                                                        <v-btn color="primary">Add Files</v-btn>
                                                    </div>
                                                </div>
                                            </div>
                                            <input type="file" accept="" @change="additionalOnChangeForFile">
                                        </div>
                                        <div class="text-center">Attach File </div>
                                        <span class="red--text" v-if="false">File error</span>
                                    </div>
                                </v-col>

                            </v-row>
                        </v-card-text>

                    </v-card>
                    <v-card class="mb-5" flat>
                        <v-toolbar color="secondary" dark>
                            <v-toolbar-title> Classification </v-toolbar-title>
                        </v-toolbar>
                        <v-card-text>
                            <v-row class="pl-3">
                                <v-col cols="4">
                                    <label for="name">Product Category<span class="red--text">*</span></label>
                                    <v-select :items="productCategories" v-model="product.productCategory"
                                        :rules="productRules.productCategory" placeholder="Product category"
                                        item-text="name" item-value="id" dense outlined style="margin-left: -1px"
                                        class="rounded select-duration"></v-select>
                                </v-col>
                                <v-col sm="4">
                                    <label for="name">Product Sub Category<span class="red--text">*</span></label>
                                    <v-select :items="productSubCategories" v-model="product.productSubCategory"
                                        :rules="productRules.productSubCategory" placeholder="Product sub category"
                                        item-text="name" item-value="id" dense outlined style="margin-left: -1px"
                                        class="rounded select-duration"></v-select>
                                </v-col>
                                <v-col sm="4">
                                    <label for="name">Product Farm<span class="red--text">*</span></label>
                                    <v-select :items="farms" v-model="product.farm" :rules="productRules.farm"
                                        placeholder="Farm" item-text="name" item-value="id" dense outlined
                                        style="margin-left: -1px" class="rounded select-duration"></v-select>

                                    <!-- <div class="item-box">
                                        <label for="autoLogOff" class="text-subtitle-1 font-weight-bold"> Product Name
                                            <span style="color: red">*</span> </label>
                                        <v-text-field required placeholder="Product Name" outlined></v-text-field>
                                    </div>
                                    <div class="item-box">
                                        <label for="autoLogOff" class="text-subtitle-1 font-weight-bold"> Description
                                            <span style="color: red">*</span> </label>
                                        <v-textarea required placeholder="Product Name" outlined></v-textarea>
                                        productExpiration:'',
                                        quantityAvailable:'',
                                        quantityAvailableUnit:'',
                                        preOrderWarehouseRadio:'',
                                        avalibilityDate:'',
                                        maximumOrderQuanitity:'',
                                        maximumOrderQuanitityUnit:'',
                                    </div> -->
                                </v-col>
                            </v-row>

                            <v-row class="pl-2">
                                <v-col sm="4">
                                    <label class="expiration" for="name">Product Expiration<span
                                            class="red--text">*</span></label>
                                    <v-menu v-model="productExpirationMenu" :close-on-content-click="false"
                                        :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field append-icon="mdi-calendar"
                                                :rules="productRules.productExpiration"
                                                v-model="product.productExpiration" outlined dense readonly
                                                v-bind="attrs" v-on="on"
                                                v-on:click:append="productExpirationMenu = true"
                                                placeholder="Select Date"></v-text-field>
                                        </template>
                                        <v-date-picker v-model="product.productExpiration" placeholder="Select Date"
                                            @input="productExpirationMenu = false"></v-date-picker>
                                    </v-menu>
                                </v-col>
                                <v-col sm="6">
                                    <v-radio-group row v-model="product.preOrderWarehouseRadio"
                                        :rules="productRules.preOrderWarehouseRadio">
                                        <v-radio label="Quantity" value="quantity"></v-radio>
                                        <v-radio label="Pre Order" value="pre_order"></v-radio>
                                        <v-radio label="Warehouse" value="warehouse"></v-radio>
                                    </v-radio-group>


                                    <div class="dynamic-label" v-if="product.preOrderWarehouseRadio == 'quantity'">
                                        <label for="name">Quantity Available<span class="red--text">*</span></label>
                                        <v-row class="d-flex" no-gutters>
                                            <v-col cols="8">
                                                <v-text-field v-model="product.quantityAvailable"
                                                    :rules="productRules.quantityAvailable" outlined dense
                                                    placeholder="Quantity Available" class="rounded-r-0">
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="4">
                                                <v-select :items="units" v-model="product.quantityAvailableUnit"
                                                    :rules="productRules.quantityAvailableUnit" placeholder="Unit"
                                                    item-text="name" item-value="id" dense outlined
                                                    style="margin-left: -1px"
                                                    class="rounded-l-0 select-duration"></v-select>
                                            </v-col>
                                        </v-row>
                                    </div>
                                    <div class="dynamic-label" v-if="product.preOrderWarehouseRadio == 'pre_order'">
                                        <label class="expiration" for="name">Availibility Date<span
                                                class="red--text">*</span></label>
                                        <v-menu v-model="avalibilityDate" :close-on-content-click="false"
                                            :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field v-model="product.avalibilityDate"
                                                    :rules="productRules.avalibilityDate" append-icon="mdi-calendar"
                                                    outlined dense readonly v-bind="attrs" v-on="on"
                                                    v-on:click:append="avalibilityDate = true"
                                                    placeholder="Select Date"></v-text-field>
                                            </template>
                                            <v-date-picker v-model="product.avalibilityDate" placeholder="Select Date"
                                                @input="avalibilityDate = false"></v-date-picker>
                                        </v-menu>

                                    </div>

                                    <div class="dynamic-label" v-if="product.preOrderWarehouseRadio == 'warehouse'">
                                        <label class="expiration" for="name">Warehouse Products*<span
                                                class="red--text">*</span></label>
                                        <v-menu v-model="avalibilityDate" :close-on-content-click="false"
                                            :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field v-model="product.avalibilityDate"
                                                    :rules="productRules.avalibilityDate" append-icon="mdi-caret-down"
                                                    outlined dense readonly v-bind="attrs" v-on="on"
                                                    v-on:click:append="avalibilityDate = true"
                                                    placeholder="Select Warehouse products"></v-text-field>
                                            </template>
                                            <div class="pa-20 pt-20 pb-20">
                                                Warehouse products
                                            </div>
                                        </v-menu>
                                    </div>
                                </v-col>
                            </v-row>
                            <v-row class="pl-2">
                                <v-col sm="4">
                                    <label for="name">Minimum Order Quantity<span class="red--text">*</span></label>
                                    <v-row class="d-flex" no-gutters>
                                        <v-col cols="8">
                                            <v-text-field v-model="product.minimumOrderQuantity"
                                                :rules="productRules.minimumOrderQuantity" outlined dense
                                                placeholder="Maximum Order Quantity" class="rounded-r-0">
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="4">
                                            <v-select :items="units" v-model="product.minimumOrderQuantityUnit"
                                                :rules="productRules.minimumOrderQuantityUnit" placeholder="Unit"
                                                item-text="name" item-value="id" dense outlined
                                                style="margin-left: -1px"
                                                class="rounded-l-0 select-duration"></v-select>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                    <v-card class="mb-5" flat>
                        <v-toolbar color="secondary" dark>
                            <v-toolbar-title> Pricing </v-toolbar-title>
                        </v-toolbar>
                        <v-card-text>
                            <v-row class="pl-3">
                                <v-col cols="4">
                                    <label for="name" class="title">Price<span class="red--text">*</span></label>
                                    <br>
                                    <label for="name">Request Quote</label>
                                    <v-switch inset v-model="product.requestQuote" value="request_quote_on"
                                        label="Activated/Deactivated" hide-details inset></v-switch>
                                    <br>
                                    <v-btn color="primary" dark class="mr-2" @click="openPricingSlab">
                                        Add Pricing Slab
                                    </v-btn>
                                </v-col>
                                <v-col sm="4">
                                    <label for="name">Currency<span class="red--text">*</span></label>
                                    <v-select :items="currencies" v-model="product.currency"
                                        :rules="productRules.currency" placeholder="Currency" item-text="name"
                                        item-value="id" dense outlined style="margin-left: -5px"
                                        class="rounded select-duration"></v-select>
                                </v-col>

                            </v-row>
                            <v-row class="mb-8 mt-8">
                                <v-col cols="12" class="ml-0 mr-0">
                                    <v-data-table :headers="priceSlabHeader" :items="priceSlabData" hide-default-footer>
                                        <template v-slot:body="{ items }">
                                            <tbody>
                                                <tr v-for="item in items" :key="item.id">
                                                    <td> {{ item.quantityFrom }} </td>
                                                    <td> {{ item.quantityTo }} </td>
                                                    <td> {{ item.unit }} </td>
                                                    <td> {{ item.price }} </td>
                                                    <td> {{ item.promotionPrice }} </td>
                                                    <td>
                                                        <div>
                                                            <v-tooltip bottom>
                                                                <template v-slot:activator="{ on, attrs }">
                                                                    <v-btn color="primary" x-small fab v-bind="attrs"
                                                                        v-on="on" class="green-shadow">
                                                                        <v-icon>mdi-pencil</v-icon>
                                                                    </v-btn>
                                                                </template>
                                                                <span>{{ $t("edit") }}</span>
                                                            </v-tooltip> &nbsp;
                                                            <v-tooltip bottom>
                                                                <template v-slot:activator="{ on, attrs }">
                                                                    <v-btn x-small fab v-bind="attrs" v-on="on"
                                                                        class="green-shadow">
                                                                        <v-icon
                                                                            @click="removePriceData(item)">mdi-delete</v-icon>
                                                                    </v-btn>
                                                                </template>
                                                                <span>{{ $t("delete") }}</span>
                                                            </v-tooltip>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </template>
                                    </v-data-table>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col sm="4">
                                    <label for="name">Unit Packing<span class="red--text">*</span></label>
                                    <v-radio-group row v-model="product.unitPacking" :rules="productRules.unitPacking">
                                        <v-radio label="Bag" value="bag" default></v-radio>
                                        <v-radio label="Case" value="case"></v-radio>
                                    </v-radio-group>
                                </v-col>
                                <v-col sm="6">
                                    <label for="name">Payment Option<span class="red--text">*</span></label>
                                    <div class="payment-option-box d-flex">
                                        <v-checkbox v-model="product.paymentOptions" label="Cash on pick-up/Delivery"
                                            value="pick_up_delivery"></v-checkbox>
                                        <v-checkbox v-model="product.paymentOptions" label="Bank Wire Transfer"
                                            value="bank_wire_transfer"></v-checkbox>
                                        <v-checkbox v-model="product.paymentOptions" label="Pay by $DMTR"
                                            value="pay_by_dmtr"></v-checkbox>
                                    </div>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col sm="4">
                                    <label for="name">Choose Bank Account<span class="red--text">*</span></label>
                                    <v-select :items="bankAccounts" v-model="product.bankAccount"
                                        :rules="productRules.bankAccount" placeholder="Bank account" item-text="name"
                                        item-value="id" dense outlined style="margin-left: -1px"
                                        class="rounded-l-0 select-duration"></v-select>
                                </v-col>
                                <v-col sm="1"> </v-col>
                                <v-col sm="6">
                                    <label for="name" class="font-weight-bold">Discount Coupon <span
                                            class="red--text">*</span></label>
                                    <div class="d-flex justify-space-between">
                                        <div class="discount-box">
                                            <label for="name">Discount</label>
                                            <v-text-field v-model="product.discount" :rules="productRules.discount"
                                                outlined dense class="rounded-r-0">
                                            </v-text-field>
                                        </div>
                                        <div class="discount-box">
                                            <label for="name">Coupon Code</label>
                                            <v-text-field v-model="product.couponCode" :rules="productRules.couponCode"
                                                outlined dense class="rounded-l-0 rounded-r-0">
                                            </v-text-field>
                                        </div>
                                        <div class="discount-box">
                                            <label for="name">Usage Limit</label>
                                            <v-text-field v-model="product.usageLimit" :rules="productRules.usageLimit"
                                                outlined dense class="rounded-l-0">
                                            </v-text-field>
                                        </div>
                                    </div>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>

                    <v-card class="mb-5" flat>
                        <v-toolbar color="secondary" dark>
                            <v-toolbar-title> Shipping </v-toolbar-title>
                        </v-toolbar>
                        <v-card-text>
                            <v-row>
                                <v-col sm="12">
                                    <label for="name">Delivery Options<span class="red--text">*</span></label>
                                </v-col>
                                <v-col sm="6">
                                    <v-checkbox v-model="product.delivery" checked label="Delivery"
                                        :value="1"></v-checkbox>
                                    <div class="delivery-radio">
                                        <v-radio-group row v-model="product.deliveryOptionRadio"
                                            :rules="productRules.deliveryOptionRadio">
                                            <v-radio label="Local" value="local"></v-radio>
                                            <v-radio label="World Wide" value="world_wide"></v-radio>
                                            <v-radio label="Selected Countries" value="selected_countries"></v-radio>
                                        </v-radio-group>
                                    </div>
                                    <div class="incoterms">
                                        <label for="name">Incoterms</label>
                                        <v-select :items="incoterms" v-model="product.incoterms"
                                            :rules="productRules.incoterms" placeholder="Incoterms" item-text="name"
                                            item-value="id" dense outlined style="margin-left: -1px"
                                            class="rounded select-duration"></v-select>
                                    </div>
                                    <div class="delivery-charges">
                                        <label for="name">Delivery Charges</label>
                                        <div class="d-flex align-center">
                                            <v-radio-group row v-model="product.deliveryCharge">
                                                <v-radio label="Manual" value="manual"></v-radio>
                                                <v-radio label="Auto" value="auto"></v-radio>
                                            </v-radio-group>
                                            <v-btn color="primary" class="ml-3"> Add </v-btn>
                                        </div>
                                    </div>
                                </v-col>
                                <v-col sm="6">
                                    <div class="pickup-box">
                                        <v-checkbox v-model="product.pickup" checked label="Pickup"
                                            :value="1"></v-checkbox>
                                    </div>

                                    <div class="discount-box">
                                        <label for="name">Pick-up Location</label>
                                        <div class="d-flex">
                                            <v-text-field v-model="product.pickupLocation"
                                                :rules="productRules.pickupLocation" outlined dense class="rounded">
                                            </v-text-field>
                                            &nbsp;
                                            <v-btn color="primary" class="ml-3"> Add New Location </v-btn>
                                        </div>
                                    </div>

                                    <div class="payment-option-box d-flex">
                                        <v-checkbox v-model="product.defaultLocationCheckbox"
                                            label="Set as default Location" value="default_location"></v-checkbox>
                                        &nbsp; &nbsp;
                                        <v-checkbox v-model="product.defaultLocationCheckbox"
                                            label="Set As Second Location" value="second_location"></v-checkbox>
                                    </div>

                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>

                    <v-card-actions class="mt-10">
                        <v-spacer></v-spacer>
                        <v-btn class="" outlined color="primary" width="112">
                            {{ $t('cancel') }}
                        </v-btn>
                        <v-btn width="112" color="primary" type="submit" class="btn-11 btn-22">
                            {{ $t('submit') }}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
            <price-slab-model :dialog="openAddPricingSlab" @closePriceSlabModal="openAddPricingSlab = false"
                @priceSlabData="getPriceData"> </price-slab-model>
        </v-container>
    </div>
</template>

<script>
import DownloadMixin from "@/mixins/DownloadMixin";
import loadingMixin from "@/mixins/LoadingMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import priceslabmodal from "./priceSlabModal.vue";

export default {
    computed: {

    },
    mounted() {
        this.loading = false;
    },
    created() {

    },
    watch: {
        tableOptions: {
            async handler() {
                await this.getUsers();
            },
            deep: true,
        },
    },
    components: {
        'price-slab-model': priceslabmodal
    },
    methods: {
        removeProductImage(key) {
            this.holderImage.splice(key, 1)
        },
        additionalOnChangeForFile(e) {
            console.log(e)
            //var files = e.target.files || e.dataTransfer.files;
            //const file = e.target.files[0];
            //const previewUrl = URL.createObjectURL(file);
            // if (!files.length) {
            //     this.dragging = false;
            //     return;
            // }

            //this.pushImageToArray(files[0], previewUrl);
        },
        additionalOnChange(e) {
            var files = e.target.files || e.dataTransfer.files;
            const file = e.target.files[0];
            const previewUrl = URL.createObjectURL(file);
            if (!files.length) {
                this.dragging = false;
                return;
            }
            this.pushImageToArray(files[0], previewUrl);
        },
        pushImageToArray(file, previewUrl) {
            //this.holderImage = []
            this.holderImage.push(previewUrl)
        },
        openPricingSlab() {
            this.openAddPricingSlab = true
        },
        getPriceData(payload) {
            console.log(payload)
            if (payload) { this.priceSlabData.push(payload) }
        },
        removePriceData(item) {
            const index = this.priceSlabData.findIndex(x => x.id === item.id)
            this.priceSlabData.splice(index, 1)
        },
        addProduct() {
            console.log("valid", this.product)
            if (!this.$refs.productAdd.validate()) return
            console.log("valid", this.product)
        }
    },
    data() {
        return {
            priceSlabHeader: [
                {
                    text: 'Quantity Form',
                    align: "start",
                    value: "quantityFrom",
                    class: "black--text  text-no-wrap",
                },
                {
                    text: 'Quantity To',
                    align: "start",
                    value: "quantityTo",
                    class: "black--text  text-no-wrap",
                },
                {
                    text: 'Unit',
                    align: "start",
                    value: "unit",
                    class: "black--text  text-no-wrap",
                },
                {
                    text: 'Price',
                    align: "start",
                    value: "price",
                    class: "black--text  text-no-wrap",
                },
                {
                    text: 'Promotion',
                    align: "start",
                    value: "promotionPrice",
                    class: "black--text  text-no-wrap",
                },
                {
                    text: '',
                    align: "start",
                    class: "black--text  text-no-wrap",
                },
            ],
            productExpirationMenu: false,
            avalibilityDate: false,
            priceSlabData: [],
            holderImage: [],
            breadcrumbs: [
                {
                    text: this.$t("dashboard"),
                    disabled: true,
                    to: "/",
                },
                {
                    text: this.$t("Products"),
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

            //form v model
            product: {
                productName: '',
                description: '',

                //classification
                productCategory: '',
                productSubCategory: '',
                farm: '',
                productExpiration: '',
                quantityAvailable: '',
                quantityAvailableUnit: '',
                preOrderWarehouseRadio: 'quantity',
                avalibilityDate: '',
                minimumOrderQuantity: '',
                minimumOrderQuantityUnit: '',

                //Pricing
                requestQuote: '',
                currency: '',
                price: [],
                unitPacking: '',
                paymentOptions: [],
                bankAccount: '',

                discount: '',
                couponCode: '',
                usageLimit: '',

                //Shipping 
                delivery: 1,
                pickup: 1,

                deliveryOptionRadio: 'world_wide',
                pickupLocation: '',
                incoterms: '',
                defaultLocationCheckbox: 'default_location',
                deliveryCharge: 'auto'
            },
            productRules: {
                productName: [
                    (v) => !!v || 'Product name field is required'
                ],
                description: [
                    (v) => !!v || 'Product description field is required'
                ],

                // //classification
                productCategory: [
                    (v) => !!v || 'Product category field is required'
                ],
                productSubCategory: [
                    (v) => !!v || 'Product Sub category field is required'
                ],
                farm: [
                    (v) => !!v || 'Product Farm field is required'
                ],
                productExpiration: [
                    (v) => !!v || 'Product expiration field is required'
                ],
                quantityAvailable: [
                    (v) => !!v || 'Quanitity available field is required'
                ],
                quantityAvailableUnit: [
                    (v) => !!v || 'Quantity available unit fields is required'
                ],
                preOrderWarehouseRadio: [
                    (v) => !!v || 'Please select pre-order or warehouse'
                ],
                avalibilityDate: [
                    (v) => !!v || 'Avalibility date field is required'
                ],
                minimumOrderQuantity: [
                    (v) => !!v || 'Minimum order quanitity field is required'
                ],
                minimumOrderQuantityUnit: [
                    (v) => !!v || 'Minimum order quanitity unit field is required'
                ],

                // //Pricing
                // requestQuote: '',
                currency: [
                    (v) => !!v || 'Currency fields is required'
                ],
                // price: [],
                unitPacking: [
                    (v) => !!v || 'Unit Pricing field is required'
                ],
                paymentOptions: [
                    (v) => !!v || 'Payment option field is required'
                ],
                bankAccount: [
                    (v) => !!v || 'Bank account fieds is required'
                ],

                discount: [
                    (v) => !!v || 'Discount field is required'
                ],
                couponCode: [
                    (v) => !!v || 'Coupon field is required'
                ],
                usageLimit: [
                    (v) => !!v || 'Usage Limit field is required'
                ],

                // //Shipping 
                // delivery: '',
                // pickup: '',

                // deliveryOptionRadio: '',
                pickupLocation: [
                    (v) => !!v || 'Pickup location fields is required'
                ],
                incoterms: [
                    (v) => !!v || 'Incoterms fields is required'
                ],
                // defaultLocationCheckbox: '',
                // deliveryCharge: ''
            },

            //Form use fields
            units: [{ id: 1, name: 'KG' }, { id: 2, name: 'Grams' }],
            productCategories: [{ id: 1, name: 'Coffee & Team' }, { id: 2, name: 'Coffee Illam' }],
            productSubCategories: [{ id: 1, name: 'Coffee' }, { id: 2, name: 'Tea' }],
            farms: [{ id: 1, name: 'Goat Farm' }, { id: 2, name: 'Coffee Farm' }],
            currencies: [{ id: 1, name: 'USD' }, { id: 2, name: 'AUD' }],
            bankAccounts: [{ id: 1, name: 'Nepal Rastra Bank' }, { id: 2, name: 'Nabil Bank' }],
            incoterms: [{ id: 1, name: 'Inco1' }, { id: 2, name: 'Inco2' }]
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
</style>