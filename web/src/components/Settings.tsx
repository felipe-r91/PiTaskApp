import '../styles/configHover.css'
import { TbClipboardData, TbDeviceLandlinePhone, TbPencilCog, TbUserEdit } from "react-icons/tb";
import React, { useEffect, useState } from "react";
import { api } from '../lib/axios';

type User = {
  id: number;
  name: string;
  surname: string;
  role: string;
  email: string;
  password: string;
  photo: string;
  phone: string;
}


export function Settings() {

  const role = sessionStorage.getItem('role')
  const [page, setPage] = useState<number>()
  const [workers, setWorkers] = useState<User[]>([])
  const [admins, setAdmins] = useState([])
  const [allUsers, setAllUsers] = useState<User[]>([])

  const menus = [
    { name: 'Exportar Relatórios', icon: TbClipboardData },
    { name: 'Editar usuários', icon: TbUserEdit },
    { name: 'Lista de contatos', icon: TbDeviceLandlinePhone },
    { name: 'Edição completa da OS', icon: TbPencilCog }
  ]

  useEffect(() => {
    api.get('/workers').then(response => {
      setWorkers(response.data)
    })
  }, [page])

  useEffect(() => {
    api.get('/admins').then(response => {
      setAdmins(response.data)
    })
  }, [page])

  useEffect(() => {
    setAllUsers([...workers, ...admins])
  }, [page])

  return (
    <div className="w-full">
      <section className="h-screen bg-off-white">
        <div className="w-fit h-fit text-purple-xdark text-2xl font-bold px-8 py-8">
          Configurações
        </div>
        <div className="w-full pt-5">
          <div className="flex gap-5 px-10">
            {menus.map((item, i) =>
              <button
                type="button"
                key={item.name}
                onClick={() => setPage(i)}
                className={`configIcon w-[267px] h-[47px] rounded-lg items-center justify-center flex gap-3 ${page == i ? 'bg-[#EDECFE] text-purple-light' : ''}`}>
                <div>{React.createElement(item.icon, { size: "24" })}</div>
                <div className="font-semibold">{item.name}</div>
              </button>
            )}
          </div>
          <div>
            {page === 0 &&
              <div>Exportar Relat</div>
            }
            {page === 1 &&
              <div className='pl-32 pt-24'>
                <form>
                  {allUsers.map((user, i) =>
                    <div className='flex gap-6'>
                      <div>
                      <fieldset className={`grid w-fit pt-2 ${i === 0 ? 'grid-rows-2' : ''}`}>
                          {i == 0 &&
                          <label className='pb-2 text-purple-light font-semibold flex justify-center'> Nome</label>
                          }
                          <input
                            type='text'
                            value={user.name}
                            className='text-[#768396] bg-white shadow-[#E5E5ED] focus:shadow-purple-light inline-flex h-[32px] w-[150px] flex-1 items-center justify-center rounded-xl px-[10px] py-2 text-[15px] leading-tight shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]'
                          >
                          </input>
                        </fieldset>
                      </div>
                      <div>
                        <fieldset className={`grid w-fit pt-2 ${i === 0 ? 'grid-rows-2' : ''}`}>
                          {i === 0 &&
                          <label className='pb-2 text-purple-light font-semibold flex justify-center'>Sobrenome</label>
                          }
                          <input
                            type='text'
                            value={user.surname}
                            className='text-[#768396] bg-white shadow-[#E5E5ED] focus:shadow-purple-light inline-flex h-[32px] w-[150px] flex-1 items-center justify-center rounded-xl px-[10px] py-2 text-[15px] leading-tight shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]'
                          >
                          </input>
                        </fieldset>
                      </div>
                      <div>
                      <fieldset className={`grid w-fit pt-2 ${i === 0 ? 'grid-rows-2' : ''}`}>
                          {i === 0 &&
                          <label className='pb-2 text-purple-light font-semibold flex justify-center'>Função</label>
                          }
                          <input
                            type='text'
                            value={user.role}
                            className='text-[#768396] bg-white shadow-[#E5E5ED] focus:shadow-purple-light inline-flex h-[32px] w-[150px] flex-1 items-center justify-center rounded-xl px-[10px] py-2 text-[15px] leading-tight shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]'
                          >
                          </input>
                        </fieldset>
                      </div>
                      <div>
                      <fieldset className={`grid w-[20px] pt-2 ${i === 0 ? 'grid-rows-2' : ''}`}>
                          {i == 0 && 
                          <label className='pb-2 text-purple-light font-semibold flex justify-center'>Email</label>
                          }
                          <input
                            type='text'
                            value={user.email}
                            className='text-[#768396] bg-white shadow-[#E5E5ED] focus:shadow-purple-light inline-flex h-[32px] w-[250px] flex-1 items-center justify-center rounded-xl px-[10px] py-2 text-[15px] leading-tight shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]'
                          >
                          </input>
                        </fieldset>
                      </div>
                      <div>
                      <fieldset className={`grid w-fit pt-2 ${i === 0 ? 'grid-rows-2' : ''}`}>
                          {i === 0 &&
                          <label className='pb-2 text-purple-light font-semibold flex justify-center'>Telefone</label>
                          }
                          <input
                            type='text'
                            value={user.phone}
                            className='text-[#768396] bg-white shadow-[#E5E5ED] focus:shadow-purple-light inline-flex h-[32px] w-[150px] flex-1 items-center justify-center rounded-xl px-[10px] py-2 text-[15px] leading-tight shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]'
                          >
                          </input>
                        </fieldset>
                      </div>
                      <div>
                      <fieldset className={`grid w-fit pt-2 ${i === 0 ? 'grid-rows-2' : ''}`}>
                          {i === 0 &&
                          <label className='pb-2 text-purple-light font-semibold flex justify-center'>Password</label>
                          }
                          <input
                            type='password'
                            value={user.password}
                            className='text-[#768396] bg-white shadow-[#E5E5ED] focus:shadow-purple-light inline-flex h-[32px] w-[150px] flex-1 items-center justify-center rounded-xl px-[10px] py-2 text-[15px] leading-tight shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]'
                          >
                          </input>
                        </fieldset>
                      </div>
                    </div>
                  )}
                </form>
              </div>

            }
            {page === 2 &&
              <div className='pt-28 pl-48'>
                <table className="divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="py-2 px-16 text-purple-light">Nome</th>
                      <th className="py-2 px-16 text-purple-light">Sobrenome</th>
                      <th className="py-2 px-4 text-purple-light">Email</th>
                      <th className="py-2 px-4 text-purple-light">Telefone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workers.map((user, i) =>
                      <tr key={i} className="divide-x divide-gray-200">
                        <td className="py-2 px-4 text-[#768396]">{user.name}</td>
                        <td className="py-2 px-4 text-[#768396]">{user.surname}</td>
                        <td className="py-2 px-4 text-[#768396]">{user.email}</td>
                        <td className="py-2 px-4 text-[#768396]">{user.phone}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            }
            {page === 3 &&
              <div>Edit OS</div>
            }
          </div>
        </div>
      </section>
    </div>
  )
}