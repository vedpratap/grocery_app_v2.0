export default {
    template : `<div>
    <h5>List of all Store Managers</h5>
    <div class="text-danger">{{error}}</div>
    <br>
    <form>
    <div class="form-group">
    <select id="filter" style="width: 100px;" class="form-select form-select-sm" aria-label="Small select example" v-model="filter">
    <option selected value="all">All</option>
    <option v-for="option in options" :value="option.value">{{option.text}}</option>
    </select>
    </div>
    </form>
    <br>
    <table class="table table-striped">
        <thead>
            <tr v-if="total_user > 0">
            <th class="align-middle" scope="col">User ID</th>
            <th class="align-middle" scope="col">Full Name</th>
            <th class="align-middle" scope="col">Email</th>
            <th class="align-middle" scope="col">Role</th>
            <th class="align-middle" scope="col">Current Status</th>
            <th class="align-middle" scope="col">Action</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="user in allUsers" v-if="user.roles[7]==2 && (filter=='all' || filter==user.active)">
            <td class="align-middle" >{{user.id}}</td>
            <td class="align-middle">{{user.fullname}}</td>
            <td class="align-middle">{{user.email}}</td>
            <td class="align-middle">Store Manager</td>
            <td class="align-middle">
                <span v-if="user.active==true" class="badge bg-primary rounded-pill px-3">Active</span> 
                <span v-if="user.active==false" class="badge bg-secondary rounded-pill px-3">Inactive</span>
            </td>
            <td class="align-middle">
            <button v-if="user.active==false" type="button" class="btn btn-success" @click="activate(user.id)">Activate</button>
            <button v-if="user.active==true" type="button" class="btn btn-danger" @click="deactivate(user.id)">Deactivate</button>
            </td>
            </tr>
        </tbody>
    </table>
    </div>`,
    data(){
        return {
            allUsers : [],
            filter:"all",
            options :[
                {text:'Active', value:true},
                {text:'Inactive', value:false}
            ],
            total_user: null,
            token : localStorage.getItem('auth-token'),
            error : null,
        }
    },
    methods:{
        async activate(manager_id){
            const res = await fetch(`/activate/manager/${manager_id}`, {
                headers :{
                    "Authentication-Token" : this.token,
                }
            })
            const data = await res.json()
            if (res.ok) {
                if(!alert('Account has been activated.')){window.location.reload();}
            }
            else{
                this.error = "Something went wrong!"
            }
        },
        async deactivate(manager_id){
            const res = await fetch(`/deactivate/manager/${manager_id}`, {
                headers :{
                    "Authentication-Token" : this.token,
                }
            })
            const data = await res.json()
            if (res.ok) {
                if(!alert('Account has been deactivated.')){window.location.reload();}
            }
            else{
                this.error = "Something went wrong!"
            }
        },
    },
    async mounted(){
        const res = await fetch(`/managers`, {
            headers :{
                "Authentication-Token" : this.token,
            },
        })
        const data = await res.json().catch((e)=>{})
        if (res.ok){
            this.allUsers = data
            let sm = 0
            for (let i=0;i<this.allUsers.length;i++){
                if (this.allUsers[i].roles[7]==2){
                    sm++
                }
            }
            this.total_user = sm
            if (this.total_user == 0){
                this.error = "No Store managers found!"
            }
        }else{
            this.error = res.status
        }
    },
}