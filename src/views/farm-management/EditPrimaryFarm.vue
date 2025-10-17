<template>
  <div class="py-10">
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <template v-if="hasFarm">
      <v-container fluid>
        <v-form
          v-on:submit.prevent="updateFarm"
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
                      @click="$router.push({ name: 'Farms' })"
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
                      :disabled="!$can($permissions.can_update_farm)"
                    >
                      {{ $t("update") }}
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
                  <v-row class="mt-2">
                    <v-col cols="1">
                      <v-checkbox
                        v-model="farm.isTechnician"
                        class="form-checkbox"
                        :label="$t('farm.iAmNotFarmer')"
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
                        {{ $t("memberDataSection.farmers") }} <span>*</span>
                      </label>
                      <v-autocomplete
                        @input="onFarmerChange"
                        :items="formattedFarmers"
                        :placeholder="$t('select')"
                        item-text="farmerFullName"
                        item-value="userId"
                        outlined
                        return-object
                        dense
                        v-model="farm.userId"
                        class="text-capitalize"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <label for="text">
                        {{ $t("farm.farmName") }}<span>*</span>
                      </label>
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
  
                    <template v-if="farm.isTechnician">
                      <v-col cols="12" sm="6" md="3">
                        <label for="text">
                          {{ $t("farm.farmerFirstName") }}
                        </label>
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
                        </label>
                        <v-text-field
                          v-model="farm.farmerMiddleName"
                          :placeholder="$t('farm.farmerMiddleName')"
                          outlined
                          dense
                          required
                          :error-messages="errors.name"
                        ></v-text-field>
                      </v-col>
  
                      <v-col cols="12" sm="6" md="3">
                        <label for="text">
                          {{ $t("farm.farmerLastName") }}
                        </label>
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
                        </label>
                        <v-text-field
                          :placeholder="$t('farm.farmerId')"
                          outlined
                          dense
                          required
                          v-model="farm.farmerId"
                        ></v-text-field>
                      </v-col>
                    </template>
  
                    <v-col cols="12" sm="6" md="3">
                      <label for="text"
                        >{{ $t("farm.ownershipType") }}
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

                      ></v-select>
                    </v-col>
  
                    <v-col cols="12" sm="6" md="3">
                      <label>{{ $t("farm.goals") }} </label>
                      <v-select
                        :items="farmGoals"
                        :placeholder="$t('select')"
                        multiple
                        outlined
                        dense
                        class="text-capitalize"
                        item-text="name"
                        item-value="id"
                        v-model="farm.farmingGoalsIds"
                      >
                      </v-select>
                    </v-col>
  
                    <v-col cols="12" sm="6" md="3">
                      <label>{{ $t("farm.certifications") }} </label>
                      <v-select
                        :items="certificationOptions"
                        :placeholder="$t('select')"
                        multiple
                        outlined
                        dense
                        class="text-capitalize"
                        item-text="name"
                        item-value="id"
                        v-model="farm.certifications"
                      >
                      </v-select>
                    </v-col>
  
                    <v-col cols="12" sm="6" md="3">
                      <label>{{ $t("farm.productionType") }} </label>
                      <v-select
                        :items="productionTypes"
                        :placeholder="$t('select')"
                        outlined
                        dense
                        class="text-capitalize"
                        item-text="name"
                        item-value="id"
                        v-model="farm.productionType"
                      >
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
                          <!-- <span class="dropZone-title">{{ animalPicture }}</span> -->
                          <!-- <img class="image-preview" :src="previewUrl" /> -->
                          <a :href="previewUrl" target="_blank">
                            <v-icon v-bind="attrs" v-on="on"
                              >mdi-file</v-icon
                            >
                          </a>
                        
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
            <!-- <v-card class="mt-5 mb-5" flat>
              <v-container fluid>
                <div class="font-weight-bold">
                  {{ $t("farm.farmLicenseInformation") }}
                </div>
                <template>
                  <v-row class="mt-2">
                    <v-col cols="12" sm="6" md="3">
                      <label
                        >{{ $t("farm.licenseNumber") }}
                        <v-tooltip right color="black" max-width="320">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on"
                              >mdi-help-circle-outline</v-icon
                            >
                          </template>
                          <span>{{ $t("farm.registration.licenseNumber") }}</span>
                        </v-tooltip></label
                      >
                      <v-text-field
                        :placeholder="'LN3872390'"
                        outlined
                        v-model="farm.licenceNum"
                        dense
                      >
                      </v-text-field>
                    </v-col>
  
                    <v-col cols="12" sm="6" md="3">
                      <label
                        >{{ $t("License Expiry Date") }}
                        <v-tooltip right color="black" max-width="320">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on"
                              >mdi-help-circle-outline</v-icon
                            >
                          </template>
                          <span>{{
                            $t("farm.registration.licenseExpiryDate")
                          }}</span>
                        </v-tooltip></label
                      >
                      <v-menu
                        ref="menu"
                        v-model="menu"
                        :close-on-content-click="false"
                        dense
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="farm.licenceExpiryDate"
                            placeholder="Choose the date"
                            append-icon="mdi-calendar"
                            outlined
                            readonly
                            dense
                            v-bind="attrs"
                            v-on="on"
                            v-on:click:append="menu = true"
                            :error-messages="errors.licenceED"
                            :rules="farmRules.licenceED"
                          >
                          </v-text-field>
                        </template>
                        <v-date-picker
                          v-model="farm.licenceExpiryDate"
                          no-title
                          scrollabel
                          :min="new Date().toISOString().substr(0, 10)"
                        >
                          <v-spacer></v-spacer>
                          <v-btn text color="primary" @click="menu = false">
                            {{ $t("farm.cancel") }}
                          </v-btn>
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.menu.save(farm.licenceExpiryDate)"
                          >
                            {{ $t("farm.ok") }}
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
                    </v-col>
  
                    <v-col cols="12" sm="6" md="3">
                      <label
                        >{{ $t("farm.regulatorName") }}
                        <v-tooltip right color="black" max-width="320">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on"
                              >mdi-help-circle-outline</v-icon
                            >
                          </template>
                          <span>{{ $t("farm.registration.regulatorName") }}</span>
                        </v-tooltip>
                      </label>
                      <v-text-field
                        :placeholder="$t('Uganda Govt.')"
                        outlined
                        dense
                        v-model="farm.regulatorName"
                      >
                      </v-text-field>
                    </v-col>
  
                    <v-col cols="12" sm="6" md="3">
                      <label
                        >{{ $t("farm.regulatorRepresentativeName")
                        }}
                        <v-tooltip right color="black" max-width="320">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on"
                              >mdi-help-circle-outline</v-icon
                            >
                          </template>
                          <span>{{
                            $t("farm.registration.regulatorRepresentativeName")
                          }}</span>
                        </v-tooltip></label
                      >
                      <v-text-field
                        :placeholder="$t('John Smith')"
                        outlined
                        dense
                        required
                        v-model="farm.regulatorRepresentiveName"
  
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </template>
              </v-container>
            </v-card> -->
  
            <v-card class="mt-5 mb-5" flat>
              <v-container fluid>
                <!-- <v-alert :outlined="geofenceValidation" :color="geofenceValidation ? 'red' : ''" fluid class="pb-10"> -->
                <div class="font-weight-bold mb-7">
                  {{ $t("farm.farmLocationSize") }}
                </div>
                <template>
                  <v-row class="mt-5">
                    <v-col cols="12" sm="6" md="3">
                      <label
                        >{{ $t("farm.farmLocationAddress") }}<span>*</span>
  
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
                        placeholder="Please click to choose location"
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
                        >{{ $t("provinceState") }}
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
                        :placeholder="$t('farm.enterHere')"
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
                        :placeholder="$t('farm.enterHere')"
                        outlined
                        dense
                        v-model="farm.city"
                      ></v-text-field>
                    </v-col>
  
                    <v-col cols="12" sm="6" md="3">
                      <label
                        >{{ $t("farm.streetNo") }}
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
  
                    <!-- <v-col cols="12" sm="6" md="3">
                      <label>{{ $t('farm.postal') }} </label>
                      <v-text-field :placeholder="$t('farm.postal')" outlined dense v-model="farm.street"></v-text-field>
                    </v-col>
  
                    <v-col cols="12" sm="6" md="3">
                      <label
                        >{{ $t("farm.farmNumber") }}
                        <v-tooltip right color="black" max-width="320">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on"
                              >mdi-help-circle-outline</v-icon
                            >
                          </template>
                          <span
                            >The postal Number of farm similar to House
                            number.</span
                          >
                        </v-tooltip>
                      </label>
                      <v-text-field
                        :placeholder="$t('farm.farmNumber')"
                        outlined
                        dense
                        v-model="farm.farmNumber"
                      ></v-text-field>
                    </v-col> -->
  
                    <!-- <v-col cols="12" sm="6" md="3">
                      <label
                        >{{ $t("farm.farmNumber") }}
                        <v-tooltip right color="black" max-width="320">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on"
                              >mdi-help-circle-outline</v-icon
                            >
                          </template>
                          <span
                            >The postal Number of farm similar to House
                            number.</span
                          >
                        </v-tooltip>
                      </label>
                      <v-text-field
                        :placeholder="$t('farm.farmNumber')"
                        outlined
                        dense
                        v-model="farm.farmNumber"
                      ></v-text-field>
                    </v-col>
  
                    <v-col cols="12" sm="6" md="3">
                      <v-row no-gutters class="d-flex">
                        <v-col cols="6" class="pr-1">
                          <label style="font-size: 0.8em"
                            >{{ $t("farm.totalFarmSize") }} <span>*</span></label
                          >
                          <v-tooltip top color="black" max-width="220">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon v-bind="attrs" v-on="on">
                                mdi-information-outline
                              </v-icon>
                            </template>
                            <span>{{ $t("farm.totalFarmSizeInfo") }}</span>
                          </v-tooltip>
                          <v-text-field
                            v-model="farm.area"
                            :placeholder="$t('e.g. 12 Hectare')"
                            outlined
                            required
                            dense
                            :rules="farmRules.farmSize"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="6">
                          <label>{{ $t("Unit") }}</label>
                          <v-tooltip top color="black" max-width="220">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon v-bind="attrs" v-on="on">
                                mdi-information-outline
                              </v-icon>
                            </template>
                            <span>{{ $t("farm.areaUOMInfo") }}</span>
                          </v-tooltip>
  
                          <v-select
                            :items="farmUnits"
                            :placeholder="'Select'"
                            v-model="farm.areaUomId"
                            outlined
                            class="text-capitalize"
                            item-text="name"
                            item-value="id"
                            dense
                            @change="changeAreaUnit"
                          >
                          </v-select>
                        </v-col>
                      </v-row>
                    </v-col> -->
                    <!-- <v-col cols="12" sm="6" md="3">
                      <v-row no-gutters class="d-flex">
                        <v-col cols="6" class="pr-1">
                          <label>{{ $t("farm.perimeterLength") }} </label>
                          <v-tooltip top color="black" max-width="220">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon v-bind="attrs" v-on="on">
                                mdi-information-outline
                              </v-icon>
                            </template>
                            <span>{{ $t("farm.perimeterLengthInfo") }}</span>
                          </v-tooltip>
                          <v-text-field
                            :placeholder="$t('farm.perimeterLength')"
                            outlined
                            dense
                            v-model="farm.parameter"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="6">
                          <label>{{ $t("Unit") }}</label>
                          <v-tooltip top color="black" max-width="220">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon v-bind="attrs" v-on="on">
                                mdi-information-outline
                              </v-icon>
                            </template>
                            <span>{{ $t("farm.permiterUOMInfo") }}</span>
                          </v-tooltip>
                          <v-select
                            v-model="farm.parameterUomId"
                            :items="periUni"
                            item-text="name"
                            item-value="id"
                            class="text-capitalize"
                            placeholder="Select"
                            outlined
                            dense
                          ></v-select>
                        </v-col>
                      </v-row>
                    </v-col> -->
                    <!-- <v-col cols="12" sm="6" md="3">
                      <label
                        >{{ $t("farm.perimeterPointLabel") }}
                        <v-tooltip top color="black" max-width="220">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">
                              mdi-help-circle-outline
                            </v-icon>
                          </template>
                          <span>{{
                            $t("farm.registration.perimeterPointLabel")
                          }}</span>
                        </v-tooltip></label
                      >
                      <v-text-field
                        :placeholder="$t('farm.perimeterPointLabel')"
                        outlined
                        dense
                        v-model="farm.periPointLabel"
                      ></v-text-field>
                    </v-col> -->
                    <!-- <v-col cols="12" sm="6" md="3">
                      <label
                        >{{ $t("farm.perimeterPointLatitude") }}
                        <v-tooltip top color="black" max-width="220">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">
                              mdi-help-circle-outline
                            </v-icon>
                          </template>
                          <span>{{
                            $t("farm.registration.perimeterPointLatitude")
                          }}</span>
                        </v-tooltip></label
                      >
                      <v-text-field
                        :placeholder="$t('farm.perimeterPointLatitude')"
                        outlined
                        dense
                        v-model.number="farm.periPointLat"
                        :rules="[
                          (v) => !v || validateLatLng(v) || 'Invalid Latitude',
                        ]"
                      ></v-text-field>
                    </v-col> -->
                    <!-- <v-col cols="12" sm="6" md="3">
                      <label
                        >{{ $t("farm.perimeterPointLongitude") }}
                        <v-tooltip top color="black" max-width="220">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">
                              mdi-help-circle-outline
                            </v-icon>
                          </template>
                          <span>{{
                            $t("farm.registration.perimeterPointLongitude")
                          }}</span>
                        </v-tooltip></label
                      >
                      <v-text-field
                        :placeholder="$t('farm.perimeterPointLongitude')"
                        outlined
                        dense
                        v-model.number="farm.periPointLng"
                        :rules="[
                          (v) => !v || validateLatLng(v) || 'Invalid Longitude',
                        ]"
                      ></v-text-field>
                    </v-col> -->
                  </v-row>
                  <v-row>
                    <v-col cols="12 pb-6">
                      <v-btn
                        color="primary"
                        dark
                        depressed
                        outlined
                        @click="showGeofenceTool"
                      >
                        {{ $t("farm.UPDATEGEOFENCEFORTHISFARM") }}
                      </v-btn>
  
                      <v-btn color="primary" depressed outlined
                        :disabled="isFarmValid"
                        @click="$router.push({ name: 'FarmZones',  query: { farmId: $route.params.farmId}, })">
                        {{ $t('farm.AddZonestothisfarm') }}
                      </v-btn>
  
                      <v-btn color="primary" depressed outlined
                        :disabled="isFarmValid"
                        @click="$router.push({ name: 'ZonesList', params: { id: parseInt($route.params.farmId) } })">
                        {{ $t('farm.ViewZonestothisfarm') }}
                      </v-btn>
                      <!-- <p class="mt-2 red--text">Note: Geofence is required for Satellite Reports and to add zones.</p> -->
                    </v-col>
                  </v-row>
                  <div
                    v-if="!farm.area || (farm.coordinates && !farm.coordinates.length)"
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
    </template>
    <v-container fluid v-if="!hasFarm && !mixingIsLoading">
      <v-card>
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
import { farmRules } from "@/validations/FarmFormRules.js";
import generalMixin from "@/mixins/GeneralMixin";
import FarmService from "../../_services/FarmService";
import PrimaryGeofence from "./PrimaryGeofence.vue";
import FarmLocation from "./FarmLocation.vue";
import { mapGetters,mapState } from "vuex";
import { countries } from "@/constants/countries.js";
import _ from 'lodash';
import { decodeHtmlEntities } from "@/utils.js";

