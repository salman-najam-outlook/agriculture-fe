<template>
  <v-card v-if="!preview" class="section-item mb-6">
    <!-- Section Header -->
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="section-title">{{ section.title || `Section ${index + 1}` }}</span>
      <div class="d-flex align-center">
        <v-btn icon fab small class="primary" @click="showSettings = true">
          <v-icon color="white">mdi-cog</v-icon>
        </v-btn>
        <v-btn icon fab small class="ml-2 red" @click="$emit('delete-section', index)">
          <v-icon color="white">mdi-trash-can</v-icon>
        </v-btn>
      </div>
    </v-card-title>

    <!-- Section Blocks -->
    <v-card-text>
      <component
        v-for="(block, bIdx) in section.blocks"
        :key="bIdx"
        :is="getComponent(block.type)"
        :block="block"
        :heading-size="section.headingSize"
        @update="updateBlock(bIdx, $event)"
        @delete="deleteBlock(bIdx)"
      />
      <!-- Add Block Button -->
      <v-btn text class="mt-3 outline-0" @click="showBlockDialog = true">
        <v-icon fab color="white" class="primary text-black rounded-circle mr-3">mdi-plus</v-icon> Add Block
      </v-btn>
    </v-card-text>

    <AddBlockDialog v-model="showBlockDialog" @save="addBlock" />
    <SectionSettingsDialog v-model="showSettings" :settings.sync="section.settings" />
  </v-card>
  <div v-else class="pa-6" :style="sectionStyle" >
    <component
        v-for="(block, bIdx) in section.blocks"
        :key="bIdx"
        :is="getComponent(block.type)"
        :block="block"
        :preview="preview"
        :heading-size="section.headingSize"
        @update="updateBlock(bIdx, $event)"
        @delete="deleteBlock(bIdx)"
      />
  </div>
</template>

<script>
import AddBlockDialog from './SectionEditorDialog.vue';
import SectionSettingsDialog from './SectionSettingDialog.vue';
import HeadingBlock from './BlockTypes/HeadingBlock.vue';
import ParagraphBlock from './BlockTypes/ParagraphBlock.vue';
import ImageBlock from './BlockTypes/ImageBlock.vue';
import TableBlock from './BlockTypes/TableBlock.vue';
import StakeholdersBlock from './BlockTypes/StakeholdersBlock.vue';
import EsgProgressLineChartBlock from './BlockTypes/EsgProcessLineChartBlock.vue';
import EsgScorecardBlock from './BlockTypes/EsgScorecardBlock.vue';


export default {
  name: 'SectionItem',
  props: {
    section: Object,
    index: Number,
    preview: {
      type: Boolean,
      default: false
    },
  },
  components: {
    AddBlockDialog,
    SectionSettingsDialog,
    HeadingBlock,
    ParagraphBlock,
    ImageBlock,
    TableBlock,
    StakeholdersBlock,
    EsgProgressLineChartBlock,
    EsgScorecardBlock
  },
  data() {
    return {
      showBlockDialog: false,
      showSettings: false
    };
  },
  computed: {
    sectionStyle() {
      const settings = this.section.settings || {};
      return {
        backgroundColor: settings.backgroundColor || '#fff',
        color: settings.fontColor || '#000',
        fontFamily: settings.font || 'inherit'
      };
    }
  },
  methods: {
    getComponent(type) {
      return {
        heading: 'HeadingBlock',
        paragraph: 'ParagraphBlock',
        image: 'ImageBlock',
        table: 'TableBlock',
        stakeholders: 'StakeholdersBlock',
        esgProgressLineChart: 'EsgProgressLineChartBlock',
        esgScorecard: 'EsgScorecardBlock',
      }[type];
    },
    addBlock(newBlock) {
      this.section.blocks.push(newBlock);
    },
    deleteBlock(i) {
      this.section.blocks.splice(i, 1);
    },
    updateBlock(i, newBlock) {
      this.$set(this.section.blocks, i, newBlock);
    }
  }
};
</script>

<style scoped>
.section-title {
  font-size: 20px;
  font-weight: bold;
}
</style>
