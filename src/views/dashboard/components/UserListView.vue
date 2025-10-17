<template>
    <v-card elevation="0" class="px-5 pb-5 mt-5">
        <v-toolbar flat class="pt-3">
            <v-toolbar-title class="mt-n3">{{ $t('users') }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-menu v-model="menu1" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                    offset-y min-width="auto" v-if="filterType == 'month'">
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="filterDateMonth" readonly v-bind="attrs" v-on="on" outlined dense
                            style="width:220px" background-color="primary" color="white"
                            :placeholder="$t('selectMonth')"></v-text-field>
                    </template>
                    <v-date-picker v-model="filterDateMonth" type="month" no-title>
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="monthFilter">
                            {{ $t('confirm') }}
                        </v-btn>
                    </v-date-picker>
                </v-menu>
                <v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                    offset-y min-width="auto" v-if="filterType == 'custom'">
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="filterDateCustom" readonly v-bind="attrs" v-on="on" outlined dense
                            style="width:220px" background-color="primary" color="white"
                            placeholder="Select Date Range"></v-text-field>
                    </template>
                    <v-date-picker v-model="filterDateCustom" range no-title>
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="customFilter">
                            {{ $t('confirm') }}
                        </v-btn>
                    </v-date-picker>
                </v-menu>
                <v-menu v-model="menu3" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
                    offset-y min-width="auto" v-if="filterType == 'week'" class="xxxxxy">
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field v-model="filterDateWeek" readonly v-bind="attrs" v-on="on" outlined dense
                            style="width:220px" background-color="primary" color="white" class="white--text"
                            :placeholder="$t('selectWeek')"></v-text-field>
                    </template>
                    <v-date-picker v-model="filterDateWeek" @input="weekChange" no-title range show-adjacent-months
                        class="xxxxxc">
                        <v-spacer></v-spacer>
                        <v-btn text color="primary" @click="weekFilter" class="mt-n8">
                            {{ $t('confirm') }}
                        </v-btn>
                    </v-date-picker>
                </v-menu>
                <v-select v-if="filterType == 'year'" :items="years" item-text="name" item-value="value" outlined dense
                    class="ml-3 text-no-wrap" style="width:140px" background-color="primary" v-model="filterDateYear"
                    @change="getYearData"></v-select>
                <div class="white--text">
                    <v-select :items="[
                        { name: this.$t('byWeek'), value: 'week' },
                        { name: this.$t('byMonth'), value: 'month' },
                        { name: this.$t('byYear'), value: 'year' },
                        { name: this.$t('custom'), value: 'custom' },
                    ]" item-text="name" item-value="value" outlined dense class="ml-3 text-no-wrap" style="width:140px"
                        background-color="primary" v-model="filterType"></v-select>

                </div>
            </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
            <v-simple-table>
                <template v-slot:default>
                    <thead>
                        <tr>
                            <th lass="text-left">{{$t('dashboardSection.userType')}}</th>
                            <th lass="text-left">{{$t('registered')}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ $t('dashboardSection.registeredUsers') }}</td>
                            <td>{{ dashboardData.users ? dashboardData.users.registeredUsers : 0 }}</td>
                        </tr>
                        <tr>
                            <td>{{$t('dashboardSection.validMemberships')}}</td>
                            <td>{{ dashboardData.membershipTypes ? dashboardData.membershipTypes.reduce((total, current) => total + current.count, 0) : 0 }}</td>
                        </tr>
                        <tr>
                            <td>{{ $t('dashboardSection.activeUsers') }}</td>
                            <td>{{ dashboardData.users ? dashboardData.users.activeUsers : 0 }}</td>
                        </tr>
                        <tr>
                            <td>{{ $t('dashboardSection.deactivatedUsers') }}</td>
                            <td>{{ dashboardData.users ? dashboardData.users.deactivatedUsers : 0 }}</td>
                        </tr>
                        <tr>
                            <td>{{ $t('dashboardSection.offlineUsers') }}</td>
                            <td>{{ dashboardData.users ? dashboardData.users.offlineUsers : 0 }}</td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </v-card-text>
    </v-card>
</template>
<script>
import loadingMixin from "@/mixins/LoadingMixin"

export default {
    async mounted() {
        const fetchData = async () => {
            for (let i = this.year; i > this.year - 10; i--) {
                this.years.push(i);
            }
            this.getYearData()
        }
        fetchData()
    },
    data() {
        return {
            dashboardData: {},
            loading: true,
            year: new Date().getFullYear(),
            years: [],
            menu1: false,
            menu2: false,
            menu3: false,
            filterDateCustom: [],
            filterDateMonth: '',
            filterDateYear: new Date().getFullYear(),
            filterDateWeek: [],
            filterType: 'year',
            date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        }
    },
    methods: {
        async getGraphData(filterData) {
            let url = '/dashboard';
            if(filterData.startDate && filterData.endDate) {
                url += `?start_date=${filterData.startDate}&end_date=${filterData.endDate}`;
            }
            this.startLoading()
            try {
                const { data } = await this.$http.get(url);
                this.dashboardData = data.data;
                this.stopLoading()

            } catch (e) {
                console.log(e)
                this.stopLoading()
            }
        },
        monthFilter() {
            var date = new Date(`${this.filterDateMonth}-01`);
            var firstDay = `${this.filterDateMonth}-01`;
            var lastDayX = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            var lastDay = lastDayX.getFullYear() + "-" + (lastDayX.getMonth() + 1) + "-" + lastDayX.getDate();
            this.getGraphData({
                startDate: firstDay,
                endDate: lastDay
            })
            this.menu1 = false
        },
        customFilter() {
            this.getGraphData({
                startDate: this.filterDateCustom[0],
                endDate: this.filterDateCustom[1]
            })
            this.menu2 = false
        },
        weekChange() {
            var curr = new Date(this.filterDateWeek[0]); // get current date
            var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
            var last = first + 6; // last day is the first day + 6

            var firstday = new Date(curr.setDate(first)).toISOString().substr(0, 10);
            var lastday = new Date(curr.setDate(last)).toISOString().substr(0, 10);
            this.filterDateWeek = [firstday, lastday]
        },
        weekFilter() {
            this.getGraphData({
                startDate: this.filterDateWeek[0],
                endDate: this.filterDateWeek[1]
            })

            this.menu3 = false
        },

        getYearData() {
            this.getGraphData({
                startDate: `${this.filterDateYear}-01-01`,
                endDate: `${this.filterDateYear}-12-31`,
            })
        }
    },
    mixins: [loadingMixin]
}
</script>