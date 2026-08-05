export interface SleepEntry {
  entry_id: number;
  user_id: number;
  date: string;
  sleep_time: string;
  wake_time: string;
  sleep_quality: number; // Scale 1 to 10
  notes: string | null;
}

export interface UserProfile {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
}