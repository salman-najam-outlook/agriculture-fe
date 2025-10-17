import { axiosConfig } from '../../_services/GraphQLService';
import authActions from './actions';

export default {
    state: {
        user: {},
        token: null,
        refreshtoken: null,
        tempToken: null,
        authenticated: getInitialAuthState(),
        modules: [],
        modulePermittedActions: {}
    },
    mutations: {
        setGlobalSettings(state, payload) {
            if (payload) {
                localStorage.setItem("gs", JSON.stringify(payload));
                state.globalSettings = payload
            } else {
                const defaultCurrency= {
                    areaUnit: {
                        name: "Acre",
                        abbvr: "ac",
                        unitType: 5,
                        factor: null
                    },
                    currency: {
                        abbreviation: "USD",
                        name: "United States Dollar",
                        symbol: "$",
                    }
                }
                localStorage.setItem("gs", JSON.stringify(defaultCurrency))
                state.globalSettings = defaultCurrency
            }
        },
        setUserData(state, payLoad) {
            state.user = payLoad;
            state.token = payLoad.token;
            state.refreshtoken = payLoad.refreshtoken;
            state.modules = payLoad.sideBarMenu;
            state.moduleAndPermissions = payLoad?.moduleAndPermissions || [];
            state.authenticated = true
            //salman
            // localStorage.setItem('moduleAndPermissions', JSON.stringify(payLoad?.moduleAndPermissions || []));
            // localStorage.setItem('user', JSON.stringify(payLoad));
            // localStorage.setItem('token', payLoad.token);
            // localStorage.setItem('refreshtoken', payLoad.refreshtoken);
            // localStorage.setItem('modules', JSON.stringify(payLoad.sideBarMenu));
            // axiosConfig.headers.authorization = payLoad.token;
            //salman
            // DISPATCH TO EUDR MODULE
            const matchedRole = payLoad.user_role_assoc.find(role=>
                ['supplier', 'supplier_owner', 'operator', 'operator_owner'].includes(role.id)
            );
            this.commit('eudrDDS/SET_DDS_USER_ROLE', matchedRole ? matchedRole.id : '');
        },
        unsetUser(state) {
            state.user = {};
            state.token = null;
            state.refreshtoken = null;
            state.modules = [];
            //salman
            // localStorage.removeItem("user");
            // localStorage.removeItem("token");
            // localStorage.removeItem("refreshtoken");        
            // localStorage.removeItem("modules");
            localStorage.removeItem('isAuthenticated');
             //salman
            axiosConfig.headers.authorization = null;
            state.authenticated = false;
        },
        setUserOnly(state, userPayload){
            state.user = userPayload
        },
        setTempToken(state, token) {
            state.tempToken = token;
        },
        //salman
        // setAuthToken(state, token) {
        //     localStorage.setItem('token', token);
        //     axiosConfig.headers.authorization = token;
        //     state.token = token;
        // },
        // setRefreshToken(state, token) {
        //     localStorage.setItem('refreshtoken',token);
        //     state.refreshtoken = token;
        // },
        //salman
        setModulePermittedActions (state, data) {
            state.modulePermittedActions = data
        }
    },
    actions: authActions,
    getters: {
        //salman
        // getAuthToken(state) {
        //     return state.token;
        // },
        //salman
        getTempToken(state) {
            return state.tempToken;
        },
        //salman
        // getRefreshToken(state){
        //     return state.refreshtoken;
        // },
        //salman
        async isAuthenticated(state) {
            //salman
             return state.authenticated;
             //salman
        },
        getUser: (state) => state.user,
        getPermissions: (state) => state.modules,
        getUserPermissions: (state) => (allModules) => {
            const arr = state.modules
            if(!arr || !allModules) return []
            const prm = allModules.filter( module => {
                const permission = arr.filter((permission) => ( module.id === permission.id));
                return typeof(permission[0]) != "undefined" && permission[0] !== null && parseInt(permission[0].active) === 1
            })
            return prm;
        },
        isRouteAuthrised: (state) => (module) => {
            // console.log(JSON.stringify(state))
            const arr = state.modules || []
            const permission = arr.filter(permission => {
                if (permission.subMenu) {
                    for (let i = 0; i < permission.subMenu.length; i++) {
                        let id = permission.subMenu[i].id.replace('users/userList', 'user_listing').replace('users/profiles', 'profile_authentication').replace('green_beans', 'green-beans')
                        if (module === id) {
                            return permission.subMenu[i]
                        }
                    }
                } else {
                    return module === permission.id.replace('users/userList', 'user_listing').replace('users/profiles', 'profile_authentication').replace('green-beans', 'green_beans')
                }
            })
            // console.log(permission, 'permission')
            if(permission.length)
                return true
            return false
        },
        getModulePermittedActions: (state) => {
            return state.modulePermittedActions
        },
        isSubEnterprise: (state) => {
             return state.user?.user_role_assoc?.some(role => role.id === "sub_enterprise") || false;
        },
        getUserRoles(state) {
            try {
                return state.user?.user_role_assoc?.map(role => role.id) || [];
            } catch (error) {
                return [];
            }
        }
    },
    modules: {
      
    }
};

//salman
function getInitialAuthState() {
  return localStorage.getItem('isAuthenticated') === 'true';
}
//salman