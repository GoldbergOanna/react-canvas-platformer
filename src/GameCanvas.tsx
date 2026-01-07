import { useEffect, useRef } from 'react';
import { usePhysics } from './hooks/usePhysics';

export default function GameCanvas() {
    const maxY = 450 - 50;
    const maxX = 800 - 50;
    const { getPosition, update, jump, setHorizontalMovement } = usePhysics({groundY: maxY, minX: 0, maxX});
    const canvaRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>(0);
    const previousTimeRef = useRef<number>(0);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const pressedKeysRef = useRef<Set<string>>(new Set());

    const handleKeyDown = () => {
         let horizontal: -1 | 0 | 1 = 0;

        if (pressedKeysRef.current.has('ArrowLeft')) horizontal = -1;
        if (pressedKeysRef.current.has('ArrowRight')) horizontal = 1;

        setHorizontalMovement(horizontal);

        if (pressedKeysRef.current.has('ArrowUp')) {
            jump();
        }
    }

    const animate = (time: number) => {
        contextRef.current?.clearRect(0, 0, 800, 450);
        if(previousTimeRef.current != undefined) {
            const deltaTime = time - previousTimeRef.current
            handleKeyDown();
            update(deltaTime);
        }
        if(contextRef.current) {
            contextRef.current.fillStyle = 'blue';
            const { x, y } = getPosition();
            contextRef.current.fillRect(x, y, 50, 50);
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