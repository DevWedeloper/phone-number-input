import { z } from 'astro/zod'

const CommentSchema = z.object({
  summary: z.array(
    z.object({
      kind: z.literal('text'),
      text: z.string(),
    }),
  ),
})

const TypeNodeSchema: z.ZodType<any> = z.lazy(() =>
  z.union([
    z.object({
      type: z.literal('intrinsic'),
      name: z.string(),
    }),

    z.object({
      type: z.literal('reference'),
      name: z.string(),
      package: z.string().optional(),
    }),

    z.object({
      type: z.literal('literal'),
      value: z.union([z.string(), z.number(), z.boolean()]),
    }),

    z.object({
      type: z.literal('union'),
      types: z.array(TypeNodeSchema),
    }),

    z.object({
      type: z.literal('reflection'),
      declaration: z.object({
        children: z.array(
          z.object({
            name: z.string(),
            flags: z
              .object({
                isOptional: z.boolean().optional(),
              })
              .optional(),
            type: TypeNodeSchema,
          }),
        ),
      }),
    }),
  ]),
)

const UnionTypeSchema = z.object({
  type: z.literal('union'),
  types: z.array(TypeNodeSchema),
})

const ExportedTypeAliasSchema = z.object({
  name: z.string(),

  kind: z.literal(2097152),

  comment: CommentSchema.optional(),

  type: UnionTypeSchema,
})

const RootSchema = z.object({
  name: z.string(),
  children: z.array(ExportedTypeAliasSchema),
})

export { RootSchema }

type Root = z.infer<typeof RootSchema>

export type { Root }
