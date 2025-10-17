<template>
	<div>
		<breadcrumb :items="breadcrumbs"></breadcrumb>
		<v-container fill-height fluid>
			<v-row 	
				align="center"
				justify="center"
			>
				<v-card width="700">
					<v-img
						height="200px"
						src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
					>
						<v-card-title class="white--text mt-8">
							<v-avatar size="138">
								<img
									alt="user"
									src="/img/profile-11.png"
								>
							</v-avatar>
							<p class="ml-3">
								{{ user.name}}
							</p>
						</v-card-title>
        			</v-img>
					
					<v-card-text>
						<v-row>
							<v-col
								cols="12"
								sm="12"
							>
								<v-text-field
									v-model="user.name"
									label="Name"
									outlined
									disabled
								></v-text-field>
							</v-col>
							<v-col
								cols="12"
								sm="6"
							>
								<v-text-field
									v-model="user.email"
									label="Email"
									outlined
									disabled
								></v-text-field>
							</v-col>
							<v-col
								cols="12"
								sm="6"
							>
								<v-text-field
									v-model="user.mobile"
									label="Mobile"
									outlined
									disabled
								></v-text-field>
							</v-col>
							<v-col
								cols="12"
								sm="6"
							>
								<v-text-field
										v-model="user.role"
										label="Role"
										outlined
										disabled
								></v-text-field>
							</v-col>
							<v-col
								cols="12"
								sm="6"
							>
								<v-text-field
									v-model="user.department"
									label="Department"
									outlined
									disabled
								></v-text-field>
							</v-col>
							
						</v-row>
					</v-card-text>
				</v-card>
			</v-row>
		</v-container>
	</div>
</template>

<script>
import loading from "@/mixins/LoadingMixin";
import generalMixin from "@/mixins/GeneralMixin";

import ProfileService from "../../_services/ProfileService";
export default {
	created() {
		this.getProfileData();
	},
	data() {
		return {
			breadcrumbs: [
				{
					text: 'Dashboard',
					disabled: false,
					href: '/',
				},
				{
					text: 'Profile',
					disabled: true,
					href: 'breadcrumbs_link_1',
				},
			],
			errors: { email: '', otp: ''},
			orgUser:{},
			user: {
				name: '',
				email: '',
				mobile: '',
				department: '',
				profilePicUrl: '',
				role: '',
				userName: '',
			},
			email: '',
			editEmail: false,
			canUpdateEmail: false,
			verifyEmail: false,
			preferedLanguageId: '',
			selectedLangs: [],
			showOtp:false,
			otp: ['','','','','',''],
		}
	},
	methods: {
		getProfileData() {
			this.startLoading();
			
			ProfileService.getProfileData()
			.then(res => {
				if(res.success){
					for(var k in res.data) this.user[k]=res.data[k];
					this.orgUser = res.data;
				}
				this.stopLoading()
			})
			.catch(e => {
				console.log(e)
				this.$router.push('/login')
				this.stopLoading()
			})
		
		},
		validateEditEmail() {
			if(this.email == ''){
				this.errors.email = 'Email can not be empty.';
				this.canUpdateEmail = false;
				return false;
			}else if(!this.validateEmail(this.email)){
				this.errors.email = 'Invalid email format.';
				this.canUpdateEmail = false;
				return false;
			}
			this.errors.email = '';
			this.canUpdateEmail = true;
			return true;
		},
		updateEmail() {
			if(this.email == this.user.email){
				this.errors.email = "No changes"
				this.editEmail = false;
				return;
			}
			this.startLoading()
			ProfileService.updateProfileData({unverifiedEmail: this.email})
			.then( res => {
				res = res.data;
				if(res.code == 200){
					this.editEmail = false;
					this.verifyEmail = true;
				}
				this.stopLoading();
			})
			.catch( err => {
				console.log('updateProfile', err)
				this.stopLoading();
			})
		},

		verifyUnverifiedEmail() {
			this.startLoading()
			ProfileService.sendEmailVerifyOTP()
			.then( res => {
				res = res.data;
				if(!res.success){
					console.log(res.message)
					this.$notify({
						title: 'Unable to verify Email',
						text: 'Please try after sometime.',
						type: 'error'
					});
					return;
				}
				this.showOtp = true;
				this.stopLoading();
				this.$notify({
					title: 'OTP sent on email',
					text: 'OTP sent successfully.',
					type: 'success'
				});
			})
			.catch(err => {
				console.log('email otp err', err)
				this.stopLoading();
			})
		},

		updateProfile() {
			const data = {};

			if(this.orgUser.firstName !== this.user.firstName){
				data.firstName = this.user.firstName;
			}

			if(this.orgUser.lastName !== this.user.lastName){
				data.lastName = this.user.lastName;
			}
			if(data && Object.keys(data).length === 0){
				this.$notify({
					title: 'Profile Not Updated',
					text: 'Nothing changed.',
					type: 'error'
				});
				return;
			}

			this.startLoading()
			ProfileService.updateProfileData(data)
			.then( res => {
				res = res.data;
				if(res.code == 200){
					this.editEmail = false;
					this.verifyEmail = true;
					this.stopLoading();
					this.$notify({
						title: 'Profile Updated',
						text: 'Profile updated successfully.',
						type: 'success'
					});
				}else{
					this.$notify({
						title: 'Profile Not Updated',
						text: 'Something went wrong.',
						type: 'error'
					});
				}
			})
			.catch( () => {
				// console.log('updateProfile', err)
				this.stopLoading();
				this.$notify({
					title: 'Profile Not Updated',
					text: 'Something went wrong.',
					type: 'error'
				});
			})			
		}
	},
	mixins: [loading, generalMixin]
}

</script>

<style scoped lang="scss">

</style>