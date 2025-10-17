<template>
    <div>
        <breadcrumb v-if="showBreadcrumb" :items="breadcrumbs"></breadcrumb>
        <v-container fluid>
            <div v-if="currentPage && showTitleAndButton" class="d-flex mb-4">
                <h2>{{ isEditPage ? $t('blends.blendSettings.updateBlend') : $t('blends.blendSettings.addBlend') }}</h2>
                <v-spacer></v-spacer>
                <div class="d-flex mt-1">
                    <v-btn color="primary" outlined class="mr-2" @click="redirectListPage">
                        {{ $t('blends.blendSettings.cancel') }}
                    </v-btn>
                    <v-btn v-if="isEditPage" :color="isEditPage ? 'primary' : 'primary'" dark class="mr-2"
                        @click="handleConfirmationDialog">
                        {{ $t('blends.blendSettings.save') }}
                    </v-btn>
                    <v-btn v-else :color="isEditPage ? 'primary' : 'primary'" dark class="mr-2"
                        @click="handleConfirmationDialog">
                        {{ $t('blends.blendSettings.createBlend') }}
                    </v-btn>
                </div>
            </div>
            <v-form ref="createBlendSettings" @submit.prevent="createBlend" autocomplete="off">
                <v-card elevation="0">
                    <v-card class="mb-5" flat>
                        <v-card-text>
                            <v-row class="pl-2 mb-2">
                                <v-col sm="12">

                                    <v-toolbar-title class="font-weight-bold">
                                        {{ $t('blends.blendSettings.generalData') }}
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon class="icon-with-background primary--text mx-2" style="color:#0EBF67"
                                                    v-bind="attrs" v-on="on">
                                                    mdi-alert-circle
                                                </v-icon>
                                            </template>
                                            <span>{{ $t('blends.blendSettings.generalDataTT') }}</span>
                                        </v-tooltip>
                                    </v-toolbar-title>
                                </v-col>
                            </v-row>


                            <v-row class="pl-3">
                                <v-col :class="colClass63">
                                    <div class="item-box">
                                        <label for="autoLogOff" class="text-subtitle-1 font-weight-bold">
                                            {{ $t('blends.blendSettings.blendTitle') }}
                                        </label>
                                        <v-tooltip top color="00BD73" max-width="350">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon class="icon-with-background primary--text" size="medium" style="color:#0EBF67; margin-bottom: 5px;"
                                                    v-bind="attrs" v-on="on">
                                                    mdi-alert-circle
                                                </v-icon>
                                            </template>
                                            <span>{{ $t("blends.blendSettings.blendTitleTT") }}</span>
                                        </v-tooltip>
                                        <v-text-field dense v-model="blendSettings.title"
                                            :rules="blendSettingsRules.title" required
                                            :placeholder="$t('blends.blendSettings.enterHere')" outlined></v-text-field>
                                    </div>
                                </v-col>
                                <v-col :class="colClass63">
                                    <div class="item-box">
                                        <label for="autoLogOff" class="text-subtitle-1 font-weight-bold"> {{
                                            $t('blends.blendSettings.blendCode') }}
                                        </label>
                                        <v-tooltip top color="00BD73" max-width="350">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon class="icon-with-background primary--text" size="medium" style="color:#0EBF67; margin-bottom: 5px;"
                                                    v-bind="attrs" v-on="on">
                                                    mdi-alert-circle
                                                </v-icon>
                                            </template>
                                            <span>{{ $t("blends.blendSettings.blendCodeTT") }}</span>
                                        </v-tooltip>
                                        <v-text-field dense v-model="blendSettings.code"
                                            :rules="blendSettingsRules.code" required
                                             @input="fieldErrors.blendCode = null"
                                            :error-messages="fieldErrors.blendCode ? [fieldErrors.blendCode] : []"
                                            ref="blendCode"
                                            :placeholder="$t('blends.blendSettings.enterHere')" outlined></v-text-field>
                                    </div>
                                </v-col>




                            </v-row>
                            <v-row class="pl-3">
                                <v-col cols="6" class="py-0">
                                    <label for="text">
                                        {{ $t("blends.blendSettings.blendDescription") }}
                                    </label>
                                    <v-tooltip top color="00BD73" max-width="350">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon class="icon-with-background primary--text" size="medium" style="color:#0EBF67; margin-bottom: 5px;" v-bind="attrs"
                                                v-on="on">
                                                mdi-alert-circle
                                            </v-icon>
                                        </template>
                                        <span>{{ $t("blends.blendSettings.blendDescriptionTT") }}</span>
                                    </v-tooltip>
                                    <v-textarea name="input-7-1" class="v-textarea--outlined" auto-grow outlined
                                    :rules="blendSettingsRules.desc" required
                                        :placeholder="$t('blends.blendSettings.enterHere')"
                                        v-model="blendSettings.desc"></v-textarea>
                                </v-col>
                            </v-row>
                            <v-row class="pl-3">
                                <v-col :class="colClass63">
                                    <div class="item-box">
                                        <label for="autoLogOff" class="text-subtitle-1 font-weight-bold"> {{
                                            $t('blends.blendSettings.finalProductName') }}
                                        </label>
                                        <v-tooltip top color="00BD73" max-width="350">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon class="icon-with-background primary--text" size="medium" style="color:#0EBF67; margin-bottom: 5px;"
                                                    v-bind="attrs" v-on="on">
                                                    mdi-alert-circle
                                                </v-icon>
                                            </template>
                                            <span>{{ $t("blends.blendSettings.finalProductNameTT") }}</span>
                                        </v-tooltip>
                                        <v-text-field dense v-model="blendSettings.finalProductName"
                                            :rules="blendSettingsRules.finalProductName" required
                                            :placeholder="$t('blends.blendSettings.finalProductName')"
                                            outlined></v-text-field>
                                    </div>
                                </v-col>
                                <v-col :class="colClass63">
                                    <div class="item-box">
                                        <label for="autoLogOff" class="text-subtitle-1 font-weight-bold"> {{
                                            $t('blends.blendSettings.finalProductCode') }}
                                        </label>
                                        <v-tooltip top color="00BD73" max-width="350">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-icon class="icon-with-background primary--text" size="medium" style="color:#0EBF67; margin-bottom: 5px;"
                                                    v-bind="attrs" v-on="on">
                                                    mdi-alert-circle
                                                </v-icon>
                                            </template>
                                            <span>{{ $t("blends.blendSettings.finalProductCodeTT") }}</span>
                                        </v-tooltip>
                                        <v-text-field dense v-model="blendSettings.finalProductCode"
                                            :rules="blendSettingsRules.finalProductCode" required
                                            @input="fieldErrors.finalProductCode = null"
                                            ref="finalProductCode"
                                            :error-messages="fieldErrors.finalProductCode ? [fieldErrors.finalProductCode] : []"
                                            :placeholder="$t('blends.blendSettings.finalProductCode')"
                                            outlined></v-text-field>
                                    </div>
                                </v-col>
                            </v-row>
                            <!-- <v-row class="pl-3">
                                <v-col :class="colClass63">
                                    <div class="item-box">
                                        <label for="autoLogOff" class="text-subtitle-1 font-weight-bold"> {{
                                            $t('blends.blendSettings.processType') }}
                                            <v-tooltip top color="00BD73" max-width="350">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-icon class="icon-with-background primary--text" size="medium" style="color:#0EBF67; margin-bottom: 5px;"
                                                        v-bind="attrs" v-on="on">
                                                        mdi-alert-circle
                                                    </v-icon>
                                                </template>
                                                <span>{{ $t("blends.blendSettings.processTypeTT") }}</span>
                                            </v-tooltip>
                                        </label>
                                        <v-autocomplete item-text="name" item-value="value" :items="processType" dense
                                            v-model="blendSettings.processType" :rules="blendSettingsRules.processType"
                                            required :placeholder="$t('blends.blendSettings.processType')"
                                            outlined></v-autocomplete>
                                    </div>
                                </v-col>
                            </v-row> -->
                        </v-card-text>
                    </v-card>
                </v-card>

                <v-card class="mb-5" flat>
                    <v-card-text>
                        <v-row class="pl-2 mb-2">
                            <v-col sm="12">
                                <v-toolbar-title class="font-weight-bold">
                                    {{ $t('blends.blendSettings.finalProductLotIdGen') }}
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon class="icon-with-background primary--text mx-2" style="color:#0EBF67"
                                                v-bind="attrs" v-on="on">
                                                mdi-alert-circle
                                            </v-icon>
                                        </template>
                                        <span>{{ $t('blends.blendSettings.finalProductLotIdGenTT') }}</span>
                                    </v-tooltip>
                                </v-toolbar-title>
                            </v-col>
                        </v-row>
                        <v-row>
                            <!-- First Dropdown -->
                            <v-col :class="colClass43">
                                <v-col class="gray-color">
                                    <div class="item-box" style="overflow: hidden;">
                                        <label for="autoLogOff"
                                            class="text-subtitle-1 font-weight-bold d-flex justify-space-between mb-2">
                                            {{ $t('blends.blendSettings.selectType') }}
                                        </label>
                                        <v-autocomplete background-color="white" item-text="name" item-value="value"
                                            :items="selectTypeOptions1" dense v-model="blendSettings.selectType"
                                            :rules="blendSettingsRules.selectType" required
                                            :placeholder="$t('blends.blendSettings.selectType')" outlined
                                            @change="onSelectTypeChange('selectType')"></v-autocomplete>

                                        <!-- Conditional Text Field for Start Count -->
                                        <div
                                            v-if="blendSettings.selectType === 'Incremental Number' || blendSettings.selectType === 'Static Text'">
                                            <label for="autoLogOff"
                                                class="text-subtitle-1 font-weight-bold d-flex justify-space-between mb-2">
                                                {{ blendSettings.selectType === 'Incremental Number'
                                                    ? $t('blends.blendSettings.startCount')
                                                    : $t('blends.blendSettings.enterHere') }}
                                            </label>
                                            <v-text-field v-if="blendSettings.selectType === 'Incremental Number'"
                                                background-color="white" dense :rules=[requiredRule]
                                                v-model="blendSettings.startCount"
                                                type="number"
                                                :placeholder="$t('blends.blendSettings.0001')" outlined></v-text-field>
                                            <v-text-field v-else background-color="white" dense :rules=[requiredRule]
                                                v-model="blendSettings.staticText"
                                                :placeholder="$t('blends.blendSettings.enterHere')"
                                                outlined></v-text-field>
                                        </div>

                                        <!-- Reset Checkbox -->
                                        <v-checkbox
                                            v-if="blendSettings.selectType === 'Incremental Number' && showResetCheckbox"
                                            :label="$t('blends.blendSettings.resetCounterEach') + ' ' + blendSettings.selectTypeII"
                                            v-model="blendSettings.resetCount" class="mt-2"></v-checkbox>
                                    </div>
                                </v-col>
                            </v-col>

                            <!-- Separator Dropdown -->
                            <v-col :class="colClass43">
                                <v-col>
                                    <div class="item-box" style="overflow: hidden;">
                                        <label for="autoLogOff"
                                            class="text-subtitle-1 font-weight-bold d-flex justify-space-between mb-2">
                                            {{ $t('blends.blendSettings.selectSeparator') }}
                                        </label>
                                        <v-autocomplete item-text="name" item-value="value" :items="selectSeparator"
                                            dense v-model="blendSettings.selectSeparator"
                                            :rules="blendSettingsRules.selectSeparator" required
                                            :placeholder="$t('blends.blendSettings.selectSeparator')"
                                            outlined></v-autocomplete>
                                    </div>
                                </v-col>
                            </v-col>

                            <!-- Second Dropdown -->
                            <v-col :class="colClass43">
                                <v-col class="gray-color">
                                    <div class="item-box" style="overflow: hidden;">
                                        <label for="autoLogOff"
                                            class="text-subtitle-1 font-weight-bold d-flex justify-space-between mb-2">
                                            {{ $t('blends.blendSettings.selectType') }}
                                        </label>
                                        <v-autocomplete background-color="white" item-text="name" item-value="value"
                                            :items="selectTypeOptions2" dense v-model="blendSettings.selectTypeII"
                                            :rules="blendSettingsRules.selectType" required
                                            :placeholder="$t('blends.blendSettings.selectType')" outlined
                                            @change="onSelectTypeChange('selectTypeII')"></v-autocomplete>

                                        <!-- Conditional Text Field -->
                                        <div
                                            v-if="blendSettings.selectTypeII === 'Incremental Number' || blendSettings.selectTypeII === 'Static Text'">
                                            <label for="autoLogOff"
                                                class="text-subtitle-1 font-weight-bold d-flex justify-space-between mb-2">
                                                {{ blendSettings.selectTypeII === 'Incremental Number'
                                                    ? $t('blends.blendSettings.startCount')
                                                    : $t('blends.blendSettings.enterHere') }}
                                            </label>
                                            <v-text-field v-if="blendSettings.selectTypeII === 'Incremental Number'"
                                                background-color="white" dense :rules=[requiredRule]
                                                v-model="blendSettings.startCount"
                                                type="number"
                                                :placeholder="$t('blends.blendSettings.0001')" outlined></v-text-field>
                                            <v-text-field v-else background-color="white" dense :rules=[requiredRule]
                                                v-model="blendSettings.staticText"
                                                :placeholder="$t('blends.blendSettings.enterHere')"
                                                outlined></v-text-field>
                                        </div>

                                        <v-checkbox
                                            v-if="blendSettings.selectTypeII === 'Incremental Number' && showResetCheckbox"
                                            :label="$t('blends.blendSettings.resetCounterEach') + ' ' + blendSettings.selectType"
                                            v-model="blendSettings.resetCount" class="mt-2"></v-checkbox>
                                    </div>
                                </v-col>
                            </v-col>
                        </v-row>
                        <v-row class="pl-2 mb-2">
                            <v-col :class="colClass63">
                                <div class="item-box">
                                    <label for="autoLogOff" class="text-subtitle-1 font-weight-bold"> {{
                                        $t('blends.blendSettings.previewLotId') }}
                                    </label>
                                    <v-text-field dense :value="generatedLotId" disabled outlined
                                        :placeholder="$t('blends.blendSettings.previewLotId')"></v-text-field>
                                </div>
                            </v-col>
                        </v-row>

                    </v-card-text>
                </v-card>
                <v-card class="mb-5" flat>


                    <v-card-text>
                        <!-- Blend Product title  -->
                        <v-row class="pl-2 mb-2">
                            <v-col sm="12">
                                <v-toolbar-title class="font-weight-bold">
                                    {{ $t('blends.blendSettings.productDetails') }}
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon class="icon-with-background primary--text mx-2" style="color:#0EBF67;"
                                                v-bind="attrs" v-on="on">
                                                mdi-alert-circle
                                            </v-icon>
                                        </template>
                                        <span>{{ $t('blends.blendSettings.productDetailsTT') }}</span>
                                    </v-tooltip>
                                </v-toolbar-title>
                            </v-col>
                        </v-row>
                        <v-row class="pl-2" v-for="(products, key) in blendSettings.products" :key="key">
                            <v-col :class="colClass63">
                                <div class="item-box">
                                    <label for="autoLogOff" class="text-subtitle-1 font-weight-bold"> {{
                                        $t('blends.blendSettings.product') }}
                                    </label>
                                    <v-tooltip top color="00BD73" max-width="350">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon class="icon-with-background primary--text" size="medium" style="color:#0EBF67; margin-bottom: 5px;" v-bind="attrs"
                                                v-on="on">
                                                mdi-alert-circle
                                            </v-icon>
                                        </template>
                                        <span>{{ $t("blends.blendSettings.productTT") }}</span>
                                    </v-tooltip>
                                    <v-autocomplete item-text="name" item-value="id" :items="products.product ? [products.product, ...productOptions] : productOptions"
                                        @change="(value) => getSubProductLists(value, key)" dense
                                        v-model="products.productId" :rules="blendSettingsRules.product" required
                                        :placeholder="$t('blends.blendSettings.selectProduct')"
                                        outlined></v-autocomplete>
                                </div>
                            </v-col>
                            <v-col :class="colClass63">
                                <div class="item-box">
                                    <label for="autoLogOff" class="text-subtitle-1 font-weight-bold"> {{
                                        $t('blends.blendSettings.subProduct') }}
                                    </label>
                                    <v-tooltip top color="00BD73" max-width="350">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon class="icon-with-background primary--text" size="medium" style="color:#0EBF67; margin-bottom: 5px;" v-bind="attrs"
                                                v-on="on">
                                                mdi-alert-circle
                                            </v-icon>
                                        </template>
                                        <span>{{ $t("blends.blendSettings.subProductTT") }}</span>
                                    </v-tooltip>
                                    <v-autocomplete item-text="name" item-value="id"
                                        :items="products.subProduct?[products.subProduct, ...(products.subProductOptions||[])]: products.subProductOptions || []" dense 
                                        v-model="products.subProductId"
                                         :placeholder= "$t('blends.blendSettings.selectSubProduct')" 
                                         :rules="blendSettingsRules.subProduct" required
                                        :loading="products.loading" 
                                        outlined></v-autocomplete>
                                </div>
                            </v-col>
                            <v-col :class="colClass63">
                                <div class="item-box">
                                    <label for="autoLogOff" class="text-subtitle-1 font-weight-bold"> {{
                                        $t('blends.blendSettings.originCountry') }}
                                    </label>
                                    <v-tooltip top color="00BD73" max-width="350">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon class="icon-with-background primary--text" size="medium" style="color:#0EBF67; margin-bottom: 5px;" v-bind="attrs"
                                                v-on="on">
                                                mdi-alert-circle
                                            </v-icon>
                                        </template>
                                        <span>{{ $t("blends.blendSettings.originCountryTT") }}</span>
                                    </v-tooltip>
                                    <v-autocomplete item-text="name" item-value="value" :items="countries" dense
                                        required v-model="products.originCountry"
                                        :rules="blendSettingsRules.originCountry"
                                        :placeholder="$t('blends.blendSettings.selectCountry')"
                                        outlined></v-autocomplete>
                                </div>
                            </v-col>
                            <!-- <v-col :class="colClass62">
                                <div class="item-box">
                                    <label for="autoLogOff" class="text-subtitle-1 font-weight-bold"> {{
                                        $t('blends.blendSettings.percentage') }}
                                    </label>
                                    <v-tooltip top color="00BD73" max-width="350">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-icon class="icon-with-background primary--text" size="medium" style="color:#0EBF67; margin-bottom: 5px;"
                                                v-bind="attrs" v-on="on">
                                                mdi-alert-circle
                                            </v-icon>
                                        </template>
                                        <span>{{ $t('blends.blendSettings.percentageTT') }}</span>
                                    </v-tooltip>
                                    <v-text-field dense :rules="[blendSettingsRules.percent, numberRule, nonNegativeRule]"
                                        v-model="products.percent"
                                        :placeholder="$t('blends.blendSettings.enterHere')" outlined></v-text-field>
                                </div>
                            </v-col> -->
                            <v-btn class="mx-2" v-if="key > 1" @click="handleClose(key)" dark fab x-small style="margin-top: 43px;"
                                color="red">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </v-row>
                    <v-divider class="mt-2 mb-2"></v-divider>
                    </v-card-text>
                    <v-card class="mb-5" flat>
                        <v-card-text>
                            <v-btn color="primary" dark class="mr-2" @click="handleAddProduct" >
                                {{ $t('blends.blendSettings.addAnotherProduct') }}
                            </v-btn>

                        </v-card-text>
                    </v-card>
                </v-card>
                <v-card-actions class="mt-10">
                    <v-spacer></v-spacer>
                    <div class="d-flex mt-1">
                        <v-btn color="primary" outlined class="mr-2" @click="redirectListPage">
                            {{ $t('blends.blendSettings.cancel') }}
                        </v-btn>
                        <v-btn v-if="isEditPage" :color="isEditPage ? 'primary' : 'primary'" dark class="mr-2"
                            @click="handleConfirmationDialog">
                            {{ $t('blends.blendSettings.save') }}
                        </v-btn>
                        <v-btn v-else :color="isEditPage ? 'primary' : 'primary'" dark class="mr-2"
                            @click="handleConfirmationDialog">
                            {{ $t('blends.blendSettings.createBlend') }}
                        </v-btn>

                    </div>
                </v-card-actions>

            </v-form>
        </v-container>
        <BlendSettingsCreateModal :message="blendSettingsMessage" @closeblendSettingsModal="handleConfirmationDialog"
            :dialog="openConfirmationDialog" @continue:action="trigger"
            @cancel:action="openConfirmationDialog = false" />
    </div>
