<template>
    <div>
      <breadcrumb :items="breadcrumbs" />
  
      <v-container fluid>
        <div class="d-flex align-center justify-space-between mt-6 mb-4">
          <h2 class="font-weight-bold mb-6">John Smith</h2>
          <div>
             <v-btn
                outlined
                class="mr-2 mb-2"
                @click="previewProject"
                style="border-color: #00BD73; color: #00BD73; background-color: white;"
            >
                {{ $t('carbonCredit.user.exportAsPdf') }}
            </v-btn>
            <v-btn
                outlined
                class="mr-2 mb-2"
                @click="$router.go(-1)"
                style="border-color: #00BD73; color: #00BD73; background-color: white;"
            >
                {{ $t('carbonCredit.back') }}
            </v-btn>
          </div>
        </div>
  
        <v-card flat class="pa-6">
            <!-- Project Details Expandable Section -->
            <v-expansion-panels flat class="mb-4" v-model="projectDetailsExpanded" multiple>
                <v-expansion-panel>
                    <v-expansion-panel-header class="font-weight-medium bordered-expansion">
                        {{ $t('carbonCredit.user.projectDetails') }}
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-row class="mt-4" align="center">
                            <v-col cols="12" md="3">
                                <div class="view-block">
                                <div class="d-flex align-center">
                                    <label class="view-label">{{ $t('carbonCredit.register.projectTitle') }}</label>
                                    <v-tooltip top color="#00BD73" max-width="300">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon
                                        class="ml-2"
                                        size="20"
                                        style="color: #00BD73; cursor: pointer;"
                                        v-bind="attrs"
                                        v-on="on"
                                        >
                                        mdi-alert-circle
                                        </v-icon>
                                    </template>
                                    <span>{{ $t('carbonCredit.register.projectTitle') }}</span>
                                    </v-tooltip>
                                </div>
                                <div class="view-value">{{ form.project_title }}</div>
                                </div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="view-block">
                                <div class="d-flex align-center">
                                    <label class="view-label">{{ $t('carbonCredit.user.country') }}</label>
                                    <v-tooltip top color="#00BD73" max-width="300">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon
                                        class="ml-2"
                                        size="20"
                                        style="color: #00BD73; cursor: pointer;"
                                        v-bind="attrs"
                                        v-on="on"
                                        >
                                        mdi-alert-circle
                                        </v-icon>
                                    </template>
                                    <span>{{ $t('carbonCredit.user.country') }}</span>
                                    </v-tooltip>
                                </div>
                                <div class="view-value">{{ form.country }}</div>
                                </div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="view-block">
                                <div class="d-flex align-center">
                                    <label class="view-label">{{ $t('carbonCredit.user.dateJoined') }}</label>
                                    <v-tooltip top color="#00BD73" max-width="300">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon
                                        class="ml-2"
                                        size="20"
                                        style="color: #00BD73; cursor: pointer;"
                                        v-bind="attrs"
                                        v-on="on"
                                        >
                                        mdi-alert-circle
                                        </v-icon>
                                    </template>
                                    <span>{{ $t('carbonCredit.user.dateJoined') }}</span>
                                    </v-tooltip>
                                </div>
                                <div class="view-value">{{ form.dateJoined }}</div>
                                </div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="view-block">
                                <div class="d-flex align-center">
                                    <label class="view-label">{{ $t('carbonCredit.user.cropGrowingPractice') }}</label>
                                    <v-tooltip top color="#00BD73" max-width="300">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon
                                        class="ml-2"
                                        size="20"
                                        style="color: #00BD73; cursor: pointer;"
                                        v-bind="attrs"
                                        v-on="on"
                                        >
                                        mdi-alert-circle
                                        </v-icon>
                                    </template>
                                    <span>{{ $t('carbonCredit.user.cropGrowingPractice') }}</span>
                                    </v-tooltip>
                                </div>
                                <div class="view-value">{{ form.cropGrowingPractice }}</div>
                                </div>
                            </v-col>
                        </v-row>
                        
                        <!-- Action Buttons -->
                        <div class="d-flex justify-end mt-6 mb-4">
                            <v-btn
                                outlined
                                class="mr-3"
                                @click="rejectAll"
                                style="border-color: #FF5252; color: #FF5252;"
                            >
                                {{ $t('carbonCredit.user.rejectAll') }}
                            </v-btn>
                            <v-btn
                                outlined
                                @click="acceptAll"
                                style="border-color: #00BD73; color: #00BD73;"
                            >
                                {{ $t('carbonCredit.user.acceptAll') }}
                            </v-btn>
                        </div>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>

            <!-- Farms Expandable Section -->
            <v-expansion-panels flat class="mb-4">
                <v-expansion-panel v-for="(farm, index) in userFarms" :key="index" class="mb-4">
                    <v-expansion-panel-header class="font-weight-medium bordered-expansion">
                        {{ $t('carbonCredit.user.farm') }}: {{ farm.name }}
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-row class="mt-4" align="center">
                            <v-col cols="12" md="3">
                                <div class="view-block">
                                    <div class="d-flex align-center">
                                        <label class="view-label">{{ $t('carbonCredit.user.dateOfRegistration') }}</label>
                                        <v-tooltip top color="#00BD73" max-width="300">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon
                                                    class="ml-2"
                                                    size="20"
                                                    style="color: #00BD73; cursor: pointer;"
                                                    v-bind="attrs"
                                                    v-on="on"
                                                >
                                                    mdi-alert-circle
                                                </v-icon>
                                            </template>
                                            <span>{{ $t('carbonCredit.user.dateOfRegistration') }}</span>
                                        </v-tooltip>
                                    </div>
                                    <div class="view-value">{{ farm.dateOfRegistration }}</div>
                                </div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="view-block">
                                    <div class="d-flex align-center">
                                        <label class="view-label">{{ $t('carbonCredit.user.farmName') }}</label>
                                        <v-tooltip top color="#00BD73" max-width="300">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon
                                                    class="ml-2"
                                                    size="20"
                                                    style="color: #00BD73; cursor: pointer;"
                                                    v-bind="attrs"
                                                    v-on="on"
                                                >
                                                    mdi-alert-circle
                                                </v-icon>
                                            </template>
                                            <span>{{ $t('carbonCredit.user.farmName') }}</span>
                                        </v-tooltip>
                                    </div>
                                    <div class="view-value">{{ farm.name }}</div>
                                </div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="view-block">
                                    <div class="d-flex align-center">
                                        <label class="view-label">{{ $t('carbonCredit.user.farmRegistrationId') }}</label>
                                        <v-tooltip top color="#00BD73" max-width="300">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon
                                                    class="ml-2"
                                                    size="20"
                                                    style="color: #00BD73; cursor: pointer;"
                                                    v-bind="attrs"
                                                    v-on="on"
                                                >
                                                    mdi-alert-circle
                                                </v-icon>
                                            </template>
                                            <span>{{ $t('carbonCredit.user.farmRegistrationId') }}</span>
                                        </v-tooltip>
                                    </div>
                                    <div class="view-value">{{ farm.farmRegistrationId }}</div>
                                </div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="view-block">
                                    <div class="d-flex align-center">
                                        <label class="view-label">{{ $t('carbonCredit.user.dimitraFarmId') }}</label>
                                        <v-tooltip top color="#00BD73" max-width="300">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon
                                                    class="ml-2"
                                                    size="20"
                                                    style="color: #00BD73; cursor: pointer;"
                                                    v-bind="attrs"
                                                    v-on="on"
                                                >
                                                    mdi-alert-circle
                                                </v-icon>
                                            </template>
                                            <span>{{ $t('carbonCredit.user.dimitraFarmId') }}</span>
                                        </v-tooltip>
                                    </div>
                                    <div class="view-value">{{ farm.dimitraFarmId }}</div>
                                </div>
                            </v-col>
                        </v-row>

                        <v-row class="mt-4" align="center">
                            <v-col cols="12" md="3">
                                <div class="view-block">
                                    <div class="d-flex align-center">
                                        <label class="view-label">{{ $t('carbonCredit.user.notTheFarmer') }}</label>
                                        <v-tooltip top color="#00BD73" max-width="300">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon
                                                    class="ml-2"
                                                    size="20"
                                                    style="color: #00BD73; cursor: pointer;"
                                                    v-bind="attrs"
                                                    v-on="on"
                                                >
                                                    mdi-alert-circle
                                                </v-icon>
                                            </template>
                                            <span>{{ $t('carbonCredit.user.notTheFarmer') }}</span>
                                        </v-tooltip>
                                    </div>
                                    <div class="view-value">{{ farm.notTheFarmer }}</div>
                                </div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="view-block">
                                    <div class="d-flex align-center">
                                        <label class="view-label">{{ $t('carbonCredit.user.farmerFirstName') }}</label>
                                        <v-tooltip top color="#00BD73" max-width="300">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon
                                                    class="ml-2"
                                                    size="20"
                                                    style="color: #00BD73; cursor: pointer;"
                                                    v-bind="attrs"
                                                    v-on="on"
                                                >
                                                    mdi-alert-circle
                                                </v-icon>
                                            </template>
                                            <span>{{ $t('carbonCredit.user.farmerFirstName') }}</span>
                                        </v-tooltip>
                                    </div>
                                    <div class="view-value">{{ farm.farmerFirstName }}</div>
                                </div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="view-block">
                                    <div class="d-flex align-center">
                                        <label class="view-label">{{ $t('carbonCredit.user.farmerMiddleName') }}</label>
                                        <v-tooltip top color="#00BD73" max-width="300">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon
                                                    class="ml-2"
                                                    size="20"
                                                    style="color: #00BD73; cursor: pointer;"
                                                    v-bind="attrs"
                                                    v-on="on"
                                                >
                                                    mdi-alert-circle
                                                </v-icon>
                                            </template>
                                            <span>{{ $t('carbonCredit.user.farmerMiddleName') }}</span>
                                        </v-tooltip>
                                    </div>
                                    <div class="view-value">{{ farm.farmerMiddleName }}</div>
                                </div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="view-block">
                                    <div class="d-flex align-center">
                                        <label class="view-label">{{ $t('carbonCredit.user.farmerLastName') }}</label>
                                        <v-tooltip top color="#00BD73" max-width="300">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon
                                                    class="ml-2"
                                                    size="20"
                                                    style="color: #00BD73; cursor: pointer;"
                                                    v-bind="attrs"
                                                    v-on="on"
                                                >
                                                    mdi-alert-circle
                                                </v-icon>
                                            </template>
                                            <span>{{ $t('carbonCredit.user.farmerLastName') }}</span>
                                        </v-tooltip>
                                    </div>
                                    <div class="view-value">{{ farm.farmerLastName }}</div>
                                </div>
                            </v-col>
                        </v-row>

                        <v-row class="mt-4" align="center">
                            <v-col cols="12" md="3">
                                <div class="view-block">
                                    <div class="d-flex align-center">
                                        <label class="view-label">{{ $t('carbonCredit.user.farmerRegistrationId') }}</label>
                                        <v-tooltip top color="#00BD73" max-width="300">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon
                                                    class="ml-2"
                                                    size="20"
                                                    style="color: #00BD73; cursor: pointer;"
                                                    v-bind="attrs"
                                                    v-on="on"
                                                >
                                                    mdi-alert-circle
                                                </v-icon>
                                            </template>
                                            <span>{{ $t('carbonCredit.user.farmerRegistrationId') }}</span>
                                        </v-tooltip>
                                    </div>
                                    <div class="view-value">{{ farm.farmerRegistrationId }}</div>
                                </div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="view-block">
                                    <div class="d-flex align-center">
                                        <label class="view-label">{{ $t('carbonCredit.user.dimitraFarmerId') }}</label>
                                        <v-tooltip top color="#00BD73" max-width="300">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon
                                                    class="ml-2"
                                                    size="20"
                                                    style="color: #00BD73; cursor: pointer;"
                                                    v-bind="attrs"
                                                    v-on="on"
                                                >
                                                    mdi-alert-circle
                                                </v-icon>
                                            </template>
                                            <span>{{ $t('carbonCredit.user.dimitraFarmerId') }}</span>
                                        </v-tooltip>
                                    </div>
                                    <div class="view-value">{{ farm.dimitraFarmerId }}</div>
                                </div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="view-block">
                                    <div class="d-flex align-center">
                                        <label class="view-label">{{ $t('carbonCredit.user.farmGeofence') }}</label>
                                        <v-tooltip top color="#00BD73" max-width="300">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon
                                                    class="ml-2"
                                                    size="20"
                                                    style="color: #00BD73; cursor: pointer;"
                                                    v-bind="attrs"
                                                    v-on="on"
                                                >
                                                    mdi-alert-circle
                                                </v-icon>
                                            </template>
                                            <span>{{ $t('carbonCredit.user.farmGeofence') }}</span>
                                        </v-tooltip>
                                    </div>
                                    <div class="view-value">
                                        {{ farm.farmGeofence }}
                                        <v-btn
                                            text
                                            small
                                            color="#00BD73"
                                            class="ml-2"
                                            @click="viewGeofence(farm.id)"
                                        >
                                            {{ $t('carbonCredit.user.viewGeofence') }}
                                        </v-btn>
                                    </div>
                                </div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="view-block">
                                    <div class="d-flex align-center">
                                        <label class="view-label">{{ $t('carbonCredit.user.totalFarmSize') }}</label>
                                        <v-tooltip top color="#00BD73" max-width="300">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon
                                                    class="ml-2"
                                                    size="20"
                                                    style="color: #00BD73; cursor: pointer;"
                                                    v-bind="attrs"
                                                    v-on="on"
                                                >
                                                    mdi-alert-circle
                                                </v-icon>
                                            </template>
                                            <span>{{ $t('carbonCredit.user.totalFarmSize') }}</span>
                                        </v-tooltip>
                                    </div>
                                    <div class="view-value">{{ farm.totalFarmSize }}</div>
                                </div>
                            </v-col>
                        </v-row>

                        <v-row class="mt-4" align="center">
                            <v-col cols="12" md="3">
                                <div class="view-block">
                                    <div class="d-flex align-center">
                                        <label class="view-label">{{ $t('carbonCredit.user.mainGoals') }}</label>
                                        <v-tooltip top color="#00BD73" max-width="300">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon
                                                    class="ml-2"
                                                    size="20"
                                                    style="color: #00BD73; cursor: pointer;"
                                                    v-bind="attrs"
                                                    v-on="on"
                                                >
                                                    mdi-alert-circle
                                                </v-icon>
                                            </template>
                                            <span>{{ $t('carbonCredit.user.mainGoals') }}</span>
                                        </v-tooltip>
                                    </div>
                                    <div class="view-value">{{ farm.mainGoals }}</div>
                                </div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="view-block">
                                    <div class="d-flex align-center">
                                        <label class="view-label">{{ $t('carbonCredit.user.ownershipType') }}</label>
                                        <v-tooltip top color="#00BD73" max-width="300">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon
                                                    class="ml-2"
                                                    size="20"
                                                    style="color: #00BD73; cursor: pointer;"
                                                    v-bind="attrs"
                                                    v-on="on"
                                                >
                                                    mdi-alert-circle
                                                </v-icon>
                                            </template>
                                            <span>{{ $t('carbonCredit.user.ownershipType') }}</span>
                                        </v-tooltip>
                                    </div>
                                    <div class="view-value">{{ farm.ownershipType }}</div>
                                </div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="view-block">
                                    <div class="d-flex align-center">
                                        <label class="view-label">{{ $t('carbonCredit.user.certifications') }}</label>
                                        <v-tooltip top color="#00BD73" max-width="300">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon
                                                    class="ml-2"
                                                    size="20"
                                                    style="color: #00BD73; cursor: pointer;"
                                                    v-bind="attrs"
                                                    v-on="on"
                                                >
                                                    mdi-alert-circle
                                                </v-icon>
                                            </template>
                                            <span>{{ $t('carbonCredit.user.certifications') }}</span>
                                        </v-tooltip>
                                    </div>
                                    <div class="view-value">{{ farm.certifications }}</div>
                                </div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="view-block">
                                    <div class="d-flex align-center">
                                        <label class="view-label">{{ $t('carbonCredit.user.productionType') }}</label>
                                        <v-tooltip top color="#00BD73" max-width="300">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon
                                                    class="ml-2"
                                                    size="20"
                                                    style="color: #00BD73; cursor: pointer;"
                                                    v-bind="attrs"
                                                    v-on="on"
                                                >
                                                    mdi-alert-circle
                                                </v-icon>
                                            </template>
                                            <span>{{ $t('carbonCredit.user.productionType') }}</span>
                                        </v-tooltip>
                                    </div>
                                    <div class="view-value">{{ farm.productionType }}</div>
                                </div>
                            </v-col>
                        </v-row>

                        <v-row class="mt-4" align="center">
                            <v-col cols="12" md="3">
                                <div class="view-block">
                                    <div class="d-flex align-center">
                                        <label class="view-label">{{ $t('carbonCredit.user.landTitle') }}</label>
                                        <v-tooltip top color="#00BD73" max-width="300">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon
                                                    class="ml-2"
                                                    size="20"
                                                    style="color: #00BD73; cursor: pointer;"
                                                    v-bind="attrs"
                                                    v-on="on"
                                                >
                                                    mdi-alert-circle
                                                </v-icon>
                                            </template>
                                            <span>{{ $t('carbonCredit.user.landTitle') }}</span>
                                        </v-tooltip>
                                    </div>
                                    <div class="view-value">
                                        {{ farm.landTitle }}
                                        <v-btn
                                            text
                                            small
                                            color="#00BD73"
                                            class="ml-2"
                                            @click="viewLandTitle(farm.id)"
                                        >
                                            {{ $t('carbonCredit.user.view') }}
                                        </v-btn>
                                    </div>
                                </div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="view-block">
                                    <div class="d-flex align-center">
                                        <label class="view-label">{{ $t('carbonCredit.user.farmLocationAddress') }}</label>
                                        <v-tooltip top color="#00BD73" max-width="300">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon
                                                    class="ml-2"
                                                    size="20"
                                                    style="color: #00BD73; cursor: pointer;"
                                                    v-bind="attrs"
                                                    v-on="on"
                                                >
                                                    mdi-alert-circle
                                                </v-icon>
                                            </template>
                                            <span>{{ $t('carbonCredit.user.farmLocationAddress') }}</span>
                                        </v-tooltip>
                                    </div>
                                    <div class="view-value">{{ farm.farmLocationAddress }}</div>
                                </div>
                            </v-col>

                            <v-col cols="12" md="3">
                                <div class="view-block">
                                    <div class="d-flex align-center">
                                        <label class="view-label">{{ $t('carbonCredit.user.farmCoordinate') }}</label>
                                        <v-tooltip top color="#00BD73" max-width="300">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon
                                                    class="ml-2"
                                                    size="20"
                                                    style="color: #00BD73; cursor: pointer;"
                                                    v-bind="attrs"
                                                    v-on="on"
                                                >
                                                    mdi-alert-circle
                                                </v-icon>
                                            </template>
                                            <span>{{ $t('carbonCredit.user.farmCoordinate') }}</span>
                                        </v-tooltip>
                                    </div>
                                    <div class="view-value">{{ farm.farmCoordinate }}</div>
                                </div>
                            </v-col>
                        </v-row>

                        <!-- Farmer Agreement and Acceptance Status Sections -->
                        <v-row class="mt-6">
                            <v-col cols="12" md="4">
                                <div class="d-flex align-center mb-2">
                                    <label class="view-value bold-title">{{ $t('carbonCredit.user.farmActivitySubmissions') }}</label>
                                    <v-tooltip top color="#00BD73" max-width="300">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon
                                                class="ml-2"
                                                size="20"
                                                style="color: #00BD73; cursor: pointer;"
                                                v-bind="attrs"
                                                v-on="on"
                                            >
                                                mdi-alert-circle
                                            </v-icon>
                                        </template>
                                        <span>{{ $t('carbonCredit.user.farmActivitySubmissions') }}</span>
                                    </v-tooltip>
                                </div>
                                <div class="view-value mb-3 normal-text description-height">{{ $t('carbonCredit.user.farmActivitySubmissionsDesc') }}</div>
                                <div class="button-container">
                                    <v-btn
                                        color="#00BD73"
                                        class="white--text font-weight-bold"
                                        @click="viewFarmData(farm.id)"
                                        style="text-transform: uppercase;"
                                    >
                                        {{ $t('carbonCredit.user.viewFarmData') }}
                                    </v-btn>
                                </div>
                            </v-col>

                            <v-col cols="12" md="4">
                                <div class="d-flex align-center mb-2">
                                    <label class="view-value bold-title">{{ $t('carbonCredit.user.farmerAgreement') }}</label>
                                    <v-tooltip top color="#00BD73" max-width="300">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon
                                                class="ml-2"
                                                size="20"
                                                style="color: #00BD73; cursor: pointer;"
                                                v-bind="attrs"
                                                v-on="on"
                                            >
                                                mdi-alert-circle
                                            </v-icon>
                                        </template>
                                        <span>{{ $t('carbonCredit.user.farmerAgreement') }}</span>
                                    </v-tooltip>
                                </div>
                                <div class="view-value mb-3 normal-text description-height">{{ $t('carbonCredit.user.viewSignedAgreement') }}</div>
                                <div class="button-container">
                                    <v-btn
                                        color="#00BD73"
                                        class="white--text font-weight-bold"
                                        @click="viewAgreement(farm.id)"
                                        style="text-transform: uppercase;"
                                    >
                                        <v-icon left class="white--text">mdi-file-document-outline</v-icon>
                                        {{ $t('carbonCredit.user.viewAgreement') }}
                                    </v-btn>
                                </div>
                            </v-col>

                            <v-col cols="12" md="4">
                                <div class="d-flex align-center mb-2">
                                    <label class="view-value bold-title">{{ $t('carbonCredit.user.acceptanceStatus') }}</label>
                                    <v-tooltip top color="#00BD73" max-width="300">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon
                                                class="ml-2"
                                                size="20"
                                                style="color: #00BD73; cursor: pointer;"
                                                v-bind="attrs"
                                                v-on="on"
                                            >
                                                mdi-alert-circle
                                            </v-icon>
                                        </template>
                                        <span>{{ $t('carbonCredit.user.acceptanceStatus') }}</span>
                                    </v-tooltip>
                                </div>
                                <div class="view-value mb-3 normal-text description-height">{{ $t('carbonCredit.user.currentStatus') }}: {{ farm.status }}</div>
                                <div class="button-container">
                                    <div class="d-flex">
                                        <v-btn
                                            :outlined="farm.status === 'Accepted' || farm.status === 'Pending'"
                                            :color="farm.status === 'Rejected' ? '#FF5252' : '#FF5252'"
                                            :class="[
                                                farm.status === 'Rejected' ? 'white--text font-weight-bold' : 'font-weight-bold',
                                                'mr-3'
                                            ]"
                                            @click="rejectFarm(farm.id)"
                                            style="text-transform: uppercase;"
                                        >
                                            <v-icon 
                                                v-if="farm.status === 'Rejected'" 
                                                left 
                                                class="white--text"
                                            >
                                                mdi-check
                                            </v-icon>
                                            {{ farm.status === 'Rejected' ? 'REJECTED' : 'REJECT' }}
                                        </v-btn>
                                        <v-btn
                                            :outlined="farm.status === 'Rejected' || farm.status === 'Pending'"
                                            :color="farm.status === 'Accepted' ? '#00BD73' : '#00BD73'"
                                            :class="[
                                                farm.status === 'Accepted' ? 'white--text font-weight-bold' : 'font-weight-bold'
                                            ]"
                                            @click="acceptFarm(farm.id)"
                                            style="text-transform: uppercase;"
                                        >
                                            <v-icon 
                                                v-if="farm.status === 'Accepted'" 
                                                left 
                                                class="white--text"
                                            >
                                                mdi-check
                                            </v-icon>
                                            {{ farm.status === 'Accepted' ? 'ACCEPTED' : 'ACCEPT' }}
                                        </v-btn>
                                    </div>
                                </div>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>

            <!-- Remove the separate sections -->
        </v-card>
      </v-container>
      
      <!-- Confirmation Dialog -->
      <ConfirmationBox
        :dialog="showConfirmDialog"
        :actionType="confirmActionType === 'rejectAll' ? 'reject' : 'accept'"
        :message="confirmMessage"
        @close="showConfirmDialog = false"
        @confirm="handleConfirmAction"
      />
    </div>
  </template>
  
  <script>
  import loadingMixin from '@/mixins/LoadingMixin';
  import CarbonCreditService from '../../../_services/CarbonCreditService';
  import ConfirmationBox from './components/ConfirmationBox.vue';
  
  export default {
    mixins: [loadingMixin],
    components: {
      ConfirmationBox
    },
    data() {
      return {
        projectId: null,
        showConfirmDialog: false,
        confirmActionType: '',
        confirmMessage: '',
        isInitialLoad: true, // Track if this is the initial load
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
          disabled: true,
          href: "breadcrumbs_link_2",
          exact: true,
        },
      ],
        form: {
          project_title: 'Carbon Sequestration Project - Agroforestry Initiative',
          project_type: '',
          description: '',
          status: '',
          creditType: '',
          creditStart: '',
          creditEnd: '',
          standard: '',
          country: 'Kenya',
          dateJoined: '2024-01-15',
          cropGrowingPractice: 'Agroforestry with Coffee & Shade Trees',
          validationDocumentation: [],
          agreement: [
            {
              file_name: 'Attachment1.pdf',
              s3_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
              file_type: 'application/pdf',
            },
          ],
          headerImage: '',
        },
        orgSearch: '',
        organizations: [],
        filteredOrganizations: [],
        orgTableHeaders: [
          { text: 'Organizations Name', value: 'name' },
          { text: 'Organizations Address', value: 'address' },
          { text: 'Country', value: 'country' },
          { text: 'Website', value: 'website' },
        ],
        orgPage: 1,
        limit: 5,
        orgFrom: 1,
        orgTo: 5,
        orgTotalPages: 1,
        sdgs: [],
        selectedSdgs: [],
        currencies: ['USD', 'EUR', 'AUD'],
        vintageHeaders: [
          { text: 'Vintage Year', value: 'year' },
          { text: 'Estimated Credits', value: 'credits' },
          { text: 'Price Per Credit', value: 'price' }
        ],
        dataCycleHeaders: [
          { text: 'Module', value: 'name' },
          { text: 'Recurring', value: 'recurring' },
          { text: 'Score', value: 'score' },
          { text: 'Approval', value: 'approval' }
        ],
        dataCollectionModules: [],
        selectedMedia: null,
        allFilesForModal: [],
        office: null,
        userFarms: [
            {
                id: 1,
                name: 'Golden Coffee Farm',
                status: 'Accepted',
                dateOfRegistration: '05-MAR-2022',
                farmRegistrationId: '1226',
                dimitraFarmId: 'FR-128456',
                notTheFarmer: 'Yes',
                farmerFirstName: 'John',
                farmerMiddleName: 'Doe',
                farmerLastName: 'Stailen',
                farmerRegistrationId: '12345',
                dimitraFarmerId: '12345',
                farmGeofence: 'Mapped',
                totalFarmSize: '0.317 Acre',
                mainGoals: 'Optimize cost',
                ownershipType: 'Personal',
                certifications: 'Bird Friendly Certification',
                productionType: 'Organic',
                landTitle: 'Land Title-Document.PDF',
                farmLocationAddress: '2972 Westheimer Rd. Santa Ana, Illinois 85486',
                farmCoordinate: '(31.5446277/74.464285815)',
                crops: [
                    { cropType: 'Coffee', area: 50, areaUnit: 'ha', plantingDate: '2022-01-01', expectedHarvest: '2023-12-31' },
                    { cropType: 'Shade Trees', area: 20, areaUnit: 'ha', plantingDate: '2022-05-01', expectedHarvest: '2023-04-30' },
                ]
            },
            {
                id: 2,
                name: 'John Doe Farm',
                status: 'Rejected',
                dateOfRegistration: '15-JAN-2022',
                farmRegistrationId: '1225',
                dimitraFarmId: 'FR-128455',
                notTheFarmer: 'No',
                farmerFirstName: 'John',
                farmerMiddleName: 'Doe',
                farmerLastName: 'Smith',
                farmerRegistrationId: '12344',
                dimitraFarmerId: '12344',
                farmGeofence: 'Mapped',
                totalFarmSize: '0.5 Acre',
                mainGoals: 'Carbon Sequestration',
                ownershipType: 'Personal',
                certifications: 'Organic Certification',
                productionType: 'Organic',
                landTitle: 'Land Title-Document.PDF',
                farmLocationAddress: '123 Main St. Nairobi, Kenya',
                farmCoordinate: '(-1.2921/36.8219)',
                crops: [
                    { cropType: 'Maize', area: 100, areaUnit: 'ha', plantingDate: '2022-03-01', expectedHarvest: '2022-09-30' },
                    { cropType: 'Cassava', area: 50, areaUnit: 'ha', plantingDate: '2022-06-01', expectedHarvest: '2022-12-31' },
                ]
            },
            {
                id: 3,
                name: 'Green Valley Farm',
                status: 'Pending',
                dateOfRegistration: '20-FEB-2022',
                farmRegistrationId: '1227',
                dimitraFarmId: 'FR-128457',
                notTheFarmer: 'No',
                farmerFirstName: 'Sarah',
                farmerMiddleName: 'Jane',
                farmerLastName: 'Wilson',
                farmerRegistrationId: '12346',
                dimitraFarmerId: '12346',
                farmGeofence: 'Mapped',
                totalFarmSize: '0.75 Acre',
                mainGoals: 'Sustainable Agriculture',
                ownershipType: 'Family',
                certifications: 'Fairtrade, Rainforest Alliance',
                productionType: 'Mixed Farming',
                landTitle: 'Land Title-Document.PDF',
                farmLocationAddress: '456 Oak Street, Mombasa, Kenya',
                farmCoordinate: '(-4.0485/39.6924)',
                crops: [
                    { cropType: 'Tea', area: 30, areaUnit: 'ha', plantingDate: '2022-04-01', expectedHarvest: '2023-03-31' },
                    { cropType: 'Bananas', area: 25, areaUnit: 'ha', plantingDate: '2022-07-01', expectedHarvest: '2023-01-31' },
                ]
            },
        ],
        cropHeaders: [
            { text: 'Crop Type', value: 'cropType' },
            { text: 'Area', value: 'area' },
            { text: 'Planting Date', value: 'plantingDate' },
            { text: 'Expected Harvest', value: 'expectedHarvest' },
        ],
        projectDetailsExpanded: [0], // Always expanded
      };
    },
    computed: {
      filteredSdgs() {
        return this.sdgs.filter(sdg => this.selectedSdgs.includes(sdg.id));
      },
   
    },
    watch: {
      projectDetailsExpanded: {
        handler() {
          // Only enforce expansion on initial load
          if (this.isInitialLoad) {
            this.$nextTick(() => {
              this.projectDetailsExpanded = [0];
            });
            this.isInitialLoad = false; // Set to false after initial load
          }
        },
        immediate: true
      }
    },
    async mounted() {
      this.projectId = this.$route.params.id;
      // Ensure project details is always expanded on initial load
      this.projectDetailsExpanded = [0];
      
      if (this.projectId) {
        try {
          this.startLoading();
          const res = await CarbonCreditService.getCarbonCreditProjectById(this.projectId);
          if (res.success && res.data) {
            const d = res.data;
            this.form.project_title = d.project_title;
            this.form.project_type = d.project_type;
            this.form.description = d.description;
            this.form.status = d.status;
            this.form.creditType = d.credit_type;
            this.form.creditStart = d.credit_start_date?.split('T')[0];
            this.form.creditEnd = d.credit_end_date?.split('T')[0];
            this.form.standard = d.standard_methodology;
            this.form.country = d.country || '';
            this.form.dateJoined = d.date_joined ? d.date_joined.split('T')[0] : '';
            this.form.cropGrowingPractice = d.crop_growing_practice || '';
            // Validation documentation (can be string or array)
            if (Array.isArray(d.validation_documentation)) {
              this.form.validationDocumentation = d.validation_documentation;
            } else if (typeof d.validation_documentation === 'string' && d.validation_documentation) {
              this.form.validationDocumentation = [{
                file_name: d.validation_documentation.split('/').pop(),
                s3_url: d.validation_documentation,
                file_type: d.validation_documentation.split('.').pop()
              }];
            } else {
              this.form.validationDocumentation = [];
            }
            // Agreement (can be string or array)
            if (Array.isArray(d.agreement)) {
              this.form.agreement = d.agreement;
            } else if (typeof d.agreement === 'string' && d.agreement) {
              this.form.agreement = [{
                file_name: d.agreement.split('/').pop(),
                s3_url: d.agreement,
                file_type: d.agreement.split('.').pop()
              }];
            } else {
              this.form.agreement = [];
            }
            // Organizations
            this.organizations = (d.organizations || []).map(org => ({
              ...org,
              address: org.address || '',
              website: org.website || '',
              subOrganizations: (org.subOrganizations || []).map(sub => ({
                ...sub,
                address: sub.address || '',
                website: sub.website || ''
              }))
            }));
            // Vintages
            this.form.vintageRows = (d.vintages || []).map(v => ({
              year: v.vintage_year,
              credits: v.number_of_credits_estimated,
              price: v.price_per_credit
            }));
            this.form.currency = d.vintage_currency;
            // Attachments
            this.form.attachmentFile = d.attachments || [];
            // SDGs (array of objects with id, icon, title, description)
            this.selectedSdgs = (d.sdgs || []).map(s => s.id);
            this.sdgs = (d.sdgs || []).map(s => ({
              id: s.id,
              icon: s.icon,
              title: typeof s.title === 'object' ? s.title.msg : s.title,
              description: typeof s.description === 'object' ? s.description.msg : s.description
            }));
            // Data Collection Modules
            this.dataCollectionModules = (d.modules || []).map(m => ({
              name: m.module_name.charAt(0).toUpperCase() + m.module_name.slice(1),
              enabled: true,
              frequency: m.recurring_time,
              unit: m.recurring_period === 'M' ? 'Month(s)' : 'Year(s)',
              score: m.score,
              approval: `${m.approval}%`
            }));
            // Header image (if available)
            this.form.headerImage = d.header_image || '';
            // Responsible Dimitra Office
            this.office = d.office || null;
            // Pagination for organizations
            this.updatePagination();
          }
        } catch (err) {
          console.error('Failed to load project:', err);
        } finally {
          this.stopLoading();
        }
      }
      
      // Set initial load to false after ensuring expansion
      this.$nextTick(() => {
        this.isInitialLoad = false;
      });
    },
    methods: {
      filterOrganizations() {
        this.orgPage = 1;
        this.updatePagination();
      },
      changeOrgPage(next) {
        this.orgPage += next ? 1 : -1;
        this.updatePagination();
      },
      getFileIcon(fileType) {
        if (fileType.startsWith('video')) return 'mdi-play-circle';
        if (fileType.startsWith('audio')) return 'mdi-music';
        return 'mdi-file-document';
      },
    
      updatePagination() {
        const filtered = this.orgSearch
          ? this.organizations.filter(org =>
              org.name?.toLowerCase().includes(this.orgSearch.toLowerCase()) ||
              org.address?.toLowerCase().includes(this.orgSearch.toLowerCase()) ||
              org.country?.toLowerCase().includes(this.orgSearch.toLowerCase()) ||
              org.website?.toLowerCase().includes(this.orgSearch.toLowerCase())
            )
          : [...this.organizations];
  
        this.orgTotalPages = Math.ceil(filtered.length / this.limit);
        const start = (this.orgPage - 1) * this.limit;
        const end = this.orgPage * this.limit;
  
        this.filteredOrganizations = filtered.slice(start, end);
        this.orgFrom = filtered.length ? start + 1 : 0;
        this.orgTo = Math.min(end, filtered.length);
      },
      previewProject() {
        this.$store.dispatch('project/setCurrentProject', {
          ...this.form,
          office: this.office,
          organizations: this.organizations,
          sdgs: this.sdgs,
          selectedSdgs: this.selectedSdgs,
          dataCollectionModules: this.dataCollectionModules,
          vintageRows: this.form.vintageRows,
          projectId: this.projectId
        });
        this.$router.push({
          path: `/carbon-credit/projects/preview/${this.projectId}`
        });
      },
      rejectAll() {
        this.showConfirmDialog = true;
        this.confirmActionType = 'rejectAll';
        this.confirmMessage = this.$t('carbonCredit.user.confirmRejectAll');
      },
      acceptAll() {
        this.showConfirmDialog = true;
        this.confirmActionType = 'acceptAll';
        this.confirmMessage = this.$t('carbonCredit.user.confirmAcceptAll');
      },
      handleConfirmAction() {
        this.showConfirmDialog = false;
        if (this.confirmActionType === 'rejectAll') {
          // TODO: Implement reject all functionality
          console.log('Reject all confirmed');
          this.$toast.error('Reject all functionality to be implemented');
        } else if (this.confirmActionType === 'acceptAll') {
          // TODO: Implement accept all functionality
          console.log('Accept all confirmed');
          this.$toast.success('Accept all functionality to be implemented');
        }
      },
      rejectFarm(farmId) {
        console.log('Reject farm clicked:', farmId);
        this.$toast.error('Reject farm functionality to be implemented');
      },
      acceptFarm(farmId) {
        console.log('Accept farm clicked:', farmId);
        this.$toast.success('Accept farm functionality to be implemented');
      },
      viewGeofence(farmId) {
        console.log('View Geofence clicked for farm:', farmId);
        this.$toast.info('View Geofence functionality to be implemented');
      },
      viewLandTitle(farmId) {
        console.log('View Land Title clicked for farm:', farmId);
        this.$toast.info('View Land Title functionality to be implemented');
      },
      viewAgreement(farmId) {
        console.log('View Agreement clicked for farm:', farmId);
        this.$toast.info('View Agreement functionality to be implemented');
      },
      viewFarmData(farmId) {
        console.log('View Farm Data clicked for farm:', farmId);
        const farm = this.userFarms.find(f => f.id === farmId);
        this.$router.push({
          name: 'FarmSubmission',
          params: { 
            farmId: farmId,
            farmName: farm?.name || 'Farm'
          }
        });
      }
    },
  };
  </script>
  
  
  <style scoped>
  .view-block {
    background-color: #E5F8F1;
    padding: 1rem;
    border-radius: 6px;
    margin-bottom: 1rem;
  }
  .view-label {
    font-size: 16px;
    color: #555;
    margin-bottom: 4px;
    display: block;
    font-weight: 300;
  }
  .view-value {
    font-weight: bold;
    font-size: 1rem;
    color: #333;
  }
  .multi-line {
    white-space: pre-wrap;
  }
  .bordered-expansion {
    border: 1px solid #f0c96c;
    border-radius: 6px;
    background-color: #fff5e1;
  }
  .v-data-table {
    /* Remove background and border for organization details table */
    background-color: transparent;
    border-radius: 0;
    border: none;
  }

  .v-data-table /deep/ th {
    background-color: #00BD73;
    color: white !important;
  }
  .pdf-box {
    height: 90px;
    width: 90px;
    background-color: #e5f8f1;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    border-radius: 4px;
  }
  .file-extension {
    font-size: 16px;
    color: #135b00;
    margin: 0;
    line-height: 1;
    font-weight: 600;
  }
  .file-name {
    display: block;
    font-size: 16px;
    color: #333;
    margin-top: 5px;
    text-align: center;
    word-break: break-all;
    font-weight: 600;
  }
  .docs-box {
    display: flex;
    justify-content: center;
  }
  .docs-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .img-item {
    display: flex;
    flex-direction: column;
    align-items: left;
  }
  .dimitra-office-block {
    background-color: #E5F8F1;
    border-radius: 8px;
    padding: 24px 20px 16px 20px;
    margin-bottom: 18px;
    min-height: 120px;
    min-width: 220px;
    box-sizing: border-box;
  }
  .dimitra-office-label {
    font-size: 16px;
    color: #757575;
    font-weight: 400;
    margin-bottom: 2px;
    margin-right: 4px;
  }
  .dimitra-office-value {
    font-size: 16px;
    color: #222;
    font-weight: 600;
    margin-bottom: 0;
    margin-top: 4px;
    word-break: break-word;
  }
  .normal-text {
    font-weight: normal !important;
  }
  .bold-title {
    font-weight: bold !important;
  }
  .description-height {
    min-height: 40px; /* Adjust as needed for consistent height */
  }
  .button-container {
    display: flex;
    justify-content: flex-start; /* Align buttons to the start */
  }
  </style>