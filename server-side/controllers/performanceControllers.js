const WalkIn = require ('../models/WalksInModel')
const SiteSales = require('../models/orderModel')

const getWalkInSales = async (req, res) =>{
    try {
        const response = await WalkIn.find({})
        res.status(200).json({
            status: 'success',
            data: response
        })
        
    } catch (error) {
        console.log(error)
    }
}

module.exports = getWalkInSales;