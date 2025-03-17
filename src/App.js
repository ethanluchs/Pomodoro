//core logic and react components of the timer -- crux of this project

import React, { useState, useRef, useEffect } from "react";
import './styles.css';
import AnimatedBackground from './animatedBackground';

function App() {
    const [isActive, setIsActive] = useState(false);
    const [timerType, setTimerType] = useState("pomodoro");
    const [timeRemaining, setTimeRemaining] = useState(25 * 60);
    const [cyclesCompleted, setCompleted] = useState(0);
    const formatTime = () => {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    function handleTimerTypeChange(type) {
        setIsActive(false);
        setTimerType(type);

        if (type == "pomodoro") {
            setTimeRemaining(25 * 60);
        }
        else if (type == "short") {
            setTimeRemaining(5 * 60);
        }
        else if (type == "long") {
            setTimeRemaining(15 * 60);
        }
    }

    function showNotification(title, message) {
        if (window.electron) {
            window.electron.notificationApi.sendNotification({
                title: title,
                body: message
            });
        } else {
            console.log("Notification:", title, message);
            const audio = new Audio("/notification-sound.mp3");
            audio.play().catch(e => console.log("Audio play failed:", e));
        }
    }

    function toggleTimer() {
        setIsActive(!isActive);
    }

    function resetTimer() {
        setTimeRemaining(0);
    }

    useEffect(() => {
        let interval = null;

        if (isActive && timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining(time => time - 1);
            }, 1000);
        }
        else if (timeRemaining === 0 || !isActive) {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isActive, timeRemaining]);

    return (
        <div className="app-container">
            <AnimatedBackground />
            
            <div className="timer-controls">
                <button
                    onClick={() => toggleTimer()}
                    className={isActive ? "stop-button" : "start-button"}
                >
                    {isActive ? "Stop" : "Start"}
                </button>
            </div>
    
            <div className="timer-display">
                {formatTime()}
            </div>
    
            <div className="timer-type-buttons">
                <button
                    onClick={() => handleTimerTypeChange("pomodoro")}
                    className={`pomodoro-button ${timerType === "pomodoro" ? "selected" : ""}`}
                >
                    Pomodoro
                </button>
                <button
                    onClick={() => handleTimerTypeChange("long")}
                    className={`long-break-button ${timerType === "long" ? "selected" : ""}`}
                >
                    Long Break
                </button>
                <button
                    onClick={() => handleTimerTypeChange("short")}
                    className={`short-break-button ${timerType === "short" ? "selected" : ""}`}
                >
                    Short Break
                </button>
            </div>
        </div>
    );
}
export default App;