</template>

<script>
import { getCountries } from "country-state-picker";
import DownloadMixin from "@/mixins/DownloadMixin";
import loadingMixin from "@/mixins/LoadingMixin";
import getPermittedActions from "@/mixins/GetPermittedActions";
import BlendSettingsCreateModal from '../components/BlendSettingsCreateConfirmModal.vue'
import BlendService from '@/_services/BlendService'
export default {
     props: {
        showBreadcrumb: {
            type: Boolean,
            default: true
        },
        showTitleAndButton: {
            type: Boolean,
            default: true
        },
        isModalForm: {
            type: Boolean,
            default: false
        },
    },
    computed: {
        colClass63(){
            return this.isModalForm ? 'col-6' : 'col-3';
        },
        colClass43(){
            return this.isModalForm ? 'col-4' : 'col-3';
        },
        colClass62(){
            return this.isModalForm ? 'col-6' : 'col-2';
        },
        colClass64(){
            return this.isModalForm ? 'col-6' : 'col-4';
        },
        getCurrentUser() {
            return this.$store.getters.getUser
        },

        selectTypeOptions1() {
            return this.selectType.filter(option => option.value !== this.blendSettings.selectTypeII);
        },
        selectTypeOptions2() {
            return this.selectType.filter(option => option.value !== this.blendSettings.selectType);
        },
        showResetCheckbox() {
            return (
                (this.blendSettings.selectType === 'Incremental Number' &&
                    ['Month', 'Year'].includes(this.blendSettings.selectTypeII)) ||
                (this.blendSettings.selectTypeII === 'Incremental Number' &&
                    ['Month', 'Year'].includes(this.blendSettings.selectType))
            );
        },
        generatedLotId() {
            const { staticText, startCount } = this.blendSettings;
            let selectSeparator = this.blendSettings.selectSeparator;
            if (selectSeparator === 'None') selectSeparator = '';
            else if (selectSeparator === 'Space') selectSeparator = ' ';
            if (this.blendSettings.selectType === 'Incremental Number' && this.blendSettings.selectTypeII === 'Static Text') {
                return `${startCount || ''}${selectSeparator || ''}${staticText || ''}`;
            }
            else if (this.blendSettings.selectType === 'Static Text' && this.blendSettings.selectTypeII === 'Incremental Number') {
                return `${staticText || ''}${selectSeparator || ''}${startCount || ''}`;
            }
            else if (this.blendSettings.selectType === 'Date' && this.blendSettings.selectTypeII === 'Incremental Number') {
                const currentDate = new Date();
                const day = String(currentDate.getDate()).padStart(2, '0');
                const month = currentDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                const year = currentDate.getFullYear();
                const formattedDate = `${day}-${month}-${year}`;
                return `${formattedDate}${selectSeparator || ''}${startCount || ''}`;
            }
            else if (this.blendSettings.selectType === 'Incremental Number' && this.blendSettings.selectTypeII === 'Date') {
                const currentDate = new Date();
                const day = String(currentDate.getDate()).padStart(2, '0');
                const month = currentDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                const year = currentDate.getFullYear();
                const formattedDate = `${day}-${month}-${year}`;
                return `${startCount || ''}${selectSeparator || ''}${formattedDate}`;
            }
            else if (this.blendSettings.selectType === 'Month' && this.blendSettings.selectTypeII === 'Incremental Number') {
                return `${new Date().getMonth() + 1}${selectSeparator || ''}${startCount || ''}`;
            }
            else if (this.blendSettings.selectType === 'Incremental Number' && this.blendSettings.selectTypeII === 'Month') {
                return `${startCount || ''}${selectSeparator || ''}${new Date().getMonth() + 1}`;
            }
            else if (this.blendSettings.selectType === 'Year' && this.blendSettings.selectTypeII === 'Incremental Number') {
                return `${new Date().getFullYear()}${selectSeparator || ''}${startCount || ''}`;
            }
            else if (this.blendSettings.selectType === 'Incremental Number' && this.blendSettings.selectTypeII === 'Year') {
                return `${startCount || ''}${selectSeparator || ''}${new Date().getFullYear()}`;
            }
            else {
                return '';
            }

        },

        isEditPage() {
            return this.$route.name === "editBlendSettings";
        },
        blendSettingsMessage() {
            return this.isEditPage
                ? this.$t('blends.blendSettings.updateMessage')
                : this.$t('blends.blendSettings.createMessage');
        },
        trigger() {
            return this.isEditPage ? this.triggerBlendSettingsUpdate : this.triggerBlendSettingsCreate;
        },
        // percentValidationMessage() {
        //     const products = this.blendSettings.products;
        //     const totalPercent = products.reduce((sum, product) => sum + (parseFloat(product.percent) || 0), 0);

        //     if (products.length === 1 && totalPercent !== 100) {
        //         return false;
        //     }

        //     if (products.length > 1 && totalPercent !== 100) {
        //         return false;
        //     }
        //     return true;
        // },
        // isPercentValid() {
        //     return !this.percentValidationMessage;
        // },
        handleAtLeastTwoProducts() {
            if (this.blendSettings.products.length < 2) {
                return false;
            }
            return true;
        },
        requiredRule() {
            return (v) => {
                if (Array.isArray(v)) {
                    return v.length > 0 || this.$t('blends.exemptProducts.thisFieldIsRequired');
                }
                if (typeof v === 'string') {
                    return v.trim() !== '' || this.$t('blends.exemptProducts.thisFieldIsRequired');
                }
                return v ? true : this.$t('blends.exemptProducts.thisFieldIsRequired');
            };
        },
        numberRule() {
            return (v) => {
                return !isNaN(Number(v)) || this.$t('blends.blendSettings.valueMustBeNumber');
            };
        },
        nonNegativeRule() {
            return (v) => {
                return Number(v) > 0 || this.$t('blends.blendSettings.valueMustBeNonNegative');
            };
        },

    },
    mounted() {
        this.loading = false;
        this.getProductList();
        this.getCountry();
        if (this.isEditPage) {
            this.fetchBlendSettingDetail()
        }
    },
    created() {
        this.initializePage();
    },
    watch: {
        tableOptions: {
            async handler() {
                await this.fetchProducts()
            },
            deep: true,
        },
        $route(to) {
            this.currentPage = to.name;
        },
    },
    components: {
        BlendSettingsCreateModal,
    },
    methods: {
        // handleSubProductChange(subproductId, index) {
        //     const currentProductId = this.blendSettings.products[index].productId;
        //     const isDuplicate = this.blendSettings.products.some((item, idx) => {
        //         return (
        //             idx < index &&
        //             item.productId === currentProductId &&
        //             item.subProductId === subproductId)
        //     }
        //     );
        //     // this.isDuplicate = isDuplicate;
        //     // if (isDuplicate === true) {
        //     //     this.$notify({
        //     //         title: this.$t("blends.blendSettings.validation.productSubproductDuplicatedMsg"),
        //     //         type: "error",
        //     //     });
        //     // }
        // },

        redirectListPage() {
            this.$router.push({
                name: "blendSettings",
            })
        },

        initializePage() {
            this.currentPage = this.$route.name;
        },
        handleConfirmationDialog() {
            if (!this.$refs.createBlendSettings.validate()) {
                this.$notify({
                    title: this.$t("blends.blendSettings.pleaseFillRequiredFields"),
                    type: "error",
                });
                return;
            }
            if(!this.handleAtLeastTwoProducts){
                this.$notify({
                    title: this.$t("blends.validationMessage.atLeastTwoProducts"),
                    type: "error",
                });
            return;
            }     
            // if(this.isDuplicate){
            //     this.$notify({
            //         title: this.$t("blends.blendSettings.validation.productSubproductDuplicatedMsg"),
            //         type: "error",
            //     });
            //     return;
            // }
            this.openConfirmationDialog = true
        },
        formatDateIntoIso(dt) {
            if (!dt) return ''
            return `${dt}T00:00:00.000Z`
        },

        async getProductList() {
            BlendService.getProducts({hasSubproducts: true})
                .then((res) => {
                    const productList = res.data.manageProduct.rows;
                    this.productOptions = productList;
                })
                .catch((err) => {
                    console.log("Error in product listing", err);
                });
        },

        async getSubProductLists(productId, key) {
            if (!productId) return;

            this.$set(this.blendSettings.products[key], 'loading', true);
            const payload = { productId: Number(productId),
                limit: null,
                page: 1
             };

            try {
                const res = await BlendService.getSubProduct(payload);
                this.$set(this.blendSettings.products[key], 'loading', false);
                const subProducts = res?.data?.manageSubProduct?.rows || [];
                // Update the specific product's subProduct options
                this.$set(this.blendSettings.products[key], 'subProductOptions', subProducts);
                this.$set(this.blendSettings.products[key], 'subProduct', '');
            } catch (err) {
                this.loading = false;
                console.error('Error fetching sub-products:', err);
                this.$set(this.blendSettings.products[key], 'subProductOptions', []);
            }
        },

        async createBlend() {
            this.validationError = false;

            // Ensure required fields are filled
            if (!this.$refs.createBlendSettings.validate()) {
                this.$notify({
                    title: this.$t("blends.blendSettings.pleaseFillRequiredFields"),
                    type: "error",
                });
                return;
            }
            // Ensure at least one "Incremental Number" is selected
            if (
                this.blendSettings.selectType !== 'Incremental Number' &&
                this.blendSettings.selectTypeII !== 'Incremental Number'
            ) {
                this.validationError = true;
                this.$notify({
                    title: this.$t("blends.blendSettings.mustSelectIncrementalNumber"),
                    type: "error",
                });
                return;
            }
            if(!this.handleAtLeastTwoProducts){
                this.$notify({
                    title: this.$t("blends.blendSettings.atLeastTwoProducts"),
                    type: "error",
                });
            return;
        }

            // if (this.isPercentValid) {
            //     this.$notify({
            //         title: this.$t("blends.blendSettings.validation.hundredPrecent"),
            //         type: "error",
            //     });
            //     return;
            // }


            const payload = {
                blendTitle: this.blendSettings.title || null,
                blendCode: this.blendSettings.code || null,
                blendDescription: this.blendSettings.desc || null,
                finalProductName: this.blendSettings.finalProductName || null,
                finalProductCode: this.blendSettings.finalProductCode || null,
                processType: ' ',
                blendProducts: this.blendSettings.products?.map(product => ({
                    productId: parseInt(product.productId) || null,
                    subProductId: parseInt(product.subProductId) || null,
                    originCountry: product.originCountry || null,
                    percentage: 0,
                })) || [],
                lotIdGenerator: {
                    typeFirst: this.blendSettings.selectType || null,
                    typeSecond: this.blendSettings.selectTypeII || null,
                    separator: this.blendSettings.selectSeparator || null,
                    startCount: this.blendSettings.startCount || null,
                    staticText: this.blendSettings.staticText || null,
                    reset: this.blendSettings.resetCount || false,
                },
            };
            this.startLoading();

            try {
                const data = await BlendService.createBlendSettings(payload);

                // add specific field validation
                if (data?.errors?.length > 0) {
                    const fieldErrors = {};
                    data.errors.forEach((error) => {
                        if (error.message.includes('blend code already exists')) {
                            fieldErrors.blendCode = this.$t("blends.blendSettings.blendCodeAlreadyExists");
                            this.$nextTick(() => {
                            const blendCodeField = this.$refs.blendCode.$el;
                                if (blendCodeField) {
                                    blendCodeField.scrollIntoView({ behavior: "smooth", block: "center" });
                                    blendCodeField.focus(); 
                                }
                            });
                        }
                        if (error.message.includes('final product code already exists')) {
                            this.$nextTick(() => {
                                const finalProductCodeField = this.$refs.finalProductCode.$el;
                                if (finalProductCodeField) {
                                    finalProductCodeField.scrollIntoView({ behavior: "smooth", block: "center" });
                                    finalProductCodeField.focus(); 
                                }
                            });
                            fieldErrors.finalProductCode = this.$t("blends.blendSettings.finalProductCodeAlreadyExists");
                        }
                    });
                    this.fieldErrors = fieldErrors;
                    return;
                }

                if (data?.data == null) {
                    this.$notify({
                        title: data?.errors[0]?.message,
                        type: "error",
                    });
                }
                else {
                    this.$notify({
                        title: this.$t("blends.blendSettings.blendSettingsCreated"),
                        type: "success",
                    });
                    if (this.isModalForm) {
                        this.$router.push({
                            name: 'CreateBlends',
                        });
                    } else {
                        this.$router.push({
                            name: 'blendSettings'
                        });
                    }
                }

            } catch (error) {
                console.error(error);
                
            } finally {
                this.openConfirmationDialog = false
                this.stopLoading();
                this.router.push({
                    name: "blendSettings",
                });
            }
        },

        async updateBlend() {
            this.validationError = false;
            this.diaglogMessage = this.$t('blends.blendSettings.updateBlendMessage')
            if (!this.$refs.createBlendSettings.validate()) {
                this.$notify({
                    title: this.$t("blends.blendSettings.pleaseFillRequiredFields"),
                    type: "error",
                });
                return;
            }
            if (
                this.blendSettings.selectType !== 'Incremental Number' &&
                this.blendSettings.selectTypeII !== 'Incremental Number'
            ) {
                this.validationError = true;
                this.$notify({
                    title: this.$t("blends.blendSettings.mustSelectIncrementalNumber"),
                    type: "error",
                });
                return;
            }
            if(!this.handleAtLeastTwoProducts){
                this.$notify({
                    title: this.$t("blends.blendSettings.atLeastTwoProducts"),
                    type: "error",
                });
            return;
            }
            // if (this.isPercentValid) {
            //     this.$notify({
            //         title: this.$t("blends.blendSettings.validation.hundredPrecent"),
            //         type: "error",
            //     });
            //     return;
            // }
            const id = parseInt(this.$route.params.id);
            const payload = {
                blendTitle: this.blendSettings.title || null,
                blendCode: this.blendSettings.code || null,
                blendDescription: this.blendSettings.desc || null,
                finalProductName: this.blendSettings.finalProductName || null,
                finalProductCode: this.blendSettings.finalProductCode || null,
                processType: ' ',
                blendProducts: this.blendSettings.products?.map(product => ({
                    productId: parseInt(product.productId) || null,
                    subProductId: parseInt(product.subProductId) || null,
                    originCountry: product.originCountry || null,
                    percentage: 0,
                })) || [],
                lotIdGenerator: {
                    typeFirst: this.blendSettings.selectType || null,
                    typeSecond: this.blendSettings.selectTypeII || null,
                    separator: this.blendSettings.selectSeparator || null,
                    startCount: this.blendSettings.startCount || null,
                    staticText: this.blendSettings.staticText || null,
                    reset: this.blendSettings.resetCount || false,
                },
            };
            this.startLoading();

            try {
                const data = await BlendService.updateBlendSettings(id, payload);

                  // add specific field validation
                  if (data?.errors?.length > 0) {
                    const fieldErrors = {};
                    data.errors.forEach((error) => {
                        if (error.message.includes('blend code already exists')) {
                            fieldErrors.blendCode = this.$t("blends.blendSettings.blendCodeAlreadyExists");
                            this.$nextTick(() => {
                            const blendCodeField = this.$refs.blendCode.$el;
                                if (blendCodeField) {
                                    blendCodeField.scrollIntoView({ behavior: "smooth", block: "center" });
                                    blendCodeField.focus(); 
                                }
                            });
                        }
                        if (error.message.includes('final product code already exists')) {
                            this.$nextTick(() => {
                                const finalProductCodeField = this.$refs.finalProductCode.$el;
                                if (finalProductCodeField) {
                                    finalProductCodeField.scrollIntoView({ behavior: "smooth", block: "center" });
                                    finalProductCodeField.focus(); 
                                }
                            });
                            fieldErrors.finalProductCode = this.$t("blends.blendSettings.finalProductCodeAlreadyExists");
                        }
                    });
                    this.fieldErrors = fieldErrors;
                    return;
                }

                
                if (data?.data == null) {
                    this.$notify({
                        title: data?.errors[0]?.message,
                        type: "error",
                    });
                }
                else {
                    this.$notify({
                        title: this.$t("blends.blendSettings.blendSettingsUpdated"),
                        type: "success",
                    });
                    this.$router.push({
                        name: 'blendSettings'
                    });
                }

            } catch (error) {
                console.error(error);
                this.$notify({
                    title: this.$t("blends.blendSettings.blendSettingsNotUpdated"),
                    type: "error",
                });
            } finally {
                this.openConfirmationDialog = false
                this.stopLoading();
                this.router.push({
                    name: "blendSettings",
                });

            }
        },

        triggerBlendSettingsCreate() {
            this.openConfirmationDialog = false
            this.createBlend()
        },
        triggerBlendSettingsUpdate() {
            this.openConfirmationDialog = false
            this.updateBlend()
        },
        async fetchBlendSettingDetail() {

            try {
                this.startLoading();
                const id = parseInt(this.$route.params.id);
                const response = await BlendService.listBlendSettingsById(id);
                const data = response.data;

                this.blendSettings.title = data?.getBlendSettings?.blendTitle;
                this.blendSettings.code = data?.getBlendSettings?.blendCode;
                this.blendSettings.desc = data?.getBlendSettings?.blendDescription;
                this.blendSettings.finalProductName = data?.getBlendSettings?.finalProductName;
                this.blendSettings.finalProductCode = data?.getBlendSettings?.finalProductCode;
                this.blendSettings.processType ='';
                this.blendSettings.selectType = data?.getBlendSettings?.blendLotIDConfigurations[0]?.typeFirst;
                this.blendSettings.selectTypeII = data?.getBlendSettings?.blendLotIDConfigurations[0]?.typeSecond;
                this.blendSettings.selectSeparator = data?.getBlendSettings?.blendLotIDConfigurations[0]?.separator;
                this.blendSettings.startCount = data?.getBlendSettings?.blendLotIDConfigurations[0]?.startCount;
                this.blendSettings.staticText = data?.getBlendSettings?.blendLotIDConfigurations[0]?.staticText;
                this.blendSettings.resetCount = data?.getBlendSettings?.blendLotIDConfigurations[0]?.reset;
                this.blendSettings.previewLotId = data?.getBlendSettings?.previewLotId;
                this.blendSettings.products = [];
                data.getBlendSettings.blendSettingProducts.forEach(element => {
                    if (element) {
                        this.blendSettings.products.push({
                            productId: element.product.id,
                            subProductId: element.subProduct.id,
                            product: element.product,
                            subProduct: element.subProduct,
                            originCountry: element.originCountry,
                            percent: element.percentage
                        });
                    }
                });

            } catch (error) {
                console.error('Failed to fetch blend settings:', error);
            } finally {
                this.stopLoading();
            }
        },

        handleCheckboxChange(payload) {
            this.blendSettings.resetCount = payload
        },
        handleAddProduct() {
            this.blendSettings.products.push({
                product: '',
                subProduct: '',
                originCountry: '',
                percent: '',
                subProductOptions: [] // Add this field to hold dynamic options
            });
        },
        handleClose(key) {
            this.blendSettings.products.splice(key, 1)
        },

        selectItem(item) {
            this.selectedItem = item;
        },
        searchQuery() {

        },
        resetSearchOnEmpty() {
            this.search = ''
            this.options = {
                page: 1,
                limit: 10
            }
        },
        pageChange(t) {
            if (t) this.options.page = this.options.page + 1;
            else this.options.page = this.options.page - 1;
        },

        getCountry() {
            this.countries = [...getCountries()];
        },

        onSelectTypeChange(dropdown) {
            if (
                this.blendSettings.selectType !== 'Incremental Number' &&
                this.blendSettings.selectTypeII !== 'Incremental Number'
            ) {
                if (dropdown === 'selectType') {
                    this.blendSettings.selectTypeII = 'Incremental Number';
                } else {
                    this.blendSettings.selectType = 'Incremental Number';
                }
            }

            if (this.blendSettings.selectType !== 'Incremental Number') {
                this.blendSettings.startCount = null;
                this.blendSettings.resetCount = false;
            }
            if (this.blendSettings.selectTypeII !== 'Static Text') {
                this.blendSettings.startCount = null;
            }
        },
    },
    data() {
        return {
            selectType: [
                { name: this.$t("blends.blendSettings.staticText"), value: "Static Text" },
                { name: this.$t("blends.blendSettings.incrementalNumber"), value: "Incremental Number" },
                { name: this.$t("blends.blendSettings.year"), value: "Year" },
                { name: this.$t("blends.blendSettings.month"), value: "Month" },
                { name: this.$t("blends.blendSettings.date"), value: "Date" },
            ],
            selectSeparator: [
                { name: this.$t("blends.blendSettings.none"), value: "None" },
                { name: this.$t("blends.blendSettings.space"), value: "Space" },
                { name: "/", value: "/" },
                { name: "-", value: "-" },
            ],

            processType: [
                { name: this.$t("blends.blendSettings.lightRoast"), value: "Light Roast" },
                { name: this.$t("blends.blendSettings.mediumRoast"), value: "Medium Roast" },
                { name: this.$t("blends.blendSettings.mediumDarkRoast"), value: "Medium-Dark Roast" },
                { name: this.$t("blends.blendSettings.darkRoast"), value: "Dark Roast" },
            ],
            countries: [],
            openConfirmationDialog: false,
            expectedArrivalDate: false,
            loading: false,
            tab: 0,
            selectedItem: false,
            options: {
                itemsPerPage: 10,
                page: 1
            },
            search: "",
            from: 0,
            to: 0,
            breadcrumbs: [
                {
                    text: this.$t("blends.eudrDueDiligence"),
                    disabled: false,
                    exact: true,
                },
                {
                    text: this.$t("blends.blends"),
                    disabled: false,
                    to: { name: "Blends" },
                    exact: true,
                },
                {
                    text: this.$t("blends.blendSettings.blendSettings"),
                    disabled: false,
                    to: { name: "blendSettings" },
                    exact: true,
                },
                {
                    text: this.$t("blends.blendSettings.createBlend"),
                    disabled: true,
                    to: "breadcrumbs_link_1",
                },
            ],
            blendSettings: {
                title: '',
                code: '',
                desc: '',
                finalProductName: '',
                finalProductCode: '',
                processType: '',
                selectType: null,
                staticText: null,
                startCount: null,
                resetCount: false,
                selectSeparator: null,
                selectTypeII: null,
                previewLotId: '',
                products: [
                    {   
                        productId:null,
                        subProductId:null,
                        product: '',
                        subProduct: '',
                        originCountry: '',
                        percent: '',
                        subProductOptions: [],
                        loading: false,
                    },
                    {   
                        productId:null,
                        subProductId:null,
                        product: '',
                        subProduct: '',
                        originCountry: '',
                        percent: '',
                        subProductOptions: [],
                        loading: false,
                    }
                ],
                
            },
            productOptions: [], // For product dropdown
            subProductOptions: [], // For subproduct dropdowns, mapped by product ID

            blendSettingsRules: {
                title: [
                    (v) => !!v || this.$t('blends.blendSettings.validation.titleRequired'),
                ],
                code: [
                    (v) => !!v || this.$t('blends.blendSettings.validation.codeRequired'),
                ],
                desc:[
                (v) => !!v || this.$t('blends.blendSettings.validation.descriptionRequired'),
                ],
                finalProductName: [
                    (v) => !!v || this.$t('blends.blendSettings.validation.finalProductNameRequired'),
                ],
                finalProductCode: [
                    (v) => !!v || this.$t('blends.blendSettings.validation.finalProductCodeRequired'),
                ],
                processType: [
                    (v) => !!v || this.$t('blends.blendSettings.validation.processTypeRequired'),
                ],
                selectType: [
                    (v) => !!v || this.$t('blends.blendSettings.validation.selectTypeRequired'),
                ],
                startCount: [
                    (v) => !!v || this.$t('blends.blendSettings.validation.startCountRequired'),
                ],
                selectSeparator: [
                    (v) => !!v || this.$t('blends.blendSettings.validation.selectSeparatorRequired'),
                ],
                product: [
                    (v) => !!v || this.$t('blends.blendSettings.validation.productRequired'),
                ],
                subProduct: [
                    (v) => !!v || this.$t('blends.blendSettings.validation.subProductRequired'),
                ],
                originCountry: [
                    (v) => !!v || this.$t('blends.blendSettings.validation.originCountryRequired'),
                ],
                percent: [
                    (v) => !!v || this.$t('blends.blendSettings.validation.percentageRequired'),
                ],

            },
            validationError: false,
            currentPage: null,
            diaglogMessage: '',
            fieldErrors: {
                blendCode: null,
                finalProductCode: null,
            },
            // isDuplicate: false,
        };
    },

    mixins: [loadingMixin, getPermittedActions, DownloadMixin]
};
</script>

