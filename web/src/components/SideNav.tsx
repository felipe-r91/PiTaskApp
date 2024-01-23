import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TbCalendar, TbDashboard, TbTimelineEvent, TbReport, TbUserPlus, TbSettings, TbLogout } from 'react-icons/tb';
import '../styles/sideNavIcon.css';
import { Logo } from '../assets/Logo';
import { AvatarColab } from '../assets/AvatarColab';
import { api } from '../lib/axios';
import { useAuth } from './AuthContext';

type User = {
  name: string;
  surname: string;
  photo: string;
}

export function SideNav() {

  const [user, setUser] = useState<User>()
  const userId = sessionStorage.getItem('id')
  const { logout } = useAuth()
  const nav = useNavigate()

  useEffect(() => {
    api.get('/userLogged', {
      params: {
        userId
      }
    }).then(response => {
      setUser(response.data[0])
    })
  },[])

  function handleLogout(){
    logout()
    alert('Logout realizado!')
    nav('/', {replace: true})
  }

  const menus = [
    { name: 'Dashboard', link: '/Dashboard', icon: TbDashboard },
    { name: 'Status', link: '/OsStatus', icon: TbReport },
    { name: 'Cronograma', link: '/Schedule', icon: TbCalendar },
    { name: 'Linha do Tempo', link: '/Timeline', icon: TbTimelineEvent },
    { name: 'Novo Usuário', link: '/NewUser', icon: TbUserPlus },
    { name: 'Configurações', link: '/', icon: TbSettings },
    { name: 'Logout', link: '/', icon: TbLogout}
  ]

  const [open] = useState(false);

  return (

    <div className="bg-[#FBFAFF] min-w-[80px] flex flex-col items-center">
      <div className='mt-5 mx-2'>
      <Logo width={70}/>
      </div>
      <div className='pt-16'>
      <AvatarColab width={'w-[45px]'} height={'h-[45px]'} img={user?.photo} name={user?.name} surname={user?.surname}/>
      </div>
      <div className="mt-20 flex flex-col gap-8">
        {menus?.map((menu, i) => (
          <Link
            to={menu?.link}
            key={i}
            className='sideNavIcon z-[9] group flex items-center gap-3.5 font-medium p-2 rounded-2xl transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-purple-light duration-300 hover:shadow-custom'
            onClick={menu.name === 'Logout' ? handleLogout : undefined}
          >
            <div>{React.createElement(menu?.icon, { size: "24" })}</div>
            <h2
              className={`${open && "hidden"
                } absolute left-48 bg-white font-semibold whitespace-pre text-purple-light rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
            >
              {menu?.name}
            </h2>
          </Link>
        ))}
      </div>
      
    </div>
  );
};


