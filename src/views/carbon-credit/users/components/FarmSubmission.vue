<template>
    <div>
        <breadcrumb :items="breadcrumbs" />

        <v-container fluid>
            <div class="d-flex align-center justify-space-between mt-6 mb-4">
                <h2 class="font-weight-bold mb-6">{{ farmName }}</h2>
                <div>
                    <v-btn
                        outlined
                        class="mr-2 mb-2"
                        @click="exportAsPdf"
                        style="border-color: #00BD73; color: #00BD73; background-color: white;"
                    >{{ $t('carbonCredit.user.exportAsPdf') }}</v-btn>

                    <v-btn
                        outlined
                        class="mr-2 mb-2"
                        @click="$router.go(-1)"
                        style="border-color: #00BD73; color: #00BD73; background-color: white;"
                    >{{ $t('carbonCredit.back') }}</v-btn>
                </div>
            </div>

            <v-card flat class="pa-6">
                <!-- Farm Data Description (Outside expandable) -->
                <div class="d-flex align-center">
                    <span class="font-weight-bold">{{ $t('carbonCredit.user.farmData') }}</span>
                    <v-tooltip top color="#00BD73" max-width="300">
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon
                                class="ml-2"
                                size="20"
                                style="color: #00BD73; cursor: pointer;"
                                v-bind="attrs"
                                v-on="on"
                            >mdi-alert-circle</v-icon>
                        </template>
                        <span>{{ $t('carbonCredit.user.farmDataDesc') }}</span>
                    </v-tooltip>
                </div>
                <div class="text-body-1 mb-4">{{ $t('carbonCredit.user.farmDataDesc') }}</div>

                <!-- Crops Sub-section -->
                <v-expansion-panels flat class="mb-4">
                    <v-expansion-panel>
                        <v-expansion-panel-header
                            class="font-weight-medium bordered-expansion"
                        >{{ $t('carbonCredit.user.crops') }} ({{ crops.length }})</v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <!-- Dynamic Error Message for Crops -->
                            <div v-if="cropError" class="text-center my-4">
                                <div class="red--text font-weight-bold">{{ cropError }}</div>
                            </div>
                            <div>
                                <!-- Search and Pagination Controls (Outside Table) -->
                                <div class="d-flex mt-4">
                                    <div class="srch mr-2">
                                        <v-text-field
                                            prepend-inner-icon="mdi-magnify"
                                            outlined
                                            dense
                                            height="5px"
                                            :placeholder="$t('carbonCredit.search')"
                                            v-model="cropSearch"
                                            @input="filterCrops"
                                            class="shrink"
                                        ></v-text-field>
                                    </div>
                                    <v-spacer></v-spacer>
                                    <div
                                        class="py-1 title"
                                    >{{ cropFrom }} - {{ cropTo }} of {{ crops.length }}</div>
                                    <v-btn
                                        class="mx-2"
                                        fab
                                        small
                                        outlined
                                        color="primary"
                                        :disabled="cropPage <= 1"
                                        @click="changeCropPage(false)"
                                    >
                                        <v-icon dark>mdi-chevron-left</v-icon>
                                    </v-btn>
                                    <v-btn
                                        class="mx-2"
                                        fab
                                        small
                                        outlined
                                        color="primary"
                                        :disabled="cropPage >= cropTotalPages"
                                        @click="changeCropPage(true)"
                                    >
                                        <v-icon dark>mdi-chevron-right</v-icon>
                                    </v-btn>
                                </div>

                                <!-- Data Table -->
                                <v-data-table
                                    :headers="cropHeaders"
                                    :items="filteredCrops"
                                    :items-per-page="cropLimit"
                                    hide-default-footer
                                    class="elevation-1"
                                ></v-data-table>
                            </div>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>

                <!-- Sowing Section -->
                <v-expansion-panels flat class="mb-4" v-model="sowingExpanded">
                    <v-expansion-panel>
                        <v-expansion-panel-header
                            class="font-weight-medium bordered-expansion"
                        >{{ $t('carbonCredit.user.sowing') }} ({{ sowingData.length }})</v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <!-- Dynamic Error Message for Sowing -->
                            <div v-if="sowingError" class="text-center my-4">
                                <div class="red--text font-weight-bold">{{ sowingError }}</div>
                            </div>
                            <div>
                                <!-- Search and Pagination Controls (Outside Table) -->
                                <div class="d-flex mt-4">
                                    <div class="srch mr-2">
                                        <v-text-field
                                            prepend-inner-icon="mdi-magnify"
                                            outlined
                                            dense
                                            height="5px"
                                            :placeholder="$t('carbonCredit.search')"
                                            v-model="sowingSearch"
                                            @input="filterSowing"
                                            class="shrink"
                                        ></v-text-field>
                                    </div>
                                    <v-spacer></v-spacer>
                                    <div
                                        class="py-1 title"
                                    >{{ sowingFrom }} - {{ sowingTo }} of {{ sowingData.length }}</div>
                                    <v-btn
                                        class="mx-2"
                                        fab
                                        small
                                        outlined
                                        color="primary"
                                        :disabled="sowingPage <= 1"
                                        @click="changeSowingPage(false)"
                                    >
                                        <v-icon dark>mdi-chevron-left</v-icon>
                                    </v-btn>
                                    <v-btn
                                        class="mx-2"
                                        fab
                                        small
                                        outlined
                                        color="primary"
                                        :disabled="sowingPage >= sowingTotalPages"
                                        @click="changeSowingPage(true)"
                                    >
                                        <v-icon dark>mdi-chevron-right</v-icon>
                                    </v-btn>
                                </div>
                                <v-data-table
                                    :headers="sowingHeaders"
                                    :items="filteredSowing"
                                    :items-per-page="sowingLimit"
                                    hide-default-footer
                                    class="elevation-1"
                                ></v-data-table>
                            </div>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
                <!-- Seedling Sub-section -->
                <v-expansion-panels flat class="mb-4">
                    <v-expansion-panel>
                        <v-expansion-panel-header
                            class="font-weight-medium bordered-expansion"
                        >{{ $t('carbonCredit.user.seedling') }} ({{ seedlingData.length }})</v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <!-- Dynamic Error Message for Seedling -->
                            <div v-if="seedlingError" class="text-center my-4">
                                <div class="red--text font-weight-bold">{{ seedlingError }}</div>
                            </div>
                            <div>
                                <!-- Search and Pagination Controls (Outside Table) -->
                                <div class="d-flex mt-4">
                                    <div class="srch mr-2">
                                        <v-text-field
                                            prepend-inner-icon="mdi-magnify"
                                            outlined
                                            dense
                                            height="5px"
                                            :placeholder="$t('carbonCredit.search')"
                                            v-model="seedlingSearch"
                                            @input="filterSeedling"
                                            class="shrink"
                                        ></v-text-field>
                                    </div>
                                    <v-spacer></v-spacer>
                                    <div
                                        class="py-1 title"
                                    >{{ seedlingFrom }} - {{ seedlingTo }} of {{ seedlingData.length }}</div>
                                    <v-btn
                                        class="mx-2"
                                        fab
                                        small
                                        outlined
                                        color="primary"
                                        :disabled="seedlingPage <= 1"
                                        @click="changeSeedlingPage(false)"
                                    >
                                        <v-icon dark>mdi-chevron-left</v-icon>
                                    </v-btn>
                                    <v-btn
                                        class="mx-2"
                                        fab
                                        small
                                        outlined
                                        color="primary"
                                        :disabled="seedlingPage >= seedlingTotalPages"
                                        @click="changeSeedlingPage(true)"
                                    >
                                        <v-icon dark>mdi-chevron-right</v-icon>
                                    </v-btn>
                                </div>

                                <!-- Data Table -->
                                <v-data-table
                                    :headers="seedlingHeaders"
                                    :items="filteredSeedling"
                                    :items-per-page="seedlingLimit"
                                    hide-default-footer
                                    class="elevation-1"
                                ></v-data-table>
                            </div>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>

                <!-- Fertilizer Sub-section -->
                <v-expansion-panels flat class="mb-4">
                    <v-expansion-panel>
                        <v-expansion-panel-header
                            class="font-weight-medium bordered-expansion"
                        >{{ $t('carbonCredit.user.fertilizer') }} ({{ fertilizerData.length }})</v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <!-- Dynamic Error Message for Fertilizer -->
                            <div v-if="fertilizerError" class="text-center my-4">
                                <div class="red--text font-weight-bold">{{ fertilizerError }}</div>
                            </div>
                            <div>
                                <!-- Search and Pagination Controls (Outside Table) -->
                                <div class="d-flex mt-4">
                                    <div class="srch mr-2">
                                        <v-text-field
                                            prepend-inner-icon="mdi-magnify"
                                            outlined
                                            dense
                                            height="5px"
                                            :placeholder="$t('carbonCredit.search')"
                                            v-model="fertilizerSearch"
                                            @input="filterFertilizer"
                                            class="shrink"
                                        ></v-text-field>
                                    </div>
                                    <v-spacer></v-spacer>
                                    <div
                                        class="py-1 title"
                                    >{{ fertilizerFrom }} - {{ fertilizerTo }} of {{ fertilizerData.length }}</div>
                                    <v-btn
                                        class="mx-2"
                                        fab
                                        small
                                        outlined
                                        color="primary"
                                        :disabled="fertilizerPage <= 1"
                                        @click="changeFertilizerPage(false)"
                                    >
                                        <v-icon dark>mdi-chevron-left</v-icon>
                                    </v-btn>
                                    <v-btn
                                        class="mx-2"
                                        fab
                                        small
                                        outlined
                                        color="primary"
                                        :disabled="fertilizerPage >= fertilizerTotalPages"
                                        @click="changeFertilizerPage(true)"
                                    >
                                        <v-icon dark>mdi-chevron-right</v-icon>
                                    </v-btn>
                                </div>

                                <!-- Data Table -->
                                <v-data-table
                                    :headers="fertilizerHeaders"
                                    :items="filteredFertilizer"
                                    :items-per-page="fertilizerLimit"
                                    hide-default-footer
                                    class="elevation-1"
                                ></v-data-table>
                            </div>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>

                <!-- Harvesting Sub-section -->
                <v-expansion-panels flat class="mb-4">
                    <v-expansion-panel>
                        <v-expansion-panel-header
                            class="font-weight-medium bordered-expansion"
                        >{{ $t('carbonCredit.user.harvesting') }} ({{ harvestingData.length }})</v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <!-- Dynamic Error Message for Harvesting -->
                            <div v-if="harvestingError" class="text-center my-4">
                                <div class="red--text font-weight-bold">{{ harvestingError }}</div>
                            </div>
                            <div>
                                <!-- Search and Pagination Controls (Outside Table) -->
                                <div class="d-flex mt-4">
                                    <div class="srch mr-2">
                                        <v-text-field
                                            prepend-inner-icon="mdi-magnify"
                                            outlined
                                            dense
                                            height="5px"
                                            :placeholder="$t('carbonCredit.search')"
                                            v-model="harvestingSearch"
                                            @input="filterHarvesting"
                                            class="shrink"
                                        ></v-text-field>
                                    </div>
                                    <v-spacer></v-spacer>
                                    <div
                                        class="py-1 title"
                                    >{{ harvestingFrom }} - {{ harvestingTo }} of {{ harvestingData.length }}</div>
                                    <v-btn
                                        class="mx-2"
                                        fab
                                        small
                                        outlined
                                        color="primary"
                                        :disabled="harvestingPage <= 1"
                                        @click="changeHarvestingPage(false)"
                                    >
                                        <v-icon dark>mdi-chevron-left</v-icon>
                                    </v-btn>
                                    <v-btn
                                        class="mx-2"
                                        fab
                                        small
                                        outlined
                                        color="primary"
                                        :disabled="harvestingPage >= harvestingTotalPages"
                                        @click="changeHarvestingPage(true)"
                                    >
                                        <v-icon dark>mdi-chevron-right</v-icon>
                                    </v-btn>
                                </div>

                                <!-- Data Table -->
                                <v-data-table
                                    :headers="harvestingHeaders"
                                    :items="filteredHarvesting"
                                    :items-per-page="harvestingLimit"
                                    hide-default-footer
                                    class="elevation-1"
                                ></v-data-table>
                            </div>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>

                <!-- Livestock Sub-section -->
                <v-expansion-panels flat class="mb-4">
                    <v-expansion-panel>
                        <v-expansion-panel-header
                            class="font-weight-medium bordered-expansion"
                        >{{ $t('carbonCredit.user.livestock') }} ({{ livestockData.length }})</v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <!-- Dynamic Error Message for Livestock -->
                            <div v-if="livestockError" class="text-center my-4">
                                <div class="red--text font-weight-bold">{{ livestockError }}</div>
                            </div>
                            <div>
                                <!-- Search and Pagination Controls (Outside Table) -->
                                <div class="d-flex mt-4">
                                    <div class="srch mr-2">
                                        <v-text-field
                                            prepend-inner-icon="mdi-magnify"
                                            outlined
                                            dense
                                            height="5px"
                                            :placeholder="$t('carbonCredit.search')"
                                            v-model="livestockSearch"
                                            @input="filterLivestock"
                                            class="shrink"
                                        ></v-text-field>
                                    </div>
                                    <v-spacer></v-spacer>
                                    <div
                                        class="py-1 title"
                                    >{{ livestockFrom }} - {{ livestockTo }} of {{ livestockData.length }}</div>
                                    <v-btn
                                        class="mx-2"
                                        fab
                                        small
                                        outlined
                                        color="primary"
                                        :disabled="livestockPage <= 1"
                                        @click="changeLivestockPage(false)"
                                    >
                                        <v-icon dark>mdi-chevron-left</v-icon>
                                    </v-btn>
                                    <v-btn
                                        class="mx-2"
                                        fab
                                        small
                                        outlined
                                        color="primary"
                                        :disabled="livestockPage >= livestockTotalPages"
                                        @click="changeLivestockPage(true)"
                                    >
                                        <v-icon dark>mdi-chevron-right</v-icon>
                                    </v-btn>
                                </div>

                                <!-- Data Table -->
                                <v-data-table
                                    :headers="livestockHeaders"
                                    :items="filteredLivestock"
                                    :items-per-page="livestockLimit"
                                    hide-default-footer
                                    class="elevation-1"
                                ></v-data-table>
                            </div>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>

                <!-- Equipment Sub-section -->
                <v-expansion-panels flat class="mb-4">
                    <v-expansion-panel>
                        <v-expansion-panel-header
                            class="font-weight-medium bordered-expansion"
                        >{{ $t('carbonCredit.user.equipment') }} ({{ equipmentData.length }})</v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <!-- Dynamic Error Message for Equipment -->
                            <div v-if="equipmentError" class="text-center my-4">
                                <div class="red--text font-weight-bold">{{ equipmentError }}</div>
                            </div>
                            <div>
                                <!-- Search and Pagination Controls (Outside Table) -->
                                <div class="d-flex mt-4">
                                    <div class="srch mr-2">
                                        <v-text-field
                                            prepend-inner-icon="mdi-magnify"
                                            outlined
                                            dense
                                            height="5px"
                                            :placeholder="$t('carbonCredit.search')"
                                            v-model="equipmentSearch"
                                            @input="filterEquipment"
                                            class="shrink"
                                        ></v-text-field>
                                    </div>
                                    <v-spacer></v-spacer>
                                    <div
                                        class="py-1 title"
                                    >{{ equipmentFrom }} - {{ equipmentTo }} of {{ equipmentData.length }}</div>
                                    <v-btn
                                        class="mx-2"
                                        fab
                                        small
                                        outlined
                                        color="primary"
                                        :disabled="equipmentPage <= 1"
                                        @click="changeEquipmentPage(false)"
                                    >
                                        <v-icon dark>mdi-chevron-left</v-icon>
                                    </v-btn>
                                    <v-btn
                                        class="mx-2"
                                        fab
                                        small
                                        outlined
                                        color="primary"
                                        :disabled="equipmentPage >= equipmentTotalPages"
                                        @click="changeEquipmentPage(true)"
                                    >
                                        <v-icon dark>mdi-chevron-right</v-icon>
                                    </v-btn>
                                </div>

                                <!-- Data Table -->
                                <v-data-table
                                    :headers="equipmentHeaders"
                                    :items="filteredEquipment"
                                    :items-per-page="equipmentLimit"
                                    hide-default-footer
                                    class="elevation-1"
                                ></v-data-table>
                            </div>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-card>
        </v-container>
    </div>
