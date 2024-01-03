export default {
    template: `<div>
    <h5>Available Products</h5>
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
        }
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
            if (this.total_prod==0){
                this.error = "No Product found!"
            }
        }
        else{
            this.error = data.message
        }
    },
}