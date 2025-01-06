import express from 'express'
import { login , register , uploadImage } from '../controllers/register.controller.js'
import { upload } from "../middleware/multer.middleware.js";
const routes = express.Router()

routes.post("/register" , register)
routes.post("/login" , login)
routes.post("/uploadimage", upload.single("image"), uploadImage);

export default routes
