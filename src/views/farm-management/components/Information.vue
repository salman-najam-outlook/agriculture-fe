<template>
	<div>
		<v-container grid-list-xl fluid>
			<v-layout row wrap>

				<v-flex xs6 sm4 md2 xl2 :style="$vuetify.breakpoint.width <= 980 && { flexBasis: '50%' }"
					class="lg5-custom mb-5">
					<v-card class="green2" flat min-height="100">
						<!-- <v-icon class="float-right mt-2 mr-2">mdi-dots-horizontal</v-icon> -->
						<v-list dense class="mb-n3 green2">
							<v-list-item>
								<v-list-item-content class="green2">
									<v-list-item-title class="green2">
										{{ $t('farm.farmId') }}
										<v-tooltip top color="black">
											<template v-slot:activator="{ on, attrs }">
												<v-icon v-bind="attrs" v-on="on">
													mdi-help-circle-outline
												</v-icon>
											</template>
											<span>{{ $t('farm.farmId') }}</span>
										</v-tooltip>
									</v-list-item-title>
									<h5 class="mt-2 text-capitalize">
										{{ farm.dimitraFarmId }}
									</h5>
								</v-list-item-content>
							</v-list-item>
						</v-list>
					</v-card>
				</v-flex>
			<v-flex xs6 sm4 md2 xl2 :style="$vuetify.breakpoint.width <= 980 && { flexBasis: '50%' }"
				class="lg5-custom mb-5">
				<v-card class="green2" flat min-height="100">
					<!-- <v-icon class="float-right mt-2 mr-2">mdi-dots-horizontal</v-icon> -->
					<v-list dense class="mb-n3 green2">
						<v-list-item>
							<v-list-item-content class="green2">
								<v-list-item-title class="green2">
									{{ $t('farm.farmName') }}
									<v-tooltip top color="black">
										<template v-slot:activator="{ on, attrs }">
											<v-icon v-bind="attrs" v-on="on">
												mdi-help-circle-outline
											</v-icon>
										</template>
										<span>{{ $t('farm.farmName') }}</span>
									</v-tooltip>
								</v-list-item-title>
								<h5 class="mt-2 text-capitalize">
									{{ farm.farmName }}
								</h5>
							</v-list-item-content>
						</v-list-item>
					</v-list>
				</v-card>
			</v-flex>


			<v-flex xs6 sm4 md2 xl2 :style="$vuetify.breakpoint.width <= 980 && { flexBasis: '50%' }"
				class="lg5-custom mb-5">
				<v-card class="green2" flat min-height="100">
					<!-- <v-icon class="float-right mt-2 mr-2">mdi-dots-horizontal</v-icon> -->
					<v-list dense class="mb-n3 green2">
						<v-list-item>
							<v-list-item-content class="green2">
								<v-list-item-title class="green2">
									{{ $t('farm.farmRegistrationId') }}
									<v-tooltip top color="black">
										<template v-slot:activator="{ on, attrs }">
											<v-icon v-bind="attrs" v-on="on">
												mdi-help-circle-outline
											</v-icon>
										</template>
										<span>{{ $t('farm.farmRegistrationId') }}</span>
									</v-tooltip>
								</v-list-item-title>
								<h5 class="mt-2 text-capitalize">
									{{ farm.farmRegistrationId || farm.registrationNo}}
								</h5>
							</v-list-item-content>
						</v-list-item>
					</v-list>
				</v-card>
			</v-flex>

			<v-flex xs6 sm4 md2 xl2 :style="$vuetify.breakpoint.width <= 980 && { flexBasis: '50%' }"
				class="lg5-custom mb-5">
				<v-card class="green2" flat min-height="100">
					<!-- <v-icon class="float-right mt-2 mr-2">mdi-dots-horizontal</v-icon> -->
					<v-list dense class="mb-n3 green2">
						<v-list-item>
							<v-list-item-content class="green2">
								<v-list-item-title class="green2">
									{{ $t('farm.farmerName') }}
									<v-tooltip top color="black">
										<template v-slot:activator="{ on, attrs }">
											<v-icon v-bind="attrs" v-on="on">
												mdi-help-circle-outline
											</v-icon>
										</template>
										<span>{{ $t('farm.farmerName') }}</span>
									</v-tooltip>
								</v-list-item-title>
								<h5 class="mt-2 text-capitalize">
									{{ farmerName }}
								</h5>
							</v-list-item-content>
						</v-list-item>
					</v-list>
				</v-card>
			</v-flex>

			<v-flex xs6 sm4 md2 xl2 :style="$vuetify.breakpoint.width <= 980 && { flexBasis: '50%' }"
				class="lg5-custom mb-5">
				<v-card class="green2" flat min-height="100">
					<!-- <v-icon class="float-right mt-2 mr-2">mdi-dots-horizontal</v-icon> -->
					<v-list dense class="mb-n3 green2">
						<v-list-item>
							<v-list-item-content class="green2">
								<v-list-item-title class="green2">
									{{ $t('farm.farmerRegistrationId') }}
									<v-tooltip top color="black">
										<template v-slot:activator="{ on, attrs }">
											<v-icon v-bind="attrs" v-on="on">
												mdi-help-circle-outline
											</v-icon>
										</template>
										<span>{{ $t('farm.farmerRegistrationId') }}</span>
									</v-tooltip>
								</v-list-item-title>
								<h5 class="mt-2 text-capitalize">
									{{ farm.farmerRegistrationId || farm.farmerId}}
								</h5>
							</v-list-item-content>
						</v-list-item>
					</v-list>
				</v-card>
			</v-flex>

			<v-flex xs6 sm4 md2 xl2 :style="$vuetify.breakpoint.width <= 980 && { flexBasis: '50%' }"
				class="lg5-custom mb-5">
				<v-card class="green2" flat min-height="100">
					<!-- <v-icon class="float-right mt-2 mr-2">mdi-dots-horizontal</v-icon> -->
					<v-list dense class="mb-n3 green2">
						<v-list-item>
							<v-list-item-content class="green2">
								<v-list-item-title class="green2">
									{{ $t('farm.farmOwnershipType') }}
									<v-tooltip top color="black">
										<template v-slot:activator="{ on, attrs }">
											<v-icon v-bind="attrs" v-on="on">
												mdi-help-circle-outline
											</v-icon>
										</template>
										<span>{{ $t('farm.farmOwnershipType') }}</span>
									</v-tooltip>
								</v-list-item-title>
								<h5 class="mt-2 text-capitalize">
									{{ farm.farmOwnershipType || 'N/A' }}
								</h5>
							</v-list-item-content>
						</v-list-item>
					</v-list>
				</v-card>
			</v-flex>

			<v-flex xs6 sm4 md2 xl2 :style="$vuetify.breakpoint.width <= 980 && { flexBasis: '50%' }"
				class="lg5-custom mb-5">
				<v-card class="green2" flat min-height="100">
					<!-- <v-icon class="float-right mt-2 mr-2">mdi-dots-horizontal</v-icon> -->
					<v-list dense class="mb-n3 green2">
						<v-list-item>
							<v-list-item-content class="green2">
								<v-list-item-title class="green2">
									{{ $t('farm.farmGoals') }}
									<v-tooltip top color="black">
										<template v-slot:activator="{ on, attrs }">
											<v-icon v-bind="attrs" v-on="on">
												mdi-help-circle-outline
											</v-icon>
										</template>
										<span>{{ $t('farm.farmGoals') }}</span>
									</v-tooltip>
								</v-list-item-title>
								<h5 class="mt-2 text-capitalize">
									{{ farm.farmGoals &&  Array.isArray(farm.farmGoals)  && farm.farmGoals.map(el => el.farmingGoal).join(", ")}}
								</h5>
							</v-list-item-content>
						</v-list-item>
					</v-list>
				</v-card>
			</v-flex>

			<v-flex xs6 sm4 md2 xl2 :style="$vuetify.breakpoint.width <= 980 && { flexBasis: '50%' }"
				class="lg5-custom mb-5">
				<v-card class="green2" flat min-height="100">
					<!-- <v-icon class="float-right mt-2 mr-2">mdi-dots-horizontal</v-icon> -->
					<v-list dense class="mb-n3 green2">
						<v-list-item>
							<v-list-item-content class="green2">
								<v-list-item-title class="green2">
									{{ $t('farm.farmCertifications') }}
									<v-tooltip top color="black">
										<template v-slot:activator="{ on, attrs }">
											<v-icon v-bind="attrs" v-on="on">
												mdi-help-circle-outline
											</v-icon>
										</template>
										<span>{{ $t('farm.farmCertifications') }}</span>
									</v-tooltip>
								</v-list-item-title>
								<h5 class="mt-2 text-capitalize">
									{{ farm.farmCertifications &&  Array.isArray(farm.farmCertifications)  && farm.farmCertifications.map(el => el.name).join(", ")}}
								</h5>
							</v-list-item-content>
						</v-list-item>
					</v-list>
				</v-card>
			</v-flex>

			<v-flex xs6 sm4 md2 xl2 :style="$vuetify.breakpoint.width <= 980 && { flexBasis: '50%' }"
				class="lg5-custom mb-5">
				<v-card class="green2" flat min-height="100">
					<!-- <v-icon class="float-right mt-2 mr-2">mdi-dots-horizontal</v-icon> -->
					<v-list dense class="mb-n3 green2">
						<v-list-item>
							<v-list-item-content class="green2">
								<v-list-item-title class="green2">
									{{ $t('farm.productionType') }}
									<v-tooltip top color="black">
										<template v-slot:activator="{ on, attrs }">
											<v-icon v-bind="attrs" v-on="on">
												mdi-help-circle-outline
											</v-icon>
										</template>
										<span>{{ $t('farm.productionType') }}</span>
									</v-tooltip>
								</v-list-item-title>
								<h5 class="mt-2 text-capitalize">
									{{ farm.productionType}}
								</h5>
							</v-list-item-content>
						</v-list-item>
					</v-list>
				</v-card>
			</v-flex>
			<v-flex xs6 sm4 md2 xl2 :style="$vuetify.breakpoint.width <= 980 && { flexBasis: '50%' }"
				class="lg5-custom mb-5">
				<v-card class="green2" flat min-height="100">
					<!-- <v-icon class="float-right mt-2 mr-2">mdi-dots-horizontal</v-icon> -->
					<v-list dense class="mb-n3 green2">
						<v-list-item>
							<v-list-item-content class="green2">
								<v-list-item-title class="green2">
									{{ $t('farm.locationType') }}
									<v-tooltip top color="black">
										<template v-slot:activator="{ on, attrs }">
											<v-icon v-bind="attrs" v-on="on">
												mdi-help-circle-outline
											</v-icon>
										</template>
										<span>{{ $t('farm.locationType') }}</span>
									</v-tooltip>
								</v-list-item-title>
								<h5 class="mt-2 text-capitalize">
									{{ getLocationType() }}
									<span 
										v-if="hasGeolocationData()"
										@click="showGeoLocation"
										class="view-location-link"
									>
										{{ $t('farm.viewLocation') }}
									</span>
								</h5>
							</v-list-item-content>
						</v-list-item>
					</v-list>
				</v-card>
			</v-flex>

		</v-layout>
	</v-container>
	
	<!-- View Geolocation Modal -->
	<ViewGeoLocation 
		v-if="showViewGeoLocationModal" 
		:dialog="showViewGeoLocationModal" 
		:farmDetails="farmDetails" 
		:coordinates="getCoordinatesData()"
		:disableEditGeofence="true"
		:diligenceReportId="0"
		@closeViewGeoLocationModal="closeGeoLocationModal"
		@saveViewGeoLocation="closeGeoLocationModal"
	/>
	</div>