<style lang="scss" scoped>
.img-preview {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
}

.img-item {
    margin-left: 1px;
    max-height: 150px;
    border: 1px solid #ddd;
    position: relative;
}

.img-item img {
    max-height: inherit;
}

.img-item button {
    position: absolute;
    right: 0;
    color: red;
    cursor: pointer;
}

.letterSpacing {
    letter-spacing: 0;
}

.my-awesome-table {
    table-layout: fixed;
}

::v-deep .v-tab:hover {
    background-color: #caf1e2;
    color: $primary_color !important;
}

::v-deep .green-shadow:hover {
    background-color: $primary_color;
    color: white;
}

::v-deep .my-custom-dialog {
    position: absolute;
    top: 0;
    min-height: 100%;
    right: 0;
    margin-right: 0px;
    margin-top: 0px;
}

::v-deep .square {
    width: 1vw;
    height: 1vw;
}

::v-deep .xxxx {
    border: 2px solid black;
}

::v-deep .product-name-cl {
    padding: 5px;
}

::v-deep .product-name-cl .product-img {
    display: flex;
    align-items: center;
}

::v-deep .product-img p {
    margin-left: 5px;
}


.dropZone {
    width: 100%;
    height: 150px;
    position: relative;
    border: 2px dashed #97A8B8;
}

