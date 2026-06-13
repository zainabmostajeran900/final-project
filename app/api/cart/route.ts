
interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number; // این پارامتر در POST استفاده شده ولی مقداردهی نشده، احتمالا باید quantity اصلی محصول باشد
  images: string[]; // فرض بر این است که images آرایه ای از string ها است
  description?: string; // آپشنال
  brand?: string;     // آپشنال
  cartQuantity: number; // تعداد در سبد خرید
}

// تعریف تایپ برای یک کاربر در دیتابیس
interface UserCartData {
  userId: string;
  cartItems: CartItem[];
}

// تعریف تایپ برای کل دیتابیس
interface CartDatabase {
  users: UserCartData[];
}

//-----------------------------------------------------------------------------
// فایل route.ts با تایپ‌های اصلاح شده
//-----------------------------------------------------------------------------
import { NextResponse } from "next/server";
import fsPromises from "fs/promises";
import path from "path";

const cartDbPath = path.join(process.cwd(), "data", "cartDb.json");

// تابع readCartDb با تایپ بازگشتی مشخص
async function readCartDb(): Promise<CartDatabase> {
  try {
    const data = await fsPromises.readFile(cartDbPath, "utf-8");
    // اگر فایل خالی بود یا JSON نامعتبر داشت، به صورت ایمن parse کنید
    if (!data.trim()) {
      return { users: [] };
    }
    const parsedData: CartDatabase = JSON.parse(data);
    // اطمینان از اینکه ساختار کلی درست است
    if (!parsedData.users) {
      return { users: [] };
    }
    return parsedData;
  } catch (error) {
    console.error("Error reading cartDb.json:", error);
    // در صورت بروز خطا، یک دیتابیس خالی برگردانید
    return { users: [] };
  }
}

// تابع writeCartDb با تایپ پارامتر مشخص
async function writeCartDb(data: CartDatabase): Promise<void> {
  try {
    await fsPromises.writeFile(cartDbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing cartDb.json:", error);
    // می توانید خطا را throw کنید تا اپلیکیشن از آن مطلع شود
    // throw error;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ message: "Missing userId" }, { status: 400 });
  }

  const dbData = await readCartDb();
  // حالا dbData.users تایپ CartDatabase را دارد و المنت‌های آن UserCartData هستند
  const user = dbData.users.find((u) => u.userId === userId);

  if (!user) {
    // اگر کاربر پیدا نشد، سبد خرید خالی را برگردانید
    return NextResponse.json([], { status: 200 });
  }

  return NextResponse.json(user.cartItems, { status: 200 });
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ message: "Missing userId" }, { status: 400 });
  }

  // نوع‌دهی به داده‌های ورودی از request.json
  const newItemData = await request.json();
  // می توانید یک Interface جداگانه برای newItemData تعریف کنید اگر همیشه فرمت مشخصی دارد
  const { _id, name, price, quantity, images, description, brand } = newItemData;

  // بررسی اینکه آیا فیلدهای مورد نیاز وجود دارند
  if (!_id || !name || typeof price !== 'number' || typeof quantity !== 'number' || !images) {
      return NextResponse.json({ message: "Invalid item data provided" }, { status: 400 });
  }

  const itemToAdd: Omit<CartItem, 'cartQuantity'> = { // quantity اصلی محصول را نگه میداریم
    _id,
    name,
    price,
    quantity, // تعداد اصلی محصول
    images,
    description,
    brand,
  };


  const dbData = await readCartDb();
  let user = dbData.users.find((u) => u.userId === userId); // تایپ user اکنون UserCartData است

  if (!user) {
    user = {
      userId,
      cartItems: [],
    };
    dbData.users.push(user);
  }

  const existingItem = user.cartItems.find((item) => item._id === _id);

  if (existingItem) {
    existingItem.cartQuantity += 1; // فقط تعداد در سبد خرید را افزایش میدهیم
  } else {
    // هنگام اضافه کردن به سبد خرید، cartQuantity را 1 قرار میدهیم
    user.cartItems.push({
      ...itemToAdd,
      cartQuantity: 1,
    });
  }

  await writeCartDb(dbData);

  return NextResponse.json(
    { message: "Item added or incremented" },
    { status: 201 }
  );
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ message: "Missing userId" }, { status: 400 });
  }

  const dbData = await readCartDb();
  const userIndex = dbData.users.findIndex((u) => u.userId === userId); // تایپ userIndex number است

  if (userIndex === -1) {
    // اگر کاربر اصلا در دیتابیس نباشد، سبد خرید از قبل خالی است
    return NextResponse.json(
      { message: "User not found or cart already empty" },
      { status: 200 }
    );
  }

  // خالی کردن سبد خرید کاربر
  dbData.users[userIndex].cartItems = [];
  await writeCartDb(dbData);

  return NextResponse.json({ message: "User cart emptied" }, { status: 200 });
}
