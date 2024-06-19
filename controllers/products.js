const Product = require('../models/products')

const getAllProductsStatic = async (req, res)=>{
    // throw new Error('testing async errors')
    // const search = 'b'
    // const products = await Product.find({
    //     name: {$regex:search, $options: 'i'},
    //     //name the property here
    //     //name: 'vase table',
    // })
    const products = await Product.find({price: { $gt: 30 }})
    .sort('name')
    .select('name price')
    //.limit(10).skip(1)
    res.status(200).json({products, nbHits: products.length})
}


const getAllProducts = async (req, res)=>{
    //pulling out only req feature
    const {featured, company, name, sort, fields, numericFilters } = req.query
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
    if(numericFilters){
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        }
        const regEx = /\b(<|>|>=|=|<|<=)\b/g
        let filters = numericFilters.replace(
            regEx,
            (match)=> `-${operatorMap[match]}-`
        )
        const options = ['price','rating']
        filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-')
            if(options.includes(field)){
                queryObject[field] = { [operator]: Number(value) }
            }
        })
    }


    console.log(queryObject)
    //sort if user asks for it
    let result = Product.find(queryObject)
    //sort
    if(sort){
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    }
    else{
        result = result.sort('createAt')
    }

    if(fields){
        const fieldsList = fields.split(',').join(' ')
        result = result.select(fieldsList)
    }
    
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page-1) * limit

    result = result.skip(skip).limit(limit)
    
    const products = await result
    res.status(200).json({products, nbHits: products.length})
}

module.exports = {
    getAllProducts,
    getAllProductsStatic, 
}