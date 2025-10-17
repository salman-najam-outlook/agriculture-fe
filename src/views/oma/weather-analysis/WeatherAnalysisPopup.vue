<template>
  <v-row justify="space-around">
    <v-col cols="auto">
      <v-dialog transition="dialog-top-transition" max-width="720" min-height="724" v-model="dialogVisible"
        @click:outside="closeDialog">
        <template>
          <v-card>
            <v-toolbar color="primary" dark flat dense>
              <v-toolbar-title class="font-weight-bold ml-1">{{ analysisDetail.group }}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon class="white--text" @click="closeDialog">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <h2 class="green--text mt-5 mb-3">{{ analysisDetail.name }}</h2>
              <h3 class="mb-5">{{$t("oma.valueAtTheCoordinatesOfInterest")}} : <span :class="statusClass">{{ $t(analysisDetail.value)
                  }}</span>
              </h3>

              <div class="google-map" style="width:100%;height:500px; z-index: 0;" id="map" ref="googleMap">
              </div>

              <v-container class="flex mt-5">
                <v-row class="d-flex mb-2">
                  <v-col cols="3" class="suitability-text">{{ $t("oma.unsuitable") }}</v-col>
                  <v-col cols="3" class="suitability-text">{{ $t("oma.marginally") }} {{ $t("oma.suitable") }}</v-col>
                  <v-col cols="3" class="suitability-text">{{ $t("oma.moderately") }} {{ $t("oma.suitable") }}</v-col>
                  <v-col cols="3" class="suitability-text">{{ $t("oma.highly") }} {{ $t("oma.suitable") }}</v-col>
                </v-row>
                <v-row class="d-flex mb-1" no-gutters>
                  <v-col cols="3" class="text-center" style="min-height: 20px; background-color: #FF2600; ">
                    <v-icon v-if="analysisDetail.originalStatus === 'Unsuitable'" class="mt-n9" size="20"
                      color="black">mdi-triangle</v-icon>
                  </v-col>
                  <v-col cols="3" class="text-center" style="min-height: 20px; background-color: #FF8000; ">
                    <v-icon v-if="analysisDetail.originalStatus === 'Marginally suitable'" class="mt-n9" size="20"
                      color="black">mdi-triangle</v-icon>
                  </v-col>
                  <v-col cols="3" class="text-center" style="min-height: 20px; background-color: #FFFF00;">
                    <v-icon v-if="analysisDetail.originalStatus === 'Moderately suitable'" class="mt-n9" size="20"
                      color="black">mdi-triangle</v-icon>
                  </v-col>
                  <v-col cols="3" class="text-center" style="min-height: 20px; background-color: #38A800;">
                    <v-icon v-if="analysisDetail.originalStatus === 'Highly suitable'" class="mt-n9" size="20"
                      color="black">mdi-triangle</v-icon>
                  </v-col>
                </v-row>

                <v-row class="d-flex" no-gutters>
                  <v-col cols="3" v-if="unsuitable" class="range-text">{{ unsuitable.range }}</v-col>
                  <v-col cols="3" v-if="unsuitable" class="range-text">{{ marginallySuitable.range }}</v-col>
                  <v-col cols="3" v-if="unsuitable" class="range-text">{{ moderatelySuitable.range }}</v-col>
                  <v-col cols="3" v-if="unsuitable" class="range-text">{{ highlySuitable.range }}</v-col>
                </v-row>

              </v-container>


            </v-card-text>
            <v-card-actions class="justify-end">
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
    </v-col>
  </v-row>
</template>
<script>


