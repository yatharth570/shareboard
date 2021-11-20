import React from "react";

function Draw(canvas,x,y,prex,prey,drawing,offsetx,offsety,scale){

    drawing.push({x:x+offsetx,y:y+offsety,prex:prex+offsetx,prey:prey+offsety,scale:scale});
    const context=canvas.current.getContext("2d");

    
    context.strokeStyle = '#000';
    context.lineWidth = 1;
    // console.log(x,y);
    context.beginPath();
    context.moveTo(x,y);
    context.lineTo(prex, prey);
    context.stroke();
  return null;
}

export default Draw;