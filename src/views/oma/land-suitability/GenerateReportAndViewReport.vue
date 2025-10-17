<template>
    <div>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid ref="complianceReport">
            <div class="d-flex mb-4">
                <h2> {{ $t("oma.landSuitibility") }} </h2>
                <v-spacer></v-spacer>
                <div class="d-flex mt-1">
                    <v-btn color="primary" @click="$router.go(-1)" outlined class="mr-2">
                        {{ $t('back') }}
                    </v-btn>
                </div>
            </div>
            <hr>
            <v-row class="mt-4">
                <v-col sm="6">
                    <div class="d-flex align-center">
                        <div>
                            <label class="expiration mb-1" for="name">{{ $t("memberDataSection.selectFarm") }}<span
                                    class="red--text">*</span></label>
                            <v-autocomplete :disabled="selectorDisable" :items="farms" @change="handleFarmChange" v-model="farm" :placeholder="$t('memberDataSection.selectFarm')"
                                item-text="farmName" item-value="id" :loading="loadingFarm" dense outlined
                                style="margin-left: -1px" class="rounded-l-0 select-duration"></v-autocomplete>
                        </div>
                        
    <div class="d-flex align-center">>
        
        <div>
                            <label class="expiration mb-1" for="name">{{ $t("memberDataSection.selectCrop") }}<span
                                    class="red--text">*</span></label>
                            <v-autocomplete :disabled="selectorDisable" :items="crops" @change="handleCropChange" v-model="selectedCrop" :placeholder="$t('memberDataSection.selectCrop')"
                                item-text="farmName" item-value="id" :loading="loadingFarm" dense outlined
                                style="margin-left: -1px" class="rounded-l-0 select-duration"></v-autocomplete>
                        </div>
    </div>

                        <v-btn color="primary" :disabled="searchBtnDisable" @click="handleSearchFarm" dark class="ml-2 pa-4">
                            {{ $t('search') }}
                        </v-btn>
                    </div>
                </v-col>
            </v-row>
         
            <v-row>
                <v-col sm="6">
                    <h3> {{ $t('oma.chooseYourLocation') }} </h3>
                  <div class="google-map mt-5" style="width:100%;height:50vh; z-index: 0;" id="map" ref="googleMap"></div>
                </v-col>
                <v-col sm="6">
                    <v-btn :loading="loadingGenerateReportBtn" @click="handleGetEvalutionAction" color="primary" dark class="mr-2" :disabled="landElevetionButtonVisible">
                        {{ $t('oma.getLandEvaluation') }}
                    </v-btn>
                    <v-btn color="primary" dark class="mr-2" :disabled="downloadPdfReportVisible"  @click="downloadReport">
                        {{ $t('oma.downloadPdfReport') }}
                    </v-btn>
                  <v-card elevation="0" class="mt-5">
                    <v-card-text>
                      <div v-if="elevationDetails">
                        <h2 class="mb-4 mt-2"> {{ $t('oma.landEvaluation') }} </h2>
                        <v-divider></v-divider>
                        <v-row class="d-flex mt-2 mb-2">
                          <v-col cols="3" class="suitability-text">{{$t("oma.unsuitable")}}</v-col>
                          <v-col cols="3" class="suitability-text">{{$t("oma.marginally")}} {{$t("oma.suitable")}}</v-col>
                          <v-col cols="3" class="suitability-text">{{$t("oma.moderately")}} {{$t("oma.suitable")}}</v-col>
                          <v-col cols="3" class="suitability-text">{{$t("oma.highly")}} {{$t("oma.suitable")}}</v-col>
                        </v-row>

                        <v-row class="d-flex mb-1" no-gutters>
                          <v-col cols="3" class="text-center" style="min-height: 20px; background-color: #FF2600; ">
                            <v-icon v-if="details.overall_score < 50" class="mt-n9" size="20" color="black"> mdi-triangle </v-icon>
                          </v-col>
                          <v-col cols="3" class="text-center" style="min-height: 20px; background-color: #FF8000; ">
                            <v-icon v-if="details.overall_score < 75 && details.overall_score > 50" class="mt-n9" size="20" color="black"> mdi-triangle </v-icon>
                          </v-col>
                          <v-col cols="3" class="text-center" style="min-height: 20px; background-color: #FFFF00;">
                            <v-icon v-if="details.overall_score < 90 && details.overall_score > 75" class="mt-n9" size="20" color="black"> mdi-triangle </v-icon>
                          </v-col>
                          <v-col cols="3" class="text-center" style="min-height: 20px; background-color: #38A800;">
                            <v-icon v-if="details.overall_score > 90" class="mt-n9" size="20" color="black"> mdi-triangle </v-icon>
                          </v-col>
                        </v-row>

                        <div v-for="(item, key) in elevationDetails" :key="key" class="card-data mb-3">
                          <h3 class="mb-3"> {{ $t(key) }} </h3>
                          <div v-for="(innder,y) in item" :key="y" class="card0-item d-flex justify-space-between align-center cursor-pointer">
                           <v-row align="center">
                             <v-col>
                               <div class="left-text" @click="handleElevationDetail(innder)"> {{ $t(innder.name) }} </div>
                             </v-col>
                             <v-col class="text-right" :color="evaluateClass(innder.originalStatus)">
                               {{ innder.value }}
                               <v-chip :color="evaluateClass(innder.originalStatus)" variant="elevated" class="ma-2 chip" label>
                               </v-chip>
                             </v-col>
                           </v-row>

                          </div>
                        </div>

                        <div  class="card-data mb-3">
                          <div class="left-text font-weight-bold text-black text-center overall-score-text">
                            {{ $t('oma.overallScoreForLand') }} :
                            <span class="overall-score">{{ details.overall_score }} %</span>
                            <v-chip variant="elevated" class="ma-2 chip" label :color="getScoreColor(details.overall_score)">
                            </v-chip>
                          </div>
                        </div>

                      </div>
                      <div class="no-record" v-else>
                        <v-card flat tile class="center">
                          <v-card-text>
                            <v-row>
                              <v-col cols="6" offset="3">
                                <div class="centered-text">
                                  <v-icon size="100px" class="my-7" color="gray--text">mdi-diameter-variant</v-icon>
                                  <h3 class="mb-8 red--text"> {{ $t('oma.noRecordAvailable') }} </h3>
                                  <p class="mb-8"> {{ $t('oma.pleaseEnterCoordinateText') }}</p>
                                </div>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
            </v-row>
           <div v-if="elevationDetail && dialogOpen">
             <PropertiesComponent :google="google" :details="details" :elevationDetail="elevationDetail" :isOpen="dialogOpen" :results="resultArray" @close-properties="closeDialog"/>
          </div> 
        </v-container>
    </div>
