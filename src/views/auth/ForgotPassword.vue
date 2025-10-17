<template>
	 <v-container fluid>
		<v-row>
			<v-col cols="6" class="pa-0">
				<AuthSidebar/>
			</v-col>
			<v-col cols="6" class="pa-0">
				<v-card 
					flat
					elevation="0"
					height="100%"
				>
      				<v-card-text >
						<v-row class="text-right">
							<v-col cols="9"></v-col>
							<v-col cols="3" class="pr-0 mr-0 float-right">
								<LanguageSelection/>
							</v-col>
						</v-row>
						<v-row align="center" justify="center">
							<v-col cols="10" class="pts">
								  <v-stepper v-model="step" class="elevation-0">
									<v-stepper-items>
										<v-stepper-content
										:step="1"
										>
											<v-card
											fill-height
											elevation="0"
											flat
											>
												<v-card-title class="px-0">
													<div class="text-h5 font-weight-black">{{ $t('forgot.forgotQ') }}</div>
												</v-card-title>
												<v-card-subtitle class="px-0 text-body">
													<div class="">{{ $t('forgot.info_l1') }}</div>
												</v-card-subtitle>
												<v-form v-model="emailValidForm" ref="verifyEmail">
													<v-text-field
														:placeholder="$t('email')"
														outlined
														dense
														type="email"
														:rules="[
															v => !!v || $t('addEdituser.emailReuired'),
															v => /.+@.+/.test(v) || $t('addEdituser.emailInvalid'),
														]"
														v-model="forgotPswEmail"
														:error-messages="verifyEmailError"
													></v-text-field>
													<v-btn 
														block 
														color="primary" 
														@click="validateEmail"
														:loading="emailVerifyLoading"
													>
														{{ $t('submit') }}
													</v-btn>
												
												</v-form>
												<div class="mt-5 font-weight-bold"> <router-link class="text-decoration-none forget primary--text mb-5" :to="{name: 'login'}">{{ $t('forgot.backToLoginPage') }}</router-link> </div> 
											</v-card>
											
											
										</v-stepper-content>
										<v-stepper-content
										:step="2"
										>
											<v-card
											fill-height
											elevation="0"
											flat
											class="pa-4"
											>
												<v-card-title class="px-0">
													<div class="title font-weight-black">{{ $t('forgot.forgotQ') }}</div>
												</v-card-title>
												<v-card-subtitle class="px-0">
													<div class="">{{ $t('Please choose one of the following options to receive instructions on how to reset your password') }}</div>
												</v-card-subtitle>
												<v-radio-group
													v-model="type"
													column
													>
													<v-radio
														:label="`Send an email with a link to ${emailForOtp}`"
														value="email"
														:disabled="emailForOtp=='NA'"
													></v-radio>
													<v-radio
														:label="`Send a text message to ${mobileForOtp}`"
														value="phone"
														:disabled="mobileForOtp=='NA'"
													></v-radio>
												</v-radio-group>
												<v-btn 
													block 
													color="primary" 
													@click="setForgotPasswordType"
													:loading="sendOtpLoading"
												>
												{{ $t('submit')}}
												</v-btn>
												<div class="mt-5 font-weight-bold"> <router-link class="text-decoration-none forget primary--text mb-5" :to="{name: 'login'}">{{ $t('forgot.backToLoginPage') }}</router-link> </div> 

											</v-card>
										</v-stepper-content>
										<v-stepper-content
										:step="3"
										>
											<v-card
											fill-height
											elevation="0"
											flat
											>
												<v-card-title class="px-0">
													<div class="text-h5 font-weight-black">{{ $t('forgot.forgotQ') }}</div>
												</v-card-title>
												<v-card-subtitle class="px-0">
													<div class="">{{ $t('forgot.info_l2') }}</div>
												</v-card-subtitle>
												<!-- <v-form v-model="emailValidForm" ref="verifyEmail"> -->
													<v-row class="d-flex" no-gutters>
														<v-col cols="3">
															<v-autocomplete
																outlined
																:items="countries"
																item-value="MobileCode"
																class="rounded-r-0 outline-l-0 crs-p"
																:class="{'bgg':phoneS}"
																v-model="forgotPswCountry"
																:filter="filterCountry"
																dense
																@change="phoneSelected($event)"
																@focus="phoneSelectedEmpty"
																ref="phoneSelect"
															>
																<template v-slot:item="slotProps">
																	<i :class="['mr-2', 'em', `em-flag-${slotProps.item.Code.toLowerCase()}`]"></i>
																	{{`${slotProps.item.Name} (+${slotProps.item.MobileCode})` }}
																</template>
																<template slot="selection" slot-scope="data">
																	<!-- <i :class="['mr-2', 'em', `em-flag-${data.item.Code.toLowerCase()}`]"></i> -->
																	<span class="text-truncate">{{`+${data.item.MobileCode }` }}</span>
																	<!-- {{`${data.item.MobileCode.length > 3 ? data.item.MobileCode.substring(0, 3) : data.item.MobileCode }` }} -->
																</template>
															</v-autocomplete>
														</v-col>
														<v-col cols="9">
															<v-text-field
																:placeholder="$t('enterMobile')"
																dense
																outlined
																type="number"
																v-model="forgotPswPhone"
																class="rounded-l-0"
																:error-messages="verifyPhoneError"
																:rules="[
																	v => !!v || $t('phoneRequired'),
																	v => /^[0-9]*$/.test(v) || $t('phoneValid'),
																]"
															></v-text-field>
														</v-col>
													</v-row>
													
													<v-btn 
														block 
														color="primary" 
														@click="setForgotPasswordTypePhone"
														:loading="emailVerifyLoading"
													>
														{{ $t('submit')}}
													</v-btn>
												<!-- </v-form> -->
												<div class="mt-5 font-weight-bold"> <router-link class="text-decoration-none forget primary--text mb-5" :to="{name: 'login'}">{{ $t('forgot.backToLoginPage') }}</router-link> </div> 

											</v-card>
											
											
										</v-stepper-content>
										<v-stepper-content
										:step="4"
										>
											<v-card
											fill-height
											elevation="0"
											flat
											>
												<v-card-title class="px-0">
													<div class="text-h4 font-weight-black">Enter Verification Code</div>
												</v-card-title>
												<v-card-subtitle class="px-0">
													<div class="">We just sent an {{ type == 'email' ? 'Email' : 'SMS' }} with a verification code to {{ type == 'email' ? emailForOtp : mobileForOtp }}. Enter that code below.</div>
													<!-- {{ $t('forgot.enterOTP')}} -->
												</v-card-subtitle>
												<!-- <div class="otp-boxes">
													<template v-for="(o, i)  in otp">
													<input @input="focusNext(i)" v-model="otp[i]" @keypress="checkValidOtp($event)" :ref="'otp_'+i" :key="i" type="text" class="text-box-1">
													</template>
												</div>
												<div v-if="otpError" class="mt-3 red--text text-center">{{ $t('forgot.enterCorrectOTP')}}</div> -->
												<v-text-field
													outlined
													dense
													type="text"
													autocomplete="off"
													placeholder="Your Code"
													v-model="otptext"
													:maxlength="6"
													@keypress="checkLength"
													:error-messages="otpErrMsg"
												></v-text-field>
												<v-btn 
													block 
													color="primary" 
													@click="verifyOtp"
													class=""
													:loading="verifyOtpLoding"
												>
												{{ $t('submit')}}
												</v-btn>
												<v-row class="mt-5">
													<v-col cols="6" class="float-left">
														<v-btn plain class="mt-n1 float-left font-weight-bold" color="primary" block @click="resendOTP"> {{ $t('I didn\'t receive the code')}}</v-btn>
													</v-col>
													<v-col cols="6" class="float-right">
														<v-btn plain class="mt-n1 float-left font-weight-bold" color="primary" block @click="$router.push({name: 'login'})"> {{ $t('forgot.backToLoginPage')}}</v-btn>
														<!-- <router-link class="float-right text-decoration-none primary--text" :to="{name: 'login'}">{{ $t('forgot.backToLoginPage') }}</router-link>  -->
													</v-col>
													
												</v-row>

											</v-card>
										</v-stepper-content>
										<v-stepper-content
										:step="5"
										>
											<v-card
											fill-height
											elevation="0"
											flat
											>
												<v-card-title class="px-0">
													<div class="text-h4  font-weight-black">{{ $t('forgot.resetPsw') }}</div>
												</v-card-title>
												<v-card-subtitle class="px-0">
													<div class="">{{ $t('forgot.entPsw') }}</div>
												</v-card-subtitle>
												<v-text-field
													:placeholder="$t('newPsw')"
													outlined
													:type="newPasswordType"
													dense
													prepend-inner-icon="mdi-lock-outline"
													v-model="newPassword"
													:error-messages="newPasswordError"
													:append-icon="newPasswordIcon"
													@click:append="changeNewPasswordType"
													maxlength="12"
													:rules="[
														v => checkPassword(v,'p') || 'Password should be 8 char long, Uppercase , Loswercase, 1 digit and 1 special character (!@#$%^&*)'
													]"
												></v-text-field>
												<v-text-field
													:placeholder="$t('confPsw')"
													:type="confirmPasswordType"
													outlined
													dense
													prepend-inner-icon="mdi-lock-outline"
													v-model="newPasswordConfirm"
													:error-messages="newPasswordConfirmError"
													:append-icon="confirmPasswordIcon"
													@click:append="changeConfPasswordType"
													maxlength="12"
													:rules="[
														v => checkPassword(v,'c') || 'Password and confirm password should be same.'
													]"
												></v-text-field>
												<v-btn 
													block 
													color="primary" 
													@click="changePassword"
													:loading="verifyOtpLoding"
													:disabled="notValidPassword"
												>
													{{ $t('Save')}}
												</v-btn>
												<div class="mt-5 font-weight-bold"> <router-link class="text-decoration-none forget primary--text mb-5" :to="{name: 'login'}">{{ $t('forgot.backToLoginPage') }}</router-link> </div> 
											</v-card>
										</v-stepper-content>
										<v-stepper-content
										:step="6"
										>
											<v-card
											fill-height
											elevation="0"
											flat
											>	<v-row justify="space-around" class="pt-5">
													<!-- <v-col cols="4"></v-col> -->
													<v-col cols="4" height="180" class="text-center rounded-circle themeGrey">
														<!-- <v-avatar
															color="indigo"
															size="150"
															contain
														> -->
														<img
															src="/img/cc.png"
															alt="John"
														>
														<!-- </v-avatar> -->
														</v-col>
														<!-- <v-col cols="4"></v-col> -->
												</v-row>
												<v-card-title class="px-0">
													<div class="text-h6 font-weight-black">{{ $t('forgot.resetSucc') }}</div>
												</v-card-title>
												<v-card-subtitle class="px-0">
													<div class="">{{ $t('forgot.resetSucc_l2') }}</div>
												</v-card-subtitle>
												<v-btn 
													block 
													color="primary" 
													:to="{ name: 'login '}"
												>
													{{ $t('forgot.loginNow') }}
												</v-btn>
											</v-card>
										</v-stepper-content>
									</v-stepper-items>
								</v-stepper>
							</v-col>

						  </v-row>
						
	  				</v-card-text>
				</v-card>
			</v-col>
		</v-row>
	 </v-container>
