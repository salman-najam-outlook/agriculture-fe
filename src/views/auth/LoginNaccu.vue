<template>
    <v-container fill-height fluid>
        <v-row>
            <v-col cols="6" class="pa-0">
                <AuthSidebarNaccu />
            </v-col>
            <v-col cols="6" class="pa-0">
                <div class="right-section">
                    <v-row style="max-height: 10%;">
                        <v-col cols="9"></v-col>
                        <v-col cols="3">
                            <LanguageSelection class="float-right" />
                        </v-col>
                    </v-row>

                    <div class="login-details">
                        <!-- <h2>Not a member? 
                   <router-link class="forget primary--text" to="/register">Request access </router-link>
                   </h2> -->
                    </div>

                    <div class="flex-direction-box">
                        <div class="login-from vertical-center">
                            <h2>{{ $t('login.welcomeMsg') }}</h2>
                            <p class="gray--text">{{ $t('login.info') }}</p>
                            <form @submit.prevent="checkAuth">
                                <div class="login-from-fill">
                                    <div class="form-group">
                                        <v-text-field color="#A75300" outlined :placeholder="$t('email')"
                                            v-model.trim="username" prepend-inner-icon="mdi-email-outline"
                                            :error-messages="errors.username"></v-text-field>
                                    </div>
                                    <div class="form-group">
                                        <v-text-field color="#A75300" :type="passwordType" :placeholder="$t('psw')"
                                            outlined v-model.trim="password" prepend-inner-icon="mdi-lock-outline"
                                            :append-icon="passwordIcon" :error-messages="errors.password"
                                            @click:append="changePasswordType"></v-text-field>
                                    </div>
                                    <router-link class="forget mb-5" :to="{ name: 'ForgotPasswordNaccu' }">
                                        <span style="color: #A75300;">{{ $t('login.forgot') }}</span>

                                    </router-link>
                                    <div>
                                        <v-btn type="submit" style="color: white;" block color="#A75300" class="mt-5">{{
                                            $t('login.btn') }}</v-btn>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <!-- Footer -->
                    <div class="footer-container" style="font-size: 14px;">
                        <span>ⓒ Dimitra Incorporated 2025</span>
                        <span>Powered by <img src="/img/dimitra_logo_text.png" width="65" alt=""></span>
                    </div>
                </div>



            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import loading from "@/mixins/LoadingMixin";
import generalMixin from "@/mixins/GeneralMixin";
import CookieMixin from "@/mixins/CookieMixin";
import AuthSidebarNaccu from "./AuthSidebarNaccu.vue"
import { ALL_PTSI_ROLES } from '../../constants/roles';


