import { useEffect, useState } from 'react' 
import { useDispatch, useSelector } from 'react-redux' 
import { createAppointment, fetchServices } from '../store/appSlice'

// Utility helpers to build a valid appointment form with today's date and time validation.
const getTodayDateString = () => new Date().toISOString().split('T')[0] 

const getDefaultForm = (availableServices = []) => ({
  date: getTodayDateString(),
  time: '',
  department: availableServices[0] || 'Regular healthcare package',
  comments: '',
}) 

const isValidTime = (value) => {
  if (!value || typeof value !== 'string') return false 

  const trimmed = value.trim() 
  const match = trimmed.match(/^(0?[1-9]|1[0-2]):([0-5]\d)\s?(AM|PM)$/i) 
  return Boolean(match) 
} 

// Appointment booking form validates the date, time, and department before submitting.
function BookAppointmentPage() {
  const dispatch = useDispatch() 
  const services = useSelector((state) => state.app.services) 
  const [form, setForm] = useState(() => getDefaultForm(services)) 
  const [error, setError] = useState('') 
  const [successMessage, setSuccessMessage] = useState('') 

  useEffect(() => {
    dispatch(fetchServices()) 
  }, [dispatch]) 

  useEffect(() => {
    if (services.length && (!services.includes(form.department) || !form.department)) {
      setForm((previous) => ({ ...previous, department: services[0] })) 
    }
  }, [services, form.department]) 

  const handleChange = (event) => {
    const { name, value } = event.target 
    setForm((previous) => ({ ...previous, [name]: value })) 
    if (error) setError('') 
  } 

  useEffect(() => {
    if (!successMessage) return undefined 

    const timer = setTimeout(() => {
      setSuccessMessage('') 
    }, 5000) 

    return () => clearTimeout(timer) 
  }, [successMessage]) 

  const handleSubmit = async (event) => {
    event.preventDefault() 

    const trimmedDate = form.date?.trim() 
    const trimmedTime = form.time?.trim() 
    const trimmedDepartment = form.department?.trim() 
    const trimmedComments = form.comments?.trim() 

    if (!trimmedDate) {
      setError('Please select an appointment date.') 
      setSuccessMessage('') 
      return 
    }

    const selectedDate = new Date(`${trimmedDate}T00:00:00`) 
    const today = new Date() 
    today.setHours(0, 0, 0, 0) 

    if (Number.isNaN(selectedDate.getTime()) || selectedDate < today) {
      setError('Appointment date cannot be in the past.') 
      setSuccessMessage('') 
      return 
    }

    if (!trimmedTime || !isValidTime(trimmedTime)) {
      setError('Please enter a valid time in the format like 9:30 AM.') 
      setSuccessMessage('') 
      return 
    }

    if (!trimmedDepartment) {
      setError('Please choose a department.') 
      setSuccessMessage('') 
      return 
    }

    if (trimmedComments && trimmedComments.length > 500) {
      setError('Comments should be under 500 characters.') 
      setSuccessMessage('') 
      return 
    }

    try {
      await dispatch(createAppointment({ ...form, time: trimmedTime, department: trimmedDepartment, comments: trimmedComments || '' })).unwrap() 
      setForm(getDefaultForm(services)) 
      setError('') 
      setSuccessMessage('Appointment booked successfully!') 
    } catch (submissionError) {
      setError(submissionError || 'Unable to book appointment. Please try again.') 
      setSuccessMessage('') 
    }
  } 

  return (
    <div className='flex min-h-full items-start justify-center bg-[#f1f3f2] px-5 pt-[44px] pb-10'>
      <div className='mx-auto w-full max-w-[700px] border border-[#d8d8d8] bg-white/70 px-[22px] pt-[18px] pb-[26px] shadow-[0_1px_0_rgba(0,0,0,0.02)]'>
        <h2 className='mb-5 text-center text-[2.5rem] text-[#24272c]'>Book an Appointment</h2>

        <form onSubmit={handleSubmit} className='flex flex-col gap-[18px]'>
          {error && <p className='m-0 rounded-lg bg-[#f8d9d4] px-3 py-[10px] text-[0.92rem] text-[#9b1c1c]'>{error}</p>}
          {successMessage && <p className='m-0 rounded-lg bg-[#dff5e8] px-3 py-[10px] text-[0.92rem] text-[#1a7f45]'>{successMessage}</p>}

          <label className='flex flex-col gap-2 font-medium text-[#3d3c40]'>
            <span>Select Date</span>
            <div className='grid grid-cols-[1.2fr_1fr] gap-3 max-[900px]:grid-cols-1'>
              <input className='w-full rounded-lg border border-[#d2d2d2] bg-[#f7f7f7] px-[14px] py-3 text-base text-[#2b2f35]' type='date' name='date' value={form.date} onChange={handleChange} />
              <input className='w-full rounded-lg border border-[#d2d2d2] bg-[#f7f7f7] px-[14px] py-3 text-base text-[#2b2f35]' type='text' name='time' placeholder='9:30 AM' value={form.time} onChange={handleChange} />
            </div>
          </label>

          <label className='flex flex-col gap-2 font-medium text-[#3d3c40]'>
            <span>Department</span>
            <select className='w-full rounded-lg border border-[#d2d2d2] bg-[#f7f7f7] px-[14px] py-3 text-base text-[#2b2f35]' name='department' value={form.department} onChange={handleChange}>
              {services.length ? services.map((service) => (
                <option key={service} value={service}>{service}</option>
              )) : (
                <>
                  <option value='Regular healthcare package'>Regular healthcare package</option>
                  <option value='CT-SCAN | X-RAY'>CT-SCAN | X-RAY</option>
                  <option value='Lab Test'>Lab Test</option>
                </>
              )}
            </select>
          </label>

          <div className='grid grid-cols-[1fr_52px] items-end gap-3 max-[900px]:grid-cols-1'>
            <label className='flex flex-col gap-2 font-medium text-[#3d3c40]'>
              <span>Comments</span>
              <textarea className='min-h-24 w-full resize-y rounded-lg border border-[#d2d2d2] bg-[#f7f7f7] px-[14px] py-3 text-base text-[#2b2f35]' name='comments' placeholder='Explain about the problem.' value={form.comments} onChange={handleChange} />
            </label>
          </div>

          <button type='submit' className='mx-auto mt-3 w-[200px] rounded-xl bg-[linear-gradient(135deg,#9f5ec9,#7e33a8)] px-5 py-[14px] text-[1.2rem] font-bold text-white transition-transform duration-200 hover:-translate-y-px'>Submit</button>
        </form>
      </div>
    </div>
  ) 
}

export default BookAppointmentPage 
