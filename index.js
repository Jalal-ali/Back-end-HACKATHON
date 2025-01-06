// authentication 
import dotenv from 'dotenv'
dotenv.config();
import express from 'express' 
import connectDB from './src/db/index.js';
import registerRoutes from './src/routes/register.route.js'
// import loginRoutes from './src/routes/login.route.js'
import productRoutes from './src/routes/products.route.js'

const app = express()

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})
// routes
app.use("/api/v2", registerRoutes);
// app.use("/api/v2", loginRoutes);
app.use("/api/v2", productRoutes);

connectDB()
.then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`)})
})
.catch((err) => {
  console.log("MONGO DB connection failed !!! ", err);
});