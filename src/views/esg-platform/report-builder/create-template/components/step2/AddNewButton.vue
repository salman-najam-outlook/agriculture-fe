<template>
    <div class="d-flex justify-center align-center mt-4 width_full">
        <v-btn class="add-new-btn primary text-white px-6 text-body" large @click="$emit('click')">
            <v-icon left>mdi-plus</v-icon>
            <slot />
        </v-btn>
    </div>
</template>

<style scoped>
.add-new-btn {
    border-radius: 3px;
    font-size: 16px;
    text-transform: none;
    min-width: 320px;
    height: 56px;
    letter-spacing: 1px;
}
</style>
