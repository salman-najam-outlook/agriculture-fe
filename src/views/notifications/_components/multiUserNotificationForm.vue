<template>
  <v-card flat min-height="300" class="pa-0">
    <v-stepper v-model="step" class="elevation-0 pa-0">
      <v-stepper-items>
      <v-stepper-content step="1">
    <v-card
      flat
    > 
    <v-card-text>
      <strong>{{ $t('pleaseCheckTickMark') }}</strong>
      <v-data-table
          :headers="headers"
          :items="items"
          :items-per-page="10"
          :loading="loading"
          :loading-text="$t('userslist.userLoading')"
          :footer-props="{
            'items-per-page-options': [10, 25, 50],
            'show-first-last-page': true,
            'show-current-page': true,
            'items-per-page-text': 'Users per page'
          }"
          :options.sync="tableOptions"
          :server-items-length="totalUsers"
          hide-default-footer
          show-select
          v-model="selected"
        >
          <template v-slot:top>
            <div class="d-flex mt-5">
              <v-text-field
                @click:append="searchUsers"
                @input="searchUsers"
                :placeholder="$t('search')"
                class="shrink"
                dense
                height="5px"
                outlined
                prepend-inner-icon="mdi-magnify"
                v-model="search"
              />
              <v-spacer></v-spacer>

              <div class="py-1 mx-4 title" v-if="selected && selected.length">
                <span class="selected-users">{{selected.length}}</span> {{$t('usersSelected')}}
              </div>
              <template
                v-if="userType != 'admin'"
              >
                <div class="py-1 title">{{$t('filterBy')}}</div>
                <v-btn
                  @click="$emit('filter:show')"
                  class="mx-2"
                  color="primary"
                  icon
                >
                  <v-icon dark large>
                    mdi-filter
                  </v-icon>
                </v-btn>
              </template>
              <v-btn
                @click="$emit('filter:clear')"
                class="mr-5"
                color="primary"
                height="45"
                max-width="175"
                outlined
                v-if="dataFiltered"
                width="175"
              >
                <span class="">{{$t('clearAllFilters')}}</span>
              </v-btn>
              <v-btn
                @click="pageChange(false)"
                :disabled="tableOptions.page<=1"
                class="mx-2"
                color="primary"
                fab
                outlined
                small
              >
                <v-icon dark>
                  mdi-chevron-left
                </v-icon>
              </v-btn>
              <v-btn
                @click="pageChange(true)"
                :disabled="tableOptions.page>=totalPages"
                class="mx-2"
                color="primary"
                fab
                outlined
                small
              >
                <v-icon dark>
                  mdi-chevron-right
                </v-icon>
              </v-btn>
            </div>
          </template>

          <template v-slot:progress>
            <v-progress-linear
              :height="6"
              color="primary"
              indeterminate
            />
          </template>
          <template
            v-if="items.length < 1"
            v-slot:no-data
          >
            {{ $t('userslist.noUser')}}
          </template>

          <template v-if="items.length > 0" v-slot:body="{ items }">
            <tbody>
              <tr
                :key="index"
                style="position: relative; width: 0; height: 0"
                v-for="(item, index) in items"
              >
                <td>
                  <v-checkbox
                    @change="selectItem(item)"
                    :input-value="isSelected(item)"
                    label=""
                  ></v-checkbox>
                </td>
                <td>{{ item.fullName ? item.fullName : 'N/A' }}</td>
                <td class="capitlize"> {{ item.email  ? item.email : 'N/A' }}</td>
                <td class="capitlize"> {{ (item.activation  && item.activation.membership_assoc && item.activation.membership_assoc.membership_type) || 'N/A' }}</td>
                <!-- <td class="capitlize d-flex align-center"> 
                  <div class="square" :style="[ (item.email == null) ? { 'background': 'red'} : { 'background': 'green' }]"></div>
                  <span class="ml-1">{{ item.activation != null ? item.activation.membershipValidity : 'N/A' }}</span>
                </td> -->
                <td class="capitlize text-center"> 
                  <v-btn
                    :class="item.active == '1' ? 'primary--text': 'red--text'"
                    :color="item.active == '1' ? 'green2': 'red2'"
                    class="xxxx"
                    depressed
                    height="34"
                    min-width="120"
                    rounded
                    x-small 
                  >
                    {{ item.active == 1 ? 'Active' : 'Deactivated' }}
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-data-table>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions class="mt-7">
      <v-spacer></v-spacer>
        <v-btn
         
          color="primary"
          outlined
          @click="$emit('closeMultiUser', false)"
        >
        {{$t('cancel')}}
        </v-btn>

        <v-btn
          @click="step=2"
          color="primary"
          :disabled="!selected.length"
        >
        {{$t('continue')}}
        </v-btn>
      </v-card-actions>
    </v-card>
      </v-stepper-content>
      <v-stepper-content step="2">
        <v-card flat class="pa-0">
          <strong>Notification Message</strong>
            <v-textarea
              placeholder="Enter notificatin message here."
              outlined
              rows="5"
              row-height="15"
              v-model="message"
          ></v-textarea>
          <v-card-actions class="mt-7">
          <v-spacer></v-spacer>
            <v-btn
              @click="step=1"
              color="primary"
              outlined
            >
            {{$t('back')}}
            </v-btn>

            <v-btn
              @click="createMultiUserNotification"
              color="primary"
              :disabled="(!message.length)"
            >
            {{$t('continue')}}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-card>
