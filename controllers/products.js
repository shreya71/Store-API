const Product = require('../models/products')

const getAllProductsStatic = async (req, res)=>{
    // throw new Error('testing async errors')
    // const search = 'b'
    // const products = await Product.find({
    //     name: {$regex:search, $options: 'i'},
    //     //name the property here
    //     //name: 'vase table',
    // })
    const products = await Product.find({}).sort('-name price')
    res.status(200).json({products, nbHits: products.length})
}


const getAllProducts = async (req, res)=>{
    //pulling out only req feature
    const {featured, company, name, sort} = req.query
    const queryObject = {}

    if(featured) {
        queryObject.featured = featured === 'true' ? true : false
    }
    if(company) {
        queryObject.company = company
    }
    if(name) {
        queryObject.name = { $regex: name, $options: 'i'}
        //queryObject.name = name
    }
    console.log(queryObject)
    //sort if user asks for it
    let result = Product.find(queryObject)
    if(sort){
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    }
    else{
        result = result.sort('createAt')
    }
    const products = await result
    res.status(200).json({products, nbHits: products.length})
}

module.exports = {
    getAllProducts,
    getAllProductsStatic, 
}