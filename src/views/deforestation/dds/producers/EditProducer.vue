<template>
    <v-container>
      <template>
        <div>
          <v-dialog
            v-model="dialog"
            width="55%"
            @click:outside="closeModal"
            :retain-focus="false"
          >
            <v-card class="custom-card" rounded="0">
              <v-toolbar color="primary" class="white--text">
                <v-toolbar-title class="font-weight-bold">
                  Edit Producer 
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon class="white--text" @click="closeModal">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-toolbar>
              <v-form
                class="pa-4"
                ref="addNewProducer"
                lazy-validation
                autocomplete="off"
              >
                <v-card-text class="black--text">
                  <v-row>
                    <v-col :style="{ marginRight: '30px' }">
                      <label
                        >{{$t('firstName')}}</label
                      >
                      <v-text-field
                        outlined
                        dense
                        :rules="rules.firstName"
                        id="dialog-link"
                        v-model="producer.firstName"
                        placeholder="Enter First Name"
                      >
                      </v-text-field>
  
                      <label
                        >{{$t('email')}}</label
                      >
                      <v-text-field
                        outlined
                        dense
                        :rules="rules.email"
                        id="dialog-link"
                        v-model="producer.email"
                        placeholder="Enter Email"
                      >
                      </v-text-field>
  
                      <label for="country">{{
                          $t("country")
                        }}</label>
                      <v-autocomplete outlined dense v-model="producer.countryId" :items="countries" item-value="name"
                                      item-text="name" :rules="rules.country" :placeholder="$t('country')"
                                      return-object>
                        <template v-slot:item="slotProps">
                          <i :class="[
                                              'mr-2',
                                              'em',
                                              `em-flag-${slotProps.item.code.toLowerCase()}`,
                                          ]"></i>
                          {{
                            `${slotProps.item.name}`
                          }}
                        </template>
                        <template slot="selection" slot-scope="data">
                          <i :class="[
                                              'mr-2',
                                              'em',
                                              `em-flag-${data.item.code.toLowerCase()}`,
                                          ]"></i>
                          {{ `${data.item.name}` }}
                        </template>
                      </v-autocomplete>
  
                    </v-col>
                    <v-col :style="{ marginLeft: '30px' }">
                      <label
                      >{{$t("lastName")}}</label
                      >
                      <v-text-field
                          outlined
                          dense
                          :rules="rules.lastName"
                          id="dialog-link"
                          v-model="producer.lastName"
                          placeholder="Enter Last Name"
                      >
                      </v-text-field>
                      <label
                        >{{$t("memberDataSection.phoneNumber")}}</label
                      >
                      <v-text-field
                          v-model="producer.mobile"
                          :placeholder="$t('mobile')"
                          outlined
                          dense
                          :rules="rules.mobile"
                      >
                      </v-text-field>
  
  
                    </v-col>
                  </v-row>
  
                  <v-card-actions class="mt-10" style="padding-right: 0">
                    <v-spacer></v-spacer>
                    <v-btn
                      outlined
                      class="mr-2"
                      right
                      height="44"
                      width="116"
                      depressed
                      color="primary"
                      @click="closeModal"
                    >
                      {{ $t("cancel") }}
                    </v-btn>
  
                    <v-btn
                      class="mr-2"
                      right
                      height="44"
                      width="116"
                      depressed
                      color="primary"
                      @click="editProducerM()"
                    >
                      {{ $t("continue") }}
                    </v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-form>
            </v-card>
          </v-dialog>
        </div>
      </template>
    </v-container>
  </template>
  <script>
  import loadingMixin from "@/mixins/LoadingMixin";
  import { getCountries } from "country-state-picker";
  import generalMixin from "@/mixins/GeneralMixin";
  import DeforestationService from "@/_services/DeforestationService";
  export default {
    data() {
      return {
        countries:[],
        producer: {
          firstName: null,
          lastName:null,
          email: null,
          country: null,
          countryId:null,
          mobile:null,
          role:'producer',
          id:null
        },
        rules: {
          firstName: [
            v => !!v || this.$t('addEdituser.firstNameRequired'),
            v => /^[a-z0-9\s]+$/i.test(v) || this.$t('addEdituser.firstNameOllyAlpha'),
            v => (v && v.length <= 15) || this.$t('addEdituser.firstNameLimit'),
          ],
          lastName: [
            v => !!v || this.$t('addEdituser.lastNameRequired'),
            (v) => /^[a-z0-9\s]+$/i.test(v) || this.$t('addEdituser.lastNameOllyAlpha'),
            v => (v && v.length <= 15) || this.$t('addEdituser.lastNameLimit'),
          ],
          email: [
            v => !!v || this.$t('addEdituser.emailReuired'),
            v => /^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(v) || this.$t('addEdituser.emailInvalid'),
          ],
          mobile: [
            v => !!v || this.$t('addEdituser.mobileRequired'),
            v => this.validMobileNumber(v) || this.$t('addEdituser.invalidMobile'),
          ],
          country: [(v) => !!v || this.$t("addEdituser.countryRequired")],
        },
      };
    },
    computed: {
      dialog() {
        return this.dialogI;
      },
    },
    props: {
      dialogI: {
        type: Boolean,
        required: true,
      },
      item:{
        required:true,
        type:Object 
       }
    },
    created() {},
    mounted() {
        this.getCountry();
        this.producer.firstName = this.item.firstName
        this.producer.lastName = this.item.lastName
        this.producer.email = this.item.email
        this.producer.mobile = this.item.mobile
        this.producer.countryId = this.item.countryId
    },
    methods: {
      editProducerM() {
        console.log(this.producer)
        if(!this.$refs.addNewProducer.validate()) return;
        this.startLoading()
  
        this.producer.country = typeof this.producer.countryId == "object"? this.producer.countryId.name : this.producer.countryId;
        this.producer.countryCode = typeof this.producer.countryId == "object"? this.producer.countryId.dial_code : this.producer.dial_code;
        delete this.producer.countryId;


        this.producer.id = this.item.id
        const {firstName, lastName, email, mobile, id} = this.producer
        const producer = {
          firstName, 
          lastName, 
          email, 
          mobile, 
          countryId:this.producer.country,
          id:Number(id),
        }

        DeforestationService.editProducer(producer).then(res => {
            console.log(res)

            if(res?.data){
              this.$emit('userEdited',{
                success: true,
                message: res.message,
              });
            }
            else{
              const errorMessage =
              res?.errors?.[0]?.message || this.$t("dueDiligence.unExpectedErrorMsg");
                this.$notify({
                  type: "error",
                  text: errorMessage,
                });
            }
            this.closeModal();
            this.stopLoading()
        }).catch(err => {
          console.log(err)
          this.stopLoading()
        })
      },
      clearProducer(){
        this.producer.firstName=null
        this.producer.lastName=null
        this.producer.email=null
        this.producer.mobile=null
        this.producer.country=null
        this.producer.countryId=null
      },
      getCountryData() {},
      getCountry() {
        this.countries = getCountries();
      },
      closeModal() {
        this.$emit("closeModal");
        this.mode = "start";
      },
    },
    mixins: [loadingMixin,generalMixin],
  };
  </script>
  
  <style scoped lang="scss">
  .question-label {
    position: relative;
    width: 90%;
  }
  .question-input {
    width: 100px;
    position: absolute;
    right: 0;
    top: -9px;
  }
  </style>
  