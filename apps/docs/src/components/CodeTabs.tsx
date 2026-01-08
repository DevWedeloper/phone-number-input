import type { FC, ReactNode } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface CodeTabsProps {
  example?: ReactNode
  code?: ReactNode
  defaultTab?: 'example' | 'code'
}

const CodeTabs: FC<CodeTabsProps> = ({ example, code, defaultTab = 'example' }) => {
  return (
    <Tabs defaultValue={defaultTab} className="">
      <TabsList>
        <TabsTrigger value="example">Example</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>

      <TabsContent value="example" className="border-border flex min-h-[350px] items-center justify-center rounded-md border">{example}</TabsContent>
      <TabsContent value="code" className="border-border flex items-center justify-center rounded-md border">{code}</TabsContent>
    </Tabs>
  )
}

export default CodeTabs
