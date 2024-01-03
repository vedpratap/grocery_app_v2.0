export default {
    template :`<div>
    <div class="text-left">
    <button type="button" class="btn btn-light" @click="to_report()">Your Report <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-card-text" viewBox="0 0 16 16">
    <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"/>
    <path d="M3 5.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 8m0 2.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5"/>
    </svg></button></div><br>
    <div class="text-center">
    <div class="card text-center">
    <div class="card-header">
        Your Profile
    </div>
    <div class="card-body">
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
        <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
        </svg>
        <div class='text-danger' style="font-family: Garamond, serif;">{{error}}</div>
        <h5 class="card-title">{{name}}</h5>
        <p class="card-text"><b>Email :</b> {{email}}</p>
        <p class="card-text"><b>Mobile No. :</b> {{mobile_no}}</p>
        <p class="card-text"><b>Address :</b> {{address}}</p>
    </div>
    <div class="card-footer text-muted">
    <img src="/static/images/logo.png" alt="/" width="40" height="30" class="d-inline-block align-text-top">
    <b>Grocery Store</b>
    </div>
    </div>
    </div>
    </div>`,
    data(){
        return {
            name:null,
            email:null,
            address:null,
            mobile_no:null,
            error:null,
            token : localStorage.getItem('auth-token')
        }
    },
    methods:{
        async to_report(){
            this.$router.push('/report')
        }
    },
    async mounted(){
        const res = await fetch(`/user-info`,{
            headers :{
                "Authentication-Token" : this.token,
            },
        })
        const data = await res.json()
        if (res.ok){
            this.name = data.fullname
            this.email = data.email
            this.address = data.address
            this.mobile_no = data.mobile_no
        }
        else{
            this.error = data.message
        }
    }
}