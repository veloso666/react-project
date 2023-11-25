import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.jpg'
import {Container} from '../../components/container'
import { Input } from '../../components/input'

import {useForm} from 'react-hook-form'
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import {auth} from '../../services/FirebaseConnection'
import {createUserWithEmailAndPassword, signOut, updateProfile} from 'firebase/auth'
import { useEffect, useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'


const schema = z.object({
  name: z.string().nonempty("CAMPO OBRIGATORIO"),
  email: z.string().email("Insira um email valido").nonempty("CAMPO OBRIGATORIO"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres").refine((value)=> /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/.test(value), {
    message: "senha invalida"
  }),
  telefone: z.string().min(11, "DIGITE UM TELEFONE VALIDO").nonempty("CAMPO OBRIGATORIO"),
  cnpj: z.string().min(14, "DIGITE UM CNPJ VALIDO").nonempty("CAMPO OBRIGATORIO")
})

type FormData = z.infer<typeof schema>

export function Register(){
  const {handleInfoUser} = useContext(AuthContext);
  const navigate = useNavigate();

  const {register, handleSubmit, formState:{errors}} = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  })
  
  useEffect(() =>{
    async function handleLogout() {
      await signOut(auth)
    }
    handleLogout();
  }, [])

async function onSubmit(data: FormData){
createUserWithEmailAndPassword(auth, data.email, data.password).then(async(user)=>{
  await updateProfile(user.user, {
    displayName: data.name
  })

  handleInfoUser({
    name: data.name,
    email: data.email,
    uid: user.user.uid,
  })
  console.log("Cadastrado com sucesso!!")
  navigate("/dashboard", {replace: true})
}).catch((error) =>{
  console.log("ERRO AO CADASTRAR ESTE USUARIO")
  console.log(error)
})
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
          className='bg-white max-w-xl w-full rounded-lg p-4 '
          onSubmit={handleSubmit(onSubmit)}
          >
            <div className='mb-3'>
              <Input
              type="text"
              placeholder="digite seu nome completo..."
              name="name"
              error={errors.name?.message}
              register={register}
              />
              </div>
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
              placeholder="Ex: !exempl@"
              name="password"
              error={errors.password?.message}
              register={register}
              />
            </div>
            <div className='mb-3'>
              <Input
              type="telefone"
              placeholder="digite seu telefone..."
              name="telefone"
              error={errors.telefone?.message}
              register={register}
              />
            </div>
            <div className='mb-3'>
              <Input
              type="cnpj"
              placeholder="Ex:XX.XXX.XXX/0001-XX"
              name="cnpj"
              error={errors.cnpj?.message}
              register={register}
              />
            </div>

            <button type='submit' className='bg-zinc-900 w-full rounded-md text-white h-10 font-medium'>
              Cadastrar
            </button>
          </form>
          <Link to="/login">
            Já possui uma conta? Faça o login
          </Link>
        </div>
      </Container>
    )
  }
  
