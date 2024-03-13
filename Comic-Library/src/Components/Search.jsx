import { useState } from "react";
import md5   from "md5";    
import Character from "./Character";  
import Comics from "./Comics";


const Search = () => {
const [characterName, setCharacterName] = useState('')
const [characterData, setCharacterData] =useState(null)
const [comicData, setComicData]= useState(null)


const publicKey = import.meta.env.VITE_PUBLIC_KEY
const privateKey = import.meta.env.VITE_PRIVATE_KEY

const handleSubmit = (event) => {
    event.preventDefault();

    getCharacterData();
};

const getCharacterData = () => {
    setCharacterData(null);
    setComicData(null);

    const timeStamp = new Date().getTime();
    const hash = generateHash(timeStamp);

    const url = `https://gateway.marvel.com:443/v1/public/characters?apikey=${publicKey}&hash=${hash}&ts=${timeStamp}&nameStartsWith=${characterName}&limit=100`;

    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        setCharacterData(result.data);
        
      }).catch((error)=>{
        console.log('there was an error:', error);
      })
    }
    const getComicData = (characterId) => {
        window.scrollTo({ top: 0, left: 0 });
    
        const timeStamp = new Date().getTime();
        const hash = generateHash(timeStamp);
    
        const url = `https://gateway.marvel.com:443/v1/public/characters/${characterId}/comics?apikey=${publicKey}&hash=${hash}&ts=${timeStamp}`;
    
        fetch(url)
          .then((response) => response.json())
          .then((result) => {
            setComicData(result.data);
            console.log(result.data);
          })
          .catch(() => {
            console.log("error while getting comic data");
          });
      };

      const handleChange =(event)=>{
          setCharacterName(event.target.value);
      };
    const generateHash = (timestamp)=>{
        return md5(timestamp+privateKey+publicKey)
    }
    const handleReset =()=>{
      setCharacterData(null);
      setComicData(null)
      setCharacterName("")
    };
    return (  
        <>
            <form action="" className="search" onSubmit={handleSubmit}>
                <input type="text" placeholder="ENTER CHARACTER NAME" onChange={handleChange}/>
           
                <div className="buttons">
                    <button type="submit">Get Character Data</button>
                    <button type="reset" className="reset" onClick={handleReset}>Reset</button>
                 </div>
        </form>
        {!comicData &&characterData && characterData.results[0] && (
        <Character data= {characterData.results} onClick = {getComicData} /> 
        )}
        {comicData && comicData.results[0] && (
        <Comics data={comicData.results} onClick={() => {}} />
        )}
       
        </>
    );
}
 
export default Search
;