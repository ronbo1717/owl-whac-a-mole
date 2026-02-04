import React, { useState, useEffect } from 'react';
import bossImg from '../assets/boss.png';

interface BossStageProps {
    onClear: () => void;
    onFail: () => void;
}

const BOSS_HP = 50; // Number of taps required
const TIME_LIMIT = 10; // Seconds

export const BossStage: React.FC<BossStageProps> = ({ onClear, onFail }) => {
    const [hp, setHp] = useState(BOSS_HP);
    const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
    const [isHit, setIsHit] = useState(false);

    useEffect(() => {
        if (hp <= 0) {
            onClear();
        } else if (timeLeft <= 0) {
            onFail();
        }
    }, [hp, timeLeft, onClear, onFail]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleTap = (e: React.PointerEvent | React.MouseEvent) => {
        // Prevent default to avoid unintended behaviors like selection or zoom
        e.preventDefault();
        if (hp <= 0 || timeLeft <= 0) return;

        setHp((prev) => prev - 1);
        setIsHit(true);
        setTimeout(() => setIsHit(false), 50); // Short hit effect
    };

    return (
        <div className="boss-stage">
            <div className="boss-header">
                <h2>ボス出現！！連打で倒せ！</h2>
                <div className="boss-timer">残り時間: {timeLeft}秒</div>
                <div className="hp-bar-container">
                    <div
                        className="hp-bar"
                        style={{ width: `${(hp / BOSS_HP) * 100}%` }}
                    ></div>
                </div>
            </div>

            <div className="boss-container">
                <img
                    src={bossImg}
                    alt="Boss"
                    className={`boss ${isHit ? 'hit' : ''}`}
                    draggable={false}
                    onPointerDown={handleTap}
                />
            </div>
        </div>
    );
};
