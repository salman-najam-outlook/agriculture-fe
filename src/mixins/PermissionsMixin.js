import PermissionsService from '@/_services/PermissionsService'

export default {
    methods: {
        async getDepartments() {
            const dept = await PermissionsService.getDeptList({page:1,itemsPerPage:1000, sortBy:['name'], sortDesc: [false]})
            return dept;
        },

        async getRolesList() {
            const roles = await PermissionsService.getRoleList({page:1,itemsPerPage:1000, sortBy:['name'], sortDesc: [false]})
            return roles;
        },

        async getRolePermissions(role) {
            const perm = await PermissionsService.getRolePermissions(role)
            // console.log(perm)
            return perm
        },

        async allModulesPermissions(role) {
            const perm = await PermissionsService.allModulesPermissions(role)
            // console.log(perm)
            return perm
        },

        async getAllMembershipType () {
            const res = await PermissionsService.getAllMembershipType()
            if (res.success) {
                return res.data.listRes
            }
        },

        async getAllModulePermissionsByMembership (id, role) {
            const res = await PermissionsService.getAllModulePermissionsByMembership(id, role)
            if (res.success) {
                return res.data
            }
        },

        async searchModulePermissionMethod (type, query) {
            const res = await PermissionsService.searchModulePermission(type, query)
            if (res.success) {
                return res.data
            }
        },

        async changeDefaultMembershipType (id) {
            const res = await PermissionsService.changeDefaultMembershipType(id)
            if (res.success) {
                return res.data
            }
        }
    }
}