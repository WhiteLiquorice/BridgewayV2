import WidgetCanvas from '../widgets/WidgetCanvas'
import DayTimeline from '../components/DayTimeline'
import { useAuth } from '../context/AuthContext'

export default function Overview() {
  const { org } = useAuth()

  return (
    <div>
      <div className="px-6 pt-6">
        <DayTimeline />
      </div>
      {org?.subscriptionTier !== 'booking-only' && <WidgetCanvas />}
    </div>
  )
}
