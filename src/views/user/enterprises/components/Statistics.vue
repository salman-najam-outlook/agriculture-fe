<template>
    <div class="statistics-container">
      <div class="date-picker">
        <span class="date">12/01/2023</span>
        <v-icon size="small" color="grey-darken-1">mdi-chevron-right</v-icon>
      </div>
      
      <v-row>
        <v-col cols="12" md="4">
          <v-card class="stat-card">
            <v-card-text class="pa-4">
              <div class="card-header">
                <div class="title-container">
                  <span class="card-title">Users</span>
                  <div class="info-icon">
                    <v-icon size="16" color="success">mdi-alert-circle</v-icon>
                  </div>
                </div>
              </div>
              
              <div class="metrics-container">
                <div class="numbers-container">
                  <div class="main-number">1.5k</div>
                  <div class="subtitle">Total Users</div>
                </div>
                
                <div class="progress-container">
                  <v-progress-circular
                    :model-value="(3/1.5)*100"
                    :size="90"
                    :width="3"
                    color="grey-lighten-2"
                    :rotate="-90"
                  >
                    <div class="progress-content">
                      <span class="progress-text">3/1.5k</span>
                      <span class="progress-label">Registered</span>
                    </div>
                  </v-progress-circular>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
  
        <v-col cols="12" md="4">
          <v-card class="stat-card">
            <v-card-text class="pa-4">
              <div class="card-header">
                <div class="title-container">
                  <span class="card-title">Farms</span>
                  <div class="info-icon">
                    <v-icon size="16" color="success">mdi-alert-circle</v-icon>
                  </div>
                </div>
              </div>
              
              <div class="metrics-container">
                <div class="numbers-container">
                  <div class="main-number">7k</div>
                  <div class="subtitle">Total Farms</div>
                </div>
                
                <div class="progress-container">
                  <v-progress-circular
                    :model-value="0"
                    :size="90"
                    :width="3"
                    color="grey-lighten-2"
                    :rotate="-90"
                  >
                    <div class="progress-content">
                      <span class="progress-text">0/7k</span>
                      <span class="progress-label">Registered</span>
                    </div>
                  </v-progress-circular>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
  
        <!-- Facilities Card -->
        <v-col cols="12" md="4">
          <v-card class="stat-card">
            <v-card-text class="pa-4">
              <div class="card-header">
                <div class="title-container">
                  <span class="card-title">Facilities</span>
                  <div class="info-icon">
                    <v-icon size="16" color="success">mdi-alert-circle</v-icon>
                  </div>
                </div>
              </div>
              
              <div class="metrics-container">
                <div class="numbers-container">
                  <div class="main-number">100</div>
                  <div class="subtitle">Total Facilities</div>
                </div>
                
                <div class="progress-container">
                  <v-progress-circular
                    :model-value="0"
                    :size="90"
                    :width="3"
                    color="grey-lighten-2"
                    :rotate="-90"
                  >
                    <div class="progress-content">
                      <span class="progress-text">0/100</span>
                      <span class="progress-label">Registered</span>
                    </div>
                  </v-progress-circular>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
  
        <v-col cols="12" md="4">
          <v-card class="stat-card">
            <v-card-text class="pa-4">
              <div class="card-header">
                <div class="title-container">
                  <span class="card-title">Due Diligence Reports</span>
                  <div class="info-icon with-label">
                    <v-icon size="16" color="success">mdi-alert-circle</v-icon>
                    <span class="info-label">(10 Per User)</span>
                  </div>
                </div>
              </div>
              
              <div class="metrics-container">
                <div class="numbers-container">
                  <div class="main-number">1000</div>
                  <div class="subtitle">Per Month</div>
                </div>
                
                <div class="progress-container">
                  <v-progress-circular
                    :model-value="0"
                    :size="90"
                    :width="3"
                    color="grey-lighten-2"
                    :rotate="-90"
                  >
                    <div class="progress-content">
                      <span class="progress-text">0/1000</span>
                      <span class="progress-label">Used</span>
                    </div>
                  </v-progress-circular>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
  
        <v-col cols="12" md="4">
          <v-card class="stat-card">
            <v-card-text class="pa-4">
              <div class="card-header">
                <div class="title-container">
                  <span class="card-title">Deforestation Reports</span>
                  <div class="info-icon with-label">
                    <v-icon size="16" color="success">mdi-alert-circle</v-icon>
                    <span class="info-label">(20 Per User)</span>
                  </div>
                </div>
              </div>
              
              <div class="metrics-container">
                <div class="numbers-container">
                  <div class="main-number">30k</div>
                  <div class="subtitle">Per Month</div>
                </div>
                
                <div class="progress-container">
                  <v-progress-circular
                    :model-value="0"
                    :size="90"
                    :width="3"
                    color="grey-lighten-2"
                    :rotate="-90"
                  >
                    <div class="progress-content">
                      <span class="progress-text">0/30k</span>
                      <span class="progress-label">Used</span>
                    </div>
                  </v-progress-circular>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
  
        <v-col cols="12" md="4">
          <v-card class="stat-card">
            <v-card-text class="pa-4">
              <div class="card-header">
                <div class="title-container">
                  <span class="card-title">Deforestation Disputes</span>
                  <div class="info-icon with-label">
                    <v-icon size="16" color="success">mdi-alert-circle</v-icon>
                    <span class="info-label">(35 Per User)</span>
                  </div>
                </div>
              </div>
              
              <div class="metrics-container">
                <div class="numbers-container">
                  <div class="main-number">53k</div>
                  <div class="subtitle">Per Month</div>
                </div>
                
                <div class="progress-container">
                  <v-progress-circular
                    :model-value="0"
                    :size="90"
                    :width="3"
                    color="grey-lighten-2"
                    :rotate="-90"
                  >
                    <div class="progress-content">
                      <span class="progress-text">0/53k</span>
                      <span class="progress-label">Used</span>
                    </div>
                  </v-progress-circular>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
  
        <v-col cols="12" md="4">
          <v-card class="stat-card">
            <v-card-text class="pa-4">
              <div class="card-header">
                <div class="title-container">
                  <span class="card-title">Advanced Crop Reports</span>
                  <div class="info-icon with-label">
                    <v-icon size="16" color="success">mdi-alert-circle</v-icon>
                    <span class="info-label">(35 Per User)</span>
                  </div>
                </div>
              </div>
              
              <div class="metrics-container">
                <div class="numbers-container">
                  <div class="main-number">53k</div>
                  <div class="subtitle">Per Month</div>
                </div>
                
                <div class="progress-container">
                  <v-progress-circular
                    :model-value="0"
                    :size="90"
                    :width="3"
                    color="grey-lighten-2"
                    :rotate="-90"
                  >
                    <div class="progress-content">
                      <span class="progress-text">0/53k</span>
                      <span class="progress-label">Used</span>
                    </div>
                  </v-progress-circular>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Statistics',
    data() {
      return {
        date: '12/01/2023'
      }
    }
  }
  </script>
  
  <style scoped>
  .statistics-container {
    padding: 16px;
  }
  
  .date-picker {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    gap: 8px;
  }
  
  .date {
    color: #1E1E1E;
    font-size: 14px;
  }
  
  .stat-card {
    border-radius: 8px !important;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.04) !important;
    background: white;
  }
  
  .card-header {
    margin-bottom: 24px;
  }
  
  .title-container {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .card-title {
    font-size: 16px;
    font-weight: 500;
    color: #1E1E1E;
  }
  
  .info-icon {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  .info-icon.with-label {
    gap: 8px;
  }
  
  .info-label {
    font-size: 14px;
    color: #666666;
  }
  
  .metrics-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .numbers-container {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .main-number {
    font-size: 32px;
    font-weight: 600;
    color: #1E1E1E;
    line-height: 1.2;
  }
  
  .subtitle {
    font-size: 14px;
    color: #666666;
  }
  
  .progress-container {
    position: relative;
  }
  
  .progress-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .progress-text {
    font-size: 12px;
    font-weight: 500;
    color: #1E1E1E;
    margin-bottom: 2px;
  }
  
  .progress-label {
    font-size: 12px;
    color: #666666;
  }
  
  :deep(.v-progress-circular__underlay) {
    stroke: #F5F5F5;
  }
  
  :deep(.v-progress-circular__overlay) {
    stroke: #4CAF50;
  }
  </style>