import User from "../models/register.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import nodemailer from "nodemailer";

// nodemailer 
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: "andrew31@ethereal.email",
    pass: "HwSd9QbQPpN4E1dVXZ",
  },
});
//  tokens 
const generateAccessToken = (user) => {
  return jwt.sign({ email: user.email }, process.env.ACCESS_JWT_SECRET, {
    expiresIn: "6h",
  });
};
const generateRefreshToken = (user) => {
  return jwt.sign({ email: user.email }, process.env.REFRESH_JWT_SECRET, {
    expiresIn: "7d",
  });
};
  

// upload image


const uploadImageToCloudinary = async (localpath) => {
    try {
      const uploadResult = await cloudinary.uploader.upload(localpath, {
        resource_type: "auto",
      });
      fs.unlinkSync(localpath);
      return uploadResult.url;
    } catch (error) {
      fs.unlinkSync(localpath);
      return null;
    }
  };
  const uploadImage = async (req, res) => {
    if (!req.file)
      return res.status(400).json({
        message: "no image file uploaded",
      });
  
    try {
      const uploadResult = await uploadImageToCloudinary(req.file.path);
  
      if (!uploadResult)
        return res
          .status(500)
          .json({ message: "error occured while uploading image" });
  
      res.json({
        message: "image uploaded successfully",
        url: uploadResult,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "error occured while uploading image" });
    }
  };

// register user

const register = async (req, res) => {
  const { email, password } = req.body;

  if (!email) return res.status(400).json({ message: "email required" });
  if (!password) return res.status(400).json({ message: "password required" });

  const user = await User.findOne({ email: email });
  if (user) return res.status(401).json({ message: "user already exist" });

  const createUser = await User.create({
    email,
    password,
  });
  res.json({ message: "user registered successfully", data: createUser });

  // send email 
const sendEmail = async (req, res) => {
    const info = await transporter.sendMail({
      from: '"Jalal Ali 👻" <alikhanumar795@gmail.com>', // sender address
      to: user.email,
      subject: "Registered Successfully !",
      text: "CONGRATULATIONS!! You have successfully registered to our app. ", // plain text body
      html: "<b>THANK YOU!</b>", // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    res.send("email sent");
  };
};

// login user

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email) return res.status(400).json({ message: "email required" });
  if (!password) return res.status(400).json({ message: "password required" });
  // email mujood ha bhi ya nahi ha
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "no user found" });
  // password compare krwayenga bcrypt
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return res.status(400).json({ message: "incorrect password" });

  // token generate
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // cookies
  res.cookie("refreshToken", refreshToken, { http: true, secure: false });

  res.json({
    message: "user loggedIn successfully",
    accessToken,
    refreshToken,
    data: user,
  });
};

// logout user
const logoutUser = async (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "user logout successfully" });
};
export {register , login , logoutUser ,  uploadImage }