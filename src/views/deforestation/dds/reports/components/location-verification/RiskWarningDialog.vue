<template>
  <v-dialog v-model="dialog" persistent max-width="800">
    <v-card>
      <v-toolbar color="primary" elevation="0">
        <v-toolbar-title class="white--text">{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="white" icon @click="continueWithAction(false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="pt-5 black--text">
        {{ message ? message : $t("areYouSureText") }}

        <div class="d-flex">
            <v-checkbox v-model="dontAskAgain" :label="this.$t('deforestation.dontShowWarning')">
            </v-checkbox>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click="continueWithAction(false)"
            outlined
          >
           {{ $t("resolveNow") }}
          </v-btn>
          <v-btn depressed color="primary" @click="continueWithAction(true)">
            {{$t('continue')}}
          </v-btn>
        </v-card-actions>
      </v-card-text>
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
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
        dontAskAgain: false,
    };
  },
  methods: {
    continueWithAction(action) {
        if(this.dontAskAgain){
            localStorage.setItem('hideRiskWarning', true);
        }
        this.$emit("continue:action", { action, dontAskAgain: this.dontAskAgain });
    },
  },
};
</script>
