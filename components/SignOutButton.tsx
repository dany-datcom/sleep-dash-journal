import { logout } from '@/lib/actions';


export default async function SignOutButton() {
  return (
    <form action={await logout}>
      <button type="submit">Sign Out</button>
    </form>
  );
}