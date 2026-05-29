export type Product = {
  id: string; slug: string; name: string; price: number;
  category_id: string | null; collection?: string | null; sku?: string | null;
  materials?: string | null; description?: string | null; stock: number;
  type: string; gem: string; image_url?: string | null; rating: number;
  featured: boolean; active?: boolean;
};
export type Category = { id: string; name: string; sort?: number };
export type CartItem = Product & { qty: number };
