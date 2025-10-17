<template>
    <div>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <v-card v-if="!editMode" elevation="0" class="px-5 py-5 mt-4">
                <v-row class="py-5 px-5">
                    <v-col class="profile">
                        <img class="profile-img" :src="currentUser.profilePicUrl || '/img/user.jpg'" alt="Profile">
                    </v-col>
                    <v-col>
                        <div>
                            <v-list>
                                <v-list-item>
                                    <b>Name:&nbsp;</b> {{ currentUser.firstName }}{{ ` ${currentUser.middleName || ''}` }} {{ currentUser.lastName }}
                                </v-list-item>
                                <v-list-item>
                                    <b>Phone No.:&nbsp;</b> {{ currentUser.mobile }}
                                </v-list-item>
                                <v-list-item>
                                    <b>Country:&nbsp;</b> {{ country }}
                                </v-list-item>
                                <v-list-item>
                                    <b>Type:&nbsp;</b> {{ role }}
                                </v-list-item>
                                <v-list-item>
                                    <b>Company ID:&nbsp;</b> {{ currentUser.companyId || "N/A" }}
                                </v-list-item>
                            </v-list>
                        </div>
                    </v-col>
                    <v-col>
                        <div>
                            <v-list>
                                <v-list-item>
                                    <b>Email Address:&nbsp;</b> {{ currentUser.email || "N/A"}}
                                </v-list-item>
                                <v-list-item>
                                    <b>Address:&nbsp;</b> {{ currentUser.address || "N/A" }}
                                </v-list-item>
                                <v-list-item>
                                    <b>ISO Code:&nbsp;</b> {{ currentUser.iso || "N/A" }}
                                </v-list-item>
                                <v-list-item>
                                    <b>EORI No.:&nbsp;</b> {{ currentUser.eori_number || "N/A" }}
                                </v-list-item>
                            </v-list>
                        </div>
                    </v-col>
                </v-row>
            </v-card>
            <v-card v-else elevation="0" class="px-5 py-5 mt-4">
                <v-row class="py-5">
                    <v-col cols="4" class="profile">
                        <img class="profile-img" :src="currentUser.profilePicUrl || '/img/user.jpg'" alt="Profile">
                        <v-btn
                            class="profile-fab"
                            fab
                            dark
                            large
                            color="primary"
                            @click="imageUpload"
                        >
                            <v-icon dark>
                                mdi-pencil
                            </v-icon>
                        </v-btn>
                        <input type="file" id="profile" class="hidden-profile-img" />
                    </v-col>
                    <v-col cols="8">
                        <v-row>
                            <v-col cols="3" sm="4">
                                <label>{{ $t('First Name') }}</label>
                                <v-text-field v-model="updatedUser.firstName" outlined dense :rules="[rules.required]"></v-text-field>
                            </v-col>
                            <v-col cols="3" sm="4">
                                <label>{{ $t('Last Name') }}</label>
                                <v-text-field v-model="updatedUser.lastName" outlined dense :rules="[rules.required]"></v-text-field>
                            </v-col>
                            <v-col cols="3" sm="4">
                                <label>{{ $t('Email Address') }}</label>
                                <v-text-field v-model="updatedUser.email" outlined dense :rules="[rules.required]"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="3" sm="4">
                                <label>{{ $t('Phone Number') }}</label>
                                <v-text-field v-model="updatedUser.mobile" outlined dense :rules="[rules.required]"></v-text-field>
                            </v-col>
                            <v-col cols="3" sm="4">
                                <label>{{ $t('Address') }}</label>
                                <v-text-field v-model="updatedUser.address" outlined dense></v-text-field>
                            </v-col>
                            <v-col cols="3" sm="4">
                                <label>{{ $t('Countries') }}</label>
                                <v-select
                                    :items="countries"
                                    item-text="name"
                                    item-value="name"
                                    outlined
                                    v-model="country"
                                    
                                >
                                </v-select>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="3" sm="4">
                                <label>{{ $t('ISO Code') }}</label>
                                <v-text-field v-model="currentUser.iso" outlined dense disabled></v-text-field>
                            </v-col>
                            <v-col cols="3" sm="4">
                                <label>{{ $t('EORI Number') }}</label>
                                <v-text-field v-model="updatedUser.eori_number" outlined dense></v-text-field>
                            </v-col>
                            <v-col cols="3" sm="4">
                                <label>{{ $t('Company ID') }}</label>
                                <v-text-field v-model="updatedUser.companyId" outlined dense></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="3" sm="4">
                                <label>{{ $t('Password') }}</label>
                                <v-text-field type="password" v-model="newPassword" outlined dense></v-text-field>
                            </v-col>
                            <v-col cols="3" sm="4" class="pt-10">
                                <a href="#" @click="showPasswordDialog = true">Change Password</a>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-card>
            <v-card-actions v-if="!editMode" class="mt-5" style="padding-right: 0">
                <v-spacer></v-spacer>
                <v-btn outlined class="mr-2" right height="44" width="116" depressed color="primary">
                    {{ $t("cancel") }}
                </v-btn>

                <v-btn class="mr-2" right height="44" width="116" depressed color="primary" @click="editMode = true">
                    {{ $t("edit") }}
                </v-btn>
          </v-card-actions>
          <v-card-actions v-if="editMode" class="mt-5" style="padding-right: 0">
                <v-spacer></v-spacer>
                <v-btn outlined class="mr-2" right height="44" width="116" depressed color="primary" @click="editMode = false">
                    {{ $t("cancel") }}
                </v-btn>

                <v-btn class="mr-2" right height="44" width="116" depressed color="primary" @click="updateUser">
                    {{ $t("update") }}
                </v-btn>
          </v-card-actions>
        </v-container>
    </div>