</template>

<script>
export default {
    name: 'FarmSubmission',
    props: {
        farmId: {
            type: [String, Number],
            required: true
        }
    },
    data() {
        return {
            farmName: 'Golden Coffee Farm',
            farmDataExpanded: [0], // Always expanded
            sowingExpanded: [], // Collapsed by default
            breadcrumbs: [
                {
                    text: this.$t("carbonCredit.dashboard"),
                    disabled: false,
                    href: "/dashboard",
                    exact: true,
                },
                {
                    text: this.$t("carbonCredit.title"),
                    disabled: false,
                    href: "/carbon-credit/projects",
                },
                {
                    text: this.$t("carbonCredit.projects"),
                    disabled: false,
                    href: "/carbon-credit/projects",
                },
                {
                    text: this.$t("carbonCredit.user.projectRequests"),
                    disabled: false,
                    href: "/carbon-credit/users",
                },
                {
                    text: this.farmName,
                    disabled: true,
                    href: "",
                },
            ],
            // Crops data
            crops: [
                { cropType: 'Onion', farm: 'Oakland Onion Farm', cropVariety: 'Bhima uper', season: 'Long rains', dateOfEntry: '05-MAR-2022' },
                { cropType: 'Sugarcane', farm: 'Oakland Sugarcane Farm', cropVariety: 'RB867515', season: 'Long rains', dateOfEntry: '05-MAR-2022' },
                { cropType: 'Lemon', farm: 'Oakland Lemon Farm', cropVariety: 'Baboon Lemon', season: 'Long rains', dateOfEntry: '05-MAR-2022' },
                { cropType: 'Chilli', farm: 'Oakland Chilli Farm', cropVariety: 'Cabai Katokkon', season: 'Long rains', dateOfEntry: '05-MAR-2022' },
                { cropType: 'Coffee', farm: 'Oakland Coffee Farm', cropVariety: 'Catimor', season: 'Long rains', dateOfEntry: '05-MAR-2022' },
            ],
            cropHeaders: [
                { text: 'Crop Type', value: 'cropType', sortable: true },
                { text: 'Farm', value: 'farm', sortable: true },
                { text: 'Crop Variety', value: 'cropVariety', sortable: true },
                { text: 'Season', value: 'season', sortable: true },
                { text: 'Date of Entry', value: 'dateOfEntry', sortable: true },
            ],
            cropSearch: '',
            filteredCrops: [],
            cropPage: 1,
            cropLimit: 5,
            cropFrom: 1,
            cropTo: 5,
            cropTotalPages: 1,
            cropError: null, // Dynamic error for crops

            // Sowing data
            sowingData: [
                { startDate: '01-MAR-2024', endDate: '03-MAR-2024', cropType: 'Onion', plantingDepth: '4cm', dateOfEntry: '06-MAR-2022' },
                { startDate: '12-MAY-2023', endDate: '24-MAY-2023', cropType: 'Onion', plantingDepth: '4cm', dateOfEntry: '06-MAR-2022' },
                { startDate: '05-MAR-2022', endDate: '07-MAR-2022', cropType: 'Sugarcane', plantingDepth: '4cm', dateOfEntry: '06-MAR-2022' },
                { startDate: '12-MAY-2021', endDate: '24-MAY-2021', cropType: 'Sugarcane', plantingDepth: '4cm', dateOfEntry: '06-MAR-2022' },
                { startDate: '15-JUN-2022', endDate: '20-JUN-2022', cropType: 'Coffee', plantingDepth: '3cm', dateOfEntry: '06-MAR-2022' },
            ],
            sowingHeaders: [
                { text: 'Start Date', value: 'startDate', sortable: true },
                { text: 'End Date', value: 'endDate', sortable: true },
                { text: 'Crop Type', value: 'cropType', sortable: true },
                { text: 'Planting Depth', value: 'plantingDepth', sortable: true },
                { text: 'Date of Entry', value: 'dateOfEntry', sortable: true },
            ],
            sowingSearch: '',
            filteredSowing: [],
            sowingPage: 1,
            sowingLimit: 5,
            sowingFrom: 1,
            sowingTo: 5,
            sowingTotalPages: 1,
            sowingError: null, // Dynamic error for sowing

            // Seedling data
            seedlingData: [
                { seedlingDate: '05-MAR-2024', originOfSeeds: 'Basil', seedProducer: 'John Seeds', noOfSeeds: '20' },
                { seedlingDate: '12-MAY-2023', originOfSeeds: 'Basil', seedProducer: 'John Seeds', noOfSeeds: '11' },
                { seedlingDate: '05-MAR-2022', originOfSeeds: 'Basil', seedProducer: 'John Seeds', noOfSeeds: '08' },
                { seedlingDate: '12-MAY-2021', originOfSeeds: 'Basil', seedProducer: 'John Seeds', noOfSeeds: '32' },
                { seedlingDate: '02-JAN-2020', originOfSeeds: 'Basil', seedProducer: 'John Seeds', noOfSeeds: '13' },
            ],
            seedlingHeaders: [
                { text: 'Seedling Date', value: 'seedlingDate', sortable: true },
                { text: 'Origin of Seeds', value: 'originOfSeeds', sortable: true },
                { text: 'Seed Producer', value: 'seedProducer', sortable: true },
                { text: 'No. of Seeds', value: 'noOfSeeds', sortable: true },
            ],
            seedlingSearch: '',
            filteredSeedling: [],
            seedlingPage: 1,
            seedlingLimit: 5,
            seedlingFrom: 1,
            seedlingTo: 5,
            seedlingTotalPages: 1,
            seedlingError: null, // Dynamic error for seedling

            // Fertilizer data
            fertilizerData: [
                { fertilizerDate: '14-JUL-2024', fertilizer: 'DAP', cost: 'USD 300', fertilizerType: 'Organic', cropType: 'Onion' },
                { fertilizerDate: '15-JUN-2024', fertilizer: 'Phosphate', cost: 'USD 300', fertilizerType: 'Soil', cropType: 'Onion' },
                { fertilizerDate: '23-MAY-2024', fertilizer: 'Phosphate', cost: 'USD 300', fertilizerType: 'Synthetic', cropType: 'Onion' },
                { fertilizerDate: '09-APR-2024', fertilizer: 'DAP', cost: 'USD 300', fertilizerType: 'Organic', cropType: 'Onion' },
                { fertilizerDate: '05-MAR-2024', fertilizer: 'Ammonium Nitrate', cost: 'USD 300', fertilizerType: 'Synthetic', cropType: 'Onion' },
            ],
            fertilizerHeaders: [
                { text: 'Fertilizer Date', value: 'fertilizerDate', sortable: true },
                { text: 'Fertilizer', value: 'fertilizer', sortable: true },
                { text: 'Cost', value: 'cost', sortable: true },
                { text: 'Fertilizer Type', value: 'fertilizerType', sortable: true },
                { text: 'Crop Type', value: 'cropType', sortable: true },
            ],
            fertilizerSearch: '',
            filteredFertilizer: [],
            fertilizerPage: 1,
            fertilizerLimit: 5,
            fertilizerFrom: 1,
            fertilizerTo: 5,
            fertilizerTotalPages: 1,
            fertilizerError: 'Submission incomplete: Fertilizer information for 4 months are missing from the farmer\'s entry.', // Dynamic error for fertilizer

            // Harvesting data
            harvestingData: [
                { startDate: '05-MAR-2024', endDate: '05-MAR-2022', area: '4 acres', totalYield: '1800 kg', cropType: 'Onion' },
                { startDate: '16-MAR-2023', endDate: '05-MAR-2022', area: '4 acres', totalYield: '1800 kg', cropType: 'Onion' },
                { startDate: '22-MAR-2022', endDate: '05-MAR-2022', area: '4 acres', totalYield: '1800 kg', cropType: 'Onion' },
                { startDate: '12-MAY-2021', endDate: '05-MAR-2022', area: '4 acres', totalYield: '1800 kg', cropType: 'Onion' },
                { startDate: '02-JAN-2020', endDate: '05-MAR-2022', area: '4 acres', totalYield: '1800 kg', cropType: 'Onion' },
            ],
            harvestingHeaders: [
                { text: 'Start Date', value: 'startDate', sortable: true },
                { text: 'End Date', value: 'endDate', sortable: true },
                { text: 'Area', value: 'area', sortable: true },
                { text: 'Total Yield', value: 'totalYield', sortable: true },
                { text: 'Crop Type', value: 'cropType', sortable: true },
            ],
            harvestingSearch: '',
            filteredHarvesting: [],
            harvestingPage: 1,
            harvestingLimit: 5,
            harvestingFrom: 1,
            harvestingTo: 5,
            harvestingTotalPages: 1,
            harvestingError: null, // Dynamic error for harvesting

            // Livestock data
            livestockData: [
                { animalType: 'Cattle Cow, Buffalo', farm: 'California main farm', gender: 'Male', animalCount: '22', dateOfEntry: '05-MAR-2022' },
                { animalType: 'Goats', farm: 'Oakland Goats Farm', gender: 'Female', animalCount: '14', dateOfEntry: '05-MAR-2022' },
                { animalType: 'Pigs', farm: 'Oakland Pigs Farm', gender: 'Male', animalCount: '05', dateOfEntry: '05-MAR-2022' },
                { animalType: 'Chicken', farm: 'Oakland Chicken Farm', gender: 'Female', animalCount: '11', dateOfEntry: '05-MAR-2022' },
                { animalType: 'Camel', farm: 'Oakland Camel Farm', gender: 'Male', animalCount: '09', dateOfEntry: '05-MAR-2022' },
            ],
            livestockHeaders: [
                { text: 'Animal Type', value: 'animalType', sortable: true },
                { text: 'Farm', value: 'farm', sortable: true },
                { text: 'Gender', value: 'gender', sortable: true },
                { text: 'Animal Count', value: 'animalCount', sortable: true },
                { text: 'Date of Entry', value: 'dateOfEntry', sortable: true },
            ],
            livestockSearch: '',
            filteredLivestock: [],
            livestockPage: 1,
            livestockLimit: 5,
            livestockFrom: 1,
            livestockTo: 5,
            livestockTotalPages: 1,
            livestockError: null, // Dynamic error for livestock

            // Equipment data
            equipmentData: [
                { equipment: 'Toyota DMAX Pickup KDA-551W', loanStatus: 'No loan', category: 'Vehicle', modeOfOperation: 'Fuel Based', dateOfEntry: '05-MAR-2022' },
                { equipment: 'Hoe Set', loanStatus: 'Cleared', category: 'Vehicle', modeOfOperation: 'Fuel Based', dateOfEntry: '05-MAR-2022' },
                { equipment: 'Combine Harvester', loanStatus: 'Uncleared', category: 'Vehicle', modeOfOperation: 'Fuel Based', dateOfEntry: '05-MAR-2022' },
                { equipment: 'Panga Set', loanStatus: 'Uncleared', category: 'Vehicle', modeOfOperation: 'Fuel Based', dateOfEntry: '05-MAR-2022' },
                { equipment: 'Tractor KMTA-555D', loanStatus: 'Cleared', category: 'Vehicle', modeOfOperation: 'Fuel Based', dateOfEntry: '05-MAR-2022' },
            ],
            equipmentHeaders: [
                { text: 'Equipment', value: 'equipment', sortable: true },
                { text: 'Loan Status', value: 'loanStatus', sortable: true },
                { text: 'Category', value: 'category', sortable: true },
                { text: 'Mode of Operation', value: 'modeOfOperation', sortable: true },
                { text: 'Date of Entry', value: 'dateOfEntry', sortable: true },
            ],
            equipmentSearch: '',
            filteredEquipment: [],
            equipmentPage: 1,
            equipmentLimit: 5,
            equipmentFrom: 1,
            equipmentTo: 5,
            equipmentTotalPages: 1,
            equipmentError: null, // Dynamic error for equipment
        };
    },
    mounted() {
        this.updateCropPagination();
        this.updateSowingPagination();
        this.updateSeedlingPagination();
        this.updateFertilizerPagination();
        this.updateHarvestingPagination();
        this.updateLivestockPagination();
        this.updateEquipmentPagination();

        // Update farm name from route params if available
        if (this.$route.params.farmName) {
            this.farmName = this.$route.params.farmName;
            this.updateBreadcrumbs();
        }
    },
    methods: {
        updateBreadcrumbs() {
            this.breadcrumbs = [
                {
                    text: this.$t("carbonCredit.dashboard"),
                    disabled: false,
                    href: "/dashboard",
                    exact: true,
                },
                {
                    text: this.$t("carbonCredit.title"),
                    disabled: false,
                    href: "/carbon-credit/projects",
                },
                {
                    text: this.$t("carbonCredit.projects"),
                    disabled: false,
                    href: "/carbon-credit/projects",
                },
                {
                    text: this.$t("carbonCredit.user.projectRequests"),
                    disabled: false,
                    href: "/carbon-credit/users",
                },
                {
                    text: this.farmName,
                    disabled: true,
                    href: "",
                },
            ];
        },
        // Crop methods
        filterCrops() {
            this.cropPage = 1;
            this.updateCropPagination();
        },
        changeCropPage(next) {
            this.cropPage += next ? 1 : -1;
            this.updateCropPagination();
        },
        updateCropPagination() {
            const filtered = this.cropSearch
                ? this.crops.filter(crop =>
                    crop.cropType?.toLowerCase().includes(this.cropSearch.toLowerCase()) ||
                    crop.farm?.toLowerCase().includes(this.cropSearch.toLowerCase()) ||
                    crop.cropVariety?.toLowerCase().includes(this.cropSearch.toLowerCase()) ||
                    crop.season?.toLowerCase().includes(this.cropSearch.toLowerCase())
                )
                : [...this.crops];

            this.cropTotalPages = Math.ceil(filtered.length / this.cropLimit);
            const start = (this.cropPage - 1) * this.cropLimit;
            const end = this.cropPage * this.cropLimit;

            this.filteredCrops = filtered.slice(start, end);
            this.cropFrom = filtered.length ? start + 1 : 0;
            this.cropTo = Math.min(end, filtered.length);
        },

        // Sowing methods
        filterSowing() {
            this.sowingPage = 1;
            this.updateSowingPagination();
        },
        changeSowingPage(next) {
            this.sowingPage += next ? 1 : -1;
            this.updateSowingPagination();
        },
        updateSowingPagination() {
            const filtered = this.sowingSearch
                ? this.sowingData.filter(sowing =>
                    sowing.cropType?.toLowerCase().includes(this.sowingSearch.toLowerCase()) ||
                    sowing.startDate?.toLowerCase().includes(this.sowingSearch.toLowerCase()) ||
                    sowing.endDate?.toLowerCase().includes(this.sowingSearch.toLowerCase())
                )
                : [...this.sowingData];

            this.sowingTotalPages = Math.ceil(filtered.length / this.sowingLimit);
            const start = (this.sowingPage - 1) * this.sowingLimit;
            const end = this.sowingPage * this.sowingLimit;

            this.filteredSowing = filtered.slice(start, end);
            this.sowingFrom = filtered.length ? start + 1 : 0;
            this.sowingTo = Math.min(end, filtered.length);
        },

        // Seedling methods
        filterSeedling() {
            this.seedlingPage = 1;
            this.updateSeedlingPagination();
        },
        changeSeedlingPage(next) {
            this.seedlingPage += next ? 1 : -1;
            this.updateSeedlingPagination();
        },
        updateSeedlingPagination() {
            const filtered = this.seedlingSearch
                ? this.seedlingData.filter(seedling =>
                    seedling.seedlingDate?.toLowerCase().includes(this.seedlingSearch.toLowerCase()) ||
                    seedling.originOfSeeds?.toLowerCase().includes(this.seedlingSearch.toLowerCase()) ||
                    seedling.seedProducer?.toLowerCase().includes(this.seedlingSearch.toLowerCase()) ||
                    seedling.noOfSeeds?.toLowerCase().includes(this.seedlingSearch.toLowerCase())
                )
                : [...this.seedlingData];

            this.seedlingTotalPages = Math.ceil(filtered.length / this.seedlingLimit);
            const start = (this.seedlingPage - 1) * this.seedlingLimit;
            const end = this.seedlingPage * this.seedlingLimit;

            this.filteredSeedling = filtered.slice(start, end);
            this.seedlingFrom = filtered.length ? start + 1 : 0;
            this.seedlingTo = Math.min(end, filtered.length);
        },

        // Fertilizer methods
        filterFertilizer() {
            this.fertilizerPage = 1;
            this.updateFertilizerPagination();
        },
        changeFertilizerPage(next) {
            this.fertilizerPage += next ? 1 : -1;
            this.updateFertilizerPagination();
        },
        updateFertilizerPagination() {
            const filtered = this.fertilizerSearch
                ? this.fertilizerData.filter(fertilizer =>
                    fertilizer.fertilizerDate?.toLowerCase().includes(this.fertilizerSearch.toLowerCase()) ||
                    fertilizer.fertilizer?.toLowerCase().includes(this.fertilizerSearch.toLowerCase()) ||
                    fertilizer.cost?.toLowerCase().includes(this.fertilizerSearch.toLowerCase()) ||
                    fertilizer.fertilizerType?.toLowerCase().includes(this.fertilizerSearch.toLowerCase()) ||
                    fertilizer.cropType?.toLowerCase().includes(this.fertilizerSearch.toLowerCase())
                )
                : [...this.fertilizerData];

            this.fertilizerTotalPages = Math.ceil(filtered.length / this.fertilizerLimit);
            const start = (this.fertilizerPage - 1) * this.fertilizerLimit;
            const end = this.fertilizerPage * this.fertilizerLimit;

            this.filteredFertilizer = filtered.slice(start, end);
            this.fertilizerFrom = filtered.length ? start + 1 : 0;
            this.fertilizerTo = Math.min(end, filtered.length);
        },

        // Harvesting methods
        filterHarvesting() {
            this.harvestingPage = 1;
            this.updateHarvestingPagination();
        },
        changeHarvestingPage(next) {
            this.harvestingPage += next ? 1 : -1;
            this.updateHarvestingPagination();
        },
        updateHarvestingPagination() {
            const filtered = this.harvestingSearch
                ? this.harvestingData.filter(harvesting =>
                    harvesting.startDate?.toLowerCase().includes(this.harvestingSearch.toLowerCase()) ||
                    harvesting.endDate?.toLowerCase().includes(this.harvestingSearch.toLowerCase()) ||
                    harvesting.area?.toLowerCase().includes(this.harvestingSearch.toLowerCase()) ||
                    harvesting.totalYield?.toLowerCase().includes(this.harvestingSearch.toLowerCase()) ||
                    harvesting.cropType?.toLowerCase().includes(this.harvestingSearch.toLowerCase())
                )
                : [...this.harvestingData];

            this.harvestingTotalPages = Math.ceil(filtered.length / this.harvestingLimit);
            const start = (this.harvestingPage - 1) * this.harvestingLimit;
            const end = this.harvestingPage * this.harvestingLimit;

            this.filteredHarvesting = filtered.slice(start, end);
            this.harvestingFrom = filtered.length ? start + 1 : 0;
            this.harvestingTo = Math.min(end, filtered.length);
        },

        // Livestock methods
        filterLivestock() {
            this.livestockPage = 1;
            this.updateLivestockPagination();
        },
        changeLivestockPage(next) {
            this.livestockPage += next ? 1 : -1;
            this.updateLivestockPagination();
        },
        updateLivestockPagination() {
            const filtered = this.livestockSearch
                ? this.livestockData.filter(livestock =>
                    livestock.animalType?.toLowerCase().includes(this.livestockSearch.toLowerCase()) ||
                    livestock.farm?.toLowerCase().includes(this.livestockSearch.toLowerCase()) ||
                    livestock.gender?.toLowerCase().includes(this.livestockSearch.toLowerCase()) ||
                    livestock.animalCount?.toLowerCase().includes(this.livestockSearch.toLowerCase()) ||
                    livestock.dateOfEntry?.toLowerCase().includes(this.livestockSearch.toLowerCase())
                )
                : [...this.livestockData];

            this.livestockTotalPages = Math.ceil(filtered.length / this.livestockLimit);
            const start = (this.livestockPage - 1) * this.livestockLimit;
            const end = this.livestockPage * this.livestockLimit;

            this.filteredLivestock = filtered.slice(start, end);
            this.livestockFrom = filtered.length ? start + 1 : 0;
            this.livestockTo = Math.min(end, filtered.length);
        },

        // Equipment methods
        filterEquipment() {
            this.equipmentPage = 1;
            this.updateEquipmentPagination();
        },
        changeEquipmentPage(next) {
            this.equipmentPage += next ? 1 : -1;
            this.updateEquipmentPagination();
        },
        updateEquipmentPagination() {
            const filtered = this.equipmentSearch
                ? this.equipmentData.filter(equipment =>
                    equipment.equipment?.toLowerCase().includes(this.equipmentSearch.toLowerCase()) ||
                    equipment.loanStatus?.toLowerCase().includes(this.equipmentSearch.toLowerCase()) ||
                    equipment.category?.toLowerCase().includes(this.equipmentSearch.toLowerCase()) ||
                    equipment.modeOfOperation?.toLowerCase().includes(this.equipmentSearch.toLowerCase())
                )
                : [...this.equipmentData];

            this.equipmentTotalPages = Math.ceil(filtered.length / this.equipmentLimit);
            const start = (this.equipmentPage - 1) * this.equipmentLimit;
            const end = this.equipmentPage * this.equipmentLimit;

            this.filteredEquipment = filtered.slice(start, end);
            this.equipmentFrom = filtered.length ? start + 1 : 0;
            this.equipmentTo = Math.min(end, filtered.length);
        },

        exportAsPdf() {
            console.log('Export as PDF clicked');
            this.$toast.info('Export as PDF functionality to be implemented');
        },
    },
};
</script>

<style scoped>
.bordered-expansion {
    border: 1px solid #f0c96c;
    border-radius: 6px;
    background-color: #fff5e1;
}

.v-data-table /deep/ th {
    background-color: #117443;
    color: white !important;
}

.v-data-table /deep/ th .v-data-table__sort {
    color: white !important;
}

.v-data-table /deep/ th .v-data-table__sort .v-icon {
    color: white !important;
}

.v-data-table /deep/ th,
.v-data-table /deep/ td {
  width: auto !important;
  text-align: center;
  table-layout: auto;
}

.v-data-table /deep/ table {
  width: 100%;
  table-layout: auto;
}

.v-data-table /deep/ .v-data-table__wrapper {
  width: 100%;
}
</style> 