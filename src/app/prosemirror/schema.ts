import { Schema, DOMParser as PmDOMParser } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { addListNodes, wrapInList } from 'prosemirror-schema-list';

const nodes = addListNodes(schema.spec.nodes, 'paragraph block*', 'block');

export const mySchema = new Schema({
  nodes: nodes.append({
    // CUSTOM IMAGE NODE
    image: {
      attrs: {
        value: { default: null },
        random: { default: -1 },
      },
      draggable: true,
      inline: true,
      group: 'inline',
      toDOM(nod) {
        return [
          'img',
          {
            'data-type': 'image',
            src: 'https://bit.ly/2Crffgq',
          },
          '',
        ];
      },
      parseDOM: [
        {
          tag: 'img',
          getAttrs(dom) {
            return {};
          },
        },
      ],
    },
    // CUSTOM REFERENCE NODE
    postReference: {
      attrs: {
        value: { default: 'Custom' },
        random: { default: -1 },
      },

      // inline: true,
      // group: 'inline',

      inline: false,
      group: 'block',

      draggable: false,
      selectable: false,
      isolating: true,
      toDOM(nod) {
        return [
          'span',
          // 'custom-reference',
          {
            'data-type': 'postReference',
            'data-id': nod.attrs.id,
            'data-description': nod.attrs.description,
          },
          '',
        ];
      },
      parseDOM: [
        {
          tag: 'span[data-type=postReference]',
          // tag: 'custom-reference',
          getAttrs(dom) {
            return {
              id: (dom as Element).getAttribute('data-id'),
              description: (dom as Element).getAttribute('data-description'),
            };
          },
        },
      ],
    },
  }),
  marks: schema.spec.marks,
});
