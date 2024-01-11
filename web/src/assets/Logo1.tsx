import logo from '/src/assets/TASKGO!login.png'

interface LogoProps {
 width?: number;
}

export function Logo( props: LogoProps){
  return(
    <div className='h-fit w-fit'>
      <img
        //style={{marginLeft:4, marginTop:10, width:50}}
        title='logo' 
        src={logo}
        width={props.width}
        />
    </div>
  )
}