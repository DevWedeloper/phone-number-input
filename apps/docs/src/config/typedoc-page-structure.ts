import type { Root, TypeNode } from '@/schemas/typedoc-zod'
import { toKebabCase } from '@/utils/string'

/* ------------------------------
   TypeDoc item types (discriminated union)
--------------------------------- */
export type TypedocItem
  = | {
    kind: 'interface'
    name: string
    comment?: string
    properties: { name: string, type: string, optional: boolean, description?: string }[]
  }
  | {
    kind: 'type-alias'
    name: string
    comment?: string
    type: string
  }
  | {
    kind: 'class'
    name: string
    comment?: string
    properties: { name: string, type: string, optional: boolean, description?: string }[]
    methods: { name: string, description?: string }[]
  }
  | {
    kind: 'function'
    name: string
    comment?: string
    signature: string
  }

/* ------------------------------
   Section type
--------------------------------- */
export interface Section {
  key: string
  label: string
  items: TypedocItem[]
}

/* ------------------------------
   Generic rendered item
--------------------------------- */
export interface GenericItem {
  id: string
  name: string
  description?: string
  table?: {
    title: string
    columns: { label: string, key: string, class?: string }[]
    rows: Record<string, any>[]
  } | null
  methods?: { name: string, description?: string }[] | null
  code?: string
}

/* ------------------------------
   Build page structure
--------------------------------- */
export function getTypedocPageStructure(root: Root): Section[] {
  const typeAliases: TypedocItem[] = []

  for (const child of root.children) {
    switch (child.kind) {
      case 2097152: // type alias
        typeAliases.push({
          kind: 'type-alias',
          name: child.name,
          comment: child.comment?.summary.map(s => s.text).join(' ') ?? undefined,
          type: formatUnionType(child.type),
        })
        break
      // Future expansion: handle interfaces, classes, functions
    }
  }

  return [
    {
      key: 'type-aliases',
      label: 'Type Aliases',
      items: typeAliases,
    },
  ]
}

/* ------------------------------
   Render a single item
--------------------------------- */
export function renderItem(item: TypedocItem): GenericItem {
  switch (item.kind) {
    case 'interface':
      return {
        id: toKebabCase(item.name),
        name: item.name,
        description: item.comment,
        table: {
          title: 'Properties',
          columns: [
            { label: 'Prop', key: 'name', class: 'font-medium' },
            { label: 'Type', key: 'type' },
            { label: 'Optional', key: 'optional' },
            { label: 'Description', key: 'description' },
          ],
          rows: item.properties.map(p => ({
            name: p.name,
            type: p.type,
            optional: p.optional,
            description: p.description ?? '-',
          })),
        },
        methods: null,
      }
    case 'type-alias':
      return {
        id: toKebabCase(item.name),
        name: item.name,
        description: item.comment,
        table: null,
        methods: null,
        code: `type ${item.name} = ${item.type}`,
      }
    case 'class':
      return {
        id: toKebabCase(item.name),
        name: item.name,
        description: item.comment,
        table: {
          title: 'Properties',
          columns: [
            { label: 'Prop', key: 'name', class: 'font-medium' },
            { label: 'Type', key: 'type' },
            { label: 'Optional', key: 'optional' },
            { label: 'Description', key: 'description' },
          ],
          rows: item.properties.map(p => ({
            name: p.name,
            type: p.type,
            optional: p.optional,
            description: p.description ?? '-',
          })),
        },
        methods: item.methods ?? null,
      }
    case 'function':
      return {
        id: toKebabCase(item.name),
        name: item.name,
        description: item.comment,
        table: null,
        methods: null,
      }
  }
}

/* ------------------------------
   Helpers
--------------------------------- */
function formatUnionType(node: TypeNode): string {
  switch (node.type) {
    case 'intrinsic':
      return node.name

    case 'reference':
      return node.name

    case 'literal':
      return JSON.stringify(node.value)

    case 'union':
      return node.types.map(formatUnionType).join(' | ')

    case 'reflection':
      return `{ ${node.declaration.children
        .map(
          (child: { name: string, flags?: { isOptional?: boolean }, type: TypeNode }) => {
            const optional = child.flags?.isOptional ? '?' : ''
            return `${child.name}${optional}: ${formatUnionType(child.type)}`
          },
        )
        .join('; ')} }`

    default:
      return 'unknown'
  }
}

export type TypedocPageStructure = ReturnType<typeof getTypedocPageStructure>
