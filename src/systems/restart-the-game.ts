import { grid } from "../constants"
import { gameSystemType } from "../types"

export default function (): gameSystemType {

    return {
        name: "restartTheGame",
        interval: 1000,
        effects: function (piece) {
            if (this.world[0].some(cell => cell === 1)) {
                this.score.value = 0
                this.pieces = []
                this.world = JSON.parse(JSON.stringify(grid))
                this.addPiece(this.createRandomPiece())
            }
        }
    }

}