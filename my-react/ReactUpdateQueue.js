export function createUpdate(eventTime, lane) {
    const update = {
        eventTime,
        lane,

        tag: UpdateState,
        payload: null,
        callback: null,

        next: null,
    }

    return update;
}

export function enqueueUpdate(fiber, update) {
    const updateQueue = fiber.updateQueue;
    if (updateQueue === null) {
        // Only occurs if the fiber has been unmounted.
        return;
    }

    const sharedQueue = updateQueue.shared;
    const pending = sharedQueue.pending;
    if (pending === null) {
        // This is the first update. Create a circular list.
        update.next = update;
    } else {
        update.next = pending.next;
        pending.next = update;
    }

    sharedQueue.pending = update;
}

export const UpdateState = 0;
export const ReplaceState = 1;
export const ForceUpdate = 2;
export const CaptureUpdate = 3;