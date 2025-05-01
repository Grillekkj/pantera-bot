export interface Match {
  team1: string;
  score1: string;
  team2: string;
  score2: string;
  tournament: string;
}

export interface DateGroup {
  date: string;
  matches: Match[];
}
