import { Link } from 'react-router-dom'
import logo from '../../assets/logo.jpg'
import {Container} from '../../components/container'
import { Input } from '../../components/input'

import {useForm} from 'react-hook-form'
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'

const schema = z.object({
  email: z.string().email("Insira um email valido").nonempty("O campo obrigatorio"),
  password: z.string().nonempty("Campo senha é obrigatorio")
})

type FormData = z.infer<typeof schema>

export function Login(){
  const {register, handleSubmit, formState:{errors}} = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  })
function onSubmit(data: FormData){
console.log(data)
}

    return(
      <Container>
        <div className='w-full min-h-screen flex justify-center items-center flex-col gap-4'>
          <Link to="/" className='mb-6 max-w-sm w-full'>
                <img 
                src={logo}
                alt='logo do site'
                className='w-full'
                />
          </Link>
          
          <form 
          className='bg-white max-w-xl w-full rounded-lg'
          onSubmit={handleSubmit(onSubmit)}
          >
            <div className='mb-3'>
              <Input
              type="email"
              placeholder="digite seu email..."
              name="email"
              error={errors.email?.message}
              register={register}
              />
            </div>
            <div className='mb-3'>
              <Input
              type="password"
              placeholder="digite sua senha..."
              name="password"
              error={errors.password?.message}
              register={register}
              />
            </div>

            <button>
              acessar
            </button>
          </form>
        </div>
      </Container>
    )
  }
  
