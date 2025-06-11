import Page2 from "./Page2";

const Homepage = () => {
  return (
    <div className="w-screen h-screen select-none  dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <div className="flex flex-col justify-center items-center min-h-[80%] w-screen px-4 text-center">
        <h1 className="text-[3rem] md:text-[4.5rem] font-bold leading-tight tracking-tighter flex flex-wrap items-center justify-center gap-3">
          Choose Your
          <div className="w-24 h-24 overflow-hidden flex items-center justify-center rounded-full border-4 border-green-700 dark:border-pink-500">
            <video
              src="/assets/mainPage.mp4"
              loop
              autoPlay
              muted
              className="w-full h-full object-cover"
            ></video>
          </div>
          Preferred Service
        </h1>

        <p className="text-lg mt-4 max-w-xl text-gray-600 dark:text-gray-300">
          From cleaning to grooming, plumbing to pampering <br />
          book expert services with ease.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <button className="bg-green-700 text-white dark:bg-pink-600 dark:text-black px-6 py-3 rounded-xl text-sm hover:brightness-90 transition">
            Explore Services
          </button>
          <button className=" border  dark:bg-gray-100 dark:text-black dark:border-gray-700 px-6 py-3 rounded-xl text-sm hover:bg-gray-200  hover:text-black transition">
            Book Now
          </button>
        </div>
      </div>
      <Page2 />
    </div>
  );
};

export default Homepage;
