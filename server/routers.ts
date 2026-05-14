import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure, adminProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import bcrypt from "bcryptjs";
import { sdk } from "./_core/sdk";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Podcasts router
  podcasts: router({
    list: publicProcedure.query(() => db.getPodcasts()),
    getById: publicProcedure.input(z.number()).query(({ input }) => db.getPodcastById(input)),
    create: adminProcedure
      .input(
        z.object({
          title: z.string().min(1),
          description: z.string().optional(),
          mediaUrl: z.string().url(),
          mediaType: z.enum(["audio", "video"]),
          thumbnailUrl: z.string().url().optional(),
        })
      )
      .mutation(({ input, ctx }) =>
        db.createPodcast({
          ...input,
          createdBy: 0,
        })
      ),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().min(1).optional(),
          description: z.string().optional(),
          mediaUrl: z.string().url().optional(),
          mediaType: z.enum(["audio", "video"]).optional(),
          thumbnailUrl: z.string().url().optional(),
        })
      )
      .mutation(({ input, ctx }) => {
        const { id, ...data } = input;
        return db.updatePodcast(id, data);
      }),
    delete: publicProcedure
      .input(z.number())
      .mutation(({ input }) => db.deletePodcast(input)),
  }),

  // Album Posts router
  albumPosts: router({
    list: publicProcedure.query(() => db.getAlbumPosts()),
    getById: publicProcedure.input(z.number()).query(({ input }) => db.getAlbumPostById(input)),
    create: adminProcedure
      .input(
        z.object({
          title: z.string().min(1),
          description: z.string().optional(),
          imageUrls: z.array(z.string()),
        })
      )
      .mutation(({ input, ctx }) =>
        db.createAlbumPost({
          ...input,
          createdBy: 0,
        })
      ),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().min(1).optional(),
          description: z.string().optional(),
          imageUrls: z.array(z.string()).optional(),
        })
      )
      .mutation(({ input, ctx }) => {
        const { id, ...data } = input;
        return db.updateAlbumPost(id, data);
      }),
    delete: adminProcedure
      .input(z.number())
      .mutation(({ input }) => db.deleteAlbumPost(input)),
  }),

  // Team Members router
  teamMembers: router({
    list: publicProcedure.query(() => db.getTeamMembers()),
    getById: publicProcedure.input(z.number()).query(({ input }) => db.getTeamMemberById(input)),
    create: adminProcedure
      .input(
        z.object({
          name: z.string().min(1),
          role: z.string().min(1),
          description: z.string().optional(),
          photoUrl: z.string().url(),
        })
      )
      .mutation(({ input, ctx }) =>
        db.createTeamMember({
          ...input,
          createdBy: 0,
        })
      ),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().min(1).optional(),
          role: z.string().min(1).optional(),
          description: z.string().optional(),
          photoUrl: z.string().url().optional(),
        })
      )
      .mutation(({ input, ctx }) => {
        const { id, ...data } = input;
        return db.updateTeamMember(id, data);
      }),
    delete: adminProcedure
      .input(z.number())
      .mutation(({ input }) => db.deleteTeamMember(input)),
  }),


// Documents router
  documents: router({
    list: publicProcedure.query(() => db.getDocuments()),

    getById: publicProcedure
      .input(z.number())
      .query(({ input }) => db.getDocumentById(input)),

    create: adminProcedure
      .input(
        z.object({
          title: z.string().min(1),
          description: z.string().optional(),
          documentUrl: z.string().url(),
        })
      )
      .mutation(({ input }) =>
        db.createDocument({
          ...input,
          createdBy: 0,
        })
      ),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().min(1).optional(),
          description: z.string().optional(),
          documentUrl: z.string().url().optional(),
        })
      )
      .mutation(({ input }) => {
        const { id, ...data } = input;

        return db.updateDocument(id, data);
      }),

    delete: adminProcedure
      .input(z.number())
      .mutation(({ input }) => db.deleteDocument(input)),
  }),
});

export type AppRouter = typeof appRouter;
