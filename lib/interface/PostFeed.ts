export default interface PostFeed {
  user: {
    username: string;
    name: string;
    image: string | null;
  } | null;
  anonymous: {
    username: string;
  } | null;
  _count: {
    comments: number;
  };
  public_id: string;
  content: string;
  created_at: string;
}
