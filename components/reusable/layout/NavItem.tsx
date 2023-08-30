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
    <li>
      <Link href={url}>
        <Button
          variant={isActive ? "default" : "outline"}
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
