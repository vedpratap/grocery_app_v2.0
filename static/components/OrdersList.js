export default {
    template : `<div>
    <h5>Your Orders</h5>
    <div class="text-danger">{{error}}</div>
    <br>
    <div class="row" v-if="total_orders > 0" v-for="order in allOrders">
    <div class="card" style="width: 60rem;">
    <div class="card-body">
        <h5 class="card-title">Order ID : {{order.id}}</h5>
        <h6>Time Stamp : <span class="badge text-bg-light">{{order.timestamp}}</span></h6>
        <br>
        <h6><b>Ordered Items</b></h6><br>
        <table class="table">
        <thead>
            <tr>
            <th scope="col">Product Name</th>
            <th scope="col">Category</th>
            <th scope="col">Rate/Unit</th>
            <th scope="col">Ordered Quantity</th>
            <th scope="col">Total Amount</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="order in allOrdersItems[order.id]">
            <td>{{order[0]}}</td>
            <td>{{order[1]}}</td>
            <td>{{order[2]}}</td>
            <td>{{order[3]}}</td>
            <td>{{order[4]}}</td>
            </tr>
        </tbody>
        </table>
        <div class="text-right">
        <p class="card-text"><b>Grand Total Amount : </b><span class="badge text-bg-light">{{order.total_amount}}</span></p>
        </div>
        <p class="card-text"><b>Shipping Address : </b>{{order.shipping_add}}</p>
        <p class="card-text"><b>Contact : </b>{{order.mobile_no}}</p>
        <p class="card-text"><b>Status : </b><span class="badge text-bg-success">{{order.status}}</span></p>
        <p class="card-text"><b>Payment Status : </b><span class="badge text-bg-success">Paid</span></p>
    </div>
    </div>
    </div>
    </div>`,
    data(){
        return{
            allOrders : [],
            allOrdersItems :[],
            total_orders : null,
            token : localStorage.getItem('auth-token'),
            error:null,
        }
    },
    async mounted(){
        const res = await fetch(`/get-orders`,{
            headers :{
                "Authentication-Token" : this.token,
            }
        })
        const data = await res.json()
        if (res.ok){
            this.allOrders = data
            this.total_orders = data.length
            if (this.total_orders == 0){
                this.error = "No orders found!"
            }
        }
        else{
            this.error = data.message
        }
        const res1 = await fetch(`/get-orders-items`,{
            headers :{
                "Authentication-Token" : this.token,
            }
        })
        const data1 = await res1.json()
        if (res1.ok){
            this.allOrdersItems = data1
        }
        else{
            this.error = data.message
        }
    }
}