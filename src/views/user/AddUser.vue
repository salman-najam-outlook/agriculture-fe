<template>
	<v-container>
		<template>
			<div class="text-center">
				<v-dialog
				    v-model="dialog"
				    width="800"
                    @click:outside="closeModal"
                    :retain-focus="false"
                >
			        <v-card class="custom-card" rounded="0">
                        <v-toolbar
                            flat
                            color="primary"
                            class="white--text"
                        >
                            <v-toolbar-title class="font-weight-bold">{{ $t('userslist.addNewUser')}}</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-btn icon class="white--text" @click="closeModal">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </v-toolbar>
                        <v-form
                            ref="addUser"
                            v-model="valid"
                            lazy-validation
                            autocomplete="off"
                        >
				        <v-card-text class="black--text">
                            <v-row>
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                                    <label for="name">{{ $t('firstName')}}<span class="red--text">*</span></label>
                                    <v-text-field
                                        v-model="user.firstName"
                                        :placeholder="$t('firstName')"
                                        outlined
                                        dense
                                        :error-messages="errors.firstName"
                                        :rules="rules.firstName"
                                    ></v-text-field>
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                                    <label for="name">{{ $t('lastName')}}<span class="red--text">*</span></label>
                                    <v-text-field
                                        v-model="user.lastName"
                                        :placeholder="$t('lastName')"
                                        outlined
                                        dense
                                        :error-messages="errors.lastName"
                                        :rules="rules.lastName"
                                    ></v-text-field>
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                                    <label for="email">{{ $t('emailId')}}<span class="red--text">*</span></label>
                                    <v-text-field
                                        v-model="user.email"
                                        :placeholder="$t('emailId')"
                                        outlined
                                        dense
                                        :error-messages="errors.email"
                                        :rules="rules.email"
                                    ></v-text-field>
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                                     <label for="password">{{ $t('psw')}}<span class="red--text">*</span></label>
                                    <v-text-field
                                        type="password"
                                        v-model="user.password"
                                        :placeholder="$t('psw')"
                                        outlined
                                        dense
                                        :error-messages="errors.password"
                                        autocomplete="on"
                                        :rules="rules.password"
                                    ></v-text-field>
                                </div>
                                <!-- <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                                    <label for="mobile">{{ $t('countryCode')}}<span class="red--text">*</span></label>
                                    <v-autocomplete
                                        outlined
                                        dense
                                        v-model="user.countryCode"
                                        :items="countries"
                                        item-value="MobileCode"
                                        :filter="filterCountry"
                                        :rules="rules.country"
                                        :placeholder=" $t('countryCode')"
                                    >
                                        <template v-slot:item="slotProps" >
                                            <flag class="mr-2 em" :iso="slotProps.item.Code.toLowerCase()" />
                                            
                                            {{`${slotProps.item.Name} (+${slotProps.item.MobileCode})` }}
                                        </template>
                                        <template slot="selection" slot-scope="data">
                                            <flag class="mr-2 em" :iso="data.item.Code.toLowerCase()" />
                                            
                                            {{`${data.item.Name} (+${data.item.MobileCode})` }}
                                        </template>
                                    </v-autocomplete>
                                </div> -->
                                <!-- country starts -->
                                <v-col cols="6" class="py-0">
                                    <label for="country">{{
                                        $t("country")
                                    }}</label>
                                    <v-autocomplete outlined dense v-model="user.countryId" :items="countries" item-value="name"
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
                                    <v-autocomplete outlined dense v-model="user.stateId" :items="states" :filter="filterState"
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
                                    <v-text-field type="text" v-model="user.city" :placeholder="$t('cityTown')" outlined dense
                                    :error-messages="errors.city" :rules="rules.city"></v-text-field>
                                </v-col>
                                <!-- city/town ends -->
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                                    <label for="mobile">{{ $t('mobileNumber')}}<span class="red--text">*</span></label>
                                    <v-text-field
                                        v-model="user.mobile"
                                        :placeholder="$t('mobile')"
                                        outlined
                                        dense
                                        :error-messages="errors.mobile"
                                        :rules="rules.mobile"
                                    ></v-text-field>
                                </div>
                                
                                <div  class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                                     <label for="department">{{ $t('department')}}<span class="red--text">*</span></label>
                                    <v-select
                                        v-model="user.department"
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
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                                    <label for="role">{{ $t('role')}}<span class="red--text">*</span></label>
                                    <v-select
                                        v-model="user.role"
                                        :items="rolesList"
                                        item-text="name"
                                        item-value="id"
                                        outlined
                                        dense
                                        :error-messages="errors.role"
                                        :loading="roleLoading"
                                        :rules="rules.role"
                                        :placeholder="$t('selectRole')"
                                        :disabled="rolesList.length<1"
                                    ></v-select>
                                    <span class="errorf">{{ errors.role }}</span>
                                </div>
                            </v-row>
                            <v-card-actions class="mt-10">
                                <v-spacer></v-spacer>
                                <v-btn @click="closeModal" outlined right height="44" width="116" depressed color="primary">
                                    {{ $t('cancel')}}
                                </v-btn>
                                <v-btn @click="saveUser" right height="44" width="116" color="primary">
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
import { getCountries, getStates } from 'country-state-picker'

	export default {
        created() {
            const fetchData = async () => {
                this.startLoading()
                this.departmentList = await this.getDepartments()
                await this.getRoles()
                this.stopLoading()
            }
            fetchData()
            this.getCountry();
        },
        computed: {
            dialog() {
                return this.dialogI;
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
                errors: { firstName: '', lastName: '', email: '', mobile: '', password: '', department: '', role: ''},
                user: {
                    firstName : '',
                    lastName : '',
                    email: '',
                    mobile: '',
                    password: '',
                    department: 'admin',
                    role: 'indonesia_admin',
                    countryCode: ''
                },
                rules: {
                    firstName: [
                        v => !!v || this.$t('addEdituser.firstNameRequired'),
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
                    password: [
                        v => !!v || this.$t('addEdituser.pswRequired'),
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
                },
                select: null,
            }
        },
        methods: {
            onFilter(item, queryText){
                console.log('queryText', queryText);
                    return item.Name.toLocaleLowerCase().includes(queryText.toLocaleLowerCase())
                        ||  item.MobileCode.toLocaleLowerCase().includes(queryText.toLocaleLowerCase())

            },
            closeModal() {
                this.$emit('closeAddUser')
            },
            saveUser() {
                // this.emptyErrors();
                // if(!this.onlyAlpha(this.user.name)){
                //     this.errors.name = 'Name can contain only alphbets';
                //     this.error = true;
                // }
                // if(!this.validateEmail(this.user.email)){
				//     this.errors.email = 'Invalid email format.';
                //     this.error = true;
			    // }
                // if(!this.validMobileNumber(this.user.mobile)) {
                //     this.errors.mobile = 'Invalid mobile number format.';
                //     this.error = true;
                // }
                // if(this.user.password.trim() == ''){
                //     this.errors.password = 'Password can not be empty'
                //     this.error = true;
                // }
                // if(this.error)
                //     return;
                if(!this.$refs.addUser.validate()) return;
                this.startLoading()

                this.user.country = typeof this.user.countryId == "object"? this.user.countryId.name : this.user.countryId;
                this.user.state = this.user.stateId;
                this.user.countryCode = typeof this.user.countryId == "object"? this.user.countryId.dial_code : this.user.dial_code;
                delete this.user.countryId;    
                
                UserService.addUser(this.user)
                .then( data => {
                    if(data.success){
                        this.$emit('userAdded', { success:true, message: data.message});
                    }else{
                        this.$emit('userAdded', { success:false, message: data.message});
                    }
                    this.closeModal();
                    this.stopLoading()
                })
                .catch( err => {
                    if(err.response.data.message.errors.length > 0){
                        err.response.data.message.errors.forEach(e => {
                            this.errors[e.param] = e.msg;
                        });
                    }
                    this.stopLoading()
                });
            },

            emptyErrors() {
                this.error = false;
                this.errors.firstName = '';
                this.errors.lastName = '';
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
            getCountry() {
                this.countries = getCountries()
            },
            getState(val) {
                this.states = getStates(val.code)
                this.country = val
            },
        },
        props: {
            'dialogI': {
                type: Boolean,
                required: true
            }, 
        },
        mixins: [loadingMixin, generalMixin, PermissionsMixin]
    };
</script>

<style>
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

.form label {
	display: inline-block;
	max-width: 100%;
	margin-bottom: 5px;
	font-size: 15px;
	font-family: Poppins-Medium;
}
</style>
