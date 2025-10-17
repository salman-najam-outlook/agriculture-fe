<template>
  <v-container fluid>
    <breadcrumb :items="breadcrumbs" />

    <v-row class="align-center justify-space-between mb-10">
      <v-col cols="8">
        <h1 class="font-weight-bold"> {{ isEditMode ? 'Edit Plot Tree Mapping Request' : 'Add New Plot Tree Mapping Request' }} </h1>
      </v-col>
      <v-col cols="4" class="text-right">
        <v-btn text color="primary" outlined @click="cancelForm">Cancel</v-btn> &nbsp;
        <v-btn color="primary" dark @click="submitRequest" :loading="isSubmitting"> {{ isEditMode ? 'Update Request' : 'Submit Request' }}</v-btn>
      </v-col>
    </v-row>

    <v-card outlined>
      <v-card-text>
        <v-form ref="form" v-model="isFormValid">
          <v-row>
            <v-col cols="12" md="3">
              <label> Assign To </label>
              <div class="d-flex gap2">
                <v-autocomplete 
                  :items="roles" 
                  item-text="name" 
                  item-value="id" 
                  :placeholder="$t('select')" 
                  outlined
                  dense 
                  v-model="selectedRole" 
                  @change="getUsersByRole"
                />
                <v-autocomplete 
                  :items="assignees" 
                  item-text="fullName" 
                  item-value="userId" 
                  :placeholder="$t('select')"
                  outlined 
                  dense 
                  v-model="selectedAssignee"
                />
              </div>
            </v-col>

            <v-col cols="12" md="3">
              <label>Farmer Name </label>
              <v-autocomplete 
                :items="farmers" 
                item-text="fullName" 
                item-value="userId" 
                :placeholder="$t('select')"
                outlined 
                dense 
                v-model="selectedFarmerId" 
                @change="getFarmsByFarmer"
                :rules="[v => !!v || 'Farmer is required']"
              />
            </v-col>

            <v-col cols="12" md="3">
              <label>Farm Name </label>
              <v-autocomplete 
                :items="farmNames" 
                item-text="farmName" 
                item-value="id" 
                :placeholder="$t('select')"
                outlined 
                dense 
                v-model="selectedFarmId"
                :rules="[v => !!v || 'Farm is required']"
              />
            </v-col>

            <v-col cols="12" md="3">
              <label> Farm Location Address </label>
              <div @click="farmLocationHandler" class="farm-location-wrapper">
                <v-text-field 
                  @click="farmLocationHandler" 
                  readonly 
                  id="dialog-link1"
                  placeholder="Please click to choose location" 
                  outlined 
                  dense 
                  :value="farmLocationAddress"
                  class="farm-location-input">
                </v-text-field>
              </div>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="3">
              <label> Start Date </label>
              <v-menu ref="startDateMenu" v-model="startDateMenu" :close-on-content-click="false"
                transition="scale-transition" offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field 
                    v-model="startDate" 
                    readonly 
                    outlined 
                    dense 
                    v-bind="attrs" 
                    :placeholder="$t('select')"
                    v-on="on"
                    :rules="[v => !!v || 'Start date is required']"
                  />
                </template>
                <v-date-picker v-model="startDate" no-title @input="startDateMenu = false" />
              </v-menu>
            </v-col>

            <v-col cols="12" md="3">
              <label> Due Date </label>
              <v-menu ref="dueDateMenu" v-model="dueDateMenu" :close-on-content-click="false"
                transition="scale-transition" offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field 
                    v-model="dueDate" 
                    readonly 
                    outlined 
                    dense 
                    v-bind="attrs" 
                    v-on="on"
                    :placeholder="$t('select')"
                    :rules="[v => !!v || 'Due date is required']"
                  />
                </template>
                <v-date-picker v-model="dueDate" no-title @input="dueDateMenu = false" />
              </v-menu>
            </v-col>

            <v-col cols="12" md="6">
              <label> Additional Notes </label>
              <v-text-field 
                v-model="notes"
                :placeholder="$t('enterHere')" 
                outlined 
                dense 
              />
            </v-col>

            <v-col cols="12" md="12">
              <v-data-table 
                :headers="plotHeaders" 
                :items="selectedPlot" 
                class="mt-5" 
                dense 
                hide-default-footer
                :no-data-text="'No plots selected'"
              >
                <template v-slot:item.actions="{ item }">
                  <v-btn text small color="error" @click="removePlot(item)">Remove</v-btn>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-form>
        <v-divider class="my-4" />
        <v-row>
          <v-col cols="12" md="5">
            <div class="d-flex gap2">
              <div>
                <v-autocomplete 
                  :items="plotOptions" 
                  v-model="selectedPlot" 
                  item-text="plot_no"
                  label="Select Plot Number" 
                  outlined 
                  dense 
                  multiple 
                  chips 
                  deletable-chips 
                  return-object 
                />
              </div>
              <v-btn color="primary" outlined @click="plotLocation">ADD NEW PLOT</v-btn>
            </div>
          </v-col>
        </v-row>
        <div>
          <GmapMap 
            ref="gmap" 
            :center="{ lat: 20.5937, lng: 78.9629 }" 
            :zoom="4" 
            map-type-id="satellite"
            style="width: 100%; height: 500px"
          >
            <GmapCluster>
              <GmapMarker 
                v-for="plot in plotOptions" 
                :key="plot.id"
                :position="{ lat: parseFloat(plot.latitude), lng: parseFloat(plot.longitude) }" 
                :clickable="true"
                :icon="getPlotIcon(plot)" 
                @click="togglePlotSelection(plot)" 
                :title="plot.plot_no" 
              />
            </GmapCluster>
          </GmapMap>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import CarbonCreditService from '@/_services/CarbonCreditService';
