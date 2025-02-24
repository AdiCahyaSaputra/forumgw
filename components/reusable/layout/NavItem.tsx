"use client";

import { Button } from "@/components/ui/button";
import { checkCurrentActiveUrl } from "@/lib/helper/str.helper";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";

type TProps = {
  url: string;
  label: string;
  Icon: LucideIcon;
};

const NavItem: React.FC<TProps> = ({ url, Icon, label }) => {
  const pathname = usePathname();
  const query = useSearchParams();

  const isActive = checkCurrentActiveUrl(pathname, url, query);

  return (
    <li className="cursor-pointer">
      <Link href={url} className="cursor-pointer">
        <Button
          variant={isActive ? "default" : "ghost"}
          className={`flex items-center justify-start space-x-2 w-full ${
            !isActive && "bg-white"
          }`}
        >
          <Icon className="w-5 aspect-square" />
          <span>{label}</span>
        </Button>
      </Link>
    </li>
  );
};

export default NavItem;
