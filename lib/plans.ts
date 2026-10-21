export const PLANS = {
  outgoing_only: {
    id: "outgoing_only",
    name: "Outgoing Only",
    ram: "256 MB",
    cpu: "0.25 vCPU",
    disk: "1 GB",
    price: 50,
    features: ["Python runtime", "Package install", "API calls", "No subdomain"],
    badge: "Starter",
  },
  full_access: {
    id: "full_access",
    name: "Full Access",
    ram: "512 MB",
    cpu: "0.5 vCPU",
    disk: "2 GB",
    price: 100,
    features: ["Python runtime", "Package install", "API calls", "1 subdomain", "Incoming access"],
    badge: "Pro",
  },
} as const;

export type PlanId = keyof typeof PLANS;
