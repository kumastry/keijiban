import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

//axiosによる通信も共通化した方が良い
//try catchする必要がある
const useCreateKeijibanHandler = ({ session }) => {
  const router = useRouter();
  //const { data: session } = useSession();
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const postKeijiban = async (data) => {
    //console.log(data);
    const { title, category, description } = data;
    //console.log(title);
    //console.log(category);
    //console.log(description);

    try {
      //awaitする必要があるのか？
      axios.post("api/boards", {
        title,
        category,
        description,
        userId: session.user.id,
      });
      setIsSnackbarOpen(!isSnackbarOpen);
      router.push("..");
    } catch (e) {
      router.push("../errors");
    }
  };

  return { postKeijiban, isSnackbarOpen };
};

export default useCreateKeijibanHandler;
