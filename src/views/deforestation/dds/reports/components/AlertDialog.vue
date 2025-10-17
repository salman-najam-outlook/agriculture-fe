<template>
  <v-dialog transition="dialog-top-transition" max-width="600" v-model="dialog" @click:outside="onClose">
    <v-card rounded="0">
      <v-toolbar color="primary" class="white--text" flat :elevation="0">
        <v-toolbar-title class="font-weight-bold">
          {{ heading }}
        </v-toolbar-title>
        <v-btn icon @click="onClose" color="white" class="ml-auto">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="pt-5 text-center">

        <p class="text-center black--text text-body-1 mt-3">
          <slot></slot>
        </p>
      </v-card-text>
    </v-card>

    <!-- </template> -->
  </v-dialog>
</template>

<script>
export default {
  props: {
    heading: {
      type: String,
      required: false,
    },
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
