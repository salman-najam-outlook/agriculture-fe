<template>
    <v-container>
        <template>
            <div class="text-center">
                <!-- select dialot -->
                <v-dialog v-model="dialog" width="800" @click:outside="closeModal" :retain-focus="false" v-if="!nextDialog">
                    <v-card class="custom-card" rounded="0">
                        <v-toolbar flat color="primary" class="white--text">
                            <v-toolbar-title class="font-weight-bold">{{ $t('userslist.createNewUser') }}</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-btn icon class="white--text" @click="closeModal">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </v-toolbar>
                        <v-form ref="userType" v-model="valid" lazy-validation autocomplete="off">
                            <v-card-text class="black--text">
                                <v-row>
                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 py-0">
                                        <label for="createType">
                                            <h3>{{ $t('userslist.chooseCreateType') }}</h3>
                                        </label>
                                        <v-radio-group v-model="createUserType">
                                            <v-radio dense v-for="n in userTypeArray" :key="n.value"
                                                :label="`${n.label} ${$t('userslist.user')}`" :value="n.value"></v-radio>
                                        </v-radio-group>
                                    </div>
                                </v-row>
                                <v-card-actions class="mt-10">
                                    <v-spacer></v-spacer>
                                    <v-btn @click="closeModal" outlined right height="44" width="116" depressed
                                        color="primary">
                                        {{ $t('cancel') }}
                                    </v-btn>
                                    <v-btn @click="nextDialog = true" right height="44" width="116" color="primary">
                                        {{ $t('surveyBuilder.next') }}
                                    </v-btn>
                                </v-card-actions>
                            </v-card-text>
                        </v-form>
                    </v-card>
                </v-dialog>
                <!-- single user -->
                <v-dialog v-model="dialog" width="800" @click:outside="closeModal" :retain-focus="false"
                    v-if="nextDialog && createUserType === 'Single'">
                    <v-card class="custom-card" rounded="0">
                        <v-toolbar flat color="primary" class="white--text">
                            <v-toolbar-title class="font-weight-bold">{{ $t('userslist.createNewUser') }}</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-btn icon class="white--text" @click="closeModal">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </v-toolbar>
                        <v-form ref="activationKey" v-model="valid" lazy-validation autocomplete="off">
                            <v-card-text class="black--text">
                                <v-row>
                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 py-0">
                                        <h3>{{ $t('activationKey.enterActivationKey') }}</h3>
                                        <label for="name">{{ $t('activationKey.activationKey') }}</label>
                                        <v-text-field v-model="user.activationKey"
                                            :placeholder="$t('activationKey.activationKey')" outlined dense
                                            :error-messages="errors.activationKey"
                                            :rules="rules.activationKey"></v-text-field>
                                    </div>
                                </v-row>
                                <v-card-actions class="mt-10">
                                    <v-spacer></v-spacer>
                                    <v-btn @click="nextDialog = false" outlined right height="44" width="116" depressed
                                        color="primary">
                                        {{ $t('cancel') }}
                                    </v-btn>
                                    <v-btn @click="generateKey" right height="44" width="116" color="primary">
                                        {{ $t('next') }}
                                    </v-btn>
                                </v-card-actions>
                            </v-card-text>
                        </v-form>
                    </v-card>
                </v-dialog>
                <!-- single user -->
                <GenerateKey v-if="nextDialog && createUserType === 'Multiple'" @keysGenerated="keysGenerated"
                    @closeGenerateKeys="nextDialog = false" :dialogU="nextDialog && createUserType === 'Multiple'"
                    :appUser="true" />
                <!-- add user modal -->
                <v-dialog v-model="dialog" width="800" @click:outside="closeModal" :retain-focus="false"
                    v-if="activationKeySet">
                    <v-card class="custom-card" rounded="0">
                        <v-toolbar flat color="primary" class="white--text">
                            <v-toolbar-title class="font-weight-bold">{{ $t('userslist.createNewUser') }}</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-btn icon class="white--text" @click="closeModal">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </v-toolbar>
                        <v-form ref="addUser" v-model="valid" lazy-validation autocomplete="off">
                            <v-card-text class="black--text">
                                <v-row>
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                                        <label for="name">{{ $t('firstName') }}<span class="red--text">*</span></label>
                                        <v-text-field v-model="user.firstName" :placeholder="$t('firstName')" outlined dense
                                            :error-messages="errors.firstName" :rules="rules.firstName"></v-text-field>
                                    </div>
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                                        <label for="name">{{ $t('lastName') }}<span class="red--text">*</span></label>
                                        <v-text-field v-model="user.lastName" :placeholder="$t('lastName')" outlined dense
                                            :error-messages="errors.lastName" :rules="rules.lastName">
                                        </v-text-field>
                                    </div>
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                                        <label for="email">{{ $t('emailId') }}
                                            <v-tooltip v-model="show" top>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn icon v-bind="attrs" v-on="on">
                                                        <v-icon color="green lighten-1" dense size="12">
                                                            mdi-help
                                                        </v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>To regiser the app, at least one detail must be provided either mobile
                                                    number or email.</span>
                                            </v-tooltip>
                                        </label>
                                        <v-text-field v-model="user.email" :placeholder="$t('emailId')" outlined dense
                                            :error-messages="errors.email" :rules="rules.email"></v-text-field>
                                    </div>
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                                        <label for="mobile">{{ $t('mobileNumber') }}
                                            <v-tooltip v-model="show" top>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn icon v-bind="attrs" v-on="on">
                                                        <v-icon color="green lighten-1" dense size="12">
                                                            mdi-help
                                                        </v-icon>
                                                    </v-btn>
                                                </template>
                                                <span>To regiser the app, at least one detail must be provided either mobile
                                                    number or email.</span>
                                            </v-tooltip>
                                        </label>
                                        <v-text-field v-model="user.mobile" :placeholder="$t('mobile')" outlined dense
                                            :error-messages="errors.mobile" :rules="rules.mobile"></v-text-field>
                                    </div>
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                                        <label for="language">{{ $t('language') }}</label>
                                        <v-select :items="languages" item-text="title" item-value="language"
                                            placeholder="Select language" outlined v-model="user.language" dense width="11"
                                            class="shrink wdt" @change="reload">
                                        </v-select>
                                    </div>
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                                        <label for="role">{{ $t('roleRequest.userRole') }}</label>
                                        <v-row class="pl-2">
                                            <v-checkbox disabled class="text-no-wrap" v-for="role in user.membershipRole"
                                                :key="role.id" :label="formatRole(role.user_role_id)"
                                                v-model="role.membership_id">
                                            </v-checkbox>
                                        </v-row>
                                    </div>
                                         <!-- country starts -->
                                         <v-col cols="6" class="py-0">
                                    <label for="country">{{
                                        $t("country")
                                    }}<span class="red--text">*</span></label>
                                    <v-autocomplete required outlined dense v-model="user.countryId" :items="countries" item-value="name"
                                    item-text="name" :rules="rules.countryId" :placeholder="$t('country')"
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
                                    item-value="name"
                                    item-text="name" 
                                    :error-messages="errors.state" :rules="rules.state" :placeholder="$t('provinceState')"
                                    return-object>
                                    </v-autocomplete>
                                </v-col>
                                <!-- state ends -->
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                                        <label for="regionDistrict">{{ $t('regionDistrict') }}</label>
                                        <v-text-field v-model="user.district" :placeholder="$t('regionDistrict')" outlined
                                            dense :error-messages="errors.district" :rules="rules.district"></v-text-field>
                                    </div>
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                                        <label for="cityTown">{{ $t('cityTown') }}</label>
                                        <v-text-field v-model="user.village" :placeholder="$t('cityTown')" outlined dense
                                            :error-messages="errors.village" :rules="rules.village"></v-text-field>
                                    </div>
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                                        <label for="address">{{ $t('address') }}</label>
                                        <v-text-field v-model="user.address" :placeholder="$t('address')" outlined dense
                                            :error-messages="errors.address" :rules="rules.address"></v-text-field>
                                    </div>
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                                        <label for="familyTribe">{{ $t('familyTribe') }}</label>
                                        <v-text-field v-model="user.userTribe" :placeholder="$t('Enter your family tribe')"
                                            outlined dense :error-messages="errors.userTribe"
                                            :rules="rules.userTribe"></v-text-field>
                                    </div>
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                                        <label for="website">{{ $t('website') }}</label>
                                        <v-text-field v-model="user.website" :placeholder="$t('Enter website')" outlined
                                            dense :error-messages="errors.website" :rules="rules.userTribe"></v-text-field>
                                    </div>
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                                        <label for="status">{{ $t('status') }}<span class="red--text">*</span></label>
                                        <v-radio-group v-model="user.status" :error-messages="errors.status"
                                            :rules="rules.status" row>
                                            <v-radio label="Active" :value="1"></v-radio>
                                            <v-radio label="Deactivated" :value="0"></v-radio>
                                        </v-radio-group>
                                    </div>
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 py-0">
                                        <label for="website">{{ $t('addEdituser.facilityPicture') }}</label>
                                        <v-file-input v-model="user.facilityPicUrl" placeholder="Browse" outlined
                                            type="file" @change="handleChange" dense :error-messages="errors.facilityPicUrl"
                                            :rules="rules.facilityPicUrl"></v-file-input>
                                    </div>
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 py-0">
                                        <div v-if="preview">
                                            <img :src="preview" width="50%" />
                                        </div>
                                    </div>
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                                        <label for="membershipPlan">{{ $t('activationKey.membershipPlan') }}</label>
                                        <v-text-field v-model="user.membershipPlan" outlined disabled dense
                                            :error-messages="errors.membershipPlan"
                                            :rules="rules.membershipPlan"></v-text-field>
                                    </div>
                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                                        <label for="validity">{{ $t('addEdituser.validityUpTo') }}</label>
                                        <v-text-field v-model="user.validityUpTo" outlined disabled dense
                                            :error-messages="errors.validityUpTo"
                                            :rules="rules.membershipValidity"></v-text-field>
                                    </div>
                                    <!-- <div  class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                                     <label for="department">{{ $t('department')}}</label>
                                    <v-select
                                        v-model="user.department"
                                        :items="departmentList"
                                        item-text="name"
                                        item-value="departmentNumber"
                                        outlined
                                        dense
                                        :error-messages="errors.department"
                                        @change="getRoles"
                                        :rules="rules.department"
                                        :placeholder="$t('selectDept')"
                                    ></v-select>
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 py-0">
                                    <label for="role">{{ $t('role')}}</label>
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
                                </div> -->
                                </v-row>
                                <v-card-actions class="mt-10">
                                    <v-spacer></v-spacer>
                                    <v-btn @click="(activationKeySet = false)" outlined right height="44" width="116"
                                        depressed color="primary">
                                        {{ $t('cancel') }}
                                    </v-btn>
                                    <v-btn @click="saveUser" right height="44" width="116" color="primary">
                                        {{ $t('save') }}
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
import { getCountries, getStates } from 'country-state-picker'
import UserService from "@/_services/UserService"
// import { countries } from "@/constants/countries.js"
import GenerateKey from "../activation-key/GenerateKey.vue";

