<template>
  <div class="form-container">
    <v-row no-gutters class="form-row">
      <v-col cols="3" class="px-2">
        <div class="input-label">{{ $t('Enterprises.EnterpriseDetailsForm.Enterprise_Client_Organization_Name') }}</div>
        <v-text-field
          v-model="details.name"
          :placeholder="$t('Enterprises.EnterpriseDetailsForm.Enterprise_Client_Organization_Name')"
          outlined
          dense
          class="custom-field"
          hide-details
        ></v-text-field>
      </v-col>
      
      <v-col cols="3" class="px-2">
        <div class="input-label">{{ $t('Enterprises.EnterpriseDetailsForm.Enterprise_Client_Organization_Logo') }}</div>
        <v-file-input
          v-model="details.logo"
          :placeholder="$t('Enterprises.EnterpriseDetailsForm.Browse')"
          :hint="$t('Enterprises.EnterpriseDetailsForm.Supported_File_Format')"
          persistent-hint
          outlined
          dense
          class="custom-field"
          hide-details
          border-dashed
        >
        </v-file-input>
        <template v-slot:prepend>
          <span class="text-green">{{ $t('Enterprises.EnterpriseDetailsForm.Browse') }}</span>
        </template>
      </v-col>
      
      <v-col cols="3" class="px-2">
        <div class="input-label">{{ $t('Enterprises.EnterpriseDetailsForm.Enterprise_Client_Organization_Phone_Number') }}</div>
        <v-text-field
          v-model="details.phone"
          :placeholder="$t('Enterprises.EnterpriseDetailsForm.Enterprise_Client_Organization_Phone_Number')"
          outlined
          dense
          class="custom-field"
          hide-details
        ></v-text-field>
      </v-col>
      
      <v-col cols="3" class="px-2">
        <div class="input-label">{{ $t('Enterprises.EnterpriseDetailsForm.Language_s') }}</div>
        <v-select
          v-model="details.languages"
          :placeholder="$t('Enterprises.EnterpriseDetailsForm.Select_Language')"
          outlined
          dense
          class="custom-field"
          hide-details
        ></v-select>
      </v-col>
      
      <v-col cols="3" class="px-2">
        <div class="input-label">{{ $t('Enterprises.EnterpriseDetailsForm.Crop_Variety') }}</div>
        <v-select
          v-model="details.cropVariety"
          :placeholder="$t('Enterprises.EnterpriseDetailsForm.Select_Crop_Variety')"
          outlined
          dense
          class="custom-field"
          hide-details
        ></v-select>
      </v-col>
      
      <v-col cols="3" class="px-2">
        <div class="input-label">{{ $t('Enterprises.EnterpriseDetailsForm.User_Role_s') }}</div>
        <v-select
          v-model="details.userRoles"
          :placeholder="$t('Enterprises.EnterpriseDetailsForm.Select_User_Role')"
          outlined
          dense
          class="custom-field"
          hide-details
        ></v-select>
      </v-col>

      <v-col cols="3" class="px-2">
        <div class="input-label">{{ $t('Enterprises.EnterpriseDetailsForm.Country') }}</div>
        <v-select
          v-model="details.country"
          :placeholder="$t('Enterprises.EnterpriseDetailsForm.Select_Country')"
          outlined
          dense
          class="custom-field"
          hide-details
        ></v-select>
      </v-col>
      
      <v-col cols="3" class="px-2">
        <div class="input-label">{{ $t('Enterprises.EnterpriseDetailsForm.Province_State') }}</div>
        <v-text-field
          v-model="details.province"
          :placeholder="$t('Enterprises.EnterpriseDetailsForm.Province_State')"
          outlined
          dense
          class="custom-field"
          hide-details
        ></v-text-field>
      </v-col>
      
      <v-col cols="3" class="px-2">
        <div class="input-label">{{ $t('Enterprises.EnterpriseDetailsForm.Region_District') }}</div>
        <v-text-field
          v-model="details.region"
          :placeholder="$t('Enterprises.EnterpriseDetailsForm.Region_District')"
          outlined
          dense
          class="custom-field"
          hide-details
        ></v-text-field>
      </v-col>
      
      <v-col cols="3" class="px-2">
        <div class="input-label">{{ $t('Enterprises.EnterpriseDetailsForm.Village_Town_City') }}</div>
        <v-text-field
          v-model="details.village"
          :placeholder="$t('Enterprises.EnterpriseDetailsForm.Village_Town_City')"
          outlined
          dense
          class="custom-field"
          hide-details
        ></v-text-field>
      </v-col>

      <v-col cols="3" class="px-2">
        <div class="input-label">{{ $t('Enterprises.EnterpriseDetailsForm.Address') }}</div>
        <v-text-field
          v-model="details.address"
          :placeholder="$t('Enterprises.EnterpriseDetailsForm.Address')"
          outlined
          dense
          class="custom-field"
          hide-details
        ></v-text-field>
      </v-col>
      
      <v-col cols="3" class="px-2">
        <div class="input-label">{{ $t('Enterprises.EnterpriseDetailsForm.Status') }}</div>
        <v-select
          v-model="details.status"
          :placeholder="$t('Enterprises.EnterpriseDetailsForm.Select_Status')"
          outlined
          dense
          class="custom-field"
          hide-details
        ></v-select>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'EnterpriseDetailsForm',
  data: () => ({
    details: {
      name: '',
      logo: null,
      phone: '',
      products: [],
      languages: [],
      cropType: null,
      cropVariety: null,
      userRoles: [],
      country: null,
      province: '',
      region: '',
      village: '',
      address: '',
      status: null
    },
    products: [],
    languages: [],
    cropTypes: [],
    cropVarieties: [],
    userRoles: [],
    countries: [],
    statusOptions: []
  }),
  watch: {
    details: {
      handler(val) {
        this.$emit('input', val)
      },
      deep: true
    }
  }
}
</script>

<style scoped>
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
</style>