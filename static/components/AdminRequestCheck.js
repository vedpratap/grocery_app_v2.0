export default{
    template : `<div>
    <h5>Store Manager Requests</h5>
    <div class="text-danger">{{error}}</div>
    <br>
    <form>
    <div class="form-group">
    <select id="filter" style="width: 150px;" class="form-select form-select-sm" aria-label="Small select example" v-model="filter">
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
            <th class="align-middle" scope="col">Manager ID</th>
            <th class="align-middle" scope="col">Type</th>
            <th class="align-middle" scope="col">Detail</th>
            <th class="align-middle" scope="col">Reason</th>
            <th class="align-middle" scope="col">Status</th>
            <th class="align-middle" scope="col">Solved/Not Solved</th>
            <th class="align-middle" scope="col">Action</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="request in allRequest" v-if="filter=='all' || filter==request.is_solved">
            <td class="align-middle" >{{request.id}}</td>
            <td class="align-middle">{{request.man_id}}</td>
            <td class="align-middle">{{request.type}}</td>
            <td class="align-middle">{{request.detail}}</td>
            <td class="align-middle">{{request.reason}}</td>
            <td class="align-middle">
                <span v-if="request.is_solved==true & request.is_approved==true" class="badge bg-success rounded-pill px-3">Accepted</span> 
                <span v-if="request.is_solved==true & request.is_approved==false" class="badge bg-danger rounded-pill px-3">Rejected</span> 
                <span v-if="request.is_solved==false" class="badge bg-secondary rounded-pill px-3">Not Reviewed</span>
            </td>
            <td class="align-middle">
                <span v-if="request.is_solved==true" class="badge bg-primary rounded-pill px-3">Solved</span> 
                <span v-if="request.is_solved==false" class="badge bg-secondary rounded-pill px-3">Not solved</span>
            </td>
            <td class="align-middle">
              <button v-if="request.is_solved==false" type="button" class="btn btn-success" @click="accept_req(request.id)">Accept</button>
              <button v-if="request.is_solved==false" type="button" class="btn btn-danger" @click="reject_req(request.id)">Reject</button>
              <button v-if="request.is_solved==true" type="button" class="btn btn-danger" @click="delete_req(request.id)">Delete</button>
            </td>
            </tr>
        </tbody>
    </table>
    </div>
    </div>`,
    data(){
        return{
            allRequest : [],
            total_request : null,
            filter:"all",
            options:[
                {text:'Solved', value:true},
                {text:'Not solved', value:false}
            ],
            token : localStorage.getItem('auth-token'),
            error : null,
        }
    },
    methods:{
        async accept_req(req_id) {
            const res = await fetch(`/accept-request/${req_id}`, {
                headers :{
                    "Authentication-Token" : this.token,
                }
            })
            const data = await res.json()
            if (res.ok) {
                if(!alert('Request has been solved and accepted')){window.location.reload();}
            }
            else{
                this.error = "Something went wrong!"
            }
        },
        async reject_req(req_id) {
            const res = await fetch(`/reject-request/${req_id}`, {
                headers :{
                    "Authentication-Token" : this.token,
                }
            })
            const data = await res.json()
            if (res.ok) {
                if(!alert('Request has been solved and rejected')){window.location.reload();}
            }
            else{
                this.error = "Something went wrong!"
            }
        },
        async delete_req(req_id) {
            const res = await fetch(`/delete-request/${req_id}`,{
                headers :{
                    "Authentication-Token" : this.token,
                }
            })
            const data = await res.json()
            if (res.ok) {
                if(!alert('Request has been removed.')){window.location.reload();}
            }
            else{
                this.error = data.message
            }
        },
    },
    async mounted(){
        const res = await fetch(`/admin-request-check`,{
            headers :{
                "Authentication-Token" : this.token,
            },
        })
        const data = await res.json()
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