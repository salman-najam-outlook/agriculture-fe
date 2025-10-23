import store from "../store";

export default {
    computed:{
        getCurrentRoles(){
            try {
                // const user = JSON.parse(localStorage.getItem("user"));
                const user = store.getters.getUser;
                return user && user.user_role_assoc ? user.user_role_assoc.map(item => item.id) : [];
            } catch (error) {
                return [];
            }
        }
    }
}