<template>
    <div class="status-legend-section mt-6 mb-4 pa-4">
        <div class="legend-title font-weight-bold mr-3">
            {{ $t("deforestation.statusLegend") }}
            <v-tooltip top color="00BD73" max-width="350">
                <template v-slot:activator="{ on, attrs }">
                    <v-icon size="16" class="icon-with-background primary--text" style="color:#0EBF67" v-bind="attrs"
                        v-on="on">
                        mdi-information
                    </v-icon>
                </template>
                <span>{{ $t("deforestation.statusLegendInfo") }}</span>
            </v-tooltip>
        </div>
        <div class="legend-items d-flex flex-wrap align-center mt-2">
            <template>
                <div class="legend-item d-inline-flex align-center mr-4 mb-2" v-if="isDdsExporter">
                    <img src="/icons/dds/pending.svg" style="width: 20px; height: 20px; margin-right: 5px;" />
                    <span>{{ $t("deforestation.pendingOrNewlyReceived") }} </span>
                </div>
                <div class="legend-item d-inline-flex align-center mr-4 mb-2" v-else>
                    <img src="/icons/dds/sent.svg" style="width: 20px; height: 20px; margin-right: 5px;" />
                    <span>{{ $t("deforestation.sentToExporter") }}</span>
                </div>
                <span class="legend-item d-inline-flex align-center mr-4 mb-2">
                    <img src="/icons/dds/overdue.svg" style="width: 20px; height: 20px; margin-right: 5px;" /> {{
                        $t("deforestation.overdue") }}
                </span>
            </template>
            <span class="legend-item d-inline-flex align-center mr-4 mb-2">
                <img src="/icons/dds/updaterequired.svg" style="width: 20px; height: 20px; margin-right: 5px;" /> {{
                    $t("deforestation.updateRequired") }}
            </span>
            <span class="legend-item d-inline-flex align-center mr-4 mb-2">
                <img src="/icons/dds/pendingApproval.svg" style="width: 20px; height: 20px; margin-right: 5px;" /> {{
                    $t("deforestation.pendingApproval") }}
            </span>
            <span class="legend-item d-inline-flex align-center mr-4 mb-2">
                <img src="/icons/dds/ptsiapproved.svg" style="width: 20px; height: 20px; margin-right: 5px;" /> {{
                    $t("deforestation.approved") }}
            </span>
            <span class="legend-item d-inline-flex align-center mr-4 mb-2">
                <img src="/icons/dds/temporaryApproved.svg" style="width: 20px; height: 20px; margin-right: 5px;" /> {{
                    $t("deforestation.temporaryApproved") }}
            </span>
            <span class="legend-item d-inline-flex align-center mr-4 mb-2">
                <img src="/icons/dds/rejected.svg" style="width: 20px; height: 20px; margin-right: 5px;" /> {{
                    $t("deforestation.rejected") }}
            </span>
            <span class="legend-item d-inline-flex align-center mr-4 mb-2">
                <img src="/icons/dds/shipment.svg" style="width: 20px; height: 20px; margin-right: 5px;" /> {{
                    $t("deforestation.shipmentInProcess") }}
            </span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        isDdsExporter: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style lang="scss" scoped>
.status-legend-inline {
    font-size: 14px;
    flex-wrap: wrap;
}

.legend-label {
    color: #222;
}

.legend-item {
    white-space: nowrap;
    font-size: 14px;
}

.status-legend-section {
    background: #f8f9fa;
    border-radius: 10px;
    flex-wrap: wrap;
    font-size: 14px;
}

.legend-title {
    color: #222;
}

.legend-item {
    white-space: nowrap;
    font-size: 15px;
}
</style>