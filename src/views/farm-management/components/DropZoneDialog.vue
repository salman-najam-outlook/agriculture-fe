<template>
    <v-dialog v-model="showDropZone" width="900px" persistent>
    <v-card>
        <v-toolbar  flat color="secondary">
                <v-toolbar-title class="white--text">
                  {{$t("farm.uploadGeofence")}}
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon class="white--text" @click="closePopup">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
        
        <v-card-text>
                         <div class="form">
                                <!-- <div v-if="!file"> -->
                                  
                                <div style="overflow: clip" :class="['dropZone', dragging ? 'dropZone-over' : '']" @dragenter="dragging = true" @dragleave="dragging = false">
                                    <div class="dropZone-info" @drag="onChange">
                                        <span class="fa fa-cloud-upload dropZone-title"></span>
                                        <div class="dropZone-title"  v-if="!previewUrl" >
                                            <v-icon size="120"  color="gray">mdi-upload</v-icon>
                                        </div>
                                        <div class="dropZone-title"  v-else>
                                            <v-icon size="120"  color="primary">mdi-check</v-icon>
                                        </div>
                                        <div>
                                            {{ file.name }}
                                        </div>
                                        <!-- <div class="d-flex-start">
                                            <div class="primary--text">Browse </div>
                                        </div> -->
                                        <div class="dropZone-upload-limit-info">
                                            <div id="preview" >
                                                <div v-if="previewUrl">
                                                    <v-icon size="120"  color="primary">mdi-tick</v-icon>
                                                </div>
                                            </div>
                                            <v-icon size="120"  color="primary">mdi-tick</v-icon>
                                        </div>
                                    </div>
                                    <input class="mt-2" type="file"  accept="application/vnd.shp" @change="onChange">
                                </div>
                               
                                    <span class="red--text">{{ fileError }}</span>
                                <!-- </div> -->
                                <!-- <div v-else class="dropZone-uploaded" style="overflow: clip;">
                                 
                                    <div class="dropZone-uploaded-info">
                                    <v-btn
                                        class="ma-2 white--text"
                                        @click="removeFile"
                                        color="primary"
                                        outlined
                                    >
                                        Remove File
                                        <v-icon
                                            right
                                            dark
                                        >
                                            mdi-trash-can
                                        </v-icon>
                                    </v-btn>
                                    </div>
                                </div> -->
                            </div>
                            <v-divider class="mt-5 mb-5"></v-divider>
                    <v-card-actions >
                <v-spacer></v-spacer>
                <v-btn
                    color="green darken-1"
                    text
                    outlined
                    @click="closePopup"
                >
                    {{ $t("cancel")}}
                </v-btn>
                <v-btn
                    depressed
                    color="primary"
                    @click="extractCoordinates"
                    :disabled="!file"
                >
                    {{ $t("farm.upload") }}
                </v-btn>
            </v-card-actions>
            
                    </v-card-text>
             
    </v-card>
</v-dialog>
           
</template>

<script>
import * as shapefile from "shapefile"
import loadingMixin from "@/mixins/LoadingMixin";
export default {
    mixins: [loadingMixin],
    data() {
        return {
            previewUrl: '',
            file: '',
            fileError: '',
            dragging: false,
            coordinateArray: []
        }
    },
    props:{
        showDropZone: {
            type: Boolean
        }
    },
    mounted() {

    },
    methods: {
         fileToArrayBuffer(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();

                reader.onload = () => {
                    resolve(reader.result);
                };

                reader.onerror = () => {
                    reject(reader.error);
                };

                reader.readAsArrayBuffer(file);
            });
        },
       async extractCoordinates() {
        this.startLoading()
            let shapeArrayBuff = await this.fileToArrayBuffer(this.file)
            let resultArr = await this.readShapefile(shapeArrayBuff)
            console.log(resultArr, 'res arr')
            resultArr.forEach(res => {
                this.coordinateArray = [...this.coordinateArray, ...res.geometry.coordinates] 
            })
            this.coordinateArray = this.coordinateArray.flat()
        this.stopLoading()
        this.$emit('close-shapefile-modal', this.coordinateArray)

        },

        async  readShapefile(shapeArrayBuff) {
            try {
                const source = await shapefile.open(shapeArrayBuff);

                const resultArr = [];
                /* eslint-disable */
                async function log(result) {
                    if (result.done) return;
                    resultArr.push(result.value);
                    console.log(result.value, 'result value');
                    await source.read().then(log);
                }

                await source.read().then(log);

                return resultArr;
            } catch (error) {
                this.stopLoading()
                console.error(error.stack);
                this.$notify({
                    title: this.$t('Corrupted file'),
                    type: "error"
                });

            }
        },
        closePopup() {
            this.$emit('close-without-change')
        },
        
        onChange(e) {
            var files = e.target.files || e.dataTransfer.files;
            
            const file = e.target.files[0];
            
            //validate file by file name, shapefile doesnt give mimetype apparently
            let extensionStr = file.name.slice(-4)
            if(extensionStr != ".shp") 
             {
                this.$notify({
                    title: this.$t('Please upload a shapefile'),
                    type: "error"
                });
                return
             }
            this.previewUrl = URL.createObjectURL(file);
            if (!files.length) {
                this.dragging = false;
                return;
            }
            
            this.createFile(files[0]);
        },
        createFile(file) {
            this.file = file;
            console.log(this.file)
            this.dragging = false;
        },
        removeFile() {
            this.file = '';
        },
    }

}
</script>

<style lang="scss" scoped>
    ::v-deep .phone-drop .v-input__slot {
        padding-right: 0px !important;
    }

.dropZone {
    width: 100%;
    height: 450px;
    position: relative;
    border: 2px dashed #97A8B8;
    margin-top: 20px;
}

.dropZone:hover {
  border: 2px solid $primary-color;
}

.dropZone:hover .dropZone-title {
  color: $primary-color;
}

.dropZone-info {
  color: #A8A8A8;
  position: absolute;
  top: 50%;
  width: 100%;
  transform: translate(0, -50%);
  text-align: center;
}

.dropZone-title {
    color: #787878; 
}

.dropZone input {
    position: absolute;
    cursor: pointer;
    top: 0px;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
}

.dropZone-upload-limit-info {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    overflow: clip;
}

.dropZone-over {
    background: #5C5C5C;
    opacity: 0.8;
    overflow: clip;
}

.dropZone-uploaded {
    width: 100%;
    height: 450px;
    position: relative;
    border: 2px solid $primary-color;
    overflow: clip;
    // border-radius: 10px;
}

.dropZone-uploaded-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #A8A8A8;
  position: absolute;
  top: 50%;
  width: 100%;
  transform: translate(0, -50%);
  text-align: center;
  overflow: clip;
}

.removeFile {
  width: 200px;
}

.vertical-center {
  margin: 0;
  position: absolute;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}

.flex-direction-box {
	height: 30em;
	max-height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}
.btn {
    text-transform: unset !important;
}

::v-deep .v-select.v-text-field:not(.v-text-field--single-line) input {
    margin-top: -10in;
}
</style>