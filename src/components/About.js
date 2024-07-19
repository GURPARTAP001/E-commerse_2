import React ,{useState,useEffect} from 'react'
import Navbar from './Navbar'
import {auth,fs} from '../Config'

function About() {

 

    // getting current user function
    function GetCurrentUser(){
        const [user, setUser]=useState(null);
        useEffect(()=>{
            auth.onAuthStateChanged(user=>{
                if(user){
                    fs.collection('users').doc(user.uid).get().then(snapshot=>{
                        setUser(snapshot.data().FullName);
                    })
                }
                else{
                    setUser(null);
                }
            })
        },[])
        return user;
    }

    const user = GetCurrentUser();

 // state of totalProducts
 const [totalProducts, setTotalProducts]=useState(0);
 // getting cart products   
 useEffect(()=>{        
     auth.onAuthStateChanged(user=>{
         if(user){
             fs.collection('Cart ' + user.uid).onSnapshot(snapshot=>{
                 const qty = snapshot.docs.length;
                 setTotalProducts(qty);
             })
         }
     })       
 },[]) 



  return (
    <div>
       <Navbar user={user} totalProducts={totalProducts} /> 
      about
    </div>
  )
}

export default About
