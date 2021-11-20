import React from 'react';


function Redraw(drawing,canvas,offsetx,offsety,scale){
    const context=canvas.current.getContext("2d");
    context.fillStyle="white";
    context.fillRect(0, 0, window.innerWidth, window.innerHeight);
    context.fill();
        for (let i = 0; i < drawing.length; i++) {
            const line = drawing[i];
            context.strokeStyle = '#000';
            context.lineWidth = 1;
            //console.log(line.x,line.y)
            context.beginPath();
            //////////////
            // if(line.scale>scale){
                
            // }
            // else{
            //     mul=scale/line.scale;
            // }
            context.moveTo(((line.x/line.scale)*scale-offsetx),((line.y/line.scale)*scale-offsety));
            context.lineTo(((line.prex/line.scale)*scale-offsetx),((line.prey/line.scale)*scale-offsety));
            context.stroke();
        }    
         return null;
}
export default Redraw;