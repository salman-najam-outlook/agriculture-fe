<template>
  <div class="py-10">
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <v-form
        v-on:submit.prevent="registerFarm"
        ref="form"
        v-model="valid"
        lazy-validation
      >
        <div class="page-title">
          <div class="text-h5 font-weight-black">
            {{ $t("farm.farmRegistration") }}
          </div>
          <v-spacer></v-spacer>
          <template>
            <div class="mt-5 text-center data-drop">
              <v-menu
                bottom
                origin="center center"
                transition="scale-transition"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    @click="handleCancel"
                    v-bind="attrs"
                    v-on="on"
                    outlined
                    color="primary"
                    dark
                    depressed
                  >
                    {{ $t("farm.cancel") }}
                  </v-btn>
                  <v-btn
                    color="primary"
                    dark
                    v-bind="attrs"
                    v-on="on"
                    type="submit"
                    depressed
                  >
                    {{ $t("farm.register") }}
                  </v-btn>
                </template>
              </v-menu>
            </div>
          </template>
        </div>
        <div class="mt-2 form-section">
          <v-card class="mb-2" flat>
            <v-container fluid>
              <div class="font-weight-bold">
                {{ $t("farm.farmInformation") }}
              </div>
              <template>
                <v-row  class="mt-2">
                  <v-col cols="1">
                    <v-checkbox v-model="farm.isTechnician" class="form-checkbox" :label="$t('farm.iAmNotFarmer')"
                    ></v-checkbox>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" md="3">
                    <label for="text">
                      {{ $t("farm.farmID") }}
                    </label
                    >
                    <v-text-field
                      v-model="farm.registrationNo"
                      :placeholder="$t('farm.farmIdPlaceHolder')"
                      outlined
                      dense
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="3" v-if="!farm.isTechnician">
                    <label for="text">
                      {{ $t("farm.farmers") }} <span>*</span>
                    </label
                    >
                    <v-autocomplete
                      :items="formattedFarmers"
                      :placeholder="$t('select')"
                      item-text="farmerFullName"
                      item-value="userId"
                      outlined
                      dense
                      v-model="farm.userId"
                      class="text-capitalize"
                      :rules="farmRules.farmers"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <label for="text">
                      {{ $t("farm.farmName") }}<span>*</span>
                    </label
                    >
                    <v-text-field
                      v-model="farm.farmName"
                      :placeholder="$t('farm.nameOfTheFarm')"
                      outlined
                      dense
                      required
                      :error-messages="errors.name"
                      :rules="farmRules.farmName"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="3">
                    <label for="text">
                      {{ $t("deforestation.farmRegistrationId") }}
                    </label
                    >
                    <v-text-field
                      v-model="farm.farmRegistrationId"
                      :placeholder="$t('deforestation.farmRegistrationId')"
                      outlined
                      dense
                      
     
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="3">
                    <label for="text">
                      {{ $t("deforestation.farmerRegistrationId") }}
                    </label
                    >
                    <v-text-field
                      v-model="farm.farmerRegistrationId"
                      :placeholder="$t('deforestation.farmerRegistrationId')"
                      outlined
                      dense
                      
           
                    ></v-text-field>
                  </v-col>

                  <template v-if="farm.isTechnician">
                      <v-col cols="12" sm="6" md="3">
                      <label for="text">
                        {{ $t("farm.farmerFirstName") }}
                      </label
                      >
                      <v-text-field
                        v-model="farm.farmerFirstName"
                        :placeholder="$t('farm.farmerFirstName')"
                        outlined
                        dense
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6" md="3">
                      <label for="text">
                        {{ $t("farm.farmerMiddleName") }}
                      </label
                      >
                      <v-text-field
                        v-model="farm.farmerMiddleName"
                        :placeholder="$t('farm.farmerMiddleName')"
                        outlined
                        dense

                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6" md="3">
                      <label for="text">
                        {{ $t("farm.farmerLastName") }}
                      </label
                      >
                      <v-text-field
                        v-model="farm.farmerLastName"
                        :placeholder="$t('farm.farmerLastName')"
                        outlined
                        dense

                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6" md="3">
                    <label for="text">
                      {{ $t("farm.farmerId") }}
                    </label
                    >
                    <v-text-field
                      :placeholder="$t('farm.farmerId')"
                      outlined
                      dense
                      v-model="farm.farmerId"
                    ></v-text-field>
                  </v-col>
                  </template>

                  

                  <v-col cols="12" sm="6" md="3">
                    <label for="text"
                      >{{ $t("farm.ownershipType") }}<span>*</span>
                      <v-tooltip top color="black" max-width="220">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon v-bind="attrs" v-on="on">
                            mdi-help-circle-outline
                          </v-icon>
                        </template>
                        <span>{{ $t("farm.registration.ownershipType") }}</span>
                      </v-tooltip>
                    </label>
                    <v-select
                      :items="ownershipTypes"
                      item-text="name"
                      item-value="id"
                      :placeholder="$t('select')"
                      outlined
                      dense
                      v-model="farm.farmOwnershipType"
                      class="text-capitalize"
                      :error-messages="errors.farmOwnershipType"
                      :rules="farmRules.farmOwnershipType"
                    ></v-select>
                  </v-col>

             
                  <v-col cols="12" sm="6" md="3">
										<label>{{ $t('farm.goals') }}
										</label>
										<v-select :items="farmGoals" :placeholder="$t('select')" multiple outlined dense
											class="text-capitalize" item-text="name" item-value="id" v-model="farm.farmingGoalsIds">
										</v-select>
									</v-col>

                  <v-col cols="12" sm="6" md="3">
										<label>{{ $t('farm.certifications') }}
										</label>
										<v-select :items="certificationOptions" :placeholder="$t('select')" multiple outlined dense
											class="text-capitalize" item-text="name" item-value="id" v-model="farm.certifications">
										</v-select>
									</v-col>

                  <v-col cols="12" sm="6" md="3">
										<label>{{ $t('farm.productionType') }}
										</label>
										<v-select :items="productionTypes" :placeholder="$t('select')" outlined dense
											class="text-capitalize" item-text="name" item-value="id" v-model="farm.productionType">
										</v-select>
									</v-col>

                  <v-col cols="12" sm="6" md="3">
										<label>{{ $t('farm.farmTitleDocument') }}</label>

                  <div v-if="!farm.farmTitleDocument">
                      <div
                        :class="[
                          'dropZone',
                          dragging ? 'dropZone-over' : '',
                        ]"
                        @dragenter="dragging = true"
                        @dragleave="dragging = false"
                      >
                        <div
                          class="dropZone-info"
                          @drag="onFarmDocumentChange"
                        >
                          <span
                            class="fa fa-cloud-upload dropZone-title green--text font-weight-bold"
                            >{{ $t("browse") }}
                          </span>
                          <span class="dropZone-title">
                            {{ $t("farm.dropHere") }}</span
                          >
                        </div>
                        <input
                          type="file"
                          @change="onFarmDocumentChange"
                        />
                      </div>
                    </div>
                    <div v-else class="dropZone-uploaded">
                      <div class="dropZone-uploaded-info">
                        <span>{{ fileName }}</span>
                        <button
                          type="button"
                          class="btn btn-primary removeFile"
                          @click="removeDocument"
                        >
                          {{ $t("remove") }}
                        </button>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </template>
            </v-container>
          </v-card>
         
          <v-card class="mt-5 mb-5" flat>
            <v-container fluid>
              <div class="font-weight-bold mb-7">
                {{ $t("farm.farmLocationSize") }}
              </div>
              <template>
                <v-row class="mt-5">
                  <v-col cols="12" sm="6" md="3">
                    <label
                      >{{ $t("farm.farmStateInfo") }}<span>*</span>

                      <v-tooltip top color="black" max-width="220">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon v-bind="attrs" v-on="on">
                            mdi-information-outline
                          </v-icon>
                        </template>
                        <span>{{ $t("farm.farmLocationAddressInfo") }}</span>
                      </v-tooltip></label
                    >
                    <v-text-field
                      :rules="farmRules.address"
                      readonly
                      @click="showFarmLocation = true"
                      id="dialog-link1"
                      :placeholder="$t('farm.pleaseClickToChooseLocation')"
                      outlined
                      dense
                      v-model="farm.address"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="3">
                    <label
                      >{{ $t("farm.country") }} <span>*</span>
                      <v-tooltip top color="black" max-width="220">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon v-bind="attrs" v-on="on">
                            mdi-information-outline
                          </v-icon>
                        </template>
                        <span>{{ $t("farm.countryH") }}</span>
                      </v-tooltip></label
                    >
                    <v-select
                      :items="countries"
                      :placeholder="$t('farm.country')"
                      outlined
                      item-text="Name"
                      dense
                      :loading="countryLoading"
                      v-model="farm.country"
                      item-value="Name"
                      @change="getStates()"
                      :rules="farmRules.country"
                    ></v-select>
                  </v-col>

                  <v-col cols="12" sm="6" md="3">
                    <label
                      >{{ $t("farm.provinceState") }}
                      <v-tooltip top color="black" max-width="220">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon v-bind="attrs" v-on="on">
                            mdi-information-outline
                          </v-icon>
                        </template>
                        <span>{{ $t("farm.provinceStateInfo") }}</span>
                      </v-tooltip>
                    </label>
                    <v-text-field
                      :placeholder="$t('Enter here')"
                      outlined
                      dense
                      v-model="farm.state"

                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="3">
                    <label
                      >{{ $t("farm.city") }}
                      <v-tooltip top color="black" max-width="220">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon v-bind="attrs" v-on="on">
                            mdi-information-outline
                          </v-icon>
                        </template>
                        <span>{{ $t("farm.cityInfo") }}</span>
                      </v-tooltip>
                    </label>
                    <v-text-field
                      :placeholder="$t('Enter here')"
                      outlined
                      dense
                      v-model="farm.city"

                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="3">
                    <label
                      >{{ $t("farm.streetNumber") }}
                      <v-tooltip top color="black" max-width="220">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon v-bind="attrs" v-on="on">
                            mdi-information-outline
                          </v-icon>
                        </template>
                        <span>{{ $t("farm.streetNumberInfo") }}</span>
                      </v-tooltip>
                    </label>
                    <v-text-field
                      :placeholder="$t('kabale-kisoro Road')"
                      outlined
                      dense
                      v-model="farm.street"
                    ></v-text-field>
                  </v-col>

              
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" md="3">
                    <v-btn
                      color="primary"
                      dark
                      depressed
                      outlined
                      @click="showGeofenceMethod = true"
                    >
                      {{ $t("farm.addGeofenceForThisFarm") }}
                    </v-btn>
                    <!-- <p class="mt-2 red--text">Note: Geofence is required for Satellite Reports and to add zones.</p> -->
                  </v-col>
                </v-row>
                <div
                  v-if="!farm.area && !farm.farmGeofence && !farm.farmGeofenceRadius"
                  class="ml-2 mt-2"
                  style="font-size: 0.6em; color: rgb(255, 18, 18)"
                >
                  Note: Geofence is Required for Satellite Reports
                </div>
              </template>

              <!-- </v-alert> -->
            </v-container>
          </v-card>
        </div>
      </v-form>
    </v-container>

    <primary-geofence
      v-if="showMap"
      :showMap="showMap"
      :farm="farm"
      :coordinateArr="coordinateArr"
      @close-location-modal="locationMapClosed"
      @close-without-change="closeWithoutChange"
    ></primary-geofence>
    <FarmLocation
      v-if="showFarmLocation"
      :showMap="showFarmLocation"
      :farm="farm"
      @close-location-modal="farmLocationClosed"
      @close-without-change="closeWithoutChange"
    />

    <v-dialog
        v-model="showGeofenceMethod"
        persistent
        max-width="500"
    >
        <v-card>
            <v-toolbar
                color="primary"
                elevation="0"
            >
                <!-- <v-app-bar-nav-icon> </v-app-bar-nav-icon> -->

                <v-toolbar-title class="white--text">{{ $t("farm.pleaseChooseOneOfTheOption") }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn
                    color="white"
                    icon
     
                >
                     <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <!-- <v-card-title class="text-h5">
                {{ title }}
            </v-card-title> -->
            <v-card-text class="pt-5 black--text">
              <v-radio-group v-model="geofenceMethod">
                <v-radio :label="`${$t('farm.useGeoFencingFeature')}`" value="geofencing"></v-radio>
                <v-radio :label="`${$t('farm.uploadShapeFile')}`" value="shapefile"></v-radio>
              </v-radio-group>
            
            <v-divider class="mt-10"></v-divider>
            <v-card-actions >
                <v-spacer></v-spacer>
                <v-btn
                    color="green darken-1"
                    text
                    @click="showGeofenceMethod=false"
                    outlined
     
                >
                    {{ $t("cancel") }}
                </v-btn>
                <v-btn
                    depressed
                    color="primary"
                    @click="startGeofencing"
 
                >
                {{ $t("confirm") }}
                </v-btn>
            </v-card-actions>
            </v-card-text>
        </v-card>
    </v-dialog>
    <DropZoneDialogVue       v-if="showDropZone"
      :showDropZone="showDropZone" @close-shapefile-modal="dropZoneClosed" @close-without-change="dropClosedWithoutChange"></DropZoneDialogVue>
  </div>
</template>

<script>
// import * as shapefile from "shapefile"
import loadingMixin from "@/mixins/LoadingMixin";
import { farmRules } from "@/validations/FarmFormRules.js";
import generalMixin from "@/mixins/GeneralMixin";
import FarmService from "../../_services/FarmService";
import PrimaryGeofence from "./PrimaryGeofence.vue";
import FarmLocation from "./FarmLocation.vue";
import {mapGetters,mapState} from 'vuex'
import { countries } from "@/constants/countries.js";
import DropZoneDialogVue from './components/DropZoneDialog.vue';

export default {
  async mounted(){
    this.farm.technicianId = this.technicianId;
    await this.fetchFarmers();
    // await this.getCountries();
    await this.fetchFarmGoals();
    await this.fetchCertificationOptions();
  },
 
  data() {
    return {
      fileName: "",
      coordinateArr: null,
      showDropZone: false,
      geofenceMethod: "geofencing",
      showGeofenceMethod: false,
      countries,
      options: {
          page:1,
          searchPhrase:'',
          status:'',
          orderType:'DESC'
      },
      formChanged: false,
      promptToRoute: null,
      date: null,
      menu: "",
      error: false,
      countryLoading:false,
      stateLoading:false,
      cityLoading:false,
      addManually: false,
      geofenceValidation: false,
      showFarmLocation: false,
      showMap: false,
      errors: {
        name: "",
        farmType: "",
        farmownershipType: "",
        ownerName: "",
        govRegistrationNo: "",
        contractMating: "",
        productionSystemOptId: "",
        regulatorRepName: "",
        cooperativeID: "",
        licenceNumber: "",
        licenceED: "",
        regulatorName: "",
        lat:"",
        log:""
      },
      breadcrumbs: this.getBreadcrumbs(),
      farm: {
        name: "",
        govRegistrationNo: "",
        registrationNo:"",
        farmType: "",
        productionSystem: null,
        farmOwner: null,
        lat: "",
        log: "",
        farmOwnershipType: "personal",
        country: "",
        state: "",
        city: "",
        countryId: null,
        stateId: null,
        cityId: null,
        address: "",
        area: "",
        areaUomId: 2,
        parameter: 0,
        parameterUomId: 0,
        street: "",
        farmSize: 0,
        farmSizeUomId: 0,
        farmPerimeter: 0,
        farmPerimeterUomId: 1,
        farmGeofence: [],
        farmingGoalOptId:null,
        productionType:"",
        certifications:[],
        farmingGoalsIds:[],
        farmerFirstName:"",
        farmerMiddleName:"",
        farmerLastName:"",
        isTechnician:true,
        technicianId:null,
        farmerId:"",
        userId:"",
        farmGeofenceName:"",
        farmGeofenceCategory:"",
        farmGeofenceRadius: 0.0,
        farmGeofenceType: "",
        farmTitleDocument:"",
        farmTitleDocumentUrl:""
      },
      selection: {
        country: null,
        state: null,
        city: null
      },
      countryId: null,
      stateId: null,
      farmType: [],
      farmownershipType: [],
      productionSystem: [],
      res: [],
      farmUni: [{ id: 1, name: 'Acre' }, { id: 2, name: 'Hectare' }],
      periUni: [{ id: 1, name: "Feet" }, { id: 2, name: "Meters" }],
      farmRules,
      valid: true,
      country: [],
      state: [],
      city: [],
      users:[],
      farmGoals:[],
      certificationOptions:[],
      productionTypes:[
        {
          id:"Organic", name:this.$t('farm.organic'),
        },

        {
          id:"Conventional", name: this.$t('farm.conventional'),
        }
      ],
      ownershipTypes: [
        { id: "personal", name: this.$t('farm.personal') },
        { id: "community", name: this.$t('farm.community') },
        // { id: "corporate", name: "Corporate" },
      ],
      dataLossWarning:false,
      previewUrl:null,
      dragging: false,
    };
  },
  computed: {
    ...mapGetters({
      'farmers': 'memberData/farmers', 
    }),

    ...mapState({
      technicianId:state=>state.auth.user?.id
    }),
   

   formattedFarmers(){
    return this.farmers.map(farmer=>({
      ...farmer,
      farmerFullName:`${farmer.firstName} ${farmer.lastName}`
    }))
    .sort((a,b)=>a.farmerFullName.localeCompare(b.farmerFullName))
   },
    totalPages(){
      return this.farmersCount < this.options.limit ? 1 : Math.ceil(this.farmersCount/this.options.limit)
    },
    currentUser() {
      return this.$store.getters.getUser;
    },
    hasChanged() {
      return true;
    },
  },
  watch: {
    farm: {
      handler() {
        this.formChanged = true;
      },
      deep: true,
    },
    "farm.farmOwnershipType": function (nV) {
      if (nV == "personal") {
        this.farm.communityName = "";
        this.farm.corporateName = "";
        this.farm.corporateRegistrationNum = "";
        this.farm.corporateMailingAddress = "";
      } else if (nV == "community") {
        this.farm.corporateName = "";
        this.farm.corporateRegistrationNum = "";
        this.farm.corporateMailingAddress = "";
      } else if (nV == "corporate") {
        this.farm.communityName = "";
      }
    },
  },

  methods:{
    getBreadcrumbs() {
      // Check if we're coming from a buying station context
      if (this.$route.params.buyingStationId) {
        return [
          {
            text: this.$t('dashboard'),
            disabled: false,
            to: "/"
          },
          {
            text: this.$t('memberDataSection.associatedFarms'),
            disabled: false,
            to: `/coffee/buying-station/${this.$route.params.buyingStationId}/associated-farms`
          },
          {
            text: this.$t('farm.registerAfarm'),
            disabled: true,
          },
        ];
      } else {
        // Default breadcrumbs for regular farm registration
        return [
          {
            text: this.$t('farm.dashboard'),
            disabled: false,
            to: "/"
          },
          {
            text: this.$t('farm.farms'),
            link: true,
            exact: true,
            disabled: false,
            to: { name: "My farm" }
          },
          {
            text: this.$t('farm.registerAfarm'),
            disabled: true,
          },
        ];
      }
    },

    handleCancel() {
      // Navigate back to associated farms if coming from buying station context
      if (this.$route.params.buyingStationId) {
        this.$router.push({
          name: 'associatedFarms',
          params: { 
            id: this.$route.params.buyingStationId,
          }
        });
      } else {
        this.$router.push({ name: 'Farms' });
      }
    },

    dropZoneClosed(coordArr) {
      this.showGeofenceTool()
      this.showDropZone = false
      this.coordinateArr = coordArr
    },
    dropClosedWithoutChange() {
      console.log("dropClosedWithoutChange")
      this.showDropZone = false
    },
    startGeofencing(){
      console.log("startGeofencing")
      if(this.geofenceMethod == "geofencing") {
        this.showGeofenceMethod = false
        this.coordinateArr = null
        this.showGeofenceTool()
      } else {
        this.showGeofenceMethod = false
        this.showDropZone = true 
      }
    },
    onFarmDocumentChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      this.previewUrl = URL.createObjectURL(files[0]);
      if (!files.length) {
        this.dragging = false;
        return;
      }

      // validate file extension
      this.fileName = files[0].name
      if(
        this.fileName.includes(".pdf") || 
        this.fileName.includes(".jpg") || 
        this.fileName.includes(".jpeg") || 
        this.fileName.includes(".png") 
      ) {
        this.createDocument(files[0]);
      } else {
        this.$notify({
          text: "Only pdf, jpeg, jpg, png files are allowed",
          type: "error",
        });
        return
      }
    },

    async createDocument(file) {
      this.farm.farmTitleDocument = file;
      this.dragging = false;
    },
    removeDocument() {
      this.farm.farmTitleDocument = "";
    },

    fetchFarmers(){
      this.startLoading()
      this.$store.dispatch('memberData/getFarmers', this.options)
      .then(()=> this.stopLoading()).catch(()=>this.stopLoading())
    },

    async fetchFarmGoals(){
      this.farmGoals = await FarmService.loadFarmOptions('farming-goals');
    },

    async fetchCertificationOptions(){
      this.certificationOptions = await FarmService.loadFarmOptions('certification');
    },

    async setLocationAddresses() {
      if (this.farm.country !== "") {
        this.selection.country = this.country.filter((country) => {
          return this.farm.country === country.name;
        })[0] || this.farm.country;

        if (typeof this.selection.country !== "string") {
          await this.getStates();

          if (this.farm.state !== "") {
            const state = this.state.filter((state) => {
              return this.farm.state === state.name;
            })[0] || this.farm.state;

            this.selection.state = state;
            this.farm.state = state;

            if (typeof this.selection.state !== "string") {
              await this.getCity();

              if (this.farm.city !== "") {
                this.selection.city = this.city.filter((city) => {
                  return this.farm.city === city.name;
                })[0] || this.farm.city;

                if (typeof this.selection.city !== "string") {
                  this.setCity();
                }
              }              
            } else {
              this.selection.city = this.farm.city;
            }
          }
        } else {
          this.selection.state = this.farm.state;
          this.selection.city = this.farm.city;
        }
      }
    },
    async locationMapClosed(gdata) {
      console.log(gdata, "locationMapClosed");

      this.geofenceValidation = false;
      this.addManually = true;
      this.showMap = false;
      this.farm.lat = gdata.lat;
      this.farm.log = gdata.log;
      this.farm.area = gdata.area;
      this.farm.areaUomId = gdata.areaUomId;
      this.farm.address = gdata.address ?? this.farm.address;
      this.farm.coordinates = gdata.farmGeofence;
      this.farm.farmGeofence = gdata.farmGeofence;
      this.farm.farmSize = gdata.area;
      this.farm.farmPerimeter = +gdata.parameter;
      this.farm.farmSizeUomId = gdata.areaUomId;
      this.farm.farmPerimeterUomId = gdata.areaUomId; // 1 Acre = Feet, 2 Hac = Meter
      this.farm.farmGeofenceName = gdata.farmGeofenceName;
      this.farm.farmGeofenceCategory = gdata.farmGeofenceCategory;
      this.farm.farmGeofenceRadius = gdata.farmGeofenceRadius;
      this.farm.farmGeofenceType = gdata.farmGeofenceType;
      this.farm.segments = gdata.segments;
      if (gdata.addressData) {
        this.farm.country = gdata.addressData.country;
        this.farm.city = gdata.addressData.locality;
        this.farm.state = gdata.addressData.administrative_area_level_1;
        //this.farm.street = gdata.addressData.street_number
        this.farm.street = gdata.addressData.route;
      }
      
      await this.setLocationAddresses();
    },
    async farmLocationClosed(data) {
      console.log("farmLocationClosed", data);
      this.showFarmLocation = false;
      this.farm.lat = data.lat;
      this.farm.log = data.log;
      this.farm.address = data.address;

      if (data.addressData) {
        this.farm.country = data.addressData.country;
        this.farm.city = data.addressData.locality;
        this.farm.state = data.addressData.administrative_area_level_1;
        //this.farm.street = data.addressData.street_number
        this.farm.street = data.addressData.route;
      }

      await this.setLocationAddresses();
    },
    showGeofenceTool() {
      if (this.farm.address !== "") {
        this.showMap = true;
      } else {
        this.$notify({
          text: "Farm Location is required.",
          type: "error",
        });
      }
    },
   
    closeWithoutChange() {
      this.showMap = false;
      this.showFarmLocation = false;
      // this.geofenceValidation = true
    },
    async getusers(){
      const data = await FarmService.loadUsers();
      this.users = data.data.users;
    },
    async getCountries() {
      this.countryLoading = true;

      const data = await FarmService.loadCountries();

      this.country = data.data;
      this.countryLoading = false
    },
    async getStates() {
      if (this.farm.country === null) return;
      this.stateLoading = true;
      this.farm.countryId = this.country.filter((item)=>item.name.toLowerCase() == this.farm.country.toLowerCase())[0]?.code;
      this.city = [];

      if (!this.farm.countryId) return;

      const data = await FarmService.loadStates(this.farm.countryId);

      this.state = data.data.length !== 0 ? data.data:{id:"0",name:"No state available"};
      this.stateLoading = false;
    },
    async getCity() {
      if (this.selection.state === null) return;

      if (typeof this.selection.state === "string") {
        this.farm.state = this.selection.state;
        return;
      }

      this.cityLoading = true;
      this.farm.stateId = this.selection.state.id;

      if (!this.farm.stateId) return;

      const data = await FarmService.loadCities(this.farm.stateId);

      this.city = data.data.length !== 0 ? data.data:[{id:"0",name:"No city available"}];
      this.cityLoading = false;
    },
    setCity() {
      if (this.selection.city === null) return;

      if (typeof this.selection.city === "string") {
        this.farm.city = this.selection.city;
        return;
      }

      this.farm.cityId = this.selection.city.id;
    },

    geolocate() {
      navigator.geolocation.getCurrentPosition((position) => {
        this.farm.lat = position.coords.latitude;
        this.farm.log = position.coords.longitude;
      });
    },
    async registerFarm(){
      if (!this.$refs.form.validate()) return;

      this.startLoading();


      
      const formData = new FormData();

      formData.append("file", this.farm.farmTitleDocument);

      await FarmService.uploadDocument(formData)
        .then(({ data }) => {
          console.log(data);
          this.farm.farmTitleDocumentUrl = data.farmTitleDocument.location;
        })
        .catch((error) => {
          if (error.status == 422) {
            console.log(error);
            error.data.message.errors.forEach((err) => {
              this.errors[err.param] = err.msg;
            });
          }
          this.stopLoading();
        });

      const selectedIds = this.farm.farmingGoalsIds;

      let farmingGoals = this.farmGoals.filter(item=>selectedIds.includes(item.id)).map(item=>({
        farmingGoalOptId:item.id,
        farmingGoal:item.name
      }));

      this.farm.farmingGoals = farmingGoals;

      if(!this.farm.productionType){
        delete this.farm.productionType;
      }

      if(!this.farm.farmGeofenceCategory){
        delete this.farm.farmGeofenceCategory;
      }


      // CONVERT FARM AREA INTO ACRE
      if(this.farm.areaUomId == 2){ // unit = hactare
        this.farm.area *= 2.47105;
        this.farm.parameter *= 3.28084; // convert to feet
        this.farm.areaUomId = 1;
      }
      

      //delete segments before submitting because it causes backend issues, this doesnt prevent us from saving geofence
      if(this.farm.segments) {
        delete this.farm.segments
      }

      await FarmService.addFarm(this.farm).then(async(data)=>{
        if(data.success){
          this.stopLoading();
          this.$notify({
            title:"Farm added",
            text:data.message,
            type:"success"
          });
          
          // Navigate back to associated farms if coming from buying station context
          if (this.$route.params.buyingStationId) {
            await this.$router.push({
              name: 'associatedFarms',
              params: { 
                id: this.$route.params.buyingStationId,
              }
            });
          } else {
            await this.$router.push({name : "Farms"});
          }
        }
        else {
          this.stopLoading();

          this.$notify({
            title: "farm Not Added",
            text: data.message,
            type: "error",
          });
        }
      });
    }
  },
 
  components: {
    // "add-user": AddUser,
    // breadcrumb: Breadcrumb,
    PrimaryGeofence,
    // "prompt-dialog": PromptDialog,
    FarmLocation,
    DropZoneDialogVue
  },

  mixins: [loadingMixin, generalMixin],
};
</script>

