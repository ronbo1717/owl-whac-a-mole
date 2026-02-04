import React from 'react';
import type { ScoreRecord } from '../utils/storage';

interface RankingProps {
    scores: ScoreRecord[];
    onClose: () => void;
}

export const Ranking: React.FC<RankingProps> = ({ scores, onClose }) => {
    return (
        <div className="ranking-container">
            <h2>🏆 ランキング 🏆</h2>
            <ul className="ranking-list">
                {scores.length === 0 ? (
                    <li className="no-data">まだ記録がありません</li>
                ) : (
                    scores.map((record, index) => (
                        <li key={index} className={`ranking-item rank-${index + 1}`}>
                            <span className="rank">{index + 1}位</span>
                            <span className="name">{record.name}</span>
                            <span className="score">{record.score}点</span>
                        </li>
                    ))
                )}
            </ul>
            <button className="close-btn" onClick={onClose}>閉じる</button>
        </div>
    );
};
