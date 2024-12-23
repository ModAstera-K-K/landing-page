export default function VideoControls({
  currentFrame,
  setCurrentFrame,
  totalFrames,
}) {
  return (
    <>
      <div className="flex space-x-2 border-l border-r border-gray-300 px-2 dark:border-gray-700">
        <button
          className="rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => setCurrentFrame(0)}
          title="First Frame"
        >
          ⏮
        </button>
        <button
          className="rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => setCurrentFrame(Math.max(0, currentFrame - 1))}
          title="Previous Frame"
        >
          ⏪
        </button>
        <button
          className="rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() =>
            setCurrentFrame(Math.min(totalFrames - 1, currentFrame + 1))
          }
          title="Next Frame"
        >
          ⏩
        </button>
        <button
          className="rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => setCurrentFrame(totalFrames - 1)}
          title="Last Frame"
        >
          ⏭
        </button>
      </div>

      <input
        type="range"
        className="w-full"
        min="0"
        max={totalFrames - 1}
        value={currentFrame}
        onChange={(e) => setCurrentFrame(parseInt(e.target.value))}
        title="Timeline"
      />
      <div className="w-40">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Frame: {currentFrame + 1} / {totalFrames}
        </span>
      </div>
    </>
  );
}
