<template>
  <div>
    <v-container>
      <template>
        <div>
          <v-dialog
            v-model="dialog"
            width="1200px"
            persistent
            :retain-focus="false"
          >
            <v-card class="custom-card" rounded="0">
              <v-toolbar color="primary" class="white--text">
                <v-toolbar-title class="font-weight-bold">
                  {{
                    isEdit
                      ? "Edit Assessment Question"
                      : "Add Assessment Question"
                  }}
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon class="white--text" @click="closeModal">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-toolbar>
              <v-form class="question" lazy-validation autocomplete="off">
                <v-card-text class="black--text">
                  <v-row class="my-4">
                    <v-col class="right-border-col" cols="2">
                      <h3 class="mb-4">Score</h3>
                      <v-row>
                        <v-col>{{ question.scoreEnabled ? "Enabled": "Disabled" }}</v-col>
                        <v-col>
                          <v-switch inset class="bottomless pt-0 mt-0"
                            v-model="question.scoreEnabled"
                          ></v-switch>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col class="right-border-col pl-8" cols="2">
                      <h3 class="mb-4">Mandatory</h3>
                      <v-row>
                        <v-col>{{ question.isMandatory ? "Yes": "No" }}</v-col>
                        <v-col>
                          <v-switch inset class="bottomless pt-0 mt-0"
                            v-model="question.isMandatory"
                          ></v-switch>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col class="pl-8" cols="4">
                      <div class="mb-2">
                        <span class="h3 mr-1">Who will answer this question?</span>
                        <v-tooltip top color="00BD73" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                              <v-icon size="medium" class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                              mdi-alert-circle
                              </v-icon>
                          </template>
                          <span>Who will answer this question.</span>
                        </v-tooltip>
                      </div>
                      <v-select
                        class="answerer-select"
                        :items="answerers"
                        v-model="question.answerer"
                        dense
                        outlined
                        clearable
                      >
                      </v-select>
                    </v-col>
                    <!-- <v-col class="pl-8" cols="4" v-if="question.answerer === 'Supplier'">
                      <div class="mb-2">
                        <span class="h3 mr-1">Supplier Service Type</span>
                        <v-tooltip top color="00BD73" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                              <v-icon size="medium" class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                              mdi-alert-circle
                              </v-icon>
                          </template>
                          <span>Supplier Service Type</span>
                        </v-tooltip>
                      </div>
                      <v-select
                        class="answerer-select"
                        :items="answerers"
                        v-model="question.answerer"
                        dense
                        outlined
                        clearable
                      >
                      </v-select>
                    </v-col> -->
                  </v-row>
                  <v-row class="my-4">
                    <v-col cols="4">
                      <div class="mb-2">
                        <span class="h3 mr-1">Heading</span>
                        <v-tooltip top color="00BD73" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon size="medium" class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                              mdi-alert-circle
                            </v-icon>
                          </template>
                          <span>Select a heading for the question</span>
                        </v-tooltip>
                      </div>
                      <v-select
                        :items="headings"
                        v-model="question.esgHeadingId"
                        item-value="_id"
                        item-text="title"
                        dense
                        outlined
                        clearable
                      >
                      </v-select>
                    </v-col>
                    <v-col cols="4">
                      <div class="mb-2">
                        <span class="h3 mr-1">Question Type</span>
                        <v-tooltip top color="00BD73" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                              <v-icon size="medium" class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                              mdi-alert-circle
                              </v-icon>
                          </template>
                          <span>Type of question</span>
                        </v-tooltip>
                      </div>
                      <v-select
                        :items="questionTypes"
                        v-model="question.questionType"
                        item-text="label"
                        item-value="value"
                        dense
                        outlined
                        clearable
                      >
                      </v-select>
                    </v-col>
                    <v-col cols="4">
                    </v-col>
                  </v-row>

                  <div v-if="!isOptionType()">
                    <v-col cols="12" class="px-0">
                      <div class="mb-2">
                        <span class="h3 mr-1">Title</span>
                        <v-tooltip top color="00BD73" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                              <v-icon size="medium" class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                              mdi-alert-circle
                              </v-icon>
                          </template>
                          <span>Title of the question</span>
                        </v-tooltip>
                      </div>
                      <v-text-field
                        v-model="question.title"
                        placeholder="Enter here"
                        outlined
                        dense
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" class="px-0" v-if="hasQuestionLevelScore">
                      <div class="mb-2">
                        <span class="h3 mr-1">Score</span>
                      </div>
                      <v-text-field
                        v-model="question.score"
                        outlined
                        dense
                        type="number"
                        min="0"
                        step="0.01"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" class="px-0" v-if="question.questionType === 'get-data'">
                      <v-card elevation="0" class="gray lighten-4 my-4 px-4 py-4">
                        <v-card elevation="0" class="white">
                          <v-card-text>
                              <v-row>
                                <v-col cols="9">
                                  <h3>Actions</h3>
                                  <v-row>
                                    <v-col>
                                      <v-checkbox
                                        v-model="question.getData.flags.getData"
                                        label="Get Data"
                                      ></v-checkbox>
                                    </v-col>
                                    <!-- <v-col>
                                      <v-checkbox
                                        v-model="question.getData.flags.dimitraModules"
                                        label="Dimitra Modules"
                                      ></v-checkbox>
                                    </v-col> -->
                                    <v-col></v-col>
                                  </v-row>
                                </v-col>
                                <v-col class="content-col" cols="3">
                                  <v-row>
                                    <v-col cols="5" class="content-col"><h3>Condition</h3></v-col>
                                    <v-col cols="7">
                                      <v-select
                                        :items="conditions"
                                        v-model="question.getData.condition"
                                        dense
                                        outlined
                                        clearable
                                      >
                                      </v-select>
                                    </v-col>
                                  </v-row>
                                </v-col>
                              </v-row>
                              
                              <section v-if="question.getData.flags.getData">
                                <hr class="seperator" />
                                <v-row>
                                  <v-col class="content-col" cols="8">
                                    <h4>Get Data</h4>
                                  </v-col>
                                  <v-col cols="4">
                                    <v-row>
                                      <v-col class="content-col" cols="2">Score</v-col>
                                      <v-col cols="3">
                                        <v-text-field
                                          class="bottomless"
                                          v-model="question.getData.getData.score"
                                          outlined
                                          dense
                                        ></v-text-field>
                                      </v-col>
                                      <v-col cols="5">
                                        <v-btn
                                          right
                                          color="primary"
                                          @click="showDatafieldModal(question.getData)"
                                        >
                                          <v-icon
                                            left
                                            dark
                                          >
                                            mdi-database-plus
                                          </v-icon>
                                          Add Data Field
                                        </v-btn>
                                      </v-col>
                                      <v-col cols="2">
                                        <v-btn x-small fab color="primary" class="ml-2" @click="openGetDataPreview(question.getData)">
                                          <v-icon>mdi-eye-outline</v-icon>
                                        </v-btn>
                                      </v-col>
                                    </v-row>
                                  </v-col>
                                </v-row>

                                <v-card elevation="0" class="options dark mt-4 mb-5">
                                  <v-card-title>
                                    <v-row>
                                      <v-col class="py-2" cols="4">Data Field</v-col>
                                      <v-col class="py-2" cols="4">Type</v-col>
                                      <v-col class="py-2" cols="3">Mandatory</v-col>
                                      <v-col class="py-2" cols="1"></v-col>
                                    </v-row>
                                  </v-card-title>
                                </v-card>

                                <v-card elevation="0" outlined class="my-4 px-4 py-4" v-for="(field, i) in question.getData.getData.dataFields" v-bind:key="i">
                                  <v-row>
                                    <v-col class="py-2 content-col" cols="4">{{ field.title }}</v-col>
                                    <v-col class="py-2 text-capitalize content-col" cols="4">{{ typeToTitle(field.dataType) }}</v-col>
                                    <v-col class="py-2 content-col" cols="2">
                                      <v-row>
                                        <v-col cols="4">{{ field.isMandatory ? "Yes": "No" }}</v-col>
                                        <v-col cols="8">
                                          <v-switch inset class="bottomless pt-0 mt-0"
                                            v-model="field.isMandatory"
                                          ></v-switch>
                                        </v-col>
                                      </v-row>
                                    </v-col>
                                    <v-col class="py-2 content-col" cols="2">
                                      <v-btn x-small fab color="primary" class="ml-2" @click="editDataField(field, null)">
                                        <v-icon>mdi-pencil</v-icon>
                                      </v-btn>
                                      <v-btn x-small fab color="white" style="color:#000" class="ml-2" @click="removeDataField(field._id, true)">
                                        <v-icon>mdi-delete</v-icon>
                                      </v-btn>
                                    </v-col>
                                  </v-row>
                                </v-card>
                              </section>

                              <!-- <section v-if="question.getData.flags.dimitraModules">
                                <hr class="seperator" />
                                <v-row>
                                  <v-col class="content-col" cols="10">
                                    <h4>Dimtira Modules</h4>
                                  </v-col>
                                  <v-col cols="2">
                                    <v-row>
                                      <v-col class="content-col">Score</v-col>
                                      <v-col>
                                        <v-text-field
                                          class="bottomless"
                                          v-model="question.getData.dimitraModules.score"
                                          outlined
                                          dense
                                        ></v-text-field>
                                      </v-col>
                                    </v-row>
                                  </v-col>
                                </v-row>

                                <div class="mb-2">
                                  <label for="modules">Select a Module</label>
                                  <v-tooltip top color="00BD73" max-width="350">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon size="medium" class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                        mdi-alert-circle
                                        </v-icon>
                                    </template>
                                    <span>Select a Module</span>
                                  </v-tooltip>
                                </div>
                                <v-select
                                  class="answerer-select mb-4"
                                  :items="modules"
                                  v-model="question.getData.dimitraModules.selectedModule"
                                  item-value="name"
                                  item-text="name"
                                  @change="renewPermissions(question.getData)"
                                  dense
                                  outlined
                                  clearable
                                >
                                </v-select>

                                <v-checkbox
                                  class="mt-0 bottomless"
                                  v-model="question.getData.dimitraModules.selectedPermissions[ip].allowed"
                                  :label="m.permission"
                                  v-for="(m, ip) in question.getData.dimitraModules.selectedPermissions"
                                  v-bind:key="ip"
                                ></v-checkbox>
                              </section> -->
                            </v-card-text>
                        </v-card>
                      </v-card>
                    </v-col>

                    <!-- File Attachment Specific fields -->
                    <v-col cols="12" class="px-0" v-if="question.questionType === 'attach-files'">
                      <v-row class="mx-0 px-0">
                        <v-col class="px-0" cols="12">
                          <label>File Type</label>
                          <v-select
                            :items="fileTypes"
                            item-text="title"
                            item-value="field"
                            v-model="question.allowedFileTypes"
                            dense
                            outlined
                            multiple
                          >
                          </v-select>
                        </v-col>
                        <v-col class="px-0" cols="3">
                          <v-checkbox
                            v-model="question.allowMultipleAttachments"
                            label="Allow Multiple Attachments"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="3" class="px-0">
                          <v-checkbox
                            v-model="question.allowComments"
                            label="Allow Comments"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="6"></v-col>
                      </v-row>
                    </v-col>
                    <!-- File Attachment Specific Fields End -->

                    <!-- Digital Signature Specific Fields -->
                    <v-col cols="12" v-if="question.questionType === 'digital-signature'">
                      <v-row>
                        <v-col class="px-0" cols="2">
                          <v-checkbox
                            v-model="question.uploadSignatureFile"
                            label="Upload Signature File"
                          ></v-checkbox>
                        </v-col>
                        <v-col class="px-0" cols="2">
                          <v-checkbox
                            v-model="question.drawSignature"
                            label="Draw Signature"
                          ></v-checkbox>
                        </v-col>
                        <v-col class="px-0" cols="8"></v-col>
                      </v-row>
                    </v-col>
                  </div>

                  <v-col cols="12" class="px-0">
                      <div class="mb-2">
                        <span class="h3 mr-1">Description</span>
                        <v-tooltip top color="00BD73" max-width="350">
                          <template v-slot:activator="{ on, attrs }">
                              <v-icon size="medium" class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                              mdi-alert-circle
                              </v-icon>
                          </template>
                          <span>Brief description of the question</span>
                        </v-tooltip>
                      </div>
                      <!-- <v-textarea
                        v-model="question.description"
                        rows="5"
                        placeholder="Enter here"
                        outlined
                      >
                      </v-textarea> -->
                      <v-card outlined class="mb-5">
                        <quill-editor
                          v-model="question.description"
                          ref="quillEditor"
                          :options="quillOptions('Enter here')"
                        />
                      </v-card>
                    </v-col>
                    
                  <div v-if="isOptionType()">
                    <v-row>
                      <v-col cols="12">
                        <div class="mb-2">
                          <span class="h3 mr-1">Question</span>
                          <v-tooltip top color="00BD73" max-width="350">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon size="medium" class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                mdi-alert-circle
                                </v-icon>
                            </template>
                            <span>Title of the question</span>
                          </v-tooltip>
                        </div>
                        <v-text-field
                          v-model="question.title"
                          outlined
                          dense
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="6">
                        <div class="mb-2">
                          <span class="h3 mr-1">Add Option</span>
                          <v-tooltip top color="00BD73" max-width="350">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon size="medium" class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                mdi-alert-circle
                                </v-icon>
                            </template>
                            <span>Add a new option to the list</span>
                          </v-tooltip>
                        </div>
                        <v-row>
                          <v-col class="pb-0" cols="8">
                            <v-text-field
                              class="bottomless"
                              v-model="newOption"
                              @keyup.enter="addOption"
                              outlined
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col class="pb-0" cols="4">
                            <v-btn
                              right
                              color="primary"
                              @click="addOption"
                            >
                              Add
                            </v-btn>
                          </v-col>
                          <v-col class="pt-0" cols="12">
                            <small class="text--disabled">Press Enter to add an option or click on Add</small>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>

                    <!-- Options section -->
                    <v-card elevation="0" class="options mb-5">
                      <v-card-title>
                        <v-row>
                          <v-col class="py-2" cols="8">Options</v-col>
                          <v-col class="py-2" cols="4">Actions</v-col>
                        </v-row>
                      </v-card-title>
                    </v-card>

                    <v-card elevation="0" class="option mb-5" v-for="(option, i) in question.options" v-bind:key="i">
                      <v-row>
                        <v-col cols="8">
                          <v-row>
                            <v-col cols="1">
                              <v-col class="py-0">
                                <div>
                                  <v-icon>mdi-chevron-up</v-icon>
                                </div>
                              </v-col>
                              <v-col class="py-0">
                                <div>
                                  <v-icon>mdi-chevron-down</v-icon>
                                </div>
                              </v-col>
                            </v-col>
                            <v-col class="py-4" cols="11">
                              <div class="content-col right-border-col w-100">
                                {{ option.title }}
                              </div>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="4">
                          <v-row>
                            <v-col cols="4">
                              <v-row>
                                <v-col class="content-col" cols="5">Score</v-col>
                                <v-col cols="7">
                                  <v-text-field
                                    class="bottomless"
                                    v-model="option.score"
                                    outlined
                                    dense
                                  ></v-text-field>
                                </v-col>
                              </v-row>
                            </v-col>
                            <v-col class="content-col pl-5 pr-0" cols="4">
                              <v-row class="clickable" @click="expandOption(option)">
                                <v-col cols="8" class="px-0 py-0">{{ getActionName(option) }}</v-col>
                                <v-col cols="4" class="px-0 py-0"><v-icon color="primary">{{ getActionChevron(option) }}</v-icon></v-col>
                              </v-row>
                            </v-col>
                            <!-- <v-col class="content-col" cols="4">
                              <v-btn x-small fab color="primary" outlined class="ml-2" @click="editAction(option)">
                                <v-icon>mdi-pencil</v-icon>
                              </v-btn>
                              <v-btn x-small fab color="primary" outlined class="ml-2" @click="removeAction(option)">
                                <v-icon>mdi-delete</v-icon>
                              </v-btn>
                            </v-col> -->
                          </v-row>
                        </v-col>
                        <v-col cols="12" v-if="option.expanded">
                          <v-card elevation="0" class="expandable mx-4">
                            <v-card-text>
                              <v-row>
                                <v-col cols="9">
                                  <h3>Actions</h3>
                                  <v-row>
                                    <v-col>
                                      <v-checkbox
                                        v-model="option.flags.recommendations"
                                        label="Recommenations"
                                      ></v-checkbox>
                                    </v-col>
                                    <v-col>
                                      <v-checkbox
                                        v-model="option.flags.getData"
                                        label="Get Data"
                                      ></v-checkbox>
                                    </v-col>
                                    <v-col>
                                      <v-checkbox
                                        v-model="option.flags.actionPlan"
                                        label="Action Plan"
                                      ></v-checkbox>
                                    </v-col>
                                    <!-- <v-col>
                                      <v-checkbox
                                        v-model="option.flags.dimitraModules"
                                        label="Dimitra Modules"
                                      ></v-checkbox>
                                    </v-col> -->
                                    <v-col></v-col>
                                  </v-row>
                                </v-col>
                                <v-col class="content-col" cols="3">
                                  <v-row>
                                    <v-col cols="5" class="content-col"><h3>Condition</h3></v-col>
                                    <v-col cols="7">
                                      <v-select
                                        :items="conditions"
                                        v-model="option.condition"
                                        dense
                                        outlined
                                        clearable
                                        @change="handleConditionChange(option)"
                                      >
                                      </v-select>
                                    </v-col>
                                  </v-row>
                                </v-col>
                              </v-row>
                              <section v-if="option.flags.recommendations">
                                <hr class="seperator" />
                                <h4 class="mb-4">Recommenations</h4>
                                <v-textarea
                                  class="text--small"
                                  v-model="option.recommendations"
                                  rows="5"
                                  placeholder="Enter your recommendations here"
                                  outlined
                                ></v-textarea>
                              </section>
                              <section v-if="option.flags.getData">
                                <hr class="seperator" />
                                <v-row>
                                  <v-col class="content-col" cols="8">
                                    <h4>Get Data</h4>
                                  </v-col>
                                  <v-col cols="4">
                                    <v-row>
                                      <v-col class="content-col" cols="2">Score</v-col>
                                      <v-col cols="3">
                                        <v-text-field
                                          class="bottomless"
                                          v-model="option.getData.score"
                                          outlined
                                          dense
                                        ></v-text-field>
                                      </v-col>
                                      <v-col cols="5">
                                        <v-btn
                                          right
                                          color="primary"
                                          @click="showDatafieldModal(option)"
                                        >
                                          <v-icon
                                            left
                                            dark
                                          >
                                            mdi-database-plus
                                          </v-icon>
                                          Add Data Field
                                        </v-btn>
                                      </v-col>
                                      <v-col cols="2">
                                        <v-btn x-small fab color="primary" class="ml-2" @click="openGetDataPreview(option)">
                                          <v-icon>mdi-eye-outline</v-icon>
                                        </v-btn>
                                      </v-col>
                                    </v-row>
                                  </v-col>
                                </v-row>

                                <v-card elevation="0" class="options dark mt-4 mb-5">
                                  <v-card-title>
                                    <v-row>
                                      <v-col class="py-2" cols="4">Data Field</v-col>
                                      <v-col class="py-2" cols="4">Type</v-col>
                                      <v-col class="py-2" cols="3">Mandatory</v-col>
                                      <v-col class="py-2" cols="1"></v-col>
                                    </v-row>
                                  </v-card-title>
                                </v-card>

                                <v-card elevation="0" outlined class="my-4 px-4 py-4" v-for="(field, i) in option.getData.dataFields" v-bind:key="i">
                                  <v-row>
                                    <v-col class="py-2 content-col" cols="4">{{ field.title }}</v-col>
                                    <v-col class="py-2 text-capitalize content-col" cols="4">{{ typeToTitle(field.dataType) }}</v-col>
                                    <v-col class="py-2 content-col" cols="2">
                                      <v-row>
                                        <v-col cols="4">{{ field.isMandatory ? "Yes": "No" }}</v-col>
                                        <v-col cols="8">
                                          <v-switch inset class="bottomless pt-0 mt-0"
                                            v-model="field.isMandatory"
                                          ></v-switch>
                                        </v-col>
                                      </v-row>
                                    </v-col>
                                    <v-col class="py-2 content-col" cols="2">
                                      <v-btn x-small fab color="primary" class="ml-2" @click="editDataField(field, option._id)">
                                        <v-icon>mdi-pencil</v-icon>
                                      </v-btn>
                                      <v-btn x-small fab color="white" style="color:#000" class="ml-2" @click="removeDataField(field._id)">
                                        <v-icon>mdi-delete</v-icon>
                                      </v-btn>
                                    </v-col>
                                  </v-row>
                                </v-card>
                              </section>

                              <section v-if="option.flags.actionPlan">
                                <hr class="seperator" />
                                <v-row>
                                  <v-col class="content-col" cols="10">
                                    <h4>Action Plan</h4>
                                  </v-col>
                                  <v-col cols="2">
                                    <v-row>
                                      <v-col class="content-col">Score</v-col>
                                      <v-col>
                                        <v-text-field
                                          class="bottomless"
                                          v-model="option.actionPlan.score"
                                          outlined
                                          dense
                                        ></v-text-field>
                                      </v-col>
                                    </v-row>
                                  </v-col>
                                </v-row>

                                <v-card elevation="0" class="gray lighten-4 my-4 px-4 py-4" v-for="(item, ii) in option.actionPlan.items" v-bind:key="ii">
                                  <v-row>
                                    <v-col class="content-col right-border-col py-0 my-3" cols="9">{{ item.item }}</v-col>
                                    <v-col class="text-capitalize content-col py-0 my-3" cols="3">
                                      <v-checkbox
                                        v-model="item.requireFile"
                                        label="Require File Attachment"
                                        @change="updateActionPlan(option, item)"
                                      ></v-checkbox>
                                    </v-col>
                                  </v-row>
                                </v-card>

                                <v-row class="mb-4">
                                  <v-col class="pb-0" cols="8">
                                    <v-text-field
                                      class="bottomless"
                                      v-model="newActionPlan"
                                      @keyup.enter="addAction(option)"
                                      outlined
                                      dense
                                    ></v-text-field>
                                  </v-col>
                                  <v-col class="pb-0" cols="4">
                                    <v-btn
                                      right
                                      color="primary"
                                      @click="addAction(option)"
                                    >
                                      Add
                                    </v-btn>
                                  </v-col>
                                </v-row>
                              </section>

                              <!-- <section v-if="option.flags.dimitraModules">
                                <hr class="seperator" />
                                <v-row>
                                  <v-col class="content-col" cols="10">
                                    <h4>Dimtira Modules</h4>
                                  </v-col>
                                  <v-col cols="2">
                                    <v-row>
                                      <v-col class="content-col">Score</v-col>
                                      <v-col>
                                        <v-text-field
                                          class="bottomless"
                                          v-model="option.dimitraModules.score"
                                          outlined
                                          dense
                                        ></v-text-field>
                                      </v-col>
                                    </v-row>
                                  </v-col>
                                </v-row>

                                <div class="mb-2">
                                  <label for="modules">Select a Module</label>
                                  <v-tooltip top color="00BD73" max-width="350">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon size="medium" class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                        mdi-alert-circle
                                        </v-icon>
                                    </template>
                                    <span>Select a Module</span>
                                  </v-tooltip>
                                </div>
                                <v-select
                                  class="answerer-select mb-4"
                                  :items="modules"
                                  v-model="option.dimitraModules.selectedModule"
                                  item-value="name"
                                  item-text="name"
                                  @change="renewPermissions(option)"
                                  dense
                                  outlined
                                  clearable
                                >
                                </v-select>

                                <v-checkbox
                                  class="mt-0 bottomless"
                                  v-model="option.dimitraModules.selectedPermissions[ip].allowed"
                                  :label="m.permission"
                                  v-for="(m, ip) in option.dimitraModules.selectedPermissions"
                                  v-bind:key="ip"
                                ></v-checkbox>
                              </section> -->
                            </v-card-text>
                          </v-card>
                        </v-col>
                      </v-row>
                    </v-card>
                    <!-- Option Section End -->
                  </div>

                  <section class="repeat pt-5">
                    <v-row>
                      <v-col cols="4">
                        <div class="mb-2">
                          <span class="h3 mr-1">Repeat Periodically (Optional)</span>
                          <v-tooltip top color="00BD73" max-width="350">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon size="medium" class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                mdi-alert-circle
                                </v-icon>
                            </template>
                            <span>Repeat Periodically (Optional).</span>
                          </v-tooltip>
                        </div>
                      </v-col>
                      <v-col cols="2">
                        <v-row>
                          <v-col>{{ question.repeat.enabled ? "Enabled": "Disabled" }}</v-col>
                          <v-col>
                            <v-switch inset class="bottomless pt-0 mt-0"
                              v-model="question.repeat.enabled"
                            ></v-switch>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>

                    <v-radio-group
                      v-model="question.repeat.type"
                      @change="clearSelectedDates"
                      row
                    >
                      <v-radio
                        v-for="(type, it) in repeatTypes"
                        :key="it"
                        :label="type.label"
                        :value="type.value"
                      ></v-radio>
                    </v-radio-group>

                    <div v-if="question.repeat.type === 'Custom'">
                      <v-dialog
                        ref="cdialog"
                        v-model="dateModalCustom"
                        :return-value.sync="selectedCustomDate"
                        persistent
                        width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            class="answerer-select"
                            v-model="selectedCustomDate"
                            label="Select Date"
                            prepend-inner-icon="mdi-calendar"
                            outlined
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="selectedCustomDate"
                          scrollable
                        >
                          <v-spacer></v-spacer>
                          <v-btn
                            text
                            color="primary"
                            @click="dateModalCustom = false"
                          >
                            Cancel
                          </v-btn>
                          <v-btn
                            text
                            color="primary"
                            @click="saveCustomDate(selectedCustomDate)"
                          >
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-dialog>

                      <v-card elevation="0" width="450px" class="gray lighten-4 my-4 px-4 py-4">
                        <div class="mb-2">
                          <span class="h4 mr-1">Repetition Dates</span>
                          <v-tooltip top color="00BD73" max-width="350">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon size="medium" class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                mdi-alert-circle
                                </v-icon>
                            </template>
                            <span>Dates in which the question is repeated.</span>
                          </v-tooltip>
                        </div>
                        
                        <v-row class="mt-0" v-for="(date, id) in question.repeat.selectedDates" :key="id">
                          <v-col class="content-col" cols="10">
                            {{ date }}
                          </v-col>
                          <v-col cols="2">
                            <v-btn class="mx-1" fab x-small color="black"
                              @click="deleteCustomDate(id)">
                              <v-icon color="white"> mdi-close </v-icon>
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-card>
                    </div>
                    <div v-if="question.repeat.type === 'Fixed'">
                      <v-row>
                        <v-col class="content-col" cols="2">Repeats Every</v-col>
                        <v-col cols="3">
                          <v-select
                            :items="fixedRepeatTypes"
                            v-model="question.repeat.fixedRepeatType"
                            dense
                            outlined
                            clearable
                          >
                          </v-select>
                        </v-col>
                      </v-row>
                      <v-row class="mb-4">
                        <v-col class="content-col" cols="2">Repetitions</v-col>
                        <v-col cols="3">
                          <v-text-field
                            type="number"
                            v-model="question.repeat.fixedRepetitions"
                            outlined
                            dense
                          >
                          </v-text-field>
                        </v-col>
                      </v-row>

                      <label for="fdialog">Select Start Date</label>
                      <v-dialog
                        ref="fdialog"
                        v-model="dateModalFixed"
                        :return-value.sync="selectedStartDate"
                        persistent
                        width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            class="answerer-select mt-2"
                            v-model="selectedStartDate"
                            label="Select Date"
                            prepend-inner-icon="mdi-calendar"
                            outlined
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="selectedStartDate"
                          scrollable
                        >
                          <v-spacer></v-spacer>
                          <v-btn
                            text
                            color="primary"
                            @click="dateModalFixed = false"
                          >
                            Cancel
                          </v-btn>
                          <v-btn
                            text
                            color="primary"
                            @click="saveStartDate(selectedStartDate)"
                          >
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-dialog>
                      <v-card elevation="0" width="450px" class="gray lighten-4 my-4 px-4 py-4">
                        <div class="mb-2">
                          <span class="h4 mr-1">Repetition Dates</span>
                          <v-tooltip top color="00BD73" max-width="350">
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon size="medium" class="icon-with-background" style="color:#0EBF67" v-bind="attrs" v-on="on">
                                mdi-alert-circle
                                </v-icon>
                            </template>
                            <span>Dates in which the question is repeated.</span>
                          </v-tooltip>
                        </div>
                        
                        <v-row class="mt-0" v-for="(date, id) in question.repeat.selectedDates" :key="id">
                          <v-col class="content-col" cols="12">
                            {{ date }}
                          </v-col>
                        </v-row>
                      </v-card>
                    </div>
                  </section>

                  <!-- End Buttons -->
                  <section class="question-footer">
                    <v-btn
                      right
                      outlined
                      color="primary"
                      @click="closeModal"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      right
                      color="primary"
                      @click="openPreview"
                    >
                      Preview
                    </v-btn>
                    <v-btn
                      right
                      color="primary"
                      @click="saveQuestion"
                    >
                      Submit
                    </v-btn>
                  </section>
                </v-card-text>
              </v-form>
            </v-card>
          </v-dialog>
        </div>
      </template>
    </v-container>
    <DataField 
      @closeDialog="datafieldModal = false"
      @addDatafield="addDataField"
      :dialogI="datafieldModal" 
      :isEdit="dataFieldEdit"
      :selectedDataField="selectedDataField"
      :isAssessmentEditMode="isAssessmentEditMode"
    />
    <Preview :questions="previewQuestions"
      :dialogI="showPreview"
      :isGetData="isGetDataPreview"
      @closeModal="closePreview" />
  </div>
