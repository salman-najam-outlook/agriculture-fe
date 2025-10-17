<template>
	<v-container>
        <v-dialog
            v-model="dialog"
            width="609"
            @click:outside="closeModal"
        >
            
            <v-card class="custom-card" rounded="0">
                <v-toolbar
                    color="primary"
                    class="white--text"
                    >

                    <v-toolbar-title class="font-weight-bold"> {{ $t('adminRoles.editAdminRole') }}</v-toolbar-title>

                    <v-spacer></v-spacer>

                    <v-btn icon class="white--text" @click="closeModal">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                    <v-form 
                        autocomplete="off" 
                        @submit.prevent="updateRole"
                        ref="roleform"
                        v-model="valid"
                    >
                        <v-card-text v-if="loading">
                            <div class="text-center">
                                <v-progress-circular
                                indeterminate
                                color="primary"
                                :size="70"
                                ></v-progress-circular>
                            </div>
                        </v-card-text>
				        <v-card-text v-else class="black--text">
                            <label class="title" for="name">{{ $t('adminRoles.adminRoles') }}</label>
                            <v-text-field
                                outlined
                                dense
                                v-model.trim="editedRole.name"
                                :rules="roleRules"
                            >
                            </v-text-field>

                            <label class="title" for="name">{{ $t('adminRoles.description') }}<span class="red--text">*</span></label>
                            <v-textarea
                                :placeholder="this.$t('adminRoles.enterDesHere')"
                                outlined
                                rows="3"
                                counter="40"
                                :rules="descriptionRole"
                                v-model="editedRole.description"
                            ></v-textarea>
                        
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
import PermissionsService from '@/_services/PermissionsService'
import loading from "@/mixins/LoadingMixin";

export default {
        created() {
            const fetchData = () => {
                this.loading = false;
                // console.log('editedRole', this.editedRole)
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
                loading: true,
                valid: true,
                departmentList: [],
                department: '',
                rolename: '',
                editedRole: {...this.role},
                roleRules: [
                    v => !!v || this.$t('adminRoles.roleReq'),
                    v => (v && v.length <= 15) || this.$t('adminRoles.roleLimit'),
                ],
                descriptionRole: [
                    v => !!v || this.$t('adminRoles.desReq'),
                    v => v.length <= 40 || this.$t('adminRoles.desLimit'),
                ],
            }
        },
        methods: {
            closeModal() {
                this.$emit('closeAddRole')
            },
            updateRole() {
                if(!this.$refs.roleform.validate()) return;
                this.startLoading()
                PermissionsService.updateRole(this.editedRole.id, { roleName: this.editedRole.name, description: this.editedRole.description })
                .then( response => {
                    this.stopLoading()
                    if(response.success){
                        this.$notify({
                            title: this.$t('adminRoles.roleUpdated'),
                            text: response.message,
                            type: 'success'
                        });
                        this.$emit('role:updated', true)
                        this.closeModal();
                    }else{
                        this.$notify({
                            title: 'Role not Updated',
                            text: response.message,
                            type: 'error'
                        });
                        this.$emit('role:updated', false)
                    }
                })
                .catch(error => {
                    this.stopLoading()
                    console.log('err', error)
                })
            }
        },

        props: ['dialogI', 'role'],
        mixins: [loading]
}
</script>
<style lang="scss" scoped>

</style>