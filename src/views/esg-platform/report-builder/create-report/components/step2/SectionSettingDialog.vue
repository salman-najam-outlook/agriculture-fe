<template>
  <v-dialog v-model="internalDialog" max-width="600" persistent>
    <v-card>
      <v-card-title class="white--text" style="background: #167a3c">
        Section Settings
        <v-spacer />
        <v-btn icon @click="close" class="white--text">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="localSettings.backgroundColor"
                label="Background Color"
                prepend-inner-icon="mdi-format-color-fill"
                type="color"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="localSettings.fontColor"
                label="Font Color"
                prepend-inner-icon="mdi-format-color-text"
                type="color"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-select
                v-model="localSettings.font"
                :items="fonts"
                label="Font"
                outlined
                dense
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-select
                v-model="localSettings.timeline"
                :items="timelines"
                label="Select Section Timeline"
                hint="This timeline applies to this section only"
                persistent-hint
                outlined
                dense
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-checkbox
                v-model="localSettings.locked"
                label="Lock Section for Sub-Organization"
                hint="If locked, this section cannot be modified by sub-orgs."
                persistent-hint
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn text @click="close">Cancel</v-btn>
        <v-btn color="success" @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'SectionSettingsDialog',
  props: {
    value: Boolean,
    settings: Object
  },
  data() {
    return {
      internalDialog: false,
      localSettings: {},
      fonts: ['Poppins', 'Roboto', 'Lato', 'Open Sans', 'Arial'],
      timelines: ['2023 - 2025', '2024 - 2026', '2025 - 2027']
    };
  },
  watch: {
    value(val) {
      this.internalDialog = val;
      this.localSettings = { ...this.settings };
    },
    internalDialog(val) {
      this.$emit('input', val);
    }
  },
  methods: {
    close() {
      this.internalDialog = false;
    },
    save() {
      this.$emit('update:settings', this.localSettings);
      this.internalDialog = false;
    }
  }
};
</script>

<style scoped>
.v-text-field input[type="color"] {
  padding: 0;
  height: 32px;
}
</style>
