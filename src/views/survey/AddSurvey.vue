<template>
    <div>
        <v-card
            flat
            min-height="762px"
            color="transparent"
        >
            <v-card
                flat
            >
                <v-card-title class="text-subtitle-1 font-weight-bold">
                    Survey Title
                </v-card-title>
                <v-card-text>
                    <v-text-field
                        outlined
                        dense
                        placeholder="Survey Name"
                    >

                    </v-text-field>
                </v-card-text>
            </v-card>

             <v-card
                flat
                min-height="280"
                class="mt-2"
            >
                <v-card-title class="text-subtitle-1 font-weight-bold">
                    Add Survey Question
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="6">
                            <label for="name">{{ $t('Question Title')}}<span class="red--text">*</span></label>
                            <v-text-field
                                outlined
                                dense
                                placeholder="Type here"
                            >
                            </v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <label for="name">{{ $t('Question type')}}<span class="red--text">*</span></label>
                            <v-select
                                :items="['Type A', 'Type B', 'Type C']"
                                outlined
                                dense
                            ></v-select>
                        </v-col>
                        <v-col cols="12" class="d-flex align-center mt-n10">
                            <v-checkbox
                                color="primary"
                            ></v-checkbox>
                            <div class="ml-2">Compulsory</div>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions class="justify-end py-5">
                    <v-btn
                        outlined
                        color="primary"
                    >Cancel</v-btn>
                    <v-btn
                        color="primary"
                        type="submit"
                    >SAVE</v-btn>
                </v-card-actions>
            </v-card>
            <v-card
                flat
                min-height="234"
                class="mt-2"
            >
                <v-card-title class="text-subtitle-1 font-weight-bold">
                    Settings
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="8" style="" >
                            <div class="d-flex align-center">
                                <div class="text-no-wrap mt-n5">Questions in a step</div>
                                <v-text-field
                                    type="number"
                                    outlined
                                    dense
                                    style="max-width:55px"
                                    class="ml-2"
                                    min="0"
                                >
                                </v-text-field>
                            </div>
                            <div class="pl-3 green2 d-flex align-center">
                                <span class="font-weight-bold black--text">Enable</span>
                                <!-- <div class="text-no-wrap mt-n5">Questions in a step</div> -->
                                <v-switch inset
                                    color="primary"
                                    class="ml-10"
                                ></v-switch>
                            </div>
                        </v-col>
                        <v-col cols="4">
                            
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-card>
    </div>
</template>