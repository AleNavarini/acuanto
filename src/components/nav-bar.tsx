"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, PlusCircle, User } from "lucide-react";
import { signOut } from "next-auth/react";
import { SessionType } from "@/types/session";

export function NavBar() {
  const { data: session, status } = useSession();

  const isLoading = status === "loading";
  const isAuthenticated = !!session?.user;

  return (
    <header className="border-b ">
      <div className="container flex p-4 mx-auto w-full justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-xl font-bold hover:scale-105 transition-all transition-300"
          >
            A Quanto?
          </Link>
        </div>
        <div>
          {isLoading ? (
            <Button variant="ghost" size="sm" disabled>
              Loading...
            </Button>
          ) : isAuthenticated ? (
            <div className="flex gap-2">
              <Button size="sm" asChild>
                <Link href="/sale">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Agregar venta
                </Link>
              </Button>
              <UserMenu session={session} />
            </div>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/signin">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function UserMenu({ session }: { session: SessionType }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer hover:scale-105">
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={session?.user?.image || ""}
              alt={session?.user?.name || ""}
            />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex flex-col space-y-1 p-2">
          <p className="text-sm font-medium leading-none">
            {session?.user?.name}
          </p>
          <p className="text-xs leading-none text-muted-foreground">
            {session?.user?.email}
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
