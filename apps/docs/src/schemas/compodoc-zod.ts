import { z } from 'astro/zod'

const PropertySchema = z.object({
  name: z.string(),
  defaultValue: z.string().optional(),
  type: z.string(),
  indexKey: z.string().optional(),
  optional: z.boolean(),
  description: z.string().optional(),
})

const MethodArgSchema = z.object({
  name: z.string(),
  type: z.string(),
})

const JsDocTagSchema = z.object({
  name: z.object({
    pos: z.number(),
    end: z.number(),
    kind: z.number(),
    id: z.number(),
    flags: z.number(),
    transformFlags: z.number(),
    escapedText: z.string(),
  }),
  type: z.string(),
  deprecated: z.boolean().optional(),
  deprecationMessage: z.string().optional(),
  tagName: z
    .object({
      pos: z.number(),
      end: z.number(),
      kind: z.number(),
      id: z.number(),
      flags: z.number(),
      transformFlags: z.number(),
      escapedText: z.string(),
    })
    .optional(),
  comment: z.string().optional(),
})

const MethodSchema = z.object({
  name: z.string(),
  args: z.array(MethodArgSchema),
  optional: z.boolean(),
  returnType: z.string(),
  jsdoctags: z.array(JsDocTagSchema).optional(),
})

const InputClassSchema = z.object({
  name: z.string(),
  type: z.string(),
  optional: z.boolean(),
  description: z.string().optional(),
  required: z.boolean().optional(),
  defaultValue: z.string().optional(),
})

const InjectableSchema = z.object({
  name: z.string(),
  properties: z.array(PropertySchema),
  methods: z.array(MethodSchema),
  description: z.string(),
  rawdescription: z.string(),
})

const DirectiveSchema = z.object({
  name: z.string(),
  description: z.string(),
  rawdescription: z.string(),
  selector: z.string(),
  inputsClass: z.array(InputClassSchema),
})

const ComponentSchema = z.object({
  name: z.string(),
  selector: z.string(),
  description: z.string(),
  rawdescription: z.string(),
})

const RootSchema = z.object({
  injectables: z.array(InjectableSchema),
  directives: z.array(DirectiveSchema),
  components: z.array(ComponentSchema),
})

export { ComponentSchema, DirectiveSchema, InjectableSchema, RootSchema }

type Method = z.infer<typeof MethodSchema>
type Injectable = z.infer<typeof InjectableSchema>
type Directive = z.infer<typeof DirectiveSchema>
type Component = z.infer<typeof ComponentSchema>
type Root = z.infer<typeof RootSchema>

export type { Component, Directive, Injectable, Method, Root }
