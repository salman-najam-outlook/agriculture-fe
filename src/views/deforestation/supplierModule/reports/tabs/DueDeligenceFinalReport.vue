<template>
    <div>
        <v-container fluid>
            <div class="cmt-box">
                <v-card elevation="0">
                    <v-card class="mb-5" flat>
                        <v-card-text>
                            <v-row class="pl-3">
                                <v-col sm="3">
                                    <div class="item-box">
                                        <p class="text-subtitle-1 mb-2"> {{ $t('dueDiligence.internalReferenceNumber')}}
                                        </p>
                                        <p class="text-subtitle-1 font-weight-bold"> 2AF4EQR23259
                                        </p>

                                    </div>
                                </v-col>

                                <v-col sm="3">
                                    <div class="item-box">
                                        <p class="text-subtitle-1 mb-2"> EUDR Reference Number
                                        </p>
                                        <p class="text-subtitle-1 font-weight-bold"> DD-00962
                                        </p>

                                    </div>
                                </v-col>

                                <v-col sm="3">
                                    <div class="item-box">
                                        <p class="text-subtitle-1 mb-2"> Activity
                                        </p>
                                        <p class="text-subtitle-1 font-weight-bold"> Import
                                        </p>

                                    </div>
                                </v-col>

                                <v-col sm="3">
                                    <div class="item-box">
                                        <p class="text-subtitle-1 mb-2"> Country of Activity
                                        </p>
                                        <p class="text-subtitle-1 font-weight-bold"> Peru
                                        </p>

                                    </div>
                                </v-col>


                                <v-col sm="3">
                                    <div class="item-box">
                                        <p class="text-subtitle-1 mb-2"> Country of Entry
                                        </p>
                                        <p class="text-subtitle-1 font-weight-bold"> Germany
                                        </p>

                                    </div>
                                </v-col>

                                <v-col sm="3">
                                    <div class="item-box">
                                        <p class="text-subtitle-1 mb-2"> Due Diligence Report Status
                                        </p>
                                        <v-chip variant="elevated" color="red" outlined>
                                            Non-Compliant
                                        </v-chip>
                                    </div>
                                </v-col>
                            </v-row>

                            <v-row class="pl-3">
                                <v-col sm="12">
                                    <div class="item-box">
                                        <h2 class="font-weight-bold"> Operator Data </h2>
                                    </div>
                                </v-col>
                                <v-col sm="3">
                                    <div class="item-box">
                                        <p class="text-subtitle-1 mb-2"> Name
                                        </p>
                                        <p class="text-subtitle-1 font-weight-bold"> Mathew Charles
                                        </p>

                                    </div>
                                </v-col>

                                <v-col sm="3">
                                    <div class="item-box">
                                        <p class="text-subtitle-1 mb-2"> Country
                                        </p>
                                        <p class="text-subtitle-1 font-weight-bold"> Germany
                                        </p>

                                    </div>
                                </v-col>

                                <v-col sm="3">
                                    <div class="item-box">
                                        <p class="text-subtitle-1 mb-2"> ISO Code
                                        </p>
                                        <p class="text-subtitle-1 font-weight-bold"> DEU
                                        </p>
                                    </div>
                                </v-col>

                                <v-col sm="3">
                                    <div class="item-box">
                                        <p class="text-subtitle-1 mb-2"> EORI Number
                                        </p>
                                        <p class="text-subtitle-1 font-weight-bold"> DE123456789012
                                        </p>
                                    </div>
                                </v-col>

                            </v-row>

                            <v-row class="pl-3">
                                <v-col sm="12">
                                    <div class="item-box">
                                        <h2 class="font-weight-bold"> Supplier Data </h2>
                                    </div>
                                </v-col>
                                <v-col sm="3">
                                    <div class="item-box">
                                        <p class="text-subtitle-1 mb-2"> Name
                                        </p>
                                        <p class="text-subtitle-1 font-weight-bold"> Mathew Charles
                                        </p>

                                    </div>
                                </v-col>

                                <v-col sm="3">
                                    <div class="item-box">
                                        <p class="text-subtitle-1 mb-2"> Email
                                        </p>
                                        <p class="text-subtitle-1 font-weight-bold"> William456@gmail.com
                                        </p>

                                    </div>
                                </v-col>

                                <v-col sm="3">
                                    <div class="item-box">
                                        <p class="text-subtitle-1 mb-2"> Phone Number
                                        </p>
                                        <p class="text-subtitle-1 font-weight-bold"> 092 563256 896
                                        </p>
                                    </div>
                                </v-col>

                                <v-col sm="3">
                                    <div class="item-box">
                                        <p class="text-subtitle-1 mb-2"> Country
                                        </p>
                                        <p class="text-subtitle-1 font-weight-bold"> Peru
                                        </p>
                                    </div>
                                </v-col>

                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-card>

                <v-card elevation="0">
                    <v-card class="mb-5" flat>
                        <v-card-text>
                            <v-row class="pl-2 mb-2">
                                <v-col sm="12">
                                    <v-toolbar-title class="font-weight-bold">
                                        Report Summery
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn class="mx-2" fab x-small dark v-bind="attrs" v-on="on"
                                                    color="primary">
                                                    <v-icon>mdi-exclamation</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>Info</span>
                                        </v-tooltip>
                                    </v-toolbar-title>
                                </v-col>
                            </v-row>
                            <v-row class="pl-3">
                                <v-col sm="3">
                                    <div class="item-box">
                                        <p class="text-subtitle-1 mb-2"> Total Number of Geofence Polygons
                                        </p>
                                        <p class="text-subtitle-1 font-weight-bold"> 58
                                        </p>

                                    </div>
                                </v-col>

                                <v-col sm="3">
                                    <div class="item-box">
                                        <p class="text-subtitle-1 mb-2"> Total Number of Geofence Points
                                        </p>
                                        <p class="text-subtitle-1 font-weight-bold"> 36
                                        </p>
                                    </div>
                                </v-col>

                                <v-col sm="3">
                                    <div class="item-box">
                                        <p class="text-subtitle-1 mb-2"> Total Number of Farms
                                        </p>
                                        <p class="text-subtitle-1 font-weight-bold"> 94
                                        </p>
                                    </div>
                                </v-col>

                                <v-col sm="3">
                                    <div class="item-box">
                                        <p class="text-subtitle-1 mb-2"> Total Area (ha)
                                        </p>
                                        <p class="text-subtitle-1 font-weight-bold"> 94
                                        </p>
                                    </div>
                                </v-col>

                                <v-col sm="3">
                                    <div class="item-box">
                                        <p class="text-subtitle-1 mb-2"> Total Number of Deforestation <br> Assessments
                                        </p>
                                        <p class="text-subtitle-1 font-weight-bold"> 94
                                        </p>
                                    </div>
                                </v-col>

                                <v-col sm="3">
                                    <div class="item-box">
                                        <p class="text-subtitle-1 mb-2"> Total Number of High Deforestation <br> Farms
                                        </p>
                                        <p class="text-subtitle-1 font-weight-bold"> 8
                                        </p>
                                    </div>
                                </v-col>

                                <v-col sm="3">
                                    <div class="item-box">
                                        <p class="text-subtitle-1 mb-2"> Total Number of Risk Assessments
                                        </p>
                                        <p class="text-subtitle-1 font-weight-bold"> 20
                                        </p>
                                    </div>
                                </v-col>

                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-card>

                <v-card elevation="0">
                    <v-card class="mb-5" flat>
                        <v-card-text>
                            <v-row class="pl-2 mb-2">
                                <v-col sm="12">
                                    <v-toolbar-title class="font-weight-bold">
                                        Product Details
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn class="mx-2" fab x-small dark v-bind="attrs" v-on="on"
                                                    color="primary">
                                                    <v-icon>mdi-exclamation</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>Info</span>
                                        </v-tooltip>
                                    </v-toolbar-title>
                                </v-col>
                            </v-row>
                            <v-row class="pl-3">
                                <v-col sm="3">
                                    <div class="item-box">
                                        <p class="text-subtitle-1 mb-2"> Product
                                        </p>
                                        <p class="text-subtitle-1 font-weight-bold"> 0902 - Coffee, whether or not
                                        </p>

                                    </div>
                                </v-col>

                                <v-col sm="3">
                                    <div class="item-box">
                                        <p class="text-subtitle-1 mb-2"> Product Description
                                        </p>
                                        <p class="text-subtitle-1 font-weight-bold"> coffee husks and skins; coffee
                                        </p>
                                    </div>
                                </v-col>

                                <v-col sm="3">
                                    <div class="item-box">
                                        <p class="text-subtitle-1 mb-2"> Total Number of Farms
                                        </p>
                                        <p class="text-subtitle-1 font-weight-bold"> 94
                                        </p>
                                    </div>
                                </v-col>

                                <v-col sm="3">
                                    <div class="item-box">
                                        <p class="text-subtitle-1 mb-2"> Net Mass (KG)
                                        </p>
                                        <p class="text-subtitle-1 font-weight-bold"> 600
                                        </p>
                                    </div>
                                </v-col>

                                <v-col sm="3">
                                    <div class="item-box">
                                        <p class="text-subtitle-1 mb-2"> Volume (m3)
                                        </p>
                                        <p class="text-subtitle-1 font-weight-bold"> 6.43
                                        </p>
                                    </div>
                                </v-col>

                                <v-col sm="3">
                                    <div class="item-box">
                                        <p class="text-subtitle-1 mb-2"> Scientific Name
                                        </p>
                                        <p class="text-subtitle-1 font-weight-bold"> Coffea
                                        </p>
                                    </div>
                                </v-col>

                                <v-col sm="3">
                                    <div class="item-box">
                                        <p class="text-subtitle-1 mb-2"> Common Name
                                        </p>
                                        <p class="text-subtitle-1 font-weight-bold"> Coffee Beans
                                        </p>
                                    </div>
                                </v-col>

                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-card>

                <v-card elevation="0">
                    <v-card class="mb-5" flat>
                        <v-card-text>
                            <v-row class="pl-2 mb-2">
                                <v-col sm="12">
                                    <v-toolbar-title class="font-weight-bold">
                                        Production Places...
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn class="mx-2" fab x-small dark v-bind="attrs" v-on="on"
                                                    color="primary">
                                                    <v-icon>mdi-exclamation</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>Info</span>
                                        </v-tooltip>
                                    </v-toolbar-title>
                                </v-col>
                            </v-row>
                            <v-row class="pl-3">
                                <v-col sm="12">
                                    <v-data-table :headers="headers" :items="productionPlaces" :items-per-page="10"
                                        :footer-props="{
            'items-per-page-options': [10, 25, 50],
        }" hide-default-footer :loading="loading" :options.sync="options" :server-items-length="totalProductionPlaces"
                                        :loading-text="$t('deforestation.loadingProductionPlaces')">
                                        <template v-slot:top="{ }">
                                            <div class="d-flex mt-5">
                                                <div class="srch">
                                                    <label> | </label> &nbsp;
                                                    <v-text-field prepend-inner-icon="mdi-magnify" outlined height="5px"
                                                        :placeholder="$t('search')" dense v-model="search"
                                                        @keyup.enter="searchQuery" class="shrink">
                                                    </v-text-field>
                                                </div>

                                                <div class="srch ml-2">
                                                    <label> Country </label> &nbsp;
                                                    <v-select :items="[]" item-text="text" item-value="val" dense
                                                        outlined style="max-width:175px" class="mr-5"></v-select>
                                                </div>

                                                <div class="srch ml-2">
                                                    <label> Producer </label> &nbsp;
                                                    <v-select :items="[]" item-text="text" item-value="val" dense
                                                        outlined style="max-width:175px" class="mr-5"></v-select>
                                                </div>

                                                <div class="srch ml-2">
                                                    <label> EUDR Deforestation Status </label> &nbsp;
                                                    <v-select :items="[]" item-text="text" item-value="val" dense
                                                        outlined style="max-width:175px" class="mr-5"></v-select>
                                                </div>

                                                <v-spacer></v-spacer>
                                                <div class="py-1 title">
                                                    {{ options.page }} - {{ totalPages }} of {{ totalReports }}
                                                </div>
                                                <v-btn class="mx-2" fab small outlined color="primary"
                                                    :disabled="options.page <= 1" @click="pageChange(false)">
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
                                        <template v-if="productionPlaces.length" v-slot:body="{ items }">
                                            <tbody>
                                                <tr v-for="item in items" :key="item.id"
                                                    style="position: relative; width: 0; height: 0"
                                                    @mouseover="selectItem(item)" @mouseleave="selectItem(false)">

                                                    <td class="text-truncate">
                                                        {{ item.productionPlaceFarmID }}
                                                    </td>

                                                    <td class="text-truncate">
                                                        {{ item.producerName }}
                                                    </td>

                                                    <td class="text-truncate">
                                                        {{ item.addressOfProduction }}
                                                    </td>

                                                    <td class="text-truncate">
                                                        {{ item.areaHA }}
                                                    </td>

                                                    <td class="text-truncate">
                                                        {{ item.type }}
                                                    </td>


                                                    <td style="max-width:200px;">
                                                        <div class="d-flex mt-2">
                                                            <v-chip class="mr-2" variant="elevated" color="red"
                                                                outlined>
                                                                {{ item.eudrDeforestationStatus }}
                                                            </v-chip>
                                                            <div>
                                                                <v-tooltip bottom>
                                                                    <template v-slot:activator="{ on, attrs }">
                                                                        <v-btn x-small fab v-bind="attrs" v-on="on"
                                                                            color="primary" outlined>
                                                                            <v-icon>mdi-text-box-check</v-icon>
                                                                        </v-btn>
                                                                    </template>
                                                                    <span>View</span>
                                                                </v-tooltip>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td class="" style="max-width:200px;">
                                                        <div class="d-flex mt-2">
                                                            <v-chip class="mr-2" variant="elevated" color="primary"
                                                                outlined>
                                                                {{ item.riskAssement }}
                                                            </v-chip>
                                                            <div>
                                                                <v-tooltip bottom>
                                                                    <template v-slot:activator="{ on, attrs }">
                                                                        <v-btn x-small fab v-bind="attrs" v-on="on"
                                                                            color="primary" outlined>
                                                                            <v-icon>mdi-text-box-check</v-icon>
                                                                        </v-btn>
                                                                    </template>
                                                                    <span>View</span>
                                                                </v-tooltip>
                                                            </div>
                                                        </div>


                                                    </td>

                                                </tr>
                                            </tbody>
                                        </template>
                                        <template v-slot:footer></template>
                                    </v-data-table>
                                </v-col>
                                <v-col sm="12">
                                    <v-btn color="primary" dark class="mr-2">
                                        Request to remove all high risk fARMs
                                    </v-btn>
                                    <v-btn color="primary" dark class="mr-2">
                                        Request to remove all Low risk fARMs
                                    </v-btn>
                                    <v-btn color="primary" dark class="mr-2">
                                        Attach One Risk Mitigation Document for All High Risk Farms
                                    </v-btn>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col sm="12">
                                    <div class="pdf-docs mt-10 d-flex">
                                        <div class="docs-box mr-4">
                                            <div class="docs-preview">
                                                <div class="img-item">
                                                    <div class="pdf-box">
                                                        <v-icon color="primary" @click="viewPdfFile()"> mdi-eye
                                                        </v-icon>
                                                        <h1> PDF </h1>
                                                    </div>
                                                    <span> Risk Mitigation </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="mr-4">
                                            <v-textarea placeholder="Comments" outlined width="400"></v-textarea>
                                        </div>
                                    </div>
                                </v-col>
                            </v-row>
                            <v-row class="removed-background gray-color">
                                <v-col sm="12">
                                    <div class="item-box mb-4">
                                        <h2 class="font-weight-bold"> Farms Removed from the List</h2>
                                    </div>

                                    <v-data-table color="gray" :headers="removedFarmHeader" :items="removedFarmList"
                                        :items-per-page="10" :footer-props="{
            'items-per-page-options': [10, 25, 50],
        }" hide-default-footer :loading="loading" :options.sync="options" :server-items-length="totalProductionPlaces"
                                        :loading-text="'Loading removed farm list'">

                                        <template v-if="removedFarmList.length" v-slot:body="{ items }">
                                            <tbody>
                                                <tr v-for="item in items" :key="item.id"
                                                    style="position: relative; width: 0; height: 0"
                                                    @mouseover="selectItem(item)" @mouseleave="selectItem(false)">

                                                    <td class="text-truncate">
                                                        {{ item.productionPlaceFarmID }}
                                                    </td>

                                                    <td class="text-truncate">
                                                        {{ item.producerName }}
                                                    </td>

                                                    <td class="text-truncate">
                                                        {{ item.addressOfProduction }}
                                                    </td>

                                                    <td class="text-truncate">
                                                        {{ item.areaHA }}
                                                    </td>

                                                    <td class="text-truncate">
                                                        {{ item.type }}
                                                    </td>


                                                    <td style="max-width:200px;">
                                                        <div class="d-flex mt-2">
                                                            <v-chip class="mr-2" variant="elevated" color="red" dark>
                                                                {{ item.eudrDeforestationStatus }}
                                                            </v-chip>
                                                            <div>
                                                                <v-tooltip bottom>
                                                                    <template v-slot:activator="{ on, attrs }">
                                                                        <v-btn x-small fab v-bind="attrs" v-on="on"
                                                                            color="primary" outlined>
                                                                            <v-icon>mdi-text-box-check</v-icon>
                                                                        </v-btn>
                                                                    </template>
                                                                    <span>View</span>
                                                                </v-tooltip>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td class="" style="max-width:200px;">
                                                        <div class="d-flex mt-2">
                                                            <div>
                                                                <v-tooltip bottom>
                                                                    <template v-slot:activator="{ on, attrs }">
                                                                        <v-btn x-small fab v-bind="attrs" v-on="on"
                                                                            color="primary" outlined>
                                                                            <v-icon>mdi-replay</v-icon>
                                                                        </v-btn>
                                                                    </template>
                                                                    <span>Sharp</span>
                                                                </v-tooltip>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </template>
                                        <template v-slot:footer></template>
                                    </v-data-table>

                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-card>

                <v-card class="mb-5" flat>
                    <v-card-text>
                        <v-row class="pl-2 mb-2">
                            <v-col sm="12">
                                <v-toolbar-title class="font-weight-bold">
                                    Activity Log
                                </v-toolbar-title>
                            </v-col>
                        </v-row>
                        <v-row class="pl-3">
                            <v-col sm="12">
                                <v-data-table :headers="headersActivityLog" :items="activityLogs" :items-per-page="10"
                                    :footer-props="{
            'items-per-page-options': [10, 25, 50],
        }" hide-default-footer :loading="loading" :options.sync="options" :server-items-length="totalActivityLogs"
                                    :loading-text="'Loading Activity Logs'">
                                    <template v-if="productionPlaces.length" v-slot:body="{ items }">
                                        <tbody>
                                            <tr v-for="item in items" :key="item.id"
                                                style="position: relative; width: 0; height: 0"
                                                @mouseover="selectItem(item)" @mouseleave="selectItem(false)">

                                                <td class="text-truncate">
                                                    {{ item.user.firstName }} {{ item.user.lastName }}
                                                </td>

                                                <td class="text-truncate">
                                                    {{ item.user.role }}
                                                </td>

                                                <td class="text-truncate">
                                                    {{ formatDateTime(item.createdAt) }}
                                                </td>

                                                <td class="text-truncate">
                                                    {{ item.activity }}
                                                </td>

                                                <td class="text-truncate">
                                                    {{ item.description }}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </template>
                                    <template v-slot:footer></template>
                                </v-data-table>
                            </v-col>
                        </v-row>



                    </v-card-text>
                </v-card>

                <v-card class="mb-5" flat>
                    <v-card-text>
                        <v-row class="pl-2 mb-2">
                            <v-col sm="12">
                                <v-toolbar-title class="font-weight-bold">
                                    Declaration Statement by Supplier
                                </v-toolbar-title>
                            </v-col>
                        </v-row>
                        <v-row class="pl-3">
                            <v-col sm="3">
                                <div class="item-box">
                                    <p class="text-subtitle-1 mb-2"> Name
                                    </p>
                                    <p class="text-subtitle-1 font-weight-bold"> Mathew Charles
                                    </p>
                                </div>
                            </v-col>

                            <v-col sm="3">
                                <div class="item-box">
                                    <p class="text-subtitle-1 mb-2"> Address
                                    </p>
                                    <p class="text-subtitle-1 font-weight-bold"> 123 Main Street Anytown, USA
                                    </p>
                                </div>
                            </v-col>

                            <v-col sm="3">
                                <div class="item-box">
                                    <p class="text-subtitle-1 mb-2"> Date & Time
                                    </p>
                                    <p class="text-subtitle-1 font-weight-bold"> 24/12/2022 | 05:00 PM
                                    </p>
                                </div>
                            </v-col>

                            <v-col sm="12">
                                <div class="item-box">
                                    <p class="text-subtitle-1 mb-2"> Mathew Charles, hereby declare that all data
                                        submitted with this
                                        shipment is accurate to the best of my knowledge and belief.
                                    </p>
                                    <p class="text-subtitle-1"> I, Mathew Charles affirm that I have visited the farms
                                        associated with
                                        this shipment and confirm their compliance with local laws and regulations
                                        regarding
                                        deforestation.
                                    </p>
                                </div>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>

            </div>

            <eu-upload :dialog="euUpload" @closeEuUpload="handleClose1">
            </eu-upload>
        </v-container>
    </div>
