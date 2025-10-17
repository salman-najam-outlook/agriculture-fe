<template>
    <div>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <div class="d-flex mb-4 align-center">
                <h2>{{$t("notifications")}}</h2>
                <v-spacer></v-spacer>
                <v-btn @click="$router.push({name: 'NotificationSent'})" color="primary" text>{{$t('sendNotifications')}}</v-btn>
                <h5>{{$t("viewNotifications")}}</h5>
                <div class="d-flex align-center ml-2 mr-4">
                    <v-select
                        style="width: 137px; background-color: white; height: 40px;"
                        :items="viewNotificationTypeOptions"
                        placeholder="Select"
                        outlined
                        dense
                        v-model="viewNotificationType"
                        item-text="label"
                        item-value="id"
                        @change="getNotification"
                        class="mr-2"
                    ></v-select>
                    <v-checkbox
                        v-bind:label="$t('createNotification')"
                        class="mt-4"
                        @change="markAllRead($event)"
                    ></v-checkbox>
                </div>

                <CreateNotification @notificaitonCreated="notificaitonCreated"/>
                <v-btn
                    class="mx-2"
                    fab
                    small
                    outlined
                    color="primary"
                    :disabled="page<=1"
                    @click="pageChange(false)"
                >
                    <v-icon dark>
                        mdi-chevron-left
                    </v-icon>
                </v-btn>
                <v-btn
                    class="mx-2"
                    fab
                    small
                    outlined
                    color="primary"
                    :disabled="page>=totalPages"
                    @click="pageChange(true)"
                >
                    <v-icon dark>
                        mdi-chevron-right
                    </v-icon>
                </v-btn>
            </div>
            
            <v-card
                elevation="0"
                class="px-5"
            >
                <v-card-text>
                    
                    <template v-if="!mixingIsLoading">
                        <div v-if="!notificationsData.length">
                            <v-list >
                                <v-list-item-group>
                                    <v-list-item class="d-flex justify-center">
                                       {{$t("youAreUpToDate")}}
                                    </v-list-item>
                                </v-list-item-group> 
                            </v-list>
                        </div>
                        <div v-else>
                            <div
                                v-for="item in notificationsData"
                                :key="item.id"
                                :class="`${item.notificationTo.seen == '1' ? 'notification-seen' : 'notification-unseen'} notification`"
                                style="margin-bottom: 19px;"
                            >
                                <v-row no-gutters class="cursor-pointer" @click="clickNotification(item)">
                                    <v-col cols="2" class="">
                                        <v-avatar size="90">
                                            <img :src="item.notificationBy.profilePicUrl?item.notificationBy.profilePicUrl:'/img/user.jpg'"/>
                                        </v-avatar>
                                    </v-col>
                                    <v-col cols="9" class="ml-n15">
                                        <div style="padding: 10px 0;">
                                            <!-- <span class="notification_username">{{ item.notificationBy.firstName }}</span> -->
                                            <span class="notification_time">{{getLocalizedTimeAgo(item.createdAt)}}</span>
                                        </div>
                                        <div :class="`${item.notificationTo.seen == '1' ? 'notification_description-seen' : 'notification_description-unseen'} notification_description`">
                                            {{item.message}}
                                        </div>
                                        <div v-if="item.type == 'ddr_additional_information'">
                                            <p> 
                                                Message from {{item?.notificationBy?.firstName}} {{item?.notificationBy?.lastName}} :
                                                <br>
                                                {{item?.data?.message}}
                                            </p>
                                        </div>
                                    </v-col>
                                    <v-col cols="1" style="text-align: right;">
                                      <v-tooltip bottom v-if="item.type === 'geo_json_file'"

                                      >
                                        <template v-slot:activator="{ on, attrs }">
                                          <a :href="item.data.fileDownloadUrl" download>
                                          <v-btn
                                              icon
                                              dark
                                              class="delete-icon"
                                              v-bind="attrs"
                                              v-on="on"
                                          >
                                            <v-icon class="gray--text">mdi-download</v-icon>
                                          </v-btn>
                                          </a>
                                        </template>
                                        <span>{{$t("Download File")}}</span>
                                      </v-tooltip>
                                        <v-tooltip bottom
                                            v-if="item.notificationTo.seen == '0'"
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn 
                                                    icon 
                                                    dark 
                                                    class="delete-icon mx-2"
                                                    v-bind="attrs"
                                                    v-on="on" 
                                                    @click="markRead(item)"
                                                >
                                                    <v-icon class="gray--text">mdi-email-open</v-icon>
                                                </v-btn>
                                            </template>
                                            <span>{{$t("markAsRead")}}</span>
                                        </v-tooltip>
                                        
                                    </v-col>
                                </v-row>
                            </div>
                        </div>
                    </template>
                    <ColSkeletonLoader v-if="mixingIsLoading" :clms="2" :wdh="12"/>  
                </v-card-text>
            </v-card>
        </v-container>
    </div>
