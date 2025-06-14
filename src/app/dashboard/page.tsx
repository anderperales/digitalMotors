import RevealBento from "@/components/RevealBento";


function Dashboard() {
  return (
    <div className="h-screen  md:flex md:flex-col md:h-screen items-center justify-center p-6 mx-auto bg-cover bg-center"
    style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(255, 0, 0, 0.3)), url('/bg.png')`,
      }}>
      <div className="w-full rounded-lg  md:mt-0 sm:max-w-5xl xl:p-0">
        <RevealBento></RevealBento>
      </div>
    </div>
  );

}

export default Dashboard;
