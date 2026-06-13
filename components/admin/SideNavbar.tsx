"use client"
import { useState } from "react";
import { useWindowWidth } from "@react-hook/window-size";
import {Nav} from "@/components/ui/Nav"
import { Button } from "@/components/ui/button";

import {
  ShoppingCart,
  ChevronLeft,
  ChartCandlestick,
  ScanBarcode
} from "lucide-react";
 const SideNavbar: React.FC = () => {

  const [isCollapsed, setIsCollapsed] = useState(false);

  const onlyWidth = useWindowWidth();
  const mobileWidth = onlyWidth < 768;

  function toggleSidebar() {
    setIsCollapsed(!isCollapsed);
  }
    return(
      <div className="relative min-w-[80px] border-l sm:px-7  pb-10 pt-24">
      {!mobileWidth && (
        <div className="absolute left-[-20px] top-7">
          <Button
            onClick={toggleSidebar}
            variant="secondary"
            className="rounded-full p-2"
          >
            <ChevronLeft />
          </Button>
        </div>
      )}
        <Nav
        isCollapsed={isCollapsed}
        links={[
          {
            title: "سفارش ها",
            icon: ShoppingCart,
            href:"/admin",
            variant: "default",
          },
          {
            title: "کالاها",
            icon:  ScanBarcode,
            variant: "ghost",
            href:"/admin/products"
          },
          {
            title: "موجودی و قیمت ها ",
            icon:ChartCandlestick,
            variant: "ghost",
            href:"/admin/prices"
          },

        ]}
      />
      </div>
)}
export default SideNavbar;
