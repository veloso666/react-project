import {useEffect, useState, useContext} from "react"
import Container from "../../components/container";
import {DashboardHeader} from '../../components/panelheader'
import { FiTrash2 } from "react-icons/fi";
import { collection, getDocs, where, query, doc, deleteDoc } from "firebase/firestore";
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

  async function handleDeleteOng(id: string){
    const docRef = doc(db, "ongs", id);
    await deleteDoc(docRef);
    setOngs(ongs.filter(ong=> ong.id !== id))
  }

    return(
      <Container>
       <DashboardHeader/>
       <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ongs.map(ong=>(
            <section className="w-full bg-white rounded-lg relative">
              <button onClick={()=>handleDeleteOng(ong.id)} className="absolute bg-white w-14 h-14 rounded-full flex items-center justify-center right-2 top-2 drop-shadow">
                <FiTrash2 size={26} color='#000'/>
              </button>
              <img className="w-full rounded-lg mb-2 max-h-70" src={ong.images[0].url}/>
              <h1 className="font-bold mt-1 px-2 mb-2 ">{ong.titulo}</h1>
              <div className="flex flex-col px-2 ">
                <span className="text-zinc-700">
                  {ong.data}
                </span>
              <div className="w-full h-px bg-slate-200 my-2"></div>

                <div className="px-2 pb-2">
                  <span className="text-black">
                    {ong.cidade}
                  </span>
                </div>
              </div>
            </section>
          ))}
       </main>
      </Container>
    )
  }
  
