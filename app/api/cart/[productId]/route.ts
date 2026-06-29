import { NextResponse } from "next/server";
import fsPromises from "fs/promises";
import path from "path";

const cartDbPath = path.join(process.cwd(), "data", "cartDb.json");

async function readCartDb() {
  try {
    const data = await fsPromises.readFile(cartDbPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading cartDb.json:", error);
    return { users: [] };
  }
}

async function writeCartDb(data: any) {
  try {
    await fsPromises.writeFile(cartDbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing cartDb.json:", error);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  const { productId } = await params;
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ message: "Missing userId" }, { status: 400 });
  }

  const { cartQuantity } = await request.json();
  if (cartQuantity == null) {
    return NextResponse.json(
      { message: "Missing cartQuantity" },
      { status: 400 },
    );
  }

  const dbData = await readCartDb();
  const user = dbData.users.find((u: any) => u.userId === userId);

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const itemIndex = user.cartItems.findIndex(
    (item: any) => item._id === productId,
  );
  if (itemIndex === -1) {
    return NextResponse.json({ message: "Item not in cart" }, { status: 404 });
  }

  if (cartQuantity <= 0) {
    user.cartItems.splice(itemIndex, 1);
  } else {
    user.cartItems[itemIndex].cartQuantity = cartQuantity;
  }

  await writeCartDb(dbData);

  return NextResponse.json({ message: "Quantity updated" }, { status: 200 });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  const { productId } = await params;
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ message: "Missing userId" }, { status: 400 });
  }

  const dbData = await readCartDb();
  const user = dbData.users.find((u: any) => u.userId === userId);

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  user.cartItems = (user.cartItems??[]).filter((item: any) => item._id !== productId);
  await writeCartDb(dbData);

  return NextResponse.json({ message: "Item removed" }, { status: 200 });
}
