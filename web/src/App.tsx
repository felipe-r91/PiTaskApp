import './styles/global.css';
import { Dashboard } from './components/Dashboard';
import { Routes, Route } from "react-router-dom";
import { Schedule } from './components/Schedule';
import { OsStatus } from './components/OsStatus';
import { Timeline } from './components/Timeline';
import { NewUser } from './components/NewUser';
import { SideNav } from './components/SideNav';
import { Broadcast } from './components/Broadcast';
import { Login } from './components/Login';
import { useState } from 'react';
import { SignIn } from './components/SignIn';

export function App() {

  const [userLogged, setUserLogged] = useState<boolean>(true)

  return (

    <div>
      <div className='flex'>
        { userLogged && 
        <SideNav />
        }
        <div className='w-full'>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path='/Dashboard' element={<Dashboard />} />
            <Route path='/Timeline' element={<Timeline />} />
            <Route path='/OsStatus' element={<OsStatus />} />
            <Route path='/Schedule' element={<Schedule />} />
            <Route path='/NewUser' element={<NewUser />} />
            <Route path='/Broadcast' element={<Broadcast/>} />
            <Route path='/SignIn' element={<SignIn/>}/>
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App;
