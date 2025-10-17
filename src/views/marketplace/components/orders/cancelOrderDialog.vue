<template>
    <v-container>
        <v-dialog v-model="dialog" width="600" persistent>
            <v-card rounded="0">
                <v-toolbar color="primary" class="white--text" flat>
                    <v-toolbar-title class="font-weight-bold"> {{ $t("marketplace.orders.cancelOrder") }} </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon class="white--text" @click="closeModal">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-form autocomplete="off" @submit.prevent="cancelOrder" ref="category" v-model="valid">
                    <v-card-text class="black--text">
                        <v-row class="ml-1 mt-5">
                            <span> {{ $t("marketplace.orders.cancelOrderConfirmation") }}</span>
                        </v-row>
                        <v-card-actions class="mt-10">
                            <v-spacer></v-spacer>
                            <v-btn class="" outlined color="primary" @click="closeModal" width="112">
                                {{ $t('cancel') }}
                            </v-btn>
                            <v-btn width="112" color="primary" type="submit" class="btn-11 btn-22">
                                {{ $t("marketplace.orders.cancelOrder") }}
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
        userId: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            valid: true
        }
    },
    methods: {
        closeModal() {
            this.$emit("closeOrderCancelModal")
        },

        async cancelOrder() {
            try {
                this.startLoading()
                await marketplaceService.cancelOrder(this.orderId, { "user_id": this.userId });
                this.$notify({
                    title: this.$t("marketplace.orders.cancelOrderSuccess"),
                    type: "success",
                })
                this.stopLoading();
            } catch (error) {
                this.stopLoading();
                this.closeModal();
                this.$notify({
                    title: error.response.data.message,
                    type: "error",
                })

                console.error('Error Cancelling Order:', error);
            }
            finally {
                this.closeModal();
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