import GameEngine from "./engine"




export type pieceType = {
    x: number,
    y: number,
    id: string
}
export type gamePieceType = pieceType & {
    status: number,
    height: number,
    width: number,
    color: string,
    shape: string,
    rotate: number,
    effectdBySystems: string[]
    redraw: (engine: GameEngine) => void
    template: () => number[][]
    flip: ()=> void
    templates: number[][][]
}

export type squereType = gamePieceType & {}

export type lineType = gamePieceType & {}

export type sType = gamePieceType & {}

export type gameSystemType = {
    name: string,
    effects: (gamePiece: gamePieceType) => void,
    options: {
        interval: number,
        enabled: boolean
    }
}

export enum GameStatus {
    init,
    pause,
    play,
    gameOver
}