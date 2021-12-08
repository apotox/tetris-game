import { grid } from "../constants"
import { GameStatus, gameSystemType } from "../types"

export default function (): gameSystemType {

    return {
        name: "restartTheGame",
        options: {
            interval: 1000,
            enabled: true
        },
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