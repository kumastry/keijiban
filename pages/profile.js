import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Image from "next/image";

export default function profile() {
  const { data: session, status } = useSession();
  return (
    <main>
      {status === "authenticated" ? (
        <div>
          <p>{session.user.name}</p>
          <p>{session.user.email}</p>
          <Image
          src = {session.user.image}
          alt="Picture of the author"
          width={50}
          height={50}
          />
        <Box>
          <Button variant="contained" color="error" onClick={()  => signOut({ callbackUrl: '/' })}>
            サインアウト
          </Button>
        </Box>
        </div>
      ) : (
        <p>nasi</p>
      )}
    </main>
  );
}
