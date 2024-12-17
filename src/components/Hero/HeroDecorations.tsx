const HeroDecorations = () => {
  // Helper function to generate circle elements
  const generateCircles = (startX: number, startY: number, rows: number, cols: number) => {
    return Array.from({ length: rows * cols }, (_, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const cx = startX + col * 14.6667;
      const cy = startY - row * 14.6667;
      
      return (
        <circle
          key={`dot-${row}-${col}`}
          cx={cx}
          cy={cy}
          r="1.66667"
          transform={`rotate(-90 ${cx} ${cy})`}
          fill="white"
        />
      );
    });
  };

  return (
    <>
      {/* Left bottom decoration */}
      <div className="absolute -left-9 bottom-0 z-[-1]">
        <svg
          width="134"
          height="106"
          viewBox="0 0 134 106"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {generateCircles(1.66667, 104, 7, 10)}
        </svg>
      </div>

      {/* Right top decoration */}
      <div className="absolute -right-6 -top-6 z-[-1]">
        <svg
          width="134"
          height="106"
          viewBox="0 0 134 106"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {generateCircles(1.66667, 104, 7, 10)}
        </svg>
      </div>
    </>
  );
};

export default HeroDecorations;
