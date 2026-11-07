import mongoose from 'mongoose'

// Database connection details for the local MongoDB instance or a configured environment URI.
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/doctorAppointmentDB' 

// Initialize the Mongo connection once when the backend starts.
const connectDB = async () => {
  await mongoose.connect(mongoUri) 
  console.log(`Connected to MongoDB: ${mongoUri}`) 
} 

export{
  mongoUri,
  connectDB,
} 
