import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import cors from 'cors';
import fs from 'fs';
import jwt from 'jsonwebtoken';

const port = 4000;
const app = express();


const dir = './upload/images';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

app.use(express.json());
app.use(cors());


mongoose.connect('mongodb://localhost:27017/e-commerce');


const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('File type not supported'));
    }
}).single('product');

app.use('/images', express.static('upload/images'));
app.post("/upload", (req, res) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ success: 0, message: err.message });
        } else if (err) {
            return res.status(400).json({ success: 0, message: 'File type not supported' });
        }
        if (!req.file) {
            return res.status(400).json({ success: 0, message: "No file uploaded" });
        }

     
        res.json({
            success: 1,
            image_url: `http://localhost:${port}/images/${req.file.filename}`
        });
    });
});
   


// Assuming the product schema is like this:
const productSchema = new mongoose.Schema({
  // Remove or modify the 'id' field if it's causing issues
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  new_price: { type: Number, required: true },
  old_price: { type: Number, required: true },
  available: { type: Boolean, required: true },
}, { timestamps: true });

// Ensure there is no manual 'id' field that could cause duplicates, and let MongoDB handle the `_id`
const Product = mongoose.model('Product', productSchema);






app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.post('/addproduct', async (req, res) => {
    const { name, image, category, new_price, old_price, available } = req.body;

    // Ensure that you do not manually assign an `id` field if MongoDB is auto-generating it
    const productData = {
      name,
      image,
      category,
      new_price: parseFloat(new_price),
      old_price: parseFloat(old_price),
      available,
    };

    try {
        // Create and save the new product
        const newProduct = new Product(productData);

        await newProduct.save();

        res.status(200).json({ success: true, message: 'Product added successfully.' });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ success: false, message: 'Failed to add product.' });
    }
});






app.delete('/deleteproduct/:id', async (req, res) => {
    try {
        const productId = req.params.id; // This should be the ObjectId from MongoDB
        
        // Try to find the product by the MongoDB _id
        const product = await Product.findByIdAndDelete(productId); // findByIdAndDelete uses _id

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.json({
            success: true,
            message: `Product with id ${productId} has been deleted successfully!`,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to delete product",
            error: error.message,
        });
    }
});


// Get All Products Endpoint
app.get('/getallproducts', async (req, res) => {
    try {
        const products = await Product.find();

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No products found",
            });
        }

        res.json({
            success: true,
            products: products,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch products",
            error: error.message,
        });
    }
});


// Schema creating for user mode

const Users =mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type: Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})
app.post('/signup', async (req, res) => {
    try {
        // Check if the email already exists
        let check = await Users.findOne({ email: req.body.email });
        if (check) {
            return res.status(400).json({ success: false, error: "Existing user found with the same email address" });
        }

        // Initialize cart with 300 items
        let cart = {};
        for (let i = 0; i < 300; i++) {
            cart[i] = 0;
        }

        // Create a new user
        const user = new Users({
            name: req.body.username,
            email: req.body.email,
            password: req.body.password,
            cartData: cart,
        });

        // Save the user
        await user.save();

        // Prepare user data for JWT
        const data = {
            user: {
                id: user.id,
            },
        };

        // Sign JWT
        const token = jwt.sign(data, 'secret_ecom');

        // Respond with success and the token
        res.json({ success: true, token });
    } catch (error) {
        console.error(error);
        // Handle errors and respond with a 500 status
        res.status(500).json({ success: false, error: 'Server Error' });
    }
})

app.post('/login', async (req,res)=>{
    let user =await Users.findOne({email:req.body.email});
    if (user){
        const passCompare= req.body.password  === user.password;
        if(passCompare){
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom');
            res.json({success:true, token});
        }
        else{
            res.json({success:false,error:"Wrong password"});
        }
    }
    else{
        res.json({success:false,error:"wrong email id"})
    }
})

app.get('/newcollections',async(req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("NewCollection fetch",newcollection);
    console.log("products",products);
    res.send(products);
})


const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ errors: "Please authenticate using a valid token" });
    }

    try {
        // Verify the token and extract user data
        const data = jwt.verify(token, 'secret_ecom');
        req.user = data.user; // Attach user data to the request object
        next(); // Pass the request to the next middleware/route handler
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).send({ errors: "Invalid or expired token" });
    }
};




app.post('/addtocart', fetchUser, async (req, res) => {
    try {
        // Find the user based on the ID from the token
        let userData = await Users.findOne({ _id: req.user.id });

        if (!userData) {
            return res.status(404).send({ error: "User not found" });
        }

        // Ensure cartData is initialized as an object if it's not
        if (!userData.cartData) {
            userData.cartData = {}; // Initialize cartData if it's undefined
        }

        const itemId = req.body.itemId;

        // Check if the itemId already exists in cartData
        if (!userData.cartData[itemId]) {
            // If not, initialize it with 1 (first item added)
            userData.cartData[itemId] = 1;
        } else {
            // If it exists, increment the count
            userData.cartData[itemId] += 1;
        }

        // Update the user's cartData in the database
        await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });

        // Respond with success
        res.status(200).send({ message: "Product added to cart", cartData: userData.cartData });

        // Log the request and user data for debugging
        console.log(req.body, req.user);
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).send({ error: "An error occurred while adding the product to the cart" });
    }
});



// Start server after MongoDB connection
mongoose.connection.once('open', () => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});