</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin";
import download from "@/mixins/DownloadMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import DateMixin from "@/mixins/DateMixin";
import html2canvas from "html2canvas";
import LandSuitabilityAndWeatherService from '@/_services/LandSuitabilityAndWeatherService'
import PropertiesComponent from "@/views/oma/land-suitability/PropertiesPopup.vue";
import { getGoogleMapsLoader } from '@/mixins/GoogleMapLoaderSingleton';

export default {
  components: {PropertiesComponent},
    async mounted() {
        this.landSuitabilityId= this.$route.params.id;
        await this.getFarmas()
       

      const success = () => {
        this.mapOptions.center.lat = Number(this.coordinates?.lat)
        this.mapOptions.center.lng = Number(this.coordinates?.lng)

        if (this.map) this.map.setCenter(this.mapOptions.center)
      };
      const error = () => {
        this.locationEnabled = false
        this.snackbar = true
      };
      await navigator.geolocation.getCurrentPosition(success, error);
      try {
        const loader = getGoogleMapsLoader();
        const google = await loader.load();
        await this.initializeMap(google);
        this.loader = loader;

      } catch (e) {
        console.log(e);
      }

        if(this.$route.params.id){
            await this.handelLandEvaluationDetail()
            this.downloadPdfReportVisible= false
            this.selectorDisable=true
        }
    },
    computed: {

    },
    data() {
        return {
          crops: [],
          crop:[],
          cropsData:[],
            selectedCrop: null,
            loading: false,
            landSuitabilityId: null,
          dialogOpen: false,

          resultArray: [
          ],
            coordinates: {
                lat: null,
                lng: null,
            },
            latitude: '',
            longitude: '',
            farms: [],
            farm:null,
            elevationDetails:null,
            elevationDetail:null,
            details:null,
            loadingGenerateReportBtn:false,
            breadcrumbs: [
                {
                    text: this.$t("dashboard"),
                    disabled: false,
                    to: { name: "Users" },
                    exact: true,
                },
                {
                    text: this.$t("oma.landSuitibilityReport"),
                    disabled: true,
                    href: "breadcrumbs_link_1",
                },
            ],
            mapOptions: {
                mapTypeId: 'satellite',
                center: {
                },

                zoom: 14,
                disableDefaultUI: true,
                zoomControl: true,
            },
            landElevetionButtonVisible:true,
            downloadPdfReportVisible:true,
            searchBtnDisable:true,
            selectorDisable:false,
            polygonCoords: [],
            loader: null,
            loadingFarm: false,
            google: null,
            polygon: null,
            deforestImage: "",
            marker: null,
        };
    },
    methods: {
      async fetchCrops(farmId) {
        console.log(farmId, "farm id")
        this.loadingFarm = true
            await LandSuitabilityAndWeatherService.getCrops(farmId).then(res => {
              this.crops = res.data.states.map(el=>el.crops)
            
              this.cropData = res.data.states
                this.loadingFarm = false
            }).catch(() => {
                this.loadingFarm = false
            })
        },
        handleCropChange() {
          this.$emit('crop-selected', this.selectedCrop);
            console.log(this.crop, "crop")
        },
        evaluateClass(status){
            if(status === 'Highly suitable'){
                return 'highly-suitable'
            }else if(status === 'Moderately suitable'){
                return 'moderately-suitable'
            }else if(status === 'Unsuitable'){
                return 'unsuitable'
            }else if(status === 'Marginally Suitable'){
                return 'marginally-suitable'
            }
        },
      getScoreColor(score) {
        if (score < 50) return '#FF2600';
        if (score < 75 && score > 50) return '#FF8000';
        if (score < 90 && score > 75) return '#FFFF00';
        if (score > 90) return '#38A800';
      },
        groupByGroup(data) {
            return data.reduce((acc, item) => {
                if (!acc[item.group]) {
                    acc[item.group] = [];
                }
                acc[item.group].push(item);

                return acc;
            }, {});
        },
      async  handleFarmChange() {
            this.searchBtnDisable = false
            await this.fetchCrops(this.farm);
        },
        async getFarmas() {
            this.loadingFarm = true
            await LandSuitabilityAndWeatherService.getAllFarms().then(res => {
                this.farms = res.data.map(x => {
                    return {
                        id: x.id,
                        farmName: `${x.farmName} (${x.lat} ${x.log})`,
                        lat:x.lat,
                        lng:x.log
                    }
                })
                this.loadingFarm = false
            }).catch(() => {
                this.loadingFarm = false
            })
        },
        async handleSearchFarm(){
            if(!this.farm) return
            const farm = this.farms.filter(x=>x.id == this.farm)[0]
            this.coordinates = {
                lat: Number(farm.lat),
                lng: Number(farm.lng),

            }
            this.loadMapPointer()
            this.landElevetionButtonVisible=false;
        },

      async handleGetEvalutionAction(){
        this.loadingGenerateReportBtn=true
        await LandSuitabilityAndWeatherService.generateLandSuitabilityReport({farmId:this.farm, cropId:this.crop[0].id}).then(async (res) => {
            if(res.success){
                this.elevationDetails = this.groupByGroup(res.data['land_eval_details'])
                this.details = res.data;
                this.landSuitabilityId = res?.data?.id;
                this.downloadPdfReportVisible=false;
                this.landElevetionButtonVisible=true
                this.searchBtnDisable=true
            }
            else{
                this.$notify({
                    title: res.message || "Something went wrong!",
                    type: "error",
                });
            }

            this.loadingGenerateReportBtn=false
         
        }).catch(() => {this.loadingGenerateReportBtn=false})
      },

      async getLandEvaluationDetail(){
            this.startLoading()
            await LandSuitabilityAndWeatherService.getLandSuitabilityDetail(this.$route.params.id)
            .then(res => {
                this.farm=Number(res.data.farm_id)
                this.coordinates.lat= Number(res.data.latitude)
                this.coordinates.lng=Number(res.data.longitude)
                this.elevationDetails = this.groupByGroup(res.data['land_eval_details'])
                this.details = res.data
                this.stopLoading()
            }).catch(() => {  this.stopLoading() })
        },

      async handelLandEvaluationDetail(){
        await this.getLandEvaluationDetail();
        await this.handleSearchFarm()
        this.landElevetionButtonVisible=true
      },

        async loadMapPointer() {
            const success = () => {
                this.mapOptions.center.lat = this.coordinates?.lat
                this.mapOptions.center.lng = this.coordinates?.lng

                if (this.map) this.map.setCenter(this.mapOptions.center)
            };
            const error = () => {
                this.locationEnabled = false
                this.snackbar = true
            };
            await navigator.geolocation.getCurrentPosition(success, error);
            try {
              const loader = getGoogleMapsLoader();
              const google = await loader.load();
              await this.initializeMap(google);
              this.loader = loader;

            } catch (e) {
                console.log(e);
            }
        },

        async initializeMap(google) {
            this.google = google;
            const mapContainer = this.$refs.googleMap
            this.map = await new google.maps.Map(mapContainer, this.mapOptions);
            this.createMarker();
        },
        createMarker() {
            if (this.marker != null) this.marker.setMap(null);
            const latLng = { lat: this.coordinates.lat, lng: this.coordinates.lng };

            this.marker = new this.google.maps.Marker({
                position: latLng,
                // title:"Hello World!"
            });

            // To add the marker to the map, call setMap();
            this.marker.setMap(this.map);
        },
       
        async downloadReport() {
            this.startLoading();
            await new Promise((resolve) => setTimeout(resolve, 100));
            let fileName = `file_${new Date().getTime()}.jpg`;
            let el = this.$refs.googleMap;
            let canvasRes = await html2canvas(el, { scale: 2, useCORS: true });
            let outputDataUrl = canvasRes.toDataURL("image/jpeg");

            var imageBlob = this.dataURLtoBlob(outputDataUrl);

            const formData = new FormData();

            formData.append("image", imageBlob, fileName);
            formData.append("reportId", this.landSuitabilityId);
            const response = await LandSuitabilityAndWeatherService.downloadReport(formData,'land_suitability');

            this.downloadBlob(response.data,'land_report.pdf');
            this.stopLoading();
        },


        dataURLtoBlob(dataURL) {
            var arr = dataURL.split(",");
            var mime = arr[0].match(/:(.*?);/)[1];
            var bstr = atob(arr[1]);
            var n = bstr.length;
            var u8arr = new Uint8Array(n);

            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }

            return new Blob([u8arr], { type: mime });
        },
      openDialog() {
        this.dialogOpen = true;
      },
      closeDialog() {
        this.dialogOpen = false;
      },
      handleElevationDetail(details){
        this.elevationDetail=details
        this.resultArray = this.elevationDetail?.land_suitability_results.map((item)=>{
            return {
                name: item.name,
                id:item.value
            }
        })
        this.openDialog()
      },
    },
    mixins: [loadingMixin, download, getPermittedActions, DateMixin],
};
</script>
<style lang="scss" scoped>
::v-deep .highly-suitable{
 background-color: #38A800 !important;
 color:#38A800;
}

