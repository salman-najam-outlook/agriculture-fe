<template>
  <div>
  <div class="login-section signup-section">
		<div class="container">
			<div class="login-main">
				<div class="login-box">
					<div class="logo">
						<img src="img/logo.png">
					</div>
					<div class="login-from">
						<label for="fname">First Name*</label>
						<input type="text" id="fname" class="form-control" placeholder="Enter your first name">
						<img src="img/user.png" class="text-icon">
					</div>
					<div class="login-from">
						<label for="fname-new">Last Name*</label>
						<input type="text" id="fname-new" class="form-control" placeholder="Enter your last name">
						<img src="img/user.png" class="text-icon">
					</div>
					<div class="login-from">
						<label for="fname-new">Mobile Number*</label>
						<input type="text" id="fname-new" class="form-control" placeholder="Enter mobile number">
						<img src="img/path.png" class="text-icon">
					</div>
					<div class="login-from">
						<label for="fname-new">Email Address*</label>
						<input type="text" id="fname-new" class="form-control" placeholder="Enter email address">
						<img src="img/email.png" class="text-icon">
					</div>
					<div class="login-from">
						<label for="fname-new">City / Village*</label>
						<input type="text" id="fname-new" class="form-control" placeholder="Enter your city / village">
						<img src="img/city.png" class="text-icon">
					</div>
					<div class="login-from">
						<label for="fname-new">District / Region</label>
						<select class="form-control">
							<option value="volvo">select</option>
							<option value="saab">1</option>
							<option value="mercedes">1</option>
							<option value="audi">1</option>
						</select>
					</div>
					<div class="login-from">
						<label for="fname-new">Country*</label>
						<input type="text" id="fname-new" class="form-control" placeholder="Enter your country">
						<img src="img/location.png" class="text-icon">
					</div>
					<div class="login-button">
						<a class="btn-login-tab">SUBMIT</a>
					</div>
					<div class="bottom-link">
						<h2>Alreday have an account?<router-link class="link-signup" to="/login">LogIn Now</router-link></h2>
					</div>
				</div>
			</div>
		</div>
	</div>
  </div>
</template>

<script>
export default {
  
};
</script>

<style scopped>

  .login-section.signup-section{
    height: 1100px;
  }
  .login-section{
	  display: flex;
	  align-items: center;
	  height: 100vh;
  }
  .login-section .container {
	  padding-right: 15px;
	  padding-left: 15px;
	  margin-right: auto;
	  margin-left: auto;
  }
  .login-section .login-main{
	  display: flex;
	  justify-content: center;
	  align-items: center;
  }
  .login-section .login-main .login-box {
	  background: #fff;
	  padding: 33px 67px;
	  width: 474px;
	  border-radius: 12px;
  }
  .login-section .login-main .login-box .logo {
	  text-align: center;
	  margin-bottom: 35px;
  }
  .login-section .login-main .login-box .login-from {
	  width: 100%;
	  margin-bottom: 28px;
	  position: relative;
  }
  .login-section .login-main .login-box .login-from label {
	  display: inline-block;
	  max-width: 100%;
	  margin-bottom: 5px;
	  font-size: 15px;
	  font-family: Poppins-Medium;
  }
  .login-section .login-main .login-box .login-from .form-control {
	  display: block;
	  width: 100%;
	  height: 34px;
	  padding: 6px 12px;
	  font-size: 14px;
	  line-height: 1.42857143;
	  color: #555;
	  background-color: #fff;
	  background-image: none;
	  border-bottom: 1px solid #B5B5B5 !important;
	  border: 0px;
	  padding-left: 0px;
	  padding-right: 39px;
	  padding-bottom: 11px;
  }
  .login-section .login-main .login-box .login-from .form-control::placeholder{
	  font-size:13px;
	  font-family: pop_regular;
	  color:#636363;
  }
  .login-section .login-main .login-box .login-from .form-control:focus-visible {
	  outline: none;
  }
  .text-icon {
	  position: absolute;
	  right: 0px;
	  bottom: 9px;
  }
  .login-section .login-main .password-reset a{
	  font-size: 14px;
	  color:#636363;
	  font-family: Poppins-Medium;
	  text-decoration: none;
	  display: block;
	  float: right;
	  margin-bottom: 36px;
  }
  .login-section .login-main .login-box .login-from.margin-less{
	  margin-bottom: 11px;
  }
  .btn-login-tab {
	  background: #117443;
	  color: #fff !important;
	  padding: 15px 0px;
	  display: flex !important;
	  justify-content: center;
	  width: 100%;
	  font-family: Poppins-Medium;
	  text-decoration: none;
  }

  .login-section .login-main .login-box .bottom-link h2{
	  font-size: 14px;
	  color:#000;
	  font-family: Poppins-Medium;
	  text-decoration: none;
  }
  .login-section .login-main .login-box .bottom-link h2{
	  text-align: center;
	  font-size: 14px;
	  font-family: Poppins-Medium;
	  color: #000;
	  font-weight: 100;
	  margin-top: 25px;
  }
  .login-section .login-main .login-box .bottom-link a{
	  font-size: 14px;
	  font-family: Poppins-Medium;
	  text-decoration: none;
	  color:#0EBF67;
	  margin-left:7px;
  }
  .login-section .login-main .login-box .verify-text {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
  }
  .login-section .login-main .login-box .verify-text h2{
	  width: 200px;
	  margin-bottom: 19px;
  }

  @media only screen and (max-width: 575px) {
    .login-section .login-main .login-box {
        padding: 33px 20px;
    }
    .login-section .container {
        padding-right: 0px;
        padding-left: 0px;
    }
    .login-section {
        height: auto;
    }
}
</style>
