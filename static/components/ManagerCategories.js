export default {
    template : `<div>
    <div style="display: flex; justify-content: flex-end;"><router-link type="button" class="btn btn-dark" to="/manrqform">Request to Admin</router-link></div>
    <br><br>
    <h5>All available categories</h5>
    <div class="text-danger">{{error}}</div>
    <table class="table table-striped">
        <thead>
            <tr v-if="total_cat > 0">
            <th class="align-middle" scope="col">Category ID</th>
            <th class="align-middle" scope="col">Name</th>
            <th class="align-middle" scope="col">Description</th>
            <th class="align-middle" scope="col">Current Status</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="section in allSections">
            <td class="align-middle">{{section.id}}</td>
            <td class="align-middle">{{section.name}}</td>
            <td class="align-middle">{{section.description}}</td>
            <td class="align-middle">
                <span v-if="section.is_approved==true" class="badge bg-primary rounded-pill px-3">Approved</span> 
            </td>
            <td class="align-middle">
            </td>
            </tr>
        </tbody>
    </table>
    </div>`,
    data(){
        return {
            allSections : [],
            total_cat : null,
            token : localStorage.getItem('auth-token'),
            error : null,
        }
    },
    async mounted(){
        const res = await fetch(`/all-man-sections`, {
            headers :{
                "Authentication-Token" : this.token,
            },
        })
        const data = await res.json().catch((e)=>{})
        if (res.ok){
            this.allSections = data
            this.total_cat = data.length
            if (this.total_cat == 0){
                this.error = "No Category found!"
            }
        }else{
            this.error = data.message
        }
    },
}