<style>
.page-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0px 0px 15px;
}

.button {
  float: right;
}

.v-btn {
  margin-right: 5px;
}

.route {
  text-decoration: none !important;
}

.form-group {
  margin-top: -20px;
}

.form-section label {
  display: inline-block;
  margin-bottom: 0.5rem;
  /* color: #97A8B8; */
  font-size: 14px;
  font-family: Poppins-Medium;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.form-section label span {
  color: red;
}

.v-list-item__title {
  text-transform: capitalize;
}

#dialog-link1 {
  cursor: pointer !important;
}

#dialog-link1::placeholder {
  color: #002287 !important;
  text-decoration: underline !important;
}

.form-checkbox .v-label{
  margin-bottom: 0!important;
}


/* DROPZONE */

.dropZone {
  position: relative;
  padding: 20px 30px;
  background: #ffffff;
  border: 1px dashed #d2d2d2;
  border-radius: 5px;
}

.dropZone:hover {
  border: 2px solid #00bd73;
}

.dropZone:hover .dropZone-title {
  color: #00bd73;
}
.dropZone-title {
  color: #787878;
}

.dropZone input {
  position: absolute;
  cursor: pointer;
  top: 0px;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}
.dropZone-over {
  background: #5c5c5c;
  opacity: 0.8;
}

.dropZone-uploaded {
  padding: 30px;
  background: #ffffff;
  border-radius: 5px;
  position: relative;
  border: 1px dashed #eee;
}

.removeFile {
  color: red;
  margin-left: 15px;
}

.file-btn {
  position: relative;
  float: right;
  margin-top: -60px;
  right: 5px;
  color: #00bd73;
  cursor: pointer;
}
.file-btn1 {
  position: relative;
  float: right;
  margin-top: -60px;
  margin-right: 65px;
  color: #00bd73;
  cursor: pointer;
}
.file-btn2 {
  position: relative;
  float: right;
  margin-top: -60px;
  right: 5px;
  color: red;
  cursor: pointer;
}

.dropZone-uploaded-info img{
  max-height: 100px;
  width:100%;
}
</style>
