import { gameSystemType } from "../types"

export default function (): gameSystemType {

    return {
        name: "addNewPiece",
        options: {
            interval: 1000,
            enabled: true
        },
        effects: function (piece) {
            if (!this.pieces.find(p => p.status === 0)) {
                this.addPiece(this.createRandomPiece())
            }
        }
    }

}