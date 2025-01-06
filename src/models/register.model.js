import mongoose from "mongoose";
import bcrypt from "bcrypt"

const Schema = mongoose.Schema;

const userRegister = new Schema(
    {
        email : {
            type : String ,
            required : [true , 'Email is required'] ,
            unique : true 
        },
        password : {
            type : String ,
            required : [true , 'Password is required']
        }
    }
)

userRegister.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
  
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });

export default mongoose.model("accounts" , userRegister)