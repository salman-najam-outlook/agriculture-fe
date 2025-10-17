<template>
  <div>
    <v-card elevation="0" class="px-2 mb-4" :style="{ 'background-color': backgroundColor }">
      <div class="item-box pt-4">
        <label class="font-weight-bold" style="font-size: 20px;">
          {{ sectionTitle }}
        </label>
      </div>
      <v-row class="ml-1 mt-2 mr-2 align-center px-8" :style="{ 'background-color': '#117443', 'height': '50px' }">
        <label class="font-weight-bold" style="font-size: 16px; color: white;">
          {{ $t("esgPlatform.issues") }}
        </label>
      </v-row>
      <template>
        <div class="px-1 mt-6 mb-4" v-for="(issue, issueIndex) in issues" :key="issueIndex">
          <v-card class="mt-4 px-4" elevation="2">
            <!-- Issue header with move, edit, delete buttons -->
            <v-row align="center" class="px-2 py-1">
              <v-col cols="1" class="d-flex flex-column align-center ml-4 mb-1"
                style="max-height: 45px; height: 45px; max-width: 32px; overflow: hidden;">
                <v-btn icon small :color="issueIndex === 0 ? 'grey lighten-3' : 'black darken-2'"
                  style="max-height: 15px;" @click="moveIssueUp(issueIndex)" :disabled="issueIndex === 0">
                  <v-icon :color="issueIndex === 0 ? 'grey lighten-1' : 'black lighten-1'">
                    mdi-chevron-up
                  </v-icon>
                </v-btn>
                <v-btn icon small :color="issueIndex === 0 ? 'grey lighten-3' : 'black darken-2'"
                  style="max-height: 15px;" @click="moveIssueDown(issueIndex)"
                  :disabled="issueIndex === issues.length - 1">
                  <v-icon :color="issueIndex === issues.length - 1 ? 'grey lighten-1' : 'black lighten-1'">
                    mdi-chevron-down
                  </v-icon>
                </v-btn>
              </v-col>
              <v-col cols="10">
                <v-text-field v-if="issue.isEditing" v-model="issue.text" outlined dense hide-details
                  style="width: 200px;" class="ml-2"></v-text-field>
                <p v-else style="color: black; font-size: 14px; overflow: hidden; text-align: justify;">
                  {{ issue.text ? issue.text : '' }}
                </p>
              </v-col>
              <v-col cols="1" class="d-flex justify-end" style="gap: 5px;">
                <template v-if="issue.isEditing">
                  <v-btn icon style="color: #0EBF67;" @click="confirmEditIssue(issueIndex)">
                    <v-icon size="30">mdi-check-circle-outline</v-icon>
                  </v-btn>
                </template>
                <template v-else>
                  <v-btn icon style="color: #0EBF67;" outlined width="25" height="25" class="rounded-circle"
                    @click="startEditIssue(issueIndex)">
                    <v-icon size="20">mdi-pencil-outline</v-icon>
                  </v-btn>
                  <v-btn icon style="color: #0EBF67;" outlined width="25" height="25" class="rounded-circle ml-2"
                    @click="deleteIssue(issueIndex)">
                    <v-icon size="20">mdi-trash-can-outline</v-icon>
                  </v-btn>
                </template>
              </v-col>
            </v-row>
            <!-- Goals header -->
            <v-row class="mt-2 align-center pl-9 pr-9">
              <v-col cols="12">
                <v-card class="py-2" color="grey lighten-2" elevation="0">
                  <v-row class="d-flex align-center px-4">
                    <v-col xs="12" sm="5" class="font-weight-bold" style="color: black;">
                      {{ $t("esgPlatform.goals") }}
                    </v-col>
                    <v-col xs="12" sm="3" class="font-weight-bold text-center" style="color: black;">
                      {{ $t("esgPlatform.target") }}
                    </v-col>
                    <v-col xs="12" sm="2" class="font-weight-bold text-center" style="color: black;">
                      {{ $t("esgPlatform.questions") }}
                    </v-col>
                  </v-row>
                </v-card>
                <!-- Goals List -->
                <div v-for="(goal, goalIndex) in issue.goals" :key="goalIndex">
                  <v-row class="mt-2 align-center px-4">
                    <template v-if="!goal.isEditing">
                      <!-- Up/Down arrows column -->
                      <v-col xs="2" sm="1" class="d-flex flex-column align-center"
                        style="max-height: 45px; height: 45px; max-width: 32px; overflow: hidden;">
                        <v-btn icon small :color="goalIndex === 0 ? 'grey lighten-3' : 'black darken-2'"
                          style="max-height: 15px;" @click="moveGoalUp(issueIndex, goalIndex)"
                          :disabled="goalIndex === 0">
                          <v-icon :color="goalIndex === 0 ? 'grey lighten-1' : 'black lighten-1'">
                            mdi-chevron-up
                          </v-icon>
                        </v-btn>
                        <v-btn icon small :color="goalIndex === 0 ? 'grey lighten-3' : 'black darken-2'"
                          style="max-height: 15px;" @click="moveGoalDown(issueIndex, goalIndex)"
                          :disabled="goalIndex === issue.goals?.length - 1">
                          <v-icon :color="goalIndex === issue.goals?.length - 1 ? 'grey lighten-1' : 'black lighten-1'">
                            mdi-chevron-down
                          </v-icon>
                        </v-btn>
                      </v-col>
                      <!-- Goal title column -->
                      <v-col xs="12" sm="5">
                        <span class="goal-title"
                          style="color: black; font-size: 14px; white-space: pre-wrap; text-align: justify;">
                        {{ goal.title }}
                        </span>
                      </v-col>
                      <!-- Target year column centered -->
                      <v-col xs="12" sm="3" class="text-center">
                        <span>{{ goal.target ? goal.target : 0 }}</span>
                      </v-col>
                      <!-- Questions and Action Buttons column centered -->
                      <v-col xs="12" sm="2" class="d-flex align-center justify-space-between text-center px-6">
                        <v-col xs="12" sm="2" class="d-flex align-center justify-space-between text-center px-6">
                          <div class="d-flex align-center">
                            <span>{{ goal.noOfQuestions ? goal.noOfQuestions : 0 }}</span>
                            <img class="ml-2 cursor-pointer" src="/icons/icon-clipboard.svg"
                              style="width: 26px; height: 26px; border-radius: 50%;"
                              @click="navigateSurveyView(goal.surveyId, goal.title, goal.target)" />
                          </div>
                        </v-col>
                      </v-col>
                      <!-- Edit and Delete buttons column -->
                      <v-col xs="12" sm="1" class="d-flex justify-end">
                        <div class="d-flex">
                          <v-btn icon style="color: #0EBF67;" outlined width="25" height="25" class="rounded-circle"
                            @click="editGoal(issueIndex, goalIndex)">
                            <v-icon size="20">mdi-pencil-outline</v-icon>
                          </v-btn>

                          <v-btn icon style="color: #0EBF67;" outlined width="25" height="25"
                            class="rounded-circle ml-2" @click="deleteGoal(issueIndex, goalIndex)">
                            <v-icon size="20">mdi-trash-can-outline</v-icon>
                          </v-btn>
                        </div>
                      </v-col>
                    </template>
                    <template v-else>
                      <!-- Editing state for goal -->
                      <v-row class="mt-2 align-center px-3">
                        <v-col xs="2" sm="1" class="d-flex flex-column align-center"
                          style="max-height: 45px; height: 45px; max-width: 32px; overflow: hidden;">
                          <v-btn icon small color="grey lighten-1" style="max-height: 15px;">
                            <v-icon>mdi-chevron-up</v-icon>
                          </v-btn>
                          <v-btn icon small color="grey lighten-1" style="max-height: 15px;">
                            <v-icon>mdi-chevron-down</v-icon>
                          </v-btn>
                        </v-col>
                        <v-col xs="12" sm="5" class="d-flex align-center">
                          <v-textarea v-model="goal.title" label="Goal Title" hide-details outlined dense auto-grow
                            rows="1" style="min-height: 40px;"></v-textarea>
                          <!-- <v-card outlined class="mb-5 w-100 flex-grow-1">
                            <quill-editor
                              v-model="goal.title"
                              ref="quillEditor"
                              :options="quillOptions('Write goal title')"
                            />
                          </v-card> -->
                        </v-col>
                        <v-col xs="12" sm="3" class="d-flex align-center text-center">
                          <v-select v-model="goal.target" :items="availableYears" label="Target Year" outlined dense :search-input.sync="goal.target"
                            hide-details :rules="[
                              v => v !== null || 'Please select a target year',
                              v => parseInt(v) >= new Date().getFullYear() || 'Year must be in the future'
                            ]" style="min-height: 40px;"></v-select>
                        </v-col>
                        <v-col xs="12" sm="2" class="d-flex align-center text-center">
                          <v-btn icon color="green" @click="addQuestion(issueIndex, goalIndex)">
                            <v-icon>mdi-plus-circle</v-icon>
                          </v-btn>
                          <span class="ml-2">Add</span>
                        </v-col>
                        <v-btn icon style="color: #0EBF67;" @click="saveGoal(issueIndex, goalIndex)">
                          <v-icon size="30">mdi-check-circle-outline</v-icon>
                        </v-btn>
                      </v-row>
                    </template>
                  </v-row>
                </div>
                <!-- Add new goal button -->
                <v-row class="mt-2 px-8">
                  <v-col class="d-flex align-center">
                    <v-btn icon color="green" @click="addGoal(issueIndex)">
                      <v-icon style="color: #0EBF67;">mdi-plus-circle</v-icon>
                    </v-btn>
                    <span style="color: black; font-size: 14px">
                      {{ $t("esgPlatform.addNewGoal") }}
                    </span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card>
        </div>
        <!-- Adding a new Issue -->
        <div class="px-2 mt-8 mb-4" v-if="isAddingIssue">
          <v-card elevation="0">
            <v-row align="center" class="px-2 py-1 justify-space-between">
              <v-col class="d-flex flex-column align-center ml-4 mb-1"
                style="max-height: 45px; height: 45px; max-width: 32px; overflow: hidden;">
                <v-btn icon small color="grey lighten-1" style="max-height: 15px;">
                  <v-icon>mdi-chevron-up</v-icon>
                </v-btn>
                <v-btn icon small color="grey lighten-1" style="max-height: 15px;">
                  <v-icon>mdi-chevron-down</v-icon>
                </v-btn>
              </v-col>
              <v-text-field v-model="issueText" outlined dense hide-details style="width: 200px;"
                class="ml-2"></v-text-field>
              <v-col class="d-flex align-center" style="gap: 5px;">
                <v-btn icon style="color: #0EBF67;" @click="confirmIssue">
                  <v-icon size="30">mdi-check-circle-outline</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </div>
      </template>
      <!-- Button to add an issue -->
      <v-row>
        <v-btn class="ml-4 mt-2 mr-2 mb-4" color="primary" dark @click="addIssue">
          {{ $t("esgPlatform.addIssue") }}
        </v-btn>
      </v-row>
    </v-card>
    <AddSurvey :dialogI="openAddSurvey"
      :selected-survey="currentIssueIndex !== null && currentGoalIndex !== null ? issues[currentIssueIndex].goals[currentGoalIndex].surveyId : null"
      @closeModal="closeAddSurveyModal" @createNewSurvey="handleAddSurvey" @surveySelected="handleSurveySelected" />
  </div>
