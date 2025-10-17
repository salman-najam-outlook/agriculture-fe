<template>
  <v-container>
    <template>
      <div class="text-center">
        <v-dialog v-model="dialog" width="800" persistent>
          <v-card class="custom-card" rounded="0">
            <v-toolbar color="secondary" class="white--text">
              <v-toolbar-title class="font-weight-bold">{{
                $t("oma.importedTrees")
              }}</v-toolbar-title>

              <v-spacer></v-spacer>

              <v-btn icon class="white--text" @click="closeModal">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card flat class="mb-4 mt-5">
              <span style="margin-left: 25px;">Import Completed</span>
              <div class="text-center">
                <v-row justify="center" align="center">
                  <v-col cols="12" sm="11">
                    <div class="row mt-0">
                      <div class="col-11 progress-bar">
                        <v-progress-linear :value="progress" :color="progressColor" rounded></v-progress-linear>
                      </div>
                      <div class="col-1 pl-0">
                        <small :class="'progress-num ' + progressColor + '--text'">{{ progress }} %</small>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </div>
              <span style="margin-left: 25px;"> {{ successCount }} of {{ failCount + successCount }} records imported
              </span>
            </v-card>
            <v-card flat class="mb-4">
              <div class="text-center py-6">
                <v-row justify="center" align="center" style="background-color: #ECECEC;" class="mb-3">
                  <v-col cols="12" sm="4">
                    <div>
                      <span style="font-size: 25px;font-weight:800;color: #6B7280;">{{ failCount + successCount }}</span>
                      <br>
                      Total Records
                    </div>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <div>
                      <span style="font-size: 25px;font-weight:800;color:#F03737">{{ failCount }}</span>
                      <br>
                      Failed
                    </div>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <div>
                      <span style="font-size: 25px;font-weight:800;color:#00BD73">{{ successCount }}</span>
                      <br>
                      Success
                    </div>
                  </v-col>
                </v-row>

                <v-row justify="center" align="center" v-if="!trees">
                  <v-col cols="12" sm="4">
                    <div class="py-16">
                      <img src="/img/no-survey-list.svg" /><br />
                      <strong class="red--text">{{ $t("surveyBuilder.noSurveyFound") }}</strong><br />
                      <div class="py-4">
                        <small> {{ $t("surveyBuilder.createNewSurvey") }} </small>
                      </div>
                    </div>
                  </v-col>
                </v-row>
                <div v-if="trees" class="pa-4">
                  <v-data-table :headers="headers" :items="trees" :footer-props="{
                  }" :header-props="headerProps" hide-default-footer :loading="treesLoading"
                    :options.sync="tableOptions" loading-text="Loading Trees..." disable-pagination>
                    <template v-if="trees.length" v-slot:body="{ items }">
                      <tbody>
                        <tr v-for="item in items" :key="item.id" style="position: relative; width: 0; height: 0">
                          <td>{{ item.treeName }}</td>
                          <td> {{ item.zone.geofenceName }}</td>
                          <td class="text-center">
                            <v-btn x-small rounded min-width="120" :color="item.status == 'Success' ? 'green2' : 'red2'"
                              depressed :class="item.status == 'Success' ? 'primary--text' : 'red--text'" height="34">
                              {{ item.status }}
                            </v-btn>
                          </td>
                          <td class="text-center">

                            <!-- <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn x-small fab v-bind="attrs" v-on="on" class="ml-1 green-shadow"
                                                        @click="editTree(item.id)">
                                                        <v-icon>mdi-pencil</v-icon>
                                                    </v-btn>
                                                </template>
