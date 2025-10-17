<template>
    <v-container>
      <v-dialog v-model="dialog" width="600" @click:outside="closeModal">
        <v-card rounded="0">
          <v-toolbar color="primary" class="white--text" flat>
            <v-toolbar-title class="font-weight-bold"> Add Pricing Slab </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon class="white--text" @click="closeModal">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-form
            autocomplete="off"
            @submit.prevent="addPriceSlab"
            ref="priceSlab"
            v-model="valid"
          >
            <v-card-text class="black--text">
              <v-row>
                <v-col cols="6">
                  <label class="title" for="name">Unit </label>
                  <v-text-field
                    outlined
                    dense
                    v-model.trim="price.unit"
                    :rules="priceRules.unit"
                    placeholder="Unit"
                  >
                  </v-text-field>
                </v-col>
                
              </v-row>
              <v-row>
                <v-col cols="6">
                  <label class="title" for="name">Quantity From</label>
                  <v-text-field
                    outlined
                    dense
                    v-model.trim="price.quantityFrom"
                    :rules="priceRules.quantityFrom"
                    placeholder="Quantity From"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="6">
                  <label class="title" for="name">Quantity To</label>
                  <v-text-field
                    outlined
                    dense
                    v-model.trim="price.quantityTo"
                    :rules="priceRules.quantityTo"
                    placeholder="Quantity To"
                  >
                  </v-text-field>
                </v-col>
            
              </v-row>

              <v-row>
                <v-col cols="6">
                  <label class="title" for="name">Price</label>
                  <v-text-field
                    outlined
                    dense
                    v-model.trim="price.price"
                    :rules="priceRules.price"
                    placeholder="Quantity From"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="6">
                  <label class="title" for="name">Promotion Price</label>
                  <v-text-field
                    outlined
                    dense
                    v-model.trim="price.promotion_price"
                    :rules="priceRules.promotionPrice"
                    placeholder="Quantity To"
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
            price:{
                unit:'',
                quantityFrom:'',
                quantityTo:'',
                price:'',
                promotion_price:'',
                weight_upto:12
            },
            priceRules:{
              unit:[
                (v) => !!v || 'Unit fields is required',
              ],
              quantityFrom:[
                (v) => !!v || 'Quantity from fields is required',
                (v) => v >= 0 || 'This field is number and not less than zero',
              ],
              quantityTo:[
                (v) => !!v || 'Quantity To fields is required',
                (v) => v >= 0 || 'This field is number and not less than zero',
              ], 
              price:[
                (v) => !!v || 'Price fields is required',
                (v) => v >= 0 || 'This field is number and not less than zero',
              ],
              promotionPrice:[
                (v) => !isNaN(v) || 'This is number field',
              ],
            },
            valid: true,
        }
     },
     methods:{
        closeModal(){
            this.$emit("closePriceSlabModal")
            setTimeout(()=>{this.$refs.priceSlab.reset()},500)
        },
        addPriceSlab(){
            if (!this.$refs.priceSlab.validate()) return;
            const formData = JSON.parse(JSON.stringify(this.price))
            formData["id"] = new Date().getTime()
            this.$emit("priceSlabData", formData)
            this.closeModal()
        }
     }
}
</script>