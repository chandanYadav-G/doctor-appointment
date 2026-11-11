import { useState } from 'react' 
import { useDispatch, useSelector } from 'react-redux' 
import { useNavigate, Link } from 'react-router-dom' 
import { clearError, loginUser } from '../store/appSlice' 

// Login screen for existing patients to access the appointment system.
function LoginPage() {
  const dispatch = useDispatch() 
  const navigate = useNavigate() 
  const { status, error } = useSelector((state) => state.app) 
  const [form, setForm] = useState({ email: 'alina@example.com', password: '123456' }) 

  const handleChange = (event) => {
    const { name, value } = event.target 
    setForm((previous) => ({ ...previous, [name]: value })) 
  } 

  const handleSubmit = async (event) => {
    event.preventDefault() 
    dispatch(clearError()) 
    const result = await dispatch(loginUser(form)) 

    if (loginUser.fulfilled.match(result)) {
      navigate('/dashboard') 
    }
  } 

  return (
    <div className='flex min-h-screen items-center justify-center bg-[#f6dfe5] p-5 font-app'>
      <div className='w-[min(100%,520px)] overflow-hidden border border-[#d8d8d8] bg-[#f7f7f7] shadow-[0_2px_4px_rgba(0,0,0,0.08)]'>
        <div className='flex min-h-[78px] items-center justify-center gap-[14px] bg-[#67328a] text-[2.2rem] font-bold text-white'>
          <div className='text-[2.3rem]'>👤</div>
          <span>Patient System</span>
        </div>

        <div className='px-[34px] pt-6 pb-7'>
          <h1 className='mb-[22px] text-center text-[2.05rem] font-bold text-[#2b2b2b]'>Login to your Account</h1>

          <form onSubmit={handleSubmit} className='flex flex-col gap-[18px]'>
            <label className='flex flex-col gap-2 text-base text-[#30343b]'>
              <span>Email Address</span>
              <input
                className='w-full rounded-[10px] border border-[#d2d2d2] bg-white/85 px-[14px] py-3 text-base'
                type='email'
                name='email'
                value={form.email}
                onChange={handleChange}
                placeholder='Email Address'
              />
            </label>

            <label className='flex flex-col gap-2 text-base text-[#30343b]'>
              <span>Password</span>
              <input
                className='w-full rounded-[10px] border border-[#d2d2d2] bg-white/85 px-[14px] py-3 text-base'
                type='password'
                name='password'
                value={form.password}
                onChange={handleChange}
                placeholder='Password'
              />
            </label>

            <label className='inline-flex flex-row items-center gap-[10px] text-[#464b53]'>
              <input className='h-4 w-4' type='checkbox' />
              <span>Remember me</span>
            </label>

            {error && <div className='m-0 rounded-lg bg-[#f8d9d4] px-3 py-[10px] text-[0.92rem] text-[#9b1c1c]'>{error}</div>}

            <button type='submit' className='mt-2 w-full rounded-xl bg-[linear-gradient(135deg,#9f5ec9,#7e33a8)] px-[18px] py-4 text-[1.2rem] font-bold tracking-[0.04em] text-white transition-transform duration-200 hover:-translate-y-px' disabled={status === 'loading'}>
              {status === 'loading' ? 'LOGGING IN...' : 'LOGIN'}
            </button>
          </form>

          <p className='mt-[18px] text-center text-[#565d65]'>
            Need an account? <Link className='font-bold text-[#4c2a8c] no-underline' to='/signup'>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  ) 
}

export default LoginPage 
