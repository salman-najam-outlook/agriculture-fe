<template>
  <v-navigation-drawer
    :mini-variant.sync="drawer"
    mini-variant-width="70"
    permanent
    app
    id="mainnav"
    :class="isKenyaClientComputed ? 'kenya-green-bg' : 'secondary'"
    width="274"
  >
    <!-- style="width: 272px" -->
    <v-list class="white--text pb-5">
      <v-list-item class="">
        <v-img
          v-if="organization || subOrg"
          style="display: block; margin-left: auto; margin-right: auto"
          :max-width="drawer ? 50 : 70"
          :src="getLogo(drawer)"
        ></v-img>
        <!-- <v-list-item-avatar>
                </v-list-item-avatar> -->
        <!-- <v-list-item-title class="text-h5 font-weight-bold white--text">DIMITRA</v-list-item-title> -->
      </v-list-item>
    </v-list>

    <v-divider
      class="mb-4"
      style="margin-left: 36px"
      color="#EDEDED"
      inset
    ></v-divider>
    <v-list nav dense v-for="(item, idx) in permissions" :key="idx">
      <v-list-item
        :active-class="getActiveClass()"
        class=""
        v-if="!item.subMenu"
        :to="{ name: item.route_path_name }"
        link
      >
        <v-list-item-icon>
          <v-img :src="item.icon"></v-img>
          <!-- <v-icon class="white--text font-weight-bold">{{ item.icon }}</v-icon> -->
        </v-list-item-icon>
        <v-list-item-content class="ml-n5">
          <v-list-item-title class="xxx white--text font-weight-bold">{{
            item.name
          }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-group
        v-else
        :value="false"
        exact
        no-action
        :active-class="getActiveClass()"
        class="white--text"
      >
        <template #prependIcon>
          <!-- <v-icon class="white--text">mdi-cow</v-icon> -->
          <v-img :src="item.icon"></v-img>
        </template>
        <template v-slot:activator>
          <v-list-item-content class="ml-n5">
            <v-list-item-title class="white--text">{{
              item.name
            }}</v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item
          v-for="(subitem, i) in item.subMenu"
          :key="i"
          :to="getSublink(subitem)"
          link
          class="pl-11"
        >
          <v-list-item-icon>
            <v-img :src="subitem.icon"></v-img>
          </v-list-item-icon>
          <v-list-item-title class="white--text ml-n5">
            {{ subitem.name }}
          </v-list-item-title>
        </v-list-item>
      </v-list-group>
    </v-list>
    <template v-slot:append>
      <div class="text-no-wrap text-caption text-center white--text mb-5">
        {{ $t("version") }}
        <br v-if="drawer" />
        {{ version }}
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { version } from "../../../package.json"
import { isKenyaClient } from "@/utils"
import axios from "axios"
import _ from "lodash"
export default {
  name: "sidebar",
  created() {
    const getNotSyncSidebar = async () => {
      if (
        localStorage.getItem("SIDEBAR_NOT_SYNC") &&
        this.$store.state.language != "en"
      ) {
        const res = await axios.get("/getSideBarData", {
          headers: {
            lang: this.$store.state.language,
          },
        })
        console.log("sidebar-->", res.data.data)
        let user = localStorage.getItem("user")
        user = JSON.parse(user)
        user.sideBarMenu = res.data.data
        this.$store.commit("setUserOnly", user)
        localStorage.setItem("user", JSON.stringify(user))
        localStorage.removeItem("SIDEBAR_NOT_SYNC")
      }
    }
    getNotSyncSidebar()
  },
  computed: {
    drawer: {
      get() {
        return this.$store.state.drawer
      },
      set(val) {
        return this.$store.commit("SET_DRAWER", !val)
      },
    },
    isKenyaClientComputed() {
      const result = isKenyaClient();
      return result;
    },
    permissions() {
      // return this.menuItems
      // return this.$store.getters.getUserPermissions(this.menuItems);
      const userData = this.$store.getters.getUser
      // need to deep copy to avoid infinite loop
      let perms = JSON.parse(
        JSON.stringify(
          this.$store.getters.getUserPermissions(userData.sideBarMenu)
        )
      )
      // let perms =  this.$store.getters.getUserPermissions(userData.sideBarMenu);
      let finalPerms = perms.map((p) => {
        if (p.subMenu) {
          p.subMenu = _.orderBy(p.subMenu, ["order"], ["asc"])
        }
        return p
      })

      // Normalize route names coming from backend/localStorage to client router names
      finalPerms = finalPerms.map((p) => {
        if (p && p.id === 'dds_root_dashboard') {
          p.route_path_name = 'dashboard'
        }
        return p
      })

      //finalPerms.push(this.marketPlaces)

      

      // let subMenu = [];
      // const isSubenterprise = userData?.user_role_assoc?.some(role => role?.id === 'sub_enterprise');
      // if ((userData?.user_organization?.id === 3  || userData?.user_organization?.id === 39) && !isSubenterprise) {
      //     const includedItems = ["esgAccountDashboard", "esgMyProducts","MyProtocols"];
      //     const sub1 = this.esgPlatform?.subMenu?.filter(item => includedItems.includes(item.route_path_name)) || [];
      //     subMenu.push(...sub1);
      // }
      // if (userData?.user_role_assoc?.some(role => role.id === 'super_admin')) {
      //     const includedItems = ["ESGSurveyList", "esgPlatformStandards"];
      //     const sub = this.esgPlatform?.subMenu?.filter(item => includedItems.includes(item.route_path_name)) || [];
      //     subMenu = sub //subMenu.push(...sub);
      // }
      // if (subMenu.length > 0) {
      //     finalPerms.push({
      //         id: "esg_platform",
      //         name: "ESG Platform",
      //         icon: "/icons/dashboard.png",
      //         route_path_name: "ESGPlatform",
      //         subMenu
      //     });
      // }

      // Add Manage Tutorials menu item for super_admin users
      if (userData?.user_role_assoc?.some(role => role.id === 'super_admin')) {
          finalPerms.push({
              id: "tutorial_management",
              name: this.$t("tutorials.manageTutorials"),
              icon: "/icons/faq.png",
              route_path_name: "TutorialManagement",
          });
      }

      let sortedArray = _.orderBy(finalPerms, ["order"], ["asc"])
      // sortedArray = sortedArray.map(p => {
      //   if(p.id.includes("farm_management")) {
      //       p.subMenu.push({
      //         "id": "farm_activities",
      //         "name": "Farm Activities",
      //         "route_path_name": "FarmCalenderActivities",
      //         "parent_menu_id": "farm_management",
      //         "icon": null,
      //         "order": 3,
      //         "label": "Farm Activities"
      //       })
      //   }
      //   return p
      // })
      // Add Carbon Credit menu always for all users
      // sortedArray.push(this.carbonCreditMenu)
      return sortedArray
    },
    organization() {
      const userData = this.$store.getters.getUser
      return userData.user_organization
    },
    subOrg() {
      const userData = this.$store.getters.getUser
      return userData.subOrg
    },
  },
  data() {
    return {
      cacaoMenu: [
        {
          active: 1,
          icon: "/icons/logs.png",
          id: "cacao",
          name: this.$t("cacaoData.cacaoOverview"),
          order: 3,
          route_path_name: "cacao",
          subMenu: [
            {
              icon: "/icons/users.png",
              id: "cacao_plantation",
              label: "cacao_plantation",
              name: this.$t("dashboardSection.plantations"),
              order: 1,
              parent_menu_id: "cacao",
              route_path_name: "CacaoPlantation",
            },
            {
              icon: "/icons/users.png",
              id: "cacao-data",
              label: "cacao-data",
              name: this.$t("dashboardSection.cacaoData"),
              order: 1,
              parent_menu_id: "cacao",
              route_path_name: "cacaoData",
            },
            {
              icon: "/icons/users.png",
              id: "dry-cacao",
              label: "dry-cacao",
              name: this.$t("dashboardSection.dryCacao"),
              order: 1,
              parent_menu_id: "cacao",
              route_path_name: "dryCacao",
            },
            {
              icon: "/icons/users.png",
              id: "traceability",
              label: "traceability",
              name: this.$t("dashboardSection.traceability"),
              order: 1,
              parent_menu_id: "traceability",
              route_path_name: "traceability",
            },
          ],
        },
      ],
      menuItems: [
        {
          id: "user_listing",
          img: "/icons/dashboard.png",
          icon: "mdi-account-multiple-outline",
          name: this.$t("dashboard"),
          url: { name: "dashboard" },
          exact: false,
        },
        {
          id: "user_listing",
          img: "/icons/users.png",
          icon: "mdi-account-multiple-outline",
          name: this.$t("users"),
          url: { name: "Users" },
          exact: false,
        },
        {
          id: "activity_log",
          img: "/icons/roles.png",
          icon: "mdi-cog-outline",
          name: this.$t("adminRoles.adminRoles"),
          url: { name: "AdminRoles" },
          exact: true,
        },
        {
          id: "activity_log",
          img: "/icons/membership.png",
          icon: "mdi-cog-outline",
          name: this.$t("membershipPlans"),
          url: { name: "MembershipTypes" },
          exact: true,
        },
        {
          id: "permissions",
          img: "/icons/permisssions.png",
          icon: "mdi-account-lock",
          name: this.$t("permission"),
          url: { name: "AdminPermissions" },
          exact: true,
        },
        {
          id: "activity_log",
          img: "/icons/logs.png",
          icon: "mdi-notebook-edit-outline",
          name: this.$t("activity_log"),
          url: { name: "ActivityLogs" },
          exact: true,
        },
        {
          id: "unsynced_record",
          img: "/icons/logs.png",
          icon: "mdi-notebook-edit-outline",
          name: this.$t("unsynced_record"),
          url: { name: "UnsyncedRecord" },
          exact: true,
        },
        {
          id: "activity_log",
          img: "/icons/activationKey.png",
          icon: "mdi-cog-outline",
          name: this.$t("activationKey.activationKey"),
          url: { name: "ActivationKey" },
          exact: true,
        },
        {
          id: "activity_log",
          img: "/icons/faq.png",
          icon: "mdi-cog-outline",
          name: this.$t("helpDesk"),
          url: { name: "Faq", params: { section: "faq" } },
          exact: true,
        },
        {
          id: "activity_log",
          img: "/icons/tickets.png",
          icon: "mdi-ticket",
          name: this.$t("tickets.title"),
          url: { name: "Tickets" },
          exact: true,
        },
        {
          id: "profile_authentication",
          img: "/icons/usersettings.png",
          icon: "mdi-account-cog",
          name: this.$t("dashboardSection.coffeeData"),
          url: { name: "ProfileAuthSet" },
          exact: true,
        },
        {
          id: "profile_authentication",
          img: "/icons/plant.png",
          icon: "mdi-account-cog",
          name: this.$t("dashboardSection.plantations"),
          url: { name: "Plantation" },
          exact: true,
        },
        {
          id: "profile_authentication",
          img: "/icons/plant.png",
          icon: "mdi-account-cog",
          name: "Role Request",
          url: { name: "RoleRequest" },
          exact: false,
        },
        {
          id: "profile_authentication",
          img: "/icons/coffee.png",
          icon: "mdi-account-cog",
          name: this.$t("dashboardSection.coffeeData"),
          url: { name: "CoffeeData" },
          exact: false,
        },
        {
          id: "profile_authentication",
          img: "/icons/coffee.png",
          icon: "mdi-account-cog",
          name: this.$t("dashboardSection.coffeeData"),
          url: { name: "SurveyBuilder" },
          exact: true,
        },
        {
          id: "profile_authentication",
          img: "/icons/reports.png",
          icon: "mdi-account-cog",
          name: this.$t("reports.reports"),
          url: { name: "Reports" },
          exact: true,
        },
      ],
      // marketPlaces: {
      //   id: "marketplace",
      //   icon: "/icons/dashboard.png",
      //   name: this.$t("Marketplace"),
      //   route_path_name: "marketplace",
      //   subMenu: [
      //     {
      //       id: "marketplace_dashboard",
      //       icon: "/icons/dashboard.png",
      //       name: this.$t("Dashboard"),
      //       route_path_name: "marketplaceDashboard",
      //       parent_menu_id: "marketplace",
      //     },
      //     {
      //       id: "marketplace_sellers",
      //       img: "/icons/dashboard.png",
      //       icon: "/icons/dashboard.png",
      //       name: this.$t("Sellers"),
      //       route_path_name: "marketplaceSellers",
      //       parent_menu_id: "marketplace",
      //     },
      //     {
      //       id: "marketplace_category",
      //       img: "/icons/dashboard.png",
      //       icon: "/icons/dashboard.png",
      //       name: this.$t("Categories"),
      //       route_path_name: "marketplaceCategory",
      //       parent_menu_id: "marketplace",
      //     },
      //     {
      //       id: "marketplace_product",
      //       img: "/icons/dashboard.png",
      //       icon: "/icons/dashboard.png",
      //       name: this.$t("Products"),
      //       route_path_name: "marketplaceProducts",
      //       parent_menu_id: "marketplace",
      //     },
      //     {
      //       id: "marketplace_order",
      //       img: "/icons/dashboard.png",
      //       icon: "/icons/dashboard.png",
      //       name: this.$t("marketplace.orders.orders"),
      //       route_path_name: "marketplaceOrders",
      //       parent_menu_id: "marketplace",
      //     },
      //     {
      //       id: "marketplace_settings",
      //       img: "/icons/dashboard.png",
      //       icon: "/icons/dashboard.png",
      //       name: this.$t("Settings"),
      //       route_path_name: "marketplaceSettings",
      //       parent_menu_id: "marketplace",
      //     },
      //   ],
      // },
      esgPlatform: {
        id: "esg_platform",
        name: "ESG Platform",
        icon: "/icons/dashboard.png",
        route_path_name: "ESGPlatform",
        subMenu: [
          {
            id: "esg_platform_account_dashboard",
            icon: "/icons/dashboard.png",
            name: "ESG Dashboard",
            route_path_name: "esgAccountDashboard",
            parent_menu_id: "esg_platform",
          },
          {
            id: "esg_platform_protocols",
            icon: "/icons/dashboard.png",
            name: "My Protocol",
            route_path_name: "MyProtocols",
            parent_menu_id: "esg_platform",
          },
          {
            id: "esg_platform_standards",
            icon: "/icons/dashboard.png",
            name: this.$t("esgPlatform.standards"),
            route_path_name: "esgPlatformStandards",
            parent_menu_id: "esg_platform",
          },
          {
            id: "esg_platform_survey_builder",
            icon: "/icons/logs.png",
            name: "ESG Surey Builder",
            route_path_name: "ESGSurveyList",
            parent_menu_id: "esg_platform",
          },
          {
            id: "esg_platform_myproducts",
            icon: "/icons/dashboard.png",
            name: this.$t("esgPlatform.common.myProducts"),
            route_path_name: "esgMyProducts",
            parent_menu_id: "esg_platform",
          },
          {
            id: "esg_platform_progress",
            icon: "/icons/dashboard.png",
            name: this.$t("esgPlatform.progress.progress"),
            route_path_name: "esgPlatformProgress",
            parent_menu_id: "esg_platform",
          },
          {
            id: "esg_platform_guide",
            icon: "/icons/guide.png",
            name: "Guide",
            route_path_name: "esgGuide",
            parent_menu_id: "esg_platform",
          },
        ],
      },
      //carbon credit sub menu
      carbonCreditMenu: {
        id: "carbon_credit",
        name: "Carbon Credit",
        icon: "/icons/dashboard.png", // Use a placeholder or update with a specific icon if available
        route_path_name: "carbonCredit",
        subMenu: [
          {
            id: "carbon_credit_projects",
            name: "Projects",
            route_path_name: "listProjects",
            parent_menu_id: "carbon_credit",
          },
          {
            id: "carbon_credit_users",
            name: "Carbon Credit Users",
            route_path_name: "listUsers",
            parent_menu_id: "carbon_credit",
          },
          {
            id: "carbon_credit_plot_tree",
            name: "Plot Tree Mapping",
            route_path_name: "treePlotAdd",
            parent_menu_id: "carbon_credit",
          },
        ],
      },
      version: version,
    }
  },
  methods: {
    getActiveClass() {
      return isKenyaClient() ? "kenya-green" : "primary";
    },
    getLogo(drawer) {

      if(this.subOrg?.id) {
        if( this.subOrg?.logo) {
          return this.subOrg?.logo
        } else {
          return "/img/logod.png"
        }
      }
      else {
        if (drawer) {
        return this.organization && this.organization?.logo
          ? this.organization?.logo
          : "/img/logod.png"
      } else {
        return this.organization && this.organization?.logo
          ? this.organization?.logo
          : "/img/logo2.png"
      }
      }
    },
    getSublink(item) {
      if (item.id == "report_dashboard") {
        return {
          name: "DashboardReports",
        }
      } else if (
        item.parent_menu_id == "parent_dashboard" &&
        item.route_path_name != "Dashboard"
      ) {
        return {
          name: "ReportDetail",
          params: {
            type: item.label ? item.label.toLowerCase().replace(/ /g, "-") : "",
          },
        }
      } else if (
        item.parent_menu_id == "reports_parent" &&
        ![
          "land_suitability",
          "weather_analysis_report",
          "crop_health_report",
        ].includes(item.id)
      ) {
        return {
          name: "ReportDetail",
          params: {
            type: item.label ? item.label.toLowerCase().replace(/ /g, "-") : "",
          },
        }
      } else {
        return { name: item.route_path_name }
      }
    },
  },
}
</script>

<style scoped lang="scss">
// ::v-deep.v-list-item__title.xxx{
//     font-size: 0.6rem !important;
// }
.v-image__image--cover {
  max-width: 24px;
}

::v-deep .v-list-item--active.kenya-green {
  background-color: #009400 !important;
  color: white !important;
}

::v-deep .v-icon {
  color: #ffffff !important;
}
.app-sidebar {
  .v-navigation-drawer__content::-webkit-scrollbar {
    display: none;
  }

  .v-navigation-drawer__content {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
}

::v-deep [data-theme=indonesian] .v-icon.v-icon{
  color: white !important;
}
</style>

