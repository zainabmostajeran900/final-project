import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="pt-navbar py-5 mx-auto text-center container">
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/">
        <p className="text-blue-600">Return Home</p>
      </Link>
      <Image
        className="mx-auto block" 
        src={`/404_page-not-found-1024x576.webp`}
        width={500}
        height={300}
        alt={`notfound`}
      />
    </div>
  );
}