</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin";
import DataField from "./components/DataField.vue";
import EsgService from "../../../_services/EsgService";
import Preview from "./components/Preview.vue";
import { quillEditor } from 'vue-quill-editor';

export default {
  components: {
    DataField,
    Preview,
    'quill-editor': quillEditor
  },
  data() {
    return {
      question: {
        _id: null,
        esgAssessmentId: null,
        esgHeadingId: null,
        order: null,
        createdBy: null,
        orgId: null,
        title: "",
        scoreEnabled: false,
        score: null,
        isMandatory: false,
        answerer: "Farmer (Single response for all farms)",
        heading: "Water Scarcity",
        questionType: "text-field",
        allowedFileTypes: [],
        allowMultipleAttachments: false,
        allowComments: false,
        uploadSignatureFile: false,
        drawSignature: false,
        description: "",
        getData: {
          condition: "Any",
          getData: {
            score: 0,
            expanded: false,
            dataFields: [],
          },
          flags: {
            getData: false,
          },
        },
        options: [],
        repeat: {
          enabled: false,
          type: "Fixed",
          selectedDates: [],
          fixedStartDate: null,
          fixedRepeatType: null,
          fixedRepetitions: 0,
        },
      },
      showPreview: false,
      isGetDataPreview: false,
      previewQuestions: [],
      newOption: null,
      newActionPlan: null,
      availablePermissions: [],
      dateModalCustom: false,
      selectedCustomDate: null,
      dateModalFixed: false,
      selectedStartDate: null,
      datafieldModal: false,
      dataFieldEdit: false,
      datafieldSource: null,
      selectedDataField: {},
      isAssessmentEditMode: this.isEdit,
      fileTypes: [
        {
          field: "image",
          title: "Image (JPEG, GIF, PNG)"
        },
        {
          field: "video",
          title: "Video (mp4)"
        },
        {
          field: "docx",
          title: "DOCX"
        },
        {
          field: "pdf",
          title: "PDF"
        }
      ],
      answerers: [
        "Farmer (Single response for all farms)",
        "Farmer (Separate response for each farm)",
        "Sub-Organization",
        // "Supplier"
      ],
       questionTypes: [
        { value: "text-field", label: "Text Field" },
        { value: "text-area", label: "Text Area" },
        { value: "numeric", label: "Text Field Numeric" },
        { value: "radio-button", label: "Radio Button" },
        { value: "check-boxes", label: "Check Boxes" },
        { value: "get-data", label: "Get Data" },
        { value: "attach-files", label: "Attach Files" },
        { value: "digital-signature", label: "Digital Signature" },
      ],
      conditions: [
        "All",
        "Any"
      ],
      // modules: [
      //   {
      //     name: "Carbon",
      //     permissions: [
      //       "Farmer Carbon Projects Selection",
      //       "Dimitra Carbon Marketplace"
      //     ]
      //   },
      //   {
      //     name: "Deforestation",
      //     permissions: [
      //       "Allow to add new farm",
      //       "Allow to request new deforestation report"
      //     ]
      //   },
      //   {
      //     name: "Irrigation",
      //     permissions: [
      //       "Allow to add new farm"
      //     ]
      //   },
      //   {
      //     name: "Pesticides",
      //     permissions: [
      //       "Allow to add new farm"
      //     ]
      //   }
      // ],
      repeatTypes: [
        {
          label: "Fixed Frequency",
          value: "Fixed"
        },
        {
          label: "Custom",
          value: "Custom"
        }
      ],
      fixedRepeatTypes: [
        "Day", "Week", "Month", "Quarter", "Year"
      ]
    };
  },
  computed: {
    hasQuestionLevelScore() {
      return this.question.scoreEnabled && !['radio-button', 'check-boxes', 'get-data'].includes(this.question.questionType); 
    },
    dialog() {
      return this.dialogI;
    },
    getOrganizationId() {
      return this.$store.getters.getUser?.user_organization?.id;
    },
    getUserId() {
      return this.$store.getters.getUser?.id;
    }
  },
  props: {
    isEdit: {
      type: Boolean,
      required: true,
      default: false,
    },
    dialogI: {
      type: Boolean,
      required: true,
    },
    selectedQuestion: {
      type: String,
      required: false,
    },
    selectedHeading: {
      type: String,
      required: false,
    },
    selectedSurvey: {
      type: Object,
      required: false,
    },
    surveyId: {
      type: String,
      required: false,
    },
    headings: {
      type: Array,
      required: true,
    }
  },
  async created() {
    // If editing an existing question, fetch and populate data
    if (this.isEdit && this.selectedQuestion) {
      await this.fetchQuestionDetails(this.selectedQuestion);
    }

    if (this.selectedHeading) {
      this.question.esgHeadingId = this.selectedHeading;
    }
  },
  mounted() {},
  methods: {
    quillOptions(placeholder) {
      return {
        theme: 'snow',
        placeholder,
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ header: [1, 2, 3, false] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ color: [] }, { background: [] }],
            ['clean']
          ]
        }
      }
    },
    handleConditionChange(option) {
      if (option.condition === "All") {
        option.flags.recommendations = true;
        option.flags.getData = true;
        option.flags.actionPlan = true;
        option.flags.dimitraModules = true;
      } else {
        option.flags.recommendations = false;
        option.flags.getData = false;
        option.flags.actionPlan = false;
        option.flags.dimitraModules = false;
      }
    },
    transformGetData(dataField) {
      return {
        dataType: dataField.dataType,
        title: dataField.title,
        isMandatory: dataField.isMandatory,
        optionValues: dataField.optionValues || [],
        helpText: dataField.helpText || "",
        helpEnabled: dataField.helpEnabled || false,
        _id: dataField._id,
        additionalSettings: dataField.additionalSettings,
        orgId: dataField.orgId,
        createdBy: dataField.createdBy,
      };
    },
    async fetchQuestionDetails(questionId) {
      try {
        const response = await EsgService.getAssessmentQuestionById(questionId);
        if (response.success) {
          const fetchedQuestion = response.data.question;
          const fetchedOptions = response.data.options || [];

          this.question = {
            _id: fetchedQuestion._id,
            esgHeadingId: fetchedQuestion.esgHeadingId,
            title: fetchedQuestion.title,
            scoreEnabled: fetchedQuestion.isScoreEnabled || false,
            score: (fetchedQuestion.isScoreEnabled && !['radio-button', 'check-boxes', 'get-data'].includes(fetchedQuestion.questionType)) ? fetchedQuestion.score : null, 
            isMandatory: fetchedQuestion.isMandatory || false,
            answerer: fetchedQuestion.respondentType || "",
            questionType: fetchedQuestion.questionType,
            allowedFileTypes: fetchedQuestion.additionalSetting?.allowedFileTypes || [],
            allowMultipleAttachments: fetchedQuestion.additionalSetting?.allowMultipleAttachments || false,
            allowComments: fetchedQuestion.additionalSetting?.allowComments || false,
            uploadSignatureFile: fetchedQuestion.additionalSetting?.uploadSignatureFile || false,
            drawSignature: fetchedQuestion.additionalSetting?.drawSignature || false,
            description: fetchedQuestion.additionalSetting?.description || "",
            getData: {
              condition: null,
              getData: {
                score: fetchedQuestion.score || 0,
                expanded: false,
                dataFields: (fetchedQuestion.getData || []).map((gd) => this.transformGetData(gd)),
              },
              flags: {
                getData: fetchedQuestion.getData.length > 0 ? true : false,
              },
            },
            options: fetchedOptions.map((option) => ({
              _id: option._id,
              title: option.label,
              score: option.score || 0,
              actions: [],
              expanded: false,
              recommendations: option.recommendation || "",
              flags: {
                recommendations: !!option.isRecommendationEnabled,
                getData: !!option.isGetDataEnabled,
                actionPlan: !!option.isActionPlanEnabled,
                dimitraModules: !!option.isDimitraModulesEnabled,
              },
              condition: (option.isRecommendationEnabled && option.isGetDataEnabled && option.isActionPlanEnabled) ? "All": "Any",
               getData: {
                score: option.getDataScore || 0,
                expanded: false,
                dataFields: (option.getData || []).map((gd) => ({
                  _id: gd._id,
                  ...this.transformGetData(gd),
                })),
              },
              actionPlan: {
                score: option.actionPlanScore || 0,
                items: (option.actionPlans || []).map((plan) => ({
                  _id: plan._id,
                  item: plan.title,
                  requireFile: plan.isFileRequired,
                })),
              },
            })),
            repeat: {
              enabled: fetchedQuestion.isRepeatEnabled || false,
              type: fetchedQuestion.repeatType || "Fixed",
              selectedDates: fetchedQuestion.repetitionDates || [],
              fixedStartDate: null,
              fixedRepeatType: fetchedQuestion.repetitionPeriod || "Month",
              fixedRepetitions: fetchedQuestion.repetitionCount || 0,
            },
          };

          console.log("Populated question:", this.question);
        } else {
          console.error("Error fetching question:", response.message);
        }
      } catch (error) {
        console.error("Failed to fetch question:", error);
      }
    },
    getActionName(option) {
      if (option.expanded) {
        return "Close Action";
      }

      return option.actions.length > 0 ? "Edit Actions": "Add Actions";
    },
    getActionChevron(option) {
      return option.expanded ? "mdi-chevron-up": "mdi-chevron-down";
    },
   
    async addOption() {
      if (this.newOption && this.newOption.length > 0) {
        try {
          const newOption = {
            title: this.newOption,
            score: null,
            actions: [],
            expanded: false,
            condition: 'Any',
            recommendations: "",
            actionPlanScore: 0,
            getDataScore: 0,
            flags: {
              recommendations: false,
              getData: false,
              actionPlan: false,
            },
            getData: {
              score: null,
              expanded: false,
              dataFields: []
            },
            actionPlan: {
              score: null,
              items: []
            },
          };

          if (this.isEdit) {
            const payload = {
              label: this.newOption,
              score: 0,
              recommendation: "",
              isDimitraModulesEnabled: false,
              isActionPlanEnabled: false,
              isGetDataEnabled: false,
              isRecommendationEnabled: false,
              esgAssessmentQuestionId: this.question._id,
              orgId: this.getOrganizationId,
              createdBy: this.getUserId,
            };

            const response = await EsgService.createAssessmentQuestionOption(payload);

            if (response.success) {
              newOption._id = response.data._id;
              this.$notify({ title: "Option Added", text: "Option added successfully!", type: "success" });
            } else {
              throw new Error(response.message);
            }
          }

          this.question.options.push(newOption);
          this.newOption = null;
          
        } catch (error) {
          console.error("Error adding option:", error);
          this.$notify({ title: "Error", text: "Failed to add option.", type: "error" });
        }
      }
    },
    async addAction(option) {
      console.log(option)
      try {
        const newAction = {
          item: this.newActionPlan,
          requireFile: false,
        };

        if (this.isEdit) {
          const payload = {
            title: this.newActionPlan,
            isFileRequired: false,
            esgAssessmentQuestionId: this.question._id,
            esgAssessmentQuestionOptionId: option._id,
            orgId: this.getOrganizationId,
            createdBy: this.getUserId,
          };

          const response = await EsgService.createActionPlan(payload);
          if (response.success) {
            newAction._id = response.data._id;
            option.actionPlan.items.push(newAction);
            this.$notify({ title: "Action Plan", text: "Action plan created successfully!", type: "success" });
          } else {
            throw new Error(response.message);
          }
        } else {
          option.actionPlan.items.push(newAction);
        }

        this.newActionPlan = null;
      } catch (error) {
        console.error("Error creating action plan:", error);
        this.$notify({ title: "Error", text: "Failed to create action plan.", type: "error" });
      }
    },
    async updateActionPlan(option, actionPlan) {
      try {
        if (!this.isEdit) return;

        const payload = {
          title: actionPlan.item,
          isFileRequired: actionPlan.requireFile,
        };

        const response = await EsgService.updateActionPlan(actionPlan._id, payload);
        if (response.success) {
          this.$notify({ title: "Success", text: "Action plan updated successfully!", type: "success" });
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.error("Error updating action plan:", error);
        this.$notify({ title: "Error", text: "Failed to update action plan.", type: "error" });
      }
    },
    expandOption(option) {
      option.expanded = !option.expanded;
    },
    closeModal() {
      this.$emit("closeDialog");
    },
    viewGetData(option) {
      option.getData.expanded = !option.getData.expanded;
    },
    async removeDataField(getDataId, isMainGetData = false, optionId = null) {
      try {
        await EsgService.deleteGetDataQuestion(getDataId);
        this.$notify({ title: "Data Field", text: "Data field deleted successfully!", type: "success" });

        // Remove from main getData block
        if (isMainGetData) {
          const list = this.question.getData.getData.dataFields;
          const index = list.findIndex(df => df._id === getDataId);
          if (index !== -1) list.splice(index, 1);
        }

        // Remove from option-level getData block
        if (optionId) {
          const option = this.question.options.find(o => o._id === optionId);
          if (option?.getData?.dataFields) {
            const index = option.getData.dataFields.findIndex(df => df._id === getDataId);
            if (index !== -1) option.getData.dataFields.splice(index, 1);
          }
        }
      }catch (error) {
        console.error("Error deleting data field:", error);
        this.$notify({ title: "Error", text: "Failed to delete data field.", type: "error" });
      }
    },
    typeToTitle(type) {
      return type?.replaceAll("-", " ");
    },
    deleteDataField(option, index) {
      console.log(option, index);
    },
    showDatafieldModal(source, isEdit = false, questionOptionId = null) {
      const ids = {
        questionOptionId: isEdit ? questionOptionId : source._id,
        questionId: this.selectedQuestion,
        surveyId: this.surveyId,
      };

      if (!source) {
          console.error("Error: source is undefined in showDatafieldModal");
          return;
      }

      if (!source.getData) {
          source.getData = { dataFields: [] };
      }

      this.datafieldSource = source;
      this.selectedDataField = isEdit ? { ...source, datatype: source.dataType, ids } : { ids };
      this.dataFieldEdit = isEdit;
      this.datafieldModal = true;
    },
    addDataField(df) {
      if (!this.datafieldSource || !this.datafieldSource.getData) {
          console.error("datafieldSource or getData is null!");
          return;
      }

      if (this.dataFieldEdit) {
          const index = this.datafieldSource.getData.dataFields.findIndex(d => d._id === df._id);
          if (index !== -1) {
              this.datafieldSource.getData.dataFields[index] = df;
          }
      } else {
          this.datafieldSource.getData.dataFields.push(df);
      }

      this.datafieldModal = false;
    },
    editDataField(field, optionId) {
        this.showDatafieldModal(field, true, optionId);
    },
    // renewPermissions(option) {
    //   option.dimitraModules.selectedPermissions = [];
    //   for (const m of this.modules) {
    //     console.log(m.name, option.dimitraModules.selectedModule);
    //     if (m.name === option.dimitraModules.selectedModule) {
    //       option.dimitraModules.selectedPermissions = m.permissions.map((p) => ({
    //         permission: p,
    //         allowed: false,
    //       }));
    //     }
    //   }
    // },
    saveCustomDate(date) {
      this.question.repeat.selectedDates.push(date);
      this.selectedCustomDate = null;
      this.dateModalCustom = false;
    },
    saveStartDate(date) {
      try {
        const reps = Number.parseInt(this.question.repeat.fixedRepetitions);

        if (isNaN(reps) || reps === null || reps === undefined) {
          return; // Return on 0 repetitions
        }

        this.question.repeat.fixedStartDate = date;
        this.question.repeat.selectedDates = [];
        this.question.repeat.selectedDates.push(date);

        const repFunctions = {
          day: (date) => {
            return new Date(date.getTime() + 86400000);
          },
          week: (date) => {
            return new Date(date.getTime() + (86400000 * 7));
          },
          month: (date) => {
            return new Date(date.setMonth(date.getMonth() + 1));
          },
          quarter: (date) => {
            return new Date(date.setMonth(date.getMonth() + 4));
          },
          year: (date) => {
            return new Date(date.setFullYear(date.getFullYear() + 1));
          }
        }

        const startDate = new Date(date);
        for (let i = 0; i < reps; i++) {
          const repFunction = repFunctions[this.question.repeat.fixedRepeatType.toLowerCase()];
          this.question.repeat.selectedDates.push(repFunction(startDate).toISOString().split("T")[0]);
        }
        this.dateModalFixed = false;
      } catch (e) {
        console.log("Invalid value for reps!")
      }
    },
    clearSelectedDates() {
      this.question.repeat.selectedDates = [];
    },
    deleteCustomDate(idx) {
      if (!this.question.repeat.selectedDates) {
        console.error("Error: selectedDates is undefined!");
        return;
      }

      if (idx >= 0 && idx < this.question.repeat.selectedDates.length) {
        this.question.repeat.selectedDates.splice(idx, 1);
      } else {
        console.error("Error: Invalid index for selectedDates");
      }
    },
    isOptionType() {
      return ["radio-button", "check-boxes"].includes(this.question.questionType);
    },
    openPreview() {
      const question = {
        title: this.question.title,
        type: this.question.questionType,
        drawSignature: this.question.drawSignature,
        uploadSignatureFile: this.question.uploadSignatureFile,
        options: (this.question.options || []).map((op) => op.title)
      }

      this.previewQuestions = [question];
      this.showPreview = true;
    },
    closePreview() {
      this.showPreview = false;
      this.previewQuestions = [];
    },
    openGetDataPreview(option) {
      const questions = (option?.getData?.dataFields || []).map((df) => ({
        title: df.title,
        type: df.datatype,
        helpEnabled: df.helpEnabled,
        help: df.help,
        unit: df.measurementUnit,
        options: (df.options || []).map((op) => op.label)
      }));
      
      this.previewQuestions = questions;
      console.log(this.previewQuestions);
      this.showPreview = true;
    },
    async saveQuestion() {
      if(this.isEdit) {
        await this.updateQuestion();
      } else {
        await this.submitQuestion();
      }
    },
    async submitQuestion() {
      try {
        this.startLoading();

        // Validate that a heading is selected
        if (!this.question.esgHeadingId) {
          this.$notify({
            title: "Validation Error",
            text: "Please select a heading before submitting.",
            type: "error",
          });
          this.stopLoading();
          return;
        }

        const questionPayload = {
          esgAssessmentId: this.surveyId,
          esgHeadingId: this.question.esgHeadingId,
          createdBy: this.getUserId,
          title: this.question.title,
          questionType:this.question.questionType,
          isMandatory: this.question.isMandatory,
          score: this.hasQuestionLevelScore ? isNaN(Number(this.question.score)) ? 0 : Number(this.question.score) : this.question.getData.getData.score || 0,
          isScoreEnabled: this.question.scoreEnabled,
          respondentType: this.question.answerer,
          orgId: this.getOrganizationId,
          isRepeatEnabled: this.question.repeat.enabled,
          repeatType: this.question.repeat.type || "Fixed",
          repetitionPeriod: this.question.repeat.fixedRepeatType || "Month",
          repetitionCount: this.question.repeat.fixedRepetitions || 0,
          repetitionDates: this.question.repeat.selectedDates || [],

          additionalSetting: {
            description: this.question.description || "",
            ...(this.question.questionType === "attach-files" && {
              allowedFileTypes: this.question.allowedFileTypes || [],
              allowMultipleAttachments: this.question.allowMultipleAttachments || false,
              allowComments: this.question.allowComments || false,
            }),
            ...(this.question.questionType === "digital-signature" && {
              uploadSignatureFile: this.question.uploadSignatureFile || false,
              drawSignature: this.question.drawSignature || false,
            }),
          },
        };
        if (this.question.questionType === "get-data" && this.question.getData?.getData?.dataFields.length) {
          questionPayload.getData = this.question.getData.getData.dataFields.map((dataField) => ({
            dataType: dataField.dataType,
            title: dataField.title,
            isMandatory: dataField.isMandatory,
            helpText: dataField.helpText || "",
            helpEnabled: dataField.helpEnabled || false,
            additionalSettings: dataField.additionalSettings,
            orgId: this.getOrganizationId,
            createdBy: this.getUserId,
          }));
        }

        // Prepare Options with GetData & Action Plans
        const optionsPayload = this.question.options.map((option) => {
          return {
            label: option.title,
            score: option.score || 0,
            recommendation: option.recommendations || "",
            isActionPlanEnabled: option.flags.actionPlan,
            isGetDataEnabled: option.flags.getData,
            isRecommendationEnabled: option.flags.recommendations,
            actionPlanScore: option.actionPlan.score || 0,
            getDataScore: option.getData.score || 0,
            actionPlans: option.flags.actionPlan
              ? option.actionPlan.items.map((plan) => ({
                  title: plan.item,
                  isFileRequired: plan.requireFile,
                  orgId: this.getOrganizationId,
                  createdBy: this.getUserId,
                }))
              : [],
            getData: option.flags.getData
              ? option.getData.dataFields.map((dataField) => ({
                  dataType: dataField.dataType,
                  title: dataField.title,
                  isMandatory: dataField.isMandatory,
                  helpText: dataField.helpText || "",
                  helpEnabled: dataField.helpEnabled || false,
                  additionalSettings: dataField.additionalSettings,
                  orgId: this.getOrganizationId,
                  createdBy: this.getUserId,
                }))
              : [],
          };
        });

        const finalPayload = {
          question: questionPayload,
          options: optionsPayload,
        };

        console.log("Final Payload:", finalPayload);

        const response = await EsgService.submitAssessmentQuestion(finalPayload);
        console.log("Question submitted successfully:", response);

        if(response.success && (response.code === 200 || response.code === 201)) {
          this.$notify({
              title: "Question submitted successfully",
              text: response.message || '',
              type: "success",
            });
          this.closeModal();
        } else {
          this.$notify({
            title: "Error submitting assessment question",
            text: response.message || '',
            type: "error",
          });
        }
      } catch (error) {
        console.error("Error submitting assessment question:", error);
        this.$notify({
          title: "Error submitting assessment question",
          message: error,
          type: "error",
        });
      } finally {
        this.stopLoading();
      }
    },
    async updateQuestion() {
      try {
        this.startLoading();

        if (!this.question.esgHeadingId) {
          this.$notify({
            title: "Validation Error",
            text: "Please select a heading before submitting.",
            type: "error",
          });
          this.stopLoading();
          return;
        }

        const questionPayload = {
          esgAssessmentId: this.surveyId,
          esgHeadingId: this.question.esgHeadingId,
          createdBy: this.getUserId,
          score: this.hasQuestionLevelScore ? isNaN(Number(this.question.score)) ? 0 : Number(this.question.score) : this.question.getData.getData.score || 0,
          title: this.question.title,
          questionType: this.question.questionType,
          isMandatory: this.question.isMandatory,
          isScoreEnabled: this.question.scoreEnabled,
          respondentType: this.question.answerer,
          orgId: this.getOrganizationId,
          isRepeatEnabled: this.question.repeat.enabled,
          repeatType: this.question.repeat.type || "Fixed",
          repetitionPeriod: this.question.repeat.fixedRepeatType || "Month",
          repetitionCount: this.question.repeat.fixedRepetitions || 0,
          repetitionDates: this.question.repeat.selectedDates || [],

          additionalSetting: {
            description: this.question.description || "",
            ...(this.question.questionType === "attach-files" && {
              allowedFileTypes: this.question.allowedFileTypes || [],
              allowMultipleAttachments: this.question.allowMultipleAttachments || false,
              allowComments: this.question.allowComments || false,
            }),
            ...(this.question.questionType === "digital-signature" && {
              uploadSignatureFile: this.question.uploadSignatureFile || false,
              drawSignature: this.question.drawSignature || false,
            }),
          },
        };

        if (this.question.questionType === "get-data" && this.question.getData?.getData?.dataFields.length) {
          questionPayload.getData = this.question.getData.getData.dataFields.map((dataField) => ({
            dataType: dataField.dataType,
            title: dataField.title,
            isMandatory: dataField.isMandatory,
            helpText: dataField.help || "",
            helpEnabled: dataField.helpEnabled || false,
            additionalSettings: dataField.additionalSettings,
            orgId: this.getOrganizationId,
            createdBy: this.getUserId,
          }));
        }

        const optionsPayload = this.question.options.map((option) => {
          return {
            _id: option._id,
            label: option.title,
            score: option.score || 0,
            recommendation: option.recommendations || "",
            isActionPlanEnabled: option.flags.actionPlan,
            isGetDataEnabled: option.flags.getData,
            isRecommendationEnabled: option.flags.recommendations,
            actionPlanScore: option.actionPlan.score || 0,
            getDataScore: option.getData.score || 0,
          };
        });

        const finalPayload = {
          question: questionPayload,
          options: optionsPayload,
        };

        console.log("Final Payload:", finalPayload);

        const response = await EsgService.updateAssessmentQuestion(this.question._id,finalPayload);
        console.log("Question submitted successfully:", response);

        if (response.success && (response.code === 200 || response.code === 201)) {
          this.$notify({
            title: "Question submitted successfully",
            text: response.message || '',
            type: "success",
          });
          this.closeModal();
        } else {
          this.$notify({
            title: "Error submitting assessment question",
            text: response.message || '',
            type: "error",
          });
        }
      } catch (error) {
        console.error("Error submitting assessment question:", error);
        this.$notify({
          title: "Error submitting assessment question",
          message: error,
          type: "error",
        });
      } finally {
        this.stopLoading();
      }
    }
  },
  mixins: [loadingMixin],
};
</script>

