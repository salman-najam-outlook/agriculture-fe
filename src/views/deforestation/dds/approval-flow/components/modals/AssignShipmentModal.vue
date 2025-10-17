<template>
  <v-dialog v-model="dialog" persistent :max-width="$vuetify.breakpoint.mobile ? '95vw' : '800'">
    <v-card>
      <v-toolbar color="primary" elevation="0">
        <v-toolbar-title class="white--text">{{ $t('dueDiligence.confirmation') }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="white" icon @click="closeModal">
          <v-icon style="color:white !important">mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      
      <v-card-text class="pt-5 black--text">
        <div class="mb-4">
          <p class="mb-3">{{ $t('dueDiligence.assignShipmentDescription') }}</p>
          
          <v-divider class="my-4"></v-divider>
          
          <div class="mb-4">
            <div class="d-flex align-center mb-2">
              <span class="font-weight-medium mr-2">{{ $t('dueDiligence.selectUser') }}</span>
              <v-tooltip top color="primary" max-width="300">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon size="16" color="primary" v-bind="attrs" v-on="on">
                    mdi-information-outline
                  </v-icon>
                </template>
                <span>{{ $t('dueDiligence.selectUserTooltip') }}</span>
              </v-tooltip>
            </div>
            
            <v-select
              v-model="selectedUser"
              :items="displayUsers"
              item-text="name"
              item-value="value"
              outlined
              dense
              :rules="[rules.required]"
              :placeholder="$t('dueDiligence.selectUserPlaceholder')"
              :menu-props="{ maxHeight: '300px' }"
            >
              <template v-slot:prepend-item>
                <v-text-field
                  v-model="searchText"
                  :placeholder="$t('dueDiligence.search')"
                  prepend-inner-icon="mdi-magnify"
                  outlined
                  dense
                  hide-details
                  class="mx-4 mt-2 mb-2"
                  @click:prepend-inner="() => {}"
                  @input="filterUsers"
                ></v-text-field>
                <v-divider></v-divider>
              </template>
              <template v-slot:item="{ item, on, attrs }">
                <v-list-item v-bind="attrs" v-on="on" @click="selectUser(item)">
                  <v-list-item-action>
                    <v-radio
                      :value="item.value"
                      :input-value="selectedUser"
                      color="primary"
                    ></v-radio>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-select>
          </div>
        </div>
      </v-card-text>
      
      <v-card-actions class="px-6 pb-4">
        <v-spacer></v-spacer>
        <v-btn outlined color="primary" @click="closeModal">
          {{ $t('dueDiligence.approvalCancelButton') }}
        </v-btn>
        <v-btn 
          depressed 
          color="primary" 
          @click="confirmAssignment"
          :disabled="!selectedUser"
        >
          {{ $t('dueDiligence.assignButton') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'AssignConfirmationModal',
  props: {
    dialog: {
      type: Boolean,
      required: true
    },
    selectedReportsCount: {
      type: Number,
      default: 0
    },
    userOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectedUser: null,
      searchText: '',
      filteredUsers: [],
      rules: {
        required: value => !!value || this.$t('dueDiligence.pleaseSelectUser')
      }
    }
  },
  computed: {
    displayUsers() {
      if (!this.searchText) {
        return this.userOptions;
      }
      return this.userOptions.filter(user => 
        user.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  },
  methods: {
    closeModal() {
      this.resetForm();
      this.$emit('close');
    },
    confirmAssignment() {
      if (!this.selectedUser) {
        return;
      }
      
      const assignmentData = {
        selectedUserId: this.selectedUser
      };
      
      this.$emit('confirm', assignmentData);
      this.closeModal();
    },
    resetForm() {
      this.selectedUser = null;
      this.searchText = '';
    },
    filterUsers() {
      // The filtering is handled by the computed property displayUsers
      // This method can be used for additional filtering logic if needed
    },
    selectUser(user) {
      this.selectedUser = user.value;
    }
  },
  watch: {
    dialog(newVal) {
      if (!newVal) {
        this.resetForm();
      }
    }
  }
}
</script>

<style scoped>
.v-select {
  margin-top: 0;
}
</style>