<template>
  <v-card class="mb-4 main-card">
    <v-card-text>
      <v-container class="pa-0 mx-0 col-12">
        <v-row>
          <!-- <v-col cols="4">
            <v-card flat class="info-card">
              <div class="d-flex">
                <div class="title-container">
                  <span class="text-caption text-grey-darken-1">
                    Demos Products
                    <v-icon size="14" class="info-icon">mdi-information-outline</v-icon>
                  </span>
                </div>
                <v-avatar size="32" class="avatar-position">
                  <v-img src="path-to-avatar.jpg" />
                </v-avatar>
              </div>
              <div class="content-text">
                Connected Farmer (Coffee), Connected Cocoa, Deforestation Web, Marketplace Web, Survey Module
              </div>
            </v-card>
          </v-col> -->

          <v-col cols="12">
            <v-card flat class="info-card">
              <div class="d-flex">
                <div class="title-container">
                  <span class="text-caption text-grey-darken-1">
                    Access
                    <v-icon size="14" class="info-icon">mdi-information-outline</v-icon>
                  </span>
                </div>
                <v-avatar size="32" class="avatar-position">
                  <v-img src="path-to-avatar.jpg" />
                </v-avatar>
              </div>
              <div class="content-text">
                {{ enterprise.access.map(item => item.name).join(', ') }}
              </div>
            </v-card>
          </v-col>

          <!-- <v-col cols="2">
            <v-card flat class="info-card">
              <div class="title-container">
                <span class="text-caption text-grey-darken-1">
                  Phone Number 
                  <v-icon size="14" class="info-icon">mdi-information-outline</v-icon>
                </span>
              </div>
              <div class="content-text"></div>
            </v-card>
          </v-col> -->
        </v-row>

        <v-row>
          <v-col cols="3">
            <v-card flat class="info-card">
              <div class="title-container">
                <span class="text-caption text-grey-darken-1">
                  Country 
                  <v-icon size="14" class="info-icon">mdi-information-outline</v-icon>
                </span>
              </div>
              <div class="content-text">{{ enterprise.country || 'N/A' }}</div>
            </v-card>
          </v-col>

          <v-col cols="3">
            <v-card flat class="info-card">
              <div class="d-flex">
                <div class="title-container">
                  <span class="text-caption text-grey-darken-1">
                    Payment Status
                    <v-icon size="14" class="info-icon">mdi-information-outline</v-icon>
                  </span>
                </div>
              </div>
              <div class="content-text text-capitalize">{{ enterprise.paymentStatus || 'N/A' }}</div>
            </v-card>
          </v-col>

          <v-col cols="3">
            <v-card flat class="info-card">
              <div class="d-flex">
                <div class="title-container">
                  <span class="text-caption text-grey-darken-1">
                    Date of Registration
                    <v-icon size="14" class="info-icon">mdi-information-outline</v-icon>
                  </span>
                </div>
                <v-avatar size="32" class="avatar-position">
                  <v-img src="path-to-avatar.jpg" />
                </v-avatar>
              </div>
              <div class="content-text">{{ (enterprise.registrationDate && enterprise.registrationDate.split('T')[0]) || 'N/A' }}</div>
            </v-card>
          </v-col>

          <v-col cols="3">
            <v-card flat class="info-card">
              <div class="title-container">
                <span class="text-caption text-grey-darken-1">
                  Language
                  <v-icon size="14" class="info-icon">mdi-information-outline</v-icon>
                </span>
              </div>
              <div class="content-text">English</div>
            </v-card>
          </v-col>

          <!-- <v-col cols="2">
            <v-card flat class="info-card">
              <div class="d-flex">
                <div class="title-container">
                  <span class="text-caption text-grey-darken-1">
                    Crop
                    <v-icon size="14" class="info-icon">mdi-information-outline</v-icon>
                  </span>
                </div>
                <v-avatar size="32" class="avatar-position">
                  <v-img src="path-to-avatar.jpg" />
                </v-avatar>
              </div>
              <div class="content-text">Banana</div>
            </v-card>
          </v-col> -->
        </v-row>

        <!-- <v-row class="mt-3">
          <v-col cols="4">
            <v-card flat class="info-card">
              <div class="title-container">
                <span class="text-caption text-grey-darken-1">
                  Crop Variety
                  <v-icon size="14" class="info-icon">mdi-information-outline</v-icon>
                </span>
              </div>
              <div class="content-text">
                Poovan, Monthan, Rasthali, Robusta, Dwarf, Cavendish, Nendran, Red Banana, Grand Naine
              </div>
            </v-card>
          </v-col>

          <v-col cols="3">
            <v-card flat class="info-card">
              <div class="title-container">
                <span class="text-caption text-grey-darken-1">
                  Membership Plan
                  <v-icon size="14" class="info-icon">mdi-information-outline</v-icon>
                </span>
              </div>
              <div class="content-text">Advanced</div>
            </v-card>
          </v-col>

          <v-col cols="2">
            <v-card flat class="info-card">
              <div class="d-flex">
                <div class="title-container">
                  <span class="text-caption text-grey-darken-1">
                    Membership Plan Expiry Date
                    <v-icon size="14" class="info-icon">mdi-information-outline</v-icon>
                  </span>
                </div>
                <v-avatar size="32" class="avatar-position">
                  <v-img src="path-to-avatar.jpg" />
                </v-avatar>
              </div>
              <div class="content-text">07-08-2024</div>
            </v-card>
          </v-col>

          <v-col cols="2">
            <v-card flat class="info-card">
              <div class="d-flex">
                <div class="title-container">
                  <span class="text-caption text-grey-darken-1">
                    User
                    <v-icon size="14" class="info-icon">mdi-information-outline</v-icon>
                  </span>
                </div>
                <v-avatar size="32" class="avatar-position">
                  <v-img src="path-to-avatar.jpg" />
                </v-avatar>
              </div>
              <div class="content-text">Farmer</div>
            </v-card>
          </v-col>
        </v-row> -->
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'ProfileInfo',
  props: ['enterprise'],
}
</script>

<style scoped>
.main-card {
  background-color: white !important;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1) !important;
}

.info-card {
  background-color: rgb(236, 246, 244) !important;
  padding: 12px;
  height: 100%;
  position: relative;
  border-radius: 4px;
}

.title-container {
  margin-bottom: 8px;
  flex-grow: 1;
}

.info-icon {
  opacity: 0.7;
  margin-left: 4px;
}

.content-text {
  font-size: 14px;
  line-height: 1.4;
  color: rgba(0, 0, 0, 0.87);
}

.avatar-position {
  position: absolute;
  top: 8px;
  right: 8px;
}

.avatar-position img {
  border: 2px solid #fff;
}
</style>