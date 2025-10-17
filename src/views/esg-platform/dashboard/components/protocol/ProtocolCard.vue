<template>

    <div>
        <v-card elevation="0" class="px-5 my-3">
            <v-card-title class="text-h6 font-weight-bold">
                {{ protocol.title }}
            </v-card-title>
            <v-card-text>
                <div class="protocol-main-container">
                    <div class="protocol-left-section">
                        <v-img :src="protocol.sealUrl" contain class="protocol-image" :alt="protocol.title"></v-img>
                    </div>
                    <div class="protocol-right-section">
                        <div class="protocol-info-wrapper">
                            <div class="protocol-info-list">
                                <v-list dense class="protocol-list">
                                    <v-list-item>
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                <span class="font-weight-bold text-h6">{{ protocol.title ?
                                                    protocol.title
                                                    : 'N/A' }}</span>
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>

                                    <v-list-item v-if="!isSubEnterprise">
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                <span class="font-weight-bold">{{ $t('esgPlatform.subOrganizations') }}:
                                                    {{ protocol.subOrganizations.length ?
                                                        protocol.subOrganizations.length : 0 }}</span>
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>

                                    <v-list-item v-if="!isSubEnterprise">
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                <span class="font-weight-bold">{{ $t('esgPlatform.farms') }}: {{
                                                    protocol.farmCount ? protocol.farmCount : 0 }}</span>
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>

                                    <v-list-item v-if="!isSubEnterprise">
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                <span class="font-weight-bold"> {{ $t('esgPlatform.farmers') }}: {{
                                                    protocol.farmerCount ? protocol.farmerCount : 0 }}</span>
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>

                                    <v-list-item>
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                <span class="font-weight-bold"> {{ $t('esgPlatform.totalGoals') }}: {{
                                                    protocol.noOfGoals ? protocol.noOfGoals : 0 }}</span>
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-list-item>
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                <span class="font-weight-bold"> {{ $t('esgPlatform.startDate') }}: {{
                                                    protocol.startDate ? formatDateUTC(protocol.startDate) : 'N/A'
                                                    }}</span>
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-list-item>
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                <span class="font-weight-bold"> {{ $t('esgPlatform.deadline') }}: {{
                                                    protocol.deadlineDate ? formatDateUTC(protocol.deadlineDate) : "N/A"
                                                    }}</span>
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-list-item>
                                        <v-list-item-content>
                                            <v-list-item-title class="d-flex align-center gap-4">
                                                <span class="font-weight-bold">{{ $t('esgPlatform.standard') }}:</span>
                                                <span class="d-flex align-center pl-4">
                                                    <template
                                                        v-if="protocol.esgStandard && protocol.esgStandard.sealUrl">
                                                        <v-img :src="protocol.esgStandard.sealUrl" contain height="55px"
                                                            width="55px" class="rounded-lg"></v-img>
                                                    </template>
                                                    <h4 class="pl-2">{{ protocol.esgStandard ?
                                                        protocol.esgStandard.title : 'N/A' }} </h4>
                                                </span>
                                            </v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </div>
                            <div class="protocol-progress-section">
                                <v-card elevation="3" class="protocol-progress-card">
                                    <div class="progress-card-content">
                                        <div class="progress-text">
                                            <h2 class="progress-title">
                                                {{ protocol.title ? protocol.title : '' }}
                                            </h2>
                                            <span class="progress-subtitle">{{
                                                $t('esgPlatform.progress.protocolProgress') }}</span>
                                        </div>
                                        <div class="progress-circle">
                                            <v-progress-circular v-if="isLoading" indeterminate color="primary"
                                                class="ma-4" />
                                            <v-progress-circular v-else class="bg-white" :rotate="-90" :size="120"
                                                :width="6" :value="currentProgressData?.Overall" color="primary">
                                                <span class="text-h6">{{ currentProgressData?.Overall }}%</span>
                                            </v-progress-circular>
                                        </div>
                                    </div>
                                </v-card>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="progress-cards-container">
                    <div class="progress-card-wrapper environmental-card">
                        <v-card elevation="3" class="esg-progress-card">
                            <div class="progress-card-content">
                                <div class="progress-text">
                                    <h2 class="progress-title">
                                        {{ $t('esgPlatform.environmental') }}
                                    </h2>
                                    <span class="progress-subtitle">{{ $t('esgPlatform.progress.progress') }}</span>
                                </div>
                                <div class="progress-circle">
                                    <v-progress-circular v-if="isLoading" indeterminate color="primary" class="ma-4" />
                                    <v-progress-circular v-else :rotate="-90" :size="120" :width="6"
                                        :value="currentProgressData?.Environmental" color="#FFC107">
                                        <span class="text-h6">{{ currentProgressData?.Environmental }}%</span>
                                    </v-progress-circular>
                                </div>
                            </div>
                        </v-card>
                    </div>
                    <div class="progress-card-wrapper social-card">
                        <v-card elevation="3" class="esg-progress-card">
                            <div class="progress-card-content">
                                <div class="progress-text">
                                    <h2 class="progress-title">
                                        {{ $t('esgPlatform.social') }}
                                    </h2>
                                    <span class="progress-subtitle">{{ $t('esgPlatform.progress.progress') }}</span>
                                </div>
                                <div class="progress-circle">
                                    <v-progress-circular v-if="isLoading" indeterminate color="primary" class="ma-4" />
                                    <v-progress-circular v-else :rotate="-90" :size="120" :width="6"
                                        :value="currentProgressData?.Social" color="#4CAF50">
                                        <span class="text-h6">{{ currentProgressData?.Social }}%</span>
                                    </v-progress-circular>
                                </div>
                            </div>
                        </v-card>
                    </div>
                    <div class="progress-card-wrapper governance-card">
                        <v-card elevation="3" class="esg-progress-card">
                            <div class="progress-card-content">
                                <div class="progress-text">
                                    <h2 class="progress-title">
                                        {{ $t('esgPlatform.governance') }}
                                    </h2>
                                    <span class="progress-subtitle">{{ $t('esgPlatform.progress.progress') }}</span>
                                </div>
                                <div class="progress-circle">
                                    <v-progress-circular v-if="isLoading" indeterminate color="primary" class="ma-4" />
                                    <v-progress-circular v-else :rotate="-90" :size="120" :width="6"
                                        :value="currentProgressData?.Governance" color="#F44336">
                                        <span class="text-h6">{{ currentProgressData?.Governance }}%</span>
                                    </v-progress-circular>
                                </div>
                            </div>
                        </v-card>
                    </div>
                </div>

                <v-btn color="primary" v-if="this.$route.name !== 'ProtocolDetails'" class="my-5"
                    @click="navigateToProtocolDetails">{{
                        $t('esgPlatform.viewDetails')
                    }}</v-btn>

            </v-card-text>
        </v-card>

    </div>
