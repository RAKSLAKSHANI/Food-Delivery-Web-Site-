import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js';

// Placing user order for frontend
const placeOrder = async (req, res) => {

    const frontend_url = "http://localhost:5174"; // Frontend URL

    try {
        // Save the order to the database
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,  // You can keep the amount or set a fixed amount for now
            address: req.body.address
        });

        await newOrder.save();  // Save the order in the database

        // Clear the user's cart after order placement
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // Simulate the payment process (skip real payment gateway)
        // You can add success/cancel URLs for frontend redirection (optional)
        const session_url = `${frontend_url}/verify?success=true&orderId=${newOrder._id}`;

        res.json({
            success: true,
            message: "Order placed successfully",  // Success message
            session_url: session_url  // Provide URL for order confirmation
        });
        
    } catch (error) {
        console.log(error);  // Log errors for debugging
        res.json({ success: false, message: "Error in placing order" });
    }
};

const verifyOrder = async (req,res)  => {
    const {orderId,success} = req.body;
    try{
      if (success=="true") {
         await orderModel.findByIdAndUpdate(orderId,{payment:true});
         res.json({success:true,message:"Paid"})
      }
      else{
        await orderModel.findByIdAndDelete(orderId);
        res.json({success:false,message:"Not Paid"})
      }
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Ërror"})
    }
}

// user order for frontend
const userOrders = async (req,res) => {
     try{
        const orders = await orderModel.find({userId:req.body.userId});
        res.json({success:true,data:orders})
     } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
     }
}

// Listing orders for admin panel
const listOrders = async (req,res) => {
       try {
           const orders = await orderModel.find({});
           res.json({success:true,data:orders})
       } catch (error) {
           console.log(error);
           res.json({success:false,message:"Error"}) 
       }
}

// api for updating order status
const updateStatus = async (req,res) => {
     try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
        res.json({success:true,message:"Status Updated"})
     } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
     }                
}

export { placeOrder,verifyOrder,userOrders,listOrders,updateStatus };