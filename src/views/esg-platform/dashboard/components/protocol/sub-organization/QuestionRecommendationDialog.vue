<template>
  <v-dialog
    :value="value"
    @input="$emit('input', $event)"
    @click:outside="$emit('input', false)"
    @keydown.esc="$emit('input', false)"
    max-width="960px"
  >
    <v-card v-if="question">
      <v-card-title style="background-color: #117443; font-size: 0.875rem" class="white--text font-weight-bold">
        {{ $t('esgPlatform.viewQuestionsRecommendations') }}
        <v-spacer></v-spacer>
        <v-btn icon @click="$emit('input', false)" class="white--text">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="py-6 black--text">
        <div class="px-4 py-4 rounded-lg" style="background-color: #f2f2f2">
          <div class="font-weight-bold text-h6">
            {{ question.questionHeading.order }}.{{ question.order }} {{ question.title }}
          </div>

          <v-radio-group v-if="question.questionType === 'radio-button'" class="mt-3" value="1">
            <v-radio checked color="black" value="1" disabled>
              <template v-slot:label>
                <span class="black--text" style="font-size: 0.875rem">
                  {{ question.options.label }}
                </span>
              </template>
            </v-radio>
          </v-radio-group>
          <v-checkbox v-else checked v-model="value" disabled color="black">
            <template v-slot:label>
              <span class="black--text" style="font-size: 0.875rem">
                {{ question.options.label }}
              </span>
            </template>
          </v-checkbox>

          <div class="white px-3 py-3">
            <div class="font-weight-bold text-h6 mb-3 rounded-lg">{{ $t('esgPlatform.recommendations') }}</div>
            <ul style="font-size: 0.875rem; color: #353535">
              <li>
                <p>
                  {{ question.options.recommendation }}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" outlined @click="$emit('input', false)">{{ $t('cancel') }}</v-btn>
        <v-btn color="primary" @click="$emit('input', false)">{{ $t('close') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    question: {
      type: Object,
      required: false,
    },
  },
};
</script>
