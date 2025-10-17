<!-- BlendForm.vue -->
<template>
    <div ref="section" >
        <div v-if="previewMode">
            <!-- preview form  -->
            <Preview :propFormData="formattedFormData" :blendStatus="formData.blendStatus"
                :blendProductsCreatePreview="formattedBlendProducts" :cotainerIds="containers"
                :selectedDdsIds="selectedDdsIds" @closePreview="previewMode = false" @triggerSubmit="triggerSubmit"
                @triggerSubmitUpdate="triggerSubmitUpdate" :isUpdate="updateForm" />
        </div>
        <div v-else>
            <v-container fluid>
                <div class="d-flex">
                    <h2 class="">{{ $t("blends.imports.blends") }}</h2>
                    <v-spacer></v-spacer>
                    <div class="d-flex mt-1">
                        <!-- discard button with red background only show on create -->
                        <!-- <v-btn color="error" dark class="mr-2 font-weight-bold" @click="redirectListPage">
                            {{ $t('blends.createBlends.discard') }}
                        </v-btn> -->
                        <!-- reject button with red background -->
                        <v-btn color="yellow" dark class="mr-2 font-weight-bold" @click="rejectBlends">
                            {{ $t('blends.createBlends.reject') }}
                        </v-btn>
                        <!-- save and continue later button with white background -->
                        <v-btn color="primary" dark class="mr-2 font-weight-bold" @click="saveAndContinueLater">
                            {{ $t('blends.createBlends.saveAndContinueLater') }}
                        </v-btn>
                        <!-- generate report button with primary background -->
                        <v-btn color="primary" dark class="mr-2 font-weight-bold" @click="previewForm">
                            {{ $t('blends.createBlends.generateReport') }}
                        </v-btn>
                    </div>
                </div>
            </v-container>
            <v-container fluid>
                <v-form ref="createBlendsDds">
                    <v-card elevation="0" class="pa-6">
                        <!-- General Data Section -->
                        <div class="text-h6 mb-4 d-flex align-center">
                            {{ $t('blends.createBlends.generalData') }}
                            <v-tooltip bottom color="00BD73" max-width="500">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon class="icon-with-background primary--text pl-2" style="color:#0EBF67" v-bind="attrs"
                                        v-on="on">
                                        mdi-alert-circle
                                    </v-icon>
                                </template>
                                <span>{{ $t('blends.blendSettings.generalDataTT') }}</span>
                            </v-tooltip>
                        </div>

                        <!-- Blend Selection -->
                        <v-row>
                            <v-col cols="12" sm="4">
                                <div class="d-flex align-center mb-2">
                                    {{ $t('blends.createBlends.blend') }}
                                    <v-tooltip bottom color="00BD73" max-width="500">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon small class="icon-with-background primary--text pl-2" style="color:#0EBF67"
                                                v-bind="attrs" v-on="on">
                                                mdi-alert-circle
                                            </v-icon>
                                        </template>
                                        <span>{{ $t('blends.blendSettings.blendTitleTT') }}</span>
                                    </v-tooltip>
                                </div>
                                <v-autocomplete clearable v-model="selectedBlend" outlined dense :items="blends"
                                    item-text="blendTitle" item-value="id"
                                    :placeholder="$t('blends.createBlends.selectBlend')" density="compact"
                                    :loading="listofBlendLoading" :rules="[requiredRule]" hide-details="auto"
                                    class="blend-select">
                                    <template v-slot:append-item>
                                        <div v-intersect="onIntersect" class="d-flex justify-center pa-2">
                                            <v-progress-circular v-if="hasMoreData" indeterminate
                                                color="primary"></v-progress-circular>
                                        </div>
                                        <div class="add-blend-settings">
                                            <v-divider></v-divider>
                                            <v-list-item @click="addNewBlendDialog = true">
                                                <v-list-item-content style="color:#0EBF67">
                                                    <v-list-item-title>
                                                        <v-icon class="icon-with-background primary--text" style="color:#0EBF67">
                                                            mdi-plus-circle
                                                        </v-icon>
                                                        <span class="ml-5">
                                                            {{ $t('blends.createBlends.addNewBlend') }}
                                                        </span>
                                                    </v-list-item-title>
                                                </v-list-item-content>
                                            </v-list-item>
                                        </div>
                                    </template>
                                </v-autocomplete>
                            </v-col>
                        </v-row>

                        <div class="mt-6">
                            <template v-if="selectedBlend">
                                <v-row>
                                    <v-col cols="12" sm="4">
                                        <div class="field-label">{{ $t('blends.createBlends.blend') }}</div>
                                        <div class="field-value font-weight-bold">{{ formData.blend || 'N/A' }}</div>
                                    </v-col>
                                    <v-col cols="12" sm="4">
                                        <div class="field-label">{{ $t('blends.createBlends.blendCode') }}</div>
                                        <div class="field-value font-weight-bold">{{ formData.blendCode || 'N/A' }}
                                        </div>
                                    </v-col>
                                    <v-col cols="12" sm="4">
                                        <div class="field-label">{{ $t('blends.createBlends.blendDescription') }}</div>
                                        <div class="field-value font-weight-bold">{{ formData.blendDescription || 'N/A'
                                            }}
                                        </div>
                                    </v-col>
                                </v-row>

                                <!-- Final Product Details -->
                                <v-row class="mt-4">
                                    <v-col cols="12" sm="4">
                                        <div class="field-label">{{ $t('blends.createBlends.finalProduct') }}</div>
                                        <div class="field-value font-weight-bold">{{ formData.finalProduct || 'N/A' }}
                                        </div>
                                    </v-col>
                                    <v-col cols="12" sm="4">
                                        <div class="field-label">{{ $t('blends.createBlends.finalProductCode') }}</div>
                                        <div class="field-value font-weight-bold">{{ formData.finalProductCode || 'N/A'
                                            }}
                                        </div>
                                    </v-col>
                                </v-row>
                            </template>


                            <!-- Input Fields -->
                            <v-row class="mt-4">
                                <v-col cols="12" sm="3">
                                    <div class="d-flex justify-space-between mb-1">
                                        <div class="text-subtitle-2 font-weight-light">{{
                                            $t('blends.createBlends.netMass')
                                            }}
                                            <v-tooltip bottom color="00BD73" max-width="300">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-icon small class="icon-with-background primary--text pr-2"
                                                        style="color:#0EBF67" v-bind="attrs" v-on="on">
                                                        mdi-alert-circle
                                                    </v-icon>
                                                </template>
                                                <span>{{ $t('blends.createBlends.netMassTT') }}</span>
                                            </v-tooltip>
                                        </div>
                                        <span class="text-subtitle-2 font-weight-light">{{ eudrSettings.product_mass_unit }}</span>
                                    </div>
                                    <v-text-field v-model="formData.netMass" outlined dense ref="netMassField" :rules="[netMassVolumeRule()]"
                                        type="number" step="0.01" :placeholder="$t('blends.blendSettings.enterHere')"
                                        hide-details="auto" class="input-field">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="3">
                                    <div class="d-flex justify-space-between mb-1">
                                        <div class="text-subtitle-2 font-weight-light">{{
                                            $t('blends.createBlends.volume')
                                            }}
                                            <v-tooltip bottom color="00BD73" max-width="500">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-icon small class="icon-with-background primary--text pr-2"
                                                        style="color:#0EBF67" v-bind="attrs" v-on="on">
                                                        mdi-alert-circle
                                                    </v-icon>
                                                </template>
                                                <span>{{ $t('blends.createBlends.volumeTT') }}</span>
                                            </v-tooltip>
                                        </div>
                                        <span class="text-subtitle-2 font-weight-light">({{ eudrSettings.volume_unit }})</span>
                                    </div>
                                    <v-text-field v-model="formData.volume" 
                                        ref="volumeField"
                                        outlined dense :rules="[netMassVolumeRule()]"
                                        type="number" step="0.01" :placeholder="$t('blends.blendSettings.enterHere')"
                                        hide-details="auto" class="input-field">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="3">
                                    <div class="d-flex justify-space-between mb-1">
                                        <div class="text-subtitle-2 font-weight-light">{{
                                            $t('blends.createBlends.blendLotId')
                                            }}
                                            <v-tooltip bottom color="00BD73" max-width="500">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-icon class="icon-with-background primary--text pr-2" small
                                                        style="color:#0EBF67" v-bind="attrs" v-on="on">
                                                        mdi-alert-circle
                                                    </v-icon>
                                                </template>
                                                <span>{{ $t('blends.createBlends.blendLotIdTT') }}</span>
                                            </v-tooltip>
                                        </div>
                                    </div>
                                    <v-text-field readonly disabled v-model="formData.blendLotId" outlined dense
                                        :placeholder=formData.blendLotId hide-details 
                                        class="input-field disabled-text-field">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="3">
                                    <div class="d-flex justify-space-between mb-1">
                                        <div class="text-subtitle-2 font-weight-light">{{
                                            $t('blends.createBlends.finishedProductLotId') }}
                                            <v-tooltip bottom color="00BD73" max-width="500">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-icon class="icon-with-background primary--text pr-2" small
                                                        style="color:#0EBF67" v-bind="attrs" v-on="on">
                                                        mdi-alert-circle
                                                    </v-icon>
                                                </template>
                                                <span>{{ $t('blends.createBlends.finishedProductLotIdTT') }}</span>
                                            </v-tooltip>
                                        </div>
                                    </div>
                                    <v-text-field v-model="formData.finishedProductLotId" outlined
                                        dense :placeholder="$t('blends.blendSettings.enterHere')" hide-details="auto"
                                        class="input-field">
                                    </v-text-field>
                                </v-col>
                            </v-row>
                        </div>
                    </v-card>


                    <!-- top blend component -->
                    <v-card elevation="0" class="pa-6 my-6">
                        <v-row class="mb-4 ">
                            <v-col cols="12" sm="4">
                                <div class="d-flex justify-space-between mb-1">
                                    <div class="text-subtitle-1">{{
                                        $t('blends.createBlends.internalReferenceNumber')
                                        }}
                                        <v-tooltip bottom color="00BD73" max-width="500">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon small class="icon-with-background primary--text pr-2" style="color:#0EBF67"
                                                    v-bind="attrs" v-on="on">
                                                    mdi-alert-circle
                                                </v-icon>
                                            </template>
                                            <span>{{ $t('blends.createBlends.internalReferenceNumberTT') }}</span>
                                        </v-tooltip>
                                    </div>
                                </div>
                                <v-text-field v-model="formData.internalReferenceNumber" outlined dense
                                    :placeholder="$t('blends.blendSettings.enterHere')" :rules="[requiredRule]"
                                    auto-validate hide-details="auto" class="input-field">
                                </v-text-field>
                            </v-col>

                            <!-- EUDR Reference Number Field -->
                            <v-col cols="12" sm="4">
                                <div class="d-flex justify-space-between mb-1">
                                    <div class="text-subtitle-1">{{
                                        $t('blends.createBlends.eudrReferenceNumber') }}
                                        <v-tooltip bottom color="00BD73" max-width="500">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon class="icon-with-background primary--text pr-2" small style="color:#0EBF67"
                                                    v-bind="attrs" v-on="on">
                                                    mdi-alert-circle
                                                </v-icon>
                                            </template>
                                            <span>{{ $t('blends.createBlends.eudrReferenceNumberTT') }}</span>
                                        </v-tooltip>
                                    </div>
                                </div>
                                <v-text-field readonly disabled v-model="formData.eudrReferenceNumber" outlined dense
                                    :placeholder="$t('blends.blendSettings.enterHere')" hide-details
                                    class="input-field bg-surface-variant disabled-text-field">
                                </v-text-field>
                            </v-col>
                            <!-- Company ID Field -->
                            <v-col cols="12" sm="4">
                                <div class="d-flex justify-space-between mb-1">
                                    <div class="text-subtitle-1">{{
                                        $t('blends.createBlends.companyId') }}
                                        <v-tooltip bottom color="00BD73" max-width="500">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon class="icon-with-background primary--text pr-2" small style="color:#0EBF67"
                                                    v-bind="attrs" v-on="on">
                                                    mdi-alert-circle
                                                </v-icon>
                                            </template>
                                            <span>{{ $t('blends.createBlends.companyIdTT') }}</span>
                                        </v-tooltip>
                                    </div>
                                </div>
                                <v-text-field readonly disabled v-model="formData.companyId" outlined dense
                                    :placeholder="formData.companyId" hide-details
                                    class="input-field bg-surface-variant disabled-text-field">
                                </v-text-field>
                            </v-col>
                        </v-row>

                        <!-- Activity Radio Buttons -->
                        <v-row class="mb-4">
                            <v-col cols="12">
                                <h3 class="font-weight-bold mb-2">{{ $t('blends.createBlends.activity') }}</h3>
                                <v-radio-group v-model="formData.activity" row>
                                    <v-radio :label="$t('blends.createBlends.domestic')" value="domestic"></v-radio>
                                    <v-radio :label="$t('blends.createBlends.import')" value="import"></v-radio>
                                    <v-radio :label="$t('blends.createBlends.export')" value="export"></v-radio>
                                </v-radio-group>
                            </v-col>
                        </v-row>

                        <!-- place of activity -->
                        <v-row class="mb-4">
                            <v-col cols="12">
                                <h3 class="font-weight-bold mb-2">{{ $t('blends.createBlends.placeOfActivity') }}
                                    <v-tooltip bottom color="00BD73" max-width="500">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon class="icon-with-background primary--text pr-2" style="color:#0EBF67"
                                                v-bind="attrs" v-on="on">
                                                mdi-alert-circle
                                            </v-icon>
                                        </template>
                                        <span>{{ $t('blends.createBlends.placeOfActivityTT') }}</span>
                                    </v-tooltip>
                                </h3>
                            </v-col>
                            <v-col cols="12" sm="3">
                                <div class="d-flex align-center mb-2">
                                    {{ $t('blends.createBlends.countryOfActivity') }}
                                    <v-tooltip bottom color="00BD73" max-width="500">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon small class="icon-with-background primary--text pl-2" style="color:#0EBF67"
                                                v-bind="attrs" v-on="on">
                                                mdi-alert-circle
                                            </v-icon>
                                        </template>
                                        <span>{{ $t('blends.createBlends.countryOfActivityTT') }}</span>
                                    </v-tooltip>
                                </div>
                                <v-autocomplete :placeholder="$t('blends.blendSettings.selectCountry')" :label="$t('blends.blendSettings.selectCountry')" clearable
                                 v-model="formData.countryOfActivity" outlined :rules="[requiredRule]" cache-items
                                 :search-input.sync="search" chips small-chips solo flat item-text="name" item-value="name" 
                                    dense :items="europeanCountries" variant="outlined" hide-details="auto" multiple></v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="3">
                                <div class="d-flex align-center mb-2">
                                    {{ $t('blends.createBlends.countryOfEntry') }}
                                    <v-tooltip bottom color="00BD73" max-width="500">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon small class="icon-with-background primary--text pl-2" style="color:#0EBF67"
                                                v-bind="attrs" v-on="on">
                                                mdi-alert-circle
                                            </v-icon>
                                        </template>
                                        <span>{{ $t('blends.createBlends.countryOfEntryTT') }}</span>
                                    </v-tooltip>
                                </div>
                                <v-autocomplete :label="$t('blends.blendSettings.selectCountry')"
                                    :placeholder="$t('blends.blendSettings.selectCountry')" clearable outlined
                                    v-model="formData.countryOfEntry" :rules="[requiredRule]" :items="europeanCountries"
                                    item-text="name" item-value="name" cache-items :search-input.sync="search" dense
                                    chips small-chips solo flat multiple>
                                </v-autocomplete>
                            </v-col>

                        </v-row>

                        <!-- Container Information -->
                        <v-row class="w-33">
                            <v-col cols="12">
                                <h3 class="font-weight-bold mb-2">{{ $t('blends.createBlends.containerInformation') }}
                                    <v-tooltip bottom color="00BD73" max-width="500">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                                                v-on="on">
                                                mdi-alert-circle
                                            </v-icon>
                                        </template>
                                        <span>{{ $t('blends.createBlends.containerInformationTT') }}</span>
                                    </v-tooltip>
                                </h3>
                            </v-col>

                            <v-col cols="4" v-for="(container, index) in containers" :key="index">
                                <div class="d-flex justify-space-between mb-1">
                                    <div class="text-subtitle-1">{{
                                        $t('blends.createBlends.containerId')
                                        }}
                                        <v-tooltip bottom color="00BD73" max-width="500">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon small class="icon-with-background primary--text pr-2" style="color:#0EBF67"
                                                    v-bind="attrs" v-on="on">
                                                    mdi-alert-circle
                                                </v-icon>
                                            </template>
                                            <span>{{ $t('blends.createBlends.containerIdTT') }}</span>
                                        </v-tooltip>
                                    </div>
                                </div>

                                <div class="d-flex align-center">
                                    <v-text-field v-model="container.id" outlined dense :placeholder="$t('blends.createBlends.containerId')"
                                        hide-details="auto" class="input-field"
                                        :rules="[optionalContainerIdRule]"></v-text-field>
                                    <v-btn v-if="index >= 1" color="red remove-container-btn" icon class="ml-2"
                                        @click="removeContainer(index)">
                                        <v-icon class="remove-icon" color="white">mdi-close</v-icon>
                                    </v-btn>
                                </div>
                            </v-col>

                            <v-col cols="12">
                                <v-btn @click="addContainer" class="add-container-btn">
                                    <v-icon color="white" size="small" left class="add-icon ">
                                        mdi-plus
                                    </v-icon>
                                    {{ $t('blends.createBlends.addContainer') }}
                                </v-btn>
                            </v-col>
                        </v-row>

                        <v-divider class="my-8"></v-divider>
                        <!-- blend products components -->
                        <v-row class="w-33 my-4 mr-4">
                            <v-col cols="12">
                                <h3 class="font-weight-bold mb-2">{{ $t('blends.createBlends.blendProduct') }}
                                    <v-tooltip bottom color="00BD73" max-width="500">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon class="icon-with-background primary--text pl-2" style="color:#0EBF67"
                                                v-bind="attrs" v-on="on">
                                                mdi-alert-circle
                                            </v-icon>
                                        </template>
                                        <span>{{ $t('blends.createBlends.blendProductTT') }}</span>
                                    </v-tooltip>
                                </h3>
                            </v-col>
                        </v-row>

                        <!-- Container Information -->
                        <v-row v-for="(blendData, index) in selectedBlendData" :key="index" class="mt-5">
                                <v-col cols="12" sm="3">
                                    <div class="d-flex align-center mb-2">
                                        {{ $t('blends.createBlends.product') }}
                                        <v-tooltip bottom color="00BD73" max-width="500">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon small class="icon-with-background primary--text pl-2" style="color:#0EBF67"
                                                    v-bind="attrs" v-on="on">
                                                    mdi-alert-circle
                                                </v-icon>
                                            </template>
                                            <span>{{ $t('blends.createBlends.productTT') }}</span>
                                        </v-tooltip>
                                    </div>
                                    <v-text-field disabled v-model="blendData.productName" outlined dense
                                        :placeholder="$t('blends.blendSettings.enterHere')" hide-details
                                        class="input-field bg-surface-variant disabled-text-field"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="3">
                                    <div class="d-flex align-center mb-2">
                                        {{ $t('blends.createBlends.subProduct') }}
                                        <v-tooltip bottom color="00BD73" max-width="500">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon small class="icon-with-background primary--text pl-2" style="color:#0EBF67"
                                                    v-bind="attrs" v-on="on">
                                                    mdi-alert-circle
                                                </v-icon>
                                            </template>
                                            <span>{{ $t('blends.createBlends.subProductTT') }}</span>
                                        </v-tooltip>
                                    </div>
                                    <v-text-field disabled v-model="blendData.subProductName" outlined dense
                                        :placeholder="$t('blends.blendSettings.enterHere')" hide-details
                                        class="input-field bg-surface-variant disabled-text-field"></v-text-field>
                                </v-col>

                                <v-col cols="12" class="my-4">
                                    <!-- Data Table -->
                                    <v-data-table :headers="blendData.headers" :items="blendData.blendData"
                                        :items-per-page="blendData.itemsPerPageSlider" hide-default-footer show-select
                                        :loading="loading" :options.sync="options" :item-class="getRowClass"
                                        :loading-text="$t('loadingData')" item-key="id"
                                        :key="tableKey"
                                        >

                                        <template v-slot:header.data-table-select>
                                            <v-checkbox v-model="blendData.selectAll"
                                                @change="toggleSelectAll(blendData)" hide-details color="#0EBF67">
                                            </v-checkbox>
                                        </template>

                                        <template v-slot:top="{}">
                                            <div class="d-flex align-center my-5">
                                                <div class="search-field mr-4">
                                                    <div class="field-label">{{
                                                        $t('blends.createBlends.internalReferenceNumber') }}</div>
                                                    <v-text-field v-model="blendData.ddsSearch" dense outlined
                                                        :placeholder="$t('blends.createBlends.search')" @input="searchQuery(index)"
                                                        prepend-inner-icon="mdi-magnify" hide-details
                                                        class="small-search"></v-text-field>
                                                </div>

                                                <div class="search-field mr-4">
                                                    <div class="field-label">{{ $t('blends.createBlends.containerId') }}
                                                    </div>
                                                    <v-text-field v-model="blendData.containerSearch" dense outlined
                                                        :placeholder="$t('blends.createBlends.search')" @input="searchQuery(index)"
                                                        prepend-inner-icon="mdi-magnify" hide-details
                                                        class="small-search"></v-text-field>
                                                </div>

                                                <div class="search-field mr-4">
                                                    <div class="field-label">
                                                        {{ $t('blends.createBlends.country') }}
                                                        <v-tooltip bottom color="00BD73" max-width="500">
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-icon small class="icon-with-background primary--text pr-2"
                                                                    style="color:#0EBF67" v-bind="attrs" v-on="on">
                                                                    mdi-alert-circle
                                                                </v-icon>
                                                            </template>
                                                            <span>{{ $t('blends.createBlends.countryTT') }}</span>
                                                        </v-tooltip>
                                                    </div>
                                                    <v-select v-model="blendData.selectedCountry" dense outlined
                                                        :placeholder="$t('blends.createBlends.select')" :items="countries" item-text="name"
                                                        item-value="name" hide-details class="small-search"
                                                        @change="searchQuery(index)" clearable></v-select>

                                                </div>
                                                <div>
                                                    <div class="d-flex align-center">
                                                        <!-- Date Picker with Popover -->
                                                        <v-menu v-model="blendData.dateMenu"
                                                            :close-on-content-click="false" offset-y>
                                                            <template v-slot:activator="{ on, attrs }">
                                                                <v-btn class="mt-6" icon v-bind="attrs" v-on="on">
                                                                    <v-icon color="#0EBF67" x-large outlined dense>mdi-calendar</v-icon>
                                                                </v-btn>
                                                            </template>
                                                            <v-card>
                                                                <v-date-picker v-model="blendData.selectedDate"
                                                                    scrollable>
                                                                </v-date-picker>
                                                                <v-divider></v-divider>
                                                                <v-card-actions>
                                                                    <v-btn color="primary"
                                                                        @click="applyDateFilter(index)" small>
                                                                        {{ $t("blends.createBlends.applyFilter") }}
                                                                    </v-btn>
                                                                    <v-btn color="secondary"
                                                                        @click="clearDateFilter(index)" small>
                                                                        {{ $t("blends.createBlends.clearFilter") }}
                                                                    </v-btn>
                                                                </v-card-actions>
                                                            </v-card>
                                                        </v-menu>
                                                    </div>
                                                </div>

                                                <v-spacer></v-spacer>
                                                <div class="py-1 title">
                                                    {{ blendData.toBlendsLists || 0
                                                    }}
                                                    {{ $t('of') }} {{
                                                        blendData.totalBlendsLists || 0 }}
                                                </div>
                                                <v-btn class="mx-2" fab small outlined color="primary"
                                                    @click="prevPage(index)" :disabled="blendData.page <= 1">
                                                    <v-icon dark>
                                                        mdi-chevron-left
                                                    </v-icon>
                                                </v-btn>
                                                <v-btn class="mx-2" fab small outlined color="primary"
                                                    @click="nextPage(index)"
                                                    :disabled="blendData.toBlendsLists >= blendData.totalBlendsLists">
                                                    <v-icon dark>
                                                        mdi-chevron-right
                                                    </v-icon>
                                                </v-btn>
                                                <v-menu v-model="blendData.menu" :close-on-content-click="false"
                                                    :nudge-width="200" left :min-width="417">
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-btn class="mx-2" fab small outlined color="primary"
                                                            v-bind="attrs" v-on="on">
                                                            <v-icon dark>mdi-cog-outline </v-icon>
                                                        </v-btn>
                                                    </template>
                                                    <v-card width="417">
                                                        <v-list>
                                                            <v-list-item>
                                                                <v-list-item-content>
                                                                    <v-list-item-title>{{
                                                                        $t("deforestation.customization")
                                                                        }}</v-list-item-title>
                                                                </v-list-item-content>
                                                            </v-list-item>
                                                            <v-divider></v-divider>
                                                            <div class="pl-3 pt-2 font-weight-normal">
                                                                {{ $t("deforestation.recordsPerpage") }}
                                                            </div>
                                                            <v-list-item>
                                                                <v-list-item-content>
                                                                    <v-slider v-model="blendData.itemsPerPageSlider"
                                                                        :tick-labels="itemsPerPageOptions"
                                                                        :max="itemsPerPageOptions.length - 1" step="1"
                                                                        ticks="always" tick-size="4"
                                                                        @change="onItemsPerPageChange(index)"></v-slider>
                                                                </v-list-item-content>
                                                            </v-list-item>
                                                            <v-divider class="mt-n3"></v-divider>
                                                        </v-list>
                                                        <v-card-text>
                                                            <v-container fluid>
                                                                <v-row>
                                                                    <v-col class="mt-n9" cols="6"
                                                                        v-for="header in blendHeaders"
                                                                        :key="header.value">
                                                                        <v-checkbox v-if="header.text"
                                                                            v-model="blendData.selectedHeaders"
                                                                            :label="header.text" color="primary"
                                                                            :value="header.text" hide-details
                                                                            :disabled="header.text === 'ID'"></v-checkbox>
                                                                    </v-col>
                                                                </v-row>
                                                            </v-container>
                                                        </v-card-text>
                                                        <v-layout justify-center>
                                                            <v-card-actions class="mb-5">
                                                                <v-spacer></v-spacer>

                                                                <v-btn outlined color="primary"
                                                                    @click="resetDefault(index)" width="190">
                                                                    {{ $t("deforestation.restoreDefault") }}
                                                                </v-btn>
                                                                <v-btn color="primary"
                                                                    @click="resetTableStructure(index)" width="190">
                                                                    {{ $t("deforestation.apply") }}
                                                                </v-btn>
                                                            </v-card-actions>
                                                        </v-layout>
                                                    </v-card>
                                                </v-menu>
                                            </div>
                                        </template>

                                        <!-- Checkbox for Each Row -->
                                        <template v-slot:item.data-table-select="{ item }">
                                            <v-checkbox v-model="item.selected" @change="selectedItem(item, blendData, index)"
                                                hide-details color="#0EBF67" />
                                        </template>

                                        <!-- Slot for InternalReferecne no -->
                                        <template v-slot:item.internalReferenceNumber="{ item }">
                                            {{ item.internalReferenceNumber ? item.internalReferenceNumber : '-' }}
                                        </template>
                                        <!-- Slot for EUDR / Internal Reference No. -->
                                        <!-- Slot for Farms & Quantity -->
                                        <template v-slot:item.productNetMass="{ item }">
                                            {{ item.productionPlaceCount ? `${item.productionPlaceCount} Farms` : "N/A"
                                            }}<br>
                                            {{ item.productNetMass ? `${item.productNetMass} ${eudrSettings.product_mass_unit}` : "N/A" }}
                                        </template>

                                        <!-- Slot for Submission Date -->
                                        <template v-slot:item.createdAt="{ item }">
                                            {{ getLocalTimeSlashFormat(item.createdAt) }}
                                        </template>

                                        <!-- Slot for Due Diligence Status -->
                                        <template v-slot:item.productType="{ item }">
                                            <v-btn small rounded min-width="200" depressed class="gray-button"
                                                height="40" v-if="item.status == 'exempt'">
                                                {{ $t("blends.createBlends.status.eudrExempt") }}
                                            </v-btn>

                                            <template v-else>
                                                <v-btn small rounded min-width="200" depressed class="green-button"
                                                    height="40" v-if="item.status == 'Compliant'">
                                                    {{ $t("blends.createBlends.status.compliant") }}
                                                </v-btn>
                                                <v-btn small rounded min-width="200" depressed class="red-button"
                                                    height="40" v-else-if="item.status == 'Non-Compliant'">
                                                    {{ $t("blends.createBlends.status.nonCompliant") }}
                                                </v-btn>
                                            </template>

                                        </template>

                                        <!-- Slot for Availability for Blends -->
                                        <template v-slot:item.availability="{ item }">
                                            <v-switch inset v-model="item.availability" color="#0EBF67" hide-details
                                                @change="handleAvailabilityChange(item, blendData, index)">
                                            </v-switch>
                                        </template>
                                    </v-data-table>
                                </v-col>
                        </v-row>
                    </v-card>

                    <v-card elevation="0" class="my-4">
                        <div class="d-flex mb-4 py-5">
                            <v-spacer></v-spacer>
                            <div class="d-flex mt-1">
                                <!--  only show on create button
                                <v-btn color="error" dark class="mr-2 font-weight-bold" @click="redirectListPage">
                                    {{ $t('blends.createBlends.discard') }}
                                </v-btn> -->
                                <v-btn color="yellow" dark class="mr-2 font-weight-bold" @click="rejectBlends">
                                    {{ $t('blends.createBlends.reject') }}
                                </v-btn>
                                <v-btn color="primary" dark class="mr-2 font-weight-bold" @click="saveAndContinueLater">
                                    {{ $t('blends.createBlends.saveAndContinueLater') }}
                                </v-btn>
                                <v-btn color="primary" dark class="mr-2 font-weight-bold" @click="previewForm">
                                    {{ $t('blends.createBlends.generateReport') }}
                                </v-btn>
                            </div>
                        </div>
                    </v-card>
                </v-form>
            </v-container>

            <!-- Add new blend dialog -->
            <v-dialog v-model="addNewBlendDialog" persistent width="60%">
                <v-card>
                    <CreateBlendSettingsDialog @close:dialog="addNewBlendDialog = false" :isModalForm="true" />
                </v-card>
            </v-dialog>
        </div>

    </div>
