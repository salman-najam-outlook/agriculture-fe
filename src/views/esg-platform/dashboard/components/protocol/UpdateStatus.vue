<template>
    <v-dialog v-model="internalDialog" width="700">
        <v-card l>
            <v-card-title class="primary white--text">
                {{ $t('esgPlatform.updateStatus') }}
                <v-spacer></v-spacer>
                <v-btn icon @click="cancel">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>

            <v-card-text>
                <p class="pt-8 black--text">
                    {{ $t('esgPlatform.updateStatusDesc') }}
                </p>
                <v-radio-group v-model="selectedStatus">
                    <div class="custom-radio-item">
                        <v-radio value="Pending" color="primary"></v-radio>
                        <label @click="selectedStatus = 'Pending'">Pending</label>
                    </div>
                    <div class="custom-radio-item">
                        <v-radio value="Approved" color="success"></v-radio>
                        <label @click="selectedStatus = 'Approved'">Approved</label>
                    </div>
                    <div class="custom-radio-item">
                        <v-radio value="Rejected" color="red"></v-radio>
                        <label @click="selectedStatus = 'Rejected'">Rejected</label>
                    </div>
                </v-radio-group>


                <v-textarea v-if="selectedStatus === 'Rejected'" v-model="rejectionReason"  label="Reason for Rejection"
                    placeholder="Descript here" outlined rows="6"></v-textarea>
            </v-card-text>

            <v-card-actions class="justify-end py-4">
                <v-btn text @click="cancel" color="primary" outlined>{{ $t('cancel') }}</v-btn>
                <v-btn color="primary" @click="confirm">{{ $t('confirm') }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        dialog: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            internalDialog: this.dialog,
            selectedStatus: 'Pending', // Default selected status
            rejectionReason: '', // Reason for rejection
        };
    },
    watch: {
        dialog(val) {
            this.internalDialog = val;
        },
        internalDialog(val) {
            this.$emit('update:dialog', val);
        }
    },
    methods: {
        cancel() {
            this.$emit('cancel'); // Emit a 'cancel' event to the parent
            this.dialog = false;
        },
        confirm() {
            this.$emit('confirm', {
                status: this.selectedStatus,
                rejectionReason: this.rejectionReason
            }); // Emit 'confirm' with selected status
            this.internalDialog = false;
        },
    },
};
</script>

<style scoped>
.custom-radio-item {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    /* Spacing between items */
}

.custom-radio-item label {
    display: inline-block;
    padding: 6px 30px;
    border-radius: 30px;
    /* Rounded corners */
    font-size: 0.8rem;
    font-weight: bold;
    cursor: pointer;
    white-space: nowrap;
    /* Prevent text wrapping */
}

.custom-radio-item:nth-child(1) label {
    border: 1px solid #ccc;
    color: #333;
}

.custom-radio-item:nth-child(2) label {
    background-color: #e6f7ec;
    border: 1px solid #7ed957;
    color: #333;
}

.custom-radio-item:nth-child(3) label {
    background-color: #fcebeb;
    border: 1px solid #e57373;
    color: #333;
}

.custom-radio-item .v-radio {
    margin-right: 8px;
    /* Spacing between radio and label */
}

.v-input--radio-group--column .v-radio:not(:last-child):not(:only-child){
    margin-bottom: 0 !important;
}
</style>