import React, { useState } from 'react';

interface NameEntryProps {
    score: number;
    onSubmit: (name: string) => void;
}

export const NameEntry: React.FC<NameEntryProps> = ({ score, onSubmit }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onSubmit(name.trim());
        }
    };

    return (
        <div className="name-entry-container">
            <h2>🎉 ランクイン！ 🎉</h2>
            <p className="entry-score">スコア: {score}</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="名前を入力してね"
                    maxLength={10}
                    autoFocus
                    className="name-input"
                />
                <button type="submit" className="submit-btn" disabled={!name.trim()}>
                    登録
                </button>
            </form>
        </div>
    );
};
