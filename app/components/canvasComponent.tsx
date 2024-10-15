'use client';

import React, { useEffect, useRef } from 'react';

interface Triangle {
    size: number;
    centerX: number;
    centerY: number;
    rotationSpeed: number;
    angle: number;
    color: string;
    velocityX: number;
    velocityY: number;
    spawnDelay: number;
    isFlickering?: boolean;
    flickerStartTime?: number;
    opacity?: number;
    hasTrail?: boolean;
    trail?: { x: number; y: number; angle: number }[];
}

const MAX_TRIANGLES = 55;
const FLICKER_DURATION = 2000; // 2 seconds
const LINE_SPAWN_INTERVAL = 5000; // Spawn a new line every 5 seconds
const TRIANGLES_PER_LINE = 10; // Number of triangles in each flickering line
const TRAIL_CHANCE = 0.1; // 10% chance for a triangle to have a trail
const TRAIL_LENGTH = 5; // Number of trail segments
const TRAIL_DELAY = 0.75; // Increase this factor to increase the delay

const colorPalette = [
    'rgb(96, 96, 96)', 'rgb(92, 92, 92)', 'rgb(99, 99, 99)',
    'rgb(147, 147, 147)', 'rgb(193, 193, 193)', 'rgb(255, 255, 255)'
];

const TriangleCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const trianglesRef = useRef<Triangle[]>([]);
    const lastLineSpawnTime = useRef(0);

    const smallTriangleSpeedMultiplier = 2;
    const largeTriangleSpeedMultiplier = 0.5;

    const createRandomTriangle = (width: number, height: number, isFlickering: boolean = false): Triangle => {
        const size = isFlickering ? 50 : Math.random() * Math.min(width, height) * 0.6 + 50;
        const centerX = Math.random() * width;
        const centerY = Math.random() * height;
        const color = isFlickering ? 'rgb(255, 255, 255)' : colorPalette[Math.floor(Math.random() * colorPalette.length)];
        const sizeFactor = size / Math.min(width, height);
        const speedFactor = sizeFactor > 0.5 ? largeTriangleSpeedMultiplier : smallTriangleSpeedMultiplier;
        const rotationSpeed = (Math.random() - 0.5) * 0.01 * speedFactor;
        const maxSpeed = 0.5;
        const velocityX = isFlickering ? 0 : (Math.random() - 0.5) * 3 * maxSpeed * speedFactor;
        const velocityY = isFlickering ? 0 : (Math.random() - 0.5) * 3 * maxSpeed * speedFactor;
        const spawnDelay = Math.random() * 3000;
        const hasTrail = !isFlickering && Math.random() < TRAIL_CHANCE;

        return {
            size, centerX, centerY, rotationSpeed, angle: Math.random() * Math.PI * 2,
            color, velocityX, velocityY, spawnDelay, isFlickering,
            flickerStartTime: isFlickering ? Date.now() : undefined,
            opacity: isFlickering ? Math.random() : 1,
            hasTrail,
            trail: hasTrail ? [] : undefined
        };
    };

    const createRandomFlickerTriangle = (width: number, height: number): Triangle => {
        const size = 50; // Fixed size for flickers
        const color = 'rgb(255, 255, 255)';
        const opacity = Math.random(); // Different opacities
        const centerX = Math.random() > 0.5 ? Math.random() * width : 0; // Keep flickers near the edges
        const centerY = Math.random() > 0.5 ? Math.random() * height : height;

        return {
            size,
            centerX,
            centerY,
            rotationSpeed: 0,
            angle: Math.random() * Math.PI * 2,
            color,
            velocityX: 0,
            velocityY: 0,
            spawnDelay: 0,
            isFlickering: true,
            flickerStartTime: Date.now(),
            opacity,
            hasTrail: false
        };
    };


    const createFlickeringLine = (width: number, height: number) => {
        const x = Math.random() * width;
        for (let i = 0; i < TRIANGLES_PER_LINE; i++) {
            setTimeout(() => {
                const triangle = createRandomFlickerTriangle(width, height);
                triangle.centerX = x;
                triangle.centerY = (height / TRIANGLES_PER_LINE) * i;
                trianglesRef.current.push(triangle);
            }, Math.random() * 1000); // Random delay for each flicker
        }
    };

    const drawTriangle = (ctx: CanvasRenderingContext2D, triangle: Triangle) => {
        const { size, centerX, centerY, angle, color, isFlickering, opacity, hasTrail, trail } = triangle;
        const height = size * (Math.sqrt(3) / 2);

        const TRAIL_DISTANCE = 10; // Distance to separate each trail segment

        // Draw trail (delayed triangle copies with decreasing opacity)
        if (hasTrail && trail) {
            trail.forEach((pos, index) => {
                const trailOpacity = (1 - (index / (TRAIL_LENGTH * TRAIL_DELAY))) * 0.5; // Adjust opacity fade
                ctx.save();

                // Offset position to create more separation from the original triangle
                const offsetX = Math.cos(pos.angle) * (TRAIL_DISTANCE * index); // X offset
                const offsetY = Math.sin(pos.angle) * (TRAIL_DISTANCE * index); // Y offset
                ctx.translate(pos.x - offsetX, pos.y - offsetY);
                ctx.rotate(pos.angle);

                ctx.beginPath();
                ctx.moveTo(0, -height / 2);
                ctx.lineTo(-size / 2, height / 2);
                ctx.lineTo(size / 2, height / 2);
                ctx.closePath();
                ctx.fillStyle = `rgba(${color.match(/\d+/g)?.join(',')},${trailOpacity})`; // Trail opacity
                ctx.fill();
                ctx.restore();
            });
        }


        // Draw original triangle
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, -height / 2);
        ctx.lineTo(-size / 2, height / 2);
        ctx.lineTo(size / 2, height / 2);
        ctx.closePath();
        ctx.fillStyle = `rgba(${color.match(/\d+/g)?.join(',')},${opacity})`; // Adjust opacity here for flickering
        ctx.fill();
        ctx.restore();
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight * 2;
        };

        const render = () => {
            if (!ctx) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const currentTime = Date.now();

            // Spawn new flickering line if it's time
            if (currentTime - lastLineSpawnTime.current > LINE_SPAWN_INTERVAL) {
                createFlickeringLine(canvas.width, canvas.height);
                lastLineSpawnTime.current = currentTime;
            }

            trianglesRef.current = trianglesRef.current
                .filter(triangle => {
                    if (triangle.isFlickering && triangle.flickerStartTime) {
                        return currentTime - triangle.flickerStartTime < FLICKER_DURATION;
                    }
                    return currentTime >= triangle.spawnDelay;
                })
                .map(triangle => {
                    if (triangle.isFlickering) {
                        triangle.opacity = Math.abs(Math.sin((currentTime - (triangle.flickerStartTime || 0)) * 0.01));
                    } else {
                        triangle.angle += triangle.rotationSpeed;
                        triangle.centerX += triangle.velocityX;
                        triangle.centerY += triangle.velocityY;

                        if (triangle.centerX < -triangle.size) triangle.centerX = canvas.width + triangle.size;
                        if (triangle.centerX > canvas.width + triangle.size) triangle.centerX = -triangle.size;
                        if (triangle.centerY < -triangle.size) triangle.centerY = canvas.height + triangle.size;
                        if (triangle.centerY > canvas.height + triangle.size) triangle.centerY = -triangle.size;

                        // Update trail
                        if (triangle.hasTrail) {
                            if (!triangle.trail) triangle.trail = [];
                            triangle.trail.unshift({ x: triangle.centerX, y: triangle.centerY, angle: triangle.angle });
                            if (triangle.trail.length > TRAIL_LENGTH) triangle.trail.pop();
                        }
                    }

                    drawTriangle(ctx, triangle);
                    return triangle;
                });

            while (trianglesRef.current.length < MAX_TRIANGLES) {
                trianglesRef.current.push(createRandomTriangle(canvas.width, canvas.height));
            }

            requestAnimationFrame(render);
        };

        resizeCanvas();
        render();

        window.addEventListener('resize', resizeCanvas);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};

export default TriangleCanvas;