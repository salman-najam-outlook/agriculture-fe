<template>
    <div class="left-section">
        <div class="logo-img">
            <img src="/img/naccu_logo.svg">
            <!-- <h4 class="primary--text ml-2 text-h5 font-weight-black">DIMITRA</h4> -->
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style scoped lang="scss">
.left-section {
    background-image: url('/img/naccu_background.svg');
    background-repeat: no-repeat;
    background-size: cover;
    padding: 16px 20px;
    height: 100vh;
}

.left-section .logo-img {
    width: 230px;
    height: 55px;
    padding: 0px 75px;
    border-radius: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 50px;
}

.left-section .logo-img img {
    position: absolute;
    width: 300px;
    height: 150px;
    left: 29px;
    top: 10px;
}
</style>