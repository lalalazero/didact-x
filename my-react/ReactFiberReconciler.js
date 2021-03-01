const { createFiberRoot } = require('./ReactFiberRoot')

function createContainer(containerInfo, tag, hydrate, hydrationCallbacks) {
  return createFiberRoot(containerInfo, tag, hydrate, hydrationCallbacks);
}

module.exports = {
  createContainer,
};
