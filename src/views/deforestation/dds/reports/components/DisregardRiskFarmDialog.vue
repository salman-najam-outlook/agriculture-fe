<template>
    <v-dialog v-model="visible" max-width="800px">
      <v-card>
        <v-toolbar color="#117443" class="white--text mb-5" flat>
          <v-toolbar-title class="font-weight-bold">
            {{ title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon class="white--text" @click="onCancel">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="pt-5">
        <div>
          <h3 style="color:black">
            {{  bodyText }}
          </h3>
        </div>
      </v-card-text>
        <v-card-text class="black--text">
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn outlined color="primary" @click="onCancel" width="112">
              {{ $t("cancel") }}
            </v-btn>
            <v-btn color="primary" @click="confirmSelection" width="112">
              {{ buttonText }}
            </v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  export default {
    props: {
      visible: {
        type: Boolean,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      bodyText: {
        type: String,
        required: true,
      },
      buttonText: {
        type: String,
        required: true,
      },
      onCancel: {
        type: Function,
        required: true,
      },
      onConfirm: {
        type: Function,
        required: true,
      },
      toolbarColor: {
        type: String,
        default: "#117443",
      }
    },
   
    methods: {
      confirmSelection() {
        this.onConfirm(this.selectedOptions);
      },
    },
  };
  </script>

<style scoped>
.checkbox-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.checkbox-style .v-input--selection-controls__input {
  width: 18px;
  height: 18px;
}

.checkbox-style .v-label {
  margin-left: 8px;
}

</style>