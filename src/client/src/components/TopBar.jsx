import { FaBars } from 'react-icons/fa' 
import { NavLink } from 'react-router-dom' 

// Top navigation links for the patient dashboard sections.
const items = [
  { to: '/services', label: 'Services' },
  { to: '/book-appointment', label: 'Book an appointment' },
  { to: '/my-appointments', label: 'My appointment' },
] 

function TopBar({ onToggleSidebar }) {
  return (
    <header className='flex min-h-16 items-center justify-between border-b border-white/20 bg-[#6d1d93] px-[12px] pr-[18px] text-white max-[900px]:flex-wrap max-[900px]:py-[10px]'>
      <div className='flex items-center gap-[18px]'>
        <button type='button' className='cursor-pointer border-0 bg-transparent text-[1.4rem] text-white' onClick={onToggleSidebar} aria-label='Toggle sidebar'>
          <FaBars />
        </button>
        <div className='text-[1.9rem] font-bold'>Patient System</div>
      </div>

      <nav className='flex items-center gap-[14px] max-[900px]:w-full max-[900px]:flex-wrap max-[900px]:justify-end'>
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `inline-flex min-h-9 items-center justify-center rounded-[18px] border px-[1.1rem] py-[0.55rem] text-[0.95rem] text-white no-underline transition-all duration-200 ${isActive ? 'bg-white/20 border-white text-white font-semibold shadow-sm' : 'border-white/80 bg-white/[0.06]'}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  ) 
}

export default TopBar 
