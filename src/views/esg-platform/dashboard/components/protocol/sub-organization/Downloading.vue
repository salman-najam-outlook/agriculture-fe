<template>
    <v-dialog v-model="dialog" width="600">
        <v-card>
            <v-toolbar color="primary" class="white--text" flat :elevation="0">
                <v-toolbar-title class="font-weight-bold">{{ $t('esgPlatform.downloading') }}</v-toolbar-title>

                <v-spacer></v-spacer>

                <v-btn icon class="white--text" @click="cancelDownload">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text class="text-center py-8">
                <div class="custom-spinner-container">
                    <v-progress-circular :rotate="rotate" :size="50" :width="4" color="green" indeterminate
                        class="custom-spinner"></v-progress-circular>
                </div>
                <p class="mt-4">
                    {{ $t('esgPlatform.downloadingDesc') }}
                </p>
            </v-card-text>

            <v-card-actions class="justify-center">
                <v-btn text @click="cancelDownload" color="primary" outlined>{{ $t('cancel') }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        dialog: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            rotate: 0,
        };
    },
    mounted() {
        this.startAnimation(); 
    },
    methods: {
        startAnimation() {
            setInterval(() => {
                this.rotate += 10;
                if (this.rotate >= 360) {
                    this.rotate = 0;
                }
            }, 50); 
        },
        cancelDownload() {
            console.log('Download cancelled');
            this.$emit('close');
        },
    },
};
</script>

<style scoped>
.custom-spinner-container {
    position: relative;
    display: inline-block;
}

.progress-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-weight: bold;
}
</style>