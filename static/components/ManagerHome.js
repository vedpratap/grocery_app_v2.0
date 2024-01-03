export default {
    template: `<div>
    <div style="display: flex; justify-content: flex-end;"><button type="button" class="btn btn-dark" @click="addprod()">+ Create New Product</button>&nbsp;<button type="button" class="btn btn-dark" @click="request()">Request to Admin</button></div>
    <br><br>
    <h4>All Products</h4>
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
    <div class="text-right">
    <button type="button" class="btn btn-light" @click="download_csv()">Download CSV <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
    <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
    </svg></button><span class="text-danger" v-if="isDownloading">Downloading...</span>
    </div>
    <br>
    <table class="table table-striped">
        <thead>
            <tr v-if="total_prod > 0">
            <th class="align-middle" scope="col">Product ID</th>
            <th class="align-middle" scope="col">Creator ID</th>
            <th class="align-middle" scope="col">Timestamp</th>
            <th class="align-middle" scope="col">Name</th>
            <th class="align-middle" scope="col">Description</th>
            <th class="align-middle" scope="col">Category ID</th>
            <th class="align-middle" scope="col">Category Name</th>
            <th class="align-middle" scope="col">Rate</th>
            <th class="align-middle" scope="col">Unit</th>
            <th class="align-middle" scope="col">Manufacture Date</th>
            <th class="align-middle" scope="col">Expiry Date</th>
            <th class="align-middle" scope="col">Stock</th>
            <th class="align-middle" scope="col">Available Units</th>
            <th class="align-middle" scope="col">Sold Units</th>
            <th class="align-middle" scope="col">Action</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="product in allProducts" v-if="filter=='all' || filter==(product.avl_quantity > 0)">
            <td class="align-middle">{{product.id}}</td>
            <td class="align-middle">{{product.man_id}}</td>
            <td class="align-middle">{{product.timestamp}}</td>
            <td class="align-middle">{{product.name}}</td>
            <td class="align-middle">{{product.description}}</td>
            <td class="align-middle">{{product.cat_id}}</td>
            <td class="align-middle">{{product.category_name}}</td>
            <td class="align-middle">{{product.rate}}</td>
            <td class="align-middle">{{product.unit}}</td>
            <td class="align-middle">{{product.man_date}}</td>
            <td class="align-middle">{{product.expire_date}}</td>
            <td class="align-middle">
                <span v-if="product.avl_quantity > 0" class="badge bg-success rounded-pill px-3">Available</span> 
                <span v-if="product.avl_quantity <= 0" class="badge bg-danger rounded-pill px-3">Not Available</span>
            </td>
            <td class="align-middle">{{product.avl_quantity}}</td>
            <td class="align-middle">{{product.sold_unit}}</td>
            <td>
            <button  type="button" class="btn btn-info" @click="edit_product(product.id)">Edit</button>
            <button  type="button" class="btn btn-danger" @click="delete_prod(product.id)">Remove</button>
            </td>
            </tr>
        </tbody>
    </table>
    </div>`,
    data(){
        return {
            allProducts: [],
            total_prod : null,
            filter:"all",
            options:[
                {text:"Available",value:true},
                {text:"Not available",value:false}
            ],
            token : localStorage.getItem('auth-token'),
            error: null,
            isDownloading : false,
        }
    },
    methods:{
        async addprod(){
            this.$router.push('/add_product')
        },
        async request(){
            this.$router.push('/manrqform')
        },
        async download_csv(){
            this.isDownloading = true
            const res = await fetch(`/download-csv`,{
                headers :{
                    "Authentication-Token" : this.token,
                }
            })
            const data = await res.json()
            if (res.ok){
                const task_id = data.task_id
                const int = setInterval(async() => {
                    const csv_res = await fetch(`/get-csv/${task_id}`)
                    if (csv_res.ok){
                        this.isDownloading = false
                        clearInterval(int)
                        window.location.href = `/get-csv/${task_id}`
                    }
                }); 
            }
        },
        async edit_product(prod_id){
            this.$router.push(`/edit_prod/${prod_id}`)
        }
        ,
        async delete_prod(prod_id) {
            const res = await fetch(`/delete-product/${prod_id}`,{
                headers :{
                    "Authentication-Token" : this.token,
                }
            })
            const data = await res.json()
            if (res.ok) {
                if(!alert('Product removed.')){window.location.reload();}
            }
            else{
                this.error = data.message
            }
        },
    },
    async mounted(){
        const res = await fetch(`/api/products`,{
            headers :{
                "Authentication-Token" : this.token,
            }
        })
        const data = await res.json()
        if (res.ok){
            this.allProducts = data
            this.total_prod = data.length
            if (this.total_prod == 0){
                this.error = "No product found!"
            }
        }
        else{
            this.error = data.message
        }
    },
}