import { gameSystemType } from "../types"

export default function (): gameSystemType {

    return {
        name: "addNewPiece",
        interval: 1000,
        effects: function (piece) {
            if (!this.pieces.find(p => p.status === 0)) {
                this.addPiece(this.createRandomPiece())
            }
        }
    }

}