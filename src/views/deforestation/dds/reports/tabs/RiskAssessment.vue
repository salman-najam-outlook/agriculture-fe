<template>
  <div>
    <v-container fluid>
      <v-card elevation="0" class="pt-4 mb-4">
        <div class="d-flex">
          <h2 style="color:black; margin-top: 10px;">
            {{ $t("dueDiligence.riskAssessmentAndMitigation") }}
            <v-tooltip top color="00BD73" max-width="350">
              <template v-slot:activator="{ on, attrs }">
                <v-icon class="icon-with-background primary--text"  style="color:#0EBF67" v-bind="attrs" v-on="on">
                  mdi-alert-circle
                </v-icon>
              </template>
              <span>{{ $t("dueDiligence.riskAssessmentAndMitigationTT") }}</span>
            </v-tooltip>
          </h2>
          <v-spacer></v-spacer>
          <!-- <v-btn type="submit" :color="uploadFile ? 'primary' : 'thiGray'" class="mr-2 white--text" @click="handleUploadFile">
            Upload File
          </v-btn>
          <v-btn type="submit" :color="takeAssessment ? 'primary' : 'thiGray white--text'" @click="handleTakeAssessment">
            Take Assessment
          </v-btn> -->
        </div>
      </v-card>


      <!-- SCENERIO 1 ======> existing + one for all -->
      <!-- File upload with status; the uploaded file and status will be applied to all farms -->
      <div class="mt-8" v-if="assessment.existing_survey === 'existing' && assessment.placement === 'one_for_all'">
        <v-row v-if="!scenerioOnePreview">
          <v-col cols="6">
            <h2 class="mb-7 text--dark" style="color: black;">
              {{ $t("dueDiligence.uploadRiskAssessment") }}
              <v-tooltip top color="00BD73">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                    mdi-alert-circle
                  </v-icon>
                </template>
                <span>{{ $t("dueDiligence.uploadRiskAssessmentTT") }}</span>
              </v-tooltip>
            </h2>
            <div class="upload-document">
              <div style="overflow: clip" :class="['dropZone', dragging ? 'dropZone-over' : '']"
                @dragenter="dragging = true" @dragleave="dragging = false" @drop="handleDrop">
                <div class="dropZone-info d-flex justify-center align-center" @dragover.prevent>
                  <span class="fa fa-cloud-upload dropZone-title"></span>
                  <span class="dropZone-title">
                    <v-icon class="blue-color" size="50" color="gray">mdi-tray-arrow-up</v-icon>
                  </span>
                  <div class="dropZone-upload-limit-info">
                    <h3 class="blue-color underline px-3" color="primary">
                      {{ $t("dueDiligence.selectFileToUploadData") }}
                    </h3>
                    <p class="gray-color">{{ $t("oma.OrDragDrop") }}</p>
                  </div>
                </div>
                <input type="file" required multiple accept=".pdf, .doc, .docx, .xls, .xlsx" @change="additionalOnChange" />
              </div>
              <span v-if="fileError"  class="red--text">{{ $t('deforestation.thisFieldIsRequired') }}</span>
            </div>

            <v-form ref="riskAssessmentFile">
              <v-row class="pdf-docs mt-10 d-flex" v-for="(docs, key) in s3FileUploadResult" :key="key">
                <v-col cols="2" md="4">
                  <div class="docs-box mr-4">
                    <div class="docs-preview">
                      <v-sheet elevation="2"
                        class="pdf-box d-flex align-center justify-center flex-column text-center mx-auto" style="
                        border: 1px solid #e0e0e0;
                        border-radius: 8px;
                        padding: 16px;
                        position: relative;
                        width: 120px;
                        height: 120px;
                      ">
                        <v-icon @click="removeFile(key, docs?.id, docs?.id)" class="delete-icon" style="
                          position: absolute;
                          top: 4px;
                          right: 4px;
                          color: #f44336;
                          cursor: pointer;
                        " title="Remove file">
                          mdi-trash-can-outline
                        </v-icon>

                        <div class="justify-center" style="display:ruby">
                          <v-icon dark @click="openFile(docs?.s3Location)" style="color: green;cursor: pointer;"
                            title="View file">
                            mdi-eye
                          </v-icon>
                          <br />

                          <h2 class="file-extension mt-2" style="font-size: 14px; color: #607d8b;">
                            {{ docs.extension }}
                          </h2>
                        </div>
                      </v-sheet>
                      <span class="file-name mt-2"
                        style="display: block; font-size: 14px; text-align: center; color: #424242;">
                        {{ docs.name }}
                      </span>
                    </div>
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="text-box mr-4">
                    <v-textarea v-model="docs.comment" :placeholder="$t('activationKey.comments')" outlined></v-textarea>
                  </div>
                </v-col>
                <v-col cols="4">
                  <div class="expiry-box">
                    <label class="expiration" for="name">{{ $t('deforestation.farmList.expiryDate') }} </label>
                    <v-menu v-model="docs.productExpirationMenu" :close-on-content-click="false" :nudge-right="40"
                      transition="scale-transition" offset-y min-width="auto">
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field append-icon="mdi-calendar" outlined dense readonly v-bind="attrs" v-on="on"
                          v-on:click:append="
                            docs.productExpirationMenu = true
                            " v-model="docs.expiryDate" :placeholder="$t('memberDataSection.pOrder.selectDate')"
                          :rules="[rules.required]"></v-text-field>
                      </template>
                      <v-date-picker :placeholder="$t('memberDataSection.pOrder.selectDate')" v-model="docs.expiryDate"
                        @input="docs.productExpirationMenu = false"></v-date-picker>
                    </v-menu>
                  </div>
                </v-col>
              </v-row>
            </v-form>
          </v-col>
          <v-col cols="12" class="d-flex flex-row-reverse">
            <v-btn type="button" color="primary" width="112" @click="scenerioPreviewBtn(true, 'One')">
              {{ $t("submit") }}
            </v-btn>
          </v-col>
        </v-row>

        <!-- preview -->
        <v-row v-if="scenerioOnePreview">
          <v-col cols="4">
            <label for="">{{ $t("dueDiligence.riskAssessmentStatus") }}</label>
             <v-form ref="riskAssessmentForm">
              <v-autocomplete :items="riskAssessmentStatusList" v-model="currentRiskAssessmentStatus" dense outlined class="wdt"
              item-text="text" item-value="val" :placeholder="$t('select')" ref="riskAssessmentStatusChange"
              :rules="[(v) => !!v || this.$t('deforestation.riskAssessmentStatusIsRequired')]"
              @change="handleRiskAssessmentStatus"></v-autocomplete>
            </v-form>
            <h2 class="mb-7">
              {{ $t("dueDiligence.uploadRiskAssessment") }}
              <span style="color: green">
                <v-icon color="primary">info</v-icon>
              </span>
            </h2>
          </v-col>
          <v-col cols="8"></v-col>
          <v-col cols="8">
            <div class="risk-assement">
              <v-row class="pdf-docs mt-10 d-flex" v-for="(docs, key) in s3FileUploadResult" :key="key">
                <v-col cols="2" md="4">
                  <div class="docs-box mr-4 mb-4">
                    <div class="docs-preview">
                      <v-sheet elevation="2"
                        class="pdf-box d-flex align-center justify-center flex-column text-center mx-auto" style="
                        border: 1px solid #e0e0e0;
                        border-radius: 8px;
                        padding: 16px;
                        position: relative;
                        width: 120px;
                        height: 120px;
                      ">
                        <v-icon @click="removeFile(key, docs?.id)" class="delete-icon" style="
                          position: absolute;
                          top: 4px;
                          right: 4px;
                          color: #f44336;
                          cursor: pointer;
                        " title="Remove file">
                          mdi-trash-can-outline
                        </v-icon>

                        <div class="justify-center" style="display:ruby">
                          <v-icon dark @click="openFile(docs?.s3Location)" style="color: green;cursor: pointer;"
                            title="View file">
                            mdi-eye
                          </v-icon>
                          <br />

                          <h2 class="file-extension mt-2" style="font-size: 14px; color: #607d8b;">
                            {{ docs.extension }}
                          </h2>
                        </div>
                      </v-sheet>
                      <span class="file-name mt-2"
                        style="display: block; font-size: 14px; text-align: center; color: #424242;">
                        {{ docs.name }}
                      </span>
                    </div>
                  </div>
                </v-col>
                <v-col cols="6" md="5">
                  <div class="text-box mr-4">
                    <v-textarea v-model="docs.comment" :placeholder="$t('activationKey.comments')" outlined readonly
                      :disabled="true"></v-textarea>
                  </div>
                </v-col>
                <v-col cols="4" md="3">
                  <div class="expiry-box">
                    <label class="expiration" for="name">{{ $t('deforestation.farmList.expiryDate') }}
                    </label>
                    <v-menu v-model="docs.productExpirationMenu" :close-on-content-click="false" :nudge-right="40"
                      transition="scale-transition" offset-y min-width="auto">
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field append-icon="mdi-calendar" outlined dense readonly :disabled="true" v-bind="attrs"
                          v-on="on" v-on:click:append="
                            docs.productExpirationMenu = true
                            " v-model="docs.expiryDate" :placeholder="$t('memberDataSection.pOrder.selectDate')"></v-text-field>
                      </template>
                      <v-date-picker :placeholder="$t('memberDataSectio.pOrder.selectDate')" v-model="docs.expiryDate"
                        @input="docs.productExpirationMenu = false"></v-date-picker>
                    </v-menu>
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-col>

          <v-col cols="12">
            <div class="d-flex flex-row-reverse mt-16">
              <v-btn type="submit" color="primary" width="112" @click="uploadRiskAssessmentFiles">
                {{ $t("submit") }}
              </v-btn>
              <v-btn outlined class="mr-2" color="primary" width="112" @click="scenerioPreviewBtn(false, 'One')">
                {{ $t("cancel") }}
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </div>


      <!-- SCENERIO 2 ======> existing + one for each -->
      <!-- // file upload + all farms table -->
      <div v-if="assessment.existing_survey === 'existing' && assessment.placement === 'one_for_each'">
        <AssessmentStatus v-if="assessmentId && productionPlaces?.length > 0" :diligenceId="diligenceId" :farmsList="productionPlaces" :assessmentId="assessmentId" :key="statusReloadKey" />
        <v-col class="px-0">
          <div class="d-flex">
            <h3 style="color:black">
              {{ $t("deforestation.productionPlaces") }}
              <v-tooltip top color="00BD73" max-width="350">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                    mdi-alert-circle
                  </v-icon>
                </template>
                <span>{{ $t("dueDiligence.productionPlaces") }}</span>
              </v-tooltip>
            </h3>
          </div>

          <v-data-table single-select :headers="placesHeaders" :items="productionPlaces" hide-default-footer
            :server-items-length="totalProductionPlaces" item-key="id" v-model="selectedArray"
            :loading-text="$t('deforestation.productionPlaces')">
            <template v-slot:top="{}">
              <!-- width: 290px; margin-top: 22px; -->
              <div class="d-flex justify-space-between filter-pro-places">
                <div class="d-flex align-center filter-section">
                  <div style="width: 290px; margin-top: 22px;">
                    <v-text-field prepend-inner-icon="mdi-magnify" outlined height="5px" :placeholder="$t('search')"
                      dense v-model="search" @input="handleSearchByPharse" class="shrink" clearable></v-text-field>
                  </div>
                  <div class="ml-3" style="width: 290px;">
                    <label for="text">{{ $t("country") }}</label>
                    <v-select :items="countries" v-model="country" item-text="name" item-value="name" dense outlined
                      class="wdt" :placeholder="$t('select')" @change="handleSearchByCountry"></v-select>
                  </div>

                  <div class="ml-3" style="width: 290px;">
                    <label for="text">{{ $t("deforestation.supplier") }}</label>
                    <!-- {{JSON.stringify(formattedSupplier)}} -->
                    <v-select :items="formattedSupplier" v-model="suppplier" item-text="fullName" item-value="id" dense
                      outlined class="wdt" :placeholder="$t('select')" @change="handleSearchBySupplier"></v-select>
                  </div>

                  <div class="ml-3" style="width: 290px;">
                    <label for="text">{{
                      $t("dueDiligence.riskAssessmentStatus")
                      }}</label>
                    <v-select :items="riskAssessmentStatusList" v-model="riskAssessmentStatus" dense outlined
                      class="wdt" item-text="text" item-value="val" :placeholder="$t('select')"
                      @change="handleSearchByStatus"></v-select>
                  </div>
                </div>

                <!-- margin-top: 15px; -->
                <div class="d-flex mb-5 pagination">
                  <div class="py-1 title">
                    {{ options.page }} - {{ totalPages }} of
                    {{ totalProductionPlaces }}
                  </div>
                  <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page <= 1"
                    @click="pageChange(false)">
                    <v-icon dark>
                      mdi-chevron-left
                    </v-icon>
                  </v-btn>
                  <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page >= totalPages"
                    @click="pageChange(true)">
                    <v-icon dark>
                      mdi-chevron-right
                    </v-icon>
                  </v-btn>
                </div>
              </div>
            </template>
            <template v-slot:body="{ items }">
              <tbody>
                <tr v-for="(item) in items" :key="item.id" style="position: relative; width: 0; height: 0"
                  @click="checkboxChange(item)">
                  <!-- <td>
                    <v-checkbox v-model="selected" :value="item.id" hide-details
                      @change="checkboxChange(item)"></v-checkbox>
                  </td> -->
                  <td>{{ item.farm.farmName }} {{ item.farm.farmNumber }}</td>
                  <td>
                    {{ item.farm.userDdsAssoc.firstName }}
                    {{ item.farm.userDdsAssoc.lastName }}
                  </td>
                  <td>{{ item.farm.address || "" }}</td>
                  <td>{{ acerToHectare(item.farm.area) }}</td>
                  <td>{{ item.farmType || "" }}</td>
                  <td>
                    <div class="d-flex">
                      <div class="d-flex" v-if="
                        getRiskAssessmentStatus(item?.diligenceReportProductionPlaceArray[0]?.all_risk_assessments?.[0]?.riskAssessmentStatus)
                          .text !== 'N/A'
                      ">
                        <v-btn small rounded min-width="200" depressed :class="getRiskAssessmentStatus(
                          item?.diligenceReportProductionPlaceArray[0]?.all_risk_assessments?.[0]?.riskAssessmentStatus
                        ).class
                          " height="34">
                          {{
                            getRiskAssessmentStatus(
                              item?.diligenceReportProductionPlaceArray[0]?.all_risk_assessments?.[0]?.riskAssessmentStatus
                          ).text
                          }}
                        </v-btn>
                        <!-- <img
                      class="ml-1"
                      src="/icons/todo-list.png"
                      style="width: 34px; height: 34px; border-radius: 50%;"
                    /> -->
                      </div>
                      <span v-else class="text-decoration-underline cursor-pointer" @click="addAssessment(item)">
                        {{ assessmentStatusTexts[item.id] || 'Loading...' }}
                      </span>
                      <v-spacer></v-spacer>
                      <v-icon style="cursor:pointer" class="ml-1 green-shadow"
                        @click="farmRemoveConfirmDialog = true; deleteFarmId = item.farmId">mdi-trash-can</v-icon>
                    </div>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-data-table>

          <v-row class="px-4" v-if="farmDetails && this.selectedItem">
            <v-col cols="12 mt-10 mb-3">
              <div class="ttl d-flex justify-space-between">
                <h2>
                  Farm Details
                  <v-tooltip top color="00BD73">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                        mdi-alert-circle
                      </v-icon>
                    </template>
                    <span>Farm Details</span>
                  </v-tooltip>
                </h2>
              </div>
            </v-col>
            <v-col  cols="4">
              <p class="pt-3">Farm</p>
              <h4>{{ this.selectedItem.farm.farmName || "-" }}</h4>
            </v-col>
            <v-col  cols="4">
              <p class="pt-3">Producer</p>
              <h4>
                {{ this.selectedItem.farm.userDdsAssoc.firstName }}
                {{ this.selectedItem.farm.userDdsAssoc.lastName }}
              </h4>
            </v-col>
            <v-col  cols="4">
              <p class="pt-3">Date Submitted</p>
              <h4>{{ formatDate(this.selectedItem.createdAt) }}</h4>
            </v-col>

            <v-row class="my-6" v-if="!scenerioTwoPreview">
              <v-col cols="6">
                <h2 class="mb-7 text--dark" style="color: black;">
                  {{ $t("dueDiligence.uploadRiskAssessment") }}
                  <v-tooltip top color="00BD73">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                        mdi-alert-circle
                      </v-icon>
                    </template>
                    <span>{{ $t("dueDiligence.uploadRiskAssessmentTT") }}</span>
                  </v-tooltip>
                </h2>
                <div class="upload-document">
                  <div style="overflow: clip" :class="['dropZone', dragging ? 'dropZone-over' : '']"
                    @dragenter="dragging = true" @dragleave="dragging = false" @drop="handleDrop">
                    <div class="dropZone-info d-flex justify-center align-center" @dragover.prevent>
                      <span class="fa fa-cloud-upload dropZone-title"></span>
                      <span class="dropZone-title">
                        <v-icon class="blue-color" size="50" color="gray">mdi-tray-arrow-up</v-icon>
                      </span>
                      <div class="dropZone-upload-limit-info">
                        <h3 class="blue-color underline px-3" color="primary">
                          {{ $t("dueDiligence.selectFileToUploadData") }}
                        </h3>
                        <p class="gray-color">{{ $t("oma.OrDragDrop") }}</p>
                      </div>
                    </div>
                    <input type="file" multiple accept=".pdf, .doc, .docx, .xls, .xlsx" @change="additionalOnChange" />
                  </div>
                  <span v-if="fileError"  class="red--text">{{ $t('deforestation.thisFieldIsRequired') }}</span>
                </div>

                <v-form ref="riskAssessmentFile">
                  <v-row class="pdf-docs mt-10 d-flex" v-for="(docs, key) in s3FileUploadResult" :key="key">
                    <v-col cols="2" md="4">
                      <div class="docs-box mr-4">
                        <div class="docs-preview">
                          <v-sheet elevation="2"
                            class="pdf-box d-flex align-center justify-center flex-column text-center mx-auto" style="
                        border: 1px solid #e0e0e0;
                        border-radius: 8px;
                        padding: 16px;
                        position: relative;
                        width: 120px;
                        height: 120px;
                      ">
                            <v-icon @click="removeFile(key, docs?.id)" class="delete-icon" style="
                          position: absolute;
                          top: 4px;
                          right: 4px;
                          color: #f44336;
                          cursor: pointer;
                        " title="Remove file">
                              mdi-trash-can-outline
                            </v-icon>

                            <div class="justify-center" style="display:ruby">
                              <v-icon dark @click="openFile(docs?.s3Location)" style="color: green;cursor: pointer;"
                                title="View file">
                                mdi-eye
                              </v-icon>
                              <br />

                              <h2 class="file-extension mt-2" style="font-size: 14px; color: #607d8b;">
                                {{ docs.extension }}
                              </h2>
                            </div>
                          </v-sheet>
                          <span class="file-name mt-2"
                            style="display: block; font-size: 14px; text-align: center; color: #424242;">
                            {{ docs.name }}
                          </span>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="6" md="5">
                      <div class="text-box mr-4">
                        <v-textarea v-model="docs.comment" :placeholder="$t('activationKey.comments')" outlined></v-textarea>
                      </div>
                    </v-col>
                    <v-col cols="4" md="3">
                      <div class="expiry-box">
                        <label class="expiration" for="name">Expiry Date </label>
                        <v-menu v-model="docs.productExpirationMenu" :close-on-content-click="false" :nudge-right="40"
                          transition="scale-transition" offset-y min-width="auto">
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field append-icon="mdi-calendar" outlined dense readonly v-bind="attrs" v-on="on"
                              v-on:click:append="
                                docs.productExpirationMenu = true
                                " v-model="docs.expiryDate" :placeholder="$t('memberDataSectio.pOrder.selectDate')"
                              :rules="[rules.required]"></v-text-field>
                          </template>
                          <v-date-picker :placeholder="$t('memberDataSectio.pOrder.selectDate')" v-model="docs.expiryDate"
                            @input="docs.productExpirationMenu = false"></v-date-picker>
                        </v-menu>
                      </div>
                    </v-col>
                  </v-row>
                </v-form>
              </v-col>
              <v-col cols="12" class="d-flex flex-row-reverse">
                <v-btn type="button" color="primary" width="112" @click="scenerioPreviewBtn(true, 'Two')">
                  {{ $t("submit") }}
                </v-btn>
              </v-col>
            </v-row>


            <!-- preview -->
            <v-row v-if="scenerioTwoPreview" class="mx-1">
              <v-col cols="4">
                <label for="">{{ $t("dueDiligence.riskAssessmentStatus") }}</label>
                <v-form ref="riskAssessmentForm"> 
                  <v-autocomplete :items="riskAssessmentStatusList" v-model="currentRiskAssessmentStatus" dense outlined class="wdt"
                  item-text="text" item-value="val" :placeholder="$t('select')"
                  :rules="[(v) => !!v || this.$t('deforestation.thisFieldIsRequired')]"
                  @change="handleRiskAssessmentStatus"></v-autocomplete>
                </v-form>
                <h2 class="mb-7">
                  {{ $t("dueDiligence.uploadRiskAssessment") }}
                  <span style="color: green">
                    <v-icon color="primary">info</v-icon>
                  </span>
                </h2>
              </v-col>
              <v-col cols="8"></v-col>
              <v-col cols="8">
                <div class="risk-assement">
                  <v-row class="pdf-docs mt-10 d-flex" v-for="(docs, key) in s3FileUploadResult" :key="key">
                    <v-col cols="2" md="4">
                      <div class="docs-box mr-4">
                        <div class="docs-preview">
                          <v-sheet elevation="2"
                            class="pdf-box d-flex align-center justify-center flex-column text-center mx-auto" style="
                        border: 1px solid #e0e0e0;
                        border-radius: 8px;
                        padding: 16px;
                        position: relative;
                        width: 120px;
                        height: 120px;
                      ">
                            <v-icon @click="removeFile(key, docs?.id)" class="delete-icon" style="
                          position: absolute;
                          top: 4px;
                          right: 4px;
                          color: #f44336;
                          cursor: pointer;
                        " title="Remove file">
                              mdi-trash-can-outline
                            </v-icon>

                            <div class="justify-center" style="display:ruby">
                              <v-icon dark @click="openFile(docs?.s3Location)" style="color: green;cursor: pointer;"
                                title="View file">
                                mdi-eye
                              </v-icon>
                              <br />

                              <h2 class="file-extension mt-2" style="font-size: 14px; color: #607d8b;">
                                {{ docs.extension }}
                              </h2>
                            </div>
                          </v-sheet>
                          <span class="file-name mt-2"
                            style="display: block; font-size: 14px; text-align: center; color: #424242;">
                            {{ docs.name }}
                          </span>
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="6" md="5">
                      <div class="text-box mr-4">
                        <v-textarea v-model="docs.comment" :placeholder="('activationKey.comments')" outlined readonly
                          :disabled="true"></v-textarea>
                      </div>
                    </v-col>
                    <v-col cols="4" md="3">
                      <div class="expiry-box">
                        <label class="expiration" for="name">Expiry Date
                        </label>
                        <v-menu v-model="docs.productExpirationMenu" :close-on-content-click="false" :nudge-right="40"
                          transition="scale-transition" offset-y min-width="auto">
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field append-icon="mdi-calendar" outlined dense readonly :disabled="true"
                              v-bind="attrs" v-on="on" v-on:click:append="
                                docs.productExpirationMenu = true
                                " v-model="docs.expiryDate" :placeholder="$t('memberDataSectio.pOrder.selectDate')"></v-text-field>
                          </template>
                          <v-date-picker :placeholder="$t('memberDataSectio.pOrder.selectDate')" v-model="docs.expiryDate"
                            @input="docs.productExpirationMenu = false"></v-date-picker>
                        </v-menu>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="12">
                <div class="d-flex flex-row-reverse mt-16">
                  <v-btn type="submit" color="primary" width="112" @click="uploadRiskAssessmentFiles">
                    {{ $t("submit") }}
                  </v-btn>
                  <v-btn outlined class="mr-2" color="primary" width="112" @click="scenerioPreviewBtn(false, 'Two')">
                    {{ $t("cancel") }}
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-row>
        </v-col>
      </div>


      <!-- SCENERIO 3 ======> survey + one for all -->
      <!-- Survey component is only visible, and this survey will be applied to all farms -->
       <v-form ref="surveyForm" @submit.prevent="riskAssessmentPreviewBtn">
      <div v-if="assessment.existing_survey === 'survey' && assessment.placement === 'one_for_all'">
        <div class="survey mt-8">

          <div v-if="!hasResponse && !riskAssessmentPreview && !hideSurvey">
            <div class="ttl d-flex justify-space-between mb-8">
              <h2>
                {{ $t("dueDiligence.manualFillOutAssessment") }}
                <v-tooltip top color="00BD73">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                      mdi-alert-circle
                    </v-icon>
                  </template>
                  <span>{{
                    $t("dueDiligence.manualFillOutAssessmentTT")
                    }}</span>
                </v-tooltip>
              </h2>
              <v-btn v-if="!hideSurvey"  color="primary" @click="downloadAssessment()">{{ $t("dueDiligence.downloadAssessmentForm") }}
              </v-btn>
            </div>

            <Survey v-if="!hideSurvey"  :surveyee="survey" :surveyResponses="surveyResponses" @questionResponses="handleQuestionResponses"
              @handleOpenSignatureModel="handleOpenSignatureModel"
              :signatureDetails="signatureDetails"
            >
            </Survey>
            <v-col cols="12">
              <div class="d-flex flex-row-reverse mt-16">
                <v-btn type="submit" color="primary" width="112" >
                  {{ $t("submit") }}
                </v-btn>
                <v-btn outlined class="mr-2" color="primary" width="112" @click="switchRiskAssessmentPreview"
                  v-if="hasResponse">
                  {{ $t("cancel") }}
                </v-btn>
              </div>
            </v-col>
          </div>
        </div>
        <div v-if="hasResponse && showDetail" class="mx-2">
          <v-col cols="3">
            <label for="">{{ $t("dueDiligence.riskAssessmentStatus") }}</label>
            <v-autocomplete :items="riskAssessmentStatusList" v-model="currentRiskAssessmentStatus" dense outlined class="wdt"
              item-text="text" item-value="val" :placeholder="$t('select')"
              @change="handleRiskAssessmentStatus"></v-autocomplete>
          </v-col>
          <v-col cols="12" class="d-flex flex-row-reverse">
            <v-btn type="button" color="primary" width="112" @click="switchRiskAssessmentPreview">
              {{ $t("edit") }}
            </v-btn>
          </v-col>

          <SurveyFinal :surveyee="survey" :surveyResponses="surveyResponses" :diligenceId="diligenceId"
            :assessmentId="assessmentId" :eudrSettings="eudrSettings" :productionPlaceId="selectedItem?.id"/>
          <v-row>
            <v-col cols="12" class="mb-5">
              <div class="sign-box">
                <p>
                  {{ $t("deforestation.signParticipationSurvey") }}
                </p>
                <div class="signature-img-box d-flex">
                  <img width="150" v-if="signatureDetails.signatureS3Location"
                    :src="signatureDetails.signatureS3Location" />
                  <div class="p-info">
                    <p>
                      {{ $t() }} <br />
                      {{ fullName }} <br />
                      {{ $t("date") }}: {{ currentDate }}
                    </p>
                  </div>
                </div>
              </div>
            </v-col>
            <v-col cols="12">
              <div class="rsk-sign d-flex flex-row-reverse">
                <p>
                  <v-btn x-small fab color="yellowIcon">
                    <v-icon rounded>mdi-hammer-wrench</v-icon>
                  </v-btn>
                  {{ $t('deforestation.riskMitigation') }}
                </p>
                &nbsp;
                <p class="mr-2">
                  <v-btn x-small fab color="primary">
                    <v-icon rounded style="color:white !important">mdi-history</v-icon>
                  </v-btn>
                  {{ $t('deforestation.riskMitigationHistory') }}
                </p>
              </div>
            </v-col>
          </v-row>
        </div>
      </div>
    </v-form>


      <!-- SCENERIO 4 ======> survey + one for each -->
      <!-- // survey component + all farms tables -->
      <div v-if="assessment.existing_survey === 'survey' && assessment.placement === 'one_for_each'">
        <AssessmentStatus v-if="assessmentId && productionPlaces?.length > 0" :diligenceId="diligenceId" :farmsList="productionPlaces"  :assessmentId="assessmentId" :key="statusReloadKey" />
        <v-col class="px-0">
          <div class="d-flex">
            <h3 style="color:black">
              {{ $t("deforestation.productionPlaces") }}
              <v-tooltip top color="00BD73" max-width="350">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                    mdi-alert-circle
                  </v-icon>
                </template>
                <span>{{ $t("dueDiligence.productionPlaces") }}</span>
              </v-tooltip>
            </h3>
          </div>

          <v-data-table single-select :headers="placesHeaders" :items="productionPlaces" hide-default-footer
            :server-items-length="totalProductionPlaces" item-key="id" v-model="selectedArray"
            :loading-text="$t('deforestation.productionPlaces')">
            <template v-slot:top="{}">
              <!-- width: 290px; margin-top: 22px; -->
              <div class="d-flex justify-space-between filter-pro-places">
                <div class="d-flex align-center filter-section">
                  <div style="width: 290px; margin-top: 22px;">
                    <v-text-field prepend-inner-icon="mdi-magnify" outlined height="5px" :placeholder="$t('search')"
                      dense v-model="search" @input="handleSearchByPharse" class="shrink" clearable></v-text-field>
                  </div>
                  <div class="ml-3" style="width: 290px;">
                    <label for="text">{{ $t("country") }}</label>
                    <v-select :items="countries" v-model="country" item-text="name" item-value="name" dense outlined
                      class="wdt" :placeholder="$t('select')" @change="handleSearchByCountry"></v-select>
                  </div>

                  <div class="ml-3" style="width: 290px;">
                    <label for="text">{{ $t("deforestation.supplier") }}</label>
                    <!-- {{JSON.stringify(formattedSupplier)}} -->
                    <v-select :items="formattedSupplier" v-model="suppplier" item-text="fullName" item-value="id" dense
                      outlined class="wdt" :placeholder="$t('select')" @change="handleSearchBySupplier"></v-select>
                  </div>

                  <div class="ml-3" style="width: 290px;">
                    <label for="text">{{
                      $t("dueDiligence.riskAssessmentStatus")
                      }}</label>
                    <v-select :items="riskAssessmentStatusListFilter" v-model="riskAssessmentStatus" dense outlined
                      class="wdt" item-text="text" item-value="val" :placeholder="$t('select')"
                      @change="handleSearchByStatus"></v-select>
                  </div>
                </div>

                <!-- margin-top: 15px; -->
                <div class="d-flex mb-5 pagination">
                  <div class="py-1 title">
                    {{ options.page }} - {{ totalPages }} of
                    {{ totalProductionPlaces }}
                  </div>
                  <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page <= 1"
                    @click="pageChange(false)">
                    <v-icon dark>
                      mdi-chevron-left
                    </v-icon>
                  </v-btn>
                  <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page >= totalPages"
                    @click="pageChange(true)">
                    <v-icon dark>
                      mdi-chevron-right
                    </v-icon>
                  </v-btn>
                </div>
              </div>
            </template>
            <template v-slot:body="{ items }">
              <tbody>
                <tr v-for="(item) in items" :key="item.id" style="position: relative; width: 0; height: 0"
                  @click="checkboxChange(item)">
                  <!-- <td>
                    <v-checkbox v-model="selected" :value="item.id" hide-details
                      @change="checkboxChange(item)"></v-checkbox>
                  </td> -->
                  <td>{{ item.farm.farmName }} {{ item.farm.farmNumber }}</td>
                  <td>
                    {{ item.farm.userDdsAssoc.firstName }}
                    {{ item.farm.userDdsAssoc.lastName }}
                  </td>
                  <td>{{ item.farm.address || "" }}</td>
                  <td>{{ acerToHectare(item.farm.area) }}</td>
                  <td>{{ item.farmType || "" }}</td>
                  <td>
                    <div class="d-flex">
                      <div class="d-flex" v-if="
                        getRiskAssessmentStatus(item?.diligenceReportProductionPlaceArray[0]?.all_risk_assessments?.[0]?.riskAssessmentStatus)
                          .text !== 'N/A'
                      ">
                        <v-btn small rounded min-width="200" depressed :class="getRiskAssessmentStatus(
                          item?.diligenceReportProductionPlaceArray[0]?.all_risk_assessments?.[0]?.riskAssessmentStatus
                        ).class
                          " height="34">
                          {{
                          getRiskAssessmentStatus(
                          item?.diligenceReportProductionPlaceArray[0]?.all_risk_assessments?.[0]?.riskAssessmentStatus
                          ).text
                          }}
                        </v-btn>
                        <v-tooltip :key="item.id" bottom v-if="item.diligenceReportProductionPlaceArray[0].isDisregarded">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon class="ml-2" v-bind="attrs" v-on="on" color="warning">mdi-alert</v-icon>
                          </template>
                          <span style="white-space-collapse: preserve-breaks">
                            {{ item.diligenceReportProductionPlaceArray[0].isDisregarded ? 'The farm has been disregarded' : item.warning }}
                          </span>
                      </v-tooltip>
                      </div>
                      <span v-else class="text-decoration-underline cursor-pointer" @click="addAssessment(item)">
                        {{ assessmentStatusTexts[item.id] || 'Loading...' }}
                      </span>
                      <v-spacer></v-spacer>
                      <v-icon style="cursor:pointer" class="ml-1 primary--text"
                        @click="farmRemoveConfirmDialog = true; deleteFarmId = item.farmId">mdi-trash-can</v-icon>
                    </div>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-data-table>
          <div class="button-container py-8">
            <v-btn
              color="primary"
              class="mr-2"
              @click="removeRiskFarms"
            >
              {{$t("dueDiligence.removeRiskFarms")}}
            </v-btn>
            <v-btn
              color="primary"
              class="mr-2"
              @click="disregardRiskFarms"
            >
              {{$t("dueDiligence.disregardRiskDocument")}}
            </v-btn>
            <v-btn
              color="primary"
              class="mr-2"
              @click="triggerFileInput"
            >
              {{$t("dueDiligence.attachRiskMitigationDocumentForNonCompliantFarms")}}
            </v-btn>
            <v-tooltip top color="00BD73" max-width="350">
              <template v-slot:activator="{ on, attrs }">
                <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">

                  mdi-alert-circle

                </v-icon>
              </template>
              <span>{{ $t("dueDiligence.uploadMitigationDocumentForNonCompliantFarms") }}</span>
            </v-tooltip>
          </div>

          <input type="file" ref="fileInput" accept="application/pdf" @change="handleFileChange" style="display: none;" />
  
          <!-- Disregard Risk Farms Dialog -->
          <DisregardRiskFarmDialog
            :visible="disregardDialog"
            :title="$t('dueDiligence.disregardFarmWithIssuesTitle')"
            :bodyText="$t('dueDiligence.disregardFarmWithIssuesMessage')"
            :buttonText= "$t('confirm')"
            :onCancel="cancelDisregardRiskFarms"
            :onConfirm="confirmDisregardRiskFarms"
          />

          <!-- Remove Risk Farms Dialog -->
            <DisregardRiskFarmDialog
            :visible="removeRiskFarmsDialog"
            :title="$t('dueDiligence.removeRiskFarmTitle')"
            :bodyText="$t('dueDiligence.removeRiskFarmMessage')"
            :buttonText= "$t('remove')"
            :onCancel="cancelRemoveRiskFarms"
            :onConfirm="confirmRemoveRiskFarms"
          />

           <!-- Conditional rendering for file and comment section -->
           <div v-if="s3LocationForNonCompliant || nonCompliantComment">
            <!-- File input section -->
            <input type="file" ref="fileInput" accept="application/pdf" @change="handleFileChange" style="display: none;" />
              
          </div>

          <v-row class="mt-10 d-flex mb-20 ml-4" v-if="fileUploading || nonCompliantComment || s3LocationForNonCompliant">
          <div>
            <v-sheet style="border: 1px solid #ccc; border-radius: 0px; "
              class="d-flex align-center justify-center flex-wrap text-center px-4" height="100" width="100">
              <v-icon dark style="color: green" @click="openPdf">
                mdi-eye
              </v-icon>
              {{ uploadFileType }}
            </v-sheet>
            <h3 style="color:green" class="pt-1 pb-10">
              {{ uploadedFileName }}
            </h3>
          </div>
          <div style="width:30%">
            <v-textarea class="px-4" :rows="3" v-model="nonCompliantComment" :placeholder="$t('activationKey.comments')" @input="handleNonCompliantRiskMitigation" outlined></v-textarea>
          </div>
          </v-row>  

          <v-col cols="12" class="px-4" v-if="farmDetails && this.selectedItem">
            <v-row>
              <v-col cols="12 mt-10 mb-3">
                <div class="ttl d-flex justify-space-between">
                  <h2>
                    Farm Details
                    <v-tooltip top color="00BD73">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                          mdi-alert-circle
                        </v-icon>
                      </template>
                      <span>Farm Details</span>
                    </v-tooltip>
                  </h2>
                </div>
              </v-col>
              <v-col cols="4">
                <p class="pt-3">Farm</p>
                <h4>{{ this.selectedItem.farm.farmName || "-" }}</h4>
              </v-col>
              <v-col cols="4">
                <p class="pt-3">Producer</p>
                <h4>
                  {{ this.selectedItem.farm.userDdsAssoc.firstName }}
                  {{ this.selectedItem.farm.userDdsAssoc.lastName }}
                </h4>
              </v-col>
              <v-col cols="4">
                <p class="pt-3">Date Submitted</p>
                <h4>{{ formatDate(this.selectedItem.createdAt) }}</h4>
              </v-col>
              <v-col cols="4" v-if="hasResponse">
                <label for="">{{ $t("dueDiligence.riskAssessmentStatus") }}</label>
                <v-autocomplete :items="riskAssessmentStatusList" v-model="currentRiskAssessmentStatus" dense outlined ref="riskAssessmentStatusChange"
                :rules="[(v) => !!v || this.$t('deforestation.thisFieldIsRequired')]" class="wdt" item-text="text" item-value="val" :placeholder="$t('select')" 
                  @change="updateIndividualAssessmentStatus"></v-autocomplete>
              </v-col>
            </v-row>
          </v-col>

          <v-form ref="surveyForm" @submit.prevent="riskAssessmentPreviewBtn">
          <v-col cols="12" class="mx-1" v-if="farmDetails && this.selectedItem" >
            <v-col cols="12" v-if="!hasResponse && !riskAssessmentPreview && this.selectedItem && !hideSurvey">
              <div class="survey mt-8">
                <div class="ttl d-flex justify-space-between mb-8">
                  <h2>
                    {{ $t("dueDiligence.manualFillOutAssessment") }}
                    <v-tooltip top color="00BD73">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                          mdi-alert-circle
                        </v-icon>
                      </template>
                      <span>{{
                        $t("dueDiligence.manualFillOutAssessmentTT")
                        }}</span>
                    </v-tooltip>
                  </h2>
                  <v-btn v-if="!hideSurvey" color="primary" @click="downloadAssessment()">{{ $t("dueDiligence.downloadAssessmentForm") }}
                  </v-btn>
                </div>
                <Survey v-if="!hideSurvey" :surveyee="survey" :surveyResponses="surveyResponses"
                  @questionResponses="handleQuestionResponses"
                  @handleOpenSignatureModel="handleOpenSignatureModel"
                  :signatureDetails="signatureDetails"
                >
                </Survey>
              </div>
              <v-col cols="12">
                <div class="d-flex flex-row-reverse mt-16">
                  <v-btn type="submit" color="primary" width="112" >
                    {{ $t("submit") }}
                  </v-btn>
                  <v-btn outlined class="mr-2" color="primary" width="112" @click="switchRiskAssessmentPreview"
                    v-if="hasResponse">
                    {{ $t("cancel") }}
                  </v-btn>
                </div>
              </v-col>

            </v-col>

            <div v-if="hasResponse && showDetail" class="mx-2">
              <v-col cols="12" class="d-flex flex-row-reverse">
                <v-btn type="button" color="primary" width="112" @click="switchRiskAssessmentPreview">
                  {{ $t("edit") }}
                </v-btn>
              </v-col>

              <SurveyFinal :surveyee="survey" :surveyResponses="surveyResponses" :diligenceId="diligenceId"
                :assessmentId="assessmentId" :eudrSettings="eudrSettings"  :productionPlaceId="selectedItem?.id"
                />
              <v-row>
                <v-col cols="12" class="mb-5">
                  <div class="sign-box">
                    <p>
                      {{ $t("deforestation.signParticipationSurvey") }}
                    </p>
                    <div class="signature-img-box d-flex">
                      <img width="150" v-if="signatureDetails.signatureS3Location"
                        :src="signatureDetails.signatureS3Location" />
                      <div class="p-info">
                        <p>
                          {{ $t() }} <br />
                          {{ fullName }} <br />
                          {{ $t("date") }}: {{ currentDate }}
                        </p>
                      </div>
                    </div>
                  </div>
                </v-col>
                <v-col cols="12">
                  <div class="rsk-sign d-flex flex-row-reverse">
                    <p>
                      <v-btn x-small fab color="yellowIcon">
                        <v-icon rounded>mdi-hammer-wrench</v-icon>
                      </v-btn>
                      {{ $t('deforestation.riskMitigation') }}
                    </p>
                    &nbsp;
                    <p class="mr-2">
                      <v-btn x-small fab color="primary">
                        <v-icon rounded>mdi-history</v-icon>
                      </v-btn>
                      {{ $t('deforestation.riskMitigationHistory') }}
                    </p>
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-form>
        </v-col>
      </div>


      <!-- SCENERIO 5 ======> farmer  -->
      <div v-if="assessment.existing_survey === 'farmer'">
        <AssessmentStatus v-if="assessmentId && productionPlaces?.length > 0" :diligenceId="diligenceId" :farmsList="productionPlaces" :assessmentId="assessmentId" :key="statusReloadKey"  />
        <v-col class="px-0">
          <div class="d-flex">
            <h3 style="color:black">
              {{ $t("deforestation.productionPlaces") }}
              <v-tooltip top color="00BD73" max-width="350">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon class="icon-with-background primary--text   " style="color:#0EBF67" v-bind="attrs" v-on="on">
                    mdi-alert-circle
                  </v-icon>
                </template>
                <span>{{ $t("dueDiligence.productionPlaces") }}</span>
              </v-tooltip>
            </h3>
          </div>

          <v-data-table single-select :headers="placesHeaders" :items="productionPlaces" hide-default-footer
            :server-items-length="totalProductionPlaces" item-key="id" v-model="selectedArray"
            :loading-text="$t('deforestation.productionPlaces')">
            <template v-slot:top="{}">
              <!-- width: 290px; margin-top: 22px; -->
              <div class="d-flex justify-space-between filter-pro-places">
                <div class="d-flex align-center filter-section">
                  <div style="width: 290px; margin-top: 22px;">
                    <v-text-field prepend-inner-icon="mdi-magnify" outlined height="5px" :placeholder="$t('search')"
                      dense v-model="search" @input="handleSearchByPharse" class="shrink" clearable></v-text-field>
                  </div>
                  <div class="ml-3" style="width: 290px;">
                    <label for="text">{{ $t("country") }}</label>
                    <v-select :items="countries" v-model="country" item-text="name" item-value="name" dense outlined
                      class="wdt" :placeholder="$t('select')" @change="handleSearchByCountry"></v-select>
                  </div>

                  <div class="ml-3" style="width: 290px;">
                    <label for="text">{{ $t("deforestation.supplier") }}</label>
                    <!-- {{JSON.stringify(formattedSupplier)}} -->
                    <v-select :items="formattedSupplier" v-model="suppplier" item-text="fullName" item-value="id" dense
                      outlined class="wdt" :placeholder="$t('select')" @change="handleSearchBySupplier"></v-select>
                  </div>

                  <div class="ml-3" style="width: 290px;">
                    <label for="text">{{
                      $t("dueDiligence.riskAssessmentStatus")
                      }}</label>
                    <v-select :items="riskAssessmentStatusList" v-model="riskAssessmentStatus" dense outlined
                      class="wdt" item-text="text" item-value="val" :placeholder="$t('select')"
                      @change="handleSearchByStatus"></v-select>
                  </div>
                </div>

                <!-- margin-top: 15px; -->
                <div class="d-flex mb-5 pagination">
                  <div class="py-1 title">
                    {{ options.page }} - {{ totalPages }} of
                    {{ totalProductionPlaces }}
                  </div>
                  <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page <= 1"
                    @click="pageChange(false)">
                    <v-icon dark>
                      mdi-chevron-left
                    </v-icon>
                  </v-btn>
                  <v-btn class="mx-2" fab small outlined color="primary" :disabled="options.page >= totalPages"
                    @click="pageChange(true)">
                    <v-icon dark>
                      mdi-chevron-right
                    </v-icon>
                  </v-btn>
                </div>
              </div>
            </template>
            <template v-slot:body="{ items }">
              <tbody>
                <tr v-for="(item) in items" :key="item.id" style="position: relative; width: 0; height: 0"
                  @click="checkboxChange(item)">
                  <!-- <td>
                    <v-checkbox v-model="selected" :value="item.id" hide-details
                      @change="checkboxChange(item)"></v-checkbox>
                  </td> -->
                  <td>{{ item.farm.farmName }} {{ item.farm.farmNumber }}</td>
                  <td>
                    {{ item.farm.userDdsAssoc.firstName }}
                    {{ item.farm.userDdsAssoc.lastName }}
                  </td>
                  <td>{{ item.farm.address || "" }}</td>
                  <td>{{ acerToHectare(item.farm.area) }}</td>
                  <td>{{ item.farmType || "" }}</td>
                  <td>
                    <div class="d-flex">
                      <div class="d-flex" v-if="
                        getRiskAssessmentStatus(item?.assessment_production_place?.riskAssessmentStatus)
                          .text !== 'N/A'
                      ">
                        <v-btn small rounded min-width="200" depressed :class="getRiskAssessmentStatus(
                          item?.assessment_production_place?.riskAssessmentStatus
                        ).class
                          " height="34">
                          {{
                            getRiskAssessmentStatus(
                              item?.assessment_production_place?.riskAssessmentStatus
                          ).text
                          }}
                        </v-btn>
                        <!-- <img
                      class="ml-1"
                      src="/icons/todo-list.png"
                      style="width: 34px; height: 34px; border-radius: 50%;"
                    /> -->
                      </div>
                      <span v-else class="text-decoration-underline cursor-pointer" @click="addAssessment(item)">
                        {{ assessmentStatusTexts[item.id] || 'Loading...' }}
                      </span>
                      <v-spacer></v-spacer>
                      <v-icon style="cursor:pointer" class="ml-1 green-shadow"
                        @click="farmRemoveConfirmDialog = true; deleteFarmId = item.farmId">mdi-trash-can</v-icon>
                    </div>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-data-table>
          <div class="button-container py-8">
            <v-btn
              color="primary"
              class="mr-2"
              @click="removeRiskFarms"
            >
              {{$t("dueDiligence.removeRiskFarms")}}
            </v-btn>
            <v-btn
              color="primary"
              class="mr-2"
              @click="disregardRiskFarms"
            >
              {{$t("dueDiligence.disregardRiskDocument")}}
            </v-btn>
            <v-btn
              color="primary"
              class="mr-2"
              @click="triggerFileInput"
            >
              {{$t("dueDiligence.attachRiskMitigationDocumentForNonCompliantFarms")}}
            </v-btn>
            <v-tooltip top color="00BD73" max-width="350">
              <template v-slot:activator="{ on, attrs }">
                <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">

                  mdi-alert-circle

                </v-icon>
              </template>
              <span>{{ $t("dueDiligence.uploadMitigationDocumentForNonCompliantFarms") }}</span>
            </v-tooltip>
          </div>

          <input type="file" ref="fileInput" accept="application/pdf" @change="handleFileChange" style="display: none;" />
  
          <!-- Disregard Risk Farms Dialog -->
          <DisregardRiskFarmDialog
            :visible="disregardDialog"
            :title="$t('dueDiligence.disregardFarmWithIssuesTitle')"
            :bodyText="$t('dueDiligence.disregardFarmWithIssuesMessage')"
            :buttonText= "$t('confirm')"
            :onCancel="cancelDisregardRiskFarms"
            :onConfirm="confirmDisregardRiskFarms"
          />

          <!-- Remove Risk Farms Dialog -->
            <DisregardRiskFarmDialog
            :visible="removeRiskFarmsDialog"
            :title="$t('dueDiligence.removeRiskFarmTitle')"
            :bodyText="$t('dueDiligence.removeRiskFarmMessage')"
            :buttonText= "$t('remove')"
            :onCancel="cancelRemoveRiskFarms"
            :onConfirm="confirmRemoveRiskFarms"
          />

           <!-- Conditional rendering for file and comment section -->
           <div v-if="s3LocationForNonCompliant || nonCompliantComment">
            <!-- File input section -->
            <input type="file" ref="fileInput" accept="application/pdf" @change="handleFileChange" style="display: none;" />
              
          </div>

          <v-row class="mt-10 d-flex mb-20 ml-4" v-if="fileUploading || nonCompliantComment || s3LocationForNonCompliant">
            <div>
              <v-sheet style="border: 1px solid #ccc; border-radius: 0px; "
                class="d-flex align-center justify-center flex-wrap text-center px-4" height="100" width="100">
                <v-icon dark style="color: green" @click="openPdf">
                  mdi-eye
                </v-icon>
                {{ uploadFileType }}
              </v-sheet>
              <h3 style="color:green" class="pt-1 pb-10">
                {{ uploadedFileName }}
              </h3>
            </div>
            <div style="width:30%">
              <v-textarea class="px-4" :rows="3" v-model="nonCompliantComment" :placeholder="$t('activationKey.comments')" @input="handleNonCompliantRiskMitigation" outlined></v-textarea>
            </div>
          </v-row> 
        </v-col>
        <v-col cols="12" class="px-4" v-if="farmDetails && this.selectedItem">
            <v-row>
              <v-col cols="12 mt-10 mb-3">
                <div class="ttl d-flex justify-space-between">
                  <h2>
                    Farm Details
                    <v-tooltip top color="00BD73">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                          mdi-alert-circle
                        </v-icon>
                      </template>
                      <span>Farm Details</span>
                    </v-tooltip>
                  </h2>
                </div>
              </v-col>
              <v-col cols="4">
                <p class="pt-3">Farm</p>
                <h4>{{ this.selectedItem.farm.farmName || "-" }}</h4>
              </v-col>
              <v-col cols="4">
                <p class="pt-3">Producer</p>
                <h4>
                  {{ this.selectedItem.farm.userDdsAssoc.firstName }}
                  {{ this.selectedItem.farm.userDdsAssoc.lastName }}
                </h4>
              </v-col>
              <v-col cols="4">
                <p class="pt-3">Date Submitted</p>
                <h4>{{ formatDate(this.selectedItem.createdAt) }}</h4>
              </v-col>
              <v-col cols="4" v-if="hasResponse">
                <label for="">{{ $t("dueDiligence.riskAssessmentStatus") }}</label>
                <v-autocomplete :items="riskAssessmentStatusList" v-model="currentRiskAssessmentStatus" dense outlined ref="riskAssessmentStatusChange"
                :rules="[(v) => !!v || this.$t('deforestation.thisFieldIsRequired')]" class="wdt" item-text="text" item-value="val" :placeholder="$t('select')" 
                  @change="updateIndividualAssessmentStatus"></v-autocomplete>
              </v-col>
            </v-row>
          </v-col>
          
        <v-form ref="surveyForm" @submit.prevent="riskAssessmentPreviewBtn">
          <v-col cols="12" class="mx-1" v-if="farmDetails && this.selectedItem" >
            <v-col cols="12" v-if="!hasResponse && !riskAssessmentPreview && this.selectedItem && !hideSurvey">
              <div class="survey mt-8">
                <div class="ttl d-flex justify-space-between mb-8">
                  <h2>
                    {{ $t("dueDiligence.manualFillOutAssessment") }}
                    <v-tooltip top color="00BD73">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs" v-on="on">
                          mdi-alert-circle
                        </v-icon>
                      </template>
                      <span>{{
                        $t("dueDiligence.manualFillOutAssessmentTT")
                        }}</span>
                    </v-tooltip>
                  </h2>
                  <v-btn v-if="!hideSurvey" color="primary" @click="downloadAssessment()">{{ $t("dueDiligence.downloadAssessmentForm") }}
                  </v-btn>
                </div>
                <Survey v-if="!hideSurvey" :surveyee="survey" :surveyResponses="surveyResponses"
                  @questionResponses="handleQuestionResponses"
                  @handleOpenSignatureModel="handleOpenSignatureModel"
                  :signatureDetails="signatureDetails"
                >
                </Survey>
              </div>
              <v-col cols="12">
                <div class="d-flex flex-row-reverse mt-16">
                  <v-btn type="submit" color="primary" width="112" >
                    {{ $t("submit") }}
                  </v-btn>
                  <v-btn outlined class="mr-2" color="primary" width="112" @click="switchRiskAssessmentPreview"
                    v-if="hasResponse">
                    {{ $t("cancel") }}
                  </v-btn>
                </div>
              </v-col>

            </v-col>

            <div v-if="hasResponse && showDetail" class="mx-2">
              <v-col cols="12" class="d-flex flex-row-reverse">
                <v-btn type="button" color="primary" width="112" @click="switchRiskAssessmentPreview">
                  {{ $t("edit") }}
                </v-btn>
              </v-col>

              <SurveyFinal :surveyee="survey" :surveyResponses="surveyResponses" :diligenceId="diligenceId"
                :assessmentId="assessmentId" :eudrSettings="eudrSettings" :productionPlaceId="selectedItem?.id"/>
              <v-row>
                <v-col cols="12" class="mb-5">
                  <div class="sign-box">
                    <p>
                      {{ $t("deforestation.signParticipationSurvey") }}
                    </p>
                    <div class="signature-img-box d-flex">
                      <img width="150" v-if="signatureDetails.signatureS3Location"
                        :src="signatureDetails.signatureS3Location" />
                      <div class="p-info">
                        <p>
                          {{ $t() }} <br />
                          {{ fullName }} <br />
                          {{ $t("date") }}: {{ currentDate }}
                        </p>
                      </div>
                    </div>
                  </div>
                </v-col>
                <v-col cols="12">
                  <div class="rsk-sign d-flex flex-row-reverse">
                    <p>
                      <v-btn x-small fab color="yellowIcon">
                        <v-icon rounded>mdi-hammer-wrench</v-icon>
                      </v-btn>
                      {{ $t('deforestation.riskMitigation') }}
                    </p>
                    &nbsp;
                    <p class="mr-2">
                      <v-btn x-small fab color="primary">
                        <v-icon rounded>mdi-history</v-icon>
                      </v-btn>
                      {{ $t('deforestation.riskMitigationHistory') }}
                    </p>
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-form>
      </div>


      <signature @handleSignature="handleSignature" :dialog="openSignatureModel"
        @closeSignatureModel="openSignatureModel = false">
      </signature>
    </v-container>
    <confirm-box
      :title="farmRemoveConfirm.title"
      :message="farmRemoveConfirm.message"
      :cancelBtnText="farmRemoveConfirm.cancelBtnText"
      :confirmBtnText="farmRemoveConfirm.confirmBtnText"
      :confirmData="farmRemoveConfirm.confirmData"
      :dialog="farmRemoveConfirmDialog"
      @cancel:action="farmRemoveConfirmDialog = false"
      @continue:action="removeFarm"
    />
  </div>
