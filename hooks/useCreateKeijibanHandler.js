import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";

//axiosによる通信も共通化した方が良い
//try catchする必要がある
const useCreateKeijibanHandler = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const postKeijiban = async (data) => {
    //console.log(data);
    const { title, category, description } = data;
    //console.log(title);
    //console.log(category);
    //console.log(description);

    setIsSnackbarOpen(!isSnackbarOpen);
    await axios.post("api/boards", {
      title,
      category,
      description,
      userId: session.user.id,
    });

    router.push("..");
  };

  return { postKeijiban, isSnackbarOpen };
};

export default useCreateKeijibanHandler;
