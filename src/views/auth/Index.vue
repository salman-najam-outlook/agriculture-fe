<template>
    <v-app>
        <notifications position="bottom right" animation-type="css"/>
        <router-view></router-view>
    </v-app>
</template>

<script>
export default {
    
}
</script>

<style scoped>
.backgroundImg{
    background-image: url('/img/login-back.png');
    background-repeat: no-repeat;
    background-size: cover;
}
</style>