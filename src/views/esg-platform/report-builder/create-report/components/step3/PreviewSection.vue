<template>
  <div>
    <div
      v-for="(section, sIdx) in sections"
      :key="sIdx"
      class="mb-10"
      :style="getSectionStyle(section)"
    >
      <div v-if="section.title" class="preview-section-title">
        {{ section.title }}
      </div>
      <div>
        <component
          v-for="(block, bIdx) in section.blocks"
          :key="bIdx"
          :is="getComponent(block.type)"
          :block="block"
          :heading-size="section.headingSize"
          preview
        />
      </div>
    </div>
  </div>
</template>

<script>
import HeadingBlock from '../step2/BlockTypes/HeadingBlock.vue';
import ParagraphBlock from '../step2/BlockTypes/ParagraphBlock.vue';
import ImageBlock from '../step2/BlockTypes/ImageBlock.vue';
import TableBlock from '../step2/BlockTypes/TableBlock.vue';
import StakeholdersBlock from '../step2/BlockTypes/StakeholdersBlock.vue';
import EsgProgressLineChartBlock from '../step2/BlockTypes/EsgProcessLineChartBlock.vue';
import EsgScorecardBlock from '../step2/BlockTypes/EsgScorecardBlock.vue';

export default {
  name: 'PreviewSection',
  props: {
    sections: {
      type: Array,
      required: true
    }
  },
  components: {
    HeadingBlock,
    ParagraphBlock,
    ImageBlock,
    TableBlock,
    StakeholdersBlock,
    EsgProgressLineChartBlock,
    EsgScorecardBlock
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
    getSectionStyle(section) {
      const settings = section.settings || {};
      return {
        backgroundColor: settings.backgroundColor || '#fff',
        color: settings.fontColor || '#000',
        fontFamily: settings.font || 'inherit',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        padding: '32px',
      };
    }
  }
};
</script>

<style scoped>
.preview-section-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}
</style>