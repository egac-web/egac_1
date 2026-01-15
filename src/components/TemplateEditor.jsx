import React, { useEffect, useState, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';

export default function TemplateEditor({
  initialHtml = '',
  initialSubject = '',
  initialVars = {},
  onSave = () => {},
  onPreview = () => {},
  onSendTest = () => {},
  simpleMode = true,
}) {
  const [subject, setSubject] = useState(initialSubject || '');
  const [varsText, setVarsText] = useState(JSON.stringify(initialVars || {}, null, 2));
  const [advanced, setAdvanced] = useState(!simpleMode);
  const [previewHtml, setPreviewHtml] = useState('');

  const editor = useEditor({
    extensions: [StarterKit, Link],
    content: initialHtml || '',
    editable: true,
  });

  const [codeValue, setCodeValue] = useState(initialHtml || '');

  useEffect(() => {
    // sync editor -> code on advanced toggles
    if (advanced) {
      setCodeValue(editor ? editor.getHTML() : initialHtml);
    }
  }, [advanced]);

  useEffect(() => {
    // sync code -> editor on save from advanced
    if (editor && !advanced) {
      // ensure editor content matches code when switching back
      editor.commands.setContent(codeValue || '');
    }
  }, [codeValue]);

  function getHtml() {
    if (advanced) return codeValue || '';
    return editor ? editor.getHTML() : '';
  }

  function handleSave() {
    const html = getHtml();
    const text = (editor && editor.getText && editor.getText()) || html.replace(/<[^>]+>/g, '');
    onSave({ subject, html, text, vars: safeParseVars(varsText) });
  }

  function handlePreview() {
    const html = getHtml();
    const vars = safeParseVars(varsText);
    setPreviewHtml(html);
    onPreview({ html, vars });
  }

  function handleSendTest() {
    const html = getHtml();
    const vars = safeParseVars(varsText);
    const to = prompt('Enter recipient email for test send:');
    if (!to) return;
    onSendTest({ to, html, subject, vars });
  }

  function safeParseVars(t) {
    try {
      if (!t || !t.trim()) return {};
      return JSON.parse(t);
    } catch (e) {
      return {}; // caller should validate
    }
  }

  return (
    <div className="template-editor-react" style={{ display: 'grid', gap: '0.75rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" style={{ flex: 1, padding: '0.5rem', borderRadius: 6, border: '1px solid #e5e7eb' }} />
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" checked={advanced} onChange={(e) => setAdvanced(e.target.checked)} /> Advanced (HTML)
        </label>
      </div>

      <div style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: 8, background: '#fff' }}>
        {!advanced ? (
          <div>
            <div style={{ marginBottom: 8, display: 'flex', gap: 8 }}>
              <button className="btn btn-sm btn-ghost" type="button" onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
              <button className="btn btn-sm btn-ghost" type="button" onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
              <button className="btn btn-sm btn-ghost" type="button" onClick={() => editor.chain().focus().toggleStrike().run()}>S</button>
            </div>
            <EditorContent editor={editor} />
          </div>
        ) : (
          <CodeMirror value={codeValue} height="220px" extensions={[html()]} onChange={(val) => setCodeValue(val)} />
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1rem' }}>
        <div>
          <label style={{ fontWeight: 600 }}>Preview variables (JSON)</label>
          <textarea value={varsText} onChange={(e) => setVarsText(e.target.value)} style={{ width: '100%', minHeight: 120, fontFamily: 'monospace', marginTop: 6, borderRadius: 6, border: '1px solid #e5e7eb', padding: 8 }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary btn-sm" onClick={handleSave}>Save</button>
            <button className="btn btn-secondary btn-sm" onClick={handlePreview}>Preview</button>
            <button className="btn btn-secondary btn-sm" onClick={handleSendTest}>Send test</button>
          </div>
          <div style={{ border: '1px solid #e5e7eb', padding: 8, borderRadius: 6, minHeight: 120, overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: previewHtml || '<em>No preview</em>' }} />
        </div>
      </div>
    </div>
  );
}
