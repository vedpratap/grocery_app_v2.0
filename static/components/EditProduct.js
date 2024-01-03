export default {
    props: ['prod_id'],
    template : `
    <div style="margin-top: 50px; margin-bottom: 50px; font-family: Arial;">
        <div class="card mx-auto" style="width: 40%;">
            <h5 class="card-header"><b>Edit Product</b></h5>
            <div class="card-body">
            <div class='text-danger' style="font-family: Garamond, serif;">{{error}}</div>
            <form>
                <div class="form-group">
                    <label for="prod-id">Product ID</label>
                    <input type="text" class="form-control" id="prod-id" v-model="cred.id" :placeholder="prod_id"  readonly>
                </div>
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
                        <option v-for="section in allSections">{{section.name}}</option>
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
                <button type="submit" class="btn btn-dark" @click="edit_prod(prod_id)">Edit Product</button>
                </div>
            </form>
            </div>
        </div>
    </div>`,

    data(){
        return{
            cred:{
                "id":null,
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
            Products : [],
            total_cat : null,
            token : localStorage.getItem('auth-token'),
            error : null,
        } 
    },
    methods :{
        async edit_prod(prod_id){
            const res = await fetch(`/edit-product/${this.prod_id}`, {
                method: 'POST',
                headers:{
                    'Content-Type':'application/json',
                    "Authentication-Token" : this.token,
                },
                body:JSON.stringify(this.cred),
            })
            const data = await res.json()
            if (res.ok){
                alert('Edited!')
                this.$router.push({path: '/'})
            } 
            else {
                this.error = data.message
                //alert(this.error)
            }
        }
    },
    async mounted(){
        const res = await fetch(`/get-product/${this.prod_id}`, {
            headers :{
                "Authentication-Token" : this.token,
            },
        })
        const data = await res.json()
        if (res.ok){
            this.cred.id = data.id
            this.cred.name = data.name
            this.cred.description = data.description
            this.cred.category_name = data.category_name
            this.cred.rate = data.rate
            this.cred.unit = data.unit
            this.cred.man_date = data.man_date
            this.cred.exp_date = data.expire_date
            this.cred.quantity = data.avl_quantity
        }else{
            this.error = res.status
        }
        const res1 = await fetch(`/all-man-sections`, {
            headers :{
                "Authentication-Token" : this.token,
            },
        })
        const data1 = await res1.json().catch((e)=>{})
        if (res1.ok){
            this.allSections = data1
        }else{
            this.error = data.message
        }
    },
}