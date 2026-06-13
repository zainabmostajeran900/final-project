"use client";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const NavbarAdmin: React.FC = () => {
  const [hiddenMenu, sethiddenMenu] = useState(true);
  // const dispatch = useDispatch();
  const router = useRouter();

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, router]);

  return (
    <nav className="bg-base px-6 text-textColor">
      <div className="container mx-auto flex  justify-between max-w-[1400px]">
        <div className="flex flex-col items-center">
          <Image
            src="/logo_prev_ui.png"
            width={80}
            height={18}
            alt="Picture of the author"
          />
        </div>
        <div className="flex flex-col items-center justify-center">
          <h1 className="font-bold sm:text-3xl">پنل مدیریت پیتزا نوشا</h1>
        </div>
        <div className="flex items-center justify-center ">
          <div className="hidden sm:flex gap-x-2 md:flex md:gap-x-8 items-center justify-center">
            <div className="flex items-center justify-center gap-x-1">
              <Link className="hover:underline" href="/">
                خانه
              </Link>
              <FaHome />
            </div>
            {/* <div
              onClick={handleLogout}
              className="flex items-center justify-start gap-x-1 cursor-pointer hover:underline"
            >
              خروج
              <ImExit />
            </div> */}
          </div>
          <div
            onClick={() => sethiddenMenu(!hiddenMenu)}
            className="block sm:hidden"
          >
            <IoMenu />
          </div>
        </div>
        <div
          className={`bg-second h-full absolute z-50 top-16 left-0 pr-4 w-full text-slate-900 ${
            hiddenMenu ? "hidden" : ""
          }`}
        >
          <div className="flex flex-col  gap-y-4 pl-10 pb-6 pt-5 text-{16px} font-semibold">
            <div className="flex items-center justify-start gap-x-2">
              <Link className="hover:underline" href="/cart">
                خانه
              </Link>
              <FaHome />
            </div>
            {/* <div className="flex items-center justify-start gap-x-2 hover:underline">
              خروج
              <ImExit />
            </div> */}
          </div>
        </div>
      </div>
    </nav>
  );
};
export default NavbarAdmin;
