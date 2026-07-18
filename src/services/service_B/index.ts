import "../../config.js";
import express from 'express';


const app=express();

app.use(express.json());

type ProductData={
    id:number,
    name:string,
    price:number,
    country:string
}
const products: Array<ProductData> = [
    {id:1,name:"soap",price:4000,country:"America"},
    {id:2,name:"mug",price:5000,country:"china"},
    {id:3,name:"slippers",price:6000,country:"cabo verde"},
    {id:4,name:"brush",price:1000,country:"ireland"},
]

app.get('/products',(req:express.Request,res:express.Response)=>{
    console.log(`Service B GET/products called`);
res.json({
        success:true,
        service:"Fetching product details",
        count:products.length,
        data:products
    });
})

app.get("/products/:id",(req:express.Request,res:express.Response)=>{
    const rawId=req.params.id;
    const id=Number(rawId);
    const product=products.find(u => u.id ===id);
    console.log(`[SERVICE B] GET /products/${id} called`);

if(!product){
    return res.status(404).json({
        success:false,
        message:`product with id ${id} not found`
    });
}
return res.json({
    success:true,
    service:'Fetching Products',
    data:product
});

});


app.post("/products",(req:express.Request,res:express.Response)=>{

    const {name,price,country}=req.body;


    

    console.log("[SERVICE B] POST /products called",req.body);

    if(!name || !price){
        return res.status(400).json({
            success:false,
            message:"Name and price are required"
        });
    }

const newProduct:ProductData={
    id:products.length +1,
    name,
    price,
    country
    
};
products.push(newProduct);

 res.status(201).json({
    success: true,
    service: 'creating products',
    message: 'Product created successfully',
    data: newProduct
  });
});


app.get('/health', (req:express.Request, res:express.Response) => {
  res.json({
    success: true,
    service: "Health checkup",
    status: 'running',
    port:process.env.PORT2
  });
});


const PORT = process.env.PORT2 || 4002;
app.listen(PORT, () => {
  console.log(`Service B (Products) running on port ${PORT}`);
});