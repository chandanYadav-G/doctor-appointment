import { useEffect } from 'react' 
import { useDispatch, useSelector } from 'react-redux' 
import { fetchServices } from '../store/appSlice' 

// Services page renders the available healthcare offerings for the patient.
function ServicesPage() {
  const dispatch = useDispatch() 
  const services = useSelector((state) => state.app.services) 

  useEffect(() => {
    dispatch(fetchServices()) 
  }, [dispatch]) 

  return (
    <div className='min-h-full bg-[#f1f3f2] px-5 pt-10 pb-10'>
      <div className='mx-auto grid w-[min(1000px,calc(100%_-_40px))] grid-cols-[repeat(3,minmax(220px,1fr))] gap-x-[26px] gap-y-6 max-[900px]:grid-cols-1'>
        {services.length ? (
          services.map((service) => (
            <div key={service} className='flex min-h-[180px] items-center justify-center border border-[#d3d3d3] bg-[#dfe1e3] p-[10px] text-center text-[1.1rem] text-[#30343d]'>
              {service}
            </div>
          ))
        ) : (
          <>
            <div className='flex min-h-[180px] items-center justify-center border border-[#d3d3d3] bg-[#dfe1e3] p-[10px] text-center text-[1.1rem] text-[#30343d]'>Regular healthcare package</div>
            <div className='flex min-h-[180px] items-center justify-center border border-[#d3d3d3] bg-[#dfe1e3] p-[10px] text-center text-[1.1rem] text-[#30343d]'>CT-SCAN | X-RAY</div>
            <div className='flex min-h-[180px] items-center justify-center border border-[#d3d3d3] bg-[#dfe1e3] p-[10px] text-center text-[1.1rem] text-[#30343d]'>Lab Test</div>
            <div className='flex min-h-[180px] items-center justify-center border border-[#d3d3d3] bg-[#dfe1e3] p-[10px] text-center text-[1.1rem] text-[#30343d]'>gynae health</div>
            <div className='flex min-h-[180px] items-center justify-center border border-[#d3d3d3] bg-[#dfe1e3] p-[10px] text-center text-[1.1rem] text-[#30343d]'>Ayurveda Treatment</div>
            <div className='flex min-h-[180px] items-center justify-center border border-[#d3d3d3] bg-[#dfe1e3] p-[10px] text-center text-[1.1rem] text-[#30343d]'>Dental Checkup</div>
          </>
        )}
      </div>
    </div>
  ) 
}

export default ServicesPage 