export default {
  async mounted() {
    setTimeout(async () => await this.initializeMap(this.google), 500)
  },
  props: {
    isOpen: {
      type: Boolean
    },
    analysisDetail: {
      type: Object,
      required: true
    },
    details: {
      type: Object,
      required: true
    },
    google:{
      type:Object,
      required: true
    }
  },
  data() {
    return {
      dialogVisible: this.isOpen,
      loader: null,
      map: null,
      polygon: null,
      mapOptions: {
        center: {
          lat: Number(this.details.latitude),
          lng: Number(this.details.longitude)
        }
      }
    };
  },
  computed: {
    polygonCoords() {
      return this.details.bbox_coordinates.map(x => {
        return {
          lat: Number(x[0]),
          lng: Number(x[1]),
        };
      })
    },
    unsuitable() {
      return this.analysisDetail.weather_eval_class.find(item => item.originalClass === "Unsuitable");
    },
    marginallySuitable() {
      return this.analysisDetail.weather_eval_class.find(item => item.originalClass === "Marginally suitable");
    },
    moderatelySuitable() {
      return this.analysisDetail.weather_eval_class.find(item => item.originalClass === "Moderately suitable");
    },
    highlySuitable() {
      return this.analysisDetail.weather_eval_class.find(item => item.originalClass === "Highly suitable");
    },
    statusClass() {
      let statusClass = null;
      if (this.analysisDetail.originalStatus === 'Highly suitable') {
        statusClass = 'highly-suitable';
      } else if (this.analysisDetail.originalStatus === 'Moderately suitable') {
        statusClass = 'moderately-suitable';
      } else if (this.analysisDetail.originalStatus === 'Unsuitable') {
        statusClass = 'unsuitable';
      } else if (this.analysisDetail.originalStatus === 'Marginally suitable') {
        statusClass = 'marginally-suitable';
      }
      return statusClass
    }

  },
  watch: {
    isOpen(newValue) {
      this.dialogVisible = newValue;
    }
  },
  methods: {
    closeDialog() {
      this.$emit("close-properties");
    },

    async createPolygon() {
      if (this.polygon != null) this.polygon.setMap(null);
      this.polygon = await new this.google.maps.Polygon({
        paths: this.polygonCoords,
        //strokeColor: "transparent",
        strokeColor: 'transparent', //"#1F5D51",
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: "#E5F8F1",
        fillOpacity: 0,
        editable: false,
        draggable: false,
        icon: this.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
      });

      this.polygon.setMap(this.map);
      return Promise.resolve(true);
    },
    getPolygonBounds() {
      var paths = this.polygon.getPaths();
      var bounds = new this.google.maps.LatLngBounds();
      paths.forEach(function (path) {
        var ar = path.getArray();
        for (var i = 0, l = ar.length; i < l; i++) {
          bounds.extend(ar[i]);
        }
      });
      return bounds;
    },
    async initializeMap(google) {
      console.log(this.mapOptions, this.polygonCoords)
      this.google = google;
      const mapContainer = this.$refs.googleMap;
      this.map = await new google.maps.Map(mapContainer, this.mapOptions);
      await this.createPolygon();
      let bounds = this.getPolygonBounds();
      console.log(JSON.stringify(bounds), "coordinates bounds");
      // The custom USGSOverlay object contains the USGS image,
      // the bounds of the image, and a reference to the map.
      class USGSOverlay extends google.maps.OverlayView {
        bounds_;
        image_;
        div_;
        constructor(bounds, image) {
          super();
          // Initialize all properties.
          this.bounds_ = bounds;
          this.image_ = image;
          // Define a property to hold the image's div. We'll
          // actually create this div upon receipt of the onAdd()
          // method so we'll leave it null for now.
          this.div_ = null;
        }
        /**
         * onAdd is called when the map's panes are ready and the overlay has been
         * added to the map.
         */
        onAdd() {
          this.div_ = document.createElement("div");
          this.div_.style.borderStyle = "none";
          this.div_.style.borderWidth = "0px";
          this.div_.style.position = "absolute";

          // Create the img element and attach it to the div.
          const img = document.createElement("img");

          img.src = this.image_;

          // console.log(img, 'img')
          img.style.width = "100%";
          img.style.height = "100%";
          img.style.position = "absolute";
          this.div_.appendChild(img);

          // Add the element to the "overlayLayer" pane.
          const panes = this.getPanes();

          panes.overlayLayer.appendChild(this.div_);
        }
        draw() {
          // We use the south-west and north-east
          // coordinates of the overlay to peg it to the correct position and size.
          // To do this, we need to retrieve the projection from the overlay.
          const overlayProjection = this.getProjection();
          // Retrieve the south-west and north-east coordinates of this overlay
          // in LatLngs and convert them to pixel coordinates.
          // We'll use these coordinates to resize the div.
          const sw = overlayProjection.fromLatLngToDivPixel(
            this.bounds_.getSouthWest()
          );
          // console.log(sw, 'sw')
          const ne = overlayProjection.fromLatLngToDivPixel(
            this.bounds_.getNorthEast()
          );
          // console.log(ne, 'ne')

          // Resize the image's div to fit the indicated dimensions.
          if (this.div_) {
            this.div_.style.left = sw.x + "px";
            this.div_.style.top = ne.y + "px";
            this.div_.style.width = ne.x - sw.x + "px";
            this.div_.style.height = sw.y - ne.y + "px";
            // console.log(ne.x - sw.x + "px", 'width')
            // console.log(sw.y - ne.y + "px", 'height')
          }
        }
        /**
         * The onRemove() method will be called automatically from the API if
         * we ever set the overlay's map property to 'null'.
         */
        onRemove() {
          if (this.div_) {
            this.div_.parentNode.removeChild(this.div_);
            this.div_ = null;
          }
        }
      }
      this.map.fitBounds(bounds);
      const srcImage = this.analysisDetail.url;
      //const srcImage = 'https://res.cloudinary.com/demo/image/upload/w_400/sample.jpg';

      const overlay = new USGSOverlay(
        bounds,
        srcImage,
        document.getElementById("map")
      );
      overlay.setMap(this.map);
    },

  },
};
</script>

<style scoped>
.range-text {
  font-size: 10px;
  font-weight: 400;
  line-height: 24px;
  text-align: center;
}

.suitability-text {
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  text-align: center;
}

.unsuitable {
  color: #FF2600;
}

.marginally-suitable {
  color: #FF8000;
}

.moderately-suitable {
  color: #FFFF00;
}

.highly-suitable {
  color: #38A800;
}
</style>