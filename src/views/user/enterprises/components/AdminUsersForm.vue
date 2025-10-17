<template>
  <div class="admin-section">
    <div class="section-title d-flex align-center mb-3">
      <h3>
      {{ $t('Enterprises.AdminUsersForm.Admin_User') }}
        <!-- Admin User -->
      </h3>
    </div>
    <div class="header d-flex align-center mb-4">
      <div class="header-label d-flex align-center">
        <span class="required-star">*</span>
        <span>
        {{ $t('Enterprises.AdminUsersForm.Name') }}
          <!-- Name -->
        </span>
      </div>
      <div class="header-label d-flex align-center">
        <span class="required-star">*</span>
        <span>
          {{ $t('Enterprises.AdminUsersForm.Email') }}
          <!-- Email -->
        </span>
      </div>
    </div>
    
    <div class="user-rows">
      <div v-for="(user, index) in users" :key="index" class="mb-4">
        <div class="d-flex align-center" style="gap: 16px;">
          <v-text-field
            v-model="user.name"
            outlined
            dense
            hide-details
            placeholder="Full Name"
            class="flex-grow-1"
            background-color="white"
            :class="{ 'grey lighten-3': index < users.length - 1 }"
            :readonly="index < users.length - 1"
          ></v-text-field>
          
          <v-text-field
            v-model="user.email"
            outlined
            dense
            hide-details
            placeholder="Email Address"
            class="flex-grow-1"
            background-color="white"
            :class="{ 'grey lighten-3': index < users.length - 1 }"
            :readonly="index < users.length - 1"
          ></v-text-field>
          
          <div class="d-flex align-center" style="gap: 8px; min-width: 120px;">
            <v-btn
              v-if="index === users.length - 1"
              text
              small
              color="primary"
              class="px-0"
              @click="addUser"
            >
            {{ $t('Enterprises.AdminUsersForm.Add_More') }}
              <!-- Add More -->
            </v-btn>
            
            <v-btn
              text
              small
              color="error"
              class="px-0"
              @click="removeUser(index)"
            >
            {{ $t('Enterprises.AdminUsersForm.Remove') }}
              <!-- Remove -->
            </v-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminUsersForm',
  data: () => ({
    users: [
      {
        name: '',
        email: ''
      },
    ]
  }),
  
  methods: {
    addUser() {
      this.users.push({
        name: '',
        email: ''
      })
    },
    
    removeUser(index) {
      if (this.users.length > 1) {
        this.users.splice(index, 1)
      }
    }
  },
  
  watch: {
    users: {
      handler(val) {
        this.$emit('input', val)
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.admin-section {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  padding: 16px;
}

.header {
  background-color: #147444;
  padding: 12px 16px;
  gap: 16px;
  border-radius: 4px 4px 0 0;
}

.header-label {
  flex: 1;
  color: white;
  font-size: 14px;
  font-weight: 500;
  gap: 4px;
}

.required-star {
  color: white;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.87);
  padding-left: 16px;
}

.section-title h3 {
  font-size: inherit;
  font-weight: inherit;
  margin: 0;
}

.v-text-field >>> .v-input__control {
  min-height: 40px !important;
}

.v-text-field >>> .v-input__slot {
  min-height: 40px !important;
}
</style>