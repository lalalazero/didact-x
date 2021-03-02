// Don't change these two values. They're used by React Dev Tools.
export const NoFlags = /*                      */ 0b00000000000000000000;
export const PerformedWork = /*                */ 0b00000000000000000001;

// You can change the rest (and add more).
export const Placement = /*                    */ 0b00000000000000000010;
export const Update = /*                       */ 0b00000000000000000100;
export const PlacementAndUpdate = /*           */ Placement | Update;
export const Deletion = /*                     */ 0b00000000000000001000;
export const ChildDeletion = /*                */ 0b00000000000000010000;
export const ContentReset = /*                 */ 0b00000000000000100000;
export const Callback = /*                     */ 0b00000000000001000000;
export const DidCapture = /*                   */ 0b00000000000010000000;
export const Ref = /*                          */ 0b00000000000100000000;
export const Snapshot = /*                     */ 0b00000000001000000000;
export const Passive = /*                      */ 0b00000000010000000000;
export const Hydrating = /*                    */ 0b00000000100000000000;
export const HydratingAndUpdate = /*           */ Hydrating | Update;
export const Visibility = /*                   */ 0b00000001000000000000;

// Static tags describe aspects of a fiber that are not specific to a render,
// e.g. a fiber uses a passive effect (even if there are no updates on this particular render).
// This enables us to defer more work in the unmount case,
// since we can defer traversing the tree during layout to look for Passive effects,
// and instead rely on the static flag as a signal that there may be cleanup work.
export const PassiveStatic = /*                */ 0b00100000000000000000;

// Union of tags that don't get reset on clones.
// This allows certain concepts to persist without recalculting them,
// e.g. whether a subtree contains passive effects or portals.
export const StaticMask = PassiveStatic;