</template>


<script>

import CreateBlendSettingsDialog from './CreateBlendSettingsDialog.vue';
import BlendService from "@/_services/BlendService";
import { getCountries } from "country-state-picker";
import { getEuropeanCountries } from "../../../../../../constants/countries";
import Preview from './Preview-Reports.vue';
import loadingMixin from "@/mixins/LoadingMixin";
import dateMixin from "@/mixins/DateMixin";
import { isNil, isNaN, isEmpty } from 'lodash';
import { mapGetters } from 'vuex';
import UnitService from "@/_services/UnitService";

export default {
    name: 'BlendForm',
    components: {
        CreateBlendSettingsDialog,
        Preview
    },

    props: {
        blendId: {
            type: String || Number,
            default: ''
        }
    },
    async mounted() {
        if (this.$route.query.previewMode) {
            this.previewMode = true;
        }
        await Promise.all([this.getBlendSettings(), this.getCountry()]);

        this.options.limit = this.itemsPerPageOptions[1];
        this.options.itemsPerPage = this.itemsPerPageOptions[1];
        this.itemsPerPageSlider = 1;

        this.tableHeaders = this.reportHeaders;

        this.selectedBlendData?.forEach((blendData) => {
            blendData.selectedHeaders = this.blendHeaders.map(header => header.text);
            blendData.headers = [...this.blendHeaders];
            blendData.itemsPerPageSlider = 1;
        });

        if (!this.isNullUndefinedOrNaNBlend) {
            this.fetchSingleBlend();
            this.updateForm = true;
        } else if (this.blendId) {
            this.fetchSingleBlend();
        }

        this.options.itemsPerPage = this.itemsPerPageOptions[this.itemsPerPageSlider];
    },
    computed: {
        ...mapGetters("eudrSettings", ["get_EUDR_Settings"]),
        eudrSettings() {
            return this.get_EUDR_Settings;
        },
        floatRule() {
            return this.rules.floatRule
        },
        requiredRule() {
            return this.rules.requiredRule
        },
        isNullUndefinedOrNaNBlend() {
            return isNil(this.blendId) || isNaN(this.blendId) || this.previewMode === true;
        },
        formattedFormData() {
            const { blend, blendCode, finalProduct, finalProductCode, blendDescription, processType, ...rest } = this.formData;
            return {
                ...rest,
                blendSetting: {
                    blendTitle: blend,
                    blendCode,
                    finalProductName: finalProduct,
                    finalProductCode,
                    blendDescription,
                    processType,
                },
            };
        },
        formattedBlendProducts() {
            const groupedProducts = this.blendProducts.reduce((acc, product) => {
                const { productName, subProductname, index } = product;
                const key = `${productName}-${subProductname}-${index}`;

                if (!acc[key]) {
                    acc[key] = {
                        name: productName,
                        subProduct: subProductname,
                        index,
                        products: []
                    };
                }

                acc[key].products.push(product);

                return acc;
                }, {});

                return Object.values(groupedProducts);
        },
        getOrganizationId() {
            return this.$store.getters.getUser?.user_organization?.id;
        },
        netMassVolumeRule() {
            return () => {
                return (value) => {
                    const { netMass, volume } = this.formData;

                    if (!netMass && !volume) {
                        return this.$t("blends.validationMessage.requiredMessage");
                    }

                    if (value === netMass || value === volume) {
                        if (value < 0) {
                            return this.$t("blends.validationMessage.noNegativeNumbers");
                        }
                    }

                    return true;
                };
            };
        },

         optionalContainerIdRule() {
            return (v) => {
                if (!v) return true;
            };
        },
    },
    data() {
        return {
            listofBlendLoading: false,
            previewMode: false,
            selectedDdsIds: [],
            loading: false,
            addNewBlendDialog: false,
            name: 'ActionButtons',
            menu: false,
            selectedHeaders: [],
            containers: [{ id: "" }],
            isReadOnly: false,
            selectedBlend: null,
            companyId: '',
            search: '',
            tableCountry: '',
            blends: [],
            formData: {
                blend: '',
                blendCode: '',
                blendDescription: '',
                blendSettingId: '',
                finalProduct: '',
                finalProductCode: '',
                processType: '',
                netMass: '',
                volume: '',
                lotId: '',
                finishedProductLotId: '',
                internalReferenceNumber: '',
                eudrReferenceNumber: '',
                companyId: '',
                countryOfActivity: '',
                countryOfEntry: [],
                activity: 'import',
                continueLater: false,
                blendStatus: '',
                selectedBlendData: [
                    {
                        selectedHeaders: [],
                        productId: '',
                        subProductId: '',
                        productName: '',
                        subProductName: '',
                        blendData: []
                    }
                ],
            },
            rules: {
                floatRule: function (value) {
                    if (!value) return this.$t("blends.validationMessage.requiredMessage");
                    if (isNaN(value)) return this.$t("blends.validationMessage.isNumber");
                    const parsedValue = parseFloat(value);
                    if (!Number.isFinite(parsedValue)) return this.$t("blends.validationMessage.isValidNumber");
                    if (parsedValue < 0) return this.$t("blends.validationMessage.noNegativeNumbers");
                    return true;
                }.bind(this),
                requiredRule: function (value) {
                    if (Array.isArray(value)) {
                        return value.length > 0 || this.$t("blends.validationMessage.requiredMessage");
                    }
                    return !!value || this.$t("blends.validationMessage.requiredMessage");
                }.bind(this)
            },
            itemsPerPageOptions: [5, 10, 25, 50],
            itemsPerPageSlider: 1,
            selectAll: false,
            selected: [],
            ddsSearch: '',
            containerSearch: '',
            selectedCountry: '',
            tableKey: 0,
            blendHeaders: [
                { text: this.$t('blends.createBlends.table.eudrInternalRef'), value: 'internalReferenceNumber', sortable: true },
                { text: this.$t('blends.createBlends.table.containerId'), value: 'containerId', sortable: true },
                { text: this.$t('blends.createBlends.table.product'), value: 'productName', sortable: true },
                { text: this.$t('blends.createBlends.table.farmsQuantity'), value: 'productNetMass', sortable: false },
                { text: this.$t('blends.createBlends.table.submissionDate'), value: 'createdAt', sortable: false },
                { text: this.$t('blends.createBlends.table.dueDiligenceStatus'), value: 'productType', sortable: false },
                { text: this.$t('blends.createBlends.table.availabilityForBlends'), value: 'availability', sortable: false },
            ],
            countries: [],
            europeanCountries: getEuropeanCountries(),
            dateMenu: false,
            selectedDate: null,
            blendProducts: [],
            productHeaders: [
                { text: 'Internal Reference Number', value: 'internalReferenceNumber' },
                { text: 'Net Mass', value: 'productNetMass' },
                { text: 'Status', value: 'status' },
                { text: 'Product Name', value: 'productDetail.name' },
                { text: 'Container IDs', value: 'containerIds' },
            ],
            productName: [],
            subProductName: [],
            selectedBlendData: [
                {
                    productName: "",
                    subProductName: "",
                    productId: '',
                    subProductId: '',
                    ddsSearch: '',
                    containerSearch: '',
                    selectedCountry: null,
                    dateMenu: false,
                    selectedDate: null,
                    blendData: [],
                    itemsPerPageSlider: 10,
                    headers: [
                        { text: this.$t('blends.createBlends.table.eudrInternalRef'), value: 'internalReferenceNumber', sortable: true },
                        { text: this.$t('blends.createBlends.table.containerId'), value: 'containerId', sortable: true },
                        { text: this.$t('blends.createBlends.table.product'), value: 'productName', sortable: true },
                        { text: this.$t('blends.createBlends.table.farmsQuantity'), value: 'productNetMass', sortable: false },
                        { text: this.$t('blends.createBlends.table.submissionDate'), value: 'createdAt', sortable: false },
                        { text: this.$t('blends.createBlends.table.dueDiligenceStatus'), value: 'productType', sortable: false },
                        { text: this.$t('blends.createBlends.table.availabilityForBlends'), value: 'availability', sortable: false }
                    ],
                    menu: false,
                    toBlendsLists: 10,
                    totalBlendsLists: 0,
                    page: 1,
                    itemsPerPage: 10,
                }
            ],
            totalBlendsLists: 0,
            toBlendsList: 0,
            options: {
                page: 1,
                itemsPerPage: 10,
                limit: 10,
                sortBy: ['date'],
                sortDesc: [true],
            },
            debounceTimer: null,
            updateForm: false,
            errors: {}, // Track errors for each container
            hasMoreData: true,
            limit: 10,
            page: 1,
        }
    },

    watch: {
        selectedBlend: {
            async handler(newValue) {
                try {
                    if (!isEmpty(newValue)) {
                        this.startLoading();
                        const { data } = await BlendService.listBlendSettingsById(parseInt(newValue));
                        if (newValue && data) {
                            this.blendProducts = []
                        
                            const rest = Object.fromEntries(
                                Object.entries(data.getBlendSettings).filter(([key]) => key !== 'id')
                            );
                            this.formData = { ...this.transformBlendData({...this.formData,...rest}) };
                            this.handleBlendChange(this.formData);
                        } else {
                            this.resetForm();
                            this.filteredItems = [];
                        }
                    }else{
                        this.selectedBlendData = null
                    }
                }
                finally {
                    this.stopLoading();
                }
            },
            immediate: true
        },
        pagination() {
            this.getBlendSettings();
        },
        options: {
            handler(opt) {
                this.getTableData(opt);
            },
            deep: true,
        },
        ddsSearch() {
            this.searchQuery();
        },
        containerSearch() {
            this.searchQuery();
        },
        tableCountry() {
            this.searchQuery();
        },
        // Watch containers and update errors dynamically
        containers: {
            handler() {
                this.errors = {}; // Reset errors
                this.containers.forEach((container, index) =>
                    this.validateContainerId(container.id, index)
                );
            },
            deep: true,
        },
        'formData.netMass'(newVal) {
            if (newVal !== null && newVal !== undefined) {
            // If netMass is updated, remove validation for volume
            this.$nextTick(() => {
                this.$refs.volumeField.resetValidation();  // This assumes volume field has a ref="volumeField"
            });
            }
        },
        'formData.volume'(newVal) {
            if (newVal !== null && newVal !== undefined) {
            // If netMass is updated, remove validation for volume
            this.$nextTick(() => {
                this.$refs.netMassField.resetValidation();  // This assumes volume field has a ref="volumeField"
            });
            }
        },

        
    },
    methods: {
        onItemsPerPageChange(index) {
            const blendData = this.selectedBlendData[index];
            this.options.itemsPerPage = this.itemsPerPageOptions[blendData.itemsPerPageSlider];
            this.getTableData(index);
        },
        getRowClass(item) {
            return item.type === 'exempt' ? 'row-exempt' : 'row-default';
        },
        resetForm() {
            this.formData = {
                blend: '',
                blendCode: '',
                blendDescription: '',
                blendSettingId: '',
                finalProduct: '',
                finalProductCode: '',
                netMass: '',
                volume: '',
                lotId: '',
                finishedProductLotId: '',
                internalReferenceNumber: '',
                eudrReferenceNumber: '',
                companyId: '',
                countryOfActivity: '',
                countryOfEntry: [],
                activity: 'domestic',
                selectedBlendData: [],
                continueLater: false,
            }
        },
        addContainer() {
            this.containers.push({ id: "" });
        },
        removeContainer(index) {
            this.containers.splice(index, 1);
        },
        getStatusColor(status) {
            switch (status.toLowerCase()) {
                case 'compliant':
                    return '#0EBF67' // Green
                case 'non-compliant':
                    return '#FF5757' // Red
                case 'pending':
                    return '#FFA726' // Orange
                default:
                    return '#757575' // Grey
            }
        },
        getStatusClass(status) {
            return {
                'status-chip--compliant': status.toLowerCase() === 'compliant',
                'status-chip--non-compliant': status.toLowerCase() === 'non-compliant',
                'status-chip--pending': status.toLowerCase() === 'pending'
            }
        },
        toggleSelectAll(blendData) {
            const isAllSelected = blendData.blendData.every(item => item.selected);
            blendData.blendData.forEach((item, index) => {
                item.selected = !isAllSelected;
                this.$nextTick(() => {
                    this.selectedItem(item, blendData, index);
                    this.tableKey++;
                });
            });
            blendData.selectAll = !isAllSelected;
        },

        rejectBlends() {
            this.$router.push({
                name: "Blends",
            });
        },
        saveAndContinueLater() {
            this.formData.continueLater = true;
            this.formData.blendStatus = 'pending';
    
            if (this.$route.path === '/deforestation/create-blends') {

                this.triggerSubmit();
            } else {
                this.triggerSubmitUpdate();
            }
        },
        async triggerSubmit() {

            const payload = {
                name: this.formData.blend || "",
                blendCode: this.formData.blendCode || "",
                description: this.formData.blendDescription || "",
                blendStatus: this.formData.blendStatus || "",
                netMass: parseFloat(UnitService.toBase.weight(this.eudrSettings.product_mass_unit,this.formData.netMass)),
                volume: parseFloat(UnitService.toBase.volume(this.eudrSettings.volume_unit,this.formData.volume)),
                blendLotId: this.formData.lotId || "",
                finishedProductLotId: this.formData.finishedProductLotId || "",
                internalReferenceNumber: this.formData.internalReferenceNumber || "",
                companyId: parseInt(this.formData.companyId || ""),
                containerIds: this.containers.map(container => container.id).filter(id => id.trim() !== ''),
                activity: this.formData.activity || "import",
                countryOfEntry: this.formData.countryOfEntry || [],
                countryOfActivity: JSON.stringify(this.formData.countryOfActivity || []),
                continueLater: this.formData.continueLater,
                blendProducts: this.blendProducts.map(product => ({
                    ...(product.productType === 'dds'
                        ? { ddrId: parseInt(product.id, 10) }
                        : { exemptProductId: parseInt(product.id, 10) }),
                    productId: product.productId,
                    subProductId: product.subProductId,
                    index: product.index,
                    productType: product.productType === 'dds' ? 'dds' : 'exempt'
                })),
                blendSettingId: this.selectedBlend || null,
            };

            this.startLoading();

            try {
                const response = await BlendService.createBlendDds(payload);
                if (response?.data && !this.formData.continueLater) {
                    this.$notify({
                        title: this.$t("blends.createBlends.blendCreatedSuccessfully"),
                        type: "success",
                    });

                    const blendID = response?.data?.createBlend?.id;

                    if (blendID) {
                        this.$router.push({
                            name: "finalReport",
                            params: {
                                id: blendID
                            }
                        });
                    }
                }
                else if (response?.data && this.formData.continueLater) {
                    this.$notify({
                        title: this.$t("blends.createBlends.blendUpdatedSuccessfully"),
                        type: "success",
                    });
                    this.$router.push({
                        name: "Blends",
                    });
                } 
                else {
                    this.$notify({
                        title: this.$t("blends.createBlends.blendCreateFailed"),
                        type: "error",
                    });
                }
            } catch (error) {
                console.error("Error submitting blend settings:", error);
                this.$notify({
                    title: this.$t("blends.createBlends.blendCreateFailed"),
                    type: "error",
                });
            }
            finally {
                this.stopLoading();
            }
        },

        validateContainerId(value, currentIndex) {
            const isUnique = !this.containers.some(
                (container, index) => container.id === value && index !== currentIndex
            );
            this.$set(this.errors, currentIndex, !isUnique);
            return isUnique || this.$t("blends.createBlends.uniqueContainerId");
        },
        getErrorMessage(index) {
            return this.errors[index] ? this.$t("blends.createBlends.uniqueContainerId") : "";
        },

        async getBlendSettings() {
            this.listofBlendLoading = true
            try {
                const { data } = await BlendService.listBlendSettingsAll({
                    limit: this.limit,
                    page: this.page,
                })

                this.blends = [...this.blends, ...data.listBlendSettingsByProductAndSubProduct.rows];
                this.hasMoreData = data.listBlendSettingsByProductAndSubProduct.rows.length === this.limit
                this.page++
            } catch (error) {
                console.error('Failed to fetch blend settings:', error)
            } finally {
                this.listofBlendLoading = false
            }
        },

        onIntersect(entries) {
            if (entries[0].isIntersecting && this.hasMoreData && !this.listofBlendLoading) {
                this.getBlendSettings()
            }
        },

        getCountry() {
            this.countries = [...getCountries()];
        },
        async handleBlendChange(selectedBlendData) {
            if (!selectedBlendData) {
                this.selectedBlendData = [];
                this.stopLoading();
                return;
            }


            this.selectedBlendData = [];

            const products = selectedBlendData.blendSettingProducts?.map(product => ({
                productName: product.product.name,
                subProductName: product.subProduct.name,
                productId: product.productId,
                subProductId: product.subProductId,
                headers: this.blendHeaders,
                selectedHeaders: this.blendHeaders.map(header => header.text),
                blendData: [],
                menu: false,
                ddsSearch: '',
                containerSearch: '',
                selectedCountry: null,
                dateMenu: false,
                selectedDate: null,
                itemsPerPageSlider: 1,
                totalBlendsLists: 0,
            }));

            try {
                // Fetch blend products for each product
                const fetchPromises = products.map(async product => {
                    const res = await this.fetchProducts({
                        productId: String(product.productId),
                        subProductId: String(product.subProductId),
                        limit: this.options.itemsPerPage || 10,
                        page: this.options.page || 1,
                    });

                    if (Array.isArray(res.data.blendProducts)) {
                        return {
                            ...product,
                            blendData: res.data.blendProducts,
                            toBlendsLists: ((this.options.page - 1) * this.options.itemsPerPage) + res.data.count,
                            totalBlendsLists: res.data.totalCount,
                            page: this.options.page,
                            itemsPerPage: this.options.itemsPerPage,
                        };
                    } else {
                        console.error("blendProducts is not an array:", res.data.blendProducts);
                        return null;
                    }
                });

                const results = await Promise.all(fetchPromises);
                if(this.previewMode){
                    this.selectedBlendData = results
                }else{
                    this.selectedBlendData.push(...results.filter(result => result !== null));
                }
                this.selectedBlendData.forEach(data => {
                    data.itemsPerPageSlider = 1;
                });
                if (this.previewMode || this.updateForm) {

                    const updatedBlendProduct = selectedBlendData?.blendProducts?.map((blendProduct) => {
                        return {
                            productId: blendProduct?.product?.id,
                            subProductId: blendProduct?.subProduct?.id,
                            id: blendProduct?.ddr?.id || blendProduct?.exemptProduct?.id,
                            type: blendProduct?.ddr?.id?'dds':'exempt',
                            index: blendProduct?.index
                        }
                    });

                    this.selectedBlendData.forEach((selectedBlend, selectedBlendIndex) => {
                        selectedBlend?.blendData.forEach((blendData) => {
                            const dbSelectedBlends =  updatedBlendProduct.filter(
                                (product)  => (
                                        parseInt(product.productId) === parseInt(selectedBlend?.productId) &&
                                        parseInt(product.subProductId) === parseInt(selectedBlend?.subProductId) && 
                                        parseInt(product.index) === parseInt(selectedBlendIndex) && 
                                        parseInt(product.id) === parseInt(blendData.id) &&
                                        product.type === blendData?.type
                                )
                            )
                            if (dbSelectedBlends.length > 0) {
                                blendData.selected = true;
                                this.selectedItem(blendData, selectedBlend, selectedBlendIndex);
                            }
                        });
                    });
                }
                this.options.itemsPerPage = this.itemsPerPageOptions[1];
                this.options.page = 1;
            } catch (error) {
                console.log("Error fetching blend products:", error);
            } finally {
                this.stopLoading();
            }
        },

        async handleAvailabilityChange(item, blendData, index) {
            if (this.debounceTimers && this.debounceTimers[item.id]) {
                clearTimeout(this.debounceTimers[item.id]);
            } else {
                this.debounceTimers = {};
            }

            const currentAvailability = item.availability;

            this.debounceTimers[item.id] = setTimeout(async () => {
                try {
                    if (!currentAvailability) {
                        this.blendProducts = this.blendProducts.filter(product =>
                            parseInt(product.id) !== parseInt(item.id) || 
                            product.productType !== item.type || 
                            parseInt(product.index) !== parseInt(index)
                        );
                        if (item.type === 'dds') {
                            blendData.blendData = blendData.blendData.filter(dataItem => dataItem.id !== item.id);
                        } else {
                            await BlendService.updateAvailabilityExemptProduct(parseInt(item.id), false);
                            await this.getTableData(this.selectedBlendData.indexOf(blendData));
                        }
                        this.$notify({
                            title: this.$t(`Item "${item.productName}" has been hidden.`),
                            type: "success",
                        });
                    } else {
                        if (item.type !== 'dds') {
                            await BlendService.updateAvailabilityExemptProduct(parseInt(item.id), true);
                            await this.getTableData(this.selectedBlendData.indexOf(blendData));
                        }
                    }
                } catch (error) {
                    this.$notify({
                        title: this.$t("An error occurred while updating the availability."),
                        type: "error",
                    });
                }
            }, 5000);

            if (!currentAvailability) {
                this.$notify({
                    title: this.$t(`Item "${item.productName}" will be hidden in 5 seconds unless rechecked.`),
                    type: "success",
                });
            }
        },


        async getTableData(index) {
            this.startLoading();

            if (!this.selectedBlendData || !this.selectedBlendData[index]) {
                console.log("blendData is undefined for index:", index);
                this.stopLoading();
                return;
            }

            const blendData = this.selectedBlendData[index];

            const requestParams = {
                productId: String(blendData.productId),
                subProductId: String(blendData.subProductId),
                page: blendData.page,
                limit: blendData.itemsPerPage || 10,
                internalReferenceNumber: blendData.ddsSearch,
                country: blendData.selectedCountry,
                containerId: blendData.containerSearch,
                createdAt: blendData.selectedDate
                    ? new Date(blendData.selectedDate).toISOString().split("T")[0]
                    : "",
            };

            try {
                const res = await this.fetchProducts(requestParams);
                this.$set(this.selectedBlendData, index, {
                    ...blendData,
                    blendData: res.data.blendProducts,
                    totalBlendsLists: res.data.totalCount,
                    toBlendsLists: ((blendData.page - 1) * blendData.itemsPerPage) + res.data.count,
                });

                this.totalBlendsLists = res.data.totalCount;
                this.toBlendsList =  ((blendData.page - 1) * blendData.itemsPerPage) + res.data.count
            } catch (err) {
                console.error("Error fetching blends:", err);
            } finally {
                this.stopLoading();
            }
        },

        applyDateFilter(index) {
            this.getTableData(index);
        },

        async fetchProducts(filter) {
            try {
                const { data } = await BlendService.listBlendProducts({ filter });

                if (!data || !data.blendProducts || !Array.isArray(data.blendProducts.rows)) {
                    return { data: { blendProducts: [] } };
                }

                const blendProducts = data.blendProducts.rows?.map(product => ({
                    id: product.id,
                    productName: product.productName,
                    internalReferenceNumber: product.internalReferenceNumber,
                    productNetMass: UnitService.fromBase.weight(
                            this.eudrSettings.product_mass_unit,
                            parseFloat(product.productNetMass)
                        ), 
                    containerId: product.containerId,
                    status: product.status,
                    productionPlaceCount: product.productionPlaceCount,
                    availability: true,
                    type: product.productType,
                    createdAt: new Date(product.createdAt),
                }));

                return { data: { blendProducts, count: data.blendProducts.count, totalCount: data.blendProducts.totalCount } };
            } catch (error) {
                console.error("Error fetching products:", error);
                return { data: { blendProducts: [] } };
            }
        },
        async selectedItem(item, blendData, index) {
            const blendProduct = {
                index,
                productName: blendData.productName,
                productId: blendData.productId,
                subProductId: blendData.subProductId,
                subProductname: blendData.subProductName,
                countryname: blendData.selectedCountry,
                id: item.id,
                internalReferenceNumber: item.internalReferenceNumber,
                containerId: item.containerId || null,
                productionPlaceCount: item.productionPlaceCount || 0,
                productNetMass: item.productNetMass || 0,
                createdAt: item.createdAt || null,
                productType: item.type || null,
                status: item.status || null,
            };

            if (item.selected) {
                const exists = this.blendProducts.some(product =>
                    parseInt(product.id) === parseInt(blendProduct.id) &&
                    product.productType === blendProduct.productType &&
                    parseInt(product.index) === parseInt(blendProduct.index)
                );
                
                if (!exists) { this.blendProducts.push(blendProduct); }

            } else {
                this.blendProducts = this.blendProducts.filter(product =>
                    parseInt(product.id) !== parseInt(blendProduct.id) || 
                    product.productType !== blendProduct.productType || 
                    parseInt(product.index) !== parseInt(blendProduct.index)
                );
            }
            blendData.selectAll = blendData.blendData.every(item => item.selected);
        },


        searchQuery(index) {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                this.getTableData(index);
            }, 500);
        },
        previewForm() {
            this.validationError = false;
            this.$refs.section.scrollIntoView({ behavior: 'smooth' });


            if (!this.$refs.createBlendsDds.validate()) {
                this.$notify({
                    title: this.$t("blends.blendSettings.pleaseFillRequiredFields"),
                    type: "error",
                });
                return;
            }

            if (this.selectedBlendData.some(blendData =>
                !blendData.blendData.some(item => item.selected))) {
                this.$notify({
                    title: this.$t("blends.createBlends.pleaseSelectAtLeastOne"),
                    type: "error",
                });
                return;
            }

            if (this.blendProducts.length > 0) {
                this.selectedDdsIds = this.blendProducts.filter((product) => product.productType == 'dds').map((product) => parseInt(product.id));

                const ddsProducts = this.blendProducts.filter((product) => product.status !== "exempt");

                if (ddsProducts.length === 0) {
                    this.formData.blendStatus = 'compliant';
                    this.previewMode = true;
                    return;
                }

                const isAllDDSComplaint = ddsProducts.every((ddsProduct) => {
                    return ddsProduct.status === 'Compliant'
                })
                if (isAllDDSComplaint) {
                    this.formData.blendStatus = 'compliant'
                } else {
                    this.formData.blendStatus = 'non-compliant'
                }
            }

            this.previewMode = true;
        },

        clearDateFilter(index) {
            this.selectedBlendData[index].selectedDate = null;
            this.getTableData(index);
        },
        prevPage(index) {
            const blendData = this.selectedBlendData[index];
            if (blendData.page > 1) {
                blendData.page--;
                this.getTableData(index);
            }
        },

        nextPage(index) {
            const blendData = this.selectedBlendData[index];
            console.log(blendData.toBlendsLists, blendData.totalBlendsLists);
            if (blendData.toBlendsLists < blendData.totalBlendsLists) {
                blendData.page++;
                this.getTableData(index);
            }
        },

        filteredHeaders(blendData) {
            return this.blendHeaders.filter(header => blendData.selectedHeaders.includes(header.text));
        },

        async resetDefault(index) {
            const blendData = this.selectedBlendData[index];
            blendData.selectedHeaders = this.blendHeaders.map(header => header.text).filter(text => text);
            blendData.itemsPerPageSlider = 1;
            blendData.menu = false;
            blendData.headers = this.blendHeaders; // Restore all headers
            this.options = {
                page: 1,
                itemsPerPage: this.itemsPerPageOptions[1],
                limit: this.itemsPerPageOptions[1],
            };
            await this.getTableData(index);
        },

        async resetTableStructure(index) {
            const blendData = this.selectedBlendData[index];
            blendData.headers = this.blendHeaders.filter(header =>
                blendData.selectedHeaders.includes(header.text)
            );
            blendData.menu = false;
            blendData.itemsPerPage = this.itemsPerPageOptions[blendData.itemsPerPageSlider];
            console.log(blendData);
            await this.getTableData(index);
        },


        filteredItems(blendData) {
            return blendData.blendData.map(item => {
                const filteredItem = {};
                this.filteredHeaders(blendData).forEach(header => {
                    filteredItem[header.value] = item[header.value];
                });
                return filteredItem;
            });
        },
        fetchSingleBlend() {
            BlendService.getBlendById(this.blendId).then((response) => {
                    this.setBlendsData(response.data);
            });
        },
        
         setPreviewModeBlendData(data) {

            const transformBlendData = this.transformBlendData({
                ...data.blend, 
                orgId: data.blend.companyId,
                blendSettingProducts: data?.blend?.blendProducts,
                blendLotIDConfigurations: [{
                    lotId: data.blend.blendLotId,
                    finishedProductLotId: data.blend.finishedProductLotId
                }],
            });

            
            this.formData = { ...transformBlendData };

            return transformBlendData;
        },
       
        async setBlendsData(data) {
            this.formData.blendStatus = data.blend.blendStatus
            this.selectedDdsIds = data.blend.blendProducts.map((product) =>
                    product.ddr !== null ? parseInt(product.ddr.id) : null
                ).filter((id) => id !== undefined && id !== null && !isNaN(id));
            this.selectedBlend = data?.blend?.blendSetting?.id || null;
            await this.handleBlendChange(this.setPreviewModeBlendData(data));

            this.containers = data?.blend?.containerIds.map(container => ({
                id: container.containerId || ''
            })) || [{ id: "" }];
           // this.formData = this.transformBlendData(data);
        },
        async triggerSubmitUpdate() {
            const payload = {
                id: parseInt(this.formData.id)|| null,
                name: this.formData.blend || "",
                blendCode: this.formData.blendCode || "",
                description: this.formData.blendDescription || "",
                netMass: parseFloat(this.formData.netMass) || null,
                volume: parseFloat(this.formData.volume) || null,
                blendLotId: this.formData.lotId || "",
                finishedProductLotId: this.formData.finishedProductLotId || "",
                internalReferenceNumber: this.formData.internalReferenceNumber || "",
                companyId: parseInt(this.formData.companyId || ""),
                countryOfEntry: this.formData.countryOfEntry || [],
                continueLater: this.formData.continueLater,
                blendProducts: this.selectedBlendData.flatMap(product =>({
                ...(product.productType === 'dds'
                        ? { ddrId: parseInt(product.exemptProductId, 10) }
                        : { exemptProductId: parseInt(product.exemptProductId, 10) }),
                    productId: product.productId,
                    subProductId: product.subProductId,
                    productType: product.productType === 'dds' ? 'dds' : 'exempt'
                })),
                blendSettingId: parseInt(this.selectedBlend) || null,
                blendStatus: this.formData.blendStatus || 'pending',
            };
            this.startLoading();

            try {
                const data = await BlendService.updatedBlendDds(payload);
                if (data?.data && !this.formData.continueLater) {
                    this.$notify({
                        title: this.$t("blends.createBlends.blendUpdatedSuccessfully"),
                        type: "success",
                    });
                    this.$router.push({
                        name: "finalReport",
                        params: {
                            id: this.blendId
                        }
                    });
                    if (this.$refs.createBlendsDds) {
                        this.$refs.createBlendsDds.reset();
                    }
                }
                 else if(data?.data && this.formData.continueLater) {
                    this.$notify({
                        title: this.$t("blends.createBlends.blendUpdatedSuccessfully"),
                        type: "success",
                    });
                    this.$router.push({
                        name: "Blends",
                    });
                }else {
                    this.$notify({
                        title: this.$t("blends.createBlends.blendUpdateFailed"),
                        type: "error",
                    });
                }
            } catch (error) {
                console.error("Error updating blend:", error);
                this.$notify({
                    title: this.$t("blends.createBlends.blendUpdateFailed"),
                    type: "error",
                });
            } finally {
                this.stopLoading();
            }
        },
        transformBlendData(originalData) {            
            const blendLotIDConfigurations = originalData.blendLotIDConfigurations || [];
            const hasConfigurations = blendLotIDConfigurations.length > 0;

            let countryOfActivity = originalData.countryOfActivity || [];
            if(!Array.isArray(originalData.countryOfActivity) && originalData.countryOfActivity) {
                countryOfActivity = JSON.parse(originalData.countryOfActivity)
            }

            return {
                id: originalData.id,
                blend: originalData.blendTitle,
                blendCode: originalData.blendCode,
                blendDescription: originalData.blendDescription,
                blendProducts: originalData.blendProducts,
                finalProduct: originalData.finalProductName,
                blendStatus:originalData.blendStatus,
                finalProductCode: originalData.finalProductCode,
                processType: originalData.processType,
                companyId: String(originalData.orgId || this.$store.getters.getUser?.user_organization?.id) || '',
                blendSettingProducts: originalData.blendSettingProducts.map(product => ({
                    ...product,
                    product: {
                        id: product.product?.id || product.productId.toString(),
                        name: product.product?.name || 'Cattle',
                    },
                    subProduct: {
                        id: product.subProduct?.id || product.subProductId.toString(),
                        name: product.subProduct?.name || '',
                    },
                    percentage: product.percentage || 0,
                })),
                blendLotIDConfigurations,
                blendLotId: hasConfigurations ? blendLotIDConfigurations[0].lotId : '',
                finishedProductLotId: originalData.finishedProductLotId,
                continueLater: false,
                userData: this.previewMode ? originalData.userData : this.$store.getters.getUser,
                netMass: originalData.netMass,
                volume: originalData.volume,
                internalReferenceNumber: originalData.internalReferenceNumber,
                eudrReferenceNumber: originalData.eudrReferenceNumber,
                activity: originalData.activity.toLowerCase(),
                countryOfActivity: countryOfActivity,
                countryOfEntry: originalData.countryOfEntry,
            };
        },
    },
    mixins: [loadingMixin, dateMixin]
}
</script>

