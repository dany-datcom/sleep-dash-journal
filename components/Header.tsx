import Nav from "./Nav";
import { auth } from '@/auth';

export default async function Header() {
    const session = await auth();
    const loggedIn = session?.user ? true : false;
   return (
       <header className="bg-primary text-background font-bold text-lg">
           <Nav loggedIn={loggedIn} />
    </header>
   );
}