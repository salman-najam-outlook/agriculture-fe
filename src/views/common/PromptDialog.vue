<template>
  <v-container>
    <template>
      <div class="text-center">
        <v-dialog v-model="dialog" width="500" @click:outside="closeModal" :retain-focus="false">
          <v-card class="custom-card" rounded="0">
            <v-toolbar color="secondary" class="white--text">
              <v-toolbar-title class="font-weight-bold">
                Warning
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon class="white--text" @click="closeModal">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-form ref="addUser" lazy-validation autocomplete="off">
              <v-card-text class="black--text">
                <v-row>
                  <v-col cols="12" >
                    <div class="mb-5 mt-5 text-md-center">
                    Your data might be lost.<br>
                   Click on save button to preserve your data
                    </div>
                    
                  </v-col>
                </v-row>
                <v-divider class="mt-5"></v-divider>
                <v-card-actions class="mt-10" style="padding-right: 0">
                  <v-spacer></v-spacer>
                  <v-btn outlined class="mr-2" right height="44" depressed color="primary"
                    @click="saveData(false)">
                    Discard Changes
                  </v-btn>
                  <v-btn right height="44" width="116" color="primary" @click="saveData(true)">
                    Continue
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-form>
          </v-card>
        </v-dialog>
      </div>
    </template>
  </v-container>
</template>
<script>
export default {
  data() {
        return {
            error: '',
        };
    },
  computed: {
    dialog() {
      return this.dialogI;
    },
  },
  props: {
    dialogI: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    closeModal() {
      this.$emit("closeDialog");
    },
    saveData(answer) {
      this.$emit("saveData",answer);
    },
    
  },
};
</script>

<style>

</style>
