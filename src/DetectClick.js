import React,{useEffect,useState} from 'react';
import Draw from './useMouse';


function Detect(props){
    let event=props.e;
    let setclick=props.setclick;
    let setpre=props.setpre;
    if(event.type=="mousedown"){
        setpre({prex:event.pageX,
            prey:event.pageY
        })
        if(event.button==0){
            setclick({leftClick:true,
                        rightClick:false});
        }
        if(event.button==2){
            setclick({leftClick:false,
                rightClick:true});
        }
    }
}

export default Detect;