<template>
     <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-card color="transparent" v-if="farm">
      <v-container fluid>
        <div class="page-title">
          <!-- <v-btn color="primary" @click="goBack" density="compact" icon="mdi-chevron-left">      <v-icon>mdi-chevron-left</v-icon></v-btn> -->
          <h2 class="text-capitalize">{{ farm.farmName }}</h2>
          <v-spacer></v-spacer>
          <v-btn
            outlined
            color="primary"
            dark
            :to="{
              name: 'Farms',
            }"
          >
            {{ $t("back") }}
          </v-btn>
          <v-btn
                  class="ml-5"
            depressed
            color="primary"
            dark
            :to="{
              name: 'EditFarms',
              params: { farmId: this.$route.params.farmId || this.farm.id },
            }"
            v-show="$can($permissions.can_update_farm.value)"
          >
            {{ $t("farm.editFarm") }}
          </v-btn>
          <v-btn
            class="ml-5"
            depressed
            outlined
            color="error"
            dark
            @click="startDelete"
            v-show="$can($permissions.can_delete_farm.value)"
          >
            {{ $t("farm.deleteFarm") }} 
          </v-btn>
          <!-- <v-btn
				class="ml-5"
				depressed
				color="primary"
				dark
				@click="deleteFarm"
				>
				Delete Farm
			</v-btn> -->
        </div>

        <div class="c-right">
         
        </div>
        <template>
          <v-card class="px-5" flat>
            <v-tabs
              left
              v-model="tab"
              background-color="transparent"
              color="primary"
            >
              <v-tab class="text-capitalize" v-for="item in items" :key="item">
                {{ item }}
              </v-tab>
            </v-tabs>
            <v-divider></v-divider>
            <v-tabs-items v-model="tab" class="mt-5">
              <v-tab-item>
                <information :farm="farm"></information>
              </v-tab-item>
              <!-- <v-tab-item>
                <licence :farm="farm" :dateFormat="format"></licence>
              </v-tab-item> -->
              <v-tab-item>
                <location :farm="farm"></location>
              </v-tab-item>
              <v-tab-item>
              <FarmReports :farm="farm"></FarmReports>
            </v-tab-item>
            </v-tabs-items>
          </v-card>
        </template>
      
      
      </v-container>
    </v-card>

    <v-container fluid v-if="errorCode && !farm">
      <v-card>
        <div class="py-16 text-center">
          <img src="/icons/nodata.svg" /><br />
          <strong class="red--text">
            {{ $t("noRecordFound") }}
          </strong>
        </div>
      </v-card>
    </v-container>

    <v-dialog
      v-model="showDeleteConfirm"
      transition="dialog-top-transition"
      max-width="650"
    >
      <template>
        <v-card rounded="0">
          <v-toolbar color="secondary" class="white--text">
            <v-toolbar-title class="font-weight-bold">
              {{$t('deleteFarmH')}}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon class="white--text" @click="showDeleteConfirm = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text
            class="black--text py-10 font-weight-bold"
            style="font-size: 16px"
          >
            <span>
              {{ $t('deleteFarmMsg') }}
              <br /><br />              
            </span>
          </v-card-text>
          <v-card-actions class="px-4 py-5 justify-center">
            <div>
              <v-spacer></v-spacer>
              <v-btn
                @click="showDeleteConfirm = false"
                outlined
                class="mr-2 px-5"
                right
                height="44"
                depressed
                color="primary"
              >
                {{ $t('cancel') }}
              </v-btn>
              <v-btn
                @click="deleteFarm"
                right
                height="44"
                color="error"
                class="px-5"
              >
              {{ $t('delete') }}
              </v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </div>
  </template>
  
  <script>
  /* eslint-disable */
  import Breadcrumb from "@/components/core/Breadcrumb";
  import FarmService from "@/_services/FarmService";
  import Licence from "./components/Licence.vue";
  import Information from "./components/Information.vue";
  import Location from "./components/Location.vue";
  import FarmReports from "./components/FarmReports.vue";
  // import Geolocation from "./single_farm/Geolocation.vue";
  import loadingMixin from "@/mixins/LoadingMixin";
  import generalMixin from "@/mixins/GeneralMixin"
  import _ from "lodash";


  let  getUserFarmByFarmId,
    getFarmAnimalsCount,
    animalCountByFarmLocationId;

  export default {
    components: {
      breadcrumb: Breadcrumb,
      Licence,
      Information,
      Location,
      FarmReports
      // Geolocation,
    },
    computed: {},
    apollo: {
      // animalsCount: {
      //   query: gql`
      //     query animalsCount {
      //       generalInformationsCount {
      //         calf
      //         dam
      //         heifer
      //         sire
      //         steer
      //         group
      //         male
      //         female
      //         archived
      //         all
      //       }
      //     }
      //   `,
      //   fetchPolicy: "network-only",
      //   update: (data) => data.generalInformationsCount,
      // },
      animalCountByFarmLocationId: {
        query: animalCountByFarmLocationId,
        fetchPolicy: "network-only",
        variables() {
          return {
            farmId: this.$route.params.farmId
              ? Number(this.$route.params.farmId)
              : Number(this.farm.id),
          };
        },
        update: data => data.animalCountByFarmLocationId,
        result({ data }) {
          const { bulls, calves, dryCows, heifer, lactatingCows } =
            data.animalCountByFarmLocationId;
          this.noOfAnimalsInFarm =
            bulls + calves + dryCows + heifer + lactatingCows;
        },
      },
      getFarmAnimalsCount: {
        query: getFarmAnimalsCount,
        fetchPolicy: "network-only",
        skip: () => true,
        variables() {
          return {
            farmId: Number(this.$route.params.farmId),
          };
        },
        update: data => data.getFarmAnimalsCount,
      },
      birthOriginByFarmId: {
        query: `
          query birthOriginByFarmId($farmId: Int!) {
            birthOriginByFarmId(farmId: $farmId)
          }
        `,
        fetchPolicy: "network-only",
        skip: () => true,
        variables() {
          return {
            farmId: Number(this.farm.id),
          };
        },
      },
    },
    data() {
      return {
        errorCode: null,
        noOfAnimalsInFarm: 0,
        showDeleteConfirm: false,
        showRegisterAnimalDialog: false,
        farm: null,
        date: "",
        tab: null,
        farmID: "",
        items: [
          this.$t("farm.farmInfo"),
          this.$t("farm.locationAndSize"),
          this.$t('farm.farmReports')
        ],
        animal: {},
        search: "",
        farmId: "",
        breadcrumbs: [
          {
            text: this.$t("dashboard"),
            disabled: false,
            to: "/",
          },
          {
            text: this.$t("dueDiligence.myFarms"),
            link: true,
            exact: true,
            disabled: false,
            to: { name: "My farm" },
          },
        ],
      };
    },
  
    async mounted() {
      try {
        document.title = "My Farm";
        this.startLoading();
        if (this.$route.params.tabId) {
          this.tab = this.$route.params.tabId;
        }
        if (this.$route.params.farmId) {
          const data = await FarmService.getFarm(this.$route.params.farmId);
          this.stopLoading();
          if (_.isEmpty(data)) {
            this.errorCode = 404;
            return;
          }
          this.farm = data;
        }

      } catch (error) {
        this.stopLoading();
        console.log(error);
        return;
      }
    },
  
    methods: {
      goBack() {
        this.$router.go(-1);
      },
      async startDelete() {
        console.log("start delete farm");
        this.showDeleteConfirm = true;
        // this.$apollo.queries.birthOriginByFarmId.skip = false;
        // let res = await this.$apollo.queries.birthOriginByFarmId.refetch();
        // this.noOfAnimalsInFarm = res.data.birthOriginByFarmId
      },
      async deleteFarm() {
        await this.startLoading();
                FarmService.deactiveFarm(this.$route.params.farmId)
                .then(async(res) => {
                    if (res.success) {
                        await this.stopLoading();
                        this.$router.push({ name: "Farms" });
                        this.$notify({
                            title:this.$t("farm.deleted"),
                            type: "success",
                        });
                    } else {
                        await this.stopLoading();
                        this.$notify({
                            title: this.$t("farm.notDeleted"),
                            type: "error",
                        });
                    }


                })
                .catch(async() => {
                    // console.log(err)
                    await this.stopLoading();

                })
      },
  
      format(inputDate) {
        var date = new Date(inputDate);
        if (!isNaN(date.getTime())) {
          console.log("mm", date.getMonth());
          return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        }
      },
    },
    mixins: [loadingMixin, generalMixin],
  };
  </script>
  <style lang="scss" scoped>
  .c-right {
    padding: 0px 0px 50px !important;
  }
  
  .page-title p {
    color: $primary-color;
  }
  
  .section-boxes1 {
    // border-bottom: 1px solid #ccc;
    padding: 8px;
  }
  .section-boxes1 .boxes-data {
    display: flex;
    justify-content: space-between;
  }
  .section-boxes1 .box-inline-tab {
    display: flex;
    align-items: center;
  }
  .section-boxes1 .circle-img {
    background: paleturquoise;
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  .section-boxes1 .box-deatils-part {
    margin-top: 12px;
    margin-left: 14px;
  }
  .section-boxes1 .box-deatils-part h2 {
    font-size: 13px;
    color: grey;
  }
  .section-boxes1 .box-deatils-part p {
    font-size: 29px;
    margin-top: 1px;
  }
  .three-dot {
    margin-bottom: 9px;
  }
  
  .flex.lg5-custom {
    width: 20%;
    max-width: 80%;
    flex-basis: 20%;
  }
  .route {
    text-decoration: none !important;
    position: absolute;
    top: 15px;
    right: 10px;
  }
  .no-line-break {
    white-space: nowrap;
  }
  ::v-deep .v-tab:hover {
    background-color: #caf1e2;
    color: $primary_color !important;
  }
  .theme--dark.v-btn.v-btn--disabled{
    background-color: #CCCCCC !important;
    color: rgba(0, 0, 0, 0.26) !important;
    border: none !important;
}
  </style>
  