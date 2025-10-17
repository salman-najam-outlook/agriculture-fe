<template>
  <div>
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <v-container fluid>
      <a id="downloadLink" v-show="false" href=""></a>
      <div class="d-flex mb-4">
        <h2>{{ $t("traceability.traceabilityManagement") }}</h2>
        <v-spacer></v-spacer>
        <div>
          <v-btn @click="page = 'trace'" dense depressed color="primary">
            {{ $t("traceability.traceabilityPage") }}
          </v-btn>
        </div>
        <div class="ml-5">
          <div class="d-flex justify-end">
            <!-- <v-btn
              @click="
                page = 'label';
                showCreateForm = false;
                isEdit = false;
              "
              dense
              depressed
              color="primary"
            >
              {{ $t('traceability.labelDesigner') }}
            </v-btn> -->
          </div>
        </div>
      </div>

      <!-- trace form -->
      <div class="traceForm" v-show="showCreateForm || isEdit">
        <v-form ref="mainForm">
          <!-- add info -->
          <v-card class="mb-5" flat>
            <v-toolbar color="secondary" dark>
              <v-toolbar-title>{{
                $t("traceability.additionalInformation")
              }}</v-toolbar-title>
            </v-toolbar>

            <v-card-text class="pb-0">{{
              $t("traceability.cropsinfo1")
            }}</v-card-text>

            <v-card-text class="pb-0"
              >{{ $t("traceability.additionalLogos") }}*</v-card-text
            >
            <v-card-text>
              <v-row class="pl-3">
                <v-col cols="2">
                  <div class="additional-logos-form">
                    <div
                      style="overflow: clip"
                      :class="['dropZone', dragging ? 'dropZone-over' : '']"
                      @dragenter="dragging = true"
                      @dragleave="dragging = false"
                    >
                      <div class="dropZone-info" @drag="additionalOnChange">
                        <span class="fa fa-cloud-upload dropZone-title"></span>
                        <span class="dropZone-title" v-if="!previewUrl">
                          <v-icon size="50" color="gray"
                            >mdi-camera-outline</v-icon
                          >
                        </span>
                        <div class="dropZone-upload-limit-info">
                          <div id="preview">
                            <img
                              v-if="previewUrl"
                              :src="previewUrl"
                              style="
                                width: 80px;
                                height: 60px;
                                object-fit: contain;
                              "
                            />
                          </div>
                          <div>
                            <v-btn color="primary">{{
                              $t("traceability.addMedia")
                            }}</v-btn>
                          </div>
                        </div>
                      </div>

                      <input
                        type="file"
                        accept="image/png, image/gif, image/jpeg"
                        @change="additionalOnChange"
                      />
                    </div>
                    <div class="text-center">
                      {{ $t("traceability.uploadImage") }}
                    </div>
                    <span class="red--text">{{ fileError }}</span>

                    <div
                      v-if="additionalFileOne"
                      class="uploadedFile-info"
                    ></div>
                  </div>
                </v-col>

                <v-col cols="1">
                  <v-card
                    v-if="additionalPrevUrlOne"
                    flat
                    class="d-flex align-center justify-center relative"
                    min-height="150"
                  >
                    <img :src="additionalPrevUrlOne" width="100" />
                    <v-btn
                      icon
                      text
                      x-small
                      class="remove-btn"
                      @click="removeFile(0)"
                    >
                      <v-icon dark> mdi-close </v-icon>
                    </v-btn>
                  </v-card>
                </v-col>
                <v-col cols="1">
                  <v-card
                    v-if="additionalPrevUrlTwo"
                    flat
                    class="d-flex align-center justify-center relative"
                    min-height="150"
                  >
                    <img :src="additionalPrevUrlTwo" width="100" />
                    <v-btn
                      icon
                      text
                      x-small
                      class="remove-btn"
                      @click="removeFile(1)"
                    >
                      <v-icon dark> mdi-close </v-icon>
                    </v-btn>
                  </v-card>
                </v-col>
                <v-col cols="1">
                  <v-card
                    v-if="additionalPrevUrlThree"
                    flat
                    class="d-flex align-center justify-center relative"
                    min-height="150"
                  >
                    <img :src="additionalPrevUrlThree" width="100" />
                    <v-btn
                      icon
                      text
                      x-small
                      class="remove-btn"
                      @click="removeFile(2)"
                    >
                      <v-icon dark> mdi-close </v-icon>
                    </v-btn>
                  </v-card>
                </v-col>

                <v-col sm="4">
                  <label
                    for="autoLogOff"
                    class="text-subtitle-1 font-weight-bold d-flex align-center"
                  >
                    {{ this.$t("traceability.addSlogan") }}
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon color="green" small v-bind="attrs" v-on="on">
                          mdi-alert-circle
                        </v-icon>
                      </template>
                      <span>{{ $t("traceability.sloganToolTip") }}</span>
                    </v-tooltip>
                  </label>
                  <v-text-field
                    :rules="rules.slogan"
                    required
                    v-model="additionalInfo.slogan"
                    :placeholder="$t('cacaoTraceability.enterSlogan')"
                    outlined
                    :hint="$t('traceability.sloganHint')"
                    persistent-hint
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- origin start -->
          <v-card class="mb-5" flat>
            <v-toolbar color="secondary" dark>
              <v-toolbar-title>{{
                this.$t("cacaoTraceability.originTitle")
              }}</v-toolbar-title>
            </v-toolbar>

            <v-card-text class="pb-0">
              {{ this.$t("traceability.cropsinfo2") }}
            </v-card-text>

            <v-card-text class="pb-0">
              {{ this.$t("traceability.countryImage") }}*</v-card-text
            >
            <v-card-text>
              <v-row>
                <v-col cols="3">
                  <v-row class="pl-3">
                    <v-col cols="8">
                      <div class="additional-logos-form">
                        <div
                          style="overflow: clip"
                          :class="['dropZone', dragging ? 'dropZone-over' : '']"
                          @dragenter="dragging = true"
                          @dragleave="dragging = false"
                        >
                          <div class="dropZone-info" @drag="onOriginChange">
                            <span
                              class="fa fa-cloud-upload dropZone-title"
                            ></span>
                            <span
                              class="dropZone-title"
                              v-if="!originPreviewUrl"
                            >
                              <v-icon size="50" color="gray"
                                >mdi-camera-outline</v-icon
                              >
                            </span>
                            <div class="dropZone-upload-limit-info">
                              <div id="preview">
                                <img
                                  v-if="originPreviewUrl"
                                  :src="originPreviewUrl"
                                  style="
                                    width: 80px;
                                    height: 60px;
                                    object-fit: contain;
                                  "
                                />
                              </div>
                              <div>
                                <v-btn color="primary">{{
                                  $t("traceability.addMedia")
                                }}</v-btn>
                              </div>
                            </div>
                          </div>

                          <input
                            type="file"
                            accept="image/png, image/gif, image/jpeg"
                            @change="onOriginChange"
                          />
                        </div>
                        <div class="text-center">
                          {{ $t("traceability.uploadImage") }}
                        </div>
                        <span class="red--text">{{ fileError }}</span>

                        <div v-if="originFile" class="uploadedFile-info"></div>
                      </div>
                    </v-col>

                    <v-col cols="4">
                      <v-card
                        v-if="originPreviewUrl"
                        flat
                        class="d-flex align-center justify-center relative"
                        min-height="150"
                      >
                        <img :src="originPreviewUrl" width="100" />
                        <v-btn
                          icon
                          text
                          x-small
                          class="remove-btn"
                          @click="removeOriginFile"
                        >
                          <v-icon dark> mdi-close </v-icon>
                        </v-btn>
                      </v-card>
                    </v-col>

                    <v-col sm="12">
                      <label
                        for="autoLogOff"
                        class="text-subtitle-1 font-weight-bold"
                      >
                        {{ this.$t("traceability.mapLink") }}
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon
                              color="green"
                              small
                              v-bind="attrs"
                              v-on="on"
                            >
                              mdi-alert-circle
                            </v-icon>
                          </template>
                          <span>{{ $t("traceability.mapLinkTooltip") }}</span>
                        </v-tooltip>
                      </label>
                      <v-text-field
                        :rules="rules.mapLink"
                        v-model="originInfo.mapLink"
                        :placeholder="$t('cacaoTraceability.enterMapLink')"
                        outlined
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col cols="5">
                  <v-row>
                    <v-col sm="12" class="pb-0">
                      <label
                        for="autoLogOff"
                        class="text-subtitle-1 font-weight-bold d-flex align-center"
                      >
                        {{ this.$t("traceability.originCountryTitle") }}
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon
                              color="green"
                              small
                              v-bind="attrs"
                              v-on="on"
                            >
                              mdi-alert-circle
                            </v-icon>
                          </template>
                          <span>{{
                            $t("traceability.originatingCountryTooltip")
                          }}</span>
                        </v-tooltip>
                      </label>

                      <v-text-field
                        :rules="rules.title"
                        v-model="originInfo.title"
                        :placeholder="
                          $t('traceability.enterOriginCountryTitle')
                        "
                        outlined
                      ></v-text-field>
                    </v-col>

                    <v-col sm="12" class="pt-0">
                      <label
                        for="autoLogOff"
                        class="text-subtitle-1 font-weight-bold d-flex align-center"
                      >
                        {{ this.$t("traceability.description") }}
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon
                              color="green"
                              small
                              v-bind="attrs"
                              v-on="on"
                            >
                              mdi-alert-circle
                            </v-icon>
                          </template>
                          <span>{{
                            $t("traceability.enterCountryDescription")
                          }}</span>
                        </v-tooltip>
                      </label>

                      <v-textarea
                        :rules="rules.description"
                        v-model="originInfo.description"
                        :placeholder="
                          $t('traceability.enterCountryDescription')
                        "
                        outlined
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- coop info start -->
          <v-card class="mb-5" flat>
            <v-toolbar color="secondary" dark>
              <v-toolbar-title
                >{{ $t("traceability.institutionalInfo") }}
              </v-toolbar-title>
            </v-toolbar>

            <v-card-text class="pb-0">
              {{ $t("traceability.info3") }}
            </v-card-text>

            <v-card-text class="pb-0">
              {{ $t("traceability.cooperativeLogo") }}*</v-card-text
            >
            <v-card-text>
              <v-row>
                <v-col cols="3">
                  <v-row class="pl-3">
                    <v-col cols="8">
                      <div class="additional-logos-form">
                        <div
                          style="overflow: clip"
                          :class="['dropZone', dragging ? 'dropZone-over' : '']"
                          @dragenter="dragging = true"
                          @dragleave="dragging = false"
                        >
                          <div class="dropZone-info" @drag="onCoopChange">
                            <span
                              class="fa fa-cloud-upload dropZone-title"
                            ></span>
                            <span class="dropZone-title" v-if="!coopPreviewUrl">
                              <v-icon size="50" color="gray"
                                >mdi-camera-outline</v-icon
                              >
                            </span>
                            <div class="dropZone-upload-limit-info">
                              <div id="preview">
                                <img
                                  v-if="coopPreviewUrl"
                                  :src="coopPreviewUrl"
                                  style="
                                    width: 80px;
                                    height: 60px;
                                    object-fit: contain;
                                  "
                                />
                              </div>
                              <div>
                                <v-btn color="primary">{{
                                  $t("traceability.addMedia")
                                }}</v-btn>
                              </div>
                            </div>
                          </div>

                          <input
                            type="file"
                            accept="image/png, image/gif, image/jpeg"
                            @change="onCoopChange"
                          />
                        </div>
                        <div class="text-center">
                          {{ $t("traceability.uploadImage") }}
                        </div>
                        <span class="red--text">{{ fileError }}</span>

                        <div v-if="coopFile" class="uploadedFile-info"></div>
                      </div>
                    </v-col>

                    <v-col cols="4">
                      <v-card
                        v-if="coopPreviewUrl"
                        flat
                        class="d-flex align-center justify-center"
                        min-height="150"
                      >
                        <img :src="coopPreviewUrl" width="100" />
                        <v-btn
                          icon
                          text
                          x-small
                          class="remove-btn"
                          @click="removeCoopFile"
                        >
                          <v-icon dark> mdi-close </v-icon>
                        </v-btn>
                      </v-card>
                    </v-col>

                    <v-col sm="12">
                      <label
                        for="autoLogOff"
                        class="text-subtitle-1 font-weight-bold d-flex align-center"
                      >
                        {{ this.$t("traceability.websiteLink") }}
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon
                              color="green"
                              small
                              v-bind="attrs"
                              v-on="on"
                            >
                              mdi-alert-circle
                            </v-icon>
                          </template>
                          <span>{{
                            $t("cacaoTraceability.websiteLinkTooltip")
                          }}</span>
                        </v-tooltip>
                      </label>

                      <v-text-field
                        :rules="rules.websiteLink"
                        v-model="coopInfo.websiteLink"
                        :placeholder="$t('cacaoTraceability.enterWebsiteLink')"
                        outlined
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col cols="5">
                  <v-row>
                    <v-col sm="12" class="pb-0">
                      <label
                        for="autoLogOff"
                        class="text-subtitle-1 font-weight-bold"
                      >
                        {{ this.$t("traceability.corporativeTitle") }}
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon
                              color="green"
                              small
                              v-bind="attrs"
                              v-on="on"
                            >
                              mdi-alert-circle
                            </v-icon>
                          </template>
                          <span>{{
                            $t("traceability.corporativeTooltip")
                          }}</span>
                        </v-tooltip>
                      </label>
                      <v-text-field
                        :rules="rules.title"
                        v-model="coopInfo.title"
                        :placeholder="$t('traceability.enterCorporativeTitle')"
                        outlined
                      ></v-text-field>
                    </v-col>

                    <v-col sm="12" class="pt-0">
                      <label
                        for="autoLogOff"
                        class="text-subtitle-1 font-weight-bold"
                      >
                        {{ this.$t("traceability.description") }}
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon
                              color="green"
                              small
                              v-bind="attrs"
                              v-on="on"
                            >
                              mdi-alert-circle
                            </v-icon>
                          </template>
                          <span>{{
                            $t("traceability.coperativeDescriptionTooltip")
                          }}</span>
                        </v-tooltip>
                      </label>
                      <v-textarea
                        :rules="rules.description"
                        v-model="coopInfo.description"
                        :placeholder="
                          $t('traceability.coperativeDescriptionTooltip')
                        "
                        outlined
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- traceability intro start -->
          <v-card class="mb-5" flat>
            <v-toolbar color="secondary" dark>
              <v-toolbar-title
                >{{ $t("traceability.traceabilityIntro") }}
              </v-toolbar-title>
            </v-toolbar>

            <v-card-text class="pb-0">{{
              $t("traceability.info4")
            }}</v-card-text>

            <v-card-text class="pb-0">
              {{ $t("traceability.traceabilityImage") }}*</v-card-text
            >
            <v-card-text>
              <v-row>
                <v-col cols="3">
                  <v-row class="pl-3">
                    <v-col cols="8">
                      <div class="additional-logos-form">
                        <div
                          style="overflow: clip"
                          :class="['dropZone', dragging ? 'dropZone-over' : '']"
                          @dragenter="dragging = true"
                          @dragleave="dragging = false"
                        >
                          <div class="dropZone-info" @drag="onTraceIntroChange">
                            <span
                              class="fa fa-cloud-upload dropZone-title"
                            ></span>
                            <span
                              class="dropZone-title"
                              v-if="!traceIntroPreviewUrl"
                            >
                              <v-icon size="50" color="gray"
                                >mdi-camera-outline</v-icon
                              >
                            </span>
                            <div class="dropZone-upload-limit-info">
                              <div id="preview">
                                <img
                                  v-if="traceIntroPreviewUrl"
                                  :src="traceIntroPreviewUrl"
                                  style="
                                    width: 80px;
                                    height: 60px;
                                    object-fit: contain;
                                  "
                                />
                              </div>
                              <div>
                                <v-btn color="primary">{{
                                  $t("traceability.addMedia")
                                }}</v-btn>
                              </div>
                            </div>
                          </div>

                          <input
                            type="file"
                            accept="image/png, image/gif, image/jpeg"
                            @change="onTraceIntroChange"
                          />
                        </div>
                        <div class="text-center">
                          {{ $t("traceability.uploadImage") }}
                        </div>
                        <span class="red--text">{{ fileError }}</span>

                        <div
                          v-if="traceIntroFile"
                          class="uploadedFile-info"
                        ></div>
                      </div>
                    </v-col>

                    <v-col cols="4">
                      <v-card
                        v-if="traceIntroPreviewUrl"
                        flat
                        class="d-flex align-center justify-center"
                        min-height="150"
                      >
                        <img
                          v-if="traceIntroPreviewUrl"
                          :src="traceIntroPreviewUrl"
                          width="100"
                        />
                        <v-btn
                          icon
                          text
                          x-small
                          class="remove-btn"
                          @click="removeTraceFile"
                        >
                          <v-icon dark> mdi-close </v-icon>
                        </v-btn>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col cols="5">
                  <v-row>
                    <v-col sm="12" class="pb-0 d-none">
                      <label
                        for="autoLogOff"
                        class="text-subtitle-1 font-weight-bold"
                      >
                        {{ this.$t("traceability.title") }}
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon
                              color="green"
                              small
                              v-bind="attrs"
                              v-on="on"
                            >
                              mdi-alert-circle
                            </v-icon>
                          </template>
                          <span>{{ $t("traceability.titleTooltip") }}</span>
                        </v-tooltip>
                      </label>
                      <v-text-field
                        v-model="traceIntroInfo.title"
                        :placeholder="$t('cacaoTraceability.enterTitle')"
                        outlined
                      ></v-text-field>
                    </v-col>

                    <v-col sm="12" class="pt-0">
                      <label
                        for="autoLogOff"
                        class="text-subtitle-1 font-weight-bold"
                      >
                        {{ this.$t("traceability.description") }}
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon
                              color="green"
                              small
                              v-bind="attrs"
                              v-on="on"
                            >
                              mdi-alert-circle
                            </v-icon>
                          </template>
                          <span>{{ $t("traceability.introDescription") }}</span>
                        </v-tooltip>
                      </label>
                      <v-textarea
                        :rules="rules.description"
                        v-model="traceIntroInfo.description"
                        :placeholder="$t('traceability.introDescription')"
                        outlined
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card class="d-flex pa-5 mb-4">
            <v-spacer></v-spacer>
            <v-btn
              v-show="isEdit"
              @click="isEdit = false"
              dense
              depressed
              outlined
              color="primary"
              >{{ $t("cancel") }}</v-btn
            >
            <div class="ml-5">
              <div class="d-flex justify-end">
                <v-btn @click="onTraceSubmit" dense depressed color="primary">{{
                  $t("save")
                }}</v-btn>
              </div>
            </div>
          </v-card>
        </v-form>
      </div>

      <!-- trace display -->

      <div class="traceDisplay" v-show="showDisplay && !isEdit">
        <div class="d-flex mb-4">
          <h2></h2>
          <v-spacer></v-spacer>
          <div class="ml-5">
            <div class="d-flex justify-end">
              <v-btn fab @click="startEdit" dense depressed color="primary"
                ><v-icon>mdi-pencil</v-icon></v-btn
              >
            </div>
          </div>
        </div>

        <v-card class="mb-15" flat>
          <v-toolbar color="secondary" dark>
            <v-toolbar-title>{{
              $t("traceability.additionalInformation")
            }}</v-toolbar-title>
          </v-toolbar>
          <div class="d-flex align-center pa-5">
            <img
              :key="index"
              v-for="(imageUrl, index) in traceResObj &&
              traceResObj.additional_logos"
              :src="imageUrl.location"
              alt=""
              width="200"
              height="200"
              class="circular-img mr-2"
            />
            <div class="pl-5 trace-slogan">
              <h2>{{ traceResObj && traceResObj.slogan }}</h2>
            </div>
          </div>
        </v-card>
        <v-card class="mb-15" flat>
          <v-toolbar color="secondary" dark>
            <v-toolbar-title>{{
              this.$t("traceability.originationCountry")
            }}</v-toolbar-title>
          </v-toolbar>
          <div class="d-flex align-center pa-5">
            <img
              width="200"
              height="200"
              class="circular-img mr-4"
              :src="
                traceResObj &&
                Object.keys(traceResObj)?.length > 0 &&
                traceResObj.origin_image.location
              "
              alt=""
            />
            <div>
              <h1>{{ traceResObj && traceResObj.origin_title }}</h1>
              <p>{{ traceResObj && traceResObj.origin_description }}</p>
            </div>
          </div>
        </v-card>

        <v-card class="mb-15" flat>
          <v-toolbar color="secondary" dark>
            <v-toolbar-title
              >{{ $t("traceability.institutionalInfo") }}
            </v-toolbar-title>
          </v-toolbar>
          <div class="d-flex align-center pa-5">
            <img
              width="200"
              height="200"
              class="circular-img mr-4"
              :src="
                traceResObj &&
                Object.keys(traceResObj)?.length > 0 &&
                traceResObj.cooperative_image.location
              "
              alt=""
            />
            <div>
              <h1>{{ traceResObj && traceResObj.cooperative_title }}</h1>
              <p>{{ traceResObj && traceResObj.cooperative_description }}</p>
            </div>
          </div>
        </v-card>

        <v-card class="mb-15" flat>
          <v-toolbar color="secondary" dark>
            <v-toolbar-title
              >{{ $t("traceability.traceabilityIntro") }}
            </v-toolbar-title>
          </v-toolbar>
          <div class="d-flex align-center pa-5">
            <img
              width="200"
              height="200"
              class="circular-img mr-4"
              :src="
                traceResObj &&
                Object.keys(traceResObj)?.length > 0 &&
                traceResObj.traceability_image.location
              "
              alt=""
            />
            <div>
              <p>{{ traceResObj && traceResObj.traceability_description }}</p>
            </div>
          </div>
        </v-card>
      </div>

      <!-- label designer -->

      <div class="labelDesigner" v-show="page == 'label'">
        <v-tabs v-model="labelTab" @change="onTabChange">
          <v-tab v-for="(labelEl, index) in labelArr" :key="index"
            >{{ labelEl.title }}
          </v-tab>
          <v-btn @click="addLabel" class="mt-2" color="primary" depressed
            >+ {{ $t("traceability.addLabel") }}</v-btn
          >
        </v-tabs>
        <v-tabs-items v-model="labelTab">
          <v-tab-item
            class="pl-5 pt-5"
            v-for="(labelEl, index) in labelArr"
            :key="index"
            eager
          >
            <v-row>
              <v-col sm="6">
                <v-row>
                  <v-col sm="8">
                    <label
                      for="autoLogOff"
                      class="text-subtitle-1 font-weight-bold"
                    >
                      {{ $t("traceability.chooseTitle") }}
                      <v-icon color="green" small>mdi-alert-circle</v-icon>
                    </label>
                    <v-text-field
                      v-model="labelEl.title"
                      :placeholder="$t('traceability.enterLabelTitle')"
                      outlined
                    ></v-text-field>
                  </v-col>
                  <v-col sm="8">
                    <label
                      for="autoLogOff"
                      class="text-subtitle-1 font-weight-bold"
                    >
                      {{ $t("traceability.chooseLabelDesign") }}
                      <v-icon color="green" small>mdi-alert-circle</v-icon>
                    </label>
                    <v-row>
                      <v-radio-group
                        style="width: 100%"
                        row
                        v-model="labelEl.formatRadioModel"
                      >
                        <v-col
                          :key="formatEl.id"
                          v-for="(formatEl, index) in formatArr"
                          sm="6"
                        >
                          <v-card>
                            <v-card-text>
                              <v-radio
                                :label="formatEl.name"
                                :key="formatEl.id"
                                :value="index"
                              ></v-radio>
                              <div class="smallPreviewParent">
                                <div
                                  :class="`smallFg-${index}`"
                                  :style="{
                                    fill: labelEl.fGcolor,
                                  }"
                                >
                                  <span
                                    :style="{
                                      height: `100px`,
                                    }"
                                    v-html="fgSvg(formatEl.image.fg)"
                                  >
                                  </span>
                                </div>

                                <div
                                  :class="`smallBg-${index}`"
                                  :style="{
                                    fill: labelEl.bGcolor,
                                  }"
                                >
                                  <span v-html="smallSvg(formatEl.image.bg)">
                                  </span>
                                </div>
                              </div>
                            </v-card-text>
                          </v-card>
                        </v-col>
                      </v-radio-group>
                    </v-row>
                  </v-col>
                  <v-col sm="8">
                    <v-checkbox
                      :label="$t('traceability.enableLogoProcessing')"
                      v-model="enableLogoProcessing"
                    ></v-checkbox>

                    <label
                      for="autoLogOff"
                      class="text-subtitle-1 font-weight-bold"
                    >
                      {{ $t("traceability.uploadYourLogo") }}
                      <v-icon color="green" small>mdi-alert-circle</v-icon>
                    </label>

                    <v-row>
                      <v-col sm="6">
                        <div class="additional-logos-form">
                          <div
                            style="overflow: clip"
                            :class="[
                              'dropZone',
                              dragging ? 'dropZone-over' : '',
                            ]"
                            @dragenter="dragging = true"
                            @dragleave="dragging = false"
                          >
                            <div
                              class="dropZone-info"
                              @drag="(e) => onLabelChange(e, index)"
                            >
                              <span
                                class="fa fa-cloud-upload dropZone-title"
                              ></span>
                              <span
                                class="dropZone-title"
                                v-if="!labelPreviewUrl?.length"
                              >
                                <v-icon size="50" color="gray"
                                  >mdi-camera-outline</v-icon
                                >
                              </span>
                              <div class="dropZone-upload-limit-info">
                                <div id="preview">
                                  <img
                                    v-if="labelPreviewUrl[index]"
                                    :src="labelPreviewUrl[index]"
                                    width="440"
                                  />
                                </div>
                                <div>
                                  <v-btn color="primary">{{
                                    $t("traceability.addMedia")
                                  }}</v-btn>
                                </div>
                              </div>
                            </div>

                            <input
                              type="file"
                              accept="image/png, image/gif, image/jpeg"
                              @change="(e) => onLabelChange(e, index)"
                            />
                          </div>
                          <div class="text-center">
                            {{ $t("traceability.uploadImage") }}
                          </div>
                          <div
                            class="text-center"
                            style="
                              font-size: 10px;
                              font-style: italic;
                              font-weight: bold;
                            "
                          >
                            {{ $t("traceability.info5") }}
                          </div>
                          <span class="red--text">{{ fileError }}</span>

                          <div v-if="labelFile" class="uploadedFile-info"></div>
                        </div>
                      </v-col>
                      <v-col sm="3">
                        <v-card
                          flat
                          class="d-flex align-center justify-center"
                          min-height="150"
                        >
                          <img
                            v-if="labelPreviewUrl[index]"
                            :src="labelPreviewUrl[index]"
                            width="100"
                          />
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-col>

                  <v-col sm="7">
                    <label
                      for="autoLogOff"
                      class="text-subtitle-1 font-weight-bold"
                    >
                      {{ $t("traceability.chooseTemplateColors") }}
                      <v-icon color="green" small>mdi-alert-circle</v-icon>
                    </label>
                    <v-row>
                      <v-col sm="6">
                        <v-card>
                          <v-card-text>{{
                            $t("traceability.backgroundColor")
                          }}</v-card-text>
                          <v-text-field
                            readonly
                            v-model="labelEl.bGcolor"
                            hide-details
                            class="ma-0 pa-0"
                            solo
                          >
                            <template v-slot:append>
                              <v-menu
                                v-model="labelEl.bGmenu"
                                top
                                nudge-bottom="105"
                                nudge-left="16"
                                :close-on-content-click="false"
                              >
                                <template v-slot:activator="{ on }">
                                  <div
                                    :style="{
                                      ...labelEl.swatchStyleBg,
                                      backgroundColor: labelEl.bGcolor,
                                      borderRadius: labelEl.bGmenu
                                        ? '50%'
                                        : '4px',
                                    }"
                                    v-on="on"
                                  />
                                </template>
                                <v-card>
                                  <v-card-text class="pa-0">
                                    <v-color-picker
                                      v-model="labelEl.bGcolor"
                                      flat
                                    />
                                  </v-card-text>
                                </v-card>
                              </v-menu>
                            </template>
                          </v-text-field>
                        </v-card>
                      </v-col>
                      <v-col sm="6">
                        <v-card>
                          <v-card-text>{{
                            $t("traceability.foregroundColor")
                          }}</v-card-text>
                          <v-text-field
                            readonly
                            v-model="labelEl.fGcolor"
                            hide-details
                            class="ma-0 pa-0"
                            solo
                          >
                            <template v-slot:append>
                              <v-menu
                                v-model="labelEl.fGmenu"
                                top
                                nudge-bottom="105"
                                nudge-left="16"
                                :close-on-content-click="false"
                              >
                                <template v-slot:activator="{ on }">
                                  <div
                                    :style="{
                                      ...labelEl.swatchStyleFg,
                                      backgroundColor: labelEl.fGcolor,
                                      borderRadius: labelEl.fGmenu
                                        ? '50%'
                                        : '4px',
                                    }"
                                    v-on="on"
                                  />
                                </template>
                                <v-card>
                                  <v-card-text class="pa-0">
                                    <v-color-picker
                                      v-model="labelEl.fGcolor"
                                      flat
                                    />
                                  </v-card-text>
                                </v-card>
                              </v-menu>
                            </template>
                          </v-text-field>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col sm="8">
                    <v-btn
                      class="ml-1"
                      @click="page = 'trace'"
                      outlined
                      color="primary"
                      >{{ $t("cancel") }}</v-btn
                    >
                    <v-btn
                      class="ml-1"
                      @click.prevent="onLabelDelete(index)"
                      :disabled="disableLabelSubmit"
                      outlined
                      color="red"
                    >
                      {{ $t("delete") }}
                    </v-btn>
                    <v-btn
                      class="ml-1"
                      @click.prevent="onLabelSubmit(index)"
                      color="primary"
                      :disabled="disableLabelSubmit"
                    >
                      {{ $t("save") }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
              <v-col sm="6">
                <v-row class="text-center">
                  <v-col sm="12" class="pb-0 mb-0">
                    <label
                      for="autoLogOff"
                      class="text-subtitle-1 font-weight-bold pb-0 mb-0"
                    >
                      {{ $t("traceability.labelStatus") }}
                    </label>
                  </v-col>
                  <v-col sm="12" class="pt-0 mt-0">
                    <div class="d-flex justify-center">
                      <v-switch inset
                        v-model="labelEl.labelStatus"
                        :label="`${
                          labelStatus.toString() === 'true'
                            ? $t('active')
                            : $t('inactive')
                        }`"
                      ></v-switch>
                    </div>
                  </v-col>
                  <v-col sm="12">
                    <div
                      ref="parentPreviewRef"
                      :style="{
                        height: `${
                          labelEl.formatRadioModel == 1
                            ? '260px !important'
                            : '500px'
                        }`,
                      }"
                      class="parentPreview"
                    >
                      <div
                        class="logoPreview"
                        :style="{
                          top: `${
                            labelEl.formatRadioModel == 1
                              ? '32% !important'
                              : '17.8%'
                          }`,
                          left: `${
                            labelEl.formatRadioModel == 1
                              ? '69% !important'
                              : '35%'
                          }`,
                        }"
                      >
                        <template v-if="labelPreviewUrl[index]">
                          <img
                            v-if="labelPreviewUrl[index]"
                            :width="labelEl.formatRadioModel == 1 ? 80 : 120"
                            :src="labelPreviewUrl[index]"
                          />
                        </template>

                        <template v-if="!labelPreviewUrl[index] && logoPreview">
                          <img
                            :width="labelEl.formatRadioModel == 1 ? 80 : 120"
                            :src="logoPreview"
                          />
                        </template>

                        <template
                          v-if="
                            !logoPreview &&
                            labelArr[labelTab] &&
                            labelArr[labelTab].logo &&
                            labelArr[labelTab].logo.location
                          "
                        >
                          <img
                            :width="labelEl.formatRadioModel == 1 ? 80 : 120"
                            :src="
                              labelArr[labelTab] &&
                              labelArr[labelTab].logo &&
                              labelArr[labelTab].logo.location
                            "
                            alt=""
                          />
                        </template>
                      </div>
                      <div
                        v-if="formatArr?.length > 0"
                        class="fgPreview"
                        :style="{
                          fill: labelEl.fGcolor,
                          top: `${
                            labelEl.formatRadioModel == 1
                              ? '17% !important'
                              : '9%'
                          }`,
                          left: `${
                            labelEl.formatRadioModel == 1
                              ? '15% !important'
                              : '16%'
                          }`,
                        }"
                      >
                        <span
                          v-html="formatArr[labelEl.formatRadioModel].image.fg"
                        ></span>
                      </div>

                      <div
                        v-if="formatArr?.length > 0"
                        class="bgPreview"
                        :style="{
                          fill: labelEl.bGcolor,
                          top: `${
                            labelEl.formatRadioModel == 1
                              ? '10% !important'
                              : '0%'
                          }`,
                          left: `${
                            labelEl.formatRadioModel == 1
                              ? '0% !important'
                              : '16%'
                          }`,
                        }"
                      >
                        <span
                          v-html="formatArr[labelEl.formatRadioModel].image.bg"
                        ></span>
                      </div>
                    </div>
                  </v-col>
                  <v-col sm="12">
                    <v-btn color="primary" @click="downloadImage">{{
                      $t("traceability.download")
                    }}</v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-tab-item>
        </v-tabs-items>
      </div>
    </v-container>
  </div>
</template>
<script>
/* eslint-disable */
import html2canvas from "html2canvas";
import loadingMixin from "@/mixins/LoadingMixin";
import axios from "axios";
import { gmapApi } from "vue2-google-maps";

export default {
  created() {},
  components: {},
  watch: {
    async page(nV, oV) {
      if (nV == "label") {
        this.startLoading();
        let labelRes = await axios.get(
          "/crops-overview/traceability-labels/all"
        );
        let labelResArr = labelRes.data.data;
        this.labelArr = labelResArr.map((item) => {
          let tmpObj = {};
          tmpObj.id = item.id;
          tmpObj.title = item.title;
          tmpObj.formatRadioModel = item.label_format;
          tmpObj.bGcolor = item.background_color_code;
          tmpObj.fGcolor = item.text_color_code;
          tmpObj.labelStatus = item.is_active;
          tmpObj.bGmenu = false;
          tmpObj.isEdit = true;
          tmpObj.swatchStyleFg = {
            cursor: "pointer",
            height: "30px",
            width: "30px",
            transition: "border-radius 200ms ease-in-out",
          };
          tmpObj.swatchStyleBg = {
            cursor: "pointer",
            height: "30px",
            width: "30px",
            transition: "border-radius 200ms ease-in-out",
          };
          tmpObj = { ...tmpObj, ...item };
          return tmpObj;
        });
        const selectedTab = this.labelTab ? this.labelTab : 0;
        this.stopLoading();
        await this.getBlobImageUrlIfLogo(selectedTab);
      }
    },
  },
  data() {
    return {
      enableLogoProcessing: false,
      logoPreview: null,
      disableLabelSubmit: false,
      bGcolor: "#D9D9D9",
      bGmenu: false,
      fGcolor: "#423B3B",
      fGmenu: false,
      color: "#1976D2FF",
      mask: "!#XXXXXXXX",
      menu: false,
      formatRadioModel: 0,
      formatArr: [],
      labelStatus: true,
      labelPreviewUrl: [],
      labelFile: [],
      labelTab: null,
      labelArr: [
        {
          labelStatus: true,
          formatRadioModel: 0,
          bGcolor: "#D9D9D9",
          fGcolor: "#423B3B",
          bGmenu: false,
          fGmenu: false,
          swatchStyleFg: {
            cursor: "pointer",
            height: "30px",
            width: "30px",
            transition: "border-radius 200ms ease-in-out",
          },
          swatchStyleBg: {
            cursor: "pointer",
            height: "30px",
            width: "30px",
            transition: "border-radius 200ms ease-in-out",
          },
        },
      ],
      isEdit: false,
      coordArr: [],
      center: { lat: 1.38, lng: 103.8 },
      markers: [],
      poly: [],
      paths: [],
      traceResObj: {},
      page: "trace",
      traceIntroInfo: {},
      traceIntroPreviewUrl: "",
      traceIntroFile: "",
      coopInfo: {},
      coopPreviewUrl: "",
      coopFile: "",
      originPreviewUrl: "",
      previewUrl: "",
      fileError: "",
      additionalFileOne: "",
      dragging: false,
      title: "Farmer Report",
      tab: 0,
      loading: false,
      additionalInfo: {},
      originInfo: {},
      originFile: "",
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          disabled: false,
          to: { name: "Users" },
          exact: true,
        },
        {
          text: this.$t("traceability.traceability"),
          disabled: true,
          href: "breadcrumbs_link_1",
        },
      ],
      additionalFileArr: [],
      rules: {
        slogan: [
          (v) => !!v || this.$t("errors.required"),
        ],
        description: [(v) => !!v || this.$t("errors.required")],
        title: [(v) => !!v || this.$t("errors.required")],
        mapLink: [(v) => !!v || this.$t("errors.required")],
        websiteLink: [(v) => !!v || this.$t("errors.required")],
      },
      toRemove: [],
    };
  },
  methods: {
    async onTabChange(tabNo) {
      this.labelPreviewUrl = [];
      this.logoPreview = null;
      await this.getBlobImageUrlIfLogo(tabNo);
    },
    async handleImageProcessing(file, index) {
      const formData = new FormData();
      formData.append("image", file);
      this.startLoading();
      const res = await axios.post(
        "/crops-overview/traceability-labels/processed-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "arraybuffer",
        }
      );
      const blob = new Blob([res.data], { type: "image/png" });
      this.stopLoading();
      this.labelFile = blob;
      this.$set(this.labelPreviewUrl, index, URL.createObjectURL(blob));
      this.labelFile[index] = blob;
    },
    /* eslint-disable */
    async getBlobImageUrlIfLogo(tab) {
      try {
        const id = this.labelArr[tab].id;
        if (!id) {
          return;
        }
        this.startLoading();
        const res = await axios.get(
          `/crops-overview/traceability-labels/logo-proxy/${id}`,
          { responseType: "blob" }
        );
        const labelBlob = new Blob([res.data], { type: "image/jpeg" });
        this.logoPreview = URL.createObjectURL(labelBlob);
        this.stopLoading();
      } catch {
        this.stopLoading();
      }
    },
    smallSvg(svgStr) {
      let tmp1 = svgStr.replace('height="500"', 'height="180"');
      let tmp2 = tmp1.replace('width="400"', 'width="169"');
      let tmp3 = tmp2.replace('width="401"', 'width="130"');

      return tmp3;
    },
    fgSvg(svgStr) {
      let tmp1 = svgStr.replace('height="500"', 'height="220"');
      let tmp2 = tmp1.replace('width="400"', 'width="169"');
      let tmp3 = tmp2.replace('width="401"', 'width="130"');
      let tmp4 = tmp3.replace('width="275"', 'width="130"');

      return tmp4;
    },
    addLabel() {
      this.logoPreview = null;
      this.labelArr.push({
        labelStatus: true,
        formatRadioModel: 0,
        bGcolor: "#D9D9D9",
        fGcolor: "#423B3B",
        bGmenu: false,
        fGmenu: false,
        swatchStyleFg: {
          cursor: "pointer",
          height: "30px",
          width: "30px",
          transition: "border-radius 200ms ease-in-out",
        },
        swatchStyleBg: {
          cursor: "pointer",
          height: "30px",
          width: "30px",
          transition: "border-radius 200ms ease-in-out",
        },
      });
      this.labelTab = this.labelArr?.length - 1;
    },
    async downloadImage() {
      try {
        this.startLoading();
        // Added sleep mode in order to take time to show loading screen as app might freeze on converting html 2 canvas
        await new Promise((resolve) => setTimeout(resolve, 100));
        let fileName = `label_${new Date().getTime()}.jpg`;
        let a = document.getElementById("downloadLink");
        let el = this.$refs.parentPreviewRef[this.labelTab];
        let canvasRes = await html2canvas(el, { scale: 2, useCORS: true });
        let outputDataUrl = canvasRes
          .toDataURL("image/jpeg")
          .replace("image/jpeg", "image/octet-stream");

        a.href = outputDataUrl;
        a.download = fileName;
        a.click();
        this.stopLoading();
      } catch (error) {
        this.stopLoading();
        console.log(error);
      }
    },
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr?.length,
        u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      return new File([u8arr], filename, { type: mime });
    },
    startEdit() {
      this.isEdit = true;
      this.traceIntroInfo.title = this.traceResObj.traceability_title;
      this.traceIntroInfo.description =
        this.traceResObj.traceability_description;
      this.traceIntroPreviewUrl = this.traceResObj.traceability_image
        ? this.traceResObj.traceability_image.location
        : "";
      this.traceIntroFile = this.traceResObj.traceability_image || "";

      this.coopInfo.title = this.traceResObj.cooperative_title;
      this.coopInfo.description = this.traceResObj.cooperative_description;
      this.coopInfo.websiteLink = this.traceResObj.website_link;
      this.coopPreviewUrl = this.traceResObj.cooperative_image
        ? this.traceResObj.cooperative_image.location
        : "";
      this.coopFile = this.traceResObj.cooperative_image || "";

      this.additionalInfo.slogan = this.traceResObj.slogan;
      this.previewUrl = this.traceResObj.additional_logos[0].location;
      this.additionalFileArr = [...this.traceResObj.additional_logos];

      this.originInfo.title = this.traceResObj.origin_title;
      this.originInfo.description = this.traceResObj.origin_description;
      this.originInfo.mapLink = this.traceResObj.map_link;
      this.originPreviewUrl = this.traceResObj.origin_image
        ? this.traceResObj.origin_image.location
        : "";
      this.originFile = this.traceResObj.origin_image || "";
    },
    additionalOnChange(e) {
      var files = e.target.files || e.dataTransfer.files;

      const file = e.target.files[0];
      this.previewUrl = URL.createObjectURL(file);
      if (!files?.length) {
        this.dragging = false;
        return;
      }

      this.additionalCreateFile(files[0]);
    },
    additionalCreateFile(file) {
      this.additionalFileOne = file;
      if (this.additionalFileArr?.length >= 3) {
        this.addFileToRemove(
          this.additionalFileArr[this.additionalFileArr?.length - 1]
        );
        this.additionalFileArr.pop();
        this.additionalFileArr.push(this.additionalFileOne);
      } else {
        this.additionalFileArr.push(this.additionalFileOne);
      }
      this.dragging = false;
    },
    addFileToRemove(fileObj) {
      if (
        fileObj &&
        !(fileObj instanceof File) &&
        typeof fileObj === "object"
      ) {
        this.toRemove.push(fileObj);
      }
    },
    removeFile(index) {
      this.addFileToRemove(this.additionalFileArr[index]);
      this.additionalFileArr.splice(index, 1);
      this.previewUrl = this.additionalFileArr?.length
        ? this.additionalFileArr[0]
        : "";
      this.previewUrl = null;
    },
    removeOriginFile() {
      this.addFileToRemove(this.originFile);
      this.originPreviewUrl = "";
      this.originFile = "";
    },
    removeCoopFile() {
      this.addFileToRemove(this.coopFile);
      this.coopPreviewUrl = "";
      this.coopFile = "";
    },
    removeTraceFile() {
      this.addFileToRemove(this.traceIntroFile);
      this.traceIntroPreviewUrl = "";
      this.traceIntroFile = "";
    },
    onOriginChange(e) {
      var files = e.target.files || e.dataTransfer.files;

      const file = e.target.files[0];
      this.originPreviewUrl = URL.createObjectURL(file);
      if (!files?.length) {
        this.dragging = false;
        return;
      }
      this.addFileToRemove(this.originFile);
      this.originFile = file;
      this.dragging = false;
    },
    onCoopChange(e) {
      var files = e.target.files || e.dataTransfer.files;

      const file = e.target.files[0];
      this.coopPreviewUrl = URL.createObjectURL(file);
      if (!files?.length) {
        this.dragging = false;
        return;
      }
      this.addFileToRemove(this.coopFile);
      this.coopFile = file;
      this.dragging = false;
    },
    onTraceIntroChange(e) {
      var files = e.target.files || e.dataTransfer.files;

      const file = e.target.files[0];
      this.traceIntroPreviewUrl = URL.createObjectURL(file);
      if (!files?.length) {
        this.dragging = false;
        return;
      }
      this.addFileToRemove(this.traceIntroFile);
      this.traceIntroFile = file;
      this.dragging = false;
    },
    async onLabelChange(e, index) {
      var files = e.target.files || e.dataTransfer.files;

      const file = e.target.files[0];
      this.labelPreviewUrl[index] = URL.createObjectURL(file);
      if (!files?.length) {
        this.dragging = false;
        return;
      }
      if (this.enableLogoProcessing) {
        await this.handleImageProcessing(file, index);
        return;
      }
      this.labelFile = file;
      this.$set(this.labelPreviewUrl, index, URL.createObjectURL(file));
      this.labelFile[index] = file;
      this.dragging = false;
    },
    async getBase64FromImageUrl(url) {
      let that = this;
      var img = new Image();

      img.setAttribute("crossOrigin", "anonymous");

      let prom = new Promise((resolve, reject) => {
        img.onload = function () {
          var canvas = document.createElement("canvas");
          canvas.width = this.width;
          canvas.height = this.height;

          var ctx = canvas.getContext("2d");
          ctx.drawImage(this, 0, 0);

          canvas.toBlob((blob) => {
            const newUrl = URL.createObjectURL(blob);
            resolve(newUrl);
          });
        };
      });

      img.src = url;

      return prom;
    },
    async onTraceSubmit() {
      try {
        if (!this.isEdit) {
          if (this.$refs.mainForm.validate()) {
            this.startLoading();
            if (this.additionalFileArr?.length == 0) {
              this.$notify({
                title: "Please upload logo images",
                type: "error",
              });
              this.stopLoading();
              return;
            }
            if (!this.originFile) {
              this.$notify({
                title: "Please upload country image",
                type: "error",
              });
              this.stopLoading();
              return;
            }
            if (!this.coopFile) {
              this.$notify({
                title: "Please upload cooperative iamge",
                type: "error",
              });
              this.stopLoading();
              return;
            }
            if (!this.traceIntroFile) {
              this.$notify({
                title: "Please upload traceability image",
                type: "error",
              });
              this.stopLoading();
              return;
            }
            let formData = new FormData();
            // let imagefile = document.querySelector('#file');
            this.additionalFileArr.forEach((addFile) => {
              formData.append("additional_logos", addFile);
            });

            formData.append("origin_image", this.originFile);
            formData.append("cooperative_image", this.coopFile);
            formData.append("traceability_image", this.traceIntroFile);

            formData.append("slogan", this.additionalInfo.slogan);
            formData.append("origin_title", this.originInfo.title);
            formData.append("origin_description", this.originInfo.description);
            formData.append("map_link", this.originInfo.mapLink);
            formData.append("cooperative_title", this.coopInfo.title);
            formData.append(
              "cooperative_description",
              this.coopInfo.description
            );
            formData.append("website_link", this.coopInfo.websiteLink);
            formData.append("traceability_title", this.traceIntroInfo.title);
            formData.append(
              "traceability_description",
              this.traceIntroInfo.description
            );

            let postRes = await axios.post(
              "/crops-overview/traceability",
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );

            let traceRes = null;
            traceRes = await axios.get("/crops-overview/traceability");

            this.traceResObj = traceRes.data.data[0];
            this.stopLoading();

            this.$notify({
              title: "Successfully posted treaceability data!!",
              type: "success",
            });
          }
        } else {
          if (this.$refs.mainForm.validate()) {
            this.startLoading();

            if (this.additionalFileArr?.length == 0) {
              this.$notify({
                title: "Please upload logo images",
                type: "error",
              });
              this.stopLoading();
              return;
            }
            if (!this.originFile) {
              this.$notify({
                title: "Please upload country image",
                type: "error",
              });
              this.stopLoading();
              return;
            }
            if (!this.coopFile) {
              this.$notify({
                title: "Please upload cooperative iamge",
                type: "error",
              });
              this.stopLoading();
              return;
            }
            if (!this.traceIntroFile) {
              this.$notify({
                title: "Please upload traceability image",
                type: "error",
              });
              this.stopLoading();
              return;
            }

            let formData = new FormData();
            // let imagefile = document.querySelector('#file');
            this.additionalFileArr.forEach((addFile) => {
              if (addFile && addFile instanceof File) {
                formData.append("additional_logos", addFile);
              }
            });
            formData.append("logosToRemove", JSON.stringify(this.toRemove));
            if (this.originFile && this.originFile instanceof File) {
              formData.append("origin_image", this.originFile);
            }
            if (this.coopFile && this.coopFile instanceof File) {
              formData.append("cooperative_image", this.coopFile);
            }
            if (this.traceIntroFile && this.traceIntroFile instanceof File) {
              formData.append("traceability_image", this.traceIntroFile);
            }

            formData.append("id", this.traceResObj.id);
            formData.append("slogan", this.additionalInfo.slogan);
            formData.append("origin_title", this.originInfo.title);
            formData.append("origin_description", this.originInfo.description);
            formData.append("map_link", this.originInfo.mapLink);
            formData.append("cooperative_title", this.coopInfo.title);
            formData.append(
              "cooperative_description",
              this.coopInfo.description
            );
            formData.append("website_link", this.coopInfo.websiteLink);
            formData.append("traceability_title", this.traceIntroInfo.title);
            formData.append(
              "traceability_description",
              this.traceIntroInfo.description
            );

            let postRes = await axios.put(
              "/crops-overview/traceability",
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );

            let traceRes = null;
            traceRes = await axios.get("/crops-overview/traceability");

            this.traceResObj = traceRes.data.data[0];
            this.stopLoading();
            this.isEdit = false;
            this.previewUrl = "";
            this.$notify({
              title: "Successfully updated treaceability data!!",
              type: "success",
            });
          }
        }
        if (this.traceResObj) {
          const coordSubStr = this.traceResObj.map_link.substring(
            this.traceResObj.map_link.indexOf("@") + 1,
            this.traceResObj.map_link.lastIndexOf("z")
          );
          this.coordArr = coordSubStr.split(",");
        }
      } catch (error) {
        this.stopLoading();
        this.$notify({
          title: "Something went wrong!!",
          type: "error",
        });
      }
    },
    async onLabelSubmit(index) {
      this.disableLabelSubmit = true;
      this.startLoading();
      // Added sleep mode in order to take time to show loading screen as app might freeze on converting html 2 canvas
      await new Promise((resolve) => setTimeout(resolve, 100));
      try {
        let currentLabelObj = this.labelArr[this.labelTab];
        if (!this.labelArr[this.labelTab].title) {
          this.$notify({
            type: "error",
            title: "Label Title is required",
          });
          this.stopLoading();
          this.disableLabelSubmit = false;
          return;
        }
        if (currentLabelObj.isEdit) {
          let fileName = `label_${new Date().getTime()}.jpg`;
          let el = this.$refs.parentPreviewRef[this.labelTab];
          let canvasRes = await html2canvas(el, { scale: 2, useCORS: true });
          let testDataUrl = canvasRes.toDataURL("image/jpeg");
          let labelFile = this.dataURLtoFile(testDataUrl, fileName);

          let formData = new FormData();

          formData.append("logo", this.labelFile[index]);
          formData.append("label_preview", labelFile);

          formData.append("id", this.labelArr[this.labelTab].id);
          formData.append("title", this.labelArr[this.labelTab].title);
          formData.append(
            "label_format",
            this.labelArr[this.labelTab].formatRadioModel
          );
          formData.append(
            "background_color_code",
            this.labelArr[this.labelTab].bGcolor
          );
          formData.append(
            "text_color_code",
            this.labelArr[this.labelTab].fGcolor
          );
          formData.append(
            "is_active",
            this.labelArr[this.labelTab].labelStatus
          );

          let postRes = await axios.put(
            "/crops-overview/traceability-labels",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          this.$notify({
            title: "Successfully updated treaceability data!!",
            type: "success",
          });
        } else {
          if (!this.labelFile[index]) {
            this.$notify({
              type: "error",
              title: "Logo is required! Please upload an image and try again",
            });
            this.disableLabelSubmit = false;
            this.stopLoading();
            return;
          }
          let fileName = `label_${new Date().getTime()}.jpg`;
          let el = this.$refs.parentPreviewRef[this.labelTab];
          let canvasRes = await html2canvas(el, { scale: 2, useCORS: true });
          let testDataUrl = canvasRes.toDataURL("image/jpeg");
          let labelFile = this.dataURLtoFile(testDataUrl, fileName);

          let formData = new FormData();

          formData.append("logo", this.labelFile[index]);
          formData.append("label_preview", labelFile);

          formData.append("title", this.labelArr[this.labelTab].title);
          formData.append(
            "label_format",
            this.labelArr[this.labelTab].formatRadioModel
          );
          formData.append(
            "background_color_code",
            this.labelArr[this.labelTab].bGcolor
          );
          formData.append(
            "text_color_code",
            this.labelArr[this.labelTab].fGcolor
          );
          formData.append(
            "is_active",
            this.labelArr[this.labelTab].labelStatus
          );

          const { data } = await axios.post(
            "/crops-overview/traceability-labels",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          this.labelArr[index].isEdit = true;
          this.labelArr[index].id = data.data.id;
          this.$notify({
            title: "Successfully posted treaceability data!!",
            type: "success",
          });
        }

        this.stopLoading();
        this.disableLabelSubmit = false;
      } catch (error) {
        console.log(error, "errpor");
        this.stopLoading();
        this.disableLabelSubmit = false;
        this.$notify({
          title: "Something went wrong!!",
          type: "error",
        });
      }
    },
    async onLabelDelete(labelIdx) {
      try {
        const label = this.labelArr[labelIdx];
        const labelId = label?.id;
        if (labelId) {
          this.disableLabelSubmit = true;
          this.startLoading();
          const { data } = await axios.delete(
            `/crops-overview/traceability-labels/${labelId}`
          );
          if (data.success) {
            this.labelArr.splice(labelIdx, 1);
          }
          this.stopLoading();
          this.disableLabelSubmit = false;
          this.$notify({
            title: data.message,
            type: data.success ? "success" : "error",
          });
        } else {
          this.labelArr.splice(labelIdx, 1);
        }
      } catch (error) {
        console.error(error, "Labels Delete Error");
        this.stopLoading();
        this.disableLabelSubmit = false;
        this.$notify({
          title: "Something went wrong!!",
          type: "error",
        });
      }
    },
  },
  computed: {
    swatchStyleBg() {
      const { bGcolor, bGmenu } = this;
      return {
        backgroundColor: bGcolor,
        cursor: "pointer",
        height: "30px",
        width: "30px",
        borderRadius: bGmenu ? "50%" : "4px",
        transition: "border-radius 200ms ease-in-out",
      };
    },
    swatchStyleFg() {
      const { fGcolor, fGmenu } = this;
      return {
        backgroundColor: fGcolor,
        cursor: "pointer",
        height: "30px",
        width: "30px",
        borderRadius: fGmenu ? "50%" : "4px",
        transition: "border-radius 200ms ease-in-out",
      };
    },
    showDisplay() {
      if (
        this.page == "trace" &&
        ((this.traceResObj && Object.keys(this.traceResObj)?.length > 0) ||
          this.traceResObj)
      ) {
        return true;
      } else {
        return false;
      }
    },
    showCreateForm: {
      get() {
        if (
          this.page == "trace" &&
          ((this.traceResObj && Object.keys(this.traceResObj)?.length == 0) ||
            !this.traceResObj)
        ) {
          return true;
        } else {
          return false;
        }
      },
      set(newValue) {
        return newValue;
      },
    },
    google: gmapApi,
    additionalPrevUrlOne() {
      if (this.additionalFileArr?.length > 0) {
        return this.additionalFileArr[0] && this.additionalFileArr[0].location
          ? this.additionalFileArr[0].location
          : URL.createObjectURL(this.additionalFileArr[0]);
      } else {
        return "";
      }
    },
    additionalPrevUrlTwo() {
      if (this.additionalFileArr?.length > 1) {
        return this.additionalFileArr[1] && this.additionalFileArr[1].location
          ? this.additionalFileArr[1].location
          : URL.createObjectURL(this.additionalFileArr[1]);
      } else {
        return "";
      }
    },
    additionalPrevUrlThree() {
      if (this.additionalFileArr?.length > 2) {
        return this.additionalFileArr[2] && this.additionalFileArr[2].location
          ? this.additionalFileArr[2].location
          : URL.createObjectURL(this.additionalFileArr[2]);
      } else {
        return "";
      }
    },
  },
  async mounted() {
    this.startLoading();
    let formatArrRes = {};
    formatArrRes = await axios.get(
      "/crops-overview/traceability-labels/format"
    );
    this.formatArr = formatArrRes.data.data.map((item) => {
      let tmpObj;
      tmpObj = JSON.stringify(item);
      return JSON.parse(tmpObj);
    });

    if (this.page == "trace") {
      let coordSubStr = "";

      let traceRes = null;
      traceRes = await axios.get("/crops-overview/traceability");

      this.traceResObj = traceRes.data.data[0];

      if (this.traceResObj) {
        coordSubStr = this.traceResObj.map_link.substring(
          this.traceResObj.map_link.indexOf("@") + 1,
          this.traceResObj.map_link.lastIndexOf("z")
        );
        this.coordArr = coordSubStr.split(",");
      }
      this.stopLoading();
    }
    this.stopLoading();
  },
  mixins: [loadingMixin],
};
</script>
<style lang="scss" scoped>
.remove-btn {
  position: absolute;
  top: 0;
  right: 0;
}
.information-img {
  width: 200px; /* Set width for circular image */
  height: 200px; /* Ensure the height matches the width for a circle */
  clip-path: circle(); /* Make the image circular */
  object-fit: cover; /* Cover the area while maintaining aspect ratio */
  border-radius: 50%; /* Ensure circular shape across all browsers */
}

.circular-img {
  clip-path: circle();
  object-fit: cover; /* Fill the circle while maintaining aspect ratio */
  width: 200px;
  height: 200px;
  border-radius: 50%; /* Ensures a circular shape in all browsers */
}
.trace-slogan {
  padding-left: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
div.parentPreview {
  margin-left: 20%;
  position: relative;
  width: 400px;
  height: 500px;
  border: 2px solid rgb(121, 121, 121);
  border-radius: 2%;
}

div.bgPreview {
  position: absolute;
  top: 0;
  left: 16%;
  // border: 3px solid blue;
}

div.fgPreview {
  position: absolute;
  top: 0%;
  left: 16%;
  // border: 3px solid green;
  z-index: 4;
}

div.smallPreviewParent {
  margin-left: 20%;
  position: relative;
  width: 100px;
  height: 200px;
}
div.smallFg-0 {
  position: absolute;
  top: 0%;
  left: -82%;
  // border: 3px solid green;
  z-index: 4;
}
div.smallBg-0 {
  position: absolute;
  top: 0;
  left: -82%;
  // border: 3px solid blue;
}
div.smallFg-1 {
  position: absolute;
  top: 7%;
  left: -14%;
  z-index: 4;
}
div.smallBg-1 {
  position: absolute;
  top: 0;
  left: -35%;
  // border: 3px solid blue;
}

div.logoPreview {
  top: 17%;
  left: 35%;
  position: absolute;
  z-index: 999;
}
::v-deep .phone-drop .v-input__slot {
  padding-right: 0px !important;
}

.dropZone {
  width: 100%;
  height: 150px;
  position: relative;
  border: 2px dashed #97a8b8;
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

.removeFile {
  width: 200px;
}

.vertical-center {
  margin: 0;
  position: absolute;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}

.flex-direction-box {
  height: 30em;
  max-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn {
  text-transform: unset !important;
}

::v-deep .v-select.v-text-field:not(.v-text-field--single-line) input {
  margin-top: -10in;
}

p {
  display: -webkit-box;
  // max-width: 400px;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

h1 {
  display: -webkit-box;
  max-width: 400px;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
