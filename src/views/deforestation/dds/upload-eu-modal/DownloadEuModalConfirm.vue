<template>
    <v-container>
        <v-dialog v-model="dialog1" width="800" @click:outside="closeModal">
            <v-card rounded="0">
                <v-toolbar color="primary" class="white--text" flat>
                    <v-toolbar-title class="font-weight-bold"> Download </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon class="white--text" @click="closeModal">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>

                <v-card-text class="pa-10 mb-5">
                    <v-row class="mb-4">
                        <v-col cols="12">
                            <h2 class="font-weight-bold"> Due Diligence Report (DD-00452) has been successfully downloaded.</h2>
                        </v-col>
                    </v-row>
                    <div class="btn-div d-flex flex-row-reverse">
                            <v-btn type="submit" color="primary" width="112"> Confirm </v-btn>
                            <!-- <v-btn outlined class="mr-2" color="primary" width="112">
                                {{ $t('cancel') }}
                            </v-btn> &nbsp; &nbsp; -->
                        </div>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin";

export default {
    name: 'eu-upload',
    props: {
        dialog: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        dialog1: {
            get() {
                return this.dialog
            },
        }
    },
    data() {
        return {
            confirml:1
        }
    },
    methods: {
        closeModal() {
            this.$emit("closeEuUpload")
        },
    },
    mixins: [loadingMixin],
}
</script>

<style lang="scss" scoped>
.draw-signature {
    border: double 3px transparent;
    border-radius: 5px;
    background-image: linear-gradient(white, white),
        radial-gradient(circle at top left, #4bc5e8, #9f6274);
    background-origin: border-box;
    background-clip: content-box, border-box;
}

.dropZone {
    width: 100%;
    height: 200px;
    position: relative;
    border: 2px dashed #97A8B8;
}

.upload-document {
    width: 100%;
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
    //border-radius: 10px;
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

.blue-color {
    color: #0057BD;
}

.underline {
    text-decoration: underline;
}

.gray-color {
    color: #979797;
}

.pdf-box {
    height: 75px;
    width: 75px;
    background-color: #e5f8f1;
    position: relative;
    line-height: 75px;
    text-align: center;
}

.pdf-box h1 {
    color: #135B00;
}

.blue-color {
    color: #0057BD;
}

.underline {
    text-decoration: underline;
}

.gray-color {
    color: #979797;
}

.pdf-box {
    height: 75px;
    width: 75px;
    background-color: #e5f8f1;
    position: relative;
    line-height: 75px;
    text-align: center;
}

.pdf-box h1 {
    color: #135B00;
}

.img-item img {
    max-height: inherit;
}

.img-item button {
    position: absolute;
    right: 0;
    color: red;
    cursor: pointer;
}
</style>