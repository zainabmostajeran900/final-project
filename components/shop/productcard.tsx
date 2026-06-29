import Image from "next/image";
import Link from "next/link";
import {IProducts} from "@/types/products";

export const ProductCard: React.FC<IProducts> = ({
  images,
  name,
  price,
  _id,
}) => {
  return (
    <Link href={`/shop/product/${_id}`}>
      <div className="flex w-full p-2 gap-x-7 sm:gap-x-2 items-center justify-between text-textColor shadow-lg hover:text-gray-800 rounded-lg bg-base hover:bg-white hover:shadow-sm hover:shadow-slate-400 hover:border-slate-700  h-48">
        <Image
          className="grid grid-cols-4 items-center justify-center rounded-lg  sm:object-cover object-contain"
          src={`https://backend-final-rho.vercel.app/images/products/images/${images[0]}`}
          width={130}
          height={130}
          alt="Picture of the author"
        />

        <div className="grid grid-cols-8 items-center justify-center">
          <div className="flex flex-col items-start justify-center gap-y-4 max-w-[300px] text-nowrap">
            <p className="font-semibold text-sm">{name}</p>
            <p>{price.toLocaleString("ar-EG")} تومان</p>
            <button className="hidden sm:block bg-textColor text-gray-800 rounded-lg px-2 py-1 hover:bg-textColor text-sm text-nowrap">
              افزودن به سبد خرید
            </button>
          </div>
        </div>
        </div>
    </Link>
  );
};
