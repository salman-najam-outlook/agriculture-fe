import { mapGetters } from 'vuex';
import { PERMISSIONS } from '@/constants/permissions';

export default {
  computed: {
    ...mapGetters(['getUser', 'getUserRoles']),

    /**
     * Determines if the current page should be in readonly mode
     * @returns {boolean} True if page should be readonly
     */
    isReadonlyMode() {

      const user = JSON.parse(localStorage.getItem('user'));
      let isKenyaOrPtsiClient = false;
      if(user){
        isKenyaOrPtsiClient = user?.user_role_assoc?.some(role => 
          role.id === 'indonesia_admin' || role.id === 'naccu_kenya_admin'
        );
      }
      
      // Check if URL has special parameters that should trigger readonly mode
      const hasShowParam =
      //  this.$route.params.show === 'show' ||
        this.$route.params.show === 'complaint' ||
        this.$route.params.show === 'non-complaint' ||
        this.$route.query.show === 'true' ||
        // this.$route.path.includes('/show') ||
        this.$route.path.includes('/complaint') ||
        this.$route.path.includes('/non-complaint');

      console.log("hasShowParam:", hasShowParam);

      const moduleAndPermissions = JSON.parse(localStorage.getItem('moduleAndPermissions') || '[]');

      const permissionValue = PERMISSIONS.can_eudr_report_create_update.value;

      const hasPermission = moduleAndPermissions.some(permission => {
        const moduleId = permission.module_id || '';

        const moduleContainsPermission = moduleId.includes(permissionValue);

        return moduleContainsPermission;
      });

      console.log("hasPermission:", hasPermission);
      // Get the diligence report data to check for requestAdditionalInformation
      const diligenceDetails = this.$store.getters["eudrDDS/getDiligenceDetails"];
      console.log("diligenceDetails:", diligenceDetails);
      const hasRequestAdditionalInfo = diligenceDetails?.requestAdditionalInformation &&
        diligenceDetails.requestAdditionalInformation.length > 0 || false;


      console.log(hasRequestAdditionalInfo, 'hasRequestAdditionalInfo');
      console.log(hasPermission, 'hasPermission');
      console.log(isKenyaOrPtsiClient, 'isKenyaOrPtsiClient');
      console.log(hasShowParam, 'hasShowParam');

      // If user is NOT Kenya/PTSI, never readonly
      if (!isKenyaOrPtsiClient) {
        return false;
      }
      // For Kenya/PTSI users, editable if either condition below is true
      const canEdit = (!hasShowParam) || hasRequestAdditionalInfo;
      return !canEdit;
      
    },

    /**
     * Get readonly props for form components
     * @returns {Object} Props object for readonly state
     */
    readonlyProps() {
      return {
        readonly: this.isReadonlyMode,
        disabled: this.isReadonlyMode
      };
    },

    /**
     * Get readonly attributes for input components
     * @returns {Object} Attributes object for readonly state
     */
    readonlyAttrs() {
      return {
        readonly: this.isReadonlyMode,
        disabled: this.isReadonlyMode
      };
    }
  },

  methods: {
    /**
     * Check if a specific field should be readonly
     * @returns {boolean} True if field should be readonly
     */
    isFieldReadonly() {
      return this.isReadonlyMode;
    },

    /**
     * Get readonly state for v-text-field components
     * @returns {Object} Props for v-text-field
     */
    getTextFieldProps() {
      return {
        readonly: this.isReadonlyMode,
        disabled: this.isReadonlyMode,
        outlined: !this.isReadonlyMode,
        filled: this.isReadonlyMode
      };
    },

    /**
     * Get readonly state for v-select components
     * @returns {Object} Props for v-select
     */
    getSelectProps() {
      return {
        readonly: this.isReadonlyMode,
        disabled: this.isReadonlyMode,
        outlined: !this.isReadonlyMode,
        filled: this.isReadonlyMode
      };
    },

    /**
     * Get readonly state for v-textarea components
     * @returns {Object} Props for v-textarea
     */
    getTextareaProps() {
      return {
        readonly: this.isReadonlyMode,
        disabled: this.isReadonlyMode,
        outlined: !this.isReadonlyMode,
        filled: this.isReadonlyMode
      };
    },

    /**
     * Get readonly state for v-checkbox components
     * @returns {Object} Props for v-checkbox
     */
    getCheckboxProps() {
      return {
        disabled: this.isReadonlyMode,
        readonly: this.isReadonlyMode
      };
    },

    /**
     * Get readonly state for v-radio-group components
     * @returns {Object} Props for v-radio-group
     */
    getRadioGroupProps() {
      return {
        disabled: this.isReadonlyMode,
        readonly: this.isReadonlyMode
      };
    },

    /**
     * Get readonly state for v-btn components (save/submit buttons)
     * @returns {Object} Props for v-btn
     */
    getButtonProps() {
      return {
        disabled: this.isReadonlyMode,
        readonly: this.isReadonlyMode
      };
    }
  }
};
