export const emptyEditorState = {
  _nodeMap: [
    [
      'root',
      {
        __children: ['2'],
        __dir: null,
        __format: 0,
        __indent: 0,
        __key: 'root',
        __parent: null,
        __type: 'root'
      }
    ],
    [
      '2',
      {
        __type: 'paragraph',
        __parent: 'root',
        __key: '2',
        __children: [],
        __format: 0,
        __indent: 0,
        __dir: null
      }
    ]
  ],
  _selection: {
    anchor: {
      key: '2',
      offset: 0,
      type: 'element'
    },
    focus: {
      key: '2',
      offset: 0,
      type: 'element'
    },
    type: 'range'
  }
}
