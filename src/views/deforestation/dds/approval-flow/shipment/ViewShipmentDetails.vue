<template>
    <div>
        <div id="shippingDetails">
            <breadcrumb :items="breadcrumbs" data-html2canvas-ignore="true"></breadcrumb>
            <div class="d-flex mb-4" data-html2canvas-ignore="true">
                <h2>Shipment: SHP-{{ getShippmentNo }}</h2>
                <v-spacer></v-spacer>
                <div class="d-flex mt-1">
                    <v-btn color="primary" class="mr-2 font-weight-bold white--text" @click="goBack">
                        {{ $t('deforestation.back') }}
                    </v-btn>
                    <!-- <v-btn @click="downloadDetailsPage" color="primary" class="mr-2 white--text">
                        <v-icon style="color: white !important;" left>mdi-download</v-icon>
                        {{ $t('download') }}
                        <v-icon right style="color: white !important;">mdi-chevron-down</v-icon>
                    </v-btn> -->

                    <!-- <v-btn color="primary" dark medium class="mr-3" @click="requestAdditionalInformation">
                        {{ $t('deforestation.requestAdditionalInformation') }}
                    </v-btn> -->

                    <v-btn color="error" v-if="!isWorkerOnly" dark medium class="mr-3" @click="handleRejectReport">
                        {{ $t('deforestation.reject') }}
                    </v-btn>

                    <v-btn color="primary" v-if="$can($permissions.approve.value)" dark medium class="mr-3" @click="handleApproveReport">
                        {{ $t('deforestation.approve') }}
                    </v-btn>
                </div>
            </div>

            <!-- Shipment Details Card -->
            <v-card elevation="0" class="px-5 mb-5">
                <v-card-text>
                    <v-row class="mb-5">
                        <v-col class="d-flex flex-column" style="flex: 1 1 20%;">
                            <div>{{ $t('deforestation.exporter') }}</div>
                            <div class="value">{{ shipment.exporter }}</div>
                        </v-col>
                        <v-col class="d-flex flex-column" style="flex: 1 1 20%;">
                            <div>{{ $t('deforestation.importer') }}</div>
                            <div class="value">{{ shipment.importer }}</div>
                        </v-col>
                        <v-col class="d-flex flex-column" style="flex: 1 1 20%;">
                            <div>{{ $t('deforestation.shipmentReferenceNo') }}</div>
                            <div class="value">{{ shipment.shipment_refrence_number }}</div>
                        </v-col>
                        <v-col class="d-flex flex-column" style="flex: 1 1 20%;">
                            <div>{{ $t('deforestation.ownerShipType') }}</div>
                            <div class="value">{{ shipment.ownership_type }}</div>
                        </v-col>
                        <v-col class="d-flex flex-column" style="flex: 1 1 20%;">
                            <div>{{ $t('deforestation.buyer') }}</div>
                            <div class="value">{{ shipment.buyer }}</div>
                        </v-col>
                    </v-row>
                    <v-row class="mb-5">
                        <v-col class="d-flex flex-column" style="flex: 1 1 20%;">
                            <div>{{ $t('deforestation.port_of_origin') }}</div>
                            <div class="value">{{ shipment.part_of_origin }}</div>
                        </v-col>
                        <v-col class="d-flex flex-column" style="flex: 1 1 20%;">
                            <div>{{ $t('deforestation.port_of_destination') }}</div>
                            <div class="value">{{ shipment.part_of_destination }}</div>
                        </v-col>
                        <v-col class="d-flex flex-column" style="flex: 1 1 20%;">
                            <div>{{ $t('deforestation.no_of_stops') }}</div>
                            <div class="value">
                                {{ noOfStops }}
                                <a style="text-decoration: underline; font-size: 14px" class="ml-5" @click="showStops">
                                    {{ $t('deforestation.viewStops') }}
                                </a>
                            </div>
                        </v-col>
                        <v-col class="d-flex flex-column" style="flex: 1 1 20%;">
                            <div>{{ $t('deforestation.shipping_line') }}</div>
                            <div class="value">{{ shipment.shipping_line }}</div>
                        </v-col>
                        <v-col class="d-flex flex-column" style="flex: 1 1 20%;">
                            <div>{{ $t('deforestation.expected_arrival_date') }}</div>
                            <div class="value">{{ formatDate(shipment.expected_arrival_date) }}</div>
                        </v-col>
                    </v-row>
                    <v-row class="mb-5">
                        <v-col class="d-flex flex-column" style="flex: 1 1 20%;">
                            <div>{{ $t('deforestation.container_id') }}</div>
                            <div class="value">{{ shipment.container_id }}</div>
                        </v-col>
                        <v-col class="d-flex flex-column" style="flex: 1 1 20%;">
                            <div>{{ $t('deforestation.container_type') }}</div>
                            <div class="value">{{ shipment.container_type }}</div>
                        </v-col>
                        <v-col class="d-flex flex-column" style="flex: 1 1 20%;">
                            <div>{{ $t('deforestation.container_size') }}</div>
                            <div class="value">{{ shipment.container_size }}</div>
                        </v-col>
                        <v-col class="d-flex flex-column" style="flex: 1 1 20%;">
                            <div>{{ $t('deforestation.container_capacity') }}</div>
                            <div class="value">{{ shipment.container_capacity }}</div>
                        </v-col>
                        <v-col class="d-flex flex-column" v-if="!isWorkerOnly" style="flex: 0 0 20%; max-width: 20%;">
                            <div class="control filter">
                                <label for="text">{{ $t('dueDiligence.assignedTo') }}</label>
                                <v-select v-model="reportAssignedTo" item-text="name" item-value="value"
                                    :items="assignedToOptions" @change="handleAssignUserChange" outlined dense clearable
                                    :placeholder="currentAssignedUserName || $t('deforestation.selectUserToAssign')">
                                    <template v-slot:prepend-item>
                                        <v-list-item>
                                            <v-list-item-content>
                                                <v-text-field v-model="assignedToSearch" :placeholder="$t('search')"
                                                    prepend-inner-icon="mdi-magnify" dense outlined hide-details
                                                    class="ma-2" />
                                            </v-list-item-content>
                                        </v-list-item>
                                        <v-divider></v-divider>
                                    </template>
                                    <template v-slot:item="{ item }">
                                        <v-list-item @click="selectAssignUserFromDropdown(item)">
                                            <v-list-item-content>
                                                <v-list-item-title>{{ item.name }}</v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </template>
                                </v-select>
                            </div>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
            <v-card elevation="0" class="px-5">
                <v-card-text>
                    <div class="d-flex" style="margin-top: 20px;">
                        <p class="heading-title">
                            {{ $t('dueDiligence.dueDiligenceReports') }}
                            <v-tooltip top color="00BD73" max-width="350">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon class="icon-with-background primary--text" style="color:#0EBF67"
                                        v-bind="attrs" v-on="on">
                                        mdi-alert-circle
                                    </v-icon>
                                </template>
                                <span>{{ $t('dueDiligence.dueDiligenceReports') }}</span>
                            </v-tooltip>
                        </p>
                        <v-spacer></v-spacer>
                    </div>

                    <v-data-table :headers="tableHeaders" :items="diligenceReports" :items-per-page="10" :footer-props="{
                        'items-per-page-options': [10, 25, 50],
                    }" hide-default-footer :loading="loading" :header-props="headerProps" :options.sync="reportOptions"
                        :server-items-length="totalDiligenceReports" :loading-text="$t('loadingData')
                            ">
                        <template v-slot:top="{ }">
                            <div data-html2canvas-ignore="true" class="d-flex mt-5">
                                <div class="ml-3" style="width: 280px;">
                                    <label>{{ $t("deforestation.eudr_reference_number") }}</label>
                                    <v-tooltip top color="00BD73" max-width="350">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon class="icon-with-background primary--text" style="color:#0EBF67"
                                                v-bind="attrs" v-on="on">
                                                mdi-alert-circle
                                            </v-icon>
                                        </template>
                                        <span>{{ $t("deforestation.eudrRefNoInfo") }}</span>
                                    </v-tooltip>
                                    <v-text-field style="width: 290px; " prepend-inner-icon="mdi-magnify" outlined
                                        height="5px" :placeholder="$t('search')" dense v-model="reportSearch"
                                        @input="searchQuery">
                                    </v-text-field>
                                </div>

                                <div class="ml-3" style="width: 280px;">
                                    <label for="text">{{ $t('status') }}</label>
                                    <v-tooltip top color="00BD73" max-width="350">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon class="icon-with-background primary--text" style="color:#0EBF67"
                                                v-bind="attrs" v-on="on">
                                                mdi-alert-circle
                                            </v-icon>
                                        </template>
                                        <span>{{ $t("deforestation.statusInfo") }}</span>
                                    </v-tooltip>
                                    <v-select v-model="reportStatus" item-text="text" item-value="val"
                                        :items="allStatus" @change="filterData" outlined dense>
                                    </v-select>
                                </div>


                                <v-spacer></v-spacer>
                                <div class="py-1 title">
                                    {{ from }} - {{ to }} of
                                    {{ totalDiligenceReports }}
                                </div>
                                <v-btn class="mx-2" fab small outlined color="primary"
                                    :disabled="reportOptions.page <= 1" @click="reportPageChange(false)">
                                    <v-icon dark>
                                        mdi-chevron-left
                                    </v-icon>
                                </v-btn>
                                <v-btn class="mx-2" fab small outlined color="primary"
                                    :disabled="reportOptions.page >= reportTotalPages" @click="reportPageChange(true)">
                                    <v-icon dark>
                                        mdi-chevron-right
                                    </v-icon>
                                </v-btn>

                                <v-menu v-model="document" :close-on-content-click="false" :nudge-width="200" left
                                    :min-width="417">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn class="mx-2" fab small outlined color="primary" v-bind="attrs" v-on="on">
                                            <v-icon dark> mdi-cog-outline </v-icon>
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
                                                    <v-slider v-model="itemsPerPageSlider"
                                                        :tick-labels="itemsPerPageOptions" :max="3" step="1"
                                                        ticks="always" tick-size="4"></v-slider>
                                                </v-list-item-content>
                                            </v-list-item>
                                            <v-divider class="mt-n3"></v-divider>
                                        </v-list>
                                        <v-card-text>
                                            <v-container fluid>
                                                <v-row>
                                                    <v-col class="mt-n9" cols="6" v-for="header in reportHeaders"
                                                        :key="header.value">
                                                        <v-checkbox v-if="header.text" v-model="selectedHeaders"
                                                            :label="header.text" color="primary" :value="header.text"
                                                            hide-details :disabled="header.text == 'ID'"></v-checkbox>
                                                    </v-col>
                                                </v-row>
                                            </v-container>
                                        </v-card-text>
                                        <v-layout justify-center>
                                            <v-card-actions class="mb-5">
                                                <v-spacer></v-spacer>

                                                <v-btn outlined color="primary" @click="resetDefaut" width="190">
                                                    {{ $t("deforestation.restoreDefault") }}
                                                </v-btn>
                                                <v-btn color="primary" @click="resetTableStructure" width="190">
                                                    {{ $t("deforestation.apply") }}
                                                </v-btn>
                                            </v-card-actions>
                                        </v-layout>
                                    </v-card>
                                </v-menu>

                                <v-tooltip top color="black" max-width="350">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn class="mx-2" fab small outlined color="primary" v-bind="attrs" v-on="on"
                                            @click="exportToPDF('document')">
                                            <v-icon dark> mdi-download </v-icon>
                                        </v-btn>
                                    </template>

                                    <span>
                                        {{ $t("deforestation.download") }}
                                    </span>
                                </v-tooltip>
                                <v-tooltip top color="black" max-width="350">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn class="mx-2" fab small outlined color="primary" v-bind="attrs" v-on="on"
                                            @click="printPDF('document')">
                                            <v-icon dark> mdi-printer </v-icon>
                                        </v-btn>
                                    </template>
                                    <span>
                                        {{ $t("deforestation.print") }}
                                    </span>
                                </v-tooltip>
                            </div>
                        </template>
                        <template v-slot:[`item.referenceNumbers`]="{ item }">
                            <div class="d-flex flex-column">
                                <div v-if="item.EUDRReferenceNumber" class="font-weight-medium">
                                    {{ item.EUDRReferenceNumber }}
                                </div>
                                <div class="font-weight-medium">
                                    {{ item.internalReferenceNumber }}
                                </div>
                            </div>
                        </template>

                        <template v-slot:[`item.supplierInfo`]="{ item }">
                            <div class="d-flex flex-column">
                                <div v-if="item.exporter" class="font-weight-medium">
                                    {{ item.exporter.firstName }} {{ item.exporter.lastName }}
                                </div>
                                <div v-if="item.supplier" class="font-weight-medium">
                                    {{ item.supplier.firstName }} {{ item.supplier.lastName }}
                                </div>
                            </div>
                        </template>

                        <template v-slot:[`item.productInfo`]="{ item }">
                            <div class="d-flex flex-row">
                                <!-- <div v-if="item.product || item.subProduct" class="text-caption text-grey">
                                    {{ item.product }}{{ item.subProduct ? '-' + item.subProduct : '' }}
                                </div> -->
                                <div class="font-weight-medium">
                                    {{ item.productDescription || item.productCommonName }}
                                </div>
                            </div>
                        </template>



                        <template v-slot:[`item.createdAt`]="{ item }">
                            {{ getDateFormat(item.createdAt) }}<br>
                            <span :class="item.statusLegends === 'overdue' ? 'orange--text' : 'grey--text'"
                                style="font-size: 12px;">
                                ({{ getDaysOld(item.createdAt) }} Days Old)
                            </span>
                        </template>

                        <template v-slot:[`item.assignedTo`]="{ item }">
                            {{ item.assignedToUser && item.assignedToUser.firstName + ' ' + item.assignedToUser.lastName || '-' }}
                        </template>

                        <template v-slot:[`item.dueDeligenceStatus`]="{ item }">
                            <div class="d-flex">
                                <v-btn small rounded min-width="160" depressed class="blue-button" height="34"
                          v-if="item.status == 'Uploaded to EU Portal'">
                          <!-- getModulePermittedActions.put -->
                          {{ $t("deforestation.uploadedToEU") }}
                        </v-btn>

                        <v-btn small rounded min-width="160" depressed class="gray-button" height="34"
                          v-if="item.status == 'Pending'">
                          <!-- getModulePermittedActions.put -->
                          {{ $t("deforestation.pending") }}
                        </v-btn>
                        <v-btn small rounded min-width="160" depressed class="orange-button" height="34"
                          v-if="item.status == 'Under Review'">
                          <!-- getModulePermittedActions.put -->
                          {{ $t("deforestation.underReview") }}
                        </v-btn>

                        <v-btn small rounded min-width="160" depressed class="green-button" height="34"
                          v-if="item.status == 'Compliant'">
                          {{ $t("deforestation.compliant") }}
                        </v-btn>

                        <div class="status-with-action d-flex" v-if="item.status.toLowerCase() == 'processing farms'">
                          <v-btn small rounded min-width="160" depressed class="orange-button" height="34">
                            {{ $t("deforestation.processingFarm") }}
                          </v-btn>
                          &nbsp;
                          <v-btn v-on:click="handleRefreshDueDiligence" color="primary" fab outlined small>
                            <v-icon dark>mdi mdi-sync</v-icon>
                          </v-btn>
                        </div>

                        <div class="d-flex" v-if="item.status.toLowerCase() == 'analyzing deforestation'">
                          <v-btn small rounded min-width="160" depressed class="orange-button" height="34">
                            {{ $t("deforestation.analyzeDeforestation") }}
                          </v-btn>
                          &nbsp;
                          <v-btn v-on:click="handleRefreshDueDiligence" color="primary" fab outlined small>
                            <v-icon dark>mdi mdi-sync</v-icon>
                          </v-btn>
                        </div>

                        <v-btn small rounded min-width="160" depressed class="orange-button" height="34"
                          v-if="item.status.toLowerCase() == 'writing to blockchain'">
                          {{ $t("dueDiligence.writingToBlockchain") }}
                        </v-btn>

                        <v-btn small rounded min-width="160" depressed class="blue-button" height="34"
                          v-if="item.status.toLowerCase() == 'ready to proceed'">
                          {{ $t("deforestation.readyToProceed") }}
                        </v-btn>


                        <v-btn small rounded min-width="160" depressed class="red-button" height="34"
                          v-if="item.status == 'Non-Compliant'">
                          {{ $t("deforestation.nonCompliant") }}
                        </v-btn>

                        <v-btn small rounded min-width="160" depressed class="green-button" height="34"
                          v-if="item.status == 'Mitigation Required'">
                          {{ $t("deforestation.mitigationRequired") }}
                        </v-btn>
                            </div>
                        </template>

                        <template v-slot:[`item.id`]="{ item }">
                            <div class="d-flex">
                                <img class="ml-1"
                                    :src="isIndonesianClient ? '/img/id/todo-list.svg' : isKenyaClient ? '/img/ke/todo-list.svg' : '/icons/todo-list.png'"
                                    style="width: 34px; height: 34px; border-radius: 50%;"
                                    @click="viewReport(item.id)" />
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <div v-bind="attrs" v-on="on">
                                            <img class="ml-1"
                                                :src="getStatusLegendIconWithRole(item.statusLegends, isDdsExporter)"
                                                style="width: 34px; height: 34px; border-radius: 50%;cursor:pointer" />
                                        </div>
                                    </template>
                                    <span>{{ getStatusLegendTooltipWithRole(item.statusLegends, isDdsExporter) }}</span>
                                </v-tooltip>
                            </div>
                        </template>




                        <template v-slot:footer></template>
                    </v-data-table>
                    <div class="status-legend-section mt-6 mb-4 pa-4">
                        <div class="legend-title font-weight-bold mr-3">
                            {{ $t("deforestation.statusLegend") }}
                            <v-tooltip top color="00BD73" max-width="350">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-icon size="16" class="icon-with-background primary--text" style="color:#0EBF67"
                                        v-bind="attrs" v-on="on">
                                        mdi-information
                                    </v-icon>
                                </template>
                                <span>{{ $t("deforestation.statusLegendInfo") }}</span>
                            </v-tooltip>
                        </div>
                        <div class="legend-item d-inline-flex align-center mr-4 mt-2">
                            <template>
                                <div class="legend-item d-inline-flex align-center mr-4" v-if="isDdsExporter">
                                    <img src="/icons/dds/pending.svg"
                                        style="width: 20px; height: 20px; margin-right: 5px;" />
                                    <span>{{ $t("deforestation.pendingOrNewlyReceived") }} </span>
                                </div>
                                <div class="legend-item d-inline-flex align-center mr-4" v-else>
                                    <img src="/icons/dds/sent.svg"
                                        style="width: 20px; height: 20px; margin-right: 5px;" />
                                    <span>{{ $t("deforestation.sentToExporter") }}</span>
                                </div>
                                <span class="legend-item d-inline-flex align-center mr-4">
                                    <img src="/icons/dds/overdue.svg"
                                        style="width: 20px; height: 20px; margin-right: 5px;" /> {{
                                            $t("deforestation.overdue") }}
                                </span>
                            </template>
                            <span class="legend-item d-inline-flex align-center mr-4">
                                <img src="/icons/dds/updaterequired.svg"
                                    style="width: 20px; height: 20px; margin-right: 5px;" /> {{
                                        $t("deforestation.updateRequired") }}
                            </span>
                            <span class="legend-item d-inline-flex align-center mr-4">
                                <img src="/icons/dds/pendingApproval.svg"
                                    style="width: 20px; height: 20px; margin-right: 5px;" />
                                {{
                                    $t("deforestation.pendingApproval") }}
                            </span>
                            <span class="legend-item d-inline-flex align-center mr-4">
                                <img src="/icons/dds/ptsiapproved.svg"
                                    style="width: 20px; height: 20px; margin-right: 5px;" /> {{
                                        $t("deforestation.approved") }}
                            </span>
                            <span class="legend-item d-inline-flex align-center mr-4">
                                <img src="/icons/dds/temporaryApproved.svg"
                                    style="width: 20px; height: 20px; margin-right: 5px;" />
                                {{
                                    $t("deforestation.temporaryApproved") }}
                            </span>
                            <span class="legend-item d-inline-flex align-center mr-4">
                                <img src="/icons/dds/rejected.svg"
                                    style="width: 20px; height: 20px; margin-right: 5px;" /> {{
                                        $t("deforestation.rejected") }}
                            </span>
                        </div>
                    </div>
                </v-card-text>
            </v-card>
        </div>

        <v-dialog width="40%" @click:outside="hideStops" :retain-focus="false" v-model="showStopModal">
            <v-card class="custom-card" rounded="0">
                <v-toolbar color="primary" class="white--text">
                    <v-toolbar-title class="font-weight-bold">
                        Stops
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon class="white--text" @click="hideStops">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>

                <v-card-text class="black--text">
                    <div class="my-8 ">
                        <h2 class="font-weight-bold">Total Stops: {{ noOfStops }}</h2>
                    </div>
                    <v-row>
                        <v-col cols="12" v-for="(stop, index) in stops" :key="index">
                            <v-sheet class="stop-items">
                                <v-list-item>
                                    <v-list-item-avatar>
                                        <v-avatar color="primary" size="30">
                                            <span class="white--text">{{ index + 1 }}</span>
                                        </v-avatar>
                                    </v-list-item-avatar>
                                    <v-list-item-content>
                                        <v-list-item-title class="font-weight-bold">{{ stop.title }}</v-list-item-title>
                                        <v-list-item-subtitle>{{ stop.address }}</v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-sheet>
                        </v-col>
                    </v-row>


                    <v-card-actions class="mt-10" style="padding-right: 0">
                        <v-spacer></v-spacer>
                        <v-btn class="mr-2" right height="44" width="116" depressed color="primary" @click="hideStops">
                            {{ $t("close") }}
                        </v-btn>
                    </v-card-actions>
                </v-card-text>
            </v-card>
        </v-dialog>

        <!-- Confirmation Dialog -->
        <ConfirmBox :title="$t('dueDiligence.assignShipment')" :message="assignConfirmationMessage"
            :cancelBtnText="$t('cancel')" :confirmBtnText="$t('dueDiligence.assignButton')"
            :dialog="showAssignConfirmationDialog" @cancel:action="cancelAssignUser"
            @continue:action="confirmAssignUser" />

        <!-- Request Additional Information Modal -->
        <!-- Request Additional Information Modal -->
        <RequestAdditionalInformation @close-modal="closeRequestAdditionalInformationDialog"
            v-if="requestAdditionalInformationDialog" :dialog="requestAdditionalInformationDialog"
            :supplierId="report?.userId" :visibleSelectedTabs="visibleSelectedTabs" />

    <!-- Approval Confirmation Modal -->
        <ApprovalConfirmationModal :dialog="showApprovalModal" :selectedReportsCount="1"
        @close="handleApprovalCancel" @confirm="handleApprovalConfirm" />
        
        <!-- Rejection Confirmation Modal -->
        <RejectionConfirmationModal :dialog="showRejectionModal" :selectedReportsCount="1"
        @close="handleRejectionCancel" @confirm="handleRejectionConfirm" />

        <ProcessingModal :dialog="showPocessingModal" @close="showPocessingModal = false" />

    </div>
