// "use client"
// import { useState } from "react";
// import {CategoryNav} from "@/components/shop/CategoryNav"
// import {
//   Pizza ,
//   Drumstick ,
//   Salad ,
// } from "lucide-react";

//  const ToggleCategory: React.FC = () => {
//     const [isCollapsed, setIsCollapsed] = useState(false);

//     return(
//         <CategoryNav
//         isCollapsed={isCollapsed}
//         links={[

//           {
//             icon: Pizza ,
//             title: "پیتزا",
//             variant: "ghost",
//             href:"/shop/category/pytza",
//           },
//           {
//             icon: Drumstick ,
//             title: "فرنگی",
//             variant: "ghost",
//             href:"/shop/category/frngy"
//           },

//           {
//             icon:Salad  ,
//             title: "پیش غذا",
//             variant: "ghost",
//             href:"/shop/category/pysh-ghtha"
//           },

//         ]}
//       />
// )}
// export default ToggleCategory;
"use client"
import { CategoryNav } from "@/components/shop/CategoryNav"
import {
  Pizza,
  Drumstick,
  Salad,
} from "lucide-react";

const ToggleCategory: React.FC = () => {
  // setIsCollapsed و isCollapsed حذف شده‌اند چون استفاده‌ای نداشتند
  const isCollapsed = false; // یا مقدار دلخواه دیگر

  return (
    <CategoryNav
      isCollapsed={isCollapsed}
      links={[
        {
          icon: Pizza,
          title: "پیتزا",
          variant: "ghost",
          href: "/shop/category/pytza",
        },
        {
          icon: Drumstick,
          title: "فرنگی",
          variant: "ghost",
          href: "/shop/category/frngy"
        },
        {
          icon: Salad,
          title: "پیش غذا",
          variant: "ghost",
          href: "/shop/category/pysh-ghtha"
        },
      ]}
    />
  )
}
export default ToggleCategory;
