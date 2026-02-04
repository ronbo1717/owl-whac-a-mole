import React from 'react';
import { Owl } from './Owl';

interface GridProps {
    holes: { id: number; isVisible: boolean; isHit: boolean }[];
    onWhack: (id: number) => void;
}

export const Grid: React.FC<GridProps> = ({ holes, onWhack }) => {
    return (
        <div className="game-grid">
            {holes.map((hole) => (
                <div key={hole.id} className="hole">
                    <div className="hole-back"></div>
                    <Owl
                        isVisible={hole.isVisible}
                        isHit={hole.isHit}
                        onClick={() => onWhack(hole.id)}
                    />
                    <div className="hole-front"></div>
                </div>
            ))}
        </div>
    );
};