export default {
    created() {
        this.getCountry();
        const fetchData = async () => {
            this.startLoading()
            this.departmentList = await this.getDepartments()
            await this.getRoles()
            this.stopLoading()
        }
        fetchData()
    },
    mounted() {
        if(this.isMarketPlaceUser){
            this.show = false;
            this.nextDialog = true;
            this.activationKeySet = true;
            this.nextDialog = false;
            this.getUnassignedActivationKey();
        }
    },
    components: {
        GenerateKey
    },
    computed: {
        dialog() {
            return this.dialogI;
        },
    },
    data() {
        return {
            show: true,
            country: "",
            countries: [],
            states: [],
            valid: true,
            departmentList: [],
            rolesList: [],
            roleLoading: false,
            fieldType: { text: 'text' },
            error: false,
            createUserType: 'Single',
            nextDialog: false,
            activationKeySet: false,
            languages: [
                { flag: 'us', language: 'en', title: 'English' },
                { flag: 'in', language: 'hi', title: 'हिन्दी' },
                { flag: 'in', language: 'mr', title: 'मराठी' },
                { flag: 'es', language: 'es', title: 'Spanish' },
                { flag: 'np', language: 'ne', title: 'Nepali' },
                { flag: 'id', language: 'id', title: 'Indonesia' },
                { flag: 'pt', language: 'pt', title: 'Portuguese' },
                { flag: 'gr', language: 'el', title: 'Greek' },
                { flag: 'tr', language: 'tr', title: 'Turkish' },
            ],
            errors: { firstName: '', lastName: '', email: '' },
            user: {
                firstName: '',
                lastName: '',
                email: '',
                mobile: '',
                countryCode: '',
                activationKey: '',
                membershipPlan: '',
                membershipRole: '',
                validityUpTo: '',
                status: 1
            },
            preview: '',
            rules: {
                firstName: [
                    v => !!v || this.$t('addEdituser.firstNameRequired'),
                    v => this.onlyAlpha(v) || this.$t('addEdituser.firstNameOllyAlpha'),
                    v => (v && v.length <= 15) || this.$t('addEdituser.firstNameLimit'),
                ],
                lastName: [
                    v => !!v || this.$t('addEdituser.lastNameRequired'),
                    v => this.onlyAlpha(v) || this.$t('addEdituser.lastNameOllyAlpha'),
                    v => (v && v.length <= 15) || this.$t('addEdituser.lastNameLimit'),
                ],
                countryId: [
                    v => !!v || this.$t('activationKey.countryRequired'),
                ],
                status: [
                    v => !!v || this.$t('activationKey.statusRequired'),
                ],
                state: [
                    v => !!v || this.$t('stateRequired'),
                ],
                activationKey: [
                    v => !!v || this.$t('activationKey.activationKeyRequired'),
                    v => (v && v.length >= 15) || this.$t('activationKey.activationKeyLimit'),
                ],
            },
            select: null,
            userTypeArray: [
                {
                    label: this.$t('userslist.single'),
                    value: 'Single',
                },
                {
                    label: this.$t('userslist.multiple'),
                    value: 'Multiple',
                },
            ]
        }
    },
    methods: {
        async getUnassignedActivationKey(){
            const requestParams = {
                page: 1,
                limit: 10,
                searchPhrase: "",
                filterParam: JSON.stringify({ status: "unassigned" }),
            };
            const { data } = await this.$http.get(
          `/user/activation/activationKeys/198`,
          {
            params: requestParams,
          }
        );
        this.user.activationKey = data.data.listRes.rows[0].license_key;
            this.$nextTick(() => {
                const skipValidation = true;
                this.generateKey(skipValidation);
        });
        console.log('data', data);
        },
        reload() {

        },
        countryMatch(x){
                // console.log('xx', x.MobileCode, this.user.countryCode)
                if(!this.user.countryCode) return false;
                if(x.MobileCode == this.user.countryCode) return true;

                return false;
            },
            getCountry() {
                this.countries = getCountries()
            },
            getState(val) {
                this.states = getStates(val.code)
                this.country = val
            },
        formatRole(userRole) {
            let string = userRole.split("_").join(" ")
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        filterCountry(item, queryText) {
            const byName = item?.Name.toLowerCase()
            const searchText = queryText.toLowerCase()
            return byName.indexOf(searchText) > -1
        },
        onFilter(item, queryText) {
            console.log('queryText', queryText);
            return item.Name.toLocaleLowerCase().includes(queryText.toLocaleLowerCase())
                || item.MobileCode.toLocaleLowerCase().includes(queryText.toLocaleLowerCase())

        },
        handleChange(file) {
            this.preview = file ? URL.createObjectURL(file) : '';
        },
        closeModal() {
            this.nextDialog = false;
            this.$emit('closeAddUser')
        },
        saveUser() {
            this.emptyErrors();
            if (this.user.email.trim() == '' && this.user.mobile.trim() == '') {
                this.errors.email = 'Email or mobile number is required.';
                this.errors.mobile = 'Email or mobile number is required.';
                this.error = true;
            }
            if (this.error)
                return;
            if (!this.$refs.addUser.validate()) return;
            this.startLoading()
            const data = this.user;
            delete data.membershipPlan;
            delete data.membershipRole;
            delete data.validityUpTo;
            data.activationKey;

            // {"Name":"Afghanistan","Code":"AF","Timezone":"Afghanistan Standard Time","UTC":"UTC+04:30","MobileCode":93}
            // let countryObj = this.countries.filter(el => {
            //     if (el.MobileCode == data.countryId) {
            //         return el
            //     }
            // })
            let countryObj = this.user?.countryId || null
            data.country = countryObj?.name || null
            data.countryId = countryObj?.name || null
            data.stateId = this.user?.stateId || null
            data.countryIsoCode = countryObj?.code || null
            data.countryCode = countryObj?.dial_code || null
            data.active = parseInt(this.user.status);
            data.isMarketPlaceUser = this.isMarketPlaceUser;
            let formData = new FormData();
            Object.keys(data).forEach(key => {
                formData.append(key, data[key]);
            });

            UserService.addAppUser(formData)
                .then(data => {
                    if (data.success) {
                        this.$emit('userAdded', { success: true, message: data.message });
                    } else {
                        this.$emit('userAdded', { success: false, message: data.message });
                    }
                    this.stopLoading()
                })
                .catch(err => {
                    if (err.response.data.message) {
                        this.$notify({
                            title: err.response.data.message,
                            type: "error",
                        });
                    } else {
                        this.$notify({
                            title: "User creation unsuccessful, please revisit the form",
                            type: "error",
                        });
                    }
                    this.stopLoading()
                });
        },

        emptyErrors() {
            this.error = false;
            this.errors.email = '';
            this.errors.mobile = '';
        },
        async getRoles() {
            this.rolesList = []
            this.roleLoading = true
            this.rolesList = await this.getRolesList()
            this.roleLoading = false
        },
        async generateKey(skipValidation=false) {
            if(!skipValidation && !this.$refs.activationKey?.validate()) return;
            this.startLoading();
            console.log(this.user, 'this user');
            UserService.getKeyDetail(this.user.activationKey)
                .then(data => {
                    if (data.success) {
                        this.stopLoading();
                        this.user.membershipPlan = data.data?.membership_assoc?.membership_type;
                        this.user.membershipRole = data.data?.membership_assoc?.userRoleMembershipMap;
                        this.user.validityUpTo = data.data?.membershipValidity;
                        this.activationKeySet = true;
                    } else {
                        this.stopLoading();
                        this.$notify({
                            title: data.msg,
                            type: "error",
                        });
                    }
                })
                .catch(err => {
                    console.log('error', err);
                    this.$notify({
                        title: "Invalid activation key",
                        type: "error",
                    });
                    this.stopLoading()
                });
        },
        keysGenerated() {
            this.$router.push("/activation-key/list?app_user=true")
        },
    },
    props: {
        'dialogI': {
            type: Boolean,
            required: true
        },
        isMarketPlaceUser: {
            type: Boolean,
            required: false
        }
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

.v-input__prepend-outer {
    display: none
}
</style>