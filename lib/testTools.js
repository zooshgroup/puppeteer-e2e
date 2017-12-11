'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var findParent = function findParent(component) {
  return function () {
    var parent = component._reactInternalInstance._currentElement._owner._instance; // eslint-disable-line no-underscore-dangle
    parent.parent = findParent(parent);
    return parent;
  };
};

var useTestTools = function useTestTools() {
  //eslint-disable-next-line
  window.FindReact = function (dom) {
    var internalsKey = Object.keys(dom).find(function (key) {
      return key.startsWith('__reactInternalInstance$');
    });
    if (!internalsKey) {
      return null;
    }
    // eslint-disable-next-line no-underscore-dangle
    var component = dom[internalsKey]._currentElement._owner._instance;
    component.parent = findParent(component);
    return component;
  };
};

exports.default = useTestTools;