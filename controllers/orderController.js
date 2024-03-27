const orderDetailSchema= require("../models/orderDetail");

const addOrder=async(req,res)=>{
    try{
        const {order_id,amount,profit,quantity,category,sub_category,payment_mode,order_date,customer_name,state,city}=req.body;
        const product=await orderDetailSchema.create({
            order_id :order_id,
            amount:amount,
            profit:profit,
            quantity:quantity,
            category:category,
            sub_category:sub_category,
            payment_mode:payment_mode,
            order_date:order_date,
            customer_name:customer_name,
            state:state,
            city:city,
        });
        console.log("Added Order")
        res.status(201).json({product:product,message:"Added the Order Details Successfully"});
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Something went wrong"});
    }
};

const getData=async(req,res)=>{
    try{
        const topSellingProduct = await orderDetailSchema.aggregate([
            {
              $group: {
                _id: '$sub_category',
                totalQuantitySold: { $sum: '$quantity' },
              },
            },
            {
              $sort: { totalQuantitySold: -1 }
            },
            {
              $limit: 1
            }
          ]);
      
          // Aggregate the total amount spent by each customer
          const topCustomer = await orderDetailSchema.aggregate([
            {
              $group: {
                _id: '$customer_name',
                totalAmountSpent: { $sum: '$amount' },
              },
            },
            {
              $sort: { totalAmountSpent: -1 }
            },
            {
              $limit: 1
            }
          ]);

        const totals = await orderDetailSchema.aggregate([
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: '$amount' },
                    totalProfit: { $sum: '$profit' },
                    totalProducts: { $sum: '$quantity' }
                }
            }
        ]);
        const formattedStats = [
            { label: 'Total Revenue', value: `${totals[0].totalRevenue}` },
            { label: 'Total Profit', value: `${totals[0].totalProfit}` },
            { label: 'Total Product', value: `${totals[0].totalProducts}` },
            { label: 'Total Orders', value: `${totals[0].totalOrders}` }
          ];
        res.status(200).json({stats:formattedStats,Top_Product:topSellingProduct[0]._id,Top_Costumer:topCustomer[0]._id});
    }
    catch(err){
        console.log(error);
        res.status(500).json({message:"Something went wrong"});
    }

};

const lineChart=async(req,res)=>{
    try {
        const { filter } = req.body;
        console.log(filter);
        let matchStage = {};

        switch (filter) {
            case 'daily':
                matchStage = { $match: { order_date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } } };
                break;
            case 'weekly':
                matchStage = {
                    $match: {
                        order_date: {
                            $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000),
                            $lt: new Date()
                        }
                    }
                };
                break;
            case 'monthly':
                matchStage = {
                    $match: {
                        order_date: {
                            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                            $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
                        }
                    }
                };
                break;
            case 'yearly':
                matchStage = {
                    $match: {
                        order_date: {
                            $gte: new Date(new Date().getFullYear(), 0, 1),
                            $lt: new Date(new Date().getFullYear() + 1, 0, 1)
                        }
                    }
                };
                break;
            default:
                break;
        }

        const analysis = await orderDetailSchema.aggregate([
            matchStage,
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$amount' },
                    totalProfit: { $sum: '$profit' },
                    totalOrders: { $sum:  '$Profit'}
                }
            }
        ]);

        res.json(analysis);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const stateWise=async(req,res)=>{
    try {
        // Aggregate the total amount spent for each state
        const stateWiseAggregate = await orderDetailSchema.aggregate([
          {
            $group: {
              _id: '$state',
              totalAmountSpent: { $sum: '$amount' },
            },
          },
          {
            $sort: { totalAmountSpent: -1 }
          }
        ]);
    
        // If no data found, return 404
        if (stateWiseAggregate.length === 0) {
          return res.status(404).json({ message: 'No data found' });
        }
    
        // Return the state-wise aggregated data
        res.json(stateWiseAggregate);
      } catch (error) {
        // Handle errors
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
      }
}
module.exports={addOrder,getData,lineChart,stateWise};

