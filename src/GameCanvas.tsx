import { useEffect, useRef } from 'react';


export default function GameCanvas() {
    const canvaRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>(0);
    const previousTimeRef = useRef<number>(0);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);

    const animate = (time: number) => {
        contextRef.current?.clearRect(0, 0, 800, 450);
        if(contextRef.current) {
            contextRef.current.fillStyle = 'blue';
            contextRef.current.fillRect(100, 200, 50, 50);
        }

        if (previousTimeRef.current != undefined) {
            const deltaTime = time - previousTimeRef.current;
        //    console.log(`Delta time: ${deltaTime} ms`);
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

    return <canvas ref={canvaRef} width={800} height={450} style={{ border: '1px solid black' }} />;    
}