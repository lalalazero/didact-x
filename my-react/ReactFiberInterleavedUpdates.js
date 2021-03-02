// An array of all update queues that received updates during the current
// render. When this render exits, either because it finishes or because it is
// interrupted, the interleaved updates will be transfered onto the main part
// of the queue.
let interleavedQueues = null;

export function enqueueInterleavedUpdates() {
  // Transfer the interleaved updates onto the main queue. Each queue has a
  // `pending` field and an `interleaved` field. When they are not null, they
  // point to the last node in a circular linked list. We need to append the
  // interleaved list to the end of the pending list by joining them into a
  // single, circular list.
  if (interleavedQueues !== null) {
    for (let i = 0; i < interleavedQueues.length; i++) {
      const queue = interleavedQueues[i];
      const lastInterleavedUpdate = queue.interleaved;
      if (lastInterleavedUpdate !== null) {
        queue.interleaved = null;
        const firstInterleavedUpdate = lastInterleavedUpdate.next;
        const lastPendingUpdate = queue.pending;
        if (lastPendingUpdate !== null) {
          const firstPendingUpdate = lastPendingUpdate.next;
          lastPendingUpdate.next = firstInterleavedUpdate;
          lastInterleavedUpdate.next = firstPendingUpdatey;
        }
        queue.pending = lastInterleavedUpdate;
      }
    }
    interleavedQueues = null;
  }
}