export default {
  async mounted() {
    await this.getFarm();
    await this.fetchFarmers();
    await this.getCountries();
    await this.fetchFarmGoals();
    await this.fetchCertificationOptions();

    const checkPolygon = this.farm.coordinates && this.farm.coordinates.length > 0;
    const checkCircular = this.farm.segments && this.farm.segments.length > 0 && this.farm.segments[0].geofenceRadius;
    // const isGeofenceValid = this.farm.coordinates && this.farm.coordinates.length === 0 ? checkCircular : checkPolygon;

    this.isFarmValid = !(checkPolygon || checkCircular)
    this.farm.technicianId = this.technicianId;
    console.log(this.isFarmValid, "isFarmValid")
  },

  data() {
    return {
      isFarmValid: false,
      countries,
      options: {
        page: 1,
        searchPhrase: "",
        status: "",
        orderType: "DESC",
      },
      formChanged: false,
      promptToRoute: null,
      date: null,
      menu: "",
      error: false,
      countryLoading: false,
      stateLoading: false,
      cityLoading: false,
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
        lat: "",
        log: "",
      },
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: false,
          to: "/",
        },
        {
          text: this.$t("farm.farms"),
          link: true,
          exact: true,
          disabled: false,
          to: { name: "My farm" },
        },
        {
          text: this.$t("farm.registerAfarm"),
          disabled: true,
        },
      ],
      farm: {
        name: "",
        registrationNo:"",
        govRegistrationNo: "",
        farmType: "",
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
        farmingGoalOptId: null,
        productionType: "",
        certifications: [],
        farmingGoalsIds: [],
        farmerFirstName: "",
        farmerMiddleName: "",
        farmerLastName: "",
        isTechnician: false,
        technicianId:null,
        farmerId: "",
        userId: "",
        farmGeofenceName:"",
        farmGeofenceCategory:"",
        farmTitleDocument:"",
        farmTitleDocumentUrl:"",
      },
      selection: {
        country: null,
        state: null,
        city: null,
      },
      countryId: null,
      stateId: null,
      farmType: [],
      farmownershipType: [],
      res: [],
      farmUni: [
        { id: 1, name: "Acre" },
        { id: 2, name: "Hectare" },
      ],
      periUni: [
        { id: 1, name: "Feet" },
        { id: 2, name: "Meters" },
      ],
      farmRules,
      valid: true,
      country: [],
      state: [],
      city: [],
      users: [],
      farmGoals: [],
      certificationOptions: [],
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
      dataLossWarning: false,
      previewUrl:null,
      dragging: false,
    };
  },
  computed: {
    ...mapGetters({
      farmers: "memberData/farmers",
    }),
    ...mapState({
      technicianId:state=>state.auth.user?.id
    }),
    hasFarm() {
      return !_.isEmpty(this.farm);
    },
    // ...mapState('user',['user']),

    formattedFarmers() {
      return this.farmers.map((farmer) => ({
        ...farmer,
        farmerFullName: `${farmer.firstName} ${farmer.lastName}`,
      })).sort((a,b)=> a.farmerFullName.localeCompare(b.farmerFullName));
    },
    totalPages() {
      return this.farmersCount < this.options.limit
        ? 1
        : Math.ceil(this.farmersCount / this.options.limit);
    },
    currentUser() {
      return this.$store.getters.getUser;
    },
    // farmers() {
    //   return this.users.map((u) => {
    //     u.fullName = `${u.firstName} ${u.lastName}`;
    //     return u;
    //   });
    // },
    hasChanged() {
      return true;
    },
  },
  watch: {
    isFarmValid: {
      handler(nV) {
        console.log(nV, "nv")
      }
    },
    farm: {
      handler() {
        this.formChanged = true;
      },
      deep: true,
    },
    "farm.farmOwnershipType": function(nV) {
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
    // "farm.parameterUomId": {
    //   handler: function(newVal) {
    //     // Changes detected. Do work...
    //     this.farm.areaUomId = newVal;
    //   },
    //   deep: true,
    // },
  },

  methods: {
    decodeHtmlEntities,
    onFarmerChange(eValue) {
      console.log(eValue, "eValue.farmerFirstName")
      this.farm.farmerFirstName = eValue.firstName || null;
      this.farm.farmerMiddleName = eValue.middleName || null;
      this.farm.farmerLastName = eValue.lastName || null;
    },
    async onFarmDocumentChange(e) {
      var files = e.target.files || e.dataTransfer.files;

      console.log({files})

      this.previewUrl = URL.createObjectURL(files[0]);
      if (!files.length) {
        this.dragging = false;
        return;
      }

      this.createDocument(files[0]);
    },
    async createDocument(file) {
      this.farm.farmTitleDocument = file;
    },
    removeDocument() {
      this.farm.farmTitleDocument = "";
    },
    getFarm() {
      this.startLoading();
      FarmService.getFarm(this.$route.params.farmId).then(async (data) => {

        console.log({data});
        this.farm = data;
        // Decode HTML entities in the address
        if (this.farm.address) {
          this.farm.address = decodeHtmlEntities(this.farm.address);
        }
        if (!this.farm.owner || !this.farm.owner.userNumber) {
          this.farm.owner = { userNumber: this.farm.ownerId };
        }

        if (this.farm.coordinates && this.farm.coordinates.length > 0) {
          this.farm.farmGeofence = this.farm.coordinates.map((coord) => coord);
        }

        this.previewUrl= this.farm.farmTitleDocument;
        this.farm.farmTitleDocumentUrl = this.farm.farmTitleDocument

        if (data.owner && data.owner.name) {
          this.farm.ownerId = data.owner.name;
        }

        if (this.farm.country) {
          const selectedCountry = this.country.find(
            (item) => item.name.toLowerCase() === this.farm.country.toLowerCase()
          );
          this.selection.country = selectedCountry?.name || null;
        }

        this.selection.state = this.farm.state || null;
        this.selection.city = this.farm.city || null;

        if(this.farm.farmCertifications && this.farm.farmCertifications.length > 0){
          this.farm.certifications = this.farm.farmCertifications.map((cert)=>cert.id)
        }

        if(this.farm.farmGoals && this.farm.farmGoals.length){
          this.farm.farmingGoalsIds = this.farm.farmGoals.map((item)=>item.farmingGoalOptId);
        }
        this.farm.farmOwnershipType =  this.farm.farmOwnershipType || "personal"

        await this.getStates(this.farm.country.id);
        await this.getCity(this.farm.state.id);
      });

      this.stopLoading();

    },

    fetchFarmers() {
      this.startLoading();
      this.$store
        .dispatch("memberData/getFarmers", this.options)
        .then(() => this.stopLoading())
        .catch(() => this.stopLoading());
    },

    async fetchFarmGoals() {
      this.farmGoals = await FarmService.loadFarmOptions("farming-goals");
    },

    async fetchCertificationOptions() {
      this.certificationOptions = await FarmService.loadFarmOptions(
        "certification"
      );
    },

    async setLocationAddresses() {
      if (this.farm.country !== "") {
        this.selection.country =
          this.country.filter((country) => {
            return this.farm.country === country.name;
          })[0] || this.farm.country;

        if (typeof this.selection.country !== "string") {
          await this.getStates();

          if (this.farm.state !== "") {
            const state =
              this.state.filter((state) => {
                return this.farm.state === state.name;
              })[0] || this.farm.state;

            this.selection.state = state;
            this.farm.state = state;

            if (typeof this.selection.state !== "string") {
              await this.getCity();

              if (this.farm.city !== "") {
                this.selection.city =
                  this.city.filter((city) => {
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
      this.farm.address = decodeHtmlEntities(gdata.address) ?? this.farm.address;
      this.farm.coordinates = gdata.farmGeofence;
      this.farm.farmGeofence = gdata.farmGeofence;
      this.farm.farmSize = gdata.area;
      this.farm.parameter = +gdata.parameter;
      this.farm.farmPerimeter = +gdata.parameter;
      this.farm.farmSizeUomId = gdata.areaUomId;
      this.farm.farmPerimeterUomId = gdata.areaUomId; // 1 Acre = Feet, 2 Hac = Meter
      this.farm.farmGeofenceName = gdata.farmGeofenceName;
      this.farm.farmGeofenceCategory = gdata.farmGeofenceCategory
      this.farm.farmGeofenceRadius = gdata.farmGeofenceRadius,
      this.farm.farmGeofenceType = gdata.farmGeofenceType
      this.farm.circularGeofenceId = gdata.circularGeofenceId || this.farm?.segments[0]?.id

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
      this.farm.address = decodeHtmlEntities(data.address);

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
    async getusers() {
      const data = await FarmService.loadUsers();
      this.users = data.data.users;
    },
    async getCountries() {
      this.countryLoading = true;

      const data = await FarmService.loadCountries();

      this.country = data.data;
      this.countryLoading = false;
    },
    async getStates() {
      if (this.farm.country === null) return;
      this.stateLoading = true;
      this.farm.countryId = this.country.filter(
        (item) => item.name.toLowerCase() == this.farm.country.toLowerCase()
      )[0]?.code;
      this.city = [];

      if (!this.farm.countryId) return;

      const data = await FarmService.loadStates(this.farm.countryId);

      this.state =
        data.data.length !== 0
          ? data.data
          : { id: "0", name: "No state available" };
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

      this.city =
        data.data.length !== 0
          ? data.data
          : [{ id: "0", name: "No city available" }];
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
    async updateFarm() {
      if (!this.$refs.form.validate()) return;

      this.startLoading();
      const currentFileUrl = this.farm.farmTitleDocumentUrl;
      if(currentFileUrl !== this.farm.farmTitleDocument){
        const formData = new FormData();

        formData.append('file',this.farm.farmTitleDocument);
        await FarmService.uploadDocument(formData).then(({data})=>{
          console.log(data);
          this.farm.farmTitleDocumentUrl = data.farmTitleDocument.location
        })
        .catch((error)=>{
          if (error.status == 422) {
            console.log(error);
          error.data.message.errors.forEach((err) => {
          this.errors[err.param] = err.msg;
          });
            }
            this.stopLoading();
        });
      }

     

      const selectedIds = this.farm.farmingGoalsIds;
      if(selectedIds && selectedIds.length){
          let farmingGoals = this.farmGoals
          .filter((item) => selectedIds.includes(item.id))
          .map((item) => ({
            farmingGoalOptId: item.id,
            farmingGoal: item.name,
          }));
          this.farm.farmingGoals = farmingGoals;
      }

   
      if (!this.farm.productionType) {
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

      // Create a copy of farm data excluding only Reg. By fields
      const farmDataToUpdate = { ...this.farm };
      
      // Remove only registration-related fields that should not be updated
      delete farmDataToUpdate.technicianId; // Technician ID
      delete farmDataToUpdate.ownerId; // Owner ID
      delete farmDataToUpdate.owner; // Owner object
      
      // Handle userId differently based on isTechnician status
      if (this.farm.isTechnician) {
        // When isTechnician is true, remove userId (it's the Reg. By field)
        delete farmDataToUpdate.userId;
      } else {
        // When isTechnician is false, ensure userId is set from the user object
        if (farmDataToUpdate.user && farmDataToUpdate.user.id) {
          farmDataToUpdate.userId = farmDataToUpdate.user.id;
        }
      }
      
      // Ensure the farm ID is included for the update
      const farmId = this.$route.params.farmId;
      farmDataToUpdate.id = farmId;
      
      // if(this.selection.city || this.selection.country || this.selection.state){
      //   this.farm.city = this.selection.city;
      //   this.farm.country = this.selection.country?.name;
      //   this.farm.state = this.selection.state;
      // }

      // Handle userId properly - it should be the actual userId value, not an object
      if (farmDataToUpdate.userId && typeof farmDataToUpdate.userId === 'object' && farmDataToUpdate.userId.userId) {
        farmDataToUpdate.userId = farmDataToUpdate.userId.userId;
      } else if (farmDataToUpdate.user && farmDataToUpdate.user.id) {
        farmDataToUpdate.userId = farmDataToUpdate.user.id;
      }
      
      const data = await FarmService.editFarm(farmDataToUpdate).then((data)=>{
        if (data.success) {
        this.stopLoading();
        this.$notify({
          title: "Farm Updated",
          text: data.message,
          type: "success",
        });

        this.$router.push({ name: "Farms" });
      } else {
        this.$notify({
          title: "farm Not Updated",
          text: data.message,
          type: "error",
        });
      }
      })
      .catch((error)=>{
        if (error.status == 422) {
			    console.log(error);
				error.data.message.errors.forEach((err) => {
				this.errors[err.param] = err.msg;
				});
          }
          this.stopLoading();
      });

      console.log(data);
    },
  },

  components: {
    // "add-user": AddUser,
    // breadcrumb: Breadcrumb,
    PrimaryGeofence,
    // "prompt-dialog": PromptDialog,
    FarmLocation,
  },

  // beforeRouteLeave(to, from, next) {
  //   if (this.formChanged && !this.submitted) {
  //     this.promptToRoute = to;
  //     this.dataLossWarning = true;
  //     return;
  //   }
  //   next();
  // },

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

.form-checkbox .v-label {
  margin-bottom: 0 !important;
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
