export function initializeUpdateQueue(fiber) {
    const queue = {
        baseState: fiber.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpate: null,
        shared: {
            pending: null,
            interleaved: null,
            // lanes: NoLanes
        },
        effects: null
    }
    fiber.updateQueue = queue
}