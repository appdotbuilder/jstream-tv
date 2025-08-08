import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { 
  createChannelInputSchema,
  updateChannelInputSchema,
  getChannelsInputSchema,
  createEpgProgramInputSchema,
  getEpgInputSchema
} from './schema';
import { createChannel } from './handlers/create_channel';
import { getChannels } from './handlers/get_channels';
import { getChannelById } from './handlers/get_channel_by_id';
import { updateChannel } from './handlers/update_channel';
import { deleteChannel } from './handlers/delete_channel';
import { parseM3uPlaylist } from './handlers/parse_m3u_playlist';
import { syncM3uChannels } from './handlers/sync_m3u_channels';
import { createEpgProgram } from './handlers/create_epg_program';
import { getEpgPrograms } from './handlers/get_epg_programs';
import { getCurrentProgram } from './handlers/get_current_program';
import { getNextProgram } from './handlers/get_next_program';
import { getChannelsWithEpg } from './handlers/get_channels_with_epg';
import { z } from 'zod';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check endpoint
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Channel management endpoints
  createChannel: publicProcedure
    .input(createChannelInputSchema)
    .mutation(({ input }) => createChannel(input)),

  getChannels: publicProcedure
    .input(getChannelsInputSchema.optional())
    .query(({ input }) => getChannels(input)),

  getChannelById: publicProcedure
    .input(z.number())
    .query(({ input }) => getChannelById(input)),

  updateChannel: publicProcedure
    .input(updateChannelInputSchema)
    .mutation(({ input }) => updateChannel(input)),

  deleteChannel: publicProcedure
    .input(z.number())
    .mutation(({ input }) => deleteChannel(input)),

  // M3U playlist management
  parseM3uPlaylist: publicProcedure
    .input(z.string().url())
    .query(({ input }) => parseM3uPlaylist(input)),

  syncM3uChannels: publicProcedure
    .input(z.string().url())
    .mutation(({ input }) => syncM3uChannels(input)),

  // EPG (Electronic Program Guide) endpoints
  createEpgProgram: publicProcedure
    .input(createEpgProgramInputSchema)
    .mutation(({ input }) => createEpgProgram(input)),

  getEpgPrograms: publicProcedure
    .input(getEpgInputSchema.optional())
    .query(({ input }) => getEpgPrograms(input)),

  getCurrentProgram: publicProcedure
    .input(z.number())
    .query(({ input }) => getCurrentProgram(input)),

  getNextProgram: publicProcedure
    .input(z.number())
    .query(({ input }) => getNextProgram(input)),

  // Combined endpoints for UI
  getChannelsWithEpg: publicProcedure
    .input(getChannelsInputSchema.optional())
    .query(({ input }) => getChannelsWithEpg(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`JStream TRPC server listening at port: ${port}`);
}

start();