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
                    @click="
                      $router.push({ path: `/farms`, query: { page: 1 } })
                    "
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
                 
                  <v-col cols="12" sm="6" md="3" v-if="!farm.isTechnician">
                    <label for="text">
                      {{ $t("memberDataSection.farmers") }} <span>*</span>
                    </label
                    >
                    <v-autocomplete
                      :items="formattedFarmers"
                      :placeholder="$t('Select')"
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
                      <v-tooltip top color="black" max-width="220">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon v-bind="attrs" v-on="on">
                            mdi-help-circle-outline
                          </v-icon>
                        </template>
                        <span>{{ $t("farm.registration.farmName") }}</span>
                      </v-tooltip></label
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
                    <label for="text"
                      >{{ $t("farm.farmType")
                      }}<v-tooltip top color="black" max-width="220">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon v-bind="attrs" v-on="on">
                            mdi-help-circle-outline
                          </v-icon>
                        </template>
                        <span>{{ $t("farm.registration.farmType") }}</span>
                      </v-tooltip></label
                    >
                    <v-select
                      v-model="farm.farmType"
                      :items="farmTypes"
                      item-text="name"
                      item-value="id"
                      :placeholder="$t('farm.farmType')"
                      outlined
                      dense
                      class="text-capitalize"
                      :error-messages="errors.farmType"
                    ></v-select>
                  </v-col>

                  <v-col v-if="currentUser && currentUser.userDetail && currentUser.userDetail.role == 'admin'" cols="12" sm="6" md="3">
                    <label for="text"
                      >{{ $t("farm.farmOwner") }}<span>*</span>
                      <v-tooltip top color="black" max-width="220">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon v-bind="attrs" v-on="on">
                            mdi-help-circle-outline
                          </v-icon>
                        </template>
                        <span>{{ $t("farm.registration.farmOwner") }}</span>
                      </v-tooltip>
                    </label>
                    <!-- <v-text-field
                      v-model="farm.farmOwner"
                      outlined
                      dense
                      required
                      item-text="farmOwner"
                      item-value="id"
                      :placeholder="$t('farm.farmOwner')"
                      :error-messages="errors.farmOwner"
                      :rules="farmRules.farmOwner"
                    ></v-text-field> -->

                    <v-autocomplete
                                outlined
                                dense
                                v-model="farm.farmOwner"
                                :items="farmersList"
                                item-text="userName"
                                item-value="id"
                                attach
                                placeholder="Select Farm Owner"
                                :error-messages="errors.farmOwner"
                      :rules="farmRules.farmOwner"
                              >
                                <template v-slot:prepend-item>
                                  <v-list-item>
                                    <v-list-item-content>
                         
                                      <div>
                                        <v-icon style="color: #00bd73"
                                          >mdi-plus</v-icon
                                        >
                                        <a
                                        style="text-decoration: underline;"
                                          @click="showAdduser"
                                          >Create New Farm Owner</a
                                        >
                                      </div>
                                    </v-list-item-content>
                                  </v-list-item>
                                  <v-divider class="mt-2"></v-divider>
                                </template>
                              </v-autocomplete>
                  </v-col>
                  <v-col v-if="currentUser && currentUser.userDetail && currentUser.userDetail.role == 'farmer'" cols="12" sm="6" md="3">
                    <label for="text"
                      >{{ $t("farm.farmOwner") }}<span>*</span>
                      <v-tooltip top color="black" max-width="220">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon v-bind="attrs" v-on="on">
                            mdi-help-circle-outline
                          </v-icon>
                        </template>
                        <span>{{ $t("farm.registration.farmOwner") }}</span>
                      </v-tooltip>
                    </label>
                    <v-text-field
                      :disabled="true"
                      v-model="farm.farmOwner"
                      outlined
                      dense
                      required
                      :placeholder="`${currentUser && currentUser.userDetail && currentUser.userDetail.firstName} ${ currentUser && currentUser.userDetail && currentUser.userDetail.lastName}`"
                    ></v-text-field>
                  </v-col>

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
                      :placeholder="$t('Select')"
                      outlined
                      dense
                      v-model="farm.farmOwnershipType"
                      class="text-capitalize"
                      :error-messages="errors.farmOwnershipType"
                      :rules="farmRules.farmOwnershipType"
                    ></v-select>
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    md="3"
                    v-show="farm.farmOwnershipType == 'community'"
                  >
                    <label for="text">{{ $t("farm.CommunityName") }}
                    <v-tooltip top color="black" max-width="220">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon v-bind="attrs" v-on="on">
                            mdi-help-circle-outline
                          </v-icon>
                        </template>
                        <span>{{
                          $t("farm.registration.CommunityName")
                        }}</span>
                      </v-tooltip></label>
                    <v-text-field
                      item-text="name"
                      item-value="id"
                      :placeholder="$t('farm.CommunityName')"
                      outlined
                      dense
                      v-model="farm.communityName"
                      class="text-capitalize"
                    ></v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    md="3"
                    v-show="farm.farmOwnershipType == 'corporate'"
                  >
                    <label for="text">{{ $t("farm.corporateName") }}</label>
                    <v-text-field
                      item-text="name"
                      item-value="id"
                      :placeholder="'Enter Name'"
                      outlined
                      dense
                      v-model="farm.corporateName"
                      class="text-capitalize"
                    ></v-text-field>
                  </v-col>

                  <!-- <v-col
                    cols="12"
                    sm="6"
                    md="3"
                    v-show="farm.farmOwnershipType == 'personal'"
                  >
                  </v-col> -->

                  <v-col
                    cols="12"
                    sm="6"
                    md="3"
                    v-show="farm.farmOwnershipType == 'corporate'"
                  >
                    <label for="text">{{
                      $t("farm.corporateRegistrationNum")
                    }}</label>
                    <v-text-field
                      item-text="name"
                      item-value="id"
                      :placeholder="$t('#RED2871HD')"
                      outlined
                      dense
                      v-model="farm.corporateRegistrationNum"
                      class="text-capitalize"
                    ></v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    md="3"
                    v-show="farm.farmOwnershipType == 'corporate'"
                  >
                    <label for="text">{{
                      $t("farm.corporateMailingAddress")
                    }}</label>
                    <v-text-field
                      item-text="name"
                      item-value="id"
                      :placeholder="'Enter Mailing Address'"
                      outlined
                      dense
                      v-model="farm.corporateMailingAddress"
                      class="text-capitalize"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="3">
                    <label
                      >{{ $t("farm.govRegistrationNo") }}<span>*</span>
                      <v-tooltip top color="black" max-width="220">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon v-bind="attrs" v-on="on">
                            mdi-help-circle-outline
                          </v-icon>
                        </template>
                        <span>{{
                          $t("farm.registration.govtRegistrationNumber")
                        }}</span>
                      </v-tooltip></label
                    >
                    <v-text-field
                      :placeholder="$t('#RED2871HD')"
                      outlined
                      dense
                      required
                      :rules="farmRules.govRegistrationNo"
                      v-model="farm.govRegistrationNum"
                    ></v-text-field>
                  </v-col>

                  <!-- <v-col cols="12" sm="6" md="3">
                    <label>{{ $t("farm.contractMating") }}</label>
                    <v-text-field
                      :placeholder="$t('farm.contractMating')"
                      outlined
                      dense
                      v-model="farm.contractMating"
                    ></v-text-field>
                  </v-col> -->

                  <!-- <v-col cols="12" sm="6" md="3">
											<label>{{$t('farm.contractMating')}}<span>*</span></label>
											<v-text-field
												:placeholder="$t('farm.contractMating')"
												outlined
												dense
												v-model="farm.contractMating"
												:error-messages="errors.contractMating"
												:rules="farmRules.contractMating"
											></v-text-field>
										</v-col> -->

                  <v-col cols="12" sm="6" md="3">
                    <label
                      >{{ $t("Farming System") }}
                      <v-tooltip right color="black" max-width="320">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon v-bind="attrs" v-on="on"
                            >mdi-help-circle-outline</v-icon
                          >
                        </template>
                        <span
                          >Types of farming system should be chosen depending
                          upon the geographical and local climatic conditions
                          with keeping economics in mind. E.g. Loose Farming,
                          Conventional barn system and free range system.</span
                        >
                      </v-tooltip>
                    </label>
                    <v-select
                      :items="farmProductionSystems"
                      :placeholder="'Select'"
                      outlined
                      dense
                      class="text-capitalize"
                      item-text="name"
                      item-value="id"
                      v-model="farm.productionSystem"
                      multiple
                    >
                    </v-select>
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    md="3"
                    v-show="farm.farmOwnershipType == 'corporate'"
                  >
                    <label
                      >{{ $t("cooperativeId") }}
                      <v-tooltip right color="black" max-width="320">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon v-bind="attrs" v-on="on"
                            >mdi-help-circle-outline</v-icon
                          >
                        </template>
                        <span
                          >Cooperative ID refers to a unique identifier or code assigned to a cooperative or union.</span
                        >
                      </v-tooltip>
                    </label>
                    <v-text-field
                      :placeholder="'e.g. 34.4652342137'"
                      outlined
                      dense
                      v-model="farm.cooperativeId"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="3"
                    v-show="farm.farmOwnershipType == 'corporate'"
                  >
                    <label>{{ $t("farm.cooperativeName") }} 
                      <v-tooltip top color="black" max-width="220">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon v-bind="attrs" v-on="on">
                            mdi-help-circle-outline
                          </v-icon>
                        </template>
                        <span>{{ $t("This refers to the name of a cooperative or union, which is an organization formed by farmers or producers who come together to collectively market and sell their agricultural products or to achieve common goals in production, processing, or distribution.") }}</span>
                      </v-tooltip></label>
                    <v-text-field
                      :placeholder="'Enter Name'"
                      outlined
                      dense
                      v-model="farm.cooperativeName"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="3">
                    <label
                      >{{ $t("farm.houseNumber") }}
                      <v-tooltip top color="black" max-width="220">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon v-bind="attrs" v-on="on">
                            mdi-help-circle-outline
                          </v-icon>
                        </template>
                        <span>{{ $t("farm.houseNumberH") }}</span>
                      </v-tooltip></label
                    >
                    <v-text-field
                      :placeholder="$t('farm.houseNumber')"
                      outlined
                      dense
                      v-model="farm.houseNum"
                      :rules="farmRules.houseNo"
                    ></v-text-field>
                  </v-col>

                  <!-- <v-col cols="12" sm="6" md="3">
										<label>{{ $t('farm.goals') }}
											<v-tooltip right color="black" max-width="320">
												<template v-slot:activator="{ on, attrs }">
													<v-icon v-bind="attrs" v-on="on">mdi-help-circle-outline</v-icon>
												</template>
												<span>Types of farming system should be chosen depending upon the geographical and local
													climatic conditions with keeping economics in mind. E.g. Loose Farming, Conventional barn
													system and free range system.</span>
											</v-tooltip>
										</label>
										<v-select :items="goalOptions" :placeholder="'Select'" outlined dense
											class="text-capitalize" item-text="name" item-value="id" v-model="farm.goal">
										</v-select>
									</v-col> -->
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
                      >{{ $t("Farm Location Address") }}<span>*</span>

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
                      item-text="name"
                      dense
                      :loading="countryLoading"
                      v-model="farm.country"
                      item-value="code"
                      @change="getStates(farm.countryId)"
                      :rules="farmRules.country"
                    ></v-select>
                  </v-col>

                  <v-col cols="12" sm="6" md="3">
                    <label
                      >{{ $t("Province/State") }}<span>*</span>
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
                      required
                      dense
                      v-model="farm.state"
                      :rules="farmRules.state"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="3">
                    <label
                      >{{ $t("farm.city") }}<span>*</span>
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
                      required
                      dense
                      v-model="farm.city"
                      :rules="farmRules.city"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="3">
                    <label
                      >{{ $t("Street Number") }}
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
                  </v-col>
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
                  <v-col cols="12" sm="6" md="3">
                    <v-btn
                      color="primary"
                      dark
                      depressed
                      outlined
                      @click="showGeofenceTool"
                    >
                      {{ $t("ADD GEOFENCE FOR THIS FARM") }}
                    </v-btn>
                    <!-- <p class="mt-2 red--text">Note: Geofence is required for Satellite Reports and to add zones.</p> -->
                  </v-col>
                </v-row>
                <div
                  v-if="!farm.area || !farm.farmGeofence.length"
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
    <!-- <add-user
      v-if="showCreateUserDialog"
      @userAdded="userAdded"
      @closeAddUser="showCreateUserDialog = false"
      :dialogI="showCreateUserDialog"
    ></add-user>
    <prompt-dialog
      @closeDialog="showPromptDialog = false"
      @saveData="saveFormData"
      :dialogI="showPromptDialog"
      v-if="showPromptDialog"
    />
    <primary-geofence
      v-if="showMap"
      :showMap="showMap"
      :farm="farm"
      @close-location-modal="locationMapClosed"
      @close-without-change="closeWithoutChange"
    ></primary-geofence>
