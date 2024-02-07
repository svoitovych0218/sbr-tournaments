const maps: Record<number, string> = {
    1: 'Fractal',
    2: 'Christmas',
    3: 'Infected',
    4: 'Colossus'
}

const gameModes: Record<number, string> = {
    1: 'Death Match',
    2: 'Team Death Match',
    3: 'King Of The Hill',
    4: 'Team King Of The Hill'
}

export const getMapNameById = (id: number) => maps[id];
export const getGameModeNameById = (id: number) => gameModes[id];