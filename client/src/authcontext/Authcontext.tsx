"use client"
import {useState,createContext,useEffect,Dispatch,SetStateAction,ReactNode, useContext} from "react"




interface Alumni {
  name: string;
  email: string;
  role: "student" | "alumni";
  batch: number;
  college: string;
  branch: string;
}



interface AuthContextype{
    user: any;
    setUser:Dispatch<SetStateAction<any>>;
    loading:boolean;
    setloading:Dispatch<SetStateAction<any>>;
    inputval: {
      college: string;
      batch: string;
      branch: string;
    };
    setInputval:Dispatch<SetStateAction<any>>;
    alumni:Alumni[];
    setAlumni:Dispatch<SetStateAction<any>>;
    

}


export const AuthProvider=createContext<AuthContextype | null>(null);



export default function Authcontext({children}:{children:ReactNode}){
    
  const [inputval, setInputval] = useState<{ college: string; batch: string; branch: string }>({
    college: "",
    batch: "",
    branch: ""
  });
    const [loading,setloading]=useState<boolean>(false);   
    const [user,setUser]=useState<null>(null);
    const [alumni,setAlumni]=useState<Alumni[]>([]);

    // const fetchauthentication=async ()=>{
    //     try{
    //         const res=await fetch("http://localhost:5000/auth/authenticate",{method:"GET",credentials:"include"})
    //         const result=await res.json()
    //         if(result){
    //             setUser(result.userid)
    //         }
    //     }catch(err){
    //         setUser(null);
    //         console.log(err);
    //     }

    // }
    // useEffect(()=>{
    //     fetchauthentication();
    // },[])


    const fetchAlumniByFilter = async () => {
      try {

        console.log("fetching form frontend....")
        console.log(inputval);
        const query = new URLSearchParams(inputval as Record<string, string>).toString();
        const res = await fetch(`http://localhost:5000/alumni?${query}`, {
          method: "GET"
        });
    
        const data = await res.json();
        console.log("The length of data is ",data.length);
        setAlumni(data); // assuming the backend returns an array
      } catch (err) {
        console.error("Error fetching alumni:", err);
      }
    };
    
    useEffect(()=>{
      fetchAlumniByFilter();
    },[inputval])

    return(
            <AuthProvider.Provider value={{user,setUser,loading,setloading,inputval,setInputval,alumni,setAlumni
                
            }}>
            {children}
            </AuthProvider.Provider>
    )
}



export const authhook=()=>{
    const context=useContext(AuthProvider)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
      }
      return context;
}