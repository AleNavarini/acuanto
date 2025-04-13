"use client";

import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut, User } from "lucide-react";

export function UserProfile() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <ProfileSkeleton />;
  }

  if (!session?.user) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={session.user.image || ""}
              alt={session.user.name || "User"}
            />
            <AvatarFallback>
              <User className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{session.user.name}</CardTitle>
            <CardDescription>{session.user.email}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="text-sm">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Authentication</span>
            <span className="text-muted-foreground">Google</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          size="sm"
          className="w-full cursor-pointer"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </CardFooter>
    </Card>
  );
}

function ProfileSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
}
