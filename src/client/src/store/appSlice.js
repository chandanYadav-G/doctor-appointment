import { createAsyncThunk, createSlice } from '@reduxjs/toolkit' 

// Shared client-side state for auth, patient details, services, and appointments.
const STORAGE_KEY = 'doctorAppointmentUser' 

// retrieved the active user from local storage when the app reloads.
const readStoredUser = () => {
  if (typeof window === 'undefined') {
    return null 
  }

  try {
    const storedUser = window.localStorage.getItem(STORAGE_KEY) 
    return storedUser ? JSON.parse(storedUser) : null 
  } catch (error) {
    return null 
  }
}

// helper keeps fetch calls consistent across all async actions.
const request = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  }) 

  const data = await response.json().catch(() => ({})) 

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong.') 
  }

  return data 
} 

export const loginUser = createAsyncThunk(
  'app/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }) 
      return data.user 
    } catch (error) {
      return rejectWithValue(error.message) 
    }
  },
) 

export const registerUser = createAsyncThunk(
  'app/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await request('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(userData),
      }) 
      return data.user 
    } catch (error) {
      return rejectWithValue(error.message) 
    }
  },
) 

export const fetchPatient = createAsyncThunk(
  'app/fetchPatient',
  async (email, { rejectWithValue }) => {
    try {
      const query = email ? `?email=${encodeURIComponent(email)}` : '' 
      const data = await request(`/api/patient${query}`) 
      return data.patient 
    } catch (error) {
      return rejectWithValue(error.message) 
    }
  },
) 

export const updatePatient = createAsyncThunk(
  'app/updatePatient',
  async ({ email, patient }, { rejectWithValue }) => {
    try {
      const data = await request(`/api/patient?email=${encodeURIComponent(email)}`, {
        method: 'PATCH',
        body: JSON.stringify(patient),
      })
      return data.patient
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const fetchServices = createAsyncThunk(
  'app/fetchServices',
  async (_, { rejectWithValue }) => {
    try {
      const data = await request('/api/services') 
      return data.services 
    } catch (error) {
      return rejectWithValue(error.message) 
    }
  },
) 

export const fetchAppointments = createAsyncThunk(
  'app/fetchAppointments',
  async ({ year, email }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams() 
      if (year) params.set('year', String(year)) 
      if (email) params.set('email', email) 

      const query = params.toString() ? `?${params.toString()}` : '' 
      const data = await request(`/api/appointments${query}`) 
      return data.appointments 
    } catch (error) {
      return rejectWithValue(error.message) 
    }
  },
) 

export const createAppointment = createAsyncThunk(
  'app/createAppointment',
  async (appointmentData, { getState, rejectWithValue }) => {
    try {
      const userEmail = getState().app.user?.email 
      const data = await request('/api/appointments', {
        method: 'POST',
        body: JSON.stringify({ ...appointmentData, email: userEmail }),
      }) 
      return data.appointment 
    } catch (error) {
      return rejectWithValue(error.message) 
    }
  },
) 

const initialState = {
  user: readStoredUser(),
  patient: null,
  services: [],
  appointments: [],
  isLoggedIn: !!readStoredUser(),
  status: 'idle',
  error: '',
} 

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = '' 
    },
    logoutUser: (state) => {
      state.user = null 
      state.patient = null 
      state.isLoggedIn = false 
      state.error = '' 
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(STORAGE_KEY) 
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading' 
        state.error = '' 
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload 
        state.patient = action.payload 
        state.isLoggedIn = true 
        state.status = 'succeeded' 
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(action.payload)) 
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed' 
        state.error = action.payload || 'Login failed' 
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading' 
        state.error = '' 
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload 
        state.patient = action.payload 
        state.isLoggedIn = true 
        state.status = 'succeeded' 
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(action.payload)) 
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed' 
        state.error = action.payload || 'Registration failed' 
      })
      .addCase(fetchPatient.fulfilled, (state, action) => {
        state.patient = action.payload 
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        state.patient = action.payload
        state.user = { ...state.user, ...action.payload }
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.user))
        }
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.services = action.payload 
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.appointments = action.payload 
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.appointments = [action.payload, ...state.appointments] 
      }) 
  },
}) 

export const { clearError, logoutUser } = appSlice.actions 
export default appSlice.reducer 
