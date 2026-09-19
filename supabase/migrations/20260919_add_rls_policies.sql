-- Migration : Activer RLS et créer les politiques de sécurité
-- pour les tables utilisées par le bail TAL coopérative
--
-- IMPORTANT : Cette migration doit être revue et adaptée selon
-- la structure d'authentification de votre application.
-- Les politiques ci-dessous utilisent auth.uid() de Supabase Auth.

-- =============================================================
-- 1. Activer RLS sur les tables concernées
-- =============================================================

ALTER TABLE core.leases ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.lease_tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.bail_generation_logs ENABLE ROW LEVEL SECURITY;

-- =============================================================
-- 2. Politiques pour core.organizations
--    Les organisations sont visibles par les utilisateurs de la même org
-- =============================================================

CREATE POLICY "organizations_select_by_member"
  ON core.organizations
  FOR SELECT
  USING (
    id IN (
      SELECT organization_id FROM core.user_organizations
      WHERE user_id = auth.uid()
    )
  );

-- =============================================================
-- 3. Politiques pour core.leases
--    Lecture/écriture limitées à l'organisation de l'utilisateur
-- =============================================================

CREATE POLICY "leases_select_by_org"
  ON core.leases
  FOR SELECT
  USING (
    unit_id IN (
      SELECT u.id FROM core.units u
      JOIN core.buildings b ON u.building_id = b.id
      WHERE b.organization_id IN (
        SELECT organization_id FROM core.user_organizations
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "leases_update_by_org"
  ON core.leases
  FOR UPDATE
  USING (
    unit_id IN (
      SELECT u.id FROM core.units u
      JOIN core.buildings b ON u.building_id = b.id
      WHERE b.organization_id IN (
        SELECT organization_id FROM core.user_organizations
        WHERE user_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    unit_id IN (
      SELECT u.id FROM core.units u
      JOIN core.buildings b ON u.building_id = b.id
      WHERE b.organization_id IN (
        SELECT organization_id FROM core.user_organizations
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "leases_insert_by_org"
  ON core.leases
  FOR INSERT
  WITH CHECK (
    unit_id IN (
      SELECT u.id FROM core.units u
      JOIN core.buildings b ON u.building_id = b.id
      WHERE b.organization_id IN (
        SELECT organization_id FROM core.user_organizations
        WHERE user_id = auth.uid()
      )
    )
  );

-- =============================================================
-- 4. Politiques pour core.units
-- =============================================================

CREATE POLICY "units_select_by_org"
  ON core.units
  FOR SELECT
  USING (
    building_id IN (
      SELECT id FROM core.buildings
      WHERE organization_id IN (
        SELECT organization_id FROM core.user_organizations
        WHERE user_id = auth.uid()
      )
    )
  );

-- =============================================================
-- 5. Politiques pour core.buildings
-- =============================================================

CREATE POLICY "buildings_select_by_org"
  ON core.buildings
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM core.user_organizations
      WHERE user_id = auth.uid()
    )
  );

-- =============================================================
-- 6. Politiques pour core.tenants
-- =============================================================

CREATE POLICY "tenants_select_by_org"
  ON core.tenants
  FOR SELECT
  USING (
    id IN (
      SELECT lt.tenant_id FROM core.lease_tenants lt
      JOIN core.leases l ON lt.lease_id = l.id
      JOIN core.units u ON l.unit_id = u.id
      JOIN core.buildings b ON u.building_id = b.id
      WHERE b.organization_id IN (
        SELECT organization_id FROM core.user_organizations
        WHERE user_id = auth.uid()
      )
    )
  );

-- =============================================================
-- 7. Politiques pour core.bail_generation_logs
-- =============================================================

CREATE POLICY "bail_logs_select_by_org"
  ON core.bail_generation_logs
  FOR SELECT
  USING (
    lease_id IN (
      SELECT l.id FROM core.leases l
      JOIN core.units u ON l.unit_id = u.id
      JOIN core.buildings b ON u.building_id = b.id
      WHERE b.organization_id IN (
        SELECT organization_id FROM core.user_organizations
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "bail_logs_insert_by_org"
  ON core.bail_generation_logs
  FOR INSERT
  WITH CHECK (
    lease_id IN (
      SELECT l.id FROM core.leases l
      JOIN core.units u ON l.unit_id = u.id
      JOIN core.buildings b ON u.building_id = b.id
      WHERE b.organization_id IN (
        SELECT organization_id FROM core.user_organizations
        WHERE user_id = auth.uid()
      )
    )
  );
