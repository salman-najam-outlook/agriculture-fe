<template>
    <v-card class="d-flex tabs-container">
        <div v-for="(tab, index) in tabs" :key="tab.number" :class="['d-flex', 'tab-header', headerClass(tab.number)]"
            @click="changeStep(tab.number)">
            <div class="square">
                <span class="number">{{ tab.number }}</span>
            </div>
            <span class="headline-text-color">
                {{ tab.title }}
            </span>
            <span class="next-tab-arrow" v-if="index < tabs.length - 1">
                >
            </span>
        </div>
    </v-card>
</template>

<script>
export default {
    name: 'CustomStepper',
    props: {
        currentStep: {
            type: Number,
            default: 1
        },
        steps: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            stepShow: null
        }
    },
    computed: {
        tabs() {
            return this.steps.map((step, index) => ({
                number: index + 1,
                title: step.title,
            }))
        }
    },
    methods: {
        headerClass(stepNumber) {
            return stepNumber === this.currentStep ? 'active-header-navigation' : 'header-navigation'
        },
        changeStep(stepNumber) {
            this.$emit('step-changed', stepNumber)
        },
    }
}
</script>

<style scoped>
.tabs-container {
    display: flex;
    overflow-x: auto;
    white-space: nowrap;
    width: 100%;
    box-shadow: none;
}

.tab-header {
    cursor: pointer;
}

.tab-header .next-tab-arrow,
.tab-header .headline-text-color {
    display: flex;
    justify-content: center;
    align-items: center;
}

.next-tab-arrow {
    margin-left: 20px;
    margin-right: 10px;
    font-size: 30px;
    font-weight: 500;
}

.active-header-navigation .headline-text-color {
    color: var(--primary-color) !important;
}

.headline-text-color {
    color: #4b4b4b !important;
}

.square {
    width: 35px;
    height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    background-color: #d2d2d2;
    margin: 10px;
}

.active-header-navigation .square {
    width: 35px;
    height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    background-color: var(--primary-color);
    margin: 10px;
}

.number {
    font-size: 20px;
    font-weight: 400;
    color: #4b4b4b;
}

.header-navigation {
    position: relative;
    height: 80px;
    align-items: center;
}

.active-header-navigation {
    position: relative;
    height: 80px;
    align-items: center;
}

.active-header-navigation .number {
    font-size: 20px;
    font-weight: 400;
    color: #ffffff;
}
</style>