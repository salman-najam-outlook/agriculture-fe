<template>
    <div>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <div class="d-flex mb-4">
                <h2>{{ $t("memberDataSection.activity") }} :
                    {{ farmerDetail.user.firstName }} {{ farmerDetail.user.lastName }}
                </h2>
                <v-spacer></v-spacer>
            </div>

            <v-card elevation="0" class="px-5">
                <v-card-text>
                    <div v-if="!activities.length" class="text-center" style="padding-top:5%">
                        <v-row align="center" justify="center">
                            <v-col>
                                <v-img max-height="190" max-width="190" src="/icons/nodata.svg" class="img-center"></v-img>
                                <h5 class="mt-4 red--text">{{ $t("memberDataSection.noFarmers") }}</h5>
                                <p class="text-caption black--text">
                                    {{ $t("memberDataSection.noFarmers") }}
                                </p>
                            </v-col>
                        </v-row>
                    </div>
                    <div v-if="activities.length">
                        <v-data-table :headers="headers" :items="activities" hide-default-footer :expanded.sync="expanded"
                            item-key="id" show-expand :single-expand="true" :server-items-length="totalActivities">

                            <template v-slot:top="{}">
                                <div class="d-flex mt-5 flex-wrap-p">
                                    <v-menu v-model="dateMenu" :close-on-content-click="false" :nudge-right="40" readonly
                                        transition="scale-transition" offset-y>
                                        <template v-slot:activator="{ on }">
                                            <v-text-field append-icon="mdi-calendar" outlined height="5px"
                                                :placeholder="$t('search')" dense hide-details :value="dateSearch" v-on="on"
                                                class="shrink"></v-text-field>
                                        </template>
                                        <v-date-picker locale="en-in" v-model="dateSearch" no-title
                                            @input="handleSearchByDate">
                                        </v-date-picker>
                                    </v-menu>

                                    <div class="d-inline-flex ml-3">
                                        <span class="title black--text text-no-wrap">{{ $t('memberDataSection.activityType')
                                        }}</span>
                                        <v-select :items="activityTypes" v-model="activityType" item-text="label"
                                            item-value="val" dense outlined class="shrink ml-2 wdt" multiple
                                            :placeholder="$t('memberDataSection.selectStatus')"
                                            @change="handleGetActivityType"></v-select>
                                    </div>

                                    <div class="d-inline-flex ml-3">
                                        <span class="title black--text text-no-wrap">{{ $t('memberDataSection.farmZone')
                                        }}</span>
                                        <v-select :items="zones" v-model="zone" item-text="label" item-value="val" dense
                                            outlined class="shrink ml-2 wdt" :placeholder="'Select Zone/Farm'"
                                            @change="handleGetZoneType"></v-select>
                                    </div>

                                    <v-spacer></v-spacer>


                                    <v-menu transition="slide-y-reverse-transition">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-btn color="primary" class="download-btn font-weight-bold mr-2" large
                                                v-bind="attrs" v-on="on">
                                                {{ $t('memberDataSection.download') }}
                                                &nbsp;
                                                <svg width="12" height="8" viewBox="0 0 12 8" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M6 7.69687L0 1.69687L1.4 0.296875L6 4.89688L10.6 0.296875L12 1.69687L6 7.69687Z"
                                                        fill="white" />
                                                </svg>
                                            </v-btn>
                                        </template>
                                        <v-list class="mt-10">
                                            <v-radio-group v-model="downloadFormat">
                                                <v-radio class="pl-4" @change="exportReport(n.val)"
                                                    v-for="(n, key) in downloadFormats" :value="n.val" :key="key"
                                                    :label="n.name">
                                                </v-radio>
                                            </v-radio-group>
                                        </v-list>
                                    </v-menu>
                                    <div class="py-1 title">
                                        {{ options.page }} - {{ totalPages }} {{ $t('of') }} {{ farmsActivities.data.length }}
                                    </div>
                                    <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page <= 1"
                                        @click="pageChange(false)">
                                        <v-icon dark>
                                            mdi-chevron-left
                                        </v-icon>
                                    </v-btn>
                                    <v-btn class="mx-2" fab small outlined color="primary"
                                        :disabled="options.page >= totalPages" @click="pageChange(true)">
                                        <v-icon dark>
                                            mdi-chevron-right
                                        </v-icon>
                                    </v-btn>
                                </div>
                            </template>


                            <template v-slot:expanded-item="{ item }">
                                <template v-if="item.activity == 'Harvesting'">
                                    <td colspan="2">
                                        <p class="break-words"> <span class="font-weight-bold"> Start Date of
                                                Harvesting:</span> {{ item.start_date_harvesting | formatDate }} </p>
                                        <p class="break-words"> <span class="font-weight-bold"> End Date of Harvesting:
                                            </span> {{ item.end_date_harvesting | formatDate }} </p>
                                        <p class="break-words"> <span class="font-weight-bold"> Total Number of Days:</span>
                                            {{ item.daysHarvesting }}</p>
                                    </td>

                                    <td colspan="2">
                                        <p class="break-words"> <span class="font-weight-bold"> Total Fresh Yeild:</span> {{
                                            item.totalFreshYield }} {{ item.freshYieldUnit }}</p>
                                        <p class="break-words"> <span class="font-weight-bold">Total Dry Yeild:</span> {{
                                            item.totalDryYield }} {{ item.dryYieldUnit }} </p>
                                        <p class="break-words"> <span class="font-weight-bold">Yield For House Hold
                                                Consumption:</span> {{ item.yieldForHouseholdConsumption }} {{
                                                    item.freshYieldUnit }}</p>
                                        <p class="break-words"> <span class="font-weight-bold"> Yield for Sale:</span> {{
                                            item.yieldForSale }} {{ item.yieldForSaleUnit }}</p>
                                    </td>

                                    <td>
                                        <p class="break-words"><span class="font-weight-bold"> Method of Harvesting:</span>
                                            {{ item.methodForHarvesting }}</p>
                                        <p class="break-words"> <span class="font-weight-bold"> Manual Harvesting
                                                Tools:</span> {{ item.harvestMethodType }}</p>
                                    </td>

                                    <td colspan="2">
                                        <p class="break-words"> <span class="font-weight-bold"> Mechanical Harvesting
                                                Tools:</span> {{ item.harvestMethodType }}</p>
                                        <p class="break-words"> <span class="font-weight-bold"> Yield Losses:</span> {{
                                            item.yieldLosses }} {{ item.freshYieldUnit }}</p>
                                    </td>

                                    <td>
                                        <p class="break-words"> <span class="font-weight-bold"> Reason for Loss:</span> {{
                                            item.reasonForLoss }}</p>
                                    </td>
                                </template>

                                <template v-if="item.activity == 'Weeding'">
                                    <td colspan="3">
                                        <p class="break-words"> <span class="font-weight-bold"> Type of Weed:</span> {{
                                            item.weedType }} </p>
                                        <p class="break-words"> <span class="font-weight-bold"> Total Number of
                                                Days:</span>
                                            {{ item.weedingDays }}</p>

                                    </td>
                                    <td colspan="3">

                                        <p class="break-words"> <span class="font-weight-bold"> Weeding Stage(s):</span>
                                            {{
                                                item.weedDataMethod }} </p>

                                        <p class="break-words"> <span class="font-weight-bold"> Weeding Date: </span> {{
                                            item.weedDates }} </p>

                                    </td>
                                    <td colspan="3">
                                        <p class="break-words"> <span class="font-weight-bold">Method of Weeding:</span>
                                            {{
                                                item.weedMethod }} </p>
                                    </td>
                                </template>

                                <template v-if="item.activity == 'Irrigation'">
                                    <td colspan="2">
                                        <p class="break-words"> <span class="font-weight-bold"> Water Source:</span> {{
                                            item.irrigationWaterSource }} </p>
                                        <p class="break-words"> <span class="font-weight-bold">Irrigation Water
                                                Source:</span> {{ item.irrigationWaterSource }}</p>
                                    </td>

                                    <td colspan="2">
                                        <p class="break-words"> <span class="font-weight-bold"> Surface Water: </span> {{
                                            item.irrigationWaterSourceOrigin }} </p>
                                        <p class="break-words"> <span class="font-weight-bold"> Irrigated Area:</span> {{
                                            item.irrigatedArea }} </p>
                                    </td>

                                    <td>
                                        <p class="break-words"> <span class="font-weight-bold"> Irrigation Date(s):</span>
                                            {{ item.irrigationDates }}</p>
                                        <p class="break-words"> <span class="font-weight-bold"> Stage of Irrigation:</span>
                                            {{ item.irrigationStage }} </p>
                                    </td>

                                    <td colspan="2">
                                        <p class="break-words"> <span class="font-weight-bold"> Irrigation/Schedule:</span>
                                            {{ item.irrigationSchedule }}</p>
                                        <p class="break-words"> <span class="font-weight-bold"> Total Number of Days:</span>
                                            {{ item.totalDays }} </p>
                                    </td>

                                    <td>
                                        <p class="break-words"> <span class="font-weight-bold"> Type of Irrigation:</span>
                                            {{ item.irrigationType }}</p>
                                        <p class="break-words"> <span class="font-weight-bold"> Water Volume Used:</span> {{
                                            item.waterVolumeUsed }} </p>
                                    </td>
                                </template>

                                <template v-if="item.activity == 'Crop Observation'">
                                    <td colspan="2">
                                        <p class="break-words"> <span class="font-weight-bold"> Crop Season:</span> {{
                                            item.cropObservation_cropSeason.name }} </p>
                                        <p class="break-words"> <span class="font-weight-bold">Date Of Observation:</span>
                                            {{ item.dateOfObservation | formatDate }}</p>
                                        <p class="break-words"> <span class="font-weight-bold">Growth Stage:</span> {{
                                            item.growthStage }}</p>
                                        <p class="break-words"> <span class="font-weight-bold"> Germination Rate: </span> {{
                                            item.germinationRate }} </p>
                                        <p class="break-words"> <span class="font-weight-bold"> Leaf/Colour
                                                Appearance:</span> {{ item.leafColor }} </p>
                                    </td>

                                    <td colspan="2">
                                        <p class="break-words"> <span class="font-weight-bold"> Leaf Size:</span> {{
                                            item.leafSize }} </p>
                                        <p class="break-words"> <span class="font-weight-bold"> Stem Colour:</span> {{
                                            item.stemColor }} </p>
                                        <p class="break-words"> <span class="font-weight-bold"> Stem Thickness:</span> {{
                                            item.stemThickness }} </p>
                                        <p class="break-words"> <span class="font-weight-bold"> Plant Height:</span> {{
                                            item.plantHeight }} </p>
                                        <p class="break-words"> <span class="font-weight-bold"> Tiller Number:</span> {{
                                            item.tillerNumber }} </p>
                                        <p class="break-words"> <span class="font-weight-bold"> Appearance of
                                                Flowers:</span> {{ item.appreanceOfFlower }} </p>
                                        <p class="break-words"> <span class="font-weight-bold"> Joint Type:</span> {{
                                            item.jointType }} </p>
                                    </td>

                                    <td colspan="2">
                                        <p class="break-words"> <span class="font-weight-bold"> Nitrogen Deficiency:</span>
                                            {{ maperImplode(item.cropObservation_deficiency, 'element', 'nitrogen', 'name')
                                            }}
                                        </p>
                                        <p class="break-words"> <span class="font-weight-bold"> Nitrogen Toxicity:</span>
                                            {{ maperImplode(item.cropObservation_toxicity, 'element', 'nitrogen', 'name') }}
                                        </p>
                                        <p class="break-words"> <span class="font-weight-bold"> Phosphorus
                                                Deficiency:</span>
                                            {{ maperImplode(item.cropObservation_deficiency, 'element', 'phosphorus',
                                                'name') }}
                                        </p>
                                        <p class="break-words"> <span class="font-weight-bold"> Phosphorus Toxicity:</span>
                                            {{ maperImplode(item.cropObservation_toxicity, 'element', 'phosphorus', 'name')
                                            }}
                                        </p>
                                        <p class="break-words"> <span class="font-weight-bold"> Potassium Deficiency:</span>
                                            {{ maperImplode(item.cropObservation_deficiency, 'element', 'potassium', 'name')
                                            }}
                                        </p>
                                    </td>

                                    <td colspan="2">
                                        <p class="break-words"> <span class="font-weight-bold"> Pest Infestations:</span>
                                            {{ arrToStr(item.cropObservation_pestInfestation, 'name') }}
                                        </p>
                                        <p class="break-words"> <span class="font-weight-bold"> Viral Diseases:</span>
                                            {{ maperImplode(item.cropObservation_diseases, 'organism', 'virus', 'name') }}
                                        </p>
                                        <p class="break-words"> <span class="font-weight-bold"> Bacterial Diseases:</span>
                                            {{ maperImplode(item.cropObservation_diseases, 'organism', 'bacteria', 'name')
                                            }}
                                        </p>
                                        <p class="break-words"> <span class="font-weight-bold"> Fungi Diseases :</span>
                                            {{ maperImplode(item.cropObservation_diseases, 'organism', 'fungi', 'name') }}
                                        </p>
                                        <p class="break-words"> <span class="font-weight-bold"> Additional Notes:</span> {{
                                            item.notes }}</p>
                                    </td>
                                </template>

                                <template v-if="item.activity == 'Pest Management'">
                                    <td colspan="2">
                                        <p class="break-words"> <span class="font-weight-bold"> Date of First Pest
                                                Detection:</span> {{ item.dateOfFirstPestDetection | formatDate }} </p>
                                        <p class="break-words"> <span class="font-weight-bold">Crop Stage:</span> {{
                                            item.cropstage }}</p>
                                        <p class="break-words"> <span class="font-weight-bold">Number of Plants
                                                Affected:</span> {{ item.numberOfPlantsAffected }}</p>
                                    </td>

                                    <td colspan="2">
                                        <p class="break-words"> <span class="font-weight-bold"> Plant Part(s) Affected:
                                            </span> {{ item.plantParts }} </p>
                                        <p class="break-words"> <span class="font-weight-bold"> Type of Pest:</span> {{
                                            arrToStr(item.pestTypes, 'name') }} </p>
                                        <p class="break-words"> <span class="font-weight-bold"> Pest Infestation
                                                Symptoms:</span> {{ arrToStr(item.pestManagementInfestationSymptoms, 'name')
                                                }} </p>
                                    </td>

                                    <td>
                                        <p class="break-words"> <span class="font-weight-bold"> Type of Pest Control:</span>
                                            {{ item.controlType }}</p>
                                        <p class="break-words"> <span class="font-weight-bold"> Start Date of Pest
                                                Control:</span> {{ item.startOfPestControl | formatDate }} </p>
                                    </td>

                                    <td colspan="2">
                                        <p class="break-words"> <span class="font-weight-bold"> Pest Control
                                                Duration:</span> {{ item.pestControlDuration }}</p>
                                        <p class="break-words"> <span class="font-weight-bold"> Other Date(s) of Pest
                                                Control:</span> {{ item.dates }} </p>
                                    </td>

                                    <td>
                                        <p class="break-words"> <span class="font-weight-bold"> Cultural/Manual Pest Control
                                                Method:</span> {{ item.pestCulturalManualMethod }}</p>
                                    </td>
                                </template>

                                <template v-if="item.activity == 'Disease Management'">
                                    <td colspan="2">
                                        <p class="break-words"> <span class="font-weight-bold"> Date of First Sign of
                                                Disease Detection:</span> {{ item.dateOfFirstDiseaseDetection | formatDate
                                                }} </p>
                                        <p class="break-words"> <span class="font-weight-bold">Crop Stage:</span> {{
                                            item.cropstage }}</p>
                                        <p class="break-words"> <span class="font-weight-bold">Number of Plants
                                                Affected:</span> {{ item.numberOfPlantsAffected }}</p>
                                    </td>

                                    <td colspan="2">
                                        <p class="break-words"> <span class="font-weight-bold"> Plant Part(s) Affected:
                                            </span> {{ item.plantParts }} </p>
                                        <p class="break-words"> <span class="font-weight-bold"> Type of Disease:</span> {{
                                            arrToStr(item.diseaseType, 'name') }} </p>
                                        <p class="break-words"> <span class="font-weight-bold"> Disease Symptoms:</span> {{
                                            arrToStr(item.diseaseSymptoms, 'symptoms') }} </p>
                                    </td>

                                    <td>
                                        <p class="break-words"> <span class="font-weight-bold"> Disease Control
                                                Method:</span> {{ item.controlType }}</p>
                                        <p class="break-words"> <span class="font-weight-bold"> Disease Control Start
                                                Date:</span> {{ item.diseaseControlStartDate | formatDate }} </p>
                                    </td>

                                    <td colspan="2">
                                        <p class="break-words"> <span class="font-weight-bold"> Disease Control
                                                Duration:</span> {{ item.diseaseControlDuration }}</p>
                                        <p class="break-words"> <span class="font-weight-bold"> Other Date(s) of Disease
                                                Control:</span> {{ item.dates }} </p>
                                    </td>

                                    <td>
                                        <p class="break-words"> <span class="font-weight-bold">
                                                Cultural/Mechanical/Biological Disease Control Method:</span> {{
                                                    item.diseaseCulturalManualMethod }}</p>
                                    </td>
                                </template>

                                <template v-if="item.activity == 'Land Preparation'">
                                    <td colspan="2">
                                        <p class="break-words"> <span class="font-weight-bold"> Soil Type:</span> {{
                                            item.soilType }} </p>
                                        <p class="break-words"> <span class="font-weight-bold">Soil Preparation
                                                Activity:</span> {{ item.soilPrepActivities }}</p>

                                    </td>

                                    <td colspan="2">
                                        <p class="break-words"> <span class="font-weight-bold"> Start Date of Land
                                                Preparation: </span> {{ item.startDate | formatDate }} </p>
                                        <p class="break-words"> <span class="font-weight-bold"> End Date of Land
                                                Preparation:</span> {{ item.endDate | formatDate }} </p>

                                    </td>

                                    <td colspan="3">
                                        <p class="break-words"> <span class="font-weight-bold"> Number of days:</span> {{
                                            item.days }}</p>
                                        <p class="break-words"> <span class="font-weight-bold"> Equipment:</span> {{
                                            item.equipment }} </p>
                                    </td>
                                </template>

                                <template v-if="item.activity == 'Sowing/Planting'">
                                    <td colspan="2">
                                        <p class="break-words"> <span class="font-weight-bold"> Area Planted:</span> {{
                                            item.area }} {{ item.areaUnit }}</p>
                                        <p class="break-words"> <span class="font-weight-bold"> Start date of
                                                sowing/planting: </span> {{ item.startDate | formatDate }} </p>
                                        <p class="break-words"> <span class="font-weight-bold"> End date of
                                                sowing/planting:</span> {{ item.endDate | formatDate }}</p>
                                    </td>

                                    <td colspan="2">
                                        <p class="break-words"> <span class="font-weight-bold"> Total Number of days:</span>
                                            {{ item.days }} </p>
                                        <p class="break-words"> <span class="font-weight-bold">Type of Planting
                                                Material:</span> {{ item.plantingTypes }} </p>
                                        <p class="break-words"> <span class="font-weight-bold">Planting Rate:</span> {{
                                            item.seedingRate }} {{ item.seedingUnit }} </p>
                                    </td>

                                    <td colspan="2">
                                        <p class="break-words"> <span class="font-weight-bold"> Plant Row Spacing:</span> {{
                                            item.rowSpacing }} {{ item.rowSpacingUnit }}</p>
                                        <p class="break-words"><span class="font-weight-bold"> Plant In-Row Spacing :</span>
                                            {{ item.inRowSpacing }} {{ item.inRowSpacingUnit }}</p>
                                        <p class="break-words"> <span class="font-weight-bold"> Plant
                                                Population/Density:</span> {{ item.density }}</p>
                                    </td>

                                    <td colspan="2">
                                        <p class="break-words"> <span class="font-weight-bold"> Planting Depth:</span> {{
                                            item.depth }} {{ item.depthSpacingUnit }}</p>
                                    </td>


                                </template>

                                <template v-if="item.activity == 'Soil Information'">
                                    <td colspan="2">
                                        <p class="break-words"> <span class="font-weight-bold"> Soil Type:</span> {{
                                            item.soilType }} </p>
                                        <p class="break-words"> <span class="font-weight-bold"> Soil Health: </span> {{
                                            item.soilHealth }} </p>
                                        <p class="break-words"> <span class="font-weight-bold"> PH:</span> {{ item.ph }}</p>
                                    </td>

                                    <td colspan="2">
                                        <p class="break-words"> <span class="font-weight-bold"> Nitrogen:</span> {{
                                            item.nitrogen }} mg/l</p>
                                        <p class="break-words"> <span class="font-weight-bold">Phosphorus:</span> {{
                                            item.phosphorus }} mg/l </p>
                                        <p class="break-words"> <span class="font-weight-bold">Potassium:</span> {{
                                            item.potassium }} mg/l</p>
                                    </td>

                                    <td colspan="3">
                                        <p class="break-words"> <span class="font-weight-bold"> Sulfur:</span> {{
                                            item.sulfur }} mg/l</p>

                                    </td>
                                </template>

                                <template v-if="item.activity == 'Storage'">
                                    <td colspan="3">
                                        <p class="break-words"> <span class="font-weight-bold"> Start Date of
                                                Storage:</span> {{ item.startDate | formatDate }} </p>
                                        <p class="break-words"> <span class="font-weight-bold"> End Date of Storage: </span>
                                            {{ item.endDate | formatDate }} </p>
                                        <p class="break-words"> <span class="font-weight-bold"> Duration of Storage:</span>
                                            {{ item.durationOfStorage }}</p>
                                    </td>

                                    <td colspan="3">
                                        <p class="break-words"> <span class="font-weight-bold"> Yield Stored:</span> {{
                                            item.yieldStored }} </p>
                                        <p class="break-words"> <span class="font-weight-bold">Storage Process
                                                method:</span> {{ item.cropStorageMethod }} </p>
                                        <p class="break-words"> <span class="font-weight-bold">Storage Type :</span> {{
                                            item.cropStoragetype }} </p>
                                    </td>
                                </template>

                                <template v-if="item.activity == 'Nutrient Management'">
                                    <td colspan="2">
                                        <p> <span class="font-weight-bold"> Date Of Application:</span> {{
                                            item.dateOfApplication | formatDate }} </p>
                                        <p> <span class="font-weight-bold"> Application Stage:</span> {{
                                            item.sources.cropType.applicationStage }}</p>
                                    </td>
                                    <td colspan="2">
                                        <p> <span class="font-weight-bold"> Days after Sowing:</span> {{
                                            item.daysAfterSowing }}</p>
                                        <p> <span class="font-weight-bold">Fertilizers Applied area:</span> {{
                                            item.fertilizerAppliedArea }} hectares</p>
                                    </td>


                                    <!-- <td colspan="2" v-for="(ssm, key) in item.fertilizerInputs" :key="key">
                                        <p> <span class="font-weight-bold"> Fertilizer Name:</span> {{ ssm.fertilizerName }}
                                        </p>
                                        <p> <span class="font-weight-bold"> Type:</span> {{ ssm.fertilizerType.name }}</p>
                                        <p> <span class="font-weight-bold"> Ingredient Name:</span> {{
                                            arrToStr(ssm.mixtures, 'ingredientName') }}</p>
                                        <p> <span class="font-weight-bold"> Cost:</span> {{ ssm.cost }}</p>
                                    </td> -->
                                </template>
                            </template>

                            <template v-slot:item.createdAt="{ item }">
                                {{ item.createdAt | formatDate }}
                            </template>

                            <template v-slot:item.end_date_harvesting="{ item }">
                                {{ item.end_date_harvesting | formatDate }}
                            </template>

                            <template v-slot:footer></template>
                        </v-data-table>
                    </div>
                    <v-spacer></v-spacer>
                    <div class="footer-box" v-if="totalCost">
                        <div class="font-weight-bold"> Total Cost </div>
                        <div class="font-weight-bold"> {{ currency }} {{ totalCost }} </div>
                    </div>
                </v-card-text>
            </v-card>
        </v-container>
    </div>
