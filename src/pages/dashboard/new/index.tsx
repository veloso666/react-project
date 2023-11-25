import Container from "../../../components/container";
import { DashboardHeader } from "../../../components/panelheader";

import { FiUpload } from "react-icons/fi";
import {useForm} from "react-hook-form"
import { Input } from "../../../components/input";
import {z} from "zod"
import { zodResolver } from "@hookform/resolvers/zod"; 

const schema = z.object({
  titulo: z.string().nonempty("Campo obrigatorio"),
  nomeDaOng: z.string().nonempty("Campo obrigatorio"),
  cidade: z.string().nonempty("Campo obrigatorio"),
  whatsapp: z.string().min(1, "Campo obrigatorio").refine((value)=> /^(\d{11,12})$/.test(value), {
    message: "Numero de tefelone invalido"
  }),
  descricao: z.string().nonempty("Campo obrigatorio")
})

type FormData = z.infer<typeof schema>;

export function New(){
  const {register, handleSubmit, formState:{errors}, reset} = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  })

  function onsubmit(data: FormData){
    console.log(data)
  }

    return(
      <Container>
       <DashboardHeader/>

       <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
      <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48">
        <div className="absolute cursor-pointer ">
          <FiUpload size={30} color='#000'/> 
        </div>
        <div className="cursor-pointer ">
          <input type="file" accept="image/*" className="opacity-0 cursor-pointer"/>
        </div>
      </button>
       </div>
       <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
        <form className="w-full" onSubmit={handleSubmit(onsubmit)}>
          <div className="mb-3">
              <p className="mb-2 font-medium">Titulo</p>
              <Input type="text" register={register} name="titulo" error={errors.titulo?.message} placeholder="Ex:Precisamos de doação"/>
          </div>
          <div className="mb-3">
              <p className="mb-2 font-medium">Nome da ong</p>
              <Input type="text" register={register} name="nomeDaOng" error={errors.nomeDaOng?.message} placeholder="Ex:ongs do bem..."/>
          </div>
          <div className="flex w-full mb-3 flex-row items-center gap-4">
          <div>
              <p className="mb-2 font-medium">Cidade</p>
              <Input type="text" register={register} name="cidade" error={errors.cidade?.message} placeholder="Ex:Recife..."/>
          </div>
          <div>
              <p className="mb-2 font-medium">Whatsapp</p>
              <Input type="text" register={register} name="whatsapp" error={errors.whatsapp?.message} placeholder="Ex:81974372048..."/>
          </div>
          </div>
          <div className="mb-3">
              <p className="mb-2 font-medium">Descrição</p>
              <textarea className="border-2 w-full rounded-md h-24 px-2 " {...register("descricao")} name="descricao" id="descricao" placeholder="Digite a descrição completa..." />
              {errors.descricao && <p className="mb-1 text-red-500">{errors.descricao.message}</p>}
          </div>
          <button type="submit" className="w-full h-10 rounded-md bg-zinc-900 text-white font-medium">Cadastrar</button>
        </form>
       </div>
      </Container>
    )
  }
  
