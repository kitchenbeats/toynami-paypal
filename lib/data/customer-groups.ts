import { createClient } from "../supabase/server";

export interface CustomerGroup {
  id: string;
  slug: string;
  name: string;
  description?: string;
  is_default: boolean;
  is_active: boolean;
  priority: number;
  can_see_prices: boolean;
  can_purchase: boolean;
  discount_percentage: number;
  tax_exempt: boolean;
  requires_approval: boolean;
}

export interface UserGroup {
  group_id: string;
  approved_at: string | null;
  expires_at: string | null;
  group: CustomerGroup;
}

/**
 * Get all customer groups for the current user
 */
export async function getUserCustomerGroups(): Promise<CustomerGroup[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Return default guest group
    const { data: guestGroup } = await supabase
      .from("customer_groups")
      .select("*")
      .eq("slug", "guest")
      .single();

    return guestGroup ? [guestGroup] : [];
  }

  // Get user's groups
  const { data: userGroups } = await supabase
    .from("user_customer_groups")
    .select(
      `
      group_id,
      approved_at,
      expires_at,
      group:customer_groups(*)
    `
    )
    .eq("user_id", user.id)
    .not("approved_at", "is", null)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);

  if (!userGroups || userGroups.length === 0) {
    // User has no groups, return registered group
    const { data: registeredGroup } = await supabase
      .from("customer_groups")
      .select("*")
      .eq("slug", "registered")
      .single();

    return registeredGroup ? [registeredGroup] : [];
  }

  return userGroups
    .map((ug) => ug.group as CustomerGroup)
    .filter((g) => g && g.is_active)
    .sort((a, b) => b.priority - a.priority);
}

/**
 * Get the highest priority customer group for the current user
 */
export async function getUserPrimaryGroup(): Promise<CustomerGroup | null> {
  const groups = await getUserCustomerGroups();
  return groups[0] || null;
}

/**
 * Check if user can view a specific product
 */
export async function canUserViewProduct(productId: string): Promise<boolean> {
  const supabase = await createClient();

  // First check if product is public
  const { data: product } = await supabase
    .from("products")
    .select("visibility_type")
    .eq("id", productId)
    .single();

  if (!product) return false;
  if (product.visibility_type === "public") return true;
  if (product.visibility_type === "private") return false;

  // Check group-based visibility
  const userGroups = await getUserCustomerGroups();
  const groupIds = userGroups.map((g) => g.id);

  if (groupIds.length === 0) return false;

  const { data: productGroups } = await supabase
    .from("product_customer_groups")
    .select("can_view")
    .eq("product_id", productId)
    .in("group_id", groupIds)
    .eq("can_view", true);

  return productGroups && productGroups.length > 0;
}

/**
 * Check if user can purchase a specific product
 */
export async function canUserPurchaseProduct(
  productId: string
): Promise<boolean> {
  const supabase = await createClient();

  // First check if product allows purchases
  const { data: product } = await supabase
    .from("products")
    .select("allow_purchases, purchasability_type")
    .eq("id", productId)
    .single();

  if (!product || !product.allow_purchases) return false;
  if (product.purchasability_type === "public") return true;
  if (product.purchasability_type === "private") return false;

  // Check group-based purchasability
  const userGroups = await getUserCustomerGroups();

  // Check if any of user's groups can purchase
  const canPurchase = userGroups.some((g) => g.can_purchase);
  if (!canPurchase) return false;

  const groupIds = userGroups.map((g) => g.id);

  const { data: productGroups } = await supabase
    .from("product_customer_groups")
    .select("can_purchase")
    .eq("product_id", productId)
    .in("group_id", groupIds)
    .eq("can_purchase", true);

  return productGroups && productGroups.length > 0;
}

/**
 * Get user's best discount percentage
 */
export async function getUserDiscountPercentage(): Promise<number> {
  const groups = await getUserCustomerGroups();

  if (groups.length === 0) return 0;

  // Return the highest discount from all groups
  return Math.max(...groups.map((g) => g.discount_percentage || 0));
}

/**
 * Check if user can see prices
 */
export async function canUserSeePrices(): Promise<boolean> {
  const groups = await getUserCustomerGroups();

  if (groups.length === 0) return true; // Guest can see prices by default

  // User can see prices if ANY of their groups allow it
  return groups.some((g) => g.can_see_prices);
}

/**
 * Check if user is tax exempt
 */
export async function isUserTaxExempt(): Promise<boolean> {
  const groups = await getUserCustomerGroups();

  // User is tax exempt if ANY of their groups are tax exempt
  return groups.some((g) => g.tax_exempt);
}

/**
 * Add user to a customer group
 */
export async function addUserToGroup(
  userId: string,
  groupSlug: string
): Promise<boolean> {
  const supabase = await createClient();

  // Get the group
  const { data: group } = await supabase
    .from("customer_groups")
    .select("id, requires_approval")
    .eq("slug", groupSlug)
    .single();

  if (!group) return false;

  // Add user to group
  const { error } = await supabase.from("user_customer_groups").insert({
    user_id: userId,
    group_id: group.id,
    approved_at: group.requires_approval ? null : new Date().toISOString(),
  });

  return !error;
}

/**
 * Remove user from a customer group
 */
export async function removeUserFromGroup(
  userId: string,
  groupId: string
): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("user_customer_groups")
    .delete()
    .eq("user_id", userId)
    .eq("group_id", groupId);

  return !error;
}
