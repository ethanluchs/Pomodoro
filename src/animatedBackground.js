
import React, { useEffect, useRef } from 'react';

const AnimatedBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const colors = [
      'rgba(255, 105, 180, 0.3)', 
      'rgba(255, 20, 147, 0.3)', 
      'rgba(147, 112, 219, 0.3)',   
      'rgba(138, 43, 226, 0.3)',  
      'rgba(75, 0, 130, 0.3)',  
      'rgba(106, 90, 205, 0.3)',    
      'rgba(72, 209, 204, 0.3)',    
      'rgba(0, 206, 209, 0.3)'      
    ];
    

    const blobs = [];
    const blobCount = 25;
    
    for (let i = 0; i < blobCount; i++) {
      blobs.push({
        baseX: Math.random() * canvas.width,
        baseY: Math.random() * canvas.height,
     
        radius: Math.random() * 350 + 250,
        color: colors[Math.floor(Math.random() * colors.length)],
    
        frequency: Math.random() * 0.001 + 0.0005, // 5-10x faster movement
        amplitudeX: canvas.width * (0.4 + Math.random() * 0.5), // 40-90% of screen width
        amplitudeY: canvas.height * (0.4 + Math.random() * 0.5), // 40-90% of screen height
        phaseShift: Math.random() * Math.PI * 2,

        frequencyOffsetX: Math.random() * 0.0005,
        frequencyOffsetY: Math.random() * 0.0005,
        opacityBase: 0.2 + Math.random() * 0.2,
        opacityCycle: 2000 + Math.random() * 3000
      });
    }
    
    // Create a function to draw a very soft blob (almost no visible edges)
    const drawMeshBlob = (x, y, radius, color, opacityMultiplier) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 1.5);
      const baseColor = color.slice(0, color.lastIndexOf(',')) + ',';
  
      gradient.addColorStop(0, baseColor + (0.7 * opacityMultiplier) + ')');
      gradient.addColorStop(0.2, baseColor + (0.6 * opacityMultiplier) + ')');
      gradient.addColorStop(0.4, baseColor + (0.4 * opacityMultiplier) + ')');
      gradient.addColorStop(0.6, baseColor + (0.25 * opacityMultiplier) + ')');
      gradient.addColorStop(0.8, baseColor + (0.1 * opacityMultiplier) + ')');
      gradient.addColorStop(1, baseColor + '0)');
      
      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.arc(x, y, radius * 1.5, 0, Math.PI * 2);
      ctx.fill();
    };
    
    let tick = 0;
    const animate = () => {
      // Clear the canvas completely on each frame for pure color blending
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      //background
      ctx.fillStyle = 'rgba(138, 43, 226, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      tick++;
      
      // Update and draw each blob
      blobs.forEach(blob => {
        // Complex motion with varied frequencies for x and y
        const tx = tick * (blob.frequency + blob.frequencyOffsetX);
        const ty = tick * (blob.frequency + blob.frequencyOffsetY);
        
        const x = blob.baseX + Math.sin(tx + blob.phaseShift) * blob.amplitudeX;
        const y = blob.baseY + Math.cos(ty * 0.8 + blob.phaseShift) * blob.amplitudeY;
        
        const opacityVariation = blob.opacityBase + 
          Math.sin(tick / (blob.opacityCycle/2) * Math.PI * 2) * 0.25;
        
        // Draw mesh blob
        drawMeshBlob(x, y, blob.radius, blob.color, opacityVariation);
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="animated-background-canvas" />;
};

export default AnimatedBackground;