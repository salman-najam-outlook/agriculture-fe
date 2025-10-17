<template>
  <v-container>
    <template>
      <div class="text-center">
        <v-dialog v-model="dialog" width="500" persistent :retain-focus="false">
          <v-card class="custom-card" rounded="0">
            <v-toolbar color="secondary" class="white--text">
              <v-toolbar-title class="font-weight-bold">
                {{ $t("marketplace.products.addProduct") }}
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon class="white--text" @click="closeModal">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-form ref="addUser" lazy-validation autocomplete="off">
              <v-card-text class="black--text">
                <v-row>
                  <v-col cols="12" class="text-center">
                    <img class="py-4" src="/img/marketplace/check_icon.svg" />
                    <div class="mb-5 mt-5 text-md-center">
                      {{ $t("marketplace.products.addProductSuccessMsg") }}
                    </div>

                  </v-col>
                </v-row>
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
      this.$emit("saveData", answer);
    },

  },
};
</script>

<style></style>