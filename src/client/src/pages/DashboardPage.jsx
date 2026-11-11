import { useEffect, useState } from 'react' 
import { useDispatch, useSelector } from 'react-redux' 
import { fetchPatient, updatePatient } from '../store/appSlice' 

// Default values for the editable patient profile form.
const initialForm = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zipCode: '',
} 

// Dashboard shows the current patient profile in a read/write form.
function DashboardPage() {
  const dispatch = useDispatch() 
  const patient = useSelector((state) => state.app.patient) 
  const user = useSelector((state) => state.app.user) 
  const [form, setForm] = useState(initialForm) 
  const [isSaving, setIsSaving] = useState(false) 
  const [saveError, setSaveError] = useState('') 
  const [saveSuccess, setSaveSuccess] = useState('') 

  useEffect(() => {
    if (user?.email) {
      dispatch(fetchPatient(user.email)) 
    }
  }, [dispatch, user?.email]) 

  useEffect(() => {
    if (patient) {
      setForm({
        firstName: patient.firstName || '',
        lastName: patient.lastName || '',
        phone: patient.phone || '',
        email: patient.email || '',
        address1: patient.address1 || '',
        address2: patient.address2 || '',
        city: patient.city || '',
        state: patient.state || '',
        zipCode: patient.zipCode || '',
      }) 
    }
  }, [patient]) 

  const handleChange = (event) => {
    const { name, value } = event.target 
    setForm((previous) => ({ ...previous, [name]: value })) 
    setSaveError('') 
    setSaveSuccess('') 
  } 

  const handleSubmit = async (event) => {
    event.preventDefault() 
    setIsSaving(true) 
    setSaveError('') 
    setSaveSuccess('') 

    try {
      await dispatch(updatePatient({ email: user.email, patient: form })).unwrap() 
      setSaveSuccess('Patient details updated successfully.') 
    } catch (error) {
      setSaveError(typeof error === 'string' ? error : 'Unable to update patient details. Please try again.') 
    } finally {
      setIsSaving(false) 
    }
  } 

  return (
    <div className='min-h-full bg-[#f1f3f2]'>
      <div className='border-b border-[#ddd] bg-[#f5f5f5] px-[22px] py-[18px] pb-[14px] text-[1.2rem]'>
        <h2 className='m-0 font-bold text-[#2d2f36]'>Patient Dashboard</h2>
      </div>

      <div className='mx-auto mt-[42px] w-[min(860px,calc(100%_-_120px))] border border-[#d8d8d8] bg-white/70 px-[18px] pt-[18px] pb-3 shadow-[0_1px_0_rgba(0,0,0,0.02)] max-[900px]:w-[calc(100%_-_30px)]'>
        <h3 className='mb-[18px] text-[1.15rem] text-[#2d2f36]'>Patient Details</h3>

        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <div className='grid grid-cols-[repeat(3,minmax(160px,1fr))] gap-4 max-[900px]:grid-cols-1'>
            <label className='flex flex-col gap-2 font-medium text-[#3d3c40]'>
              <span>First Name</span>
              <input className='w-full rounded-lg border border-[#d2d2d2] bg-[#f7f7f7] px-[14px] py-3 text-base text-[#2b2f35]' name='firstName' value={form.firstName} onChange={handleChange} />
            </label>
            <label className='flex flex-col gap-2 font-medium text-[#3d3c40]'>
              <span>Last Name</span>
              <input className='w-full rounded-lg border border-[#d2d2d2] bg-[#f7f7f7] px-[14px] py-3 text-base text-[#2b2f35]' name='lastName' value={form.lastName} onChange={handleChange} />
            </label>
            <label className='flex flex-col gap-2 font-medium text-[#3d3c40]'>
              <span>Phone</span>
              <input className='w-full rounded-lg border border-[#d2d2d2] bg-[#f7f7f7] px-[14px] py-3 text-base text-[#2b2f35]' name='phone' value={form.phone} onChange={handleChange} />
            </label>
          </div>

          <div className='grid grid-cols-[repeat(3,minmax(160px,1fr))] gap-4 max-[900px]:grid-cols-1'>
            <label className='flex flex-col gap-2 font-medium text-[#3d3c40]'>
              <span>Email</span>
              <input className='w-full rounded-lg border border-[#d2d2d2] bg-[#f7f7f7] px-[14px] py-3 text-base text-[#2b2f35]' type='email' name='email' value={form.email} onChange={handleChange} />
            </label>
            <label className='flex flex-col gap-2 font-medium text-[#3d3c40]'>
              <span>Address Line 1</span>
              <input className='w-full rounded-lg border border-[#d2d2d2] bg-[#f7f7f7] px-[14px] py-3 text-base text-[#2b2f35]' name='address1' value={form.address1} onChange={handleChange} />
            </label>
            <label className='flex flex-col gap-2 font-medium text-[#3d3c40]'>
              <span>Address Line 2</span>
              <input className='w-full rounded-lg border border-[#d2d2d2] bg-[#f7f7f7] px-[14px] py-3 text-base text-[#2b2f35]' name='address2' value={form.address2} onChange={handleChange} />
            </label>
          </div>

          <div className='grid grid-cols-[repeat(3,minmax(160px,1fr))] gap-4 max-[900px]:grid-cols-1'>
            <label className='flex flex-col gap-2 font-medium text-[#3d3c40]'>
              <span>City</span>
              <input className='w-full rounded-lg border border-[#d2d2d2] bg-[#f7f7f7] px-[14px] py-3 text-base text-[#2b2f35]' name='city' value={form.city} onChange={handleChange} />
            </label>
            <label className='flex flex-col gap-2 font-medium text-[#3d3c40]'>
              <span>State</span>
              <input className='w-full rounded-lg border border-[#d2d2d2] bg-[#f7f7f7] px-[14px] py-3 text-base text-[#2b2f35]' name='state' value={form.state} onChange={handleChange} />
            </label>
            <label className='flex flex-col gap-2 font-medium text-[#3d3c40]'>
              <span>Zipcode</span>
              <input className='w-full rounded-lg border border-[#d2d2d2] bg-[#f7f7f7] px-[14px] py-3 text-base text-[#2b2f35]' name='zipCode' value={form.zipCode} onChange={handleChange} />
            </label>
          </div>

          {saveError && <p role='alert' className='m-0 rounded-lg bg-[#f8d9d4] px-3 py-[10px] text-[0.92rem] text-[#9b1c1c]'>{saveError}</p>}
          {saveSuccess && <p role='status' className='m-0 rounded-lg bg-[#dff5e8] px-3 py-[10px] text-[0.92rem] text-[#1a7f45]'>{saveSuccess}</p>}
          <button type='submit' disabled={isSaving} className='mt-[6px] self-start rounded-xl bg-[linear-gradient(135deg,#9f5ec9,#7e33a8)] px-7 py-3 text-base font-bold text-white transition-transform duration-200 hover:-translate-y-px disabled:cursor-wait disabled:opacity-70'>{isSaving ? 'SAVING...' : 'ADD'}</button>
        </form>
      </div>
    </div>
  ) 
}

export default DashboardPage 
