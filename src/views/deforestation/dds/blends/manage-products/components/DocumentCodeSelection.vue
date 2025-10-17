<template>
  <v-container>
    <v-dialog v-model="dialogVisible" max-width="900px" @click:outside="closeDialog">
      <v-card>
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title class="white--text">
            {{ $t("blends.manageProducts.selectDocumentCode") }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
          <v-radio-group v-model="selectedCode" :mandatory="false">
            <v-row v-for="code in documentCodes" :key="code.documentCode" no-gutters>
              <v-col cols="12">
                <v-radio :value="code.documentCode">
                  <template v-slot:label>
                    <div class="code-column">
                      <span class="font-weight-black">{{ code.documentCode }}</span>
                    </div>
                    <div class="title-column">
                      <span class="font-weight-black">{{ code.title }}</span>
                    </div>
                  </template>
                </v-radio>
                <p class="description text-justify">{{ code.description }}</p>
              </v-col>
            </v-row>
          </v-radio-group>
        </v-card-text>

        <v-card-actions class="d-flex justify-space-between align-center pb-6">
          <!-- Disabled until super-admin role is created -->
          <div
            class="d-flex align-center color-grey"
          >
            <v-icon
              color="white"
              style="background-color: grey; border-radius: 50%; padding: 4px; font-size: 24px; margin-right: 8px;"
            >
              mdi-plus
            </v-icon>
            <span style="color: gray; font-weight: 500;">
              {{ $t("blends.manageProducts.addNewDocumentCode") }}
            </span>
          </div>
          <div>
            <v-btn outlined color="primary" @click="closeDialog" class="mr-2">
              {{ $t("blends.manageProducts.cancel") }}
            </v-btn>
            <v-btn color="primary" dark @click="confirmSelection">
              {{ $t("blends.manageProducts.confirm") }}
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <DocumentCodeForm
      v-if="showDocumentFormDialog"
      :dialog="showDocumentFormDialog"
      @save="saveDocumentCodes"
      @close="showDocumentFormDialog = false"
    />
  </v-container>
</template>

<script>
import DocumentCodeForm from "./DocumentCodeForm.vue";
import { mapActions, mapGetters } from "vuex";
import loadingMixin from "@/mixins/LoadingMixin";

export default {
  components: {
    DocumentCodeForm,
  },
  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
    selectedEudrCode: {
      type: String,
      default: null,
    },
  },
  mixins: [loadingMixin],
  data() {
    return {
      dialogVisible: this.dialog,
      selectedCode: this.selectedEudrCode || null,
      showDocumentFormDialog: false,
    };
  },
  watch: {
    dialog(val) {
      this.dialogVisible = val;
      if (val) {
        this.selectedCode = null;
      }
    },
  },
  computed: {
    ...mapGetters("documentCodes", ["getDocumentCodes"]),
    documentCodes() {
      return this.getDocumentCodes;
    },
  },
  mounted() {
    this.loadDocumentCodes();
  },
  methods: {
    ...mapActions("documentCodes", ["fetchDocumentCodes", "addDocumentCode"]),
    closeDialog() {
      this.$emit("close");
    },
    confirmSelection() {
      if (this.selectedCode) {
        this.$emit("selectCode", this.selectedCode);
        this.closeDialog();
      }
    },
    openAddNewDocumentCodeForm() {
      this.showDocumentFormDialog = true;
    },
    async loadDocumentCodes() {
      this.startLoading();
      try {
        await this.fetchDocumentCodes();
      } catch (error) {
        console.error("Error loading document codes:", error);
      } finally {
        this.stopLoading();
      }
    },
    async saveDocumentCodes(documentCodeData) {
      this.startLoading();
      try {
        const resp = await this.addDocumentCode(documentCodeData);
        if (!resp?.errors) {
          this.$notify({
            title: this.$t("blends.manageProducts.documentCodeSaved"),
            type: "success",
          });
          this.showDocumentFormDialog = false;
        } else {
          const documentCodeDuplicate = resp .errors?.find(err => err.statusCode == 409)
          if (documentCodeDuplicate) {
            this.$notify({
            title: this.$t("blends.manageProducts.documentCodeDuplicate"),
            type: "error",
          });
          }
        }
      } catch (error) {
        console.error("Error saving document code:", error);
      } finally {
        this.stopLoading();
      }
    },
  },
};
</script>

<style scoped>
.description {
  font-size: 0.9rem;
  color: #555;
  margin-top: 4px;
  padding-left: 113px;
}
.font-weight-bold {
  font-weight: bold;
}
.code-column {
  width: 80px;
}

.title-column {
  width: calc(100% - 100px);
}

</style>
