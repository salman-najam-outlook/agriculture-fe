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
                            flat
                        >

                            <v-toolbar-title class="font-weight-bold">{{ $t('userslist.editUser')}}</v-toolbar-title>

                            <v-spacer></v-spacer>

                            <v-btn icon class="white--text" @click="closeModal">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </v-toolbar>
                        <v-form
                            ref="userEdit"
                            v-model="valid"
                            lazy-validation
                            autocomplete="off"
                        >
				        <v-card-text class="black--text">
                            <v-row>
                                <v-col cols="6" class="py-0">
                                    <label for="name">{{ $t('firstName')}}<span class="red--text">*</span></label>
                                    <v-text-field
                                        v-model="editedUser.firstName"
                                        :placeholder="$t('firstName')"
                                        outlined
                                        dense
                                        :error-messages="errors.firstName"
                                        :rules="rules.firstName"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="6" class="py-0">
                                    <label for="name">{{ $t('lastName')}}<span class="red--text">*</span></label>
                                    <v-text-field
                                        v-model="editedUser.lastName"
                                        :placeholder="$t('lastName')"
                                        outlined
                                        dense
                                        :error-messages="errors.lastName"
                                        :rules="rules.lastName"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="6" class="py-0">
                                    <label for="email">{{ $t('emailId')}}<span class="red--text">*</span></label>
                                    <v-text-field
                                        v-model="editedUser.email"
                                        :placeholder="$t('emailId')"
                                        outlined
                                        dense
                                        :error-messages="errors.email"
                                        :rules="rules.email"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="6" class="py-0">
                                    <label for="password">{{ $t('psw')}}<span class="red--text">*</span></label>
                                    <v-text-field
                                        type="password"
                                        v-model="password"
                                        placeholder="*****"
                                        outlined
                                        dense
                                        :error-messages="errors.password"
                                    ></v-text-field>
                                </v-col>
                                <!-- <v-col cols="6" class="py-0">
                                    <label for="mobile">{{ $t('countryCode')}}<span class="red--text">*</span></label>
                                    <v-autocomplete
                                        outlined
                                        dense
                                        v-model="editedUser.countryCode"
                                        :items="countries"
                                        item-value="MobileCode"
                                        :filter="filterCountry"
                                        :rules="rules.country"
                                        :placeholder=" $t('countryCode')"
                                    >
                                        <template v-slot:item="slotProps" >
                                            <i :class="['mr-2', 'em', `em-flag-${slotProps.item.Code.toLowerCase()}`]"></i>
                                            {{`${slotProps.item.Name} (+${slotProps.item.MobileCode})` }}
                                        </template>
                                        <template slot="selection" slot-scope="data">
                                            <i :class="['mr-2', 'em', `em-flag-${data.item.Code.toLowerCase()}`]"></i>
                                            {{`${data.item.Name} (+${data.item.MobileCode})` }}
                                        </template>
                                    </v-autocomplete>
                                </v-col> -->
                                <!-- country starts -->
                                <v-col cols="6" class="py-0">
                                    <label for="country">{{
                                        $t("country")
                                    }}</label>
                                    <v-autocomplete outlined dense v-model="editedUser.countryId" :items="countries" item-value="name"
                                    item-text="name" :rules="rules.country" :placeholder="$t('country')"
                                    return-object @change="getState">
                                    <template v-slot:item="slotProps">
                                        <i :class="[
                                            'mr-2',
                                            'em',
                                            `em-flag-${slotProps.item.code.toLowerCase()}`,
                                        ]"></i>
                                        {{
                                            `${slotProps.item.name}`
                                        }}
                                    </template>
                                    <template slot="selection" slot-scope="data">
                                        <i :class="[
                                            'mr-2',
                                            'em',
                                            `em-flag-${data.item.code.toLowerCase()}`,
                                        ]"></i>
                                        {{ `${data.item.name}` }}
                                    </template>
                                    </v-autocomplete>
                                </v-col>
                                <!-- country ends -->

                                <!-- state starts -->
                                <v-col cols="6" class="py-0">
                                    <label for="state">{{
                                        $t("provinceState")
                                    }}<span class="red--text">*</span></label>
                                    <v-autocomplete outlined dense v-model="editedUser.stateId" :items="states" :filter="filterState"
                                    :error-messages="errors.state" :rules="rules.state" :placeholder="$t('provinceState')"
                                    return-object>
                                    </v-autocomplete>
                                </v-col>
                                <!-- state ends -->

                                <!-- city/town starts -->
                                <v-col cols="6" class="py-0">
                                    <label for="mobile">{{
                                        $t("cityTown")
                                    }}<span class="red--text">*</span></label>
                                    <v-text-field type="text" v-model="editedUser.city" :placeholder="$t('cityTown')" outlined dense
                                    :error-messages="errors.city" :rules="rules.city"></v-text-field>
                                </v-col>
                                <!-- city/town ends -->
                                <v-col cols="6" class="py-0">
                                    <label for="mobile">{{ $t('mobileNumber')}}<span class="red--text">*</span></label>
                                    <v-text-field
                                        type="text"
                                        v-model="editedUser.mobile"
                                        :placeholder="$t('mobile')"
                                        outlined
                                        dense
                                        :error-messages="errors.mobile"
                                        :rules="rules.mobile"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="6" class="py-0">
                                    <label for="department">{{ $t('department')}}<span class="red--text">*</span></label>
                                    <v-select
                                        v-model="editedUser.department_id"
                                        :items="departmentList"
                                        item-text="name"
                                        item-value="id"
                                        outlined
                                        dense
                                        :error-messages="errors.department"
                                        @change="getRoles"
                                        :rules="rules.department"
                                        :placeholder="$t('selectDept')"
                                    ></v-select>
                                </v-col>
                                <v-col cols="6" class="py-0">
                                    <label for="role">{{ $t('role')}}<span class="red--text">*</span></label>
                                    <v-select
                                        v-model="editedUser.role_id"
                                        :items="rolesList"
                                        item-text="name"
                                        item-value="id"
                                        outlined
                                        dense
                                        :error-messages="errors.role"
                                        :loading="roleLoading"
                                        :rules="rules.role"
                                        :placeholder="$t('selectRole')"
                                    ></v-select>
                                </v-col>
                                <v-col cols="6" class="py-0">
                                    <label for="mobile">{{ $t('status')}}<span class="red--text">*</span></label>
                                     <v-radio-group
                                        row
                                        class="mt-n1"
                                        v-model="editedUser.active"
                                    >
                                        <v-radio
                                            :label="$t('active')"
                                            :value="true"
                                        ></v-radio>
                                        <v-radio
                                            :label="$t('deactivated')"
                                            :value="false"
                                        ></v-radio>
                                    </v-radio-group>
                                </v-col>
                            </v-row>
                                                        <v-row class="mt-4">
                                <v-col cols="12">
                                    <v-divider class="mb-4"></v-divider>
                                    <h3 class="text-h6 mb-4">
                                        <v-icon class="mr-2">mdi-shield-lock</v-icon>
                                        Security Settings
                                    </h3>
                                </v-col>
                                <v-col cols="12" md="6" class="py-0">
                                    <label for="mfa">
                                        Multi-Factor Authentication (MFA)
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon small v-bind="attrs" v-on="on" class="ml-1">mdi-information</v-icon>
                                            </template>
                                            <span>Add an extra layer of security to user account</span>
                                        </v-tooltip>
                                    </label>
                                    <div class="d-flex align-center mt-2">
                                        <v-switch
                                            v-model="editedUser.is_mfa_enabled"
                                            :label="editedUser.is_mfa_enabled ? 'Enabled' : 'Disabled'"
                                            color="primary"
                                            @change="handleMfaToggle"
                                            class="mt-0"
                                        ></v-switch>
                                    </div>
                                    <p class="caption grey--text">
                                        When enabled, users will need to enter a verification code during login.
                                    </p>
                                </v-col>
                                <v-col cols="12" md="6" class="py-0" v-if="editedUser.is_mfa_enabled">
                                    <label for="mfaMethod">Verification Method<span class="red--text">*</span></label>
                                    <v-select
                                        v-model="editedUser.mfa_method"
                                        :items="mfaMethods"
                                        item-text="label"
                                        item-value="value"
                                        outlined
                                        dense
                                        :disabled="!editedUser.is_mfa_enabled"
                                        :placeholder="$t('selectMfaMethod')"
                                    ></v-select>
                                    <p class="caption grey--text" v-if="editedUser.mfa_method === 'email'">
                                        Verification code will be sent to: <strong>{{ editedUser.email }}</strong>
                                    </p>
                                    <p class="caption grey--text" v-else-if="editedUser.mfa_method === 'mobile'">
                                        Verification code will be sent to: <strong>{{ editedUser.mobile }}</strong>
                                    </p>
                                </v-col>
                                <v-col cols="12" v-if="editedUser.is_mfa_enabled">
                                    <v-chip class="ma-2" color="success" outlined>
                                        <v-icon left small>mdi-check-circle</v-icon>
                                        MFA Protected via {{ editedUser.mfa_method === 'email' ? 'Email' : 'SMS' }}
                                    </v-chip>
                                </v-col>
                            </v-row>
                            <v-card-actions class="mt-10">
                                <v-spacer></v-spacer>
                                <v-btn @click="closeModal" outlined right height="44" width="116" depressed color="primary">
                                    {{ $t('cancel')}}
                                </v-btn>
                                <v-btn @click="updateUser" right height="44" width="116" color="primary">
                                    {{ $t('submit')}}
                                </v-btn>
                            </v-card-actions>
				        </v-card-text>
                        </v-form>
			        </v-card>
		        </v-dialog>
	        </div>
        </template>
    </v-container>