<style scoped>
::v-deep .row-exempt {
    background-color: #FFE8C5 !important;
}

.row-default {
    background-color: #ffffff;
}

.field-label {
    color: rgba(0, 0, 0, 0.6);
    font-size: 0.875rem;
    margin-bottom: 4px;
}

.field-value {
    font-size: 0.875rem;
    min-height: 32px;
    padding: 4px 0;
}

.blend-select :deep(.v-field__input) {
    min-height: 40px !important;
}

.input-field :deep(.v-field__input) {
    min-height: 40px !important;
}

.input-field :deep(.v-field__append-inner) {
    padding-top: 8px !important;
}

.input-field :deep(.v-input__append-outer) {
    margin-left: 8px !important;
}

/* Remove bottom space from fields */
.v-text-field :deep(.v-input__details) {
    display: none !important;
}

/* Proper spacing for input fields */
.v-text-field {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
}

/* top blend component */
.add-container-btn {
    position: relative;
    font-weight: 500;
}


.remove-container-btn {
    position: relative;
    right: 10px;
    top: 10px;
}

.remove-icon {
    background-color: #FF5757;
    border-radius: 50%;
    padding: 6px;
}

.custom-text-field {
    font-size: 16px;
}

.v-input--dense .v-input__control {
    min-height: 40px;
    /* Customize height to match design */
}

