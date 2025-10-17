<template>
    <v-container>
      <v-dialog v-model="dialog" width="600" @click:outside="closeModal">
        <v-card rounded="0">
          <v-toolbar color="primary" class="white--text" flat>
            <v-toolbar-title class="font-weight-bold"> Add Delivery Ratates </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon class="white--text" @click="closeModal">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-form
            autocomplete="off"
            @submit.prevent="addDeliveryRate"
            ref="deliveryRate"
            v-model="valid"
          >
            <v-card-text class="black--text">
              <v-row>
                <v-col cols="6">
                  <label class="title" for="name"> Weight Upto </label>
                  <v-text-field
                    outlined
                    dense
                    v-model.trim="deliveryRate.weight_upto"
                    :rules="deliveryRateRules.weightUpto"
                    placeholder="Weight upto"
                  >
                  </v-text-field>
                </v-col>
                
              </v-row>
              <v-row>
                <v-col cols="6">
                  <label class="title" for="name">Distance Upto</label>
                  <v-text-field
                    outlined
                    dense
                    v-model.trim="deliveryRate.distance_upto"
                    :rules="deliveryRateRules.distanceUpto"
                    placeholder="Distance Upto"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="6">
                  <label class="title" for="name">Price/KM</label>
                  <v-text-field
                    outlined
                    dense
                    v-model.trim="deliveryRate.price"
                    :rules="deliveryRateRules.priceKM"
                    placeholder="Price KM"
                  >
                  </v-text-field>
                </v-col>
              </v-row>

              <v-card-actions class="mt-10">
                <v-spacer></v-spacer>
                <v-btn
                  class=""
                  outlined
                  color="primary"
                  @click="closeModal"
                  width="112"
                >
                  {{ $t('cancel') }}
                </v-btn>
                <v-btn
                  width="112"
                  color="primary"
                  type="submit"
                  class="btn-11 btn-22"
                >
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
export default {
    props:{
        dialog:{
            type:Boolean,
            default:false
        }
    },
     data(){
        return {
            deliveryRate:{
                weight_upto:'',
                distanceUpto:'',
                price:'',
            },
            deliveryRateRules:{
              weightUpto:[
                (v) => !!v || 'Weight upto fields is required',
              ],
              distanceUpto:[
                (v) => !!v || 'DistanceUpto from fields is required',
              ],
              priceKM:[
                (v) => !!v || 'Price KM  fields is required',
                (v) => v >= 0 || 'This field is number and not less than zero',
              ], 
            },
            valid: true,
        }
     },
     methods:{
        closeModal(){
            this.$emit("closeDeliveryRateModal")
            setTimeout(()=>{this.$refs.deliveryRate.reset()},500)
        },
        addDeliveryRate(){
            if (!this.$refs.deliveryRate.validate()) return;
            const formData = JSON.parse(JSON.stringify(this.deliveryRate))
            formData["id"] = new Date().getTime()
            this.$emit("deliveryRateData", formData)
            this.closeModal()
        }
     }
}
</script>