<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <div class="d-flex mb-4">
        <h2>{{ $t("memberDataSection.farmerView") }}</h2>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          outlined
          dark
          class="mr-2 mb-2"
          @click="$router.go(-1)"
        >
          {{ $t("back") }}
        </v-btn>
        <v-btn
          color="primary"
          dark
          class="mr-2 mb-2"
          v-show="$can($permissions.can_update_farm.value)"
          @click="$router.push({ name: 'FarmRegistartion' })"
        >
          {{ $t("edit") }}
        </v-btn>
        <v-btn
          color="error"
          outlined
          dark
          class="mr-2 mb-2"
          v-show="$can($permissions.can_delete_farm.value)"
          @click="$router.push({ name: 'FarmRegistartion' })"
        >
          {{ $t("addEdituser.deactivateAct") }}
        </v-btn>
      </div>
      <template v-if="hasFarmer">
        <v-card class="cards mb-6" flat>
          <v-row class="mb-4">
            <div class="text-block">
              <div class="img-box mr-4">
                <v-img
                  v-if="farmer.user && farmer.user.profilePicUrl"
                  class="profile-img"
                  :src="farmer.user.profilePicUrl"
                ></v-img>
                <v-img v-else class="profile-img" src="/img/user.jpg"></v-img>
              </div>
              <div class="inner-text-block">
                <h4 class="mb-2">
                  {{ farmer.user.firstName }} {{ farmer.user.middleName }}
                  {{ farmer.user.lastName }}
                </h4>
              </div>
            </div>
          </v-row>
          <v-row>
            <v-col lg="3" md="4" sm="6" xs="12">
              <v-card min-height="120" class="pa-2 green2 elevation-0">
                <v-list class="green2">
                  <v-list-item three-line>
                    <v-list-item-content>
                      <v-list-item-subtitle
                        >{{ $t("userslist.registrationDate") }}
                        <v-tooltip top color="black" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">
                              mdi-information-outline
                            </v-icon>
                          </template>
                          <span>{{ $t("userslist.registrationDate") }}</span>
                        </v-tooltip>
                      </v-list-item-subtitle>
                      <v-list-item-title class="text-h6 mt-2">
                        {{ farmer.user.registration || "N/A" }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
            <v-col lg="3" md="4" sm="6" xs="12">
              <v-card min-height="120" class="pa-2 green2 elevation-0">
                <v-list class="green2">
                  <v-list-item three-line>
                    <v-list-item-content>
                      <v-list-item-subtitle>
                        {{ this.$t("country") }}
                        <v-tooltip top color="black" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">
                              mdi-information-outline
                            </v-icon>
                          </template>
                          <span>{{ this.$t("country") }}</span>
                        </v-tooltip>
                      </v-list-item-subtitle>
                      <v-list-item-title class="text-h6 mt-2">
                        {{ farmer.user.country || "N/A" }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
            <v-col lg="3" md="4" sm="6" xs="12">
              <v-card min-height="120" class="pa-2 green2 elevation-0">
                <v-list class="green2">
                  <v-list-item three-line>
                    <v-list-item-content>
                      <v-list-item-subtitle
                        >{{ this.$t("region") }}
                        <v-tooltip top color="black" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">
                              mdi-information-outline
                            </v-icon>
                          </template>
                          <span>{{ this.$t("region") }}</span>
                        </v-tooltip>
                      </v-list-item-subtitle>
                      <v-list-item-title class="text-h6 mt-2">
                        {{ farmer.user.country || "N/A" }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
            <v-col lg="3" md="4" sm="6" xs="12">
              <v-card min-height="120" class="pa-2 green2 elevation-0">
                <v-list class="green2">
                  <v-list-item three-line>
                    <v-list-item-content>
                      <v-list-item-subtitle>
                        {{ this.$t("email") }}
                        <v-tooltip top color="black" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">
                              mdi-information-outline
                            </v-icon>
                          </template>
                          <span>{{ this.$t("email") }}</span>
                        </v-tooltip>
                      </v-list-item-subtitle>
                      <v-list-item-title class="text-h6 mt-2">
                        {{ farmer.user.email || "N/A" }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
            <v-col lg="3" md="4" sm="6" xs="12">
              <v-card min-height="120" class="pa-2 green2 elevation-0">
                <v-list class="green2">
                  <v-list-item three-line>
                    <v-list-item-content>
                      <v-list-item-subtitle
                        >{{ $t("deforestation.phoneNumber") }}
                        <v-tooltip top color="black" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">
                              mdi-information-outline
                            </v-icon>
                          </template>
                          <span>{{ $t("deforestation.phoneNumber") }}</span>
                        </v-tooltip>
                      </v-list-item-subtitle>
                      <v-list-item-title class="text-h6 mt-2">
                        {{ farmer.user.mobile || "N/A" }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
            <v-col lg="3" md="4" sm="6" xs="12">
              <v-card min-height="120" class="pa-2 green2 elevation-0">
                <v-list class="green2">
                  <v-list-item three-line>
                    <v-list-item-content>
                      <v-list-item-subtitle>
                        {{ this.$t("reports.gen") }}
                        <v-tooltip top color="black" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">
                              mdi-information-outline
                            </v-icon>
                          </template>
                          <span>{{ this.$t("reports.gen") }}</span>
                        </v-tooltip>
                      </v-list-item-subtitle>
                      <v-list-item-title class="text-h6 mt-2">
                        {{ farmer.user.gender || "N/A" }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
            <v-col lg="3" md="4" sm="6" xs="12">
              <v-card min-height="120" class="pa-2 green2 elevation-0">
                <v-list class="green2">
                  <v-list-item three-line>
                    <v-list-item-content>
                      <v-list-item-subtitle
                        >{{ this.$t("farm.provinceState") }}
                        <v-tooltip top color="black" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">
                              mdi-information-outline
                            </v-icon>
                          </template>
                          <span>{{ this.$t("farm.provinceState") }}</span>
                        </v-tooltip>
                      </v-list-item-subtitle>
                      <v-list-item-title class="text-h6 mt-2">
                        {{ farmer.user.state || "N/A" }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
            <v-col lg="3" md="4" sm="6" xs="12">
              <v-card min-height="120" class="pa-2 green2 elevation-0">
                <v-list class="green2">
                  <v-list-item three-line>
                    <v-list-item-content>
                      <v-list-item-subtitle>
                        {{ this.$t("userslist.cityTown") }}
                        <v-tooltip top color="black" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">
                              mdi-information-outline
                            </v-icon>
                          </template>
                          <span>{{ this.$t("userslist.cityTown") }}</span>
                        </v-tooltip>
                      </v-list-item-subtitle>
                      <v-list-item-title class="text-h6 mt-2">
                        {{ farmer.user.city || "N/A" }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
            <v-col lg="3" md="4" sm="6" xs="12">
              <v-card min-height="120" class="pa-2 green2 elevation-0">
                <v-list class="green2">
                  <v-list-item three-line>
                    <v-list-item-content>
                      <v-list-item-subtitle>
                        {{ this.$t("address") }}
                        <v-tooltip top color="black" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">
                              mdi-information-outline
                            </v-icon>
                          </template>
                          <span>{{ this.$t("address") }}</span>
                        </v-tooltip>
                      </v-list-item-subtitle>
                      <v-list-item-title class="text-h6 mt-2">
                        {{ farmer.user.address || "N/A" }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
        <v-card flat>
          <v-container fluid>
            <h2 class="ml-2">{{ $t("reports.regions.farms") }}</h2>
          </v-container>
          <farm-list
            class="pa-6"
            :headers="farmListHeader"
            :farms="farms"
            :totalFarms="totalUserFarm"
            :toggleSelection="false"
            @fetchFarmData="getUserFarmDetail"
          />
        </v-card>
        <!-- <div class="footer-card mt-10">
          <div class="btn-block mr-6">
            <v-btn
              @click="$router.go(-1)"
              x-large
              min-width="120"
              depressed
              color="primary"
              outlined
              class="views-btn mr-4"
              >{{ $t("back") }}</v-btn
            >
            <v-btn
              :to="{ name: 'view_all_farms', params: { id: farmer.user.id } }"
              x-large
              min-width="120"
              color="primary"
              class="views-btn"
              >{{ $t("memberDataSection.viewAllFarms") }}</v-btn
            >
          </div>
        </div> -->
      </template>
      <v-card v-if="!hasFarmer && !mixingIsLoading">
        <div class="py-16 text-center">
          <img src="/icons/nodata.svg" /><br />
          <strong class="red--text">
            {{ $t("noRecordFound") }}
          </strong>
        </div>
      </v-card>
    </v-container>
  </div>
</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import { mapGetters } from "vuex";
import { convertSizeIntoBaseUnit } from "@/utils.js";
import _ from "lodash";
import FarmList from "./components/FarmList.vue";

export default {
  components: { FarmList },
  async mounted() {
    this.startLoading();
    this.getUserFarmDetail();
    this.$store
      .dispatch("memberData/getFarmerDetail", {
        userId: this.$route.params.id,
      })
      .then(() => {
        this.stopLoading();
      })
      .catch(() => this.stopLoading());
  },
  computed: {
    ...mapGetters({
      farmer: "memberData/farmerDetail",
      farms: "memberData/userAllFarms",
      totalUserFarm: "memberData/userFarmCount"
      // farms: state => state.memberData.farmers.farmerViewAllFarms.farms,
    }),
    hasFarmer() {
      return !_.isEmpty(this.farmer);
    },
  },
  data() {
    return {
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: false,
          to: { name: "Users" },
          exact: true,
        },
        {
          text: this.$t("memberDataSection.farmers"),
          disabled: true,
          href: "breadcrumbs_link_1",
        },
        {
          text: this.$t("memberDataSection.farmersDetails"),
          disabled: true,
          href: "breadcrumbs_link_1",
        },
      ],
      farmListHeader: [
        {
          text: this.$t("farmName"),
          align: "start",
          value: "farmName",
          class: "black--text",
        },
        {
          text: this.$t("deforestation.dimitraFarmId"),
          align: "start",
          value: "dimitraFarmId",
          class: "black--text",
        },
        {
          text: this.$t("farm.farmId"),
          align: "start",
          value: "id",
          class: "black--text",
        },
        {
          text: this.$t("country"),
          align: "start",
          value: "country",
          class: "black--text",
        },
        {
          text: this.$t("deforestation.farmAddress"),
          align: "start",
          value: "farmAddress",
          class: "black--text",
        },
        {
          text: this.$t("region"),
          align: "start",
          value: "region",
          class: "black--text",
        },
        {
          text: this.$t("size"),
          align: "start",
          value: "size",
          class: "black--text",
        },
        {
          text: this.$t("farm.regDate"),
          align: "start",
          value: "date",
          class: "black--text",
        },
        {
          text: "",
          align: "start",
          value: "action",
          class: "black--text",
        },
      ],
    };
  },
  methods: {
    convertSizeIntoBaseUnit,
    getUserFarmDetail(options) {
      this.startLoading()
      this.$store
        .dispatch("memberData/getFarmersViewAllFarms", {
          ...options,
          userId: this.$route.params.id,
        })
        .then(() => {
          this.stopLoading();
        })
        .catch(() => this.stopLoading());
    },
  },
  mixins: [loadingMixin, getPermittedActions],
};
</script>
<style lang="scss" scoped>
::v-deep .profile-img {
  height: 134px;
  width: 134px;
  border-radius: 50%;
}

::v-deep .cards {
  padding: 40px;
}

::v-deep .text-block {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

::v-deep .card-titles {
  height: 54px;
  background: #e5f8f1;
  line-height: 26px;
}

::v-deep .no-radius {
  border-radius: 0px;
}

::v-deep .height-300 {
  height: 300px;
}

::v-deep .row-box {
  display: flex;
  flex-wrap: wrap;
}

::v-deep .cmr {
  margin-right: 31px;
}

@media only screen and (max-width: 700px) {
  ::v-deep .row-box {
    flex-direction: column;
  }
  ::v-deep .cmr {
    margin-right: 0 !important;
    margin-bottom: 16px !important;
  }
}

::v-deep .row-box .flex-1 {
  flex: 0 0 48%;
  margin-bottom: 15px;
}

::v-deep .footer-card {
  display: flex;
  justify-content: center;
}
</style>
