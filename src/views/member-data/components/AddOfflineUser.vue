<template>
  <v-dialog
      v-model="openAddOfflineFarmer"
      width="600"
      @click:outside="closeModal"
    >
      <v-card class="custom-card" rounded="0">
        <v-toolbar color="primary" class="white--text" flat :elevation="0">
          <v-toolbar-title class="font-weight-bold">
            {{$t('createNewOfflineFarmer')}}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon class="white--text" @click="closeModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-form 
          ref="addOfflineUser"
          lazy-validation
          autocomplete="off"
        >
          <v-card-text class="black--text">
            <v-row>
              <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                <label for="name">{{ $t('name')}}<span class="red--text">*</span></label>
                <v-text-field
                  id="name"
                  v-model="offlineUser.name"
                  :placeholder="$t('name')"
                  outlined
                  dense
                ></v-text-field>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                <label for="address">{{ $t('address')}}<span class="red--text">*</span></label>
                <v-text-field
                  id="address"
                  v-model="offlineUser.address"
                  :placeholder="$t('address')"
                  outlined
                  dense
                ></v-text-field>
              </div>
            </v-row>
            <div>
            <v-radio-group v-model="radioGroup">
              <v-radio
                :label="$t('offlineFarmerForByingStationOnly')"
                value="local"
              ></v-radio>
              <div v-if="radioGroup === 'local'">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 ">
                  <label>{{$t('buyingStation')}}<span class="red--text">*</span></label>
                  <v-autocomplete 
                    v-model="selectedBuyingStation"
                    :loading="loadingBuyingStation"
                    :items="buyingStations"
                    item-text="fullName"
                    item-value="id"
                    cache-items
                    :search-input.sync="search"
                    dense
                    hide-no-data
                    hide-selected
                    class="mt-1"
                    :placeholder="$t('Select')"
                    outlined
                    return-object
                  >
                  </v-autocomplete>                    
                </div>
              </div>
              <v-radio
                :label="$t('offlineFarmerForAllByingStations')"
                value="global"
              ></v-radio>
            </v-radio-group>
            </div>
            <v-card-actions class="mt-10">
              <v-spacer></v-spacer>
              <v-btn @click="closeModal" outlined right width="116" depressed color="primary">
                  {{ $t('cancel')}}
              </v-btn>
              <v-btn @click="createUser" right width="110" color="primary" 
                :loading="loading"
                :disabled="this.offlineUser.name === '' || this.offlineUser.address ===''"
              >
                  {{ $t('permissions.create')}}
              </v-btn>
            </v-card-actions>
          </v-card-text>
        </v-form>
      </v-card>
    </v-dialog>
</template>

<script>
import UserService from "@/_services/UserService";
import BuyingStationService from "@/_services/BuyingStationService";

export default {
  props: {
    openAddOfflineFarmer: {
      type: Boolean,
      required: true
    }, 
  },
  mounted() {
    this.getBuyingStation();
  },
  watch: {
    async search(val){
      this.search = val;
      await this.getBuyingStation();
    },
  },
  methods: {
    closeModal() {
      this.offlineUser = {
        name: '',
        address: '',
      }
      this.selectedBuyingStation = null;
      this.radioGroup = 'global',
      this.$emit('closeAddOfflineUser')
    },
    async createUser() {
      if (this.offlineUser.name === '' || this.offlineUser.address ==='') {
        return;
      }
      this.loading = true;
      const payload = {
        ...this.offlineUser,
        type: this.radioGroup,
      }
      await UserService.addOfflineUser(payload)
      .then(() => {
        this.loading = false;
      })
      .catch((err) => {
        console.error(err);
        this.loading = false;
      })
      .finally(() => {
        this.$emit('getUsers');
        this.closeModal();
      })
    },
    async getBuyingStation() {
      this.loadingBuyingStation = true;
      let pagination = {
        page: 1,
        itemsPerPage: 100,
      }
      await BuyingStationService.getBuyingStationData(pagination, this.search)
      .then(({data}) => {
        this.buyingStations = data.rows;
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        this.loadingBuyingStation = false;
      })
    }
  },
  data() {
    return {
      buyingStations: [],
      radioGroup: 'global',
      selectedBuyingStation: null,
      loading: false,
      loadingBuyingStation: false,
      debounce: null,
      search: '',
      offlineUser: {
        name: '',
        address: '',
      },
    }
  },
}
</script>
