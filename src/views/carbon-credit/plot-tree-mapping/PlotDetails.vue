<template>
    <v-dialog v-model="dialog" width="900">
        <v-card outlined>
            <v-card-title class="primary white--text">
                Plot Details
                <v-spacer />

                <v-btn color="white" icon @click="closeDialog">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>


            <!-- Plot Number and Image -->
            <v-card-text class="pa-4">
                <v-row class="mb-2 d-flex justify-space-between align-center">
                    <v-col cols="6">
                        <span class="font-weight-bold">Plot Number:</span> {{ plot.plot_no || 'N/A' }}
                    </v-col>
                    <v-col cols="6" class="d-flex justify-end">
                        <v-menu offset-y>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn color="primary" dark v-bind="attrs" v-on="on">
                                    {{ $t('download') }}
                                    <v-icon right>mdi-chevron-down</v-icon>
                                </v-btn>
                            </template>
                            <v-list>
                                <v-list-item @click="downloadPDF">
                                    <v-list-item-title>Download as PDF</v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="downloadXLS">
                                    <v-list-item-title>Download as XLS</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </v-col>
                </v-row>

                <!-- Map -->
                <GmapMap v-if="plot.latitude && plot.longitude"
                    :center="{ lat: parseFloat(plot.latitude), lng: parseFloat(plot.longitude) }" :zoom="12"
                    map-type-id="satellite" style="width: 100%; height: 400px; border-radius: 8px; margin-bottom: 24px">
                    <GmapMarker :position="{ lat: parseFloat(plot.latitude), lng: parseFloat(plot.longitude) }"
                        :clickable="true" :draggable="false" :title="plot.plot_no" />
                </GmapMap>


                <!-- Plot Details Grid -->
                <v-row>
                    <v-col cols="6" md="4">
                        <v-sheet class="pa-2" color="#e8f5e9">
                            <div class="caption">Latitude <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon v-bind="attrs" v-on="on" size="16">mdi-information-outline</v-icon>
                                    </template>
                                    <span>Latitude is the angular distance of a point north or south of the
                                        Equator.</span>
                                </v-tooltip></div>
                            <div class="font-weight-bold">{{ plot.latitude || 'N/A' }}</div>
                        </v-sheet>
                    </v-col>
                    <v-col cols="6" md="4">
                        <v-sheet class="pa-2" color="#e8f5e9">
                            <div class="caption">Longitude <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon v-bind="attrs" v-on="on" size="16">mdi-information-outline</v-icon>
                                    </template>
                                    <span>Longitude is the angular distance of a point east or west of the Prime
                                        Meridian.</span>
                                </v-tooltip></div>
                            <div class="font-weight-bold">{{ plot.longitude || 'N/A' }}</div>
                        </v-sheet>
                    </v-col>
                    <v-col cols="6" md="4">
                        <v-sheet class="pa-2" color="#e8f5e9">
                            <div class="caption">Plot Radius <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon v-bind="attrs" v-on="on" size="16">mdi-information-outline</v-icon>
                                    </template>
                                    <span>Plot Radius is the distance from the center of the plot to the edge of the
                                        plot.</span>
                                </v-tooltip></div>
                            <div class="font-weight-bold">{{ plot.radius ? plot.radius + ' m' : 'N/A' }}</div>
                        </v-sheet>
                    </v-col>
                    <v-col cols="6" md="4">
                        <v-sheet class="pa-2" color="#e8f5e9">
                            <div class="caption">Plot Number <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon v-bind="attrs" v-on="on" size="16">mdi-information-outline</v-icon>
                                    </template>
                                    <span>Plot Number is the unique identifier for the plot.</span>
                                </v-tooltip></div>
                            <div class="font-weight-bold">{{ plot.plot_no || 'N/A' }}</div>
                        </v-sheet>
                    </v-col>
                    <v-col cols="6" md="4">
                        <v-sheet class="pa-2" color="#e8f5e9">
                            <div class="caption">Slope (degree) <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon v-bind="attrs" v-on="on" size="16">mdi-information-outline</v-icon>
                                    </template>
                                    <span>Slope is the angle of the ground surface relative to the horizontal
                                        plane.</span>
                                </v-tooltip></div>
                            <div class="font-weight-bold">{{ plot.slope ? plot.slope + '°' : 'N/A' }}</div>
                        </v-sheet>
                    </v-col>
                    <v-col cols="6" md="4">
                        <v-sheet class="pa-2" color="#e8f5e9">
                            <div class="caption">Aspect (degree) <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon v-bind="attrs" v-on="on" size="16">mdi-information-outline</v-icon>
                                    </template>
                                    <span>Aspect is the direction of the slope of the ground surface relative to the
                                        north.</span>
                                </v-tooltip></div>
                            <div class="font-weight-bold">{{ plot.aspect ? plot.aspect + '°' : 'N/A' }}</div>
                        </v-sheet>
                    </v-col>

                    <v-col cols="12" md="12">
                        <v-sheet class="pa-2" color="#e8f5e9">
                            <div class="caption">Additional Notes <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-icon v-bind="attrs" v-on="on" size="16">mdi-information-outline</v-icon>
                                    </template>
                                    <span>Additional Notes is the additional notes for the plot.</span>
                                </v-tooltip></div>
                            <div class="font-weight-bold">{{ plot.notes || 'N/A' }}</div>
                        </v-sheet>
                    </v-col>
                </v-row>

                <hr class="my-4">

                <!-- Attachments -->
                <div class="my-4" v-if="plot.attachments && plot.attachments.length > 0">
                    <div class="font-weight-bold mb-2">Attachments</div>
                    <v-row>
                        <v-col cols="auto" v-for="attachment in plot.attachments" :key="attachment.id">
                            <v-img :src="attachment.s3_url" width="100" height="80" style="border-radius: 8px;" />
                        </v-col>
                    </v-row>
                </div>
                <div v-else class="mb-4 text-grey">No attachments available.</div>

                <!-- Details of the Trees (Accordion) -->
                <div class="font-weight-bold mb-4">
                    Details of the Trees
                    <span class="float-right">Total Trees: {{ plot.trees ? plot.trees.length : 0 }}</span>
                </div>
                <v-expansion-panels v-if="paginatedTrees.length > 0">
                    <v-expansion-panel v-for="tree in paginatedTrees" :key="tree.id">
                        <v-expansion-panel-header>
                            {{ tree.treeName || 'N/A' }} | {{ tree.treeType || 'N/A' }}
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-simple-table>
                                <thead>
                                    <tr>
                                        <th>Species</th>
                                        <th>Diameter at Breast Height (DBH)</th>
                                        <th>Height</th>
                                        <th>Height to Crown Base</th>
                                        <th>Vigor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{{ tree.treeType || 'N/A' }}</td>
                                        <td>{{ tree.diameter_at_breast_height || 'N/A' }}</td>
                                        <td>{{ tree.height || 'N/A' }}</td>
                                        <td>{{ tree.crown_base_height || 'N/A' }}</td>
                                        <td>{{ tree.vigor || 'N/A' }}</td>
                                    </tr>
                                </tbody>
                            </v-simple-table>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
                <div v-else class="text-center pa-4">
                    <p class="text-grey">No trees found for this plot</p>
                </div>
                <!-- Pagination -->
                <v-pagination v-if="plot.trees && plot.trees.length > 10" v-model="page" :length="treePageCount"
                    class="mt-4"></v-pagination>

                <!-- Bottom Bar -->
                <div class="d-flex justify-end align-center my-4">
                    <v-btn color="primary" @click="closeDialog">{{ $t('back') }}</v-btn>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import moment from 'moment';