</template>

<script>
import loadingMixin from "@/mixins/LoadingMixin"
import generalMixin from "@/mixins/GeneralMixin";
import PermissionsMixin from "@/mixins/PermissionsMixin"

import UserService from "@/_services/UserService"
// import {countries} from "@/constants/countries.js"
import { getCountries, getStates } from 'country-state-picker'
import _ from 'lodash'

	export default {
        mounted() {
            // console.log('uuu',this.editedUser)
            this.getCountry();
            this.setEditeduser()
            const fetchData = async () => {
                this.startLoading()
                this.departmentList = await this.getDepartments()
                // if(this.editedUser.department)
                this.getRoles(this.editedUser.department)
                this.$refs.userEdit.validate()
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
                countries: [],
                states: [],
                valid: true,
                departmentList: [],
                rolesList: [],
                roleLoading: false,
                fieldType: { text: 'text'},
                error: false,
                errors: { firstName: '', lastName: '', email: '', mobile: '', password: '', department: '', role: '', country: "", state: "",city: "",},
                editedUser: {},
                password: '',
                 mfaMethods: [
                    { label: 'Email', value: 'email' },
                    { label: 'SMS/Mobile', value: 'mobile', disabled: true }
                ],
                rules: {
                    firstName: [
                        v => (!!v || v != '' || v != null) || this.$t('addEdituser.firstNameRequired'),
                        v => /^[a-z0-9\s]+$/i.test(v) || this.$t('addEdituser.firstNameOllyAlpha'),
                        v => (v && v.length <= 15) || this.$t('addEdituser.firstNameLimit'),
                    ],
                    lastName: [
                        v => !!v || this.$t('addEdituser.lastNameRequired'),
                        (v) => /^[a-z0-9\s]+$/i.test(v) || this.$t('addEdituser.lastNameOllyAlpha'),
                        v => (v && v.length <= 15) || this.$t('addEdituser.lastNameLimit'),
                    ],
                    email: [
                        v => !!v || this.$t('addEdituser.emailReuired'),
                        v => /^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(v) || this.$t('addEdituser.emailInvalid'),
                    ],
                    mobile: [
                        v => !!v || this.$t('addEdituser.mobileRequired'),
                        v => this.validMobileNumber(v) || this.$t('addEdituser.invalidMobile'),
                    ],
                    department: [
                        v => !!v || this.$t('addEdituser.deptRequired'),
                    ],
                    role: [
                        v => !!v || this.$t('addEdituser.roleRequired'),
                    ],
                    country: [(v) => !!v || this.$t("addEdituser.countryRequired")],
                    state: [(v) => !!v || this.$t("stateIsReq")],
                    city: [(v) => !!v || this.$t("cityIsReq")],
                }
            }
        },
        methods: {
            closeModal() {
                this.$emit('closeUpdateUser')
            },
            setEditeduser(){
                    this.editedUser = _.clone(this.user, true);
                    this.editedUser.userId = this.user.id
                    // this.editedUser.firstName = this.user.firstName
                    // this.editedUser.lastName = this.user.lastName
                    // this.editedUser.mobile = this.user.mobile
                    // this.editedUser.email = this.user.email, 
                    this.editedUser.role_id = this.user.user_role_assoc.length > 0 ? this.user.user_role_assoc[0].id : ''
                    this.editedUser.department_id = this.user.user_dept_assoc.length > 0 ? this.user.user_dept_assoc[0].id : ''
                    this.editedUser.countryCode = this.user.countryCode 
                    this.editedUser.is_mfa_enabled = this.user.is_mfa_enabled || false;
                    this.editedUser.mfa_method = this.user.mfa_method || 'email';
                    

                    const _country = this.countries.find(item => item.name === this.editedUser.countryId)
                    if (_country) {
                        this.getState(_country)
                    }
                    console.log('editedUser', this.editedUser)
            },
            handleMfaToggle(val) {
                this.editedUser = {
                    ...this.editedUser,
                    is_mfa_enabled: val,
                };
            },
            updateUser() {
              
                if(this.password.trim() != ''){
                     this.editedUser.password = this.password;
                }
                
                this.editedUser.country = typeof this.editedUser.countryId == "object"? this.editedUser.countryId.name : this.editedUser.countryId;
                this.editedUser.state = this.editedUser.stateId;
                this.editedUser.countryCode = typeof this.editedUser.countryId == "object"? this.editedUser.countryId.dial_code : this.editedUser.dial_code;

                if (this.editedUser.is_mfa_enabled) {
                    if (this.editedUser.mfa_method === 'email' && !this.editedUser.email) {
                        this.$notify({
                            title: 'Validation Error',
                            text: 'Email is required when MFA method is Email',
                            type: 'error'
                        });
                        return;
                    }
                    if (this.editedUser.mfa_method === 'mobile' && !this.editedUser.mobile) {
                        this.$notify({
                            title: 'Validation Error',
                            text: 'Mobile number is required when MFA method is SMS',
                            type: 'error'
                        });
                        return;
                    }
                }

                if(!this.$refs.userEdit.validate()) return;
                this.startLoading()
                UserService.updateUser(this.editedUser.userId, this.editedUser)
                .then( data => {
                    if(data.success){
                        if (this.editedUser.is_mfa_enabled) {
                            this.$notify({
                                title: 'Success',
                                text: `User updated successfully. MFA has been enabled. User will receive verification codes via ${this.editedUser.mfa_method === 'email' ? 'email' : 'SMS'} on next login.`,
                                type: 'success'
                            });
                        }
                        this.$emit('userUpdated', { success:true, message: data.message});
                    }else{
                        this.$emit('userUpdated', { success:false, message: data.message});
                    }
                    this.closeModal();
                    this.stopLoading()
                })
                .catch( err => {
                    var errors = err.response.data.message.errors[0];
                    // console.log(errors)
                    this.$notify({
                        title: this.$t('unableToUpdate'),
                        text: `${errors.msg} - ${errors.value} for ${errors.param}`,
                        type: 'error'
                    });
                    this.stopLoading()
                });
            },

            emptyErrors() {
                this.error = false;
                this.errors.name = '';
                this.errors.email = '';
                this.errors.mobile = '';
                this.errors.password = '';
                this.errors.department = '';
                this.errors.role = '';
            },
            async getRoles() {
                this.rolesList = []
                this.roleLoading = true
                this.rolesList = await this.getRolesList()
                this.roleLoading = false
            },
            countryMatch(x){
                // console.log('xx', x.MobileCode, this.editedUser.countryCode)
                if(!this.editedUser.countryCode) return false;
                if(x.MobileCode == this.editedUser.countryCode) return true;

                return false;
            },
            getCountry() {
                this.countries = getCountries()
            },
            getState(val) {
                this.states = getStates(val.code)
                this.country = val
            },
        },
        props: {
            'dialogU': {
                type: Boolean,
                required: true
            }, 
            'user': {
                type: Object,
                required: true
            }},
        mixins: [loadingMixin, generalMixin, PermissionsMixin]
    };
