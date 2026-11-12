import crypto from 'crypto'
import mongoose from 'mongoose' 
 
// Hash passwords with a random salt so patient credentials are stored safely.
const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex') 
  const hash = crypto
    .pbkdf2Sync(String(password), salt, 100000, 64, 'sha512')
    .toString('hex') 

  return `${salt}:${hash}` 
} 

// to verify password at the time of login
const verifyPassword = (password, storedPassword) => {
  if (!storedPassword || typeof storedPassword !== 'string') {
    return false 
  }

  const separatorIndex = storedPassword.indexOf(':') 
  if (separatorIndex === -1) {
    return false 
  }

  const salt = storedPassword.slice(0, separatorIndex) 
  const hash = storedPassword.slice(separatorIndex + 1) 
  const derivedHash = crypto
    .pbkdf2Sync(String(password), salt, 100000, 64, 'sha512')
    .toString('hex') 

  const expectedHash = Buffer.from(hash, 'hex') 
  const candidateHash = Buffer.from(derivedHash, 'hex') 

  if (expectedHash.length !== candidateHash.length) {
    return false 
  }

  // comparing buffer string instead of simple strings
  return crypto.timingSafeEqual(expectedHash, candidateHash) 
} 

// Patient records hold the account details needed for signup, login, and profile display
const patientSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    address1: { type: String, default: '' },
    address2: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    zipCode: { type: String, default: '' },
  },
  { timestamps: true },
) 

patientSchema.pre('save', async function hashPatientPassword() {
  if (!this.isModified('password')) {
    return 
  }

  this.password = hashPassword(this.password) 
}) 

// comparing entered and stored password
patientSchema.methods.comparePassword = function comparePatientPassword(password) {
  return verifyPassword(password, this.password) 
} 

// Appointment records track the selected department, date, and patient notes for each booking.
const appointmentSchema = new mongoose.Schema(
  {
    patientName: { type: String, required: true },
    patientEmail: { type: String, required: true, lowercase: true, trim: true },
    department: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    comments: { type: String, default: 'No extra comments provided.' },
    year: { type: Number, required: true },
  },
  { timestamps: true },
) 

const Patient = mongoose.models.Patient || mongoose.model('Patient', patientSchema, 'patients') 
const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema, 'appointments') 

export{
  Patient,
  Appointment,
  hashPassword,
  verifyPassword,
} 
