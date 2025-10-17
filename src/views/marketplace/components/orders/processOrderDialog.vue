<template>
    <v-container>
        <v-dialog v-model="dialog" width="600" persistent>
            <v-card rounded="0">
                <v-toolbar color="primary" class="white--text" flat>
                    <v-toolbar-title class="font-weight-bold"> {{ $t("marketplace.orders.processOrder") }} </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon class="white--text" @click="closeModal">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-form autocomplete="off" @submit.prevent="processOrder" ref="category" v-model="valid">
                    <v-card-text class="black--text">
                        <v-row class="ml-1 mt-5">
                            <v-radio-group v-model="orderStatus" column>
                                <v-radio class="mb-3" label="Placed" value="PENDING"></v-radio>
                                <v-radio class="mb-3" label="Processing" value="PROCESSING"></v-radio>
                                <v-radio class="mb-3" label="Packing" value="PACKING"></v-radio>
                                <v-radio class="mb-3" label="Ready for Pick-Up" value="READY_FOR_PICKUP"></v-radio>
                                <v-radio class="mb-3" label="Out for Delivery" value="SHIPPED"></v-radio>
                                <v-radio class="mb-3" label="Cancelled" value="CANCELLED"></v-radio>
                                <v-radio class="mb-3" label="Delivered" value="DELIVERED"></v-radio>
                                
                            </v-radio-group>
                        </v-row>
                        <v-card-actions class="mt-10">
                            <v-spacer></v-spacer>
                            <v-btn class="" outlined color="primary" @click="closeModal" width="112">
                                {{ $t('cancel') }}
                            </v-btn>
                            <v-btn width="112" color="primary" type="submit" class="btn-11 btn-22">
                                {{ $t("marketplace.orders.update") }}
                            </v-btn>
                        </v-card-actions>
                    </v-card-text>
                </v-form>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import marketplaceService from "@/_services/MarketplaceService";
import loadingMixin from "@/mixins/LoadingMixin";

export default {
    computed: {
    },
    created() {
    },
    props: {
        dialog: {
            type: Boolean,
            default: false
        },
        orderId: {
            type: Number,
            required: true
        },
       
    },
    data() {
        return {
            orderStatus: "",
            valid: true
        }
    },
    methods: {
        closeModal() {
            this.$emit("closeProcessOrderModal")
        },

        async processOrder() {
            try {
                this.startLoading()
                await marketplaceService.processOrder(this.orderId, { "new_status": this.orderStatus });
                this.$notify({
                    title: this.$t("marketplace.orders.processOrderSuccess"),
                    type: "success",
                })
                this.stopLoading();
                this.closeModal();
            } catch (error) {
                this.stopLoading();
                this.closeModal();
                this.$notify({
                    title: error.response.data.message,
                    type: "error",
                })

                console.error('Error Processing Order:', error);
            }
        },


    },
    mixins: [loadingMixin]
}
</script>

<style scoped>
.v-dialog {
    z-index: 9999;
}

.file-input-wrapper {
    display: flex;
    align-items: center;
    margin-top: 16px;
}

.custom-file-upload {
    display: flex;
    align-items: center;
    width: 100%;
    cursor: pointer;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 10px;
    background-color: #f9f9f9;
    color: #333;
}

.custom-file-upload span {
    flex-grow: 1;
}

.custom-file-upload input[type="file"] {
    display: none;
}

.uploaded-image {
    width: 50px;
    height: 50px;
    margin-left: 10px;
    object-fit: cover;
    border-radius: 5px;
}
</style>