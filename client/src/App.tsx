// === client/src/App.tsx ===
import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import './App.css';

export default function App() {
    const [prompt, setPrompt] = useState('');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    const generatePlugin = async () => {
        setLoading(true);
        const res = await fetch('http://localhost:3001/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt }),
        });
        const data = await res.json();
        setCode(data.code);
        setLoading(false);
    };

    const downloadPlugin = () => {
        const blob = new Blob([code], { type: 'text/php' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'custom-plugin.php';
        a.click();
        URL.revokeObjectURL(url);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code).then(() => {
            alert('✅ Code copied to clipboard');
        });
    };

    return (
        <div className="app" style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h1>Woo Plugin Generator</h1>
                {code && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={downloadPlugin}>⬇️ Download Plugin (.php)</button>
                        <button onClick={copyToClipboard}>📋 Copy Code</button>
                    </div>
                )}
            </header>

            <textarea
                placeholder="Describe what you want the plugin to do..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                style={{ width: '100%', padding: '10px', fontSize: '16px', marginBottom: '10px' }}
            />

            <button onClick={generatePlugin} disabled={loading} style={{ marginBottom: '15px' }}>
                {loading ? 'Generating...' : 'Generate Plugin'}
            </button>

            <Editor
                height="500px"
                defaultLanguage="php"
                value={code}
                onChange={(value) => setCode(value ?? '')}
                theme="vs-dark"
                options={{ fontSize: 14 }}
            />
        </div>
    );
}