</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin";
import DownloadMixin from '@/mixins/DownloadMixin'
import getPermittedActions from "@/mixins/GetPermittedActions";
import { mapGetters } from 'vuex'
import _ from 'lodash'
import MemberDataService from "@/_services/MemberDataService";

export default {
    async mounted() {
        this.fetchActivity()
        this.$store.dispatch('memberData/getUserFarms', {
            userId: this.$route.params.userId
        })
    },
    computed: {
        ...mapGetters({
            farmsActivities: 'memberData/farmsActivities',
            userFarms: 'memberData/userFarms',
            farmerDetail: 'memberData/farmerDetail'
        }),
        activities() {
            let xy = []
            this.farmsActivities.data.map(x => {
                return xy.push({ ...x, sources: this.sources })
            })
            return xy;
        },
        totalCost() {
            return this.farmsActivities.totalCost
        },
        currency() {
            return this.farmsActivities?.currency?.symbol || '$'
        },
        totalPages() {
            const count = this.farmsActivities.data.length
            return count < this.options.limit ? 1 : Math.ceil(count / this.options.limit)
        },
        zones() {
            return this.userFarms.map(x => {
                return {
                    val: x.id,
                    label: x.farmName
                }
            })
        }
    },
    data() {
        return {
            expanded: [],
            tab: 0,
            selectedItem: false,
            dateMenu: false,
            dateSearch: '',
            activityType: ['Harvesting', 'Irrigation', 'Nutrient Management', 'Weeding', 'Storage', 'Sowing/Planting', 'Land Preparation', 'Soil Information', 'Disease Management', 'Pest Management', 'Crop Observation'],
            zone: '',
            options: {
                page: 1,
                limit: 50,
                dates: [],
                activity: [],
                type: 'pdf',
                userId: this.$route.params.userId,
                farmId: null
            },
            loading: false,
            activityLoading: false,
            from: 0,
            to: 0,
            downloadFormats: [
                { 'val': 'csv', 'name': 'CSV' },
                { 'val': 'xlsx', 'name': 'Excel' },
                { 'val': 'pdf', 'name': 'PDF' }
            ],
            downloadFormat: '',
            activityTypes: [
                { val: 'Land Preparation', label: 'Land Preparation' },
                { val: 'Soil Information', label: 'Soil Information' },
                { val: 'Nutrient Management', label: 'Nutrient Management' },
                { val: 'Weeding', label: 'Weeding' },
                { val: 'Harvesting', label: 'Harvesting' },
                { val: 'Irrigation', label: 'Irrigation' },
                { val: 'Storage', label: 'Storage' },
                { val: 'Sowing/Planting', label: 'Sowing/Planting' },
                { val: 'Disease Management', label: 'Disease Management' },
                { val: 'Pest Management', label: 'Pest Management' },
                { val: 'Crop Observation', label: 'Crop Observation' },
            ],
            totalFarmers: 3,
            sources: {
                id: 2,
                activityType: {
                    dateOfApplication: '2022/03/10',
                    type: 'Organice',
                    applicationRate: '10 KG'
                },
                cropType: {
                    applicationStage: 'Land preparation',
                    ingridentName: 'DAP',
                    quantity: '12 KG'
                },
                area: {
                    daysAftershowing: 20,
                    percentage: '20%'
                },
                startDate: {
                    fertilizerAppliedArea: '50 Acre',
                    cost: 'RP 500'

                },
                endDate: {
                    fertilizerName: 'Super phospate',
                    quantity: '10 KG'
                }
            },
            totalActivities: 3,
            headers: [
                {
                    text: this.$t("memberDataSection.activityType"),
                    align: "start",
                    value: "activity",
                    class: "black--text",
                },
                {
                    text: this.$t("memberDataSection.farmZone"),
                    value: "farms",
                    align: "start",
                    class: "black--text",
                    sortable: true,
                },
                {
                    text: this.$t("memberDataSection.cropType"),
                    align: "start",
                    value: "crop",
                    class: "black--text",
                    sortable: true,
                },
                {
                    text: this.$t("memberDataSection.cropVarity"),
                    align: "start",
                    value: "corpVariety",
                    class: "black--text",
                    sortable: true,
                },
                {
                    text: this.$t("memberDataSection.area"),
                    align: "start",
                    value: "area",
                    class: "black--text",
                    sortable: true,
                },
                {
                    text: this.$t("memberDataSection.startDate"),
                    align: "start",
                    value: "createdAt",
                    class: "black--text",
                    sortable: true,
                },
                {
                    text: this.$t("memberDataSection.endDate"),
                    align: "start",
                    value: "end_date_harvesting",
                    class: "black--text",
                    sortable: true,
                },
                {
                    text: this.$t("memberDataSection.cost"),
                    align: "start",
                    value: "totalCost",
                    class: "black--text",
                    sortable: true,
                },
                { text: 'Action', value: 'data-table-expand' },
            ],

            breadcrumbs: [
                {
                    text: this.$t("dashboard"),
                    disabled: false,
                    to: { name: "Users" },
                    exact: true,
                },
                {
                    text: this.$t("memberDataSection.farmers"),
                    disabled: true,
                    href: "breadcrumbs_link_1",
                },
                {
                    text: 'Farm Activites',
                    disabled: true,
                    href: "breadcrumbs_link_1",
                },
            ],
        };
    },
    methods: {
        maperImplode(arr, key, el, del) {
            return arr.filter(x => x[key] === el).map(y => y[del]).join(',')
        },
        arrToStr(arr, key) {
            return arr.map(x => x[key]).join(',')
        },
        async fetchActivity() {
            this.startLoading()
            this.options.activity = this.activityType
            this.$store.dispatch('memberData/getFarmsActivity', this.options)
                .then(() => this.stopLoading())
                .catch(() => this.stopLoading())
        },
        handleSearchByDate: _.debounce(function () {
            this.options.dates = []
            if (this.dateSearch) {
                const [year, month, day] = this.dateSearch.split('-')
                const rm = `${month}/${day}/${year}`
                this.options.dates.push(rm)
            }
            this.fetchActivity()
        }, 1000),

        handleGetActivityType: _.debounce(function () {
            this.options.activity = this.activityType
            this.fetchActivity()
        }, 1000),

        handleGetZoneType: _.debounce(function () {
            this.options.farmId = this.zone
            this.fetchActivity()
        }, 1000),

        selectItem(item) {
            this.selectedItem = item;
        },
        resetSearchOnEmpty() {
            //Placed
        },
        exportReport(type) {
            const { DOWNLOAD_FARMS_ACTIVITY_URL } = MemberDataService
            this.options.type = type
            this.options.activity = this.activityType
            const { activity, farmId, ...restParams } = this.options

            const queryString = new URLSearchParams(restParams)
            const activityString = activity.join('-')
            const farmString = farmId ? farmId.join('-') : ""
            queryString.append('activity', activityString)
            queryString.append('farmId', farmString)

            const requestUrl = `${DOWNLOAD_FARMS_ACTIVITY_URL}?${queryString}`
            this.startLoading()
            let fileName = ''
            let ftype = ''
            if (type == 'pdf') {
                fileName = 'farms-activity.pdf'
                ftype = 'application/pdf'
            } else if (type == 'csv') {
                fileName = 'farms-activity.csv'
                ftype = 'text/csv'
            } else {
                fileName = 'farms-activity.xlsx'
                ftype = 'application/xlsx'
            }
            this.downloadSourceFile(requestUrl, ftype, fileName)
            this.stopLoading()
        },

        pageChange(t) {
            if (t) this.options.page = this.options.page + 1;
            else this.options.page = this.options.page - 1;
            this.getRoles();
        }
    },
    mixins: [loadingMixin, DownloadMixin, getPermittedActions],
};
</script>
<style lang="scss" scoped>
.display-row {
    padding: 10px;
    display: flex;
    flex-direction: row;
    width: 100%;
}

