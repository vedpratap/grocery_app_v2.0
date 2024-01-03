
export default{
    template : `<div>
    <div class="text-right">
    <button type="button" class="btn btn-dark" @click="request()">Request to Admin</button>
    </div>
    <h5>Requests</h5>
    <div class="text-danger">{{error}}</div>
    <br>
    <form>
    <div class="form-group">
    <select id="filter" style="width: 200px;" class="form-select form-select-sm" aria-label="Small select example" v-model="filter">
    <option selected value="all">All</option>
    <option v-for="option in options" :value="option.value">{{option.text}}</option>
    </select>
    </div>
    </form>
    <br>
    <table class="table table-striped">
        <thead>
            <tr v-if="total_request > 0">
            <th class="align-middle" scope="col">Request ID</th>
            <th class="align-middle" scope="col">Type</th>
            <th class="align-middle" scope="col">Detail</th>
            <th class="align-middle" scope="col">Reason</th>
            <th class="align-middle" scope="col">Current Status</th>
            <th class="align-middle" scope="col">Admin Comment</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="request in allRequest" v-if="filter=='all' || filter==request.is_solved">
            <td class="align-middle" >{{request.id}}</td>
            <td class="align-middle">{{request.type}}</td>
            <td class="align-middle">{{request.detail}}</td>
            <td class="align-middle">{{request.reason}}</td>
            <td class="align-middle">
                <span v-if="request.is_solved==true && request.is_approved==true" class="badge bg-success rounded-pill px-3">Accepted</span> 
                <span v-if="request.is_solved==true && request.is_approved==false" class="badge bg-danger rounded-pill px-3">Rejected</span> 
                <span v-if="request.is_solved==false" class="badge bg-secondary rounded-pill px-3">Not Reviewed</span>
            </td>
            <td class="align-middle">{{request.admin_comment}}</td>
            </tr>
        </tbody>
    </table>
    <div class="text-right text-muted"><small>Note : After getting status 'Accepted' or 'Rejected', request will be removed by admin after 15 days.</small></div>
    </div>`,
    data(){
        return{
            allRequest : [],
            total_request : null,
            filter:"all",
            options:[
                {text:'Solved (Accepted/Rejected)', value:true},
                {text:'Not Solved', value:false}
            ],
            token : localStorage.getItem('auth-token'),
            error : null,
        }
    },
    methods:{
        async request(){
            this.$router.push('/manrqform')
        },
    },
    async mounted(){
        const res = await fetch(`/manager-request-check`,{
            headers :{
                "Authentication-Token" : this.token,
            },
        })
        const data = await res.json().catch((e)=>{})
        if (res.ok){
            this.allRequest = data
            this.total_request = data.length
            if (this.total_request == 0){
                this.error = "No request found!"
            }
        }else{
            this.error = data.message
        }
    },
}