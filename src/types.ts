export type TBIReport = {
  id?: string;
  sport: string;
  position: string;
  symptoms: string[];
  continuedPlaying: boolean;
  coachKnew: "yes" | "no" | "unsure";
  reasonNotReported?: string[];
  ageGroup: string;
  sex?: string;
  state: string;
  incidentDescription?: string;
  timestamp: Date;
};
