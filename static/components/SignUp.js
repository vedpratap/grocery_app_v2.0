export default {
    template :
    `<div style="margin-top: 50px; margin-bottom: 50px; font-family: Arial;">
        <div class="card mx-auto" style="width: 40%;">
            <h5 class="card-header"><b>Registration/Signup Form</b></h5>
            <div class="card-body">
            <div class='text-danger' style="font-family: Garamond, serif;">{{error}}</div>
            <form>
                <div class="form-group">
                    <label for="fullname">Name</label>
                    <input type="text" class="form-control" id="fullname" placeholder="Enter your fullname" v-model="cred.fullname">
                </div>
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
                <fieldset class="form-group">
                    <div class="row">
                    <legend class="col-form-label col-sm-2 pt-0">Role</legend>
                    <div class="col-sm-10">
                        <div class="form-check">
                        <input class="form-check-input" type="radio" name="role" id="buyer" value="buyer" checked v-model="cred.role">
                        <label class="form-check-label" for="buyer">
                            Buyer
                        </label>
                        </div>
                        <div class="form-check">
                        <input class="form-check-input" type="radio" name="role" id="manager" value="manager" v-model="cred.role">
                        <label class="form-check-label" for="manager">
                            Store Manager
                        </label>
                        </div>
                    </div>
                    </div>
                </fieldset>
                <div class="form-group">
                    <label for="mobile-number">Mobile Number</label>
                    <input type="text" class="form-control" id="mobile-number" placeholder="Enter mobile number" v-model="cred.mobile_no">
                </div>
                <div class="form-group">
                    <label for="user-address">Address</label>
                    <input type="text" class="form-control" id="user-address" placeholder="Apartment/House name and number, district, city, state, country, pinzip.." v-model="cred.address">
                </div>
                <p>Have an account?<router-link style="color: #7b241c" to="/login"><b> Login</b></router-link></p>
                <div class="text-center">
                <button type="submit" class="btn btn-dark" @click="signup">Signup</button>
                </div>
            </form>
            </div>
        </div>
    </div>`,

    data(){
        return{
            cred:{
                fullname: null,
                email : null,
                password : null,
                role : null,
                mobile_no : null,
                address : null,
            },
            showPassword : false,
            error: null,
        }
    },
    methods:{
        async signup(){
            const res = await fetch (`/user-signup`,{
                method: 'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(this.cred),
            })
            const data = await res.json()
            if (res.ok){
                alert("Signup Successfully. Click OK to login.")
                this.$router.push({path: '/login'})
            } 
            else {
                this.error = data.message
                //alert(this.error)
            }
        }
    },
}