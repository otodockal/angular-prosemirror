import { EditorView } from 'prosemirror-view';
import { Transaction } from 'prosemirror-state';
import { Node as ProsemirrorNode } from 'prosemirror-model';
import { SiblingNode } from './custom-view';

export function updateState(view: EditorView, tr: Transaction) {
  const state = view.state.apply(tr);
  view.updateState(state);
}

export function getPositionsOfNode(doc: ProsemirrorNode<any>, pos: number) {
  const $pos = doc.resolve(pos);
  const linkStart = pos - $pos.textOffset;
  const linkEnd = linkStart + $pos.parent.child($pos.index()).nodeSize;
  return { linkStart, linkEnd };
}

export function getSiblingNodeAfter(
  doc: ProsemirrorNode<any>,
  currNodePos: number,
) {
  return doc.childAfter(getPositionsOfNode(doc, currNodePos).linkEnd);
}

export function takeUntilNode(
  doc: ProsemirrorNode<any>,
  siblingNode: SiblingNode,
  nodeTypeName: string,
): SiblingNode {
  while (siblingNode.node.type.name !== nodeTypeName) {
    const sNode = getSiblingNodeAfter(doc, siblingNode.offset);
    // not sibiling node, return current node
    if (!sNode.node) {
      break;
    }
    if (sNode.node.type.name === nodeTypeName) {
      break;
    }
    siblingNode = sNode;
  }
  return siblingNode;
}
