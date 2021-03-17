import { createFiberRoot } from './ReactFiberRoot'
import { scheduleUpdateOnFiber } from './ReactFiberWorkLoop'


export function createContainer(containerInfo, tag) {
    return createFiberRoot(containerInfo, tag)
}

export function updateContainer(element, container, parentComponent, callback) {
    const current = container.current
    // const eventTime = requestEventTime()
    // const lane = requestUpdateLane(current)
    // const update = createUpdate(eventTime, lane)
    // enqueueUpdate(current, update, lane)
    const root = scheduleUpdateOnFiber(current, undefined, undefined)
    // if(root !== null) {
    //     entangleTransitions(root,current, lane)
    // }
    // return lane
}