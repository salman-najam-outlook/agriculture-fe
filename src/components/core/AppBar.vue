<template>
  <v-app-bar app class="elevation-1">
    <v-app-bar-nav-icon @click.stop="setDrawer(!drawer)"></v-app-bar-nav-icon>

    <!-- <img width="140" src="@/assets/Dimitra_logo_white.png" class="mr-12 " /> -->
    <!-- <v-toolbar-title class="ml-2">
           DIMITRA
        </v-toolbar-title> -->

    <v-spacer></v-spacer>

    <template v-if="!isMobile()">
      <!-- <v-btn class="ml-4" icon dark>
                <v-icon class="gray--text">mdi-cog-outline</v-icon>
            </v-btn> -->
      <!-- <div class="text-center">
                <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn icon dark v-bind="attrs" v-on="on">
                            <v-badge dot color="error" overlap>
                                <v-icon class="gray--text">mdi-bell-outline</v-icon>
                            </v-badge>
                        </v-btn>
                    </template>

                    <v-list subheader three-line>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>Example Notification 1</v-list-item-title>
                                <v-list-item-subtitle>Subtext here</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                    </v-list>
                    <v-btn block>clear all notifications</v-btn>
                </v-menu>
            </div> -->

      <!-- download history -->
      <v-menu :close-on-content-click="false" offset-y max-height="30rem" left v-model="downloadOpen">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon dark v-bind="attrs" v-on="on">
            <v-icon class="gray--text">mdi-tray-arrow-down</v-icon>
          </v-btn>
        </template>
        <v-card class="mx-auto pb-5" max-width="670" width="670px" flat>
          <v-toolbar light flat class="black--text">
            <v-toolbar-title>{{ $t("dueDiligence.downloadProgressStatus") }}</v-toolbar-title>
          </v-toolbar>
          <v-list v-if="!downloadData.length">
            <v-list-item-group>
              <v-list-item class="d-flex justify-center">
                {{$t("activationKey.noDataFound")}}
              </v-list-item>
            </v-list-item-group> 
          </v-list>
          <v-list two-line>
            <v-divider></v-divider>

            <v-list-item-group active-class="primary--text" multiple>
              <v-list-item v-for="(item, index) in downloadData" :key="index" two-line>
                <v-list-item-avatar style="border-radius: 0;">
                  <img src="/img/eudr-dds/pdf-icon.svg" class="pr-2" width="30px"/>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="font-weight-medium">
                    {{ item.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <template v-if="item.status === 'INPROGRESS'">
                      <span class="orange--text">{{ $t("dueDiligence.inProgress") }}</span> 
                    </template>
                    <template v-else-if="item.status === 'COMPLETED'">
                      <span class="green--text">{{ $t("dueDiligence.downloadCompleted") }}</span>
                    </template>
                    <template v-else>
                      <span class="red--text">{{ $t("dueDiligence.downloadFailed") }}</span>
                    </template>
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <a v-if="item.status === 'COMPLETED'" icon :href=item.fileUrl target="_blank">
                    <v-icon>mdi-download</v-icon>
                  </a>
                  <span v-else-if="item.status=='INPROGRESS'">
                    {{ $t("dueDiligence.estimatedTime") }}: {{ item.estimatedTime }}
                  </span>
                </v-list-item-action>
              </v-list-item>
            <v-divider></v-divider>

            </v-list-item-group>
          </v-list>
          <div class="text-center">
            <h4 class="view_all_notifications" @click="showAllDownloads">
              {{ $t("dueDiligence.showAllDownloads") }}
            </h4>
          </div>
        </v-card>
      </v-menu>


      <v-divider vertical></v-divider>

      <v-menu 
        v-if="!isSubEnterprise"
        :close-on-content-click="false"
        offset-y
        max-height="30rem"
        left
        v-model="notiOpen"
      >
        <template v-slot:activator="{ on, attrs }">
          <div>
            <v-btn @click="getNotification" icon dark v-bind="attrs" v-on="on">
              <v-badge
                color="green"
                :content="unreadNotificationCount"
                overlap
                :value="unreadNotificationCount"
              >
                <v-icon class="gray--text">{{
                  true ? "mdi-bell-outline" : "mdi-bell-badge-outline"
                }}</v-icon>
              </v-badge>
            </v-btn>
          </div>
        </template>
        <v-card class="mx-auto pb-5" max-width="670" width="670px" flat>
          <v-toolbar light flat class="black--text">
            <v-toolbar-title>{{$t("notifications")}}</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-select
              style="max-width: 120px; max-height: 20px;"
              :items="viewNotificationTypeOptions"
              placeholder="Select"
              outlined
              dense
              v-model="viewNotificationType"
              item-text="label"
              item-value="id"
              class="mr-5"
              @change="notificationByType"
            ></v-select>
            <v-checkbox
              style="max-height: 20px;"
              v-bind:label='$t("markAllAsRead")'
              class="mt-4"
              @change="markAllRead($event)"
              :disabled="unreadNotificationCount.length > 1"
            ></v-checkbox>
          </v-toolbar>
          <!-- <ColSkeletonLoader
            class="mt-5"
            v-if="loader"
            :clms="2"
            :wdh="12"
            lines="one"
          /> -->
          <v-list v-if="!notificationsData.length">
            <v-list-item-group>
              <v-list-item class="d-flex justify-center">
                {{$t("youAreUpToDate")}}
              </v-list-item>
            </v-list-item-group>          </v-list>
          <!-- <v-list two-line> -->
          <v-list two-line v-else>
            <v-list-item-group active-class="primary--text" multiple>
              <div v-for="(item, index) in notificationsData" :key="`${item.title}-${item.id}`">
                <v-list-item
                @click="clickNotification(item)"
                  :class="{
                    'unread-noti':
                      item.notificationTo.seen == '0' ? true : false,
                  }"
                >
                  <template v-slot:default="{}">
                    <v-list-item-avatar>
                      <v-img
                        :src="
                          item.notificationBy.profilePicUrl
                            ? item.notificationBy.profilePicUrl
                            : '/img/user.jpg'
                        "
                      ></v-img>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-subtitle
                        v-text="item.message"
                      ></v-list-item-subtitle>
                      <v-list-item-title>&nbsp;</v-list-item-title>
                      <v-list-item-subtitle class="see-details" @click.stop="showAllNotification" v-if="item.type === 'ddr_additional_information'">{{ $t("seeDetails") }}</v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-list-item-action-text>
                        {{ getLocalizedTimeAgo(item.createdAt) }} <br />
                        {{ getDateFormat(item.createdAt) }}
                      </v-list-item-action-text>
                    </v-list-item-action>
                  </template>
                </v-list-item>

                <v-divider
                  v-if="index < notificationsData.length - 1"
                ></v-divider>
              </div>
            </v-list-item-group>
          </v-list>
          <div class="text-center">
            <h4 class="view_all_notifications" @click="showAllNotification">
              {{$t("viewAllNotifications")}}
            </h4>
          </div>
        </v-card>
      </v-menu>
      <v-divider vertical></v-divider>
      <!-- <v-menu 
                :close-on-content-click="false"    
                offset-y
                max-height="30rem"
                left
            >
                <template v-slot:activator="{ on, attrs }">
                    <div>
                        <v-btn icon dark v-bind="attrs" v-on="on">
                            <v-icon class="gray--text">{{true ? 'mdi-bell-outline' : 'mdi-bell-badge-outline'}}</v-icon>
                        </v-btn>           
                    </div>
                </template>
                <v-card
                    class="mx-auto"
                    max-width="670"
                    width="670px"
                    tile
                >
                    <v-list>
                        <v-list-item-content class="py-0">
                            <div class="d-flex align-center">
                                <h5 class="ml-5">Notifications</h5>
                                <div class="ml-auto mr-3">
                                    <v-select
                                        style="width: 137px; background-color: white; height: 40px;"
                                        :items="viewNotificationTypeOptions"
                                        placeholder="Select"
                                        outlined
                                        dense
                                        v-model="viewNotificationType"
                                        item-text="label"
                                        item-value="id"
                                        max-height= "5"
                                    ></v-select>
                                </div>
                                <h5 class="mr-2">Mark all as read</h5>
                                <v-checkbox
                                ></v-checkbox>
                            </div>
                        </v-list-item-content>
                        <div
                            :class="`pl-5 pr-5 py-5 ${item.seen ? 'seen' : 'unseen'}`"
                            v-for="(item, i) in notifications"
                            :key="i"
                        >
                            <v-row>
                                <v-col cols="2">
                                    <img src="/img/logo.png"  style="width: 60px; height: 60px; border-radius: 50%;"/>
                                </v-col>
                                <v-col cols="7">
                                    <span style="font-size: 15px; color: black;"><b>{{item.user}}</b>{{" "}}{{item.text}}</span>
                                </v-col>
                                <v-col cols="3">
                                    <span style="color: #626568; font-size: 14px; font-weight: 500;">{{getTimeFromNow(item.datetime)}}</span>
                                </v-col>
                            </v-row>
                        </div>
                        <div class="text-center pb-5">
                            <h4 class="view_all_notifications" @click="$router.push({ name: 'NotificationList' });">View all Notifications</h4>
                        </div>
                    </v-list>
                </v-card>
            </v-menu>
            <v-divider vertical></v-divider> -->
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-list color="transparent">
            <v-list-item two-line>
              <v-list-item-avatar>
                <img src="/img/user.jpg" />
              </v-list-item-avatar>

              <v-list-item-content class="d-block">
                <v-list-item-title>{{
                  `${
                    currentUser.firstName != null ? currentUser.firstName : ""
                  } ${currentUser.lastName != null ? currentUser.lastName : ""}`
                }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  currentUser.email
                }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon dark v-bind="attrs" v-on="on">
                  <v-icon class="gray--text">mdi-chevron-down</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </template>
        <v-list>
          <!-- <v-list-item @click="$router.replace({name: 'profile'});">Profile</v-list-item>
                        <v-divider></v-divider> -->
          <v-list-item @click="logout">
            Logout
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
    <template v-else></template>
    <div class="pt-5">
      <LanguageSelection :pageReload="true" />
    </div>
  </v-app-bar>
</template>

<script>
import moment from "moment";
import { mapState } from "vuex";
import isMobileMixin from "@/mixins/isMobileMixin";
import LoadingMixin from "@/mixins/LoadingMixin";
import NotificatinService from "@/_services/NotificatinService";
import ColSkeletonLoader from "../../components/col-skeleton-loader.vue";
import DeforestationService from "@/_services/DeforestationService";
import downloadMixin from "@/mixins/DownloadMixin";

export default {
  computed: {
    ...mapState(["drawer"]),
    currentUser() {
      return this.$store.getters.getUser;
    },
    isSubEnterprise() {
      return this.$store.getters.isSubEnterprise;
    },
  },
  created() {
    this.getUnreadNotificationCount();
    setInterval(this.getUnreadNotificationCount, 90000);
  },
  mounted(){
    this.fetchDownloadHistory();
    this.startDownloadHistoryPolling();
  },
  components: {
    /* eslint-disable */
    ColSkeletonLoader,
  },
  data() {
    return {
      downloadOpen: false,
      notiOpen: false,
      // notifications: [
      //     { id: 1, user: "Malcolm Satchel", datetime: new Date(), text: "Your NDVI satellitereport for Creeping Woodsorrel is now ready to download »", seen: false },
      //     { id: 2, user: "DIMITRA", datetime: new Date(), text: "We havegenerated a new Irrigation report. Check it out here »", seen: false },
      //     { id: 3, user: "Malcolm Satchel", datetime: new Date(), text: "Your NDVI satellitereport for Creeping Woodsorrel is now ready to download »", seen: false },
      //     { id: 4, user: "Server", datetime: new Date(), text: "We havegenerated a new Irrigation report. Check it out here »", seen: true },
      // ],
      viewNotificationType: 1,
      viewNotificationTypeOptions: [
        { id: 1, label: this.$t('all') },
        { id: 2, label: this.$t('read') },
        { id: 3, label: this.$t('unread') },
      ],
      selected: [2],
      notificationsData: [],
      unreadNotificationCount: 0,
      unreadNotificatins: [],
      downloadData: [
      ],
      downloadHistoryLimit: 5,
      downloadHistoryPage: 1
    }
  },
  methods: {
    async downloadPdf(item) {
          if (!item?.fileUrl) {
              this.$notify({
                  type: 'error',
                  title: this.$t("dueDiligence.invalidFilePathOrUrl"),
              });
              return;
          }
          this.startLoading();
          try {
              const fileName = item.fileName || `download_${new Date().getTime()}.pdf`;
              await this.downloadSourceFile(item?.fileUrl, "application/pdf", fileName);
          } catch (error) {
              this.$notify({
                  type: "error",
                  title: this.$t("dueDiligence.errorDownloadingFile"),
              });
          } finally {
              this.stopLoading();
          }
      },
    async fetchDownloadHistory() {
        const payload = {
            page: this.downloadHistoryPage,
            limit: this.downloadHistoryLimit
        }
        try {
            const response = await DeforestationService.getPdfDownloadHistory(payload);

            if (response?.data?.getHistory?.rows) {
                this.downloadData = response.data.getHistory.rows.map((item) => ({
                    name: item.fileName,
                    estimatedTime: item.estimatedTime,
                    status: item.status,
                    fileUrl: item.fileUrl,
                    fileName: item.fileName,
                }));
            }
        } catch (error) {
            console.error("Error fetching history data:", error);
        }
    },

    startDownloadHistoryPolling() {
      this.pollingInterval = setInterval(() => {
        this.fetchDownloadHistory();
      }, 500000); 
    },

    showAllDownloads() {
      this.downloadOpen = false;
      this.$router.push({ name: "DownloadHistory" });
    },

    async clickNotification(notificationItem) {
      if (notificationItem.type === "ddr_additional_information") {
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
      } else {
        if (this.$route.name != "NotificationList") {
          this.$router.push({ name: "NotificationList" });
        }
      }
      NotificatinService.readNotification([notificationItem.id])
        .then(() => {
          // this.getNotification()
          this.unreadNotificationCount && this.unreadNotificationCount--
        }).catch((err) => {
          console.log(err)
        });
    },
    setDrawer(val) {
      this.$store.commit("SET_DRAWER", val);
    },
    async logout() {
      this.startLoading();
      await this.$store.dispatch("logout");
      this.$router.replace({ name: "login" });
      this.stopLoading();
    },
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
    getDateFormat(date) {
      return moment(date).format("YYYY-MM-DD");
    },
    showAllNotification() {
      this.notiOpen = false;
      if (this.$route.name == "NotificationList") return;
      this.$router.push({ name: "NotificationList" });
    },
    async getNotification() {
      
      this.startLoading();

      this.notificationsData = [];
      // if(this.notiOpen) return;
      const notificationFilters = {
        seen:
          this.viewNotificationType == 1
            ? null
            : this.viewNotificationType == 2
            ? 1
            : 0,
        page: 1,
        limit: 5,
      };

      NotificatinService.getNotifications(notificationFilters)
        .then((data) => {
          const notificationData = data.data;
          this.notificationsData = notificationData.notification.rows;
          this.unreadNotificatins = this.notificationsData.filter(
            (a) => a.notificationTo.seen == 0
          );
          this.stopLoading();
        })
        .catch((err) => {
          console.log(err);
          this.stopLoading();
        });
    },
    async markAllRead(event) {
      if (!event) return;
      await this.getUnreadNotificationCount();
      // const notiIds = this.notificationsData.filter(a => a.notificationTo.seen == 0)
      const ids = this.unreadNotificatins.map((a) => a.id);
      if (!ids.length) return;

      NotificatinService.readNotification(ids)
        .then(() => {
          this.getNotification();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async getUnreadNotificationCount() {
      await NotificatinService.getNotifications({ seen: 0 })
        .then((data) => {
          const notificationData = data.data;
          this.unreadNotificationCount =
            notificationData.notification.totalCount;
          this.unreadNotificatins = notificationData.notification.rows;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    notificationByType() {
      this.getNotification();
    },
  },
  mixins: [isMobileMixin, LoadingMixin, downloadMixin],
};
</script>

<style lang="scss" scoped>
.seen {
  background-color: white;
}

.unseen {
  background-color: rgba(17, 116, 67, 0.11);
}

.view_all_notifications {
  cursor: pointer;
  color: $primary-color;
  font-weight: 600;
  font-size: 18px;
  line-height: 20px;
}

::v-deep .unread-noti {
  background-color: $green2;
}
.see-details {
  color: inherit;
  cursor: pointer;
  transition: color 0.3s ease;
}

.see-details{
  &:hover {
    color: green !important;
  }
}
</style>