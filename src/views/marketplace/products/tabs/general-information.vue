<template>
    <v-form ref="generalInformation" @submit.prevent="generalInformation" autocomplete="off" v-model="valid">
        <v-row class="pl-3 py-15">
            <v-col sm="2">
            </v-col>
            <v-col sm="8">
                <div class="additional-logos-form mb-4">
                    <div style="overflow: clip" :class="['dropZone', dragging ? 'dropZone-over' : '']"
                        @dragenter="dragging = true" @dragleave="dragging = false">
                        <div class="dropZone-info" @drag="additionalOnChange">
                            <span class="fa fa-cloud-upload dropZone-title"></span>
                            <span class="dropZone-title">
                                <v-icon size="50" color="gray">mdi-camera-outline</v-icon>
                            </span>
                            <div class="dropZone-upload-limit-info">
                                <div class="d-flex flex-column align-center">
                                    <v-btn color="primary">{{ $t('marketplace.products.addImage') }}</v-btn>
                                    <span class="text-black pt-2">{{ $t('marketplace.products.addMultipleImages')
                                        }}</span>
                                </div>
                            </div>
                        </div>
                        <input type="file" accept="image/png, image/gif, image/jpeg, image/svg, image/svg+xml, image/webp" @change="additionalOnChange"
                            multiple>
                    </div>
                    <span class="red--text" v-if="false">File error</span>
                </div>
                <div class="img-preview">
                    <div class="img-item mr-2" v-for="(img, key) in holderImages" :key="key">
                        <img :src="img.preview" width="100%" class="" />
                        <v-icon @click="removeProductImage(key)" class="pa-2"> mdi-trash-can-outline </v-icon>
                    </div>
                </div>
                <div class="item-box">
                    <label for="autoLogOff" class="text-subtitle-1 font-weight-bold"> {{
                        $t('marketplace.products.productName') }}
                        <v-tooltip top color="00BD73" max-width="350">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon class="icon-with-background" style="color:#0EBF67;font-size: 18px;"
                                    v-bind="attrs" v-on="on">
                                    mdi-alert-circle
                                </v-icon>
                            </template>
                            <span>{{
                                $t('marketplace.products.productName') }}</span>
                        </v-tooltip></label>
                    <v-text-field v-model="product.name" :rules="productRules.productName" required
                        :placeholder="$t('marketplace.products.productName')" outlined></v-text-field>
                </div>
                <div class="item-box">
                    <label for="autoLogOff" class="text-subtitle-1 font-weight-bold"> {{
                        $t('marketplace.products.productSKUCode') }}
                        <v-tooltip top color="00BD73" max-width="350">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon class="icon-with-background" style="color:#0EBF67;font-size: 18px;"
                                    v-bind="attrs" v-on="on">
                                    mdi-alert-circle
                                </v-icon>
                            </template>
                            <span> {{
                                $t('marketplace.products.productSKUCode') }}</span>
                        </v-tooltip> </label>
                    <v-text-field v-model="product.sku" :rules="productRules.productSKUCode" required
                        :placeholder="$t('marketplace.products.productSKUCode')" outlined></v-text-field>
                </div>
                <div class="item-box">
                    <label for="autoLogOff" class="text-subtitle-1 font-weight-bold"> {{
                        $t('marketplace.products.description') }}
                        <v-tooltip top color="00BD73" max-width="350">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon class="icon-with-background" style="color:#0EBF67;font-size: 18px;"
                                    v-bind="attrs" v-on="on">
                                    mdi-alert-circle
                                </v-icon>
                            </template>
                            <span>{{
                                $t('marketplace.products.description') }}</span>
                        </v-tooltip></label>
                    <v-textarea v-model="product.description" :rules="productRules.description" required
                        :placeholder="$t('marketplace.products.description')" outlined></v-textarea>
                </div>
                <div class="additional-logos-form">
                    <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">
                        {{ $t("marketplace.products.attachFiles") }}
                        <span style="color: red"></span>
                    </label>

                    <div style="overflow: clip" :class="['dropZone', dragging ? 'dropZone-over' : '']"
                        @dragenter="dragging = true" @dragleave="dragging = false" @drop="handleDrop">
                        <div class="dropZone-info">
                            <span class="fa fa-cloud-upload dropZone-title"></span>
                            <span class="dropZone-title">
                                <v-icon size="50" color="gray">mdi mdi-progress-upload</v-icon>
                            </span>
                            <div class="dropZone-upload-limit-info">
                                <div class="d-flex flex-column align-center">
                                    <v-btn color="primary" class="btn-cls my-3" @click="triggerFileInput">
                                        {{ fileAdded ? $t("marketplace.products.replaceFile") :
                                            $t("marketplace.products.addFiles") }}
                                    </v-btn>
                                    <strong class="text-black"> DOC, PDF, XLS, CSV </strong>
                                </div>
                            </div>
                        </div>
                        <input type="file" ref="fileInput" accept=".doc,.pdf,.xls,.csv"
                            @change="additionalOnChangeForFile" hidden />
                    </div>

                    <v-alert v-if="fileAdded" type="success" dense class="mt-2">
                        {{ $t("marketplace.products.fileAdded") }} ({{ uploadedFileName }})
                    </v-alert>

                    <v-btn v-if="fileAdded" color="error" class="mt-2" @click="removeFile">
                        {{ $t("marketplace.products.removeFile") }}
                    </v-btn>

                    <span class="red--text" v-if="fileError">{{ fileError }}</span>
                </div>

                <div class="d-flex justify-center py-5">
                    <v-btn color="primary" outlined class="me-4 btn-cls" @click="cancelBtn">{{ $t('cancel') }}</v-btn>
                    <v-btn color="primary" class="btn-cls" @click="triggerNextBtn">{{ $t('marketplace.common.next')
                        }}</v-btn>
                </div>
            </v-col>
        </v-row>
    </v-form>
