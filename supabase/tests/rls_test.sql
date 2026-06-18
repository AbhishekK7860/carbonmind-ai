BEGIN;
select plan(4);

-- Test 1: Anonymous users cannot read private user data
select is_empty(
  $$ select * from auth.users $$,
  'Anonymous users should not have access to auth schema directly'
);

-- Test 2: RLS blocks inserts without auth
set local role anon;
select throws_ok(
  $$ insert into public.carbon_profiles (user_id, carbon_identity) values ('00000000-0000-0000-0000-000000000000', 'Hacker') $$,
  '42501',
  'new row violates row-level security policy for table "carbon_profiles"',
  'Anon cannot insert into profiles'
);

-- Test 3: Public emission factors are readable by anon
select results_eq(
  $$ select count(*) > 0 from public.emission_factors $$,
  $$ values (true) $$,
  'Anon should be able to read emission_factors (public data)'
);

-- Test 4: Conversion constants are readable by anon
select results_eq(
  $$ select count(*) > 0 from public.conversion_constants $$,
  $$ values (true) $$,
  'Anon should be able to read conversion_constants (public data)'
);

select * from finish();
ROLLBACK;
