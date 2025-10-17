<template>
    <div>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <div class="d-flex mb-4">
                <h2>{{ $t("memberDataSection.userInformation") }}</h2>
                <v-spacer></v-spacer>
            </div>

            <v-card class="cards">
                <div class="text-block">
                    <div class="img-box">
                        <v-img v-if="user.profilePicUrl" class="profile-img" :src="profilePicUrl"></v-img>
                        <v-img v-else class="profile-img" src="/img/user.jpg"></v-img>
                    </div>
                    <div class="inner-text-block">
                        <p class="mb-2"> {{ user.firstName }} {{ user.lastName }} </p>
                        <p class="mb-2"> {{ user.email }} </p>
                        <p class="mb-2"> {{ user.mobile }} </p>
                    </div>
                </div>
            </v-card>

            <div class="row-box mt-2">
                <v-card class="no-radius height-160 flex-plat padding-20 mr-3">
                    <div class="icon-plat">
                        <svg width="37" height="36" viewBox="0 0 37 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.6875 0L0.6875 10.4V36H12.6875L18.4875 30L24.6875 36H36.6875V10.4L18.6875 0ZM10.4875 34V22L16.4875 28L10.4875 34ZM12.4875 20H24.4875L18.4875 26L12.4875 20ZM26.4875 34L20.4875 28L26.4875 22V34ZM24.6875 16H12.2875V12H24.6875V16Z" fill="#00BD73"/>
                        </svg>
                    </div>
                    <div class="info-plat ml-9">
                        <p class="mb-2 font-weight-bold"> {{  farms.length }} </p>
                       <p> Total Farms Registered </p>     
                    </div>
                </v-card>

                <v-card class="no-radius height-160 flex-plat padding-20">
                    <div class="icon-plat">
                        <svg width="41" height="36" viewBox="0 0 41 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <mask id="mask0_51360_215117" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="41" height="36">
                            <path d="M0.1875 0H40.1875V35.3339H0.1875V0Z" fill="white"/>
                            </mask>
                            <g mask="url(#mask0_51360_215117)">
                            <path d="M31.8679 31.2612H8.5822C7.02816 31.2612 6.05682 29.5773 6.83409 28.2298L12.6552 18.1377L18.4767 8.04615C19.2535 6.69912 21.1967 6.69912 21.9739 8.04615L27.7955 18.1377L33.617 28.2298C34.3938 29.5773 33.4225 31.2612 31.8679 31.2612ZM39.7023 31.0552L22.6502 1.4941C21.5549 -0.404284 18.8161 -0.404284 17.7208 1.4941L0.668688 31.0552C-0.426555 32.9546 0.942374 35.3277 3.13336 35.3277H37.2372C39.4281 35.3277 40.7976 32.9546 39.7023 31.0552Z" fill="#00BD73"/>
                            </g>
                            <path d="M21.5177 23.7206H19.6715L17.8951 13.8032L22.4756 13.3937L21.5177 23.7206ZM22.3208 27.4059C22.2173 27.606 22.0765 27.7806 21.8964 27.9304C21.7167 28.0802 21.5077 28.1996 21.2679 28.2902C21.0285 28.3798 20.7688 28.4245 20.4896 28.4245C20.2169 28.4245 19.9606 28.3798 19.7213 28.2902C19.4819 28.1996 19.272 28.0802 19.0923 27.9304C18.9132 27.7806 18.7714 27.606 18.6688 27.4059C18.5653 27.2059 18.5141 26.9934 18.5141 26.7665C18.5141 26.5406 18.5653 26.3241 18.6688 26.1181C18.7714 25.9111 18.9132 25.7335 19.0923 25.5832C19.272 25.4339 19.4819 25.314 19.7213 25.2239C19.9606 25.1338 20.2169 25.089 20.4896 25.089C20.7688 25.089 21.0285 25.1338 21.2679 25.2239C21.5077 25.314 21.7167 25.4339 21.8964 25.5832C22.0765 25.7335 22.2173 25.9111 22.3208 26.1181C22.4233 26.3241 22.4756 26.5406 22.4756 26.7665C22.4756 26.9934 22.4233 27.2059 22.3208 27.4059ZM27.795 18.1414L21.9735 8.04934C21.1967 6.7023 19.2535 6.7023 18.4768 8.04934L12.6552 18.1414L6.83415 28.2335C6.05688 29.5805 7.02822 31.2649 8.58226 31.2649H31.868C33.4225 31.2649 34.3939 29.5805 33.6166 28.2335L27.795 18.1414Z" fill="white"/>
                            <path d="M21.8959 25.5879C21.7163 25.4386 21.5073 25.3187 21.2675 25.2286C21.0281 25.1385 20.7683 25.0938 20.4892 25.0938C20.2165 25.0938 19.9602 25.1385 19.7209 25.2286C19.4815 25.3187 19.2715 25.4386 19.0919 25.5879C18.9128 25.7382 18.7709 25.9158 18.6684 26.1228C18.5649 26.3288 18.5137 26.5453 18.5137 26.7712C18.5137 26.9981 18.5649 27.2106 18.6684 27.4106C18.7709 27.6107 18.9128 27.7853 19.0919 27.9351C19.2715 28.0849 19.4815 28.2043 19.7209 28.2949C19.9602 28.3845 20.2165 28.4292 20.4892 28.4292C20.7683 28.4292 21.0281 28.3845 21.2675 28.2949C21.5073 28.2043 21.7163 28.0849 21.8959 27.9351C22.0761 27.7853 22.2169 27.6107 22.3204 27.4106C22.4229 27.2106 22.4752 26.9981 22.4752 26.7712C22.4752 26.5453 22.4229 26.3288 22.3204 26.1228C22.2169 25.9158 22.0761 25.7382 21.8959 25.5879Z" fill="#100F0D"/>
                            <path d="M19.671 23.7254H21.5171L22.475 13.3984L17.8945 13.808L19.671 23.7254Z" fill="#100F0D"/>
                        </svg>
                    </div>
                    <div class="info-plat ml-9">
                       <p class="mb-2 font-weight-bold"> {{ user.farm_limit }} </p>
                       <p> Farm Limit </p>     
                    </div>
                </v-card>
            </div>

            <div class="row-box mt-2">
                <v-card class="no-radius height-160 flex-plat padding-20 mr-3">
                    <div class="icon-plat">
                        <svg width="36" height="52" viewBox="0 0 36 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 0C8.04857 0 0 8.04857 0 18C0 31.5 18 51.4286 18 51.4286C18 51.4286 36 31.5 36 18C36 8.04857 27.9514 0 18 0ZM18 24.4286C16.295 24.4286 14.6599 23.7513 13.4543 22.5457C12.2487 21.3401 11.5714 19.705 11.5714 18C11.5714 16.295 12.2487 14.6599 13.4543 13.4543C14.6599 12.2487 16.295 11.5714 18 11.5714C19.705 11.5714 21.3401 12.2487 22.5457 13.4543C23.7513 14.6599 24.4286 16.295 24.4286 18C24.4286 19.705 23.7513 21.3401 22.5457 22.5457C21.3401 23.7513 19.705 24.4286 18 24.4286Z" fill="#00BD73"/>
                        </svg>
                    </div>
                    <div class="info-plat ml-9">
                        <p class="mb-2 font-weight-bold"> {{  totalFarmArea  }} </p>
                       <p> Total Farm Area </p>     
                    </div>
                </v-card>

                <v-card class="no-radius height-160 flex-plat  padding-20">
                    <div class="icon-plat">
                        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.4 36C3.9 36 2.625 35.475 1.575 34.425C0.525 33.375 0 32.1 0 30.6C0 29.43 0.3372 28.3872 1.0116 27.4716C1.6872 26.5572 2.55 25.905 3.6 25.515V10.485C2.55 10.095 1.6872 9.4422 1.0116 8.5266C0.3372 7.6122 0 6.57 0 5.4C0 3.9 0.525 2.625 1.575 1.575C2.625 0.525 3.9 0 5.4 0C6.57 0 7.6128 0.3372 8.5284 1.0116C9.4428 1.6872 10.095 2.55 10.485 3.6H25.515C25.875 2.55 26.5128 1.6872 27.4284 1.0116C28.3428 0.3372 29.4 0 30.6 0C32.1 0 33.375 0.525 34.425 1.575C35.475 2.625 36 3.9 36 5.4C36 6.6 35.6628 7.6572 34.9884 8.5716C34.3128 9.4872 33.45 10.125 32.4 10.485V25.515C33.45 25.905 34.3128 26.5572 34.9884 27.4716C35.6628 28.3872 36 29.43 36 30.6C36 32.1 35.475 33.375 34.425 34.425C33.375 35.475 32.1 36 30.6 36C29.43 36 28.3878 35.6628 27.4734 34.9884C26.5578 34.3128 25.905 33.45 25.515 32.4H10.485C10.095 33.45 9.4428 34.3128 8.5284 34.9884C7.6128 35.6628 6.57 36 5.4 36ZM5.4 7.2C5.91 7.2 6.3378 7.0278 6.6834 6.6834C7.0278 6.3378 7.2 5.91 7.2 5.4C7.2 4.89 7.0278 4.4622 6.6834 4.1166C6.3378 3.7722 5.91 3.6 5.4 3.6C4.89 3.6 4.4622 3.7722 4.1166 4.1166C3.7722 4.4622 3.6 4.89 3.6 5.4C3.6 5.91 3.7722 6.3378 4.1166 6.6834C4.4622 7.0278 4.89 7.2 5.4 7.2ZM30.6 7.2C31.11 7.2 31.5372 7.0278 31.8816 6.6834C32.2272 6.3378 32.4 5.91 32.4 5.4C32.4 4.89 32.2272 4.4622 31.8816 4.1166C31.5372 3.7722 31.11 3.6 30.6 3.6C30.09 3.6 29.6628 3.7722 29.3184 4.1166C28.9728 4.4622 28.8 4.89 28.8 5.4C28.8 5.91 28.9728 6.3378 29.3184 6.6834C29.6628 7.0278 30.09 7.2 30.6 7.2ZM10.485 28.8H25.515C25.785 28.02 26.205 27.345 26.775 26.775C27.345 26.205 28.02 25.785 28.8 25.515V10.485C28.02 10.215 27.345 9.795 26.775 9.225C26.205 8.655 25.785 7.98 25.515 7.2H10.485C10.215 7.98 9.795 8.655 9.225 9.225C8.655 9.795 7.98 10.215 7.2 10.485V25.515C7.98 25.785 8.655 26.205 9.225 26.775C9.795 27.345 10.215 28.02 10.485 28.8ZM30.6 32.4C31.11 32.4 31.5372 32.2272 31.8816 31.8816C32.2272 31.5372 32.4 31.11 32.4 30.6C32.4 30.09 32.2272 29.6628 31.8816 29.3184C31.5372 28.9728 31.11 28.8 30.6 28.8C30.09 28.8 29.6628 28.9728 29.3184 29.3184C28.9728 29.6628 28.8 30.09 28.8 30.6C28.8 31.11 28.9728 31.5372 29.3184 31.8816C29.6628 32.2272 30.09 32.4 30.6 32.4ZM5.4 32.4C5.91 32.4 6.3378 32.2272 6.6834 31.8816C7.0278 31.5372 7.2 31.11 7.2 30.6C7.2 30.09 7.0278 29.6628 6.6834 29.3184C6.3378 28.9728 5.91 28.8 5.4 28.8C4.89 28.8 4.4622 28.9728 4.1166 29.3184C3.7722 29.6628 3.6 30.09 3.6 30.6C3.6 31.11 3.7722 31.5372 4.1166 31.8816C4.4622 32.2272 4.89 32.4 5.4 32.4Z" fill="#00BD73"/>
                        </svg>
                    </div>
                    <div class="info-plat ml-9">
                       <p class="mb-2 font-weight-bold"> {{ totalZones }} </p>
                       <p> Total Zone </p>     
                    </div>
                </v-card>
            </div>

            <div class="d-flex mt-4">
                <h2>{{ $t("memberDataSection.userFarmInformation") }}</h2>
                <v-spacer></v-spacer>
            </div>

            <div class="row-box mt-2" v-if="farms.length">
                <v-card v-for="farm in farms" v-bind:key="farm.id"  class="pt-5 no-radius flex-1 cmr">
                    <v-card-title class="card-titles font-weight-bold"> {{ farm.farmName }} </v-card-title>
                    <v-card-text class="mt-1">
                        <div class="card-color font-weight-bold mb-3"> Farm Details </div>

                        <p class="mb-3"> <span class="font-weight-bold">Date of Entry : </span> {{ farm.createdAt }} </p>
                        <p class="mb-3"> <span class="font-weight-bold"> Farm ID : </span> {{ farm.id }} </p>
                        <p class="mb-3"> <span class="font-weight-bold"> Ownership Type : </span> {{ farm.farmOwnershipType }} </p>
                        <p class="mb-3"> <span class="font-weight-bold"> Location Address : </span> {{ farm.address }} </p>
                        <p class="mb-3"> 
                            <span class="font-weight-bold"> Goal Type : </span> 
                            <span v-if="farm.farmGoals.length"> {{ farm.farmGoals[0].farmingGoal }} </span>
                        </p>
                        <p class="mb-3"> <span class="font-weight-bold"> Total Size : </span> 200 acres </p>

                        <div class="card-color font-weight-bold mb-3"> Zones </div>
                        <div v-if="farm.zones.length">
                            <p class="mb-3" v-for="(zone, key) in farm.zones" :key="key"> 
                                <span class="font-weight-bold">Zone {{ key + 1 }} : </span> {{ zone.geofenceName }}
                            </p>
                        </div>

                        <div class="card-color font-weight-bold mb-3"> Crops </div>
                        <div v-if="farm.UserfarmCrop.length">
                            <p class="mb-3" v-for="crop in farm.UserfarmCrop" :key="crop.id"> {{ crop.showCropTypes.name }} </p>
                        </div>
                    
                        <div class="card-color font-weight-bold mb-3"> Equipment </div>
                        <div v-if="farm.farmEquipments.length">
                            <p class="mb-3" v-for="(equipment, key) in farm.farmEquipments" :key="key"> {{ equipment.displayName }}  </p>
                        </div>
                    </v-card-text>
                </v-card>
            </div>

            <div class="footer-card mt-10">
                <div class="btn-block mr-6">
                    <v-btn @click="$router.go(-1)" x-large min-width="120"  color="primary"  class="views-btn ">Back</v-btn>
                </div>
            </div>
        </v-container>
    </div>
