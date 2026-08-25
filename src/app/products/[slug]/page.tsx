import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/ProductDetail";
import { ApiError } from "@/lib/api";
import { getProduct } from "@/lib/queries";
import type { ProductDetail as ProductDetailType } from "@/lib/types";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function loadProduct(slug: string): Promise<ProductDetailType> {
  try {
    return await getProduct(slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await loadProduct(slug);

  return <ProductDetail product={product} />;
}
