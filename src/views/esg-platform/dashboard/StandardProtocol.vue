<template>
    <div>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <div class="d-flex mb-4">
                <h2>{{ $t('esgPlatform.startNewEsgProtocol') }}</h2>
                <v-spacer></v-spacer>
                <v-btn color="primary" class="mr-3" outlined dark
                    @click="$router.push({ name: 'esgAccountDashboard' })">
                    {{ $t('close') }}
                </v-btn>
                <v-btn color="primary" dark @click="showAddProtocolDialog = true">
                    {{ $t('esgPlatform.createNewProtocolWithoutStandard') }}
                </v-btn>
            </div>
            <v-card elevation="0" class="px-5">
                <v-card-text>
                    <v-row style="margin-left:-30px; margin-bottom: 20px; margin-top: 15px;">
                        <v-col cols="12">
                            <div class="d-flex flex-column">
                                <h3 class="black--text">{{ $t('esgPlatform.selectEsgStandard') }}</h3>
                                <v-autocomplete :items="standardLists" v-model="selectedStandard" item-text="title"
                                    item-value="id" outlined dense style="width: 300px" class="mt-2"
                                    @change="filterProtocolsByStandard(selectedStandard)"></v-autocomplete>
                            </div>

                            <v-divider row class="mb-4"></v-divider>

                            <template v-if="selectedStandardDetails">
                                <!-- Title -->
                                <h3 class="font-weight-bold black--text">{{ selectedStandardDetails.title }}</h3>

                                <v-row align="center">
                                    <!-- Image Section -->
                                    <v-col cols="2">
                                        <v-img :src="selectedStandardDetails.image" contain height="160px" width="250px"
                                            class="rounded-lg"></v-img>
                                    </v-col>

                                    <!-- Content Section -->
                                    <v-col cols="8">

                                        <!-- Description -->
                                        <p class="text-body-4 black--text text--darken-2 justify-start align-start"
                                            style="text-align: justify !important; vertical-align: top !important;"
                                            v-html="selectedStandardDetails.description">
                                        </p>

                                    </v-col>

                                    <v-col cols="12">
                                        <v-btn color="primary" dark @click="showAddProtocolDialog = true">
                                            {{ $t('esgPlatform.addNewProtocol') }}
                                        </v-btn>
                                    </v-col>

                                    <v-divider row class="mb-4"></v-divider>

                                    <v-col cols="12">

                                        <h3 class="font-weight-bold black--text">{{ $t('esgPlatform.existingProtocols')
                                            }}</h3>

                                    </v-col>



                                </v-row>
                            </template>

                            <v-col cols="12" v-for="item in filteredProtocols" :key="item.id" class="cursor-pointer" @click="redirectToDetail(item)">
                                <!-- Title -->
                                <h3 class="font-weight-bold">{{ item.title }}</h3>

                                <v-row align="center">
                                    <!-- Image Section -->
                                    <v-col cols="2">
                                        <v-img :src="item.image" contain height="160px" width="250px"
                                            class="rounded-lg"></v-img>

                                    </v-col>

                                    <!-- Content Section -->
                                    <v-col cols="8">

                                        <!-- Description -->
                                        <p class="text-body-4 black--text text--darken-2 justify-start align-start"
                                            style="text-align: justify !important; vertical-align: top !important;"
                                            v-html="item.description">
                                        </p>

                                    </v-col>

                                </v-row>
                                <v-divider class="mt-4"></v-divider>

                            </v-col>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-container>
        <AddNewProtocol v-if="showAddProtocolDialog" :selectedProtocol="selectedStandardDetails"
            :dialog="showAddProtocolDialog" @close="closeAddProtocolDialog" @save="handleSaveProtocol" />
    </div>
</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin";
import AddNewProtocol from "./components/protocol/AddNewProtocol.vue";
import ESGService from "@/_services/EsgService";

