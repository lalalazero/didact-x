const TotalLanes = 31;
const NoLanes = 0b0000000000000000000000000000000
const NoTimestamp = -1;

function createLaneMap(initial){
    const laneMap = []
    for(let i = 0; i < TotalLanes; i++) {
        laneMap.push(initial)
    }

    return laneMap;
}

module.exports = {
    TotalLanes,
    NoLanes,
    NoTimestamp,
    createLaneMap
}