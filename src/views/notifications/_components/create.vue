<template>
  <div class="c-create-notification">
    <v-dialog
      @click:outside="closeModal"
      class="c-create-notification__modal"
      v-model="dialog"
      width="900"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="mr-3 ml-3"
          color="primary"
          dark
          small
          v-bind="attrs"
          v-on="on"
        >
          {{$t("createNotification")}}
        </v-btn>
      </template>

      <v-card>
        <v-toolbar
          color="primary"
          class="white--text"
          flat
          :elevation="0"
        >
          <v-toolbar-title class="font-weight-bold">
            {{$t("createNotification")}}
          </v-toolbar-title>
          <v-spacer></v-spacer>

          <v-btn icon class="white--text" @click="closeModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

          <v-card-text class="pa-0">
            <template v-if="showNotificationType">
              <v-row no-gutters class="px-5">
                <v-col cols="12">
                  <v-radio-group v-model="notificationType">
                    <v-radio
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                      v-for="(item, index) in notificationTypes"
                    ></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
            </template>
            <template v-else-if="showSingleNotification">
              <v-row>
                <v-col cols="6">
                  <label for="name">Requester Name<span class="red--text">*</span></label>
                  <v-autocomplete
                    :items="users"
                    :placeholder="'Select'"
                    :rules="rules.name"
                    dense
                    item-text="name"
                    item-value="id"
                    outlined
                  />
                </v-col>
                <v-col cols="6">
                  <label for="email">Requester Email<span class="red--text">*</span></label>
                  <v-text-field
                    :error-messages="errors.email"
                    :rules="rules.email"
                    dense
                    outlined
                    placeholder=""
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <label for="message">Message<span class="red--text">*</span></label>
                  <v-textarea
                    :error-messages="errors.message"
                    :rules="rules.message"
                    :placeholder="'Enter your message here'"
                    auto-grow
                    solo
                  />
                </v-col>
              </v-row>
            </template>
            <template v-else-if="showMultipleUserNotification">
              <multi-user-notification-form
                @filter:show="onShowFilter"
                @filter:clear="onClearFilter"
                :clearFilters="clearFilters"
                :filterParam="filterParam"
                :searchFilters="searchFilters"
                @closeMultiUser="closeMultiUser"
              />
            </template>
            <template v-else-if="showMultipleAdminNotification">
              <multi-user-notification-form
                @filter:show="onShowFilter"
                @filter:clear="onClearFilter"
                :clearFilters="clearFilters"
                :filterParam="filterParam"
                :searchFilters="searchFilters"
                userType="admin"
                @closeMultiUser="closeMultiUser"
              />
            </template>

            <v-divider  v-if="showNotificationType"></v-divider>

            <v-card-actions v-if="showNotificationType" class="c-create-notification__actions">
              <v-btn
                @click="closeModal"
                color="primary"
                outlined
              >
                {{$t('cancel')}}
              </v-btn>

              <v-btn
                @click="showNotificationType ? onNotificationTypeSelection() : submit()"
                color="primary"
              >
                {{ showNotificationType ? this.$t('continue') : this.$t('confirm') }}
              </v-btn>
            </v-card-actions>
          </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      @click:outside="onCloseFilter"
      content-class="my-custom-dialog"
      transition="dialog-bottom-transition"
      v-model="showFilters"
      width="356"
    >
      <v-card
        class=""
        min-height="100vh"
        rounded="0"
      >
        <v-toolbar
          :elevation="0"
          class="white--text"
          color="primary"
          flat
        >
          <v-toolbar-title class="font-weight-bold">{{ this.$t('filterBy') }}</v-toolbar-title>
          <v-spacer></v-spacer>

          <v-btn icon class="white--text" @click="onCloseFilter">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pt-5">
          <v-row no-gutters>
            <v-col cols="12">
              <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">{{ this.$t('userslist.membershipType') }}</label>
              <v-select
                :items="membershipList"
                dense
                item-text="membership_type"
                item-value="id"
                outlined
                :placeholder="$t('select')"
                v-model="filterParam.membership_type"
              />
            </v-col>
            <v-col cols="12">
                <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">{{ this.$t('userslist.membershipValidity') }}</label>
                <v-select
                  :items="membershipTypes"
                  item-text="text"
                  item-value="value"
                  dense
                  outlined
                  :placeholder="$t('select')"
                  v-model="filterParam.membership_validity"
                />
            </v-col>

            <v-col cols="12" v-if="filterParam.membership_validity == 'custom'">
              <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">{{ this.$t('numOfDaysRemaining') }}</label>
              <v-text-field
                dense
                min="1"
                outlined
                type="number"
                value=""
                v-model="filterParam.membershipRemainingDays"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="d-flex justify-space-around">
              <v-btn outlined @click="onClearFilter" width="130" color="primary">
                {{ this.$t('clearAll') }}
              </v-btn>
              <v-btn width="130" @click="onSearchFilter" color="primary">
                {{ this.$t('search') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>  
</template>

<script>
import generalMixin from "@/mixins/GeneralMixin";

import ActivationKeyService from "@/_services/ActivationService.js"

import MultiUserNotificationForm from './multiUserNotificationForm.vue';

export default {
  components: {
    MultiUserNotificationForm,
  },

  computed: {
    notificationTypes() {
      return [
        // {
        //   label: 'Create Notification for a Single User',
        //   value: 1,
        // },
        {
          label:  this.$t('createNotificationForGroup'),
          value: 2,
        },
        {
          label: this.$t('createNotificationForDimitra'),
          value: 3,
        },
      ];
    }
  },

  data() {
    return {
      clearFilters: false,
      dialog: false,
      errors: { email: '', message: '', name: '' },
      filterParam: {
        membership_type: '',
        membership_validity: '',
        membershipRemainingDays: 0,
      },
      membershipList: [],
      membershipTypes: [
        {text: this.$t('membership.validityLength.lessThan1Month'), value: 'lessThen1Month'},
        {text: this.$t('membership.validityLength.oneTo8Months'), value: '1-8Months'},
        {text: this.$t('membership.validityLength.sixTo12Months'), value: '6-12Months'},
        {text: this.$t('membership.validityLength.moreThan1Month'), value: 'moreThan1Year'},
        {text: this.$t('membership.validityLength.expired'), value: 'expired'},
        {text: this.$t('membership.validityLength.custom'), value: 'custom'},
      ],
      notificationType: null,
      rules: {
        email: [
            v => !!v || this.$t('emailIsRequired'),
            v => this.validateEmail(v) || this.$t('emailIsInvalid'),
        ],
        message: [
          v => !!v || this.$t('messageIsRequired'),
        ],
        name: [
            v => !!v || this.$t('requesterNameIsRequired'),
        ],
      },
      searchFilters: false,
      showFilters: false,
      showNotificationType: true,
      showSingleNotification: false,
      showMultipleUserNotification: false,
      showMultipleAdminNotification: false,
    }
  },

  methods: {
    closeModal() {
      this.showNotificationType = true;
      this.showSingleNotification = false;
      this.showMultipleUserNotification = false;
      this.showMultipleAdminNotification = false;
      this.dialog = false;
    },

    onClearFilter() {
      this.clearFilters = true;
      this.searchFilters = false;
      this.showFilters = false;
      this.filterParam.membership_type = '';
      this.filterParam.membership_validity = '';
      this.filterParam.membershipRemainingDays= null;
    },

    onCloseFilter() {
      this.showFilters = false;
    },

    onSearchFilter() {
      this.clearFilters = false;
      this.searchFilters = true;
      this.showFilters = false;
    },

    onShowFilter() {
      this.showFilters = true;
    },

    onNotificationTypeSelection() {
      this.showNotificationType = false;
      this.showSingleNotification = false;
      this.showMultipleUserNotification = false;
      this.showMultipleAdminNotification = false;

      if (this.notificationType === 1) {
        this.showSingleNotification = true;
      } else if (this.notificationType === 2) {
        this.showMultipleUserNotification = true;
      } else {
        this.showMultipleAdminNotification = true;
      }
    },

    submit() {
      // create notification
    },
    closeMultiUser(){
      this.$emit('notificaitonCreated')
      this.closeModal()
      this.onClearFilter()
    }
  },

  mixins: [generalMixin],

  mounted() {
    const fetchData = async () => {
      const [mt] = await Promise.all([ActivationKeyService.getAllMemberships()]);

      this.membershipList = mt.data.listRes;
    }
    fetchData();
  },
}
</script>

<style lang="scss">
.c-create-notification {
  &__actions {
    justify-content: flex-end;
  }
}
</style>

<style lang="scss" scoped>
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

</style>
