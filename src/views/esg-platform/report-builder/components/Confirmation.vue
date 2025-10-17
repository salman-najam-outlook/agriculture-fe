<template>
    <div class="confirmation-dialog" v-if="isVisible">
        <div class="dialog-overlay" @click="handleOverlayClick"></div>
        <div class="dialog-container">
            <!-- Header -->
            <div class="dialog-header">
                <h2 class="dialog-title">{{ title }}</h2>
                <button class="close-button" @click="closeDialog" v-if="showCloseButton">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6L18 18" stroke="white" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </button>
            </div>

            <!-- Content -->
            <div class="dialog-content">
                <!-- Message Text -->
                <p class="confirmation-message">{{ message }}</p>

                <!-- Action Buttons -->
                <div class="button-container">
                    <v-btn color="primary" outlined class="mr-2 btn-outline-primary font-weight-bold mb-2"
                        @click="handleCancel" v-if="showCancelButton">
                        {{ cancelText }}
                    </v-btn>
                    <v-btn color="primary" class="mr-2 btn-outline-primary font-weight-bold mb-2" @click="handleConfirm"
                        :class="{ 'loading': isLoading }" :disabled="isLoading">
                        <span v-if="!isLoading">{{ confirmText }}</span>
                        <span v-else class="loading-spinner"></span>
                    </v-btn>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ConfirmationDialog',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: 'Confirmation'
        },
        message: {
            type: String,
            required: true
        },
        confirmText: {
            type: String,
            default: 'CONFIRM'
        },
        cancelText: {
            type: String,
            default: 'CANCEL'
        },
        showCancelButton: {
            type: Boolean,
            default: true
        },
        showCloseButton: {
            type: Boolean,
            default: true
        },
        closeOnOverlay: {
            type: Boolean,
            default: true
        },
        loading: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: 'default', // 'default', 'warning', 'danger'
            validator: value => ['default', 'warning', 'danger'].includes(value)
        }
    },
    data() {
        return {
            isVisible: this.visible,
            isLoading: this.loading
        }
    },
    watch: {
        visible(newVal) {
            this.isVisible = newVal;
        },
        loading(newVal) {
            this.isLoading = newVal;
        }
    },
    methods: {
        closeDialog() {
            this.$emit('close');
            this.isVisible = false;
        },
        handleOverlayClick() {
            if (this.closeOnOverlay) {
                this.closeDialog();
            }
        },
        handleCancel() {
            this.$emit('cancel');
            this.closeDialog();
        },
        handleConfirm() {
            if (!this.isLoading) {
                this.$emit('confirm');
            }
        }
    }
}
</script>

<style scoped>
.confirmation-dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
}

.dialog-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
}

.dialog-container {
    position: relative;
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-width: 600px;
    width: 90%;
    max-height: 90vh;
    animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.dialog-header {
    background: #0e9c6d;
    padding: 10px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.dialog-title {
    color: white;
    font-size: 20px;
    font-weight: 600;
    margin: 0;
}

.close-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px;
    border-radius: 4px;
    transition: background-color 0.2s;
}

.close-button:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.dialog-content {
    padding: 40px 30px;
}

.confirmation-message {
    font-size: 18px;
    color: #374151;
    margin: 0 0 40px 0;
    line-height: 1.6;
    text-align: left;
}

.button-container {
    display: flex;
    justify-content: flex-end;
    gap: 15px;
}

.cancel-btn,
.confirm-btn {
    padding: 12px 30px;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border: 2px solid transparent;
    min-width: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.cancel-btn {
    background: transparent;
    border-color: #10B981;
    color: #10B981;
}

.cancel-btn:hover {
    background: #F0FDF4;
}

.confirm-btn {
    background: #10B981;
    color: white;
    border-color: #10B981;
}

.confirm-btn:hover:not(:disabled) {
    background: #059669;
    border-color: #059669;
}

.confirm-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.confirm-btn.loading {
    pointer-events: none;
}

.loading-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid transparent;
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* Type variations */
.confirmation-dialog[data-type="warning"] .dialog-header {
    background: #F59E0B;
}

.confirmation-dialog[data-type="warning"] .cancel-btn {
    border-color: #F59E0B;
    color: #F59E0B;
}

.confirmation-dialog[data-type="warning"] .cancel-btn:hover {
    background: #FFFBEB;
}

.confirmation-dialog[data-type="warning"] .confirm-btn {
    background: #F59E0B;
    border-color: #F59E0B;
}

.confirmation-dialog[data-type="warning"] .confirm-btn:hover:not(:disabled) {
    background: #D97706;
    border-color: #D97706;
}

.confirmation-dialog[data-type="danger"] .dialog-header {
    background: #EF4444;
}

.confirmation-dialog[data-type="danger"] .cancel-btn {
    border-color: #EF4444;
    color: #EF4444;
}

.confirmation-dialog[data-type="danger"] .cancel-btn:hover {
    background: #FEF2F2;
}

.confirmation-dialog[data-type="danger"] .confirm-btn {
    background: #EF4444;
    border-color: #EF4444;
}

.confirmation-dialog[data-type="danger"] .confirm-btn:hover:not(:disabled) {
    background: #DC2626;
    border-color: #DC2626;
}

/* Responsive */
@media (max-width: 640px) {
    .dialog-container {
        margin: 20px;
        width: calc(100% - 40px);
    }

    .dialog-header {
        padding: 15px 20px;
    }

    .dialog-title {
        font-size: 20px;
    }

    .dialog-content {
        padding: 30px 20px;
    }

    .confirmation-message {
        font-size: 16px;
    }

    .button-container {
        flex-direction: column-reverse;
        gap: 10px;
    }

    .cancel-btn,
    .confirm-btn {
        width: 100%;
    }
}
</style>
<!-- 

<ConfirmationDialog 
  :visible="showPublishConfirmation"
  title="Confirmation"
  message="Are you sure you want to publish this report? Once published, the ESG report will be available to the public on Dimitra. No further changes can be made to this report after publishing."
  confirm-text="CONFIRM"
  cancel-text="CANCEL"
  type="warning"
  @confirm="handlePublishReport"
  @cancel="showPublishConfirmation = false"
  @close="showPublishConfirmation = false"
/> -->