<template>
  <div class="user-preview-container">
    <div class="section-title">{{ $t('memberDataSection.affiliates') }}</div>
    
    <div>
      <div>
        <v-data-table 
          :headers="tableHeaders" 
          :items="users" 
          :items-per-page="10" 
          :footer-props="{
            'items-per-page-options': [5, 10, 25, 50],
          }" 
          item-key="email" 
          hide-default-footer 
          :loading="loading" 
          :loading-text="$t('loadingData')"
        >
          <template v-slot:top="{}">
            <div class="d-flex align-center justify-end mb-3">
              <div class="d-flex align-center">
                <div class="py-1 mr-2 title">
                  {{ fromUserList }} - {{ toUserList }} {{ $t('of') }} {{ totalUsers }}
                </div>
                <v-btn 
                  class="mx-1" 
                  fab 
                  small 
                  outlined 
                  color="primary" 
                  :disabled="currentPage <= 1"
                  @click="changePage(false)"
                >
                  <v-icon dark>mdi-chevron-left</v-icon>
                </v-btn>
                <v-btn 
                  class="mx-1" 
                  fab 
                  small 
                  outlined 
                  color="primary" 
                  :disabled="currentPage >= totalPages"
                  @click="changePage(true)"
                >
                  <v-icon dark>mdi-chevron-right</v-icon>
                </v-btn>
              </div>
            </div>
          </template>
              
              <template v-if="users.length" v-slot:body="{ items }">
                <tbody>
                  <tr v-for="(item, index) in items" :key="index">
                    <template v-for="h in tableHeaders">
                      <td class="text-truncate" :key="h.value + '_affiliateName'" v-if="h.value == 'affiliateName'">
                        {{ item.affiliateName || "-" }} 
                      </td>

                      <td class="text-truncate" :key="h.value + '_email'" v-else-if="h.value == 'email'">
                        {{ item.primaryEmailAddress || "-" }}
                      </td>

                      <td class="text-truncate" :key="h.value + '_affiliateNumber'" v-else-if="h.value == 'affiliateNumber'">
                        {{ item.affiliateNumber || "-" }}
                      </td>
                    </template>
                  </tr>
                </tbody>
              </template>

              <template v-slot:no-data>
                <div class="text-center py-4">
                  <v-icon size="64" color="grey lighten-1">mdi-account-multiple-outline</v-icon>
                  <div class="mt-2 grey--text">{{ $t('memberDataSection.noUsersFound') }}</div>
                </div>
              </template>

              <template v-slot:footer></template>
            </v-data-table>
      </div>
    </div>

    <!-- Action buttons -->
    <div class="actions-container mt-4">
      <v-btn 
        outlined 
        color="primary" 
        @click="goBack"
        class="mr-3"
      >
      
        {{ $t('back') }}
      </v-btn>
      
      <v-btn 
        color="primary" 
        class="white--text" 
        @click="confirmSubmit"
        :disabled="!users.length"
        :loading="submitting"
      >        {{ $t('submit') }}
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserPreviewTable',
  props: {
    users: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    submitting: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 10,
      tableHeaders: [
        {
          text: this.$t("memberDataSection.affiliateName"),
          align: "start",
          value: "affiliateName",
          class: "black--text",
          sortable: false,
        },
        {
          text: this.$t("memberDataSection.primaryEmailAddress"),
          align: "start",
          value: "email",
          class: "black--text",
          sortable: false,
        },
        {
          text: this.$t("memberDataSection.affiliateNumber"),
          align: "start",
          value: "affiliateNumber",
          class: "black--text",
          sortable: false,
        },
      ]
    };
  },
  computed: {
    totalUsers() {
      return this.users.length;
    },
    totalPages() {
      return Math.ceil(this.totalUsers / this.itemsPerPage);
    },
    fromUserList() {
      return this.totalUsers === 0 ? 0 : ((this.currentPage - 1) * this.itemsPerPage) + 1;
    },
    toUserList() {
      const to = this.currentPage * this.itemsPerPage;
      return to > this.totalUsers ? this.totalUsers : to;
    }
  },
  methods: {
    changePage(next) {
      if (next && this.currentPage < this.totalPages) {
        this.currentPage++;
      } else if (!next && this.currentPage > 1) {
        this.currentPage--;
      }
    },
    goBack() {
      this.$emit('goBack');
    },
    confirmSubmit() {
      this.$emit('confirmSubmit', this.users);
    }
  }
};
</script>

<style scoped>
.user-preview-container {
  padding: 2px 0;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.actions-container {
  display: flex;
  justify-content: flex-end;
  padding: 0 20px;
}

.orange-button {
  background-color: #FF9800 !important;
  color: white !important;
}

.orange-button:hover {
  background-color: #F57C00 !important;
}

@media (max-width: 600px) {
  .actions-container {
    flex-direction: column;
    gap: 10px;
  }
  
  .actions-container .v-btn {
    width: 100%;
  }
}
</style>