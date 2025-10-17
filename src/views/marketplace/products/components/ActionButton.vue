<template>
    <div>
        <v-btn color="gray" dark medium class="mr-3">
            {{ $t('marketplace.products.addProduct') }}
        </v-btn>
        <v-btn color="primary" dark medium class="mr-3" @click="redirectToProducts">
            {{ $t('marketplace.common.products') }}
        </v-btn>
    </div>
</template>
<script>
export default {
    methods: {
        redirectToProducts() {
            this.$router.push({
                name: 'marketplaceProducts'
            });
        }
    }
}</script>