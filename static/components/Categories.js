export default {
    template : `<div>
    <div style="display: flex; justify-content: flex-end;"><router-link type="button" class="btn btn-dark" to="/add-cat">+ Create New Section/Category</router-link></div>
    <br><br>
    <h5>All available categories</h5>
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
        <thead >
            <tr v-if="total_cat > 0">
            <th class="align-middle" scope="col">Category ID</th>
            <th class="align-middle" scope="col">Name</th>
            <th class="align-middle" scope="col">Description</th>
            <th class="align-middle" scope="col">Current Status</th>
            <th class="align-middle" scope="col">Action</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="section in allSections" v-if="filter=='all' || filter==section.is_approved">
            <td class="align-middle">{{section.id}}</td>
            <td class="align-middle">{{section.name}}</td>
            <td class="align-middle">{{section.description}}</td>
            <td class="align-middle">
                <span v-if="section.is_approved==true" class="badge bg-primary rounded-pill px-3">Approved</span> 
                <span v-if="section.is_approved==false" class="badge bg-secondary rounded-pill px-3">Not Approved</span>
            </td>
            <td class="align-middle">
            <button v-if="section.is_approved==false" type="button" class="btn btn-success" @click="activate(section.id)">Approve</button>
            <button  type="button" class="btn btn-info" @click="edit_cat(section.id)">Edit</button>
            <button  type="button" class="btn btn-danger" @click="delete_sec(section.id)">Remove</button>
            <button v-if="section.is_approved==true" type="button" class="btn btn-danger" @click="deactivate(section.id)">Reject</button>
            </td>
            </tr>
        </tbody>
    </table>
    </div>`,
    data(){
        return {
            allSections : [],
            total_cat : null,
            filter:"all",
            options:[
                {text:'Approved', value:true},
                {text:'Not Approved', value:false}
            ],
            token : localStorage.getItem('auth-token'),
            error : null,
        }
    },
    methods :{
        async edit_cat(cat_id){
            this.$router.push(`/edit-cat/${cat_id}`)
        },
        async delete_sec(cat_id) {
            const res = await fetch(`/delete-category/${cat_id}`,{
                headers :{
                    "Authentication-Token" : this.token,
                }
            })
            const data = await res.json()
            if (res.ok) {
                if(!alert('Category removed.')){window.location.reload();}
            }
            else{
                this.error = data.message
            }
        },
        async activate(cat_id){
            const res = await fetch(`/activate/category/${cat_id}`, {
                headers :{
                    "Authentication-Token" : this.token,
                }
            })
            const data = await res.json()
            if (res.ok) {
                if(!alert('Category has been activated.')){window.location.reload();}
            }
            else{
                this.error = "Something went wrong!"
            }
        },
        async deactivate(cat_id){
            const res = await fetch(`/deactivate/category/${cat_id}`, {
                headers :{
                    "Authentication-Token" : this.token,
                }
            })
            const data = await res.json()
            if (res.ok) {
                if(!alert('Category has been rejected.')){window.location.reload();}
            }
            else{
                this.error = "Something went wrong!"
            }
        },
    },
    async mounted(){
        const res = await fetch(`/all-sections`, {
            headers :{
                "Authentication-Token" : this.token,
            },
        })
        const data = await res.json().catch((e)=>{})
        if (res.ok){
            this.allSections = data
            this.total_cat = data.length
            if (this.total_cat == 0){
                this.error = "No any category found!"
            }
        }else{
            this.error = data.message
        }
    },
}