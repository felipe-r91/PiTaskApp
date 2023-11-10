import logo from '/src/assets/TASKGO!.png'


export function Logo(){
  return(
    <div className='h-fit w-fit'>
      <img
        style={{marginLeft:4, marginTop:10, width:50}}
        title='logo' 
        src={logo}/>
      <div className='font-sans text-purple-xdark text-[12px] font-semibold pl-1'>
        TASKGO!
      </div>
    </div>
  )
}