export default {
    async created() {
        this.showCaptcha = await process.env.VUE_APP_CAPTCHA
        // console.log('show Captcha', process.env.VUE_APP_CAPTCHA)
        // console.log('show Captcha2', this.showCaptcha)
    },
    components: {
        AuthSidebarNaccu,

    },
    computed: {
        isAuthErr() {
            return this.authErr.length > 0;
        },
        loginBtn() {
            return (this.captcha && this.username && this.password)
        }
    },
    data() {
        return {
            showCaptcha: true,
            error: false,
            errors: { username: '', password: '' },
            username: '',
            password: '',
            passwordType: 'password',
            passwordIcon: 'mdi-eye',
            authErr: '',
            captcha: false,
            captchaCode: '',
        }
    },
    methods: {
        captchaVerify(res) {
            // console.log('res', res)
            this.captchaCode = res;
            this.captcha = true;
        },
        captchaExpired() {
            this.captcha = false;
        },
        changePasswordType() {
            if (this.passwordType == 'password') {
                this.passwordType = 'text';
                this.passwordIcon = 'mdi-eye-off'
            } else {
                this.passwordType = 'password';
                this.passwordIcon = 'mdi-eye'
            }
        },
        async checkAuth() {
            this.startLoading();
            this.emptyErrors();
            // form Validations 
            if (!this.validForm()) {
                this.stopLoading();
                return false;
            }
            // form validations end
            const authData = {
                credential: this.username,
                password: this.password,
                captcha: this.captchaCode
            }
            this.$store.dispatch('checkAuth', authData).then(() => {
                const userPermittedRoles = this.$store?.state?.auth?.user?.user_role_assoc?.map(role => role.id)
                const userPermittedRoleType = this.$store?.state?.auth?.user?.user_role_assoc?.map(role => role.role_type)

                if (userPermittedRoles.includes("super_admin")) {
                    this.$router.replace({ name: "regionalRiskAssessment" });
                    this.stopLoading();
                    return
                }

                if (userPermittedRoles.includes("sub_enterprise")) {
                    this.$router.replace({ name: "esgAccountDashboard" });
                    this.stopLoading();
                    return
                }

                if (userPermittedRoles.includes("operator")) {
                    this.$router.replace({ name: "dueDiligenceDashboard" });
                    this.stopLoading();
                    return
                }

                if (userPermittedRoles.includes("supplier")) {
                    this.$router.replace({ name: "dueDiligenceDashboard" });
                    this.stopLoading();
                    return
                }

                if (userPermittedRoleType.includes("manager") || userPermittedRoleType.includes("support_admin")) {
                    this.$router.replace({ name: "Tickets" });
                    this.stopLoading();
                    return
                }

                if(userPermittedRoles.some(role => ALL_PTSI_ROLES.includes(role))) {
					this.$router.replace({ name: "dashboard" });
					this.stopLoading();
					return
				}	


                //let hasEudrPermission = []
                //const eudrRole = this.$store.state.eudrDDS.ddsUserRole;
                //const eudrRoles = ['supplier', 'supplier_owner', 'operator', 'operator_owner'];
                //const isEUDRUSER = eudrRoles.includes(eudrRole);

                this.stopLoading();
                // if the user has already visited diligenceWelcome page then redirect to DashboardReports, track through ccookies
                // Check if the user has already visited the diligenceWelcome page (via cookies)

                /** Disable welcome screen */
                //const hasVisitedDiligenceWelcome = this.getCookie("visitedDiligenceWelcome");
                //let routeName = isEUDRUSER ? "diligenceWelcome" : "DashboardReports";

                // Also check for eudr sidebar permission
                // hasEudrPermission = this.$store?.state?.auth?.modules.filter(moduleEl => {
                // 	if(moduleEl.id.includes("eudr_due_deligence")) {
                // 		if(moduleEl.active == 1) {
                // 			return true
                // 		}
                // 	}
                // })

                this.$router.replace({ name: "DashboardReports" });
                return

                // if(hasEudrPermission.length == 0 ){
                // 	this.$router.replace({ name: "DashboardReports" });
                // 	return
                // }

                // if (!hasVisitedDiligenceWelcome && isEUDRUSER) {
                // 	this.setCookie("visitedDiligenceWelcome", "true", 30); // Expiration: 1 year
                // 	routeName = "diligenceWelcome";
                // } else {
                // 	routeName = "dueDiligenceReports";
                // }
                // this.$router.replace({ name: routeName });

            }).catch(error => {
                this.authError = error.message
                this.$notify({
                    title: this.$t('login.unableToLogin'),
                    text: error.message,
                    type: 'error'
                });
                this.stopLoading();
            });
        },
        emptyErrors() {
            this.error = false;
            this.errors.username = '';
            this.errors.password = '';
            this.authErr = '';
        },

        validForm() {
            if (this.username == '') {
                this.errors.username = 'Email can not be empty.';
                this.error = true;
            }
            else if (this.password == '') {
                this.errors.password = 'Password can not be empty.';
                this.error = true;
            }
            // else if(this.password.length < 5) {
            // 	this.errors.password = 'Password lenght can not be less then 5 characters.';
            // 	this.error = true;
            // }
            if (this.error)
                return false;

            return true;
        }
    },
    mounted() {
        this.$store.commit('SET_LANGUAGE', "en")
        this.$store.commit('SET_KENYA_CODE', "ke")
    },
    mixins: [loading, generalMixin, CookieMixin]
};
</script>

