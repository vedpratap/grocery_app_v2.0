export default {
    template : `<div>
    <div id="carouselExampleCaptions" class="carousel carousel-dark slide" data-bs-ride="carousel">
    <div class="carousel-indicators">
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="3" aria-label="Slide 4"></button>
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="4" aria-label="Slide 5"></button>
    </div>
    <div class="carousel-inner">
        <div class="carousel-item active">
        <img src="/static/images/vegetables.jpg" class="d-block w-100" alt="" height="500">
        <div class="carousel-caption d-none d-md-block">
            <h5>Vegetables</h5>
            <p></p>
        </div>
        </div>
        <div class="carousel-item">
        <img src="/static/images/spices.jpg" class="d-block w-100" alt="" height="500">
        <div class="carousel-caption d-none d-md-block">
            <h5>Spices</h5>
            <p></p>
        </div>
        </div>
        <div class="carousel-item">
        <img src="/static/images/milk.jpg" class="d-block w-100" alt="" height="500">
        <div class="carousel-caption d-none d-md-block">
            <h5>Dairy</h5>
            <p></p>
        </div>
        </div>
        <div class="carousel-item">
        <img src="/static/images/snacks.jpg" class="d-block w-100" alt="" height="500">
        <div class="carousel-caption d-none d-md-block">
            <h5>Snacks</h5>
            <p></p>
        </div>
        </div>
        <div class="carousel-item">
        <img src="/static/images/meat.jpg" class="d-block w-100" alt="" height="500">
        <div class="carousel-caption d-none d-md-block">
            <h5>Meat/Egg</h5>
            <p></p>
        </div>
        </div>
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
    </button>
    </div>
    <br><br>
    <div class="accordion" id="accordionExample">
    <div class="accordion-item">
        <h2 class="accordion-header">
        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
            <h5>Recently Added Products (Latest 5)</h5>
        </button>
        </h2>
        <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
        <div class="accordion-body">
        <div>
        <form>
        <div class="form-group">
        <label for="filter1"><b>Category</b></label>
        <select id="filter1" style="width: 200px;" class="form-select form-select-sm" aria-label="Small select example" v-model="filter1">
        <option selected value="all">All</option>
        <option v-for="section in allSections">{{section.name}}</option>
        </select>
        </div>
        </form>
        </div>
        <div class='text-danger'>{{error}}</div>
        <div class="row" v-if="latest">
        <div v-for="(product, index) in allProducts" v-if="(filter1=='all' || filter1==product.category_name) && index < 5" class="col-sm-6" style="width: 24rem;">
        <div class="card text-bg-light mb-3" style="max-width: 25rem;">
        <div class="card-header"><b>Category :</b> {{product.category_name}}</div>
        <div class="card-body">
            <h5 class="card-title">{{product.name}}</h5>
            <b>Description :</b> {{product.description}}<br>
            <b>Rate :</b> &#8377{{product.rate}}/{{product.unit}}<br>
            <b>Manufacture Date :</b> {{product.man_date}}<br>
            <b>Expiry Date :</b> {{product.expire_date}}<br>
            <b>Stock :</b>  <span v-if="product.avl_quantity > 0" class="badge bg-success rounded-pill px-3">Available</span> 
            <span v-if="product.avl_quantity == 0" class="badge bg-danger rounded-pill px-3">Not Available</span><br>
            <p v-if="product.avl_quantity > 0"><b>Available Stock :</b> {{product.avl_quantity}}</p><br>
            <div class="text-center">
            <button v-if="product.avl_quantity > 0" type="button" class="btn btn-dark" @click="buy(product.id)">Buy</button>
            <button v-if="product.avl_quantity <= 0"type="button" class="btn btn-dark" disabled>Buy</button>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-cart4" viewBox="0 0 16 16">
            <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5M3.14 5l.5 2H5V5zM6 5v2h2V5zm3 0v2h2V5zm3 0v2h1.36l.5-2zm1.11 3H12v2h.61zM11 8H9v2h2zM8 8H6v2h2zM5 8H3.89l.5 2H5zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0m9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0"/>
            </svg>
            </div>
        </div>
        </div>
        </div>
        </div>
        </div>
        </div>
    </div>
    <div class="accordion-item">
        <h2 class="accordion-header">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
        <h5>All Products</h5>
        </button>
        </h2>
        <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
        <div class="accordion-body">
        <div>
        <form>
        <div class="form-group">
        <label for="filter1"><b>Category</b></label>
        <select id="filter1" style="width: 200px;" class="form-select form-select-sm" aria-label="Small select example" v-model="filter1">
        <option selected value="all">All</option>
        <option v-for="section in allSections">{{section.name}}</option>
        </select>
        </div>
        </form>
        </div>
        <div class='text-danger'>{{error}}</div>
        <div class="row">
        <div v-for="product in allProducts" v-if="(filter1=='all' || filter1==product.category_name)" class="col-sm-6" style="width: 24rem;">
        <div class="card text-bg-light mb-3" style="max-width: 25rem;">
        <div class="card-header"><b>Category :</b> {{product.category_name}}</div>
        <div class="card-body">
            <h5 class="card-title">{{product.name}}</h5>
            <b>Description :</b> {{product.description}}<br>
            <b>Rate :</b> &#8377{{product.rate}}/{{product.unit}}<br>
            <b>Manufacture Date :</b> {{product.man_date}}<br>
            <b>Expiry Date :</b> {{product.expire_date}}<br>
            <b>Stock :</b>  <span v-if="product.avl_quantity > 0" class="badge bg-success rounded-pill px-3">Available</span> 
            <span v-if="product.avl_quantity == 0" class="badge bg-danger rounded-pill px-3">Not Available</span><br>
            <p v-if="product.avl_quantity > 0"><b>Available Stock :</b> {{product.avl_quantity}}</p><br>
            <div class="text-center">
            <button v-if="product.avl_quantity > 0" type="button" class="btn btn-dark" @click="buy(product.id)">Buy</button>
            <button v-if="product.avl_quantity <= 0"type="button" class="btn btn-dark" disabled>Buy</button>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-cart4" viewBox="0 0 16 16">
            <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5M3.14 5l.5 2H5V5zM6 5v2h2V5zm3 0v2h2V5zm3 0v2h1.36l.5-2zm1.11 3H12v2h.61zM11 8H9v2h2zM8 8H6v2h2zM5 8H3.89l.5 2H5zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0m9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0"/>
            </svg>
            </div>
        </div>
        </div>
        </div>
        </div>
        </div>
        </div>
        </div>
    </div>
    </div>
    </div>`,
    data(){
        return {
            allSections :[],
            allProducts:[],
            latest:true,
            total_prod:null,
            filter1:"all",
            filter2:"all",
            options:[
                {text:"Available",value:true},
                {text:"Not Available", value:false}
            ],
            token: localStorage.getItem('auth-token'),
            error: null,
        }
    },
    methods:{
        async buy(prod_id){
            this.$router.push(`/add_cart_form/${prod_id}`)
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
    },
}