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
            if(line.x-offsetx<0&&line.y-offsety<0){
                continue;
            }
            //console.log(line.x,line.y)
            context.beginPath();
            context.moveTo((line.x-offsetx)*scale,(line.y-offsety)*scale);
            context.lineTo((line.prex-offsetx)*scale, (line.prey-offsety)*scale);
            context.stroke();
        }    
         return null;
}
export default Redraw;