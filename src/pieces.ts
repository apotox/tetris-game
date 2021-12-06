import { lineType, squereType, sType } from "./types";

class Piece{
    x = 0;
    y = 0;
    id = '';
    status = 0;
    rotate = 0;

    template: () => number[][];

    get height() {
        return this.template().length;
    }
    get width() {
        return this.template()[0].length;
    }

    moveLeft(engine) {
        if (engine.canMove(-1, 0)) {
            this.x--;
        }
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
    color = 'blue';
    shape = 's';
    effectdBySystems = [];
    template = () => this.rotate == 0 ? [
        [1, 1, 0],
        [0, 1, 1],
    ]: [
        [0, 1],
        [1, 1],
        [1, 0],
    ]
}

class OPiece extends Piece implements sType {
    color = '#FF1493';
    shape = 'o';
    effectdBySystems = [];
    template = () => this.rotate == 0 ? [
        [1, 1, 0],
        [0, 1, 1],
        [1, 1, 0],
    ]: [
        [0, 1 , 0],
        [1, 1 , 1],
        [1, 0 , 1],
    ]
}

class SquarePiece extends Piece implements squereType {
    
    color = 'yellow';
    shape = 'squere';
    effectdBySystems = [];
    template = () => [
        [1, 1],
        [1, 1],
    ]
}

class LinePiece extends Piece implements lineType {
    color = 'red';
    shape = 'line';
    effectdBySystems = [];
    template = () =>  this.rotate == 0 ? [
        [1, 1, 1, 1]
    ]: [
        [1],
        [1],
        [1],
        [1]
    ]
}

const pieces = {
    S: SPiece,
    Line: LinePiece,
    Square: SquarePiece,
    O: OPiece
}

export default pieces;