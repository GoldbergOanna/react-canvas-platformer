import { useRef, useState } from "react";


const JUMP_STRENGTH = -0.65;
const GRAVITY_ACC = 0.0015;
const MAX_SPEED_X = 0.25;


type PhysicsConfig = {
    groundY: number;
    minX: number;
    maxX: number;
};

export function usePhysics({groundY, minX, maxX}: PhysicsConfig) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const positionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const velocityYRef = useRef(0);
  const velocityXRef = useRef(0);

  const update = (deltaTime: number) => {
    //vertical movement
    velocityYRef.current += GRAVITY_ACC * deltaTime;
    positionRef.current.y += velocityYRef.current * deltaTime;

    if (positionRef.current.y >= groundY) {
      positionRef.current.y = groundY;
      velocityYRef.current = 0;
    }

    positionRef.current.x = Math.min(
        Math.max(positionRef.current.x, minX),
        maxX
     );

    //horizontal movement
     positionRef.current.x += velocityXRef.current * deltaTime;
     positionRef.current.x = Math.min(
      Math.max(positionRef.current.x, minX),
      maxX
    );
    setPosition({
        x: positionRef.current.x,
        y: positionRef.current.y,
     });
  };

  const jump = () => {
    if (positionRef.current.y >= groundY) {
      velocityYRef.current = JUMP_STRENGTH;
    }
  };

  const setHorizontalMovement = (direction: -1 | 1 | 0 ) =>  {
   velocityXRef.current = direction * MAX_SPEED_X;
  } 

  const getPosition = () => {
    return positionRef.current;
  }

  return {
    position,
    update,
    jump,
    setHorizontalMovement,
    getPosition
  };
}