.display-col {
    padding: 10px;
    display: flex;
    flex-direction: column;
    width: 100%;
}

::v-deep .wdt.v-text-field {
    width: 250px;
}

::v-deep .v-tab:hover {
    background-color: #caf1e2;
    color: $primary_color !important;
}

::v-deep .v-data-table-header span {
    text-transform: uppercase !important;
    color: black;
}

::v-deep .center-content {
    display: flex;
    justify-content: center;
    align-items: center;
}

::v-deep .img-center {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 40%;
}

::v-deep .download-btn {
    width: 217px;
    height: 50px;
    border-radius: 5px;
    justify-content: space-between;
}

::v-deep .footer-box {
    background-color: #00BD73;
    padding: 20px 100px 20px 100px;
    display: flex;
    justify-content: space-between;
    margin-top: 25px;
}

::v-deep .footer-box div {
    color: #fff;
}

::v-deep .flex-wrap-p {
    flex-wrap: wrap;
}

::v-deep .v-data-table__expanded__content {
    height: 250px;
}

::v-deep .break-words {
    overflow-wrap: break-word;
    word-wrap: break-word;
    hyphens: auto;
    word-break: break-word;
}

@media only screen and (min-width: 1325px) {
    ::v-deep .flex-wrap-p {
        margin-bottom: 20px;
    }
}
</style>
    