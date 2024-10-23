import AkunForm from "@/components/reusable/akun/AkunForm";

const Akun = async () => {
  return (
    <>
      <h2 className="text-lg font-bold mt-4">Informasi Akun</h2>
      <p className="text-foreground/60">
        Disini bisa mengubah data profil publik bre
      </p>
      <AkunForm />
    </>
  );
};

export default Akun;
