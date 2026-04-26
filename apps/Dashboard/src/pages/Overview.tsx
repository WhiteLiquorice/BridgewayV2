import WidgetCanvas from '../widgets/WidgetCanvas'
import DayTimeline from '../components/DayTimeline'

export default function Overview() {
  return (
    <div>
      <div className="px-6 pt-6">
        <DayTimeline />
      </div>
      <WidgetCanvas />
    </div>
  )
}
