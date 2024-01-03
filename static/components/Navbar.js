export default {
    template :
    `
    <div>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">
            <img src="/static/images/logo.png" alt="/" width="40" height="35" class="d-inline-block align-text-top">
            <b>Grocery Store</b>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item">
                <router-link class="nav-link active" aria-current="page" to="/">Home</router-link>
                </li>
                <li class="nav-item" v-if="role=='admin'">
                <router-link class="nav-link"  to="/managers">Store Managers</router-link>
                </li>
                <li class="nav-item" v-if="role=='admin'">
                <router-link class="nav-link" to="/sections">Sections/Categories</router-link>
                </li>
                <li class="nav-item" v-if="role=='admin'">
                <router-link class="nav-link"  to="/adm_products">Products</router-link>
                </li>
                <li class="nav-item" v-if="role=='admin'">
                <router-link class="nav-link"  to="/admin_request_check">Requests</router-link>
                </li>
                <li class="nav-item" v-if="role=='manager'">
                <router-link class="nav-link"  to="/managersections">Sections/Categories</router-link>
                </li>
                <li class="nav-item" v-if="role=='manager'">
                <router-link class="nav-link"  to="/manager_request_check">Your requests</router-link>
                </li>
                <li class="nav-item" v-if="role=='manager'">
                <router-link class="nav-link"  to="/summary">Summary</router-link>
                </li>
                <li class="nav-item" v-if="role=='buyer'">
                <router-link class="nav-link" to="/user_profile">Profile</router-link>
                </li>
                <li class="nav-item" v-if="role=='buyer'">
                <router-link class="nav-link" to="/user_cart">Cart</router-link>
                </li>
                <li class="nav-item" v-if="role=='buyer'">
                <router-link class="nav-link" to="/orders">Orders</router-link>
                </li>
                <li class="nav-item" v-if="is_login">
                <button type="button" class="btn btn-link" style="color:#2a211f" @click='logout'><b>Logout</b></button>
                </li>
            </ul>
            </div>
        </div>
        </nav>
    </div>`,

    data(){
        return {
            role : localStorage.getItem('role'),
            is_login : localStorage.getItem('auth-token'),
        }
    },

    methods : {
        logout(){
            localStorage.removeItem('auth-token')
            localStorage.removeItem('role')
            this.$router.push({path :'/login'})
        }
    }
}