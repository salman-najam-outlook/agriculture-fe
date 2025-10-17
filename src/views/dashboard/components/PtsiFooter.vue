<template>
    <v-footer class="pt-0 mt-5 ml-6 mr-6 mb-5" color="white">
        <v-row class="px-4 mx-0">
        <v-col cols="12" sm="6" class="text-center text-sm-left">
            <span class="white--black line-height50">© Dimitra Incorporated {{ new Date().getFullYear() }}</span>
        </v-col>
        <v-col cols="12" sm="6" class="text-center text-sm-right">
            <span class="white--black line-height50">Powered by</span>
            <img
                src="https://dimitra.io/wp-content/themes/dimitra/assets/imgs/dimitralogo2023.svg"
                alt="Dimitra Logo"
                class="ml-2 middle-align"
                style="height: 24px; width: auto;"/>
        </v-col>
        </v-row>
    </v-footer>
</template>
<style scoped>
    .line-height50 {
        line-height: 50px;
    }
    .middle-align {
        vertical-align: middle;
    }
</style>