</template>

<script>
import AddSurvey from './addSurvey.vue';
import ESGService from "@/_services/EsgService";

export default {
  name: 'AddIssue',
  components: {
    AddSurvey
  },
  props: {
    sectionType: {
      type: String,
      default: 'environmental',
      validator: value => ['environmental', 'social', 'governance'].includes(value)
    },
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      openAddSurvey: false,
      editingGoal: null,
      isAddingIssue: false,
      issueText: '',
      selectedIssueIndex: null,
      selectedGoalIndexes: { issueIndex: null, goalIndex: null },
      currentIssueIndex: null,
      currentGoalIndex: null,
    };
  },
  computed: {
    backgroundColor() {
      const colors = {
        environmental: '#E4FFF2',
        social: '#E4FBFF',
        governance: '#FFF4E8'
      };
      return colors[this.sectionType];
    },
    sectionTitle() {
      return this.$t(`esgPlatform.${this.sectionType}`);
    },
    availableYears() {
      const currentYear = new Date().getFullYear();
      const years = [];
      for (let i = currentYear; i <= currentYear + 20; i++) {
        years.push(i.toString());
      }
      return years;
    },
    issues: {
      get() {
        return Array.isArray(this.value) ? this.value : [];
      },
      set(newIssues) {
        this.$emit('input', newIssues);
      }
    }
  },
  watch: {
    value: {
      handler(newValue) {
        this.issues = newValue;
      },
      deep: true
    },
    issues: {
      handler(newValue) {
        this.$emit('input', newValue);
      },
      deep: true
    }
  },
  methods: {
    quillOptions(placeholder) {
      return {
        theme: 'snow',
        placeholder,
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ header: [1, 2, 3, false] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ color: [] }, { background: [] }],
            ['clean']
          ]
        }
      }
    },
    addIssue() {
      this.isAddingIssue = true;
    },
    confirmIssue() {
      const trimmedText = this.issueText.trim();
      if (!trimmedText) {
        return;
      }
      const payload = {
        type: this.sectionType.charAt(0).toUpperCase() + this.sectionType.slice(1),
        title: trimmedText,
        order: this.issues.length + 1,
        protocolId: this.$route.params.id
      };
      this.$emit('create-issue', payload);
      this.isAddingIssue = false;
      this.issueText = '';
    },
    startEditIssue(index) {
      this.$set(this.issues[index], 'isEditing', true);
      this.$set(this.issues[index], 'originalText', this.issues[index].text);
    },
    confirmEditIssue(index) {
      const issue = this.issues[index];
      const newTitle = issue.text.trim();
      if (newTitle) {
        this.$emit('update-issue-title', {
          id: issue.id,
          title: newTitle
        });
        this.$set(this.issues[index], 'isEditing', false);
        delete this.issues[index].originalText;
      }
    },
    deleteIssue(index) {
      this.selectedIssueIndex = index;
      this.$emit('delete-issue', this.issues[index].id);
    },
    addGoal(issueIndex) {
      if (!this.issues[issueIndex]) {
        console.error('Issue not found at index:', issueIndex);
        return;
      }
      if (!this.issues[issueIndex].goals) {
        this.$set(this.issues[issueIndex], 'goals', []);
      }
      const currentYear = new Date().getFullYear();
      this.issues[issueIndex].goals.push({
        title: '',
        target: currentYear.toString(),
        noOfQuestions: 0,
        surveyId: null,
        completed: false,
        isEditing: true
      });
    },
    async saveGoal(issueIndex, goalIndex) {
      const goal = this.issues[issueIndex]?.goals[goalIndex];
      if (!goal || !goal.title.trim()) {
        this.$notify({
          type: "error",
          text: this.$t('esgPlatform.goalTitleRequired')
        });
        return;
      }

      const basePayload = {
        title: goal.title,
        targetYears: parseInt(goal.target),
        order: goalIndex,
        issueId: this.issues[issueIndex].id,
        ...(goal.surveyId && { esgAssessmentId: goal.surveyId })
      };
      if (!goal.id) {
        this.$emit('create-goal', basePayload, { issueIndex, goalIndex });
      } else {
        basePayload.id = goal.id;
        this.$emit('update-goal', basePayload);
      }
      this.$set(goal, 'isEditing', false);
    },
    editGoal(issueIndex, goalIndex) {
      const goal = this.issues[issueIndex]?.goals[goalIndex];
      if (!goal) {
        console.error('Goal not found at indices:', issueIndex, goalIndex);
        return;
      }

      if (typeof goal.target === 'number') {
        goal.target = goal.target.toString();
      }
      

      // Store original values before editing
      this.$set(goal, 'isEditing', true);
      this.$set(goal, 'originalTitle', goal.title);
      this.$set(goal, 'originalSurveyId', goal.surveyId);
      this.$set(goal, 'originalNoOfQuestions', goal.noOfQuestions || 0);

      // Ensure target is set properly for the dropdown
      if (goal.targetYears && !goal.target) {
        this.$set(goal, 'target', goal.targetYears);
      }
    },
    deleteGoal(issueIndex, goalIndex) {
      const goalId = this.issues[issueIndex]?.goals[goalIndex]?.id;
      if (!goalId) {
        // If the goal doesn't have an ID, it hasn't been saved to the server yet
        // Just remove it from the local array
        this.issues[issueIndex].goals.splice(goalIndex, 1);
        return;
      }

      // For existing goals, emit an event to delete from the server
      this.$emit('delete-goal', {
        goalId: goalId,
        issueIndex: issueIndex,
        goalIndex: goalIndex
      });
    },
    addQuestion(issueIndex, goalIndex) {
      // Store the current indices for use when the survey is selected
      this.currentIssueIndex = issueIndex;
      this.currentGoalIndex = goalIndex;

      // Store information about the goal we're adding a question to
      const goal = this.issues[issueIndex]?.goals[goalIndex];
      if (goal) {
        this.editingGoal = {
          issueIndex,
          goalIndex,
          originalSurveyId: goal.surveyId,
          originalNoOfQuestions: goal.noOfQuestions || 0
        };
      }

      // Open the survey selection dialog
      this.openAddSurvey = true;
    },
    closeAddSurveyModal() {
      this.openAddSurvey = false;

      // If we were in the process of editing a goal and canceled,
      // restore the original values if needed
      if (this.editingGoal && this.currentGoalIndex !== null && this.currentIssueIndex !== null) {
        const goal = this.issues[this.currentIssueIndex]?.goals[this.currentGoalIndex];
        // Only restore if no selection was made
        if (goal && !goal.surveyId) {
          this.$set(goal, 'surveyId', this.editingGoal.originalSurveyId);
          this.$set(goal, 'noOfQuestions', this.editingGoal.originalNoOfQuestions);
        }
      }

      // Reset state
      this.currentIssueIndex = null;
      this.currentGoalIndex = null;
      this.editingGoal = null;
    },
    handleAddSurvey() {
      this.openAddSurvey = false;
      this.$emit('add-survey', {
        issueIndex: this.currentIssueIndex,
        goalIndex: this.currentGoalIndex
      });
    },
    handleSurveySelected({ survey, questionCount }) {
      this.selectedSurvey = survey;
      if (!survey) {
        this.$notify({
          type: "error",
          text: this.$t('esgPlatform.surveySelectionRequired')
        });
        return;
      }
      const goal = this.issues[this.currentIssueIndex]?.goals[this.currentGoalIndex];
      if (!goal) {
        console.error('Goal not found');
        this.openAddSurvey = false;
        return;
      }

      this.$set(goal, 'surveyId', survey);
      this.$set(goal, 'noOfQuestions', questionCount || 0);
      this.openAddSurvey = false;
      this.currentIssueIndex = null;
      this.currentGoalIndex = null;
      this.editingGoal = null;
    },
    navigateSurveyView(surveyId, goalTitle, targetYear) {
      if (!surveyId) {
        console.error('No survey ID available to navigate to');
        this.$notify({
          type: "error",
          text: this.$t('esgPlatform.noSurveyAvailable')
        });
        return;
      }
      this.$emit('navigate-survey', surveyId, goalTitle, targetYear);
    },
    moveIssueUp(index) {
      if (index <= 0) return;
      const temp = this.issues[index];
      this.$set(this.issues, index, this.issues[index - 1]);
      this.$set(this.issues, index - 1, temp);
      this.updateIssueOrders();
    },
    moveIssueDown(index) {
      if (index >= this.issues.length - 1) return;
      const temp = this.issues[index];
      this.$set(this.issues, index, this.issues[index + 1]);
      this.$set(this.issues, index + 1, temp);
      this.updateIssueOrders();
    },
    updateIssueOrders() {
      // Update the order property of each issue
      this.issues.forEach((issue, index) => {
        issue.order = index + 1;
      });
      const payload = {
        issues: this.issues.map(issue => ({
          _id: issue.id,
          order: issue.order
        }))
      };
      this.$emit('reorder-issues', payload);
    },
    moveGoalUp(issueIndex, goalIndex) {
      if (goalIndex <= 0) return;
      const goals = this.issues[issueIndex].goals;
      const temp = goals[goalIndex];
      this.$set(goals, goalIndex, goals[goalIndex - 1]);
      this.$set(goals, goalIndex - 1, temp);
      this.updateGoalOrders(issueIndex);
    },
    moveGoalDown(issueIndex, goalIndex) {
      const goals = this.issues[issueIndex].goals;
      if (goalIndex >= goals.length - 1) return;
      const temp = goals[goalIndex];
      this.$set(goals, goalIndex, goals[goalIndex + 1]);
      this.$set(goals, goalIndex + 1, temp);
      this.updateGoalOrders(issueIndex);
    },
    updateGoalOrders(issueIndex) {
      // Update the order property of each goal
      const goals = this.issues[issueIndex].goals;
      goals.forEach((goal, index) => {
        goal.order = index + 1;
      });

      // Prepare payload for backend update
      const payload = {
        goals: goals.map(goal => ({
          _id: goal.id,
          order: goal.order
        }))
      };

      // Emit event to update orders on the server
      this.$emit('reorder-goals', payload);
    },
    async fetchStandardDetails() {
      const response = await ESGService.getEsgStandardDetails(this.$route.params.id);

      if (response.success) {
        this.issues = response.data.issues;
      } else {
        console.error('Failed to fetch standard details:', response.message);
      }
    }
  },

};
</script>

<style scoped>
/* When the screen is wider than 960px, hide any overflowing content in the goal title */
@media (min-width: 960px) {
  .goal-title {
    overflow: hidden;
  }
}
</style>