.v-text-field .v-input__control input {
    font-size: 16px;
    padding: 10px;
}

.v-btn {
    min-width: 40px;
}

/* blend product css  */
.add-container-btn {
    position: relative;
    font-weight: 500;
}

.add-icon {
    background-color: var(--primary-color);
    border-radius: 50%;
    padding: 6px;
    margin-right: 8px;
}

.remove-container-btn {
    position: relative;
    right: 10px;
    top: 10px;
}

.remove-icon {
    background-color: #FF5757;
    border-radius: 50%;
    padding: 6px;
}

.custom-text-field {
    font-size: 16px;
}

.v-input--dense .v-input__control {
    min-height: 40px;
    /* Customize height to match design */
}

.v-text-field .v-input__control input {
    font-size: 16px;
    padding: 10px;
}

.v-btn {
    min-width: 40px;
}

.search-header {
    margin-bottom: 20px;
}

.field-label {
    font-size: 14px;
    color: #333;
    margin-bottom: 4px;
}

.search-field {
    width: 200px;
}

.custom-table {
    border: 1px solid #E0E0E0;
    border-radius: 8px;
}

.green-header {
    background-color: #00573F !important;
}

.green-header th {
    color: white !important;
    font-weight: 500;
    padding: 12px 16px;
}

.checkbox-column {
    width: 48px;
}

