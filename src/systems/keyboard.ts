import { listenEvents } from "../events"
import intersection from "../intersection"
import { gameSystemType } from "../types"

export default function (): gameSystemType {

    let lastEvent = null

    listenEvents(
        // left
        () => {
            lastEvent = 'left'
        },
        // right
        () => {
            lastEvent = 'right'
        },
        // flip
        () => {
            lastEvent = 'flip'
        }
    )

    const btnLeft = function(piece) {

        if (piece.x > 0
            && !intersection({...piece, x: piece.x - 1}, this.world)) {
            piece.x -= 1
        }
    }
    const btnRight = function(piece){

        if (piece.x < this.game.width - piece.width 
            && !intersection({...piece, x: piece.x + 1}, this.world)) {
            piece.x += 1
        }
    }
    const btnFlip = function(piece){

        piece.flip()

    }

    return {
        name: "keyboard",
        options: {
            interval: 1000,
            enabled: true
        },
        effects: function (piece) {
            if (piece.status === 0 && lastEvent !== null) {

                switch (lastEvent) {
                    case 'left':
                        btnLeft.bind(this)(piece)
                        break
                    case 'right':
                        btnRight.bind(this)(piece)
                        break
                    case 'flip':
                        btnFlip.bind(this)(piece)
                        break
                    default:
                        break
                }


                lastEvent = null
            }
        }
    }

}