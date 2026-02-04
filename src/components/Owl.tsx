import React from 'react';
import owlImg from '../assets/owl.png';

interface OwlProps {
    isVisible: boolean;
    isHit: boolean;
    onClick: () => void;
}

export const Owl: React.FC<OwlProps> = ({ isVisible, isHit, onClick }) => {
    return (
        <div
            className={`owl-container ${isVisible ? 'visible' : ''}`}
            onPointerDown={(e) => {
                // Prevent clicking if not visible or already hit
                if (!isVisible || isHit) return;
                e.stopPropagation();
                // Prevent default to avoid potential double-firing or scrolling issues on some devices
                e.preventDefault();
                onClick();
            }}
        >
            <img
                src={owlImg}
                alt="Owl"
                className={`owl ${isHit ? 'hit' : ''}`}
                draggable={false}
            />
        </div>
    );
};