</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin";
import download from "@/mixins/DownloadMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import DateMixin from '@/mixins/DateMixin';
import DeforestationService from "@/_services/DeforestationService";
import printJS from "print-js";
import moment from 'moment';
import html2pdf from "html2pdf.js";
import { isIndonesianClient, currentRoles, isDdsExporter, isKenyaClient } from "@/utils";
import ConfirmBox from "@/components/ConfirmBox.vue";
import UserListService from "@/_services/UserListService";
import RequestAdditionalInformation from "../components/RequestAdditionalInformation.vue";
import ApprovalConfirmationModal from "./ApproveCinformationModel.vue";
import RejectionConfirmationModal from "../components/RejectionConfirmationModal.vue";
import ProcessingModal from "../components/modals/ProcessingModal.vue";
import { wait} from '@/utils.js';

export default {
    created() {
        this.fetchData()
        this.fetchAssignedToList();
    },
    components: {
        ConfirmBox,
        RequestAdditionalInformation,
        ApprovalConfirmationModal,
        RejectionConfirmationModal,
        ProcessingModal
    },
    computed: {
        isKenyaClient() {
            return isKenyaClient();
        },
        isWorkerOnly(){
            const roles = currentRoles()
            if(roles?.length == 1 && roles.includes('indonesia_ptsi_worker')) {
                return true
            }
            return false
        },
        totalPages() {
            return 1
        },
        getCurrentUser() {
            return this.$store.getters.getUser
        },
        getShippmentNo() {
            return parseInt(this.$route.params.id)
        },
        isIndonesianClient() {
            return isIndonesianClient()
        },
        isDdsExporter() {
            return isDdsExporter();
        },
        // Get current assigned user name for display
        currentAssignedUserName() {
            if (this.shipment?.assignedToCfId && this.assignedToOptions.length > 0) {
                const currentUser = this.assignedToOptions.find(user => user.value === this.shipment.assignedToCfId);
                return currentUser ? currentUser.name : '';
            }
            return '';
        },

        // Get current shipment assignment status
        currentShipmentStatus() {
            return this.shipment?.statusLegends || 'pending';
        },

        // Get assignment date formatted
        formattedAssignmentDate() {
            if (this.shipment?.assignedDate) {
                return this.getDateFormat(this.shipment.assignedDate);
            }
            return '';
        },
    },

    mounted() {
        this.tableHeaders = this.reportHeaders;
        this.selectedHeaders = this.allSelectedHeaders;
    },
    watch: {
        reportOptions: {
            async handler() {
                await this.getDeforestationEUDR()
            },
            deep: true,
        },
    },

    data() {
        return {
            showPocessingModal:false,
            reportAssignedTo: null,
            selectedUserForAssignment: null,
            assignedToSearch: "",
            assignedToOptions: [],
            internalReferenceNumber: '',
            assignConfirmationMessage: '',
            showAssignConfirmationDialog: false,
            shipment: null,
            headerProps: {
                'sort-icon': 'mdi-menu-up'
            },
            stops: [],
            noOfStops: 0,
            shipmentInput: null,
            shipment_status: null,
            id: null,
            shipment_id: null,
            showStopModal: false,
            loading: false,
            totalShipments: 2,
            tab: 0,
            selectedItem: false,
            options: {
                itemsPerPage: 10,
                page: 1
            },
            search: "",
            from: 0,
            to: 0,
            totalDiligenceReports: 0,
            totalDiligenceReportsPages: 0,
            selectedHeaders: [],
            diligenceReports: [],
            tableHeaders: [],
            reportStatus: "",
            reportSearch: "",
            reportHeaders: [
                {
                    text: this.$t("deforestation.eudrAndInternalRefNo"),
                    align: "start",
                    value: "referenceNumbers",
                    class: "black--text",
                    sortable: true,
                    width: "200px",
                },
                {
                    text: this.$t("deforestation.exporterAndSupplier"),
                    align: "start",
                    value: "supplierInfo",
                    class: "black--text",
                    sortable: true,
                    width: "200px",
                },
                {
                    text: this.$t("deforestation.product"),
                    align: "start",
                    value: "productInfo",
                    class: "black--text",
                    sortable: true,
                    width: "250px",
                },
                {
                    text: this.$t("deforestation.submissionDate"),
                    align: "start",
                    value: "createdAt",
                    class: "black--text",
                    sortable: true,
                    width: "150px",
                },
                {
                    text: this.$t("deforestation.assignTo"),
                    align: "start",
                    value: "assignedTo",
                    class: "black--text",
                    sortable: false,
                    width: "150px",
                },
                {
                    text: this.$t("deforestation.dueDeligenceStatus"),
                    align: "center",
                    value: "dueDeligenceStatus",
                    class: "black--text",
                    sortable: false,
                    width: "200px",
                },
                {
                    text: "",
                    align: "start",
                    value: "id",
                    class: "black--text",
                    sortable: false,
                    width: "100px",
                },
            ],
            reportOptions: {
                itemsPerPage: 10,
                page: 1,
            },
            allStatus: [
                { text: this.$t("deforestation.allStatus"), val: "" },
                {
                    text: this.$t("deforestation.uploadedToEU"),
                    val: "Uploaded to EU Portal",
                },
                { text: this.$t("deforestation.pending"), val: "Pending" },
                { text: this.$t("deforestation.underReview"), val: "Under Review" },
            ],

            shipmentStatus: [
                {
                    text: this.$t("deforestation.enRoute"),
                    val: "En Route",
                },
                { text: this.$t("deforestation.delivered"), val: "Delivered" },
            ],
            statusModel: '',
            reportTotalPages: null,
            document: '',
            toDiligenceReports: 0,
            fromDiligenceReports: 0,
            customizeMenu: false,
            customizeMenuAll: false,
            itemsPerPageOptions: [5, 10, 25, 50],
            itemsPerPageSlider: 10,
            allSelectedHeaders: [
                this.$t("deforestation.eudrRefNo"),
                this.$t("deforestation.internalRefNo"),
                this.$t("deforestation.supplier"),
                this.$t("deforestation.product"),
                this.$t("deforestation.noOfFarms"),
                this.$t("deforestation.quantity"),
                this.$t("deforestation.country"),
                this.$t("deforestation.lastUpdated"),
                this.$t("deforestation.dueDeligenceStatus"),
                this.$t('deforestation.actions'),
            ],
            breadcrumbs: [
                {
                    text: this.$t("dashboard"),
                    disabled: false,
                    exact: true,
                },
                {
                    text: this.$t("listOfShipments"),
                    disabled: true,
                    href: "breadcrumbs_link_1",
                },
                {
                    text: this.$t("viewShipment"),
                    disabled: true,
                    href: "breadcrumbs_link_2",
                },
            ],
            requestAdditionalInformationDialog: false,
            visibleSelectedTabs: ['dueDiligenceReports'],
            showApprovalModal: false,
            showRejectionModal: false,
        };
    },
    methods: {
        async downloadDetailsPage() {
            this.startLoading();
            const element = document.querySelector("#shippingDetails");
            html2pdf(element, {
                margin: 0,
                filename: "ShippingDetails.pdf",
                image: { type: "jpeg", quality: 1 },
                html2canvas: { scale: 3, letterRendering: true },
                jsPDF: {
                    unit: "in",
                    format: "letter",
                    orientation: "landscape",
                    compress: false,
                },
            });
            this.stopLoading();
        },
        async handleStatusChange() {
            try {
                let input = {
                    id: parseInt(this.$route.params.id),
                    status: this.statusModel
                }
                await DeforestationService.updateStatus(input).then(() => {
                    this.fetchData();
                })
            } catch (err) {
                this.error = err.message || this.$t('somethingWentWrong');
                this.$notify({
                    title: this.error,
                    type: "error",
                });
            }
        },
        getStatusLegendIcon(statusLegend) {
            const iconMap = {
                'pending': '/icons/dds/pending.svg',
                'overdue': '/icons/dds/overdue.svg',
                'update_required': '/icons/dds/updaterequired.svg',
                'pending_approval': '/icons/dds/pendingApproval.svg',
                'approved': '/icons/dds/ptsiapproved.svg',
                'temporary_approved': '/icons/dds/temporaryApproved.svg',
                'rejected': '/icons/dds/rejected.svg'
            };

            return iconMap[statusLegend] || iconMap[statusLegend?.toLowerCase()] || '/icons/dds/pending.svg';
        },
        getStatusLegendTooltip(statusLegend) {
            const tooltipMap = {
                'pending': this.$t("deforestation.pendingOrNewlyReceived"),
                'overdue': this.$t("deforestation.overdue"),
                'update_required': this.$t("deforestation.updateRequired"),
                'pending_approval': this.$t("deforestation.pendingApproval"),
                'approved': this.$t("deforestation.approved"),
                'temporary_approved': this.$t("deforestation.temporaryApproved"),
                'rejected': this.$t("deforestation.rejected")
            };

            return tooltipMap[statusLegend] || tooltipMap[statusLegend?.toLowerCase()] || this.$t("deforestation.pendingOrNewlyReceived");
        },
        getStatusLegendIconWithRole(statusLegend, isDdsExporter) {
            if (statusLegend && statusLegend.toLowerCase() === 'pending' && !isDdsExporter) {
                return '/icons/dds/sent.svg';
            }

            return this.getStatusLegendIcon(statusLegend);
        },
        getStatusLegendTooltipWithRole(statusLegend, isDdsExporter) {
            if (statusLegend && statusLegend.toLowerCase() === 'pending' && !isDdsExporter) {
                return this.$t("deforestation.sentToExporter");
            }
            return this.getStatusLegendTooltip(statusLegend);
        },
        async fetchData() {
            await this.fetchAssignedToList()
            await this.getShipmentDetails()
            await this.getDeforestationEUDR()
        },

        async exportToPDF() {
            this.startLoading();
            const element = document.querySelector(".v-data-table__wrapper");
            html2pdf(element, {
                margin: 1,
                filename: "DiligenceReport.pdf",
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { dpi: 200, letterRendering: true },
                jsPDF: {
                    unit: "in",
                    format: "letter",
                    orientation: "landscape",
                    compress: false,
                },
            });
            this.stopLoading();
        },
        async printPDF() {
            const element = document.querySelector(".v-data-table__wrapper");
            let opt = {
                margin: 1,
                filename: "DiligenceReport.pdf",
                image: { type: "jpeg", quality: 0.95 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
            };

            let worker = await html2pdf()
                .set(opt)
                .from(element)
                .toCanvas()
                .outputPdf("blob", "DiligenceReport.pdf");
            let file = new File([worker], "DiligenceReport.pdf", {
                type: "application/pdf",
            });
            var pdfUrl = await URL.createObjectURL(file);
            await printJS({ printable: `${pdfUrl}`, type: "pdf", showModal: true });
        },
        async resetDefaut() {
            this.tableHeaders = this.reportHeaders;
            this.selectedHeaders = this.allSelectedHeaders;
            this.menu = false;
            await this.getDeforestationEUDR()
        },
        async resetTableStructure() {
            this.tableHeaders = this.reportHeaders.filter((header) =>
                this.selectedHeaders.includes(header.text)
            );
            this.reportOptions.itemsPerPage = this.itemsPerPageOptions[
                this.itemsPerPageSlider
            ];
            await this.getDeforestationEUDR();
            (this.customizeMenu = false), (this.customizeMenuAll = false);
        },

        async getShipmentDetails() {
            try {
                this.startLoading();
                this.id = parseInt(this.$route.params.id);
                this.shipmentInput = { id: this.id, shipment_status: this.shipment_status }
                const res = await DeforestationService.shipmentDetail(this.shipmentInput);
                this.shipment = res.data.shipmentDetail;
                this.shipment_id = this.shipment.id
                this.stops = res.data.shipmentDetail.shipment_stops;
                this.noOfStops = this.stops.length
                this.statusModel = this.shipment.status;

                // Set the current assigned user in the dropdown if exists
                if (this.shipment.assignedToCfId && this.assignedToOptions.length > 0) {
                    const currentAssignedUser = this.assignedToOptions.find(user => user.value === this.shipment.assignedToCfId);
                    if (currentAssignedUser) {
                        this.reportAssignedTo = currentAssignedUser.value;
                    }
                }
            } catch (err) {
                this.error = err.message || this.$t('somethingWentWrong');
                this.$notify({
                    title: this.error,
                    type: "error",
                });
            } finally {
                this.stopLoading();
            }
        },

        async getDeforestationEUDR() {
            this.loading = true;
            const requestParams = {
                page: this.reportOptions.page,
                limit: this.reportOptions.itemsPerPage,
                searchPhrase: this.reportSearch,
                country: this.reportCountry,
                status: this.reportStatus,
                shipment_id: parseInt(this.shipment_id),
                cfroles: currentRoles()
            };


            if (this.reportOptions) {
                requestParams.orderField = this.reportOptions.sortBy.length ? this.reportOptions.sortBy[0] : "createdAt";
                requestParams.order = this.reportOptions.sortDesc.length && this.reportOptions.sortDesc[0] ? "DESC" : "ASC";
            }
            DeforestationService.getDiligenceReportsByShipment(requestParams)
                .then((res) => {
                    this.diligenceReports = res.data.diligenceReportsByShipment.rows;
                    this.totalDiligenceReports = res.data.diligenceReportsByShipment.totalCount;

                    this.totalDiligenceReportsPages = Math.ceil(
                        this.totalDiligenceReports / this.reportOptions.itemsPerPage
                    );
                    this.from = (this.reportOptions.page - 1) * this.reportOptions.itemsPerPage + 1;
                    this.to = this.reportOptions.page * this.reportOptions.itemsPerPage;

                    if (this.diligenceReports.length > 0) {
                        this.to -= this.reportOptions.itemsPerPage - this.diligenceReports.length;
                    } else {
                        this.to -= this.reportOptions.itemsPerPage;
                    }

                    // Set the current assigned user in the dropdown if exists
                    if (this.diligenceReports.assignedToCfId && this.assignedToOptions.length > 0) {
                        const currentAssignedUser = this.assignedToOptions.find(user => user.value === this.diligenceReports.assignedToCfId);
                        if (currentAssignedUser) {
                            this.reportAssignedTo = currentAssignedUser.value;
                        }
                    }
                    // use dummy for now
                    this.loading = false;
                })
                .catch((err) => {
                    this.loading = false;
                    this.$notify({
                        text: err.message || this.$t('Failed to fetch due diligence reports'),
                        type: 'error'
                    });
                });
        },

        handleAssignUserChange() {
            // This method is called when the dropdown value changes
            // We don't need to do anything here as the actual assignment is handled in selectAssignUserFromDropdown
        },

        selectAssignUserFromDropdown(user) {
            this.selectedUserForAssignment = user;
            this.assignConfirmationMessage = this.$t('dueDiligence.assignShipmentConfirmation', {
                userName: user.name,
                shipmentId: this.shipment?.shipment_refrence_number || this.$route.params.id
            });
            this.showAssignConfirmationDialog = true;
        },

        cancelAssignUser() {
            this.showAssignConfirmationDialog = false;
            this.selectedUserForAssignment = null;
            // Restore the previous assignment value
            if (this.shipment) {
                this.reportAssignedTo = this.shipment.assignedToCfId;
            }
        },

        async confirmAssignUser() {
            this.startLoading();
            try {
                let response;

                if (this.selectedUserForAssignment) {
                    // Assigning to a user
                    const input = {
                        shipmentIds: [parseInt(this.$route.params.id)],
                        assignedTo: parseInt(this.selectedUserForAssignment.value, 10)
                    };

                    response = await DeforestationService.bulkAssignShipments(input);
                } else {
                    // Unassigning (clearing assignment)
                    const input = {
                        shipmentIds: [parseInt(this.$route.params.id)],
                        assignedTo: null
                    };

                    response = await DeforestationService.bulkAssignShipments(input);
                }

                if (response && response.data && response.data.bulkAssignShipments) {
                    if (response.data.bulkAssignShipments.success) {
                        const action = this.selectedUserForAssignment ? 'assigned' : 'unassigned';
                        this.$notify({
                            text: this.$t(`Report ${action} successfully`),
                            type: 'success'
                        });

                        // Update local assignment data immediately
                        if (this.shipment) {
                            if (this.selectedUserForAssignment) {
                                this.shipment.assignedTo = parseInt(this.selectedUserForAssignment.value, 10);
                                this.shipment.assignedToCfId = parseInt(this.selectedUserForAssignment.value, 10);
                                this.shipment.assignedDate = new Date();
                                this.shipment.statusLegends = 'pending_approval';
                            } else {
                                this.shipment.assignedTo = null;
                                this.shipment.assignedToCfId = null;
                                this.shipment.assignedDate = null;
                                this.shipment.statusLegends = 'pending';
                            }
                        }

                        // Refresh the shipment details to get updated data from server
                        await this.getShipmentDetails();

                        // Refresh the report data to show updated assignment
                        await this.getDeforestationEUDR();
                    } else {
                        this.$notify({
                            text: response.data.bulkAssignShipments.message || this.$t('Failed to update report assignment'),
                            type: 'error'
                        });
                        // Reset on failure - restore previous value
                        if (this.shipment) {
                            this.reportAssignedTo = this.shipment.assignedToCfId;
                        }
                    }
                } else {
                    this.$notify({
                        text: this.$t('Unexpected response from server'),
                        type: 'error'
                    });
                    // Reset on failure - restore previous value
                    if (this.shipment) {
                        this.reportAssignedTo = this.shipment.assignedToCfId;
                    }
                }
            } catch (error) {
                console.error('Error updating report assignment:', error);
                this.$notify({
                    text: this.$t('An error occurred while updating report assignment'),
                    type: 'error'
                });
                // Reset on failure - restore previous value
                if (this.shipment) {
                    this.reportAssignedTo = this.shipment.assignedToCfId;
                }
            } finally {
                this.stopLoading();
                this.showAssignConfirmationDialog = false;
                this.selectedUserForAssignment = null;
            }
        },

        async fetchAssignedToList() {
            try {
                const response = await UserListService.getAssignedToList();
                const data = response?.data?.rows || [];
                if (data && Array.isArray(data)) {
                    this.assignedToOptions = data.map(user => ({
                        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
                        value: user.cf_userid || user.id // Use cf_userid to match with assignedToCfId
                    }));
                }
            } catch (error) {
                console.error('Error fetching assigned to list:', error);
                this.$notify({
                    text: this.$t('Failed to fetch assigned users list'),
                    type: 'error'
                });
            }
        },
        handleApproveReport() {
            // Show the approval confirmation modal
            this.showApprovalModal = true;
        },
        handleApprovalCancel() {
            this.showApprovalModal = false;
        },

        async handleApprovalConfirm(approvalData) {
             try {
               const input = {
                    shipmentIds: [parseInt(this.$route.params.id, 10)],
                    isTemporaryApproval: approvalData.isTemporaryApproval
                };

                if (approvalData.isTemporaryApproval) {
                    input.approvalExpirationValue = approvalData.approvalExpirationValue;
                    input.approvalExpirationUnit = approvalData.approvalExpirationUnit;
                }


                this.showPocessingModal = true;
                const response = await DeforestationService.bulkApproveShipments(input);
                const responseData = response?.data.bulkApproveShipments
                console.log('Bulk approve response:', responseData);

                if(responseData?.jobs?.length){
                    this.$notify({
                        text: 'The approval has been successfully completed. Writing to blockchain may take a few minutes.',
                        type: 'info'
                    });
                    await this.getDeforestationEUDR()
                    this.loading = false;
                }

                let job = responseData.jobs;
                let stopWaiting = false;
                this.showPocessingModal = true;

                const timeout = setTimeout(() => {
                stopWaiting = true;
                this.showPocessingModal = false;
                this.$notify({
                    text: 'Writing deforestation data to blockchain is taking longer than expected. You can continue working and check the status later in the Job History section.',
                    type: 'warning'
                });
                }, 100000); // 80 seconds

                while (!stopWaiting && this.showPocessingModal) {
                await wait(8000);
                const jobIDS = job.map(j => parseInt(j.id)); 
                const response = await DeforestationService.getJobs(jobIDS);

                if (!response?.data?.getJobs?.length) {
                    this.$notify({
                    text: 'Failed to write deforestation data to blockchain, please try again.',
                    type: 'error'
                    });
                }

                const allCompleted = response.data.getJobs.every(j => j.status === 'Completed' || j.status === 'Failed');
                if (allCompleted) {
                    clearTimeout(timeout);
                    await wait(1500);
                    this.showPocessingModal = false;
                    await this.getDeforestationEUDR()
                    this.$notify({
                    text: 'Report Successfully Approved & Written to Blockchain',
                    type: 'success'
                    });
                    break;
                }
                // if modal was closed manually during wait, stop the loop
                if (!this.showPocessingModal) break;
                }
                clearTimeout(timeout);
            } catch (error) {
                console.error('Error approving reports:', error);
                this.$notify({
                text: 'An error occurred while approving reports',
                type: 'error'
                });
            } finally {
                this.loading = false;
                // Close modal and clear selection
                this.showApprovalModal = false;
                this.selectedReports = [];
            }
        },

        // Rejection Methods
        handleRejectReport() {
            // Show the rejection confirmation modal
            this.showRejectionModal = true;
        },

        handleRejectionCancel() {
            this.showRejectionModal = false;
        },

        async handleRejectionConfirm(rejectionData) {
            try {
                this.startLoading();

                const input = {
                    shipmentIds: [parseInt(this.$route.params.id, 10)],
                    reason: rejectionData.reason
                };

                const response = await DeforestationService.bulkRejectShipments(input);

                if (response && response.data && response.data.bulkRejectShipments) {
                    if (response.data.bulkRejectShipments.success) {
                        this.$notify({
                            text: response.data.bulkRejectShipments.message || this.$t('Report rejected successfully'),
                            type: 'success'
                        });

                        this.$router.push({ name: 'dds_root_due_diligence_report' });
                    } else {
                        this.$notify({
                            text: response.data.bulkRejectShipments.message || this.$t('Failed to reject report'),
                            type: 'error'
                        });
                    }
                } else {
                    console.error('Unexpected response structure:', response);
                    this.$notify({
                        text: this.$t('Unexpected response from server'),
                        type: 'error'
                    });
                }
            } catch (error) {
                console.error('Error rejecting report:', error);
                this.$notify({
                    text: this.$t('An error occurred while rejecting report'),
                    type: 'error'
                });
            } finally {
                this.stopLoading();
                // Close modal
                this.showRejectionModal = false;
            }
        },
        goBack() {
            this.$router.go(-1);
        },
        requestAdditionalInformation() {
            this.requestAdditionalInformationDialog = true;
        },
        closeRequestAdditionalInformationDialog() {
            this.requestAdditionalInformationDialog = false;
        },


        filterData() {
            this.getDeforestationEUDR();
        },

        reportPageChange(t) {
            if (t) this.reportOptions.page = this.reportOptions.page + 1;
            else this.reportOptions.page = this.reportOptions.page - 1;
            this.getDeforestationEUDR()
        },

        showStops() {
            this.showStopModal = true
        },
        hideStops() {
            this.showStopModal = false
        },

        getDateFormat(date) {
            return moment(date).format("DD-MMM-YYYY");
        },

        getDaysOld(date) {
            const now = moment();
            const createdDate = moment(date);
            const daysOld = now.diff(createdDate, 'days');
            return daysOld;
        },


        selectItem(item) {
            this.selectedItem = item;
        },
        searchQuery() {
            clearTimeout(this.debounceTimer)
            this.debounceTimer = setTimeout(() => {
                this.options.page = 1;
                this.getDeforestationEUDR();
            }, 500)
        },
        resetSearchOnEmpty() {
            this.search = ''
            this.countryModel = ''
            this.statusModel = ''
            this.regionModelregionModel = ''
            this.options = {
                page: 1,
                limit: 10
            }
        },
        pageChange(t) {
            if (t) this.options.page = this.options.page + 1;
            else this.options.page = this.options.page - 1;
            console.log("true")
        },

        viewReport(id) {
            this.$router.push({ name: 'viewSummaryReport', params: { id: id } })
        },
        triggerSubmit() {
            if (this.submit) {
                this.submit = false
            } else {
                this.submit = true
            }
        },
        discard() {
            this.discard = true
        },

        // change this for shipment details
        downloadFinalReport(downloadType) {
            const isPtsiRole = isIndonesianClient() ? "ptsi" : isKenyaClient() ? "naccu" : "non-ptsi";
            if (downloadType == 'pdf') {
                this.startLoading()
                this.downloadSourceFile(`${process.env.VUE_APP_DEFORESTRATION_REPORTING_API_BASE_URL}/diligence-report/final-report-pdf/${this.$route.params.id}/basic/${isPtsiRole}`, "application/pdf", "dds-final-report.pdf")
                    .then(() => {
                        this.stopLoading()
                    }).catch(() => {
                        this.stopLoading()
                    })
            }

            if (downloadType == 'json') {
                this.startLoading()
                this.getFormattedJSON()
                    .then(() => {
                        this.stopLoading()
                    }).catch(() => {
                        this.stopLoading()
                    })
            }
        },

    },
    mixins: [loadingMixin, download, getPermittedActions, DateMixin],
};
</script>
<style lang="scss" scoped>
.value {
    font-size: 18px;
    font-weight: 700;
    line-height: 22px;
    text-align: left;
    color: #1E1E1E;
    margin-top: 5px;
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

// ::v-deep .v-data-table-header {
//   background-color: #FFB443 !important;
//   color: #1E1E1E;
// }

// ::v-deep .v-data-table-header span {
//   color: #1E1E1E !important;
// }

.heading-title {
    font-weight: 600;
    font-size: 22px;
    color: #1e1e1e;
}

.v-avatar {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
}

.font-weight-bold {
    font-weight: bold !important;
}

.mt-5 {
    margin-top: 20px;
}

.stop-items {
    border: none;
    border-bottom: 1px solid #E1E1E1;
    box-shadow: none;
    padding: 10px 0;
}

.green-button {
    background-color: #c1ffe7 !important;
    /* Green background */
    border: 2px solid #489e16 !important;
    /* Red border */
    color: #489e16 !important;
}

.green-shadow {
    color: #00bd73 !important;
}

.red-button {
    background-color: #fdebeb !important;
    /* Green background */
    border: 2px solid #da3d3d !important;
    /* Red border */
    color: #da3d3d !important;
}

.orange-button {
    background-color: #fff7ec !important;
    /* Green background */
    border: 2px solid #ffa826 !important;
    /* Red border */
    color: #ffa826 !important;
}

.blue-button {
    background-color: #d0e6fe !important;
    /* Green background */
    border: 2px solid #002287 !important;
    /* Red border */
    color: #002287 !important;
}

.gray-button {
    background-color: #e8e8e8 !important;
    /* Green background */
    border: 2px solid #000000 !important;
    /* Red border */
    color: #000000 !important;
}
</style>
