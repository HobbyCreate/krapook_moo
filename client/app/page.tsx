import { Header } from "./../component/header";

export default function Home() {
  return (
    <>
    {/* <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans"> */}
      <Header />
      <div className="banner h-screen w-full min-h-full bg-red-400"></div>
      <div className="detail h-screen w-full min-h-full bg-amber-700"></div>
      <div className="showcase h-screen w-full min-h-full"></div>
      <div className=" h-screen w-full min-h-full bg-black"></div>
    {/* </div> */}
    </>
  );
}
