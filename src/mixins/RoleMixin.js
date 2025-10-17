
export default {
    computed:{
        getCurrentRoles(){
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                return user && user.user_role_assoc ? user.user_role_assoc.map(item => item.id) : [];
            } catch (error) {
                return [];
            }
        }
    }
}