</template>

<script>
import Breadcrumb from "../../../components/core/Breadcrumb.vue";
import ProfileService from "@/_services/ProfileService";
import DeforestationService from "@/_services/DeforestationService";
import S3UploadService from "@/_services/S3UploadService";
import { getCountries } from "country-state-picker";
import loadingMixin from "@/mixins/LoadingMixin";

export default {
    components: { Breadcrumb },
    data() {
        return {
            currentUser: {},
            updatedUser: {},
            countries: null,
            profileImage: null,
            showPasswordDialog: false,
            newPassword: "password",
            role: null,
            country: null,
            editMode: false,
            breadcrumbs: [
                {
                    text: this.$t("dashboard"),
                    disabled: false,
                    to: { name: "eudrDashboard" },
                },
                {
                    text: this.$t("Profile"),
                    link: false,
                    disabled: true
                },
            ],
            rules: {
                required: value => (value !== null && value !== undefined && value !== '') || 'This field is required.'
            },
        }
    },
    computed: {
        sessionCurrentUser() {
            return this.$store.getters.getUser;
        },
    },
    methods: {
        isOperator() {
            return ProfileService.checkRole("operator");
        },
        imageUpload() {
            const imageInput = document.getElementById("profile");

            imageInput.addEventListener("change", () => {
                const image = imageInput.files[0];

                if (!image) return;

                const urlImage = URL.createObjectURL(image);
                Array.from(document.getElementsByClassName("profile-img")).forEach((e) => e.src = urlImage);
                this.profileImage = image;
            });

            imageInput.click();
        },
        cleanupUserData(data) {
            [
                "role",
                "middleName",
                "sideBarMenu", 
                "refreshtoken", 
                "token", 
                "active", 
                "adminType", 
                "user_organization", 
                "user_role_assoc", 
                "verified"
            ].forEach((item) => {
                delete data[item];
            })

            return data;
        },
        async updateUser() {

            this.startLoading()
            const { id, cf_userid, ...userData } = this.updatedUser;
            this.cleanupUserData(userData);

            // Upload profile image to S3
            if (this.profileImage) {
                const result = await S3UploadService.singleUpload(this.profileImage, "ddsprofilepics");
                userData.profilePicUrl = result.fullPath;
                userData.profilePicS3Key = result.key;
            }

            if (!userData.cf_userid) {
                userData.cf_userid = Number.parseInt(this.updatedUser.id);
            }

            Object.keys(userData).forEach((key) => {
                if (userData[key] === null) {
                    delete userData[key];
                }
            });

            console.log(userData);

            // TODO: Change this to DeforestationService.updateDDSUser can be removed
            // let user = await DeforestationService.updateDDSUser({
            //     id: Number.parseInt(id),
            //     ...userData,
            //     countryId: this.country
            // });
            // let user = {
            //     data: {
            //         updateUserDDS: {
            //             ...userData,
            //             countryId: this.country
            //         }
            //     }
            // }

            await ProfileService.updateProfileData({
                id: Number.parseInt(cf_userid),
                ...userData,
                countryId: this.country
            });
            this.$notify({
                type: "success",
                text: "Profile updated successfully!"
                 });
                 this.stopLoading()

            let user = await DeforestationService.getUser(id);
            

            user = user.data.updateUserDDS;

            if (user) {
                this.currentUser = user;
                this.updateUser = user;
                this.editMode = false;
            } else {
                console.error("Failed to update user")
            }
       
            
        
        }
    },
    async created() {
        this.startLoading()
        this.countries = getCountries();
        const user = await DeforestationService.currentUserDeforestation();
        const currentUser = user?.data?.currentUserDDS?.userDetail;
        if (currentUser) {
            this.currentUser = currentUser;
            this.country = currentUser.countryId;
        } else {
            this.currentUser = this.sessionCurrentUser;
        }
        if (!this.country) {
            this.country = this.countries.find((country) => {
                return country.dial_code.replace("+", "") == this.currentUser.countryCode
            })?.name || "N/A";
        }
        this.role = this.isOperator() ? "Operator": "Supplier";
        this.updatedUser = this.currentUser;
        this.stopLoading()
    },
    mixins:[loadingMixin]
}
</script>

<style lang="scss">
.profile-img {
    border-radius: 50%;
    width: 300px;
    height: 300px;
}
.profile-fab {
    position: relative;
    bottom: 40px;
    right: 80px;
}
.hidden-profile-img {
    display: none;
}
</style>