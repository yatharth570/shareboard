import React, { useEffect, useState,useRef } from 'react';
import Draw from './useMouse';
import Redraw from './Redraw';  
import DetectClick from './DetectClick';
import DetectTouch from './DetectTouch.js';

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
          Draw(canvas,x,y,prex,prey,drawing,offset.x,offset.y);
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
          if(touch.singleTouch){
            // setcoordinate({
            //   x1:e.touches[0].pageX,
            //   y1:e.touches[0].pageY, DOES NOT WORK
            //   x2:0,
            //   y2:0
            // })
          coordinate.x1=e.touches[0].pageX;
          coordinate.y1=e.touches[0].pageY;
            Draw(canvas,coordinate.x1,coordinate.y1,touchpre.x1,touchpre.y1,drawing,offset.x,offset.y);
            touchpre.x1=e.touches[0].pageX;
            touchpre.y1=e.touches[0].pageY;
          }
          if(touch.doubleTouch){
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
            const midX=(coordinate.x1+coordinate.x2)/2;
            const midY=(coordinate.y1+coordinate.y2)/2;
            const preMidX=(touchpre.x1+touchpre.x2)/2;
            const preMidY=(touchpre.y1+touchpre.y2)/2;
            setoffset({x:offset.x-(midX-preMidX),y:offset.y-(midY-preMidY)});
            Redraw(drawing,canvas,offset.x,offset.y,scale);
            touchpre.x1=coordinate.x1;
            touchpre.y1=coordinate.y1;
            touchpre.x2=coordinate.x2;
            touchpre.y2=coordinate.y2;


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

  function Wheel(){
    useEffect(()=>{
      function handle(e){
        if(e.deltaY>1)
        setscale(scale*(1+e.deltaY/800));
        if(e.deltaY<0)
        setscale(scale/(-e.deltaY/800+1));

        ///////offset setting

        console.log(offset);
        Redraw(drawing,canvas,offset.x,offset.y,scale);
        console.log(e);
      }

      document.addEventListener("wheel",handle);
      return ()=>document.removeEventListener("wheel",handle);
    })
  }

  Wheel();



  const{x,y}=UseMouse();
  const{prex,prey}=pre;
  Touchdraw();
  return ( <div>
    <canvas ref={canvas} onTouchStart={e=>{DetectTouch({e,touch,touchpre});}} onMouseDown={e=>{DetectClick({e,setclick,setpre,pre,drawing,offset,canvas});} } onTouchEnd={e=>{settouchpre({x1:0,y1:0,x2:0,y2:0})}} onMouseUp={e=>{setclick({leftClick:false,rightClick:false});}} width={dim.x} height={dim.y}>
      </canvas>
      {/* <Draw canvas={canvas} clicked={click} x={x} y={y} prex={prex} prey={prey}/> */}
      </div>
    )
}

export default App;