</template>

<script>
import DownloadMixin from "@/mixins/DownloadMixin";
import loadingMixin from "@/mixins/LoadingMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
//import EuUpload from './upload-eu-modal/EuUpload.vue'
//import Confirmation from './upload-eu-modal/Confirmation.vue'
//import ConfirmationWithList from './upload-eu-modal/ConfirmationWithList.vue'
//import DownloadEuModalConfirm from './upload-eu-modal/DownloadEuModalConfirm.vue'
import DownloadEuModalWarning from '../../upload-eu-modal/DownloadEuModalWarning.vue'
import DeforestationService from "@/_services/DeforestationService";


export default {
    computed: {

    },
    mounted() {
        this.loading = false;
    },
    created() {
      this.getActivityLog(1)  //TODO: Replace this id with appropriate due diligence ID
    },
    watch: {
        tableOptions: {
            async handler() {

            },
            deep: true,
        },
    },
    components: {
        'eu-upload': DownloadEuModalWarning
    },
    methods: {
        handleFinalReportDownload(dwId) {
          DeforestationService.downloadDueDeligenceFinalReport({type: dwId}).then(response => {
            console.log(response, "Pdf downlloaded")
          }).catch(err => {
            console.log(err)
          })
        },
      async getActivityLog(id){
        try {
          this.startLoading()
          const logs = await DeforestationService.getDiligenceActivityLog(id)
          this.activityLogs = logs.data.diligenceActivityLog;
        }catch(err){
          console.error('Error fetching activity log:',err)
        }finally {
          this.stopLoading()
        }

      },

      formatDateTime(dateTimeString) {
        const date = new Date(dateTimeString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
        const year = date.getFullYear();
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        const formattedDateTime = `${day}-${month}-${year} | ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
        return formattedDateTime;
      },

        handleEuUpload() {
            this.euUpload = true
        },
        handleClose1(playload) {
            this.euUpload = playload
        },
        viewPdfFile() { },
        formatDateIntoIso(dt) {
            if (!dt) return ''
            return `${dt}T00:00:00.000Z`
        },
        createShipment() {
            if (!this.$refs.createShipment.validate()) return
        },
        handleStopAdd() {
            this.shipment.stops.push({
                model: ''
            })
        },

        handleClose(key) {
            this.shipment.stops.splice(key, 1)
        },

        selectItem(item) {
            this.selectedItem = item;
        },
        searchQuery() {

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

    },
    data() {
        return {
            items: [{ id:'pdf', title: 'Download as PDF' }, { id:'json', title: 'Download as JSON' }],
            euUpload: false,
            expectedArrivalDate: false,
            loading: false,
            totalProductionPlaces: 2,
            totalActivityLogs: 2,
            totalPages: 2,
            tab: 0,
            selectedItem: false,
            options: {
                itemsPerPage: 10,
                page: 1
            },
            search: "",
            from: 0,
            to: 0,
            breadcrumbs: [
                {
                    text: this.$t("dashboard"),
                    disabled: true,
                    to: "/",
                },
                {
                    text: 'Due Diligence',
                    disabled: true,
                    to: "breadcrumbs_link_1",
                },
                {
                    text: 'Create New Report',
                    disabled: true,
                    to: "breadcrumbs_link_1",
                },
            ],
            shipment: {
                exporter: '',
                importer: '',
                shipmentRefrenceNumber: '',
                ownershipType: '',
                buyer: '',

                partOfOrigin: '',
                partOfDestination: '',
                stops: [{
                    model: ''
                }],

                shippingLine: '',

                expectedArrivalDate: '',
                containerId: '',
                containerType: ''
            },
            shipmentRules: {
                exporter: [],
                importer: [],
                shipmentRefrenceNumber: [],
                ownershipType: [],
                buyer: [],

                partOfOrigin: [],
                partOfDestination: [],
                shippingLine: [],
                expectedArrivalDate: [],
                containerId: [],
                containerType: []
            },

            removedFarmHeader: [
                {
                    text: 'Production Place & Farm ID',
                    align: "start",
                    value: "farmerName",
                    class: "black--text",
                    sortable: false,
                },
                {
                    text: 'Producer Name',
                    align: "start",
                    value: "farmName",
                    class: "black--text",
                },

                {
                    text: 'Address of Production',
                    align: "start",
                    value: "farmLocation",
                    class: "black--text",
                    sortable: false
                },
                {
                    text: 'Area (ha)',
                    align: "start",
                    value: "area",
                    class: "black--text",
                    sortable: false,
                },
                {
                    text: 'Type',
                    align: "start",
                    value: "dateOfRequest",
                    class: "black--text",
                    sortable: false,
                },
                {
                    text: 'EUDR Deforestation Status',
                    align: "start",
                    value: "dateOfRequest",
                    class: "black--text",
                    sortable: false,
                },
                {
                    text: '',
                    align: "start",
                    value: "sts",
                    class: "black--text",
                    sortable: false,
                }
            ],

            headersActivityLog: [
                {
                    text: 'User',
                    align: "start",
                    value: "user",
                    class: "black--text",
                    sortable: false,
                },
                {
                    text: 'User Role',
                    align: "start",
                    value: "user-role",
                    class: "black--text",
                },

                {
                    text: 'Date & Time',
                    align: "start",
                    value: "date_time",
                    class: "black--text",
                    sortable: false
                },
                {
                    text: 'Activity',
                    align: "start",
                    value: "area",
                    class: "black--text",
                    sortable: false,
                },
                {
                    text: 'Description',
                    align: "start",
                    value: "description",
                    class: "black--text",
                    sortable: false,
                }
            ],

            headers: [
                {
                    text: 'Production Place & Farm ID',
                    align: "start",
                    value: "farmerName",
                    class: "black--text",
                    sortable: false,
                },
                {
                    text: 'Producer Name',
                    align: "start",
                    value: "farmName",
                    class: "black--text",
                },

                {
                    text: 'Address of Production',
                    align: "start",
                    value: "farmLocation",
                    class: "black--text",
                    sortable: false
                },
                {
                    text: 'Area (ha)',
                    align: "start",
                    value: "area",
                    class: "black--text",
                    sortable: false,
                },
                {
                    text: 'Type',
                    align: "start",
                    value: "dateOfRequest",
                    class: "black--text",
                    sortable: false,
                },
                {
                    text: 'EUDR Deforestation Status',
                    align: "start",
                    value: "dateOfRequest",
                    class: "black--text",
                    sortable: false,
                },
                {
                    text: 'Risk Assessment',
                    align: "start",
                    value: "dateOfRequest",
                    class: "black--text",
                    sortable: false,
                }
            ],

            productionPlaces: [
                {
                    id: 1,
                    productionPlaceFarmID: 'Gold Farm',
                    producerName: 'Ava Gracia',
                    addressOfProduction: '49 Featherstone',
                    areaHA: '10',
                    type: 'Print',
                    eudrDeforestationStatus: 'High Probability',
                    riskAssement: 'Approved',
                }
            ],

            activityLogs: [],

            removedFarmList: [
                {
                    id: 1,
                    productionPlaceFarmID: 'Gold Farm',
                    producerName: 'Ava Gracia',
                    addressOfProduction: '49 Featherstone',
                    areaHA: '10',
                    type: 'Print',
                    eudrDeforestationStatus: 'High Probability',

                }
            ],
            totalReports: 2
        };
    },
    mixins: [loadingMixin, getPermittedActions, DownloadMixin]
};
</script>

<style lang="scss" scoped>
.img-preview {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
}

.img-item {
    margin-left: 1px;
    max-height: 150px;
    position: relative;
}

.img-item img {
    max-height: inherit;
}

.img-item button {
    position: absolute;
    right: 0;
    color: red;
    cursor: pointer;
}

.letterSpacing {
    letter-spacing: 0;
}

.my-awesome-table {
    table-layout: fixed;
}

::v-deep .v-tab:hover {
    background-color: #caf1e2;
    color: $primary_color !important;
}

::v-deep .green-shadow:hover {
    background-color: $primary_color;
    color: white;
}

::v-deep .my-custom-dialog {
    position: absolute;
    top: 0;
    min-height: 100%;
    right: 0;
    margin-right: 0px;
    margin-top: 0px;
}

::v-deep .square {
    width: 1vw;
    height: 1vw;
}

::v-deep .xxxx {
    border: 2px solid black;
}

::v-deep .product-name-cl {
    padding: 5px;
}

::v-deep .product-name-cl .product-img {
    display: flex;
    align-items: center;
}

::v-deep .product-img p {
    margin-left: 5px;
}

.pdf-box {
    height: 75px;
    width: 75px;
    background-color: #e5f8f1;
    position: relative;
    line-height: 75px;
    text-align: center;
}

.pdf-box h1 {
    color: #135B00;
}


.dropZone {
    width: 100%;
    height: 150px;
    position: relative;
    border: 2px dashed #97A8B8;
}

.additional-logos-form {
    width: 100%;
}

.dropZone:hover {
    border: 2px solid $primary-color;
}

.dropZone:hover .dropZone-title {
    color: $primary-color;
}

.dropZone-info {
    color: #A8A8A8;
    position: absolute;
    top: 50%;
    width: 100%;
    transform: translate(0, -50%);
    text-align: center;
}

.dropZone-title {
    color: #787878;
}

.dropZone input {
    position: absolute;
    cursor: pointer;
    top: 0px;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
}

.dropZone-upload-limit-info {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    overflow: clip;
}

.dropZone-over {
    background: #5C5C5C;
    opacity: 0.8;
    overflow: clip;
}

.dropZone-uploaded {
    width: 100%;
    height: 450px;
    position: relative;
    border: 2px solid $primary-color;
    overflow: clip;
    // border-radius: 10px;
}

.dropZone-uploaded-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #A8A8A8;
    position: absolute;
    top: 50%;
    width: 100%;
    transform: translate(0, -50%);
    text-align: center;
    overflow: clip;
}

.primary-color {
    color: #00BD73;
}

.gray-color {
    background: #DCDCDC80;
}

.removed-background {
    padding: 15px;
}
</style>