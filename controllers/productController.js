const {Product} = require('../models');
const fs = require('fs')

exports.addProduct = async (req, res)=>{
    try {
        console.log("Start")
        const {productName, price, stock} = req.body;
        const filesPaths = req.files.map((el) => el.path)

        const prod = await Product.findOne({where: {productName}})
        console.log("Middle")

        if (prod) {
            return res.status(400).json({
                message: `Product already exist!`
            })
        }

        const product = await Product.create({
            productName,
            price,
            stock,
            productImages: filesPaths
        })
        console.log("End")

        res.status(201).json({
            message: `Product created successfully!`,
            data: product
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
} 

exports.getAllProduct = async (req, res) => {
    try {
        const allProd = await Product.findAll()
        res.status(200).json({
            message: `All products found and the total is: ${allProd.length}`,
            data: allProd
        })
        
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.getOneProduct = async (req, res) =>{
    try {
        const {id} = req.params
        const product = await Product.findByPk(id, {attributes: ['productName', 'price', 'productImage']})
        if(!product){
            return res.status(404).json({
                message:`Product not found`
            })
        } 
        res.status(200).json({
            message: `Product found successfully`,
            data: product
        })
    } catch (error) {
         res.status(500).json({
            message: error.message
        })
    }
}

exports.updateProduct = async (req, res)=>{
    try {
        const {id} = req.params
        const {productName, price, stock} = req.body
        const prod = await Product.findByPk(id)
        if(!prod){
            return res.status(404).json({
                message: `Product not found`
            })
        }

        const data = {
            productName,
            price,
            stock
        }

        if(req.files && req.files.length > 0){
            const oldFilePath = prod.productImages;
            oldFilePath.forEach(element => {
                 fs.unlinkSync(element);
            });
           
            data.productImages = req.files.map((el)=> el.path)
        }

        await prod.update(data)
        res.status(200).json({
            message: `Product updated succesfully!`
        })
    } catch (error) {
          res.status(500).json({
            message: error.message
        })
    }
}

exports.deleteProduct = async (req, res)=>{
    try {
        const id = req.params.id
        const prod = await Product.findByPk(id)
        if(!prod){
            return res.status(404).json({
                message: `Product not found`
            })
        }

        if (prod.productImage){ 
         const oldFilePath = prod.productImage
          fs.unlinkSync(oldFilePath);
        }

        await prod.destroy()
        res.status(200).json({
            message: `Product deleted successfully`
        })

    } catch (error) {
          res.status(500).json({
            message: error.message
        })
    }
}

exports.addOrRemoveImage = async (req, res) => {
    try {
        const id = req.params.id
        const {removedPaths} = req.body
          const prod = await Product.findByPk(id)
        if(!prod){
            return res.status(404).json({
                message: `Product not found`
            })
        }

        const filePaths = req.files.map((el)=>el.path)
        const files = prod.productImages

        const productImagess = files.concat(filePaths)

        await prod.update(productImagess)
        res.status(200).json({
            message: `Product added succesfully!`
        })
    } catch (error) {
          res.status(500).json({
            message: error.message
        })
    }
}