::v-deep .moderately-suitable{
   background-color: #FFFF00 !important;
   color:#FFFF00;
}

::v-deep .unsuitable{
   background-color:#FF2600 !important;
   color:#FF2600;
}
::v-deep .marginally-suitable{
    background-color: #FF8000 !important;
   color:#FF8000;
}

::v-deep .theme--dark.v-btn.v-btn--disabled.v-btn--has-bg {
    background: #787878 !important;
    color:#fff !important;
}
::v-deep .card-data {
    background: #F6F6F6;
    padding: 20px;
    margin-top: 20px;
}

::v-deep .card0-item {
    background: #FFFFFF;
    padding: 0px 10px 0px 10px;
    margin-bottom: 10px;
}

::v-deep .card0-item .left-text {
    color: #2D32BC;
    text-decoration: underline;
}

::v-deep .wdt.v-text-field {
    width: 250px;
}

::v-deep .red-color {
    width: 120px;
    height: 20px;
    background-color: #FF2600;
    position: relative;
}

::v-deep .yellow-color {
    width: 120px;
    height: 20px;
    background-color: #FFFF00;
    position: relative;
}

::v-deep .green-color {
    width: 120px;
    height: 20px;
    background: #38A800;
    position: relative;
}

::v-deep .lite-red-color {
    width: 120px;
    height: 20px;
    background: #FF8000;
    position: relative;
}

