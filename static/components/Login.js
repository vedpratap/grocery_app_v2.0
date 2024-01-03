export default {
    template : 
    `<div style="margin-top: 50px; font-family: Arial;">
        <div class="card mx-auto" style="width: 40%;">
            <h5 class="card-header"><b>User Login</b></h5>
            <div class="card-body">
            <div class='text-danger' style="font-family: Garamond, serif;">{{error}}</div>
            <form>
                <div class="form-group">
                    <label for="user-email">Email address</label>
                    <input type="email" class="form-control" id="user-email" aria-describedby="emailHelp" placeholder="Enter email" v-model="cred.email">
                    <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div class="form-group">
                    <label for="user-password">Password</label>
                    <input v-bind:type="showPassword ? 'text' : 'password'"  class="form-control" id="user-password" placeholder="Password" v-model="cred.password">
                </div>
                <div class="form-group">
                <label for="checkpassword">Show Password</label> 
                <input type="checkbox" id = "checkpassword" v-on:click="showPassword = !showPassword">
                </div>
                <p>Don't have an account?<router-link style="color: #7b241c" to="/signup"><b> SignUp</b></router-link></p>
                <div class="text-center">
                <button type="submit" class="btn btn-dark" @click="login">Login</button>
                </div>
            </form>
            </div>
        </div>
    </div>`,

    data(){
        return{
            cred: {
                "email":null,
                "password":null,
            },
            error: null,
            showPassword : false,
        }
    },
    methods:{
        async login(){
            const res = await fetch('/user-login',{
                method: 'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(this.cred),
            })
            const data = await res.json()
            if (res.ok){
                localStorage.setItem('auth-token', data.token)
                localStorage.setItem('role', data.role)
                this.$router.push({path: '/'})
            } 
            else {
                this.error = data.message
                //alert(this.error)
            }
        },
    },
}