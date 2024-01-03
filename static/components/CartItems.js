export default{
    template : `<div>
    <h5>Your cart items</h5>
    <div class="text-danger">{{error}}</div>
    <br>
    <form>
    <div class="form-group">
    <select id="filter" style="width: 150px;" class="form-select form-select-sm" aria-label="Small select example" v-model="filter">
    <option selected value="all">All</option>
    <option v-for="section in allSections">{{section.name}}</option>
    </select>
    </div>
    </form>
    <table class="table table-striped">
    <thead >
        <tr v-if="total_items > 0">
        <th class="align-middle" scope="col">Product Name</th>
        <th class="align-middle" scope="col">Product Category</th>
        <th class="align-middle" scope="col">Rate</th>
        <th class="align-middle" scope="col">Added Quantity</th>
        <th class="align-middle" scope="col">Total Amount</th>
        <th class="align-middle" scope="col">Action</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="item in allItems" v-if="filter=='all' || filter==item.category_name">
        <td class="align-middle">{{item.name}}</td>
        <td class="align-middle">{{item.category_name}}</td>
        <td class="align-middle">{{item.rate}}</td>
        <td class="align-middle">{{item.quantity}}</td>
        <td class="align-middle">{{item.total_amount}}</td>
        <td class="align-middle">
        <button  type="button" class="btn btn-danger"  @click="remove_from_cart(item.id)">Remove from cart</button>
        </td>
        </tr>
    </tbody>
    </table>
    <br>
    <div class="text-right">
    <h6 v-if="total_items > 0">Grand Total Amount : {{grand_total}}</h6><br>
    </div>
    <div class="text-right" v-if="total_items > 0">
    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-list-check" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3.854 2.146a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708L2 3.293l1.146-1.147a.5.5 0 0 1 .708 0m0 4a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708L2 7.293l1.146-1.147a.5.5 0 0 1 .708 0m0 4a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0"/>
    </svg>
    <button type="submit" class="btn btn-success" @click="place_order()">Place Order</button>
    </div>
    </div>`,
    data(){
        return{
            allItems :[],
            allSections :[],
            filter : "all",
            total_items : null,
            grand_total:0,
            token : localStorage.getItem('auth-token'),
            error: null,
        }
    },
    methods:{
        async place_order(){
            const res = await fetch(`/place-order`,{
                headers :{
                    "Authentication-Token" : this.token,
                }
            })
            const data = await res.json()
            if (res.ok){
                alert("Order has been placed! Click OK to go on Order page.")
                this.$router.push('/orders')
            }
            else{
                this.error = data.message
            }
        },
        async remove_from_cart(item_id){
            const res = await fetch (`/delete-cart-item/${item_id}`,{
                headers :{
                    "Authentication-Token" : this.token,
                }
            })
            const data = await res.json()
            if (res.ok){
                if(!alert('Selected item has been removed.')){window.location.reload();}
            }
            else{
                this.error = data.message
            }
            },
    },
    async mounted(){
        const res = await fetch(`/cart-items`,{
            headers :{
                "Authentication-Token" : this.token,
            }
        })
        const data = await res.json()
        if (res.ok){
            this.allItems = data
            this.total_items = data.length
            let g_total = 0
            for (let i=0;i<data.length;i++){
                g_total += data[i].total_amount
            }
            this.grand_total = g_total
        }
        else{
            this.error = data.message
        }
        const res1 = await fetch(`/all-user-sections`, {
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
    }
}
