import { z } from 'zod';

// Channel schema for TV channels from M3U playlist
export const channelSchema = z.object({
  id: z.number(),
  name: z.string(),
  url: z.string().url(),
  logo: z.string().url().nullable(),
  group_title: z.string().nullable(),
  tvg_id: z.string().nullable(),
  tvg_name: z.string().nullable(),
  tvg_logo: z.string().url().nullable(),
  stream_format: z.enum(['m3u8', 'mpd', 'other']),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Channel = z.infer<typeof channelSchema>;

// Input schema for creating channels
export const createChannelInputSchema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
  logo: z.string().url().nullable(),
  group_title: z.string().nullable(),
  tvg_id: z.string().nullable(),
  tvg_name: z.string().nullable(),
  tvg_logo: z.string().url().nullable(),
  stream_format: z.enum(['m3u8', 'mpd', 'other']),
  is_active: z.boolean().default(true)
});

export type CreateChannelInput = z.infer<typeof createChannelInputSchema>;

// Input schema for updating channels
export const updateChannelInputSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  url: z.string().url().optional(),
  logo: z.string().url().nullable().optional(),
  group_title: z.string().nullable().optional(),
  tvg_id: z.string().nullable().optional(),
  tvg_name: z.string().nullable().optional(),
  tvg_logo: z.string().url().nullable().optional(),
  stream_format: z.enum(['m3u8', 'mpd', 'other']).optional(),
  is_active: z.boolean().optional()
});

export type UpdateChannelInput = z.infer<typeof updateChannelInputSchema>;

// EPG (Electronic Program Guide) schema
export const epgProgramSchema = z.object({
  id: z.number(),
  channel_id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  start_time: z.coerce.date(),
  end_time: z.coerce.date(),
  category: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type EpgProgram = z.infer<typeof epgProgramSchema>;

// Input schema for creating EPG programs
export const createEpgProgramInputSchema = z.object({
  channel_id: z.number(),
  title: z.string().min(1),
  description: z.string().nullable(),
  start_time: z.coerce.date(),
  end_time: z.coerce.date(),
  category: z.string().nullable()
});

export type CreateEpgProgramInput = z.infer<typeof createEpgProgramInputSchema>;

// M3U playlist processing schema
export const m3uPlaylistSchema = z.object({
  url: z.string().url(),
  last_updated: z.coerce.date(),
  total_channels: z.number().int().nonnegative()
});

export type M3uPlaylist = z.infer<typeof m3uPlaylistSchema>;

// Channel with EPG data combined
export const channelWithEpgSchema = z.object({
  channel: channelSchema,
  current_program: epgProgramSchema.nullable(),
  next_program: epgProgramSchema.nullable()
});

export type ChannelWithEpg = z.infer<typeof channelWithEpgSchema>;

// Input schema for fetching channels with filters
export const getChannelsInputSchema = z.object({
  group_title: z.string().optional(),
  is_active: z.boolean().optional(),
  search: z.string().optional(),
  limit: z.number().int().positive().default(50),
  offset: z.number().int().nonnegative().default(0)
});

export type GetChannelsInput = z.infer<typeof getChannelsInputSchema>;

// Input schema for getting EPG data
export const getEpgInputSchema = z.object({
  channel_id: z.number().optional(),
  start_date: z.coerce.date().optional(),
  end_date: z.coerce.date().optional()
});

export type GetEpgInput = z.infer<typeof getEpgInputSchema>;