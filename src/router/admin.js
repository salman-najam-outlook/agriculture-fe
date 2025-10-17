export default [
  {
    path: "/",
    component: () => import("../views/dashboard/Index.vue"),
    children: [
      {
        path: "enterprises",
        name: "Enterprises",
        component: () => import("../views/user/enterprises/Index.vue"),
      },
      {
        path: "enterprises/:id",
        name: "view-enterprises",
        component: () => import("../views/user/enterprises/view/Index.vue"),
      },

      {
        path: "create-enterprises",
        name: "create-enterprises",
        component: () => import("../views/user/enterprises/create/Index.vue"),
      },
      {
        path: "blends-history",
        name: "BlendsHistory",
        component: () =>
          import(
            "../views/deforestation/dds/blends/create-blend-dds/components/BlendsImportHistory.vue"
          ),
      },
      {
        path: "create-blends",
        name: "CreateBlends",
        component: () =>
          import(
            "../views/deforestation/dds/blends/create-blend-dds/create-blends.vue"
          ),
      },
      {
        path: "",
        name: "AdminDashboard",
        redirect: { name: "dashboard" },
        // component: () => import("../views/dashboard/NoPermission.vue"),
      },
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("../views/dashboard/Dashboard.vue"),
        meta: { module: "dashboard" },
      },
      {
        path: "dashboard/available-modules",
        name: "AvailableModules",
        component: () => import("../views/dashboard/AvailableModules.vue"),
        meta: { module: "user_listing" },
      },
      {
        path: "home",
        name: "Home",
        component: () => import("../views/dashboard-reports/Dashboard.vue"),
      },
      {
        path: "users/:type?",
        name: "Users",
        component: () => import("../views/user/UserList.vue"),
        meta: { module: "user_listing" },
      },
      {
        path: "upload/bulk-upload",
        name: "UserUpload",
        component: () => import("../views/user/UserBulkUpload.vue"),
        props: true,
      },
      // {
      //     path: 'departments',
      //     name: 'Departments',
      //     component: () => import("../views/roles/DepartmentList.vue")
      // },
      {
        path: "profile",
        name: "profile",
        component: () => import("../views/user/Profile.vue"),
      },
      {
        path: "profile-auth-settings",
        name: "ProfileAuthSet",
        component: () => import("../views/profile-auth/Settings.vue"),
        meta: { module: "profile_authentication" },
      },
      {
        path: "logs",
        name: "ActivityLogs",
        component: () => import("../views/log/LogList.vue"),
        meta: { module: "activity_log" },
      },
      // {
      //     path: 'permissions/:role_number?',
      //     name: 'Permissions',
      //     component: () => import("../views/roles/Permissions.vue")
      // },
      {
        path: "admin-permissions",
        name: "AdminPermissions",
        component: () => import("../views/admin-permissions/Permissions.vue"),
        meta: { module: "permissions" },
      },
      {
        path: "admin-roles",
        name: "AdminRoles",
        component: () => import("../views/roles/RoleList.vue"),
        meta: { module: "admin_roles" },
      },
      {
        path: "memberships",
        name: "MembershipTypes",
        component: () => import("../views/memberships/MembershipList.vue"),
        meta: { module: "membership" },
      },
      {
        path: "faq/:section?",
        name: "Faq",
        component: () => import("../views/faq/FaqTopics.vue"),
        meta: { module: "faq" },
      },
      {
        path: "tutorials",
        name: "TutorialManagement",
        component: () => import("../views/faq/TutorialManagement.vue"),
      },
      {
        path: "activation-key",
        name: "ActivationKey",
        component: () => import("../views/activation-key/Details.vue"),
        meta: { module: "activation" },
      },
      {
        path: "activation-key/list",
        name: "ActivationKeyList",
        component: () => import("../views/activation-key/KeyList.vue"),
        meta: { module: "activation" },
      },
      {
        path: "activation-key/uploadedfiles",
        name: "ActivationKeyFiles",
        component: () => import("../views/activation-key/UploadedFiles.vue"),
        meta: { module: "activation" },
      },
      {
        path: "activation-key/group/:groupId",
        name: "ActivationKeyGroupList",
        component: () => import("../views/activation-key/KeyGroupList.vue"),
        meta: { module: "activation" },
      },
      {
        path: "coming-soon",
        name: "ComingSoon",
        component: () => import("../views/ComingSoon.vue"),
      },
      {
        path: "notifications/list",
        name: "NotificationList",
        component: () => import("../views/notifications/NotificationList.vue"),
        meta: { module: "permissions", requiresAuth: false },
      },
      {
        path: "notifications/sent",
        name: "NotificationSent",
        component: () =>
          import("../views/notifications/NotificationListSent.vue"),
        meta: { module: "permissions" },
      },
      {
        path: "tickets",
        name: "Tickets",
        component: () => import("../views/tickets/Index.vue"),
          redirect: "/tickets/all-tickets", // Add this line
          children: [
            {
              path: "all-tickets",
              name: "ViewTickets",
              component: () => import("../views/tickets/ViewTickets.vue"),
            },
                {
            path: "logs/:id",
            name: "TicketLogs",
            component: () => import("../views/tickets/TicketLogs.vue"),
          
          },
        ]
      },
      {
        path: "coffee-data/specie",
        name: "CoffeeSpecie",
        component: () => import("../views/coffee/CoffeeSpecie.vue"),
        meta: { module: "coffee_data" },
      },
      {
        path: "coffee-data/variety",
        name: "CoffeeVariety",
        component: () => import("../views/coffee/CoffeeVariety.vue"),
        meta: { module: "coffee_data" },
      },
      {
        path: "coffee-data/tree/:tree?",
        name: "CoffeeData",
        component: () => import("../views/coffee/CoffeeList.vue"),
        meta: { module: "coffee_data" },
      },
      {
        path: "farm-management",
        name: "FarmManagement",
        component: () => import("../views/farm-management/Index.vue"),
        meta: { module: "member_data" },
        children: [
          {
            path: "farmers",
            component: () => import("../views/farm-management/Farmers.vue"),
            name: "Farmers",
          },
          {
            path: "farmers/:id",
            component: () =>
              import("../views/farm-management/FarmerDetail.vue"),
            name: "farmers_view",
          },
          {
            path: "farmers/view-all-farms/:id",
            component: () => import("../views/farm-management/ViewAllFarm.vue"),
            name: "view_all_farms",
          },
          {
            path: "farmers/farm-activity/:userId",
            component: () =>
              import("../views/farm-management/FarmActivity.vue"),
            name: "farm_activity",
          },
          {
            path: "farmers/show-on-maps/:farmId/:farmerId",
            component: () => import("../views/farm-management/MapView.vue"),
            name: "farmers_show_on_maps",
          },
          {
            path: "farms",
            component: () => import("../views/farm-management/Farms.vue"),
            name: "Farms",
          },
          {
            path: "farms/upload-validations",
            component: () =>
              import("../views/farm-management/FarmUploadValidations.vue"),
            name: "FarmUploadValidations",
          },
          {
            path: "farm/register",
            name: "FarmRegistartion",
            component: () =>
              import("../views/farm-management/FarmRegistration.vue"),
          },
          // {
          //   path: "farm/register",
          //   name: "FarmRegistartion",
          //   component: () =>
          //     import("../views/farm-management/FarmRegistration.vue"),
          // },

          {
            path: "edit-farm/:farmId",
            name: "EditFarms",
            component: () =>
              import("../views/farm-management/EditPrimaryFarm.vue"),
          },
          {
            path: "farm-info/:farmId/:tabId",
            name: "FarmInfo",
            component: () => import("../views/farm-management/FarmInfo.vue"),
          },

          {
            path: "zones/:id",
            name: "ZonesList",
            component: () =>
              import("../views/farm-management/zone/FarmZoneList.vue"),
          },
          {
            path: "add-zone",
            name: "FarmZones",
            component: () =>
              import("../views/farm-management/zone/FarmGeofenceZone.vue"),
          },
          {
            path: "edit-zone/:id",
            name: "FarmEditZone",
            component: () =>
              import("../views/farm-management/zone/FarmGeofenceZoneEdit.vue"),
          },
          {
            path: "zone-details/:id",
            name: "ZoneDetails",
            component: () =>
              import("../views/farm-management/zone/ZoneDetails.vue"),
          },
          {
            path: "farm_activities_calendar",
            name: "FarmCalenderActivities",
            component: () =>
              import("../views/farm-management/FarmCalenderActivities.vue"),
          },
          {
            path: "farm-activities",
            component: () =>
              import("../views/farm-management/FarmActivitiesCalendarView.vue"),
            name: "farm_activities",
          },
        ],
      },
      {
        path: "member-data",
        name: "MemberData",
        component: () => import("../views/member-data/Index.vue"),
        meta: { module: "member_data" },
        children: [
          {
            path: "buying-station",
            name: "BuyingStation",
            component: () =>
              import("../views/member-data/buying-station/BuyingStation.vue"),
          },
          {
            path: "buying-station/purchase-order/:id",
            name: "PurchaseOrderList",
            component: () =>
              import(
                "../views/member-data/buying-station/PurchaseOrderList.vue"
              ),
          },
          {
            path: "buying-station/processing-batch/:id",
            name: "ProcessingBatchList",
            component: () =>
              import(
                "../views/member-data/buying-station/ProcessingBatchList.vue"
              ),
          },
          {
            path: "manage-offline-farmers",
            name: "ManageOfflineFarmers",
            component: () =>
              import("../views/member-data/ManageOfflineFarmers.vue"),
          },
        ],
      },
      {
        path: "crops-overview",
        name: "CropsTraceOverview",
        component: () => import("../views/crops-overview/Index.vue"),
        meta: { module: "crops_overview" },
        children: [
          {
            path: "traceability",
            name: "CropsTraceOverviewTraceability",
            component: () =>
              import("../views/crops-overview/traceability/Index.vue"),
          },
        ],
      },
      {
        path: "coffee/buying-station",
        name: "CoffeeBuyingStation",
        component: () => import("../views/coffee/buying-station/BuyingStationList.vue"),
        meta: { module: "coffee_data" },
      },
      {
        path: "coffee/buying-station/:id",
        name: "buyingStation",
        component: () => import("../views/coffee/buying-station/BuyingStationDetails.vue"),
        meta: { module: "coffee_data" },
      },
      {
        path: "coffee/buying-station/:id/associated-farms",
        name: "associatedFarms",
        component: () => import("../views/coffee/buying-station/AssociatedFarms.vue"),
        meta: { module: "coffee_data" },
      },
      {
        path: "coffee/buying-station/:buyingStationId/create-farm",
        name: "createFarm",
        component: () => import("../views/farm-management/FarmRegistration.vue"),
        meta: { module: "coffee_data" },
      },
      {
        path: "coffee/buying-station/purchase-order/:id",
        name: "CoffeePurchaseOrderList",
        component: () =>
          import("../views/member-data/buying-station/PurchaseOrderList.vue"),
        meta: { module: "coffee_data" },
      },
      {
        path: "coffee/buying-station/processing-batch/:id",
        name: "CoffeeProcessingBatchList",
        component: () =>
          import("../views/member-data/buying-station/ProcessingBatchList.vue"),
        meta: { module: "coffee_data" },
      },
      {
        path: "/survey-builder",
        component: () => import("../views/survey-builder/Index.vue"),
        meta: { module: "survey_builder" },
        children: [
          {
            path: "",
            name: "SurveyBuilder",
            component: () => import("../views/survey-builder/SurveyList.vue"),
          },
          {
            path: ":id",
            name: "SingleSurveyList",
            component: () =>
              import("../views/survey-builder/SingleSurveyList.vue"),
          },
          {
            path: "download-survey-history/:id",
            name: "DownloadSurveyHistory",
            component: () =>
              import("../views/survey-builder/DownloadSurveyList.vue"),
          },
          {
            path: ":id/submitted",
            name: "SurveySubmitted",
            component: () =>
              import("../views/survey-builder/SurveySubmitted.vue"),
          },
        ],
      },
      {
        path: "plantation",
        name: "Plantation",
        component: () => import("../views/plantation/Index.vue"),
        meta: { module: "plantations" },
      },
      {
        path: "payments",
        name: "Payments",
        // component: () => import("../views/role-request/Index.vue"),
        meta: { module: "payments" },
      },
      {
        path: "role-request",
        name: "RoleRequest",
        component: () => import("../views/role-request/Index.vue"),
        meta: { module: "role_requests" },
      },
      {
        path: "reports",
        name: "Reports",
        component: () => import("../views/reports/Index.vue"),
        meta: { module: "reports" },
      },
      {
        path: "avocado",
        name: "Reports1",
        component: () => import("../views/oma/Index.vue"),
        meta: { module: "reports" },
        children: [
          {
            path: "land-suitability",
            name: "LandSuitibilityList",
            component: () =>
              import("../views/oma/land-suitability/LandSuitabilityList.vue"),
          },
          {
            path: "land-suitability/generate-and-view-report/:id?",
            name: "LandSuitibilityGenerateAndViewReport",
            component: () =>
              import(
                "../views/oma/land-suitability/GenerateReportAndViewReport.vue"
              ),
          },
          {
            path: "weather-analysis",
            name: "WeatherAnalysisList",
            component: () =>
              import("../views/oma/weather-analysis/WeatherAnalysisList.vue"),
          },
          {
            path: "weather-analysis/generate-report/:id?",
            name: "WeatherAnalysisGenerateReport",
            component: () =>
              import("../views/oma/weather-analysis/GenerateReport.vue"),
          },
          {
            path: "land-suitability-view",
            name: "LandSuitabilityView",
            component: () =>
              import("../views/oma/land-suitability/LandSuitabilityView.vue"),
          },
          {
            path: "satellite",
            name: "SatelliteReports",
            component: () => import("../views/reports/SatelliteReports.vue"),
          },
        ],
      },
      {
        path: "avocado-trees",
        component: () => import("../views/oma/Index.vue"),
        meta: { module: "avocado-trees" },
        children: [
          {
            path: "",
            name: "AvocadoTrees",
            component: () =>
              import("../views/avocado-trees/AvocadoTreeList.vue"),
          },
          {
            path: ":id",
            name: "SingleAvocadoTreeList",
            component: () =>
              import("../views/avocado-trees/SingleAvocadoTreeList.vue"),
          },
          {
            path: ":id/details",
            name: "AvocadoTreeDetail",
            component: () =>
              import("../views/avocado-trees/AvacadoTreeDetail.vue"),
          },
        ],
      },
      {
        path: "deforestation",
        component: () => import("../views/deforestation/Index.vue"),
        meta: { module: "deforestation" },
        children: [
          {
            path: "dds-profile",
            name: "DDSProfile",
            component: () => import("../views/deforestation/dds/Profile.vue"),
          },
          {
            path: "compliance-reports",
            name: "DeforestationComplianceReports",
            component: () =>
              import(
                "../views/deforestation/DeforestationComplianceReports.vue"
              ),
          },
          {
            path: "dispute-resolution",
            name: "DisputeResolution",
            component: () =>
              import(
                "../views/deforestation/dds/dispute-resolution/DisputeResolution.vue"
              ),
          },
          {
            path: "eudr-report/:id/:type",
            name: "EudrAssessmentReport",
            component: () =>
              import("../views/deforestation/components/AssessmentReport.vue"),
          },
          {
            path: "eudr-report-dds/:reportRequestId/:type",
            name: "EudrAssessmentReportDDS",
            component: () =>
              import(
                "../views/deforestation/components/AssessmentReportDDS.vue"
              ),
          },
          //Eudr certification
          {
            path: "certification",
            name: "ComplianceCertification",
            component: () =>
              import("../views/deforestation/ComplianceCertification.vue"),
          },
          {
            path: "certification-eudr-assement/:id",
            name: "ComplianceCertificationEudrAssessment",
            component: () =>
              import(
                "../views/deforestation/components/ComplainceAssessmentReport.vue"
              ),
          },
          {
            path: "shipment",
            name: "Shipment",
            component: () =>
              import("../views/deforestation/dds/shipping/ShippingList.vue"),
          },
          {
            path: "manage-farms",
            name: "ManageFarms",
            component: () =>
              import("../views/deforestation/dds/manage-farms/FarmList.vue"),
          },
          {
            path: "manage-products",
            name: "ManageProducts",
            component: () =>
              import(
                "../views/deforestation/dds/blends/manage-products/Products.vue"
              ),
          },
          {
            path: "manage-products/:productId?/sub-products",
            name: "ManageSubProducts",
            component: () =>
              import(
                "../views/deforestation/dds/blends/manage-products/SubProducts.vue"
              ),
            // props: true,
          },
          {
            path: "create-shipment",
            name: "shipmentCreate",
            component: () =>
              import("../views/deforestation/dds/shipping/CreateShipment.vue"),
          },
          {
            path: "shipment-detail/:id?",
            name: "shipmentDetail",
            component: () =>
              import("../views/deforestation/dds/shipping/ShipmentDetails.vue"),
          },
          {
            path: "due-diligence-dashboard",
            name: "dueDiligenceDashboard",
            component: () =>
              import("../views/deforestation/dds/dashboard/Index.vue"),
          },
          {
            path: "due-diligence-reports",
            name: "dueDiligenceReports",
            component: () =>
              import(
                "../views/deforestation/dds/reports/DueDeligenceReports.vue"
              ),
          },
          {
            path: "create-due-diligence-reports/:id?/:show?",
            name: "createDueDiligenceReports",
            component: () =>
              import(
                "../views/deforestation/dds/reports/CreateDueDiligenceReport.vue"
              ),
          },
          {
            path: "compliance-assessment/:id/mitigation",
            name: "complianceRiskMitigation",
            component: () =>
              import(
                "../views/deforestation/components/AssessmentRiskMitigation.vue"
              ),
          },
          {
            path: "risk-assessment-create",
            name: "rsk-create",
            component: () =>
              import("../views/deforestation/dds/RiskAssessment.vue"),
          },
          {
            path: "assessment-list",
            name: "AssessmentList",
            component: () =>
              import(
                "../views/deforestation/dds/assessment/AssessmentList.vue"
              ),
          },
          {
            path: "assessment-details/:id",
            name: "AssessmentDetails",
            component: () =>
              import(
                "../views/deforestation/dds/assessment/AssessmentDetails.vue"
              ),
          },
          {
            path: "producers",
            name: "Producers",
            component: () =>
              import("../views/deforestation/dds/producers/Index.vue"),
          },
          {
            path: "suppliers",
            name: "Suppliers",
            component: () =>
              import("../views/deforestation/dds/suppliers/Index.vue"),
          },
          {
            path: "operators",
            name: "Operators",
            component: () =>
              import("../views/deforestation/dds/operators/Index.vue"),
          },
          {
            path: "settings",
            name: "EUDRSettings",
            component: () =>
              import("../views/deforestation/dds/EUDRSettings.vue"),
          },
          // diligence guide
          {
            path: "due-diligence-guide",
            name: "dueDiligenceGuide",
            component: () =>
              import("../views/deforestation/dds/DiligenceGuide.vue"),
            meta: { requiresAuth: true },
          },
          {
            path: "view-dds-summary/:id",
            name: "ViewDDSSummary",
            component: () =>
              import("../views/deforestation/dds/reports/ViewDDSSummary.vue"),
          },

          {
            path: "exporter-summary-report/:id",
            name: "ExporterSummaryReport",
            component: () =>
              import("../views/deforestation/dds/reports/ExporterSummaryReport.vue"),
          },
          // Supplier module
          {
            path: "supplier-dashboard",
            name: "supplierDashboard",
            component: () =>
              import(
                "../views/deforestation/supplierModule/dashboard/index.vue"
              ),
          },
          {
            path: "supplier-profile",
            name: "supplierProfile",
            component: () =>
              import("../views/deforestation/supplierModule/profile.vue"),
          },
          {
            path: "supplier-due-diligence-reports",
            name: "supplierDueDiligenceReports",
            component: () =>
              import(
                "../views/deforestation/supplierModule/reports/DueDeligenceReports.vue"
              ),
          },
          {
            path: "supplier-farms",
            name: "supplierFarms",
            component: () =>
              import(
                "../views/deforestation/supplierModule/my-farms/Index.vue"
              ),
          },
          {
            path: "producer-list",
            name: "supplierProducers",
            component: () =>
              import(
                "../views/deforestation/supplierModule/producers/Index.vue"
              ),
          },

          // BLENDS ROUTES
          {
            path: "manage-products",
            name: "ManageProducts",
            component: () =>
              import(
                "../views/deforestation/dds/blends/manage-products/Products.vue"
              ),
          },
          {
            path: "manage-products/:productId?/sub-products",
            name: "ManageSubProducts",
            component: () =>
              import(
                "../views/deforestation/dds/blends/manage-products/SubProducts.vue"
              ),
            // props: true,
          },
          {
            path: "eudr-exempt-products",
            name: "EUDRExemptProducts",
            component: () =>
              import(
                "../views/deforestation/dds/blends/EUDR-exempt-products/Index.vue"
              ),
          },
          {
            path: "add-eudr-exempt-product/:id?",
            name: "AddEUDRExemptProduct",
            component: () =>
              import(
                "../views/deforestation/dds/blends/EUDR-exempt-products/Create.vue"
              ),
            props: true,
          },
          {
            path: "eudr-exempt-products/:id?/view",
            name: "ViewEUDRExemptProduct",
            component: () =>
              import(
                "../views/deforestation/dds/blends/EUDR-exempt-products/View.vue"
              ),
          },

          {
            path: "blends-list",
            name: "Blends",
            component: () =>
              import("../views/deforestation/dds/blends/BlendList.vue"),
          },
          {
            path: "blend-settings",
            name: "blendSettings",
            component: () =>
              import(
                "../views/deforestation/dds/blends/blend-settings/Index.vue"
              ),
          },
          {
            path: "create-blend-settings",
            name: "createBlendSettings",
            component: () =>
              import(
                "../views/deforestation/dds/blends/blend-settings/CreateBlendSettings.vue"
              ),
          },
          {
            path: "edit-blend-settings/:id",
            name: "editBlendSettings",
            component: () =>
              import(
                "../views/deforestation/dds/blends/blend-settings/CreateBlendSettings.vue"
              ),
          },
          {
            path: "import-blends",
            name: "importBlends",
            component: () =>
              import(
                "../views/deforestation/dds/blends/create-blend-dds/import-blend.vue"
              ),
          },
          {
            path: "create-blends/:id/final-report",
            name: "finalReport",
            component: () =>
              import(
                "../views/deforestation/dds/blends/create-blend-dds/final-report.vue"
              ),
          },
          {
            path: "create-blends/:id?/:previewMode?",
            name: "createBlend",
            component: () =>
              import(
                "../views/deforestation/dds/blends/create-blend-dds/create-blends.vue"
              ),
          },
          {
            path: "regional-risk-assessment",
            name: "regionalRiskAssessment",
            component: () =>
              import(
                "../views/deforestation/dds/regional-risk-assessment/IndexList.vue"
              ),
          },
          {
            path: "create-regional-risk-assessment",
            name: "createRegionalRiskAssessment",
            component: () =>
              import(
                "../views/deforestation/dds/regional-risk-assessment/CreateRegional.vue"
              ),
          },
          {
            path: "edit-regional-risk-assessment/:id",
            name: "editRegionalRiskAssessment",
            component: () =>
              import(
                "../views/deforestation/dds/regional-risk-assessment/CreateRegional.vue"
              ),
          },
          {
            path: "duplicate-regional-risk-assessment/:id",
            name: "duplicateRegionalRiskAssessment",
            component: () =>
              import(
                "../views/deforestation/dds/regional-risk-assessment/CreateRegional.vue"
              ),
          },
          {
            path: "summary-regional-risk-assessment",
            name: "summaryRegionalRiskAssessment",
            component: () =>
              import(
                "../views/deforestation/dds/reports/tabs/partials/RegionalRiskSummary.vue"
              ),
          },
        ],
      },

      {
        path: "dashboard-reports",
        component: () => import("../views/dashboard-reports/Index.vue"),
        meta: { module: "dashboard_reports" },
        children: [
          {
            path: "/",
            name: "DashboardReports",
            component: () => import("../views/dashboard-reports/Dashboard.vue"),
          },
          {
            path: ":type/detail",
            name: "ReportDetail",
            component: () =>
              import("../views/dashboard-reports/ReportDetail.vue"),
          },
          // {
          //   path: ":id/submitted",
          //   name: "SurveySubmitted",
          //   component: () => import("../views/survey-builder/SurveySubmitted.vue"),
          // }
        ],
      },
      {
        path: "traceability",
        name: "Traceability",
        component: () => import("../views/traceability/Index.vue"),
        meta: { module: "traceability" },
      },
      {
        path: "green-beans",
        name: "Green beans",
        component: () => import("../views/green-beans/Index.vue"),
        meta: { module: "green-beans" },
      },
      {
        path: "/green-beans/:greenBeanId",
        name: "Green Bean Lot",
        component: () => import("../views/green-beans/GreenBeanLot.vue"),
        meta: { module: "faq" },
      },
      {
        path: "cacao",
        component: () => import("../views/cacao/Index.vue"),
        meta: { module: "cacao" },
        children: [
          {
            path: "plantation",
            name: "CacaoPlantation",
            component: () =>
              import("../views/cacao/plantation/PlantationList.vue"),
          },
          {
            path: "cacao-data",
            name: "cacaoData",
            component: () =>
              import("../views/cacao/cacao-data/CacaoDataList.vue"),
          },
          {
            path: "dry-cacao",
            name: "dryCacao",
            component: () =>
              import("../views/cacao/cacao-data/CacaoDataList.vue"),
          },
          {
            path: "traceability",
            name: "traceability",
            component: () => import("../views/cacao/traceability/Index.vue"),
          },
          // add route for buy sell overview
          {
            path: "buy-sell-overview",
            name: "BuySellOverview",
            component: () =>
              import("../views/cacao/buy-sell/BuySellOverview.vue"),
          },
          {
            path: "buy-sell-overview/:id",
            name: "BuySellOverviewDetail",
            component: () =>
              import("../views/cacao/buy-sell/BuySellFarmDetail.vue"),
            props: true,
          },
        ],
      },
      {
        path: "oma-reports",
        component: () => import("../views/cacao/Index.vue"),
        meta: { module: "oma-reports" },
        children: [
          {
            path: "weather-analysis",
            name: "WeatherAnalysis",
            component: () =>
              import("../views/cacao/plantation/PlantationList.vue"),
          },
          {
            path: "satellite",
            name: "SatelliteReports",
            component: () => import("../views/reports/SatelliteReports.vue"),
          },
          {
            path: "satellite/:id",
            name: "SatelliteDetailReports",
            component: () =>
              import("../views/reports/SatelliteDetailReport.vue"),
          },
        ],
      },
      {
        path: "download-history",
        name: "DownloadHistory",
        component: () => import("../views/notifications/DownloadHistory.vue"),
      },

      // ========= MARKETPLACE ROUTES ===========
      {
        path: "/marketplace",
        component: () => import("../views/marketplace/index.vue"),
        meta: { module: "marketplace", requiresAuth: false },
        children: [
          {
            path: "dashboard",
            name: "marketplaceDashboard",
            component: () => import("../views/marketplace/dashboard.vue"),
          },
          {
            path: "sellers",
            name: "marketplaceSellers",
            component: () => import("../views/marketplace/sellers.vue"),
          },
          {
            path: "categories",
            name: "marketplaceCategory",
            component: () => import("../views/marketplace/category.vue"),
          },
          {
            path: "/category/:id",
            component: () => import("../views/marketplace/sub-category.vue"),
            name: "sub-category",
          },
          {
            path: "products",
            name: "marketplaceProducts",
            component: () => import("../views/marketplace/products/index.vue"),
          },
          {
            path: "products/add/:id?/:step?",
            name: "marketplaceProductsAdd",
            component: () =>
              import("../views/marketplace/products/add-product.vue"),
          },
          {
            path: "orders",
            name: "marketplaceOrders",
            component: () => import("../views/marketplace/orders.vue"),
          },
          {
            path: "orders/:id",
            name: "marketplaceOrderDetails",
            component: () =>
              import("../views/marketplace/components/orders/orderDetails.vue"),
          },
          {
            path: "settings",
            name: "marketplaceSettings",
            component: () => import("../views/marketplace/settings.vue"),
          },
        ],
      },

      // ========= ESG-PLATFORM ROUTES ===========
      {
        path: "/esg-platform",
        name: "esgPlatform",
        component: () => import("../views/esg-platform/index.vue"),
        meta: { module: "esg-platform", requiresAuth: false },
        children: [
          {
            path: "standards",
            name: "esgPlatformStandards",
            component: () =>
              import("../views/esg-platform/standards/standardList.vue"),
          },
          {
            path: "create-esg-standard",
            name: "createEsgStandard",
            component: () =>
              import("../views/esg-platform/standards/createEsgStandard.vue"),
          },
          {
            path: "esg-my-products",
            name: "esgMyProducts",
            component: () =>
              import("../views/esg-platform/my-products/Products.vue"),
          },
          {
            path: "esg-dashboard/:type?",
            name: "esgAccountDashboard",
            component: () =>
              import("../views/esg-platform/dashboard/AccountDashboard.vue"),
          },
          {
            path: "guide",
            name: "esgGuide",
            component: () =>
              import("../views/esg-platform/guide/Guide.vue"),
          },
          {
            path: "esg-reports-builder",
            name: "esgReportsBuilder",
            component: () =>
              import("../views/esg-platform/report-builder/index.vue"),
          },
          {
            path: "manage-template",
            name: "manageTemplate",
            component: () =>
              import(
                "../views/esg-platform/report-builder/manage-template/index.vue"
              ),
          },
          {
            path: "create-new-esg-report",
            name: "createNewEsgReport",
            component: () =>
              import(
                "../views/esg-platform/report-builder/create-report/index.vue"
              ),
          },
          {
            path: "preview-esg-standard/:id",
            name: "previewEsgStandard",
            component: () =>
              import("../views/esg-platform/standards/createEsgStandard.vue"),
          },
          {
            path: "edit-esg-standard/:id",
            name: "editEsgStandard",
            component: () =>
              import("../views/esg-platform/standards/createEsgStandard.vue"),
          },
          {
            path: "progress",
            name: "esgPlatformProgress",
            component: () =>
              import("../views/esg-platform/progress/progressList.vue"),
          },
          {
            path: "survey-list",
            name: "ESGSurveyList",
            component: () =>
              import("../views/esg-platform/survey-builder/SurveyList.vue"),
          },
          {
            path: "survey-details/:id/:goalTitle?/:targetYear?",
            name: "ESGSurveyDetails",
            component: () =>
              import("../views/esg-platform/survey-builder/SurveyDetails.vue"),
          },
          {
            path: "esg-standard-protocol/:id?",
            name: "esgStandardProtocol",
            component: () =>
              import("../views/esg-platform/dashboard/StandardProtocol.vue"),
          },
          {
            path: "start-esg-protocol/:id",
            name: "startEsgProtocol",
            component: () =>
              import(
                "../views/esg-platform/esg-protocol/EsgProtocolDetail.vue"
              ),
            props: true,
          },
          {
            path: "protocol-farmer-detail/:id",
            name: "protocolFarmerDetail",
            component: () =>
              import(
                "../views/esg-platform/progress/farmer/protocolDetail.vue"
              ),
            props: true,
          },
          {
            path: "survey-overview/:id1/:id2",
            name: "surveyOverview",
            component: () =>
              import("../views/esg-platform/survey-builder/surveyOverview.vue"),
            props: true,
          },
          {
            path: "survey-overview-response/:id1/:id2",
            name: "surveyOverviewResponse",
            component: () =>
              import(
                "../views/esg-platform/survey-builder/components/surveyOverviewResponse.vue"
              ),
            props: true,
          },
          {
            path: "protocols",
            name: "MyProtocols",
            component: () =>
              import("../views/esg-platform/esg-protocol/Protocols.vue"),
          },
          {
            path: "protocol-details/:id",
            name: "ProtocolDetails",
            component: () =>
              import(
                "../views/esg-platform/dashboard/components/protocol/ProtocolDetails.vue"
              ),
          },
          {
            path: "progress-by-goals/:id",
            name: "ProgressByGoals",
            component: () =>
              import(
                "../views/esg-platform/dashboard/components/protocol/ProgressByGoals.vue"
              ),
          },
          {
            path: "protocol-message/:id?",
            name: "ProtocolMessage",
            component: () =>
              import(
                "../views/esg-platform/dashboard/components/protocol/ProtocolMessage.vue"
              ),
          },
          {
            path: "validation-data/:id",
            name: "validationData",
            component: () =>
              import(
                "../views/esg-platform/esg-protocol/components/ValidationData.vue"
              ),
          },
          {
            path: "protocol-details/message/:protocolId/:subOrganizationId?",
            name: "ProtocolMessagesOfSubOrganization",
            component: () =>
              import(
                "../views/esg-platform/dashboard/components/protocol/ProtocolMessage.vue"
              ),
          },
          {
            path: "protocol-details/:id/:subOrganizationId",
            component: () =>
              import(
                "../views/esg-platform/dashboard/components/protocol/sub-organization/ProtocolDetails.vue"
              ),
            children: [
              {
                path: "",
                name: "ProtocolDetailsOfSubOrganization",
                component: () =>
                  import(
                    "../views/esg-platform/dashboard/components/protocol/sub-organization/IssuesAndGoals.vue"
                  ),
              },
              {
                path: "recommendations",
                name: "ProtocolRecommendationsOfSubOrganization",
                component: () =>
                  import(
                    "../views/esg-platform/dashboard/components/protocol/sub-organization/ProtocolRecommendation.vue"
                  ),
              },
            ],
          },
          {
            path: "survey-response/:goalId",
            name: "SurveyResponse",
            component: () =>
              import("../views/esg-platform/survey-builder/SurveyResponse.vue"),
            props: true,
          },
        ],
      },

      // ========= CARBON-CREDIT ROUTES ===========
      {
        path: "/carbon-credit",
        name: "carbonCredit",
        component: () => import("../views/carbon-credit/index.vue"),
        meta: { module: "carbon-credit", requiresAuth: true },
        children: [
          {
            path: "projects",
            name: "listProjects",
            component: () =>
              import('../views/carbon-credit/projects/List.vue'),
          },
          {
            path: "projects/register/:id?",
            name: "registerProject",
            component: () =>
              import("../views/carbon-credit/projects/Register.vue"),
          },
          {
            path: 'projects/view/:id',
            name: 'viewProject',
            component: () => import('../views/carbon-credit/projects/View.vue')
          },

          {
            path: "plot-tree-mapping",
            name: "plotTreeMapping",
            component: () => import("../views/carbon-credit/plot-tree-mapping/PlotTreeMapping.vue"),
          },

          {
            path: "plot-tree-mapping/:id",
            name: "viewPlotTreeMapping",
            component: () => import("../views/carbon-credit/plot-tree-mapping/PlotTreeMappingView.vue"),
          },

          {
            path: "plot-details/:id",
            name: "plotDetails",
            component: () => import("../views/carbon-credit/plot-tree-mapping/PlotDetails.vue"),
          },
          {
            path: "plot-tree-mapping-assignee/:id",
            name: "plotTreeMappingAssignee",
            component: () => import("../views/carbon-credit/plot-tree-mapping/PlotTreeMappingAssignee.vue"),
          },
          {
            path: 'tree-plot-add/:id?',
            name: 'treePlotAdd',
            component: () => import('../views/carbon-credit/plot-tree-mapping/AddPlotTree.vue')
          },
          {
            path: 'plot-location/:id?',
            name: 'plotLocation',
            component: () => import('../views/carbon-credit/plot-tree-mapping/PlotLocation.vue')
          },
          {
            path: 'farm-location',
            name: 'ChooseFarmLocation',
            component: () => import('../views/carbon-credit/plot-tree-mapping/FarmLocation.vue')
          },
          {
            path: 'projects/preview/:id',
            name: 'projectInfo',
            component: () => import('../views/carbon-credit/projects/ProjectPreview.vue')
          },
          
          {
            path: 'tree-plot-add',
            name: 'treePlotAdd',
            component: () => import('../views/carbon-credit/plot-tree-mapping/AddPlotTree.vue')
          },
          {
            path: 'users',
            name: 'listUsers',
            component: () => import('../views/carbon-credit/users/List.vue')
          },
          {
            path: 'users/view/:id',
            name: 'userDetails',
            component: () => import('../views/carbon-credit/users/UserDetails.vue')
          },
          {
            path: 'users/farm-submission/:farmId',
            name: 'FarmSubmission',
            component: () => import('../views/carbon-credit/users/components/FarmSubmission.vue'),
            props: true
          }
        ]
      },
      {
        path: '/approval-flow',
        name: 'approvalFlow',
        component: () => import('../views/deforestation/dds/approval-flow/index.vue'),
        meta: { module: 'approval-flow', requiresAuth: true },
        children: [
          {
            path: 'home',
            name: 'dashboard',
            component: () => import('../views/deforestation/dds/approval-flow/Dashboard/index.vue'),
          },
          {
            path: 'approval-dashboard',
            name: 'approvalDashboard',
            component: () => import('../views/deforestation/dds/approval-flow/ApprovalDashboard.vue'),
          },
          {
            path: 'eudr-due-diligence-reports',
            name: 'dds_root_due_diligence_report',
            component: () => import('../views/deforestation/dds/approval-flow/AdminDueDiligenceReport.vue'),
          },
          {
            path: 'view-summary-report/:id',
            name: 'viewSummaryReport',
            component: () => import('../views/deforestation/dds/approval-flow/ViewSummaryReport.vue'),
          },
          {
            path: 'settings',
            name: 'root_settings',
            component: () => import('../views/deforestation/dds/approval-flow/settings.vue'),
          },
          {
            path: 'shipment-details/:id',
            name: 'approvalShipmentDetails',
            component: () => import('../views/deforestation/dds/approval-flow/shipment/ViewShipmentDetails.vue'),
          },
          {
            path: 'cooperatives',
            name: 'root_cooperatives',
            component: () => import('../views/deforestation/dds/approval-flow/cooperatives/CorporativeList.vue'),
          },
          {
            path: 'cooperatives/view/:id',
            name: 'viewCooperative',
            component: () => import('../views/deforestation/dds/approval-flow/cooperatives/components/CorporativeDetails.vue'),
          }
        ]
      }
    ],
  },
];
