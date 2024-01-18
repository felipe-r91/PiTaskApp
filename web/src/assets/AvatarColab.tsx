import * as Avatar from '@radix-ui/react-avatar';

interface AvatarColabProps{
  width: string;
  height: string;
  img?: string;
  name?: string;
  surname?: string;
}

export function AvatarColab(props: AvatarColabProps){

  return(

  <div className="flex gap-5">
    <Avatar.Root className={`inline-flex ${props.height} ${props.width} select-none items-center justify-center overflow-hidden rounded-full align-middle shadow-custom border border-white`}>
      <Avatar.Image
        className="h-full w-full rounded-[inherit] object-cover"
        src={`/src/assets/uploads/${props.img}`}
        alt="avatar"
      />
      <Avatar.Fallback
        className="text-purple-light leading-1 flex h-full w-full items-center justify-center bg-purple-200 text-[15px] font-medium"
        delayMs={600}
        >
          <div className='text-purple-dark text-base font-semibold'>
            {props.name?.toUpperCase().substring(0,1)}
          </div>
          <div className='text-purple-dark text-base font-semibold'>
            {props.surname?.toUpperCase().substring(0,1)}
          </div>
        
      </Avatar.Fallback>
    </Avatar.Root>
    
  </div>

  )
}
