export default {
    template : `
    <div style="margin-top: 50px; margin-bottom: 50px; font-family: Arial;">
        <div class="card mx-auto" style="width: 40%;">
            <h5 class="card-header"><b>Add/Create Category</b></h5>
            <div class="card-body">
            <div class='text-danger' style="font-family: Garamond, serif;">{{error}}</div>
            <form>
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" class="form-control" id="name" placeholder="Enter Category Name" v-model="cred.name">
                </div>
                <div class="form-group">
                    <label for="description">Description</label>
                    <input type="text" class="form-control" id="description" placeholder="Enter Description" v-model="cred.description">
                </div>
                <div class="text-center">
                <button type="submit" class="btn btn-dark" @click="addcat">Create</button>
                </div>
            </form>
            </div>
        </div>
    </div>`,

    data(){
        return {
            cred :{
                "name" : null,
                "description" : null
            },
            token : localStorage.getItem('auth-token'),
            error: null,
        }
    },

    methods : {
        async addcat() {
            const res = await fetch(`/create-section`, {
                method: 'POST',
                headers:{
                    "Authentication-Token" : this.token,
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(this.cred),
            })
            const data = await res.json()
            if (res.ok){
                this.$router.push('/sections')
            } 
            else {
                this.error = data.message
                //alert(this.error)
            }
        }
    },
}