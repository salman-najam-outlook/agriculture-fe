<template>
	 <v-container fill-height fluid>
		<v-row>
			<v-col cols="6" class="pa-0">
				<AuthSidebar/>
			</v-col>
			<v-col cols="6" class="pa-0">
				<div class="right-section ">
				<v-row >
					<v-col cols="9"></v-col>
					<v-col cols="3" >
						<LanguageSelection class="float-right" />
					</v-col>
				</v-row>
				<div class="login-details">
						<!-- <h2>Not a member? 
							<router-link class="forget primary--text" to="/register">Request access </router-link>
						</h2> -->
					</div>
					<div class="flex-direction-box">
					<div class="login-from vertical-center" v-if="!mfaRequired">

						<h2>{{ $t('login.welcomeMsg') }}</h2>
						<!-- <h2>Welcome! Log In</h2> -->
						<p class="gray--text">{{ $t('login.info') }}</p>
						<form @submit.prevent="checkAuth">
							<div class="login-from-fill">
								<div class="form-group">
									<v-text-field 
										outlined 
										:placeholder="$t('email')"
										v-model.trim="username"
										prepend-inner-icon="mdi-email-outline"
										:error-messages="errors.username"
									></v-text-field>
								</div>
								<div class="form-group">
									<v-text-field 
										:type="passwordType"
										:placeholder="$t('psw')"
										outlined 
										v-model.trim="password"
										prepend-inner-icon="mdi-lock-outline"
										:append-icon="passwordIcon"
										:error-messages="errors.password"
										@click:append="changePasswordType"
									></v-text-field>
								</div>
								<router-link class="forget primary--text mb-5" :to="{name: 'ForgotPassword'}">{{ $t('login.forgot') }}</router-link>
								<div >
									<v-btn type="submit" block color="primary" class="mt-5">{{ $t('login.btn') }}</v-btn>
								</div>
								<!-- <div v-else>
									<vue-recaptcha @verify="captchaVerify" @expired="captchaExpired" sitekey="6LffNccfAAAAAMdqGdGgnu-BT_WkaTflyx3FZh3s"></vue-recaptcha>
									<v-btn :disabled="!loginBtn" type="submit" block color="primary" class="mt-5">{{ $t('login.btn') }}</v-btn>
								</div> -->
							</div>
						</form>
					</div>

					<!-- MFA Verification Form (shown when MFA is required) -->
					<div class="login-from vertical-center" v-else>
						<div class="mfa-header text-center mb-6">
							<v-icon color="primary" size="64" class="mb-4">mdi-shield-check</v-icon>
							<h2 class="mb-2">Two-Factor Authentication</h2>
							<p class="grey--text">
								We've sent a verification code to your 
								<strong>{{ mfaMethodLabel }}</strong>
							</p>
							<p class="warning--text caption mt-2">
								Code expires in: <strong>{{ otpExpiresIn }}</strong>
							</p>
						</div>
						<form @submit.prevent="handleMfaVerification">
							<div class="login-from-fill">
								<!-- OTP Error Message -->
								<v-alert v-if="otpError" type="error" dense class="mb-4">
									{{ otpError }}
								</v-alert>

								<!-- OTP Input -->
								<div class="form-group">
									<label>Enter Verification Code</label>
									<v-text-field
										v-model="otpForm.otp"
										outlined
										placeholder="000000"
										maxlength="6"
										class="otp-input text-center"
										prepend-inner-icon="mdi-numeric"
										:error-messages="otpError"
										autofocus
										autocomplete="one-time-code"
									></v-text-field>
									<p class="caption grey--text text-center">
										Enter the 6-digit code sent to your {{ mfaMethodLabel }}
									</p>
								</div>

								<!-- Submit Button -->
								<div>
									<v-btn 
										type="submit" 
										block 
										color="primary" 
										class="mt-3"
										:disabled="otpForm.otp.length !== 6"
										:loading="loading"
									>
										Verify & Sign In
									</v-btn>
								</div>

								<!-- Resend Code Button -->
								<div class="text-center mt-4">
									<v-btn 
										text 
										color="primary"
										@click="resendOtp"
										:disabled="resendCooldown > 0"
										small
									>
										<template v-if="resendCooldown > 0">
											Resend code in {{ resendCooldown }}s
										</template>
										<template v-else>
											Didn't receive code? Resend
										</template>
									</v-btn>
								</div>

								<!-- Back to Login -->
								<div class="text-center mt-2">
									<v-btn 
										text 
										color="grey"
										@click="cancelMfa"
										small
									>
										<v-icon left small>mdi-arrow-left</v-icon>
										Back to login
									</v-btn>
								</div>
							</div>
						</form>
					</div>

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
import AuthSidebar from "./AuthSidebar.vue"
import { ALL_PTSI_ROLES } from '../../constants/roles';


  export default {
	async created() {
		this.showCaptcha = await process.env.VUE_APP_CAPTCHA
		// console.log('show Captcha', process.env.VUE_APP_CAPTCHA)
		// console.log('show Captcha2', this.showCaptcha)
	},
	components: {
		AuthSidebar,
		
	},
	computed: {
		isAuthErr() {
			return this.authErr.length > 0;
		},
		loginBtn() {
			return (this.captcha && this.username && this.password)
		},
		otpExpiresIn() {
			if (!this.mfaData?.expires_at) return '';
			
			const expiresAt = new Date(this.mfaData.expires_at);
			const now = new Date();
			const diffMinutes = Math.ceil((expiresAt - now) / 1000 / 60);
			
			return diffMinutes > 0 ? `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}` : 'expired';
		},
		mfaMethodLabel() {
			return this.mfaData?.mfa_method === 'email' ? 'email' : 'mobile phone';
		}
	},
    data() {
      return {
		showCaptcha: true,
		error: false,
		errors: { username : '', password: ''},
        username: '',
        password: '',
		passwordType: 'password',
		passwordIcon: 'mdi-eye',
		authErr: '',
		captcha: false,
		captchaCode: '',
		mfaRequired: false,
		mfaData: null,
		otpForm: {
			otp: '',
			user_id: null
		},
		otpError: '',
		resendCooldown: 0,
      }
    },
    methods: {
		captchaVerify(res){
			// console.log('res', res)
			this.captchaCode = res;
			this.captcha = true;
		},
		captchaExpired(){
			this.captcha = false;
		},
		changePasswordType() {
			if(this.passwordType == 'password'){
				this.passwordType = 'text';
				this.passwordIcon = 'mdi-eye-off'
			}else{
				this.passwordType = 'password';
				this.passwordIcon = 'mdi-eye'
			}
		},
      	async checkAuth() {
		  	this.startLoading();
			this.emptyErrors();
		  	// form Validations 
			if(!this.validForm()){
				this.stopLoading();
				return false;
			}
		  	// form validations end
		  	const authData = {
			  	credential: this.username,
			  	password: this.password,
				captcha: this.captchaCode
		  	}
			this.$store.dispatch('checkAuth', authData).then((response) => {
				const data = response?.data || response;
				if (data?.mfa_required) {
					this.mfaRequired = true;
					this.mfaData = data;
					this.otpForm.user_id = data.user_id;
					
					this.$notify({
						title: 'MFA Required',
						text: data.message || 'Please check your email/phone for the verification code.',
						type: 'info'
					});
					
					this.stopLoading();
					return;
				}
				const userPermittedRoles = this.$store?.state?.auth?.user?.user_role_assoc?.map(role => role.id)
				const userPermittedRoleType = this.$store?.state?.auth?.user?.user_role_assoc?.map(role => role.role_type)

				if(userPermittedRoles.includes("super_admin")) {
					this.$router.replace({ name: "regionalRiskAssessment" });
					this.stopLoading();
					return
				}

				if(userPermittedRoles.includes("sub_enterprise")) {
					this.$router.replace({ name: "esgAccountDashboard" });
					this.stopLoading();
					return
				}

				if(userPermittedRoles.includes("operator")) {
					this.$router.replace({ name: "dueDiligenceDashboard" });
					this.stopLoading();
					return
				}

				if(userPermittedRoles.includes("supplier")) {
					this.$router.replace({ name: "dueDiligenceDashboard" });
					this.stopLoading();
					return
				}



			
				if(userPermittedRoles.some(role => ALL_PTSI_ROLES.includes(role))) {
					this.$router.replace({ name: "dds_root_dashboard" });
					this.stopLoading();
					return
				}	
				
				if(userPermittedRoleType.includes("manager") || userPermittedRoleType.includes("support_admin")) {
					this.$router.replace({ name: "Tickets" });
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
		emptyErrors(){
			this.error = false;
			this.errors.username = '';
			this.errors.password = '';
			this.authErr = '';
		},
		async handleMfaVerification() {
			try {
				this.startLoading();
				this.otpError = '';
				
				const response = await this.$store.dispatch('verifyMfa', {
					user_id: this.otpForm.user_id,
					otp: this.otpForm.otp
				});
				
				if (response.success) {
					const data = response.data;
					const userPermittedRoles = data?.user_role_assoc?.map(role => role.id) || [];
					const userPermittedRoleType = data?.user_role_assoc?.map(role => role.role_type) || [];
					this.$notify({
						title: 'Success',
						text: 'Login successful!',
						type: 'success'
					});
					if(userPermittedRoles.includes("super_admin")) {
						this.$router.replace({ name: "regionalRiskAssessment" });
						this.stopLoading();
						return
					}
					if(userPermittedRoles.includes("sub_enterprise")) {
						this.$router.replace({ name: "esgAccountDashboard" });
						this.stopLoading();
						return
					}
					if(userPermittedRoles.includes("operator")) {
						this.$router.replace({ name: "dueDiligenceDashboard" });
						this.stopLoading();
						return
					}
					if(userPermittedRoles.includes("supplier")) {
						this.$router.replace({ name: "dueDiligenceDashboard" });
						this.stopLoading();
						return
					}
					if(userPermittedRoles.some(role => ALL_PTSI_ROLES.includes(role))) {
						this.$router.replace({ name: "dashboard" });
						this.stopLoading();
						return
					}	
					
					if(userPermittedRoleType.includes("manager") || userPermittedRoleType.includes("support_admin")) {
						this.$router.replace({ name: "Tickets" });
						this.stopLoading();
						return
					}
					this.$router.replace({ name: "DashboardReports" });
					this.stopLoading();
				} else {
					this.otpError = response.message || 'Invalid verification code';
					
					// Check if account is locked
					if (response.message && response.message.includes('locked')) {
						this.$notify({
							title: 'Account Locked',
							text: response.message,
							type: 'error'
						});
					}
					
					this.otpForm.otp = '';
					this.stopLoading();
				}
			} catch (error) {
				console.error('MFA verification error:', error);
				this.otpError = error.message || 'Verification failed';
				this.otpForm.otp = '';
				this.$notify({
					title: 'Verification Failed',
					text: error.message || 'An error occurred during verification',
					type: 'error'
				});
				this.stopLoading();
			}
		},
		async resendOtp() {
			try {
				this.resendCooldown = 60; // 60 seconds cooldown
				const interval = setInterval(() => {
					this.resendCooldown--;
					if (this.resendCooldown <= 0) {
						clearInterval(interval);
					}
				}, 1000);
				
				const authData = {
					credential: this.username,
					password: this.password,
					captcha: this.captchaCode
				};
				
				const response = await this.$store.dispatch('checkAuth', authData);
				const data = response?.data || response;
				
				if (data?.mfa_required) {
					this.mfaData = data;
					this.$notify({
						title: 'Success',
						text: 'New verification code sent!',
						type: 'success'
					});
				}
			} catch (error) {
				console.error('Resend OTP error:', error);
				this.$notify({
					title: 'Error',
					text: 'Failed to resend code. Please try again.',
					type: 'error'
				});
			}
		},
		cancelMfa() {
			this.mfaRequired = false;
			this.mfaData = null;
			this.otpForm.otp = '';
			this.otpForm.user_id = null;
			this.otpError = '';
			this.password = ''; 
		},
		validForm() {
			if(this.username == ''){
				this.errors.username = 'Email can not be empty.';
				this.error = true;
			}
			else if(this.password == ''){
				this.errors.password = 'Password can not be empty.';
				this.error = true;
			}
			// else if(this.password.length < 5) {
			// 	this.errors.password = 'Password lenght can not be less then 5 characters.';
			// 	this.error = true;
			// }
			if(this.error)
				return false;

			return true;
		}
    },
    mixins: [loading, generalMixin, CookieMixin]
  };
</script>

<style scoped lang="scss">



.right-section {
	padding: 6px 20px;
	background-color: white;
	height: 100vh;
}
.vertical-center {
  margin: 0;
  position: absolute;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
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
.right-section .login-from h2{
	font-size:30px;
	font-family: pop_semiBold;
	font-weight: 600;
	margin-bottom: 0px
}
.right-section .login-from p{
	color:#AABDCF;
	font-size: 12px;
	font-family: pop_regular;
	width: 308px;
	margin-top: 3px;
}
.flex-direction-box {
	height: 546px;
	max-height: 100%;
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
	transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
	background: #E7F0F8;
	border: 1px solid #C7D5E1;
	border-radius: 3px;
}
.login-from-fill {
	margin-top: 31px;
}

.login-from-fill .forget{
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
.form-control::placeholder{
	font-size: 13px;
	font-family: pop_regular;
}
.login-from .emailgroup .form-control::placeholder{
	font-size: 13px;
	font-family: pop_semiBold;
}
.mfa-header h2 {
	font-size: 24px;
	font-family: pop_semiBold;
	font-weight: 600;
}
.otp-input input {
	text-align: center;
	font-size: 24px;
	letter-spacing: 8px;
	font-weight: 600;
}

</style>
