export interface StrategicGoal {
  id: string
  title: string
  description: string
}

export const mockStrategicGoals: StrategicGoal[] = [
  {
    id: "sg001",
    title: "Enhance Data Security Posture",
    description: "Improve security controls to reduce data breach risk by 30% in 2025.",
  },
  {
    id: "sg002",
    title: "Improve Financial Reporting Accuracy",
    description: "Reduce month-end closing errors by 50%.",
  },
  {
    id: "sg003",
    title: "Optimize Operational Efficiency",
    description: "Automate key business processes to improve overall productivity.",
  },
]
