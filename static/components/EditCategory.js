export default {
    props: ['cat_id'],
    template : `
    <div style="margin-top: 50px; margin-bottom: 50px; font-family: Arial;">
        <div class="card mx-auto" style="width: 40%;">
            <h5 class="card-header"><b>Edit Category</b></h5>
            <div class="card-body">
            <div class='text-danger' style="font-family: Garamond, serif;">{{error}}</div>
            <form>
               <div class="form-group">
                    <label for="cat-id">Category ID</label>
                    <input type="text" class="form-control" id="cat-id" v-model="cred.id" :placeholder="cat_id"  readonly>
                </div>
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" class="form-control" id="name" v-model="cred.name" :placeholder="cred.name" >
                </div>
                <div class="form-group">
                    <label for="description">Description</label>
                    <input type="text" class="form-control" id="description" v-model="cred.description" :placeholder="cred.description">
                </div>
                <div class="text-center">
                <div class="form-group">
                    <label for="status">Status</label>
                    <select id = "status" class="form-select" aria-label="Default select example" v-model="cred.status">
                    <option value = "Approve">Approve</option>
                    <option value="Reject">Reject</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-dark" @click="edit_sec(cat_id)">Edit</button>
                </div>
            </form>
            </div>
        </div>
    </div>`,

    data(){
        return {
            cred : {
                "id" : null,
                "name" : null,
                "description" : null,
                "status" : null,
            },
            error : null,
            token : localStorage.getItem('auth-token'),
        }
    },
    methods :{
        async edit_sec(cat_id){
            const res = await fetch(`/edit-category/${this.cat_id}`, {
                method: 'POST',
                headers:{
                    'Content-Type':'application/json',
                    "Authentication-Token" : this.token,
                },
                body:JSON.stringify(this.cred),
            })
            const data = await res.json()
            if (res.ok){
                this.$router.push({path: '/sections'})
            } 
            else {
                this.error = data.message
                //alert(this.error)
            }
        }
    },
    async mounted(){
        const res = await fetch(`/get-category/${this.cat_id}`, {
            headers :{
                "Authentication-Token" : this.token,
            },
        })
        const data = await res.json()
        if (res.ok){
            this.cred.id = data.id
            this.cred.name = data.name
            this.cred.description = data.description
        }else{
            this.error = res.status
        }
    },
}