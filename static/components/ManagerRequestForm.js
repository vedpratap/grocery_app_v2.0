export default {
    template : `<div>
    <div style="margin-top: 50px; font-family: Arial;">
        <div class="card mx-auto" style="width: 40%;">
            <h5 class="card-header"><b>Request to Admin</b></h5>
            <div class="card-body">
            <div class='text-danger' style="font-family: Garamond, serif;">{{error}}</div>
                <form>
                    <div class="form-group">
                        <label for="type">Request Type</label>
                        <select id = "type" class="form-select" aria-label="Default select example" v-model="cred.type">
                            <option selected value="Create">Create</option>
                            <option value="Edit">Edit</option>
                            <option value="Remove">Remove</option>
                        </select>
                    </div> 
                    <div v-if="cred.type=='Create'" class="form-group">
                        <label for="detail">Category detail</label>
                        <textarea class="form-control" id="detail" placeholder="Write Category detail (Name, Description)" v-model="cred.detail"></textarea>
                    </div>  
                    <div v-if="cred.type=='Create'" class="form-group">
                        <label for="reason">Reason in detail</label>
                        <textarea class="form-control" id="reason" placeholder="Reason for create request." v-model="cred.reason"></textarea>
                    </div>  
                    <div v-if="cred.type=='Remove'" class="form-group">
                        <label for="detail">Category detail</label>
                        <textarea class="form-control" id="detail" placeholder="Write Category detail (such as ID, Name)" v-model="cred.detail" ></textarea>
                    </div>    
                    <div v-if="cred.type=='Remove'" class="form-group">
                        <label for="reason">Reason in detail</label>
                        <textarea class="form-control" id="reason" placeholder="Reason for delete request." v-model="cred.reason"></textarea>
                    </div>  
                    <div v-if="cred.type=='Edit'" class="form-group">
                        <label for="detail">Category detail</label>
                        <textarea class="form-control" id="detail" placeholder="Write Category detail (such as ID, Name)" v-model="cred.detail"></textarea>
                    </div>   
                    <div v-if="cred.type=='Edit'" class="form-group">
                        <label for="reason">Reason in detail</label>
                        <textarea class="form-control" id="reason" placeholder="Reason for edit request." v-model="cred.reason"></textarea>
                    </div>  
                    <div class="text-center">
                    <button v-if="cred.type=='Create'" type="submit" class="btn btn-dark" @click="request" >Send create request</button>
                    <button v-if="cred.type=='Edit'" type="submit" class="btn btn-dark" @click="request">Send edit request</button>
                    <button v-if="cred.type=='Remove'" type="submit" class="btn btn-dark" @click="request">Send delete request</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    </div>`,

    data(){
        return{
            cred:{
                type : null,
                detail: null,
                reason: null,
            },
            token: localStorage.getItem('auth-token'),
            error : null,
        }
    },
    methods:{
        async request(){
            const res = await fetch (`/manager-request`,{
                method: 'POST',
                headers:{
                    'Content-Type':'application/json',
                    "Authentication-token" : this.token,
                },
                body:JSON.stringify(this.cred),
            })
            const data = await res.json()
            if (res.ok){
                alert("Request send successfully.")
                this.$router.push({path: '/manager_request_check'})
            } 
            else {
                this.error = data.message
                //alert(this.error)
            }
        }
    }
}