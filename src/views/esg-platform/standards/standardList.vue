  <template>
    <div>
      <breadcrumb :items="breadcrumbs"></breadcrumb>
      <v-container fluid>
        <div class="d-flex mb-8">
          <h2>{{ $t("esgPlatform.title") }}</h2>
          <v-spacer></v-spacer>
          <div class="d-flex mt-1">
            <v-btn color="primary" class="mr-3" outlined dark
                @click="$router.push({ name: 'esgAccountDashboard' })">
                {{ $t('close') }}
            </v-btn>
            <v-btn color="primary" dark class="mr-2" width="170" @click="openCreateStandard = true">
              {{ $t("esgPlatform.addNewStandard") }}
            </v-btn>
          </div>
        </div>
        <v-card elevation="0" class="mt-4 ml-4">
          <v-row v-for="item in standards" :key="item.id" class="ml-2">
            <v-col cols="12">
              <!-- Title -->
              <h3 class="font-weight-bold">{{ item.title }}</h3>

              <v-row class="mt-2">
                <!-- Image Section -->
                <v-col cols="2">
                  <v-img :src="item.sealUrl" cover height="160px" width="250px" class="rounded-lg">
                  </v-img>
                </v-col>

                <!-- Content Section -->
                <v-col cols="9">

                  <!-- Description -->
                  <p class="text-body-4 black--text text--darken-2 justify-start align-start"
                    style="text-align: justify !important; vertical-align: top !important; "
                    v-html="item.description">
                  </p>

                </v-col>

              </v-row>
              <v-row class="px-4" align="center" style="margin-top: 0px;">
                <!-- Status -->
                <div class="d-flex align-center ">

                  <span class="font-weight-bold mr-2"> {{ $t('esgPlatform.status') }}:</span>
                  <v-btn small rounded min-width="150" depressed class="red-button" height="34"
                    v-if="item.isActive === false">
                    {{ $t("inactive") }}
                  </v-btn>
                  <v-btn small rounded min-width="150" depressed class="green-button" height="34"
                    v-if="item.isActive === true">
                    {{ $t("active") }}
                  </v-btn>
                </div>
                <!-- Action Buttons -->
                <v-col class="d-flex justify-end align-center">
                  <v-btn x-small fab color="primary" outlined class="ml-2" @click="getDetailStandard(item.id)">
                    <v-icon>mdi-eye-outline</v-icon>
                  </v-btn>

                  <v-btn x-small fab color="primary" outlined class="ml-2" @click="handleEditStandard(item)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn v-if="!item.isDefault" x-small fab color="primary" outlined class="ml-2"
                    @click="removeStandardConfirmation(item)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-divider class="mt-4"></v-divider>

            </v-col>
          </v-row>
        </v-card>
      </v-container>
      <CreateStandard :dialogI="openCreateStandard" @closeModal="openCreateStandard = false" />
      <confirm-box :title="confirmDelete.title" :message="confirmDelete.message"
        :cancelBtnText="confirmDelete.cancelBtnText" :confirmBtnText="confirmDelete.confirmBtnText"
        :dialog="confirmDeleteDialog" @cancel:action="confirmDeleteDialog = false" @continue:action="removeStandard" />
    </div>
  </template>

<script>
import CreateStandard from './components/addStandardDiaglog.vue';
import loadingMixin from "@/mixins/LoadingMixin";
import ConfirmBox from "@/components/ConfirmBox";
import ESGService from "@/_services/EsgService";

export default {
  components: {
    CreateStandard,
    "confirm-box": ConfirmBox,
  },
  computed: {
  },
  data() {
    return {
      openCreateStandard: false,
      selectedItem: null,
      standards: [],
      search: "",
      headerProps: {
        "sort-icon": "mdi-menu-up",
      },
      breadcrumbs: [
        {
          text: this.$t("esgPlatform.esgPlatform"),
          link: true,
          exact: true,
          disabled: true,
        },
        {
          text: this.$t("esgPlatform.standards"),
          disabled: false,
          to: { name: "eudrDashboard" },
        },
      ],
      confirmDeleteDialog: false,
      confirmDelete: {
        title: this.$t("esgPlatform.confirmation"),
        message: this.$t("esgPlatform.standardDeleteConfirmation"),
        confirmBtnText: this.$t("confirm"),
        cancelBtnText: this.$t("cancel"),
        confirmData: this.selectedItem,
      },
    };
  },
  created() { },
  mounted() {
    this.fetchStandards();
  },
  watch: {
  },
  methods: {
    async fetchStandards() {
      this.startLoading();
      const type = 'Standard';
      try {
        const response = await ESGService.getEsgStandards(type);
        this.standards = response.data?.rows;
       } catch (error) {
        console.error(error);
      } finally {
        this.stopLoading();
      }
    },
    getDetailStandard(id) {
      this.$router.push({ name: "previewEsgStandard", params: { id }, query: { mode: 'preview' } });
    },
    handleEditStandard(item) {
      this.$router.push({
        name: "editEsgStandard",
        params: { id: item.id },
      });
    },
    removeStandardConfirmation(item) {
      this.selectedItem = item;
      this.confirmDeleteDialog = true;
    },
    async removeStandard() {
      try {
        await ESGService.deleteEsgStandard(this.selectedItem.id);
        this.$notify({
          title: this.$t("esgPlatform.standardDeletedSuccessfully"),
          type: "success",
        });
      }
      catch (error) {
        console.error(error);
      }
      finally {
        this.fetchStandards();
        this.confirmDeleteDialog = false;
      }
    },
  },
  mixins: [loadingMixin],
};
</script>

<style lang="scss" scoped>
::v-deep .v-data-table-header__icon {
  color: white !important;
}
</style>
