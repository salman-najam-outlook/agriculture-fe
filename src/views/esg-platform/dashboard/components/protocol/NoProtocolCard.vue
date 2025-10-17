<template>
    <v-card elevation="0" class="px-5">
        <v-card-text>
            <v-row style="margin-left:-30px; margin-bottom: 20px; margin-top: 15px;">
                <v-col cols="8" class="mx-auto">
                    <div class="text-center">
                        <img src="/img/esg/compas.svg" width="300" />
                        <div class="desc py-8">
                            <h2 class="black--text">{{ $t('esgPlatform.getStartedWithEsg') }}</h2>
                            <p class="pt-2">{{ $t('esgPlatform.getStartedEsgMsg') }}</p>
                        </div>
                        <v-btn color="primary" dark @click="navigateToProtocol" :disabled="!selectedStandard">
                            {{ $t('esgPlatform.startNewEsgProtocol') }}
                        </v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    props: {
        selectedStandard: {
            type: [String, Number],
            default: null
        }
    },
    methods: {
        navigateToProtocol() {
            this.$router.push({
                name: 'esgStandardProtocol',
                params: {
                    id: this.selectedStandard
                }
            });
        }
    }
}
</script>