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

    const uploadToWordPress = async () => {
        const pluginName = 'custom-plugin.php';
        const blob = new Blob([code], { type: 'text/php' });

        const formData = new FormData();
        formData.append('file', blob, pluginName);

        const username = 'admin'; // Your WP admin username
        const password = 'your_app_password_here'; // Replace with your WP App Password
        const siteUrl = 'http://woo-plugin-test.local'; // Your LocalWP site URL

        const auth = btoa(`${username}:${password}`);

        try {
            const response = await fetch(`${siteUrl}/wp-json/wp/v2/plugins`, {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${auth}`
                },
                body: formData
            });

            if (response.ok) {
                alert('✅ Plugin uploaded and ready in WordPress!');
            } else {
                const err = await response.text();
                alert('❌ Upload failed: ' + err);
            }
        } catch (err) {
            console.error(err);
            alert('❌ Error uploading plugin to WordPress.');
        }
    };

    return (
        <div className="app">
            <h1>Woo Plugin Generator</h1>
            <textarea
                placeholder="Describe what you want the plugin to do..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
            />
            <button onClick={generatePlugin} disabled={loading}>
                {loading ? 'Generating...' : 'Generate Plugin'}
            </button>
            <Editor
                height="400px"
                defaultLanguage="php"
                value={code}
                onChange={(value) => setCode(value ?? '')}
                theme="vs-dark"
            />
            {code && (
                <>
                    <button onClick={downloadPlugin}>Download Plugin (.php)</button>
                    <button onClick={uploadToWordPress}>Apply to WP Website Directly</button>
                </>
            )}
        </div>
    );
}
