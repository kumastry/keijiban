import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';

export default function profile () {
    const { data: session, status } = useSession();
    return(
        <>  
            {status === "authenticated"?<div>
                <p>{session.user.name}</p>
                <p>{session.user.email}</p>
            <p onClick={signOut}>サインアウト</p></div>:<p>nasi</p>
        }
        </>
    );
}