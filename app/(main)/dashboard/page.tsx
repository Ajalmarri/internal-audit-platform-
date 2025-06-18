import AssignmentsCard from "./_components/assignments-card"
import CalendarCard from "./_components/calendar-card"
import InsightHubCard from "./_components/insight-hub-card"
import TeamAvailabilityCard from "./_components/team-availability-card"

export default function DashboardPage() {
  // In a real app, the name would come from user data
  const userName = "Muhammad"
  const greeting = `Good morning, ${userName}!` // This could be dynamic based on time of day

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold text-foreground">{greeting}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (takes 2/3 on lg screens) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <AssignmentsCard />
          <InsightHubCard />
        </div>

        {/* Right Column (takes 1/3 on lg screens) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <CalendarCard />
          <TeamAvailabilityCard />
        </div>
      </div>
    </div>
  )
}
