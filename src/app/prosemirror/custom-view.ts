import { Injector, Renderer2 } from '@angular/core';
import { Node as ProsemirrorNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import {
  getPositionsOfNode,
  getSiblingNodeAfter,
  takeUntilNode,
  updateState,
} from './custom-view-fns';

export interface SiblingNode {
  node?: ProsemirrorNode<any> | null;
  index: number;
  offset: number;
}

export class CustomView {
  renderer = this.injector.get(Renderer2);
  dom: Element = this.renderer.createElement('custom-reference');

  constructor(
    // current node
    private node: ProsemirrorNode<any>,
    // contains view.state.doc, view.state.plugins etc.
    private view: EditorView,
    // position of node
    private getPos: () => number,
    // Angular DI
    private injector: Injector,
  ) {
    this.dom.addEventListener('changed', this._onChanged);
    this.dom.addEventListener('duplicate', this._onDuplicate);
    this.dom.addEventListener('move', this._onMove);
  }

  ignoreMutation() {
    return true;
  }

  /**
   * Can be used to prevent the editor view from trying to handle some or all DOM events that bubble up from the node view.
   * Events for which this returns true are not handled by the editor.
   * http://prosemirror.net/docs/ref/#view.NodeView
   */
  stopEvent(event: MouseEvent) {
    // allow drag events
    if (event instanceof DragEvent) {
      return false;
    }
    return true;
  }

  destroy() {
    // clean up listeners
    this.dom.removeEventListener('changed', this._onChanged);
    this.dom.removeEventListener('duplicate', this._onDuplicate);
    this.dom.removeEventListener('move', this._onMove);
  }

  /**
   * Move UP & DOWN
   * - TODO: implement!
   */
  private _onMove = (e: CustomEvent) => {
    const type = e.detail as 'up' | 'down';
    if (type === 'up') {
      alert('UP IS NOT IMPLEMENETED, TRY DUPLICATE!');
    }
    if (type === 'down') {
      alert('DOWN IS NOT IMPLEMENETED, TRY DUPLICATE!');
    }
  };

  /**
   * Change event is called on Input value changes
   */
  private _onChanged = (e: KeyboardEvent) => {
    console.log('form changed', e.detail);
  };

  /**
   * Duplicate Node type postReference and all siblings until the next postReference is hit
   */
  private _onDuplicate = () => {
    // create a transaction
    const { doc, tr } = this.view.state;
    const offset = this.getPos();

    const siblingNode = getSiblingNodeAfter(doc, offset);
    // last node before postReference
    const lastNode = takeUntilNode(doc, siblingNode, 'postReference');

    const offsetLast = getPositionsOfNode(doc, lastNode.offset).linkEnd;
    const slice = doc.slice(offset, offsetLast);

    // insert after
    tr.insert(offsetLast, slice.content);
    // update
    updateState(this.view, tr);
  };
}
