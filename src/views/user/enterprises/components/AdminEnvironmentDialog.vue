<template>
    <v-dialog v-model="dialog" persistent max-width="400" content-class="environment-dialog">
      <v-card class="pa-0">
        <div class="dialog-header d-flex align-center px-4 py-3">
          <span class="text-subtitle-1 white--text">
          {{ $t('Enterprises.AdminEnvironmentDialog.Create_Admin_Environment') }}
            <!-- Create Admin Environment -->
          </span>
          <v-spacer></v-spacer>
          <v-btn icon x-small class="white--text close-btn" @click="closeDialog">
            <v-icon size="16">mdi-close</v-icon>
          </v-btn>
        </div>
  
        <v-card-text class="text-center pt-8 pb-6">
          <div class="spinner-container mb-4">
            <div class="custom-spinner"></div>
          </div>
          
          <div class="text-subtitle-1 mb-1">
            {{ $t('Enterprises.AdminEnvironmentDialog.Creating_Admin_Environment') }}
            <!-- Creating Admin Environment -->
          </div>
          <div class="text-body-2 text-grey">
          {{ $t('Enterprises.AdminEnvironmentDialog.Please_Wait') }}
            <!-- Please Wait -->
          </div>
        </v-card-text>
        <v-card-actions class="pb-6 justify-center">
          <v-btn 
            color="#0cbf67"
            class="text-none px-8"
            elevation="0"
            height="36"
          >
            <span class="white--text">
            {{ $t('Enterprises.AdminEnvironmentDialog.Cancel') }}
              <!-- CANCEL -->
            </span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  export default {
    name: 'AdminEnvironmentDialog',
    data: () => ({
      dialog: true
    }),
    methods: {
      closeDialog() {
        this.dialog = false
      }
    }
  }
  </script>
  
  <style scoped>
  .environment-dialog {
    border-radius: 4px;
    overflow: hidden;
  }
  
  .dialog-header {
    background-color:#0cbf67;
    height: 48px;
  }
  
  .close-btn::before {
    display: none;
  }
  
  .spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 48px;
  }
  
  .custom-spinner {
    width: 24px;
    height: 24px;
    border: 2.5px solid #0cbf67;
    border-top: 2.5px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  :deep(.v-card) {
    border-radius: 4px !important;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1) !important;
  }
  
  :deep(.v-btn) {
    letter-spacing: normal !important;
    text-transform: none !important;
    font-weight: normal !important;
    font-size: 14px !important;
  }
  
  :deep(.v-card-text) {
    padding: 16px 24px !important;
  }
  </style>