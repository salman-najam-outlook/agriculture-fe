<template>
  <v-dialog v-model="dialog" width="356" @click:outside="closeModal" content-class="my-custom-dialog"
    transition="dialog-bottom-transition">
    <v-card min-height="100vh" class="" rounded="0">
      <v-toolbar color="primary" class="white--text" flat :elevation="0">
        <v-toolbar-title class="font-weight-bold">
          {{ $t('filterByCrops') }}
        </v-toolbar-title>
        <v-spacer></v-spacer>

        <v-btn icon class="white--text" @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="pt-5">
        <v-row no-gutters>
          <v-col cols="12">
            <v-text-field
              outlined
              dense
              small
              v-model="cropSearch"
              :placeholder="$t('searchCrops')"
            ></v-text-field>
          </v-col>
          <v-radio-group v-model="cropRadioModel">
            <v-col v-for="cropType in cropTypes" :key="cropType.id" cols="12">
              <v-radio color="primary" :value="cropType.id" :label="cropType.name"></v-radio>
            </v-col>

          </v-radio-group>
          <v-col></v-col>
        </v-row>
        <v-row class="fixed">
          <v-col cols="12" class="d-flex justify-space-around">
            <v-btn @click="clearAll" outlined width="130" color="primary">
              {{ this.$t("clearAll") }}
            </v-btn>
            <v-btn @click="emitDone" width="130" color="primary">
              {{ this.$t("done") }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
  
  <script>
  // import DashboardReportService from "@/_services/DashboardReportService";
  export default {
    data() {
      return {
        cropSearch: '',
        cropTypes: [],
        cropRadioModel: ''
      }
    },
  computed: {
    dialog() {
      return this.dialogI;
    },
  },
  watch: {
    cropSearch: {
      handler(nV) {
        if(nV) {
          this.cropTypes = this.cropTypesList.filter(crop => {
            if(crop.name.toLowerCase().indexOf(nV) > -1) {
              return true
            } else {
              return false
            }
          })
        } else {
          this.cropTypes = this.cropTypesList
        }
      },
      immediate: true
    }
  },
  props: {
    dialogI: {
      type: Boolean,
      required: true,
    },
    cropTypesList: {
      type: Array,
      required: true
    },
    currentId:{
      type: Number,
      required: false
    }
  },
  methods: {
    closeModal() {
      console.log("emit")
      this.$emit("closeDialog");
    },
    emitDone() {
      console.log("emit")
      this.$emit("cropFilterDone", this.cropRadioModel)
    },
    clearAll() {
      this.$emit("cropFilterDone", null)
    }
  },
  async mounted() {
    console.log('crop filter mounted', this.currentId)
    if(this.currentId) {
      this.cropRadioModel = this.currentId
    }

  }
};
</script>
  
<style scoped>
::v-deep .my-custom-dialog {
  position: absolute;
  top: 0;
  min-height: 100%;
  right: 0;
  margin-right: 0px;
  margin-top: 0px;
}
.fixed{
  position: sticky;
  bottom: 0;
  background: #fff;
}
</style>