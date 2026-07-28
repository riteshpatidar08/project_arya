const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const userRouter = require('./routes/user.routes.js');
const eventRouter = require('./routes/event.routes.js');

const dotenv = require('dotenv');
const checkRole = require('./middleware/checkRole.js');
const verifyToken = require('./middleware/verifyToken.js')
const { updateStatus } = require('./controllers/event.controller.js');
dotenv.config();

app.use(cors())

app.use(express.json());

app.use('/uploads', express.static('uploads'));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MONGODB CONNECTED');
  })
  .catch((err) => {
    console.log(err);
  });

// POST /api/v1/auth/register
// app.patch('/events/:id/status',verifyToken , checkRole(['admin']) , updateStatus) ;


app.use('/api/v1/auth', userRouter);
app.use('/api/v1', eventRouter);

app.get('/' , (req,res)=>{
  res.send('<h1>Server Deployed 🚀🚀🚀</h1>')
})
// router.post('/register' , reigster)

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

// app.get('/users', getUser  );
// app.post('/users',createUser );
// // app.pos('proudct' , getProduct);
// app.get('/users/:id',async(req,res)=>{
//   try {
//     const {id} = req.params
//     const user = await User.findById(id) ;
//     res.status(200).json({
//       message : "Success" ,
//       user
//     })
//   } catch (error) {
//     console.log(error)
//   }
// })
// const express = require('express'); //fixed line
// const morgan = require('morgan');
// const app = express(); //fixed line

// app.use(morgan('dev')); //NOTE third party middleware  //cors //helmet

// app.use(express.json()); //req.body = {title :" " , author : 'r mehta }
// //GET ALLL BOOKS : METHOD NAME + PATH KYA RAKHE
// let books = [
//   // { id: 1, title: 'React Js Basics', author: 'A. Sharma' },
//   // { id: 2, title: 'Express In Depth', author: 'R Gupta' },
// ];
// //NOTE GET ALL BOOKS API
// app.get('/api/books', (req, res) => {
//   try {
//     if (books.length <= 0) {
//       // res.status(404).send('No Books Found');
//       throw new Error('NO books found');
//     }
//     // res.send(books);
//     res.json({
//       message: 'success',
//       length: books.length,
//       data: books,
//     });
//   } catch (error) {
//     res.status(404).send(error.message);
//   }
// });

// //NOTE GET BOOKS BY ID :id
// app.get('/api/books/:id', (req, res) => {
//   const id = Number(req.params.id);
//   const book = books.find((b) => b.id === id);
//   if (!book) {
//     res.status(404).json({ message: 'BOOK NHI MILI' });
//   }
//   res.json(book);
// });

// //NOTE POST ADD A NEW BOOK ::

// app.post('/api/books', (req, res) => {
//   const { title, author } = req.body;
//   const newBook = { id: books.length + 1, title, author };
//   console.log(newBook);
//   books.push(newBook);

//   res.json(books);
// });

// //GLOBAL ERROR HANDLER

// app.listen(3000, () => {
//   console.log('express server is running on port 3000');
// });

// // 200 series

// // 200 ok
// // 201 created
// // 204 no content

// // 300 - redirection
// // 301 moved permanently
// // 302 found
// // 304 not modfied
// //400

// //400 , 401, 403, 404 , 405 , 408 request , 429 to manny request

// // //get all product
// // app.get('/products', (req, res) => {
// //   //get the query paramter using req.query
// //   console.log(req.query)
// //   const {category , subcategory} = req.query
// //   console.log(category , subcategory)

// //  res.status(200).send('SAMSUNG PHONE');
// // });

// // //get product by id:
// // app.get('/products/:id/:name' , (req,res)=>{
// //   //get the path paramter using req.params
// //   console.log(req.params.id);
// //   console.log(req.params.name)
// // })

// // app.get('/users', (req, res) => {
// // res.send('ROHAN');
// // });

// //NOTE EXPRESS KA SERVER BANAYA
// //NOTE SERVER CHALANA SIKHA NODEMON AUTOMATE KARDEGA ,
// //NOTE ROUTING
// //NOTE app.METHOD(PATH , HANDLER)
// //NOTE BASIC HTTP METHODS (GET , POST , PUT , PATCH , DELETE);
// //NOTE ROUTE PARAMTERS : /:id => named segment ko value capture  /users/1 => id = 1 ; req.params.id
// //NOTE QUERY PARAMTER => ?name=rohan  req.query
// //NOTE MIDDLEWARES  /APPLICATION LEVEL MIDDLEWARE
// // NOTE (BUILT IN < THIRD PARTY)

// //NOTE when you test the api throught some testing tools like thunderclient
// //make sure => server is always on , route path must be correct , method must be matched with the route you have created + agar response nhi aata hain loading chlta rehta req hit krne k baad to aapne res nhi bhja hain

// // http://localhost:3000/orders end point api

// // note middleware

// // app.METHOD(PATH, HANDLER);
// //GET ALL ORDERS :
// //middleware to check the role of a user hitting an endpoint
// //application level middleware jitne bhi app k andr routes hain sb routes k liye chelga

// //NOTE defination Middlewares koi function hota h jo request and response k bich me execute hota hain , yeah req ka access ya check krskta , data process krskta , kuch authenticate krskta hain , logging krna ===> ya req ko ki ksi aur middleware m pass krna using next function

// // client ===> request ===> middleware1 ===> middleware2 ===> route handler ==> response ==> client
// //NOTE agar middleware k andr next() call nhi kiya toh request middleware k andr hi hang hojaigi and response nhi milaga

// // app.use((req, res, next) => {
// //   let role = 'users';
// //   if (role === 'admin') {
// //     next();  //agle middleware ya route handler ko call karo
// //   }

// //   res.send('not authorized to access the orders resource');
// // });

// // //NOTE logger middleware   middleware number 2

// // app.get('/orders', (req, res) => {
// //   console.log(req.name);
// //   res.send('saare orders ki list ');
// // });

// // app.get('/orders/:id', (req, res) => {
// //   req.params.id;
// // });

// // app.post('/users', (req, res) => {
// //   res.send('new user created');
// // });

// // //NOTE users/1 route paramter
// // //NOTE users?age=34&name=rohit // req.query; filteration and pagination
// // app.put('/users/:id', (req, res) => {
// //   console.log(req.params.id);
// //   res.send('user updated');
// // });

// // app.delete('/users/:id', (req, res) => {
// //   console.log(req.params.id);
// //   res.send('user deleted');
// // });

// // db.menuItems.updateOne({name : "Coffee"} , {$set : {price : 150}} )
// // db.menuItems.updateOne({name : "Coffee"}, {$set : {size : "large"}})

//schema ko follow karo (which required which one is not) => payload banao => api hit karo

//express => MVC
// MODEL VIEW CONTROLLER

// app.js
// users ,     products
// routes ,     routes
// controller   controller

// model        model
