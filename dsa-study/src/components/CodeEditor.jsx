import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';

export default function CodeEditor({ value, onChange, placeholder }) {
  return (
    <div className="border border-stone-300 bg-white">
      <Editor
        value={value}
        onValueChange={onChange}
        highlight={code => Prism.highlight(code, Prism.languages.javascript, 'javascript')}
        padding={16}
        placeholder={placeholder}
        style={{
          fontFamily: '"Fira Code", "Fira Mono", "Consolas", "Monaco", monospace',
          fontSize: 14,
          minHeight: '300px',
          lineHeight: 1.6,
        }}
        className="focus:outline-none"
      />
    </div>
  );
}