::v-deep .elevetations i {
    color: #000;
    left: 20%;
    top: -15px;
    position: absolute;
}

::v-deep .v-tab:hover {
    background-color: #caf1e2;
    color: $primary_color !important;
}

::v-deep .v-data-table-header span {
    color: black;
}

::v-deep .center-content {
    display: flex;
    justify-content: center;
    align-items: center;
}

::v-deep .img-center {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 40%;
}

::v-deep .center {
    text-align: center;
}

::v-deep.qr-code img {
    max-height: 140px;
}

.color-box {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    border-radius: 5px;
    margin-left: 10px;
}

::v-deep.theme--light.v-data-table.overall-probability>.v-data-table__wrapper>table>thead>tr:last-child>th,
::v-deep.theme--light.v-data-table.overall-probability>.v-data-table__wrapper>table>tbody>tr>td {
    text-align: center !important;
    padding: 0 !important;
}

.qr-box {
    display: flex;
    justify-content: center;
    align-items: center;
}

.qr-box i {
    font-size: 48px !important;
}

.share-b {
    background-color: transparent !important;
    border: none;
    box-shadow: none;
}

.cursor-pointer{
  cursor: pointer;
}

.suitability-text{
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
  text-align: center;
}
.overall-score{
  font-size: 24px;
  font-weight: 700;
  line-height: 24px;
  text-align: left;
  color: black;
}
.overall-score-text{
  font-size: 20px;
  font-weight: 500;
  line-height: 24px;
  text-align: left;
}

.chip{
  max-width: 20px !important;
  max-height: 20px;
}

</style>