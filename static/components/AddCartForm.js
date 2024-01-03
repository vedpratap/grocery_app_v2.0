export default {
    props:['prod_id'],
    template : `
    <div style="margin-top: 50px; margin-bottom: 50px; font-family: Arial;">
        <div class="card mx-auto" style="width: 40%;">
            <h5 class="card-header"><b>Add to Cart</b></h5>
            <div class="card-body">
            <div class='text-danger' style="font-family: Garamond, serif;">{{error}}</div>
            <form>
                <div class="form-group">
                    <label for="prod-id">Product ID</label>
                    <input type="text" class="form-control" id="prod-id" :placeholder="prod_id" readonly v-model="cred.id">
                </div>
                <div class="form-group">
                <label for="avl"><b>Availabilty</b></label>
                <input type="text" class="form-control" id="avl" placeholder="In Stock" style="background-color:#C7F6C7" readonly>
                </div>
                <div class="form-group">
                <label for="avlqty"><b>Available Quantity</b></label>
                <input type="text" class="form-control" id="avlqty" :placeholder="avl_quantity" style="background-color:#C7F6C7" readonly>
                </div>
                <div class="form-group">
                <label for="qty">Quantity</label>
                <input type="number" step="0.01" class="form-control" id="qty"  onchange="myFunction()" placeholder="Enter quantity" v-model="cred.quantity">
                <small id="qtyHelp" class="form-text text-muted">Enter quantity to buy and click outside to get total amount in <i>Total</i> field.</small>
                </div>
                <div class="form-group">
                <label for="rate">Rate</label>
                <input type="text" class="form-control" id="rate" placeholder="rate" v-model="cred.rate" readonly>
                </div>
                <div class="form-group">
                <label for="total">Total</label>
                <input type="text" class="form-control" id="total" placeholder="Total Amount" v-model="cred.total" disabled>
                </div>
                <div class="text-center">
                <button type="submit" class="btn btn-dark" @click="add_to_cart(cred.id)">Add to Cart</button>
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-cart4" viewBox="0 0 16 16">
                <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5M3.14 5l.5 2H5V5zM6 5v2h2V5zm3 0v2h2V5zm3 0v2h1.36l.5-2zm1.11 3H12v2h.61zM11 8H9v2h2zM8 8H6v2h2zM5 8H3.89l.5 2H5zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0m9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0"/>
                </svg>
                </div>
            </form>
            </div>
        </div>
    </div>`,
    data(){
        return {
            cred:{
                "id":null,
                "rate":null,
                "name":null,
                "category_name":null,
                "quantity":0,
                "total":0,
            },
            "error":null,
            "avl_quantity":null,
            "token" : localStorage.getItem('auth-token'),
            
        }
    },
    methods:{
        async add_to_cart(prod_id){
            const res = await fetch(`/add-to-cart/${prod_id}`,{
                method: 'POST',
                headers:{
                    'Content-Type':'application/json',
                    "Authentication-Token": this.token,
                },
                body:JSON.stringify(this.cred),
            })
            const data = await res.json()
            if (res.ok){
                alert("Product added to cart.")
                this.$router.push('/')
            }
            else{
                this.error = data.message
            }
        },
    },
    async mounted(){
        const res = await fetch(`/get-product/${this.prod_id}`,{
            headers :{
                "Authentication-Token" : this.token,
            },
        })
        const data = await res.json()
        if (res.ok){
            this.cred.id = data.id
            this.avl_quantity = data.avl_quantity
            this.cred.rate = data.rate
            this.cred.name = data.name
            this.cred.category_name = data.category_name
        }
        else{
            this.error = data.message
        }
    },
}