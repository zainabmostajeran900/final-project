"use client";

import Link from "next/link";
import React from "react";
import Image from "next/image";

interface SubcategoryCardProps {
  subcategoryId: string;
  subcategoryName: string;
  subcategorySlugname: string;
  categorySlugname: string;
  categoryIcon: string;
}

const SubcategoryCard: React.FC<SubcategoryCardProps> = ({
  subcategoryName,
  subcategorySlugname,
  categorySlugname,
  categoryIcon,
}) => {
  return (
    <Link
      className="rounded-md block bg-base text-textColor shadow-lg hover:bg-textColor hover:text-base "
      href={`/shop/category/${categorySlugname}/${subcategorySlugname}`}
    >
      <div className=" border flex flex-col items-center gap-y-2">
        <Image
          className="object-cover"
          src={`http://localhost:8000/images/categories/icons/${categoryIcon}`}
          width={200}
          height={200}
          alt="Picture of the author"
        />
        <h3 className="text-xl font-semibold mb-4">{subcategoryName}</h3>
      </div>
    </Link>
  );
};

export default SubcategoryCard;
