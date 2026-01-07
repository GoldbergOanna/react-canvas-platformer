import { useEffect, useRef } from 'react';


export default function GameCanvas() {
    const canvaRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>(0);
    const previousTimeRef = useRef<number>(0);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const positionRef = useRef<{ x: number; y: number }>({ x: 0, y: 200 });
    const pressedKeysRef = useRef<Set<string>>(new Set());
    const maxX = 800 - 50;
    const maxY = 450 - 50;
    const velocityRef = useRef<number>(0);
    const gra = 0.0015; // gravity acceleration
    const jumpStrength = -0.65;

    const clamp = (value: number, min: number, max: number) => {
        return Math.min(Math.max(value, min), max);
    }

    const handleKeyDown = (deltaTime: number) => {
        const moveDistance = deltaTime * 0.1;
         if(pressedKeysRef.current.has('ArrowLeft')) {
                positionRef.current.x -= moveDistance;
            }
            if(pressedKeysRef.current.has('ArrowRight')) {
                positionRef.current.x += moveDistance;
            }
            if(pressedKeysRef.current.has('ArrowUp')) {
                if (positionRef.current.y >= maxY) {
                    velocityRef.current = jumpStrength; 
                }
                // positionRef.current.y -= moveDistance;
            }
            if(pressedKeysRef.current.has('ArrowDown')) {
                positionRef.current.y += moveDistance;
            }
    }

    const animate = (time: number) => {
        contextRef.current?.clearRect(0, 0, 800, 450);
        if(previousTimeRef.current != undefined) {
            const deltaTime = time - previousTimeRef.current
            handleKeyDown(deltaTime);
            velocityRef.current += gra * deltaTime;
            positionRef.current.y += velocityRef.current * deltaTime;
            positionRef.current.x = clamp(positionRef.current.x, 0, maxX);
            positionRef.current.y = clamp(positionRef.current.y, 0, maxY);
            if(positionRef.current.y >= maxY) {
                velocityRef.current = 0;
            }
        }
        if(contextRef.current) {
            contextRef.current.fillStyle = 'blue';
            contextRef.current.fillRect(positionRef.current.x, positionRef.current.y, 50, 50);
        }
        previousTimeRef.current = time; 
        requestRef.current = requestAnimationFrame(animate);
    }

    useEffect(() => {
        const canvas = canvaRef.current;
        if (!canvas) return;     
         contextRef.current = canvas.getContext('2d');
        if (!contextRef.current) return;
    }, []);

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        }
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            pressedKeysRef.current.add(e.key);
        }
        const handleKeyUp = (e: KeyboardEvent) => {
            pressedKeysRef.current.delete(e.key);
        }
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        }
    }, []);

    return <canvas ref={canvaRef} width={800} height={450} style={{ border: '1px solid black' }} />;    
}