<style lang="scss" scoped>
.question-option {
  background: #d9d9d9;
  display: flex;
  border-radius: 5px;
  padding: 4px;
  margin: 0px 0px 5px 0px;
  padding-left: 10px;
  min-height: 40px;
  align-items: center;
}
.checkpoints {
  background: #d9d9d9;
  display: flex;
  padding: 4px;
  padding-left: 10px;
  min-height: 40px;
  align-items: center;
}

.score-container {
  display: flex;
  align-items: baseline;
}

.nested-question {
  background-color: #edecec;
  padding: 37px 28px;
  gap: 15px;
}

.pointer {
  cursor: pointer;
}

.p-0 {
  padding: 0 !important;
}

.h3 {
  font-size: 1.2em;
  font-weight: bold;
}

.h4 {
  font-size: 1.1em;
  font-weight: bold;
}

.bottomless {
  background-color: white;
}

::v-deep .v-data-table-header__icon {
  color: white !important;
}

::v-deep .bottomless .v-input__slot {
  margin-bottom: 0 !important;
}

::v-deep .bottomless .v-messages {
  display: none !important;
}

::v-deep .v-text-field__details {
  display: none !important;
}

::v-deep .options .v-card__title {
  font-size: 1em;
  font-weight: 900;
  color: white;
  background-color: $primary-color;
  border-radius: 8px !important;
}

::v-deep .options.dark .v-card__title {
  background-color: rgb(66, 66, 66) !important;
}

.right-border-col {
  border-right: 1px solid rgb(112, 112, 112);
}

.answerer-select {
  width: 450px;
}

.option {
  background-color: rgb(233, 233, 233);
  border-radius: 8px;
}

.content-col {
  display: flex;
  align-items: center;
}

.w-100 {
  width: 100%;
  height: 100%;
}

.clickable {
  color: $primary-color;
  cursor: pointer;
}

.expandable {
  background-color: white;
  border-radius: 8px !important;
}

h3, h4 {
  color: black;
}

::v-deep .v-label {
  font-size: 0.8em !important;
}

.seperator {
  background-color: lightgray;
  height: 2px;
  border: none;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
}
.text--small {
  font-size: 0.8em;
}

.question-footer {
  display: flex;
  flex-direction: row;
  justify-content: end;
  gap: 20px;
}
</style>
