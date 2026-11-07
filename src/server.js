import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import { connectDB } from './connection'
import { Patient, Appointment } from './schema'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 8080

app.use(cors())
app.use(express.json())


// catalog used by frontend services page
const services = [
	'Regular Healthcare Package',
	'CT-Scan || X-Ray',
	'Lab Test',
	'Gynae Health',
	'Ayurveda Treatment',
	'Dental Checkup'
]




//route to check if server api is running
app.get('/api/health', (req, res) => {
	res.json({ status: 'Ok', message: 'Doctor Appointment Backend is Running'})
})

// start server function
const startServer = async function(){
	try{
		app.listen(PORT, () => {
			console.log(`Server Started. App listening at PORT : ${PORT}`)
		})
	}catch(error){
		console.log(`Failed to start server. Error - ${error}`)
		process.exit(1)
	}
}

startServer()