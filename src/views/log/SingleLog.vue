<template>
	<v-container>
		<template>
			<div class="text-center">
				<v-dialog
				    v-model="dialog"
				    width="800"
                    @click:outside="closeModal"
                >
			        <v-card class="custom-card pb-120" rounded="0">
                        <v-toolbar
                            color="primary"
                            class="white--text"
                            >

                            <v-toolbar-title class="font-weight-bold">{{ $t('logs.activityLogDetails') }}</v-toolbar-title>

                            <v-spacer></v-spacer>

                            <v-btn icon class="white--text" @click="closeModal">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </v-toolbar>
                        <v-card-text>
                            <v-list two-line>
                                <v-list-item>
                                    <v-list-item-avatar size="100">
                                        <v-img src="/img/user.jpg"></v-img>
                                    </v-list-item-avatar>

                                    <v-list-item-content>
                                        <v-list-item-title class="font-weight-bold">{{ log.userName}}</v-list-item-title>
                                        <v-list-item-subtitle class="mt-1" >testemail.dimitra.io</v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                            <v-divider></v-divider>
                            <v-row class="mt-5 mb-5 d-flex">
                                <v-col cols="4">
                                    <v-list dense>
                                    <v-list-item>
                                        <v-list-item-content>
                                            <v-list-item-subtitle>
                                            {{ $t('logs.time') }}
                                            </v-list-item-subtitle>
                                            <v-list-item-title class="text-h6 mt-2">
                                            {{ log.time}}
                                            </v-list-item-title>
                                            
                                        </v-list-item-content>
                                    </v-list-item>
                                    </v-list>
                                </v-col>
                                <v-divider vertical inset></v-divider>
                                <v-col cols="4">
                                    <v-list dense>
                                    <v-list-item>
                                        <v-list-item-content>
                                            <v-list-item-subtitle>
                                            {{ $t('logs.userId') }}
                                            </v-list-item-subtitle>
                                            <v-list-item-title class="text-h6 mt-2 text-capitalize">
                                            {{ log.role.length>0?log.role[0].split('_').join(' '): ''}}
                                            </v-list-item-title>
                                            
                                        </v-list-item-content>
                                    </v-list-item>
                                    </v-list>
                                </v-col>
                                <v-divider vertical inset></v-divider>
                                <v-col cols="3">
                                    <v-list dense>
                                    <v-list-item>
                                        <v-list-item-content>
                                            <v-list-item-subtitle>
                                            {{ $t('logs.lastLogin') }}
                                            </v-list-item-subtitle>
                                            <v-list-item-title class="text-h6 mt-2">
                                            {{ 'N/A'}}
                                            </v-list-item-title>
                                            
                                        </v-list-item-content>
                                    </v-list-item>
                                    </v-list>
                                </v-col>
                            </v-row>
                            <v-divider ></v-divider>
                            <v-row class="mt-5 mb-5 d-flex">
                                <v-col cols="4">
                                    <v-list dense>
                                    <v-list-item>
                                        <v-list-item-content>
                                            <v-list-item-subtitle>
                                            {{ $t('logs.terminalID') }}
                                            </v-list-item-subtitle>
                                            <v-list-item-title class="text-h6 mt-2">
                                            {{ log['terminalId/IP']}}
                                            </v-list-item-title>
                                            
                                        </v-list-item-content>
                                    </v-list-item>
                                    </v-list>
                                </v-col>
                                <v-divider vertical inset></v-divider>
                                <v-col cols="4">
                                    <v-list dense>
                                    <v-list-item>
                                        <v-list-item-content>
                                            <v-list-item-subtitle>
                                                {{ $t('logs.geoAccPoint') }}
                                            </v-list-item-subtitle>
                                            <v-list-item-title class="text-h6 mt-2">
                                             {{ 'NA' }}
                                            </v-list-item-title>
                                            
                                        </v-list-item-content>
                                    </v-list-item>
                                    </v-list>
                                </v-col>
                                <v-divider vertical inset></v-divider>
                                <v-col cols="3">
                                    <v-list dense>
                                    <v-list-item>
                                        <v-list-item-content>
                                            <v-list-item-subtitle>
                                             {{ $t('logs.ipAdd') }}
                                            </v-list-item-subtitle>
                                            <v-list-item-title class="text-h6 mt-2">
                                            {{ log['terminalId/IP'] }}
                                            </v-list-item-title>
                                            
                                        </v-list-item-content>
                                    </v-list-item>
                                    </v-list>
                                </v-col>
                            </v-row>
                            <v-divider></v-divider>
                            <v-row class="mt-5 mb-5 d-flex">
                                <v-col cols="4">
                                    <v-list dense>
                                    <v-list-item>
                                        <v-list-item-content>
                                            <v-list-item-subtitle>
                                            {{ $t('logs.filesAccessed') }}
                                            </v-list-item-subtitle>
                                            <v-list-item-title class="text-h6 mt-2">
                                            {{ 'NA' }}
                                            </v-list-item-title>
                                            
                                        </v-list-item-content>
                                    </v-list-item>
                                    </v-list>
                                </v-col>
                                <v-divider vertical inset></v-divider>
                                <v-col cols="4">
                                    <v-list dense>
                                    <v-list-item>
                                        <v-list-item-content>
                                            <v-list-item-subtitle>
                                            {{ $t('logs.moduleAccessed') }}
                                            </v-list-item-subtitle>
                                            <v-list-item-title class="text-h6 mt-2">
                                            {{ log.moduleAccessed}}
                                            </v-list-item-title>
                                            
                                        </v-list-item-content>
                                    </v-list-item>
                                    </v-list>
                                </v-col>
                                <v-divider vertical inset></v-divider>
                                <v-col cols="3">
                                    <v-list dense>
                                    <v-list-item>
                                        <v-list-item-content>
                                            <v-list-item-subtitle>
                                            {{ $t('logs.funAccessed') }}
                                            </v-list-item-subtitle>
                                            <v-list-item-title class="text-h6 mt-2">
                                            {{ 'NA' }}
                                            </v-list-item-title>
                                            
                                        </v-list-item-content>
                                    </v-list-item>
                                    </v-list>
                                </v-col>
                            </v-row>
                            <v-divider></v-divider>
                            <v-row class="mt-5 mb-5 d-flex">
                                <v-col cols="4">
                                    <v-list dense>
                                    <v-list-item>
                                        <v-list-item-content>
                                            <v-list-item-subtitle>
                                            {{ $t('logs.webUrl') }}
                                            </v-list-item-subtitle>
                                            <v-list-item-title class="text-h6 mt-2">
                                           {{ 'NA'}}
                                            </v-list-item-title>
                                            
                                        </v-list-item-content>
                                    </v-list-item>
                                    </v-list>
                                </v-col>
                                <v-divider vertical inset></v-divider>
                                <v-col cols="4">
                                    <v-list dense>
                                    <v-list-item>
                                        <v-list-item-content>
                                            <v-list-item-subtitle>
                                            {{ $t('logs.typeOfAccess') }}
                                            </v-list-item-subtitle>
                                            <v-list-item-title class="text-h6 mt-2">
                                            {{ log.typeOfAccess }}
                                            </v-list-item-title>
                                            
                                        </v-list-item-content>
                                    </v-list-item>
                                    </v-list>
                                </v-col>
                                <v-divider vertical inset></v-divider>
                                <v-col cols="3">
                                    <v-list dense>
                                    <v-list-item>
                                        <v-list-item-content>
                                            <v-list-item-subtitle>
                                            {{ $t('logs.unsuccAtmp') }}
                                            </v-list-item-subtitle>
                                            <v-list-item-title class="text-h6 mt-2">
                                            NA
                                            </v-list-item-title>
                                            
                                        </v-list-item-content>
                                    </v-list-item>
                                    </v-list>
                                </v-col>
                            </v-row>
                            <!-- {{ log }} -->
                        </v-card-text>
			        </v-card>
		        </v-dialog>
	        </div>
        </template>
    </v-container>
</template>
<script>

export default {
    mounted(){
        // console.log(this.log)
    },
    computed: {
        dialog()  {
            return this.dialogU;
        }
    },
    props: {
        'dialogU': {
            type: Boolean,
            required: true
        },
        'log': {
            required: true,
            type: Object
        }
    },
    methods: {
        closeModal() {
            this.$emit('closeLogModal')
        },
    }
}
</script>
