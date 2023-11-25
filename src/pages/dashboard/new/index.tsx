import Container from "../../../components/container";
import { DashboardHeader } from "../../../components/panelheader";
import { FiTrash, FiUpload } from "react-icons/fi";
import {useForm} from "react-hook-form"
import { Input } from "../../../components/input";
import {z} from "zod"
import { zodResolver } from "@hookform/resolvers/zod"; 
import { ChangeEvent, useState, useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import {v4 as uuidV4 } from "uuid"
import { storage, db } from "../../../services/FirebaseConnection";
import {ref, uploadBytes, getDownloadURL, deleteObject} from 'firebase/storage'
import {addDoc, collection} from 'firebase/firestore'

const schema = z.object({
  titulo: z.string().nonempty("Campo obrigatorio"),
  nomeDaOng: z.string().nonempty("Campo obrigatorio"),
  cidade: z.string().nonempty("Campo obrigatorio"),
  data: z.string().nonempty("CAMPO OBRIGATORIO"),
  whatsapp: z.string().min(1, "Campo obrigatorio").refine((value)=> /^(\d{11,12})$/.test(value), {
    message: "Numero de tefelone invalido"
  }),
  descricao: z.string().nonempty("Campo obrigatorio"),
  cnpj: z.string().refine((value)=> /^(\d{14})$/.test(value), {
    message: "CNPJ INVALIDO"
  })
})

type FormData = z.infer<typeof schema>;

interface ImageItemProps{
  uid: string;
  name: string;
  previewUrl: string;
  url: string;
}

export function New(){
  const {user} = useContext(AuthContext)
  const {register, handleSubmit, formState:{errors}, reset} = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  })

  const [ongImages, setOngImages ] = useState<ImageItemProps[]>([])

  async function handleFile(e: ChangeEvent<HTMLInputElement>){
    if(e.target.files && e.target.files[0]){
      const image = e.target.files[0]

    if(image.type === 'image/jpeg' || image.type === 'image/png'){
      await handleUpload(image);
    }else{
      alert("Envie uma imagem .jpeg ou .png");
      return;
    }
    }
  }

  async function handleUpload(image: File){
    if(!user?.uid){
      return;
    }

    const currentUid = user?.uid;
    const uidImage = uuidV4();

    const uploadRef = ref(storage, `images/${currentUid}/${uidImage }`)

    uploadBytes(uploadRef, image).then((snapshot)=>{
      getDownloadURL(snapshot.ref).then((downloadUrl)=>{
          const imageItem={
            name: uidImage,
            uid: currentUid,
            previewUrl: URL.createObjectURL(image),
            url: downloadUrl,
          }


          setOngImages((images)=>[...images, imageItem])
      })
    })

  }

  function onsubmit(data: FormData){
    if(ongImages.length === 0){
      alert("ENVIE ALGUMA IMAGEM");
      return;
      }
    const ongListImages = ongImages.map(ong=>{
      return{
        uid: ong.uid,
        name: ong.name,
        url: ong.url
      }
    })

    addDoc(collection(db, "ongs"), {
      titulo: data.titulo,
      name: data.nomeDaOng,
      cidade: data.cidade,
      data: data.data,
      whatsapp: data.whatsapp,
      cnpj: data.cnpj,
      descricao: data.descricao,
      created: new Date(),
      owner: user?.name,
      uid: user?.uid,
      images: ongListImages
    }).then(()=>{
      reset();
      setOngImages([]);
      console.log("CADSTRADO COM SUCESSO")
    }).catch((error)=>{
      console.log(error)
      console.log("ERRO AO CADASTRAR")
    })

  }
  async function handleDeleteImage(item: ImageItemProps){
      const imagePath = `images/${item.uid}/${item.name}`

      const imageRef = ref(storage,  imagePath);

      try{
        await deleteObject(imageRef)
        setOngImages(ongImages.filter((ong)=>ong.url!== item.url))
      }catch(err){
        console.log("ERRO AO EXCLUIR A FOTO")
      }
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
          <input type="file" accept="image/*" className="opacity-0 cursor-pointer" onChange={handleFile}/>
        </div>
      </button>

      {ongImages.map(item=>(
        <div key={item.name} className="w-full h-32 flex items-center justify-center relative">
          <button className="absolute" onClick={()=> handleDeleteImage(item)}>
            <FiTrash size={28} color="#000"/>
          </button>
          <img src={item.previewUrl}className="rounded-lg w-full h-32 object-cover" alt="Fotos ongs" />
        </div>
      ))}
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
          <div>
              <p className="mb-2 font-medium">CNPJ</p>
              <Input type="text" register={register} name="cnpj" error={errors.cnpj?.message} placeholder="Ex:XX.XXX.XXX/0001-XX"/>
          </div>
          <div>
              <p className="mb-2 font-medium">Data</p>
              <Input type="text" register={register} name="data" error={errors.data?.message} placeholder="Ex:dd/MM/yyyy"/>
          </div>
          </div>
          <div className="mb-3">
              <p className="mb-2 font-medium">Descrição</p>
              <textarea className="border-2 w-full rounded-md h-24 px-2 " {...register("descricao")} name="descricao" id="descricao" placeholder="Digite a descrição completa..."/>
              {errors.descricao && <p className="mb-1 text-red-500">{errors.descricao.message}</p>}
          </div>
          <button type="submit" className="w-full h-10 rounded-md bg-zinc-900 text-white font-medium">Cadastrar</button>
        </form>
       </div>
      </Container>
    )
  }
  
