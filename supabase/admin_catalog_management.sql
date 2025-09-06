-- Admin functions for managing the product catalog
-- These functions should only be run by database administrators

-- Function to add a new product to the catalog
CREATE OR REPLACE FUNCTION add_product_to_catalog(
  product_name TEXT,
  product_category TEXT DEFAULT NULL,
  product_unit TEXT DEFAULT 'pcs',
  product_description TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_product_id UUID;
BEGIN
  -- Insert new product into catalog
  INSERT INTO product_catalog (name, category, default_unit, description)
  VALUES (product_name, product_category, product_unit, product_description)
  RETURNING id INTO new_product_id;

  RETURN new_product_id;
END;
$$;

-- Function to update a product in the catalog
CREATE OR REPLACE FUNCTION update_product_in_catalog(
  product_id UUID,
  product_name TEXT DEFAULT NULL,
  product_category TEXT DEFAULT NULL,
  product_unit TEXT DEFAULT NULL,
  product_description TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update product in catalog
  UPDATE product_catalog
  SET
    name = COALESCE(product_name, name),
    category = COALESCE(product_category, category),
    default_unit = COALESCE(product_unit, default_unit),
    description = COALESCE(product_description, description)
  WHERE id = product_id;

  RETURN FOUND;
END;
$$;

-- Function to remove a product from the catalog
CREATE OR REPLACE FUNCTION remove_product_from_catalog(product_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Remove product from catalog
  DELETE FROM product_catalog WHERE id = product_id;

  RETURN FOUND;
END;
$$;

-- Function to get catalog statistics
CREATE OR REPLACE FUNCTION get_catalog_stats()
RETURNS TABLE(
  total_products BIGINT,
  categories_count BIGINT,
  most_used_category TEXT,
  recently_added_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) as total_products,
    COUNT(DISTINCT category) as categories_count,
    (SELECT category FROM product_catalog
     WHERE category IS NOT NULL
     GROUP BY category
     ORDER BY COUNT(*) DESC
     LIMIT 1) as most_used_category,
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as recently_added_count
  FROM product_catalog;
END;
$$;

-- Grant execute permissions to authenticated users for read-only functions
GRANT EXECUTE ON FUNCTION get_catalog_stats() TO authenticated;

-- Create a view for catalog usage statistics (how many users have products from each catalog item)
CREATE VIEW catalog_usage_stats AS
SELECT
  pc.id,
  pc.name,
  pc.category,
  COUNT(p.id) as usage_count,
  COUNT(DISTINCT p.user_id) as unique_users
FROM product_catalog pc
LEFT JOIN products p ON p.catalog_id = pc.id
GROUP BY pc.id, pc.name, pc.category
ORDER BY usage_count DESC;

-- Grant select on the view to authenticated users
GRANT SELECT ON catalog_usage_stats TO authenticated;

-- Create an index for better performance on catalog searches
CREATE INDEX IF NOT EXISTS idx_product_catalog_search
ON product_catalog USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Create an index for category filtering
CREATE INDEX IF NOT EXISTS idx_product_catalog_category
ON product_catalog(category) WHERE category IS NOT NULL;
