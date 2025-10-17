<template>
    <div>
      <breadcrumb :items="breadcrumbs" />
  
      <v-container fluid>
        <div class="d-flex align-center justify-space-between mt-6 mb-4">
          <h2 class="font-weight-bold mb-6">{{ pageTitle }}</h2>
          <div>
            <v-btn
                outlined
                class="mr-3"
                @click="$router.go(-1)"
                style="border-color: #00BD73; color: #00BD73;"
            >
                {{ $t('carbonCredit.back') }}
            </v-btn>
            <v-btn
                :outlined="isUserDataReady && isSuperAdmin"
                :class="isUserDataReady && isSuperAdmin ? 'mr-3' : ''"
                @click="previewProject"
                :color="isUserDataReady && isSuperAdmin ? undefined : 'primary'"
                :style="isUserDataReady && isSuperAdmin ? { borderColor: '#00BD73', color: '#00BD73' } : {}"
            >
                {{ $t('carbonCredit.preview') }}
            </v-btn>
            <v-btn 
                v-if="isUserDataReady && isSuperAdmin"
                color="primary"
                class="ml-3"
            >
                {{ $t('carbonCredit.submit') }}
            </v-btn>
          </div>
        </div>
  
        <v-card flat class="pa-6">
            <v-row>
                <v-col cols="12" md="4">
                    <div class="view-block">
                        <label class="view-label">
                          {{ $t('carbonCredit.register.projectTitle') }}
                          <v-tooltip top color="#666666" max-width="300">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon size="18" class="ml-1" style="color: #666666; cursor: pointer;" v-bind="attrs" v-on="on">mdi-information-outline</v-icon>
                            </template>
                            <span>{{ $t('carbonCredit.register.projectTitle') }}</span>
                          </v-tooltip>
                        </label>
                        <div class="view-value">{{ form.project_title }}</div>
                    </div>
                </v-col>

                <v-col cols="12" md="3">
                    <div class="view-block">
                        <label class="view-label">
                          {{ $t('carbonCredit.register.projectType') }}
                          <v-tooltip top color="#666666" max-width="300">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon size="18" class="ml-1" style="color: #666666; cursor: pointer;" v-bind="attrs" v-on="on">mdi-information-outline</v-icon>
                            </template>
                            <span>{{ $t('carbonCredit.register.projectType') }}</span>
                          </v-tooltip>
                        </label>
                        <div class="view-value">{{ getProjectTypeLabel(form.project_type) }}</div>
                    </div>
                </v-col>

                <v-col cols="12">
                    <div class="view-block">
                        <label class="view-label">
                          {{ $t('carbonCredit.register.description') }}
                          <v-tooltip top color="#666666" max-width="300">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon size="18" class="ml-1" style="color: #666666; cursor: pointer;" v-bind="attrs" v-on="on">mdi-information-outline</v-icon>
                            </template>
                            <span>{{ $t('carbonCredit.register.description') }}</span>
                          </v-tooltip>
                        </label>
                        <div class="view-value multi-line">{{ form.description }}</div>
                    </div>
                </v-col>
            </v-row>

            <!-- Project Agreement Section (not expandable) -->
            <div class="mb-4">
              <label class="view-label">{{ $t('carbonCredit.register.projectAgreement') }}</label>
              <v-row>
                <v-col
                  v-for="(doc, index) in form.agreement"
                  :key="index"
                  cols="auto"
                  class="mr-4 mb-4"
                >
                    <div class="docs-box">
                      <div class="docs-preview">
                        <div class="img-item">
                          <div class="pdf-box" style="position: relative;">
                            <a :href="doc.s3_url" target="_blank" style="position: absolute; top: 5px; right: 5px; ">
                              <v-icon style="color: #00BD73;">mdi-eye</v-icon>
                            </a>
                            <h1 class="file-extension">
                              {{ doc.file_name ? doc.file_name.split('.').pop().toUpperCase() : '' }}
                            </h1>
                          </div>
                          <span class="file-name">
                            {{ doc.file_name }}
                          </span>
                        </div>
                      </div>
                    </div>
                </v-col>
              </v-row>
            </div>

            <!-- Header Image Preview Section (not expandable) -->
            <div class=" mb-4">
              <label class="view-label">{{ $t('carbonCredit.register.headerImage') }}</label>
              <div style="position: relative; width: 720px; height: 170px;">
                <img
                  v-if="form.headerImage"
                  :src="form.headerImage"
                  alt="Header Image"
                  style="width: 100%; height: 100%; object-fit: contain; border-radius: 8px; cursor: pointer;"
                  @click="openMediaModal({ file_name: $t('carbonCredit.register.headerImage'), s3_url: form.headerImage, file_type: 'image' }, [ { file_name: $t('carbonCredit.register.headerImage'), s3_url: form.headerImage, file_type: 'image' } ])"
                />
                <img
                  v-else
                  src="../../../assets/img/header-image-default.png"
                  alt="Placeholder Image"
                  style="width: 100%; height: 100%; object-fit: contain; border-radius: 8px;"
                />
              </div>
            </div>

            <!-- Responsible Dimitra Office Section (Expandable) -->
            <v-expansion-panels flat class="mb-4">
              <v-expansion-panel>
                <v-expansion-panel-header class="font-weight-medium bordered-expansion">
                  {{ $t('carbonCredit.projectInfo.responsibleDimitraOffice') }}
                </v-expansion-panel-header>
                <v-expansion-panel-content class="mt-4">
                  <v-row>
                    <v-col cols="12" md="3">
                      <div class="dimitra-office-block">
                        <div class="d-flex align-center mb-2">
                          <span class="dimitra-office-label">{{ $t('carbonCredit.projectInfo.officeName') }}</span>
                          <v-tooltip top color="#666666" max-width="300">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon size="18" class="ml-1" style="color: #666666; cursor: pointer;" v-bind="attrs" v-on="on">mdi-information-outline</v-icon>
                            </template>
                            <span>{{ $t('carbonCredit.projectInfo.officeName') }}</span>
                          </v-tooltip>
                        </div>
                        <div class="dimitra-office-value">{{ office?.officeName || '-' }}</div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="3">
                      <div class="dimitra-office-block">
                        <div class="d-flex align-center mb-2">
                          <span class="dimitra-office-label">{{ $t('carbonCredit.projectInfo.contactPersonName') }}</span>
                          <v-tooltip top color="#666666" max-width="300">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon size="18" class="ml-1" style="color: #666666; cursor: pointer;" v-bind="attrs" v-on="on">mdi-information-outline</v-icon>
                            </template>
                            <span>{{ $t('carbonCredit.projectInfo.contactPersonName') }}</span>
                          </v-tooltip>
                        </div>
                        <div class="dimitra-office-value">{{ office?.contactPerson || '-' }}</div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="3">
                      <div class="dimitra-office-block">
                        <div class="d-flex align-center mb-2">
                          <span class="dimitra-office-label">{{ $t('carbonCredit.projectInfo.contactNumber') }}</span>
                          <v-tooltip top color="#666666" max-width="300">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon size="18" class="ml-1" style="color: #666666; cursor: pointer;" v-bind="attrs" v-on="on">mdi-information-outline</v-icon>
                            </template>
                            <span>{{ $t('carbonCredit.projectInfo.contactNumber') }}</span>
                          </v-tooltip>
                        </div>
                        <div class="dimitra-office-value">{{ office?.phoneNumber || '-' }}</div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="3">
                      <div class="dimitra-office-block">
                        <div class="d-flex align-center mb-2">
                          <span class="dimitra-office-label">{{ $t('carbonCredit.projectInfo.email') }}</span>
                          <v-tooltip top color="#666666" max-width="300">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon size="18" class="ml-1" style="color: #666666; cursor: pointer;" v-bind="attrs" v-on="on">mdi-information-outline</v-icon>
                            </template>
                            <span>{{ $t('carbonCredit.projectInfo.email') }}</span>
                          </v-tooltip>
                        </div>
                        <div class="dimitra-office-value">{{ office?.email || '-' }}</div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="6">
                      <div class="dimitra-office-block">
                        <div class="d-flex align-center mb-2">
                          <span class="dimitra-office-label">{{ $t('carbonCredit.projectInfo.address') }}</span>
                          <v-tooltip top color="#666666" max-width="300">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon size="18" class="ml-1" style="color: #666666; cursor: pointer;" v-bind="attrs" v-on="on">mdi-information-outline</v-icon>
                            </template>
                            <span>{{ $t('carbonCredit.projectInfo.address') }}</span>
                          </v-tooltip>
                        </div>
                        <div class="dimitra-office-value">{{ office?.address || '-' }}</div>
                      </div>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>

            <v-expansion-panels flat class="mb-4">
                <v-expansion-panel>
                    <v-expansion-panel-header class="font-weight-medium bordered-expansion">
                    {{ $t('carbonCredit.register.organizationDetails') }}
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                    <div>
                        <v-data-table
                        :headers="orgTableHeaders"
                        :items="filteredOrganizations"
                        :items-per-page="limit"
                        hide-default-footer
                        >
                        <template v-slot:top>
                            <div class="d-flex mt-5">
                            <div class="srch mr-2">
                                <v-text-field
                                prepend-inner-icon="mdi-magnify"
                                outlined
                                dense
                                height="5px"
                                :placeholder="$t('carbonCredit.search')"
                                v-model="orgSearch"
                                @input="filterOrganizations"
                                class="shrink"
                                ></v-text-field>
                            </div>
                            <v-spacer></v-spacer>
                            <div class="py-1 title">
                                {{ orgFrom }} - {{ orgTo }} {{ $t('of') }} {{ organizations.length }}
                            </div>
                            <v-btn class="mx-2" fab small outlined color="primary" :disabled="orgPage <= 1" @click="changeOrgPage(false)">
                                <v-icon dark>mdi-chevron-left</v-icon>
                            </v-btn>
                            <v-btn class="mx-2" fab small outlined color="primary" :disabled="orgPage >= orgTotalPages" @click="changeOrgPage(true)">
                                <v-icon dark>mdi-chevron-right</v-icon>
                            </v-btn>
                            </div>
                        </template>
                        <template v-slot:body="{ items }">
                            <tbody>
                            <tr v-for="org in items" :key="org.id">
                                <td>{{ org.name }}</td>
                                <td>{{ org.address }}</td>
                                <td>{{ org.country }}</td>
                                <td>
                                <a :href="org.website" target="_blank">{{ org.website }}</a>
                                </td>
                            </tr>
                            </tbody>
                        </template>
                        <template v-slot:footer></template>
                        </v-data-table>
                    </div>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>

            <!-- Project Info Section -->
            <v-expansion-panels flat class="mb-4">
              <v-expansion-panel>
                <v-expansion-panel-header class="font-weight-medium bordered-expansion">
                  {{ $t('carbonCredit.register.projectInfo') }}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row class="mt-4" align="center">
                    <v-col cols="12" sm="6" md="3">
                      <div class="view-block">
                        <label class="view-label">
                          {{ $t('carbonCredit.register.status') }}
                          <v-tooltip top color="#666666" max-width="300">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon size="18" class="ml-1" style="color: #666666; cursor: pointer;" v-bind="attrs" v-on="on">mdi-information-outline</v-icon>
                            </template>
                            <span>{{ $t('carbonCredit.register.status') }}</span>
                          </v-tooltip>
                        </label>
                        <div class="view-value">{{ getStatusLabel(form.status) }}</div>
                      </div>
                    </v-col>

                    <v-col cols="12" sm="6" md="3">
                      <div class="view-block">
                        <label class="view-label">
                          {{ $t('carbonCredit.register.creditType') }}
                          <v-tooltip top color="#666666" max-width="300">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon size="18" class="ml-1" style="color: #666666; cursor: pointer;" v-bind="attrs" v-on="on">mdi-information-outline</v-icon>
                            </template>
                            <span>{{ $t('carbonCredit.register.creditType') }}</span>
                          </v-tooltip>
                        </label>
                        <div class="view-value">{{ getCreditTypeLabel(form.creditType) }}</div>
                      </div>
                    </v-col>

                    <v-col cols="12" sm="6" md="3">
                      <div class="view-block">
                        <label class="view-label">
                          {{ $t('carbonCredit.register.creditStart') }}
                          <v-tooltip top color="#666666" max-width="300">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon size="18" class="ml-1" style="color: #666666; cursor: pointer;" v-bind="attrs" v-on="on">mdi-information-outline</v-icon>
                            </template>
                            <span>{{ $t('carbonCredit.register.creditStart') }}</span>
                          </v-tooltip>
                        </label>
                        <div class="view-value">{{ form.creditStart }}</div>
                      </div>
                    </v-col>

                    <v-col cols="12" sm="6" md="3">
                      <div class="view-block">
                        <label class="view-label">
                          {{ $t('carbonCredit.register.creditEnd') }}
                          <v-tooltip top color="#666666" max-width="300">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon size="18" class="ml-1" style="color: #666666; cursor: pointer;" v-bind="attrs" v-on="on">mdi-information-outline</v-icon>
                            </template>
                            <span>{{ $t('carbonCredit.register.creditEnd') }}</span>
                          </v-tooltip>
                        </label>
                        <div class="view-value">{{ form.creditEnd }}</div>
                      </div>
                    </v-col>

                    <v-col cols="12" sm="6" md="3">
                      <div class="view-block">
                        <label class="view-label">
                          {{ $t('carbonCredit.register.standardMethodology') }}
                          <v-tooltip top color="#666666" max-width="300">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon size="18" class="ml-1" style="color: #666666; cursor: pointer;" v-bind="attrs" v-on="on">mdi-information-outline</v-icon>
                            </template>
                            <span>{{ $t('carbonCredit.register.standardMethodology') }}</span>
                          </v-tooltip>
                        </label>
                        <div class="view-value">{{ form.standard }}</div>
                      </div>
                    </v-col>

                    <v-col cols="12" sm="6" md="6">
                      <div class="view-block">
                        <label class="view-label">
                          {{ $t('carbonCredit.register.validationDocumentation') }}
                          <v-tooltip top color="#666666" max-width="300">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon size="18" class="ml-1" style="color: #666666; cursor: pointer;" v-bind="attrs" v-on="on">mdi-information-outline</v-icon>
                            </template>
                            <span>{{ $t('carbonCredit.register.validationDocumentation') }}</span>
                          </v-tooltip>
                        </label>
                        <div class="view-value">
                          <span
                            v-for="(file, index) in form.validationDocumentation"
                            :key="index"
                            class="mr-3"
                          >
                            <a :href="file.s3_url" target="_blank" style="color: #000000; text-decoration: underline;">{{ file.file_name }}</a>
                          </span>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>

            <!-- Vintage Section -->
            <v-expansion-panels flat class="mb-4">
              <v-expansion-panel>
                <v-expansion-panel-header class="font-weight-medium bordered-expansion">
                  {{ $t('carbonCredit.register.vintage') }}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row class="mt-4" align="center">
                    <v-col cols="12" md="3">
                      <div class="view-block">
                        <label class="view-label">
                          {{ $t('carbonCredit.register.vintage') }}
                          <v-tooltip top color="#666666" max-width="300">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon size="18" class="ml-1" style="color: #666666; cursor: pointer;" v-bind="attrs" v-on="on">mdi-information-outline</v-icon>
                            </template>
                            <span>{{ $t('carbonCredit.register.vintage') }}</span>
                          </v-tooltip>
                        </label>
                        <div class="view-value">{{ getAllVintageYears() }}</div>
                      </div>
                    </v-col>
                    <v-col cols="12" md="3">
                      <div class="view-block">
                        <label class="view-label">
                          {{ $t('carbonCredit.register.currency') }}
                          <v-tooltip top color="#666666" max-width="300">
                            <template v-slot:activator="{ on, attrs }">
                              <v-icon size="18" class="ml-1" style="color: #666666; cursor: pointer;" v-bind="attrs" v-on="on">mdi-information-outline</v-icon>
                            </template>
                            <span>{{ $t('carbonCredit.register.currency') }}</span>
                          </v-tooltip>
                        </label>
                        <div class="view-value">{{ form.currency }}</div>
                      </div>
                    </v-col>
                  </v-row>

                  <v-data-table
                    :headers="vintageHeaders"
                    :items="form.vintageRows"
                    item-key="id"
                    class="mt-6"
                    hide-default-footer
                  >
                    <template v-slot:item.year="{ item }">
                      <span>{{ item.year }}</span>
                    </template>
                    <template v-slot:item.credits="{ item }">
                      <span>{{ item.credits }}</span>
                    </template>
                    <template v-slot:item.price="{ item }">
                      <span>{{ item.price }} {{ form.currency }}</span>
                    </template>
                  </v-data-table>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>

            <!-- Attachments -->
            <v-expansion-panels flat class="mb-4">
              <v-expansion-panel>
                <v-expansion-panel-header class="font-weight-medium bordered-expansion">
                  {{ $t('carbonCredit.register.attachmentTitle') }}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row dense class="mt-4">
                    <v-col
                      v-for="file in form.attachmentFile"
                      :key="file.id"
                      cols="auto"
                      class="mr-4 mb-4"
                    >
                      <div
                        class="attachment-thumbnail"
                        @click="openMediaModal(file)"
                        style="cursor: pointer; width: 138px; height: 104px; display: flex; align-items: center; justify-content: center; border-radius: 6px; border: 1px solid #ddd; overflow: hidden; position: relative;"
                      >
                        <img
                          v-if="file.file_type && file.file_type.startsWith('image')"
                          :src="file.s3_url"
                          alt="Preview"
                          style="width: 100%; height: 100%; object-fit: cover;"
                        />
                        <template v-else-if="file.file_type && file.file_type.startsWith('video')">
                          <video
                            :src="file.s3_url"
                            style="width: 100%; height: 100%; object-fit: cover; background: #000;"
                            muted playsinline preload="metadata"
                          ></video>
                          <v-icon
                            class="play-overlay"
                            style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); font-size: 36px; color: white; text-shadow: 0 0 8px #000; pointer-events: none;"
                            large
                          >mdi-play-circle</v-icon>
                        </template>
                        <v-icon
                          v-else-if="file.file_type && file.file_type.startsWith('audio')"
                          style="font-size: 40px;"
                        >mdi-music</v-icon>
                        <span v-else class="text-caption text-truncate" style="padding: 4px;">{{ file.file_name }}</span>
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
                    <v-col v-for="sdg in filteredSdgs" :key="sdg.id" cols="12" md="6" lg="4" class="d-flex align-start mb-4">
                      <div class="d-flex flex-column">
                        <div class="d-flex align-center">
                          <img :src="sdg.icon" alt="sdg icon" height="40" width="40" class="mr-3"
                            style="border-radius: 4px" />
                          <span class="text-body-1">{{ sdg.title }}</span>
                          <v-spacer></v-spacer>
                          <v-icon 
                            @click="toggleSdgExpansion(sdg.id)"
                            style="cursor: pointer; color: #666;"
                          >
                            {{ expandedSdgs.includes(sdg.id) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                          </v-icon>
                        </div>
                        <v-expand-transition>
                          <div v-if="expandedSdgs.includes(sdg.id)" class="mt-2 ml-10">
                            <div class="sdg-description-text">{{ sdg.description }}</div>
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
                  {{ $t('carbonCredit.register.dataCollectionTitle') }}
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <p class="my-4">
                    {{ $t('carbonCredit.register.dataCollectionInfo') }}
                  </p>

                  <v-data-table
                    :headers="dataCycleHeaders"
                    :items="dataCollectionModules"
                    item-key="name"
                    class="elevation-1"
                    hide-default-footer
                  >
                    <!-- Frequency input + unit select -->
                    <template v-slot:item.recurring="{ item }">
                      {{ item.frequency }} {{ item.unit }}
                    </template>

                    <!-- Score (read-only) -->
                    <template v-slot:item.score="{ item }">
                      {{ item.score }}
                    </template>

                    <!-- Approval (read-only) -->
                    <template v-slot:item.approval="{ item }">
                      {{ item.approval }}
                    </template>
                  </v-data-table>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>

            <MultimediaModal
              :show.sync="showMultimediaModal"
              :file="selectedMedia"
              :allFiles="form.attachmentFile"
              @close="showMultimediaModal = false"
              @update:media="selectedMedia = $event"
            />
        </v-card>
      </v-container>
    </div>
  </template>
  
  <script>
  import loadingMixin from '@/mixins/LoadingMixin';
  import MultimediaModal from "./components/MultimediaModal.vue"; 
  import CarbonCreditService from '../../../_services/CarbonCreditService';
  import RoleMixin from "@/mixins/RoleMixin";
  import { mapGetters } from "vuex";
  
  export default {
    mixins: [loadingMixin, RoleMixin],
    components: {
      MultimediaModal,
    },
    data() {
      return {
        projectId: null,
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
          project_title: '',
          project_type: '',
          description: '',
          status: '',
          creditType: '',
          creditStart: '',
          creditEnd: '',
          standard: '',
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
          { text: this.$t('carbonCredit.projectInfo.organizations'), value: 'name' },
          { text: this.$t('carbonCredit.projectInfo.organizationsAddress'), value: 'address' },
          { text: this.$t('carbonCredit.projectInfo.country'), value: 'country' },
          { text: this.$t('carbonCredit.projectInfo.website'), value: 'website' },
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
          { text: this.$t('carbonCredit.projectInfo.vintageYear'), value: 'year' },
          { text: this.$t('carbonCredit.projectInfo.estimatedCredits'), value: 'credits' },
          { text: this.$t('carbonCredit.projectInfo.pricePerCredit'), value: 'price' }
        ],
        dataCycleHeaders: [
          { text: this.$t('carbonCredit.projectInfo.module'), value: 'name' },
          { text: this.$t('carbonCredit.projectInfo.recurring'), value: 'recurring' },
          { text: this.$t('carbonCredit.projectInfo.score'), value: 'score' },
          { text: this.$t('carbonCredit.projectInfo.approval'), value: 'approval' }
        ],
        dataCollectionModules: [],
        showMultimediaModal: false,
        selectedMedia: null,
        allFilesForModal: [],
        office: null,
        expandedSdgs: [],
      };
    },
    computed: {
      ...mapGetters(["getUser"]),
      isSuperAdmin() {
        try {
          // Try both approaches to get user roles
          const userRoles = this.getUserRoles;
          const currentRoles = this.getCurrentRoles;
          
          // Check if super_admin exists in either array
          const isSuperFromVuex = userRoles && Array.isArray(userRoles) && userRoles.some((role) => role === "super_admin");
          const isSuperFromLocal = currentRoles && Array.isArray(currentRoles) && currentRoles.some((role) => role === "super_admin");
          
          return isSuperFromVuex || isSuperFromLocal;
        } catch (error) {
          return false;
        }
      },
      isUserDataReady() {
        // Check both Vuex store and localStorage for user data
        const userFromVuex = this.getUser;
        const rolesFromVuex = this.getUserRoles;
        const rolesFromLocal = this.getCurrentRoles;
        
        const ready = (userFromVuex && rolesFromVuex && Array.isArray(rolesFromVuex)) || 
                     (rolesFromLocal && Array.isArray(rolesFromLocal));
        
        return ready;
      },
      pageTitle() {
        return this.isUserDataReady && this.isSuperAdmin 
          ? this.$t('carbonCredit.register.title') 
          : (this.form.project_title || this.$t('carbonCredit.register.title'));
      },
      filteredSdgs() {
        return this.sdgs.filter(sdg => this.selectedSdgs.includes(sdg.id));
      },
    },
    async mounted() {
      this.projectId = this.$route.params.id;
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
              unit: m.recurring_period === 'M' ? this.$t('carbonCredit.register.month') : this.$t('carbonCredit.register.year'),
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
      openMediaModal(file, allFiles = null) {
        this.selectedMedia = file;
        this.allFilesForModal = allFiles || this.form.attachmentFile;
        this.showMultimediaModal = true;
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
      getProjectTypeLabel(value) {
        const projectTypes = [
          { text: this.$t('carbonCredit.agroforestry'), value: "agroforestry" },
          { text: this.$t('carbonCredit.regenerative_agriculture'), value: "regenerative_agriculture" },
          { text: this.$t('carbonCredit.forestry'), value: "forestry" }
        ];
        const found = projectTypes.find(type => type.value === value);
        return found ? found.text : value;
      },
      getStatusLabel(value) {
        const statuses = [
          { text: this.$t('carbonCredit.planned'), value: "planned" },
          { text: this.$t('carbonCredit.operational'), value: "operational" },
          { text: this.$t('carbonCredit.deactivated'), value: "deactivate" }
        ];
        const found = statuses.find(status => status.value === value);
        return found ? found.text : value;
      },
      getCreditTypeLabel(value) {
        const creditTypes = [
          { text: this.$t('carbonCredit.register.removal'), value: "removal" },
          { text: this.$t('carbonCredit.register.avoided'), value: "avoided" }
        ];
        const found = creditTypes.find(type => type.value === value);
        return found ? found.text : value;
      },
      toggleSdgExpansion(sdgId) {
        const index = this.expandedSdgs.indexOf(sdgId);
        if (index > -1) {
          this.expandedSdgs.splice(index, 1);
        } else {
          this.expandedSdgs.push(sdgId);
        }
      },
      getAllVintageYears() {
        if (!this.form.vintageRows || this.form.vintageRows.length === 0) {
          return '-';
        }
        const years = this.form.vintageRows.map(row => row.year).sort((a, b) => a - b);
        const result = years.join(', ');
        return result;
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
    background-color: #117443;
    color: white !important;
  }

  .sdg-description-text {
    color: #666;
    font-size: 14px;
    line-height: 1.5;
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
  </style>