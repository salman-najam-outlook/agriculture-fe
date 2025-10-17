<template>
  <v-dialog
    transition="dialog-top-transition"
    max-width="600"
    v-model="dialog"
    @click:outside="closeModal"
  >
    <v-card class="">
      <v-toolbar color="primary" dark flat dense>
        <v-toolbar-title class="font-weight-bold"
          >{{ $t('roleRequest.updateRoleRequest')}}
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon class="white--text" @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-form @submit.prevent="updateRoleRequest" ref="treeForm" v-model="valid">
        <v-card-text>
          <v-row class="mt-5" no-gutters>
            <v-col cols="6">
              <label for="mobile"
                >{{ $t('status')}} <span class="red--text">*</span></label
              >
              <v-select
                :items="statuses"
                item-text="text"
                item-value="val"
                outlined
                dense
                v-model="status"
                :rules="rules.status"
              ></v-select>
            </v-col>
            <v-col cols="6"></v-col>
            <v-col cols="12" v-if="status == 'rejected'">
              <label for="mobile">{{ $t('roleRequest.message')}}</label>
              <v-textarea
                outlined
                dense
                class=""
                v-model="name"
                :rules="rules.name"
              >
              </v-textarea>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions class="justify-end py-5">
          <v-btn outlined color="primary" @click="closeModal">{{ $t('cancel') }}</v-btn>
          <v-btn color="primary" type="submit" :disabled="status == ''"
            >{{ $t('roleRequest.update')}}</v-btn
          >
        </v-card-actions>
      </v-form>
    </v-card>
    <!-- </template> -->
  </v-dialog>
</template>
<script>
import RoleRequest from "@/_services/RoleRequest.js";
import loading from "@/mixins/LoadingMixin";

export default {
  mounted() {
    // console.log(this.editedData.id)
  },
  props: {
    dialog: {
      required: false,
      type: Boolean,
    },
    editedData: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      valid: true,
      name: "",
      status: "",
      statuses: [
        { text: this.$t('memberDataSection.approve'), val: "approved" },
        { text: this.$t('memberDataSection.reject'), val: "rejected" },
      ],
      rules: {
        status: [(v) => !!v || this.$t("statusFieldIsRequired")],
        name: [(v) => !!v || this.$t("rejectionMessageIsRequired")],
      },
    };
  },
  methods: {
    async updateRoleRequest() {
      if (!this.$refs.treeForm.validate()) return;

      this.startLoading();
      try {
        const d = await RoleRequest.updateRoleRequest(this.editedData.id, {
          status: this.status,
          rejectionReason: this.name,
        });
        if (d.code === 200) {
          this.$notify({
            title: "Role Request updated successfully.",
            type: "success",
          });
          this.closeModal(true);
          this.stopLoading();
        } else {
          this.$notify({
            title: this.$t('somethingWentWrong'),
            type: "error",
          });
          this.closeModal();
          this.stopLoading();
        }
      } catch (error) {
        console.log(error);
        this.$notify({
          title: this.$t('somethingWentWrong'),
          type: "error",
        });
        this.closeModal();
        this.stopLoading();
      }
    },

    closeModal(suc = false) {
      this.name = "";
      this.status = "";
      this.$emit("close-modal", suc);
    },
  },
  mixins: [loading],
};
</script>