<style scoped lang="scss">
.footer-container {
    /* Add a new class to your footer div for better targeting */
    display: flex;
    justify-content: space-between;
    /* Space out the two span elements */
    align-items: center;
    /* Vertically align items in the middle */
    padding: 10px 0;
    /* Add some vertical padding */
    font-size: 14px;
    color: #555;
    /* A subtle grey for text */
    border-top: 1px solid #eee;
    /* Optional: A subtle line above the footer */
    margin-top: auto;
    /* This is crucial for pushing the footer to the bottom in a flex column */
}

.footer-container strong {
    color: #333;
    /* Make the strong text a bit darker */
}

.right-section {
    padding: 6px 20px;
    background-color: white;
    height: 100vh;
    /* Add this to make the right-section a flex container */
    display: flex;
    flex-direction: column;
    /* Stack children vertically */
    justify-content: space-between;
    /* Push content to top/middle and footer to bottom */
}

.vertical-center {
    /* Keep this for the login form, but it will now be centered within the available space */
    margin: 0;
    position: relative;
    /* Change to relative or remove if not needed for vertical centering in the flex context */
    top: auto;
    /* Reset top */
    -ms-transform: none;
    /* Reset transform */
    transform: none;
    /* Reset transform */
}

.right-section .login-details {
    text-align: end;
}

.right-section .login-details h2 {
    font-size: 14px;
    font-family: pop_regular;
    font-weight: 100;
}

.right-section .login-details h2 a {
    color: #AABDCF;
    font-family: pop_semiBold;
    text-decoration: none;
    margin-left: 4px;
}

.right-section .login-from h2 {
    font-size: 30px;
    font-family: pop_semiBold;
    font-weight: 600;
    margin-bottom: 0px
}

.right-section .login-from p {
    color: #AABDCF;
    font-size: 12px;
    font-family: pop_regular;
    width: 308px;
    margin-top: 3px;
}

.flex-direction-box {
    /* This can remain as is if you want the login form itself to be centered within this box */
    /* However, for the overall layout, the flex-direction-box will now occupy the available space
      between the language selector and the footer due to `justify-content: space-between` on `.right-section` */
    flex-grow: 1;
    /* Allow this box to grow and take up available space */
    display: flex;
    justify-content: center;
    align-items: center;
}

.login-from-fill label {
    display: inline-block;
    margin-bottom: .5rem;
    color: #97A8B8;
    font-size: 14px;
    font-family: Poppins-Medium;
    letter-spacing: 0.5px;
}

.login-from-fill .form-control {
    display: block;
    width: 100%;
    height: calc(1.5em + .75rem + 2px);
    padding: .375rem .75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #495057;
    transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
    background: #E7F0F8;
    border: 1px solid #C7D5E1;
    border-radius: 3px;
}

.login-from-fill {
    margin-top: 31px;
}

.login-from-fill .forget {
    font-size: 14px;
    font-family: Poppins-Medium;
    text-decoration: none;
    display: inline-block;
    margin-top: 9px;
}


/*forgot css*/
.login-from-fill .form-group.phone-number {
    display: flex;
}

.login-from-fill .number-list {
    width: 52px;
    padding: 6px 4px;
    border-radius: 3px 0px 0px 3px;
    background: #AABDCF;
    color: #fff;
    font-size: 13px;
    height: 38px;
    border: 0px;
}

.login-from-fill .form-control.phone-control {
    margin: 0px;
    border-radius: 0px 3px 3px 0px;
}

select:focus-visible {
    outline: none;
}

input.form-control:focus-visible {
    outline: none;
}

.form-control::placeholder {
    font-size: 13px;
    font-family: pop_regular;
}

.login-from .emailgroup .form-control::placeholder {
    font-size: 13px;
    font-family: pop_semiBold;
}
</style>
