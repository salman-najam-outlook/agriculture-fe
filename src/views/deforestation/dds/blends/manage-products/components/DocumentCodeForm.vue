<template>
  <v-dialog v-model="dialog" max-width="500px" @click:outside="closeDialog">
    <v-card>
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title class="white--text">{{ $t('blends.manageProducts.addNewDocumentCode') }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-form ref="documentCodeForm" v-model="valid" lazy-validation>
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="12" class="pb-2">
              <label class="form-label">{{ $t('blends.manageProducts.documentCode') }}</label>
              <v-text-field :placeholder="$t('blends.manageProducts.enterHere')" v-model="documentCode" outlined dense
                :rules="[rules.required, rules.noEmptyString]"></v-text-field>
            </v-col>

            <v-col cols="12" class="pb-2">
              <label class="form-label">{{ $t('blends.manageProducts.title') }}</label>
              <v-text-field :placeholder="$t('blends.manageProducts.enterHere')" v-model="title" outlined dense
                :rules="[rules.required, rules.noEmptyString]"></v-text-field>
            </v-col>

            <v-col cols="12" class="pb-2">
              <label class="form-label">{{ $t('blends.manageProducts.description') }}</label>
              <v-textarea :placeholder="$t('blends.manageProducts.enterHere')" v-model="description" outlined dense
                rows="3" :rules="[rules.required, rules.noEmptyString]"></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn outlined color="primary" @click="closeDialog">
            {{ $t('blends.manageProducts.cancel') }}
          </v-btn>
          <v-btn color="primary" dark @click="saveDocumentCode">
            {{ $t('blends.manageProducts.save') }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      valid: false,
      documentCode: '',
      title: '',
      description: '',
      rules: {
        required: (v) => !!v || 'This field is required',
        noEmptyString: (v) => v && v.trim() !== '' || 'This field is required',
      },
    };
  },
  methods: {
    closeDialog() {
      this.$emit('close');
    },
    saveDocumentCode() {
      if (this.$refs.documentCodeForm.validate()) {
        this.$emit('save', {
          documentCode: this.documentCode,
          title: this.title,
          description: this.description,
        });
      }
    },
  },
};
</script>

<style scoped>
.v-card {
  border-radius: 8px;
}

.v-btn {
  font-weight: bold;
}
</style>
