<template>
    <div class="hero-container">
        <img :src="isIndonesianClient ? '/img/eudr-dds/ptsi-hero.jpg' : '/img/eudr-dds/naccu-hero.png'" alt="" class="hero-image" />
        <div class="hero-content px-10 py-8">
            <h1 class="mb-3">
                {{ $t('dueDiligence.accessAndVerify') }}
            </h1>
            <p>{{ $t('dueDiligence.searchReportOrShipmentTitle') }}</p>
            <div class="d-flex flex-column flex-md-row align-stretch flex-nowrap mt-8" style="gap: 0.5rem">
                <v-text-field v-model="search" class="flex-grow-1 black--text white"
                    :placeholder="$t('dueDiligence.searchReportOrShipmentPlaceholder')"
                    outlined hide-details="auto"
                    clearable
                    @click:clear="handleClear"
                    @keyup.enter="searchReport" />
                <v-btn color="primary" @click="searchReport" large style="height: auto; font-weight: 700">
                    {{ $t('search') }}
                    <v-icon right style="color: white !important;">mdi-arrow-right-thin</v-icon>
                </v-btn>
            </div>
        </div>
    </div>
</template>

<script>
import { isIndonesianClient, isKenyaClient } from "@/utils";

export default {
    props: {
        currentTab: {
            type: String,
            default: 'tab-reports'
        }
    },
    data() {
        return {
            search: '',
        };
    },
    computed: {
        isIndonesianClient() {
            return isIndonesianClient();
        },
        isKenyaClient() {
            return isKenyaClient();
        },
    },
    methods: {
        handleClear() {
            if (this.currentTab === 'tab-shipments') {
                this.$emit('searchShipment', {
                    value: '',
                    isShipmentId: true
                });
            } else {
                this.$emit('searchReport', {
                    value: '',
                    isReportId: true
                });
            }
        },
        searchReport() {
            if (!this.search?.trim()) {
                return;
            }
            
            const searchValue = this.search?.trim() || '';
            
            if (this.currentTab === 'tab-shipments') {
                // For shipments, search by shipmentId (extract number from search)
                const shipmentId =  searchValue;
                const isShipmentId = true;
                
                this.$emit('searchShipment', {
                    value: shipmentId,
                    isShipmentId: isShipmentId
                });
            } else {
                // For reports, search by internalReferenceNumber
                const isReportId = searchValue;
                
                this.$emit('searchReport', {
                    value: searchValue,
                    isReportId: isReportId
                });
            }
        },
    }
};
</script>

<style scoped>
.hero-container {
    position: relative;
    height: 430px;
    display: flex;
    align-items: center;
    justify-content: left;
}

.hero-container::after {
    z-index: 2;
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    content: '';
    background: linear-gradient(90deg, rgba(1, 18, 38, 0.7) 0%, rgba(1, 31, 65, 0.6) 30%, rgba(7, 45, 86, 0.4) 60%, rgba(0, 123, 255, 0.1) 100%);
    left: 0;
    top: 0;
}

.hero-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1;
}

.hero-content {
    position: relative;
    z-index: 3;
    color: #fff;
    max-width: max(640px, 50%);
    backdrop-filter: blur(1px);
}
</style>