import "../../config.js";
import express from 'express';


const app=express();

app.use(express.json());

type ProductData={
    id:number,
    name:string,
    email:string,
    role:"admin" | "user";
}
const users: Array<ProductData> = [
    {id:1,name:"soap",email:"sabi@gmail.com",role:"admin"},
    {id:2,name:"mug",email:"asus@gmail.com",role:"user"},
    {id:3,name:"slippers",email:"samsung@gmail.com",role:"admin"},
    {id:4,name:"brush",email:"android@gmail.com",role:"user"},
]

app.get('/users',(req:express.Request,res:express.Response)=>{
    console.log(`Service A GET/users called`);
res.json({
        success:true,
        service:process.env.SERVICE_NAME,
        count:users.length,
        data:users
    });
})

app.get("/users/:id",(req:express.Request,res:express.Response)=>{
    const rawId=req.params.id;
    const id=Number(rawId);
    const user=users.find(u => u.id ===id);
    console.log(`[SERVICE A] GET /users/${id} called`);

if(!user){
    return res.status(404).json({
        success:false,
        message:`User with id ${id} not found`
    });
}
return res.json({
    success:true,
    service:'Fetching Users',
    data:user
});

});


app.post("/users",(req:express.Request,res:express.Response)=>{

    const {name,email,role}=req.body;


    

    console.log("[SERVICE A] POST /users called",req.body);

    if(!name || !email){
        return res.status(400).json({
            success:false,
            message:"Name and email are required"
        });
    }

const newUser:UserData={
    id:users.length +1,
    name,
    email,
    role:role || 'user'
};
users.push(newUser);

 res.status(201).json({
    success: true,
    service: 'creating users',
    message: 'User created successfully',
    data: newUser
  });
});


app.get('/health', (req:express.Request, res:express.Response) => {
  res.json({
    success: true,
    service: process.env.SERVICE_NAME,
    status: 'running',
    port:process.env.PORT1
  });
});


const PORT = process.env.PORT1 || 4001;
app.listen(PORT, () => {
  console.log(`Service A (Users) running on port ${PORT}`);
});