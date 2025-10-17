<template>
  <v-container>
    <v-dialog v-model="dialog" width="600" persistent>
      <v-card rounded="0">
        <v-toolbar color="primary" class="white--text" flat>
          <v-toolbar-title class="font-weight-bold"> Add Category </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon class="white--text" @click="closeModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-form autocomplete="off" @submit.prevent="addCategory" ref="category" v-model="valid">
          <v-card-text class="black--text">
            <v-row>
              <v-col cols="12">
                <v-radio-group v-model="categoryType" row>
                  <v-radio label="Main Category" value="main"></v-radio>
                  <v-radio label="Sub Category" value="sub"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
            <v-row v-if="categoryType === 'sub'">
              <v-col cols="12">
                <label class="title" for="name">Main Category</label>
                <v-autocomplete outlined dense :items="mainCategories" item-text="name" item-value="id"
                  v-model="category.mainCategory" :rules="categoryRules.main" placeholder="Make a selection" clearable>
                </v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <label class="title" for="name">Category Title</label>
                <v-text-field outlined dense v-model.trim="category.name" :rules="categoryRules.sub"
                  placeholder="Type here">
                </v-text-field>
              </v-col>
            </v-row>
            <v-row v-if="categoryType === 'main'">
              <v-col cols="8">
                <label class="title" for="name">Description</label>
                <v-textarea outlined dense v-model.trim="category.description">
                </v-textarea>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="6">
                <label class="title" for="name">Upload Images</label>
                <div class="file-input-wrapper">
                  <label class="custom-file-upload">
                    <span>{{ fileName || 'Browse' }}</span>
                    <input type="file"  accept="image/png, image/gif, image/jpeg, image/svg, image/svg+xml, image/webp" @change="handleFileChange" ref="fileInput" />
                  </label>
                  <img v-if="imageUrl" :src="imageUrl" class="uploaded-image" />
                </div>
              </v-col>
            </v-row>
            <v-card-actions class="mt-10">
              <v-spacer></v-spacer>
              <v-btn class="" outlined color="primary" @click="closeModal" width="112">
                {{ $t('cancel') }}
              </v-btn>
              <v-btn width="112" color="primary" type="submit" class="btn-11 btn-22">
                {{ $t('submit') }}
              </v-btn>
            </v-card-actions>
          </v-card-text>
        </v-form>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import marketplaceService from "@/_services/MarketplaceService";
import loadingMixin from "@/mixins/LoadingMixin";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(['getUser']),
  },
  created() {
    this.fetchCategoriesData()
  },
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    categoryType: {
      type: String,
      default: 'main'
    },
  },
  data() {
    return {
      category: {
        mainCategory: '',
        name: '',
        description: '',
        created_by: null,
        image: null,
      },

      fileName: '',
      imageUrl: '',
      mainCategories: [],
      categoryRules: {
        main: [
          (v) => !!v || this.$t('marketplace.category.mainCategoryFieldRequired'),
        ],
        sub: [
          (v) => !!v || this.$t('marketplace.category.categoryFieldRequired'),
        ],
      },
      valid: true,
    }
  },
  methods: {
    closeModal() {
      this.$emit("closeCategoryModal")
    },

    async fetchCategoriesData() {
      try {
        this.startLoading()
        const response = await marketplaceService.getCategoriesWithoutPagination();
        this.mainCategories = response
        this.stopLoading();
      } catch (error) {
        this.stopLoading();
        console.error('Error fetching categories:', error);
      }
    },

    async addCategory() {
      if(!this.$refs.category.validate()) return;
      this.category.created_by = Number(this.getUser.id);
      try {
        this.startLoading()
        let response = null;
        if (this.categoryType === 'main') {
          response = await marketplaceService.postCategory(this.category);
        } else {
          response = await marketplaceService.postSubCategory(this.category);
        }

        this.mainCategories = response.items
        this.stopLoading();
        this.closeModal();
      } catch (error) {
        this.stopLoading();
        console.error('Error fetching categories:', error);
      }
    },

    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.category.image = file;
        this.fileName = file.name;
        this.imageUrl = URL.createObjectURL(file);
      } else {
        this.file = null;
        this.fileName = '';
        this.imageUrl = '';
      }
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    }

  },
  mixins: [loadingMixin]
}
</script>

<style scoped>
.v-dialog {
  z-index: 9999;
}

.file-input-wrapper {
  display: flex;
  align-items: center;
  margin-top: 16px;
}

.custom-file-upload {
  display: flex;
  align-items: center;
  width: 100%;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  background-color: #f9f9f9;
  color: #333;
}

.custom-file-upload span {
  flex-grow: 1;
}

.custom-file-upload input[type="file"] {
  display: none;
}

.uploaded-image {
  width: 50px;
  height: 50px;
  margin-left: 10px;
  object-fit: cover;
  border-radius: 5px;
}
</style>