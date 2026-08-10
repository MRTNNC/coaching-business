-- Let the coach attach an optional voice note (in addition to text) when
-- leaving feedback on a client's check-in.

alter table public.comments
  add column voice_note_path text;

-- Needed so the app can attach the voice note's storage path after the
-- comment row has been created (the path is keyed by the comment id).
create policy "comments_update_admin"
  on public.comments for update
  using (public.is_admin())
  with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('voice-notes', 'voice-notes', false)
on conflict (id) do nothing;

-- Voice notes are uploaded to paths like "{checkin_id}/{comment_id}.webm".
create policy "voice_notes_storage_insert_admin"
  on storage.objects for insert
  with check (
    bucket_id = 'voice-notes'
    and public.is_admin()
  );

create policy "voice_notes_storage_select_own_or_admin"
  on storage.objects for select
  using (
    bucket_id = 'voice-notes'
    and exists (
      select 1 from public.checkins c
      where c.id::text = (storage.foldername(name))[1]
        and (c.client_id = auth.uid() or public.is_admin())
    )
  );