</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin"

import UserService from "@/_services/UserService"
import NotificatinService from "@/_services/NotificatinService"

export default {
  computed: {
    headers() {
      return [
        {
          align: 'start',
          class: "black--text",
          sortable: true,
          text: this.$t('name'),
          value: 'firstName',
        },
        { 
          class: "black--text",
          sortable: true,
          text: this.$t('email'),
          value: 'email',
        },
        { 
          class: "black--text",
          sortable: false,
          text: this.$t('userslist.membershipType'),
          value: 'role',
        },
        // { 
        //   class: "black--text",
        //   sortable: false,
        //   text: this.$t('Membership Validity'),
        //   value: 'role',
        // },
        { 
          align: 'center',
          class: "black--text",
          sortable: true,
          text: this.$t('status'),
          value: 'active',
        },
      ];
    },
  },

  data() {
    return {
      dataFiltered: false,
      from: 0,
      items: [],
      loading: false,
      search: '',
      selected: [],
      showingRows: 0,
      tableOptions: {},
      to:0,
      totalPages: 1,
      totalUsers: 0,
      step: 1,
      message: ""
    }
  },

  methods: {
    getUsers() {
      this.loading = true;

      UserService.getUsers(this.tableOptions, this.userType, this.search, this.filterParam)
        .then( res => {
          if(res.success){
            this.items = res.data.rows;
            this.totalUsers = res.data.count;
            this.showingRows = res.data.rows.length;
            this.totalPages = Math.ceil(this.totalUsers / this.tableOptions.itemsPerPage)
            this.from = (((this.tableOptions.page - 1) * this.tableOptions.itemsPerPage) + 1)
            this.to = (this.tableOptions.page * this.tableOptions.itemsPerPage) - (this.tableOptions.itemsPerPage - res.data.rows.length)
          }
        })
      .catch(err => {
        this.items = [];

        console.log(err);
      })
      .finally(() => {
        this.loading = false;
      })
    },

    isSelected(item) {
      return !!this.selected.find(selectedItem => selectedItem.id === item.id);
    },

    onClearFilter() {
      console.log('should be here');
      this.dataFiltered = false;

      this.getUsers();
    },

    onSearchFilter() {
      this.dataFiltered = true;

      this.getUsers();
    },

    pageChange(t){
      this.tableOptions.page = t
        ? this.tableOptions.page + 1
        : this.tableOptions.page - 1;
    },

    resetSearchOnEmpty() {
      if(this.search != '') return;

      this.tableOptions.page = 1;

      this.getUsers();
    },

    searchUsers() {
      this.tableOptions.page = 1;

      this.getUsers();
    },

    selectItem (item) {
      const itemIndex = this.selected.findIndex(selectedItem => selectedItem.id === item.id);

      if (itemIndex > -1) {
        this.selected = this.selected.filter(selectedItem => selectedItem.id !== item.id);
      } else {
        this.selected.push(item);
      }
    },

    createMultiUserNotification(){
      // console.log(this.message.length)
      this.startLoading()
      const userIds = this.selected.map(a => a.id)
      const notificationD = {
          notify: this.userType == 'admin' ? 'admin' : 'user',
          message: this.message,
          users: userIds
      }
      // console.log('users',notificationD)
      
      NotificatinService.createNotifications(notificationD)
      .then((data) => {
        console.log('data', data)
        this.selected = [];
        this.$notify({
            title: 'Notification Created',
            text: 'Notification created successfully.',
            type: 'success'
        });
        this.$emit('closeMultiUser', true)
        this.stopLoading()
      })
      .catch( err => {
        console.log('createErrr', err)
        this.$notify({
            title: 'Unable to create notification',
            text: 'server error',
            type: 'error'
        });
        this.stopLoading()
      })
    }
  },

  mixins: [loadingMixin],

  props: {
    clearFilters: {
      default: false,
      type: Boolean,
    },
    filterParam: {
      required: true,
      type: Object,
    },
    searchFilters: {
      default: false,
      type: Boolean,
    },
    userType: {
      default: 'end_user',
      type: String,
    }
  },

  watch: {
    clearFilters: {
      handler () {
        if (this.clearFilters) {
          this.onClearFilter();
        }
      }
    },

    searchFilters: {
      handler () {
        if (this.searchFilters) {
          this.onSearchFilter();
        }
      }
    },

    tableOptions: {
      handler () {
        this.getUsers();
      },
      deep: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.selected-users {
  border-radius: 50px;
  background-color: #00bd73;
  color: #fff;
  padding: 9px 13px;
  font-size: 10px;
}
</style>
