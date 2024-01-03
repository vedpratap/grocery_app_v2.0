export default {
    template : `<div>
<h5>Your Report</h5>
<div class="text-right">
    <button type="button" class="btn btn-light" onclick="window.print()">Print Report <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-printer-fill" viewBox="0 0 16 16">
    <path d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1"/>
    <path d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1"/>
    </svg></button>
</div>
<div v-if="totalOrders==0">
<p style="display:inline-block;">
<img src="/static/images/logo.png" alt="/" width="120" height="120" class="d-inline-block">
Ved's Grocery Store<br><br>
</p>
<div class="text-left">
<b>Name : </b>{{name}}<br>
<b>Email Id : </b>{{email}}<br>
<b>Address : </b>{{address}}<br>
<b>Mobile No. : </b>{{mobile_no}}<br>
</div>
<br>
Dear {{name}},<br><br>
<b style="color:red;">You have not made any order till now! Please visit and make order.</b><br><br>
</div>
<div v-if="totalOrders > 0">
<p style="display:inline-block;">
<img src="/static/images/logo.png" alt="/" width="120" height="120" class="d-inline-block">
Ved's Grocery Store<br><br>
</p>
<div class="text-left">
<b>Name : </b>{{name}}<br>
<b>Email Id : </b>{{email}}<br>
<b>Address : </b>{{address}}<br>
<b>Mobile No. : </b>{{mobile_no}}<br>
</div>
<br>
Dear {{name}}, Please find below the detail of your all orders. Thanks<br><br>
<div class="row" v-for="order in allOrders">
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
    </div>
    <br><br>
    Best Wishes,<br>Ved Grocery Store
</div>`,
data(){
    return {
        allOrders : [],
        totalOrders : null,
        allOrdersItems:[],
        totalallOrdersItems:null,
        name:null,
        email:null,
        address:null,
        mobile_no:null,
        token: localStorage.getItem('auth-token'),
        error : null, 
    }
},
async mounted(){
    const res0 = await fetch(`/user-info`,{
        headers :{
            "Authentication-Token" : this.token,
        },
    })
    const data0 = await res0.json()
    if (res0.ok){
        this.name = data0.fullname
        this.email = data0.email
        this.address = data0.address
        this.mobile_no = data0.mobile_no
    }
    else{
        this.error = data.message
    }
    const res = await fetch(`/get-orders`,{
        headers :{
            "Authentication-Token" : this.token,
        }
    })
    const data = await res.json()
    if (res.ok){
        this.allOrders = data
        this.totalOrders = data.length
    }
    else{
        this.totalOrders = 0
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
        this.totalallOrdersItems = 0
    }
}
}