</template>
<script>
// import { mapGetters } from "vuex";
// import FarmService from "@/_services/FarmService";
import ViewGeoLocation from "./ViewGeoLocation.vue";

export default {
	name: "Information",
	components: {
		ViewGeoLocation
	},
	data() {
		return {
			farmProductionSystems: [],
			farmProductionSystem: [],
			productionSystem: [],
			showViewGeoLocationModal: false,
		}
	},
	computed: {
		farmerName() {
			if(this.farm.farmerFirstName) {
				return [this.farm.farmerFirstName, this.farm.farmerMiddleName, this.farm.farmerLastName].filter(Boolean).join(' ');
			}
			if(this.farm.user) {
				return [this.farm.user.firstName, this.farm.user.lastName].filter(Boolean).join(' ');
			}
			return '';
		},
		farmDetails() {
			return {
				farm: this.farm,
				farmType: this.getLocationType() === this.$t('farm.Circular') ? 'POINT' : 'POLYGON'
			};
		}
	},
	props: {
		farm: {
			require: true
		}
	},
	async mounted() {
	
	},
	methods: {
		getLocationType() {
			// Check for segments data first
			if (this.farm.segments && this.farm.segments.length > 0) {
				const segment = this.farm.segments[0];
				
				// If segment has radius and center coordinates, it's circular
				if (segment.geofenceRadius && segment.geofenceCenterLat && segment.geofenceCenterLog) {
					return this.$t('farm.Circular');
				}
				
				// If segment has coordinates array, it's polygon
				if (segment.coordinates && segment.coordinates.length > 0) {
					return this.$t('farm.Polygon');
				}
			}
			
			// Check for coordinates array (polygon geofence)
			if (this.farm.coordinates && Array.isArray(this.farm.coordinates)) {
				const coordinatesLength = this.farm.coordinates.length;
				
				if (coordinatesLength === 0) {
					return 'N/A';
				} else if (coordinatesLength === 1) {
					return this.$t('farm.Circular');
				} else if (coordinatesLength > 1) {
					return this.$t('farm.Polygon');
				}
			}
			
			return 'N/A';
		},
		hasGeolocationData() {
			// Check for segments data (circular geofence)
			if (this.farm.segments && this.farm.segments.length > 0) {
				return true;
			}
			
			// Check for coordinates array (polygon geofence)
			if (this.farm.coordinates && Array.isArray(this.farm.coordinates) && this.farm.coordinates.length > 0) {
				return true;
			}
			
			return false;
		},
		getCoordinatesData() {
			// Convert segments data to coordinates format
			if (this.farm.segments && this.farm.segments.length > 0) {
				const segment = this.farm.segments[0];
				
				// For circular geofence
				if (segment.geofenceRadius && segment.geofenceCenterLat && segment.geofenceCenterLog) {
					return [{
						lat: segment.geofenceCenterLat,
						log: segment.geofenceCenterLog,
						radius: segment.geofenceRadius
					}];
				}
				
				// For polygon geofence
				if (segment.coordinates && segment.coordinates.length > 0) {
					return segment.coordinates.map(coord => ({
						lat: coord.lat,
						log: coord.log
					}));
				}
			}
			
			// Return original coordinates for polygon geofence
			return this.farm.coordinates || [];
		},
		showGeoLocation() {
			this.showViewGeoLocationModal = true;
		},
		closeGeoLocationModal() {
			this.showViewGeoLocationModal = false;
		}
	},
};
</script>
<style lang="scss" scoped>
.flex.lg5-custom {
	width: 20%;
	max-width: 80%;
	flex-basis: 20%;
}

.view-location-link {
	color: #4CAF50; /* Light green color */
	text-decoration: underline;
	cursor: pointer;
	margin-left: 8px;
	font-size: 0.9em;
	transition: color 0.2s ease;
	
	&:hover {
		color: #45a049; /* Darker green on hover */
	}
}
</style>