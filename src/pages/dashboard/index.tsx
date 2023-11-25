import {useEffect, useState, useContext} from "react"
import Container from "../../components/container";
import {DashboardHeader} from '../../components/panelheader'
import { FiTrash2 } from "react-icons/fi";
import { collection, getDocs, where, query, } from "firebase/firestore";
import { db } from "../../services/FirebaseConnection";
import { AuthContext } from "../../contexts/AuthContext";
interface OngsProps{
  id:string;
  titulo:string;
  cidade: string;
  data: string;
  descricao: string;
  uid: string;
  images: OngImagesProps[];
}
interface OngImagesProps{
  name: string;
  uid: string;
  url: string;
}

export function Dashboard(){
  
  const [ongs, setOngs] = useState<OngsProps[]>([]);
  const {user} = useContext(AuthContext)

  useEffect(()=>{
    function loadOngs(){
      if(!user?.uid){
        return;
      }
      const ongRef = collection(db, 'ongs')
      const queryRef = query(ongRef, where("uid", "==", user?.uid));

      getDocs(queryRef).then((snapshot)=>{
          let listongs = [] as OngsProps[];

          snapshot.forEach(doc=>{
            listongs.push({
              id: doc.id,
              descricao: doc.data().descricao,
              cidade: doc.data().cidade,
              titulo: doc.data().titulo,
              data: doc.data().data,
              images: doc.data().images,
              uid: doc.data().uid
            })
          })
          setOngs(listongs);
      })
    }
    loadOngs();
  }, [user])
    return(
      <Container>
       <DashboardHeader/>
       <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <section className="w-full bg-white rounded-lg relative">
            <button onClick={()=>{}} className="absolute bg-white w-14 h-14 rounded-full flex items-center justify-center right-2 top-2 drop-shadow">
              <FiTrash2 size={26} color='#000'/>
            </button>
            <img className="w-full rounded-lg mb-2 max-h-70" src="https://firebasestorage.googleapis.com/v0/b/hopechild-2eea3.appspot.com/o/images%2FDsok6iPIJPf4DUnC5igaVdyjn8h2%2Fe46afe02-373c-4060-a9b8-6a1a88141c66?alt=media&token=a399bbd7-8c8d-48e9-bc30-b646b8c60387"/>
            <h1 className="font-bold mt-1 px-2 mb-2 ">TITULO</h1>
            <div className="flex flex-col px-2 ">
              <span className="text-zinc-700">
                DATA
              </span>
            <div className="w-full h-px bg-slate-200 my-2"></div>

              <div className="px-2 pb-2">
                <span className="text-black">
                  Recife - Pernambuco
                </span>
              </div>
            </div>
          </section>
       </main>
      </Container>
    )
  }
  