.highlighted-row {
    background-color: #FFF8E1 !important;
}

.status-chip {
    min-width: 120px;
    justify-content: center;
    font-weight: 500;
}

.status-chip--compliant {
    background-color: #E8F5E9 !important;
    color: #0EBF67 !important;
}

.status-chip--non-compliant {
    background-color: #FFEBEE !important;
    color: #FF5757 !important;
}

.status-chip--pending {
    background-color: #FFF3E0 !important;
    color: #FFA726 !important;
}

/* Override Vuetify default styles */
::v-deep .v-data-table>.v-data-table__wrapper>table>thead>tr>th {
    font-size: 14px;
    white-space: nowrap;
}

::v-deep .v-data-table>.v-data-table__wrapper>table>tbody>tr>td {
    font-size: 14px;
    height: 60px;
}

::v-deep .v-input__slot {
    min-height: 40px !important;
}

::v-deep .v-text-field__slot input {
    font-size: 14px;
}

/* last button */
.v-btn {
    text-transform: uppercase;
    font-weight: 500;
    padding: 0 16px;
    height: 40px;
}

/* Responsive adjustments */
@media (max-width: 600px) {
    .v-btn {
        width: 100%;
    }
}

/* Add new small-search class */
.small-search {
    min-width: 180px;
}

/* Optional: Adjust the input height if needed */
.small-search :deep(.v-field__input) {
    min-height: 32px !important;
}

.add-blend-settings {
    position: sticky;
    bottom: 0;
    background: #FFF;
    padding: 6px;
}

::v-deep .disabled-text-field .v-input__control {
    background-color: rgb(237, 237, 237);
    color: #9e9e9e;
}

::v-deep .disabled-text-field .v-input__slot {
    background-color: rgb(237, 237, 237) !important;
}
</style>