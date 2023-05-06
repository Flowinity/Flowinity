export interface MalUser {
  anime_statistics: {
    num_days_watched: number;
    mean_score: number;
    num_days: number;
    num_dropped: number;
    num_episodes: number;
    num_items_watched: number;
    num_onhold: number;
    num_plan_to_watch: number;
    num_rewatched: number;
    num_times_rewatched: number;
    num_watching: number;
  };
  id: number;
  image_url: string;
  joined_at: string;
  name: string;
}
