export default {
    template : `
    <div style="margin-top: 50px; margin-bottom: 50px; font-family: Arial;">
        <div class="card mx-auto" style="width: 40%;">
            <h5 class="card-header"><b>Add/Create Product</b></h5>
            <div class="card-body">
            <div class='text-danger' style="font-family: Garamond, serif;">{{error}}</div>
            <form>
                <div class="form-group">
                    <label for="prod-name">Name</label>
                    <input type="text" class="form-control" id="prod-name" placeholder="Enter Product Name" v-model="cred.name">
                </div>
                <div class="form-group">
                    <label for="prod-description">Description</label>
                    <input type="text" class="form-control" id="prod-description" placeholder="Enter Product Description" v-model="cred.description">
                </div>
                <div class="form-group">
                    <label for="category-name">Select Category</label>
                    <select id="category-name" class="form-select" aria-label="Default select example" v-model="cred.category_name">
                        <option v-for="section in allSections" >{{section.name}}</option>
                    </select>
                </div>
                <div class="form-group">
                     <label for="prod-rate">Rate</label>
                     <input type="text" class="form-control" id="prod-rate" name="prod-rate" v-model="cred.rate">
                </div>
                <div class="form-group">
                     <label for="prod-unit">Unit</label>
                     <input type="text" class="form-control" id="prod-unit" placeholder="Enter Product Unit" v-model="cred.unit">
                </div>
                <div class="form-group">
                     <label for="man-date">Manufacture Date</label>
                     <input type="date" class="form-control" id="man-date" name="man-date" v-model="cred.man_date">
                </div>
                <div class="form-group">
                     <label for="exp-date">Expiry Date</label>
                     <input type="date" class="form-control" id="exp-date" name="exp-date" v-model="cred.exp_date">
                </div>
                <div class="form-group">
                     <label for="avl-unit">Available Quantity</label>
                     <input type="text" class="form-control" id="avl-unit" placeholder="Enter Product Unit" v-model="cred.quantity">
                </div>
                <div class="text-center">
                <button type="submit" class="btn btn-dark" @click="addproduct">Add Product</button>
                </div>
            </form>
            </div>
        </div>
    </div>`,

    data(){
        return{
            cred:{
                "name": null,
                "description": null,
                "category_name": null,
                "rate" : null,
                "unit" : null,
                "man_date" : null,
                "exp_date" : null,
                "quantity" : null,
            },
            allSections : [],
            token : localStorage.getItem('auth-token'),
            error : null,
        } 
    },
    methods:{
        async addproduct() {
            const res1 = await fetch(`/create-product`,{
                method: 'POST',
                headers:{
                    'Content-Type':'application/json',
                    "Authentication-Token": this.token,
                },
                body:JSON.stringify(this.cred),
            })
            const data1 = await res1.json()
            if (res1.ok){
                alert('Product has been created')
                this.$router.push({path: '/'})
            } 
            else {
                this.error = data.message
                //alert(this.error)
            }
        },
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
        }else{
            this.error = data.message
        }
    },
}