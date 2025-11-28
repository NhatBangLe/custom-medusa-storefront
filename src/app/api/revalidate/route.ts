import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

type RevalidateTag =
  | "products"
  | "collections"
  | "categories"
  | "orderStatus"
  | "orderFulfillment"
  | "payment"
  | "shippingOptions"

export async function POST(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const tags = searchParams.get("tags") as string
  if (!tags) {
    return NextResponse.json({ error: "No tags provided" }, { status: 400 })
  }

  const tagsArray = tags.split(",")
  await Promise.all(
    tagsArray.map(async (tag) => {
      switch (tag as RevalidateTag) {
        case "products": {
          revalidatePath("/[countryCode]/(main)/store", "page")
          revalidatePath("/[countryCode]/(main)/products/[handle]", "page")
          break
        }
        case "collections": {
          revalidatePath("/[countryCode]/(main)/store", "page")
          revalidatePath("/[countryCode]/(main)/collections/[handle]", "page")
          break
        }
        case "categories": {
          revalidatePath("/[countryCode]/(main)/store", "page")
          revalidatePath(
            "/[countryCode]/(main)/categories/[...category]",
            "page"
          )
          break
        }
        case "orderStatus": {
          const {
            order_id,
          }: {
            order_id: string
          } = await req.json()
          console.log("orderStatus: ", order_id)
          revalidatePath(
            `/[countryCode]/account/orders/details/${order_id}`,
            "page"
          )
          break
        }
        case "orderFulfillment": {
          const {
            order_id,
          }: {
            order_id: string
            fulfillment_id: string // The ID of the fulfillment
            no_notification: boolean //  Whether to notify the customer
          } = await req.json()
          revalidatePath(
            `/[countryCode]/account/orders/details/${order_id}`,
            "page"
          )
          break
        }
        case "payment": {
          const {
            order_id,
          }: {
            order_id: string
          } = await req.json()
          revalidatePath(
            `/[countryCode]/account/orders/details/${order_id}`,
            "page"
          )
          break
        }
        case "shippingOptions": {
          revalidatePath(`/[countryCode]/(checkout)/checkout`, "page")
          break
        }
      }
    })
  )

  return NextResponse.json({ message: "Revalidated" }, { status: 200 })
}
