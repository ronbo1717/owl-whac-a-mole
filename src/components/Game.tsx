import React, { useState, useEffect, useRef } from 'react';
import { Grid } from './Grid';
import { BossStage } from './BossStage';
import { Ranking } from './Ranking';
import { NameEntry } from './NameEntry';
import { saveScore, getRanking, isRankIn } from '../utils/storage';
import type { ScoreRecord } from '../utils/storage';

type GameStatus = 'idle' | 'playing' | 'boss' | 'finished' | 'gameover' | 'ranking';

const INITIAL_TIME = 30;
const GRID_SIZE = 9;

export const Game: React.FC = () => {
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
    const [status, setStatus] = useState<GameStatus>('idle');
    const [holes, setHoles] = useState(
        Array.from({ length: GRID_SIZE }, (_, i) => ({ id: i, isVisible: false, isHit: false }))
    );

    const [rankingScores, setRankingScores] = useState<ScoreRecord[]>([]);

    const timerRef = useRef<number | null>(null);
    const moleTimerRef = useRef<number | null>(null);

    const startGame = () => {
        setScore(0);
        setTimeLeft(INITIAL_TIME);
        setStatus('playing');
        setHoles((prev) => prev.map((h) => ({ ...h, isVisible: false, isHit: false })));
    };

    const endGame = () => {
        if (score >= 10) {
            setStatus('boss');
        } else {
            setStatus('finished');
        }
        if (timerRef.current) clearInterval(timerRef.current);
        if (moleTimerRef.current) clearTimeout(moleTimerRef.current);
        setHoles((prev) => prev.map((h) => ({ ...h, isVisible: false })));
    };

    const handleBossClear = () => {
        const finalScore = score + 50;
        setScore(finalScore);
        setStatus('finished');
    };

    const handleBossFail = () => {
        setStatus('gameover');
    };

    const handleNameSubmit = (name: string) => {
        saveScore(name, score);
        setRankingScores(getRanking());
        setStatus('idle'); // Or show ranking view specifically?
        // Let's add a explicit 'view-ranking' state or just show it in idle?
        // Let's toggle a separate state for showing ranking view.
    };

    // Let's refine the state machine a bit or use auxiliary state.
    const [showNameEntry, setShowNameEntry] = useState(false);
    const [showRanking, setShowRanking] = useState(false);

    useEffect(() => {
        if (status === 'finished' || status === 'gameover') {
            if (isRankIn(score)) {
                setTimeout(() => setShowNameEntry(true), 1000); // Delay slightly
            }
        }
    }, [status, score]);


    const popRandomMole = () => {
        if (status !== 'playing') return;

        const randomId = Math.floor(Math.random() * GRID_SIZE);
        const duration = Math.random() * 1000 + 500; // 0.5s - 1.5s stay time

        setHoles((prev) =>
            prev.map((h) => (h.id === randomId ? { ...h, isVisible: true, isHit: false } : h))
        );

        // Hide after duration
        setTimeout(() => {
            setHoles((prev) =>
                prev.map((h) => (h.id === randomId ? { ...h, isVisible: false } : h))
            );
        }, duration);

        // Schedule next pop
        const nextPopTime = Math.random() * 500 + 200;
        moleTimerRef.current = setTimeout(popRandomMole, nextPopTime);
    };

    useEffect(() => {
        if (status === 'playing' && timeLeft <= 0) {
            endGame();
        }
    }, [timeLeft, status]);

    useEffect(() => {
        if (status === 'playing') {
            timerRef.current = setInterval(() => {
                setTimeLeft((t) => Math.max(0, t - 1));
            }, 1000);

            popRandomMole();
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
            if (moleTimerRef.current) clearTimeout(moleTimerRef.current);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (moleTimerRef.current) clearTimeout(moleTimerRef.current);
        };
    }, [status]);

    // Need to use a ref or effect to keep popRandomMole running with fresh state if it depends on it.
    // Actually, recursive setTimeout inside a function captured in closure might have stale state issues if not careful.
    // Better approach: Use a useEffect for the loop that triggers on a dependency or uses refs.
    // For simplicity, let's just use a simple interval for popping or a separate effect.

    // Revised approach for mole popping to avoid closure staleness:
    useEffect(() => {
        if (status !== 'playing') return;

        let timeoutId: number;
        const loop = () => {
            const delay = Math.random() * 800 + 400; // Frequency
            timeoutId = setTimeout(() => {
                const randomId = Math.floor(Math.random() * GRID_SIZE);
                const stayDuration = Math.random() * 1000 + 800;

                setHoles((prev) => {
                    // Only pop if not already visible? Or just overwrite.
                    // Let's find a hole that isn't visible basically (simple logic)
                    // Or just pick random.
                    return prev.map((h) => (h.id === randomId ? { ...h, isVisible: true, isHit: false } : h));
                });

                // Auto hide logic needs to be tied to the specific pop instance.
                // We can handle that with a separate timeout per hole, but that gets complex.
                // Simple way: The hole component handles its own timer? No, uncontrolled.
                // Let's just set a timeout to hide it.
                setTimeout(() => {
                    setHoles((prev) => prev.map((h) => (h.id === randomId && !h.isHit ? { ...h, isVisible: false } : h)));
                }, stayDuration);

                loop();
            }, delay);
        };

        loop();
        return () => clearTimeout(timeoutId);
    }, [status]);


    const handleWhack = (id: number) => {
        setHoles((prev) => {
            const hole = prev.find((h) => h.id === id);
            if (hole && hole.isVisible && !hole.isHit) {
                setScore((s) => s + 1);
                return prev.map((h) => (h.id === id ? { ...h, isHit: true } : h));

                // Optionally hide after a delay or let the main loop hide it.
                // If we want it to disappear immediately after hit anim, we can do that in CSS or here.
            }
            return prev;
        });
    };

    return (
        <div className="game-container">
            <header className="game-header">
                <div className="score-board">
                    <span>スコア: {score}</span>
                    <span>残り時間: {timeLeft}秒</span>
                </div>
            </header>

            <Grid holes={holes} onWhack={handleWhack} />

            {status === 'boss' && (
                <BossStage onClear={handleBossClear} onFail={handleBossFail} />
            )}

            {(status === 'finished' || status === 'gameover' || status === 'idle') && !showNameEntry && !showRanking && (
                <div className="overlay">
                    <div className="modal">
                        <h1>
                            {status === 'finished' ? 'クリア！素晴らしい！' :
                                status === 'gameover' ? 'ボスに敗北...' :
                                    'フクロウもぐらたたき'}
                        </h1>
                        {(status === 'finished' || status === 'gameover') && <p className="final-score">最終スコア: {score}</p>}

                        <div className="button-group">
                            <button className="start-btn" onClick={() => {
                                setShowNameEntry(false);
                                setShowRanking(false);
                                startGame();
                            }}>
                                {status === 'idle' ? 'スタート' : 'もう一度遊ぶ'}
                            </button>
                            <button className="ranking-btn" onClick={() => {
                                setRankingScores(getRanking());
                                setShowRanking(true);
                            }}>
                                ランキングを見る
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showNameEntry && (
                <div className="overlay">
                    <NameEntry score={score} onSubmit={(name) => {
                        handleNameSubmit(name);
                        setShowNameEntry(false);
                        setShowRanking(true); // Show ranking after entry
                    }} />
                </div>
            )}

            {showRanking && (
                <div className="overlay">
                    <Ranking scores={rankingScores} onClose={() => setShowRanking(false)} />
                </div>
            )}
        </div>
    );
};
