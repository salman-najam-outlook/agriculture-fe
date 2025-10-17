<template>
  <div>
      <div class="d-flex header-container" color="primary"
        style="background-color: #00BD73; position:sticky; top:0; z-index:100; padding-left: 20px; height: 50px;">
        <h2 class="mt-2 white--text ml-4" color="white">{{ $t('blends.blendSettings.addBlend') }}</h2>
        <!-- crossbar at the top right  -->
        <v-spacer></v-spacer>
        <div class="d-flex mt-1">
          <v-btn icon color="white" class="mr-2" @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </div>
      <v-container>
        <CreateBlendSettings :showBreadcrumb="false" :showTitleAndButton="false" isModalForm />
      </v-container>
  </div>
</template>

<script>
import CreateBlendSettings from '../../blend-settings/CreateBlendSettings.vue';

export default {
    props: {
      isModalForm: {
            type: Boolean,
            default: false
        }
    },
    components: {
        CreateBlendSettings
    },

  methods: { 
      closeDialog() {
        this.$emit('close:dialog')  
      },
      
  },
};
</script>

<style lang="scss" scoped>
</style>