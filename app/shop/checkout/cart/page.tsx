"use client";
import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/Hook";
import {
  fetchCart,
  updateItemQuantity,
  removeItemFromCart,
} from "@/redux/slices/cartSlice";
import { FaTrash } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

const ShoppingCart: React.FC = () => {
  const dispatch = useAppDispatch();
  const { cart, status } = useAppSelector((state) => state.cart);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCart());
    }
  }, [status, dispatch]);

  useEffect(() => {
    console.log(cart);
  }, [cart]);

  const total = cart.reduce((acc, item) => {
    return acc + item.price * item.cartQuantity;
  }, 0);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    dispatch(updateItemQuantity({ productId: id, newQuantity }));
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeItemFromCart(id));
  };

  return (
    <section className="px-4 py-4 lg:px-24">
      <div className="flex flex-col gap-y-6">
        <div className="flex flex-col">
          <div className="flex-grow bg-base rounded-lg p-5 lg:p-7">
            {cart.length === 0 ? (
              <p className="text-textColor text-center">
                سبد خرید شما خالی است.
              </p>
            ) : (
              cart.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col md:flex-row items-center gap-6 md:gap-8 border-b py-4 justify-between"
                >
                  <Image
                    className="p-2 object-cover  md:w-[150px] h-[150px] rounded-lg"
                    src={`https://backend-final-rho.vercel.app/images/products/images/${item.images[0]}`}
                    width={200}
                    height={300}
                    alt={item.name}
                  />

                  <div className="flex-grow text-center md:text-right space-y-3 text-textColor">
                    <p className="font-semibold text-lg text-textColor md:text-2xl">
                      {item.name}
                    </p>
                    <p className="text-lg md:text-textColor">
                      {item.price.toLocaleString("ar-EG")} تومان
                    </p>
                  </div>

                  <div className="flex items-center gap-8 w-full sm:w-auto justify-center">
                    <input
                      type="number"
                      min="1"
                      value={item.cartQuantity}
                      onChange={(e) =>
                        handleQuantityChange(item._id, Number(e.target.value))
                      }
                      className="w-16 md:w-16 border border-gray-300 rounded-md text-center text-sm md:text-base"
                    />
                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      className="text-textColor size-8"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <p className="font-bold text-sm md:text-gray-800">جمع کل :</p>
            <p className="font-bold text-sm md:text-gray-800">
              {total.toLocaleString("ar-EG")} تومان
            </p>
          </div>
          <Link href={isAuthenticated ? "/shop/cart" : "/auth/login"}>
            <button className="rounded-lg px-6 py-2 bg-textColor text-gray-800 font-bold text-sm hover:bg-slate-300">
              نهایی کردن سبد خرید
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ShoppingCart;
