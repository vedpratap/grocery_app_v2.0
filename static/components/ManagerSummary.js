export default {
    template: `<div>
    <h5>Summary</h5>
    <div class="text-right">
    <button type="button" class="btn btn-light" onclick="window.print()">Print Summary <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-printer-fill" viewBox="0 0 16 16">
    <path d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1"/>
    <path d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1"/>
    </svg></button>
    </div>
    <br>
    <div class="row">
    <div class="card"style="width:50rem">
    <div v-if="summary_3_status==true">
    <img  src="./static/images/summary3.jpg" class="card-img-top" alt="...">
    </div>
    <div v-if="summary_3_status==false">
    <img src="./static/images/no_data.jpg" class="card-img-top" alt="...">
    </div>
    <div class="card-body">
        <h5 class="card-title">Product bought</h5>
        <p class="card-text">Stock sold corresponding to each products</p>
    </div>
    <div class="card-footer text-muted">
    <img src="/static/images/logo.png" alt="/" width="40" height="30" class="d-inline-block align-text-top">
    <cite>Grocery Store</cite>
    </div>
    </div>
    </div>
    <br>
    <div class="row">
    <div class="col-sm-6">
        <div class="card">
        <div v-if="summary_1_status==true">
        <img  src="./static/images/summary1.jpg" class="card-img-top" alt="...">
        </div>
        <div v-if="summary_1_status==false">
        <img src="./static/images/no_data.jpg" class="card-img-top" alt="...">
        </div>
        <div class="card-body">
            <h5 class="card-title">Category wise products.</h5>
            <p class="card-text">Number of products available under each categories</p>
        </div>
        <div class="card-footer text-muted">
        <img src="/static/images/logo.png" alt="/" width="40" height="30" class="d-inline-block align-text-top">
        <cite>Grocery Store</cite>
        </div>
        </div>
        <br>
    </div>
    <div class="col-sm-6">
        <div class="card">
        <div v-if="summary_2_status==true">
        <img  src="./static/images/summary2.jpg" class="card-img-top" alt="...">
        </div>
        <div v-if="summary_2_status==false">
        <img src="./static/images/no_data.jpg" class="card-img-top" alt="...">
        </div>
        <div class="card-body">
            <h5 class="card-title">Available Stock</h5>
            <p class="card-text">Available stock corresponding to each product.</p>
        </div>
        <div class="card-footer text-muted">
        <img src="./static/images/logo.png" alt="/" width="40" height="30" class="d-inline-block align-text-top">
        <cite>Grocery Store</cite>
        </div>
        </div>
    </div>
    </div>
    </div>`,
    data(){
        return {
            summary_1_status :null,
            summary_2_status :null,
            summary_3_status :null,
            token: localStorage.getItem('auth-token')
        }
    },
    async mounted(){
        const res1 = await fetch(`/manager-summary-1`,{
            headers :{
                "Authentication-Token" : this.token,
            },
        })
        if (res1.ok){
            this.summary_1_status = true
        }
        else{
            this.summary_1_status = false
        }
        const res2 = await fetch(`/manager-summary-2`,{
            headers :{
                "Authentication-Token" : this.token,
            },
        })
        if (res2.ok){
            this.summary_2_status = true
        }
        else{
            this.summary_2_status = false
        }
        const res3 = await fetch(`/manager-summary-3`,{
            headers :{
                "Authentication-Token" : this.token,
            },
        })
        if (res3.ok){
            this.summary_3_status = true
        }
        else{
            this.summary_3_status = false
        }
    }
}