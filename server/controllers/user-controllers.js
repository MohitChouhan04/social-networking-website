const User = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const formidable = require('formidable');
const cloudinary = require('../config/cloudinary');

exports.signin = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
      return res.status(400).json({ msg: "serName , email , password are required" });
    }
    
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ msg: "User is already register! please Login" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword) {
      res.status(400).json({ msg: "error in password hashing! " });
    }
    const user = new User({
      userName,
      email,
      password: hashedPassword,
    });
    const result = await user.save();
    if (!result) {
      return res.status(400).json({ msg: "error while saving user! " });
    }
    const accessToken = jwt.sign(
      { token: result._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    if (!accessToken) {
      return res.status(400).json({ msg: "error while genrating token!" });
    }
    res.cookie("token", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: "none",
      secure: true,
      partitioned : true,
    });

    res.status(201).json({ msg: `User Signed in succesfully! hello ${result?.userName} ` });
  } catch (err) {
    res.status(400).json({ msg: "error in signin !", err: err.message });
  }
};


exports.login = async (req , res) => {
  try{
    const {email , password} = req.body;
    if(!email , !password){
      return res.status(400).json({msg : "Email and password are required!"});
    }
    const userExist = await User.findOne({email});
    if(!userExist){
      return res.status(400).json({msg : "please signin first!"});

    }
    console.log(userExist);
    const passwordMatched = await bcrypt.compare(password , userExist.password);
    // console.log(passwordMatched);
    if(!passwordMatched){
      return res.status(400).json({msg: "Incorrect Credential"});

    }
    const accessToken = jwt.sign({token:userExist._id},process.env.JWT_SECRET, {expiresIn: "30d"});
    if(!accessToken){
      return res.status(400).json({msg: "Token not genrated in login!"});

    }
    res.cookie('token' , accessToken,{
      maxAge:1000*60*60*24*30,
      httpOnly:true,
      secure:true,
      sameSite:"none",
      partitioned : true,

    });
    res.status(200).json({msg:"user logged in successfully!"});
    


  }catch (err){
    res.status(400).json({msg: "Error in login !" , err:err.message});
  }
}

exports.userDetails = async (req ,res) =>{
  try{
    const {id} = req.params;
    if(!id){
      return res.status(400).json({msg : "id is required! "});

    }
    const user = await User.findById(id)
    .select('-password')
    .populate('followers')
  
    .populate({path : 'threads',populate:[{path:'likes'},{path:'comments'},{path:'admin'}]
    })
    .populate({path:'replies' , populate:{path:"admin"}})
    .populate({path:'repost' 
      ,populate:[{path:'likes'},{path:'comments'},{path:'admin'}],
    });

  res.status(200).json({msg : 'User Details Fetched' ,user});
  }catch (err){
    return res.status(400).json({msg :"Error in userdetail",err:err.message})
  }

}


exports.followUser =  async (req , res) =>{
  try{
    // const req.user._id
    const {id} = req.params;
    if(!id){
      return res.status(400).json({msg:"id is required"});
    }
    const userExist = await User.findById(id);
    if(!userExist){
      return res.status(400).json({msg:"User dont exit"});

    }
    if(userExist.followers.includes(req.user._id)){
      await User.findByIdAndUpdate(userExist._id, {
        $pull:{followers:req.user._id},

      },
      {new: true}
    );
    return res.status(201).json({msg : `Unfollowed ${userExist.userName}`});
    }

    await User.findByIdAndUpdate(userExist._id, {
        $push:{followers:req.user._id},

      },
      {new: true}
    );
    return res.status(201).json({msg : `Following ${userExist.userName}`});

  }catch (err){
    res.status(400).json({msg : "Error in followuser!" , err: err.message});
  }


}

exports.updateProfile = async (req , res) =>{
  try{
    const userExist = await User.findById(req.user._id);
    if(!userExist){
      return res.status(400).json({msg:"no such user"});
    }
    const form = formidable({});
    form.parse(req , async (err , fields , files) =>{
      if(err){
        return res.status(400).json({msg : 'Error in formidable !' ,err:err});
      }
      // console.log({files , fields});
      if(fields.text){
        
        await User.findByIdAndUpdate(
          req.user._id , 
          {bio:fields.text},
          {new:true}
        );
      }
      if(files.media){
        if(userExist.public_id){
          await cloudinary.uploader.destroy(userExist.public_id , (error , result) =>{
            console.log({error , result});
          }
        );
        }


        const uploadedImage = await cloudinary.uploader.upload(files.media.filepath , {folder : 'Threads_clone_new/Profiles'}

        );
        // console.log(uploadedImage);
        if(!uploadedImage){
          return res.status(400).json({msg : 'Error while uploading pic !'});
        }
        await User.findByIdAndUpdate(req.user._id,{
          profilePic:uploadedImage.secure_url,
          public_id:uploadedImage.public_id,
        },{new:true});

      }
    });
    res.status(201).json({msg : "profile updated successfully"});


  }
  catch (err){
    res.status(400).json({msg : "Profile updatation unsuccesful!", err:err.message});

  }


};


exports.searchUser = async (req , res) =>{
  try{
    const {query} = req.params;
    const users = await User.find({
      $or:[
        {userName:{$regex:query , $options:'i'} },
        {email: { $regex:query , $options:'i'}} ,
    
      ]
    });
    res.status(200).json({msg : 'searched!' , users});

  }catch (err){
    res.status(400).json({msg : 'error in searchUser!' , err:err.message})

  }
}



exports.logout = async (req, res)=>{
  try{
    res.cookie('token' , '',{
      maxAge:0,
      httpOnly:true,
      sameSite:"none",
      secure:true,
      partitioned:true,
    })
    res.status(201).json({msg: 'logout successfully'});

  }catch (err){
    res.status(400).json({msg : "error in logout"})

  }
}

exports.myInfo= async (req , res) =>{
  try{
    res.status(200).json({me:req.user});

  }catch(err){
    res.status(400).json({msg: 'error in myInfo!'});
  }
}