</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import { mapState } from 'vuex'

export default {
    mounted() {
        this.startLoading()
        this.$store.dispatch('memberData/getFarmersViewAllFarms', {
            userId:this.$route.params.id
        }).then(() => this.stopLoading()).catch(() => this.stopLoading())
    },
    computed:{
        ...mapState({
            farms: state => state.memberData.farmers.farmerViewAllFarms.farms,
            user: state =>  state.memberData.farmers.farmerViewAllFarms.user
        }),
        totalZones(){
            return this.farms.reduce((acc, itrator) => {
                return acc + itrator.zones.length
            }, 0)
        },
        totalFarmArea() {
            return this.farms.reduce((acc, itrator) => {
                return acc + itrator.area
            }, 0)
        }
    },
    data() {
        return {
            breadcrumbs: [
                {
                    text: this.$t("dashboard"),
                    disabled: false,
                    to: { name: "Users" },
                    exact: true,
                },
                {
                    text: this.$t("memberDataSection.farmers"),
                    disabled: true,
                    href: "breadcrumbs_link_1",
                },
                {
                    text: this.$t("memberDataSection.viewAllFarms"),
                    disabled: true,
                    href: "breadcrumbs_link_1",
                },
            ],
        };
    },
    methods: {

    },
    mixins: [loadingMixin, getPermittedActions],
};
</script>
<style lang="scss" scoped>
::v-deep .profile-img {
    height: 134px;
    width: 134px;
    border-radius: 50%;
}

