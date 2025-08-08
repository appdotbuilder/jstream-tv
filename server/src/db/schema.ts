import { serial, text, pgTable, timestamp, boolean, integer, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enum for stream formats
export const streamFormatEnum = pgEnum('stream_format', ['m3u8', 'mpd', 'other']);

// Channels table for storing TV channel information
export const channelsTable = pgTable('channels', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  url: text('url').notNull(),
  logo: text('logo'), // Nullable by default
  group_title: text('group_title'), // Nullable by default
  tvg_id: text('tvg_id'), // Nullable by default
  tvg_name: text('tvg_name'), // Nullable by default
  tvg_logo: text('tvg_logo'), // Nullable by default
  stream_format: streamFormatEnum('stream_format').notNull(),
  is_active: boolean('is_active').default(true).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// EPG programs table for Electronic Program Guide data
export const epgProgramsTable = pgTable('epg_programs', {
  id: serial('id').primaryKey(),
  channel_id: integer('channel_id').references(() => channelsTable.id).notNull(),
  title: text('title').notNull(),
  description: text('description'), // Nullable by default
  start_time: timestamp('start_time').notNull(),
  end_time: timestamp('end_time').notNull(),
  category: text('category'), // Nullable by default
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// M3U playlist metadata table
export const m3uPlaylistsTable = pgTable('m3u_playlists', {
  id: serial('id').primaryKey(),
  url: text('url').notNull().unique(),
  last_updated: timestamp('last_updated').defaultNow().notNull(),
  total_channels: integer('total_channels').default(0).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Define relations between tables
export const channelsRelations = relations(channelsTable, ({ many }) => ({
  epgPrograms: many(epgProgramsTable),
}));

export const epgProgramsRelations = relations(epgProgramsTable, ({ one }) => ({
  channel: one(channelsTable, {
    fields: [epgProgramsTable.channel_id],
    references: [channelsTable.id],
  }),
}));

// TypeScript types for the table schemas
export type Channel = typeof channelsTable.$inferSelect; // For SELECT operations
export type NewChannel = typeof channelsTable.$inferInsert; // For INSERT operations

export type EpgProgram = typeof epgProgramsTable.$inferSelect;
export type NewEpgProgram = typeof epgProgramsTable.$inferInsert;

export type M3uPlaylist = typeof m3uPlaylistsTable.$inferSelect;
export type NewM3uPlaylist = typeof m3uPlaylistsTable.$inferInsert;

// Export all tables and relations for proper query building
export const tables = { 
  channels: channelsTable, 
  epgPrograms: epgProgramsTable,
  m3uPlaylists: m3uPlaylistsTable
};