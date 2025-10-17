<template>
    <v-dialog v-model="visible" max-width="500">
        <template v-slot:default="{  }">
            <v-card class="custom-card">
                <v-toolbar color="secondary" class="white--text">
                    <v-toolbar-title class="font-weight-bold">{{ title }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon class="white--text" @click="$emit('close')">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-divider></v-divider>
                <v-card-text class="text-center py-6">
                    <v-progress-circular :size="size" :color="color" indeterminate class="mb-4"></v-progress-circular>
                    <p v-if="message" class="text-medium-emphasis">
                        {{ message }}
                    </p>
                </v-card-text>
                <v-card-actions class="justify-center py-4">
                    <v-btn color="primary" variant="outlined" @click="$emit('close')" outlined> {{ $t('cancel')
                        }}</v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>
  
  <script>
  export default {
    name: 'LoadingModal',
    props: {
      visible: {
        type: Boolean,
        required: true,
      },
      title: {
        type: String,
        default: 'Loading...',
      },
      message: {
        type: String,
        default: '',
      },
      color: {
        type: String,
        default: 'primary',
      },
      size: {
        type: Number,
        default: 75,
      },
    },
  };
  </script>
  
  <style scoped>
  /* Add specific styles here if needed */
  </style>
  