</script>

<style lang="scss">
.v-dialog::-webkit-scrollbar {
  width: 0px;
}
.v-dialog::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  outline: 1px solid slategrey;
}
.v-dialog::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
.custom-card {
	background: #FFFFFF !important;
	box-shadow: 0px 30px 30px rgb(106 119 132 / 41%) !important;
	border-radius: 23px !important;
}
.custom-card .v-card__text {
	width: 100%;
	padding: 37px 60px !important;
}
.card-heading-1 {
	margin-bottom: 28px;
}
.custom-card .v-card__text .card-heading-1 h2 {
	font-size: 30px;
	font-weight: 700;
}
// .custom-card .form {
// 	margin-bottom: 22px;
// }
.form label {
	display: inline-block;
	max-width: 100%;
	// margin-bottom: 5px;
	font-size: 15px;
	font-family: Poppins-Medium;
}
.form .form-control {
	display: block;
	width: 100%;
	height: 36px;
	padding: 6px 12px;
	font-size: 14px;
	line-height: 1.42857143;
	/* color: #555; */
	background-color: #fff;
	border: 1px solid #C7D5E1;
	border-radius: 3px;
}
.form .form-control::placeholder{
	font-size:13px;
	font-family: pop_regular;
	color:#97A8B8;
}
.form .form-control:focus-visible {
	outline: none;
}
// .form-control-2 {
// 	display: block;
// 	width: 100%;
// 	height: 36px;
// 	padding: 1px 20px;
// 	line-height: 1.5;
// 	transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
// 	background: #fff;
// 	border: 1px solid #C7D5E1;
// 	border-radius: 3px;
// 	background-position: calc(100% - 1.20rem) center !important;
// 	-moz-appearance: none !important;
// 	-webkit-appearance: none !important;
// 	appearance: none !important;
// 	background-image: url(/img/drop2.png);
// 	background-repeat: no-repeat;
// 	font-size: 14px;
// 	/* color:#C7D5E1; */
// 	font-family: pop_regular;
// }
.btn-custom-11 .btn-11{
    width: 135px;
    background: #fff !important;
    color:$outline-color !important;
    border: 1px solid #97A8B8 !important;
}
.btn-custom-11 .btn-22 {
    width: 135px;
    background: $primary-color !important;
    color:#fff !important;
    margin-left: 10px;
}
.btn-custom-11{
	margin-top: 38px;
}
</style>
