import { lineType, squereType, sType } from "./types";

class Piece{
    x = 0;
    y = 0;
    id = '';
    status = 0;
    rotate = 0;

    constructor(){
        this.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    }


    flip(): void{
        this.rotate = (this.rotate + 1) % this.templates.length;
    }

    templates = []
    template: () => number[][];

    get height() {
        return this.template().length;
    }
    get width() {
        return this.template()[0].length;
    }

    color = 'red';

    redraw(engine) {
        let ctx = engine.game.canvas.getContext("2d");
        ctx.fillStyle = this.color;
        this.template().forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell) {
                    ctx.fillRect(this.x* engine.game.cellSize + x* engine.game.cellSize, this.y* engine.game.cellSize + y* engine.game.cellSize, engine.game.cellSize, engine.game.cellSize);
                }
            })
        })    
    }
}

class SPiece extends Piece implements sType {
    constructor(){
        super()
    }
    color = 'blue';
    shape = 's';
    effectdBySystems = [];
    template = () => this.templates[this.rotate];

    

    templates = [
        [
            [1, 1, 0],
            [0, 1, 1],
        ],
        [
            [0, 1],
            [1, 1],
            [1, 0],
        ]
    ]
}

class OPiece extends Piece implements sType {
    constructor(){
        super()
    }
    color = '#FF1493';
    shape = 'o';
    effectdBySystems = [];
    template = () => this.templates[this.rotate]


    templates = [
        [
            [1, 1, 0],
            [0, 1, 1],
            [1, 1, 0],
        ],
        [
            [0, 1 , 0],
            [1, 1 , 1],
            [1, 0 , 1],
        ],
        [
            [0, 1 , 1],
            [1, 1 , 0],
            [0, 1 , 1],
        ],
        [
            [1, 0 , 1],
            [1, 1 , 1],
            [0, 1 , 0],
        ]
    ]
}

class SquarePiece extends Piece implements squereType {
    constructor(){
        super()
    }
    color = 'yellow';
    shape = 'squere';
    effectdBySystems = [];
    template = () => [
        [1, 1],
        [1, 1],
    ]
}

class LinePiece extends Piece implements lineType {
    constructor(){
        super()
    }
    color = 'red';
    shape = 'line';
    effectdBySystems = [];
    template = () =>  this.templates[this.rotate]

    templates = [
        [[1, 1, 1, 1]],
        [
            [1],
            [1],
            [1],
            [1]
        ]
    ]
}

const pieces = {
    S: SPiece,
    Line: LinePiece,
    Square: SquarePiece,
    O: OPiece
}

export default pieces;