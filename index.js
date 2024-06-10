const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
var jwt = require('jsonwebtoken');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(cors({
  origin: [
    'http://localhost:5176',
    'http://localhost:5173',
    'http://localhost:5174',
    'https://life-stream-donate-0108.netlify.app',
    'assignment-12-server-57rdeub35-atiks-projects-ca41f1e3.vercel.app'
  ]
}));
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vvsc5ct.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();


    // Jwt related api
    app.post('/jwt', async(req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '2h'})
      res.send({token})
    })

    const verifyToken = (req, res, next) => {
      // console.log('inside verify token', req.headers.authorization);
      if (!req.headers.authorization) {
        return res.status(401).send({ message: 'unauthorized access' });
      }
      const token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).send({ message: 'unauthorized access' })
        }
        req.decoded = decoded;
        next();
      })
    }

    // use verify admin after verifyToken
    // const verifyAdmin = async (req, res, next) => {
    //   const email = req.decoded.email;
    //   const query = { email: email };
    //   const user = await userCollection.findOne(query);
    //   const isAdmin = user?.role === 'admin';
    //   if (!isAdmin) {
    //     return res.status(403).send({ message: 'forbidden access' });
    //   }
    //   next();
    // }



    const districtsCollection = client.db('bloodDonate').collection('districts');
    const upazilasCollection = client.db('bloodDonate').collection('upazilas');


    app.get('/district',  async(req, res) => {
      const cursor = districtsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/upazilas',  async(req, res) => {
      const cursor = upazilasCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })


    const userCollection = client.db('bloodDonate').collection('user');


    app.get('/user', async(req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/user', async(req, res) => {
      const newUser = req.body;
      console.log(newUser);
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    })


    app.put('/user/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true };
      const updateUserDetails = req.body;
      const User = {
        $set: {
          
          name: updateUserDetails.name,
          bloodgroup: updateUserDetails.bloodgroup,
          district: updateUserDetails.district,
          upazila: updateUserDetails.upazila,
          image: updateUserDetails.image,

          
        }
      }

      const result = await userCollection.updateOne(filter, User, options);
      res.send(result);
     })


    app.put('/user/role/:id', verifyToken,  async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true };
      const updateUserDetails = req.body;

      const User = {
        $set: {
          role: updateUserDetails.role,    
        }
      }

      const result = await userCollection.updateOne(filter, User, options);
      res.send(result);
     })


     app.put('/user/status/:id', verifyToken, async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true };
      const updateUserDetails = req.body;

      const User = {
        $set: {
          status: updateUserDetails.status,    
        }
      }

      const result = await userCollection.updateOne(filter, User, options);
      res.send(result);
     })



     const donationRequestCollection = client.db('bloodDonate').collection('donationRequest');

     app.post('/donationrequest', async(req, res) => {
       const donationRequest = req.body;
       console.log(donationRequest);
       const result = await donationRequestCollection.insertOne(donationRequest);
       res.send(result);
     })


     app.get('/donationrequest', async(req, res) => {
      const cursor = donationRequestCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/donationrequest/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await donationRequestCollection.findOne(query);
      res.send(result);
    })



    app.put('/donationrequest/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true };
      const updateDonationRequestDetails = req.body;
      const DonationRequestCard = {
        $set: {
          requestEmail: updateDonationRequestDetails.requestEmail,
          requestName: updateDonationRequestDetails.requestName,
          recipientName: updateDonationRequestDetails.recipientName,
          recipientBloodgroup: updateDonationRequestDetails.recipientBloodgroup,
          recipientDistrict: updateDonationRequestDetails.recipientDistrict,
          recipientUpazila: updateDonationRequestDetails.recipientUpazila,
          hospital: updateDonationRequestDetails.hospital,
          recipientAddress: updateDonationRequestDetails.recipientAddress,
          donationDate: updateDonationRequestDetails.donationDate,
          donationTime: updateDonationRequestDetails.donationTime,
          message: updateDonationRequestDetails.message,
          status: updateDonationRequestDetails.status,
        }
      }

      const result = await donationRequestCollection.updateOne(filter, DonationRequestCard, options);
      res.send(result);
     })



    app.put('/donationrequest/donor/:id', verifyToken, async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true };
      const updateDonationRequestDetails = req.body;
      const DonationRequestCard = {
        $set: {
          donorEmail: updateDonationRequestDetails.donorEmail,
          donorName : updateDonationRequestDetails.donorName,
          status: updateDonationRequestDetails.status
        }
      }

      const result = await donationRequestCollection.updateOne(filter, DonationRequestCard, options);
      res.send(result);
     })





     app.put('/donationrequest/status/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true };
      const updateDonationRequestDetails = req.body;
      const DonationRequestCard = {
        $set: {
          status: updateDonationRequestDetails.status,
        }
      }

      const result = await donationRequestCollection.updateOne(filter, DonationRequestCard, options);
      res.send(result);
     })












     app.delete('/donationrequest/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await donationRequestCollection.deleteOne(query);
      res.send(result);
    })


     const blogCollection = client.db('bloodDonate').collection('blog');

     app.post('/blog', async(req, res) => {
       const blogs = req.body;
       console.log(blogs);
       const result = await blogCollection.insertOne(blogs);
       res.send(result);
     })


     app.put('/blog/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true };
      const updateBlog = req.body;
      const BlogCard = {
        $set: {
          title: updateBlog.title,
          image: updateBlog.image,
          content: updateBlog.content,
          
          
        }
      }

      const result = await blogCollection.updateOne(filter, BlogCard, options);
      res.send(result);
     })


     app.put('/blog/status/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true };
      const updateBlog = req.body;
      const BlogCard = {
        $set: {

          status: updateBlog.status

        }
      }

      const result = await blogCollection.updateOne(filter, BlogCard, options);
      res.send(result);
     })




     app.get('/blog', async(req, res) => {
      const cursor = blogCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/blog/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await blogCollection.findOne(query);
      res.send(result);
    })


    app.delete('/blog/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await blogCollection.deleteOne(query);
      res.send(result);
    })



    const fundingCollection = client.db('bloodDonate').collection('funding');


    app.get('/funding',  async(req, res) => {
      const cursor = fundingCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/funding',  async(req, res) => {
      const funding = req.body;
      console.log(funding);
      const result = await fundingCollection.insertOne(funding);
      res.send(result);
    })







    



    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Assignment 12 server');
})

app.listen(port, () => {
  console.log(`Assignment 12  server is running on port: ${port}`);
})