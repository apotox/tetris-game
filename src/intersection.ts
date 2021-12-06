import { gamePieceType } from "./types"


export default (piece: gamePieceType, world: number[][]) => {


    const hitPiece = (x, y) => {
        return piece.template().some((row, j) => {
            return row.some((c, i) => {
                return c === 1 && piece.x + i === x && piece.y + j === y
            })
        })
    }

    return world.some((row, y) => {
        return row.some((cell, x) => {
            return cell !== 0 && hitPiece(x, y)
        })
    })



}