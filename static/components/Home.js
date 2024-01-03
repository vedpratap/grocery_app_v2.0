import AdminHome from "./AdminHome.js"
import ManagerHome from "./ManagerHome.js"
import CustomerHome from "./CustomerHome.js"
import Login from "./Login.js"

export default {
    template : `<div>
    <CustomerHome v-if = "userRole == 'buyer'" />
    <ManagerHome v-if = "userRole == 'manager'" />
    <AdminHome v-if = "userRole == 'admin'" />
    <div>
    <Login v-if = "userRole == null" />
    </div>
    </div>`,

    data() {
        return {
            userRole: localStorage.getItem('role'),
        }
    },

    components:{
        AdminHome,
        ManagerHome,
        CustomerHome,
        Login,
    },
}