</template>

<script>
import loading from "@/mixins/LoadingMixin";
import generalMixin from "@/mixins/GeneralMixin";
import ForgotPasswordService from '@/_services/ForgotPassword'

import AuthSidebar from "./AuthSidebar.vue"
import {countries} from "@/constants/countries.js"
export default {
	components: {
		AuthSidebar
	},
	data() {
		return {
			otptext: '',
			countries,
			otpError: false,
			emailValidForm: false,
			emailVerifyLoading: false,
			sendOtpLoading: false,
			verifyOtpLoding: false,
			changePasswordLoading: false,
			verifyEmailError: '',
			verifyOtpToken: '',
			type: 'email',
			forgotPswEmail: '',
			forgotPswPhone: '',
			forgotPswCountry: '',
			emailForOtp: '',
			mobileForOtp: '',
			step: 1,
			newPassword: '',
			newPasswordConfirm: '',
			newPasswordError: '',
			newPasswordConfirmError: '',
			errors: { email : '', password: '', otp: ''},
			error: false,
			otpForm: false,
			mainForm: true,
			otpVerified: false,
			otp: ['','','','','',''],
			forgotPasswordType: 'email',
			phone: '',
			email: '',
			confirmNewPassword: '',
			showNewPsw:false,
			showNewConfPsw:false,
			passwordChanged: false,
			newPasswordType: 'password',
			confirmPasswordType: 'password',
			newPasswordIcon: 'mdi-eye',
			confirmPasswordIcon: 'mdi-eye',
			verifyPhoneError: '',
			otpErrMsg: '',
			phoneS: false,
			notValidPassword: true
		}
	},
	methods: {
		checkLength(evt) {
			 	var ASCIICode = (evt.which) ? evt.which : evt.keyCode
				if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
					evt.preventDefault();
		},
		validateEmail(){
			if(!this.$refs.verifyEmail.validate()) return;
			// if(!this.emailValidForm) return;
			this.emailVerifyLoading = true;
			ForgotPasswordService.validateEmail(this.forgotPswEmail)
			.then((res) => {
				if(res.success){
					this.emailForOtp = res.data.email ? `Send an email to ${this.hideEmail(res.data.email)}` : 'NA';
					this.mobileForOtp = res.data.mobile ? `Send a text message to ******${res.data.mobile.substr(res.data.mobile.length - 5)}` : 'NA';
					this.step = 2;
				}else{
					// console.log(res.message)
					this.verifyEmailError = res.message;
				}
				this.emailVerifyLoading = false;
			}).catch(() => {
				// console.log('err', err)
				this.emailVerifyLoading = false;
			});
		},
		setForgotPasswordTypePhone(){
			this.emailVerifyLoading = true;
			this.type = 'mobile'
			ForgotPasswordService.sendOtp(this.type, {mobile: `${this.forgotPswCountry}${this.forgotPswPhone}`})
			.then((res) => {
				if(res.success){
					this.verifyOtpToken = res.data.token
					this.emailVerifyLoading = false;
					this.step = 4;
				}else{
					// console.log(res.message)
					this.verifyPhoneError = res.message
					this.emailVerifyLoading = false;
				}
			}).catch((err) => {
				console.log('phone', err)
			});
		},
		setForgotPasswordType(){
			if(this.type == 'phone'){
				this.step = 3;
				return
			}
			this.sendOtpLoading = true;
			ForgotPasswordService.sendOtp(this.type, {email: this.forgotPswEmail})
			.then((res) => {
				if(res.success){
					this.verifyOtpToken = res.data.token
					this.sendOtpLoading = false;
					this.step = 4;
				}else{
					console.log(res.message)
					this.sendOtpLoading = false;
				}
			}).catch((err) => {
				console.log('otperr', err)
			});
		},

		verifyOtp(){
			let otp = this.otptext; //this.otp.join('');
			// console.log('otp',otp)
			if(otp.length != 6) return
			this.verifyOtpLoding = true
			ForgotPasswordService.verifyOtp({
				token: this.verifyOtpToken,
				otp: otp
			})
			.then((res) => {
				if(res.success){
					this.verifyOtpToken = res.data.token
					this.verifyOtpLoding = false;
					this.step = 5;
				}else{
					this.otpErrMsg =res.message
					this.otpError = true;
					this.verifyOtpLoding = false;
				}
			}).catch((err) => {
				if(err.data.code == 401){
					this.otpError = true;
				}
				this.verifyOtpLoding = false;
			});
			
		},
		changePassword() {
			// console.log(this.newPassword, this.newPasswordConfirm)
			this.newPasswordError = ''
			this.newPasswordConfirmError = ''
			if(this.newPassword == ''){
				this.newPasswordError = 'Password field is required'; 
				return;
			}
			if(this.newPasswordConfirm == ''){
				this.newPasswordConfirmError = 'Confirm Pasw. field is required';
				return;
			}

			if(this.newPassword !== this.newPasswordConfirm){
				this.newPasswordConfirmError = 'Password and confirm Pasw. should be same';
				return;
			}
			this.verifyOtpLoding = true;
			ForgotPasswordService.createPassword({
				token: this.verifyOtpToken,
				password: this.newPassword
			})
			.then((res) => {
				// console.log('sss', res)
				if(res.success){
					this.verifyOtpToken = res.data.token
					this.verifyOtpLoding = false;
					this.step = 6;
				}else{
					console.log(res.message)
					this.verifyOtpLoding = false;
				}
			}).catch((err) => {
				console.log('pswerr', err)
			});
		},

		hideEmail(email){
			return email.replace(/(.{2})(.*)(?=@)/,
			function(gp1, gp2, gp3) { 
				for(let i = 0; i < gp3.length; i++) { 
					gp2+= "*"; 
				} return gp2; 
			});
		},

		checkValidOtp(e) {
			if(e.target.value) {
				e.preventDefault();
			}
			return this.isNumber();
		},
		focusNext(i) {
			if(i == (this.otp.length -1)){
				if(this.otp[i].length > 0)
					this.$refs["otp_" + i][0].blur()
				return
			}
			if(this.otp[i].length <= 0)
				return
			this.$nextTick(this.$refs["otp_" + (i+1)][0].focus())
		},
		changeNewPasswordType() {
			if(this.newPasswordType == 'password'){
				this.newPasswordType = 'text';
				this.newPasswordIcon = 'mdi-eye-off'
			}else{
				this.newPasswordType = 'password';
				this.newPasswordIcon = 'mdi-eye'
			}
		},
		changeConfPasswordType() {
			if(this.confirmPasswordType == 'password'){
				this.confirmPasswordType = 'text';
				this.confirmPasswordIcon = 'mdi-eye-off'
			}else{
				this.confirmPasswordType = 'password';
				this.confirmPasswordIcon = 'mdi-eye'
			}
		},

		resendOTP(){
			if(this.type == 'mobile')
				this.setForgotPasswordTypePhone()
			else
				this.setForgotPasswordType()  
		},

		phoneSelected() {
			this.$refs.phoneSelect.blur();
			this.phoneS = true;
			// console.log('phone changed', e)
		},

		phoneSelectedEmpty(){
			this.phoneS = false;
			this.forgotPswCountry = '';
		},

		checkPassword(v, type){
			var p = false;
			var c = false;
			var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
				p = re.test(this.newPassword);
				c = this.newPasswordConfirm == this.newPassword

			if(!p || !c){
				this.notValidPassword = true;
			}else{
				this.notValidPassword = false;
			}

			if(type == 'p'){
				return p;
			}else if(type == 'c'){
				return c;
			}

		},

	},
	mixins: [generalMixin,loading]
}

</script>
<style scoped lang="scss">
::v-deep .v-stepper {
	box-shadow: 0;
}

::v-deep .bg .v-input__slot{
	font-size: 17px;
	font-weight: bold;
}


.pts {
	margin-top: 15%;
	vertical-align: middle;
}

.otp-boxes {
	display: flex;
	justify-content: space-evenly;
    padding: 30px 0px 0px;
}
.otp-boxes input {
	width: 58px;
	height: 58px;
	border-radius: 7px;
	border: 1px solid #B5B5B5 !important;
	padding: 0px 7px;
	font-size: 17px;
	font-family: Poppins-Medium;
	text-align: center;
}

.otp-boxes input:focus {
	color: #495057;
	background-color: #fff;
	border-color: #ff8880;
	outline: 0;
	box-shadow: none
}

.bgg{
::v-deep .v-input__slot{
		background-color: $primary-color !important;
		color:#fff !important;
	
		i {
			color: white;
		}
	}
}

::v-deep .crs-p .v-input__slot{
	cursor: pointer;
}
</style>