::v-deep .cards {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
}

::v-deep .text-block {
    width: 330px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

::v-deep .card-titles {
    height: 54px;
    background: #E5F8F1;;
    line-height: 26px;
}

::v-deep .card-color{
    color: #00BD73;
}

::v-deep .no-radius {
    border-radius: 0px;
}

::v-deep .height-160 {
    height: 160px;
}

::v-deep .row-box {
    display: flex;
    flex-wrap: wrap;
}

::v-deep .row-box .flex-1{
    flex: 0 0 48%;
    margin-bottom: 10px;
}

::v-deep .flex-1:nth-child(1):only-child {
    flex: 0 0 45%;
}

::v-deep .row-box .flex-plat {
    flex:1;
    display: flex;
    align-items: center;
}

::v-deep .footer-card{
    display: flex;
    justify-content: center;
}

::v-deep .icon-plat{
    height: 100px;
    width: 100px;
    border-radius: 50% !important;
    background-color: #E5F8F1;
    display: flex;
    justify-content: center;
    align-items: center;
}

::v-deep .icon-plat svg{
    height: 50px;
    width: 50px;
}

::v-deep .padding-20{
    padding: 20px;
}

::v-deep .cmr{
    margin-right: 16px;
}

@media only screen and (max-width: 700px) {
    ::v-deep .row-box {
        flex-direction: column;
    }
    ::v-deep .cmr{
        margin-right: 0 !important;
        margin-bottom: 16px !important; 
    }
}

</style>
  