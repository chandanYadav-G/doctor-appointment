import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import { connectDB } from './connection.js'
import { Patient, Appointment } from './schema.js'

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

// authenticating user after login
const toAuthUser = patient => ({
	id: patient._id.toString(),
	firstName: patient.firstName,
	lastName: patient.lastName,
	email: patient.email,
	phone: patient.phone
})

const normalizePatient = patient => ({
  id: patient._id.toString(),
  firstName: patient.firstName,
  lastName: patient.lastName,
  phone: patient.phone,
  email: patient.email,
  address1: patient.address1 || '',
  address2: patient.address2 || '',
  city: patient.city || '',
  state: patient.state || '',
  zipCode: patient.zipCode || '',
})

const normalizeAppointment = appointment => ({
  id: appointment._id.toString(),
  patientName: appointment.patientName,
  patientEmail: appointment.patientEmail,
  department: appointment.department,
  date: appointment.date,
  time: appointment.time,
  comments: appointment.comments,
  year: appointment.year,
})

//route to check if server api is running
app.get('/api/health', (req, res) => {
	res.json({ status: 'Ok', message: 'Doctor Appointment Backend is Running'})
})

// new patient signup
app.post('/api/auth/signup', async (req, res) => {
  const { firstName, lastName, phone, email, password } = req.body

  if (!firstName || !lastName || !phone || !email || !password) {
    return res
      .status(400)
      .json({ message: 'Please fill all required fields.' })
  }

  const normalizedEmail = String(email).trim().toLowerCase()
  const existingPatient = await Patient.findOne({ email: normalizedEmail })

  if (existingPatient) {
    return res
      .status(409)
      .json({ message: 'User already exists with this email.' });
  }

  const newPatient = await Patient.create({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    phone: phone.trim(),
    email: normalizedEmail,
    password,
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
  })

  res.status(201).json({
    user: toAuthUser(newPatient),
  })
})

// patient login 
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: 'Email and password are required.' })
  }

  const patient = await Patient.findOne({
    email: String(email).trim().toLowerCase(),
  })

  const suppliedPassword = String(password)
  const matchesStoredHash = patient && patient.comparePassword(suppliedPassword)

  if (!patient || !matchesStoredHash) {
    return res.status(401).json({ message: 'Invalid email or password.' })
  }

  res.json({
    user: toAuthUser(patient),
  })
})


// getting patient through email
app.get('/api/patient', async (req, res) => {
  const email = req.query.email
  const patient = await Patient.findOne({
    email: String(email).trim().toLowerCase(),
  })

  if (!patient) {
    return res.status(404).json({ message: 'No patient found.' })
  }

  res.json({ patient: normalizePatient(patient) })
})

// updating patient
app.patch('/api/patient', async (req, res) => { 
  const currentEmail = String(req.query.email || '').trim().toLowerCase()
  if (!currentEmail) {
    return res.status(400).json({ message: 'Patient email is required' })
  }

  const editableFields = [
    'firstName',
    'lastName',
    'phone',
    'email',
    'address1',
    'address2',
    'city',
    'state',
    'zipCode',
  ]
  const updates = {}

  for (const field of editableFields) {
    if (Object.hasOwn(req.body || {}, field)) {
      if (typeof req.body[field] !== 'string') {
        return res.status(400).json({ message: `${field} must be a string` })
      }
      updates[field] = req.body[field].trim()
    }
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: 'Please provide patient details to update' })
  }

  if (
    (updates.firstName !== undefined && !updates.firstName) ||
    (updates.lastName !== undefined && !updates.lastName) ||
    (updates.phone !== undefined && !updates.phone)
  ) {
    return res.status(400).json({ message: 'First name, last name, and phone cannot be empty' })
  }

  if (updates.email !== undefined) {
    updates.email = updates.email.toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' })
    }

    const existingPatient = await Patient.findOne({ email: updates.email })
    if (existingPatient && existingPatient.email !== currentEmail) {
      return res.status(409).json({ message: 'Patient already exists with this email' })
    }
  }

  const patient = await Patient.findOneAndUpdate(
    { email: currentEmail },
    { $set: updates },
    { new: true, runValidators: true },
  )

  if (!patient) {
    return res.status(404).json({ message: 'No patient found' })
  }

  if (updates.email && updates.email !== currentEmail) {
    await Appointment.updateMany(
      { patientEmail: currentEmail },
      { $set: { patientEmail: updates.email } },
    )
  }

  return res.json({ patient: normalizePatient(patient) })
})

// getting services
app.get('/api/services', (req, res) => {
  res.json({ services })
})


// getting appointments
app.get('/api/appointments', async (req, res) => {
  const { year, email } = req.query
  const query = {
    ...(email ? { patientEmail: String(email).trim().toLowerCase() } : {}),
    ...(year ? { year: Number(year) } : {}),
  }

  const appointments = await Appointment.find(query)
    .sort({ createdAt: -1 })
    .lean() // converting returned documents into simple js obj using lean()
  res.json({ appointments: appointments.map(normalizeAppointment) })
})


// creating new appointments
app.post('/api/appointments', async (req, res) => {
  const { date, time, department, comments, email } = req.body

  if (!date || !time || !department) {
    return res
      .status(400)
      .json({ message: 'Appointment date, time and department are required.' })
  }

  const trimmedDate = String(date).trim()
  const trimmedTime = String(time).trim()
  const trimmedDepartment = String(department).trim()
  const trimmedComments = comments.trim()

  const selectedDate = new Date(`${trimmedDate}T00:00:00`)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (Number.isNaN(selectedDate.getTime()) || selectedDate < today) {
    return res
      .status(400)
      .json({ message: 'Appointment date cannot be in the past.' });
  }

  if (!/^(0?[1-9]|1[0-2]):([0-5]\d)\s?(AM|PM)$/i.test(trimmedTime)) {
    return res.status(400).json({
      message: 'Please enter a valid time in the format like 9:30 AM.',
    })
  }

  if (!trimmedDepartment) {
    return res.status(400).json({ message: 'Please choose a department.' })
  }

  if (trimmedComments && trimmedComments.length > 500) {
    return res
      .status(400)
      .json({ message: 'Comments should be under 500 characters.' })
  }

  const patientEmail = String(email)
    .trim()
    .toLowerCase()

  const patient = await Patient.findOne({ email: patientEmail })
  const appointment = await Appointment.create({
    patientName: patient
      ? `${patient.firstName} ${patient.lastName}`.trim()
      : 'Alina Joe', // alina joe dummy user manually created in DB
    patientEmail,
    department: trimmedDepartment,
    date: trimmedDate,
    time: trimmedTime,
    comments: trimmedComments || 'No extra comments provided.',
    year: Number(trimmedDate.split('-')[0]),
  })

  res.status(201).json({ appointment: normalizeAppointment(appointment) })
})

// start server function
const startServer = async function(){
	try{
		await connectDB() // connecting database before server startup
		app.listen(PORT, '0.0.0.0', () => { //added host 0.0.0.0 for render services
			console.log(`Server Started. App listening at PORT : ${PORT}`)
		})
	}catch(error){
		console.log(`Failed to start server. Error - ${error}`)
		process.exit(1)
	}
}

startServer()