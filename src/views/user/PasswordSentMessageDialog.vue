<template>
  <v-dialog max-width="800px" @click:outside="onClose" scrollable v-bind="$attrs">
    <v-card>
      <v-toolbar flat color="primary" class="white--text">
        <v-toolbar-title class="font-weight-bold">{{ $t('password.updatePassword') }}</v-toolbar-title>
      </v-toolbar>
      <v-card-text class="px-4 py-4" style="max-height: 480px">
        <p class="text-body-2 font-weight-bold black--text">
          {{ $t('password.passwordSentMessage', { userName: userName || $t('user') }) }}
        </p>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="justify-end">
        <v-btn outlined color="primary" @click="onClose">{{ $t('close') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    userName: {
      type: String,
      default: 'user',
    },
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
  },
};
</script>