</template>

<script>
import moment from "moment";
import loadingMixin from "@/mixins/LoadingMixin"

import CreateNotification from './_components/create.vue';
import NotificatinService from "@/_services/NotificatinService"
import ColSkeletonLoader from '../../components/col-skeleton-loader.vue';

export default {
    mounted(){
        const fetchData = () => {
            this.getNotification()
        }

        fetchData()
    },
    components: {
        CreateNotification,
        ColSkeletonLoader
    },

  data() {
    return {
        breadcrumbs: [
            {
            disabled: false,
            exact: true,
            text: this.$t('dashboard'),
            to: { name: 'Users'},
            },
            {
            disabled: true,
            href: 'breadcrumbs_link_1',
            text: this.$t('notifications'),
            },
        ],
        notifications: [
            { id: 1, user: "Malcolm Satchel", datetime: new Date(), text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a rhoncus augue. Nam rutrum eget nisi in commodo. Proin rhoncus ultricies bibendumLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a rhoncus augue. Nam rutrum eget nisi in commodo. Proin rhoncus ultricies bibendumLorem ipsum dolor sit amet.", seen: false },
            { id: 2, user: "DIMITRA", datetime: new Date(), text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a rhoncus augue. Nam rutrum eget nisi in commodo...", seen: false },
            { id: 3, user: "Malcolm Satchel", datetime: new Date(), text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a rhoncus augue. Nam rutrum eget nisi in commodo...", seen: false },
            { id: 4, user: "Server", datetime: new Date(), text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a rhoncus augue. Nam rutrum eget nisi in commodo...", seen: true },
            { id: 5, user: "Malcolm Satchel", datetime: new Date(), text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a rhoncus augue. Nam rutrum eget nisi in commodo...", seen: true },
            { id: 6, user: "Server", datetime: new Date(), text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed a rhoncus augue. Nam rutrum eget nisi in commodo...", seen: true },
        ],
        viewNotificationType: 1,
        viewNotificationTypeOptions: [
            { id: 1, label: this.$t('all') },
            { id: 2, label: this.$t('read') },
            { id: 3, label: this.$t('unread') },
        ],
        notificationsData: [],
        page: 1,
        itemsPerPage: 5,
        totalPages: 1,
        totalNotification: 0,
        unreadNotificationCount: 0,
        unreadNotificatins: []
    }
  },

  methods: {
    getTimeFromNow(time) {
      return moment(time).fromNow();
    },
     getLocalizedTimeAgo(time) {
  const now = moment();
  const diffMinutes = now.diff(moment(time), 'minutes');

  if (diffMinutes < 60) {
    return diffMinutes === 1 ? this.$t('timeAgo.minute') : this.$t('timeAgo.minutes', { count: diffMinutes });
  } 

  const diffHours = now.diff(moment(time), 'hours');
  if (diffHours < 24) {
    return diffHours === 1 ? this.$t('timeAgo.hour') : this.$t('timeAgo.hours', { count: diffHours });
  }

  const diffDays = now.diff(moment(time), 'days');
  if (diffDays < 30) {
    return diffDays === 1 ? this.$t('timeAgo.day') : this.$t('timeAgo.days', { count: diffDays });
  }

  const diffMonths = now.diff(moment(time), 'months');
  if (diffMonths < 12) {
    return diffMonths === 1 ? this.$t('timeAgo.month') : this.$t('timeAgo.months', { count: diffMonths });
  }

  const diffYears = now.diff(moment(time), 'years');
  return diffYears === 1 ? this.$t('timeAgo.year') : this.$t('timeAgo.years', { count: diffYears });
},
    
    async getNotification(){
        this.startLoading()
        const notificationFilters = {
            seen: this.viewNotificationType == 1 ? null : (this.viewNotificationType == 2 ? 1 : 0),
            page: this.page,
            limit: this.itemsPerPage,
        }
        this.notificationsData = [];
        NotificatinService.getNotifications(notificationFilters)
            .then((data) => {
                const notificationData = data.data
                this.notificationsData = notificationData.notification.rows
                this.totalNotification = notificationData.notification.totalCount
                this.totalPages = Math.ceil(this.totalNotification/this.itemsPerPage)
                // console.log('noti', this.notificationsData)
                
                this.stopLoading()
            }).catch((err) => {
                console.log(err)
                this.stopLoading()
            });
    },
    pageChange(t){
        if(t)
            this.page = this.page+1
        else
            this.page = this.page-1

        this.getNotification()
    },

    notificaitonCreated(){
        this.getNotification()
    },

    async markAllRead(event){
              this.startLoading();
        if(!event) return 
        await this.getUnreadNotificationCount()
        // const notiIds = this.notificationsData.filter(a => a.notificationTo.seen == 0)
        const ids = this.unreadNotificatins.map(a => a.id)
        if(!ids.length) return 

        NotificatinService.readNotification(ids)
        .then(() => {
            this.getNotification()
        }).catch((err) => {
            console.log(err)
        });
              this.stopLoading();
    },

    markRead(noti){
        NotificatinService.readNotification([noti.id])
        .then(() => {
            this.getNotification()
        }).catch((err) => {
            console.log(err)
        });
    },

    async getUnreadNotificationCount(){
              this.startLoading();
        await NotificatinService.getNotifications({seen: 0})
        .then((data) => {
            const notificationData = data.data
            this.unreadNotificationCount = notificationData.notification.totalCount
            this.unreadNotificatins = notificationData.notification.rows
            
        }).catch((err) => {
            console.log(err)
        });
              this.stopLoading();
    },
    clickNotification(notificationItem) {

      if (notificationItem.type === "ddr_additional_information") {
        this.$store.dispatch('eudrDDS/setDdsAdditionalInformationData', {
          ddrId: notificationItem?.data?.ddrId,
          ddrAdditionalInformationId: notificationItem?.data?.dueDiligenceRequestAdditionalInformationId
        });
        this.$store.dispatch('SET_DDS_TAB', {
          activeTab: 1
        }).then(() => {
          this.$router.push({ 
            name: 'createDueDiligenceReports',
            params: { id: notificationItem?.data?.ddrId, show: 'show' },
            query: {
              ddrAdditionalInformationId: notificationItem?.data?.dueDiligenceRequestAdditionalInformationId
            }
          }).then(() => {
            window.location.reload();
          });
        })
      } else if (notificationItem.type === "ticket_assigned") {
        console.log("ticket_assigned", notificationItem.data.data.ticketId);
        this.$router.push({
          name: 'ViewTickets',
          query: {
            ticketId: notificationItem?.data?.data?.ticketId
          }
        });
      }
    }
  },

  mixins: [loadingMixin],
}
</script>

<style lang="scss" scoped>
    ::v-deep .unread-noti {
        background-color: $green2;
    }
.delete-icon {
    background: #FFFFFF;
    box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.25);
    cursor: pointer;
}

.notification {
    padding: 17px 14px 17px;
    border-radius: 5px;
    background-color: #FAFAFA;

    &_description {
        font-size: 15px;
        line-height: 22px;
        color: #595959;

        &-seen {
            font-weight: 400;
        }

        &-unseen {
            font-weight: 600;
        }
    }

    &_img {
        border-radius: 50%;
        width: 60px;
    }

    &-unseen {
        border: 1px solid $secondary-color;
    }

    &-seen {
        border: none;
    }

    &_time {
        font-weight: 500;
        font-size: 13px;
        line-height: 24px;
        color: #626568;
    }

    &_username {
        font-weight: 600;
        font-size: 15px;
        line-height: 23px;
        border: none;
        color: #000000;
        padding-right: 22px;
    }

    
}
.cursor-pointer {
    cursor: pointer;
}
</style>
