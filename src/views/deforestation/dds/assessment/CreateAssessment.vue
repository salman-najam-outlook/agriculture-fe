<template>
  <v-dialog
    v-model="dialog"
    width="800"
    @click:outside="closeModal"
    :retain-focus="false"
  >
    <v-card class="custom-card" rounded="0">
      <v-toolbar flat color="primary" class="white--text">
        <v-toolbar-title class="font-weight-bold">{{
          $t("dueDiligence.createAssessment")
        }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon class="white--text" @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-form ref="userType" lazy-validation autocomplete="off">
        <v-card-text class="black--text">
          <v-row>
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 pa-4">
              <label for="createType">
                <h3>{{ $t("dueDiligence.selectProcess") }}</h3>
              </label>
              <v-radio-group v-model="newAssessmentType">
                <v-col
                  v-for="n in assessmentTypes"
                  :key="n.value">
                    <v-row
                      class="spaced">
                      <v-radio
                        dense
                        :label="`${n.label}`"
                        :value="n.value"
                        class="mt-2"
                      ></v-radio>
                      <span
                        class="mt-2"
                       v-if="n.value === 'existing' && newAssessmentType === 'existing'">
                        <v-select
                          v-model="country"
                          :items="countries"
                          @change="getCountryData"
                          item-text="name"
                          item-value="code"
                          class="shrink"
                          style="width: 250px"
                          :placeholder="$t('profileSetting.selectCountry')"
                          clearable
                          dense
                          outlined
                        />
                      </span>
                    </v-row>
                  </v-col>
              </v-radio-group>
              <v-data-table
                v-if="newAssessmentType === 'existing'"
                :headers="headers"
                :items="defaultAssessments"
                :header-props="headerProps"
                hide-default-footer
                loading-text="Loading Dimitra Assessments..."
                :single-select="true"
                show-select
                :loading="assessmentLoading"
              >

              <template v-if="defaultAssessments.length > 0" v-slot:body="{ items }">
              <tbody>
                <tr v-for="item in items" :key="item.id" style="position: relative; width: 0; height: 0">
                  <td>
                    <v-checkbox
                      v-model="selectedAssessments"
                      :value="item.id"
                       @input="updateSelectedItems"
                      class="mx-0"
                    ></v-checkbox>
                  </td>       
                  <td class="text-left text-truncate-title">
                    {{ item.title }}
                  </td>
                  <td class="col-question text-center">{{ item.noOfQuestions }}</td>
                  <td class="text-truncate-desc text-left">
                    {{ item.countries && item.countries.includes('ALL') ? 'All' : (item.countries.length > 0 ? item.countries.map(country => getCountryName(country)).join(', ') : "N/A") }}                  </td>
                  <div style="position: absolute; right: 10px; top: 5px">
                    <v-btn x-small fab color="primary" outlined class="ml-2" @click="getDetails(item)">
                      <v-icon>mdi-eye-outline</v-icon>
                    </v-btn>
                  </div>
                </tr>
              </tbody>
            </template>
    
              </v-data-table>
            </div>
          </v-row>
          <v-card-actions class="mt-5">
            <v-spacer></v-spacer>
            <v-btn
              @click="closeModal"
              outlined
              right
              height="44"
              width="116"
              depressed
              color="primary"
            >
              {{ $t("cancel") }}
            </v-btn>
            <v-btn
              @click="onConfirm"
              right
              height="44"
              width="116"
              color="primary"
            >
              {{ $t("confirm") }}
            </v-btn>
          </v-card-actions>
        </v-card-text>
      </v-form>
    </v-card>
  </v-dialog>
</template>
<script>

import DeforestationService from "@/_services/DeforestationService";

export default {
  computed: {
    dialog() {
      return this.dialogI;
    },
  },
  mounted() {
    this.getDefaultAssessments();
  },
  data() {
    return {
      newAssessmentType: "new",
      assessmentTypes: [
        {
          label: this.$t('deforestation.createNewAssessment'),
          value: "new",
        },
        {
          label: this.$t('deforestation.userDimitraAssessment'),
          value: "existing",
        },
      ],
      selectedAssessments: [],
      headerProps: {
        "sort-icon": "mdi-menu-up",
      },
      headers: [
        {
          text: this.$t("dueDiligence.assessmentName"),
          align: "start",
          value: "assessmentTitle",
          class: "black--text",
        },
        {
          text: this.$t("surveyBuilder.questions"),
          align: "center",
          value: "questions",
          class: "black--text",
        },
        {
          text: this.$t("country"),
          align: "center",
          value: "country",
          class: "black--text",
        },
      ],
      selectedCountries: [],
      defaultAssessments: [
      ],
      assessmentLoading: false,
    }
  },
  methods: {
    handleCountrySelection(selected) {
      if (selected.includes('ALL')) {
        this.selectedCountries = ['ALL'];  // If "ALL" is selected, deselect other options
      } else {
        this.selectedCountries = selected;
      }
      this.getAssessments();
    },
    getCountryName(code) {
      return this.selectedCountries.find(c => c.code === code)?.name;
    },
    updateSelectedItems(selected) {
    this.selectedAssessments = selected;
  },
    closeModal() {
      this.newAssessmentType = "new";
      this.$emit('closeModal');
    },
    onConfirm() {
      if (this.newAssessmentType === "new") {
        this.$emit('selectedAssessment', 'new', [])
      } 
      if (this.newAssessmentType === "existing") {
        this.$emit('selectedAssessment','existing', this.selectedAssessments)
      }
      this.closeModal();
    },
    getCountryData(val) {
      this.selectedCountries = val.includes('ALL') ? ['ALL'] : val;
      this.getDefaultAssessments();
    },
    getDetails(item) {
      this.$router.push({
        name: "AssessmentDetails",
        params: { id: item.id },
      });
    },
   async getDefaultAssessments(){
    this.assessmentLoading = true;
      try {
        let params = {
          countries: this.selectedCountries.includes('ALL') ? null : this.selectedCountries,
        };
        const res = await DeforestationService.getDefaultDimitraAssessments(params);
        this.defaultAssessments = res.data.getDefaultDimitraAssessments;
  } catch (err) {
        console.log(err);
        this.$notify({
          text: 'Cannot get assessment default dimitra assessments',
          type: "error",
        });
      }
      this.assessmentLoading = false;
    }
  },
  props: {
    'dialogI': {
        type: Boolean,
        required: true
    },
    'countries': {
      type: Array,
      required: true
    }
  },
}
</script>

<style scoped>
.spaced {
  justify-content: space-between;
}
</style>
