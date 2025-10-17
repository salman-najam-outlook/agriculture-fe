export const userRules = {
    name: [
        v => !!v || 'Name is required',
        // v => this.onlyAlpha(v) || 'Name can contain only alphbets'
    ],
    email: [
        v => !!v || 'Email is required',
        v => this.validateEmail(v) || 'Invalid email format.'
    ],
    mobile: [
        v => !!v || 'Mobile number is required',
        v => this.validMobileNumber(v) || 'Invalid mobile number format.'
    ],
    department: [
        v => !!v || 'Department is required',
    ],
    role: [
        v => !!v || 'Role is required',
    ],
}