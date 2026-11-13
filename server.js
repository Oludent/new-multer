require('dotenv').config()

const express = require('express');
const PORT = process.env.PORT
const multer = require('multer')
const sequelize = require('./database/database')
const productRouter = require('./routers/productRouter')

const app = express();

app.use(express.json());
app.use(productRouter);

app.use((err, req, res, next)=>{
    if(err instanceof multer.MulterError){
        return res.status(400).json({
            message: err.message
        })
    }

})

const dbConnect = async()=>{
    try {
        await sequelize.authenticate();
        console.log(`Database connection establised successfully`)
    } catch (error) {
        console.log(`Database failed to connect`, error.mesaage)
    }
}
dbConnect();

app.listen(PORT, ()=>{
    console.log(`Server is running on PORT: ${PORT}`)
})