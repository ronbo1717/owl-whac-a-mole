export interface ScoreRecord {
    name: string;
    score: number;
    date: string;
}

const STORAGE_KEY = 'owl-whac-a-mole-ranking';
const MAX_RANKING = 10;

export const saveScore = (name: string, score: number) => {
    const currentScores = getRanking();
    const newRecord: ScoreRecord = {
        name,
        score,
        date: new Date().toISOString(),
    };

    const newScores = [...currentScores, newRecord]
        .sort((a, b) => b.score - a.score)
        .slice(0, MAX_RANKING);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newScores));
};

export const getRanking = (): ScoreRecord[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

export const isRankIn = (score: number): boolean => {
    const currentScores = getRanking();
    if (currentScores.length < MAX_RANKING) return true;
    return score > currentScores[currentScores.length - 1].score;
};
