import Header from "./components/1Header"
import Main from "./components/2Main"
import Footer from "./components/3Footer"
import {useState , createContext, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faChevronUp} from "@fortawesome/free-solid-svg-icons";

// eslint-disable-next-line react-refresh/only-export-components
export const modeContext = createContext();

function App() {

  const [mode , setMode] = useState(localStorage.getItem('crudsMode') ? localStorage.getItem('crudsMode') : '');
  
  useEffect(() => {
    localStorage.setItem('crudsMode' , mode);
  } , [mode])


  const [up , setUp] = useState({opa:0 , showHide:'hide'});

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 80) {
        setUp({opacity:1 , showHide:'show'});
      } else {
        setUp({opacity:0 , showHide:'hide'});
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup listener on component unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  
  return (
    <modeContext.Provider value={[mode , setMode]}>
      <div className={`content ${mode}`}>
        <div className={`container-all`}>
          <Header/>
          <Main/>
          <Footer/>

          <button onClick={() => window.scrollTo(0, 0)} style={{opacity: up.opa}} className={`scrool-up ${up.showHide}`}>
            <FontAwesomeIcon icon={faChevronUp} />
          </button>

        </div>
      </div>
    </modeContext.Provider>
  )
}

export default App
