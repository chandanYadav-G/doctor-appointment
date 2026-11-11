import 'dotenv/config'
import mongoose from 'mongoose'

const mongoUri = process.env.MONGODB_URI

const connectDB = async () => {
    try {
        await mongoose.connect(mongoUri)
        console.log('Connected to MongoDB Atlas!')
    }
    catch (error) {
        console.error('MongoDB connection failed:', error.message)
        throw error
    }
}

export {
    connectDB,
}