import {
  Directive,
  Injector,
  ViewContainerRef,
  Input,
  OnInit,
} from '@angular/core';
import { DOMParser as PmDOMParser } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { CustomView } from './custom-view';
import { mySchema } from './schema';
import { angularProseMirrorSetup } from './setup';

@Directive({
  selector: '[ngxProsemirror]',
})
export class EditorDirective implements OnInit {
  @Input()
  fulltext: string;

  view: EditorView<any> = null;

  constructor(
    public viewContainerRef: ViewContainerRef,
    private injector: Injector,
  ) {}

  ngOnInit() {
    this.view = new EditorView(this.viewContainerRef.element.nativeElement, {
      // STATE (plugins, fulltext definition...)
      state: EditorState.create({
        plugins: angularProseMirrorSetup({ schema: mySchema }),
        doc: PmDOMParser.fromSchema(mySchema).parse(
          new DOMParser().parseFromString(this.fulltext, 'text/html'),
        ),
      }),
      // TRANSACTIONS
      dispatchTransaction: transaction => {
        // console.log(
        //   'Document size went from',
        //   transaction.before.content.size,
        //   'to',
        //   transaction.doc.content.size,
        // );
        const newState = this.view.state.apply(transaction);
        this.view.updateState(newState);
      },
      // CUSTOM NODES
      nodeViews: {
        postReference: (node, nodeView, getPos) =>
          new CustomView(node, nodeView, getPos, this.injector),
      },
    });
  }
}
