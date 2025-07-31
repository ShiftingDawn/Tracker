const name = (name: string) => `pixel:${name}`;

const icons = {
  menu: name("bars-solid"),
  edit: name("edit"),
  add: name("plus-solid"),
  minus: name("minus-solid"),
  grid: name("grid"),
  save: name("save"),
  delete: name("trash-alt"),
  chevronUp: name("angle-up-solid"),
  chevronDown: name("angle-down-solid"),
  chevronLeft: name("angle-left"),
  chevronRight: name("angle-right"),
};
export default icons;