.additional-logos-form {
    width: 100%;
}

.dropZone:hover {
    border: 2px solid $primary-color;
}

.dropZone:hover .dropZone-title {
    color: $primary-color;
}

.dropZone-info {
    color: #A8A8A8;
    position: absolute;
    top: 50%;
    width: 100%;
    transform: translate(0, -50%);
    text-align: center;
}

.dropZone-title {
    color: #787878;
}

.dropZone input {
    position: absolute;
    cursor: pointer;
    top: 0px;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
}

.dropZone-upload-limit-info {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    overflow: clip;
}

.dropZone-over {
    background: #5C5C5C;
    opacity: 0.8;
    overflow: clip;
}

.dropZone-uploaded {
    width: 100%;
    height: 450px;
    position: relative;
    border: 2px solid $primary-color;
    overflow: clip;
    // border-radius: 10px;
}

.dropZone-uploaded-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #A8A8A8;
    position: absolute;
    top: 50%;
    width: 100%;
    transform: translate(0, -50%);
    text-align: center;
    overflow: clip;
}

.primary-color {
    color: #00BD73;
}

.gray-color {
    background: #DCDCDC80;
}

::v-deep .v-data-table-header {
    background-color: #FFB443 !important;
    color: #1E1E1E;
}

::v-deep .v-data-table-header span {
    color: #1E1E1E !important;
}
.v-tooltip__content {
  max-width: 250px !important;
  white-space: normal !important;
  word-break: break-word !important;
  z-index: 1050 !important; 
}

</style>