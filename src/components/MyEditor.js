import React, { useEffect, useState } from 'react';
import { Editor, EditorState, Modifier, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';

const MyEditor = () => {
  const [editorState, setEditorState] = useState(() => {
    const content = localStorage.getItem('content');
    if (content) {
      return EditorState.createWithContent(convertFromRaw(JSON.parse(content)));
    }
    return EditorState.createEmpty();
  });

  useEffect(() => {
    const content = editorState.getCurrentContent();
    localStorage.setItem('content', JSON.stringify(convertToRaw(content)));
  }, [editorState]);

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const handleBeforeInput = (chars, editorState) => {
    if (chars !== ' ') {
      return 'not-handled';
    }

    const selection = editorState.getSelection();
    const currentContent = editorState.getCurrentContent();
    const currentBlock = currentContent.getBlockForKey(selection.getStartKey());
    const start = selection.getStartOffset();
    const text = currentBlock.getText().slice(0, start);

    let type = null;
    if (text === '#') {
      type = 'header-one';
    } else if (text === '*') {
      type = 'BOLD';
    } else if (text === '**') {
      type = 'RED_TEXT';
    } else if (text === '***') {
      type = 'UNDERLINE';
    }


    if (type) {
      const blockType = type === 'header-one' ? type : null;
      let newState = editorState;


      const newContentState = Modifier.replaceText(
        currentContent,
        selection.merge({
          anchorOffset: start - text.length,
          focusOffset: start,
        }),
        ''
      );


      if (blockType) {
        newState = RichUtils.toggleBlockType(
          EditorState.push(newState, newContentState, 'change-block-type'),
          blockType
        );
      } else {

        newState = EditorState.push(newState, newContentState, 'change-inline-style');
        const currentStyle = newState.getCurrentInlineStyle();


        if (type === 'BOLD' || type === 'RED_TEXT' || type === 'UNDERLINE') {
          newState = RichUtils.toggleInlineStyle(newState, type);
        }
      }

      setEditorState(newState);
      return 'handled';
    }

    return 'not-handled';
  };

  const handleChange = (state) => {
    setEditorState(state);
  };

  const styleMap = {
    'BOLD': {
      fontWeight: 'bold',
    },
    'RED_TEXT': {
      color: 'red',
    },
    'UNDERLINE': {
      textDecoration: 'underline',
    },
  };

  return (
    <div className="editor-container">
      <Editor
        customStyleMap={styleMap}
        editorState={editorState}
        onChange={handleChange}
        handleKeyCommand={handleKeyCommand}
        handleBeforeInput={handleBeforeInput}
      />
    </div>
  );
};

export default MyEditor;
