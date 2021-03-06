import zip from 'lodash/zip';
import Remarkable from 'remarkable';
import RemarkableReactRenderer from '../src';

export function render(string, remarkableOptions, rendererOptions) {
  const remarkable = new Remarkable(remarkableOptions);
  const renderer = new RemarkableReactRenderer(rendererOptions);

  remarkable.renderer = renderer;
  remarkable.inline.ruler.enable(['ins', 'mark', 'sub', 'sup']);

  return remarkable.render(string);
}

function flatten(tree, flat = []) {
  return tree.reduce((flat, element) => {
    flat.push(element);

    if (element.props && Array.isArray(element.props.children)) {
      flatten(element.props.children, flat);
    }

    if (Array.isArray(element.children)) {
      flatten(element.children, flat);
    }

    return flat;
  }, flat);
}

export function walkTree(input, expected, cb) {
  return zip(flatten(input), flatten(expected)).map(([ input, expected ]) => {
    return cb(input, expected);
  });
}
