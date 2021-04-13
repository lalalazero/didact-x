/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDOM
 */

/* globals __REACT_DEVTOOLS_GLOBAL_HOOK__*/

'use strict';

var ReactDefaultInjection = require('ReactDefaultInjection');
var ReactMount = require('ReactMount');
var ReactUpdates = require('ReactUpdates');

// var findDOMNode = require('findDOMNode');
var renderSubtreeIntoContainer = require('./renderSubtreeIntoContainer');

ReactDefaultInjection.inject();


var React = {
  // findDOMNode: findDOMNode,
  render: ReactMount.render,
  unmountComponentAtNode: ReactMount.unmountComponentAtNode,

  /* eslint-disable camelcase */
  unstable_batchedUpdates: ReactUpdates.batchedUpdates,
  unstable_renderSubtreeIntoContainer: renderSubtreeIntoContainer,
  /* eslint-enable camelcase */
};

module.exports = React;