</template>

<script>
import DownloadMixin from "@/mixins/DownloadMixin";
import loadingMixin from "@/mixins/LoadingMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import MarketplaceService from '@/_services/MarketplaceService';
import { ProductSteps } from "../constants/enums";
export default {

    async mounted() {
        if(this.productId){
            await this.getProductDetail();
        }
    },

    data() {
        return {
            productId: this.$route.params.id || null,
            currentStep: ProductSteps.GENERAL_INFORMATION.name,
            valid: true,
            holderImages: [],
            fileAdded: false,
            fileError: "",
            uploadedFileName: "",
            packagings: [],
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
            dragging: false,
            previewUrl: null,
            product: {
                sku: '',
                name: '',
                description: '',
                productFile: '',
            },
            productRules: {
                productName: [
                    (v) => !!v || this.$t('marketplace.products.productNameRequired')
                ],
                description: [
                    (v) => !!v || this.$t('marketplace.products.descriptionRequired')
                ],
                productSKUCode: [
                    (v) => !!v || this.$t('marketplace.products.productSkuCodeRequired')
                ],
            },
        };
    },
    methods: {
        triggerFileInput() {
            this.$refs.fileInput.click();
        },
        async getProductDetail() {
            try {
                const res = await MarketplaceService.getProduct(this.productId, this.currentStep);

                this.product = res;

                if (res?.fileDetail) {
                    this.fileAdded = true;
                    this.uploadedFileName = res?.fileDetail?.filename;
                }

                if (res?.imageUrls && res?.imageUrls.length) {
                    this.holderImages = res.imageUrls.map((image) => ({
                        preview: image.s3_url,
                        file: null,
                    }))
                }
            }
            catch (error) {
                console.error('Error fetching product details:', error);
            }
        },

        async triggerNextBtn() {
            if (!this.$refs.generalInformation.validate()) return;
            this.startLoading();
            try {
                const { name, sku, description, productFile } = this.product;

                const formData = new FormData();
                formData.append('step', this.currentStep);
                formData.append('data[id]', this.productId);
                formData.append('data[name]', name);
                formData.append('data[sku]', sku);
                formData.append('data[description]', description);

                this.holderImages.forEach((image) => {
                    formData.append('productImages', image.file)
                });

                if (productFile) {
                    formData.append('productFile', productFile)
                }

                const headers = {
                    headers: { "Content-Type": "multipart/form-data" },
                }

                const response = await MarketplaceService.addProduct(formData, headers);

                const productId = response?.data?.product?.id || null;

                if (productId) {
                    this.$router.push({
                        name: 'marketplaceProductsAdd',
                        params: {
                            id: productId,
                            step: ProductSteps.CLASSIFICATION.id
                        }
                    })
                }

                this.$notify({
                    type: "success",
                    title: "Product submitted successfully.",
                });

                // Reset product form
                this.resetForm();
                this.$emit('nextStep');
                this.stopLoading();


            } catch (error) {
                this.stopLoading();
                this.$notify({
                    type: "error",
                    title: "Failed to submit the product.",
                    text: error.response?.data?.message || "An error occurred while submitting the product.",
                });
            }
        },

        cancelBtn() {
            this.$router.push({
                name: 'marketplaceProducts'
            })
        },

        resetForm() {
            this.product = {
                sku: "",
                name: "",
                description: "",
                productFiles: "",
            };
            this.holderImages = [];
            this.$refs.generalInformation.reset();
        },

        removeProductImage(key) {
            this.holderImages.splice(key, 1)
        },
        additionalOnChangeForFile(e) {
            const file = e.target.files?.[0] || e.dataTransfer.files?.[0];
            if (!file) return;

            const validTypes = ["application/pdf", "application/msword", "application/vnd.ms-excel", "text/csv"];
            if (!validTypes.includes(file.type)) {
                this.$notify({
                    type: "error",
                    title: `${file.name} is not a supported file type.`
                });
                return;
            }
            this.uploadedFileName = file.name;
            this.fileAdded = true;
            this.product.productFile = file;
            this.fileError = "";
        },

        handleDrop(event) {
            event.preventDefault();
            this.dragging = false;
            this.additionalOnChangeForFile(event);
        },

        removeFile() {
            this.product.productFile = null;
            this.fileAdded = false;
            this.uploadedFileName = "";
        },

        additionalOnChange(e) {
            var files = e.target.files || e.dataTransfer.files;
            if (files) {
                Array.from(files).forEach((file) => {
                    const reader = new FileReader();

                    // read file and create a preview;
                    reader.onload = (e) => {
                        this.holderImages.push({
                            file,
                            preview: e.target.result, // Base64 preview
                        });
                    }
                    reader.readAsDataURL(file); // convert image to Base64
                });
            }
        },
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
    height: 250px;
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

.btn-cls {
    width: 150px;
}

.text-black {
    color: black;
}
</style>