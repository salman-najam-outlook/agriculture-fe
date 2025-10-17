<template>
	<v-container>
        <v-dialog
            v-model="dialog"
            width="609"
            @click:outside="closeModal"
        >
            <v-card class="custom-card" rounded="0">
                <v-toolbar
                    color="secondary"
                    class="white--text"
                    >

                    <v-toolbar-title class="font-weight-bold">Add Department</v-toolbar-title>

                    <v-spacer></v-spacer>

                    <v-btn icon class="white--text" @click="closeModal">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                    <v-form 
                        autocomplete="off"
                        ref="form"
                        v-model="valid"
                        @submit.prevent="addDepartment"
                    >
				        <v-card-text class="black--text">
                            <label class="title" for="name">Department Name</label>
                            <v-text-field
                                outlined
                                dense
                                v-model="department"
                                :rules=nameRules
                                placeholder="Admin"
                            >
                            </v-text-field>
                        
                        <v-card-actions class="mt-10">
                            <v-spacer></v-spacer>
                            <v-btn
                                class=""
                                outlined
                                color="primary"
                                @click="closeModal"
                                width="112"
                                
                            >
                                Cancel
                            </v-btn>
                            <v-btn type="submit" width="112" color="primary" class="btn-11 btn-22">
                                Submit
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
                valid: true,
                department: '',
                nameRules: [
                    v => !!v.trim() || 'Name is required',
                    v => (v && v.length <= 15) || 'Name must be less than 15 characters',
                ],
            }
        },
        methods: {
            closeModal() {
                this.$emit('closeAddDept')
            },
            addDepartment() {
                if(!this.$refs.form.validate()) return;
                this.startLoading()
                PermissionsService.createDepartment({ name: this.department })
                .then( respose => {
                    this.stopLoading()
                    if(respose.success){ 
                        this.$notify({
                            title: 'Department Added',
                            text: respose.message,
                            type: 'success'
                        });
                        this.$emit('department:added', true)
                    }else{
                        console.log(respose)
                        this.$notify({
                            title: 'Department not Added',
                            text: respose.message,
                            type: 'error'
                        });
                        this.$emit('department:added', false)
                    }
                })
                .catch(error => {
                    this.stopLoading()
                    console.log('err', error)
                })
            }
        },

        props: ['dialogI'],
        mixins: [loading]
}
</script>
<style lang="scss" scoped>

</style>