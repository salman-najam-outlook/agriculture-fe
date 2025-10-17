/* eslint-disable vue/no-template-key */
<template>
  <div>
    <breadcrumb :items="breadcrumbs" />
    <v-container fluid>
      <div class="d-flex mb-8">
        <h2 class="font-weight-bold mb-6">{{ projectId ? $t('carbonCredit.register.editTitle') : $t('carbonCredit.register.title') }}</h2>
        <v-spacer></v-spacer>
        <div>
          <v-btn outlined class="mr-3" @click="$router.push({ name: 'listProjects' })"
            style="border-color: #00bd73; color: #00bd73">{{
              $t("carbonCredit.cancel") }}</v-btn>
          <v-btn color="primary" @click="submit">{{
            projectId ? $t("carbonCredit.save") : $t("carbonCredit.submit")
          }}</v-btn>
        </div>
      </div>
      <v-form ref="form">
        <v-card flat class="pa-6">
          <v-row gap="1" class="mb-6">
            <v-col cols="12" md="9">
              <label class="font-weight-light mb-1">{{
                $t("carbonCredit.register.projectTitle")
              }}</label>
              <v-text-field v-model="form.project_title" outlined dense
                :placeholder="$t('carbonCredit.register.projectTitle')" />
            </v-col>

            <v-col cols="12" md="3">
              <label class="font-weight-light mb-1">{{
                $t("carbonCredit.register.projectType")
              }}</label>
              <v-select v-model="form.project_type" :items="projectTypes" outlined dense
                :placeholder="$t('carbonCredit.select')" 
                item-text="text"
                item-value="value" />
            </v-col>

            <v-col cols="12">
              <label class="font-weight-light mb-1">{{
                $t("carbonCredit.register.description")
              }}</label>
              <v-textarea v-model="form.description" outlined dense
                :placeholder="$t('carbonCredit.descriptionPlaceholder')" rows="3" auto-grow />
            </v-col>

            <v-col cols="12">
              <label class="font-weight-light mb-1">{{
                $t("carbonCredit.register.projectAgreement")
              }}</label>
              <div class="file-upload-section mt-4">
                <v-row>
                  <v-col cols="12" sm="8">
                    <div class="upload-document">
                      <div :class="['dropZone', { 'dropZone-over': dragging }]" @dragenter="dragging = true"
                        @dragleave="dragging = false" @drop="handleDrop($event)">
                        <div class="dropZone-info d-flex justify-center align-center" @dragover.prevent @click="triggerAgreementFileInput">
                          <v-icon size="50" color="#0057BD">mdi-tray-arrow-up</v-icon>
                          <div class="dropZone-upload-limit-info">
                            <h2 class="ml-4 blue-color underline">
                              {{ $t('carbonCredit.register.selectFile') }}
                            </h2>
                            <p class="gray-color">{{ $t('carbonCredit.register.dragDropFiles') }}</p>
                          </div>
                        </div>
                        <input type="file" multiple
                          accept="application/pdf,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.csv,application/vnd.ms-excel,.xls,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain,.mp3,.wav,.aac,.ogg,.flac,.mp4,.mov,.webm,.mkv"
                          @change="onFileChange($event)"
                          ref="agreementFileInput" />
                      </div>
                    </div>
                    <template v-if="uploadedDocuments.length">
                      <div class="pdf-docs mt-10 d-flex flex-column flex-sm-row"
                        v-for="(doc, index) in uploadedDocuments" :key="`doc-${index}-${doc.name || doc.file_name || doc.id}`">
                        <div class="docs-box mr-4 mb-4 mb-sm-0">
                          <div class="docs-preview">
                            <div class="img-item">
                              <div class="pdf-box">
                                <v-icon class="delete-icon" @click="removeFile(index)">mdi-trash-can-outline</v-icon>
                                <h1 class="file-extension">
                                  {{ getFileExtension(doc) }}
                                </h1>
                              </div>
                              <span class="file-name">
                                {{ getFileName(doc) }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </v-col>
                </v-row>
              </div>
            </v-col>

            <v-col cols="12">
              <label class="font-weight-light mb-1">{{
                $t("carbonCredit.register.headerImage")
              }}</label>
              <br>
              <label class="font-weight-light mb-1">{{
                $t("carbonCredit.register.headerImageInfo")
              }}</label>
              <template>
                <v-row justify="start">
                  <v-col cols="auto" class="text-center">
                    <v-card outlined class="upload-card d-flex align-center justify-center pa-4"
                      style="position: relative;">
                      <div class="text-center">
                        <template>
                          <div class="d-flex flex-column align-center">
                            <img src="/img/camera.svg" alt="Camera Logo" />
                            <input type="file" ref="fileInput" accept="image/*" style="display: none"
                              @change="handleFileUpload" />
                            <v-btn class="mx-2 mt-2" height="44" width="auto" depressed color="primary"
                              @click="triggerFileInput">
                              {{ $t('blends.manageProducts.addImage') }}
                            </v-btn>
                          </div>
                        </template>
                      </div>
                    </v-card>

                    <div class="mt-4">
                      <template v-if="uploadedFileUrl">
                        <div style="position: relative; width: 720px; height: 170px;">
                          <img :src="uploadedFileUrl" alt="Uploaded Image"
                            style="width: 100%; height: 100%; object-fit: contain; border-radius: 8px;" />
                          <v-icon class="delete-icon" @click="deleteImage()">mdi-trash-can-outline</v-icon>
                        </div>
                      </template>
                      <template v-else>
                        <div class="d-flex flex-column align-start">
                          <label class="font-weight-light mb-1">
                            {{ $t("carbonCredit.register.headerImagePlaceholder") }}
                          </label>
                          <img src="../../../assets/img/header-image-default.png" alt="Placeholder Image"
                            style="width: 720px; height: 170px; object-fit: contain;" />
                        </div>
                      </template>
                    </div>
                  </v-col>
                </v-row>
              </template>
            </v-col>
          </v-row>

          <!-- Responsible Dimitra Office -->
          <v-expansion-panels flat class="mb-4">
            <v-expansion-panel>
              <v-expansion-panel-header class="font-weight-medium bordered-expansion">
                {{ $t("carbonCredit.register.responsibleDimitraOffice") }}
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row class="mt-4" align="center" justify="start">
                  <v-col cols="3" sm="4">
                    <v-select
                      v-model="form.dimitraOfficeId"
                      :items="dimitraOffices"
                      item-text="officeName"
                      item-value="id"
                      dense
                      outlined
                      :placeholder="$t('carbonCredit.register.makeASelection')"
                      :loading="loadingDimitraOffices"
                      :disabled="loadingDimitraOffices"
                      clearable
                    />
                  </v-col>
                  <div class="d-flex align-center mb-7 ml-2">
                    <v-btn color="primary" @click="showAddDimitraOffice = true">
                      {{ $t("carbonCredit.register.addNewDimitraOffice") }}
                    </v-btn>
                  </div>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>


          <!-- Organization Details -->
          <v-expansion-panels flat class="mb-4">
            <v-expansion-panel>
              <v-expansion-panel-header class="font-weight-medium bordered-expansion">
                {{ $t("carbonCredit.register.organizationDetails") }}
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row class="mt-4" align="center" justify="start">
                  <v-col cols="12" sm="6" md="4">
                    <label class="font-weight-medium mb-1">{{
                      $t("carbonCredit.register.selectCountry")
                    }}</label>
                    <v-select 
                      v-model="form.country" 
                      :items="countries" 
                      item-text="name" 
                      item-value="name" 
                      dense
                      outlined 
                      :placeholder="$t('carbonCredit.register.selectCountry')"
                      clearable
                      @change="onCountryChange"
                    />
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <label class="font-weight-medium mb-1">
                      {{ $t("carbonCredit.register.selectOrganization") }}
                    </label>
                    <v-menu
                      v-model="organizationMenu"
                      :close-on-content-click="false"
                      offset-y
                      >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-bind="attrs"
                          v-on="on"
                          :value="selectedOrganizationText"
                          outlined
                          dense
                          readonly
                          :loading="loadingOrganizations"
                          :disabled="loadingOrganizations"
                          :placeholder="$t('carbonCredit.register.selectOrganization')"
                        ></v-text-field>
                      </template>

                      <v-card>
                        <v-list dense class="organization-list">
                          <v-list-item>
                            <v-text-field
                              v-model="organizationSearch"
                              outlined
                              dense
                              hide-details
                              :placeholder="$t('carbonCredit.search')"
                              prepend-inner-icon="mdi-magnify"
                              :disabled="loadingOrganizations"
                            ></v-text-field>
                          </v-list-item>
                          <!-- Removed "All Organizations" option -->
                          <div v-for="org in organizations" :key="org.id">
                              <v-list-item>
                                  <v-checkbox
                                      v-model="selectedOrganizations"
                                      :label="org.name"
                                      :value="org.id"
                                      :indeterminate="isParentIndeterminate(org)"
                                      :disabled="loadingOrganizations"
                                      @change="() => toggleParentSelection(org)"
                                  ></v-checkbox>
                                  <v-spacer></v-spacer>
                                  <div
                                    v-if="org.subOrganizations && org.subOrganizations.length"
                                    class="d-flex align-center"
                                    style="cursor: pointer"
                                    :class="{ 'disabled': loadingOrganizations }"
                                    @click.stop="!loadingOrganizations && toggleExpand(org)"
                                  >
                                    <span class="text mr-2">
                                        {{ org.subOrganizations.length }} {{ $t('carbonCredit.projectInfo.subOrganizations') }}
                                    </span>
                                    <v-btn icon :disabled="loadingOrganizations">
                                        <v-icon>{{ org.expanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                                    </v-btn>
                                  </div>
                              </v-list-item>
                              <v-expand-transition>
                                  <div v-if="org.expanded">
                                      <v-list-item
                                          v-for="subOrg in org.subOrganizations"
                                          :key="subOrg.id"
                                          class="ml-8"
                                      >
                                          <v-checkbox
                                              v-model="selectedOrganizations"
                                              :label="subOrg.name"
                                              :value="subOrg.id"
                                              :disabled="loadingOrganizations"
                                          ></v-checkbox>
                                      </v-list-item>
                                  </div>
                              </v-expand-transition>
                          </div>
                          <template v-if="loadingOrganizations">
                              <v-list-item class="justify-center">
                                  <div class="d-flex align-center">
                                      <v-progress-circular indeterminate color="primary" size="20" class="mr-2"></v-progress-circular>
                                      <span class="text-caption">{{ $t('carbonCredit.register.loadingOrganizations') }}</span>
                                  </div>
                              </v-list-item>
                          </template>
                          <template v-else-if="organizations.length === 0">
                              <v-list-item class="justify-center">
                                  <span class="text-caption text-muted">{{ $t('carbonCredit.register.noOrganizationsFound') }}</span>
                              </v-list-item>
                          </template>
                        </v-list>
                      </v-card>
                    </v-menu>
                  </v-col>
                  <v-col cols="12" sm="4">
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

          <!-- Project Info -->
          <v-expansion-panels flat class="mb-4">
            <v-expansion-panel>
              <v-expansion-panel-header class="font-weight-medium bordered-expansion">
                {{ $t("carbonCredit.register.projectInfo") }}
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row class="mt-4" align="center">
                  <v-col cols="12" sm="6" md="6" lg="3">
                    <label class="font-weight-medium mb-1">{{
                      $t("carbonCredit.register.status")
                    }}</label>
                    <v-select v-model="form.status" :items="statuses" dense outlined
                      :placeholder="$t('carbonCredit.register.selectStatus')"
                      item-text="text"
                      item-value="value"></v-select>
                  </v-col>

                  <v-col cols="12" sm="6" md="6" lg="3">
                    <label class="font-weight-medium mb-1">{{
                      $t("carbonCredit.register.creditType")
                    }}</label>
                    <v-select v-model="form.creditType" :items="creditTypes" dense outlined
                      :placeholder="$t('carbonCredit.register.selectCreditType')"
                      item-text="text"
                      item-value="value"></v-select>
                  </v-col>

                  <v-col cols="12" sm="6" md="6" lg="3">
                    <label class="font-weight-medium mb-1">{{
                      $t("carbonCredit.register.creditStart")
                    }}</label>
                    <v-text-field v-model="form.creditStart" dense outlined type="date"
                      :placeholder="$t('carbonCredit.register.dateFormat')"></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="6" lg="3">
                    <label class="font-weight-medium mb-1">{{
                      $t("carbonCredit.register.creditEnd")
                    }}</label>
                    <v-text-field v-model="form.creditEnd" dense outlined type="date"
                      :placeholder="$t('carbonCredit.register.dateFormat')"></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="6" lg="3">
                    <label class="font-weight-medium mb-1">{{
                      $t("carbonCredit.register.standardMethodology")
                    }}</label>
                    <v-text-field v-model="form.standard" dense outlined :placeholder="$t('carbonCredit.register.standardPlaceholder')"></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="6" lg="3">
                    <label class="font-weight-medium mb-1">{{
                      $t("carbonCredit.register.validationDocumentation")
                    }}</label>
                    <v-file-input class="custom-file-input" v-model="form.validationDocumentation" prepend-icon=""
                      :placeholder="$t('carbonCredit.register.browse')" accept=".jpg,.png,.gif,.svg,.mp3,.wav,.aac,.ogg,.flac,.mp4,.mov,.webm,.mkv" solo
                      suffix="Supported file format JPG, PNG, GIF, SVG, Audio (MP3, WAV, AAC, OGG, FLAC), Video (MP4, MOV, WEBM, MKV)"></v-file-input>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

          <!-- Vintage -->
          <v-expansion-panels flat class="mb-4">
            <v-expansion-panel>
              <v-expansion-panel-header class="font-weight-medium bordered-expansion">
                {{ $t("carbonCredit.register.vintage") }}
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row class="mt-4" align="center">
                  <v-col cols="12" sm="6" md="6" lg="3">
                    <label class="font-weight-medium mb-1">{{ $t("carbonCredit.register.vintage") }}</label>
                    <v-select v-model="selectedVintageYears" :items="vintageYearOptions" dense outlined
                      :placeholder='$t("carbonCredit.register.selectVintage")' multiple chips :menu-props="{ maxHeight: '300px' }"
                      @change="onVintageYearsChange" />
                  </v-col>
                  <v-col cols="12" sm="6" md="6" lg="3">
                    <label class="font-weight-medium mb-1">{{ $t("carbonCredit.register.currency") }}</label>
                    <v-select v-model="form.currency" :items="currencies" dense outlined :placeholder="$t('carbonCredit.register.currencyPlaceholder')"></v-select>
                  </v-col>
                </v-row>
                <v-data-table :headers="vintageHeaders" :items="form.vintageRows" item-key="year" class="mt-6"
                  hide-default-footer>
                  <template v-slot:item.year="{ item }">
                    <v-text-field v-model="item.year" type="number" dense outlined hide-details disabled></v-text-field>
                  </template>
                  <template v-slot:item.credits="{ item }">
                    <v-text-field v-model="item.credits" type="number" dense outlined hide-details></v-text-field>
                  </template>
                  <template v-slot:item.price="{ item }">
                    <v-text-field v-model="item.price" type="number" dense outlined hide-details>
                      <template v-slot:append>
                        <span style="margin-left: 4px; margin-top: 2px; font-size: 15px; ">tCO2e</span>
                      </template>
                    </v-text-field>
                  </template>
                  <template v-slot:item.actions="{ item }">
                    <v-btn text color="error" @click="removeVintageYear(item.year)">{{ $t('carbonCredit.remove') }}</v-btn>
                  </template>
                </v-data-table>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

          <!-- Attachment -->
          <v-expansion-panels flat class="mb-4">
            <v-expansion-panel>
              <v-expansion-panel-header class="font-weight-medium bordered-expansion">
                {{ $t("carbonCredit.register.attachmentTitle") }}
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <p class="my-4">
                  {{ $t("carbonCredit.register.attachmentInfo") }}
                </p>

                <!-- File input for new uploads -->
                <v-row class="mb-4">
                  <v-col cols="6">
                    <label class="font-weight-medium mb-1">{{
                      $t("carbonCredit.register.documentation")
                    }}</label>
                    <v-file-input class="custom-file-input" v-model="form.attachmentFile" prepend-icon=""
                      :placeholder="$t('carbonCredit.register.browse')" accept=".jpg,.png,.gif,.mp3,.wav,.aac,.ogg,.flac,.mp4,.mov,.webm,.mkv,.kml,.shp,.pdf,.doc,.docx,.xls,.xlsx,.txt" solo
                      suffix="Supported file format JPG, PNG, GIF, Audio (MP3, WAV, AAC, OGG, FLAC), Video (MP4, MOV, WEBM, MKV), KML, SHP, PDF, DOC, XLS, etc."
                      multiple
                    ></v-file-input>
                  </v-col>
                </v-row>

                <!-- Display existing attachments -->
                <v-row dense class="mt-4">
                  <v-col v-for="file in form.attachmentFile" :key="file.id || file.name" cols="auto" class="mr-4 mb-4">
                    <div class="attachment-thumbnail" @click="openMediaModal(file)" style="
                        cursor: pointer;
                        width: 138px;
                        height: 104px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 6px;
                        border: 1px solid #ddd;
                        overflow: hidden;
                        position: relative;
                      ">
                      <img v-if="(file.file_type && file.file_type.startsWith('image')) || (file.type && file.type.startsWith('image'))"
                        :src="file.s3_url || getLocalFileUrl(file)" alt="Preview" style="width: 100%; height: 100%; object-fit: cover" />
                      <template v-else-if="file.type && file.type.startsWith('video')">
                        <video
                          :src="getLocalFileUrl(file)"
                          style="width: 100%; height: 100%; object-fit: cover; background: #000;"
                          muted playsinline preload="metadata"
                        ></video>
                        <v-icon
                          class="play-overlay"
                          style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); font-size: 36px; color: white; text-shadow: 0 0 8px #000; pointer-events: none;"
                          large
                        >mdi-play-circle</v-icon>
                      </template>
                      <v-icon v-else-if="(file.file_type && file.file_type.startsWith('video'))" style="font-size: 40px">mdi-play-circle</v-icon>
                      <div v-else-if="(file.file_type && file.file_type.startsWith('audio')) || (file.type && file.type.startsWith('audio'))" class="audio-thumbnail">
                        <div class="audio-waveform">
                          <div class="waveform-bars">
                            <div v-for="i in 20" :key="i" class="waveform-bar" :style="{ height: getRandomHeight() + '%' }"></div>
                          </div>
                        </div>
                        <div class="audio-info">
                          <v-icon class="audio-icon">mdi-microphone</v-icon>
                          <span class="audio-duration">{{ getAudioDuration(file) }}</span>
                        </div>
                      </div>
                      <span v-else class="text-caption text-truncate" style="padding: 4px">{{ file.file_name || file.name }}</span>
                    </div>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

          <!-- SDGS -->
          <v-expansion-panels flat class="mb-4">
            <v-expansion-panel>
              <v-expansion-panel-header class="font-weight-medium bordered-expansion">
                {{ $t("carbonCredit.register.sdgsTitle") }}
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <p class="my-4">
                  {{ $t("carbonCredit.register.sdgsInfo") }}
                </p>
                <v-row>
                  <v-col v-for="sdg in sdgs" :key="sdg.id" cols="12" md="6" lg="4" class="d-flex align-start mb-4">
                    <v-checkbox v-model="selectedSdgs" :value="sdg.id" class="mt-1 mr-3" hide-details />
                    <div class="d-flex flex-column">
                      <div class="d-flex align-center">
                        <img :src="sdg.icon" alt="sdg icon" height="40" width="40" class="mr-3"
                          style="border-radius: 4px" />
                        <span class="text-body-1">{{ sdg.title }}</span>
                      </div>
                      <v-expand-transition>
                        <div v-if="selectedSdgs.includes(sdg.id)" class="mt-2 ml-10">
                          <v-textarea :value="sdg.description" dense outlined auto-grow hide-details></v-textarea>
                        </div>
                      </v-expand-transition>
                    </div>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

          <!-- Data Collection Cycle -->
          <v-expansion-panels flat class="mb-4">
            <v-expansion-panel>
              <v-expansion-panel-header class="font-weight-medium bordered-expansion">
                {{ $t("carbonCredit.register.dataCollectionTitle") }}
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <p class="my-4">
                  {{ $t("carbonCredit.register.dataCollectionInfo") }}
                </p>



                <v-data-table :headers="dataCycleHeaders" :items="dataCollectionModules" item-key="name"
                  class="elevation-1 data-collection-table" hide-default-footer>
                  <!-- Module Name with Checkbox -->
                  <template v-slot:item.name="{ item }">
                    <div class="d-flex align-center">
                      <v-checkbox v-model="item.enabled" class="mr-2" :input-value="item.enabled" @change="onModuleToggle(item)" />
                      <v-text-field 
                        :value="item.name" 
                        dense 
                        outlined 
                        disabled 
                        hide-details
                        class="module-name-field"
                        style="width: 120px"
                      ></v-text-field>
                    </div>
                  </template>

                  <!-- Mandatory Checkbox -->
                  <template v-slot:item.mandatory="{ item }">
                    <div class="d-flex align-center justify-center">
                      <v-checkbox v-model="item.mandatory" :disabled="!item.enabled" />
                    </div>
                  </template>

                  <!-- Frequency input + unit select -->
                  <template v-slot:item.recurring="{ item }">
                    <div class="d-flex align-center">
                      <v-row dense class="ma-0 pa-0" align="center" style="gap: 12px">
                        <v-text-field v-model="item.frequency" type="number" dense outlined hide-details
                          style="width: 60px" :disabled="!item.enabled"></v-text-field>
                        <v-select v-model="item.unit" :items="['Month(s)', 'Year(s)']" dense outlined hide-details
                          style="width: 100px" :disabled="!item.enabled"></v-select>
                      </v-row>
                    </div>
                  </template>

                  <!-- Score (editable) -->
                  <template v-slot:item.score="{ item }">
                    <div class="d-flex align-center">
                      <v-text-field 
                        v-model="item.score" 
                        type="number" 
                        dense 
                        outlined 
                        hide-details
                        :error-messages="getScoreError(item)"
                        :disabled="!item.enabled" 
                        placeholder="0"
                        min="0"
                        style="width: 80px; height: 40px;"
                        @input="validateScore(item)"
                        @blur="validateScore(item)"
                      ></v-text-field>
                    </div>
                  </template>

                  <!-- Approval (editable) -->
                  <template v-slot:item.approval="{ item }">
                    <div class="d-flex align-center">
                      <v-text-field 
                        v-model="item.approval" 
                        type="number" 
                        dense 
                        outlined 
                        hide-details
                        :error-messages="getApprovalError(item)"
                        :disabled="!item.enabled" 
                        placeholder="0" 
                        min="0" 
                        max="100"
                        style="width: 80px; height: 40px;"
                        @input="validateApproval(item)"
                        @blur="validateApproval(item)"
                      ></v-text-field>
                    </div>
                  </template>
                </v-data-table>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

          <!-- Footer -->
          <div class="d-flex justify-end mt-6">
            <v-btn outlined class="mr-3" @click="$router.go(-1)">{{
              $t("carbonCredit.cancel")
            }}</v-btn>
            <v-btn color="primary" @click="submit">{{
              projectId ? $t("carbonCredit.save") : $t("carbonCredit.submit")
            }}</v-btn>
          </div>
        </v-card>
      </v-form>
    </v-container>

    <MultimediaModal :show.sync="showMultimediaModal" :file="selectedMedia" :allFiles="form.attachmentFile"
      @close="showMultimediaModal = false" @update:media="selectedMedia = $event" />

    <AddDimitraOffice
      v-if="showAddDimitraOffice"
      :dialogI="showAddDimitraOffice"
      :organization-id="organizationId"
      @closeModal="showAddDimitraOffice = false"
      @officeCreated="onOfficeCreated"
    />
  </div>
</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin";
import CarbonCreditService from "../../../_services/CarbonCreditService";
import MultimediaModal from "./components/MultimediaModal.vue";
import { getCountries } from "country-state-picker";

import AddDimitraOffice from './components/AddDimitraOffice.vue';
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
  mixins: [loadingMixin],
  components: {
    MultimediaModal,
    AddDimitraOffice
  },
  data() {
    return {
      projectId: null,
      breadcrumbs: [
        { text: "Dashboard", disabled: false, href: "/dashboard", },
        { text: "Carbon Credit", disabled: false, href: "/carbon-credit/projects", },
        { text: "Projects", disabled: false, href: "/carbon-credit/projects", },
        { text: this.projectId ? this.$t('carbonCredit.editProject') : this.$t('carbonCredit.registerProject'), disabled: true, exact: true },
      ],
      form: {
        project_title: "",
        project_type: "",
        description: "",
        country: "",
        organization: "",
        status: "",
        creditType: "",
        creditStart: "",
        creditEnd: "",
        standard: "",
        validationDocumentation: null,
        agreement: "",
        currency: "USD",
        vintageRows: [],
        attachmentFile: [],
        dimitraOfficeId: null
      },
      uploadedDocuments: [],
      uploadedFileUrl: null,
      isUploading: false,
      dragging: false,
      vintages: [],
      currencies: ["USD", "EUR", "AUD"],
      dataCollectionModules: [],
      sdgs: [],
      selectedSdgs: [],
      countries: getCountries(),
      statuses: [
        { text: this.$t('carbonCredit.planned'), value: "planned" },
        { text: this.$t('carbonCredit.operational'), value: "operational" },
        { text: this.$t('carbonCredit.deactivated'), value: "deactivate" }
      ],
      projectTypes: [
        { text: this.$t('carbonCredit.agroforestry'), value: "agroforestry" },
        { text: this.$t('carbonCredit.regenerative_agriculture'), value: "regenerative_agriculture" },
        { text: this.$t('carbonCredit.forestry'), value: "forestry" }
      ],
      creditTypes: [
        { text: this.$t('carbonCredit.register.removal'), value: "removal" },
        { text: this.$t('carbonCredit.register.avoided'), value: "avoided" }
      ],


      showMultimediaModal: false,
      selectedMedia: null,
      showAddDimitraOffice: false,
      selectedVintageYears: [],
      selectedOrganizations: [],
      organizationSearchText: '',
      organizationMenu: false,
      updatingSelection: false,
      searchTimeout: null,

    };
  },
  computed: {
    ...mapState('organization', {
        vuexOrganizations: state => state.organizations,
        vuexOrganizationSearch: state => state.organizationSearch,
    }),
    ...mapGetters('organization', [
        'organizations',
        'loadingOrganizations',
    ]),
    ...mapGetters('dimitraOffice', [
        'dimitraOffices',
        'loadingDimitraOffices'
    ]),
    vintageYearOptions() {
      const currentYear = new Date().getFullYear();
      return Array.from({ length: 10 }, (_, i) => (currentYear - i - 1).toString());
    },
   
    vintageHeaders() {
      return [
        { text: this.$t('carbonCredit.register.vintageYear'), value: "year" },
        { text: this.$t('carbonCredit.register.estimatedCredit'), value: "credits" },
        { text: this.$t('carbonCredit.register.pricePerCredit'), value: "price" },
        { text: "", value: "actions", sortable: false },
      ];
    },
    dataCycleHeaders() {
      return [
        { text: this.$t('carbonCredit.register.moduleName'), value: "name", width: "200px" },
        { text: this.$t('carbonCredit.register.mandatory'), value: "mandatory", width: "100px", align: "center" },
        { text: this.$t('carbonCredit.register.futureData'), value: "recurring", width: "250px" },
        { text: this.$t('carbonCredit.register.score'), value: "score", width: "100px", align: "center" },
        { text: this.$t('carbonCredit.register.approval'), value: "approval", width: "120px", align: "center" },
      ];
    },
    organizationId() {
      return this.$store.getters.getUser?.user_organization?.id;
    },
    organizationSearch: {
        get() {
            return this.organizationSearchText;
        },
        set(value) {
            this.organizationSearchText = value;
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                this.setSearch(value);
            }, 500);
        }
    },
    selectedOrganizationText() {
      if (this.selectedOrganizations.length === 0) return '';
      return `${this.selectedOrganizations.length} organizations selected`;
    },
    // Removed totalOrganizations since "All Organizations" option was removed

    // Removed allOrganizationsSelected since "All Organizations" option was removed
  },
  async mounted() {
    this.projectId = this.$route.params.id || null;

    if (this.projectId) {
      try {
        this.startLoading();
        const res = await CarbonCreditService.getCarbonCreditProjectById(
          this.projectId
        );
        if (res.success && res.data) {
          const d = res.data;
          this.form.project_title = d.project_title;
          this.form.project_type = d.project_type;
          this.form.description = d.description;
          this.form.status = d.status;
          this.form.creditType = d.credit_type;
          this.form.creditStart = d.credit_start_date?.split("T")[0];
          this.form.creditEnd = d.credit_end_date?.split("T")[0];
          this.form.country = d.country;
          this.form.standard = d.standard_methodology;
          // Handle validation documentation
          if (d.validation_documentation) {
            if (Array.isArray(d.validation_documentation) && d.validation_documentation.length > 0) {
              // Convert the first file object to a File-like object for v-file-input
              const firstFile = d.validation_documentation[0];
              this.form.validationDocumentation = {
                name: firstFile.file_name,
                type: firstFile.file_type || 'application/octet-stream',
                size: firstFile.file_size || 0,
                lastModified: new Date().getTime(),
                s3_url: firstFile.s3_url,
                id: firstFile.id
              };
            } else if (typeof d.validation_documentation === 'string') {
              // Convert string URL to File-like object
              const fileName = d.validation_documentation.split('/').pop();
              const fileType = fileName.split('.').pop();
              this.form.validationDocumentation = {
                name: fileName,
                type: fileType ? `application/${fileType}` : 'application/octet-stream',
                size: 0,
                lastModified: new Date().getTime(),
                s3_url: d.validation_documentation
              };
            } else {
              this.form.validationDocumentation = d.validation_documentation;
            }
          } else {
            this.form.validationDocumentation = null;
          }
          this.form.agreement = d.agreement;
          this.form.currency = d.vintage_currency;
          // Populate uploadedDocuments for existing agreement files
          if (d.agreement) {
            if (Array.isArray(d.agreement)) {
              this.uploadedDocuments = d.agreement;
            } else if (typeof d.agreement === 'string') {
              // If it's a string URL, create a file object for display
              this.uploadedDocuments = [{
                file_name: d.agreement.split('/').pop(),
                s3_url: d.agreement,
                file_type: d.agreement.split('.').pop(),
                name: d.agreement.split('/').pop() // Add name property for compatibility
              }];
            } else {
              // If it's a single object, wrap it in an array
              this.uploadedDocuments = [d.agreement];
            }
          } else {
            this.uploadedDocuments = [];
          }
          this.form.dimitraOfficeId = d.dimitra_office_id;
          this.uploadedFileUrl = d.header_image || null;

          this.form.vintageRows =
            d.vintages?.map((v) => ({
              year: v.vintage_year,
              credits: v.number_of_credits_estimated,
              price: v.price_per_credit,
            })) || [];

          // Populate selectedVintageYears from existing vintage rows
          if (this.form.vintageRows.length > 0) {
            this.selectedVintageYears = this.form.vintageRows.map(row => row.year.toString());
          }

          this.form.attachmentFile = d.attachments || [];

          this.selectedSdgs = d.sdgs?.map((s) => s.id) || [];

          // Initialize with predefined modules
          const predefinedModules = [
            { name: 'Sowing', enabled: false, mandatory: false, frequency: 1, unit: 'Year(s)', score: '', approval: '' },
            { name: 'Seeding', enabled: false, mandatory: false, frequency: 1, unit: 'Year(s)', score: '', approval: '' },
            { name: 'Fertilizers', enabled: false, mandatory: false, frequency: 1, unit: 'Month(s)', score: '', approval: '' },
            { name: 'Harvesting', enabled: false, mandatory: false, frequency: 1, unit: 'Year(s)', score: '', approval: '' },
            { name: 'Equipment', enabled: false, mandatory: false, frequency: 1, unit: 'Month(s)', score: '', approval: '' },
          ];

          // Merge with backend data
          if (d.modules && Array.isArray(d.modules)) {
            d.modules.forEach(backendModule => {
              const moduleName = backendModule.module_name.charAt(0).toUpperCase() + backendModule.module_name.slice(1);
              const existingModule = predefinedModules.find(m => m.name.toLowerCase() === moduleName.toLowerCase());
              
              if (existingModule) {
                existingModule.enabled = true;
                existingModule.mandatory = backendModule.mandatory ?? false;
                existingModule.frequency = backendModule.recurring_time || 1;
                existingModule.unit = backendModule.recurring_period === "M" ? "Month(s)" : "Year(s)";
                existingModule.score = backendModule.score?.toString() || '';
                existingModule.approval = backendModule.approval?.toString() || '';
              }
            });
          }

          this.dataCollectionModules = predefinedModules;

          this.selectedOrganizations = d.organizations?.map((o) => o.id) || [];
        }
      } catch (err) {
        console.error("Failed to load project:", err);
      } finally {
        this.stopLoading();
      }
    } else {
      // Initialize data collection modules with default values
      this.dataCollectionModules = [
        { name: 'Sowing', enabled: false, mandatory: false, frequency: 1, unit: 'Year(s)', score: '', approval: '' },
        { name: 'Seeding', enabled: false, mandatory: false, frequency: 1, unit: 'Year(s)', score: '', approval: '' },
        { name: 'Fertilizers', enabled: false, mandatory: false, frequency: 1, unit: 'Month(s)', score: '', approval: '' },
        { name: 'Harvesting', enabled: false, mandatory: false, frequency: 1, unit: 'Year(s)', score: '', approval: '' },
        { name: 'Equipment', enabled: false, mandatory: false, frequency: 1, unit: 'Month(s)', score: '', approval: '' },
      ];
    }

    try {
      const sdgsRes = await CarbonCreditService.getAllSDGS();
      if (sdgsRes.success) {
        this.sdgs = sdgsRes.data;
      }
    } catch (err) {
      console.error("Failed to fetch SDGs", err);
    }

    if (this.organizationId) {
      this.fetchDimitraOffices(this.organizationId);
    }
    this.fetchOrganizations();
  },
  methods: {
    ...mapActions('organization', [
        'fetchOrganizations',
        'setSearch',
        'setCountry',
        'toggleOrgExpanded'
    ]),
    ...mapActions('dimitraOffice', [
        'fetchDimitraOffices',
    ]),
    handleDrop(event) {
      event.preventDefault();
      event.stopPropagation();
      const files = event.dataTransfer.files;
      this.addFiles(files);
      this.dragging = false;
    },
    onFileChange(event) {
      const files = event.target.files;
      if (files && files.length > 0) {
        this.addFiles(files);
        // Reset the input to allow selecting the same file again
        event.target.value = '';
      }
    },
    addFiles(files) {
      if (!files || files.length === 0) return;
      
      for (let file of files) {
        // Check if file is valid
        if (file && file.name) {
          this.uploadedDocuments.push(file);
        }
      }
      
      // Force Vue to re-render the component
      this.$forceUpdate();
    },
    getFileExtension(file) {
      const fileName = file.name || file.file_name;
      return fileName.split(".").pop().toUpperCase();
    },
    getFileName(file) {
      return file.name || file.file_name;
    },
    triggerAgreementFileInput() {
      this.$refs.agreementFileInput.click();
    },
    removeFile(index) {
      this.uploadedDocuments.splice(index, 1);
    },

    addVintageRow() {
      this.form.vintageRows.push({ year: "", credits: "", price: "" });
    },
    removeVintageYear(year) {
      this.selectedVintageYears = this.selectedVintageYears.filter((y) => y !== year);
      this.form.vintageRows = this.form.vintageRows.filter((row) => row.year !== year);
    },
    async submit() {
      try {
        // Check for negative price_per_credit
        const negativePrice = this.form.vintageRows.some(row => Number(row.price) < 0);
        if (negativePrice) {
          this.$notify({
            title: this.$t('carbonCredit.error'),
            text: this.$t('carbonCredit.register.pricePerCredit') + ' ' + this.$t('carbonCredit.register.errorNegative'),
            type: 'error'
          });
          return;
        }
        // Check for required fields
        const requiredFields = [
          { key: 'project_title', label: this.$t('carbonCredit.register.projectTitle') },
          { key: 'project_type', label: this.$t('carbonCredit.register.projectType') },
          { key: 'status', label: this.$t('carbonCredit.register.status') },
          { key: 'creditType', label: this.$t('carbonCredit.register.creditType') },
          { key: 'country', label: this.$t('carbonCredit.register.selectCountry') },
          { key: 'currency', label: this.$t('carbonCredit.register.currency') },
          { key: 'creditStart', label: this.$t('carbonCredit.register.creditStart') },
          { key: 'creditEnd', label: this.$t('carbonCredit.register.creditEnd') },
        ];
        for (const field of requiredFields) {
          if (!this.form[field.key] || this.form[field.key].toString().trim() === '') {
            this.$notify({
              title: this.$t('carbonCredit.error'),
              text: this.$t('carbonCredit.register.errorRequiredField', { field: field.label }),
              type: 'error'
            });
            return;
          }
        }
        // Require at least one organization selected
        if (!this.selectedOrganizations || !this.selectedOrganizations.length) {
          this.$notify({
            title: this.$t('carbonCredit.error'),
            text: this.$t('carbonCredit.register.errorOrganizationRequired'),
            type: 'error'
          });
          return;
        }
        // At least one vintage row and all fields in each row must be filled
        if (!this.form.vintageRows.length) {
          this.$notify({
            title: this.$t('carbonCredit.error'),
            text: this.$t('carbonCredit.register.errorVintageRequired'),
            type: 'error'
          });
          return;
        }
        for (const row of this.form.vintageRows) {
          if (!row.year || !row.credits || row.price === '' || row.price === null || row.price === undefined) {
            this.$notify({
              title: this.$t('carbonCredit.error'),
              text: this.$t('carbonCredit.register.errorVintageFieldsRequired'),
              type: 'error'
            });
            return;
          }
        }
        
        // Validate enabled modules
        const enabledModules = this.dataCollectionModules.filter(m => m.enabled);
        for (const module of enabledModules) {
          if (!this.validateScore(module)) {
            this.$notify({
              title: this.$t('carbonCredit.error'),
              text: this.$t('carbonCredit.register.scoreValidationError', { module: module.name }),
              type: 'error'
            });
            return;
          }
          
          if (!this.validateApproval(module)) {
            this.$notify({
              title: this.$t('carbonCredit.error'),
              text: this.$t('carbonCredit.register.approvalValidationError', { module: module.name }),
              type: 'error'
            });
            return;
          }
        }
        
        this.startLoading();
        const formData = new FormData();
        formData.append('project_title', this.form.project_title);
        formData.append('project_type', this.form.project_type);
        formData.append('description', this.form.description);
        formData.append('country', this.form.country);
        formData.append('credit_type', this.form.creditType);
        formData.append('status', this.form.status);
        formData.append('standard_methodology', this.form.standard);
        formData.append('credit_start_date', this.form.creditStart);
        formData.append('credit_end_date', this.form.creditEnd);
        formData.append('vintage_currency', this.form.currency);
        // Responsible Dimitra Office (always set if present)
        if (this.form.dimitraOfficeId !== null && this.form.dimitraOfficeId !== undefined && this.form.dimitraOfficeId !== "") {
          formData.append('dimitra_office_id', this.form.dimitraOfficeId);
        }
        // Vintages
        formData.append('vintages', JSON.stringify(
          this.form.vintageRows.map(row => ({
            vintage_year: parseInt(row.year),
            number_of_credits_estimated: parseInt(row.credits),
            price_per_credit: parseFloat(row.price)
          }))
        ));
        // SDGs
        formData.append('sdgs', JSON.stringify(this.selectedSdgs));
        // Organizations
        formData.append('organizations', JSON.stringify(this.selectedOrganizations));
        // Modules
        formData.append('modules', JSON.stringify(
          this.dataCollectionModules
            .filter(m => m.enabled)
            .map(m => ({
              module_name: m.name.toLowerCase(),
              recurring_time: parseInt(m.frequency) || 1,
              recurring_period: m.unit.startsWith('Month') ? 'M' : 'Y',
              score: parseInt(m.score) || 0,
              approval: parseInt(m.approval) || 0,
              mandatory: m.mandatory || false
            }))
        ));
        // Agreement files (uploaded documents)
        if (this.uploadedDocuments.length > 0) {
          this.uploadedDocuments.forEach((file) => {
            if (file instanceof File) {
              // New file upload
              formData.append('agreement', file);
            } else if (file.s3_url) {
              // Existing file from backend - send the file info
              formData.append('existing_agreement', JSON.stringify(file));
            }
          });
        }
        // Validation documentation file
        if (this.form.validationDocumentation) {
          if (this.form.validationDocumentation instanceof File) {
            // New file upload
            formData.append('validation_documentation', this.form.validationDocumentation);
          } else if (this.form.validationDocumentation.s3_url) {
            // Existing file from backend - send the file info
            formData.append('existing_validation_documentation', JSON.stringify(this.form.validationDocumentation));
          }
        }
        // Header image - send as file upload
        if (this.uploadedFileUrl) {
          formData.append('header_image', this.uploadedFileUrl);
        }
        // Attachments (handle both new and existing)
        if (this.form.attachmentFile && this.form.attachmentFile.length) {
          this.form.attachmentFile.forEach(file => {
            if (file instanceof File) {
              formData.append('attachments', file);
            }
            // Existing attachments are not re-uploaded, but should not be removed unless user marks for removal
          });
        }
        // If updating, add attachments_removed if tracked (implement attachmentsRemoved in data if needed)
        if (this.projectId && this.attachmentsRemoved && this.attachmentsRemoved.length) {
          formData.append('attachments_removed', JSON.stringify(this.attachmentsRemoved));
        }
        // API call
        let response;
        if (this.projectId) {
          response = await CarbonCreditService.updateCarbonCreditProject(this.projectId, formData);
        } else {
          response = await CarbonCreditService.registerCarbonCreditProject(formData);
        }
        if (response.success) {
          this.$notify({
            title: this.$t('carbonCredit.success'),
            text: this.projectId ? this.$t('carbonCredit.projectUpdatedSuccessfully') : this.$t('carbonCredit.projectRegisteredSuccessfully'),
            type: 'success'
          });
          this.$router.push({ name: 'listProjects' });
        } else {
          throw new Error(response.message || this.$t('carbonCredit.register.saveError'));
        }
      } catch (err) {
        this.$notify({
          title: this.$t('carbonCredit.error'),
          text: err.message || this.$t('carbonCredit.register.saveError'),
          type: 'error'
        });
      } finally {
        this.stopLoading();
      }
    },
    openMediaModal(file) {
      this.selectedMedia = file;
      this.showMultimediaModal = true;
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    async handleFileUpload(event) {
      const file = event.target.files[0];
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      try {
        if (file) {
          if (!allowedTypes.includes(file.type)) {
            this.$notify({
              title: this.$t("carbonCredit.register.fileUploadFailed"),
              text: this.$t("carbonCredit.register.unsupportedFileFormat"),
              type: "error",
            });
            return;
          }
          this.uploadedFileUrl = file;
        }
      } catch (err) {
        this.$notify({
          title: this.$t("carbonCredit.register.fileUploadFailed"),
          text: this.$t("carbonCredit.register.errorUploadingFile"),
          type: "error",
        });
      }
    },

    deleteImage() {
      this.uploadedFileUrl = null;
    },
    handleNewDimitraOffice() {
      this.showAddDimitraOffice = true;
    },
    onVintageYearsChange(newYears) {
      // Create a map of existing vintage data to preserve it
      const existingVintageData = {};
      this.form.vintageRows.forEach(row => {
        existingVintageData[row.year] = {
          credits: row.credits,
          price: row.price
        };
      });

      // Clear and rebuild vintage rows
      this.form.vintageRows = [];
      
      // Add years with preserved data
      newYears.forEach((year) => {
        const existingData = existingVintageData[year] || { credits: '', price: '' };
        this.form.vintageRows.push({ 
          year, 
          credits: existingData.credits, 
          price: existingData.price 
        });
      });
    },
    onModuleToggle(item) {
      if (!item.enabled) {
        item.mandatory = false;
        item.frequency = 1;
        item.unit = "Year(s)";
        item.score = '';
        item.approval = '';
        // Clear validation errors
        if (item.scoreError) delete item.scoreError;
        if (item.approvalError) delete item.approvalError;
      }
    },
    onOfficeCreated() {
      // Fetch the updated list of offices so the dropdown is refreshed
      if (this.organizationId) {
        this.fetchDimitraOffices(this.organizationId);
      }
      this.showAddDimitraOffice = false;
    },
    onCountryChange(country) {
      // Clear selected organizations when country changes
      this.selectedOrganizations = [];
      this.setCountry(country || '');
    },
    toggleExpand(org) {
        this.toggleOrgExpanded(org);
    },
    // Removed toggleSelectAllOrganizations since "All Organizations" option was removed
    toggleParentSelection(org) {
      this.updatingSelection = true;
      const subOrgIds = (org.subOrganizations || []).map(s => s.id);
      const parentId = org.id;
      
      setTimeout(() => {
        const isParentNowSelected = this.selectedOrganizations.includes(parentId);
        
        if (isParentNowSelected) {
          subOrgIds.forEach(id => {
            if (!this.selectedOrganizations.includes(id)) {
              this.selectedOrganizations.push(id);
            }
          });
        } else {
          this.selectedOrganizations = this.selectedOrganizations.filter(
            id => !subOrgIds.includes(id)
          );
        }
        this.$nextTick(() => {
          this.updatingSelection = false;
        });
      }, 0);
    },
    isParentIndeterminate(org) {
      const subOrgIds = (org.subOrganizations || []).map(s => s.id);
      if (subOrgIds.length === 0) return false;

      const selectedSubCount = subOrgIds.filter(id => this.selectedOrganizations.includes(id)).length;
      
      return selectedSubCount > 0 && selectedSubCount < subOrgIds.length;
    },
    getLocalFileUrl(file) {
      if (file instanceof File) {
        if (!file._localUrl) {
          file._localUrl = URL.createObjectURL(file);
        }
        return file._localUrl;
      }
      return null;
    },
    validateScore(item) {
      const score = parseFloat(item.score);
      
      // Clear previous validation state
      if (item.scoreError) {
        delete item.scoreError;
      }
      
      // Check if value is empty (allow empty for optional fields)
      if (item.score === '' || item.score === null || item.score === undefined) {
        return true;
      }
      
      // Check if it's a valid number
      if (isNaN(score)) {
        item.scoreError = this.$t('carbonCredit.register.scoreError.invalid');
        return false;
      }
      
      // Check range (0 and above)
      if (score < 0) {
        item.scoreError = this.$t('carbonCredit.register.scoreError.range');
        return false;
      }
      
      // Check if it's a whole number
      if (!Number.isInteger(score)) {
        item.scoreError = this.$t('carbonCredit.register.scoreError.wholeNumber');
        return false;
      }
      
      return true;
    },
    validateApproval(item) {
      const approval = parseFloat(item.approval);
      
      // Clear previous validation state
      if (item.approvalError) {
        delete item.approvalError;
      }
      
      // Check if value is empty (allow empty for optional fields)
      if (item.approval === '' || item.approval === null || item.approval === undefined) {
        return true;
      }
      
      // Check if it's a valid number
      if (isNaN(approval)) {
        item.approvalError = this.$t('carbonCredit.register.approvalError.invalid');
        return false;
      }
      
      // Check range (0-100)
      if (approval < 0 || approval > 100) {
        item.approvalError = this.$t('carbonCredit.register.approvalError.range');
        return false;
      }
      
      // Check if it's a whole number
      if (!Number.isInteger(approval)) {
        item.approvalError = this.$t('carbonCredit.register.approvalError.wholeNumber');
        return false;
      }
      
      return true;
    },
    getScoreError(item) {
      return item.scoreError || '';
    },
    getApprovalError(item) {
      return item.approvalError || '';
    },
    getRandomHeight() {
      return Math.floor(Math.random() * 60) + 20; // Random height between 20% and 80%
    },
    getAudioDuration(file) {
      // Return cached duration if available
      if (file._audioDuration) {
        return file._audioDuration;
      }
      
      // For new files, extract duration
      if (file instanceof File && file.type.startsWith('audio')) {
        const audio = new Audio();
        audio.src = URL.createObjectURL(file);
        
        audio.addEventListener('loadedmetadata', () => {
          const duration = audio.duration;
          const minutes = Math.floor(duration / 60);
          const seconds = Math.floor(duration % 60);
          file._audioDuration = `${minutes}.${seconds.toString().padStart(2, '0')}`;
          this.$forceUpdate(); // Force re-render to show the duration
        });
        
        // Return placeholder while loading
        return '0.00';
      }
      
      // For existing files from backend, try to extract from metadata
      if (file.duration) {
        const minutes = Math.floor(file.duration / 60);
        const seconds = Math.floor(file.duration % 60);
        return `${minutes}.${seconds.toString().padStart(2, '0')}`;
      }
      
      // Fallback for files without duration info
      return '0.00';
    },

  },
  watch: {
    selectedOrganizations(newVal) {
      if (this.updatingSelection) return;
      this.updatingSelection = true;
      
      this.$nextTick(() => {
        this.vuexOrganizations.forEach(org => {
          const subOrgIds = (org.subOrganizations || []).map(s => s.id);
          if (subOrgIds.length === 0) return;

          const selectedSubCount = subOrgIds.filter(id => newVal.includes(id)).length;
          const parentSelected = newVal.includes(org.id);

          if (selectedSubCount === subOrgIds.length) {
            if (!parentSelected) {
              this.selectedOrganizations.push(org.id);
            }
          } else {
            if (parentSelected) {
              const index = this.selectedOrganizations.indexOf(org.id);
              if (index !== -1) {
                this.selectedOrganizations.splice(index, 1);
              }
            }
          }
        });
        this.$nextTick(() => {
          this.updatingSelection = false;
        });
      });
    },
    'form.organization'() {
      this.fetchDimitraOffices();
    },
    organizationId(newId) {
      if (newId) {
        this.fetchDimitraOffices(newId);
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.v-expansion-panel-header {
  background-color: #fff7e6 !important;
  font-weight: bold;
  font-size: 16px;
}

.bordered-expansion {
  border: 1px solid #ffb443;
  border-radius: 6px;
  background-color: #ffb443;
}

.upload-document {
  width: 100%;
}

.dropZone {
  width: 720px;
  height: 200px;
  position: relative;
  border: 2px dashed #97a8b8;
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
  font-size: 12px;

  .underline {
    text-decoration: underline;
    color: #0057bd;
  }

  .blue-color {
    color: #0057bd;
  }
}

.dropZone-title {
  color: #787878;
}

.dropZone input {
  position: absolute;
  cursor: pointer;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}

.dropZone-over {
  background: #5c5c5c;
  opacity: 0.8;
}

.pdf-docs {
  display: flex;
  justify-content: start;
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

.delete-icon {
  position: absolute;
  top: 5px;
  right: 5px;
  color: #135b00;
  cursor: pointer;
}

.file-extension {
  font-size: 18px;
  color: #135b00;
  margin: 0;
  line-height: 1;
}

.file-name {
  display: block;
  font-size: 12px;
  color: #333;
  margin-top: 5px;
  text-align: center;
  word-break: break-all;
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

.upload-card {
  width: 720px;
  height: 170px;
  border: 1px dashed #cccccc;
  border-radius: 8px;
  text-align: start;
}

.upload-input .v-input__control {
  text-align: center;
}

// Add 4px gap between the table header and the first row of the vintage years table
.mt-6 .v-data-table__wrapper tbody tr:first-child td {
  padding-top: 20px !important; /* Default is 16px, so 16+4=20px for a 4px extra gap */
}

.organization-list {
  max-height: 400px;
  overflow-y: auto;
}

/* Validation error styling */
.v-text-field--error .v-input__slot {
  border-color: #ff5252 !important;
}

.v-text-field--error .v-text-field__details {
  color: #ff5252;
  font-size: 12px;
  margin-top: 4px;
}

/* Data collection table alignment */
.data-collection-table .v-data-table__wrapper table tbody tr td {
  vertical-align: middle;
  padding: 12px 16px;
}

.data-collection-table .v-data-table__wrapper table thead tr th {
  vertical-align: middle;
  padding: 12px 16px;
  text-align: center;
  font-weight: 600;
  background-color: #117443;
  color: white !important;
}

/* Column-specific alignment */
.data-collection-table .v-data-table__wrapper table tbody tr td:nth-child(1) {
  text-align: left;
}

.data-collection-table .v-data-table__wrapper table tbody tr td:nth-child(2) {
  text-align: center;
}

.data-collection-table .v-data-table__wrapper table tbody tr td:nth-child(3) {
  text-align: left;
}

.data-collection-table .v-data-table__wrapper table tbody tr td:nth-child(4) {
  text-align: center;
}

.data-collection-table .v-data-table__wrapper table tbody tr td:nth-child(5) {
  text-align: center;
}

.data-collection-table .v-checkbox {
  margin: 0;
}

.data-collection-table .v-text-field {
  margin: 0;
}

.data-collection-table .v-select {
  margin: 0;
}

/* Module name field styling */
.module-name-field .v-input__slot {
  background-color: #f5f5f5 !important;
  border-color: #e0e0e0 !important;
}

.module-name-field .v-text-field__slot input {
  font-size: 14px !important;
  color: #333 !important;
  font-weight: normal !important;
}

.module-name-field .v-input__slot {
  height: 40px;
}

/* Ensure consistent height for all form elements */
.data-collection-table .v-text-field .v-input__slot {
  height: 40px !important;
}

.data-collection-table .v-select .v-input__slot {
  height: 40px !important;
}

.data-collection-table .v-checkbox {
  height: 40px;
  display: flex;
  align-items: center;
}

/* Table column width fixes */
.data-collection-table .v-data-table__wrapper table {
  table-layout: fixed;
  width: 100%;
}

.data-collection-table .v-data-table__wrapper table th:nth-child(1) {
  width: 200px;
}

.data-collection-table .v-data-table__wrapper table th:nth-child(2) {
  width: 100px;
}

.data-collection-table .v-data-table__wrapper table th:nth-child(3) {
  width: 250px;
}

.data-collection-table .v-data-table__wrapper table th:nth-child(4) {
  width: 100px;
}

.data-collection-table .v-data-table__wrapper table th:nth-child(5) {
  width: 120px;
}

/* Audio thumbnail styles */
.audio-thumbnail {
  width: 100%;
  height: 100%;
  background: #e8f5e8;
  border: 1px solid #ddd;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.audio-waveform {
  width: 80%;
  height: 60%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.waveform-bars {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  width: 100%;
  height: 100%;
}

.waveform-bar {
  background: #2e7d32;
  width: 3px;
  border-radius: 1px;
  transition: height 0.3s ease;
}

.audio-info {
  position: absolute;
  bottom: 8px;
  left: 8px;
  right: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.audio-icon {
  color: #2e7d32;
  font-size: 16px;
}

.audio-duration {
    color: #2e7d32;
    font-size: 12px;
    font-weight: 500;
}

.disabled {
    opacity: 0.6;
    pointer-events: none;
}

</style>

<style>
.custom-file-input .v-input__slot {
  height: 40px;
  width: max-content;
  border: 1px dashed gray;
}

.custom-file-input .v-file-input__text.v-file-input__text--placeholder {
  color: green;
  font-size: 16px;
}

.custom-file-input {
  width: max-content;
}

.custom-file-input .v-text-field__suffix {
  color: rgb(161, 159, 159);
  margin-left: 10px;
  font-size: 12px;
/* There is no actual issue in the selected code. The selection simply closes a CSS rule and the <style> block. */
}
</style>