import loading from "@/mixins/LoadingMixin";
import MemberDataService from '@/_services/MemberDataService';
export default {
  mixins: [loading],

  async created() {
    this.startLoading();
    this.requestId = this.$route.params.id;
    this.isEditMode = !!this.requestId;
    if (!this.isEditMode) {
      this.restoreFormData();
    }
    await this.getTreePlots();
    await this.fetchFarmers();
    if (this.isEditMode) {
      await this.loadRequestData();
    }
    this.stopLoading();
  },

  beforeRouteLeave(to, from, next) {
    // Save form data before leaving
    this.saveFormData();
    next();
  },

  data() {
    return {
      breadcrumbs: [
        { text: 'Dashboard', disabled: false },
        { text: 'Carbon Credit', disabled: true },
        { text: 'Plot Tree Maping', disabled: true },
      ],
      roles: [],
      assignees: [],
      farmNames: [],
      selectedRole: null,
      selectedAssignee: null,
      selectedFarmerId: null,
      selectedFarmId: null,
      plotOptions: [],
      startDate: null,
      dueDate: null,
      notes: '',
      startDateMenu: false,
      dueDateMenu: false,
      selectedPlot: [],
      isFormValid: false,
      isSubmitting: false,
      plotHeaders: [
        { text: 'Plot Number', value: 'plot_no' },
        { text: 'Longitude', value: 'longitude' },
        { text: 'Latitude', value: 'latitude' },
        { text: 'Radius', value: 'radius' },
        { text: 'Actions', value: 'actions', sortable: false, align: 'end' },
      ],
      defaultPlotIcon: '/assets/icons/defaultPlot.svg',
      selectedPlotIcon: '/assets/icons/selectedPlot.svg',
      isEditMode: false,
      requestId: null,
    };
  },
  computed: {
    ...mapGetters({
      farmLocation: 'carbonCredit/getFarmLocation',
      farmerList: 'memberData/farmers',
      farmList: 'memberData/farms',
    }),
    farmers() {
      if (!this.farmerList) return [];
      return this.farmerList.map(farmer => ({
        ...farmer,
        fullName: `${farmer.firstName || ''} ${farmer.lastName || ''}`.trim(),
      }));
    },
    farmLocationAddress() {
      return this.farmLocation ? this.farmLocation.address : null;
    },
  },
  methods: {
    async getRoles() {
      try {
        const { data } = await this.$http.get("/user/membership/user-role");
        const roles = data.data.listRes.filter(x => {
          if (x.id == 'avocado_farmer') {
            return false
          }
          return true
        });
        this.roles = roles;
      } catch (e) {
        console.log(e);
      }
    },
    async getUsersByRole() {
      if (!this.selectedRole) return;
      this.startLoading();
      try {
        const response = await this.$http.get('/option/user', {
          params: { role_id: this.selectedRole, page: 1, limit: 10000 }
        });

        if (response.data.success) {
          this.assignees = response.data.data.map(user => ({
            ...user,
            fullName: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
          }));
        } else {
          this.assignees = [];
        }
      } catch (error) {
        console.error('Error fetching users by role:', error);
        this.assignees = [];
      } finally {
        this.stopLoading();
      }
    },
    getFarmsByFarmer() {
      if (!this.selectedFarmerId) {
        this.farmNames = [];
        return;
      }
      this.startLoading();
      MemberDataService.getFarmsByFarmers({
        userId: this.selectedFarmerId,
        page: 1,
        limit: 10000
      }).then(res => {
        this.farmNames = res.data?.farms || [];
      }).finally(() => {
        this.stopLoading();
      });
    },
    fetchFarmers() {
      this.startLoading()
      this.$store.dispatch('memberData/getFarmers', this.options)
        .then(() => this.stopLoading()).catch(() => this.stopLoading())
    },
    plotLocation() {
      this.$router.push({ name: 'plotLocation' });
    },
    farmLocationHandler() {
      this.$router.push({ name: 'ChooseFarmLocation' });
    },
    removePlot(plotToRemove) {
      this.selectedPlot = this.selectedPlot.filter(plot => plot.id !== plotToRemove.id);
    },
    getPlotIcon(plot) {
      const isSelected = this.selectedPlot.some(p => p.id === plot.id);
      const icon = {
        url: isSelected ? this.selectedPlotIcon : this.defaultPlotIcon,
        scaledSize: new window.google.maps.Size(40, 40),
        origin: new window.google.maps.Point(0, 0),
        anchor: new window.google.maps.Point(20, 40),
      };
      return icon;
    },
    togglePlotSelection(plot) {
      const plotIndex = this.selectedPlot.findIndex(p => p.id === plot.id);
      if (plotIndex > -1) {
        this.selectedPlot.splice(plotIndex, 1);
      } else {
        this.selectedPlot.push(plot);
      }
    },
    fitMapToBounds() {
      this.$nextTick(() => {
        if (!this.plotOptions.length || !this.$refs.gmap) return;

        this.$refs.gmap.$mapPromise.then(map => {
          const bounds = new window.google.maps.LatLngBounds();
          this.plotOptions.forEach(plot => {
            bounds.extend({
              lat: parseFloat(plot.latitude),
              lng: parseFloat(plot.longitude)
            });
          });
          map.fitBounds(bounds);
        });
      });
    },
    async getTreePlots() {
      const response = await CarbonCreditService.getTreePlots();
      if (response.success) {
        this.plotOptions = response.data;
        this.fitMapToBounds();
      }
    },
    async loadRequestData() {
      try {
        const response = await CarbonCreditService.getPlotTreeMappingRequestById(this.requestId);
        if (response.success) {
          const data = response.data;
          this.selectedFarmerId = data.farmer_id;
          this.selectedFarmId = data.farm_id;
          this.startDate = data.start_date;
          this.dueDate = data.due_date;
          this.notes = data.notes;
          let plotIds = [];
          if (Array.isArray(data.plots)) {
            if (typeof data.plots[0] === 'object') {
              plotIds = data.plots.map(p => p.id);
            } else {
              plotIds = data.plots;
            }
          }
          if (this.plotOptions.length) {
            this.selectedPlot = this.plotOptions.filter(plot => plotIds.includes(plot.id));
          } else {
            this.pendingPlotIds = plotIds;
          }
          if (this.selectedFarmerId) {
            await this.getFarmsByFarmer();
          }
        }
      } catch (error) {
        this.$notify({ type: 'error', text: 'Failed to load request data' });
      }
    },
    async submitRequest() {
      // Validate form
      if (!this.$refs.form.validate()) {
        this.$notify({ type: 'error', text: 'Please fill in all required fields' });
        return;
      }
      if (this.selectedPlot.length === 0) {
        this.$notify({ type: 'error', text: 'Please select at least one plot' });
        return;
      }
      this.isSubmitting = true;
      try {
        const payload = {
          farmer_id: this.selectedFarmerId,
          farm_id: this.selectedFarmId,
          start_date: this.startDate,
          due_date: this.dueDate,
          notes: this.notes,
          // assignees: [
          //   {
          //     assignee_id: this.selectedAssignee,
          //     assignee_role: this.roles.find(r => r.id === this.selectedRole)?.name || 'Technician'
          //   }
          // ],
          plots: this.selectedPlot.map(plot => plot.id)
        };
        let response;
        if (this.isEditMode) {
          response = await CarbonCreditService.updatePlotTreeMapping(this.requestId, payload);
        } else {
          response = await CarbonCreditService.createPlotTreeMapping(payload);
        }
        if (response.success) {
          this.$notify({
            type: 'success',
            text: this.isEditMode
              ? 'Plot tree mapping request updated successfully'
              : 'Plot tree mapping request created successfully'
          });
          // Always clear saved form data on successful submission
          this.clearFormData();
          this.$router.push({ name: 'plotTreeMapping' });
        } else {
          this.$notify({
            type: 'error',
            text: response.message || 'Failed to save request'
          });
        }
      } catch (error) {
        this.$notify({
          type: 'error',
          text: error.response?.data?.message || 'An error occurred while saving the request'
        });
      } finally {
        this.isSubmitting = false;
      }
    },
    saveFormData() {
      // Save form data to sessionStorage
      const formData = {
        selectedRole: this.selectedRole,
        selectedAssignee: this.selectedAssignee,
        selectedFarmerId: this.selectedFarmerId,
        selectedFarmId: this.selectedFarmId,
        startDate: this.startDate,
        dueDate: this.dueDate,
        notes: this.notes,
        selectedPlot: this.selectedPlot,
        timestamp: Date.now()
      };
      
      try {
        sessionStorage.setItem('addPlotTreeFormData', JSON.stringify(formData));
      } catch (error) {
        console.error('Error saving form data:', error);
      }
    },
    restoreFormData() {
      try {
        const savedData = sessionStorage.getItem('addPlotTreeFormData');
        if (savedData) {
          const formData = JSON.parse(savedData);
          
          // Check if data is not too old (24 hours)
          const isDataFresh = (Date.now() - formData.timestamp) < (24 * 60 * 60 * 1000);
          
          if (isDataFresh) {
            this.selectedRole = formData.selectedRole;
            this.selectedAssignee = formData.selectedAssignee;
            this.selectedFarmerId = formData.selectedFarmerId;
            this.selectedFarmId = formData.selectedFarmId;
            this.startDate = formData.startDate;
            this.dueDate = formData.dueDate;
            this.notes = formData.notes;
            this.selectedPlot = formData.selectedPlot || [];
            
            // Restore dependent data
            if (this.selectedRole) {
              this.getUsersByRole();
            }
            if (this.selectedFarmerId) {
              this.getFarmsByFarmer();
            }
          } else {
            // Clear old data
            sessionStorage.removeItem('addPlotTreeFormData');
          }
        }
      } catch (error) {
        console.error('Error restoring form data:', error);
        // Clear corrupted data
        sessionStorage.removeItem('addPlotTreeFormData');
      }
    },
    clearFormData() {
      // Clear saved form data
      sessionStorage.removeItem('addPlotTreeFormData');
    },
    cancelForm() {
      // Clear saved form data when the user cancels
      this.clearFormData();
      this.$router.push({ name: 'plotTreeMapping' });
    }
  },
  watch: {
    plotOptions(newVal) {
      if (this.isEditMode && this.requestId && this._pendingPlotIds) {
        this.selectedPlot = newVal.filter(plot => this._pendingPlotIds.includes(plot.id));
        this._pendingPlotIds = null;
      }
    }
  },
  destroyed() {
    // Clear the location when leaving the component
    // to avoid it persisting unexpectedly.
    this.$store.dispatch('carbonCredit/clearFarmLocation');
  }
};
</script>

<style scoped>
.text-right {
  text-align: right;
}

.gap2 {
  gap: 15px;
}

.farm-location-wrapper {
  cursor: pointer;
}

.farm-location-input {
  pointer-events: none;
}

.farm-location-input::v-deep input::placeholder {
  color: var(--v-primary-base, #1976D2);
  text-decoration: underline;
  opacity: 1;
}
</style>
