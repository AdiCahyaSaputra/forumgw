import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type TProps = {
  userImage: string | null;
  username: string;
};

const Navbar: React.FC<TProps> = ({ userImage, username }) => {
  return (
    <nav className="py-4 border-b">
      <div className="container flex justify-between items-center">
        <h1 className="font-bold text-xl">
          Forum<span className="text-red-600">Gw</span>
        </h1>

        <Avatar>
          <AvatarImage src={userImage ?? ""} />
          <AvatarFallback>{username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
};

export default Navbar;
