
export const listenEvents=(btnLeft,btnRight,btnFlip)=>{

   const left = document.getElementById('btn-left')
   left.addEventListener('click',(e)=>{
       e.stopPropagation()
       btnLeft(e)
   })

   const right = document.getElementById('btn-right')
   right.addEventListener('click',(e)=>{
          e.stopPropagation()
        btnRight(e)
   })

   const flip = document.getElementById('btn-flip')
   flip.addEventListener('click',(e)=>{
          e.stopPropagation()
        btnFlip(e)
   })

}