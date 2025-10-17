<template>
    <div>
        <breadcrumb :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <div class="d-flex mb-4">
                <h2>{{ $t("memberDataSection.farmerView") }}</h2>
                <v-spacer></v-spacer>
            </div>
            <v-card class="cards">
                <div class="text-block">
                    <div class="img-box">
                        <v-img v-if="farmer.user && farmer.user.profilePicUrl" class="profile-img" :src="farmer.user.profilePicUrl"></v-img>
                        <v-img v-else class="profile-img" src="/img/user.jpg"></v-img>
                    </div>
                    <div class="inner-text-block">
                        <p class="mb-2"> {{ farmer.user.firstName }} {{ farmer.user.lastName }} </p>
                        <p class="mb-2"> {{ farmer.user.email }} </p>
                        <p class="mb-2"> {{ farmer.user.mobile }} </p>
                    </div>
                </div>
                <div class="btn-block mr-6">
                    <v-btn :to="{name:'farm_activity', params:{userId:farmer.user.id}}" x-medium min-width="120" color="primary" class="views-btn mr-2">Farm Activity</v-btn>
                    <v-btn :to="{name:'farmers_show_on_maps', params:{farmId:farmer.farmInformation.farmID,farmerId:farmer.user.id}}" x-medium min-width="120" color="primary" class="views-btn">Show on map</v-btn>
                </div>
            </v-card>

            <div class="row-box mt-4">
                <v-card class="pt-5 no-radius fixed-width-height flex-1 cmr">
                    <v-card-title class="card-titles font-weight-bold"> Farm Information </v-card-title>
                    <v-card-text class="mt-1">
                        <p class="mb-3"> <span class="font-weight-bold">Date of Entry : </span> {{ farmer.farmInformation.dateOfEntry }} </p>
                        <p class="mb-3"> <span class="font-weight-bold"> Farm ID : </span> {{ farmer.farmInformation.farmID }} </p>
                        <p class="mb-3"> <span class="font-weight-bold"> Ownership Type : </span> {{ farmer.farmInformation.ownershipType }} </p>
                        <p class="mb-3"> <span class="font-weight-bold"> Location Address : </span> {{ farmer.farmInformation.address }} </p>
                        <p class="mb-3"> <span class="font-weight-bold"> Goal Type : </span> {{ farmer.farmInformation.goalType }} </p>
                        <p class="mb-3"> <span class="font-weight-bold"> Total Size : </span> {{ farmer.farmInformation.totalSize }} </p>
                    </v-card-text>
                </v-card>
                <v-card class="pt-5 no-radius height-300 flex-1">
                    <v-card-title class="card-titles font-weight-bold"> Crops </v-card-title>
                    <v-card-text class="mt-1" v-if="farmer.crops.length">
                        <p class="mb-3" v-for="(crop, key) in farmer.crops" :key="key"> {{ crop }} </p>
                    </v-card-text>
                </v-card>
           
                <v-card class="pt-5 no-radius fixed-width-height flex-1 cmr">
                    <v-card-title class="card-titles font-weight-bold"> Zones </v-card-title>
                    <v-card-text class="mt-1" v-if="farmer.zones.length">
                        <p class="mb-3" v-for="(zone, key) in farmer.zones" :key="key"> <span class="font-weight-bold">{{ zone.name }} : </span> {{ zone.zone }} </p>
                    </v-card-text>
                </v-card>
           
                <v-card class="pt-5 no-radius height-300 flex-1 cmr">
                    <v-card-title class="card-titles font-weight-bold"> Equipment </v-card-title>
                    <v-card-text class="mt-1" v-if="farmer.equipments.length">
                        <p class="mb-3" v-for="(equipment, key) in farmer.equipments" :key="key">  {{ equipment }}  </p>
                    </v-card-text>
                </v-card>
                
            </div>
            <div class="footer-card mt-10">
                <div class="btn-block mr-6">
                    <v-btn @click="$router.go(-1)" x-large min-width="120" depressed color="primary" outlined class="views-btn mr-4">Back</v-btn>
                    <v-btn :to="{name:'view_all_farms', params:{id:farmer.user.id}}" x-large min-width="120" color="primary" class="views-btn">View All Farms</v-btn>
                </div>
            </div>
        </v-container>
    </div>
</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import { mapGetters } from 'vuex'

export default {
    async mounted() {
        this.startLoading()
        this.$store.dispatch('memberData/getFarmerDetail', {
            userId:this.$route.params.id
        }).then(() => {this.stopLoading()}).catch(() => this.stopLoading())
    },
    computed:{
        ...mapGetters({farmer: 'memberData/farmerDetail'})
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
                    text: this.$t("memberDataSection.farmersDetails"),
                    disabled: true,
                    href: "breadcrumbs_link_1",
                },
            ],
        };
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
    width: 320px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

::v-deep .card-titles {
    height: 54px;
    background: #E5F8F1;;
    line-height: 26px;
}

::v-deep .no-radius {
    border-radius: 0px;
}

::v-deep .height-300 {
    height: 300px;
}

::v-deep .row-box {
    display: flex;
    flex-wrap: wrap;
}

::v-deep .cmr{
    margin-right: 31px;
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

::v-deep .row-box .flex-1{
    flex:0 0 48%;
    margin-bottom: 15px;
}

::v-deep .footer-card{
    display: flex;
    justify-content: center;
}
</style>
  