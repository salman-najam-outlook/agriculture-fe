<template>
  <div style="min-width:700px;">
      <breadcrumb :items="breadcrumbs"></breadcrumb>
    <div class="d-flex mb-4 mx-4 align-center">
      <h2>{{ $t('Ticket') }} #{{ ticketNumber }}</h2>
      <v-spacer></v-spacer>
      <v-btn color="primary" dark small class="mr-2" @click="goBack">
        {{ $t('back') }}
      </v-btn>
    </div>
    <v-card class="ma-10 pb-10 " >
      <v-card-title>
        {{ $t('Ticket History') }}
      </v-card-title>
          <v-card  color="#F5F5F5"   v-for="(log, idx) in ticketLogs" :key="idx" elevation="0" class="pa-5 card-row-border ma-10" >
            <v-card-title class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <img src="/img/user1.png" class="text-icon" width="50" alt="User Photo">
                <div class="ml-3">
                  {{ log?.user?.firstName }} {{ log?.user?.lastName }}
                </div>
              </div>

        <div class="text-right d-flex flex-column align-end">
        <span class="text-caption">{{ formatDate(log?.createdAt) }}</span>
        <v-chip v-if="log?.module == 'support_ticket_create_logs'" label class="mt-1">{{ $t('createdTicket') }}</v-chip>
        <v-chip v-if="log?.module == 'support_ticket_update_logs'" label class="mt-1">{{ $t('updatedTicket') }}</v-chip>
        <v-chip v-if="log?.changesMade?.status" label class="mt-1">{{ $t('statusChanged') }}</v-chip>
        <v-chip v-if="log?.changesMade?.priority" label class="mt-1">{{ $t('priorityChanged') }}</v-chip>
        <v-chip v-if="log?.changesMade?.asigneeId" label class="mt-1">{{ $t('assignedTicket') }}</v-chip>
      </div>
            </v-card-title>

      <v-card-text>

        <ul  v-if="log?.module == 'support_ticket_create_logs'">
          <li v-if="log?.module == 'support_ticket_create_logs'"> <strong>{{ $t('createdNewTicket') }}</strong> </li>
          <li v-if="log?.payload?.subject"> <strong>{{ $t('addedTicketSubject') }} </strong></li>
          <p>{{ log?.payload?.subject }}</p>

          <li v-if="log?.payload?.description"><strong>{{ $t('addedTicketDescription') }}</strong></li>
          <p>{{ log?.payload?.description }}</p>

          <li v-if="log?.assigneeId">{{ `${$t('assignedTicketTo')}` }} <strong>{{ `${log.assignee.firstName} ${log.assignee.lastName}` }}</strong> </li>
        </ul>

        <ul v-else-if="log?.module == 'support_ticket_update_logs'">
            <li v-if="log?.changesMade?.status"><strong>{{ $t('updatedTicketStatus') }}</strong> </li>
            <p>{{ log?.changesMade?.status }}</p>

            <li v-if="log?.changesMade?.priority"><strong>{{ $t('updatedTicketPriority') }}</strong> </li>
            <p>{{ log?.changesMade?.priority }}</p>

            <li   v-if="log?.changesMade?.asigneeId">{{ `${$t('assignedTicketTo')}` }} <strong>{{  log?.assignee?.firstName }} {{ log?.assignee?.lastName }}</strong> </li>
          
        </ul>

          <ul v-else-if="log?.module == 'support_ticket_comment_logs'">
            <li > {{ $t('repliedTo') }} <strong>{{ log?.requester?.email }}</strong> </li>
            <p>{{ log?.payload?.comment }}</p>

          
        </ul>



      </v-card-text>
    </v-card>
    </v-card>

  </div>
</template>

<script>
import axios from "axios";
export default {
  name: 'ViewLogs',
  data() {
    return {
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
      ticketNumber: 12345, // Replace with actual ticket number from route or props
      ticketLogs: [ ]
    };
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    formatDate(date) {
      const d = new Date(date);
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      const year = d.getFullYear();
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      return [year, month, day].join('-');
    },
  },
  async mounted() {
    const ticketId = this.$route.params.id;
    if (ticketId) {
      console.log("Fetching logs for ticket ID:", ticketId);
      this.ticketNumber = ticketId;
      // Fetch logs from API
     let logRes =  await axios.get(`/ticket/logs/${ticketId}`)
     this.ticketLogs = logRes.data.data.map(el => {
      if(el?.payload?.changesMade) {

        el.changesMade = JSON.parse(JSON.stringify(JSON.parse(el.payload.changesMade)));
      }
      return el
     }) || [];
    }
  },
};
</script>

<style scoped>
.v-list-item-title {
  font-size: 16px;
}
.v-list-item-subtitle {
  font-size: 13px;
}

.card-row-border {
  border: 2px solid #2e845a !important;
}
</style>