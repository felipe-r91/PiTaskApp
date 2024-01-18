import './styles/global.css';
import { Dashboard } from './components/Dashboard';
import { Routes, Route, Navigate } from "react-router-dom";
import { Schedule } from './components/Schedule';
import { OsStatus } from './components/OsStatus';
import { Timeline } from './components/Timeline';
import { NewUser } from './components/NewUser';
import { SideNav } from './components/SideNav';
import { Broadcast } from './components/Broadcast';
import { Login } from './components/Login';
import { SignIn } from './components/SignIn';
import { useAuth } from './components/AuthContext';

export function App() {
  const { user } = useAuth();

  return (
    <div>
      <div className='flex'>
        { user && 
          <SideNav />
        }
        <div className='w-full'>
          <Routes>
            {!user && <Route path="/" element={<Login />} />}
            {user && <Route path='/Dashboard' element={<Dashboard />} />}
            {user && <Route path='/Timeline' element={<Timeline />} />}
            {user && <Route path='/OsStatus' element={<OsStatus />} />}
            {user && <Route path='/Schedule' element={<Schedule />} />}
            {user && <Route path='/NewUser' element={<NewUser />} />}
            {user && <Route path='/Broadcast' element={<Broadcast/>} />}
            {!user && <Route path='/SignIn' element={<SignIn/>} />}
            {user && <Route path='*' element={<Navigate to='/Dashboard' />} />}
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
