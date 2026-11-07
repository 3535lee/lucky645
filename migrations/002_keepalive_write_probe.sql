-- Separate probe table: never modify actual lottery data for keep-alive.
CREATE TABLE public.lucky645_keepalive_probe (
  id uuid PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.lucky645_keepalive_probe ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.lucky645_keepalive_probe FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, DELETE ON TABLE public.lucky645_keepalive_probe TO service_role;

-- A single RPC call runs both operations in one transaction: a failed delete
-- rolls back the insert. Each invocation deletes only its own row.
CREATE FUNCTION public.lucky645_keepalive_write()
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  probe_id uuid := pg_catalog.gen_random_uuid();
BEGIN
  INSERT INTO public.lucky645_keepalive_probe (id) VALUES (probe_id);
  DELETE FROM public.lucky645_keepalive_probe WHERE id = probe_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Failed to delete keepalive probe';
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.lucky645_keepalive_write() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.lucky645_keepalive_write() TO service_role;
