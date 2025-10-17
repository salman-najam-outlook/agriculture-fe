<template>
  <v-container>
    <v-card>
      <div class="d-flex justify-space-between align-center pa-2">
        <h1>{{ $t('farm_upload_validation.Farm_Upload_Validation')}} </h1>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="goBack">{{$t('farm_upload_validation.Go_Back')}}</v-btn>
      </div>
      <v-card-text>
        <v-simple-table>
          <thead>
            <tr>
              <th width="30%">{{ $t('farm_upload_validation.Input_Field')}}</th>
              <th>
                {{ $t('farm_upload_validation.Description')}}
              </th>
              <th>
                {{ $t('farm_upload_validation.Validation_Message')}}
              </th>
              <th>
                {{ $t('farm_upload_validation.Action')}}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <v-text-field v-model="formData.farmName" :rules="rules.farmName"
                  :label="$t('farm_upload_validation.Farm_Name')" outlined @input="validateField('farmName')"
                  @blur="validateField('farmName')"></v-text-field>
              </td>
              <td>
                {{ $t('farm_upload_validation.Helper_Messages.Farm_Name.Description')}}
                {{ $t('farm_upload_validation.Helper_Messages.Farm_Name.Usage')}}
              </td>
              <td>
                <v-alert v-if="validationMessages.farmName" dense type="error">
                  {{ validationMessages.farmName }}
                </v-alert>
              </td>
              <td>
                <v-btn color="primary" @click="validateField('farmName')">
                  {{ $t('farm_upload_validation.Validate')}}
                </v-btn>
              </td>
            </tr>
            <tr>
              <td>
                <v-text-field v-model="formData.farmRegistrationID" :rules="rules.farmRegistrationID"
                  :label="$t('farm_upload_validation.Farm_Registration_ID')" outlined
                  @input="validateField('farmRegistrationID')"
                  @blur="validateField('farmRegistrationID')"></v-text-field>
              </td>
              <td>
                {{ $t('farm_upload_validation.Helper_Messages.Farm_Registration_ID.Description') }}
                {{ $t('farm_upload_validation.Helper_Messages.Farm_Registration_ID.Assignment') }}
              </td>
              <td>
                <v-alert v-if="validationMessages.farmRegistrationID" dense type="error">
                  {{ validationMessages.farmRegistrationID }}
                </v-alert>
              </td>
              <td>
                <v-btn color="primary" @click="validateField('farmName')">
                  {{ $t('farm_upload_validation.Validate')}}
                </v-btn>
              </td>
            </tr>

            <tr>
              <td>
                <v-text-field v-model.lazy="formData.firstName" :rules="rules.firstName"
                  :label="$t('farm_upload_validation.Farmer_First_Name')" outlined
                  @blur="validateField('firstName')"></v-text-field>
              </td>
              <td>
                {{$t('farm_upload_validation.Helper_Messages.Farmer_First_Name.Description')}}
                {{$t('farm_upload_validation.Helper_Messages.Farmer_First_Name.Usage')}}
                <br />
                - {{$t('farm_upload_validation.Helper_Messages.Farmer_First_Name.Instructions_1')}}
                <br />
                - {{$t('farm_upload_validation.Helper_Messages.Farmer_First_Name.Instructions_2')}}
                <br />
                - {{$t('farm_upload_validation.Helper_Messages.Farmer_First_Name.Instructions_3')}}.
              </td>
              <td>
                <v-alert v-if="validationMessages.firstName" dense type="error">
                  {{ validationMessages.firstName }}
                </v-alert>
              </td>
              <td>
                <v-btn color="primary" @click="validateField('farmName')">
                  {{ $t('farm_upload_validation.Validate')}}
                </v-btn>
              </td>
            </tr>
            <tr>
              <td>
                <v-text-field v-model="formData.lastName" :rules="rules.lastName"
                  :label="$t('farm_upload_validation.Farmer_Last_Name')" outlined @input="validateField('lastName')"
                  @blur="validateField('lastName')"></v-text-field>
              </td>
              <td>
                {{ $t('farm_upload_validation.Helper_Messages.Farmer_Last_Name.Description')}}
                {{ $t('farm_upload_validation.Helper_Messages.Farmer_Last_Name.Usage')}}
                <br />
                - {{ $t('farm_upload_validation.Helper_Messages.Farmer_Last_Name.Instructions_1')}}
                <br />
                - {{ $t('farm_upload_validation.Helper_Messages.Farmer_Last_Name.Instructions_2')}}
                <br />
                - {{ $t('farm_upload_validation.Helper_Messages.Farmer_Last_Name.Instructions_3')}}

              </td>
              <td>
                <v-alert v-if="validationMessages.lastName" dense type="error">
                  {{ validationMessages.lastName }}
                </v-alert>
              </td>
              <td>
                <v-btn color="primary" @click="validateField('farmName')">
                  {{ $t('farm_upload_validation.Validate')}}
                </v-btn>
              </td>
            </tr>
            <tr>
              <td>
                <v-text-field v-model="formData.registrationID" :rules="rules.registrationID"
                  :label="$t('farm_upload_validation.Farmer_Registration_ID')" outlined
                  @input="validateField('registrationID')" @blur="validateField('registrationID')"></v-text-field>
              </td>
              <td>
                {{ $t('farm_upload_validation.Helper_Messages.Farmer_Registration_ID.Description') }}
                {{ $t('farm_upload_validation.Helper_Messages.Farmer_Registration_ID.Assignment') }}
                {{ $t('farm_upload_validation.Helper_Messages.Farmer_Registration_ID.Usage') }}
                <br />
                - {{ $t('farm_upload_validation.Helper_Messages.Farmer_Registration_ID.Instructions_1') }}
                <br />
                - {{ $t('farm_upload_validation.Helper_Messages.Farmer_Registration_ID.Instructions_2') }}
                <br />
                - {{ $t('farm_upload_validation.Helper_Messages.Farmer_Registration_ID.Instructions_3') }}

              </td>
              <td>
                <v-alert v-if="validationMessages.registrationID" dense type="error">
                  {{ validationMessages.registrationID }}
                </v-alert>
              </td>
              <td>
                <v-btn color="primary" @click="validateField('farmName')">
                  {{ $t('farm_upload_validation.Validate')}}
                </v-btn>
              </td>
            </tr>
            <tr>
              <td>
                <v-text-field v-model="formData.email" :rules="rules.email" :label="
                 $t('farm_upload_validation.User_Email_Address')
                " outlined @input="validateField('email')" @blur="validateField('email')"></v-text-field>
              </td>
              <td>
                {{ $t('farm_upload_validation.Helper_Messages.User_Email_Address.Description') }}
                {{ $t('farm_upload_validation.Helper_Messages.User_Email_Address.Context') }}
                {{ $t('farm_upload_validation.Helper_Messages.User_Email_Address.Usage') }}
             
                <br />
                - {{  $t('farm_upload_validation.Helper_Messages.User_Email_Address.Instructions_1') }}
                <br />
                - {{ $t('farm_upload_validation.Helper_Messages.User_Email_Address.Instructions_2') }}
                <br />
                - {{ $t('farm_upload_validation.Helper_Messages.User_Email_Address.Instructions_3') }}
                <br />
                - {{ $t('farm_upload_validation.Helper_Messages.User_Email_Address.Instructions_4') }}
              </td>
              <td>
                <v-alert v-if="validationMessages.email" dense type="error">
                  {{ validationMessages.email }}
                </v-alert>
              </td>
              <td>
                <v-btn color="primary" @click="validateField('farmName')">
                  {{ $t('farm_upload_validation.Validate')}}
                </v-btn>
              </td>
            </tr>
            <tr>
              <td>
                <v-select v-model="formData.sharedAccessWith" :items="formData.userEntities"
                  :rules="rules.sharedAccessWith" :label="$t('farm_upload_validation.Shared_Access_With')" multiple
                  @blur="validateField('sharedAccessWith')"></v-select>
              </td>
              <td>
                {{ $t('farm_upload_validation.Helper_Messages.Shared_Access_With.Description') }}
                {{ $t('farm_upload_validation.Helper_Messages.Shared_Access_With.Usage') }}
              </td>
              <td>
                <!-- Specify users or entities to share access or leave blank. For example, enter in formats such as
                "user@example.com", "John Doe", "Cooperative A". -->
                <v-alert v-if="validationMessages.sharedAccessWith" dense type="error">
                  {{ validationMessages.sharedAccessWith }}
                </v-alert>
              </td>
              <td>
                <v-btn color="primary" @click="validateField('farmName')">
                  {{ $t('farm_upload_validation.Validate')}}
                </v-btn>
              </td>
            </tr>
            <tr>
              <td>
                <v-select v-model="formData.ownershipType" :items="formData.ownershipOptions"
                  :rules="rules.ownershipType" @blur="validateField('ownershipType')"
                  :label="$t('farm_upload_validation.Ownership_Type')"></v-select>
              </td>
              <td>
                {{ $t('farm_upload_validation.Helper_Messages.Ownership_Type.Description') }}
                {{ $t('farm_upload_validation.Helper_Messages.Ownership_Type.Examples') }}
                {{ $t('farm_upload_validation.Helper_Messages.Ownership_Type.Usage') }}
              </td>
              <td>
                <!-- Provide the ownership type to categorize the farm. If left blank, the system will auto-generate
                "Unknown". -->
                <v-alert v-if="validationMessages.ownershipType" dense type="error">
                  {{ validationMessages.ownershipType }}
                </v-alert>
              </td>
              <td>
                <v-btn color="primary" @click="validateField('farmName')">
                  {{ $t('farm_upload_validation.Validate')}}
                </v-btn>
              </td>
            </tr>
            <tr>
              <td>
                <v-textarea v-model="formData.farmGoals" :rules="rules.farmGoals"
                  :label="$t('farm_upload_validation.Goal_s')"></v-textarea>
              </td>
              <td>
                {{ $t('farm_upload_validation.Helper_Messages.Goal_s.Description') }}
              </td>
              <td>
                <!-- Please enter farm goals, if available. If left blank, this field will remain empty. -->
                <v-alert v-if="validationMessages.farmGoals" dense type="error">
                  {{ validationMessages.farmGoals }}
                </v-alert>
              </td>
              <td>
                <v-btn color="primary" @click="validateField('farmName')">
                  {{ $t('farm_upload_validation.Validate')}}
                </v-btn>
              </td>
            </tr>
            <tr>
              <td>
                <v-select v-model="formData.productionType" :items="formData.productionOptions"
                  :rules="rules.productionType" :label="$t('farm_upload_validation.Production_Type')"></v-select>
              </td>
              <td>
                {{ $t('farm_upload_validation.Helper_Messages.Production_Type.Description') }}
              </td>
              <td>
                <!-- Provide the production type for better data accuracy. If left blank, this field will remain empty. -->
                <v-alert v-if="validationMessages.productionType" dense type="error">
                  {{ validationMessages.productionType }}
                </v-alert>
              </td>
              <td>
                <v-btn color="primary" @click="validateField('farmName')">
                  {{ $t('farm_upload_validation.Validate')}}
                </v-btn>
              </td>
            </tr>
            <tr>
              <td>
                <v-select v-model="formData.certifications" :items="formData.certificationOptions"
                  :rules="rules.certifications" :label="$t('farm_upload_validation.Certifications')"
                  multiple></v-select>
              </td>
              <td>
                {{ $t('farm_upload_validation.Helper_Messages.Certifications.Description') }}
              </td>
              <td>
                <!-- Please provide certifications, if available. If left blank, the field will remain empty. -->
                <v-alert v-if="validationMessages.certifications" dense type="error">
                  {{ validationMessages.certifications }}
                </v-alert>
              </td>
              <td>
                <v-btn color="primary" @click="validateField('farmName')">
                  {{ $t('farm_upload_validation.Validate')}}
                </v-btn>
              </td>
            </tr>
            <tr>
              <td>
                <v-text-field v-model="formData.farmSize" :rules="rules.farmSize" @blur="validateField('farmSize')"
                  :label="$t('farm_upload_validation.Total_Farm_Size')"></v-text-field>
              </td>
              <td>
                {{ $t('farm_upload_validation.Helper_Messages.Total_Farm_Size.Description') }}
              </td>
              <td>
                <!-- Please enter the farm size to ensure accurate analysis of your farm. Ensure the value is numeric and
                positive. -->
                <v-alert v-if="validationMessages.farmSize" dense type="error">
                  {{ validationMessages.farmSize }}
                </v-alert>
              </td>
              <td>
                <v-btn color="primary" @click="validateField('farmName')">
                  {{ $t('farm_upload_validation.Validate')}}
                </v-btn>
              </td>
            </tr>
            <tr>
              <td>
                <v-textarea v-model="formData.farmAddress" :rules="rules.farmAddress"
                  :label="$t('farm_upload_validation.Farm_Address')" @blur="validateField('farmAddress')"></v-textarea>
              </td>
              <td>
                {{ $t('farm_upload_validation.Helper_Messages.Farm_Address.Description') }}
              </td>
              <td>
                <!-- Please provide the farm address for better location identification. If left blank, the system will leave
                the field empty. -->
                <v-alert v-if="validationMessages.farmAddress" dense type="error">
                  {{ validationMessages.farmAddress }}
                </v-alert>
              </td>
              <td>
                <v-btn color="primary" @click="validateField('farmName')">
                  {{ $t('farm_upload_validation.Validate')}}
                </v-btn>
              </td>
            </tr>
            <tr>
              <td>
                <v-text-field v-model="formData.farmGPSCoordinates" :rules="rules.farmGPSCoordinates"
                  @blur="validateField('farmGPSCoordinates')"
                  :label="$t('farm_upload_validation.Farm_GPS_Coordinates')"></v-text-field>
              </td>
              <td>
                {{ $t('farm_upload_validation.Helper_Messages.Farm_GPS_Coordinates.Description') }}
              </td>
              <td>
                <!-- Provide coordinates for accurate farm placement. Ensure latitude is between -90 and 90, longitude
                between -180 and 180. -->
                <v-alert v-if="validationMessages.farmGPSCoordinates" dense type="error">
                  {{ validationMessages.farmGPSCoordinates }}
                </v-alert>
              </td>
              <td>
                <v-btn color="primary" @click="validateField('farmName')">
                  {{ $t('farm_upload_validation.Validate')}}
                </v-btn>
              </td>
            </tr>
            <tr>
              <td>
                <v-text-field v-model="formData.farmCountry" :rules="rules.farmCountry"
                  :label="$t('farm_upload_validation.Country')" @blur="validateField('farmCountry')"></v-text-field>
              </td>
              <td>
                {{ $t('farm_upload_validation.Helper_Messages.Country.Description') }}
              </td>
              <td>
                <!-- Provide the country name to ensure accurate records. Ensure correct spelling and avoid abbreviations. -->
                <v-alert v-if="validationMessages.farmCountry" dense type="error">
                  {{ validationMessages.farmCountry }}
                </v-alert>
              </td>
              <td>
                <v-btn color="primary" @click="validateField('farmName')">
                  {{ $t('farm_upload_validation.Validate')}}
                </v-btn>
              </td>
            </tr>
            <tr>
              <td>
                <v-text-field v-model="formData.farmProvinceState" :rules="rules.farmProvinceState"
                  @blur="validateField('farmProvinceState')"
                  :label="$t('farm_upload_validation.Province_State')"></v-text-field>
              </td>
              <td>
                {{ $t('farm_upload_validation.Helper_Messages.Province_State.Description') }}
              </td>
              <td>
                <!-- Provide province or state information, if applicable. If left blank, the system will leave this field
                empty. -->
                <v-alert v-if="validationMessages.farmProvinceState" dense type="error">
                  {{ validationMessages.farmProvinceState }}
                </v-alert>
              </td>
              <td>
                <v-btn color="primary" @click="validateField('farmName')">
                  {{ $t('farm_upload_validation.Validate')}}
                </v-btn>
              </td>
            </tr>
            <tr>
              <td>
                <v-text-field v-model="formData.farmVillageTownCity" :rules="rules.farmVillageTownCity"
                  @blur="validateField('farmVillageTownCity')"
                  :label="$t('farm_upload_validation.Village_Town_City')"></v-text-field>
              </td>
              <td>
                {{ $t('farm_upload_validation.Helper_Messages.Village_Town_City.Description') }}
              </td>
              <td>
                <!-- Provide town or city name for better location identification. If left blank, this field will remain
                empty. -->
                <v-alert v-if="validationMessages.farmVillageTownCity" dense type="error">
                  {{ validationMessages.farmVillageTownCity }}
                </v-alert>
              </td>
              <td>
                <v-btn color="primary" @click="validateField('farmName')">
                  {{ $t('farm_upload_validation.Validate')}}
                </v-btn>
              </td>
            </tr>
            <tr>
              <td>
                <v-textarea v-model="formData.farmGeofence" :rules="rules.farmGeofence"
                  @blur="validateField('farmGeofence')"
                  :label="$t('farm_upload_validation.Farm_Geofence')"></v-textarea>
              </td>
              <td>
                {{ $t('farm_upload_validation.Helper_Messages.Farm_Geofence.Description') }}
              </td>
              <td>
                <!-- Provide farm geofence details for mapping. For Polygon: Enter boundary points as pairs of latitude,
                longitude. For Circle: Enter the center coordinates and area in hectares. -->
                <v-alert v-if="validationMessages.farmGeofence" dense type="error">
                  {{ validationMessages.farmGeofence }}
                </v-alert>
              </td>
              <td>
                <v-btn color="primary" @click="validateField('farmName')">
                  {{ $t('farm_upload_validation.Validate')}}
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="submitForm">{{$t('submit')}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>


<script>
import axios from 'axios';
export default {
  data() {
    return {
      formData: {
        farmName: '',
        farmRegistrationID: '',
        firstName: '',
        lastName: '',
        registrationID: '',
        email: '',
        sharedAccessWith: [],
        ownershipType: null,
        farmGoals: '',
        productionType: null,
        certifications: [],
        userEntities: [
          "user@example.com",
          "John Doe",
          "Cooperative A",
          "Enterprise X",
        ],
        ownershipOptions: ["Individual", "Partnership", "Corporate"],
        productionOptions: ["Organic", "Conventional"],
        certificationOptions: ["Organic Certification", "Fair Trade", "GAP"],
        farmSize: '',
        farmAddress: '',
        farmGPSCoordinates: '',
        farmCountry: '',
        farmProvinceState: '',
        farmVillageTownCity: '',
        farmGeofence: '',
      },
      validationMessages: {
        farmName: null,
        farmRegistrationID: null,
        firstName: null,
        lastName: null,
        registrationID: null,
        email: null,
        sharedAccessWith: null,
        ownershipType: null,
        farmGoals: null,
        productionType: null,
        certifications: null,
        farmSize: null,
        farmAddress: null,
        farmGPSCoordinates: null,
        farmCountry: null,
        farmProvinceState: null,
        farmVillageTownCity: null,
        farmGeofence: null,
      },
      rules: {
        farmName: [
          v => !!v || this.$t('farm_upload_validation.validation.farmNameRequired'),
          v => (v && v.length <= 50) || this.$t('farm_upload_validation.validation.farmNameMaxLength'),
          async v => await this.checkFarmName(v) || this.$t('farm_upload_validation.validation.farmNameExists'),
        ],
        farmRegistrationID: [
          v => !!v || this.$t('farm_upload_validation.validation.registrationIDRequired'),
          v => (v && v.length <= 20) || this.$t('farm_upload_validation.validation.registrationIDMaxLength'),
        ],
        firstName: [
          v => !!v || this.$t('farm_upload_validation.validation.firstNameRequired'),
          v => /^[A-Za-z]+$/.test(v) || this.$t('farm_upload_validation.validation.firstNameLettersOnly'),
        ],
        lastName: [
          v => !!v || this.$t('farm_upload_validation.validation.lastNameRequired'),
          v => /^[A-Za-z]+$/.test(v) || this.$t('farm_upload_validation.validation.lastNameLettersOnly'),
        ],
        registrationID: [
          v => !!v || this.$t('farm_upload_validation.validation.registrationIDRequired'),
        ],
        email: [
          v => !!v || this.$t('farm_upload_validation.validation.emailRequired'),
          v => /.+@.+\..+/.test(v) || this.$t('farm_upload_validation.validation.emailValid'),
          v => !/\s/.test(v) || this.$t('farm_upload_validation.validation.emailNoSpaces'),
        ],
        sharedAccessWith: [
          v => v.length > 0 || this.$t('farm_upload_validation.validation.sharedAccessWithRequired'),
        ],
        ownershipType: [
          v => !!v || this.$t('farm_upload_validation.validation.ownershipTypeRequired'),
        ],
        farmGoals: [
          v => !v || v.length <= 500 || this.$t('farm_upload_validation.validation.farmGoalsMaxLength'),
        ],
        productionType: [
          v => !!v || this.$t('farm_upload_validation.validation.productionTypeRequired'),
        ],
        certifications: [
          v => v.length > 0 || this.$t('farm_upload_validation.validation.certificationsRequired'),
        ],
        farmSize: [
          v => !!v || (parseFloat(v) > 0 && !isNaN(v)) || this.$t('farm_upload_validation.validation.farmSizePositive'),
          v => !!v || /^[0-9]+(\.[0-9]+)?\s?(acres|hectares)?$/.test(v) || this.$t('farm_upload_validation.validation.farmSizeUnit'),
        ],
        farmAddress: [
          v => {
            if (!v) return true;
            const addressParts = v.split(',').map(part => part.trim());
            return (
              addressParts.length >= 3 &&
              addressParts.every(part => part.length > 0)
            ) || this.$t('farm_upload_validation.validation.farmAddressFormat');
          },
        ],
        farmGPSCoordinates: [
          v => {
            if (!v) return true; // Allow empty values
            const regex = /^-?\d+(\.\d+)?,\s?-?\d+(\.\d+)?$/;
            const [lat, lon] = v.split(',').map(coord => parseFloat(coord.trim()));
            return (
              regex.test(v) &&
              lat >= -90 &&
              lat <= 90 &&
              lon >= -180 &&
              lon <= 180
            ) || this.$t('farm_upload_validation.validation.farmGPSCoordinatesFormat');
          },
        ],
        farmCountry: [
          v => !!v || this.$t('farm_upload_validation.validation.countryRequired'),
          v => /^[A-Za-z\s]+$/.test(v) || this.$t('farm_upload_validation.validation.countryLettersOnly'),
        ],
        farmProvinceState: [
          v => !!v || this.$t('farm_upload_validation.validation.provinceStateRequired'),
          v => /^[A-Za-z\s]+$/.test(v) || this.$t('farm_upload_validation.validation.provinceStateLettersOnly'),
        ],
        farmVillageTownCity: [
          v => !!v || this.$t('farm_upload_validation.validation.villageTownCityRequired'),
          v => /^[A-Za-z\s]+$/.test(v) || this.$t('farm_upload_validation.validation.villageTownCityLettersOnly'),
        ],
        farmGeofence: [
          v => {
            if (!v) return true;
            const isPolygon = v.includes(',');
            if (isPolygon) {
              const points = v.split(' ').map(pair => pair.split(',').map(Number));
              return points.every(
                ([lat, lon]) =>
                  !isNaN(lat) &&
                  !isNaN(lon) &&
                  lat >= -90 &&
                  lat <= 90 &&
                  lon >= -180 &&
                  lon <= 180
              ) || this.$t('farm_upload_validation.validation.farmGeofencePolygon');
            } else {
              const [center, area] = v.split(';');
              const [lat, lon] = center.split(',').map(Number);
              const areaValue = parseFloat(area);
              return (
                lat >= -90 &&
                lat <= 90 &&
                lon >= -180 &&
                lon <= 180 &&
                areaValue > 0
              ) || this.$t('farm_upload_validation.validation.farmGeofenceCircle');
            }
          },
        ],
      }
    }
  },
  methods: {
    async validateField(field) {
      const rules = this.rules[field];
      const value = this.formData[field];
      for (const rule of rules) {
        const error = await rule(value);
        if (error !== true) {
          this.validationMessages[field] = error;
          return;
        }
      }
      this.validationMessages[field] = null;
    },
    async checkFarmName(farmName) {
      try {
        const response = await axios.get(`/farm/farm-name-validation?farmName=${farmName}`);
        return !!response.success;
      } catch (error) {
        console.error('Error checking farm name:', error);
        return false;
      }
    },
    submitForm() {
      Object.keys(this.formData).forEach(field => this.validateField(field));
      if (Object.values(this.validationMessages).every(msg => !msg)) {
        // Proceed with form submission
        alert('Form submitted successfully!');
      }
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.v-data-table ::v-deep td {
  padding: 8px !important;
  height: auto !important;
}

.v-alert {
  margin: 0;
}
</style>