</template>

<script>
import dateMixin from "@/mixins/DateMixin";
import ESGService from "@/_services/EsgService";
import { mapGetters } from 'vuex';

export default {
    props: {
        protocol: {
            type: Object,
            required: true
        },
        progressData: {
            type: Object,
            required: false
        }
    },
    async mounted() {
        await this.getProtocolProgress();
    },
    computed: {
        ...mapGetters(['isSubEnterprise']),
        currentProgressData() {
            return this.localProgressData || this.progressData;
        }
    },
    data() {
        return {
            isLoading: false,
            progress: null,
            localProgressData: null

        };
    },
    methods: {
        async getProtocolProgress() {
            const protocolId = this.protocol.id
            this.isLoading = true
            const response = await ESGService.getProtocolProgress(protocolId)
            this.localProgressData = response.data
            this.isLoading = false


        },
        navigateToProtocolDetails() {
            this.$router.push({
                name: 'ProtocolDetails',
                params: { id: this.protocol._id }
            });
        },

    },
    mixins: [dateMixin],
}
</script>

<style scoped>
/* Main container with flex layout */
.protocol-main-container {
    display: flex;
    gap: 20px;
    align-items: center;
    flex-wrap: wrap;
    min-height: 400px;
}

/* Left section for the protocol image */
.protocol-left-section {
    flex: 0 0 auto;
    min-width: 300px;
}

.protocol-image {
    width: 390px;
    height: 250px;
    margin-bottom: 16px;
}

/* Right section containing info and progress */
.protocol-right-section {
    flex: 1;
    background-color: #F5F5F5;
    border-radius: 20px;
    padding: 20px;
    min-height: 380px;
}

.protocol-info-wrapper {
    display: flex;
    gap: 20px;
    height: 100%;
    align-items: center;
}

/* Protocol info list */
.protocol-info-list {
    flex: 1;
    min-width: 300px;
}

.protocol-list {
    background-color: #F5F5F5;
    height: auto;
    min-height: 290px;
}

/* Progress section */
.protocol-progress-section {
    flex: 0 0 auto;
    min-width: 300px;
}

.protocol-progress-card {
    width: 100%;
    max-width: 460px;
    height: 205px;
    border-radius: 20px;
    padding: 20px;
    text-align: center;
}

.progress-card-content {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: space-between;
    gap: 30px;
}

.progress-text {
    flex: 1;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.progress-title {
    font-size: 1rem;
    font-weight: bold;
    margin: 0;
    padding: 0;
    min-width: 120px;
}

.progress-subtitle {
    font-size: 1rem;
    font-weight: bold;
    margin: 0;
    padding: 8px 0 0 0;
}

.progress-circle {
    flex: 0 0 auto;
}

/* Bottom progress cards container */
.progress-cards-container {
    display: flex;
    gap: 20px;
    margin-top: 20px;
    flex-wrap: wrap;
}

.progress-card-wrapper {
    flex: 1;
    min-width: 300px;
}

.esg-progress-card {
    width: 100%;
    max-width: 460px;
    height: 205px;
    border-radius: 20px;
    padding: 20px;
    text-align: center;
}

/* Background colors for different progress cards */
.environmental-card .esg-progress-card {
    background-color: #E4FFF2;
}

.social-card .esg-progress-card {
    background-color: #E4FBFF;
}

.governance-card .esg-progress-card {
    background-color: #FFF4E8;
}

/* Responsive design */
@media (max-width: 1200px) {
    .protocol-info-wrapper {
        flex-direction: column;
        gap: 20px;
    }

    .protocol-progress-section {
        min-width: auto;
    }

    .protocol-progress-card {
        max-width: 100%;
    }
}

@media (max-width: 960px) {
    .protocol-main-container {
        flex-direction: column;
    }

    .protocol-left-section {
        min-width: auto;
    }

    .protocol-image {
        width: 100%;
        max-width: 390px;
        height: auto;
    }

    .protocol-right-section {
        min-height: auto;
    }

    .progress-cards-container {
        flex-direction: column;
    }

    .progress-card-wrapper {
        min-width: auto;
    }
}

@media (max-width: 600px) {
    .protocol-right-section {
        padding: 15px;
    }

    .progress-card-content {
        flex-direction: column;
        gap: 15px;
        text-align: center;
    }

    .progress-text {
        text-align: center;
    }

    .progress-title {
        min-width: auto;
    }

    .esg-progress-card {
        height: auto;
        min-height: 180px;
    }

    .protocol-progress-card {
        height: auto;
        min-height: 180px;
    }
}
</style>
