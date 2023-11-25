import { useEffect, useState } from "react"
import Container from "../../components/container"
import {FaWhatsapp} from "react-icons/fa"
import { useParams } from "react-router-dom"
import { getDoc, doc,  } from "firebase/firestore"
import { db } from "../../services/FirebaseConnection"
import {Swiper, SwiperSlide} from "swiper/react"

interface OngsProps{
  id:string;
  name:string;
  cnpj: string;
  titulo:string;
  cidade: string;
  data: string;
  descricao: string;
  uid: string;
  whatsapp: string;
  images: OngImagesProps[];
}
interface OngImagesProps{
  name: string;
  uid: string;
  url: string;
}

export function Donate(){

  
  const [ongs, setOngs] = useState<OngsProps>()
  const {id} = useParams()
  const [sliderPerView, setSliderPerView] = useState<number>(2)

  useEffect(() =>{
    async function loadOng(){
      if(!id){ return }

      const docRef = doc(db, "ongs", id);
      getDoc(docRef).then((snapshot)=>{
        setOngs({
          id: snapshot.id,
          name: snapshot.data()?.name,
          whatsapp: snapshot.data()?.whatsapp,
          cnpj: snapshot.data()?.cnpj,
          descricao: snapshot.data()?.descricao,
          cidade: snapshot.data()?.cidade,
          titulo: snapshot.data()?.titulo,
          data: snapshot.data()?.data,
          images: snapshot.data()?.images,
          uid: snapshot.data()?.uid,
        })
      })
    }
    loadOng();  
  }, [id])

  useEffect(()=> {
    function handleResize(){
      if(window.innerWidth <720){
        setSliderPerView(1);
      }else{
        setSliderPerView(2);
      }
    }

    handleResize();

    window.addEventListener("resize", handleResize)

    return()=>{
      window.removeEventListener("resize", handleResize)
    }
  },[])
    return(
      <Container>
        <Swiper slidesPerView={sliderPerView} pagination={{clickable: true}} navigation>
        {ongs?.images.map(image => (
          <SwiperSlide key={image.name}>
            <img src={image.url} className="w-full h-96 object-cover "/>
          </SwiperSlide>
        ))}
        </Swiper>

        {ongs && (
          <main className="w-full bg-white rounded-lg p-6 my-4">
            <div className="flex flex-col sm:flex-row mb-4 items-center justify-between">
              <h1 className="font-bold text-3xl text-black">{ongs?.titulo}</h1>
              <h1 className="font-bold text-3xl text-black">{ongs?.data}</h1>
            </div>
            <h2>Cidade: {ongs?.cidade}</h2>
            <div className="flex w-full gap-6 my-4">
              <div className="flex flex-column gap-4">
                <div>
                  <p>Ong</p>
                  <strong>{ongs?.name}</strong>
                </div>
                <div>
                  <p>CNPJ</p>
                  <strong>{ongs?.cnpj}</strong>
                </div>
              </div>
              <div className="flex flex-column gap-4">
              </div>
            </div>
            <strong>Descrição: </strong>
            <p className="mb-4 ">{ongs?.descricao}</p>

            <strong>Telefone / Whatsapp</strong>
            <p>{ongs.whatsapp}</p>

            <a href={`https://api.whatsapp.com/send?phone=${ongs?.whatsapp}&text=Olá vi seu anuncio e gostaria de ajudar.`} target="_blank" className="bg-green-500 w-full text-white flex items-center justify-center gap-2 my-6 h-11 text-xl rounded-lg font-medium cursor-pointer">
              Conversar com representante
              <FaWhatsapp size={26} color="#FFF"/>
            </a>
          </main>
        )}
      </Container>
    )
  }
  
