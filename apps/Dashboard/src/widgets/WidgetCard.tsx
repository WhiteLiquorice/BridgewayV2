const HEIGHT_PX = { small: 200, medium: 350, large: 500 }
const HEIGHTS   = ['small', 'medium', 'large']

/**
 * Attaches a mousedown listener that measures how far the user dragged before
 * releasing, then calls onDone(deltaX, deltaY).  Stops propagation so the
 * DnD reorder handle isn't accidentally triggered.
 */
function edgeDragHandler(onDone) {
  return function handleMouseDown(e) {
    e.preventDefault()
    e.stopPropagation()
    const x0 = e.clientX
    const y0 = e.clientY
    function onMouseUp(up) {
      onDone(up.clientX - x0, up.clientY - y0)
      window.removeEventListener('mouseup', onMouseUp)
    }
    window.addEventListener('mouseup', onMouseUp)
  }
}

export default function WidgetCard({
  title, children, dragHandleProps, editMode, widgetId,
  onToggleHide, onSetWidth, onSetHeight,
  hidden, isLarge, currentHeight,
}) {
  const heightPx  = HEIGHT_PX[currentHeight] ?? 200
  const heightIdx = HEIGHTS.indexOf(currentHeight ?? 'small')

  const widthMouseDown  = edgeDragHandler((dx) => {
    if (dx >  25 && !isLarge)  onSetWidth(widgetId, 'large')
    if (dx < -25 &&  isLarge)  onSetWidth(widgetId, 'small')
  })

  const heightMouseDown = edgeDragHandler((_, dy) => {
    if (dy >  40 && heightIdx < 2)  onSetHeight(widgetId, HEIGHTS[heightIdx + 1])
    if (dy < -40 && heightIdx > 0)  onSetHeight(widgetId, HEIGHTS[heightIdx - 1])
  })

  return (
    <div className={`bg-white/[0.055] border border-white/[0.09] rounded-xl flex flex-col relative backdrop-blur-sm ${hidden ? 'opacity-50' : ''}`}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
        <div className="flex items-center gap-2">
          {editMode && dragHandleProps && (
            <button
              {...dragHandleProps}
              className="text-white/30 hover:text-white/60 cursor-grab active:cursor-grabbing transition-colors touch-none"
              title="Drag to reorder"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="9"  cy="5"  r="1.5"/>
                <circle cx="15" cy="5"  r="1.5"/>
                <circle cx="9"  cy="12" r="1.5"/>
                <circle cx="15" cy="12" r="1.5"/>
                <circle cx="9"  cy="19" r="1.5"/>
                <circle cx="15" cy="19" r="1.5"/>
              </svg>
            </button>
          )}
          <h3 className="text-sm font-semibold text-white">{title}</h3>
        </div>

        {editMode && (
          <button
            onClick={() => onToggleHide(widgetId)}
            className={`text-xs px-2 py-1 rounded-md transition-colors font-medium ${
              hidden
                ? 'bg-brand/10 text-brand border border-brand/20 hover:bg-brand/20'
                : 'bg-white/[0.07] text-white/50 border border-white/[0.10] hover:text-white hover:bg-white/[0.12]'
            }`}
          >
            {hidden ? 'Show' : 'Hide'}
          </button>
        )}
      </div>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 p-4 overflow-auto" style={{ minHeight: `${heightPx}px` }}>
        {children}
      </div>

      {/* ── Right edge — drag ←→ to change width ───────────────────────────── */}
      {editMode && (
        <div
          onMouseDown={widthMouseDown}
          className="absolute right-0 top-0 bottom-0 w-3 flex items-center justify-center cursor-ew-resize z-10 group rounded-r-xl"
          title={isLarge ? 'Drag left → half width' : 'Drag right → full width'}
        >
          <div className="h-10 w-1 rounded-full bg-white/20 group-hover:bg-white/40 transition-colors" />
        </div>
      )}

      {/* ── Bottom edge — drag ↑↓ to change height ─────────────────────────── */}
      {editMode && (
        <div
          onMouseDown={heightMouseDown}
          className="absolute bottom-0 left-0 right-0 h-3 flex items-center justify-center cursor-ns-resize z-10 group rounded-b-xl"
          title={`Height: ${currentHeight ?? 'small'} — drag down ↓ taller, drag up ↑ shorter`}
        >
          <div className="w-10 h-1 rounded-full bg-white/20 group-hover:bg-white/40 transition-colors" />
        </div>
      )}
    </div>
  )
}
