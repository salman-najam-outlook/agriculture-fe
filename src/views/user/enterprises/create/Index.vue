<template>
  <div>
    <breadcrumb :items="breadcrumbs" class="pa-0 mb-4"></breadcrumb>
    <v-container class="pa-0" fluid>
      <div class="registration-wrapper">
        <div class="content-container">
          
          
          <div class="registration-content">
            <div class="d-flex justify-space-between align-center px-6 py-4">
              <h1 class="text-h5 font-weight-bold">Register New Enterprise/Client/Organization</h1>
              <div>
                <v-btn outlined @click="cancel" class="m-2">CANCEL</v-btn>
                <v-btn color="primary" class="ml-2" @click="submit">SUBMIT</v-btn>
                
              </div>
            </div>
  
            <v-form ref="form" v-model="valid" class="registration-form px-6 pb-3">
              <div class="membership-plan-section mb-6">
                <p class="text-subtitle-1 mb-2">Membership Plan</p>
                <v-select
                  v-model="membershipPlan"
                  :items="['Enterprise']"
                  class="membership-select"
                  filled
                  single-line
                  hide-details
                  background-color="white"
                  readonly
                  disabled
                ></v-select>
              </div>
  
              <!-- <AdminUsersForm v-model="adminUsers" class="mb-6" /> -->

              <div class="admin-section">
                <div class="section-title d-flex align-center mb-3">
                  <h3>Admin User</h3>
                </div>
                <div class="header d-flex align-center mb-4">
                  <div class="header-label d-flex align-center">
                    <span class="required-star">*</span>
                    <span>Name</span>
                  </div>
                  <div class="header-label d-flex align-center">
                    <span class="required-star">*</span>
                    <span>Email</span>
                  </div>
                </div>
                
                <div class="user-rows">
                  <div v-for="(user, index) in users" :key="index" class="mb-4">
                    <div class="d-flex align-center" style="gap: 16px;">
                      <v-text-field
                        v-model="user.name"
                        outlined
                        dense
                        hide-details
                        placeholder="Full Name"
                        class="flex-grow-1"
                        background-color="white"
                        :class="{ 'grey lighten-3': index < users.length - 1 }"
                        :readonly="index < users.length - 1"
                        required
                      ></v-text-field>
                      
                      <v-text-field
                        v-model="user.email"
                        outlined
                        dense
                        hide-details
                        placeholder="Email Address"
                        class="flex-grow-1"
                        background-color="white"
                        :class="{ 'grey lighten-3': index < users.length - 1 }"
                        :readonly="index < users.length - 1"
                        required
                      ></v-text-field>
                      
                      <div class="d-flex align-center" style="gap: 8px; min-width: 120px;">
                        <v-btn
                          v-if="index === users.length - 1"
                          text
                          small
                          color="primary"
                          class="px-0"
                          @click="addUser"
                        >
                          Add More
                        </v-btn>
                        
                        <v-btn
                          text
                          small
                          color="error"
                          class="px-0"
                          @click="removeUser(index)"
                        >
                          Remove
                        </v-btn>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- <EnterpriseDetailsForm v-model="enterpriseDetails" class="mb-6" /> -->
              <div class="enterprise-details form-container mt-5">
                <v-row no-gutters class="form-row">
                  <v-col cols="3" class="px-2">
                    <div class="input-label">Enterprise/Client/Organization Name</div>
                    <v-text-field
                      v-model="details.name"
                      placeholder="Enterprise / Client / Organization"
                      outlined
                      dense
                      class="custom-field"
                      hide-details
                      required
                    ></v-text-field>
                  </v-col>
                  
                  <v-col cols="3" class="px-2">
                    <div class="input-label">Enterprise/Client/Organization Logo</div>
                    <v-file-input
                      v-model="details.logo"
                      placeholder="Browse"
                      hint="supported file format JPG, PNG, GIF, SVG"
                      persistent-hint
                      outlined
                      dense
                      class="custom-field"
                      hide-details
                      border-dashed
                    >
                  </v-file-input>
                      <template v-slot:prepend>
                        <span class="text-green" >Browse</span>
                      </template>
                  </v-col>
                  
                  <v-col cols="3" class="px-2">
                    <div class="input-label">Enterprise/Client/Organization Phone Number</div>
                    <v-text-field
                      v-model="details.phone"
                      placeholder="Phone Number"
                      outlined
                      dense
                      class="custom-field"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  
                  <!-- <v-col cols="3" class="px-2">
                    <div class="input-label">Access to Dimitra Product(s)</div>
                    <v-select
                      v-model="details.products"
                      placeholder="Select"
                      outlined
                      dense
                      class="custom-field"
                      hide-details
                    ></v-select>
                  </v-col> -->

                  <!-- <v-col cols="3" class="px-2">
                    <div class="input-label">Language(s)</div>
                    <v-select
                      v-model="details.languages"
                      placeholder="Select Language"
                      outlined
                      dense
                      class="custom-field"
                      hide-details
                    ></v-select>
                  </v-col> -->
                  
                  <!-- <v-col cols="3" class="px-2">
                    <div class="input-label">Crop Type</div>
                    <v-select
                      v-model="details.cropType"
                      placeholder="Select Crop"
                      outlined
                      dense
                      class="custom-field"
                      hide-details
                    ></v-select>
                  </v-col> -->
                  
                  <!-- <v-col cols="3" class="px-2">
                    <div class="input-label">Crop Variety</div>
                    <v-select
                      v-model="details.cropVariety"
                      placeholder="Select Crop Variety"
                      outlined
                      dense
                      class="custom-field"
                      hide-details
                    ></v-select>
                  </v-col> -->

                  <!-- <v-col cols="3" class="px-2">
                    <div class="input-label">User Role(s)</div>
                    <v-select
                      v-model="details.userRoles"
                      placeholder="Select User Role"
                      outlined
                      dense
                      class="custom-field"
                      hide-details
                    ></v-select>
                  </v-col> -->

                  <v-col cols="3" class="px-2">
                    <div class="input-label">Country</div>
                    <v-select
                      v-model="details.country"
                      :items="countries"
                      placeholder="Select Country"
                      outlined
                      dense
                      class="custom-field"
                      hide-details
                      required
                    ></v-select>
                  </v-col>
                  
                  <!-- <v-col cols="3" class="px-2">
                    <div class="input-label">Province / State</div>
                    <v-text-field
                      v-model="details.province"
                      placeholder="Province / State"
                      outlined
                      dense
                      class="custom-field"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  
                  <v-col cols="3" class="px-2">
                    <div class="input-label">Region / District</div>
                    <v-text-field
                      v-model="details.region"
                      placeholder="Region / District"
                      outlined
                      dense
                      class="custom-field"
                      hide-details
                    ></v-text-field>
                  </v-col>
                  
                  <v-col cols="3" class="px-2">
                    <div class="input-label">Village / Town / City</div>
                    <v-text-field
                      v-model="details.village"
                      placeholder="Village / Town / City"
                      outlined
                      dense
                      class="custom-field"
                      hide-details
                    ></v-text-field>
                  </v-col>

                  <v-col cols="3" class="px-2">
                    <div class="input-label">Address</div>
                    <v-text-field
                      v-model="details.address"
                      placeholder="Address"
                      outlined
                      dense
                      class="custom-field"
                      hide-details
                    ></v-text-field>
                  </v-col> -->
                  
                  <v-col cols="3" class="px-2">
                    <div class="input-label">Status</div>
                    <v-select
                      v-model="details.status"
                      :items="status"
                      item-text="label"
                      item-value="value"
                      placeholder="Select Status"
                      outlined
                      dense
                      class="custom-field"
                      hide-details
                      required
                    ></v-select>
                  </v-col>
                </v-row>
              </div>

              <!-- <ModuleAccess v-model="moduleAccess" /> -->
              <div class="module-access mt-5">
                <v-card outlined>
                  <v-card-title class="subtitle-1 font-weight-bold pa-4">
                    Access to Modules on Admin Panel
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col
                        v-for="module in modules"
                        :key="module.id"
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-checkbox
                          v-model="selectedModules"
                          :label="module.name"
                          :value="module.id"
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </div>
            </v-form>
          </div>
        </div>
      </div>
    </v-container>
  </div>
  </template>
  
  <script>
  import { getCountries } from "country-state-picker";
  import UserService from "../../../../_services/UserService";
  import loadingMixin from "@/mixins/LoadingMixin";
  // import AdminUsersForm from '../components/AdminUsersForm.vue'
  // import EnterpriseDetailsForm from '../components/EnterpriseDetailsForm.vue'
  // import ModuleAccess from '../components/ModuleAccess.vue'
  
  export default {
    name: 'EnterpriseRegistration',
    components: {
      // AdminUsersForm,
      // EnterpriseDetailsForm,
      // ModuleAccess
    },
    data: () => ({
      valid: false,
      membershipPlan: 'Enterprise',
      details: {
        name: '',
        logo: null,
        phone: '',
        // products: [],
        // languages: [],
        // cropType: null,
        // cropVariety: null,
        // userRoles: [],
        country: null,
        // province: '',
        // region: '',
        // village: '',
        // address: '',
        status: null,
        registrationDate: new Date(),
        activationKeysAllowed: 5000, // Default value, change later
        dimitraPointSystem: false, // Default value, change later
      },
      status: [
        {
          value: 'active',
          label: "Active"
        },
        {
          value: 'deactivated',
          label: "Inactive"
        }
      ],
      products: [],
      languages: [],
      cropTypes: [],
      cropVarieties: [],
      userRoles: [],
      countries: [],
      statusOptions: [],
      selectedModules: [],
      modules: [],
      users: [
        {
          name: '',
          email: ''
        },
      ],
      breadcrumbs: [
        {
          text: 'Dashboard',
          disabled: false,
          href: '/dashboard',
        },
        {
          text: 'Enterprises',
          href: '/enterprises',
          disabled: false,
        },
      ],
    }),
    created() {
      this.countries = getCountries().map((country) => country.name);
    },
    async mounted() {
      const { data, success } = await UserService.getModules();

      if (!success) {
        this.$notify({
          title: "Failed to load modules",
          type: "error",
        });
        return;
      }

      this.modules = data;
      this.selectedModules = this.modules.map(module => module.id);
    },
    methods: {
      addUser() {
        this.users.push({
          name: '',
          email: ''
        })
      },
      removeUser(index) {
        if (this.users.length > 1) {
          this.users.splice(index, 1)
        }
      },
      async toBase64(file) {
        let data = new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        })
        return data;
      },
      async submit() {
        this.startLoading();
        if (this.$refs.form.validate()) {
          try {
            for (const user of this.users) {
              if (
                user.name.length === 0 || 
                user.email.length === 0 || 
                !user.email.includes('@') ||
                !user.email.includes('.') ||
                user.email.indexOf('@') > user.email.lastIndexOf('.')
              ) {
                this.$notify({
                  title: "Admin account information is invalid, please retry!",
                  type: "error",
                });
                this.stopLoading();
                return;
              }
            }

            if (this.selectedModules.length === 0) {
              this.$notify({
                title: "Select at least one module for the enterprise!",
                type: "error",
              });
              this.stopLoading();
              return;
            }

            if (this.details.name === null || 
              this.details.status === null || 
              this.details.country === null
            ) {
              this.$notify({
                title: "Please provide the enterprise name, status and country to proceed",
                type: "error",
              });
              this.stopLoading();
              return;
            }

            const payload = {
              users: this.users,
              organization: null
            };

            // Uploading enterprise logo
            const { logo, ...organization } = this.details;
            
            if (logo) {
              let base64Logo = await this.toBase64(logo);
              
              payload.organization = {
                ...organization,
                logo: base64Logo
              };
            } else {
              payload.organization = this.details;
            }

            // Submit enterprises
            const { success, message, data } = await UserService.saveEnterprise(payload);
            
            if (!success) {
              this.$notify({
                title: `Failed to create enterprise: ${message}`,
                type: "error",
              });
              this.stopLoading();
              return;
            }

            this.$notify({
              title: message,
              type: "success",
            });

            const { enterprise, adminRole } = data;

            // Assign enterprise modules
            const enterpriseModules = this.modules.filter((item) => this.selectedModules.includes(item.id));
            const { success: sidebarSuccess, message: sidebarMessage } = await UserService.saveEnterpriseModule({
              menuItems: enterpriseModules,
              orgId: enterprise.id,
              adminRole
            });

            if (!sidebarSuccess) {
              this.$notify({
                title: `Failed to create enterprise sidebar menu, please retry later: ${sidebarMessage}`,
                type: "error",
              });
              this.stopLoading();
              this.$router.push({
                name: 'view-enterprises',
                params: { id: enterprise.id }
              });
            }

            this.$notify({
              title: sidebarMessage,
              type: "success",
            });
            this.stopLoading();
            this.$router.push({
              name: 'view-enterprises',
              params: { id: enterprise.id }
            });
          } catch (error) {
            this.$notify({
              title: error.message,
              type: "error",
            });
            this.stopLoading();
          }
        } else {
          this.stopLoading();
        }
      },
      cancel() {
        // Handle cancellation
        this.$router.go(-1);
      },
     
    },
    mixins: [loadingMixin]
  }
  </script>
  
  <style scoped>
  .registration-wrapper {
    padding: 8px;
    min-height: 100vh /* Adjust based on your header height */
  }
  
  .content-container {
    width: 99%;
    margin: 0 auto;
  }
  
  .registration-content {
    width: 100%;
    background-color: white;
    border-radius: 4px;
  }
  
  .membership-plan-section {
    max-width: 400px;
  }
  
  .membership-select {
    border-radius: 4px;
  }
  
  .membership-select :deep(.v-input__slot) {
    box-shadow: none !important;
    border: 1px solid rgba(0, 0, 0, 0.12) !important;
    background-color: white !important;
  }
  
  .membership-select :deep(.v-select__slot label) {
    color: rgba(0, 0, 0, 0.6);
  }
  
  .membership-select :deep(.v-select__slot input) {
    cursor: default;
  }
  
  .membership-select :deep(.v-input__slot:hover) {
    border-color: rgba(0, 0, 0, 0.24) !important;
  }
  
  .membership-select :deep(.v-input__slot:focus-within) {
    border-color: var(--v-primary-base) !important;
  }

  .admin-section {
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 4px;
    padding: 16px;
  }

  .header {
    background-color: #147444;
    padding: 12px 16px;
    gap: 16px;
    border-radius: 4px 4px 0 0;
  }

  .header-label {
    flex: 1;
    color: white;
    font-size: 14px;
    font-weight: 500;
    gap: 4px;
  }

  .required-star {
    color: white;
  }

  .section-title {
    font-size: 16px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.87);
    padding-left: 16px;
  }

  .section-title h3 {
    font-size: inherit;
    font-weight: inherit;
    margin: 0;
  }

  .v-text-field >>> .v-input__control {
    min-height: 40px !important;
  }

  .v-text-field >>> .v-input__slot {
    min-height: 40px !important;
  }

  .form-container {
    background-color: white;
    padding: 20px;
  }

  .form-row {
    display: flex;
    flex-wrap: wrap;
    margin: -8px;
  }

  .input-label {
    font-size: 14px;
    color: #333;
    margin-bottom: 8px;
    font-weight: 500;
  }

  .custom-field {
    background-color: white !important;
    margin-bottom: 14px !important;
  }

  .custom-field :deep(.v-input__control) {
    height: 40px !important;
  }

  .custom-field :deep(.v-input__slot) {
    height: 50px !important;
    min-height: 40px !important;
    background-color: white !important;
  }

  .custom-field :deep(.v-text-field__slot) {
    height: 40px !important;
  }

  .custom-field :deep(.v-text-field__slot input) {
    font-size: 14px !important;
    color: #666 !important;
    padding: 0 12px !important;
    height: 100% !important;
  }

  .custom-field :deep(.v-select__slot) {
    font-size: 14px !important;
    height: 100% !important;
  }

  .custom-field :deep(.v-select__selections) {
    height: 100% !important;
    min-height: unset !important;
    padding: 0 12px !important;
  }

  .custom-field :deep(.v-select__selection) {
    margin: auto 0 !important;
    color: #666 !important;
  }

  .custom-field.v-text-field--outlined >>> fieldset {
    border-color: #e0e0e0 !important;
  }

  .text-green {
    color: #4CAF50 !important;
  }

  .px-2 {
    padding-left: 8px !important;
    padding-right: 8px !important;
  }

  .custom-field :deep(.v-file-input__text) {
    color: #666 !important;
    font-size: 14px !important;
    margin: auto 0 !important;
    padding: 0 12px !important;
  }

  .v-input--checkbox {
    margin-top: 0;
    padding-top: 0;
  }
  </style>