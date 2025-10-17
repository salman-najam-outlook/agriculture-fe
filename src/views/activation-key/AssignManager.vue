<template>
	<v-container>
		<template>
			<div class="text-center">
				<v-dialog
				    v-model="dialog"
				    width="800"
                    @click:outside="closeModal"
                >
			        <v-card rounded="0">
                        <v-toolbar
                            color="primary"
                            class="white--text"
                            flat
                            :elevation="0"
                            >

                            <v-toolbar-title class="font-weight-bold">{{ $t('activationKey.appointSalesManager') }}</v-toolbar-title>

                            <v-spacer></v-spacer>

                            <v-btn icon class="white--text" @click="closeModal">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </v-toolbar>
                        <v-card-text class="pt-5">
                            <div v-if="!mailSent">
                                <v-form
                                    ref="assignManager"
                                    v-model="valid"
                                    lazy-validation
                                    autocomplete="off"
                                >
                                <v-card
                                    flat
                                    :elevation="0"
                                >
                                    <v-row class="d-flex align-center">
                                        <v-col cols="9">
                                            <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">{{ $t('activationKey.appointSalesManager') }}</label>
                                            <v-select
                                                :items="salesManager"
                                                item-text="user_role.fullName"
                                                item-value="user_id"
                                                outlined
                                                :rules="[v => !!v || 'Sales manager is required']"
                                                v-model="manager"
                                            ></v-select>
                                        </v-col>
                                        <v-col cols="3" class="">
                                            <v-btn @click="appointManager" right height="50" width="176" color="primary">
                                                {{ $t('activationKey.appointManager') }}
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </v-card>
                                </v-form>
                            </div>
                            <div v-else class="d-flex align-center py-5">
                                <v-img max-width="45" src="/icons/mail.png"></v-img> <span class="black--text ml-3 text-h5">{{ $t('activationKey.salesManAppSuccess') }}</span>
                            </div>
                        </v-card-text>
			        </v-card>
		        </v-dialog>
	        </div>
        </template>
    </v-container>
</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin";
import generalMixin from "@/mixins/GeneralMixin";
import ActivationKeyService from "@/_services/ActivationService.js"

	export default {
        mounted(){
            this.mailSent = false;
            // console.log('tttt', this.generatedKey)
            this.manager = this.generatedKey.sales_manager
        },
        created() {
            const fetchData = async () => {
                this.startLoading()
                const sm = await ActivationKeyService.getSalesManagers();
                this.salesManager = sm.data
                this.stopLoading()
            }
            fetchData()
        },
        computed: {
            dialog()  {
                return this.dialogU;
            }
        },
        data() {
            return {
                valid: true,
                mailSent: false,
                roleLoading: false,
                error: false,
                salesManager: [],
                manager: null
            }
        },
        methods: {
            closeModal() {
                this.$emit('closeAssignSalesManager')
            },
            async appointManager() {
                if(!this.$refs.assignManager.validate()) return;
                this.startLoading()
                const res = await this.$http.post('/user/activation/generatedKeys/assign', {
                    generatedKeyId: this.generatedKey.id,
                    salesManagerId: this.manager
                })
                this.stopLoading()
                console.log('sss', res)
                this.mailSent = true;
            },
        },
        props: {
            'dialogU': {
                type: Boolean,
                required: true
            },
            'generatedKey': {
                require: true
            }
        },
        mixins: [loadingMixin, generalMixin]
    };
</script>

<style lang="scss" scoped>
::v-deep .bg .v-input__slot{
    background-color: $primary-color;
    color: #FFFFFF;
}
</style>