-->
    <FarmLocation
      v-if="showFarmLocation"
      :showMap="showFarmLocation"
      :farm="farm"
      @close-location-modal="farmLocationClosed"
      @close-without-change="closeWithoutChange"
    />
    <DataLostWarning
      :dialogI="dataLossWarning"
      v-if="dataLossWarning"
      @closeDialog="closeWarningMessage"
      @saveData="closeWarningMessage"
    ></DataLostWarning> 
  </div>
</template>

<script>
// import AddUser from "@/views/user/AddUser";
import loadingMixin from "@/mixins/LoadingMixin";
// import Breadcrumb from "@/components/core/Breadcrumb";
import { farmRules } from "@/validations/FarmFormRules.js";
// import countries from "@/constants/countries.js";
import generalMixin from "@/mixins/GeneralMixin";
import FarmService from "../../_services/FarmService";
// import PrimaryGeofence from "./PrimaryGeofence.vue";
import FarmLocation from "./FarmLocation.vue";
import {mapGetters} from 'vuex'

export default {
  async mounted(){
    await this.fetchFarmers();
    await this.getCountries();
    await this.getusers();
  },
  // apollo: {
  //   users: {
  //     query: users,
  //     update: (data) => {
  //       console.log(data, "data");
  //       return data.users;
  //     },
  //   },
  //   farmersList: {
  //     query: farmersList,
  //     result({data}) {
  //       this.farmerItems = data.farmersList
  //     }
  //   },
  //   getFarmFormOptions: {
  //     query: getFarmFormOptions,
  //     update: (data) => data.getFarmFormOptions,
  //     fetchPolicy: "no-cache",
  //     variables() {
  //       return {};
  //     },
  //     result({ data }) {
  //       const farmType = data.getFarmFormOptions.find(
  //         (farmType) => farmType.groupName == "FarmTypes"
  //       );
  //       this.farmTypes = farmType.options;

  //       // this.ownershipTypes = options['farm-ownership-type'];
  //       const productionSystem = data.getFarmFormOptions.find(
  //         (farmType) => farmType.groupName == "FarmProductionSystem"
  //       );
  //       this.farmProductionSystems = productionSystem.options;
  //       this.loading = false;
  //       console.log("AVAILABLE QUICK FILTER", data);
  //     },
  //   },
  //   country: {
  //     query: country,
  //     update: (data) => data.country,
  //     fetchPolicy: "no-cache",
  //     variables() {
  //       return {};
  //     },
  //     result({ data }) {
  //       // debugger;
  //       this.countries = data.country;
  //     },
  //   },
  // },
  data() {
    return {
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
      countryLoading: false,
      stateLoading: false,
      cityLoading: false,
      errors: {
        name: "",
        farmType: "",
        farmownershipType: "",
        ownerName: "",
        govRegistrationNum: "",
        contractMating: "",
        productionSystemOptId: "",
        regulatorRepresentiveName: "",
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
        userId: null,
        farmNumber: "",
        farmName: "",
        registrationNo: "",
        lat: 0,
        log: 0,
        address: "",
        area: "",
        areaUomId: 0,
        parameter: 0,
        parameterUomId: 0,
        farmOwnershipType: "personal",
        farmGeofence: [],
        farmingGoalOptId:null,
        productionType:"",
        certifications:[],
        farmingGoalsIds:[],
        farmerFirstName:"",
        farmerMiddleName:"",
        farmerLastName:"",
        isTechnician:false,
        farmerId:"",
        userId:""
      },
      // countryId: 101,
      // stateId: 4022,
      // farmType: [],
      // farmownershipType: [],
      // productionSystem: [],
      // res: [],
      farmUnits: [
        { id: 1, name: "Acre" },
        { id: 2, name: "Hectare" },
      ],
      periUni: [
        { id: 1, name: "Acre" },
        { id: 2, name: "hectare" },
      ],
      farmRules,
      valid: true,
      // country: [],
      // state: [],
      // city: [],
      // users:[],
      showPromptDialog: false,
      promptToRoute: null,
      promptNextRoute: false,
    };
  },
  computed: {
    ...mapGetters({
      'farmers': 'memberData/farmers', 
    }),

    // ...mapState('user',['user']),
   

   formattedFarmers(){
    return this.farmers.map(farmer=>({
      ...farmer,
      farmerFullName:`${farmer.firstName} ${farmer.lastName}`
    }))
   },
    totalPages(){
      return this.farmersCount < this.options.limit ? 1 : Math.ceil(this.farmersCount/this.options.limit)
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
    "farm.parameterUomId": {
      handler: function (newVal) {
        // Changes detected. Do work...
        this.farm.areaUomId = newVal;
      },
      deep: true,
    },
  },

  methods:{
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
            this.selection.state = this.state.filter((state) => {
              return this.farm.state === state.name;
            })[0] || this.farm.state;

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
      this.farm.address = gdata.address ?? this.farm.address;
      this.farm.farmGeofence = gdata.farmGeofence;
      this.farm.farmSize = gdata.area;
      this.farm.farmPerimeter = +gdata.parameter;
      this.farm.farmSizeUomId = gdata.areaUomId;
      this.farm.farmPerimeterUomId = gdata.areaUomId; // 1 Acre = Feet, 2 Hac = Meter
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

      this.farm.area = data.area;
      
      if (data.addressData) {
        this.farm.country = data.addressData.country;
        this.farm.city = data.addressData.locality;
        this.farm.state = data.addressData.administrative_area_level_1;
        //this.farm.street = data.addressData.street_number
        this.farm.street = data.addressData.route;
      }

      await this.setLocationAddresses();
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

      this.countries = data.data;
      this.countryLoading = false
    },
    async getStates() {
      if (this.farm.country === null) return;


      this.stateLoading = true;
      this.farm.countryId = this.farm.country;
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

      const selectedIds = this.farm.farmingGoalsIds;

      let farmingGoals = this.farmGoals.filter(item=>selectedIds.includes(item.id)).map(item=>({
        farmingGoalOptId:item.id,
        farmingGoal:item.name
      }));

      this.farm.farmingGoals = farmingGoals;

      if(!this.farm.productionType){
        delete this.farm.productionType;
      }


      const data = await FarmService.addFarm(this.farm);

      console.log(data);

        if(data.success){
          this.stopLoading();

          this.$notify({
            title:"Farm added",
            text:data.message,
            type:"success"
          });

          await this.$router.push({name : "Farms"});

        }
        else {
          this.stopLoading();

          this.$notify({
            title: "farm Not Added",
            text: data.message,
            type: "error",
          });
        }
        this.stopLoading();

    }
  },
 
  components: {
    // "add-user": AddUser,
    // breadcrumb: Breadcrumb,
    // PrimaryGeofence,
    // "prompt-dialog": PromptDialog,
    FarmLocation,
  },
  
  beforeRouteLeave(to, from, next) {
    if (this.formChanged && !this.submitted) {
      this.promptToRoute = to;
      this.dataLossWarning = true;
      return;
    }
    next();
  },
  
  mixins: [loadingMixin, generalMixin],
  // beforeRouteLeave(to, from, next) {
  //   if (this.promptNextRoute) {
  //     next();
  //   } else {
  //     if (this.hasChanged) {
  //       this.promptToRoute = to;
  //       this.showPromptDialog = true;
  //     } else {
  //       next();
  //     }
  //   }
  // },
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
</style>
