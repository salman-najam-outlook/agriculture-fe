<template>
    	<div class="error-section">
			<div class="error-box">
				<img src="/img/error.png">
				<h2>Page Not Found</h2>
				<p>The page you are looking for might have been removed had its changed or is temporarily unavailable</p>
			</div>
		</div>
</template>
<style>
.error-section {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}
.error-box {
	background: #fff;
	padding: 20px 20px;
	text-align: center;
	width: 670px;
	margin: 0 auto;
}
.error-box  img{
	width: 424px;
}
.error-box h2{
	font-size: 21px;
	font-family: Poppins-Medium;
}
.error-box p {
    font-size: 14px;
    font-family: Poppins-Medium;
    padding: 0px 67px;
}
.error-box p {
    padding: 0px 12px;
}

@media only screen and (max-width: 1200px) {

}
@media only screen and (max-width: 767px) {
.error-box {
    width: 100%;
}
.error-box img {
    width: 100%;
}
}
</style>