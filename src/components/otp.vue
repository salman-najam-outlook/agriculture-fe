<template>
    <div id="pin" class="overlay" :class="{'show-overlay': showOtp}">
			<div class="popup-section">
				<div class="popup-heading">
					<h2>Reset Password</h2>
				</div>
				<div class="email-img">
					<img src="img/lock.png">
				</div>
				<a class="close" @click.prevent="closeOtpForm" href="#">&times;</a>
				<div class="reset-text">
					<p>Please enter the code we sent to your email</p>
				</div>
				<div class="otp-boxes">
					<template v-for="(o, i)  in otp">
					<input @input="focusNext(i)" v-model="otp[i]" @keypress="checkValidOtp($event)" :ref="'otp_'+i" :key="i" type="text" class="text-box-1">
					</template>
				</div>
				<div class="login-button">
					<div class="errorf otp-error">
						{{ errors.otp }}
					</div>
					<a href="#" @click.prevent="verifyOtp" class="btn-login-tab">Submit</a>
				</div>
				<div class="bottom-link">
					<h2>Didn’t receive the code?<a href="login.html" class="link-signup">Resend</a></h2>
				</div>
			</div>
		</div>
</template>
<script>
import generalMixin from "@/mixins/GeneralMixin";
    export default {
        name: 'otpForm',
        props: [
            'showOtp'
        ],
        data() {
            return {
                errors: {otp: ''},
                otp: ['','','','','',''],
            }
        },
        methods: {
            closeOtpForm() {
			    this.otpForm = false;
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
            checkValidOtp(e) {
                if(e.target.value) {
                    e.preventDefault();
                }
                return this.isNumber();
            },
        },
        mixins: [generalMixin]
    }
</script>
<style scoped>
    .popup-section {
		margin: 70px auto;
		padding: 20px 35px;
		background: #fff;
		border-radius: 5px;
		width: 474px;
		position: relative;
		transition: all 5s ease-in-out;
	}
    .overlay {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(0, 0, 0, 0.7);
		transition: opacity 500ms;
		visibility: hidden;
		opacity: 0;
	}
    .show-overlay {
		visibility: visible;
		opacity: 1;
	}
    .popup-section .popup-heading{
	    text-align: center;
    }
    .popup-section .popup-heading h2{
        font-size: 18px;
        font-family: Poppins-Medium;
        margin: 0px 0px 5px;
        color: #117443;
    }
    .popup-section .email-img{
        text-align: center;
        margin-top: 26px;
    }
    .popup-section .reset-text h2{
        font-family: pop_semiBold;
            margin-top: 16px;
            color: #117443;
            margin-bottom: 11px;
    }
    .popup-section .reset-text p {
            margin: 8px auto 29px;
            font-family: Poppins-Medium;
            font-size: 15px;
    }

    .popup-section .otp-boxes {
	display: flex;
	justify-content: space-between;
    padding: 30px 0px 0px;
}
.popup-section .otp-boxes input {
	width: 58px;
	height: 58px;
	border-radius: 7px;
	border: 1px solid #B5B5B5 !important;
	padding: 0px 7px;
	font-size: 17px;
	font-family: Poppins-Medium;
	text-align: center;
}

.popup-section .otp-boxes input:focus {
	color: #495057;
	background-color: #fff;
	border-color: #ff8880;
	outline: 0;
	box-shadow: none
}
</style>