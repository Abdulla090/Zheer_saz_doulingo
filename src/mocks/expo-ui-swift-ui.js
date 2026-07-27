const React = require("react");
const { View } = require("react-native");

function DummyComponent(props) {
  return React.createElement(View, props, props.children);
}

const modifierProxy = new Proxy(
  {},
  {
    get: () => () => modifierProxy,
  }
);

module.exports = {
  HStack: DummyComponent,
  VStack: DummyComponent,
  ZStack: DummyComponent,
  Text: DummyComponent,
  Button: DummyComponent,
  Image: DummyComponent,
  Spacer: DummyComponent,
  Divider: DummyComponent,
  padding: () => modifierProxy,
  background: () => modifierProxy,
  cornerRadius: () => modifierProxy,
  frame: () => modifierProxy,
};
