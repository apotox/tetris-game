import { pieceType } from "./types";



export default class Score implements pieceType {
    x = 12;
    y = 24;
    id = "score";
    value = 0;

    constructor(){
        console.log('score')
    }

    redraw(engine) {
            let ctx = engine.game.canvas.getContext("2d") as CanvasRenderingContext2D;
            ctx.fillStyle = 'red'
            ctx.font = '14px tahoma';
            ctx.fillText(`score [${this.value}]`, this.x , this.y);
    }
    
}