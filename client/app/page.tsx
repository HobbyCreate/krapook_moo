import { Header } from "@/component/header";
import { Herosection } from '@/component/landing/hero_section/herosection'
import { Toolsection } from '@/component/landing/tool_section/toolsection'

export default function Home() {
  return (
    <>
      <Header />
      <Herosection />
      <Toolsection />
    </>
  );
}
