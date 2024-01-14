export type DragableItem= {
	id: string
	name: string
	x: number
	y: number
	height: number
	width: number
}

export type Action = {
    type: "dragItem", dragableItem: DragableItem
} |
{
    type: "endDrag", dragableItem: DragableItem
} 

export type GameState = {
    ActionLocation : {
        x: number,
        y: number,
        height: number,
        width: number,
    }
    PlayedCards: {

    }

}
export const reducer = (state: GameState, action: Action) => {
    switch (action.type){
        case"dragItem": 
        {
            return 
        }
        case "endDrag": {
            return 
        }
        default: 
        return state
    }

}