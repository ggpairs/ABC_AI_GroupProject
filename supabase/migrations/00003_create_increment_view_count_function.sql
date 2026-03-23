-- 创建增加案例浏览量的函数
CREATE OR REPLACE FUNCTION increment_case_view_count(case_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE cases
  SET view_count = view_count + 1
  WHERE id = case_id;
END;
$$;