import CarbonCreditService from '../../../_services/CarbonCreditService';
import loadingMixin from '@/mixins/LoadingMixin';
export default {
    props: {
        dialog: {
            type: Boolean,
            default: false
        },
        plot: {
            type: Object,
            default: () => ({})
        },
        requestId: {
            type: String,
            default: ''
        }
    },
    mixins: [loadingMixin],
    data() {
        return {
            page: 1
        }
    },
    computed: {
        paginatedTrees() {
            if (!this.plot.trees || !this.plot.trees.length) return [];
            const start = (this.page - 1) * 10;
            return this.plot.trees.slice(start, start + 10);
        },
        treePageCount() {
            if (!this.plot.trees || !this.plot.trees.length) return 1;
            return Math.ceil(this.plot.trees.length / 10);
        }
    },
    watch: {
        plot() {
            this.page = 1;
        }
    },
    methods: {
        async downloadPlotDetails(fileType) {
            const mimeMap = {
                pdf: 'application/pdf',
                xls: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            };

            const extensionMap = {
                pdf: 'pdf',
                xls: 'xlsx'
            };

        try {
            this.startLoading();
            const response = await CarbonCreditService.downloadPlotDetails(this.requestId, this.plot.id, fileType);

            const blob = new Blob([response.data], { type: mimeMap[fileType] });
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `plot-tree-mapping-${this.requestId}-${this.plot.id}.${extensionMap[fileType]}`);
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();

            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }, 100);

            this.$toast.success(`${fileType.toUpperCase()} downloaded successfully`);
            } catch (error) {
            this.$toast.error(`Failed to download ${fileType.toUpperCase()}`);
            } finally {
            this.stopLoading();
            }
        },
        
        downloadPDF() {
            this.downloadPlotDetails('pdf');
        },

        downloadXLS() {
            this.downloadPlotDetails('xls');
        },
        closeDialog() {
            this.$emit('close');
        },
        formatDate(date) {
            if (!date) return 'N/A';
            return moment(date).format('DD-MMM-YYYY');
        }
    }
}


</script>

<style scoped>
.float-right {
    float: right;
}
</style>
