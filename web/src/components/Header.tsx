import "@fontsource/dm-sans";
import { TbChevronDown, TbDatabaseSearch, TbUser } from 'react-icons/tb';
import { AvatarColab } from "../assets/AvatarColab";


export function Header() {


  return (
    <div className='h-20 flex bg-white items-center justify-between'>
      <div className="text-white">
        hi
      </div>
      <div className='pr-36'>
      <div className="bg-off-white w-[400px] h-9 flex flex-row items-center rounded-xl pr-3">
        <div className="p-4">
        <TbDatabaseSearch size={20} color='#8C97A8'/>
        </div>
        <div className="font-sans text-sm text-purple-xdark">
          Pesquisar no banco de dados
        </div> 
      </div>
      </div>
      <div className='h-fit w-fit flex justify-between items-center gap-2 pr-3'>
        <AvatarColab width="w-[40px]" height="h-[40px]" img="felipe.png" name="F" surname="R"/>
        <button>
        <TbChevronDown size={20} color='#8C97A8'/>
        </button>
      </div>     
  </div>
    
    
  )
}
