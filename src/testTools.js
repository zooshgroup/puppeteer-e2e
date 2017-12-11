const findParent = (component) => () => {
  const parent = component._reactInternalInstance._currentElement._owner._instance; // eslint-disable-line no-underscore-dangle
  parent.parent = findParent(parent);
  return parent;
};

const useTestTools = () => {
  //eslint-disable-next-line
  window.FindReact = (dom) => {
    const internalsKey = Object.keys(dom).find((key) => key.startsWith('__reactInternalInstance$'));
    if (!internalsKey) {
      return null;
    }
     // eslint-disable-next-line no-underscore-dangle
    const component = dom[internalsKey]._currentElement._owner._instance;
    component.parent = findParent(component);
    return component;
  };
};

export default useTestTools;
