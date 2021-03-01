let REACT_ELEMENT_TYPE = 0xeac7;

if (typeof Symbol === "function" && Symbol.for) {
  const symbolFor = Symbol.for;
  REACT_ELEMENT_TYPE = symbolFor("react.element");
}

export {
  REACT_ELEMENT_TYPE,
};
