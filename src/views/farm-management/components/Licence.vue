<template>
  	<v-container grid-list-xl fluid>
    	<v-layout row wrap>
			<v-flex
				xs6
				sm4
				md2
				xl2
				:style="$vuetify.breakpoint.width <= 980 && { flexBasis: '50%' }"
				class="lg5-custom mb-5"
			>
				<v-card class="green2" min-height="100" flat>
					<!-- <v-icon class="float-right mt-2 mr-2">mdi-dots-horizontal</v-icon> -->
					<v-list dense class="mb-n3 green2">
						<v-list-item>
						<v-list-item-content class="green2">
							<v-list-item-title class="green2">
							{{$t('farm.licenseNumber')}}
							<v-tooltip top color="black">
								<template v-slot:activator="{ on, attrs }">
								<v-icon v-bind="attrs" v-on="on">
									mdi-help-circle-outline
								</v-icon>
								</template>
								<span>{{$t('farm.licenseNumberState')}}</span>
							</v-tooltip>
							</v-list-item-title>
							<h5 class="mt-2 text-capitalize">
							{{ farm.licenceNum || 'N/A' }}
							</h5>
						</v-list-item-content>
						</v-list-item>
					</v-list>
				</v-card>
			</v-flex>
			<v-flex
				xs6
				sm4
				md2
				xl2
				:style="$vuetify.breakpoint.width <= 980 && { flexBasis: '50%' }"
				class="lg5-custom mb-5"
			>
				<v-card class="green2" flat min-height="100">
					<!-- <v-icon class="float-right mt-2 mr-2">mdi-dots-horizontal</v-icon> -->
					<v-list dense class="mb-n3 green2">
						<v-list-item>
							<v-list-item-content class="green2">
								<v-list-item-title class="green2">
									{{$t('farm.licenseExpiryDate')}}
									<v-tooltip top color="black">
										<template v-slot:activator="{ on, attrs }">
											<v-icon v-bind="attrs" v-on="on">
												mdi-help-circle-outline
											</v-icon>
										</template>
										<span>{{$t('farm.licenseExpiryDateState')}}</span>
									</v-tooltip>
								</v-list-item-title>
								<h5 class="mt-2 text-capitalize">{{ farm.licenceExpiryDate || 'N/A' }}</h5>
							</v-list-item-content>
						</v-list-item>
					</v-list>
				</v-card>
				</v-flex>
				<v-flex
					xs6
					sm4
					md2
					xl2
					:style="$vuetify.breakpoint.width <= 980 && { flexBasis: '50%' }"
					class="lg5-custom mb-5"
				>
					<v-card class="green2" flat min-height="100">
						<!-- <v-icon class="float-right mt-2 mr-2">mdi-dots-horizontal</v-icon> -->
						<v-list dense class="mb-n3 green2">
							<v-list-item>
								<v-list-item-content class="green2">
									<v-list-item-title class="green2">
										{{$t('farm.regulatorName')}}
										<v-tooltip top color="black">
											<template v-slot:activator="{ on, attrs }">
											<v-icon v-bind="attrs" v-on="on">
												mdi-help-circle-outline
											</v-icon>
											</template>
											<span>{{$t('farm.regulatorNameState')}}</span>
										</v-tooltip>
									</v-list-item-title>
									<h5 class="mt-2 text-capitalize">
										{{ farm.regulatorName }}
									</h5>
								</v-list-item-content>
							</v-list-item>
						</v-list>
					</v-card>
      			</v-flex>
				<v-flex
					xs6
					sm4
					md2
					xl2
					:style="$vuetify.breakpoint.width <= 980 && { flexBasis: '50%' }"
					class="lg5-custom-rep mb-5"
				>
					<v-card class="green2" flat min-height="100">
						<!-- <v-icon class="float-right mt-2 mr-2">mdi-dots-horizontal</v-icon> -->
						<v-list dense class="mb-n3 green2">
							<v-list-item>
								<v-list-item-content class="green2">
									<v-list-item-title class="green2">
									{{$t('farm.regulatorRepresentativeName')}}
									<v-tooltip top color="black">
										<template v-slot:activator="{ on, attrs }">
										<v-icon v-bind="attrs" v-on="on">
											mdi-help-circle-outline
										</v-icon>
										</template>
										<span
										>{{$t('farm.regulatorRepresentativeNameState')}}</span
										>
									</v-tooltip>
									</v-list-item-title>
									<h5 class="mt-2 text-capitalize">
										{{ farm.regulatorRepresentiveName || 'N/A' }}
									</h5>
								</v-list-item-content>
							</v-list-item>
						</v-list>
					</v-card>
				</v-flex>
      <v-flex
        xs6
        sm4
        md2
        xl2
        :style="$vuetify.breakpoint.width <= 980 && { flexBasis: '50%' }"
        class="lg5-custom mb-5"
      >
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
// import { mapGetters } from "vuex";
export default {
  name: "Licence",
  mounted() {
    this.licencedate = this.dateFormat(this.farm.licenceED);
  },
  computed: {
    // ...mapGetters(["getfarm"]),
  },
  data() {
    return {
      licencedate: "",
    };
  },
  methods: {},
  props: {
	  farm: {
		  require: true
	  },
	  dateFormat: {
		  require: true
	  }
  }
};
</script>
<style lang="scss" scoped>
// .col{
//   width: 20%;
// max-width: 20%;
// flex-basis: 20%;
// }
.flex.lg5-custom {
  width: 20%;
  max-width: 80%;
  flex-basis: 20%;
}
.flex.lg5-custom-rep{
width: 20%;
  max-width: 80%;
  flex-basis: 30%;
}
// .v-list .v-list-item-content .h5 {
//   font-size: 7px;
//   color: grey;
// }
</style>