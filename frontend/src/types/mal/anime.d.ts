export interface MalAnimeNode {
  id: number;
  title: string;
  main_picture: MalMainPicture;
  updated_at: Date;
  my_list_status: MalMyListStatus;
  synopsis: string;
  num_episodes: number;
  average_episode_duration: number;
}

export interface MalMainPicture {
  medium: string;
  large: string;
}

export interface MalMyListStatus {
  status: string;
  score: number;
  num_episodes_watched: number;
  is_rewatching: boolean;
  updated_at: Date;
  start_date?: Date;
  finish_date?: Date;
}

export interface MalAnime {
  node: MalAnimeNode;
}
