import Home from "./components/Home.js"
import Login from "./components/Login.js"
import SignUp from "./components/SignUp.js"
import Managers from "./components/Managers.js"
import Categories from "./components/Categories.js"
import AddCategory from "./components/AddCategory.js"
import EditCategory from "./components/EditCategory.js"
import ManagerRequestForm from "./components/ManagerRequestForm.js"
import ManagerCategories from "./components/ManagerCategories.js"
import AdminRequestCheck from "./components/AdminRequestCheck.js"
import ManagerRequestCheck from "./components/ManagerRequestCheck.js"
import AddProduct from "./components/AddProduct.js"
import AdminProducts from "./components/AdminProducts.js"
import EditProduct from "./components/EditProduct.js"
import AddCartForm from "./components/AddCartForm.js"
import CartItems from "./components/CartItems.js"
import UserProfile from "./components/UserProfile.js"
import OrdersList from "./components/OrdersList.js"
import ManagerSummary from "./components/ManagerSummary.js"
import UserReport from "./components/UserReport.js"

const routes = [
    {path: '/', component:Home},
    {path: '/login', component:Login, name :'Login'},
    {path: '/signup', component:SignUp},
    {path : '/managers', component:Managers},
    {path: "/sections", component:Categories},
    {path: '/add-cat', component:AddCategory},
    {path: '/edit-cat/:cat_id', component:EditCategory,props: true},
    {path : '/manrqform', component:ManagerRequestForm},
    {path: '/managersections', component:ManagerCategories},
    {path: '/admin_request_check', component:AdminRequestCheck},
    {path: '/manager_request_check', component:ManagerRequestCheck},
    {path: '/add_product',component:AddProduct},
    {path: '/adm_products', component:AdminProducts},
    {path: '/edit_prod/:prod_id', component:EditProduct,props:true},
    {path: '/add_cart_form/:prod_id', component:AddCartForm,props:true},
    {path: '/user_cart', component:CartItems},
    {path: '/user_profile', component:UserProfile},
    {path: '/orders', component:OrdersList},
    {path: '/summary', component:ManagerSummary},
    {path: '/report', component:UserReport}
]

export default new VueRouter({
    routes,
})