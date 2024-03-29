import axios from "axios";
import React, { 
  useState, 
  useEffect, 
  useContext, 
  createContext } from "react";


const authContext = createContext();

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return useContext(authContext);
};

// function getCookie(key) {
//   var b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
//   return b ? b.pop() : "";
// }

function useProvideAuth() {
  const [checking, setChecking] = useState(true);
  const [lastlc, setLastLc] = useState('');
  const [user, setUser] = useState(null);

  const signin = () => {
  };

  const signout = () => {
  };


  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any ...
  // ... component that utilizes this hook to re-render with the ...
  // ... latest auth object.
  useEffect(() => {
    const iHandle = setInterval(()=>{
      let lc=window.localStorage.getItem('lc')||'';

      if (lc!==lastlc) {
        setChecking(true);
        setLastLc(lc);
        axios.defaults.headers.common['Authorization']='Bearer '+lc;
        axios.get('/api/user')
          .then(res=>{
            setUser(res.data);
          })
          .catch(err=>{
            console.error(err);
          }).finally(()=>{
            setChecking(false);
          })
      } else {
        setChecking(false);
      }
    }, 1000);
    // Cleanup subscription on unmount
    return () => {
      clearInterval(iHandle)
    }
  },[checking, lastlc]);

  return {
    checking,
    signin,
    signout,
    user
  }
}