import { Dashboard } from './components/Dashboard';
import { Header } from './components/Header';
import './styles/global.css';
import { Routes, Route } from "react-router-dom";
import { Schedule } from './components/Schedule';
import { OsStatus } from './components/OsStatus';
import { Timeline } from './components/Timeline';
import { NewUser } from './components/NewUser';
import { SideNav } from './components/SideNav';
import { Broadcast } from './components/Broadcast';

export function App() {

  return (

    <div>
      <div className='flex'>
        <SideNav />
        <div className='w-full'>
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path='/Dashboard' element={<Dashboard />} />
            <Route path='/Timeline' element={<Timeline />} />
            <Route path='/OsStatus' element={<OsStatus />} />
            <Route path='/Schedule' element={<Schedule />} />
            <Route path='/NewUser' element={<NewUser />} />
            <Route path='/Broadcast' element={<Broadcast/>} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App;
