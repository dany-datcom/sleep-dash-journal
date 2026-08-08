'use client';
import { logout } from '@/lib/actions';

export default function SignOutButton() { 
  return ( 
  <form action={logout}> 
  <button type="submit" 
  className="rounded-lg px-4 py-2 text-sm font-medium transition hover:bg-background/20"
  > 
  Sign Out 
  </button> 
  </form> 
  ); 
}