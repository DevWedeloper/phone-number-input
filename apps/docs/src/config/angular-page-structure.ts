import type { Root } from '@/schemas/compodoc-zod'
import { toKebabCase } from '@/utils/string'

/* ------------------------------
   Item types (discriminated union)
--------------------------------- */
export type AngularItem
  = | {
    kind: 'component'
    name: string
    selector: string
    description?: string
  }
  | {
    kind: 'directive'
    name: string
    selector: string
    description?: string
    inputs: { name: string, type: string, defaultValue?: string, description?: string }[]
  }
  | {
    kind: 'service'
    name: string
    description?: string
    properties: { name: string, type: string, defaultValue?: string, description?: string }[]
    methods?: { name: string, description?: string }[]
  }

/* ------------------------------
   Section type
--------------------------------- */
export interface Section {
  key: string
  label: string
  items: AngularItem[]
}

/* ------------------------------
   Generic rendered item
--------------------------------- */
export interface GenericItem {
  id: string
  name: string
  selector?: string
  description?: string
  table?: {
    title: string
    columns: { label: string, key: string, class?: string }[]
    rows: Record<string, any>[]
  } | null
  methods?: any[] | null
}

/* ------------------------------
   Build page structure
--------------------------------- */
export function getAngularPageStructure(parsedData: Root): Section[] {
  return [
    {
      key: 'components',
      label: 'Components',
      items: parsedData.components.map(c => ({
        kind: 'component',
        ...c,
      })),
    },
    {
      key: 'directives',
      label: 'Directives',
      items: parsedData.directives.map(d => ({
        kind: 'directive',
        ...d,
        inputs: d.inputsClass.map(i => ({
          name: i.name,
          type: i.type,
          defaultValue: i.defaultValue,
          description: i.description,
        })),
      })),
    },
    {
      key: 'services',
      label: 'Services',
      items: parsedData.injectables.map(s => ({
        kind: 'service',
        ...s,
      })),
    },
  ]
}

/* ------------------------------
   Render a single item
--------------------------------- */
export function renderItem(item: AngularItem): GenericItem {
  switch (item.kind) {
    case 'component':
      return {
        id: toKebabCase(item.name),
        name: item.name,
        selector: item.selector,
        description: item.description,
        table: null,
        methods: null,
      }
    case 'directive':
      return {
        id: toKebabCase(item.name),
        name: item.name,
        selector: item.selector,
        description: item.description,
        table: {
          title: 'Inputs',
          columns: [
            { label: 'Prop', key: 'name', class: 'font-medium' },
            { label: 'Type', key: 'type' },
            { label: 'Default', key: 'defaultValue' },
            { label: 'Description', key: 'description' },
          ],
          rows: item.inputs.map(i => ({
            name: i.name,
            type: i.type,
            defaultValue: i.defaultValue ?? '-',
            description: i.description ?? '-',
          })),
        },
        methods: null,
      }
    case 'service':
      return {
        id: toKebabCase(item.name),
        name: item.name,
        description: item.description,
        table: {
          title: 'Properties',
          columns: [
            { label: 'Prop', key: 'name', class: 'font-medium' },
            { label: 'Type', key: 'type' },
            { label: 'Default', key: 'defaultValue' },
            { label: 'Description', key: 'description' },
          ],
          rows: item.properties.map(p => ({
            name: p.name,
            type: p.type,
            defaultValue: p.defaultValue ?? '-',
            description: p.description ?? '-',
          })),
        },
        methods: item.methods ?? null,
      }
  }
}

export type AngularPageStructure = ReturnType<typeof getAngularPageStructure>