</template>

<script>
import DownloadMixin from "@/mixins/DownloadMixin";
import loadingMixin from "@/mixins/LoadingMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import SignatureModal from "../../reports/components/risk-assessment/SignatureModal.vue";
import Survey from "../../survey/Survey.vue";
import DeforestationService from "@/_services/DeforestationService";
import ActivityLogService from "@/_services/ActivityLogService";
import { getCountries } from "country-state-picker";
import DateMixin from '@/mixins/DateMixin';

import S3UploadService from "@/_services/S3UploadService";
import DeforestationSurveyBuilderService from "@/_services/DeforestationSurveyBuilderService";
import {
  getRiskAssessmentStatus,
} from "@/utils";
import SurveyFinal from "../../survey/SurveyFinal.vue";
import moment from "moment";
import { mapGetters } from 'vuex';
import ConfirmBox from "@/components/ConfirmBox";
import DisregardRiskFarmDialog from "../components/DisregardRiskFarmDialog.vue";
import AssessmentStatus from "./partials/AssessmentStatus.vue";
import { debounce } from "lodash";
import { EventBus } from '@/utils.js';

export default {
  name: "RiskAssessment",
  props: {
    report: {},
    assessment: {},
    diligenceId: {
      type: [String, Number],
    },
  },

  computed: {

    ...mapGetters("eudrSettings", ["get_EUDR_Settings"]),

    selectedArray: {
      get: function() {
        if(!this.selected) return [];
        if(Array.isArray(this.selected)) return this.selected;
        return [this.selected];
      },
      set: function(newValue) {
        if(Array.isArray(newValue)) {
          this.selected = newValue[0];
        } else {
          this.selected = newValue;
        }
      }
    },

    getOrganizationId() {
      return this.$store.getters.getUser?.user_organization?.id;
    },
    getCurrentUser() {
      return this.$store.getters.getUser;
    },
    fullName() {
      const { firstName, lastName } = this.getCurrentUser;
      return `${firstName || ''} ${lastName || ''}`;
    },

    formattedSupplier() {
      return this.supplierList?.map((person) => ({
        ...person,
        fullName: `${person.firstName} ${person.lastName}`,
      }));
    },
    eudrSettings() {
      return this.get_EUDR_Settings;
    },
  },
  watch:{
    reloadViewAdd(){
      this.getAssessmentForOneForEach()
     }
  },
  async mounted() {
    this.startLoading();

    if (typeof this.assessment === "object" && this.assessment.assessment_id) {
      this.assessmentId = parseInt(this.assessment.assessment_id);
    }

    await Promise.all([
      this.findQuestionForSurvey(this.assessmentId),
      this.getProductionPlaces(),
      this.getSupplierList()
    ]);

    if (this.assessment.placement == "one_for_each") {
      this.isOneForEachFarm = true;
      this.showDetail = false;
    }
    if (this.assessment.existing_survey === "existing") {
      this.getRiskAssessmentFiles();
    }

    if(this.assessment.placement == 'one_for_all' && this.assessment.existing_survey !== 'existing') {
      await this.fetchAllSavedResponseForSurvey(
        this.diligenceId,
        this.assessmentId,
        this.getCurrentUser.id
      );
    }

    // Move non-async operations outside of async calls
    this.getCountry();
    this.setCurrentDate();
    this.existingSurvey = this.assessment.existing_survey;

    // Existing mounted logic
    this.getAssessmentForOneForEach()

    this.$emit('calculateWarningsForDeforestationAssessment', this.diligenceId);

    this.stopLoading();
  },

  components: {
    signature: SignatureModal,
    Survey: Survey,
    SurveyFinal,
    "confirm-box": ConfirmBox,
    DisregardRiskFarmDialog,
    AssessmentStatus
  },
  data() {
    return {
      reloadViewAdd:0,
      hideSurvey: false,
      deleteFarmId: 0,
      farmRemoveConfirm: {
        title: this.$t("confirmDialog.farm.delete.title"),
        message: this.$t("confirmDialog.farm.delete.message"),
        confirmBtnText: this.$t("confirmDialog.farm.delete.confirmBtn"),
        cancelBtnText: this.$t("cancel"),
        confirmData: {},
      },
      farmRemoveConfirmDialog: false,
      fileError : false,
      scenerioOnePreview: false,
      scenerioTwoPreview: false,

      hasResponse: false,
      showDetail: true,
      riskAssessmentPreview: undefined,
      assessmentId: null,
      country: [],
      suppplier: "",
      riskAssessmentStatus: "",
      countriesOnly: [],
      countries: [],
      supplierList: [],
      riskAssessmentStatusListFilter: [
        { text: this.$t('memberDataSection.approved'), val: "approved" },
        { text: this.$t('deforestation.mitigationRequired'), val: "mitigation_required" },
        { text: this.$t('memberDataSection.rejected'), val: "rejected" },
        { text: this.$t('memberDataSection.pOrder.viewAll'), val: "" },
      ],
      riskAssessmentStatusList: [
        { text: this.$t('memberDataSection.approved'), val: "approved" },
        { text: this.$t('deforestation.mitigationRequired'), val: "mitigation_required" },
        { text: this.$t('memberDataSection.rejected'), val: "rejected" },
      ],
      search: "",
      farmStatus: "success",
      farmStatusList: [],
      totalProductionPlaces: 0,
      options: {
        page: 1,
        itemsPerPage: 10,
      },
      totalPages: 0,

      placesHeaders: [
        // {
        //   text: "check",
        //   value: "",
        //   sortable: false,
        //   class: "black--text",
        //   width: "150px",
        // },
        {
          text: this.$t("dueDiligence.productionPlaceAndFarmID"),
          align: "start",
          sortable: true,
          value: "user",
          class: "black--text",
          width: "150px",
        },

        {
          text: this.$t("deforestation.producer"),
          value: "plantation_name",
          sortable: true,
          class: "black--text",
          width: "150px",
        },
        {
          text: `${this.$t("deforestation.addressOfProduction")}`,
          value: "farm",
          sortable: true,
          class: "black--text",
          width: "150px",
        },
        {
          text: `${this.$t("deforestation.areaHa")}`,
          value: "farm",
          sortable: true,
          class: "black--text",
          width: "95px",
        },
        {
          text: `${this.$t("deforestation.type")}`,
          value: "farm",
          sortable: true,
          class: "black--text",
          width: "95px",
        },

        {
          text: `${this.$t("deforestation.riskAssessment")}`,
          value: "farm",
          sortable: true,
          class: "black--text",
          width: "225px",
        },
      ],
      productionPlaces: [],
      selected: null,
      documents: [],
      s3FileUploadResult: [],
      productExpirationMenu: false,
      openSignatureModel: false,
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: true,
          to: "/",
        },
        {
          text: this.$t("deforestation.riskAssessment"),
          disabled: true,
          to: "breadcrumbs_link_1",
        },
      ],
      dragging: false,
      previewUrl: null,
      additionalFileOne: true,
      additionalPrevUrlOne: null,
      additionalPrevUrlTwo: null,
      openAddPricingSlab: false,
      stepWiseSurveyQuestions: [],
      survey: [],
      surveyResponses: [],
      isOneForEachFarm: false,
      selectedProductionPlaceFarmId: null,
      surveyResponseWithProductionPlaceFarmId: [],
      signatureDetails: {
        signatureS3Location: null,
        signatureS3Key: null,
      },
      fileUploading: false,
      nonCompliantComment: null,
      uploadFileType: "",
      uploadedFileName: "",
      s3LocationForNonCompliant: '',
      s3keyForNonCompliant: '',
      currentDate: "",
      uploadFile: false,
      takeAssessment: false,
      selectedItem: null,
      farmDetails: false,
      currentRiskAssessmentStatus: "",
      disregardDialog: false,
      removeRiskFarmsDialog: false,
      rules: {
        required: value => !!value || this.$t('deforestation.thisFieldIsRequired'),
      },
      assessmentStatusTexts: {},
      existingSurvey: "",
      statusReloadKey: 0,
    };
  },

  methods: {
    getAssessmentForOneForEach(){
      if(this.assessment.placement == 'one_for_each') {
      //&& this.assessment.existing_survey === 'farmer'
        for (const item of this.productionPlaces) {
          this.getAssessmentStatusText(item);
        }
      }  
    },
    async verifyResponse(diligenceId, assessmentId, farmId) {
        const { statusText } = await this.fetchAllSavedResponseForSurvey(
            diligenceId,
            assessmentId,
            null,
            farmId
        );
        return statusText;
    },

    async getAssessmentStatusText(item) {
        const diligenceId = this.existingSurvey !== "farmer" ? this.diligenceId : null;
        const statusText = await this.verifyResponse(diligenceId, this.assessmentId, item.farmId);
        this.$set(this.assessmentStatusTexts, item.id, statusText);
    },

    async openFile(url) {
      try {
        // Extract the file key from the URL (after bucket URL)
        const fileKey = url.split('.com/')[1];
        // Get the URL for viewing the file
        const viewUrl = await S3UploadService.getFileUrl(fileKey);
        window.open(viewUrl, "_blank");
      } catch (error) {
        console.error('Error opening file:', error);
      }
    },
    openPdf(){
      window.open(this.s3LocationForNonCompliant);
    },
    async checkboxChange(item) {
        this.startLoading()
        
        // Clear previous selection if clicking same item
        if (this.selected === item.id) {
          this.farmDetails = false;
          this.selectedItem = null;
          this.selected = null;
          this.showDetail = false;
          this.surveyResponses = [];
          this.riskAssessmentPreview = false;
          this.scenerioOnePreview = false;
          this.scenerioTwoPreview = false;
          this.stopLoading();
          return;
        }
        // Set new selection
        this.farmDetails = true;
        this.selectedItem = item;
        this.selected = item.id;
        this.showDetail = true;
        this.surveyResponses = [];
        this.riskAssessmentPreview = false;
        this.scenerioOnePreview = false;
        this.scenerioTwoPreview = false;
        const diligenceId = this.existingSurvey !== "farmer" ? this.diligenceId : null;
        await this.fetchAllSavedResponseForSurvey(
          diligenceId,
          this.assessmentId,
          this.getCurrentUser.id,
          item.farmId
        );
        this.getRiskAssessmentFiles();
        const riskAssessments = this.selectedItem?.diligenceReportProductionPlaceArray[0]?.all_risk_assessments?.[0]?.riskAssessmentStatus;
        this.currentRiskAssessmentStatus = riskAssessments ? riskAssessments.find(item => item.id == this.assessmentid)?.riskAssessmentStatus : null;
          
        this.stopLoading()
      },
    editAction() {
      this.riskAssessmentPreview = false
      this.showDetail = true
    },
    getRiskAssessmentStatus,
    async downloadAssessment() {
      this.startLoading();
      await DeforestationService.downloadAssessment(this.assessmentId)
        .then((res) => {
          this.downloadBlobFile(res, "AssessmentBuilder.pdf")
        }).catch((err) => {
          console.error(err)
        })
      this.stopLoading();
    },

    triggerFileInput() {
      this.fileUploading = true;
      this.$refs.fileInput.click();
    },

    async triggerSubmit() {
      try {
        if(this.$refs.riskAssessmentStatusChange && !this.$refs.riskAssessmentStatusChange.validate()){
          this.$notify({
          text: this.$t("deforestation.riskAssessmentStatusIsRequired") ,
          type: "error",
          duration: 5000,
          });
          return false;
        }
        if (!await this.validateForm()) {
          return false;
        }

        if (this.assessment.existing_survey === "existing") {
          if (this.riskAssessmentStatus) {
            try {
              await this.handleRiskAssessmentStatus();
            } catch (error) {
              this.stopLoading();
              console.error("Error during handleRiskAssessmentStatus:", error);
              return false;
            }
          }
        } else if (this.assessment.existing_survey === "survey") {
          try {
            if(this.selectedItem) {
              return await this.submitAssessment();
            }
            return true;
          } catch (error) {
            this.stopLoading();
            console.error("Error during submitAssessment:", error);
            return false;
          }
        }
        return true;
      } catch (error) {
        this.stopLoading();
        console.error("Error during submission:", error);
        return false;
      }
    },

    setCurrentDate() {
      this.currentDate = moment().format("DD/MM/YYYY HH:mm:ss");
    },

    addAssessment(item) {
      this.farmDetails = true;
      this.selectedItem = item;
    },

    async updateIndividualAssessmentStatus() {
      this.startLoading();
      const payloadFormat = {
        diligenceReportId: Number(this.diligenceId),
        productionPlaceId: this.selectedItem ? Number(this.selectedItem.id) : null,
        assessmentId: Number(this.assessmentId),
        riskAssessmentStatus: this.currentRiskAssessmentStatus,
        taggableType: this.assessment.existing_survey === 'existing' ? 'uploads' : 'surveys',
      };

      await DeforestationService.updateRiskAssessmentStatus(payloadFormat);

      this.$store.dispatch('eudrDDS/setDiligenceData', {
                diligenceId: this.diligenceId
      })

      // to display the latest warning related to risk assessments;
      this.$emit('calculateWarningsForDeforestationAssessment', this.diligenceId);
      EventBus.$emit('triggerComplainceRiskWarning',true)
      this.riskAssessmentStatus = "";
      await this.getProductionPlaces();
      this.stopLoading();
      await this.getDiligenceDetail()
    },

    getDiligenceDetail(){
       DeforestationService.getDiligenceDetail(parseInt(this.diligenceId)).then(res => {
                this.$store.commit('eudrDDS/SET_DILIGENCE_DETAILS', res.data.getDiligenceDetail);
            }).catch(() => {console.log("ok")})
    },

    async handleRiskAssessmentStatus() {
      this.startLoading();      
      const payloadFormat = {
        diligenceReportId: this.diligenceId,
        assessmentId: this.assessmentId,
        productionPlaceId: this.selectedItem ? Number(this.selectedItem.id) : null,
        riskAssessmentStatus: this.currentRiskAssessmentStatus,
        taggableType: this.assessment.existing_survey === 'existing' ? 'uploads' : 'surveys',
      };
      const res = await DeforestationService.updateRiskAssessmentStatus(
        payloadFormat
      );

      // to display the latest warning related to risk assessments;
      this.$emit('calculateWarningsForDeforestationAssessment', this.diligenceId);
      EventBus.$emit('triggerComplainceRiskWarning',true)

      await this.getProductionPlaces();
      this.stopLoading();

      if (res && res.data && res.data.updateRiskAssessmentStatus) {
        this.$notify({
          type: "success",
          text: res.data?.updateRiskAssessmentStatus?.message,
        });
        await this.getDiligenceDetail()
      }

    },

    async uploadRiskAssessmentFiles() {
      if (this?.$refs?.riskAssessmentForm?.validate() === false) {
        return;
      }
      this.startLoading();
      const uploadPayload = {
        assessment_id: this.assessmentId,
        diligence_report_id: this.diligenceId,
        production_place_id: this.selectedItem ? this.selectedItem.id : null,
        fileDetails: this.s3FileUploadResult.map((item) => ({
          id: item.id,
          s3Key: item.s3Key,
          s3Location: item.s3Location,
          comment: item.comment,
          expiry_date: item.expiryDate,
        })),
      };
      const res = await DeforestationService.uploadRiskAssessmentFile(
        uploadPayload
      );
      this.stopLoading();
      if (res && res.data) {
        this.$notify({
          type: "success",
          text: this.$t("filesSucessfullyUploaded"),
        });
        this.getProductionPlaces();
        // to display the latest warning related to risk assessments;
        this.$emit('calculateWarningsForDeforestationAssessment', this.diligenceId);
      } else if (res && res.errors && res.errors.length > 0) {
        const errorMessage =
          res.errors[0].message || this.$t("unExpectedErrorMsg");
        this.$notify({
          type: "error",
          text: errorMessage,
        });
      } else {
        this.$notify({
          type: "error",
          text: this.$t('somethingWentWrong'),
        });
      }

    },

    async getRiskAssessmentFiles() {
      this.startLoading();
      try {
        const resData = await DeforestationSurveyBuilderService.getAllUploadFiles(
          parseInt(this.assessmentId),
          parseInt(this.diligenceId),
          this.selectedItem ? parseInt(this.selectedItem.id) : null
        );
        if (resData) {
          this.s3FileUploadResult = resData?.data?.getAllAssessmentFiles?.rows?.map((item) => ({
            ...item,
            expiryDate: moment(item.expiry_date).format('DD-MMM-YYYY'),
            extension: item.s3Location?.split('.').pop()
          }));
        }
      }
      catch (e) {
        console.log(e);
      }
      finally {
        this.stopLoading();
      }
    },

    async validateForm() {
      const { existing_survey } = this.assessment;

      if (existing_survey === "existing") {
        if(this.showDetail && this.s3FileUploadResult.length <=0){
            this.fileError = true;
            return false;
        }
        
        if (this.$refs.riskAssessmentFile && !this.$refs.riskAssessmentFile.validate()) {
          return false;
        }
        if (this.$refs.riskAssessmentForm && !this.$refs.riskAssessmentForm.validate()) {
          return false;
        }
        return true;
      } else if (existing_survey === "survey") {
        // manual validation using this.surveyResponses
        let areAllFormsValid = this.validateMandatoryQuestions(this.survey, this.surveyResponses)
        if(!areAllFormsValid) {
          this.$notify({
            title: 'Please fill all the mandatory fields',
            type: 'error'
          })
          return false
        }
        if (this.$refs.surveyForm && !this.$refs.surveyForm.validate()) {
          return false;
        }
        if (this.$refs.riskAssessmentForm && !this.$refs.riskAssessmentForm.validate()) {
          return false;
        }
        return true;
      }
      else if(existing_survey === "farmer") {
        if (this.$refs.surveyForm && !this.$refs.surveyForm.validate()) {
          return false;
        }
        return true;
      }
      return false;
    },
  validateMandatoryQuestions(questionArray, answerArray) {
        
        const answerMap = new Map(answerArray.map(answer => [answer.questionId, answer.response]));

        
        for (const step of questionArray) {
            for (const question of step.assessmentQuestions) {
                
                if (question.isMandatory) {
                    const response = answerMap.get(question.id);

                    
                    if (!response) {
                        
                        return false;
                    } else if (question.assessmentQuestionType === 'CHECK_BOXES' || question.assessmentQuestionType === 'RADIO_BUTTON') {
                        
                        if (!response.selectedOptions || response.selectedOptions.length === 0) {
                            return false;
                        }
                    } else if (question.assessmentQuestionType === 'TEXT_FIELD' || question.assessmentQuestionType === 'TEXT_AREA') {
                        
                        if (!response.textFieldAnswer || response.textFieldAnswer.trim() === "") {
                            return false;
                        }
                    } else if (question.assessmentQuestionType === 'TEXT_FIELD_NUMERIC') {
                        
                        if (!response.numberFieldAnswer || response.numberFieldAnswer == null) {
                            return false;
                        }
                    } else if (question.assessmentQuestionType === 'FILE_ATTACHMENT') {
                        
                        if(response?.fileAndDigitalSignatureFieldAnswer && Array.isArray(response?.fileAndDigitalSignatureFieldAnswer)) {
                          if (!response?.fileAndDigitalSignatureFieldAnswer || response?.fileAndDigitalSignatureFieldAnswer.length === 0) {
                                return false;
                          }
                        } else {
                          if (!response.files || response.files.length === 0) {
                              return false;
                          }
                        }
                    } else if (question.assessmentQuestionType === 'DIGITAL_SIGNATURE') {
                        
                        if(response?.fileAndDigitalSignatureFieldAnswer && Array.isArray(response?.fileAndDigitalSignatureFieldAnswer)) {
                          if (!response?.fileAndDigitalSignatureFieldAnswer || response?.fileAndDigitalSignatureFieldAnswer.length === 0) {
                                return false;
                          }
                        }
                        else if (!response.signature || response.signature.trim() === "") {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    },

    async scenerioPreviewBtn(isSubmit, type = 'One') {
      if (isSubmit) {
        if(type == 'One' || type == 'Two'){
            if (this.s3FileUploadResult.length === 0) {
              this.fileError = true;
              return;
            }
          this.uploadRiskAssessmentFiles();
        }
        const isValid = await this.validateForm();
        if (!isValid) {
          return;
        }
        this[`scenerio${type}Preview`] = true;
      } else {
        this[`scenerio${type}Preview`] = false;
      }
    },

    async riskAssessmentPreviewBtn() {
      const isValid = await this.validateForm();
      if (!isValid) {
        return;
      }
      if (this.assessment.existing_survey === 'survey' || this.assessment.existing_survey === 'farmer') {
        this.submitAssessment();
      }
      this.hasResponse = true;
      this.riskAssessmentPreview = true;
      this.showDetail = true;
    },

    async switchRiskAssessmentPreview() {
      this.startLoading()
      this.riskAssessmentPreview = false;
      this.hasResponse = false;
      this.stopLoading()
    },

    acerToHectare(acer) {
      if (acer) {
        return (acer * 0.404686011).toFixed(4);
      }
      return "";
    },
    async removeFarm() {
      this.startLoading();
      const params = {
        diligenceReportId: Number(this.diligenceId),
        farmId: Number(this.deleteFarmId),
      };
      await DeforestationService.removeFarmFromProductionPlaceListById(params);
      
      // Log the production place deletion
      try {
        const userId = this.$store.getters.getUser?.id;
        if (userId) {
          await ActivityLogService.logDDSProductionPlaceDeleted(
            this.diligenceId,
            userId,
            this.deleteFarmId,
            '',
            'Risk assessment deletion'
          );
        }
      } catch (logError) {
        console.error('Error logging production place deletion:', logError);
      }
      
      await this.getProductionPlaces();
      if(this.productionPlaces.length == 0) {
        this.hideSurvey = true
        this.farmDetails = false
      }
      await this.getDiligenceDetail()
      this.stopLoading();
      this.farmRemoveConfirmDialog = false
    },

    async getSupplierList() {
      this.loading = true;
      await DeforestationService.getSupplierList()
        .then((res) => {
          this.supplierList = res.data.getSupplierList;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          console.log("Error", err);
        });
    },
    getCountry() {
      this.countriesOnly = [...getCountries()];
      this.countries = [{ name: "All Countries" }, ...getCountries()];
    },
    async getProductionPlaces(opt = null) {
      this.loading = true;
      const requestParams = {
        page: this.options.page,
        limit: this.options.itemsPerPage,
        diligenceReportId: parseInt(this.diligenceId),
        farmOwner: this.suppplier ? this.suppplier : null,
        farmCountry: this.country,
        riskAssessmentStatus: this.riskAssessmentStatus,
        searchPhrase: this.search,
        removed: false,
        assessmentId: this.assessmentId
      };

      if (opt?.sortBy?.length) {
        requestParams.orderField = opt.sortBy[0];
        requestParams.order = opt.sortDesc[0] ? "DESC" : "ASC";
      }
      this.startLoading()
      await DeforestationService.getProductionPlaces(requestParams)
        .then((res) => {
          this.reloadViewAdd = this.reloadViewAdd + 1 
          this.productionPlaces = res.data.productionPlaces.rows;
          this.totalProductionPlaces = res.data.productionPlaces.totalCount;
          this.totalPages = Math.ceil(
            this.totalProductionPlaces / this.options.itemsPerPage
          );
          this.from = (this.options.page - 1) * this.options.itemsPerPage + 1;
          this.to =
            this.options.page * this.options.itemsPerPage -
            (this.options.itemsPerPage - res.data.productionPlaces.rows.length);
          this.loading = false;
          const rows = res.data.productionPlaces.rows;

          this.currentRiskAssessmentStatus = rows[0]?.assessment_production_place?.riskAssessmentStatus ?? null;
          this.stopLoading()
        })
        .catch((err) => {
          this.stopLoading()
          this.loading = false;
          console.log("Error", err);
        });
    },
    handleSearchByCountry() {
      this.options.page = 1;
      this.getProductionPlaces();
    },
    handleSearchBySupplier() {
      this.options.page = 1;
      this.getProductionPlaces();
    },
    handleSearchByStatus() {
      this.options.page = 1;
      this.getProductionPlaces();
    },
    handleSearchByPharse() { 
      this.options.page = 1;
      this.getProductionPlaces();
    },

    disregardRiskFarms() {
    this.disregardDialog = true;
    },
    async confirmDisregardRiskFarms() {
      try {
        const res = await DeforestationService.updateDisregardStatusForAssessmentProductionPlace({
          dueDiligenceReportId: Number(this.diligenceId),
          assessmentId: Number(this.assessmentId),
        });
        if (res && res.data && res.data.updateDisregardStatusForAssessmentProductionPlace.success) {
          this.$notify({
            type: "success",
            text: res.data.updateDisregardStatusForAssessmentProductionPlace.message,
          });
          this.getProductionPlaces();
        } else {
          const errorMessage = res.data?.updateDisregardStatusForAssessmentProductionPlace?.message || this.$t('somethingWentWrong');
          this.$notify({
            type: "error",
            text: errorMessage,
          });
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || this.$t('somethingWentWrong');
        this.$notify({
          type: "error",
          text: errorMessage,
        });
      } finally {
        this.stopLoading();
        this.disregardDialog = false;
      }
    },
    cancelDisregardRiskFarms() {
      this.disregardDialog = false;
    },
    removeRiskFarms() {
      this.removeRiskFarmsDialog = true;
    },
    async confirmRemoveRiskFarms() {
      this.startLoading();
      const opt = {
        diligenceReportId: Number(this.diligenceId),
        assessmentId: Number(this.assessmentId),
      };
      try {
        const res = await DeforestationService.removeUnapprovedFarmFromProductionPlaceList(opt);
        if (res && res.data && res.data.removeUnapprovedFarmFromProductionPlaceList.success) {
          this.$notify({
            type: "success",
            text: res.data.removeUnapprovedFarmFromProductionPlaceList.message,
          });
          this.getProductionPlaces();
        } else {
          const errorMessage = res.data?.removeUnapprovedFarmFromProductionPlaceList?.message || this.$t('somethingWentWrong');
          this.$notify({
            type: "error",
            text: errorMessage,
          });
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || this.$t('somethingWentWrong');
        this.$notify({
          type: "error",
          text: errorMessage,
        });
      } finally {
        this.stopLoading();
        this.removeRiskFarmsDialog = false;
      }

    },
    cancelRemoveRiskFarms() {
      this.removeRiskFarmsDialog = false;
    },
    async handleFileChange(event) {
      const file = event.target.files[0];
      if (file && file.type === "application/pdf") {
        this.uploadedFile = file;
        this.uploadedFileName = file.name;
        this.uploadFileType = file.name
          .split(".")
          .pop()
          .toUpperCase();
        await this.uploadFileForAll(file);
      } else {
        this.fileUploading = false;
        console.error("Invalid file type. Please select a PDF file.");
      }
    },

    handleNonCompliantRiskMitigation : debounce(function(){
      this.nonCompliantRiskMitigation();
    }, 3000),

    async nonCompliantRiskMitigation() {
      if (this?.$refs?.riskAssessmentForm?.validate() === false) {
        return;
      }
      this.startLoading();
      const mitigationPayload = {
        dueDiligenceReportId: this.diligenceId,
        assessmentId: this.assessmentId,
        mitigationComment: this.nonCompliantComment,
        file: this.s3LocationForNonCompliant || '',
      };
      const res = await DeforestationService.highRiskAssessmentMitigation(
        mitigationPayload
      );
      this.getProductionPlaces();
      this.stopLoading();
      if (res && res.data && res.data.highRiskAssessmentMitigation && res.data.highRiskAssessmentMitigation.success) {
        this.$notify({
          type: "success",
          text: res.data.highRiskAssessmentMitigation.message,
        });
        // to display the latest warning related to risk assessments;
        this.$emit('calculateWarningsForDeforestationAssessment', this.diligenceId);
      } else if (res && res.errors && res.errors.length > 0) {
        const errorMessage =
          res.errors[0].message || this.$t("unExpectedErrorMsg");
        this.$notify({
          type: "error",
          text: errorMessage,
        });
      } else {
        this.$notify({
          type: "error",
          text: this.$t('somethingWentWrong'),
        });
      }
    },

    async uploadFileForAll(file) {
      this.startLoading();
      this.uploadedFile = file;
      this.uploadedFileName = file.name;
      this.uploadFileType = file.name
        .split(".")
        .pop()
        .toUpperCase();
        try{
          const result = await S3UploadService.singleUpload(file, "signatures");
          this.s3LocationForNonCompliant = result.fullPath;
          this.s3keyForNonCompliant = result.key;
          await this.nonCompliantRiskMitigation(); //new api logic to be added here
        } catch(err){
            this.$notify({
            type: 'error',
            title: 'Error',
            text: 'Error generating signed URL from S3'
          });
        }
        this.stopLoading();
    },

    pageChange(t) {
      if (t) this.options.page = this.options.page + 1;
      else this.options.page = this.options.page - 1;
      this.getProductionPlaces();
    },
    async removeFile(key, id) {
      const confirmed = confirm(this.$t('dueDiligence.areYouSureYouWantToContinueThisAction'));
      if (!confirmed) return;
      try {
        if (!id) {
          this.s3FileUploadResult.splice(key, 1);
          this.scenerioOnePreview = false;
          this.scenerioTwoPreview = false;
          return;
        }
        const payload = {
          id,
          assessmentId: this.assessmentId,
          diligenceReportId: this.diligenceId,
          productionPlaceId: this.selectedItem?.id,
        }
        const res= await DeforestationSurveyBuilderService.removeAssessmentFile(payload);
        const { status, message } = res?.data?.removeAssessmentFile;
        if(status){
          this.s3FileUploadResult.splice(key, 1);
          this.scenerioOnePreview = false;
          this.scenerioTwoPreview = false;
          this.$notify({
            type: "success",
            text: message,
          })
        }
        else{
          this.$notify({
            type: "error",
            text: message,
          })
        }

      } catch (error) {
        console.error(error);
      }
      finally{
        this.stopLoading();
      }
    },

    additionalOnChange(e) {
      const files = e.target.files;
      this.uploadFiles(files);
    },
    handleDrop(event) {
      event.preventDefault();
      this.dragging = false;
      const files = event.dataTransfer.files;
      this.uploadFiles(files);
    },
    async uploadFiles(files) {
      this.startLoading();
      const validExtensions = ["pdf", "doc", "docx", "xls", "xlsx"];
      const fileArray = Array.from(files);

      // Filter out invalid files
      const validFiles = fileArray.filter((file) => {
        const extension = file.name
          .split(".")
          .pop()
          .toLowerCase();
        return validExtensions.includes(extension);
      });

      const invalidFiles = fileArray.filter((file) => {
        const extension = file.name
          .split(".")
          .pop()
          .toLowerCase();
        return !validExtensions.includes(extension);
      });

      if (invalidFiles.length > 0) {
        this.fileError = true;
      } else {
        this.fileError = false;
        this.documents = validFiles.map((x) => {
          return {
            file: x,
            extension: x.name
              .split(".")
              .pop()
              .toLowerCase(),
            name: x.name,
            comment: "",
            expiryDate: null,
            productExpirationMenu: false,
          };
        });

        const uploadResults = [];

        for (const item of this.documents) {
          try {
            const result = await S3UploadService.singleUpload(
              item.file,
              "risk-assessment-docs"
            );
            const s3Result = {
              s3Location: result.fullPath,
              s3Key: result.key,
            };

            uploadResults.push({
              ...s3Result,
              comment: item.comment,
              expiryDate: item.expiryDate,
              name: item.name,
              extension: item.extension,
            });
          } catch (error) {
            console.error("Upload failed for file:", item.file.name, error);
          }
        }


        this.s3FileUploadResult = [...this.s3FileUploadResult, ...uploadResults];
      }
      this.stopLoading();
    },

    async findQuestionForSurvey(assessmentId) {
      this.startLoading()
      try {
        const res = await DeforestationSurveyBuilderService.findQuestionForSurvey(
          parseInt(assessmentId)
        );
        if (res) {
          if (res.errors && res.errors.length > 0) {
            this.stopLoading();
            const errorMessage =
              res.errors[0].message || this.$t("unExpectedErrorMsg");
            this.$notify({
              type: "error",
              text: errorMessage,
            });
            return;
          }
          this.survey = res.data.findQuestionForSurvey.rows;
        }
      } catch (error) {
        console.error("error in risk assessment =>", error);
      }
      this.stopLoading()
    },

    async fetchAllSavedResponseForSurvey(dueDiligenceId, assessmentId, userId, farmId) {
      try {
        const res = await DeforestationSurveyBuilderService.getAllSurveyResponse(
          parseInt(dueDiligenceId),
          parseInt(assessmentId), null,
          //parseInt(userId), 
          parseInt(farmId)
        );
        if (res && res?.data?.findAllSurveyResponse) {
          this.stopLoading();
          this.riskAssessmentPreview = true;
          this.hasResponse = true;
          const {
            surveyResponses,
            signatureS3Key,
            signatureS3Location,
          } = res?.data?.findAllSurveyResponse;
          this.surveyResponses = surveyResponses ?? [];
          this.signatureDetails = {
            signatureS3Key: signatureS3Key,
            signatureS3Location: signatureS3Location,
          };

          const statusText = this.surveyResponses.length > 0 ? "View Assessment" : "Add Assessment";
          return { surveyResponses: this.surveyResponses, statusText };
        } else {
          this.riskAssessmentPreview = false;
          this.hasResponse = false;
          this.surveyResponses = [];
          return { surveyResponses: [], statusText: "Add Assessment" };
        }
      } catch (error) {
        console.error("error in risk assessment =>", error);
        return { surveyResponses: [], statusText: "Add Assessment" };
      }
    },

    handleOpenSignatureModel() {
      this.openSignatureModel = true;
    },
    handleSignature(payload) {
      this.signatureDetails = {
        signatureS3Key: payload.s3key,
        signatureS3Location: payload.attachmentLink,
      };
    },
    handleQuestionResponses(payload) {
      this.surveyResponses = this.surveyResponses.filter(s => parseInt(s.questionId) !== parseInt(payload.questionId))
      this.surveyResponses.push(payload)

    },
    async submitSurveyAssessment(dueDiligenceId, assessmentId, userId) {
      if (this.$refs.surveyForm && !this.$refs.surveyForm.validate()) return;
      this.startLoading();

      if (this.isOneForEachFarm) {
        const index = this.surveyResponseWithProductionPlaceFarmId.findIndex(
          (s) => s.farmId === parseInt(this.selected)
        );
        const productionPlaceFarmData = {
          farmId: parseInt(this.selected),
          surveyResponses: this.surveyResponses,
        };
        if (index === -1)
          this.surveyResponseWithProductionPlaceFarmId.push(
            productionPlaceFarmData
          );
        else
          this.surveyResponseWithProductionPlaceFarmId[
            index
          ] = productionPlaceFarmData;
      }

      const payload = {
        dueDiligenceId: parseInt(dueDiligenceId),
        assessmentId: parseInt(assessmentId),
        userId,
        userFarmId: this.isOneForEachFarm
          ? parseInt(this.selectedItem.farmId)
          : null,
        status: 'COMPLETED',
        signatureDetails: this.signatureDetails,
        surveyResponses: this.surveyResponses?.map((item) => {
          const { assessmentQuestionType } = item.questionDetail;
          const response = { ...item.response };

          if (assessmentQuestionType === "FILE_ATTACHMENT") {
            // remove surveyId
            const { surveyId: _surveyId, ...filteredItem } = item;
            console.log(_surveyId)
            return {
              ...filteredItem,
              response: {
                ...item.response,
                fileAndDigitalSignatureFieldAnswer: item.response.fileAndDigitalSignatureFieldAnswer.map(
                  (subItem) => ({
                    comment: subItem.comment,
                    attachmentLink: subItem?.s3Result ? subItem.s3Result.attachmentLink : subItem.attachmentLink,
                    s3key: subItem?.s3Result ? subItem.s3Result.s3key : subItem.s3key,
                  })
                ),
              },
            };
          }

          // Ensure selectedOptions format
          if (response.selectedOptions) {
            response.selectedOptions = response.selectedOptions.map(
              (option) => ({
                optionValue: option.optionValue,
                selectedOptionId: option.selectedOptionId,
              })
            );
          }
          // remove surveyId
          const { surveyId: _surveyId, ...filteredItem } = item;
          console.log(_surveyId)

          return {
            ...filteredItem,
            response,
          };
        }),
      };
      try {
        const res = await DeforestationSurveyBuilderService.saveSurveyResponse(
          payload
        );
        if (res) {
          if (this.isOneForEachFarm) {
            this.riskAssessmentStatus = "";
            this.getProductionPlaces();
            this.selectedItem = this.productionPlaces.find(item => item.id == this.selected);
            this.statusReloadKey += 1;
          }
          this.$notify({
            text: "Survey saved successfully",
            type: "success",
          });
          this.stopLoading();
          return true;
        }
      } catch (err) {
        this.$notify({
          text: err,
          type: "error",
        });
        console.log(err);
        return false;
      } finally {
        this.stopLoading();
      }
    },

    async submitAssessment() {
      return await this.submitSurveyAssessment(
        this.diligenceId,
        this.assessmentId,
        this.getCurrentUser.id
      );
    },
    handleProductionPlaceClick(productionPlaceFarmId) {
      const index = this.surveyResponseWithProductionPlaceFarmId.findIndex(
        (s) => s.farmId === parseInt(this.selectedProductionPlaceFarmId)
      );
      const productionPlaceFarmData = {
        farmId: parseInt(this.selectedProductionPlace),
        surveyResponses: this.surveyResponses,
      };
      if (index === -1)
        this.surveyResponseWithProductionPlaceFarmId.push(
          productionPlaceFarmData
        );
      else
        this.surveyResponseWithProductionPlaceFarmId[
          index
        ] = productionPlaceFarmData;

      const isExisting = this.surveyResponseWithProductionPlaceFarmId.find(
        (s) => s.farmId === parseInt(productionPlaceFarmId)
      );

      this.surveyResponses = isExisting?.surveyResponses || [];
      this.selectedProductionPlaceFarmId = parseInt(productionPlaceFarmId);
    },
  },

  mixins: [loadingMixin, getPermittedActions, DownloadMixin, DateMixin],
};
</script>

<style lang="scss" scoped>
.img-preview {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
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

// ::v-deep .green-shadow:hover {
//     background-color: $primary_color;
//     color: white;
// }

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

.dropZone {
  width: 100%;
  height: 200px;
  position: relative;
  border: 2px dashed #97a8b8;
}

.upload-document {
  width: 100%;
}

.dropZone:hover {
  border: 2px solid $primary-color;
}

.dropZone:hover .dropZone-title {
  color: $primary-color;
}

.dropZone-info {
  color: #a8a8a8;
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
  background: #5c5c5c;
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
  color: #a8a8a8;
  position: absolute;
  top: 50%;
  width: 100%;
  transform: translate(0, -50%);
  text-align: center;
  overflow: clip;
}

.blue-color {
  color: #0057bd;
}

.underline {
  text-decoration: underline;
}

.gray-color {
  color: #979797;
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
  color: #135b00;
}

//
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

.close-icon-with-background {
  background-color: #f0f0f0;
  /* Adjust the background color as needed */
  border-radius: 50%;
  /* Make the background circular */
  padding: 8px;
  /* Adjust padding for appropriate sizing */
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-pro-places {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.filter-section {
  display: flex;
  flex-wrap: wrap;
}


.pagination {
  display: flex;
  align-items: center;
  margin-top: 15px;
  margin-left: auto; 
}

.docs-box {
  display: inline-block;
}

.delete-icon:hover {
  color: #d32f2f;
}

.file-extension {
  font-weight: 500;
}

.file-name {
  font-weight: 600;
  max-width: 120px;
  word-break: break-word;
}
</style>
