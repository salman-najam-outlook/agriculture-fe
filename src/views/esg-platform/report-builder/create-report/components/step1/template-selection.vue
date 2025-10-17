<template>
  <v-card class="pa-4 mt-10" outlined>
    <div class="template-selection-root">
        <div class="header mb-6">
            <span class="text-h6 font-weight-bold">Select a Template</span>
        </div>
        <v-row>
            <!-- Create New Card -->
            <v-col cols="12" sm="6" md="4" lg="3">
                <v-card class="create-new-card d-flex flex-column align-center justify-center pa-8" outlined>
                    <v-icon size="96" color="grey lighten-1" class="mb-6">mdi-pencil-outline</v-icon>
                    <div class="text-h6 font-weight-medium mb-6">Create New</div>
                    <v-btn color="primary" class="start-now-btn" @click="createNewTemplate" rounded-lg>
                        Start Now
                    </v-btn>
                </v-card>
            </v-col>

            <!-- Template Cards -->
            <v-col v-for="template in templates" :key="template.id" cols="12" sm="6" md="4" lg="3">
                <v-card class="template-card template-card pa-4" outlined>
                    <div class="text-h6 font-weight-bold mb-2">{{ template.templateName }}</div>
                    <div class="mb-4">
                        <span class="font-weight-bold">Features:</span>
                        <ul class="features-list mt-2 mb-0">
                            <li v-for="(feature, idx) in template.sections" :key="idx" class="text-body-2 grey--text">
                                {{ feature.title }}
                            </li>
                        </ul>
                    </div>
                    <v-spacer></v-spacer>
                    <v-card-actions class="pa-4 d-flex justify-end items-end">
                        <v-btn v-for="action in actions" :key="action.name" :outlined="action.outlined"
                            :color="action.color" :class="action.class" small
                            @click.stop="handleAction(action, template)">
                            {{ action.label }}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </div>
  </v-card>
</template>

<script>
import EsgService from "../../../../../../_services/EsgService";

export default {
  name: 'TemplateSelection',
  props: {
    actions: {
      type: Array,
      default: () => [
        {
          name: 'preview',
          label: 'Preview',
          event: 'preview',
          outlined: true,
          color: 'primary',
          class: ' mr-2 font-weight-bold ',
          icon: 'mdi-eye',
          redirectURL: '/esg-platform/report-builder/preview-template'
        },
        {
          name: 'edit',
          label: 'Edit',
          event: 'edit',
          outlined: false,
          color: 'primary',
          class: ' font-weight-bold',
          icon: 'mdi-pencil',
          redirectURL: '/esg-platform/report-builder/edit-template'
        }
      ]
    }
  },
  async created() {
    const { data } = await EsgService.getEsgReportTemplates();
    this.templates = data;
  },
  methods: {
    createNewTemplate() {
      this.$router.push({ name: 'createNewTemplate' });
    },
    handleAction(action, template) {
      if (action.redirectURL) {
          this.$router.push(action.redirectURL);
      } else {
          this.$emit(action.event, template);
      }
    },
  },
};
</script>

<style scoped>

.template-card {
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    cursor: pointer;
}

.template-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 20px rgba(60, 60, 60, 0.1);
}
/* .template-selection-root {
  padding: 24px;
} */
.header {
  margin-bottom: 32px;
}

.create-new-card {
  min-height: 280px;
  border-radius: 18px;
  box-shadow: 0 2px 12px rgba(60,60,60,0.07);
}

.template-card {
  min-height: 280px;
  border-radius: 18px;
  box-shadow: 0 2px 12px rgba(60,60,60,0.07);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.features-list {
  padding-left: 18px;
}
.start-now-btn {
  min-width: 120px;
}
</style>