export default {
    components: {
        AddNewProtocol
    },
    async created() {
        await this.getEsgStandards();
        await this.getEsgProtocols();
        
        const standardId = this.$route.params.id;
        if (standardId) {
            this.selectedStandard = standardId;
            await this.fetchStandardDetails(standardId);
            this.filterProtocolsByStandard(standardId);
        }
    },
    data() {
        return {
            showAddProtocolDialog: false,
            breadcrumbs: [
                { text: this.$t('esgPlatform.common.esgCompliance'), disabled: false },
                { text: this.$t('dashboard'), disabled: false },
            ],
            standardLists: [],
            selectedStandard: null,
            selectedStandardDetails: null,
            protocols: [],
            filteredProtocols: [],
        };
    },
    watch: {
        '$route.params.id': {
            immediate: true,
            async handler(newId) {
                if (newId && newId !== this.selectedStandard) {
                    this.selectedStandard = newId;
                    await this.fetchStandardDetails(newId);
                    this.filterProtocolsByStandard(newId);
                }
            }
        },

        async selectedStandard(newVal) {
            if (newVal) {
                await this.fetchStandardDetails(newVal);
                this.filterProtocolsByStandard(newVal);
                
                if (this.$route.params.id !== newVal) {
                    this.$router.push({
                        name: this.$route.name,
                        params: { id: newVal }
                    });
                }
            } else {
                this.selectedStandardDetails = null;
                this.filteredProtocols = this.protocols;
            }
        }
    },
    methods: {
        async redirectToDetail(item) {
            this.$router.push({
                name: 'startEsgProtocol',
                params: {
                    id: item.id
                },
            });
        },
        async getEsgStandards() {
            this.startLoading();
            try {
                const { data } = await ESGService.getEsgStandards("Standard");
                this.standardLists = data.rows;
                
                // After loading standards, check URL params again
                const standardId = this.$route.params.id;
                if (standardId && !this.selectedStandard) {
                    this.selectedStandard = standardId;
                    await this.fetchStandardDetails(standardId);
                    this.filterProtocolsByStandard(standardId);
                }
            } catch (error) {
                console.error('Error fetching ESG standards:', error);
                this.$notify({
                    type: 'error',
                    text: 'Failed to fetch ESG standards. Please try again.',
                });
            } finally {
                this.stopLoading();
            }
        },
        async getEsgProtocols() {
            this.startLoading();
            try {
                const { data } = await ESGService.getEsgStandards('Protocol');

                this.protocols = data.rows?.map((item) => ({
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    image: item.sealUrl,
                    standardId: item.esgStandard?.id,
                }));

                this.filteredProtocols = this.protocols;
            } catch (error) {
                console.error('Error fetching ESG protocols:', error);
                this.$notify({
                    type: 'error',
                    text: 'Failed to fetch ESG protocols. Please try again.',
                });
            } finally {
                this.stopLoading();
            }
        },
        async fetchStandardDetails(standardId) {
            if (!standardId) return;

            this.startLoading();
            try {
                const selectedStandard = this.standardLists.find(standard => standard.id === standardId);
                if (selectedStandard) {
                    this.selectedStandardDetails = {
                        id: selectedStandard.id,
                        title: selectedStandard.title,
                        description: selectedStandard.description,
                        image: selectedStandard.sealUrl
                    };
                } 
            } catch (error) {
                console.error('Error fetching standard details:', error);
                this.$notify({
                    type: 'error',
                    text: 'Failed to fetch standard details. Please try again.',
                });
            } finally {
                this.stopLoading();
            }
        },
        filterProtocolsByStandard(standardId) {
            this.filteredProtocols = this.protocols.filter(protocol => protocol.standardId === standardId);
        },
        closeAddProtocolDialog() {
            this.showAddProtocolDialog = false;
        },
        async handleSaveProtocol() {
            this.showAddProtocolDialog = false;
            this.$notify({
                text: this.$t('esgPlatform.protocolAddedMsg'),
                type: "success",
            });
            await this.getEsgProtocols();
            this.filterProtocolsByStandard(this.selectedStandard);
        }
    },
    mixins: [loadingMixin],
};
</script>

<style scoped></style>