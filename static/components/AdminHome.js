export default {
    template : `<div>
    <div style="display: flex; justify-content: flex-end;"><router-link type="button" class="btn btn-dark" to="/add-cat">+ Create New Section/Category</router-link></div>
    <br><br>
    <div class="accordion" id="accordionExample">
    <div class="accordion-item">
        <h2 class="accordion-header">
        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
            <h5>Accounts Detail</h5>
        </button>
        </h2>
        <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
        <div class="accordion-body">
            <p  class="card-text"> Number of Users : <span class="badge text-bg-info">{{total_users}}</span></p>
            <p  class="card-text"> Number of Store Managers : <span class="badge text-bg-info">{{total_store_managers}}</span></p>
            <p  class="card-text"> Store Managers (Approved) : <span class="badge text-bg-success">{{active_store_managers}}</span></p>
            <p  class="card-text"> Store Managers (To be Approved) : <span class="badge text-bg-danger">{{inactive_store_managers}}</span></p>
            <p class="card-text"><small class="text-muted">To manage, Go to <b>Store Managers</b> on navbar.</small></p>    
        </div>
        </div>
    </div>
    <div class="accordion-item">
        <h2 class="accordion-header">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
        <h5>Section/Category Management requests/confirmations <span class="badge rounded-pill text-bg-danger">{{unsolved_request}}</span></h5>
        </button>
        </h2>
        <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
        <div class="accordion-body">
        <p class="card-text"> Total requests : <span class="badge text-bg-info">{{total_request}}</span></p>
        <p class="card-text"> Requests (Solved) : <span class="badge text-bg-success">{{solved_request}}</span></p>
        <p class="card-text"> Requests (To be solved) : <span class="badge text-bg-danger">{{unsolved_request}}</span></p>
        <p class="card-text"><small class="text-muted">To manage, Go to <b>Requests</b> on navbar.</small></p>    
        </div>
        </div>
    </div>
    </div>
    <div class="d-flex align-items-center justify-content-center">
    </div>
    </div>`,
    
    data(){
        return {
            all_users : [],
            allRequest:[],
            total_users : null,
            total_request:null,
            solved_request:null,
            unsolved_request:null,
            total_store_managers: null,
            active_store_managers : null,
            inactive_store_managers : null,
            token : localStorage.getItem('auth-token'),
            non_active_users : null,
            error : null,
        }
    },
    async mounted(){
        const res = await fetch(`/managers`, {
            headers :{
                "Authentication-Token" : this.token,
            },
        })
        const data = await res.json().catch((e)=>{})
        if (res.ok){
            this.all_users = data
            this.total_users = this.all_users.length
            let sm = 0;
            let asm = 0;
            for (let i=0; i<this.all_users.length;i++){
                if (this.all_users[i].roles[7]==2){
                    sm++;
                    if (this.all_users[i].active==true){
                        asm++
                    }
                }
            }
            let iasm = sm-asm;
            this.total_store_managers = sm
            this.active_store_managers = asm
            this.inactive_store_managers = iasm
        }else{
            this.error = res.status
        }
        const res1 = await fetch(`/admin-request-check`,{
            headers :{
                "Authentication-Token" : this.token,
            },
        })
        const data1 = await res1.json().catch((e)=>{})
        if (res1.ok){
            this.allRequest = data1
            this.total_request = data1.length
            let solved = 0
            for (let i=0;i<this.allRequest.length;i++){
                if (this.allRequest[i].is_solved==true){
                    solved++
                }
            }
            this.solved_request=solved;
            this.unsolved_request = data1.length-solved;
        }else{
            this.error = data1.message
        }
    },
}