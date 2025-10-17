<template>
  <div>
	<router-view/>
	<template v-if="active">
		<v-dialog
			v-model="alertdialog"
			transition="dialog-top-transition"
			max-width="290"
		>
			<template>
			<v-card>
				<v-card-title class="text-h5"> {{$t('warning')}} </v-card-title>

				<v-card-text> {{$t('systemAutoLogout')}} </v-card-text>

				<v-card-actions>
				<v-spacer></v-spacer>

				<v-btn color="grey darken-1" text v-on:click="closeAlert(false)">
					{{$t('cancel')}}
				</v-btn>
				</v-card-actions>
			</v-card>
			</template>
		</v-dialog>
		</template>
	</div>
</template>

<script>
// import store from "./store/index";
export default {

	data() {
    return {
      events: ["click", "mousemove", "mousedown", "scroll", "load", "keypress"],
      warningTimer: null,
      logoutTimer: null,
      alertdialog: false,
      active: false,
    };
  },
  mounted() {
    this.setFavICON();
    this.events.forEach((event) => {
      window.addEventListener(event, this.resetTimer);
    }, this);
    //this.setTimers();
    // console.log("here ", JSON.stringify(store.getters))
  },
  destroyed() {
    this.events.forEach((event) => {
      window.removeEventListener(event, this.resetTimer);
    }, this);
    this.resetTimer();
  },
  methods: {
    setTimers() {
    },

    resetTimer() {
      // console.log("off")
      // clearTimeout(this.warningTimer),
      //   clearTimeout(this.logoutTimer),
      //   this.setTimers();
    },
    setFavICON() {
      console.log(localStorage.getItem("LANGUAGE"), "set fav icon");
      if( localStorage.getItem("LANGUAGE") === "id") {
          console.log(localStorage.getItem("LANGUAGE"), "set fav icon");
        document.title = "PTSI";
        const link = document.querySelector("link[rel*='icon']") || document.createElement("link");
        link.type = "image/x-icon";
        link.rel = "icon";
        link.href = "https://dimitra-public-images.s3.us-east-1.amazonaws.com/ptsi_favicon.ico";
        document.getElementsByTagName("head")[0].appendChild(link);
      } else {
          console.log(localStorage.getItem("LANGUAGE"), "set fav icon dimitra");
        document.title = "Dimitra";
        const link = document.querySelector("link[rel*='icon']") || document.createElement("link");
        link.type = "image/x-icon";
        link.rel = "icon";
        link.href = "https://dimitra-public-images.s3.amazonaws.com/dimitra_favicon.ico";
        document.getElementsByTagName("head")[0].appendChild(link);
      }
    
    },
  },
};
</script>

<style lang="scss">
* {
  font-family: "Poppins", sans-serif;
}

@font-face {
	font-family: pop_light;
	src: url('/font/Poppins-Light.ttf');
}
@font-face {
	font-family: pop_regular;
	src: url('/font/Poppins-Regular.ttf');
}
@font-face {
	font-family: Poppins-Medium;
	src: url('/font/Poppins-Medium.ttf');
}
@font-face {
	font-family: pop_semiBold;
	src: url('/font/Poppins-SemiBold.ttf');
}

</style>
