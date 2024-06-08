const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(cors());
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
    await client.connect();

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


    app.put('/user/role/:id', async(req, res) => {
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


     app.put('/user/status/:id', async(req, res) => {
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




    



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
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