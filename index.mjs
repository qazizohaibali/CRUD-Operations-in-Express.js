import express from 'express'
import cors from 'cors'

const app = express()
const port = 4001

app.use(express.json())
app.use(cors())
// app.get('/',(req,res)=>{
//     res.send("ALHUMDULILLAH")
// })

// app.listen(port,()=>{
//     console.log(`we are listening on port ${port}`)
// })

let products = []

app.post('/product', (req, res) => {

    let body = req.body

    if (
        !body.name ||
        !body.description ||
        !body.price
    ) {
        res.status(400)
        res.send({
            message: "required paramters are missing"
        })
        return;
    }

    console.log(body.name)
    console.log(body.description)
    console.log(body.price)

    products.push({
        id: new Date().getTime(),
        name: body.name,
        description: body.description,
        price: body.price
    })

    res.send({
        message: "Products are added Succesfully"
    })
})

app.get('/products',(req,res)=>{
    res.send({
        message:"got all products succesfully",
        data:products
    })
})

app.delete('/product/:id',(req,res)=>{
   
    const id = req.params.id
    
    let isfound = false;
    for(let i=0 ; i <products.length ;i++ ){
        if(products[i].id==id){
            products.splice(i,1)
            res.send({
                message:`your product is found `,
              })
            isfound=true
            break;
        }
    }

    if(isfound === false){
        res.send({
            message:"delete failed : Product is not found"
        })
    }
})

app.get('/product/:id',(req,res)=>{

    const id = req.params.id
    let isfound = false
    for (let i=0; i<products.length ; i++){
        if(products[i].id === id){
            products.splice(i,1)
            res.send({
                message:"Product is Deleted Successfully"
            })   
            isfound = true
            break;
        } 
        
    }
    if(!isfound){
        res.status(404)
        res.send({
            message:"Product is Not Deleted"
        })
    }
})

app.put('/product/:id',(req,res)=>{

    const body = req.body
    const id = +req.params.id

    if(
        !body.name ||
        !body.description ||
        !body.price
    ){
        res.status(404)
        res.send({
            message:"Products are missing"
        })
    }

    let isfound = false;

    for(let i =0 ; i<products.length ; i++){
        if(products[i].id===id){
            products[i].name = body.name
            products[i].description = body.description
            products[i].price = body.price

            res.send({
                message:"Product are successfully modified"
            })
            isfound = true
            break;
        }
        
    }

    if(!isfound){
        res.send({
            message:"Product Can't Be Edited"
        })
    }

})

app.listen(port, ()=>{
    console.log(`we are listening on port ${port}`)
})