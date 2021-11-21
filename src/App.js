import React, { useEffect, useState,useRef } from 'react';
import Draw from './useMouse';
import Redraw from './Redraw';  
import DetectClick from './DetectClick';
import DetectTouch from './DetectTouch.js';
import { unstable_renderSubtreeIntoContainer } from 'react-dom';

function App() {
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  const canvas=useRef(null);
  const [drawing,setdrawing]=useState([]);
  const[pre,setpre]=useState({prex:0,prey:0});
  const[click,setclick]=useState({rightClick:false,leftClick:false});
  const[dim,setdim]=useState({x:window.innerWidth,y:window.innerHeight});
  const[touch,settouch]=useState({singleTouch:false,doubleTouch:false});
  const[touchpre,settouchpre]=useState({x1:0,y1:0,x2:0,y2:0})
  const[offset,setoffset]=useState({x:0,y:0});
  const[scale,setscale]=useState(1);
  let midX=0,midY=0,preMidX=0,preMidY=0;
  let delta,hypot=0,prevHypot=1,tempoffx,tempoffy;
  
  function UseMouse(){
    const[coordinate,setcoordinate]=useState({x:0,y:0});
    useEffect(()=>{
      function handle(e){
        // console.log(e);

        setcoordinate({
          x:e.pageX,
          y:e.pageY
        })
        if(click.leftClick===true){
          Draw(canvas,x,y,prex,prey,drawing,offset.x,offset.y,scale);
        }
        if(click.rightClick===true){
            setoffset({x:offset.x-(x-prex),y:offset.y-(y-prey)})
            Redraw(drawing,canvas,offset.x,offset.y,scale);
        }
        setpre({
          prex:x,
          prey:y
        })
      }
      document.addEventListener("mousemove",handle);
      return ()=>document.removeEventListener("mousemove",handle);

    })
    return coordinate;
  }

    function Touchdraw(){
      const[coordinate,setcoordinate]=useState({x1:0,y1:0,x2:0,y2:0});

    useEffect(()=>{
      function handle(e){
          if(touch.singleTouch===true){
            // setcoordinate({
            //   x1:e.touches[0].pageX,
            //   y1:e.touches[0].pageY, DOES NOT WORK
            //   x2:0,
            //   y2:0
            // })
          coordinate.x1=e.touches[0].pageX;
          coordinate.y1=e.touches[0].pageY;
            Draw(canvas,coordinate.x1,coordinate.y1,touchpre.x1,touchpre.y1,drawing,offset.x,offset.y,scale);
            touchpre.x1=e.touches[0].pageX;
            touchpre.y1=e.touches[0].pageY;
          }
          else if(touch.doubleTouch===true&&e.touches.length>1){
            tempoffx=offset.x;
            tempoffy=offset.y;
            // setcoordinate({
            //   x1:e.touches[0].pageX,
            //   y1:e.touches[0].pageY,     DOES NOT WORK
            //   x2:e.touches[1].pageX,
            //   y2:0
            // })
            coordinate.x1=e.touches[0].pageX;
            coordinate.y1=e.touches[0].pageY;
            coordinate.x2=e.touches[1].pageX;
            coordinate.y2=e.touches[1].pageY;
            midX=(coordinate.x1+coordinate.x2)/2;
            midY=(coordinate.y1+coordinate.y2)/2;
            preMidX=(touchpre.x1+touchpre.x2)/2;
            preMidY=(touchpre.y1+touchpre.y2)/2;
            
            // if(Math.sqrt(Math.pow((midX - preMidX), 2) + Math.pow((midY - preMidY), 2))>10){
            // //setoffset({x:offset.x-(midX-preMidX),y:offset.y-(midY-preMidY)});
            // console.log("GS");
             
            // }
            // else{
              hypot = Math.sqrt(Math.pow((coordinate.x1 - coordinate.x2), 2) + Math.pow((coordinate.y1 - coordinate.y2), 2));
              prevHypot = Math.sqrt(Math.pow((touchpre.x1 - touchpre.x2), 2) + Math.pow((touchpre.y1 - touchpre.y2), 2));
              if(hypot>prevHypot){
                //console.log(delta,tempoffx,tempoffy);
                  delta=scale*Math.pow(1.1,Math.floor(hypot)/Math.floor(prevHypot));
                  tempoffx=(tempoffx/scale)*delta+(Math.floor(hypot)/Math.floor(prevHypot)*midX*(0.1));
                  tempoffy=(tempoffy/scale)*delta+(Math.floor(hypot)/Math.floor(prevHypot)*midY*(0.1));
                  tempoffx-=(midX-preMidX);
                  tempoffy-=(midY-preMidY);
                  Redraw(drawing,canvas,tempoffx,tempoffy,delta);
                }
              //console.log(offset,scale);
              
              else if(hypot<prevHypot){
                  delta=scale/Math.pow(1.1,Math.floor(prevHypot)/Math.floor(hypot));
                  tempoffx=(tempoffx/scale)*delta-(Math.floor(prevHypot)/Math.floor(hypot)*midX*(0.1));
                  tempoffy=(tempoffy/scale)*delta-(Math.floor(prevHypot)/Math.floor(hypot)*midY*(0.1));
                  tempoffx-=(midX-preMidX);
                  tempoffy-=(midY-preMidY);
                  Redraw(drawing,canvas,tempoffx,tempoffy,delta);
              }

          }
        // }
      }
      document.addEventListener("touchmove",handle);
      return ()=>document.removeEventListener("touchmove",handle);
    })
    return coordinate;
    }

  useEffect(()=>{
    function resizeWindow(){
      setdim({
        x:window.innerWidth,
        y:window.innerHeight
      })
     Redraw(drawing,canvas,offset.x,offset.y,scale);
    }
    window.addEventListener("resize",resizeWindow);
    return ()=>window.removeEventListener("resize",resizeWindow);
  })
    useEffect(()=>{
      function handle(e){
          if(e.deltaY>1){
            setoffset((offset)=>{
              setscale((scale)=>scale*(1+e.deltaY/1000));
              return{
              x:(offset.x/scale)*(1+e.deltaY/1000)*scale+x*(e.deltaY/1000),
              y:(offset.y/scale)*(1+e.deltaY/1000)*scale+y*(e.deltaY/1000)
              }
            })
            
          }
          if(e.deltaY<0){
            setoffset((offset)=>{
              setscale((scale)=>scale/(-e.deltaY/1000+1));
              return{
                x:(offset.x/scale)*scale/(-e.deltaY/1000+1)+x*(e.deltaY/1100),
                y:(offset.y/scale)*scale/(-e.deltaY/1000+1)+y*(e.deltaY/1100)
              }
            })
            
          }
        
      }
      
      document.addEventListener("wheel",handle);
      return ()=>document.removeEventListener("wheel",handle);
    })
    useEffect(()=>{
      Redraw(drawing,canvas,offset.x,offset.y,scale);
    },[scale,offset])


  const{x,y}=UseMouse();
  const{prex,prey}=pre;
  Touchdraw();
  return ( <div>
    <canvas ref={canvas} 
    onTouchStart={e=>{
      DetectTouch({e,touch,touchpre});delta=scale;tempoffx=offset.x;tempoffy=offset.y}} 
    onTouchEnd={()=>{
                    if(touch.doubleTouch==true)
                    {
                      setoffset({
                        x:tempoffx,
                        y:tempoffy
                      })
                      setscale(delta);
                    } 
                    settouch({singleTouch:false,doubleTouch:false});}} 
    onTouchCancel={()=>{settouch({singleTouch:false,doubleTouch:false});}} 
    onMouseDown={e=>{DetectClick({e,setclick,setpre});} } onMouseUp={e=>{setclick({leftClick:false,rightClick:false});}} width={dim.x} height={dim.y}>
      </canvas>
      {/* <Draw canvas={canvas} clicked={click} x={x} y={y} prex={prex} prey={prey}/> */}
      </div>
    )
}

export default App;
