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
}

export type squereType = gamePieceType & {}

export type lineType = gamePieceType & {}

export type sType = gamePieceType & {}

export type gameSystemType = {
    name: string,
    interval: number,
    effects: (gamePiece: gamePieceType) => void,
}
