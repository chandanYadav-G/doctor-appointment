import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa' 
import { useDispatch, useSelector } from 'react-redux' 
import { logoutUser } from '../store/appSlice' 

// Sidebar keeps the current patient profile and logout action visible across the app.
function Sidebar({ isOpen }) {
  const dispatch = useDispatch() 
  const user = useSelector((state) => state.app.user) 

  const name = user ? `${user.firstName || 'Patient'} ${user.lastName || ''}`.trim() : 'Lorem Ipsum' 

  return (
    <aside className={`w-[220px] shrink-0 border-r border-[#ddd] bg-[#f3f1f3] px-3 py-[18px] transition-all duration-[250ms] max-[900px]:w-full max-[900px]:border-r-0 max-[900px]:border-b ${isOpen ? '' : '-translate-x-full w-0 overflow-hidden border-r-0 p-0 max-[900px]:max-h-0 max-[900px]:translate-x-0 max-[900px]:border-b-0'}`}>
      <div className='mb-7 mt-2 text-center'>
        <div className='mx-auto mb-3 flex h-[82px] w-[82px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#c9d5df,#7d7a7d)] text-[3rem] text-white'>
          <FaUserCircle />
        </div>
        <div className='text-[1.2rem] font-bold text-[#2a2c30]'>{name}</div>
        <div className='text-[0.82rem] text-[#858995]'>Admin</div>
      </div>

      <nav className='flex flex-col gap-[10px]'>
        <button type='button' className='flex w-full cursor-pointer items-center gap-2 rounded-[10px] border-0 bg-[#5c2e9c] px-[14px] py-3 text-left text-base text-white'>
          <span className='inline-block h-[10px] w-[10px] rounded-full bg-current' />
          Patient
        </button>
        <button type='button' className='flex w-full cursor-pointer items-center gap-2 rounded-[10px] border-0 bg-transparent px-[14px] py-3 text-left text-base text-[#484d56]' onClick={() => dispatch(logoutUser())}>
          <FaSignOutAlt />
          Logout
        </button>
      </nav>
    </aside>
  ) 
}

export default Sidebar 
