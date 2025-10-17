<template>
  <v-dialog
    v-model="dialog"
    width="356"
    @click:outside="closeModal"
    content-class="my-custom-dialog"
    transition="slide-x-reverse-transition"
  >
    <v-card min-height="100vh" rounded="0">
      <v-toolbar color="primary" class="fixed  white--text" flat :elevation="0" tile>
        <v-toolbar-title class="font-weight-bold">
         {{ $t('dashboardv2.filterByFarm') }}
        </v-toolbar-title>
        <v-spacer></v-spacer>

        <v-btn icon class="white--text" @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="pt-5">
        <v-row class="fixed" no-gutters>
          <v-col cols="12">
            <v-text-field
              outlined
              dense
              small
              :placeholder="$t('dashboardv2.searchFarms')"
              v-model="search"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="scroll-area">
          <v-virtual-scroll
            :bench="4"
            :items="filteredFarms"
            height="800"
            item-height="50"
          >
            <template v-slot:default="{ item }">
                <v-checkbox
                  v-model="selected"
                  multiple
                  :label="item.farmName"
                  :value="item.id"
                ></v-checkbox>
            </template>
          </v-virtual-scroll>
        </v-row>
        <v-row class="fixed">
          <v-col cols="12" class="d-flex justify-space-around">
            <v-btn outlined width="130" color="primary" @click="clear">
              {{ this.$t("clearAll") }}
            </v-btn>
            <v-btn width="130" color="primary" @click="submit">
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
  mounted() {
    if (this.preSelectedFarm.length) {
      this.selected = this.preSelectedFarm;
    }
  },
  computed: {
    dialog() {
      return this.dialogI;
    },
    farms() {
      return [ ...this.farmList, { farmName: 'The bug', id : 999999} ]
    },
    filteredFarms() {
      const searchTerm = this.search?.toLowerCase() || '';
      return searchTerm === ''
      ? this.farms
      : this.farms.filter(farm => farm?.farmName?.toLowerCase().includes(searchTerm)); 
    },
  },
  props: {
    dialogI: {
      type: Boolean,
      required: true,
    },
    farmList: {
      required: true
    },
    preSelectedFarm: {
      type: Array,
      default: () => [],
    }
  },
  methods: {
    closeModal() {
      this.$emit("closeDialog");
    },
    submit() {
      this.$emit("farmFilterDone", this.selected)
    },
    clear() {
      this.$emit("farmFilterDone", [])
    }
  },
  data() {
    return {
      selected: [],
      search: '',
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
.farmName {
  height: 100%;
  background: blue;
  padding: 0 12px;
  display: flex;
  align-items: center;
  color: #fff;
}
.scroll-area {
  height: 77vh;
  overflow-y: hidden;
}
.scroller {
  height: 100%;
}
</style>