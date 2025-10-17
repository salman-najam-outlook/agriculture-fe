<template>
  <v-dialog
    v-model="dialog"
    width="356"
    @click:outside="closeModal"
    content-class="my-custom-dialog"
    transition="dialog-bottom-transition"
  >
    <v-card min-height="100vh" class="" rounded="0">
      <v-toolbar color="primary" class="white--text" flat :elevation="0">
        <v-toolbar-title class="font-weight-bold">
          {{ $t("reports.dashboard.showReport")}}
        </v-toolbar-title>
        <v-spacer></v-spacer>

        <v-btn icon class="white--text" @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="pt-5">
        <v-row no-gutters>
          <v-col cols="12">
            <v-checkbox v-model="selectAllModel" :label="$t('reports.dashboard.selectAll')"></v-checkbox>
            <hr />
          </v-col>
          <v-col :key="value.label"  v-for="(value) in checkboxGroup" cols="12">
            <v-checkbox v-model="value.show" :label="value.label"></v-checkbox>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="d-flex justify-space-around">
            <v-btn @click="configureDone" width="130" color="primary">
              {{ this.$t("done") }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      checkboxGroup: {
        regions: {label: this.$t("region"), show: true},
        farmers: {label: this.$t("farmers"), show: true},
        crops: {label: this.$t("crops"), show: true},
        yield: {label: this.$t("reports.yield"), show: true},
        soil: {label: this.$t("reports.dashboard.soil"), show: true},
        pests: {label: this.$t("pests"), show: false},
        equipment: {label: this.$t("equipment"), show: false},
        goals: {label: this.$t("goalsAchieved"), show: false}
      }
    }
  },
  computed: {
    dialog() {
      return this.dialogI;
    },
    selectAllModel: {
      get() {
        let tmpVal = true
        for(let key in this.checkboxGroup) {
          if(!this.checkboxGroup[key].show ){
            tmpVal = false
          }
        }
        return tmpVal
      }, 
      set(nV) {
        if(nV) {
          for(let key in this.checkboxGroup) {
            this.checkboxGroup[key].show = true
          }
        } else {
          for(let key in this.checkboxGroup) {
            this.checkboxGroup[key].show = false
          }
        }
        return nV
      }
    }
  },
  props: {
    dialogI: {
      type: Boolean,
      required: true,
    },
    showHideConfig: {
      type: Object,
      required: true
    }
  },
  methods: {
    closeModal() {
      this.$emit("closeDialog");
    },
    configureDone() {
      this.$emit("configureDone", this.checkboxGroup)
    }
  },
  mounted() {
    console.log("config dialog mounted")
    if(Object.keys(this.showHideConfig).length > 0) {
      this.checkboxGroup = this.showHideConfig
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
</style>