<span>{{ $t("edit") }}</span>
</v-tooltip> -->

                            <v-tooltip bottom v-if="item.status == 'Failed'">
                              <template v-slot:activator="{ on, attrs }">
                                <v-btn x-small fab v-bind="attrs" v-on="on" class="ml-1 green-shadow"
                                  @click="deleteTree(item.id)">
                                  <v-icon>mdi-trash-can</v-icon>
                                </v-btn>
                              </template>
                              <span>{{ $t("delete") }}</span>
                            </v-tooltip>
                          </td>

                        </tr>
                      </tbody>
                    </template>
                    <template v-slot:footer></template>
                  </v-data-table>
                </div>
              </div>
            </v-card>
            <v-divider class="my-5 px-0"></v-divider>
            <v-card-actions class="px-0">
              <v-spacer></v-spacer>
              <v-btn class="mr-2" outlined color="primary" @click="closeModalAndUploadImage(true)" width="112">
                {{ $t("addImages") }}
              </v-btn>

              <v-btn width="112" color="primary" class="btn-11 btn-22" @click="closeModal">
                {{ $t("close") }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </template>
  </v-container>
</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin";
import AvocadoTreesService from "@/_services/AvocadoTreesService";

export default {
  computed: {
    dialog: {
      get() {
        return this.dialogI;
      },
      set() {
        return this.dialogI;
      },
    },
  },
  data() {
    return {

      progressColor: 'success',
      progress: 100,
      headerProps: {
        'sort-icon': 'mdi-menu-up'
      },
      trees: [],
      treesLoading: false,
      tableOptions: {},

      successCount: 0,
      failCount: 0,
      headers: [
        {
          text: this.$t("oma.treeName"),
          value: "treeName",
          class: "black--text",
        },
        {
          text: this.$t("oma.geolocation"),
          align: "center",
          value: "zoneId",
          class: "black--text",
        },
        {
          text: this.$t("oma.status"),
          align: "left",
          value: "status",
          class: "black--text",
        },
        {
          text: this.$t("oma.action"),
          align: "left",
          value: "action",
          class: "black--text",
        },
      ],

    };
  },
  async created() {
    await this.getTrees()
  },
  // watch: {
  //   tableOptions: {
  //     async handler() {
  //       await this.getTrees()
  //     },
  //     deep: true,
  //   },
  // },
  methods: {
    closeModal() {
      this.$emit("closeUploadTreesDetail", false);
    },
    closeModalAndUploadImage() {
      this.$emit("closeUploadTreesDetail", true);
    },
    async getTrees() {
      this.trees = []
      this.treesLoading = true;
      //const canSort = this.tableOptions.sortBy.length === 1 && this.tableOptions.sortDesc.length === 1;
      const requestParams = {
        uploadHistoryId: this.uploadHistoryId,
        //uploadHistoryId: 51
        //sortColumn: canSort ? this.tableOptions.sortBy[0] : null,
        //sortOrder: canSort ? this.tableOptions.sortDesc[0] ? 'ASC' : 'DESC' : null,
      };
      const [uploadedTrees] = await Promise.all([await AvocadoTreesService.getAllUploadedTrees(requestParams)]);

      const trees = uploadedTrees?.data?.rows;


      let treesData = [];
      let totalFailed = 0;
      let totalSuccess = 0;
      for (const tree of trees) {
        treesData.push({
          id: tree.id,
          treeName: tree.treeName,
          farm: {
            farmName: tree.farm?.farmName
          },
          zone: {
            geofenceName: tree.zone?.geofenceName
          },
          status: tree.status
        })

        if (tree.status == "Success") {
          totalSuccess += 1;
        } else if (tree.status == "Failed") {
          totalFailed += 1;
        }
      }

      this.trees = treesData;
      this.successCount = totalSuccess;
      this.failCount = totalFailed;

      this.treesLoading = false;

    },
    // async getTrees() {
    //   this.trees = []
    //   this.treesLoading = true;
    //   //const canSort = this.tableOptions.sortBy.length === 1 && this.tableOptions.sortDesc.length === 1;
    //   const requestParams = {
    //     uploadHistoryId: this.uploadHistoryId,
    //     //uploadHistoryId: 51
    //     //sortColumn: canSort ? this.tableOptions.sortBy[0] : null,
    //     //sortOrder: canSort ? this.tableOptions.sortDesc[0] ? 'ASC' : 'DESC' : null,
    //   };
    //   const [uploadedTrees, uploadHistory] = await Promise.all([await AvocadoTreesService.getAllUploadedTrees(requestParams), await AvocadoTreesService.getUploadedTreeHistoryById(this.uploadHistoryId)
    //   ]);

    //   const trees = uploadedTrees?.data?.rows;
    //   const success = trees?.length ? trees : [];

    //   const history = uploadHistory?.data;
    //   const fail = history.errors ? JSON.parse(history.errors) : [];

    //   this.successCount = history.numberOfRowsInserted;
    //   this.failCount = history.numberOfRowsFailed;



    //   this.trees = [...fail.map((f, i) => {
    //     return {
    //       id: i,
    //       treeName: f.data.treeName,
    //       farm: {
    //         farmName: f.data.farmName || f.data.clientFarmId
    //       },
    //       zone: {
    //         geofenceName: f.data.zoneName || f.data.clientZoneId
    //       },
    //       status: 'Failed'
    //     }
    //   }), ...success.map((s) => {
    //     return {
    //       id: s.id,
    //       treeName: s.treeName,
    //       farm: {
    //         farmName: s.farm?.farmName
    //       },
    //       zone: {
    //         geofenceName: s.zone?.geofenceName
    //       },
    //       status: s.status
    //     }
    //   })]
    //   this.treesLoading = false;

    // },
    async deleteTree(treeId) {
      try {
        this.startLoading()
        const data = await AvocadoTreesService.deleteTree(treeId);
        if (data.success) {
          this.$notify({
            title: this.$t("deleted"),
            type: "success",
          });
        } else {
          this.$notify({
            title: this.$t("failed"),
            type: "error",
          });
        }
      } catch (error) {
        this.$notify({
          title: this.$t("failed"),
          type: "error",
        });
        console.error('Delete Tree Error', error);
      } finally {
        await this.getTrees();
        this.stopLoading();
      }
    },

  },

  props: ["dialogI", "uploadHistoryId"],
  mixins: [loadingMixin],
};
</script>
<style lang="scss" scoped>
.progress-bar {
  display: flex;
  justify-content: center;
  align-items: center;
}

.progress-num {
  display: flex;
  justify-content: flex-end;
  font-weight: bold;
}
</style>
