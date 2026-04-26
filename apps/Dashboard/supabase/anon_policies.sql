-- Add anon read policies for guest booking flow
DO $$
BEGIN
  -- services: anon can read non-archived services
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'services'
      AND policyname = 'Public can read services'
  ) THEN
    EXECUTE $pol$
      CREATE POLICY "Public can read services"
        ON services FOR SELECT TO anon
        USING (is_archived = false)
    $pol$;
  END IF;

  -- slots: anon can read available slots
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'slots'
      AND policyname = 'Public can read available slots'
  ) THEN
    EXECUTE $pol$
      CREATE POLICY "Public can read available slots"
        ON slots FOR SELECT TO anon
        USING (status = 'available')
    $pol$;
  END IF;

  -- orgs: anon can read active orgs (needed for slug lookup)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'orgs'
      AND policyname = 'Public can read orgs'
  ) THEN
    EXECUTE $pol$
      CREATE POLICY "Public can read orgs"
        ON orgs FOR SELECT TO anon
        USING (status = 'active')
    $pol$;
  END IF;
END $$;

SELECT 'Anon policies applied.' AS result;
