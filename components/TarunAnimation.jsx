import React, { useState, useEffect } from 'react';

const UseAnimation = ({ Component, duration, isshowComponent, mountAnimationclass, unmountAnimationclass }) => {
    const [isVisible, setIsVisible] = useState(isshowComponent);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        let timer;
        if (isshowComponent) {
            setIsVisible(true);
            setIsLeaving(false);
        } else {
            setIsLeaving(true);
            timer = setTimeout(() => {
                setIsVisible(false);
            }, duration);
        }

        return () => clearTimeout(timer);
    }, [isshowComponent]);

    return (
        isVisible && (
            <div className={`${mountAnimationclass} ${isLeaving ? `${unmountAnimationclass}` : ''}`}>
                {Component}
            </div>
        )
    );
};

export default UseAnimation;