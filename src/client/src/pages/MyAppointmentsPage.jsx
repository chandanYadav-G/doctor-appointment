import { useEffect } from 'react' 
import { useDispatch, useSelector } from 'react-redux' 
import { fetchAppointments } from '../store/appSlice' 

// List the logged-in patient's booked appointments in reverse chronological order.
function MyAppointmentsPage() {
  const dispatch = useDispatch() 
  const appointments = useSelector((state) => state.app.appointments) 
  const user = useSelector((state) => state.app.user) 

  useEffect(() => {
    if (user?.email) {
      dispatch(fetchAppointments({ email: user.email })) 
    }
  }, [dispatch, user?.email]) 

  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time || '00:00'}`) 
    const dateB = new Date(`${b.date}T${b.time || '00:00'}`) 
    return dateB - dateA 
  }) 

  return (
    <div className='min-h-full bg-[#f1f3f2] px-5 pt-[26px] pb-10'>
      <div className='mx-auto flex w-[min(1000px,calc(100%_-_40px))] flex-col gap-[18px]'>
        {sortedAppointments.length ? (
          sortedAppointments.map((appointment) => (
            <div key={appointment.id} className='rounded-xl border border-[#d8d8d8] bg-white px-5 py-[18px]'>
              <div className='flex justify-between gap-5 font-bold text-[#4d4e55]'>
                <span>{appointment.date}</span>
                <span>{appointment.time}</span>
              </div>
              <div>
                <h3 className='mt-[10px] mb-2 text-[1.4rem] text-[#2b2f35]'>{appointment.department}</h3>
                <p className='mb-[10px] text-[#4c5159]'>{appointment.comments}</p>
                <strong>{appointment.patientName}</strong>
              </div>
            </div>
          ))
        ) : (
          <div className='rounded-xl border border-[#d8d8d8] bg-white p-6 text-center text-[#505662]'>No Appointments Yet</div>
        )}
      </div>
    </div>
  ) 
}

export default MyAppointmentsPage 
