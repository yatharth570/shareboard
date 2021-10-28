import React from 'react';

function Detect(props){
    const e=props.e;
    //console.log(e);
    //const settouch=props.settouchpre;
    const touch=props.touch;
    const touchpre=props.touchpre;
    
    if(e.touches.length===1){
        touch.singleTouch=true;
        touch.doubleTouch=false;
        touchpre.x1=e.touches[0].pageX
        touchpre.y1=e.touches[0].pageY
    }
    else{
        touch.singleTouch=false;
        touch.doubleTouch=true;
        touchpre.x1=e.touches[0].pageX;
        touchpre.y1=e.touches[0].pageY;
        touchpre.x2=e.touches[1].pageX;
        touchpre.y2=e.touches[1].pageY;

    }

    // if (e.touches.length == 1) {
    //     settouch({
    //         singleTouch:true,
    //         doubletouch:false
    //     })
    // }
    // if (e.touches.length >= 2) {
    //     settouch({
    //         singleTouch:false,
    //         doubletouch:true
    //     })
    // }
    

}

export default Detect;