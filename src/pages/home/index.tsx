import Container from "../../components/container"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

import { collection, getDocs, orderBy, query, where } from "firebase/firestore"
import { db } from "../../services/FirebaseConnection"
export function Home(){
const [input, SetInput] = useState()


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
  const  [ongs, setOngs] = useState<OngsProps[]>([])

  useEffect(()=>{
    
    loadOngs();
  }, [])
  function loadOngs(){
    const ongRef = collection(db, 'ongs')
    const queryRef = query(ongRef, orderBy("created", "desc"));

    getDocs(queryRef).then((snapshot)=>{
        const listongs = [] as OngsProps[];

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

  async function handleSearchOng(){
    if(input === ""){
      loadOngs();
      return;
    }

    setOngs([]);
    
    const q = query(collection(db, "ongs"), where ("name", ">=", input),
     where("name", "<=", input + "\uf8ff")
     )
    

    const querySnapshot = await getDocs(q);

    const listongs = [] as OngsProps[];

    querySnapshot.forEach((doc) =>{
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
    setOngs(listongs)
  }

    return(
    <Container>
          <section className="bg-white p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
            <input 
            className="w-full border-2 rounded-lg h-9 px-3"
            placeholder="Pesquise ongs para doar..."
            value={input}
            onChange={((e) =>SetInput(e.target.value))}
            />
            <button
            className="bg-red-500 h-9 px-8 rounded-lg text-white font-medium text-lg"
            onClick={handleSearchOng}
            >Buscar</button>
          </section>
          <h1 className="font-bold text-center mt-6 text-2xl mb-4">
            Ajude instituições de caridade em todo o Brasil
          </h1>
          <main className="grid grid-cols-1 gap-6 md:grid-cols-2 /kolg:grid-cols-3 lg:grid-cols-4 ">
            {ongs.map(ong =>( 
              <Link key={ong.id} to={`/donate/${ong.id}`} >
                <section className="w-full bg-white rounded-lg ">
                  <img
                  className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 transition-all"
                  src={ong.images[0].url}
                  alt="Instituição"
                  />
                  <h1 className="font-bold mt-1 mb-2 px-2 ">{ong.titulo}</h1>
                  <div className="flex flex-col px-2">
                    <span className="text-zinc-700 mb-6">{ong.data}</span>
                  </div>
                  <div className="px-2 pb-2">
                    <span className="text-black">{ong.cidade}</span>
                  </div>
                </section>
              </Link>
            ))}

            
          </main>
    </Container>
    )
  }
  
