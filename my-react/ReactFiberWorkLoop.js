import { now, flushSyncCallbackQueue } from './SchedulerWithReactIntegration'

export const NoContext = /*             */ 0b0000000;
const BatchedContext = /*               */ 0b0000001;
const EventContext = /*                 */ 0b0000010;
const DiscreteEventContext = /*         */ 0b0000100;
const LegacyUnbatchedContext = /*       */ 0b0001000;
const RenderContext = /*                */ 0b0010000;
const CommitContext = /*                */ 0b0100000;
export const RetryAfterError = /*       */ 0b1000000;

// Describes where we are in the React execution stack
let executionContext = NoContext;

export function unbatchedUpdates(fn, a) {
    const prevExecutionContext = executionContext;
    executionContext &= ~BatchedContext;
    executionContext |= LegacyUnbatchedContext;

    try {
        return fn(a)
    } finally {
        executionContext = prevExecutionContext 
        if (executionContext === NoContext) {
            // Flush the immediate callbacks that were scheduled during this batch
            resetRenderTimer();
            flushSyncCallbackQueue();
        }
    }
}

// The absolute time for when we should start giving up on rendering
// more and prefer CPU suspense heuristics instead.
let workInProgressRootRenderTargetTime = Infinity;
// How long a render is supposed to take before we start following CPU
// suspense heuristics and opt out of rendering more content.
const RENDER_TIMEOUT_MS = 500;

function resetRenderTimer() {
    workInProgressRootRenderTargetTime = now() + RENDER_TIMEOUT_MS;
}