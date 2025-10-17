<template>
  <v-row>
    <v-card rounded="lg" elevation="3" class="mx-auto pa-3" max-width="220" max-height="200">
      <v-list-item class="mb-3">
        <v-img src="/img/marketplace/dashboard/categories.svg" max-height="300" max-width="40" class="mr-4"></v-img>
        <v-list-item-content>
          <v-list-item-title class="text-h6 font-weight-medium">
            {{ $t('marketplace.dashboard.categories') }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <div class="d-flex flex-row justify-space-around">
        <v-col>
          <div class="text-body-2">
            {{ $t('marketplace.dashboard.main') }}
          </div>
          <span class="text-body-2 grey--text">
            {{ dashboard.categories.main || 0 }}
          </span>
        </v-col>
        <v-col>
          <div class="text-body-2">
            {{ $t('marketplace.dashboard.subcategories') }}
          </div>
          <span class="text-body-2 grey--text">
            {{ dashboard.categories.subcategories || 0 }}
          </span>
        </v-col>
      </div>
      <v-card-actions>
        <v-btn color="primary" class="px-4 py-2 font-weight-medium view-all-btn" elevation="0" small
          @click="$router.push('/marketplace/categories')">
          {{ $t('marketplace.dashboard.viewAll') }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card rounded="lg" elevation="3" class="mx-auto pa-3" max-width="220" max-height="200">
      <v-list-item class="mb-3">
        <v-img src="/img/marketplace/dashboard/sellers.svg" max-height="300" max-width="40" class="mr-4"></v-img>
        <v-list-item-content>
          <v-list-item-title class="text-h6 font-weight-medium">
            {{ $t('marketplace.dashboard.sellers') }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <div class="d-flex flex-row justify-space-around">
        <v-col>
          <div class="text-body-2">
            {{ $t('marketplace.dashboard.active') }}
          </div>
          <span class="text-body-2 grey--text">
            {{ dashboard.sellers.active || 0 }}
          </span>
        </v-col>
        <v-col>
          <div class="text-body-2">
            {{ $t('marketplace.dashboard.inactive') }}
          </div>
          <span class="text-body-2 grey--text">
            {{ dashboard.sellers.inactive || 0 }}
          </span>
        </v-col>
      </div>
      <v-card-actions>
        <v-btn color="primary" class="px-4 py-2 font-weight-medium view-all-btn" elevation="0" small
          @click="$router.push('/marketplace/sellers')">
          {{ $t('marketplace.dashboard.viewAll') }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card rounded="lg" elevation="3" class="mx-auto pa-3" max-width="220" max-height="200">
      <v-list-item class="mb-3">
        <v-img src="/img/marketplace/dashboard/products.svg" max-height="300" max-width="40" class="mr-4"></v-img>
        <v-list-item-content>
          <v-list-item-title class="text-h6 font-weight-medium">
            {{ $t('marketplace.dashboard.products') }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <div class="d-flex flex-row justify-space-around">
        <v-col>
          <div class="text-body-2">
            {{ $t('marketplace.dashboard.active') }}
          </div>
          <span class="text-body-2 grey--text">
            {{ dashboard.products.active || 0 }}
          </span>
        </v-col>
        <v-col>
          <div class="text-body-2">
            {{ $t('marketplace.dashboard.inactive') }}
          </div>
          <span class="text-body-2 grey--text">
            {{ dashboard.products.inactive || 0 }}

          </span>
        </v-col>
      </div>
      <v-card-actions>
        <v-btn color="primary" class="px-4 py-2 font-weight-medium view-all-btn" elevation="0" small
          @click="$router.push('/marketplace/products')">
          {{ $t('marketplace.dashboard.viewAll') }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card rounded="lg" elevation="3" class="mx-auto pa-3" max-width="220" max-height="200">
      <v-list-item class="mb-3">
        <v-img src="/img/marketplace/dashboard/orders.svg" max-height="300" max-width="40" class="mr-4"></v-img>
        <v-list-item-content>
          <v-list-item-title class="text-h6 font-weight-medium">
            {{ $t('marketplace.dashboard.orders') }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <div class="d-flex flex-row justify-space-around">
        <v-col>
          <div class="text-body-2">
            {{ $t('marketplace.dashboard.active') }}
          </div>
          <span class="text-body-2 grey--text">
            {{ dashboard.orders.active || 0 }}
          </span>
        </v-col>
        <v-col>
          <div class="text-body-2">
            {{ $t('marketplace.dashboard.completed') }}
          </div>
          <span class="text-body-2 grey--text">
            {{ dashboard.orders.completed || 0 }}
          </span>
        </v-col>
      </div>
      <v-card-actions>
        <v-btn color="primary" class="px-4 py-2 font-weight-medium view-all-btn" elevation="0" small
          @click="$router.push('/marketplace/orders')">
          {{ $t('marketplace.dashboard.viewAll') }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card rounded="lg" elevation="3" class="mx-auto pa-3 d-flex flex-column justify-space-between" max-width="220"
      max-height="200">
      <v-list-item class="mb-3">
        <v-img src="/img/marketplace/dashboard/settings.svg" max-height="300" max-width="40" class="mr-4"></v-img>
        <v-list-item-content>
          <v-list-item-title class="text-h6 font-weight-medium">
            {{ $t('marketplace.dashboard.settings') }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-card-actions>
        <v-btn color="primary" class="px-4 py-2 font-weight-medium view-all-btn" elevation="0" small
          @click="$router.push('/marketplace/settings')">
          {{ $t('marketplace.dashboard.viewAll') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-row>
</template>
<script>
export default {
  props: {
    dashboard: {
      type: Object,
      required: true
    }
  },
  data() {
    return {};
  },
};
</script>
