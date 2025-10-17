<template>
    <v-dialog transition="dialog-top-transition" max-width="600" v-model="dialog" persistent>
      <v-card rounded="0">
        <v-toolbar color="yellow" class="white--text" flat :elevation="0">
          <v-toolbar-title class="font-weight-bold">
            {{ $t('noUploadToBlockchain')}}
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text class="pt-5 text-center">
          <p class="text-center black--text text-body-1 mt-3">
            {{ $t('noDataForBlockchain')}}
          </p>
          <v-btn color="yellow" outlined @click="onClose">{{ $t('dueDiligence.close')}}</v-btn>
        </v-card-text>
      </v-card>
  
      <!-- </template> -->
    </v-dialog>
  </template>
  
  <script>
  export default {
    props: {
      dialog: {
        required: false,
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {};
    },
    methods: {
      onClose() {
        this.$emit('close');
      },
    },
  };
  </script>
  