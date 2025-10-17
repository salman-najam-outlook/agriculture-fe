<template>
	<v-container>
        <v-dialog
            v-model="dialog"
            width="609"
            @click:outside="closeModal"
        >
            <v-card  rounded="0">
                <v-toolbar
                    color="primary"
                    class="white--text"
                    flat
                    >

                    <v-toolbar-title class="font-weight-bold">{{ $t('adminRoles.createAdminRole') }}</v-toolbar-title>

                    <v-spacer></v-spacer>

                    <v-btn icon class="white--text" @click="closeModal">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                    <v-form 
                        autocomplete="off" 
                        @submit.prevent="addRole"
                        ref="roleform"
                        v-model="valid"
                    >
				        <v-card-text class="black--text">
                            <label class="title" for="name">{{ $t('adminRoles.roleName') }}<span class="red--text">*</span></label>
                            <v-text-field
                                outlined
                                dense
                                v-model.trim="rolename"
                                :rules="roleRules"
                                :error-messages="roleNameError"
                                :placeholder="$t('enterHere')"
                            >
                            </v-text-field>
                               <label class="title" for="name">{{ $t('adminRoles.roleType') }}<span class="red--text">*</span></label>
                            <v-select 
                                :items="roleTypes"
                                item-text="name"
                                item-value="value"
                                label="Select Role Type"
                                outlined
                                dense
                                v-model="roleType"
                                :rules="roleRules"
                                :error-messages="roleNameError"
                            >
                        
                            </v-select>
                            
                            <label class="title" for="name">{{ $t('adminRoles.description') }}<span class="red--text">*</span></label>
                            <v-textarea
                                :placeholder="$t('adminRoles.enterDesHere')"
                                outlined
                                rows="3"
                                counter="40"
                                :rules="descriptionRole"
                                :error-messages="descriptionError"
                                v-model="description"
                            ></v-textarea>
                         <v-divider style="" ></v-divider>
                        <v-card-actions class="mt-10">
                            <v-spacer></v-spacer>
                            <v-btn
                                class=""
                                outlined
                                color="primary"
                                @click="closeModal"
                                width="112"
                                
                            >
                                {{ $t('cancel') }}
                            </v-btn>
                            <v-btn width="112" color="primary" type="submit" class="btn-11 btn-22">
                                {{ $t('submit') }}
                            </v-btn>
                        </v-card-actions>
                        </v-card-text>
                        </v-form>
				        
			        </v-card>
		        </v-dialog>
    </v-container>
</template>

<script>
import loading from "@/mixins/LoadingMixin";

export default {
        created() {
            const fetchData = () => {
                // PermissionsService.getDepartments({page:1,itemsPerPage:1000, sortBy:['name'], sortDesc: [false]}, '')
                // .then( res => {
                //     if(res.success){
                //         this.departmentList = res.data.departments.rows
                //     }
                // })
                // .catch( error => {
                //     console.log('e', error)
                // })
            }
            fetchData()
        },
        computed: {
            dialog : {
                get(){
                    return this.dialogI;
                },
                set(){
                    return this.dialogI;
                }
            }
        },
        data() {
            return {
                roleTypes: [{
                    name: 'Manager',
                    value: 'manager'
                }, {
                    name: 'Support User',
                    value: 'support_admin'
                }, {
                    name: 'Admin',
                    value: 'admin'
                }],
                valid: true,
                roleNameError: '',
                rolename: '',
                description: '',
                roleType: '',
                descriptionError: '',
                roleRules: [
                    v => !!v.trim() || this.$t('adminRoles.roleReq'),
                    v => (v && v.length <= 15) || this.$t('adminRoles.roleLimit'),
                ],
                descriptionRole: [
                    v => !!v.trim() || this.$t('adminRoles.desReq'),
                    v => v.length <= 40 || this.$t('adminRoles.desLimit'),
                ],
            }
        },
        methods: {
            closeModal() {
                this.$emit('closeAddRole')
            },
            async addRole() {
                if(!this.$refs.roleform.validate()) return;
                this.startLoading()

                try {
                    const response = await this.$http.post('/roles', {
                        roleName: this.rolename,
                        description: this.description,
                        roleType: this.roleType
                    })
                    if(response.data.success){
                        this.stopLoading()
                        this.$notify({
                            title: this.$t('adminRoles.roleSuccess'),
                            type: 'success'
                        });
                        this.$emit('role:added', true)
                    }else{
                        this.stopLoading()
                        this.$notify({
                            title:  response.data.message,
                            type: 'error'
                        });
                    }
                    // console.log('res', response)
                }catch(err) {
                    console.log(err)
                    this.stopLoading()
                    this.$notify({
                        title:  this.$t('activationKey.somethingWentWrong.'),
                        type: 'error'
                    });
                }

                this.stopLoading();
               
            }
        },

        props: ['dialogI'],
        mixins: [loading]
}
</script>
<style lang="scss" scoped>

</style>