<template>
    <v-breadcrumbs :items="items" class="breadcrum">
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
</template>
<script>
export default {
    props: ['items']
}
</script>

<style  lang="scss" scoped>
    .breadcrum {
        // border-bottom: 1px solid;
        // border-color: $outline-color;
        padding: 18px 12px !important;
    }
</style>