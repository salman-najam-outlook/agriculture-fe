<template name="tickets">
  <div style="min-width:700px;">
    <breadcrumb :items="breadcrumbs"></breadcrumb>
    <div class="tickets-container mx-4" v-if="!chatWindow">
      <div class="d-flex mb-4 mx-4">
        <h2>{{ $t("tickets.title") }}</h2>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          dark
          small
          class="mr-2"
          @click="
            () => {
              createTicketDialog = true;
              step = 1;
              resetTicketData();
            }
          "

        >
          {{ $t('tickets.actions.create') }}
        </v-btn>
      </div>
      <v-card elevation="0" v-if="noTickets">
        <v-card-text>
          <div class="text-center" style="padding-top: 5%">
            <v-row align="center" justify="center">
              <v-col>
                <img src="/icons/nodata.svg" class="img-center" alt="" />
                <h5 class="mt-4 red--text">{{ $t('tickets.noData') }}</h5>

                <i18n path="tickets.noDataHelpText" tag="p" class="text-caption black--text">
                  <br />
                  <br />
                </i18n>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
      </v-card>

      <v-card v-else elevation="0" class="" >
        <v-data-table
          :items="tickets"
          :search="searchTickets"
          hide-default-header
          hide-default-footer
          :items-per-page="5"
          :loading="loading"
          :options.sync="options"
          :server-items-length="totalTickets"
          :loading-text="$t('loadingData')"
        >
          <template v-slot:top>
            <div class="d-flex" style="
                  display: flex;
                  white-space: pre;
                ">
              <v-toolbar flat>
                <v-text-field
                  prepend-inner-icon="mdi-magnify"
                  :label="$t('search')"
                  v-model="searchTickets"
                  @input="resetSearchOnEmpty"
                  outlined
                  dense
                  hide-details
                ></v-text-field>
                <v-spacer></v-spacer>

                <div class="float-right d-flex align-center">
                  <b class="mr-4">{{ $t('orderBy') }}</b>
                  <v-select
                    :items="orderByItems"
                    outlined
                    item-text="label"
                    item-value="val"
                    dense
                    v-model="orderByItemsVal"
                    @change="getTickets"
                    hide-details
                  ></v-select>
                  <b class="ml-4 mr-4">{{ $t('tickets.filters.ticketFor') }}</b>
                  <v-select
                    :items="ticketForItems"
                    outlined
                    item-text="label"
                    item-value="val"
                    dense
                    v-model="ticketForItemsVal"
                    @change="getTickets"
                    hide-details
                  ></v-select>
                </div>

                <div class="pl-4 title">
                  {{ from }} - {{ to }} {{ $t('of') }} {{ totalTickets }}
                </div>
                <v-btn
                  class="mx-2"
                  fab
                  small
                  outlined
                  color="primary"
                  :disabled="options.page <= 1"
                  @click="pageChange(false)"
                >
                  <v-icon dark> mdi-chevron-left </v-icon>
                </v-btn>
                <v-btn
                  class="mx-2"
                  fab
                  small
                  outlined
                  color="primary"
                  :disabled="options.page >= totalPages"
                  @click="pageChange(true)"
                >
                  <v-icon dark> mdi-chevron-right </v-icon>
                </v-btn>
              </v-toolbar>
            </div>
          </template>

          <template v-slot:body="{ items }">
            <v-card v-if="!items.length" class="mt-8">
              <div
                style="
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                "
              >
                <img src="/icons/nodata.svg" class="img-center" alt="" />
                <div class="mt-6 red--text">{{ $t('tickets.noData') }}</div>
                <i18n path="tickets.noDataHelpText" tag="div" class="mt-2">
                  <br />
                  <br />
                </i18n>
              </div>
            </v-card>
            <v-card

              v-else
              :class="{ 'odd-row': (index + 1) % 2 !== 0 }"
              class="mb-4 py-14 px-2 ticket-row"
              v-for="(item, index) in items"
              :key="index"
              @mouseenter="selectItem(item)"
              @mouseleave="unSelectItem()"
            >
              <v-row   >
                <v-col class="first-col">
                  <div>
                    <v-chip
                      class="my-2"
                      :color="
                        item.priority === 'Low'
                          ? 'yellow'
                          : item.priority === 'Medium'
                          ? 'orange'
                          : 'red'
                      "
                      :text-color="item.priority === 'Low' ? 'black' : 'white'"
                      label
                    >
                      {{ item.priority && item.priority.toLowerCase() ? $t(`tickets.priority.${item.priority.toLowerCase()}`) : $t('tickets.priority.high') }}
                    </v-chip>
                    #{{ item.id }}
                  </div>
                  <div>
                    <span
                      class="bold-text clickable"
                      @click="openUserDialog(item.requesterId)"
                    >
                      {{ item.requestorName || $t('user') }}
                    </span>
                    -
                    <span
                      >({{
                        formatDate(item.startDate || item.createdAt)
                      }})</span
                    >
                  </div>
                  <div class="ticket-description">
                    <p v-html="formatDescriptionWithLinks(item.description)"></p>
                  </div>
                </v-col>
                <v-col>
                  <div>
                    <p>{{ $t('tickets.requestorEmail') }}</p>
                  </div>
                  <div>
                    <span class="bold-text">{{
                      item.requestorEmail || "N/A"
                    }}</span>
                  </div>
                </v-col>
                <v-col>
                  <div>
                    <p>{{ $t('tickets.subject') }}</p>
                  </div>
                  <div>
                    <span class="bold-text">{{ item.subject }}</span>
                  </div>
                </v-col>
                <v-col>
                  <div>
                    <p>{{ $t('status') }}</p>
                  </div>
                  <div>
                    <span
                      class="bold-text text-capitalize"
                      :class="{
                        'primary--text': item.status === 'open',
                        'red--text': item.status !== 'open',
                      }"
                      >{{ item.status }}</span
                    >
                  </div>
                </v-col>
                <v-col>
                  <div>
                    <p>{{ $t('tickets.areaOfRequest') }}</p>
                  </div>
                  <div>
                    <span class="bold-text">{{
                      getAreaOfRequestName(item.areaOfRequest)
                    }}</span>
                  </div>
                </v-col>
                <v-col>
                  <div>
                    <p>{{ $t('type') }}</p>
                  </div>
                  <div>
                    <span class="bold-text"
                      >{{ item.ticketUserType }} ({{ item.type }})</span
                    >
                  </div>
                </v-col>
                <v-col>
                  <div>
                    <p>{{ $t('tickets.assignee') }}</p>
                  </div>
                  <div>
                    <span class="bold-text">{{ item.asignee && item.asignee.fullName }}</span>
                  </div>
                </v-col>
                <template>
                  <div
                    style="position: absolute; right: 10px; top: 5px"
                    v-if="item === selectedItemData"
                  >
                     <v-tooltip bottom >
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          x-small
                          fab
                          v-bind="attrs"
                          v-on="on"
                          class="green-shadow mr-1"
                          @click="openTicket(item)"
                        >
                          <v-icon>mdi-eye</v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $t("view") }}</span>
                    </v-tooltip>
                    <v-tooltip bottom></v-tooltip>
                    <v-tooltip bottom >
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          x-small
                          fab
                          v-bind="attrs"
                          v-on="on"
                          class="green-shadow"
                          @click="editTicket(item)"
                        >
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $t("edit") }}</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          x-small
                          fab
                          v-bind="attrs"
                          v-on="on"
                          class="ml-1 red-shadow"
                          @click="deleteTicketDialog = true"
                        >
                          <v-icon>mdi-trash-can</v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $t("delete") }}</span>
                    </v-tooltip>
                  </div>
                </template>
              </v-row>
              <v-row class="action-row">
                <v-icon  @click="openCommentWindow(item)" color="primary" class="mr-2"> mdi-message </v-icon>
                <span
                  color="primary"
                  @click="openCommentWindow(item)"
                  style="cursor: pointer"
                  >{{ $t('tickets.reply') }}</span
                >

                <v-checkbox
                  :value="item.ticketReadStatus"
                  :disabled="
                    item.ticketReadStatus &&
                      Object.keys(item.ticketReadStatus).length > 0
                  "
                  :label="$t('tickets.markAsRead')"
                  color="#0FBF68"
                  hide-details
                  class="mr-4 ml-4"
                  @change="markAsRead(item.id)"
                >
                </v-checkbox>

                <span class="ml-4"
                  >{{ $t('tickets.dueDate') }}: {{ formatDate(item.endDate) }}</span
                >
              </v-row>
            </v-card>
          </template>
        </v-data-table>
      </v-card>

      <v-dialog v-model="showImage" max-width="900">
        <img :src="imageUrl" class="responsive-image-pop" >
      </v-dialog>

      <!-- Create Ticket -->
      <v-dialog v-model="createTicketDialog" width="700" persistent>
        <v-card>
          <v-card-title
            class="text-h6 white--text primary justify-space-between"
            v-if="editDialog == true "
          >
            {{ $t('tickets.actions.edit') }} 

            <v-icon
              color="white"
              @click="
                () => {
                  createTicketDialog = false;
                  step = 1;
                  resetTicketData();
                }
              "
            >
              mdi-close
            </v-icon>
          </v-card-title>
          <v-card-title
            class="text-h6 white--text primary justify-space-between"
            v-if="editDialog == false "
          >
            {{ $t('tickets.actions.create') }} 

            <v-icon
              color="white"
              @click="
                () => {
                  createTicketDialog = false;
                  step = 1;
                  resetTicketData();
                }
              "
            >
              mdi-close
            </v-icon>
          </v-card-title>



          <v-card-text
          v-if="!editDialog"
            class="pa-4"
          >
            <v-row >
              <v-col cols="12" md="12">
                <label>{{ $t('tickets.subject') }} <span class="required">*</span></label>
                <v-text-field
                  v-model="ticketData.subject"
                  :label="$t('enterHere')"
                  outlined
                  dense
                  single-line
                  hide-details="auto"
                  ref="subject"
                      required
                  :rules="[
                    () =>
                      !!ticketData.subject || $t('errors.required'),
                  ]"
                  
      
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="12">
                <label>{{ $t('description') }} </label>
                <v-textarea
                  v-model="ticketData.description"
                  :label="$t('enterDescription')"
                  :disabled="editDialog"
                  outlined
                  dense
                  single-line
                  rows="2"
                  row-height="20"
                  hide-details="auto"
                  ref="description"
                  
           
                ></v-textarea>
              </v-col>

              <v-col cols="12" md="6">
                <label>{{ $t('tickets.areaOfRequest') }} <span class="required"></span></label>
                <v-select
                  v-model="ticketData.areaOfRequest"
                  :label="$t('select')"
                  outlined
                  dense
                  single-line
                  :items="areaOfRequest"
                  item-text="name"
                  item-value="name"
                  ref="areaOfRequest"
                  required
                  :rules="[
                    () =>
                      !!ticketData.areaOfRequest || $t('errors.required'),
                  ]"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <label>{{ $t('type') }}</label>
                <v-select
                  v-model="ticketData.type"
                  :label="$t('select')"
                  outlined
                  dense
                  single-line
                  hide-details="auto"
                  :items="type"
                  ref="type"
                  required
                  :rules="[() => !!ticketData.type || $t('errors.required')]"
                >
                </v-select>
              </v-col>
            </v-row>
            <v-row class="mt-4">
              <v-col cols="12" md="6">
                <label>{{ $t('uploadImageVideo') }} </label>
                <v-file-input
                  v-model="ticketData.file"
                  multiple
                  outlined
                  dense
                  single-line
                  hide-details="auto"
                  prepend-icon
                  :placeholder="$t('browse')"
                >
                  <template v-slot:selection="{ text }">
                    <v-chip small label color="primary">
                      {{ text }}
                    </v-chip>
                  </template>
                </v-file-input>
              </v-col>
              <v-col
                cols="12"
                md="6"
                v-if="ticketData.ticketMedia.length > 0 && (ticketData.file && ticketData.file.length === 0)"
                style="display: flex"
              >
                <v-img
                @click="showImagePop(item.fileName)"
                  :src="item.fileName"
                  aspect-ratio="1.7"
                  v-for="(item, index) in ticketData.ticketMedia"
                  :key="index"
                ></v-img>
              </v-col>
            </v-row>
          </v-card-text>

              <v-card-text
            v-else
            class="pa-4"
            ref="form"
          >
            <v-row>
              <v-col cols="6">
                <label>{{ $t('tickets.requestorDetails') }} </label>
                <!-- <v-autocomplete
                  v-model="ticketData.userId"
                  :items="allAppUsersData"
                  outlined
                  dense
                  chips
                  small-chips
                  :label="$t('enterHere')"
                  :multiple="multipleUsers"
                  item-text="fullName"
                  item-value="id"
                  single-line
                  hide-details="auto"
                  ref="userId"
                  required
                  :rules="[
                    () =>
                      (ticketUserType === 'Group of users'
                        ? ticketData.userId && ticketData.userId.length > 0
                        : !!ticketData.userId) || $t('errors.required'),
                  ]"
                ></v-autocomplete> -->
                    <v-text-field
                  v-model="ticketData.requestorName"
                  :label="$t('enterHere')"
                  outlined
                  dense
                  single-line
                  hide-details="auto"

                  disabled
    
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <label>{{ $t('tickets.requestorEmail') }} </label>
                <v-text-field
                  v-model="ticketData.requestorEmail"
                  :label="$t('enterHere')"
                  outlined
                  dense
                  single-line
                  disabled
                  hide-details="auto"
       
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="12">
                <label>{{ $t('tickets.subject') }} </label>
                <v-text-field
                  v-model="ticketData.subject"
                  :label="$t('enterHere')"
                  outlined
                  disabled
                  dense
                  single-line
                  hide-details="auto"
                  ref="subject"
          
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="12">
                <label>{{ $t('description') }} </label>
                <v-textarea
                  v-model="ticketData.description"
                  :label="$t('enterDescription')"
                  outlined
                  :disabled="editDialog"
                  dense
                  single-line
                  rows="2"
                  row-height="20"
                  hide-details="auto"
                  ref="description"
         
                ></v-textarea>
              </v-col>

              <v-col cols="12" md="6">
                <label>{{ $t('status') }} </label>
                <v-select
                  @change="updateChangesMade('status', $event)"
                  v-model="ticketData.status"
                  :label="$t('select')"
                  outlined
                  dense
                  single-line
                  hide-details="auto"
                  :items="statusItems"
                  item-text="label"
                  item-value="val"
                  ref="status"
          
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <label>{{ $t('tickets.priority.label') }} </label>
                <v-select
                  v-model="ticketData.priority"
                  :label="$t('select')"
                  @change="updateChangesMade('priority', $event)"
                  outlined
                  dense
                  single-line
                  hide-details="auto"
                  :items="priorityItems"
                  item-text="label"
                  item-value="val"
                  ref="priority"
            
                ></v-select>
              </v-col>

              <v-col cols="12" md="6">
                <label
                  >{{ $t('tickets.requestedDateTime') }}
                  </label
                >
                <v-menu
                disabled
                  ref="startDateMenu"
                  v-model="startDateMenu"
                  :close-on-content-click="false"
                  :return-value.sync="ticketData.startDate"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                    disabled
                      v-model="ticketData.startDate"
                      :label="$t('tickets.pickerInMenu')"
                      append-icon="mdi-calendar"
                      hide-details="auto"
                      outlined
                      dense
                      single-line
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      ref="startDate"
             
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="ticketData.startDate"
                    no-title
                    scrollable
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="startDateMenu = false">
                      {{ $t('cancel') }}
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.startDateMenu.save(ticketData.startDate)"
                    >
                      {{ $t('ok') }}
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" md="6">
                <label>{{ $t('tickets.dueDate') }} </label>
                <v-menu
                  ref="endDateMenu"
                  v-model="endDateMenu"
                  :close-on-content-click="false"
                  :return-value.sync="ticketData.endDate"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="ticketData.endDate"
                      :label="$t('tickets.pickerInMenu')"
                      append-icon="mdi-calendar"
                      outlined
                      dense
                      single-line
                      readonly
                      v-bind="attrs"
                      hide-details="auto"
                      v-on="on"
                      ref="endDate"
                
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="ticketData.endDate"
                    no-title
                    scrollable
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="endDateMenu = false">
                      {{ $t('cancel') }}
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.endDateMenu.save(ticketData.endDate)"
                    >
                      {{ $t('ok') }}
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="12" md="6">
                <label>{{ $t('tickets.areaOfRequest') }} </label>
                <v-select
                  v-model="ticketData.areaOfRequest"
                  label="Select"
                  outlined
                  dense
                  single-line
                  hide-details="auto"
                  :items="areaOfRequest"
                  item-text="name"
                  item-value="name"
                  ref="areaOfRequest"
             
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <label>{{ $t('type') }} </label>
                <v-select
                  v-model="ticketData.type"
                  :label="$t('select')"
                  outlined
                  dense
                  single-line
                  hide-details="auto"
                  :items="type"
                  ref="type"
     
                >
                </v-select>
              </v-col>
              <v-col cols="12" md="6">
                <label>{{ $t('tickets.assignee') }} </label>
                <v-select
                  v-model="ticketData.asigneeId"
                  :label="$t('select')"
                  @change="updateChangesMade('asigneeId', $event)"
                  outlined
                  dense
                  single-line
                  hide-details="auto"
                  :items="allAdminUsersData"
                  item-text="fullName"
                  item-value="userId"
                  ref="asigneeId"
         
             
                >
                  <template v-slot:item="{ item }">
                    <div :class="{ 'super-admin-item': item.isSuperAdmin }">
                      {{ item.fullName }}
                    </div>
                  </template>
                </v-select>
              </v-col>
            </v-row>
            <v-row class="mt-4">
              <v-col cols="12" md="6">
                <label>{{ $t('uploadImageVideo') }}</label>
                <v-file-input
                  v-model="ticketData.file"
                  multiple
                  outlined
                  dense
                  single-line
                  hide-details="auto"
                  prepend-icon
                  :placeholder="$t('browse')"
                >
                  <template v-slot:selection="{ text }">
                    <v-chip small label color="primary">
                      {{ text }}
                    </v-chip>
                  </template>
                </v-file-input>
              </v-col>
              <v-col
                cols="12"
                md="6"
                v-if="ticketData.ticketMedia.length > 0"
                style="display: flex"
              >
                <v-img
                @click="showImagePop(item.fileName)" 
                  :src="item.fileName"
                  aspect-ratio="1.7"
                  v-for="(item, index) in ticketData.ticketMedia"
                  :key="index"
                ></v-img>
              </v-col>
            </v-row>
          </v-card-text>


          <v-divider></v-divider>

          <v-card-actions class="ma-4">
            <v-spacer></v-spacer>
            <v-btn
              outlined
              color="primary"
              @click="
                () => {
                  createTicketDialog = false;
                  step = 1;
                  resetTicketData();
                }
              "
            >
              {{ $t('cancel') }}
            </v-btn>

            <v-btn
              depressed
              color="primary"

              @click="editDialog ? updateTicket() : createTicket()"
            >
              {{ $t('submit') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Delete Ticket -->
      <v-dialog  v-model="deleteTicketDialog" width="400">
        <v-card >
          <v-card-title
            class="text-h6 white--text primary justify-space-between"
          >
            {{ $t('tickets.actions.delete') }}

            <v-icon color="white" @click="deleteTicketDialog = false">
              mdi-close
            </v-icon>
          </v-card-title>

          <v-card-text class="pa-4">
            <i18n path="tickets.deleteTicket.confirmation" tag="span">
              <strong
                >#{{ selectedItemData.id }}
                {{ selectedItemData.requestorName }}</strong
              >
            </i18n>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions ma-4>
            <v-spacer></v-spacer>
            <v-btn outlined color="primary" @click="deleteTicketDialog = false">
              {{ $t('cancel') }}
            </v-btn>
            <v-btn depressed color="primary" @click="deleteTicket">
              {{ $t('tickets.actions.delete') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Filter Dialog -->
      <v-dialog
        v-model="filterDialog"
        width="400"
        content-class="filter-dialog"
      >
        <v-card>
          <v-card-title
            class="text-h6 white--text primary justify-space-between"
          >
            {{ $t('filterBy') }}

            <v-icon color="white" @click="filterDialog = false">
              mdi-close
            </v-icon>
          </v-card-title>

          <v-card-text class="pa-4">
            <v-row>
              <v-col cols="12">
                <label>{{ $t('membership.type') }}</label>
                <v-select
                  v-model="selectedMembershipType"
                  :label="$t('select')"
                  outlined
                  dense
                  single-line
                  hide-details="auto"
                  :items="membershipTypes"
                  item-text="membership_type"
                  item-value="id"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <label>{{ $t('membership.validity') }}</label>
                <v-select
                  v-model="selectedMembershipValidity"
                  :label="$t('select')"
                  outlined
                  dense
                  single-line
                  hide-details="auto"
                  :items="membershipValidity"
                  item-text="label"
                  item-value="val"
                ></v-select>
              </v-col>
            </v-row>
            <v-row v-if="selectedMembershipValidity === 'custom'">
              <v-col cols="12">
                <label>{{ $t('membership.remainingDays') }}</label>
                <v-text-field
                  v-model="remainingDays"
                  :label="$t('enterHere')"
                  outlined
                  dense
                  single-line
                  hide-details="auto"
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions class="ma-4">
            <v-spacer></v-spacer>
            <v-btn
              outlined
              color="primary"
              @click="
                () => {
                  selectedMembershipType = '';
                  selectedMembershipValidity = '';
                  getAppUsersWithMembership();
                }
              "
            >
              {{ $t('clearAll') }}
            </v-btn>
            <v-btn
              depressed
              color="primary"
              @click="getAppUsersWithMembership()"
              style="text-transform: capitalize;"
            >
              {{ $t('search') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Notifications Popup -->
      <v-snackbar v-model="notificationPopup.status">
        {{ notificationPopup.msg }}
      </v-snackbar>
    </div>

    <ChatWindow
      :selectedItemData="selectedItemData"
      @onBackButtonClick="chatWindow = false"
      v-else
    />

    <ViewUser :dialog="showUserDialog" :user="userDetails" @close="showUserDialog = false" />

    <router-view></router-view>
  </div>
</template>

<script>
import axios from "axios";
import loadingMixin from "@/mixins/LoadingMixin";
import ChatWindow from "./ChatWindow";
import getPermittedActions from "@/mixins/GetPermittedActions";
import UserService from "../../_services/UserService";
import ViewUser from "./ViewUser";
import DateMixin from "@/mixins/DateMixin";
import { debounce } from 'lodash';
export default {
  name: "Tickets",
  mixins: [loadingMixin, getPermittedActions, DateMixin],
  components: { ChatWindow, ViewUser },
  data() {
    return {
      showImage: false,
      imageUrl: '',
      noTickets: false,
      breadcrumbs: [
        {
          text: this.$t("dashboard"),
          to: "/",
        },
        {
          text: this.$t("tickets.title"),
          disabled: true,
        },
      ],
      createTicketDialog: false,
      ticketUserType: "Group of users",
      orderByItems: [
        { label: this.$t('orderByItems.all'), val: "All" },
        { label: this.$t('orderByItems.low'), val: "Low" },
        { label: this.$t('orderByItems.medium'), val: "Medium" },
        { label: this.$t('orderByItems.high'), val: "High" },
        { label: this.$t('orderByItems.dueDate'), val: "endDate" },
        { label: this.$t('orderByItems.dateAscending'), val: "dateAscending" },
        { label: this.$t('orderByItems.dateDescending'), val: "dateDescending" },
      ],
      ticketForItems: [
        { label: this.$t('tickets.ticketsForItems.all'), val: "All" },
        { label: this.$t('tickets.ticketsForItems.singleUser'), val: "Single User" },
        { label: this.$t('tickets.ticketsForItems.multipleUsers'), val: "Group of users" },
        { label: this.$t('tickets.ticketsForItems.dimitraAdmin'), val: "Dimitra Admin" },
      ],
      orderByItemsVal: "All",
      ticketForItemsVal: "All",
      tickets: [],
      totalTickets: 0,
      totalPages: 1,
      loading: true,
      options: {},
      from: 0,
      to: 0,
      step: 1,
      statusItems: [
        { label: this.$t('statusItems.open'), val: "open" },
        { label: this.$t('statusItems.closed'), val: "closed" },
        {
          label: this.$t('additionalInformationRequired'),
          val: "additional_information_required",
        },
      ],
      priorityItems: [
        { label: this.$t('orderByItems.low'), val: "Low" },
        { label: this.$t('orderByItems.medium'), val: "Medium" },
        { label: this.$t('orderByItems.high'), val: "High" },
      ],
      selectedFile: null,
      startDateMenu: false,
      endDateMenu: false,
      searchTickets: "",
      ticketData: {
        requestorName: "",
        requestorEmail: "",
        subject: "",
        description: "",
        status: "",
        priority: "",
        startDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10),
        endDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10),
        areaOfRequest: "",
        type: "",
        asigneeId: "",
        ticketUserType: "Group of users",
        file: [],
        ticketMedia: [],
      },
      originalTicketData: {},
      changesMadeObj: {},
      selectedItem: false,
      selectedItemData: {},
      deleteTicketDialog: false,
      notificationPopup: {
        status: false,
        msg: "",
      },
      image: null,
      chatWindow: false,
      selected: [],
      searchUsers: "",
      headers: [
        {
          text: this.$t('userName'),
          align: "start",
          value: "fullName",
        },
        { text: this.$t('email'), value: "email" },
        { text: this.$t('membership.type'), value: "membershipType" },
        { text: this.$t('membership.validity'), value: "membershipValidity" },
        { text: this.$t('status'), value: "status" },
      ],
      filterDialog: false,
      allAppUsersData: [],
      allAppUsersDataWithMembership: [],
      allAdminUsersData: [],
      areaOfRequest: [],
      type: ["Question", "Incident", "Problem"],
      formHasErrors: false,
      membershipTypes: [],
      membershipValidity: [
        {
          label: this.$t('membership.validityLength.expired'),
          val: "expired",
        },
        {
          label: this.$t('membership.validityLength.lessThan1Month'),
          val: "lessThanOneMonth",
        },
        {
          label: this.$t('membership.validityLength.oneTo8Months'),
          val: "oneToEightMonth",
        },
        {
          label: this.$t('dashboardSection.sixTo12Months'),
          val: "sixToTweleveMonth",
        },
        {
          label: this.$t('dashboardSection.moreThan1Year'),
          val: "moreThanOneYear",
        },
        {
          label: this.$t('membership.validityLength.custom'),
          val: "custom",
        },
      ],
      selectedMembershipType: "",
      selectedMembershipValidity: "",
      remainingDays: "",
      editDialog: false,
      showUserDialog: false,
      userDetails: null,
      userDetailsLoading: false,
    };
  },
  computed: {
    form() {
      return {
        subject: this.ticketData.subject,
        description: this.ticketData.description,
        status: this.ticketData.status,
        priority: this.ticketData.priority,
        startDate: this.ticketData.startDate,
        endDate: this.ticketData.endDate,
        areaOfRequest: this.ticketData.areaOfRequest,
        type: this.ticketData.type,
        asigneeId: this.ticketData.asigneeId,
      };
    },
    dimitraAdminForm() {
      return {
        subject: this.ticketData.subject,
        description: this.ticketData.description,
        areaOfRequest: this.ticketData.areaOfRequest,
        type: this.ticketData.type,
      };
    },
    multipleUsers() {
      return (
        this.ticketData.ticketUserType === "Group of users" ||
        this.ticketUserType === "Group of users"
      );
    },
  },
  methods: {
    openTicket(ticketId) {
      console.log("openTicket", ticketId);
      this.$router.push({
        name: "TicketLogs",
        params: {id: ticketId.id },
      });

    },
    updateChangesMade(fieldName, valueChange) {
   
      switch (fieldName) {
        case "status":
          {
            console.log("valueChange", valueChange, this.originalTicketData.status)
            if(this.originalTicketData.status != valueChange) {
              console.log("valueChange", valueChange, this.originalTicketData.status)
              this.changesMadeObj.status = valueChange;
            } else {
                delete this.changesMadeObj.status;
            }
        }
          break;
        case "priority":
          if(this.originalTicketData.priority != valueChange) {
            this.changesMadeObj.priority = valueChange;
          } else {
            delete this.changesMadeObj.priority;
          }
          break;
        case "endDate":
          if(this.originalTicketData.endDate != valueChange) {
            this.changesMadeObj.endDate = valueChange;
          } else {
            delete this.changesMadeObj.endDate;
          }
          break;
        case "areaOfRequest":
          if(this.originalTicketData.areaOfRequest != valueChange) {
            this.changesMadeObj.areaOfRequest = valueChange;
          } else {
            delete this.changesMadeObj.areaOfRequest;
          }
          break;
        case "type":
          if(this.originalTicketData.type != valueChange) {
            this.changesMadeObj.type = valueChange;
          } else {
            delete this.changesMadeObj.type;
          }
          break;
        case "asigneeId":
          if(this.originalTicketData.asigneeId != valueChange) {
            this.changesMadeObj.asigneeId = valueChange;
          } else {
            delete this.changesMadeObj.asigneeId;
          }
          break;
      }
    },
    formatDescriptionWithLinks(text) {
      if (!text) return '';
      
      // Regular expression to match URLs
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      
      // Replace URLs with clickable links
      return text.replace(urlRegex, (url) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #1976d2; text-decoration: underline;">${url}</a>`;
      });
    },
    showImagePop(imageUrl) {
      this.showImage = true
      this.imageUrl = imageUrl
    },
    formatDate(date) {
      const d = new Date(date);
      let month = "" + (d.getMonth() + 1);
      let day = "" + d.getDate();
      const year = d.getFullYear();

      if (month.length < 2) {
        month = "0" + month;
      }
      if (day.length < 2) {
        day = "0" + day;
      }
      return [year, month, day].join("-");
    },
    async selectItem(item) {
      this.selectedItem = true;
      this.selectedItemData = item;
    },
    unSelectItem() {
      this.selectedItem = false;
    },
    editTicket(data) {
      this.createTicketDialog = true;
      this.editDialog = true;
      this.originalTicketData = JSON.parse(JSON.stringify(data))
      this.ticketData = data;
      this.ticketData.file = []
      if (this.ticketData.ticketUserType === "Dimitra Admin") {
        this.step = 2;
        this.ticketUserType = "Dimitra Admin";
      } else {
        this.step = 3;
        this.ticketUserType = "Group of users";
        this.ticketData.userId = [...(new  Set([...this.ticketData.ticketSelectedUser.map(
          item => item.userId
        ), data.requesterId]))]
      }
      this.ticketData.startDate = this.formatDate(data.startDate);
      // delete this.ticketData.startDate
      this.ticketData.endDate = this.formatDate(data.endDate);
    },
      validateAllFields() {
    const refs = this.$refs;

    const isAreaValid = refs.areaOfRequest?.validate?.() ?? true;
    const isTypeValid = refs.type?.validate?.() ?? true;

    return  isAreaValid && isTypeValid;
  },
    async updateTicket() {
      try {
        // const res = await axios.put(
        //   `ticket/${this.ticketData.id}`,
        //   this.ticketData
        // );
        // if (res.data.success) {
        //   this.createTicketDialog = false;
        //   this.editDialog = false;
        //   this.notificationPopup = {
        //     status: true,
        //     msg: "Ticket updated successfully",
        //   };
        //   this.getTickets();
        // }
        this.startLoading();
        this.formHasErrors = false;
        if (this.ticketUserType === "Dimitra Admin") {
          // Object.keys(this.dimitraAdminForm).forEach((f) => {
          //   if (!this.dimitraAdminForm[f]) this.formHasErrors = true;
          //   this.$refs[f].validate(true);
          //   this.stopLoading();
          // });

          if (!this.formHasErrors) {
            this.ticketData.ticketUserType = this.ticketUserType;
            const formData = new FormData();
            for (const key in this.ticketData) {
              if (key in this.dimitraAdminForm) {
                formData.append(key, this.ticketData[key]);
              } else if (key === "file") {
                for (let i = 0; i < this.ticketData.file.length; i++) {
                  let file = this.ticketData.file[i];
                  formData.append("file[" + i + "]", file);
                }
              }
            }
            const res = await axios.put(
              `ticket/${this.ticketData.id}`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            )
            if (res.data.success) {
              this.createTicketDialog = false;
              this.notificationPopup = {
                status: true,
                msg: "Ticket updated successfully",
              };
              this.getTickets();
              this.stopLoading();
            } else {
              this.notificationPopup = {
                  status: true,
                  msg: res.data.message,
              };
              this.stopLoading();
            }
          }
        } else {

          if(!this.validateAllFields()) {
            this.$refs.areaOfRequest.validate(true);
            this.$refs.type.validate(true);
            this.formHasErrors = true;
          }

          console.log(this.formHasErrors, "formHasErrors")
          if (!this.formHasErrors) {
              console.log(this.formHasErrors, "formHasErrors11")
            const formData = new FormData();
            formData.append("changesMade", JSON.stringify(this.changesMadeObj));
            for (const key in this.ticketData) {
              if(Array.isArray(this.ticketData[key])) {
                formData.append(key, JSON.stringify(this.ticketData[key]));
              } else {
                formData.append(key, this.ticketData[key]);
              }
              if (key === "file") {
                for (let i = 0; i < this.ticketData.file.length; i++) {
                  let file = this.ticketData.file[i];
                  // console.log(file)
                  formData.append("file[" + i + "]", file);
                }
              }
            }
            // console.log(formData, 'formData')
            const res = await axios.put(
              `ticket/${this.ticketData.id}`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            )
            if (res.data.success) {
              this.createTicketDialog = false;
              this.notificationPopup = {
                status: true,
                msg: "Ticket updated successfully",
              };
              this.getTickets();
              this.stopLoading();
            } else {
              res.data.message.errors.forEach((err) => {
                this.notificationPopup = {
                  status: true,
                  msg: err.msg,
                };
              });
              this.stopLoading();
            }
          }
        }
         this.stopLoading();
      } catch (err) {
         this.stopLoading();
        console.log(err)
        this.notificationPopup = {
          status: true,
          msg:
            err &&
            err.response &&
            err.response.data &&
            err.response.data.message,
        };
      }
    },
    async deleteTicket() {
      const res = await axios.delete(`ticket/${this.selectedItemData.id}`);
      if (res.data.success) {
        this.deleteTicketDialog = false;
        this.notificationPopup = {
          status: true,
          msg: this.$t('tickets.messages.deleted.success'),
        };
        this.getTickets();
      }
    },
    async openCommentWindow(item) {
      this.chatWindow = true;
      this.selectedItemData = item;
    },
    async getAllAppUsers() {
      const res = await axios.get("ticket/getAllUsers");
      if (res.data.success) {
        this.allAppUsersData = res.data.data.map((user) => ({
          fullName: user.fullName,
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        }));
      }
    },
    async getAppUsersWithMembership() {
      const res = await axios.get(
        `ticket/users?page=1&limit=100000000&membershipTypes=${this.selectedMembershipType}&membershipValidity=${this.selectedMembershipValidity}&remainingDays=${this.remainingDays}`
      );
      if (res.data.success) {
        this.allAppUsersDataWithMembership = res.data.data.map((user) => ({
          fullName: user.fullName,
          email: user.email || "N/A",
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          membershipType: user.user_membership[0].membership_type,
          membershipValidity: this.formatDate(
            user.user_membership[0].UserMembershipMap.membershipExpiryDate
          ),
          status:
            this.formatDate(
              new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                .toISOString()
                .substr(0, 10)
            ) <=
            this.formatDate(
              user.user_membership[0].UserMembershipMap.membershipExpiryDate
            )
              ?  this.$t('active')
              : this.$t('deactivated'),
        }));
      }
    },
    async getAdminUsers() {
      const res = await axios.get("ticket/adminUsers");
      if (res.data.success) {
        // Process the data to add role information for display
        this.allAdminUsersData = res.data.data.map(user => {
          // Check if user has super_admin role
          const isSuperAdmin = user.admin_user_roles && user.admin_user_roles.some(role => 
            role.id === 'super_admin'
          );
          
          return {
            ...user,
            fullName: isSuperAdmin ? `${user.fullName} (Super Admin)` : user.fullName,
            isSuperAdmin: isSuperAdmin
          };
        });
      }
    },
    async getAreaOfRequests() {
      const res = await axios.get("ticket/areaOfRequest");
      if (res.data.success) {
        this.areaOfRequest = res.data.data;
      }
    },
    resetTicketData() {
      this.ticketData = {
        requestorName: "",
        requestorEmail: "",
        subject: "",
        description: "",
        status: "",
        priority: "",
        startDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10),
        endDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10),
        areaOfRequest: "Farms",
        type: "Question",
        asigneeId: "",
        ticketMedia: [],
        file: [],
      };
      this.editDialog = false;
      this.selected = [];
    },
    async getTickets() {
      this.loading = true;
      const res = await axios.get(
        `ticket?page=${this.options.page}&limit=${this.options.itemsPerPage}&searchPhrase=${this.searchTickets}&order=${this.orderByItemsVal}&userType=${this.ticketForItemsVal}`
      );
      if (res.data.success) {
        this.tickets = res.data.data.ticket;
        this.totalTickets = res.data.data.ticketCount;
        this.totalPages = Math.ceil(
          this.totalTickets / this.options.itemsPerPage
        );
        this.from = (this.options.page - 1) * this.options.itemsPerPage + 1;
        this.to =
          this.options.page * this.options.itemsPerPage -
          (this.options.itemsPerPage - this.tickets.length);
        this.loading = false;
      } else {
        this.noTickets = true;
      }
    },
    pageChange(t) {
      if (t) {
        this.options.page = this.options.page + 1;
        return;
      } else {
        this.options.page = this.options.page - 1;
        return;
      }
    },
    async createTicket() {
      this.startLoading();
      this.formHasErrors = false;
      console.log(Object.keys(this.dimitraAdminForm), "Object.keys(this.dimitraAdminForm)")
        console.log(this.$refs, "this.$refs[f]")
        Object.keys(this.dimitraAdminForm).forEach((f) => {
          if (!this.dimitraAdminForm[f]) this.formHasErrors = true;
           this.formHasErrors = this.$refs[f].validate(true) ? false : true;
        });

        if (!this.formHasErrors) {
          this.ticketData.ticketUserType = this.ticketUserType;
          const formData = new FormData();
          for (const key in this.ticketData) {
            formData.append(key, this.ticketData[key]);
            // console.log(key)
            if (key === "file") {
              for (let i = 0; i < this.ticketData.file.length; i++) {
                let file = this.ticketData.file[i];
                // console.log(file)
                formData.append("file[" + i + "]", file);
              }
            }
          }
          const res = await axios.post("ticket", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          if (res.data.success) {
            this.createTicketDialog = false;
            this.notificationPopup = {
              status: true,
              msg: this.$t('tickets.messages.created.success'),
            };
            this.getTickets();
            this.stopLoading();
          } else {
            res.data.message.errors.forEach((err) => {
              this.notificationPopup = {
                status: true,
                msg: err.msg,
              };
            });
            this.stopLoading();
          }
        }
          this.stopLoading();
    },
    resetSearchOnEmpty() {
      console.log("resetSearchOnEmpty");
      this.options.page = 1;
      this.debouncedFetchData();
    },
    debouncedFetchData: debounce(function () {
      this.getTickets();
    }, 500),
    getAreaOfRequestName(item) {
      const module = this.areaOfRequest.find((i) => i.id === item);
      if (module) {
        return module.name;
      }
      return item;
    },
    async markAsRead(ticketId) {
      const res = await axios.post("/ticket/markAsRead", {
        ticketId,
      });
      if (res.data.success) {
        this.notificationPopup = {
          status: true,
          msg: `#${ticketId} - ${this.$t('markAsRead')}`,
        };
        this.getTickets();
      } else {
        this.notificationPopup = {
          status: true,
          msg: this.$t('errors.somethingWentWrong'),
        };
      }
    },
    async getMembershipTypes() {
      const res = await axios.get(`user/membership`);
      if (res.data.success) {
        this.membershipTypes = res.data.data.listRes.rows;
      }
    },
    async openUserDialog(userId) {
      this.startLoading();
      this.showUserDialog = true;
      try {
        const { data } = await UserService.getUserDetails(userId);
        this.userDetails = data;
      } catch (e) {
        this.userDetails = null;
        this.$notify && this.$notify({ text: 'Failed to fetch user details', type: 'error' });
      } finally {
        this.stopLoading();
      }
    },
    closeUserDialog() {
      this.showUserDialog = false;
      this.userDetails = null;
    },
  },
  created() {
    this.getAllAppUsers();
    this.getAdminUsers();
    this.getAreaOfRequests();
    this.getAppUsersWithMembership();
    this.getMembershipTypes();
  },
  async mounted() {
    console.log("mounted111", this.$route.query);
    if( this.$route?.query?.ticketId) {
      this.searchTickets = this.$route.query.ticketId + ''|| '';
      this.resetSearchOnEmpty()
    }
    await this.getTickets();
  },
  watch: {
    options: {
      async handler() {
        await this.getTickets();
      },
      deep: true,
    },
    selected: {
      handler() {
        this.ticketData.userId = this.selected.map((item) => item.id);
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss">
 .responsive-image-pop {
    max-width: 100%;
    height: auto;
  }
.tickets-container .v-input__control {
  max-width: 200px;
}

.tickets-container .v-toolbar__content {
  padding: 0;
}

.tickets-container .first-col div p {
  font-size: 14px;
  color: #787486;
}

.tickets-container div p {
  font-size: 12px;
  color: #787486;
  margin-bottom: 0;
}

.tickets-container .col {
  position: relative;
}

.v-list-item__content .description-header {
  white-space: break-spaces;
  text-align: justify;
}

.tickets-container .col:after {
  content: "";
  height: 80%;
  width: 1px;
  position: absolute;
  right: 0;
  top: 10px;
  background-color: #c4c4c4;
}

.tickets-container .col:last-child:after {
  display: none;
}

.first-col .bold-text {
  font-weight: 600;
  font-size: 16px;
}

.bold-text {
  font-weight: 600;
  font-size: 13px;
}

.tickets-container .v-input--selection-controls {
  margin-top: 0;
  padding-top: 0;
}

.action-row {
  align-items: center;
  color: #0fbf68;
  padding: 12px;
}

.action-row label {
  color: #0fbf68 !important;
}

.message-sent {
  background-color: #f5f5f5;
  max-width: 400px;
  padding: 20px;
  border-radius: 8px 8px 0px 8px;
}

.message-received {
  background-color: #ccf2e3;
  max-width: 400px;
  padding: 20px;
  border-radius: 0px 8px 8px 8px;
}

.chat-container .v-card {
  max-height: 450px;
  overflow-y: scroll;
}

.filter-dialog.v-dialog {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  min-height: 100%;
  margin: 0;
}

.filter-dialog.v-dialog .v-card {
  min-height: 100%;
}

.v-sheet.v-card:not(.v-sheet--outlined) {
  box-shadow: none;
}

.ticket-row {
  background-color: #fafafa !important;
}

.odd-row {
  border: 1px solid #2e845a !important;
}

.required {
  color: red;
}

.ticket-description a {
  color: #1976d2;
  text-decoration: underline;
}

.ticket-description a:hover {
  color: #1565c0;
  text-decoration: none;
}

.clickable {
  cursor: pointer;
}

.super-admin-item {
  font-weight: 600;
}
</style>
<style lang="scss" scoped>
::v-deep .green-shadow:hover {
  background-color: $primary_color;
  color: white;
}

::v-deep .red-shadow:hover {
  background-color: $secondary-color;
  color: white;
}

.theme--light.v-image {
  margin-right: 10px;
  max-width: 100%;
  height: 40px;
}

::v-deep .img-center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 40%;
  max-height: 190px;
  max-width: 190px;
}

::v-deep .v-image__image{
  background-position: initial !important;
  background-size: contain;
}
</style>
