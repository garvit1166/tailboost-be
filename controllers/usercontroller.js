const bcrypt=require('bcrypt');
const userModel= require("../models/user");
const jwt=require("jsonwebtoken");
const SECRET_KEY="DATAAPI";

const signup=async(req,res)=>{

    //existing user check
    //hash password generation
    //user creation
    //token generation


    const {name,email,password}=req.body;
    console.log(name);
    try{
        //checking the existing user
        const existingUser= await userModel.findOne({email: email});
        if(existingUser){
            return res.status(400).json({message: "User already exist"});
        }
        //hashing the password
        const hashedPassword=await bcrypt.hash(password,10);
        //user creation
        const result=await userModel.create({
            name :name,
            email:email,
            password:hashedPassword
        });
        //token generation
        const token=jwt.sign({email:result.email,id:result._id},SECRET_KEY);
        res.status(201).json({user:result,token:token});


    }catch(error){
        console.log(error);
        res.status(500).json({message:"Something went wrong"});

    }



}

const signin=async(req,res)=>{

    const {email,password}=req.body;

    try{
        const existingUser= await userModel.findOne({email: email});
        if(!existingUser){
            return res.status(404).json({message: "User not found"});
        }
        const matchPassword= await bcrypt.compare(password,existingUser.password);
        if(!matchPassword){
            return res.status(400).json({message: "Invalid Credentials"});
        }
        const token=jwt.sign({email:existingUser.email,id:existingUser._id},SECRET_KEY);
        res.status(201).json({user:existingUser,token:token,message:"loggedIn Successful"});

    }
    catch{
        console.log(error);
        res.status(500).json({message:"Something went wrong"});
    }

}

module.exports={signin,signup};