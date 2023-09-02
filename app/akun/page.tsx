import AkunForm from "@/components/reusable/akun/AkunForm";
import { getAuthUser } from "@/lib/helper/auth.helper";
import { cookies } from "next/headers";

const Akun = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  const user = await getAuthUser(token?.value || null);

  return (
    <>
      <h2 className="text-lg font-bold mt-4">Informasi Akun</h2>
      <p className="text-foreground/60">
        Disini lu bisa mengubah data profil publik lu bre
      </p>
      {user && <AkunForm {...user} />}
    </>
  );
};

export default Akun;
